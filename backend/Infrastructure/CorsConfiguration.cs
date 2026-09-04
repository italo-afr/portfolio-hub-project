namespace Backend.Infrastructure;

/// <summary>
/// Origens liberadas para o frontend.
///
/// Em produção a lista vem de variável de ambiente, e configurar array por env
/// var é chato (Cors__AllowedOrigins__0, __1, ...). Por isso também aceitamos
/// CORS_ORIGINS com os domínios separados por vírgula.
/// </summary>
public static class CorsConfiguration
{
    public const string PolicyName = "frontend";

    public static IServiceCollection AddFrontendCors(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var origins = ResolveOrigins(configuration);

        services.AddCors(options =>
            options.AddPolicy(PolicyName, policy => policy
                .WithOrigins(origins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                // O SignalR manda credenciais no handshake; sem isto o WebSocket
                // é barrado pelo CORS. Por isso as origens são explícitas e não
                // "*" — AllowCredentials é incompatível com AllowAnyOrigin.
                .AllowCredentials()));

        return services;
    }

    public static string[] ResolveOrigins(IConfiguration configuration)
    {
        var fromEnv = configuration["CORS_ORIGINS"];
        if (!string.IsNullOrWhiteSpace(fromEnv))
        {
            return fromEnv
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(o => o.TrimEnd('/'))
                .ToArray();
        }

        return configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>()
            ?.Select(o => o.TrimEnd('/'))
            .ToArray() ?? [];
    }
}
