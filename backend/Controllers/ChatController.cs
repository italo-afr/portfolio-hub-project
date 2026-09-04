using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

/// <summary>
/// Histórico do chat. O tempo real passa pelo ChatHub; aqui fica só a leitura,
/// usada quando a tela abre antes de a conexão SignalR subir.
/// </summary>
[ApiController]
[Route("api/chat")]
[Produces("application/json")]
[Tags("Chat")]
public class ChatController(PortfolioDbContext db) : ControllerBase
{
    /// <summary>Últimas 50 mensagens, em ordem cronológica.</summary>
    /// <param name="room">Sala a consultar. Omitida, traz a sala padrão.</param>
    [HttpGet("messages")]
    [ProducesResponseType<IEnumerable<ChatMessageDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetMessages(
        [FromQuery] string room = ChatRooms.Default)
    {
        if (!ChatRooms.IsValid(room))
        {
            return BadRequest(new
            {
                message = $"Sala inválida. Use uma destas: {string.Join(", ", ChatRooms.All)}.",
            });
        }

        // Pega as mais recentes pelo índice e só então reordena para exibição.
        var recent = await db.ChatMessages
            .AsNoTracking()
            .Where(m => m.Room == room)
            .OrderByDescending(m => m.Id)
            .Take(ChatLimits.HistorySize)
            .ToListAsync();

        recent.Reverse();

        return Ok(recent.Select(m => m.ToDto()));
    }

    /// <summary>Salas disponíveis, para o frontend montar o seletor.</summary>
    [HttpGet("rooms")]
    [ProducesResponseType<IEnumerable<string>>(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<string>> GetRooms() => Ok(ChatRooms.All);
}
