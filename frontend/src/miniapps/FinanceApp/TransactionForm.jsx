import { useState } from 'react'
import { today } from './format'

const CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: [
    'Moradia',
    'Alimentação',
    'Transporte',
    'Contas',
    'Saúde',
    'Educação',
    'Lazer',
    'Outros',
  ],
}

const empty = () => ({
  title: '',
  amount: '',
  type: 'expense',
  category: 'Moradia',
  date: today(),
})

export default function TransactionForm({ onSubmit, disabled }) {
  const [values, setValues] = useState(empty)

  const set = (field) => (event) => {
    const { value } = event.target

    // Trocar o tipo troca a lista de categorias, então a atual pode não existir mais.
    if (field === 'type') {
      setValues((prev) => ({ ...prev, type: value, category: CATEGORIES[value][0] }))
      return
    }

    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const amount = Number(values.amount)
    if (!values.title.trim() || !Number.isFinite(amount) || amount <= 0) return

    // Só limpa se a API confirmou — senão o que foi digitado se perde.
    const ok = await onSubmit({ ...values, title: values.title.trim(), amount })
    if (ok) setValues(empty())
  }

  // min-w-0 é obrigatório: sem ele o min-width:auto do grid impede o campo de
  // encolher e a linha estoura a largura do card.
  const field =
    'min-w-0 rounded-lg border border-line bg-ink-850 px-3 py-2.5 text-sm text-mist-100 placeholder:text-mist-600 focus:border-accent-500/40 focus:ring-2 focus:ring-accent-500/20 focus:outline-none'

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1.1fr_1.1fr_auto]"
    >
      <input
        type="text"
        value={values.title}
        onChange={set('title')}
        maxLength={120}
        placeholder="Descrição"
        aria-label="Descrição"
        className={field}
      />

      <input
        type="number"
        value={values.amount}
        onChange={set('amount')}
        min="0.01"
        step="0.01"
        placeholder="0,00"
        aria-label="Valor"
        className={field}
      />

      <select
        value={values.type}
        onChange={set('type')}
        aria-label="Tipo"
        className={field}
      >
        <option value="expense">Despesa</option>
        <option value="income">Receita</option>
      </select>

      <select
        value={values.category}
        onChange={set('category')}
        aria-label="Categoria"
        className={field}
      >
        {CATEGORIES[values.type].map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={values.date}
        onChange={set('date')}
        aria-label="Data"
        className={`${field} `}
      />

      <button
        type="submit"
        disabled={disabled || !values.title.trim() || !values.amount}
        className="shrink-0 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Adicionar
      </button>
    </form>
  )
}
