import { useCallback, useEffect, useRef, useState } from 'react'
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr'
import { HUB_URL } from '../../services/chat'

export const STATUS = {
  idle: { label: 'Desconectado', tone: 'idle' },
  connecting: { label: 'Conectando…', tone: 'pending' },
  connected: { label: 'Conectado', tone: 'ok' },
  reconnecting: { label: 'Reconectando…', tone: 'pending' },
  failed: { label: 'Falha na conexão', tone: 'error' },
}

/**
 * Encapsula o ciclo de vida da conexão SignalR: cria uma vez, registra os
 * handlers e desliga ao desmontar. Os callbacks ficam numa ref para que trocar
 * de handler não exija reconectar.
 */
export default function useChatConnection({ onMessage, onPresence }) {
  const connectionRef = useRef(null)
  const handlersRef = useRef({ onMessage, onPresence })
  const [status, setStatus] = useState('connecting')
  const [error, setError] = useState(null)

  useEffect(() => {
    handlersRef.current = { onMessage, onPresence }
  })

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    connection.on('ReceiveMessage', (message) =>
      handlersRef.current.onMessage?.(message),
    )
    connection.on('UserJoined', (user, room) =>
      handlersRef.current.onPresence?.({ type: 'joined', user, room }),
    )
    connection.on('UserLeft', (user, room) =>
      handlersRef.current.onPresence?.({ type: 'left', user, room }),
    )

    connection.onreconnecting(() => setStatus('reconnecting'))
    connection.onreconnected(() => setStatus('connected'))
    connection.onclose(() => setStatus('idle'))

    connectionRef.current = connection

    let cancelled = false

    // O .catch faz esta promise sempre resolver, então dá para aguardá-la
    // na limpeza sem risco de rejeição não tratada.
    const started = connection
      .start()
      .then(() => {
        if (!cancelled) setStatus('connected')
      })
      .catch((err) => {
        if (cancelled) return
        setStatus('failed')
        setError(err.message)
      })

    return () => {
      cancelled = true
      // Espera a negociação terminar antes de encerrar. Chamar stop() no meio
      // do handshake gera "The connection was stopped during negotiation" —
      // o StrictMode em dev monta/desmonta/remonta e caía exatamente nisso.
      started.finally(() => connection.stop())
    }
  }, [])

  const invoke = useCallback(async (method, ...args) => {
    const connection = connectionRef.current
    if (connection?.state !== HubConnectionState.Connected) {
      throw new Error('Sem conexão com o servidor. Aguarde a reconexão.')
    }
    return connection.invoke(method, ...args)
  }, [])

  return { status, error, invoke, setError }
}
