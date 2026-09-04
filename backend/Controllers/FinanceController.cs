using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

/// <summary>
/// CRUD de transações e totais do mini-app Finance Tracker.
/// </summary>
[ApiController]
[Route("api/finance")]
[Produces("application/json")]
[Tags("Finance")]
public class FinanceController(PortfolioDbContext db) : ControllerBase
{
    /// <summary>Lista as transações, opcionalmente de um mês específico.</summary>
    /// <param name="month">Mês no formato "yyyy-MM". Omitido, traz todas.</param>
    /// <param name="type">Filtra por "income" ou "expense".</param>
    [HttpGet("transactions")]
    [ProducesResponseType<IEnumerable<TransactionDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions(
        [FromQuery] string? month = null,
        [FromQuery] string? type = null)
    {
        var query = db.Transactions.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(month))
        {
            if (!TryParseMonth(month, out var start, out var end))
            {
                return BadRequest(new { message = "Mês inválido. Use o formato yyyy-MM." });
            }

            query = query.Where(t => t.Date >= start && t.Date < end);
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            if (!TransactionTypes.IsValid(type))
            {
                return BadRequest(new { message = "O tipo deve ser \"income\" ou \"expense\"." });
            }

            query = query.Where(t => t.Type == type);
        }

        var transactions = await query
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.Id)
            .ToListAsync();

        return Ok(transactions.Select(t => t.ToDto()));
    }

    /// <summary>Retorna uma transação pelo id.</summary>
    [HttpGet("transactions/{id:int}")]
    [ProducesResponseType<TransactionDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransactionDto>> GetById(int id)
    {
        var transaction = await db.Transactions.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);

        return transaction is null ? NotFoundTransaction(id) : Ok(transaction.ToDto());
    }

    /// <summary>Cria uma transação.</summary>
    [HttpPost("transactions")]
    [ProducesResponseType<TransactionDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TransactionDto>> Create([FromBody] TransactionRequest request)
    {
        var transaction = new Transaction
        {
            Title = request.Title.Trim(),
            AmountCents = request.Amount.ToCents(),
            Type = request.Type,
            Category = request.Category.Trim(),
            Date = request.Date,
        };

        db.Transactions.Add(transaction);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction.ToDto());
    }

    /// <summary>Atualiza uma transação.</summary>
    [HttpPut("transactions/{id:int}")]
    [ProducesResponseType<TransactionDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TransactionDto>> Update(int id, [FromBody] TransactionRequest request)
    {
        var transaction = await db.Transactions.FirstOrDefaultAsync(t => t.Id == id);
        if (transaction is null)
        {
            return NotFoundTransaction(id);
        }

        transaction.Title = request.Title.Trim();
        transaction.AmountCents = request.Amount.ToCents();
        transaction.Type = request.Type;
        transaction.Category = request.Category.Trim();
        transaction.Date = request.Date;

        await db.SaveChangesAsync();

        return Ok(transaction.ToDto());
    }

    /// <summary>Exclui uma transação.</summary>
    [HttpDelete("transactions/{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var transaction = await db.Transactions.FirstOrDefaultAsync(t => t.Id == id);
        if (transaction is null)
        {
            return NotFoundTransaction(id);
        }

        db.Transactions.Remove(transaction);
        await db.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Totais agregados: receita, despesa e saldo por mês, mais o total por
    /// categoria e o consolidado geral.
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType<FinanceSummaryDto>(StatusCodes.Status200OK)]
    public async Task<ActionResult<FinanceSummaryDto>> GetSummary()
    {
        // A soma acontece no banco: AmountCents é inteiro, então SUM() é exato.
        var monthly = await db.Transactions
            .GroupBy(t => new { t.Date.Year, t.Date.Month })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                IncomeCents = g.Sum(t => t.Type == TransactionTypes.Income ? t.AmountCents : 0),
                ExpenseCents = g.Sum(t => t.Type == TransactionTypes.Expense ? t.AmountCents : 0),
            })
            .ToListAsync();

        var months = monthly
            .OrderBy(m => m.Year)
            .ThenBy(m => m.Month)
            .Select(m => new MonthlySummaryDto(
                $"{m.Year:D4}-{m.Month:D2}",
                m.IncomeCents.ToAmount(),
                m.ExpenseCents.ToAmount(),
                (m.IncomeCents - m.ExpenseCents).ToAmount()))
            .ToList();

        var byCategory = await db.Transactions
            .GroupBy(t => new { t.Category, t.Type })
            .Select(g => new
            {
                g.Key.Category,
                g.Key.Type,
                TotalCents = g.Sum(t => t.AmountCents),
            })
            .ToListAsync();

        var categories = byCategory
            .OrderByDescending(c => c.TotalCents)
            .Select(c => new CategorySummaryDto(c.Category, c.Type, c.TotalCents.ToAmount()))
            .ToList();

        var totalIncome = months.Sum(m => m.Income);
        var totalExpense = months.Sum(m => m.Expense);

        return Ok(new FinanceSummaryDto(
            months,
            categories,
            totalIncome,
            totalExpense,
            totalIncome - totalExpense));
    }

    /// <summary>Converte "yyyy-MM" na janela [primeiro dia, primeiro dia do mês seguinte).</summary>
    private static bool TryParseMonth(string month, out DateOnly start, out DateOnly end)
    {
        start = default;
        end = default;

        var parts = month.Split('-');
        if (parts.Length != 2
            || !int.TryParse(parts[0], out var year)
            || !int.TryParse(parts[1], out var monthNumber)
            || year < 1 || year > 9999
            || monthNumber < 1 || monthNumber > 12)
        {
            return false;
        }

        start = new DateOnly(year, monthNumber, 1);
        end = start.AddMonths(1);
        return true;
    }

    private NotFoundObjectResult NotFoundTransaction(int id) =>
        NotFound(new { message = $"Transação {id} não encontrada." });
}
