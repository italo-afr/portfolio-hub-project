import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Ao trocar de rota o browser mantém o scroll; aqui voltamos ao topo.
// Quando a URL traz um hash (ex.: /#projetos), rolamos até a âncora.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}
