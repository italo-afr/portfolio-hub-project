// Cliente da API. Em dev o Vite faz proxy de /api para o backend (ver vite.config.js).
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

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

export function fetchProjects() {
  return request('/projects')
}

export function fetchProject(slug) {
  return request(`/projects/${slug}`)
}
