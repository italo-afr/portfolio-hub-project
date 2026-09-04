using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public record TransactionDto(
    int Id,
    string Title,
    decimal Amount,
    string Type,
    string Category,
    DateOnly Date);

/// <summary>Totais de um mês. <paramref name="Month"/> vem no formato "yyyy-MM".</summary>
public record MonthlySummaryDto(
    string Month,
    decimal Income,
    decimal Expense,
    decimal Balance);

/// <summary>Totais por categoria, usados para detalhar as despesas.</summary>
public record CategorySummaryDto(string Category, string Type, decimal Total);

public record FinanceSummaryDto(
    IEnumerable<MonthlySummaryDto> Months,
    IEnumerable<CategorySummaryDto> Categories,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance);

/// <summary>Valida que o tipo é "income" ou "expense".</summary>
public class TransactionTypeAttribute : ValidationAttribute
{
    public override bool IsValid(object? value) =>
        TransactionTypes.IsValid(value as string);

    public override string FormatErrorMessage(string name) =>
        "O tipo deve ser \"income\" ou \"expense\".";
}

public class TransactionRequest
{
    [Required(ErrorMessage = "O título é obrigatório.")]
    [StringLength(120, MinimumLength = 1, ErrorMessage = "O título deve ter entre 1 e 120 caracteres.")]
    public string Title { get; set; } = string.Empty;

    [Range(0.01, 9_999_999.99, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "O tipo é obrigatório.")]
    [TransactionType]
    public string Type { get; set; } = TransactionTypes.Expense;

    [Required(ErrorMessage = "A categoria é obrigatória.")]
    [StringLength(60, MinimumLength = 1, ErrorMessage = "A categoria deve ter entre 1 e 60 caracteres.")]
    public string Category { get; set; } = string.Empty;

    [Required(ErrorMessage = "A data é obrigatória.")]
    public DateOnly Date { get; set; }
}

public static class FinanceMapping
{
    /// <summary>Centavos → reais. Divisão decimal para não perder precisão.</summary>
    public static decimal ToAmount(this long cents) => cents / 100m;

    /// <summary>Reais → centavos, arredondando meio para cima.</summary>
    public static long ToCents(this decimal amount) =>
        (long)decimal.Round(amount * 100m, 0, MidpointRounding.AwayFromZero);

    public static TransactionDto ToDto(this Transaction t) =>
        new(t.Id, t.Title, t.AmountCents.ToAmount(), t.Type, t.Category, t.Date);
}
