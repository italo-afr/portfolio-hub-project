// Conteúdo do portfólio. Os projetos aqui são mock — na Fase 2 vêm de GET /api/projects.

export const profile = {
  name: 'Ítalo Freire',
  fullName: 'Ítalo de Amorim Freire',
  role: 'Desenvolvedor Full-Stack Júnior',
  roleDetail: 'C# · .NET · JavaScript/TypeScript · React · Flutter · PostgreSQL · Docker',
  location: 'Sumaré, SP · Remoto',
  languages: 'Português nativo · Inglês intermediário',
  headline:
    'Construo aplicações web e mobile com C#/.NET, JavaScript/TypeScript, React e Flutter, do backend ao deploy. Vim do suporte e da infraestrutura, então penso em como o software roda em produção.',
  email: 'italoafr1@gmail.com',
  github: 'https://github.com/italo-afr',
  linkedin: 'https://www.linkedin.com/in/italoafr/',
  githubLabel: 'github.com/italo-afr',
  linkedinLabel: 'linkedin.com/in/italoafr',
}

export const badges = [
  'C#',
  '.NET',
  'TypeScript',
  'React',
  'Flutter',
  'PostgreSQL',
  'Docker',
]

/**
 * Dimensões reais de cada logo. Ficam aqui, num mapa só, porque as mesmas
 * imagens aparecem no hero e na timeline — e passá-las como width/height no
 * <img> faz o navegador reservar o espaço antes do download, sem o salto de
 * layout que o Lighthouse acusa como CLS.
 */
export const logoSizes = {
  '/logos/visual-code.jpg': { width: 200, height: 57 },
  '/logos/audacia.jpg': { width: 200, height: 200 },
  '/logos/htm.jpg': { width: 240, height: 89 },
  '/logos/bg-informatica.png': { width: 240, height: 240 },
}

export const companies = [
  { name: 'Visual Code · Health Tech', logo: '/logos/visual-code.jpg' },
  { name: 'AUDÁCIA · Soluções Empresariais', logo: '/logos/audacia.jpg' },
  { name: 'HTM Eletrônica', logo: '/logos/htm.jpg' },
  { name: 'BG Informática', logo: '/logos/bg-informatica.png' },
]

/**
 * type:
 *   'embedded' → roda como mini-app dentro do portfólio, na rota /:slug
 *   'external' → abre externalUrl em nova aba direto do card
 */
