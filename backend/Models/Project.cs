namespace Backend.Models;

public class Project
{
    public int Id { get; set; }

    /// <summary>Identificador usado na rota do frontend (/:slug).</summary>
    public string Slug { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    /// <summary>Etiqueta curta exibida no card (ex.: "Em produção").</summary>
    public string? Tag { get; set; }

    /// <summary>Texto curto do card.</summary>
    public string Summary { get; set; } = string.Empty;

    /// <summary>Texto longo da página de detalhe.</summary>
    public string Description { get; set; } = string.Empty;

    public List<string> Tech { get; set; } = [];

    public List<string> Highlights { get; set; } = [];

    public string? GithubUrl { get; set; }

    public string? DemoUrl { get; set; }

    /// <summary>
    /// "embedded" roda como mini-app dentro do portfólio na rota /:slug;
    /// "external" abre <see cref="ExternalUrl"/> em nova aba direto do card.
    /// </summary>
    public string Type { get; set; } = ProjectTypes.External;

    /// <summary>Destino do card quando <see cref="Type"/> é "external".</summary>
    public string? ExternalUrl { get; set; }

    /// <summary>Ordem de exibição na home (menor primeiro).</summary>
    public int SortOrder { get; set; }
}
