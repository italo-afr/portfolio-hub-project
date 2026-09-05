using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.Data;

public static class DbSeeder
{
    /// <summary>
    /// Cria o banco caso não exista e popula os projetos na primeira execução.
    /// </summary>
    public static async Task SeedAsync(PortfolioDbContext db)
    {
        await EnsureSchemaAsync(db);

        await SeedTodosAsync(db);
        await SeedTransactionsAsync(db);

        if (await db.Projects.AnyAsync())
        {
            return;
        }

        db.Projects.AddRange(
            new Project
            {
                Slug = "todo-list",
                Title = "Todo List",
                Tag = "Rodando aqui",
                Type = ProjectTypes.Embedded,
                SortOrder = 1,
                Summary =
                    "Mini-app de tarefas com CRUD completo rodando dentro deste portfólio: o frontend React conversa com uma Web API em ASP.NET Core e persiste em SQLite via Entity Framework Core.",
                Description =
                    "Demonstração ao vivo da stack deste portfólio. O componente React roda embutido na página e consome os endpoints REST de /api/todos — criar, listar, editar, concluir e excluir. A API é uma ASP.NET Core Web API com controller atributado, DTOs de request e validação, persistindo em SQLite através do Entity Framework Core. Nada é mockado: o que você digitar aqui vai para o banco.",
                Tech =
                [
                    "React",
                    "ASP.NET Core Web API",
                    "C#",
                    "Entity Framework Core",
                    "SQLite",
                    "Tailwind"
                ],
                Highlights =
                [
                    "CRUD completo consumindo uma Web API REST em ASP.NET Core",
                    "Persistência real em SQLite via Entity Framework Core",
                    "Controller atributado com DTOs de request, validação e códigos HTTP corretos",
                    "Estados de carregamento, erro e lista vazia tratados na interface"
                ],
            },
            new Project
            {
                Slug = "finance-tracker",
                Title = "Finance Tracker",
                Tag = "Interativo",
                Type = ProjectTypes.Embedded,
                SortOrder = 2,
                Summary =
                    "Controle financeiro pessoal rodando dentro do portfólio: lançamentos de receita e despesa, filtro por mês e gráfico de receita x despesa alimentado por totais agregados no banco.",
                Description =
                    "Segundo mini-app embutido. O React consome /api/finance: CRUD de transações e um endpoint de resumo que agrega receita, despesa e saldo por mês direto no SQLite com GROUP BY. Os valores são guardados em centavos como inteiro — dinheiro não mora em ponto flutuante, e assim o SUM() do banco é exato. O gráfico é Recharts, alimentado pelo mesmo /api/finance/summary.",
                Tech =
                [
                    "React",
                    "Recharts",
                    "ASP.NET Core Web API",
                    "C#",
                    "Entity Framework Core",
                    "SQLite"
                ],
                Highlights =
                [
                    "CRUD de transações com validação de tipo, valor e data no servidor",
                    "GET /api/finance/summary agrega receita, despesa e saldo por mês com GROUP BY no banco",
                    "Valores em centavos (inteiro): sem erro de arredondamento de ponto flutuante",
                    "Filtro por mês e gráfico de barras receita x despesa com Recharts"
                ],
            },
            new Project
            {
                Slug = "chat-room",
                Title = "ChatRoom",
                Tag = "Tempo Real",
                Type = ProjectTypes.Embedded,
                SortOrder = 3,
                Summary =
                    "Chat em tempo real com SignalR sobre WebSocket: salas independentes, histórico persistido e reconexão automática — tudo rodando dentro do portfólio.",
                Description =
                    "Terceiro mini-app embutido. O ChatHub em ASP.NET Core mantém uma conexão WebSocket por cliente e usa grupos do SignalR para isolar as salas: uma mensagem publicada em #dotnet não chega em #frontend. Cada mensagem é gravada no SQLite antes de ser transmitida, então o histórico sobrevive a recarregar a página — GET /api/chat/messages devolve as últimas 50. O cliente usa @microsoft/signalr com reconexão automática e mostra o estado da conexão na interface.",
                Tech =
                [
                    "React",
                    "SignalR",
                    "WebSocket",
                    "ASP.NET Core",
                    "C#",
                    "Entity Framework Core"
                ],
                Highlights =
                [
                    "ChatHub com JoinRoom e SendMessage, isolando salas em grupos do SignalR",
                    "Troca de sala remove a conexão do grupo anterior — sem vazamento de mensagens entre salas",
                    "Histórico persistido em SQLite e servido por GET /api/chat/messages (últimas 50)",
                    "Reconexão automática no cliente com o estado da conexão visível na tela",
                    "Avisos de entrada e saída transmitidos para os demais participantes"
                ],
            },
            new Project
            {
                Slug = "gerador-de-cortes",
                Title = "Cortes GG",
                Tag = "IA / Mais recente",
                Type = ProjectTypes.External,
                ExternalUrl = "https://github.com/italo-afr/gerador-de-cortes",
                SortOrder = 4,
                Summary =
                    "Ferramenta full-stack para criadores de cortes de gaming: seleção visual de gameplay e webcam, geração de clipes e análise por IA que escreve título, legenda, hashtags e sugere thumbnail.",
                Description =
                    "Automatiza a produção de cortes para redes sociais. O usuário carrega um vídeo por URL, escolhe a resolução, marca as regiões de gameplay e webcam e define quantidade e duração dos clipes. Os frames são extraídos no próprio navegador com <video> e <canvas>, convertidos em JPEG base64 e enviados a uma Supabase Edge Function que consulta a Claude Vision API — as credenciais nunca saem do servidor. O resultado volta como metadados prontos para publicação, com dashboard de agendamento e integração com Twitch e TikTok.",
                Tech = ["React", "Vite", "Supabase Edge", "Claude Vision", "n8n", "Docker"],
                Highlights =
                [
                    "Seleção visual das regiões de gameplay e webcam com preview ao vivo",
                    "Extração de frames no navegador via <video> + <canvas>",
                    "Metadados gerados por Claude Vision: título, legenda, hashtags, hooks e thumbnail",
                    "Dashboard de agendamento em Supabase com publicação via APIs da Twitch e TikTok"
                ],
                GithubUrl = "https://github.com/italo-afr/gerador-de-cortes",
            },
            new Project
            {
                Slug = "labmanager",
                Title = "LabManager",
                Tag = "Em produção",
                Type = ProjectTypes.External,
                ExternalUrl = "https://github.com/italo-afr/lab-manager",
                SortOrder = 5,
                Summary =
                    "Sistema de gestão para laboratório de próteses dentárias: dashboard financeiro, controle de ordens por status de produção, alertas de atraso, integração com Google Calendar e etiquetas em PDF.",
                Description =
                    "Digitaliza o acompanhamento de pedidos, o controle financeiro e a carteira de dentistas parceiros de um laboratório de próteses dentárias. Está em produção como MVP, nascido de um projeto de extensão universitária. O dashboard confronta o valor a receber com o já recebido e destaca as ordens prioritárias; as entregas em atraso disparam alerta automático.",
                Tech = ["React", "TypeScript", "Vite", "Tailwind", "Firebase Firestore", "Firebase Auth"],
                Highlights =
                [
                    "Dashboard com a receber x recebido e ordens prioritárias",
                    "Gestão completa de ordens com acompanhamento do status de produção",
                    "Alertas automáticos de entregas em atraso e baixa de pagamento",
                    "CRUD de dentistas com máscara de telefone e integração com Google Calendar",
                    "Geração automática de etiquetas em PDF para identificação dos trabalhos"
                ],
                GithubUrl = "https://github.com/italo-afr/lab-manager",
            },
            new Project
            {
                Slug = "taskmanager",
                Title = "Lista de Tarefas",
                Tag = "Online",
                Type = ProjectTypes.External,
                ExternalUrl = "https://lista-de-tarefas-se28.onrender.com/",
                SortOrder = 6,
                Summary =
                    "Gerenciador de tarefas full-stack com autenticação, calendário interativo (mês/semana/dia), notificações por e-mail automáticas e segurança por usuário via RLS do Supabase.",
                Description =
                    "Gerenciador de tarefas com foco em rotina real de trabalho: calendário interativo em três granularidades, lembretes por e-mail disparados por automação e isolamento de dados por usuário garantido no próprio banco com Row Level Security.",
                Tech = ["React", "TypeScript", "Supabase", "Make.com", "Resend"],
                Highlights =
                [
                    "Autenticação e isolamento de dados por usuário com RLS",
                    "Calendário interativo nas visões mês, semana e dia",
                    "Notificações por e-mail automáticas via Make.com + Resend",
                    "Publicado no Render com deploy contínuo"
                ],
                GithubUrl = "https://github.com/italo-afr/ListaDeTarefas",
                DemoUrl = "https://lista-de-tarefas-se28.onrender.com/",
            },
            new Project
            {
                Slug = "encurtador-url",
                Title = "EncurtadorURL",
                Tag = "Backend",
                Type = ProjectTypes.External,
                ExternalUrl = "https://github.com/italo-afr/EncurtadorURL",
                SortOrder = 7,
                Summary =
                    "Encurtador de URLs com frontend em ASP.NET Core MVC, backend no Supabase (PostgreSQL), expiração automática de links e deploy em Docker atrás de reverse proxy Traefik.",
                Description =
                    "Encurtador de URLs construído em .NET 8 com ASP.NET Core MVC, interface Razor e API REST pública (POST /api/shorten). A solução é estruturada em camadas — Controllers, Models com ViewModels e Request DTOs, Views Razor — com validação de campos obrigatórios e proteção contra CSRF via @Html.AntiForgeryToken. A persistência fica no Supabase (PostgreSQL) usando o cliente Postgrest C#.",
                Tech =
                [
                    ".NET 8",
                    "ASP.NET Core MVC",
                    "C#",
                    "Razor Views",
                    "Supabase (PostgreSQL)",
                    "Postgrest C# Client",
                    "Docker Compose",
                    "Traefik"
                ],
                Highlights =
                [
                    "API REST pública (POST /api/shorten) e interface Razor com padrão Controller-Model-View",
                    "Geração de short_codes únicos com expiração automática (expires_at) e limpeza de links vencidos",
                    "Proteção contra CSRF com @Html.AntiForgeryToken e validação de campos obrigatórios",
                    "Arquitetura em camadas com ViewModels e Request DTOs, separando responsabilidades",
                    "Docker + Docker Compose com reverse proxy Traefik e redirecionamento HTTPS em produção"
                ],
                GithubUrl = "https://github.com/italo-afr/EncurtadorURL",
            },
            new Project
            {
                Slug = "auditor-de-curriculos",
                Title = "Auditor de Currículos",
                Tag = "IA / Projeto pessoal",
                // Sem repositório público ainda: sem ExternalUrl, o card cai na página de detalhe interna.
                Type = ProjectTypes.External,
                ExternalUrl = null,
                SortOrder = 8,
                Summary =
                    "SaaS que analisa currículos sob três óticas (ATS, RH e Técnica), processa PDF/DOCX/TXT, reescreve usando a metodologia XYZ e busca vagas compatíveis.",
                Description =
                    "SaaS de análise de currículos que avalia o documento sob três óticas complementares — filtro ATS, olhar de RH e olhar técnico. Aceita PDF, DOCX e TXT, reescreve as experiências usando a metodologia XYZ e sugere vagas compatíveis. As chamadas de IA passam por uma Supabase Edge Function, mantendo a chave fora do cliente.",
                Tech = ["React", "Vite", "Supabase Edge", "Claude API"],
                Highlights =
                [
                    "Análise em três óticas: ATS, RH e Técnica",
                    "Parsing de PDF, DOCX e TXT no navegador",
                    "Reescrita de experiências pela metodologia XYZ",
                    "Chamadas à Claude API protegidas por Supabase Edge Function"
                ],
                // Sem repositório público no GitHub — preencher quando o repo existir/for aberto.
                GithubUrl = null,
            },
            new Project
            {
                Slug = "copy-trade-bot-solana",
                Title = "Copy Trade Bot · Solana",
                Tag = "Open source",
                Type = ProjectTypes.External,
                ExternalUrl = "https://github.com/italo-afr/copy-trade-bot-solana",
                SortOrder = 9,
                Summary =
                    "Bot de copy-trading para Solana com dashboard ao vivo. Monitora carteiras, replica operações via Pump.fun, PumpSwap e Jupiter em tempo real e executa transações com bundles Jito.",
                Description =
                    "Bot de copy-trading na rede Solana com dashboard em tempo real. Monitora carteiras-alvo, replica as operações via Pump.fun, PumpSwap e Jupiter assim que são detectadas e envia as transações em bundles Jito para minimizar slippage e reduzir a chance de front-running.",
                Tech = ["JavaScript", "Solana", "Pump.fun", "PumpSwap", "Jupiter", "Jito"],
                Highlights =
                [
                    "Monitoramento de carteiras-alvo em tempo real",
                    "Replicação de trades via Pump.fun, PumpSwap e agregador Jupiter",
                    "Execução em bundles Jito para minimizar slippage",
                    "Dashboard ao vivo com posições e histórico de operações"
                ],
                GithubUrl = "https://github.com/italo-afr/copy-trade-bot-solana",
            },
            new Project
            {
                Slug = "autovideoia",
                Title = "AutoVideoIA",
                Tag = "Automação",
                Type = ProjectTypes.External,
                ExternalUrl = "https://github.com/italo-afr/AutoVideoIA",
                SortOrder = 10,
                Summary =
                    "Pipeline automatizado de criação de vídeos curtos com IA generativa: recebe um tema, gera roteiro, narração sintética, imagens e monta o vídeo final pronto para publicar.",
                Description =
                    "Pipeline de automação que transforma um tema em vídeo curto pronto para publicação. Gera o roteiro com IA generativa, sintetiza a narração via TTS, produz as imagens de apoio e monta tudo com FFmpeg, entregando o arquivo final sem intervenção manual.",
                Tech = ["Python", "IA Generativa", "TTS", "FFmpeg"],
                Highlights =
                [
                    "Geração de roteiro a partir de um tema com IA generativa",
                    "Narração sintética via TTS",
                    "Composição automática de imagens e legendas",
                    "Renderização final com FFmpeg pronta para publicação"
                ],
                GithubUrl = "https://github.com/italo-afr/AutoVideoIA",
            });

        await db.SaveChangesAsync();
    }

