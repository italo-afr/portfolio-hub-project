# Portfólio como Plataforma

![Portfólio de Ítalo Freire](docs/banner.jpg)

Em vez de listar projetos com um print e um link para o GitHub, este portfólio hospeda
**mini-apps funcionais que rodam dentro da própria página**, cada um consumindo uma API
real em ASP.NET Core com persistência em banco. Quem abre o site não vê uma captura de
tela de um CRUD: usa o CRUD, e o que digitar vai para o banco.

---

## O conceito

Portfólio de desenvolvedor costuma ter um problema de confiança: o visitante precisa
acreditar na descrição. Um card diz "sistema de tarefas com CRUD completo em ASP.NET
Core" e o recrutador tem duas opções — confiar, ou clonar o repositório e subir o
ambiente.

A ideia aqui é remover esse intervalo. Os projetos são divididos em dois tipos:

| Tipo | Comportamento | Para quê |
|------|---------------|----------|
| `embedded` | Abre em `/:slug` e roda **dentro** do portfólio | Provar a stack funcionando ao vivo |
| `external` | Abre o link em nova aba | Projetos já hospedados fora |

O campo `type` fica no modelo do projeto (banco e frontend), então adicionar um novo
mini-app é registrar um slug — não mexer na navegação.

Cada mini-app é carregado sob demanda (`React.lazy`), isolado por um *error boundary* e
montado dentro de uma moldura comum, o `ProjectShell`. Se um mini-app quebrar, ele
quebra sozinho: a página continua de pé.

![Finance Tracker rodando embutido no portfólio](docs/mini-app-finance.jpg)

---

## Stack

**Frontend**

| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19 | Interface |
| Vite | 8 | Build e dev server |
| Tailwind CSS | 4 | Estilo, via `@theme` (sem `tailwind.config.js`) |
| React Router | 7 | Rotas `/` e `/:slug` |
| Framer Motion | 13 | Animações de entrada |
| Recharts | 3 | Gráfico do Finance Tracker |
| @microsoft/signalr | 10 | Cliente WebSocket do ChatRoom |

**Backend**

| Tecnologia | Versão | Papel |
|---|---|---|
| ASP.NET Core | .NET 10 | Web API + SignalR |
| Entity Framework Core | 10 | ORM |
| SQLite | — | Persistência |
| SignalR | (framework) | Tempo real do ChatRoom |
| Swashbuckle SwaggerUI | 10.2 | UI sobre o OpenAPI nativo |

