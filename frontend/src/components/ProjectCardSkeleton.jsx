/**
 * Placeholder com a mesma altura e ritmo do ProjectCard, para a grade não
 * saltar quando os dados chegam.
 */
export default function ProjectCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-xl border border-line bg-ink-900 p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 w-32 rounded bg-surface-2" />
        <div className="h-5 w-20 rounded-full bg-surface-2" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-surface-2" />
        <div className="h-3 w-11/12 rounded bg-surface-2" />
        <div className="h-3 w-4/5 rounded bg-surface-2" />
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {[14, 20, 12, 16].map((w, i) => (
          <div key={i} className="h-5 rounded bg-surface-2" style={{ width: `${w * 4}px` }} />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line-soft pt-4">
        <div className="h-4 w-24 rounded bg-surface-2" />
        <div className="h-4 w-10 rounded bg-surface-2" />
      </div>
    </div>
  )
}
