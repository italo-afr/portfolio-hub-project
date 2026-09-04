import { certifications, education } from '../data/portfolio'
import { BadgeIcon, GraduationIcon } from './Icons'
import Section from './Section'

export default function Education() {
  return (
    <Section id="formacao" kicker="Formação" title="Estudo e certificações">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-ink-900 p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-accent-500/10 text-accent-400 ring-1 ring-accent-500/20">
              <GraduationIcon />
            </span>
            <h3 className="font-semibold text-mist-100">Graduação</h3>
          </div>

          <p className="mt-5 text-base font-medium text-mist-100">
            {education.degree}
          </p>
          <p className="mt-1 text-sm text-mist-500">{education.institution}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-mono text-xs text-mist-600">
              {education.period}
            </span>
            <span className="rounded-full border border-accent-500/20 bg-accent-500/8 px-2.5 py-0.5 text-xs font-medium text-accent-400">
              {education.status}
            </span>
          </div>

          <ul className="mt-5 space-y-2.5 border-t border-line-soft pt-5">
            {education.bullets.map((bullet) => (
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
        </div>

        <div className="rounded-xl border border-line bg-ink-900 p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-accent-500/10 text-accent-400 ring-1 ring-accent-500/20">
              <BadgeIcon />
            </span>
            <h3 className="font-semibold text-mist-100">Certificações</h3>
            <span className="ml-auto font-mono text-xs text-mist-600">
              {certifications.length}
            </span>
          </div>

          <ul className="mt-5 divide-y divide-line-soft">
            {certifications.map((cert) => (
              <li
                key={`${cert.name}-${cert.date}`}
                className="flex items-baseline justify-between gap-4 py-2.5"
              >
                <span className="text-sm text-mist-300">{cert.name}</span>
                <span className="shrink-0 font-mono text-xs text-mist-600">
                  {cert.issuer} · {cert.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
