using System.Text.RegularExpressions;

namespace Backend.Models;

public class ChatMessage
{
    public int Id { get; set; }

    /// <summary>
    /// Chave interna da sala: "<sala>:<sessão>". Cada visitante conversa apenas
    /// consigo mesmo (outras abas do mesmo navegador), então ninguém deixa
    /// recado para o próximo visitante do portfólio.
    /// </summary>
    public string Room { get; set; } = string.Empty;

    public string User { get; set; } = string.Empty;

    public string Text { get; set; } = string.Empty;

    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}

/// <summary>Salas fixas — é uma demo pública, não um chat aberto a salas arbitrárias.</summary>
public static partial class ChatRooms
{
    public const string Default = "geral";

    public static readonly string[] All = [Default, "dotnet", "frontend", "devops"];

    public static bool IsValid(string? room) =>
        room is not null && All.Contains(room);

    /// <summary>
    /// A sessão vem do cliente (localStorage), então precisa ser validada como
    /// qualquer entrada: sem isso viraria injeção de sala arbitrária.
    /// </summary>
    public static bool IsValidSession(string? session) =>
        session is not null && SessionPattern().IsMatch(session);

    /// <summary>Monta a chave da sala isolada por sessão.</summary>
    public static string Key(string room, string session) => $"{room}:{session}";

    [GeneratedRegex("^[A-Za-z0-9_-]{8,40}$")]
    private static partial Regex SessionPattern();
}
