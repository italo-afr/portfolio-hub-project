// Conteúdo do portfólio. Os projetos aqui são mock — na Fase 2 vêm de GET /api/projects.

export const profile = {
  name: 'Ítalo Freire',
  fullName: 'Ítalo de Amorim Freire',
  role: 'Desenvolvedor Full-Stack .NET',
  roleDetail: 'C# · ASP.NET Core · Razor · PostgreSQL',
  location: 'Sumaré, SP · Remoto',
  languages: 'Português nativo · Inglês intermediário',
  headline:
    'Construo aplicações web de ponta a ponta em .NET — da modelagem do banco e da arquitetura em camadas ao deploy containerizado — com experiência complementar em DevOps, observabilidade e integrações REST.',
  email: 'italoafr1@gmail.com',
  github: 'https://github.com/italo-afr',
  linkedin: 'https://www.linkedin.com/in/italoafr/',
  githubLabel: 'github.com/italo-afr',
  linkedinLabel: 'linkedin.com/in/italoafr',
}

export const metrics = [
  { value: '40%', label: 'redução de MTTR' },
  { value: '3k+', label: 'chamados resolvidos' },
  { value: '70%', label: 'resolução em 1º contato' },
  { value: '3+', label: 'anos de experiência' },
]

export const badges = [
  'C#',
  '.NET 8',
  'ASP.NET Core',
  'PostgreSQL',
  'Docker',
  'React',
]

export const companies = [
  'Visual Code · Health Tech',
  'AUDÁCIA · Soluções Empresariais',
  'HTM Eletrônica',
  'BG Informática',
]

/**
 * type:
 *   'embedded' → roda como mini-app dentro do portfólio, na rota /:slug
 *   'external' → abre externalUrl em nova aba direto do card
 */
