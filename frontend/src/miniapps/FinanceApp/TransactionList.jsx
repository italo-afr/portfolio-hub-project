import { formatCurrency, formatDay } from './format'
import { SERIES } from './series'

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" />
      <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
    </svg>
  )
}

/**
 * A lista funciona também como a visão em tabela do gráfico: os mesmos números,
 * legíveis sem depender de cor.
 */
export default function TransactionList({ transactions, onDelete, disabled }) {
  if (transactions.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line px-6 py-12 text-center text-sm text-mist-600">
        Nenhuma transação neste período.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-line-soft">
      {transactions.map((t) => {
        const series = SERIES[t.type]
        const isIncome = t.type === 'income'

        return (
          <li key={t.id} className="group flex items-center gap-3 py-3">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-sm"
              style={{ background: series.color }}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-mist-100">{t.title}</p>
              <p className="mt-0.5 text-xs text-mist-600">
                {formatDay(t.date)} · {t.category} · {series.label}
              </p>
            </div>

            <span className="shrink-0 font-mono text-sm text-mist-100 tabular-nums">
              {isIncome ? '+' : '−'} {formatCurrency(t.amount)}
            </span>

            <button
              type="button"
              onClick={() => onDelete(t.id)}
              disabled={disabled}
              aria-label={`Excluir ${t.title}`}
              className="shrink-0 rounded-md p-1.5 text-mist-600 opacity-100 transition hover:bg-danger-bg hover:text-danger disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            >
              <TrashIcon />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
