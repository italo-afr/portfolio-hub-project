namespace Backend.Models;

public class ChatMessage
{
    public int Id { get; set; }

    public string Room { get; set; } = ChatRooms.Default;

    public string User { get; set; } = string.Empty;

    public string Text { get; set; } = string.Empty;

    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Salas fixas — é uma demo pública, não um chat aberto a salas arbitrárias.</summary>
public static class ChatRooms
{
    public const string Default = "geral";

    public static readonly string[] All = [Default, "dotnet", "frontend", "devops"];

    public static bool IsValid(string? room) =>
        room is not null && All.Contains(room);
}
