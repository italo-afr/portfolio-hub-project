import { stack } from '../data/portfolio'
import Section from './Section'

export default function Stack() {
  return (
    <Section
      id="stack"
      kicker="Stack"
      title="Tecnologias que eu uso"
      description="Ferramentas com as quais já entreguei em produção — não uma lista de desejos."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((group) => (
          <div
            key={group.category}
            className="rounded-xl border border-line bg-ink-900 p-6 transition hover:border-line-strong"
          >
            <h3 className="font-mono text-xs tracking-[0.16em] text-accent-400 uppercase">
              {group.category}
            </h3>
            <ul className="mt-4 space-y-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-mist-300"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-ink-600"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
