using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Backend.Hubs;

/// <summary>
/// Hub do mini-app ChatRoom. Cada sala é um grupo do SignalR, então uma mensagem
/// só vai para quem está naquela sala.
/// </summary>
public class ChatHub(PortfolioDbContext db, ILogger<ChatHub> logger) : Hub
{
    /// <summary>Nome da sala em que esta conexão está, guardado por conexão.</summary>
    private string? CurrentRoom
    {
        get => Context.Items.TryGetValue("room", out var value) ? value as string : null;
        set => Context.Items["room"] = value;
    }

    private string CurrentUser =>
        Context.Items.TryGetValue("user", out var value) ? value as string ?? "anônimo" : "anônimo";

    /// <summary>
    /// Entra numa sala e devolve o histórico recente. Sair da sala anterior é
    /// responsabilidade daqui — sem isso a conexão acumularia grupos e passaria
    /// a receber mensagens de salas que o usuário já deixou.
    /// </summary>
    public async Task<IEnumerable<ChatMessageDto>> JoinRoom(string room, string user)
    {
        if (!ChatRooms.IsValid(room))
        {
            throw new HubException($"Sala inválida. Use uma destas: {string.Join(", ", ChatRooms.All)}.");
        }

        var name = Sanitize(user, ChatLimits.MaxUserLength);
        if (string.IsNullOrEmpty(name))
        {
            throw new HubException("Informe um nome para entrar na sala.");
        }

        var previous = CurrentRoom;
        if (previous is not null && previous != room)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, previous);
            await Clients.Group(previous).SendAsync("UserLeft", CurrentUser, previous);
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, room);
        CurrentRoom = room;
        Context.Items["user"] = name;

        await Clients.OthersInGroup(room).SendAsync("UserJoined", name, room);

        logger.LogInformation("{User} entrou na sala {Room}", name, room);

        return await RecentMessagesAsync(room);
    }

    /// <summary>Publica uma mensagem na sala atual da conexão.</summary>
    public async Task SendMessage(string text)
    {
        var room = CurrentRoom;
        if (room is null)
        {
            throw new HubException("Entre em uma sala antes de enviar mensagens.");
        }

        var body = Sanitize(text, ChatLimits.MaxTextLength);
        if (string.IsNullOrEmpty(body))
        {
            throw new HubException("A mensagem não pode ser vazia.");
        }

        var message = new ChatMessage
        {
            Room = room,
            User = CurrentUser,
            Text = body,
        };

        db.ChatMessages.Add(message);
        await db.SaveChangesAsync();

        // Vai para todos da sala, inclusive quem enviou — assim o remetente
        // renderiza a mensagem com o Id e o horário que vieram do servidor.
        await Clients.Group(room).SendAsync("ReceiveMessage", message.ToDto());
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var room = CurrentRoom;
        if (room is not null)
        {
            await Clients.OthersInGroup(room).SendAsync("UserLeft", CurrentUser, room);
        }

        await base.OnDisconnectedAsync(exception);
    }

    private async Task<IEnumerable<ChatMessageDto>> RecentMessagesAsync(string room)
    {
        // Pega as N mais recentes e devolve em ordem cronológica para a tela.
        var recent = await db.ChatMessages
            .AsNoTracking()
            .Where(m => m.Room == room)
            .OrderByDescending(m => m.Id)
            .Take(ChatLimits.HistorySize)
            .ToListAsync();

        recent.Reverse();
        return recent.Select(m => m.ToDto());
    }

    /// <summary>Apara espaços e corta no limite. O React já escapa o texto na renderização.</summary>
    private static string Sanitize(string? value, int maxLength)
    {
        var trimmed = value?.Trim() ?? string.Empty;
        return trimmed.Length <= maxLength ? trimmed : trimmed[..maxLength];
    }
}
