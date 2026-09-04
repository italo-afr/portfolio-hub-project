using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public record TodoDto(
    int Id,
    string Title,
    string? Notes,
    bool IsDone,
    TodoPriority Priority,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? CompletedAt);

public class CreateTodoRequest
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "O título deve ter entre 1 e 200 caracteres.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "As notas devem ter no máximo 1000 caracteres.")]
    public string? Notes { get; set; }

    [EnumDataType(typeof(TodoPriority), ErrorMessage = "Prioridade inválida.")]
    public TodoPriority Priority { get; set; } = TodoPriority.Normal;
}

public class UpdateTodoRequest
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "O título deve ter entre 1 e 200 caracteres.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "As notas devem ter no máximo 1000 caracteres.")]
    public string? Notes { get; set; }

    [EnumDataType(typeof(TodoPriority), ErrorMessage = "Prioridade inválida.")]
    public TodoPriority Priority { get; set; } = TodoPriority.Normal;

    public bool IsDone { get; set; }
}

public static class TodoMapping
{
    public static TodoDto ToDto(this TodoItem todo) =>
        new(
            todo.Id,
            todo.Title,
            todo.Notes,
            todo.IsDone,
            todo.Priority,
            todo.CreatedAt,
            todo.UpdatedAt,
            todo.CompletedAt);
}
