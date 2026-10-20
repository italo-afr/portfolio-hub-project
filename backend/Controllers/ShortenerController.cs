using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

/// <summary>
/// Encurtador de URLs. Espelha o EncurtadorURL (projeto em .NET 8 com Razor),
/// aqui como mini-app embutido no portfólio.
///
/// A lista é isolada por sessão, como as salas do chat: cada visitante vê só o
/// que criou. O redirecionamento, esse sim, é público — é o ponto do serviço.
/// </summary>
[ApiController]
[Route("api/shorten")]
[Produces("application/json")]
[Tags("Encurtador")]
public class ShortenerController(PortfolioDbContext db) : ControllerBase
{
    /// <summary>Links ativos da sessão, do mais recente para o mais antigo.</summary>
    [HttpGet]
    [ProducesResponseType<IEnumerable<ShortLinkDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<ShortLinkDto>>> GetLinks([FromQuery] string session)
    {
        if (!ShortLinkRules.IsValidSession(session))
        {
            return BadRequest(new { message = "Informe uma sessão válida." });
        }

        await RemoveExpiredAsync();

        var links = await db.ShortLinks
            .AsNoTracking()
            .Where(l => l.Session == session)
            .OrderByDescending(l => l.Id)
            .ToListAsync();

        return Ok(links.Select(ToDto));
    }

    /// <summary>Cria um link curto para a URL informada.</summary>
    [HttpPost]
    [ProducesResponseType<ShortLinkDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<ShortLinkDto>> Create([FromBody] CreateShortLinkRequest request)
    {
        if (!ShortLinkRules.IsValidSession(request.Session))
        {
            return BadRequest(new { message = "Informe uma sessão válida." });
        }

        if (!ShortLinkRules.TryNormalize(request.Url, out var target, out var erro))
        {
            return BadRequest(new { message = erro });
        }

        await RemoveExpiredAsync();

        var agora = DateTime.UtcNow;

        var recentes = await db.ShortLinks
            .CountAsync(l => l.Session == request.Session && l.CreatedAt > agora - ShortLinkRules.RateWindow);

        if (recentes >= ShortLinkRules.MaxPerWindow)
        {
            return StatusCode(StatusCodes.Status429TooManyRequests, new
            {
                message = $"Você criou {ShortLinkRules.MaxPerWindow} links em menos de um minuto. Espere um pouco.",
            });
        }

        var ativos = await db.ShortLinks.CountAsync(l => l.Session == request.Session);

        if (ativos >= ShortLinkRules.MaxPerSession)
        {
            return BadRequest(new
            {
                message = $"Esta demo guarda até {ShortLinkRules.MaxPerSession} links por visitante. Apague algum para criar outro.",
            });
        }

        // O código é aleatório, então colisão é possível — rara, mas possível.
        // Em vez de confiar na sorte, tenta de novo quando o índice único recusa.
        for (var tentativa = 0; tentativa < 5; tentativa++)
        {
            var link = new ShortLink
            {
                Code = ShortLinkRules.NewCode(),
                TargetUrl = target,
                Session = request.Session,
                CreatedAt = agora,
                ExpiresAt = agora + ShortLinkRules.Lifetime,
            };

            db.ShortLinks.Add(link);

            try
            {
                await db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetLinks), new { session = link.Session }, ToDto(link));
            }
            catch (DbUpdateException)
            {
                db.Entry(link).State = EntityState.Detached;
            }
        }

        return StatusCode(StatusCodes.Status500InternalServerError, new
        {
            message = "Não consegui gerar um código livre. Tente de novo.",
        });
    }

    /// <summary>Apaga um link da própria sessão.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, [FromQuery] string session)
    {
        if (!ShortLinkRules.IsValidSession(session))
        {
            return BadRequest(new { message = "Informe uma sessão válida." });
        }

        // O filtro por sessão faz parte da busca: sem ele, qualquer um apagaria
        // o link de outro visitante só por acertar o id.
        var link = await db.ShortLinks.FirstOrDefaultAsync(l => l.Id == id && l.Session == session);

        if (link is null)
        {
            return NotFound(new { message = "Link não encontrado." });
        }

        db.ShortLinks.Remove(link);
        await db.SaveChangesAsync();

        return NoContent();
    }

    private ShortLinkDto ToDto(ShortLink link)
    {
        var restam = (int)Math.Ceiling((link.ExpiresAt - DateTime.UtcNow).TotalDays);

        return new ShortLinkDto(
            link.Id,
            link.Code,
            $"{Request.Scheme}://{Request.Host}/r/{link.Code}",
            link.TargetUrl,
            link.CreatedAt,
            link.ExpiresAt,
            Math.Max(restam, 0),
            link.Clicks);
    }

    /// <summary>
    /// Varre os vencidos antes de ler ou criar. Não há agendador neste serviço —
    /// e, numa demo, limpar no caminho da requisição custa menos que manter um.
    /// </summary>
    private async Task RemoveExpiredAsync()
    {
        await db.ShortLinks
            .Where(l => l.ExpiresAt <= DateTime.UtcNow)
            .ExecuteDeleteAsync();
    }
}

/// <summary>
/// O redirecionamento mora fora de /api porque o caminho curto é o produto:
/// /r/{codigo} é o que a pessoa copia e cola.
/// </summary>
[ApiExplorerSettings(IgnoreApi = true)]
public class RedirectController(PortfolioDbContext db) : ControllerBase
{
    [HttpGet("/r/{code}")]
    public async Task<IActionResult> Follow(string code)
    {
        if (!ShortLinkRules.IsValidCode(code))
        {
            return NotFound();
        }

        var link = await db.ShortLinks.FirstOrDefaultAsync(l => l.Code == code);

        if (link is null)
        {
            return NotFound();
        }

        if (link.ExpiresAt <= DateTime.UtcNow)
        {
            db.ShortLinks.Remove(link);
            await db.SaveChangesAsync();
            return NotFound();
        }

        link.Clicks++;
        await db.SaveChangesAsync();

        // 302, e não 301: o permanente fica no cache do navegador e o link
        // expira em sete dias.
        return Redirect(link.TargetUrl);
    }
}
