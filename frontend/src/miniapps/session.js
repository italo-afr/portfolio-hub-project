/**
 * Identificador de sessão do visitante, usado pelos mini-apps que isolam dados
 * por pessoa (o chat e o encurtador).
 *
 * Fica em localStorage, e não em sessionStorage, para as abas do mesmo
 * navegador se enxergarem — é o que faz o chat conversar entre duas abas. Se o
 * storage estiver bloqueado, cai num id de memória: o mini-app continua
 * funcionando, só não sobrevive ao recarregar a página.
 *
 * Cada mini-app usa a sua chave, então o que foi criado num não aparece no outro.
 */

/** Gera um id opaco no formato que o servidor valida: [A-Za-z0-9_-]{8,40}. */
function generate() {
  if (crypto.randomUUID) {
    return crypto.randomUUID().replaceAll('-', '')
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

const fallbacks = new Map()

export function getSessionId(storageKey) {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved) return saved

    const created = generate()
    localStorage.setItem(storageKey, created)
    return created
  } catch {
    if (!fallbacks.has(storageKey)) {
      fallbacks.set(storageKey, generate())
    }

    return fallbacks.get(storageKey)
  }
}
