import { profile } from '../data/portfolio'
import { ArrowRightIcon, GithubIcon, LinkedinIcon, MailIcon } from './Icons'

const channels = [
  {
    label: 'E-mail',
    value: profile.email,
    href: `mailto:${profile.email}`,
    Icon: MailIcon,
    external: false,
  },
  {
    label: 'LinkedIn',
    value: profile.linkedinLabel,
    href: profile.linkedin,
    Icon: LinkedinIcon,
    external: true,
  },
  {
    label: 'GitHub',
    value: profile.githubLabel,
    href: profile.github,
    Icon: GithubIcon,
    external: true,
  },
]

export default function Contact() {
  return (
    <section id="contato" className="scroll-mt-24 border-t border-line-soft py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="bg-glow relative overflow-hidden rounded-2xl border border-line px-6 py-14 text-center sm:px-12">
          <p className="font-mono text-xs tracking-[0.2em] text-accent-400 uppercase">
            Contato
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-mist-100 sm:text-4xl">
            Vamos construir alguma coisa juntos?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-mist-500">
            Aberto a oportunidades remotas. Se tiver uma ideia ou uma vaga, é só
            chamar.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-on-accent transition hover:bg-accent-400"
          >
            {profile.email}
            <ArrowRightIcon width={16} height={16} />
          </a>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {channels.map(({ label, value, href, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                  className="flex items-center gap-3 rounded-xl border border-line bg-ink-900/70 px-4 py-3.5 text-left transition hover:border-accent-500/25 hover:bg-ink-850"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-mist-300">
                    <Icon width={18} height={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-mist-100">
                      {label}
                    </span>
                    <span className="block truncate text-xs text-mist-600">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
