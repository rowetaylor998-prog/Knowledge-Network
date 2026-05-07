import type { RoutePath } from '../App'
import { PageHeader } from '../components/PageHeader'
import { SectionList } from '../components/SectionList'

type PageProps = {
  onNavigate: (route: RoutePath) => void
}

export function WorksPage({ onNavigate }: PageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Guided Learning Works"
        title="Learn through guided forms"
        description="Narrative, documentary, visual, and live formats for studying difficult systems through structured experience."
      />
      <section className="section-block">
        <div>
          <h2>Archive of Sparks</h2>
          <p>An interactive narrative MVP about constraint, learning, organization, and liberation.</p>
        </div>
        <button className="primary-action" type="button" onClick={() => onNavigate('/works/archive-of-sparks')}>
          Open Archive of Sparks
        </button>
      </section>
      <SectionList
        title="Future Works"
        description="Placeholders for additional guided learning formats."
        items={[
          'Documentary Projects placeholder',
          'Visual Explanations placeholder',
          'Lectures and Live Courses placeholder'
        ]}
      />
    </>
  )
}
