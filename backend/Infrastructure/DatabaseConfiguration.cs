using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure;

/// <summary>
/// Escolhe o provider do banco em tempo de execução.
///
/// O projeto roda em dois cenários e os dois precisam continuar funcionando:
///   • `dotnet run` na máquina do dev  → SQLite, arquivo local, zero setup
///   • Docker / produção               → PostgreSQL
///
/// A escolha vem de Database:Provider, ou é inferida: se existe uma connection
/// string de Postgres (ou a env var DATABASE_URL), usa Postgres; senão, SQLite.
/// </summary>
public static class DatabaseConfiguration
{
    public const string Sqlite = "Sqlite";
    public const string Postgres = "Postgres";

    public static IServiceCollection AddPortfolioDatabase(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var (provider, connectionString) = Resolve(configuration);

        services.AddDbContext<PortfolioDbContext>(options =>
        {
            if (provider == Postgres)
            {
                options.UseNpgsql(connectionString, npgsql =>
                    // Banco gerenciado em outro provedor tem queda de rede
                    // ocasional. Sem retry, uma falha momentânea derruba a
                    // requisição — ou a API inteira, se acontecer no startup.
                    npgsql.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(10),
                        errorCodesToAdd: null));
            }
            else
            {
                options.UseSqlite(connectionString);
            }
        });

        return services;
    }

    /// <summary>Provider e connection string efetivos, já resolvidos.</summary>
    public static (string Provider, string ConnectionString) Resolve(IConfiguration configuration)
    {
        // Railway, Render e Heroku injetam DATABASE_URL como URI, não como
        // connection string do Npgsql — precisa converter.
        var databaseUrl = configuration["DATABASE_URL"];
        if (!string.IsNullOrWhiteSpace(databaseUrl))
        {
            return (Postgres, FromDatabaseUrl(databaseUrl));
        }

        var postgres = configuration.GetConnectionString("Postgres");
        var sqlite = configuration.GetConnectionString("Default");
        var configured = configuration["Database:Provider"];

        if (string.Equals(configured, Postgres, StringComparison.OrdinalIgnoreCase))
        {
            if (string.IsNullOrWhiteSpace(postgres))
            {
                throw new InvalidOperationException(
                    "Database:Provider=Postgres, mas ConnectionStrings:Postgres (ou DATABASE_URL) não foi informada.");
            }

            return (Postgres, postgres);
        }

        if (string.Equals(configured, Sqlite, StringComparison.OrdinalIgnoreCase))
        {
            return (Sqlite, Fallback(sqlite));
        }

        // Sem escolha explícita: Postgres se houver string, SQLite caso contrário.
        return string.IsNullOrWhiteSpace(postgres)
            ? (Sqlite, Fallback(sqlite))
            : (Postgres, postgres);
    }

    private static string Fallback(string? sqlite) =>
        string.IsNullOrWhiteSpace(sqlite) ? "Data Source=portfolio.db" : sqlite;

    /// <summary>
    /// Converte postgres://usuario:senha@host:porta/banco na connection string
    /// que o Npgsql entende. Hosts remotos ganham SSL, exigido pelo Supabase.
    /// </summary>
    public static string FromDatabaseUrl(string databaseUrl)
    {
        var uri = new Uri(databaseUrl);
        var credentials = uri.UserInfo.Split(':', 2);

        var builder = new Npgsql.NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.IsDefaultPort ? 5432 : uri.Port,
            Database = uri.AbsolutePath.TrimStart('/'),
            Username = Uri.UnescapeDataString(credentials[0]),
            Password = credentials.Length > 1 ? Uri.UnescapeDataString(credentials[1]) : string.Empty,
        };

        // Comparação exata, não StartsWith: o host direto do Supabase é
        // db.<projeto>.supabase.co e um StartsWith("db") o classificaria como
        // local, deixando a conexão sem SSL — que o Supabase recusa.
        // "db" e "postgres" aqui são nomes de serviço do docker-compose.
        var isLocal = uri.Host is "localhost" or "127.0.0.1" or "::1" or "db" or "postgres";
        if (!isLocal)
        {
            // Require criptografa sem exigir cadeia confiável — é o que
            // provedores gerenciados (Supabase, Railway) precisam, já que usam
            // certificado próprio. VerifyFull recusaria a conexão.
            builder.SslMode = Npgsql.SslMode.Require;
        }

        return builder.ConnectionString;
    }

    /// <summary>
    /// Descreve o destino do banco sem expor credenciais — vai para o log de
    /// inicialização, que é onde se depura deploy quebrado.
    /// </summary>
    public static string Describe(string provider, string connectionString)
    {
        if (provider != Postgres)
        {
            return "arquivo local";
        }

        try
        {
            var b = new Npgsql.NpgsqlConnectionStringBuilder(connectionString);
            return $"{b.Host}:{b.Port}/{b.Database} (SSL={b.SslMode})";
        }
        catch
        {
            return "connection string inválida";
        }
    }
}