export const projects = [
  {
    slug: 'encurtador-url',
    title: 'Encurtador de URL',
    tag: 'Rodando aqui',
    type: 'embedded',
    summary:
      'Encurtador de URLs rodando dentro do portfólio: cole um link longo, receba um código curto que redireciona de verdade, com expiração automática e contagem de cliques.',
    description:
      'Mini-app embutido que traz para dentro do portfólio o EncurtadorURL, projeto em .NET 8 com ASP.NET Core MVC e Razor. Aqui o frontend é React e o backend é a mesma Web API em ASP.NET Core do resto do site: POST /api/shorten grava o link e GET /r/{codigo} devolve um 302 para o destino, contando o clique. O código curto é sorteado com RandomNumberGenerator — e não sequencial, que deixaria adivinhar o link dos outros — e o índice único no banco cobre a colisão. Sua lista é isolada por sessão, como as salas do chat: cada visitante vê apenas o que criou.',
    highlights: [
      'POST /api/shorten cria o link e GET /r/{codigo} redireciona com 302, contabilizando o clique',
      'Código aleatório em alfabeto sem caracteres ambíguos, com índice único e nova tentativa em caso de colisão',
      'Expiração automática em 7 dias, com os vencidos varridos na própria requisição',
      'Validação do destino: só http e https, recusando endereços de rede interna e domínio sem TLD',
      'Teto de 20 links por visitante e limite de 10 criações por minuto, com resposta 429',
    ],
    tech: [
      'React',
      'ASP.NET Core Web API',
      'C#',
      'Entity Framework Core',
      'SQLite',
      'PostgreSQL',
    ],
    links: { github: 'https://github.com/italo-afr/EncurtadorURL' },
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
    slug: 'csharp-angular-roadmap',
    title: 'Roadmap C# & Angular',
    tag: 'Online',
    type: 'external',
    externalUrl: 'https://csharp-angular-roadmap.vercel.app/',
    summary:
      'Roadmap interativo de 24 semanas para C# e Angular: 133 tópicos em mapa mental, com progresso salvo no navegador e vídeos recomendados em cada tópico.',
    description:
      'Trilha de estudo de 24 semanas, do zero ao deploy. O layout é um mapa mental: cada seção é uma pílula central e as semanas ramificam para os lados, ligadas por uma espinha vertical. Cada tópico é um checkbox cujo progresso fica no localStorage — por chave semana::tópico, e não por índice, de modo que reordenar o conteúdo não embaralha o que já foi marcado. Expandir um tópico revela os vídeos recomendados, com bandeira do idioma e canal.',
    highlights: [
      '133 tópicos em 7 seções e 24 semanas, tipados em TypeScript',
      'Progresso salvo no localStorage, com contadores por semana, seção e geral em tempo real',
      'Mapa mental no desktop e lista cronológica no mobile — a ordem muda, não só o CSS',
      'Tema claro e escuro por tokens CSS, sem nenhuma variante dark: nos componentes',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Framer Motion'],
    links: {
      github: 'https://github.com/italo-afr/csharp-angular-roadmap',
      demo: 'https://csharp-angular-roadmap.vercel.app/',
    },
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
    role: 'Desenvolvedor Flutter & DevOps',
    company: 'Visual Code · Health Tech',
    logo: '/logos/visual-code.jpg',
    period: '01/2026 — 09/2026',
    location: 'Remoto',
    bullets: [
      'Desenvolvi telas e fluxos do aplicativo em Flutter, com backend em Supabase/PostgreSQL.',
      'Modelei dados no PostgreSQL e trabalhei a camada de segurança com Row Level Security, isolando o acesso por tipo de usuário.',
      'Estruturei os ambientes de dev, staging e produção, com Docker, GitHub Actions, GCP e Firebase, e monitoramento com Grafana.',
    ],
    stack: 'Flutter · Dart · Supabase · PostgreSQL · Docker · GitHub Actions · GCP · Firebase · Grafana',
  },
  {
    role: 'Desenvolvedor Full Stack & Automação',
    company: 'AUDÁCIA · Soluções Empresariais',
    logo: '/logos/audacia.jpg',
    period: '10/2025 — 12/2025',
    location: 'Remoto',
    bullets: [
      'Integrei sistemas de marketing e CRM (LinkedIn Lead Gen Forms, HubSpot, Sender.net, ManyChat, WhatsApp API) via webhooks e Zapier.',
      'Configurei autenticação de domínio para e-mail (DNS, SPF, DKIM, DMARC).',
      'Escrevi tags de rastreamento e eventos de conversão em JavaScript.',
    ],
    stack: 'JavaScript · REST APIs · Webhooks · Zapier · HubSpot · WordPress · DNS · SPF · DKIM · DMARC',
  },
  {
    role: 'Técnico de Suporte de TI',
    company: 'HTM Eletrônica',
    logo: '/logos/htm.jpg',
    period: '01/2024 — 03/2025',
    location: 'Amparo, SP · Presencial',
    bullets: [
      'Administrei servidores Windows Server e Linux, com VPN, firewall e políticas de acesso.',
      'Automatizei provisionamento de usuários, manutenções e coleta de logs com PowerShell e Bash.',
      'Montei dashboards de monitoramento em Grafana e atuei no help desk interno, em hardware, redes e sistemas empresariais.',
    ],
    stack: 'Windows Server · Linux · PowerShell · Bash · Grafana · VPN · Firewall · Protheus/TOTVS',
  },
  {
    role: 'Suporte de TI',
    company: 'BG Informática',
    logo: '/logos/bg-informatica.png',
    period: '08/2022 — 07/2023',
    location: 'Vinhedo, SP · Presencial',
    bullets: [
      'Diagnostiquei e resolvi problemas de hardware, software e redes corporativas.',
      'Atendi usuários remotamente com AnyDesk e TeamViewer.',
    ],
    stack: 'AnyDesk · TeamViewer · Pacote Office · Power BI · Hardware · Redes',
  },
]

// Agrupada pelo posicionamento atual: backend e frontend/mobile primeiro.
export const stack = [
  {
    category: 'Backend',
    items: [
      'C#',
      '.NET 8',
      'ASP.NET Core',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'APIs REST',
    ],
  },
  {
    category: 'Frontend e mobile',
    items: ['React', 'HTML', 'CSS', 'Tailwind', 'Flutter', 'Dart'],
  },
  {
    category: 'Banco de dados',
    items: ['PostgreSQL', 'SQL', 'Supabase', 'RLS'],
  },
  {
    category: 'DevOps e cloud',
    items: ['Docker', 'Git', 'GitHub Actions', 'GCP', 'Firebase', 'Grafana'],
  },
  {
    category: 'Infraestrutura',
    items: ['Windows Server', 'Linux', 'PowerShell', 'Bash'],
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
  'Desenvolvedor Full-Stack com 3+ anos em TI, sendo cerca de 1 ano atuando diretamente em desenvolvimento e DevOps. Comecei no suporte e na infraestrutura (Windows Server, Linux, redes, Grafana).',
  'Na Visual Code (health tech), desenvolvi telas e fluxos em Flutter com backend Supabase/PostgreSQL e estruturei ambientes de dev, staging e produção. Em C# e ASP.NET Core, desenvolvi o EncurtadorURL.',
  'Busco minha posição como desenvolvedor full-stack júnior, remoto ou na região de Campinas/SP.',
]

export const navLinks = [
  { label: 'Projetos', href: '#projetos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Contato', href: '#contato' },
]
