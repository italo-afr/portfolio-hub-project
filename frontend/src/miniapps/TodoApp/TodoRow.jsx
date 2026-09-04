import { useState } from 'react'
import { PRIORITIES, priorityOf } from './priorities'

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 5 5 9-11" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" />
      <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h4L20 8a2.5 2.5 0 0 0-3.5-3.5L4 16v4Z" />
      <path d="M14.5 6.5 17.5 9.5" />
    </svg>
  )
}

export default function TodoRow({ todo, onToggle, onDelete, onSave, disabled }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo)

  const priority = priorityOf(todo.priority)

  function startEditing() {
    setDraft(todo)
    setEditing(true)
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!draft.title.trim()) return

    const ok = await onSave({
      title: draft.title,
      notes: draft.notes,
      priority: draft.priority,
      isDone: todo.isDone,
    })
    if (ok) setEditing(false)
  }

  if (editing) {
    return (
      <li className="rounded-lg border border-accent-500/25 bg-ink-850 p-3">
        <form onSubmit={handleSave} className="space-y-2">
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            maxLength={200}
            aria-label="Título"
            className="w-full rounded-md border border-line bg-ink-900 px-3 py-2 text-sm text-mist-100 focus:border-accent-500/40 focus:outline-none"
          />
          <input
            type="text"
            value={draft.notes ?? ''}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            maxLength={1000}
            placeholder="Notas"
            aria-label="Notas"
            className="w-full rounded-md border border-line bg-ink-900 px-3 py-2 text-sm text-mist-300 placeholder:text-mist-600 focus:border-accent-500/40 focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
              aria-label="Prioridade"
              className="rounded-md border border-line bg-ink-900 px-2.5 py-1.5 text-sm text-mist-300 focus:border-accent-500/40 focus:outline-none"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={disabled || !draft.title.trim()}
              className="rounded-md bg-accent-500 px-3 py-1.5 text-sm font-semibold text-on-accent transition hover:bg-accent-400 disabled:opacity-40"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md px-3 py-1.5 text-sm text-mist-500 transition hover:text-mist-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-line bg-ink-850 p-3 transition hover:border-line-strong">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        role="checkbox"
        aria-checked={todo.isDone}
        aria-label={todo.isDone ? 'Reabrir tarefa' : 'Concluir tarefa'}
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition disabled:opacity-50 ${
          todo.isDone
            ? 'border-accent-500 bg-accent-500 text-on-accent'
            : 'border-line-strong text-transparent hover:border-accent-500/60'
        }`}
      >
        <CheckIcon />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${
            todo.isDone ? 'text-mist-600 line-through' : 'text-mist-100'
          }`}
        >
          {todo.title}
        </p>
        {todo.notes && (
          <p className="mt-1 text-xs leading-relaxed text-mist-600">{todo.notes}</p>
        )}
      </div>

      <span
        className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium ${priority.className}`}
      >
        {priority.label}
      </span>

      {/* Ações sempre visíveis no toque; no desktop aparecem no hover/foco. */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={startEditing}
          disabled={disabled}
          aria-label={`Editar ${todo.title}`}
          className="rounded-md p-1.5 text-mist-600 transition hover:bg-surface-2 hover:text-mist-100 disabled:opacity-50"
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          aria-label={`Excluir ${todo.title}`}
          className="rounded-md p-1.5 text-mist-600 transition hover:bg-danger-bg hover:text-danger disabled:opacity-50"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  )
}
