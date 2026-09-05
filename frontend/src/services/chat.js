import { request } from './api'

/**
 * Últimas 50 mensagens da sala. As salas são isoladas por visitante, então a
 * sessão é obrigatória — sem ela o servidor não sabe qual sala consultar.
 */
export function listMessages(room, session) {
  const params = new URLSearchParams({ room, session })
  return request(`/chat/messages?${params}`)
}

export function listRooms() {
  return request('/chat/rooms')
}

/**
 * URL do hub. Em dev o Vite faz proxy de /hubs (com ws: true); em produção,
 * VITE_HUB_URL aponta para o host da API.
 */
export const HUB_URL = import.meta.env.VITE_HUB_URL ?? '/hubs/chat'
