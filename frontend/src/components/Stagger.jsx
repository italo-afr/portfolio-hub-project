import { motion, useReducedMotion } from 'framer-motion'

/**
 * Container que revela os filhos em cascata. Cada filho direto deve ser um
 * <Stagger.Item>. O atraso entre itens é curto de propósito: em listas longas,
 * cascata lenta faz o usuário esperar o conteúdo.
 */
export default function Stagger({ children, className, stagger = 0.06 }) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

function Item({ children, className }) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

Stagger.Item = Item
