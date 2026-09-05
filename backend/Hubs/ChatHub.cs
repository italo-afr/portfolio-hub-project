using System.Collections.Concurrent;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Backend.Hubs;

/// <summary>
/// Hub do mini-app ChatRoom.
///
/// O chat é uma demo pública sem autenticação, então cada visitante recebe as
/// suas próprias salas: a chave real é "sala:sessão". Duas abas do mesmo
/// navegador compartilham a sessão e conversam entre si — que é o que a demo
/// precisa mostrar —, mas ninguém deixa mensagem para o próximo visitante do
/// portfólio. Continua sendo grupo de SignalR de verdade; só o namespace muda.
/// </summary>
public class ChatHub(PortfolioDbContext db, ILogger<ChatHub> logger) : Hub
{
    /// <summary>Horários dos últimos envios por conexão, para o rate limit.</summary>
    private static readonly ConcurrentDictionary<string, Queue<DateTime>> SendHistory = new();

    /// <summary>Momento da última faxina, compartilhado entre conexões.</summary>
    private static DateTime _lastCleanup = DateTime.MinValue;

    private static readonly SemaphoreSlim CleanupLock = new(1, 1);

    private string? CurrentRoomKey
    {
        get => Context.Items.TryGetValue("roomKey", out var v) ? v as string : null;
        set => Context.Items["roomKey"] = value;
    }

    private string CurrentUser =>
        Context.Items.TryGetValue("user", out var v) ? v as string ?? "anônimo" : "anônimo";

