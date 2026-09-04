import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { badges, companies, metrics, profile } from "../data/portfolio";
import {
  ArrowRightIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MapPinIcon,
} from "./Icons";

function Avatar() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative shrink-0">
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-full bg-accent-500/12 blur-2xl"
      />
      <div className="relative size-40 overflow-hidden rounded-2xl ring-1 ring-line sm:size-48">
        {failed ? (
          // Fallback com iniciais enquanto /profile.jpg não existir em public/.
          <div className="grid size-full place-items-center bg-ink-800 font-mono text-4xl font-bold text-accent-400">
            ÍF
          </div>
        ) : (
          <img
            src="/profile.jpg"
            alt={`Foto de ${profile.name}`}
            onError={() => setFailed(true)}
            className="size-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();

  // Cada bloco do hero entra um pouco depois do anterior.
  const rise = (delay) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] },
        };

  return (
    <section className="bg-glow relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div
        aria-hidden="true"
        className="grid-lines absolute inset-0 [mask-image:radial-gradient(45rem_28rem_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col-reverse items-start gap-10 md:flex-row md:items-center md:gap-14">
          <motion.div className="min-w-0 flex-1" {...rise(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/8 px-3 py-1 text-xs font-medium text-accent-400">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-400 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent-400" />
              </span>
              Disponível para oportunidades remotas
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-mist-100 sm:text-5xl lg:text-6xl">
              {profile.name} <span className="inline-block">👋</span>
            </h1>

            <p className="mt-3 text-lg font-medium text-accent-400 sm:text-xl">
              {profile.role}
            </p>
            {profile.roleDetail && (
              <p className="mt-1 font-mono text-sm text-mist-600">
                {profile.roleDetail}
              </p>
            )}

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist-500 sm:text-lg">
              {profile.headline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mist-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon width={16} height={16} />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GlobeIcon width={16} height={16} />
                {profile.languages}
              </span>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-md border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-mist-300"
                >
                  {badge}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projetos"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-on-accent transition hover:bg-accent-400"
              >
                Ver projetos
                <ArrowRightIcon width={16} height={16} />
              </a>
              <a
                href="#contato"
                className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-mist-100 transition hover:border-line-strong hover:bg-surface-2"
              >
                Entrar em contato
              </a>
              <div className="flex items-center gap-1">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="rounded-lg p-2.5 text-mist-500 transition hover:bg-surface-2 hover:text-mist-100"
                >
                  <GithubIcon />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-lg p-2.5 text-mist-500 transition hover:bg-surface-2 hover:text-mist-100"
                >
                  <LinkedinIcon />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div {...rise(0.12)}>
            <Avatar />
          </motion.div>
        </div>

        <motion.dl
          {...rise(0.2)}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-surface-2 sm:grid-cols-4"
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-ink-900 px-5 py-6">
              <dt className="sr-only">{metric.label}</dt>
              <dd>
                <span className="block text-2xl font-bold tracking-tight text-mist-100 sm:text-3xl">
                  {metric.value}
                </span>
                <span className="mt-1 block text-sm text-mist-600">
                  {metric.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.div
          {...rise(0.28)}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          <span className="font-mono text-xs tracking-[0.2em] text-mist-600 uppercase">
            Já passei por
          </span>
          {companies.map((company) => (
            <span key={company} className="text-sm text-mist-600">
              {company}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
