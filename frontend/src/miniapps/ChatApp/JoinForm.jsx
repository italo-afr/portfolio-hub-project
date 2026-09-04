import { useState } from 'react'

export default function JoinForm({ rooms, disabled, onJoin }) {
  const [name, setName] = useState('')
  const [room, setRoom] = useState(rooms[0] ?? 'geral')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    onJoin({ name: name.trim(), room })
  }

  const field =
    'min-w-0 rounded-lg border border-line bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-600 focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/20 focus:outline-none'

  return (
    <div className="grid place-items-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <h3 className="text-lg font-semibold text-mist-100">Entrar no chat</h3>
        <p className="mt-2 text-sm text-mist-500">
          Escolha um nome e uma sala. Abra em duas abas para ver o tempo real
          funcionando.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-2 text-left">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={32}
            placeholder="Seu nome"
            aria-label="Seu nome"
            className={`w-full ${field}`}
          />

          <select
            value={room}
            onChange={(event) => setRoom(event.target.value)}
            aria-label="Sala"
            className={`w-full ${field}`}
          >
            {rooms.map((option) => (
              <option key={option} value={option}>
                #{option}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={disabled || !name.trim()}
            className="w-full rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {disabled ? 'Aguardando conexão…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
