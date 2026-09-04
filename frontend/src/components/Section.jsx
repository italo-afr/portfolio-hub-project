import Reveal from './Reveal'

// Casca padrão das seções: espaçamento, largura máxima e cabeçalho com kicker + título.
export default function Section({ id, kicker, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line-soft py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {(kicker || title) && (
          <Reveal as="header" className="mb-12 max-w-2xl">
            {kicker && (
              <p className="mb-3 font-mono text-xs tracking-[0.2em] text-accent-400 uppercase">
                {kicker}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-mist-100 sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base leading-relaxed text-mist-500">
                {description}
              </p>
            )}
          </Reveal>
        )}
        <Reveal delay={0.08}>{children}</Reveal>
      </div>
    </section>
  )
}
