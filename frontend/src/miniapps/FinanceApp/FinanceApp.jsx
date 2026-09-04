import { useEffect, useState } from 'react'
import {
  createTransaction,
  deleteTransaction,
  getSummary,
  listTransactions,
} from '../../services/finance'
import FinanceChart from './FinanceChart'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import { formatCurrency, formatMonth } from './format'

const ALL = 'all'

function StatTile({ label, value, tone = 'neutral' }) {
  const toneClass = {
    neutral: 'text-mist-100',
    positive: 'text-accent-400',
    negative: 'text-danger',
  }[tone]

  return (
    <div className="rounded-lg border border-line bg-ink-850 px-4 py-3">
      <dt className="text-xs text-mist-600">{label}</dt>
      <dd className={`mt-1 font-mono text-lg font-semibold tabular-nums ${toneClass}`}>
        {formatCurrency(value)}
      </dd>
    </div>
  )
}

export default function FinanceApp() {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [month, setMonth] = useState(ALL)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  // Incrementado após cada mutação para o efeito abaixo recarregar tudo.
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // As duas chamadas são independentes — vão juntas.
        const [nextSummary, nextTransactions] = await Promise.all([
          getSummary(),
          listTransactions(month === ALL ? {} : { month }),
        ])
        if (cancelled) return
        setSummary(nextSummary)
        setTransactions(nextTransactions)
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    // Evita aplicar a resposta de um mês que o usuário já trocou.
    return () => {
      cancelled = true
    }
  }, [month, reloadKey])

  function changeMonth(next) {
    if (next === month) return
    setLoading(true)
    setMonth(next)
  }

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

  const months = summary?.months ?? []

  // Com um mês selecionado os totais são os dele; em "todos", os consolidados.
  const totals =
    month === ALL
      ? {
          income: summary?.totalIncome ?? 0,
          expense: summary?.totalExpense ?? 0,
          balance: summary?.balance ?? 0,
        }
      : (months.find((m) => m.month === month) ?? {
          income: 0,
          expense: 0,
          balance: 0,
        })

  return (
    <div className="p-5 sm:p-6">
      <TransactionForm
        disabled={busy}
        onSubmit={(values) =>
          mutate(() =>
            createTransaction({
              title: values.title,
              amount: values.amount,
              type: values.type,
              category: values.category,
              date: values.date,
            }),
          )
        }
      />

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[68px] animate-pulse rounded-lg border border-line-soft bg-ink-850"
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-lg border border-line-soft bg-ink-850" />
        </div>
      ) : (
        <>
          <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile label="Receita" value={totals.income} tone="positive" />
            <StatTile label="Despesa" value={totals.expense} tone="negative" />
            <StatTile
              label="Saldo"
              value={totals.balance}
              tone={totals.balance < 0 ? 'negative' : 'neutral'}
            />
          </dl>

          <section className="mt-6">
            <h3 className="text-sm font-medium text-mist-300">
              Receita x despesa por mês
            </h3>
            <div className="mt-3">
              <FinanceChart months={months} />
            </div>
          </section>

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-mist-300">
                Transações
                <span className="ml-2 font-mono text-xs text-mist-600">
                  {transactions.length}
                </span>
              </h3>

              <label className="flex items-center gap-2 text-xs text-mist-600">
                Mês
                <select
                  value={month}
                  onChange={(event) => changeMonth(event.target.value)}
                  className="rounded-lg border border-line bg-ink-850 px-3 py-1.5 text-sm text-mist-300 focus:border-accent-500/40 focus:outline-none"
                >
                  <option value={ALL}>Todos</option>
                  {[...months].reverse().map((m) => (
                    <option key={m.month} value={m.month}>
                      {formatMonth(m.month)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-2">
              <TransactionList
                transactions={transactions}
                disabled={busy}
                onDelete={(id) => mutate(() => deleteTransaction(id))}
              />
            </div>
          </section>
        </>
      )}

      <p className="mt-6 border-t border-line-soft pt-4 font-mono text-xs text-mist-600">
        Totais agregados no banco por{' '}
        <span className="text-mist-500">GET /api/finance/summary</span>
      </p>
    </div>
  )
}
