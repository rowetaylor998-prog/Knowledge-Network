import { PageHeader } from '../components/PageHeader'
import { ContentCard } from '../components/ContentCard'

const computerScience = [
  {
    title: 'Computer Science',
    description: 'Open the preserved old knowledge tree for modern computer science and technical systems.',
    status: 'open' as const,
    href: '/repositories/computer-technical-systems'
  },
  {
    title: 'Algorithms',
    description: 'Open the preserved old algorithms tree with classical and modern algorithmic systems.',
    status: 'open' as const,
    href: '/repositories/algorithms'
  },
  {
    title: 'Markdown Introduction',
    description: 'Article-style starter notes for computer science in the new Markdown content system.',
    status: 'open' as const,
    href: '/content/knowledge/computer-science/introduction'
  },
  {
    title: 'Systems placeholder',
    description: 'Operating systems, databases, distributed systems, infrastructure, and production engineering.'
  },
  {
    title: 'Networks placeholder',
    description: 'Computer networking, protocols, internet architecture, security, and platform connectivity.'
  },
  {
    title: 'AI placeholder',
    description: 'Machine learning, AI systems, model behavior, evaluation, and future tutor infrastructure.'
  }
]

const politicalEconomy = [
  {
    title: '知识平台宣言：马列毛版',
    description: 'A separate manifesto for the Marxism / Political Economy / Scientific Socialism learning route.',
    status: 'open' as const,
    href: '/knowledge/marxism-political-economy/mlm-manifesto'
  },
  {
    title: 'Introduction',
    description: 'A starting map for Marxism, political economy, scientific socialism, and historical analysis.',
    status: 'open' as const,
    href: '/content/knowledge/marxism-political-economy/introduction'
  },
  {
    title: 'Philosophy placeholder',
    description: 'Dialectics, materialism, knowledge, social practice, and methods of historical analysis.'
  },
  {
    title: 'Political Economy',
    description: 'Value, labor, capital, surplus, circulation, crisis, platforms, and modern production relations.'
  },
  {
    title: 'Scientific Socialism',
    description: 'Class struggle, organization, state power, transition questions, and socialist construction.'
  }
]

const futureFields = [
  {
    title: 'Mainstream Economics',
    description: 'Markets, incentives, firms, platforms, macroeconomics, and standard economic models.'
  },
  {
    title: 'Mathematics',
    description: 'Foundational tools for logic, proof, computation, modeling, statistics, and physics.'
  },
  {
    title: 'Physics',
    description: 'Matter, motion, energy, fields, systems, and scientific methods for studying nature.'
  },
  {
    title: 'History',
    description: 'Historical development, social change, revolutions, technology, institutions, and world systems.'
  },
  {
    title: 'State Power',
    description: 'States, institutions, law, bureaucracy, coercion, legitimacy, and political organization.'
  },
  {
    title: 'Capitalists and Capital Circulation',
    description: 'Firms, finance, circulation, logistics, accumulation, ownership, and control of production.'
  }
]

export function KnowledgePage() {
  return (
    <>
      <PageHeader
        eyebrow="Knowledge"
        title="Study the structures that shape the world"
        description="A growing Markdown knowledge base for technical understanding, political economy, scientific socialism, and future fields."
      />
      <section className="knowledge-group">
        <div className="knowledge-group-header">
          <p className="eyebrow">Main MVP field 1</p>
          <h2>Computer Science</h2>
        </div>
        <div className="content-map">
          {computerScience.map((topic) => (
            <ContentCard key={topic.title} {...topic} />
          ))}
        </div>
      </section>

      <section className="knowledge-group">
        <div className="knowledge-group-header">
          <p className="eyebrow">Main MVP field 2</p>
          <h2>Marxism / Political Economy / Scientific Socialism</h2>
        </div>
        <div className="content-map">
          {politicalEconomy.map((topic) => (
            <ContentCard key={topic.title} {...topic} />
          ))}
        </div>
      </section>

      <section className="knowledge-group">
        <div className="knowledge-group-header">
          <p className="eyebrow">Future placeholders</p>
          <h2>Future Fields</h2>
        </div>
        <div className="content-map">
          {futureFields.map((topic) => (
            <ContentCard key={topic.title} {...topic} />
          ))}
        </div>
      </section>
    </>
  )
}
