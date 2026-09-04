import Section from './Section'
import ProjectCard from './ProjectCard'
import ProjectCardSkeleton from './ProjectCardSkeleton'
import Stagger from './Stagger'
import useProjects from '../hooks/useProjects'

const GRID = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'

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
          {Array.from({ length: 6 }, (_, i) => (
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
