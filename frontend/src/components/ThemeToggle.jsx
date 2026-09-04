import { useEffect, useState } from 'react'
import { applyTheme, readTheme, saveTheme } from '../theme'

function SunIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  )
}

export default function ThemeToggle() {
  // O tema real já foi aplicado pelo script inline no <head>; aqui só lemos
  // o que ele decidiu, para o botão nascer com o rótulo certo.
  const [theme, setTheme] = useState(() =>
    typeof document === 'undefined'
      ? 'dark'
      : (document.documentElement.dataset.theme ?? readTheme()),
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className="rounded-lg p-2 text-mist-500 transition hover:bg-surface-2 hover:text-mist-100"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
