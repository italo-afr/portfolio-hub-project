namespace Backend.Models;

/// <summary>
/// Valores aceitos em <see cref="Project.Type"/>. Mantidos como constantes de
/// string (e não enum) para casar exatamente com o JSON que o frontend consome.
/// </summary>
public static class ProjectTypes
{
    /// <summary>Mini-app que roda dentro do portfólio, na rota /:slug.</summary>
    public const string Embedded = "embedded";

    /// <summary>Projeto hospedado fora; o card abre o link em nova aba.</summary>
    public const string External = "external";
}
