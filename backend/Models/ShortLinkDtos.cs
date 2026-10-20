using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

/// <param name="ShortUrl">URL curta pronta para copiar, com o host desta API.</param>
/// <param name="ExpiresInDays">Dias que faltam para o link expirar.</param>
public record ShortLinkDto(
    int Id,
    string Code,
    string ShortUrl,
    string TargetUrl,
    DateTime CreatedAt,
    DateTime ExpiresAt,
    int ExpiresInDays,
    int Clicks);

public class CreateShortLinkRequest
{
    [Required(ErrorMessage = "Informe a URL que você quer encurtar.")]
    [StringLength(ShortLinkRules.MaxUrlLength, MinimumLength = 3, ErrorMessage = "A URL deve ter entre 3 e 2000 caracteres.")]
    public string Url { get; set; } = string.Empty;

    [Required(ErrorMessage = "Informe uma sessão válida.")]
    public string Session { get; set; } = string.Empty;
}
