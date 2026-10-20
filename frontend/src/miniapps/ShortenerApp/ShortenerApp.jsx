import { useEffect, useState } from 'react'
import {
  createShortLink,
  deleteShortLink,
  listShortLinks,
} from '../../services/shortener'
import ShortLinkRow from './ShortLinkRow'

export default function ShortenerApp() {
  const [links, setLinks] = useState([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  // Código recém-criado, para destacar a linha por alguns segundos.
  const [criado, setCriado] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await listShortLinks()
        if (cancelled) return
        setLinks(data)
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const alvo = url.trim()
    if (!alvo || busy) return

    setBusy(true)
    setError(null)

    try {
      const novo = await createShortLink(alvo)
      // Entra na frente porque a lista vem do mais novo para o mais antigo.
      setLinks((atual) => [novo, ...atual])
      setCriado(novo.code)
      setUrl('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id) {
    setBusy(true)
    setError(null)

    try {
      await deleteShortLink(id)
      setLinks((atual) => atual.filter((l) => l.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const cliques = links.reduce((total, l) => total + l.clicks, 0)

  return (
    <div className="p-5 sm:p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="url-destino" className="sr-only">
          URL para encurtar
        </label>
        <input
          id="url-destino"
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole um link longo — exemplo.com/pagina/bem/comprida"
          className="min-w-0 flex-1 rounded-lg border border-line bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-600 focus:border-accent-500/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || url.trim().length === 0}
          className="shrink-0 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-400 disabled:opacity-50"
        >
          {busy ? 'Encurtando…' : 'Encurtar'}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-5">
        {loading ? (
          <ul className="space-y-2">
            {[0, 1].map((i) => (
              <li
                key={i}
                className="h-20 animate-pulse rounded-lg border border-line-soft bg-ink-850"
              />
            ))}
          </ul>
        ) : links.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-6 py-12 text-center text-sm text-mist-600">
            Nenhum link ainda. Cole um endereço acima para criar o primeiro.
          </p>
        ) : (
          <ul className="space-y-2">
            {links.map((link) => (
              <ShortLinkRow
                key={link.id}
                link={link}
                destacado={link.code === criado}
                disabled={busy}
                onDelete={() => handleDelete(link.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 border-t border-line-soft pt-4 font-mono text-xs leading-relaxed text-mist-600">
        {links.length} link{links.length === 1 ? '' : 's'} · {cliques} clique
        {cliques === 1 ? '' : 's'} · criados por{' '}
        <span className="text-mist-500">POST /api/shorten</span>, seguidos por{' '}
        <span className="text-mist-500">GET /r/{'{codigo}'}</span>
        <br />
        Os links são seus: ficam nesta sessão e expiram em 7 dias.
      </p>
    </div>
  )
}
