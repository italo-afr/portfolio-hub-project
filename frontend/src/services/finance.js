import { request } from './api'

// Espelha os endpoints do FinanceController (backend/Controllers/FinanceController.cs).

export function listTransactions({ month, type } = {}) {
  const params = new URLSearchParams()
  if (month) params.set('month', month)
  if (type) params.set('type', type)

  const query = params.toString()
  return request(`/finance/transactions${query ? `?${query}` : ''}`)
}

export function createTransaction(payload) {
  return request('/finance/transactions', { method: 'POST', body: payload })
}

export function updateTransaction(id, payload) {
  return request(`/finance/transactions/${id}`, { method: 'PUT', body: payload })
}

export function deleteTransaction(id) {
  return request(`/finance/transactions/${id}`, { method: 'DELETE' })
}

export function getSummary() {
  return request('/finance/summary')
}
