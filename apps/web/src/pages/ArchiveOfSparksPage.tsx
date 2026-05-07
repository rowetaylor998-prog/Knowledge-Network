import { PageHeader } from '../components/PageHeader'
import { SectionList } from '../components/SectionList'

export function ArchiveOfSparksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Archive of Sparks"
        title="Interactive narrative MVP"
        description="A guided story space for exploring people, systems, choices, and knowledge links through simple scenes."
      />
      <SectionList
        title="Current MVP"
        description="The first narrative placeholders."
        items={[
          'Chapter 0: Trapped People',
          'Scene: Delivery Worker',
          'Knowledge links to political economy and learning psychology',
          'Future branching choices and AI tutor reflection prompts'
        ]}
      />
    </>
  )
}
