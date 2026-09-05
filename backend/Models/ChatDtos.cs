using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public record ChatMessageDto(int Id, string Room, string User, string Text, DateTime SentAt);

/// <summary>Limites compartilhados entre o Hub e o controller.</summary>
public static class ChatLimits
{
    public const int MaxUserLength = 32;
    public const int MaxTextLength = 500;
    public const int HistorySize = 50;

    /// <summary>Teto de mensagens por conexão dentro de <see cref="RateWindow"/>.</summary>
    public const int MaxMessagesPerWindow = 10;

    public static readonly TimeSpan RateWindow = TimeSpan.FromSeconds(30);

    /// <summary>
    /// Idade máxima de uma mensagem. É uma demo pública sem autenticação:
    /// nada que um desconhecido escreva deve viver para sempre no banco.
    /// </summary>
    public static readonly TimeSpan Retention = TimeSpan.FromHours(24);

    /// <summary>Intervalo mínimo entre duas faxinas, para não rodar a cada join.</summary>
    public static readonly TimeSpan CleanupInterval = TimeSpan.FromMinutes(10);
}

public static class ChatMapping
{
    /// <summary>
    /// Devolve a sala sem o sufixo de sessão: o cliente exibe "#geral", não
    /// "geral:a1b2c3...".
    /// </summary>
    public static ChatMessageDto ToDto(this ChatMessage m)
    {
        var separator = m.Room.IndexOf(':');
        var publicRoom = separator < 0 ? m.Room : m.Room[..separator];

        return new ChatMessageDto(m.Id, publicRoom, m.User, m.Text, m.SentAt);
    }
}
