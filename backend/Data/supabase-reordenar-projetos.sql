-- Reordena os projetos e corrige o link quebrado do LabManager no banco de
-- produção (Supabase).
--
-- Por que este arquivo existe: o DbSeeder só roda em banco vazio, então mudar
-- SortOrder em DbSeeder.cs não altera o que a API já devolve em produção.
-- Mesmo motivo de backend/Data/supabase-roadmap.sql.
--
-- Como rodar: cole no SQL Editor do Supabase e execute. É idempotente.
--
-- A ordem nova põe o EncurtadorURL (.NET) e a Lista de Tarefas (React) na
-- frente, seguidos pelos mini-apps que rodam dentro do portfólio.

BEGIN;

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
    ('autovideoia',             9),
    ('auditor-de-curriculos',  10),
    ('labmanager',             11)
) AS nova(slug, ordem)
WHERE p."Slug" = nova.slug
  AND p."SortOrder" IS DISTINCT FROM nova.ordem;

-- O repositório lab-manager responde 404 no GitHub. Até o link certo ser
-- confirmado, o card aponta para o perfil — nenhum link quebrado no site.
UPDATE "Projects"
SET "ExternalUrl" = 'https://github.com/italo-afr',
    "GithubUrl"   = 'https://github.com/italo-afr'
WHERE "Slug" = 'labmanager'
  AND "ExternalUrl" = 'https://github.com/italo-afr/lab-manager';

COMMIT;

-- Conferência:
-- SELECT "SortOrder", "Slug", "ExternalUrl" FROM "Projects" ORDER BY "SortOrder";
