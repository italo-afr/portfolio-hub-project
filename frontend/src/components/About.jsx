import { about } from '../data/portfolio'
import Section from './Section'

export default function About() {
  return (
    <Section id="sobre" kicker="Sobre" title="Um pouco do caminho">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {about.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-mist-500">
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="rounded-xl border border-line bg-ink-900 p-6">
          <h3 className="font-mono text-xs tracking-[0.2em] text-accent-400 uppercase">
            Como eu trabalho
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-mist-500">
            {[
              ['Causa raiz', 'Corrijo o problema, não o sintoma.'],
              ['Automação', 'Se repete duas vezes, vira script.'],
              ['Observabilidade', 'O que não é medido não é melhorado.'],
              ['Entrega contínua', 'Ambientes separados e release previsível.'],
            ].map(([title, text]) => (
              <li key={title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-500"
                />
                <span>
                  <strong className="font-semibold text-mist-100">{title}</strong>
                  <span className="block text-mist-600">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  )
}
