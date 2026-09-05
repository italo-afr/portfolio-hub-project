import { useCallback, useEffect, useRef, useState } from 'react'
import JoinForm from './JoinForm'
import MessageList from './MessageList'
import StatusPill from './StatusPill'
import useChatConnection from './useChatConnection'
import { getSessionId } from './session'

const ROOMS = ['geral', 'dotnet', 'frontend', 'devops']

// Isola as salas por visitante — ver session.js e o ChatHub no backend.
const SESSION_ID = getSessionId()

export default function ChatApp() {
  const [session, setSession] = useState(null)
  const [items, setItems] = useState([])
  const [draft, setDraft] = useState('')
  const [joining, setJoining] = useState(false)
  const [sendError, setSendError] = useState(null)
  // Contador só para dar chave única aos eventos de presença.
  const presenceKey = useRef(0)

  const handleMessage = useCallback((message) => {
    setItems((prev) => [
      ...prev,
      { ...message, kind: 'message', key: `m-${message.id}` },
    ])
  }, [])

  const handlePresence = useCallback((event) => {
    presenceKey.current += 1
    setItems((prev) => [
      ...prev,
      { ...event, kind: 'presence', key: `p-${presenceKey.current}` },
    ])
  }, [])

  const { status, error, invoke } = useChatConnection({
    onMessage: handleMessage,
    onPresence: handlePresence,
  })

  const connected = status === 'connected'

  const join = useCallback(
    async ({ name, room }) => {
      setJoining(true)
      setSendError(null)
      try {
        const history = await invoke('JoinRoom', room, name, SESSION_ID)
        setItems(
          history.map((message) => ({
            ...message,
            kind: 'message',
            key: `m-${message.id}`,
          })),
        )
        setSession({ name, room })
      } catch (err) {
        setSendError(err.message)
      } finally {
        setJoining(false)
      }
    },
    [invoke],
  )

  async function switchRoom(room) {
    if (!session || room === session.room) return
    await join({ name: session.name, room })
  }

  async function send(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setSendError(null)
    try {
      await invoke('SendMessage', text)
      setDraft('')
    } catch (err) {
      setSendError(err.message)
    }
  }

  // Se a conexão cair e voltar, o SignalR reconecta com uma conexão nova —
  // que não está mais no grupo do servidor. Reentrar mantém o recebimento.
  const sessionRef = useRef(null)
  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    // Na primeira conexão ainda não há sessão, então isto só age após uma queda.
    const current = sessionRef.current
    if (status !== 'connected' || !current) return
    invoke('JoinRoom', current.room, current.name, SESSION_ID).catch(() => {})
  }, [status, invoke])

  if (!session) {
    return (
      <>
        <header className="flex items-center justify-between border-b border-line-soft px-5 py-3 sm:px-6">
          <span className="font-mono text-xs text-mist-600">SignalR · WebSocket</span>
          <StatusPill status={status} />
        </header>

        {(error || sendError) && (
          <p
            role="alert"
            className="mx-5 mt-4 rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger sm:mx-6"
          >
            {error ?? sendError}
          </p>
        )}

        <JoinForm rooms={ROOMS} disabled={!connected || joining} onJoin={join} />
      </>
    )
  }

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-1">
          {ROOMS.map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => switchRoom(room)}
              disabled={joining}
              aria-current={room === session.room}
              className={`rounded-md px-2.5 py-1 font-mono text-xs transition disabled:opacity-50 ${
                room === session.room
                  ? 'bg-ink-700 text-mist-100'
                  : 'text-mist-600 hover:bg-surface-2 hover:text-mist-300'
              }`}
            >
              #{room}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-mist-600">
            como <span className="text-mist-300">{session.name}</span>
          </span>
          <StatusPill status={status} />
        </div>
      </header>

      <div className="p-5 sm:p-6">
        <MessageList items={items} currentUser={session.name} />

        {sendError && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-danger-border bg-danger-bg px-4 py-2.5 text-sm text-danger"
          >
            {sendError}
          </p>
        )}

        <form onSubmit={send} className="mt-3 flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={500}
            placeholder={`Mensagem em #${session.room}`}
            aria-label="Mensagem"
            className="min-w-0 flex-1 rounded-lg border border-line bg-ink-850 px-4 py-2.5 text-sm text-mist-100 placeholder:text-mist-600 focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!connected || !draft.trim()}
            className="shrink-0 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enviar
          </button>
        </form>

        <p className="mt-5 border-t border-line-soft pt-4 font-mono text-xs text-mist-600">
          Histórico por <span className="text-mist-500">GET /api/chat/messages</span> ·
          tempo real pelo hub <span className="text-mist-500">/hubs/chat</span>
        </p>
      </div>
    </>
  )
}
