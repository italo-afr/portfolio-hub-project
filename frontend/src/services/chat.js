import { request } from './api'

/** Últimas 50 mensagens da sala — usado antes de a conexão SignalR subir. */
export function listMessages(room) {
  return request(`/chat/messages?room=${encodeURIComponent(room)}`)
}

export function listRooms() {
  return request('/chat/rooms')
}

/**
 * URL do hub. Em dev o Vite faz proxy de /hubs (com ws: true); em produção,
 * VITE_HUB_URL aponta para o host da API.
 */
export const HUB_URL = import.meta.env.VITE_HUB_URL ?? '/hubs/chat'
