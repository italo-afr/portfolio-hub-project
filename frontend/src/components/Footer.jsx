import { profile } from '../data/portfolio'
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="border-t border-line-soft py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-sm text-mist-300">
            {profile.fullName} · {profile.location}
          </p>
          <p className="mt-1 text-xs text-mist-600">
            Feito com React, Tailwind e ASP.NET Core · ©{' '}
            {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-lg p-2 text-mist-600 transition hover:bg-surface-2 hover:text-mist-100"
          >
            <GithubIcon width={18} height={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="rounded-lg p-2 text-mist-600 transition hover:bg-surface-2 hover:text-mist-100"
          >
            <LinkedinIcon width={18} height={18} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="E-mail"
            className="rounded-lg p-2 text-mist-600 transition hover:bg-surface-2 hover:text-mist-100"
          >
            <MailIcon width={18} height={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
