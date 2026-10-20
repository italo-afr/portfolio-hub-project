import { useEffect, useState } from 'react'
import { ExternalIcon } from '../../components/Icons'

/** Tira o "https://www." do começo — o que interessa na lista é o destino. */
function enxuta(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

export default function ShortLinkRow({ link, destacado, disabled, onDelete }) {
  const [copiado, setCopiado] = useState(false)

  // Devolve o botão ao estado normal sozinho, sem o visitante precisar agir.
  useEffect(() => {
    if (!copiado) return

    const timer = setTimeout(() => setCopiado(false), 2000)
    return () => clearTimeout(timer)
  }, [copiado])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link.shortUrl)
      setCopiado(true)
    } catch {
      // Área de transferência bloqueada (permissão negada, http sem TLS):
      // selecionar o texto deixa o visitante copiar à mão.
      const campo = document.getElementById(`curto-${link.id}`)
      campo?.focus()
      campo?.select()
    }
  }

  return (
    <li
      className={`rounded-lg border bg-ink-850 px-4 py-3 transition ${
        destacado ? 'border-accent-500/40' : 'border-line-soft'
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {/*
          Input readOnly em vez de <span>: é o que permite selecionar o texto
          quando a área de transferência está bloqueada, e deixa a URL inteira
          acessível pelo teclado.
        */}
        <input
          id={`curto-${link.id}`}
          readOnly
          value={link.shortUrl}
          aria-label="URL curta"
          onFocus={(e) => e.target.select()}
          className="min-w-0 flex-1 bg-transparent font-mono text-sm text-accent-400 focus:outline-none"
        />

        <button
          type="button"
          onClick={copiar}
          className="shrink-0 rounded-md border border-line px-2.5 py-1 text-xs font-medium text-mist-300 transition hover:border-line-strong hover:text-mist-100"
        >
          {copiado ? 'Copiado' : 'Copiar'}
        </button>

        <a
          href={link.shortUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir ${link.shortUrl}`}
          className="shrink-0 rounded-md p-1.5 text-mist-500 transition hover:bg-ink-800 hover:text-mist-100"
        >
          <ExternalIcon width={14} height={14} />
        </a>

        <button
          type="button"
          disabled={disabled}
          onClick={onDelete}
          aria-label={`Apagar o link ${link.code}`}
          className="shrink-0 rounded-md px-2 py-1 text-xs text-mist-600 transition hover:text-danger disabled:opacity-50"
        >
          Apagar
        </button>
      </div>

      <p className="mt-1 truncate text-xs text-mist-500" title={link.targetUrl}>
        → {enxuta(link.targetUrl)}
      </p>

      <p className="mt-1 font-mono text-[11px] text-mist-600">
        expira em {link.expiresInDays} dia{link.expiresInDays === 1 ? '' : 's'} ·{' '}
        {link.clicks} clique{link.clicks === 1 ? '' : 's'}
      </p>
    </li>
  )
}
