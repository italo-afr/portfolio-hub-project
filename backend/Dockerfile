# ---- build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restaura primeiro só com o .csproj: enquanto as dependências não mudam,
# esta camada fica em cache e o rebuild pula o download dos pacotes.
COPY backend.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app --no-restore

# ---- runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Roda como usuário sem privilégios (a imagem já traz o usuário "app").
USER app

# O ASP.NET Core escuta em 8080 por padrão dentro do contêiner.
# Railway e Render injetam PORT — o entrypoint abaixo respeita as duas coisas.
ENV ASPNETCORE_HTTP_PORTS=8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true
EXPOSE 8080

COPY --from=build /app ./

# ${PORT:-8080}: usa a porta que o provedor injetar, ou 8080 no Docker local.
ENTRYPOINT ["/bin/sh", "-c", "exec dotnet backend.dll --urls http://0.0.0.0:${PORT:-8080}"]
