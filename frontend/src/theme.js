const STORAGE_KEY = 'portfolio-theme'

export const THEMES = ['dark', 'light']

/** Lê a preferência salva; sem nada salvo, segue o sistema. */
export function readTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (THEMES.includes(saved)) return saved
  } catch {
    // localStorage bloqueado (aba anônima, cookies desativados): segue o sistema.
  }

  return window.matchMedia?.('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Sem persistência disponível; a escolha vale só para esta sessão.
  }
}
