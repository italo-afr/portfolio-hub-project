import { Link } from 'react-router-dom'
import { ArrowRightIcon, ExternalIcon, GithubIcon } from './Icons'

/**
 * Decide para onde o card leva, com base no type do projeto:
 *   'external' com externalUrl → abre o link em nova aba
 *   'embedded' (ou external sem URL) → navega para a rota interna /:slug
 */
function getCardTarget(project) {
  const isExternal = project.type === 'external' && Boolean(project.externalUrl)

  if (isExternal) {
    return {
      isExternal: true,
      label: 'Abrir projeto',
      Wrapper: 'a',
      props: {
        href: project.externalUrl,
        target: '_blank',
        rel: 'noreferrer',
      },
    }
  }

  return {
    isExternal: false,
    label: project.type === 'embedded' ? 'Abrir mini-app' : 'Ver detalhes',
    Wrapper: Link,
    props: { to: `/${project.slug}` },
  }
}

export default function ProjectCard({ project }) {
  const { isExternal, label, Wrapper, props } = getCardTarget(project)
  const isEmbedded = project.type === 'embedded'

  return (
    <article
      className={`group relative flex flex-col rounded-xl border bg-ink-900 p-6 transition duration-300 hover:-translate-y-0.5 hover:bg-ink-850 ${
        isEmbedded
          ? 'border-accent-500/25 hover:border-accent-500/45'
          : 'border-line hover:border-accent-500/25'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-mist-100">
          {/* Link "esticado" para o card inteiro ser clicável. */}
          <Wrapper {...props} className="before:absolute before:inset-0">
            {project.title}
          </Wrapper>
        </h3>
        {project.tag && (
          <span className="shrink-0 rounded-full border border-accent-500/20 bg-accent-500/8 px-2.5 py-0.5 text-xs font-medium text-accent-400">
            {project.tag}
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-500">
        {project.summary}
      </p>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <li
            key={tech}
            className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-mist-500"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-line-soft pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-mist-500 transition group-hover:text-accent-400">
          {label}
          {isExternal ? (
            <ExternalIcon
              width={14}
              height={14}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          ) : (
            <ArrowRightIcon
              width={15}
              height={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </span>

        {/* z-10 mantém estes links acima do overlay do link esticado. */}
        <div className="relative z-10 flex items-center gap-1">
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`Código de ${project.title} no GitHub`}
              className="rounded-md p-1.5 text-mist-600 transition hover:bg-surface-2 hover:text-mist-100"
            >
              <GithubIcon width={17} height={17} />
            </a>
          )}
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              aria-label={`Demo de ${project.title}`}
              className="rounded-md p-1.5 text-mist-600 transition hover:bg-surface-2 hover:text-mist-100"
            >
              <ExternalIcon width={17} height={17} />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
