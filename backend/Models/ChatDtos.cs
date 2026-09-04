using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public record ChatMessageDto(int Id, string Room, string User, string Text, DateTime SentAt);

/// <summary>Limites compartilhados entre o Hub e o controller.</summary>
public static class ChatLimits
{
    public const int MaxUserLength = 32;
    public const int MaxTextLength = 500;
    public const int HistorySize = 50;
}

public static class ChatMapping
{
    public static ChatMessageDto ToDto(this ChatMessage m) =>
        new(m.Id, m.Room, m.User, m.Text, m.SentAt);
}
