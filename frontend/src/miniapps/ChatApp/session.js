const STORAGE_KEY = 'chat-session'

/** Gera um id opaco no formato que o servidor valida: [A-Za-z0-9_-]{8,40}. */
function generate() {
  if (crypto.randomUUID) {
    return crypto.randomUUID().replaceAll('-', '')
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Identificador da sessão do visitante.
 *
 * As salas do chat são isoladas por sessão: duas abas do mesmo navegador
 * compartilham este id e conversam entre si, mas ninguém vê — nem deixa —
 * mensagem para outro visitante do portfólio.
 *
 * Fica em localStorage (não sessionStorage) justamente para as abas se
 * enxergarem. Se o storage estiver bloqueado, cai num id de memória: o chat
 * continua funcionando, só não sobrevive ao recarregar a página.
 */
let fallback = null

export function getSessionId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved

    const created = generate()
    localStorage.setItem(STORAGE_KEY, created)
    return created
  } catch {
    fallback ??= generate()
    return fallback
  }
}
