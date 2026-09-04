import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import MiniAppBoundary from './MiniAppBoundary'
import { ArrowLeftIcon, ExternalIcon, GithubIcon } from './Icons'

function LoadingState() {
  return (
    <div className="grid place-items-center px-6 py-20">
      <div
        aria-hidden="true"
        className="size-6 animate-spin rounded-full border-2 border-line border-t-accent-400"
      />
      <p className="mt-4 text-sm text-mist-600">Carregando o mini-app…</p>
    </div>
  )
}

/**
 * Moldura dos mini-apps: dá contexto do projeto (título, stack, links) e
 * abriga a aplicação numa "janela", deixando claro para o visitante que
 * aquilo é um app de verdade rodando dentro do portfólio.
 *
 * O Shell não sabe nada sobre o mini-app — só recebe o componente e o renderiza.
 */
export default function ProjectShell({ project, children }) {
  const reduced = useReducedMotion()

  return (
    <div className="pb-20">
      <header className="bg-glow border-b border-line-soft pt-28 pb-10 sm:pt-32">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to="/#projetos"
            className="inline-flex items-center gap-2 text-sm text-mist-500 transition hover:text-mist-100"
          >
            <ArrowLeftIcon width={16} height={16} />
            Todos os projetos
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-mist-100 sm:text-4xl">
              {project.title}
            </h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/8 px-2.5 py-0.5 text-xs font-medium text-accent-400">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-400 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-400" />
              </span>
              Rodando ao vivo
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist-500">
            {project.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <ul className="flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md bg-surface-2 px-2 py-1 font-mono text-[11px] text-mist-500"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1">
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Código de ${project.title}`}
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
        </div>
      </header>

      {/* A "janela" do mini-app */}
      <div className="mx-auto mt-10 max-w-5xl px-6">
        <motion.div
          className="overflow-hidden rounded-xl border border-line bg-ink-900"
          initial={reduced ? false : { opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 border-b border-line-soft bg-ink-850 px-4 py-3">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-ink-600" />
              <span className="size-2.5 rounded-full bg-ink-600" />
              <span className="size-2.5 rounded-full bg-ink-600" />
            </span>
            <span className="ml-2 truncate font-mono text-xs text-mist-600">
              {project.slug} · mini-app embutido
            </span>
          </div>

          <MiniAppBoundary>
            <Suspense fallback={<LoadingState />}>{children}</Suspense>
          </MiniAppBoundary>
        </motion.div>

        {project.highlights?.length > 0 && (
          <section className="mt-10">
            <h2 className="font-mono text-xs tracking-[0.2em] text-accent-400 uppercase">
              Como foi construído
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mist-500">
              {project.description}
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex gap-3 text-sm leading-relaxed text-mist-500"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
