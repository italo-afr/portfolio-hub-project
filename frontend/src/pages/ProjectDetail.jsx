import { createElement } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  ExternalIcon,
  GithubIcon,
} from '../components/Icons'
import ProjectShell from '../components/ProjectShell'
import { getMiniApp } from '../miniapps/registry'
import { projects } from '../data/portfolio'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  // Projeto embutido com mini-app registrado: entrega a moldura com o app dentro.
  // Sem mini-app registrado, cai na página de caso abaixo em vez de quebrar.
  // Minúsculo + createElement de propósito: o componente vem pronto do registry,
  // não é criado aqui, e assim não dispara a regra static-components do lint.
  const miniApp = project?.type === 'embedded' ? getMiniApp(slug) : null

  if (project && miniApp) {
    return (
      <ProjectShell project={project}>{createElement(miniApp)}</ProjectShell>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-accent-400 uppercase">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-mist-100">
          Projeto não encontrado
        </h1>
        <p className="mt-3 text-mist-500">
          O projeto <span className="font-mono text-mist-300">{slug}</span> não
          existe ou foi removido.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-mist-100 transition hover:bg-surface-2"
        >
          <ArrowLeftIcon width={16} height={16} />
          Voltar para a home
        </Link>
      </div>
    )
  }

  const index = projects.findIndex((p) => p.slug === slug)
  const next = projects[(index + 1) % projects.length]

  return (
    <article className="pb-20">
      <header className="bg-glow border-b border-line-soft pt-28 pb-14 sm:pt-32">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            to="/#projetos"
            className="inline-flex items-center gap-2 text-sm text-mist-500 transition hover:text-mist-100"
          >
            <ArrowLeftIcon width={16} height={16} />
            Todos os projetos
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-mist-100 sm:text-5xl">
              {project.title}
            </h1>
            {project.tag && (
              <span className="rounded-full border border-accent-500/20 bg-accent-500/8 px-2.5 py-0.5 text-xs font-medium text-accent-400">
                {project.tag}
              </span>
            )}
          </div>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist-500">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-mist-100 transition hover:bg-surface-2"
              >
                <GithubIcon width={17} height={17} />
                Código
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-400"
              >
                <ExternalIcon width={17} height={17} />
                Ver demo
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto mt-14 grid max-w-4xl gap-12 px-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="font-mono text-xs tracking-[0.2em] text-accent-400 uppercase">
            Sobre o projeto
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist-500">
            {project.description}
          </p>

          <h2 className="mt-10 font-mono text-xs tracking-[0.2em] text-accent-400 uppercase">
            Destaques
          </h2>
          <ul className="mt-4 space-y-3">
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
        </div>

        <aside>
          <div className="rounded-xl border border-line bg-ink-900 p-6">
            <h2 className="font-mono text-xs tracking-[0.2em] text-accent-400 uppercase">
              Stack
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md bg-surface-2 px-2.5 py-1 font-mono text-xs text-mist-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {next.slug !== project.slug && (
            <Link
              to={`/${next.slug}`}
              className="mt-5 block rounded-xl border border-line bg-ink-900 p-6 transition hover:border-accent-500/25 hover:bg-ink-850"
            >
              <span className="font-mono text-xs tracking-[0.2em] text-mist-600 uppercase">
                Próximo projeto
              </span>
              <span className="mt-2 block text-lg font-semibold text-mist-100">
                {next.title}
              </span>
            </Link>
          )}
        </aside>
      </div>
    </article>
  )
}
