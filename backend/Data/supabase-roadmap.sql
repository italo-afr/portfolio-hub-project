-- Insere o card "Roadmap C# & Angular" no banco de produção (Supabase).
--
-- Por que este arquivo existe: o DbSeeder só roda em banco vazio. O Supabase já
-- tinha as 10 linhas anteriores, então o projeto novo nunca chegaria pela API —
-- apareceria só pelo fallback local do frontend. Este script faz o que o seeder
-- faria se o banco estivesse zerado.
--
-- Como rodar: cole no SQL Editor do Supabase e execute. É idempotente — rodar
-- duas vezes não duplica nada nem embaralha a ordem.
--
-- Tech e Highlights são listas convertidas para JSON pelo EF Core (ver
-- PortfolioDbContext). Por isso vão como texto JSON, e não como array nativo.

BEGIN;

-- 1) Abre a posição 4: tudo que hoje está em 4 ou mais desce um degrau.
--    O WHERE pelo slug evita mexer de novo se o script já tiver rodado.
UPDATE "Projects"
SET "SortOrder" = "SortOrder" + 1
WHERE "SortOrder" >= 4
  AND NOT EXISTS (
    SELECT 1 FROM "Projects" WHERE "Slug" = 'csharp-angular-roadmap'
  );

-- 2) Insere o card.
INSERT INTO "Projects" (
  "Slug", "Title", "Tag", "Summary", "Description",
  "Tech", "Highlights", "GithubUrl", "DemoUrl",
  "Type", "ExternalUrl", "SortOrder"
)
VALUES (
  'csharp-angular-roadmap',
  'Roadmap C# & Angular',
  'Online',
  'Roadmap interativo de 24 semanas para C# e Angular: 133 tópicos em mapa mental, com progresso salvo no navegador e vídeos recomendados em cada tópico.',
  'Trilha de estudo de 24 semanas, do zero ao deploy. O layout é um mapa mental: cada seção é uma pílula central e as semanas ramificam para os lados, ligadas por uma espinha vertical. Cada tópico é um checkbox cujo progresso fica no localStorage — por chave semana::tópico, e não por índice, de modo que reordenar o conteúdo não embaralha o que já foi marcado. Expandir um tópico revela os vídeos recomendados, com bandeira do idioma e canal.',
  '["React","TypeScript","Vite","Tailwind","Framer Motion"]',
  '["133 tópicos em 7 seções e 24 semanas, tipados em TypeScript","Progresso salvo no localStorage, com contadores por semana, seção e geral em tempo real","Mapa mental no desktop e lista cronológica no mobile — a ordem muda, não só o CSS","Tema claro e escuro por tokens CSS, sem nenhuma variante dark: nos componentes"]',
  'https://github.com/italo-afr/csharp-angular-roadmap',
  'https://csharp-angular-roadmap.vercel.app/',
  'external',
  'https://csharp-angular-roadmap.vercel.app/',
  4
)
ON CONFLICT ("Slug") DO NOTHING;

COMMIT;

-- Conferência: devem sair 11 linhas, com o roadmap na posição 4.
-- SELECT "SortOrder", "Slug", "Title" FROM "Projects" ORDER BY "SortOrder";