> **Nota:** o SignalR do servidor **não** precisa do pacote `Microsoft.AspNetCore.SignalR`.
> Desde o .NET Core 3.0 ele faz parte do framework compartilhado (`Microsoft.AspNetCore.App`).
> Aquele pacote é do ASP.NET Core 2.x e instalá-lo hoje só adiciona uma dependência legada.

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│  NAVEGADOR                                                      │
│                                                                 │
│  React 19 + Vite                                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Home  /                                                  │  │
│  │  Hero · Projetos · Sobre · Experiência · Stack · Contato  │  │
│  │                                                           │  │
│  │  Projeto  /:slug                                          │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  ProjectShell  (moldura + error boundary)           │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │  mini-app sob demanda (React.lazy)            │  │  │  │
│  │  │  │  TodoApp · FinanceApp · ChatApp               │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────┬───────────────────────────────┬──────────────────┘
               │  HTTP  /api/*                 │  WebSocket  /hubs/chat
               ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  ASP.NET CORE  (.NET 10)                                        │
│                                                                 │
│  Controllers                          Hubs                      │
│  ├─ projetos (minimal API)            └─ ChatHub                │
│  ├─ TodoController                       ├─ JoinRoom(sala, nome)│
│  ├─ FinanceController                    └─ SendMessage(texto)  │
│  └─ ChatController  (histórico)                                 │
│                                                                 │
│  ── CORS (origens explícitas + AllowCredentials) ──             │
│                                                                 │
│  Entity Framework Core                                          │
│  └─ PortfolioDbContext                                          │
│     Projects · Todos · Transactions · ChatMessages              │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
                    ┌──────────────┐
                    │    SQLite    │
                    │ portfolio.db │
                    └──────────────┘
```

**Fluxo de uma mensagem no ChatRoom**

```
Cliente A  ──SendMessage──►  ChatHub  ──►  SQLite (grava)
                                │
                                └──►  Group(sala)  ──►  Cliente A, Cliente B
                                      (só quem está na sala)
```

**Decisões que valem citar**

- **Valores monetários em centavos (`long`), não `decimal`.** Dinheiro não mora em ponto
  flutuante, e o SQLite grava `decimal` como TEXT — o que quebraria o `SUM()` do
  endpoint de resumo.
- **Prioridade do Todo gravada como `int`, não texto.** Como texto, o `ORDER BY` do
  SQLite ordena alfabeticamente e "Normal" viria antes de "High". Na API ela continua
  saindo como string, via `JsonStringEnumConverter`.
- **Uma sala = um grupo do SignalR.** Trocar de sala remove a conexão do grupo anterior;
  sem isso a conexão acumula grupos e o usuário segue recebendo mensagens de salas que
  já deixou.
- **Tema por tokens, sem variante `dark:`.** Todas as cores saem de variáveis CSS
  definidas duas vezes (`:root` e `[data-theme=light]`). Trocar o tema redefine os
  tokens e a interface inteira acompanha.

---

## Estrutura de pastas

```
portfolio-it-v2/
├── backend/
│   ├── Controllers/     TodoController · FinanceController · ChatController
│   ├── Hubs/            ChatHub
│   ├── Models/          entidades + DTOs + validação
│   ├── Data/            PortfolioDbContext · DbSeeder
│   └── Program.cs       CORS, Swagger, SignalR, endpoints de projetos
│
└── frontend/
    └── src/
        ├── components/  Navbar, Hero, ProjectShell, Reveal, ThemeToggle…
        ├── miniapps/    TodoApp · FinanceApp · ChatApp + registry.js
        ├── pages/       Home · ProjectDetail
        ├── services/    clientes da API (api, todos, finance, chat)
        ├── hooks/       useProjects
        ├── data/        conteúdo do portfólio (fallback offline)
        └── index.css    tokens de tema claro/escuro
```

---

## Como rodar localmente

**Pré-requisitos:** [.NET SDK 10](https://dotnet.microsoft.com/download) e
[Node.js 20+](https://nodejs.org).

### Backend

```bash
cd backend
dotnet restore
dotnet run --launch-profile http
```

Sobe em `http://localhost:5070`. O banco `portfolio.db` é **criado e populado
automaticamente** na primeira execução — não há passo de migration.

- Swagger: <http://localhost:5070/swagger>
- OpenAPI: <http://localhost:5070/openapi/v1.json>

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173`. O Vite já faz proxy de `/api` e `/hubs` para o backend
(o `/hubs` com `ws: true`, necessário para o WebSocket do SignalR), então não é preciso
configurar variável de ambiente em desenvolvimento.

> Rode os dois ao mesmo tempo. O front funciona sem o backend — a lista de projetos cai
> em um conteúdo local —, mas os mini-apps precisam da API.

### Outros comandos

```bash
npm run build      # build de produção
npm run preview    # serve o build em :4173
npm run lint       # ESLint
```

### Tudo de uma vez com Docker

Sobe PostgreSQL, API e frontend juntos, sem instalar .NET nem Node na máquina:

```bash
docker compose up --build
```

| Serviço | Endereço |
|---|---|
| Frontend (Vite, com hot reload) | <http://localhost:5173> |
| API + Swagger | <http://localhost:5070/swagger> |
| PostgreSQL | `localhost:5433` — `portfolio` / `portfolio` / `portfolio` |

O banco é exposto em **5433**, e não 5432, para não conflitar com um PostgreSQL
já instalado na máquina. Dentro da rede do compose ele continua em 5432.

Para começar do zero (apaga o volume do banco):

```bash
docker compose down -v
```


---

## API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/projects` | Lista os projetos do portfólio |
| `GET` | `/api/projects/{slug}` | Um projeto pelo slug |
| `GET` | `/api/todos?status=` | Tarefas (`all`, `pending`, `done`) |
| `POST` | `/api/todos` | Cria tarefa |
| `PUT` | `/api/todos/{id}` | Atualiza tarefa |
| `PATCH` | `/api/todos/{id}/toggle` | Alterna concluída/pendente |
| `DELETE` | `/api/todos/{id}` | Exclui tarefa |
| `DELETE` | `/api/todos/completed` | Remove todas as concluídas |
| `GET` | `/api/finance/transactions?month=&type=` | Transações, com filtros |
| `POST` | `/api/finance/transactions` | Cria transação |
| `PUT` | `/api/finance/transactions/{id}` | Atualiza transação |
| `DELETE` | `/api/finance/transactions/{id}` | Exclui transação |
| `GET` | `/api/finance/summary` | Receita, despesa e saldo por mês |
| `GET` | `/api/chat/messages?session=&room=` | Últimas 50 mensagens da sala daquela sessão |
| `GET` | `/api/chat/rooms` | Salas disponíveis |
| — | `/hubs/chat` | Hub SignalR (WebSocket) |

---

## Mini-apps

### Todo List · `/todo-list`

CRUD completo de tarefas com prioridade, notas e filtros. Demonstra o caminho básico da
stack: React → Web API atributada → EF Core → SQLite.

**Destaques:** validação no servidor com `DataAnnotations` e resposta em `ProblemDetails`;
códigos HTTP corretos (`201` com `Location`, `204` no delete, `404` com mensagem);
estados de carregamento, erro e lista vazia tratados na interface.

`React` · `ASP.NET Core Web API` · `EF Core` · `SQLite`

---

### Finance Tracker · `/finance-tracker`

Controle financeiro pessoal com lançamentos de receita e despesa, filtro por mês e
gráfico de barras alimentado por totais agregados no banco.

**Destaques:** `GET /api/finance/summary` agrega com `GROUP BY` direto no SQLite; valores
em centavos para o `SUM()` ser exato; a paleta do gráfico foi **validada para
daltonismo** — verde × laranja, e não verde × vermelho, porque o par verde/vermelho
reprova na separação para deuteranopia (ΔE 5.8), justamente o tipo mais comum.

`React` · `Recharts` · `ASP.NET Core Web API` · `EF Core` · `SQLite`

---

### ChatRoom · `/chat-room`

Chat em tempo real com salas independentes, histórico persistido e reconexão automática.

**Destaques:** cada sala é um grupo do SignalR, então uma mensagem em `#dotnet` não chega
em `#frontend`; a mensagem é gravada antes de ser transmitida, então o histórico
sobrevive ao reload; o cliente reentra na sala após uma queda, porque o SignalR reconecta
com uma conexão nova que não está mais no grupo do servidor.

**Isolamento por visitante.** É uma demo pública sem autenticação, então a chave real da
sala é `sala:sessão`: duas abas do mesmo navegador conversam entre si, mas ninguém deixa
mensagem para o próximo visitante do portfólio. Some-se a isso um rate limit de 10
mensagens por 30s por conexão e expiração automática em 24h — sem essas três coisas, um
desconhecido escreveria conteúdo permanente na página que serve de cartão de visitas.

`React` · `SignalR` · `WebSocket` · `ASP.NET Core` · `EF Core`

> Abra em duas abas para ver o tempo real funcionando — elas compartilham a mesma sessão.

---

## Deploy

A aplicação é publicada em duas metades: o frontend como site estático e a API
em contêiner, com um PostgreSQL gerenciado.

```
Vercel  ──HTTPS──►  Railway / Render  ──►  PostgreSQL
(estático)          (contêiner .NET)       (Supabase / Railway)
```

### Banco

O provider é escolhido em tempo de execução (`Infrastructure/DatabaseConfiguration.cs`):

| Cenário | Provider | Origem da connection string |
|---|---|---|
| `dotnet run` local | SQLite | `ConnectionStrings:Default` |
| `docker compose` | PostgreSQL | `ConnectionStrings__Postgres` |
| Produção | PostgreSQL | `DATABASE_URL` ou `ConnectionStrings__Postgres` |

`DATABASE_URL` no formato URI (`postgresql://usuario:senha@host:5432/banco`),
que é como Railway, Render e Supabase entregam, é convertido automaticamente
para o formato do Npgsql — com `SSL Mode=Require` quando o host é remoto.

### Backend

O `backend/Dockerfile` é multi-stage e roda como usuário sem privilégios. O
`ENTRYPOINT` respeita a variável `PORT` que Railway e Render injetam, caindo em
8080 quando ela não existe.

Variáveis de ambiente necessárias:

```bash
ASPNETCORE_ENVIRONMENT=Production
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
CORS_ORIGINS=https://seu-site.vercel.app
```

`CORS_ORIGINS` aceita vários domínios separados por vírgula. Ele **precisa**
conter o domínio exato do frontend: o SignalR envia credenciais no handshake, e
por isso a política não pode usar curinga.

Health check para o provedor: `GET /api/health`.

### Frontend

Na Vercel, defina **Root Directory** como `frontend`. O `vercel.json` já traz o
build, o cache dos assets e o rewrite de SPA — sem ele, recarregar a página em
`/todo-list` devolveria 404. Há um `netlify.toml` equivalente.

Variáveis de ambiente (as duas precisam ser absolutas em produção, porque o
proxy do Vite só existe em desenvolvimento):

```bash
VITE_API_URL=https://sua-api.up.railway.app/api
VITE_HUB_URL=https://sua-api.up.railway.app/hubs/chat
```

> Tudo que começa com `VITE_` é embutido no bundle e fica visível no navegador.
> Nunca coloque segredo nessas variáveis.

### Limitação conhecida

O schema é criado com `EnsureCreated()`, que cria as tabelas na primeira
execução mas **não versiona alterações**. Enquanto o modelo não mudar, funciona.
Para evoluir o schema em produção sem recriar o banco, será preciso migrar para
`dotnet ef migrations` — está no roadmap.

---

## Roadmap

- [x] **PostgreSQL e Docker** — provider selecionável, Dockerfile e docker-compose
- [ ] **Publicar** — frontend na Vercel, API no Railway/Render (arquivos prontos)
- [ ] **Migrations com EF Core** — substituir `EnsureCreated()` para permitir evoluir
      o schema em produção sem recriar o banco
- [x] **Moderação no ChatRoom** — isolamento por sessão, rate limit e expiração em 24h
- [ ] **CI/CD com GitHub Actions** — lint, build e testes a cada push
- [ ] **Testes automatizados** — xUnit nos controllers, Vitest + Testing Library nos
      mini-apps
- [ ] **Painel admin** — editar projetos e conteúdo pela própria plataforma, sem redeploy
- [ ] **Novos mini-apps** — encurtador de URL e visualizador de métricas do GitHub
- [ ] **i18n** — versão em inglês do portfólio
- [ ] **Identidade visual** — nova paleta e tipografia (facilitado: toda cor já sai de
      tokens em um único arquivo)

---

## Autor

**Ítalo de Amorim Freire** — Desenvolvedor Full-Stack .NET
Sumaré, SP · Disponível para trabalho remoto

[![GitHub](https://img.shields.io/badge/GitHub-italo--afr-181717?logo=github)](https://github.com/italo-afr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-italoafr-0A66C2?logo=linkedin)](https://www.linkedin.com/in/italoafr/)
[![Email](https://img.shields.io/badge/Email-italoafr1%40gmail.com-EA4335?logo=gmail)](mailto:italoafr1@gmail.com)

---

## Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para o texto completo.
