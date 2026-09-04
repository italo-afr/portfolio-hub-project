import { useState } from 'react'
import { PRIORITIES } from './priorities'

const EMPTY = { title: '', notes: '', priority: 'Normal' }

export default function TodoForm({ onSubmit, disabled }) {
  const [values, setValues] = useState(EMPTY)
  const [expanded, setExpanded] = useState(false)

  const set = (field) => (event) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event) {
    event.preventDefault()
    if (!values.title.trim()) return

    // Só limpa o formulário se a API confirmou — senão o texto digitado se perde.
    const ok = await onSubmit(values)
    if (ok) {
      setValues(EMPTY)
      setExpanded(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="text"
          value={values.title}
          onChange={set('title')}
          onFocus={() => setExpanded(true)}
          maxLength={200}
          placeholder="O que precisa ser feito?"
          aria-label="Título da tarefa"
          className="min-w-0 flex-1 rounded-lg border border-line bg-ink-850 px-4 py-2.5 text-sm text-mist-100 placeholder:text-mist-600 focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
        />
        <button
          type="submit"
          disabled={disabled || !values.title.trim()}
          className="shrink-0 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Adicionar
        </button>
      </div>

      {expanded && (
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={values.notes}
            onChange={set('notes')}
            maxLength={1000}
            placeholder="Notas (opcional)"
            aria-label="Notas da tarefa"
            className="min-w-0 flex-1 rounded-lg border border-line bg-ink-850 px-4 py-2 text-sm text-mist-300 placeholder:text-mist-600 focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
          />
          <select
            value={values.priority}
            onChange={set('priority')}
            aria-label="Prioridade"
            className="rounded-lg border border-line bg-ink-850 px-3 py-2 text-sm text-mist-300 focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </form>
  )
}
