namespace Backend.Models;

public enum TodoPriority
{
    Low = 0,
    Normal = 1,
    High = 2,
}

public class TodoItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public bool IsDone { get; set; }

    public TodoPriority Priority { get; set; } = TodoPriority.Normal;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Preenchido quando a tarefa é concluída; volta a null se reaberta.</summary>
    public DateTime? CompletedAt { get; set; }
}
