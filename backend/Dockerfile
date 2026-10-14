# ---- build ----
# Alpine também no SDK: a camada de build não vai para a imagem final, mas
# compilar na mesma distro evita surpresa de runtime nativo (Npgsql, ICU).
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

# Restaura primeiro só com o .csproj: enquanto as dependências não mudam,
# esta camada fica em cache e o rebuild pula o download dos pacotes.
COPY backend.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app --no-restore

# ---- runtime ----
# 10.0-alpine, e não 8.0: o projeto tem <TargetFramework>net10.0</TargetFramework>
# e um runtime 8.0 se recusa a carregar o assembly.
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
WORKDIR /app

# krb5-libs: o Npgsql tenta carregar GSSAPI ao negociar autenticação com o
#            PostgreSQL. Sem ela a conexão funciona, mas o startup registra um
#            "Error:" no log — ruído que parece deploy quebrado.
# icu-libs:  as imagens alpine vêm sem ICU e caem em globalização invariante.
#            São ~30 MB de disco (quase nada de RAM) para não arriscar
#            diferença de comparação/formatação de texto em produção.
RUN apk add --no-cache krb5-libs icu-libs

# Roda como usuário sem privilégios (a imagem já traz o usuário "app").
USER app

ENV ASPNETCORE_HTTP_PORTS=8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    # Teto de heap de 256 MB (0x10000000) dentro do contêiner de 512 MB do
    # free tier: o GC passa a coletar antes de encostar no limite do host, em
    # vez de ser morto por OOM.
    DOTNET_GCHeapHardLimit=0x10000000 \
    # GC workstation. O server GC cria um heap por núcleo e é feito para
    # máquinas dedicadas — num contêiner pequeno ele só multiplica memória.
    DOTNET_gcServer=0 \
    # Devolve páginas ao sistema em vez de segurá-las para reuso.
    DOTNET_GCConserveMemory=5

EXPOSE 8080

COPY --from=build /app ./

# ${PORT:-8080}: usa a porta que o provedor injetar, ou 8080 no Docker local.
ENTRYPOINT ["/bin/sh", "-c", "exec dotnet backend.dll --urls http://0.0.0.0:${PORT:-8080}"]
