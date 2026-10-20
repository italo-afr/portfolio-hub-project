using System.Net;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace Backend.Models;

public class ShortLink
{
    public int Id { get; set; }

    /// <summary>Código que aparece na URL curta (/r/{code}).</summary>
    public string Code { get; set; } = string.Empty;

    public string TargetUrl { get; set; } = string.Empty;

    /// <summary>
    /// Sessão do visitante. A lista é isolada como as salas do chat: cada um
    /// vê só os links que criou, e ninguém herda a lista do visitante anterior.
    /// O redirecionamento em si é público — sem isso o link não serviria.
    /// </summary>
    public string Session { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAt { get; set; }

    public int Clicks { get; set; }
}

public static partial class ShortLinkRules
{
    /// <summary>Validade de cada link. É uma demo pública: nada fica para sempre.</summary>
    public static readonly TimeSpan Lifetime = TimeSpan.FromDays(7);

    public const int CodeLength = 7;

    public const int MaxUrlLength = 2000;

    /// <summary>Teto de links vivos por sessão.</summary>
    public const int MaxPerSession = 20;

    /// <summary>Janela e teto do limite de criação, para a demo não virar fábrica de links.</summary>
    public static readonly TimeSpan RateWindow = TimeSpan.FromSeconds(60);

    public const int MaxPerWindow = 10;

    // Sem caracteres ambíguos (0/O, 1/l/I): o código é feito para ser lido e digitado.
    private const string Alphabet = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

    /// <summary>Código aleatório — e não sequencial, que deixaria adivinhar os links dos outros.</summary>
    public static string NewCode()
    {
        var chars = new char[CodeLength];
        for (var i = 0; i < chars.Length; i++)
        {
            chars[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
        }

        return new string(chars);
    }

    public static bool IsValidSession(string? session) =>
        session is not null && SessionPattern().IsMatch(session);

    public static bool IsValidCode(string? code) =>
        code is not null && CodePattern().IsMatch(code);

    /// <summary>
    /// Valida o destino. Quem segue o link é o navegador do visitante, não o
    /// servidor, então aqui não há SSRF a evitar — o que se barra é link que
    /// não leva a lugar nenhum útil (outro esquema, endereço de rede interna)
    /// e URL longa demais para caber na coluna.
    /// </summary>
    public static bool TryNormalize(string? url, out string normalized, out string erro)
    {
        normalized = string.Empty;
        erro = string.Empty;

        if (string.IsNullOrWhiteSpace(url))
        {
            erro = "Informe uma URL.";
            return false;
        }

        var bruta = url.Trim();

        // Sem esquema, assume https — é o que o visitante espera ao colar "exemplo.com".
        if (!bruta.Contains("://", StringComparison.Ordinal))
        {
            bruta = $"https://{bruta}";
        }

        if (bruta.Length > MaxUrlLength)
        {
            erro = $"A URL passa de {MaxUrlLength} caracteres.";
            return false;
        }

        if (!Uri.TryCreate(bruta, UriKind.Absolute, out var uri))
        {
            erro = "Não consegui ler essa URL.";
            return false;
        }

        if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
        {
            erro = "Só encurto endereços http e https.";
            return false;
        }

        if (IsInternalHost(uri))
        {
            erro = "Esse endereço é de rede interna e não funcionaria para mais ninguém.";
            return false;
        }

        // "nada" vira "https://nada/" e passa no parse, mas não é domínio de
        // ninguém. Exige um ponto no host — a não ser que seja um IP público.
        if (!uri.DnsSafeHost.Contains('.') && !IPAddress.TryParse(uri.DnsSafeHost, out _))
        {
            erro = "Esse endereço não parece um domínio. Faltou o .com, .br…?";
            return false;
        }

        normalized = uri.ToString();
        return true;
    }

    private static bool IsInternalHost(Uri uri)
    {
        if (uri.IsLoopback)
        {
            return true;
        }

        var host = uri.DnsSafeHost;

        if (host.Equals("localhost", StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith(".localhost", StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith(".internal", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (!IPAddress.TryParse(host, out var ip))
        {
            // Nome comum: não resolvemos DNS aqui porque o servidor não acessa
            // o destino — quem acessa é o navegador de quem clicar.
            return false;
        }

        if (IPAddress.IsLoopback(ip))
        {
            return true;
        }

        var bytes = ip.GetAddressBytes();

        return ip.AddressFamily switch
        {
            System.Net.Sockets.AddressFamily.InterNetwork =>
                bytes[0] == 10 ||
                (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31) ||
                (bytes[0] == 192 && bytes[1] == 168) ||
                (bytes[0] == 169 && bytes[1] == 254),
            System.Net.Sockets.AddressFamily.InterNetworkV6 =>
                ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || (bytes[0] & 0xFE) == 0xFC,
            _ => false,
        };
    }

    [GeneratedRegex("^[A-Za-z0-9_-]{8,40}$")]
    private static partial Regex SessionPattern();

    [GeneratedRegex("^[A-Za-z0-9]{4,12}$")]
    private static partial Regex CodePattern();
}
