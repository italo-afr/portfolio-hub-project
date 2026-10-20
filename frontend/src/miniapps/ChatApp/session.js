import { getSessionId as getShared } from '../session'

const STORAGE_KEY = 'chat-session'

/**
 * Identificador da sessão do visitante no chat.
 *
 * As salas são isoladas por sessão: duas abas do mesmo navegador compartilham
 * este id e conversam entre si, mas ninguém vê — nem deixa — mensagem para
 * outro visitante do portfólio.
 *
 * A mecânica vive em miniapps/session.js, compartilhada com o encurtador; aqui
 * fica só a chave, que não muda para as sessões já criadas continuarem valendo.
 */
export function getSessionId() {
  return getShared(STORAGE_KEY)
}