    /// <summary>
    /// Entra numa sala e devolve o histórico recente daquela sessão.
    /// </summary>
    /// <param name="room">Uma das salas fixas: geral, dotnet, frontend, devops.</param>
    /// <param name="user">Nome exibido.</param>
    /// <param name="session">Identificador da sessão, gerado no cliente.</param>
    public async Task<IEnumerable<ChatMessageDto>> JoinRoom(string room, string user, string session)
    {
        if (!ChatRooms.IsValid(room))
        {
            throw new HubException($"Sala inválida. Use uma destas: {string.Join(", ", ChatRooms.All)}.");
        }

        if (!ChatRooms.IsValidSession(session))
        {
            throw new HubException("Sessão inválida.");
        }

        var name = Sanitize(user, ChatLimits.MaxUserLength);
        if (string.IsNullOrEmpty(name))
        {
            throw new HubException("Informe um nome para entrar na sala.");
        }

        var roomKey = ChatRooms.Key(room, session);

        // Sair do grupo anterior é obrigatório: sem isso a conexão acumula
        // grupos e segue recebendo mensagens de salas que já deixou.
        var previous = CurrentRoomKey;
        if (previous is not null && previous != roomKey)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, previous);
            await Clients.Group(previous).SendAsync("UserLeft", CurrentUser, PublicRoom(previous));
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomKey);
        CurrentRoomKey = roomKey;
        Context.Items["user"] = name;

        await Clients.OthersInGroup(roomKey).SendAsync("UserJoined", name, room);

        await CleanupExpiredAsync();
        await SeedWelcomeAsync(roomKey, room);

        logger.LogInformation("{User} entrou em {Room}", name, room);

        return await RecentMessagesAsync(roomKey);
    }

    /// <summary>Publica uma mensagem na sala atual da conexão.</summary>
    public async Task SendMessage(string text)
    {
        var roomKey = CurrentRoomKey
            ?? throw new HubException("Entre em uma sala antes de enviar mensagens.");

        EnforceRateLimit();

        var body = Sanitize(text, ChatLimits.MaxTextLength);
        if (string.IsNullOrEmpty(body))
        {
            throw new HubException("A mensagem não pode ser vazia.");
        }

        var message = new ChatMessage
        {
            Room = roomKey,
            User = CurrentUser,
            Text = body,
        };

        db.ChatMessages.Add(message);
        await db.SaveChangesAsync();

        // Vai para todos da sala, inclusive quem enviou — assim o remetente
        // renderiza a mensagem com o Id e o horário que vieram do servidor.
        await Clients.Group(roomKey).SendAsync("ReceiveMessage", message.ToDto());
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var roomKey = CurrentRoomKey;
        if (roomKey is not null)
        {
            await Clients.OthersInGroup(roomKey).SendAsync("UserLeft", CurrentUser, PublicRoom(roomKey));
        }

        SendHistory.TryRemove(Context.ConnectionId, out _);

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Janela deslizante por conexão. Sem isto dá para escrever num laço e
    /// encher o banco em segundos.
    /// </summary>
    private void EnforceRateLimit()
    {
        var now = DateTime.UtcNow;
        var history = SendHistory.GetOrAdd(Context.ConnectionId, _ => new Queue<DateTime>());

        lock (history)
        {
            while (history.Count > 0 && now - history.Peek() > ChatLimits.RateWindow)
            {
                history.Dequeue();
            }

            if (history.Count >= ChatLimits.MaxMessagesPerWindow)
            {
                var espera = (int)Math.Ceiling(
                    (ChatLimits.RateWindow - (now - history.Peek())).TotalSeconds);

                throw new HubException(
                    $"Muitas mensagens seguidas. Aguarde {espera}s antes de enviar de novo.");
            }

            history.Enqueue(now);
        }
    }

    /// <summary>
    /// Apaga mensagens antigas. Roda no join, no máximo uma vez a cada
    /// CleanupInterval — no plano gratuito do Render a aplicação hiberna, então
    /// um timer de fundo não seria confiável.
    /// </summary>
    private async Task CleanupExpiredAsync()
    {
        if (DateTime.UtcNow - _lastCleanup < ChatLimits.CleanupInterval)
        {
            return;
        }

        if (!await CleanupLock.WaitAsync(0))
        {
            return;
        }

        try
        {
            if (DateTime.UtcNow - _lastCleanup < ChatLimits.CleanupInterval)
            {
                return;
            }

            var limite = DateTime.UtcNow - ChatLimits.Retention;
            var removidas = await db.ChatMessages
                .Where(m => m.SentAt < limite)
                .ExecuteDeleteAsync();

            _lastCleanup = DateTime.UtcNow;

            if (removidas > 0)
            {
                logger.LogInformation("Faxina do chat: {Removidas} mensagens expiradas", removidas);
            }
        }
        finally
        {
            CleanupLock.Release();
        }
    }

    /// <summary>
    /// Primeira visita à sala "geral" da sessão recebe as mensagens de
    /// boas-vindas, para o chat nunca abrir vazio e já demonstrar o histórico.
    /// </summary>
    private async Task SeedWelcomeAsync(string roomKey, string room)
    {
        if (room != ChatRooms.Default)
        {
            return;
        }

        if (await db.ChatMessages.AnyAsync(m => m.Room == roomKey))
        {
            return;
        }

        var agora = DateTime.UtcNow;

        db.ChatMessages.AddRange(
            new ChatMessage
            {
                Room = roomKey,
                User = "Ítalo",
                Text = "Bem-vindo! Este chat roda em SignalR sobre WebSocket — abra em duas abas para ver as mensagens chegarem em tempo real.",
                SentAt = agora.AddSeconds(-2),
            },
            new ChatMessage
            {
                Room = roomKey,
                User = "Ítalo",
                Text = "Suas salas são privadas: só você e suas outras abas veem o que for escrito aqui. As mensagens expiram em 24h.",
                SentAt = agora.AddSeconds(-1),
            });

        await db.SaveChangesAsync();
    }

    private async Task<IEnumerable<ChatMessageDto>> RecentMessagesAsync(string roomKey)
    {
        // Pega as N mais recentes e devolve em ordem cronológica para a tela.
        var recent = await db.ChatMessages
            .AsNoTracking()
            .Where(m => m.Room == roomKey)
            .OrderByDescending(m => m.Id)
            .Take(ChatLimits.HistorySize)
            .ToListAsync();

        recent.Reverse();
        return recent.Select(m => m.ToDto());
    }

    private static string PublicRoom(string roomKey)
    {
        var separator = roomKey.IndexOf(':');
        return separator < 0 ? roomKey : roomKey[..separator];
    }

    /// <summary>Apara espaços e corta no limite. O React já escapa o texto na renderização.</summary>
    private static string Sanitize(string? value, int maxLength)
    {
        var trimmed = value?.Trim() ?? string.Empty;
        return trimmed.Length <= maxLength ? trimmed : trimmed[..maxLength];
    }
}
