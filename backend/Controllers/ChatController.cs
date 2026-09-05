using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

/// <summary>
/// Histórico do chat. O tempo real passa pelo ChatHub; aqui fica só a leitura.
/// </summary>
[ApiController]
[Route("api/chat")]
[Produces("application/json")]
[Tags("Chat")]
public class ChatController(PortfolioDbContext db) : ControllerBase
{
    /// <summary>
    /// Últimas 50 mensagens da sala, em ordem cronológica.
    ///
    /// As salas são isoladas por sessão, então é preciso informar a mesma
    /// sessão usada no hub — do contrário não há o que devolver.
    /// </summary>
    /// <param name="session">Identificador da sessão, gerado no cliente.</param>
    /// <param name="room">Sala a consultar. Omitida, traz a sala padrão.</param>
    [HttpGet("messages")]
    [ProducesResponseType<IEnumerable<ChatMessageDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetMessages(
        [FromQuery] string session,
        [FromQuery] string room = ChatRooms.Default)
    {
        if (!ChatRooms.IsValid(room))
        {
            return BadRequest(new
            {
                message = $"Sala inválida. Use uma destas: {string.Join(", ", ChatRooms.All)}.",
            });
        }

        if (!ChatRooms.IsValidSession(session))
        {
            return BadRequest(new { message = "Informe uma sessão válida." });
        }

        var roomKey = ChatRooms.Key(room, session);

        // Pega as mais recentes pelo índice e só então reordena para exibição.
        var recent = await db.ChatMessages
            .AsNoTracking()
            .Where(m => m.Room == roomKey)
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
