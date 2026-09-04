const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const monthLabel = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: '2-digit',
})

export function formatCurrency(value) {
  return currency.format(value ?? 0)
}

/** "2026-09" → "set/26". O pt-BR devolve "set. de 26"; queremos algo mais curto. */
export function formatMonth(month) {
  const [year, monthNumber] = month.split('-').map(Number)
  const parts = monthLabel.formatToParts(new Date(year, monthNumber - 1, 1))
  const name = parts.find((p) => p.type === 'month')?.value.replace('.', '') ?? ''
  const shortYear = parts.find((p) => p.type === 'year')?.value ?? ''
  return `${name}/${shortYear}`
}

/** "2026-09-14" → "14/09" — a data vem como DateOnly, sem fuso envolvido. */
export function formatDay(date) {
  const [, month, day] = date.split('-')
  return `${day}/${month}`
}

/** Hoje como "yyyy-MM-dd", para o valor inicial do input date. */
export function today() {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
}
