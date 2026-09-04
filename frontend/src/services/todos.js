import { request } from './api'

// Espelha os endpoints do TodoController (backend/Controllers/TodoController.cs).

export function listTodos(status = 'all') {
  return request(`/todos?status=${encodeURIComponent(status)}`)
}

export function createTodo({ title, notes, priority }) {
  return request('/todos', {
    method: 'POST',
    body: { title, notes: notes || null, priority },
  })
}

export function updateTodo(id, { title, notes, priority, isDone }) {
  return request(`/todos/${id}`, {
    method: 'PUT',
    body: { title, notes: notes || null, priority, isDone },
  })
}

export function toggleTodo(id) {
  return request(`/todos/${id}/toggle`, { method: 'PATCH' })
}

export function deleteTodo(id) {
  return request(`/todos/${id}`, { method: 'DELETE' })
}

export function deleteCompletedTodos() {
  return request('/todos/completed', { method: 'DELETE' })
}
