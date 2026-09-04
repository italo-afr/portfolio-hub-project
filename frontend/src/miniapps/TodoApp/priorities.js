// Os valores batem com o enum TodoPriority do backend (serializado como texto).
export const PRIORITIES = [
  { value: 'High', label: 'Alta', className: 'text-danger border-danger-border bg-danger-bg' },
  { value: 'Normal', label: 'Normal', className: 'text-mist-500 border-line bg-surface-2' },
  { value: 'Low', label: 'Baixa', className: 'text-info border-info-border bg-info-bg' },
]

export function priorityOf(value) {
  return PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[1]
}
