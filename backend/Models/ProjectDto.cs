namespace Backend.Models;

/// <summary>
/// Formato devolvido pela API — espelha o shape que o frontend já consome.
/// </summary>
public record ProjectDto(
    string Slug,
    string Title,
    string? Tag,
    string Type,
    string? ExternalUrl,
    string Summary,
    string Description,
    IEnumerable<string> Tech,
    IEnumerable<string> Highlights,
    ProjectLinksDto Links);

public record ProjectLinksDto(string? Github, string? Demo);

public static class ProjectMapping
{
    public static ProjectDto ToDto(this Project project) =>
        new(
            project.Slug,
            project.Title,
            project.Tag,
            project.Type,
            project.ExternalUrl,
            project.Summary,
            project.Description,
            project.Tech,
            project.Highlights,
            new ProjectLinksDto(project.GithubUrl, project.DemoUrl));
}
