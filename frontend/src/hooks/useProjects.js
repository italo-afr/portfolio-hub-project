import { useEffect, useState } from 'react'
import { fetchProjects } from '../services/api'
import { projects as fallbackProjects } from '../data/portfolio'

/**
 * Projetos vindos de GET /api/projects.
 *
 * Se a API não responder, cai no conteúdo local em vez de deixar a seção vazia:
 * o portfólio precisa funcionar mesmo publicado sem o backend no ar.
 */
export default function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [usedFallback, setUsedFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchProjects()
        if (cancelled) return
        // Resposta vazia também é motivo para usar o conteúdo local.
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data)
        } else {
          setProjects(fallbackProjects)
          setUsedFallback(true)
        }
      } catch {
        if (cancelled) return
        setProjects(fallbackProjects)
        setUsedFallback(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { projects, loading, usedFallback }
}
