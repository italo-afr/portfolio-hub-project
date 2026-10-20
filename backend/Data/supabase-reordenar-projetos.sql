-- Ajusta a lista de projetos no banco de produção (Supabase).
--
-- Por que este arquivo existe: o DbSeeder só popula banco vazio, então mudar
-- DbSeeder.cs não altera o que a API já devolve em produção. Mesmo motivo de
-- backend/Data/supabase-roadmap.sql.
--
-- O que ele faz:
--   1. remove LabManager (repositório 404 no GitHub) e Auditor de Currículos
--      (sem repositório próprio);
--   2. transforma o EncurtadorURL em mini-app embutido, que agora roda dentro
--      do portfólio como o Todo List, o Finance Tracker e o ChatRoom;
--   3. reordena o que sobrou.
--
-- A tabela "ShortLinks", que o mini-app usa, NÃO é criada aqui: o DbSeeder
-- cria sozinho na primeira subida, inclusive em banco que já existia.
--
-- Como rodar: cole no SQL Editor do Supabase e execute. É idempotente.

BEGIN;

-- 1) Os dois cards que saíram.
DELETE FROM "Projects" WHERE "Slug" IN ('labmanager', 'auditor-de-curriculos');

-- 2) O EncurtadorURL deixa de ser card externo e passa a rodar embutido.
--    ExternalUrl precisa ficar nulo: com ele preenchido, o card abre o link em
--    vez de entrar na rota /:slug onde o mini-app vive.
UPDATE "Projects"
SET "Title"       = 'Encurtador de URL',
    "Tag"         = 'Rodando aqui',
    "Type"        = 'embedded',
    "ExternalUrl" = NULL,
    "GithubUrl"   = 'https://github.com/italo-afr/EncurtadorURL',
    "Summary"     = 'Encurtador de URLs rodando dentro do portfólio: cole um link longo, receba um código curto que redireciona de verdade, com expiração automática e contagem de cliques.',
    "Description" = 'Mini-app embutido que traz para dentro do portfólio o EncurtadorURL, projeto em .NET 8 com ASP.NET Core MVC e Razor. Aqui o frontend é React e o backend é a mesma Web API em ASP.NET Core do resto do site: POST /api/shorten grava o link e GET /r/{codigo} devolve um 302 para o destino, contando o clique. O código curto é sorteado com RandomNumberGenerator — e não sequencial, que deixaria adivinhar o link dos outros — e o índice único no banco cobre a colisão. Sua lista é isolada por sessão, como as salas do chat: cada visitante vê apenas o que criou.',
    "Tech"        = '["React","ASP.NET Core Web API","C#","Entity Framework Core","SQLite","PostgreSQL"]',
    "Highlights"  = '["POST /api/shorten cria o link e GET /r/{codigo} redireciona com 302, contabilizando o clique","Código aleatório em alfabeto sem caracteres ambíguos, com índice único e nova tentativa em caso de colisão","Expiração automática em 7 dias, com os vencidos varridos na própria requisição","Validação do destino: só http e https, recusando endereços de rede interna e domínio sem TLD","Teto de 20 links por visitante e limite de 10 criações por minuto, com resposta 429"]'
WHERE "Slug" = 'encurtador-url';

-- 3) Ordem final da home.
UPDATE "Projects" AS p
SET "SortOrder" = nova.ordem
FROM (
  VALUES
    ('encurtador-url',          1),
    ('taskmanager',             2),
    ('todo-list',               3),
    ('finance-tracker',         4),
    ('chat-room',               5),
    ('csharp-angular-roadmap',  6),
    ('gerador-de-cortes',       7),
    ('copy-trade-bot-solana',   8),
    ('autovideoia',             9)
) AS nova(slug, ordem)
WHERE p."Slug" = nova.slug
  AND p."SortOrder" IS DISTINCT FROM nova.ordem;

COMMIT;

-- Conferência: 9 linhas, encurtador-url em 1º e com Type 'embedded'.
-- SELECT "SortOrder", "Slug", "Type", "ExternalUrl" FROM "Projects" ORDER BY "SortOrder";
