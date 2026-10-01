// Cliente da API. Em dev o Vite faz proxy de /api para o backend (ver vite.config.js).
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

/**
 * Teto de espera por resposta.
 *
 * O `fetch` não tem timeout próprio: sem isto a promise fica pendente enquanto
 * o servidor demorar. A API roda no plano gratuito do Render, que hiberna e leva
 * cerca de 60s para acordar — e nesse intervalo nada falhava, então quem depende
 * do catch (o fallback de projetos) nunca era acionado e a tela ficava em
 * esqueleto. Falhar rápido é melhor: o conteúdo local entra na hora.
 */
const TIMEOUT_MS = 8000

export async function request(path, { method = 'GET', body, timeoutMs = TIMEOUT_MS } = {}) {
  let response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    // TimeoutError vem do AbortSignal.timeout; AbortError cobre navegadores
    // que ainda reportam o cancelamento com o nome antigo.
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error(
        `A API não respondeu em ${timeoutMs / 1000}s. Ela pode estar hibernando — tente de novo em instantes.`,
        { cause: error },
      )
    }

    throw error
  }

  if (!response.ok) {
    throw new Error(await extractError(response, path))
  }

  // 204 No Content (DELETE) não traz corpo para desserializar.
  return response.status === 204 ? null : response.json()
}

/**
 * Traduz o corpo do erro para uma mensagem legível. A validação do
 * [ApiController] responde em ProblemDetails, com os erros por campo em `errors`.
 */
async function extractError(response, path) {
  try {
    const problem = await response.json()

    if (problem.errors) {
      const messages = Object.values(problem.errors).flat()
      if (messages.length > 0) {
        return messages.join(' ')
      }
    }

    if (problem.message || problem.title) {
      return problem.message ?? problem.title
    }
  } catch {
    // Resposta sem JSON: cai na mensagem genérica abaixo.
  }

  return `Erro ${response.status} ao chamar ${path}`
}

/**
 * Espera menor que o padrão: os projetos têm cópia local em data/portfolio.js,
 * então insistir na rede só atrasa a tela. As demais chamadas mantêm o teto
 * maior porque não têm de onde cair — para elas, esperar ainda vale a pena.
 */
const PROJECTS_TIMEOUT_MS = 4000

export function fetchProjects() {
  return request('/projects', { timeoutMs: PROJECTS_TIMEOUT_MS })
}

export function fetchProject(slug) {
  return request(`/projects/${slug}`)
}
