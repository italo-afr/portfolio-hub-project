import { STATUS } from './useChatConnection'

const TONE = {
  idle: 'border-line bg-surface-2 text-mist-500',
  pending: 'border-warn/35 bg-warn/10 text-warn',
  ok: 'border-accent-500/25 bg-accent-500/8 text-accent-400',
  error: 'border-danger-border bg-danger-bg text-danger',
}

const DOT = {
  idle: 'bg-mist-600',
  pending: 'bg-warn',
  ok: 'bg-accent-400',
  error: 'bg-danger',
}

/** O estado da conexão fica sempre visível — num app de tempo real isso é informação, não enfeite. */
export default function StatusPill({ status }) {
  const { label, tone } = STATUS[status] ?? STATUS.idle

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONE[tone]}`}
    >
      <span className="relative flex size-1.5">
        {tone === 'pending' && (
          <span className={`absolute inline-flex size-full animate-ping rounded-full ${DOT[tone]} opacity-70`} />
        )}
        <span className={`relative inline-flex size-1.5 rounded-full ${DOT[tone]}`} />
      </span>
      {label}
    </span>
  )
}