    /// <summary>
    /// Garante que as tabelas da aplicação existem.
    ///
    /// EnsureCreated() sozinho não basta: ele só cria o schema quando o banco
    /// não tem tabela NENHUMA. O banco "postgres" do Supabase já vem com as
    /// tabelas dele (auth, storage, realtime), então o EF conclui que o schema
    /// já está criado e não cria nada — e a primeira consulta falha com
    /// 42P01 relation "Todos" does not exist.
    ///
    /// Aqui checamos as nossas tabelas especificamente e, se faltarem,
    /// mandamos criar. Funciona igual no SQLite e no PostgreSQL.
    /// </summary>
    private static async Task EnsureSchemaAsync(PortfolioDbContext db)
    {
        var creator = (RelationalDatabaseCreator)db.GetService<IDatabaseCreator>();

        // Cria o banco em si quando ele não existe (dev local com SQLite).
        if (!await creator.ExistsAsync())
        {
            await creator.CreateAsync();
        }

        if (await AppTablesExistAsync(db))
        {
            return;
        }

        await creator.CreateTablesAsync();
    }

    /// <summary>
    /// Consulta barata numa tabela nossa. Se ela não existir, o provider lança
    /// e sabemos que o schema da aplicação ainda não foi criado.
    /// </summary>
    private static async Task<bool> AppTablesExistAsync(PortfolioDbContext db)
    {
        try
        {
            await db.Projects.AnyAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    /// <summary>
    /// Deixa o mini-app com algumas tarefas de exemplo para que o visitante
    /// não caia numa lista vazia na primeira visita.
    /// </summary>
    private static async Task SeedTodosAsync(PortfolioDbContext db)
    {
        if (await db.Todos.AnyAsync())
        {
            return;
        }

        db.Todos.AddRange(
            new TodoItem
            {
                Title = "Testar o CRUD desta lista",
                Notes = "Crie, edite, conclua e exclua — tudo grava no SQLite via Entity Framework Core.",
                Priority = TodoPriority.High,
            },
            new TodoItem
            {
                Title = "Abrir o Swagger em /swagger",
                Notes = "Os mesmos endpoints REST que esta tela consome estão documentados lá.",
                Priority = TodoPriority.Normal,
            },
            new TodoItem
            {
                Title = "Conferir o código no GitHub",
                Priority = TodoPriority.Low,
                IsDone = true,
                CompletedAt = DateTime.UtcNow,
            });

        await db.SaveChangesAsync();
    }

    /// <summary>
    /// Popula três meses de transações para o Finance Tracker abrir com o
    /// gráfico preenchido em vez de uma tela vazia. As datas são relativas ao
    /// mês atual, então o exemplo nunca "envelhece".
    /// </summary>
    private static async Task SeedTransactionsAsync(PortfolioDbContext db)
    {
        if (await db.Transactions.AnyAsync())
        {
            return;
        }

        var thisMonth = new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

        // (mesesAtras, dia, titulo, valorEmReais, tipo, categoria)
        (int Ago, int Day, string Title, decimal Amount, string Type, string Category)[] rows =
        [
            (2, 5, "Salário", 6500.00m, TransactionTypes.Income, "Salário"),
            (2, 8, "Aluguel", 1800.00m, TransactionTypes.Expense, "Moradia"),
            (2, 12, "Mercado", 742.35m, TransactionTypes.Expense, "Alimentação"),
            (2, 19, "Internet", 129.90m, TransactionTypes.Expense, "Contas"),
            (2, 24, "Freelance — landing page", 1200.00m, TransactionTypes.Income, "Freelance"),

            (1, 5, "Salário", 6500.00m, TransactionTypes.Income, "Salário"),
            (1, 8, "Aluguel", 1800.00m, TransactionTypes.Expense, "Moradia"),
            (1, 11, "Mercado", 812.70m, TransactionTypes.Expense, "Alimentação"),
            (1, 15, "Academia", 119.00m, TransactionTypes.Expense, "Saúde"),
            (1, 19, "Internet", 129.90m, TransactionTypes.Expense, "Contas"),
            (1, 22, "Curso de .NET", 349.90m, TransactionTypes.Expense, "Educação"),

            (0, 5, "Salário", 6500.00m, TransactionTypes.Income, "Salário"),
            (0, 8, "Aluguel", 1800.00m, TransactionTypes.Expense, "Moradia"),
            (0, 10, "Mercado", 689.40m, TransactionTypes.Expense, "Alimentação"),
            (0, 14, "Freelance — API REST", 2400.00m, TransactionTypes.Income, "Freelance"),
            (0, 15, "Academia", 119.00m, TransactionTypes.Expense, "Saúde"),
            (0, 19, "Internet", 129.90m, TransactionTypes.Expense, "Contas"),
            (0, 21, "Transporte", 246.80m, TransactionTypes.Expense, "Transporte"),
        ];

        db.Transactions.AddRange(rows.Select(r => new Transaction
        {
            Title = r.Title,
            AmountCents = r.Amount.ToCents(),
            Type = r.Type,
            Category = r.Category,
            Date = thisMonth.AddMonths(-r.Ago).AddDays(r.Day - 1),
        }));

        await db.SaveChangesAsync();
    }

}
