namespace Backend.Models;

/// <summary>
/// Valores aceitos em <see cref="Transaction.Type"/>. Strings (e não enum) para
/// o JSON sair exatamente como "income"/"expense", igual ao contrato do frontend.
/// </summary>
public static class TransactionTypes
{
    public const string Income = "income";
    public const string Expense = "expense";

    public static bool IsValid(string? value) =>
        value is Income or Expense;
}

public class Transaction
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Valor em centavos. Dinheiro nunca é guardado em ponto flutuante, e o
    /// SQLite não agrega decimal de forma confiável (grava como TEXT) — inteiro
    /// resolve os dois problemas e deixa SUM() funcionar no banco.
    /// </summary>
    public long AmountCents { get; set; }

    public string Type { get; set; } = TransactionTypes.Expense;

    public string Category { get; set; } = string.Empty;

    public DateOnly Date { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
