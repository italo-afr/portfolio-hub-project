import { motion, useReducedMotion } from 'framer-motion'

/**
 * Fade-in + leve subida quando o elemento entra na viewport.
 *
 * `once` evita reanimar ao rolar de volta — reanimação constante irrita mais
 * do que agrada. Quem pediu menos movimento recebe o conteúdo estático.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = 'div',
}) {
  const reduced = useReducedMotion()
  const Tag = motion[as] ?? motion.div

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}
