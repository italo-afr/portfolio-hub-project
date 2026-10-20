import { request } from './api'
import { getSessionId } from '../miniapps/session'

// Espelha o ShortenerController (backend/Controllers/ShortenerController.cs).
// A sessão vai em toda chamada: a lista é isolada por visitante.

const STORAGE_KEY = 'shortener-session'

function session() {
  return getSessionId(STORAGE_KEY)
}

export function listShortLinks() {
  return request(`/shorten?session=${encodeURIComponent(session())}`)
}

export function createShortLink(url) {
  return request('/shorten', {
    method: 'POST',
    body: { url, session: session() },
  })
}

export function deleteShortLink(id) {
  return request(`/shorten/${id}?session=${encodeURIComponent(session())}`, {
    method: 'DELETE',
  })
}
