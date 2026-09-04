import { experiences } from '../data/portfolio'
import Section from './Section'

export default function Experience() {
  return (
    <Section
      id="experiencia"
      kicker="Experiência"
      title="Trajetória profissional"
      description="Do suporte à infraestrutura de 300+ usuários ao desenvolvimento full-stack com esteira de deploy."
    >
      <ol className="relative space-y-10 border-l border-line pl-8 sm:pl-10">
        {experiences.map((job, index) => (
          <li key={`${job.company}-${job.period}`} className="relative">
            {/* O marcador destacado indica a experiência mais recente. */}
            <span
              aria-hidden="true"
              className={`absolute top-1.5 -left-[calc(2rem+5px)] size-2.5 rounded-full ring-4 ring-ink-950 sm:-left-[calc(2.5rem+5px)] ${
                index === 0 ? 'bg-accent-400' : 'bg-ink-600'
              }`}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-semibold text-mist-100">{job.role}</h3>
              <span className="font-mono text-xs text-mist-600">{job.period}</span>
            </div>

            <p className="mt-1 text-sm text-accent-400">{job.company}</p>
            {job.location && (
              <p className="mt-0.5 text-xs text-mist-600">{job.location}</p>
            )}

            <ul className="mt-4 space-y-2.5">
              {job.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-sm leading-relaxed text-mist-500"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1 shrink-0 rounded-full bg-mist-600"
                  />
                  {bullet}
                </li>
              ))}
            </ul>

            {job.stack && (
              <p className="mt-4 font-mono text-xs leading-relaxed text-mist-600">
                {job.stack}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Section>
  )
}
