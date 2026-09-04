using Backend.Data;
using Backend.Hubs;
using Backend.Infrastructure;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Controllers atributados (TodoController). Enums viajam como texto no JSON —
// "High" é mais legível para o cliente do que 2.
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()));

builder.Services.AddSignalR();

// SQLite no dev local, PostgreSQL no Docker e em produção — ver DatabaseConfiguration.
builder.Services.AddPortfolioDatabase(builder.Configuration);
builder.Services.AddFrontendCors(builder.Configuration);

var app = builder.Build();

var (provider, connectionString) = DatabaseConfiguration.Resolve(builder.Configuration);
app.Logger.LogInformation(
    "Banco: {Provider} → {Destino} · CORS liberado para: {Origins}",
    provider,
    DatabaseConfiguration.Describe(provider, connectionString),
    string.Join(", ", CorsConfiguration.ResolveOrigins(builder.Configuration)));

// Cria o schema e popula na primeira execução.
await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();

    try
    {
        await DbSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        // O stack trace do Npgsql tem 30 linhas e esconde a causa real.
        // Estas são as duas que de fato acontecem em deploy.
        app.Logger.LogCritical(
            ex,
            "Falha ao conectar no banco ({Destino}). Causas comuns:\n"
            + "  • \"Network is unreachable\" com endereço IPv6 (2600:...): a conexão DIRETA do "
            + "Supabase (db.<ref>.supabase.co) só resolve IPv6, e Render/Railway não têm saída IPv6. "
            + "Use a Session pooler: postgresql://postgres.<ref>:<senha>@aws-0-<regiao>.pooler.supabase.com:5432/postgres\n"
            + "  • Falha de autenticação: no pooler o usuário é postgres.<project-ref>, não apenas postgres.",
            DatabaseConfiguration.Describe(provider, connectionString));

        throw;
    }
}

// Swagger fica ligado em dev; em produção só se explicitamente habilitado.
var swaggerEnabled =
    app.Environment.IsDevelopment()
    || builder.Configuration.GetValue("Swagger:Enabled", false);

if (swaggerEnabled)
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Portfolio API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors(CorsConfiguration.PolicyName);

var projects = app.MapGroup("/api/projects").WithTags("Projects");

projects.MapGet("/", async (PortfolioDbContext db) =>
    {
        var result = await db.Projects
            .AsNoTracking()
            .OrderBy(p => p.SortOrder)
            .ToListAsync();

        return Results.Ok(result.Select(p => p.ToDto()));
    })
    .WithName("GetProjects")
    .WithSummary("Lista todos os projetos do portfólio.")
    .Produces<IEnumerable<ProjectDto>>();

projects.MapGet("/{slug}", async (string slug, PortfolioDbContext db) =>
    {
        var project = await db.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Slug == slug);

        return project is null
            ? Results.NotFound(new { message = $"Projeto '{slug}' não encontrado." })
            : Results.Ok(project.ToDto());
    })
    .WithName("GetProjectBySlug")
    .WithSummary("Retorna um projeto pelo slug.")
    .Produces<ProjectDto>()
    .Produces(StatusCodes.Status404NotFound);

// Usado pelo health check do Railway/Render e pelo healthcheck do Docker.
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
    .WithTags("System")
    .ExcludeFromDescription();

app.MapControllers();

app.MapHub<ChatHub>("/hubs/chat");

app.Run();
