import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks, profile } from '../data/portfolio'
import { CloseIcon, MenuIcon } from './Icons'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fora da Home as âncoras precisam voltar para "/" antes de rolar.
  const hrefFor = (hash) => (isHome ? hash : `/${hash}`)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-line-soft bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-2.5 text-sm font-semibold text-mist-100"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-accent-500/10 font-mono text-accent-400 ring-1 ring-accent-500/20 transition group-hover:bg-accent-500/15">
            íf
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={hrefFor(link.href)}
                className="rounded-lg px-3 py-2 text-sm text-mist-500 transition hover:bg-surface-2 hover:text-mist-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <a
            href={`mailto:${profile.email}`}
            className="hidden rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-on-accent transition hover:bg-accent-400 sm:inline-block"
          >
            Fale comigo
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            className="rounded-lg p-2 text-mist-300 transition hover:bg-surface-2 hover:text-mist-100 md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line-soft md:hidden">
          <ul className="mx-auto max-w-6xl space-y-1 px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={hrefFor(link.href)}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-mist-300 transition hover:bg-surface-2 hover:text-mist-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="mt-2 block rounded-lg bg-accent-500 px-3 py-2.5 text-center text-sm font-semibold text-on-accent"
              >
                Fale comigo
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
