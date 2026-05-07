import { PageHeader } from '../components/PageHeader'
import { ContentCard } from '../components/ContentCard'

const methodTopics = [
  {
    title: 'Learning Methods',
    description: 'Study systems, review habits, synthesis practices, and methods for building durable understanding.',
    status: 'open' as const,
    href: '/content/methods-and-lessons/learning-methods'
  },
  {
    title: 'Experience Lessons',
    description: 'Practical lessons from building, learning, organizing, reflecting, and correcting mistakes.',
    status: 'open' as const,
    href: '/content/methods-and-lessons/experience-lessons'
  },
  {
    title: 'Psychology, Learning, and Collaboration',
    description: 'How people learn together, give feedback, sustain attention, and build shared confidence.',
    status: 'open' as const,
    href: '/content/methods-and-lessons/psychology-learning-collaboration'
  },
  {
    title: 'Self-control',
    description: 'Practices for directing attention, resisting distraction, and aligning action with long-term goals.'
  },
  {
    title: 'Intelligence and Wisdom',
    description: 'A future section on reasoning, judgment, humility, and applying knowledge in real conditions.'
  },
  {
    title: 'Organization Ability',
    description: 'A future section on coordination, planning, documentation, delegation, and collective execution.'
  },
  {
    title: 'Willpower',
    description: 'A future section on persistence, discipline, recovery, and continuing through difficulty.'
  }
]

export function MethodsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Methods & Lessons"
        title="Build the capacity to learn and act"
        description="A practical section for learning systems, personal discipline, collaboration, judgment, and organized work."
      />
      <section className="content-map">
        {methodTopics.map((topic) => (
          <ContentCard key={topic.title} {...topic} />
        ))}
      </section>
    </>
  )
}
