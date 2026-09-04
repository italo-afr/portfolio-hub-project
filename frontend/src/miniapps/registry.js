import { lazy } from 'react'

/**
 * Mini-apps que rodam embutidos no portfólio, indexados pelo slug do projeto.
 *
 * O import é lazy de propósito: o bundle de cada mini-app só é baixado quando
 * o visitante abre aquele projeto, então a Home continua leve conforme a
 * lista cresce.
 *
 * Para adicionar um novo: crie a pasta em src/miniapps/, registre o slug aqui
 * e marque o projeto como type: 'embedded' em src/data/portfolio.js.
 */
export const miniApps = {
  'todo-list': lazy(() => import('./TodoApp/TodoApp.jsx')),
  'finance-tracker': lazy(() => import('./FinanceApp/FinanceApp.jsx')),
  'chat-room': lazy(() => import('./ChatApp/ChatApp.jsx')),
}

export function getMiniApp(slug) {
  return miniApps[slug] ?? null
}
