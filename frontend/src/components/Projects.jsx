import Section from './Section'
import ProjectCard from './ProjectCard'
import ProjectCardSkeleton from './ProjectCardSkeleton'
import Stagger from './Stagger'
import useProjects from '../hooks/useProjects'
import { projects as fallbackProjects } from '../data/portfolio'

const GRID = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'

// Um esqueleto por projeto que vai aparecer. Com um número fixo menor, a seção
// crescia quando os dados chegavam e isso contava como layout shift (CLS) —
// o backend hiberna no plano gratuito do Render, então a espera é longa.
const SKELETON_COUNT = fallbackProjects.length

export default function Projects() {
  const { projects, loading } = useProjects()

  return (
    <Section
      id="projetos"
      kicker="Projetos"
      title="O que eu construí"
      description="Produtos e ferramentas que fui do primeiro commit ao deploy — do modelo de dados à esteira de release."
    >
      {loading ? (
        <div className={GRID}>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Stagger className={GRID}>
          {projects.map((project) => (
            <Stagger.Item key={project.slug} className="h-full">
              <ProjectCard project={project} />
            </Stagger.Item>
          ))}
        </Stagger>
      )}
    </Section>
  )
}
