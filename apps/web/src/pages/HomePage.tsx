import type { RoutePath } from '../App'
import { MarkdownPage } from '../components/MarkdownPage'
import { SectionList } from '../components/SectionList'

type PageProps = {
  onNavigate: (route: RoutePath) => void
}

export function HomePage({ onNavigate }: PageProps) {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Open knowledge platform MVP</p>
        <h1>Be Knowledgeable. Be Free. Be Independent. Be Capable.</h1>
      </section>

      <section className="homepage-manifesto">
        <MarkdownPage contentPath="/content/manifesto/homepage-manifesto" />
      </section>

      <section className="home-actions" aria-label="Main sections">
        <button type="button" onClick={() => onNavigate('/manifesto')}>
          Open Manifesto
        </button>
        <button type="button" onClick={() => onNavigate('/methods-and-lessons')}>
          Methods & Lessons
        </button>
        <button type="button" onClick={() => onNavigate('/knowledge')}>
          Knowledge
        </button>
        <button type="button" onClick={() => onNavigate('/repositories/computer-technical-systems')}>
          Computer Science Tree
        </button>
        <button type="button" onClick={() => onNavigate('/repositories/algorithms')}>
          Algorithms Tree
        </button>
        <button type="button" onClick={() => onNavigate('/works')}>
          Guided Learning Works
        </button>
      </section>

      <div className="section-stack">
        <SectionList
          title="Methods & Lessons"
          description="Reusable ways to learn, reflect, collaborate, organize, and build capability."
          items={['Learning methods', 'Experience lessons', 'Psychology and collaboration']}
        />
        <SectionList
          title="Knowledge"
          description="Structured knowledge areas for technical, social, historical, and political study."
          items={[
            'Computer Science tree: /repositories/computer-technical-systems',
            'Algorithms tree: /repositories/algorithms',
            'Markdown articles and notes'
          ]}
        />
        <SectionList
          title="Guided Learning Works"
          description="Narrative, visual, documentary, and course formats that guide learners through complex ideas."
          items={['Archive of Sparks', 'Documentary Projects', 'Visual Explanations', 'Lectures and Live Courses']}
        />
      </div>

      <section className="guided-works-home">
        <div className="knowledge-group-header">
          <p className="eyebrow">知识引导作品</p>
          <h2>Guided Learning Works</h2>
          <p>
            If systematic articles, original texts, or technical materials feel difficult at first,
            you can start from our guided learning works. They use stories, interactive scenes,
            visual explanations, and documentaries to help you enter the knowledge world step by
            step.
          </p>
        </div>

        <div className="guided-work-grid">
          <article className="guided-work-card featured">
            <div>
              <h3>Archive of Sparks</h3>
              <p>
                An open-source interactive knowledge narrative. Start from real-life difficulties,
                travel through history, compare different explanations, and enter the knowledge
                platform for deeper study.
              </p>
            </div>
            <button type="button" onClick={() => onNavigate('/works/archive-of-sparks')}>
              Start Chapter 0
            </button>
          </article>

          {['Documentary Projects', 'Visual Explanations', 'Lectures and Live Courses'].map((title) => (
            <article className="guided-work-card" key={title}>
              <h3>{title}</h3>
              <p>Placeholder for future guided learning formats.</p>
              <button type="button" disabled>
                Coming soon
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
