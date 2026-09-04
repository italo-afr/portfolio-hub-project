using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

/// <summary>
/// CRUD das tarefas do mini-app Todo List embutido no portfólio.
/// </summary>
[ApiController]
[Route("api/todos")]
[Produces("application/json")]
[Tags("Todos")]
public class TodoController(PortfolioDbContext db) : ControllerBase
{
    /// <summary>Lista as tarefas, opcionalmente filtrando por status.</summary>
    /// <param name="status">all (padrão), pending ou done.</param>
    [HttpGet]
    [ProducesResponseType<IEnumerable<TodoDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<TodoDto>>> GetAll([FromQuery] string status = "all")
    {
        var query = db.Todos.AsNoTracking();

        query = status.ToLowerInvariant() switch
        {
            "pending" => query.Where(t => !t.IsDone),
            "done" => query.Where(t => t.IsDone),
            _ => query,
        };

        var todos = await query
            .OrderBy(t => t.IsDone)
            .ThenByDescending(t => t.Priority)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(todos.Select(t => t.ToDto()));
    }

    /// <summary>Retorna uma tarefa pelo id.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType<TodoDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoDto>> GetById(int id)
    {
        var todo = await db.Todos.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);

        return todo is null ? NotFoundTodo(id) : Ok(todo.ToDto());
    }

    /// <summary>Cria uma tarefa.</summary>
    [HttpPost]
    [ProducesResponseType<TodoDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoDto>> Create([FromBody] CreateTodoRequest request)
    {
        var todo = new TodoItem
        {
            Title = request.Title.Trim(),
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            Priority = request.Priority,
        };

        db.Todos.Add(todo);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo.ToDto());
    }

    /// <summary>Atualiza todos os campos editáveis de uma tarefa.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType<TodoDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoDto>> Update(int id, [FromBody] UpdateTodoRequest request)
    {
        var todo = await db.Todos.FirstOrDefaultAsync(t => t.Id == id);
        if (todo is null)
        {
            return NotFoundTodo(id);
        }

        todo.Title = request.Title.Trim();
        todo.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();
        todo.Priority = request.Priority;
        SetDone(todo, request.IsDone);
        todo.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Ok(todo.ToDto());
    }

    /// <summary>Alterna entre concluída e pendente.</summary>
    [HttpPatch("{id:int}/toggle")]
    [ProducesResponseType<TodoDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoDto>> Toggle(int id)
    {
        var todo = await db.Todos.FirstOrDefaultAsync(t => t.Id == id);
        if (todo is null)
        {
            return NotFoundTodo(id);
        }

        SetDone(todo, !todo.IsDone);
        todo.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Ok(todo.ToDto());
    }

    /// <summary>Exclui uma tarefa.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var todo = await db.Todos.FirstOrDefaultAsync(t => t.Id == id);
        if (todo is null)
        {
            return NotFoundTodo(id);
        }

        db.Todos.Remove(todo);
        await db.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>Remove de uma vez todas as tarefas já concluídas.</summary>
    [HttpDelete("completed")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteCompleted()
    {
        var removed = await db.Todos.Where(t => t.IsDone).ExecuteDeleteAsync();

        return Ok(new { removed });
    }

    /// <summary>Mantém IsDone e CompletedAt sempre coerentes entre si.</summary>
    private static void SetDone(TodoItem todo, bool isDone)
    {
        if (todo.IsDone == isDone)
        {
            return;
        }

        todo.IsDone = isDone;
        todo.CompletedAt = isDone ? DateTime.UtcNow : null;
    }

    private NotFoundObjectResult NotFoundTodo(int id) =>
        NotFound(new { message = $"Tarefa {id} não encontrada." });
}
