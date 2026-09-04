import { useEffect, useRef } from 'react'

const time = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

/** O servidor grava em UTC sem sufixo; marca como UTC antes de exibir no fuso local. */
function formatTime(sentAt) {
  const iso = sentAt.endsWith('Z') ? sentAt : `${sentAt}Z`
  return time.format(new Date(iso))
}

/**
 * Cor estável por nome, para dar identidade a cada participante. São tokens de
 * tema (não classes fixas) porque o passo claro do modo escuro fica ilegível
 * sobre fundo branco — cada var tem um valor por modo.
 */
const NAME_COLORS = [
  'var(--color-name-1)',
  'var(--color-name-2)',
  'var(--color-name-3)',
  'var(--color-name-4)',
  'var(--color-name-5)',
  'var(--color-name-6)',
]

function colorFor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return NAME_COLORS[Math.abs(hash) % NAME_COLORS.length]
}

export default function MessageList({ items, currentUser }) {
  const endRef = useRef(null)

  // Rola para o fim quando chega mensagem nova.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [items])

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Mensagens do chat"
      className="h-80 space-y-3 overflow-y-auto rounded-lg border border-line bg-ink-950/40 p-4"
    >
      {items.length === 0 && (
        <p className="grid h-full place-items-center text-sm text-mist-600">
          Nenhuma mensagem nesta sala ainda. Diga oi.
        </p>
      )}

      {items.map((item) =>
        item.kind === 'presence' ? (
          <p
            key={item.key}
            className="text-center text-xs text-mist-600 italic"
          >
            {item.user} {item.type === 'joined' ? 'entrou na sala' : 'saiu da sala'}
          </p>
        ) : (
          <div key={item.key} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-surface-2 text-xs font-semibold text-mist-300"
            >
              {item.user.slice(0, 2).toUpperCase()}
            </span>

            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: colorFor(item.user) }}
                >
                  {item.user}
                  {item.user === currentUser && (
                    <span className="ml-1.5 text-xs font-normal text-mist-600">
                      você
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs text-mist-600">
                  {formatTime(item.sentAt)}
                </span>
              </p>
              {/* O React escapa o texto: nada de HTML injetado por participante. */}
              <p className="mt-0.5 text-sm break-words text-mist-300">
                {item.text}
              </p>
            </div>
          </div>
        ),
      )}

      <div ref={endRef} />
    </div>
  )
}