export const projects = [
  {
    slug: 'todo-list',
    title: 'Todo List',
    tag: 'Rodando aqui',
    type: 'embedded',
    summary:
      'Mini-app de tarefas com CRUD completo rodando dentro deste portfólio: o frontend React conversa com uma Web API em ASP.NET Core e persiste em SQLite via Entity Framework Core.',
    description:
      'Demonstração ao vivo da stack deste portfólio. O componente React roda embutido na página e consome os endpoints REST de /api/todos — criar, listar, editar, concluir e excluir. A API é uma ASP.NET Core Web API com controller atributado, DTOs de request e validação, persistindo em SQLite através do Entity Framework Core. Nada é mockado: o que você digitar aqui vai para o banco.',
    highlights: [
      'CRUD completo consumindo uma Web API REST em ASP.NET Core',
      'Persistência real em SQLite via Entity Framework Core',
      'Controller atributado com DTOs de request, validação e códigos HTTP corretos',
      'Estados de carregamento, erro e lista vazia tratados na interface',
    ],
    tech: [
      'React',
      'ASP.NET Core Web API',
      'C#',
      'Entity Framework Core',
      'SQLite',
      'Tailwind',
    ],
    links: {},
  },
  {
    slug: 'finance-tracker',
    title: 'Finance Tracker',
    tag: 'Interativo',
    type: 'embedded',
    summary:
      'Controle financeiro pessoal rodando dentro do portfólio: lançamentos de receita e despesa, filtro por mês e gráfico de receita x despesa alimentado por totais agregados no banco.',
    description:
      'Segundo mini-app embutido. O React consome /api/finance: CRUD de transações e um endpoint de resumo que agrega receita, despesa e saldo por mês direto no SQLite com GROUP BY. Os valores são guardados em centavos como inteiro — dinheiro não mora em ponto flutuante, e assim o SUM() do banco é exato. O gráfico é Recharts, com a paleta validada para daltonismo.',
    highlights: [
      'CRUD de transações com validação de tipo, valor e data no servidor',
      'GET /api/finance/summary agrega receita, despesa e saldo por mês com GROUP BY no banco',
      'Valores em centavos (inteiro): sem erro de arredondamento de ponto flutuante',
      'Filtro por mês e gráfico de barras receita x despesa com Recharts',
      'Paleta do gráfico validada para deuteranopia — verde x laranja, não verde x vermelho',
    ],
    tech: [
      'React',
      'Recharts',
      'ASP.NET Core Web API',
      'C#',
      'Entity Framework Core',
      'SQLite',
    ],
    links: {},
  },
  {
    slug: 'chat-room',
    title: 'ChatRoom',
    tag: 'Tempo Real',
    type: 'embedded',
    summary:
      'Chat em tempo real com SignalR sobre WebSocket: salas independentes, histórico persistido e reconexão automática — tudo rodando dentro do portfólio.',
    description:
      'Terceiro mini-app embutido. O ChatHub em ASP.NET Core mantém uma conexão WebSocket por cliente e usa grupos do SignalR para isolar as salas: uma mensagem publicada em #dotnet não chega em #frontend. Cada mensagem é gravada no SQLite antes de ser transmitida, então o histórico sobrevive a recarregar a página — GET /api/chat/messages devolve as últimas 50. O cliente usa @microsoft/signalr com reconexão automática e mostra o estado da conexão na interface.',
    highlights: [
      'ChatHub com JoinRoom e SendMessage, isolando salas em grupos do SignalR',
      'Troca de sala remove a conexão do grupo anterior — sem vazamento entre salas',
      'Histórico persistido em SQLite e servido por GET /api/chat/messages (últimas 50)',
      'Reconexão automática com o estado da conexão sempre visível na tela',
      'Avisos de entrada e saída transmitidos para os demais participantes',
    ],
    tech: [
      'React',
      'SignalR',
      'WebSocket',
      'ASP.NET Core',
      'C#',
      'Entity Framework Core',
    ],
    links: {},
  },
  {
    slug: 'gerador-de-cortes',
    type: 'external',
    externalUrl: 'https://github.com/italo-afr/gerador-de-cortes',
    title: 'Cortes GG',
    tag: 'IA / Mais recente',
    summary:
      'Ferramenta full-stack para criadores de cortes de gaming: seleção visual de gameplay e webcam, geração de clipes e análise por IA que escreve título, legenda, hashtags e sugere thumbnail.',
    description:
      'Automatiza a produção de cortes para redes sociais. O usuário carrega um vídeo por URL, escolhe a resolução, marca as regiões de gameplay e webcam e define quantidade e duração dos clipes. Os frames são extraídos no próprio navegador com <video> e <canvas>, convertidos em JPEG base64 e enviados a uma Supabase Edge Function que consulta a Claude Vision API — as credenciais nunca saem do servidor. O resultado volta como metadados prontos para publicação, com dashboard de agendamento e integração com Twitch e TikTok.',
    highlights: [
      'Seleção visual das regiões de gameplay e webcam com preview ao vivo',
      'Extração de frames no navegador via <video> + <canvas>',
      'Metadados gerados por Claude Vision: título, legenda, hashtags, hooks e thumbnail',
      'Dashboard de agendamento em Supabase com publicação via APIs da Twitch e TikTok',
    ],
    tech: ['React', 'Vite', 'Supabase Edge', 'Claude Vision', 'n8n', 'Docker'],
    links: { github: 'https://github.com/italo-afr/gerador-de-cortes' },
  },
  {
    slug: 'labmanager',
    title: 'LabManager',
    tag: 'Em produção',
    type: 'external',
    externalUrl: 'https://github.com/italo-afr/lab-manager',
    summary:
      'Sistema de gestão para laboratório de próteses dentárias: dashboard financeiro, controle de ordens por status de produção, alertas de atraso, integração com Google Calendar e etiquetas em PDF.',
    description:
      'Digitaliza o acompanhamento de pedidos, o controle financeiro e a carteira de dentistas parceiros de um laboratório de próteses dentárias. Está em produção como MVP, nascido de um projeto de extensão universitária. O dashboard confronta o valor a receber com o já recebido e destaca as ordens prioritárias; as entregas em atraso disparam alerta automático.',
    highlights: [
      'Dashboard com a receber x recebido e ordens prioritárias',
      'Gestão completa de ordens com acompanhamento do status de produção',
      'Alertas automáticos de entregas em atraso e baixa de pagamento',
      'CRUD de dentistas com máscara de telefone e integração com Google Calendar',
      'Geração automática de etiquetas em PDF para identificação dos trabalhos',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Firebase Firestore', 'Firebase Auth'],
    links: { github: 'https://github.com/italo-afr/lab-manager' },
  },
  {
    slug: 'taskmanager',
    title: 'Lista de Tarefas',
    tag: 'Online',
    type: 'external',
    externalUrl: 'https://lista-de-tarefas-se28.onrender.com/',
    summary:
      'Gerenciador de tarefas full-stack com autenticação, calendário interativo (mês/semana/dia), notificações por e-mail automáticas e segurança por usuário via RLS do Supabase.',
    description:
      'Gerenciador de tarefas com foco em rotina real de trabalho: calendário interativo em três granularidades, lembretes por e-mail disparados por automação e isolamento de dados por usuário garantido no próprio banco com Row Level Security.',
    highlights: [
      'Autenticação e isolamento de dados por usuário com RLS',
      'Calendário interativo nas visões mês, semana e dia',
      'Notificações por e-mail automáticas via Make.com + Resend',
      'Publicado no Render com deploy contínuo',
    ],
    tech: ['React', 'TypeScript', 'Supabase', 'Make.com', 'Resend'],
    links: {
      github: 'https://github.com/italo-afr/ListaDeTarefas',
      demo: 'https://lista-de-tarefas-se28.onrender.com/',
    },
  },
  {
    slug: 'encurtador-url',
    title: 'EncurtadorURL',
    tag: 'Backend',
    type: 'external',
    externalUrl: 'https://github.com/italo-afr/EncurtadorURL',
    summary:
      'Encurtador de URLs com frontend em ASP.NET Core MVC, backend no Supabase (PostgreSQL), expiração automática de links e deploy em Docker atrás de reverse proxy Traefik.',
    description:
      'Encurtador de URLs construído em .NET 8 com ASP.NET Core MVC, interface Razor e API REST pública (POST /api/shorten). A solução é estruturada em camadas — Controllers, Models com ViewModels e Request DTOs, Views Razor — com validação de campos obrigatórios e proteção contra CSRF via @Html.AntiForgeryToken. A persistência fica no Supabase (PostgreSQL) usando o cliente Postgrest C#.',
    highlights: [
      'API REST pública (POST /api/shorten) e interface Razor com padrão Controller-Model-View',
      'Geração de short_codes únicos com expiração automática (expires_at) e limpeza de links vencidos',
      'Proteção contra CSRF com @Html.AntiForgeryToken e validação de campos obrigatórios',
      'Arquitetura em camadas com ViewModels e Request DTOs, separando responsabilidades',
      'Docker + Docker Compose com reverse proxy Traefik e redirecionamento HTTPS em produção',
    ],
    tech: [
      '.NET 8',
      'ASP.NET Core MVC',
      'C#',
      'Razor Views',
      'Supabase (PostgreSQL)',
      'Postgrest C# Client',
      'Docker Compose',
      'Traefik',
    ],
    links: { github: 'https://github.com/italo-afr/EncurtadorURL' },
  },
  {
    slug: 'auditor-de-curriculos',
    title: 'Auditor de Currículos',
    tag: 'IA / Projeto pessoal',
    // Sem repositório público ainda: sem externalUrl, o card cai na página de detalhe interna.
    type: 'external',
    externalUrl: null,
    summary:
      'SaaS que analisa currículos sob três óticas (ATS, RH e Técnica), processa PDF/DOCX/TXT, reescreve usando a metodologia XYZ e busca vagas compatíveis.',
    description:
      'SaaS de análise de currículos que avalia o documento sob três óticas complementares — filtro ATS, olhar de RH e olhar técnico. Aceita PDF, DOCX e TXT, reescreve as experiências usando a metodologia XYZ e sugere vagas compatíveis. As chamadas de IA passam por uma Supabase Edge Function, mantendo a chave fora do cliente.',
    highlights: [
      'Análise em três óticas: ATS, RH e Técnica',
      'Parsing de PDF, DOCX e TXT no navegador',
      'Reescrita de experiências pela metodologia XYZ',
      'Chamadas à Claude API protegidas por Supabase Edge Function',
    ],
    tech: ['React', 'Vite', 'Supabase Edge', 'Claude API'],
    // Sem repositório público no GitHub — preencher quando o repo existir/for aberto.
    links: {},
  },
  {
    slug: 'copy-trade-bot-solana',
    title: 'Copy Trade Bot · Solana',
    tag: 'Open source',
    type: 'external',
    externalUrl: 'https://github.com/italo-afr/copy-trade-bot-solana',
    summary:
      'Bot de copy-trading para Solana com dashboard ao vivo. Monitora carteiras, replica operações via Pump.fun, PumpSwap e Jupiter em tempo real e executa transações com bundles Jito.',
    description:
      'Bot de copy-trading na rede Solana com dashboard em tempo real. Monitora carteiras-alvo, replica as operações via Pump.fun, PumpSwap e Jupiter assim que são detectadas e envia as transações em bundles Jito para minimizar slippage e reduzir a chance de front-running.',
    highlights: [
      'Monitoramento de carteiras-alvo em tempo real',
      'Replicação de trades via Pump.fun, PumpSwap e agregador Jupiter',
      'Execução em bundles Jito para minimizar slippage',
      'Dashboard ao vivo com posições e histórico de operações',
    ],
    tech: ['JavaScript', 'Solana', 'Pump.fun', 'PumpSwap', 'Jupiter', 'Jito'],
    links: { github: 'https://github.com/italo-afr/copy-trade-bot-solana' },
  },
  {
    slug: 'autovideoia',
    title: 'AutoVideoIA',
    tag: 'Automação',
    type: 'external',
    externalUrl: 'https://github.com/italo-afr/AutoVideoIA',
    summary:
      'Pipeline automatizado de criação de vídeos curtos com IA generativa: recebe um tema, gera roteiro, narração sintética, imagens e monta o vídeo final pronto para publicar.',
    description:
      'Pipeline de automação que transforma um tema em vídeo curto pronto para publicação. Gera o roteiro com IA generativa, sintetiza a narração via TTS, produz as imagens de apoio e monta tudo com FFmpeg, entregando o arquivo final sem intervenção manual.',
    highlights: [
      'Geração de roteiro a partir de um tema com IA generativa',
      'Narração sintética via TTS',
      'Composição automática de imagens e legendas',
      'Renderização final com FFmpeg pronta para publicação',
    ],
    tech: ['Python', 'IA Generativa', 'TTS', 'FFmpeg'],
    links: { github: 'https://github.com/italo-afr/AutoVideoIA' },
  },
]

export const experiences = [
  {
    role: 'Desenvolvedor Full-Stack & DevOps',
    company: 'Visual Code · Health Tech',
    period: '02/2026 — 08/2026',
    location: 'Remoto',
    bullets: [
      'Desenvolvi aplicações full-stack integradas a PostgreSQL (Supabase), com 6+ stored procedures customizadas, triggers e views agregadas para regras de negócio.',
      'Estruturei a camada de segurança com Row Level Security (RLS), isolando dados entre 4 tipos de usuário via políticas por role e funções com SECURITY DEFINER.',
      'Construí integrações com sistemas externos via REST APIs e webhooks para processamento assíncrono de conteúdo, com validação client-side.',
      'Configurei infraestrutura cloud em GCP e Firebase (App Distribution e Hosting), com versionamento no GitHub, Docker e CI/CD em estruturação com GitHub Actions.',
      'Estabeleci monitoramento e observabilidade com Grafana e estratégia de 3 ambientes (dev → staging → produção) com branch strategy.',
    ],
    stack: 'REST APIs · PostgreSQL · Supabase · Docker · GCP · Firebase · Grafana · TypeScript · Flutter · Linear',
  },
  {
    role: 'Desenvolvedor Full-Stack & Automação',
    company: 'AUDÁCIA · Soluções Empresariais',
    period: '10/2025 — 12/2025',
    location: 'Remoto',
    bullets: [
      'Projetei e implementei integrações entre 5+ sistemas (LinkedIn Lead Gen Forms, HubSpot, Sender.net, ManyChat, WhatsApp API) via Zapier e webhooks, com sincronização em tempo real.',
      'Configurei infraestrutura de e-mail marketing com autenticação de domínio (DNS, SPF, DKIM, DMARC), elevando a entregabilidade e protegendo a reputação do domínio.',
      'Desenvolvi tags de rastreamento avançado em JavaScript e eventos de conversão personalizados, alimentando a inteligência de tráfego pago.',
    ],
    stack: 'REST APIs · Webhooks · JavaScript · Zapier · HubSpot · WordPress · DNS · SPF · DKIM · DMARC',
  },
  {
    role: 'Técnico de Suporte em TI',
    company: 'HTM Eletrônica',
    period: '01/2024 — 03/2025',
    location: 'Amparo, SP · Presencial',
    bullets: [
      'Administrei servidores Windows Server e Linux, configurando VPN, firewall e políticas de acesso para 300+ usuários.',
      'Desenvolvi scripts de automação em PowerShell e Bash para provisionamento de usuários, manutenções e coleta de logs, eliminando 5h/semana de trabalho manual.',
      'Implementei dashboards de monitoramento com Grafana, transformando uma operação reativa em proativa e reduzindo o MTTR em 40%.',
      'Resolvi 150+ chamados/mês no help desk interno, com 70% de resolução em primeiro contato, atuando em hardware, redes corporativas e sistemas empresariais.',
    ],
    stack: 'Windows Server · Linux · PowerShell · Bash · Grafana · VPN · Firewall · Protheus/TOTVS',
  },
  {
    role: 'Especialista em Suporte de TI',
    company: 'BG Informática',
    period: '08/2022 — 06/2023',
    location: 'Vinhedo, SP · Presencial',
    bullets: [
      'Diagnostiquei e solucionei problemas em hardware, software e redes corporativas, reduzindo o tempo de inatividade dos usuários em 25%.',
      'Otimizei processos de atendimento com ferramentas de acesso remoto (AnyDesk, TeamViewer), aumentando a eficiência do suporte em 30%.',
    ],
    stack: 'AnyDesk · TeamViewer · Pacote Office · Power BI · Hardware · Redes',
  },
]

// Ordenada com o núcleo .NET primeiro — é o foco do posicionamento.
export const stack = [
  {
    category: 'Backend .NET',
    items: [
      'C#',
      '.NET 8',
      'ASP.NET Core MVC',
      'ASP.NET Core Web API',
      'Razor Views',
      'Entity Framework Core',
    ],
  },
  {
    category: 'Padrões & Arquitetura',
    items: [
      'OOP',
      'SOLID',
      'MVC',
      'Repository Pattern',
      'Injeção de Dependência',
      'Arquitetura em Camadas',
    ],
  },
  {
    category: 'Bancos de Dados',
    items: [
      'PostgreSQL',
      'Supabase',
      'SQL',
      'Stored Procedures',
      'Triggers · Views',
      'RLS · JSONB',
    ],
  },
  {
    category: 'DevOps & Deploy',
    items: [
      'Docker · Compose',
      'Traefik',
      'GitHub Actions',
      'GCP',
      'Vercel · Render',
      'Grafana',
    ],
  },
  {
    category: 'Frontend Web',
    items: ['React', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind', 'Vite', 'Flutter/Dart'],
  },
  {
    category: 'Segurança & Sysadmin',
    items: [
      'JWT · AntiForgery (CSRF)',
      'Row Level Security',
      'HTTPS',
      'Windows Server · Linux',
      'PowerShell · Bash',
      'VPN · Firewall',
    ],
  },
]

export const education = {
  degree: 'Análise e Desenvolvimento de Sistemas',
  institution: 'Centro Universitário União das Américas · Descomplica',
  period: '04/2024 — 09/2026',
  status: 'Em andamento',
  bullets: [
    'Foco em desenvolvimento full-stack com C#/ASP.NET — APIs REST e aplicações web completas, aplicando OOP e padrões de arquitetura.',
    'Aprofundamento em lógica de programação, estruturas de dados, versionamento com Git/GitHub e hospedagem em produção.',
  ],
}

// Ordenadas da mais recente para a mais antiga.
export const certifications = [
  { name: 'DevOps Strategist', issuer: 'Descomplica', date: '03/2026' },
  { name: 'Full Cycle Developer', issuer: 'Descomplica', date: '11/2025' },
  { name: 'FrontEnd Developer', issuer: 'Descomplica', date: '09/2025' },
  { name: 'Full Stack Developer', issuer: 'Descomplica', date: '05/2025' },
  { name: 'Object-Oriented Developer', issuer: 'Descomplica', date: '03/2025' },
  { name: 'Web Moderno Completo com JavaScript', issuer: 'Udemy', date: '03/2025' },
  { name: 'Backend Developer', issuer: 'Descomplica', date: '12/2024' },
  { name: 'Programmer', issuer: 'Descomplica', date: '06/2024' },
  { name: 'Desenvolvedor de Sistemas (.NET Framework)', issuer: 'Treinamax', date: '06/2019' },
]

export const about = [
  'Desenvolvedor full-stack com 3+ anos de experiência em web e mobile, com base sólida em programação orientada a objetos, padrões MVC e arquitetura em camadas.',
  'A trajetória começou no suporte corporativo, cuidando da infraestrutura de mais de 300 usuários — foi ali que aprendi a olhar para a causa raiz em vez do sintoma e a automatizar tudo que se repete. Hoje isso aparece no código: modelo o banco, construo a aplicação e cuido do caminho até a produção, com containerização, CI/CD e observabilidade.',
  'Apliquei essa base em projeto próprio em produção com .NET 8 / ASP.NET Core MVC + Supabase + Docker + Traefik, e sigo aprofundando em C#/ASP.NET na graduação em Análise e Desenvolvimento de Sistemas, com conclusão prevista para setembro de 2026.',
]

export const navLinks = [
  { label: 'Projetos', href: '#projetos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Contato', href: '#contato' },
]
