import { useEffect, useState } from 'react'
import {
  createTodo,
  deleteCompletedTodos,
  deleteTodo,
  listTodos,
  toggleTodo,
  updateTodo,
} from '../../services/todos'
import TodoForm from './TodoForm'
import TodoRow from './TodoRow'

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'done', label: 'Concluídas' },
]

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  // Incrementado após cada mutação para o efeito abaixo recarregar a lista.
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await listTodos(filter)
        if (cancelled) return
        setTodos(data)
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    // Evita aplicar a resposta de um filtro que o usuário já trocou.
    return () => {
      cancelled = true
    }
  }, [filter, reloadKey])

  function changeFilter(next) {
    if (next === filter) return
    setLoading(true)
    setFilter(next)
  }

  /**
   * Roda uma mutação e recarrega a lista. Como o filtro ativo pode passar a
   * excluir o item alterado, recarregar do servidor é mais simples — e mais
   * honesto — do que remendar o estado local.
   */
  async function mutate(action) {
    setBusy(true)
    setError(null)
    try {
      await action()
      setReloadKey((key) => key + 1)
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setBusy(false)
    }
    return true
  }

  const pending = todos.filter((t) => !t.isDone).length
  const done = todos.filter((t) => t.isDone).length

  return (
    <div className="p-5 sm:p-6">
      <TodoForm
        disabled={busy}
        onSubmit={(values) => mutate(() => createTodo(values))}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filtrar tarefas"
          className="flex gap-1 rounded-lg bg-ink-850 p-1"
        >
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={filter === item.key}
              onClick={() => changeFilter(item.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                filter === item.key
                  ? 'bg-ink-700 text-mist-100'
                  : 'text-mist-500 hover:text-mist-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {done > 0 && (
          <button
            type="button"
            disabled={busy}
            onClick={() => mutate(deleteCompletedTodos)}
            className="text-sm text-mist-600 transition hover:text-danger disabled:opacity-50"
          >
            Limpar concluídas ({done})
          </button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-4">
        {loading ? (
          <ul className="space-y-2">
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="h-16 animate-pulse rounded-lg border border-line-soft bg-ink-850"
              />
            ))}
          </ul>
        ) : todos.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-6 py-12 text-center text-sm text-mist-600">
            {filter === 'done'
              ? 'Nenhuma tarefa concluída ainda.'
              : filter === 'pending'
                ? 'Nenhuma tarefa pendente — tudo em dia.'
                : 'Nenhuma tarefa. Crie a primeira acima.'}
          </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                disabled={busy}
                onToggle={() => mutate(() => toggleTodo(todo.id))}
                onDelete={() => mutate(() => deleteTodo(todo.id))}
                onSave={(values) => mutate(() => updateTodo(todo.id, values))}
              />
            ))}
          </ul>
        )}
      </div>

      <p className="mt-5 border-t border-line-soft pt-4 font-mono text-xs text-mist-600">
        {pending} pendente{pending === 1 ? '' : 's'} · {done} concluída
        {done === 1 ? '' : 's'} · dados reais de{' '}
        <span className="text-mist-500">GET /api/todos</span>
      </p>
    </div>
  )
}
