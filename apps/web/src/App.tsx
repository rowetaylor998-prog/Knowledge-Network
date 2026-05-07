import { useEffect, useMemo, useState } from 'react'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { MethodsPage } from './pages/MethodsPage'
import { KnowledgePage } from './pages/KnowledgePage'
import { WorksPage } from './pages/WorksPage'
import { ArchiveOfSparks } from './pages/ArchiveOfSparks'
import {
  LegacyKnowledgeTreePage,
  algorithmTreeItems,
  computerTreeItems
} from './pages/LegacyKnowledgeTreePage'
import { MarkdownContentPage } from './pages/MarkdownContentPage'

const routes = {
  '/': HomePage,
  '/manifesto': () => (
    <MarkdownContentPage contentPath="/content/manifesto/homepage-manifesto" title="Manifesto" />
  ),
  '/methods-and-lessons': MethodsPage,
  '/knowledge': KnowledgePage,
  '/repositories/computer-technical-systems': () => (
    <LegacyKnowledgeTreePage
      title="Introduction to Modern Computer Science"
      sourceFile="repositories/computer-technical-systems.md"
      componentFile=".vitepress/theme/Components/ComputerTree.vue"
      description="The existing structured Computer Science knowledge tree, connected into the new MVP frontend without rewriting the old VitePress source."
      items={computerTreeItems}
      relatedLinks={[
        { label: 'Open Algorithms Tree', href: '/repositories/algorithms' },
        { label: 'Markdown Introduction', href: '/content/knowledge/computer-science/introduction' }
      ]}
    />
  ),
  '/repositories/algorithms': () => (
    <LegacyKnowledgeTreePage
      title="General Introduction to Algorithms"
      sourceFile="repositories/algorithms.md"
      componentFile=".vitepress/theme/Components/AlgorithmTree.vue"
      description="The existing structured Algorithms knowledge tree, connected into the new MVP frontend while preserving the original VitePress component."
      items={algorithmTreeItems}
      relatedLinks={[
        { label: 'Open Computer Science Tree', href: '/repositories/computer-technical-systems' },
        { label: 'Markdown Algorithms Notes', href: '/content/knowledge/computer-science/algorithms' }
      ]}
    />
  ),
  '/works': WorksPage,
  '/works/archive-of-sparks': ArchiveOfSparks,
  '/content/methods-and-lessons/learning-methods': () => (
    <MarkdownContentPage contentPath="/content/methods-and-lessons/learning-methods" title="Methods & Lessons" />
  ),
  '/content/methods-and-lessons/experience-lessons': () => (
    <MarkdownContentPage contentPath="/content/methods-and-lessons/experience-lessons" title="Methods & Lessons" />
  ),
  '/content/methods-and-lessons/psychology-learning-collaboration': () => (
    <MarkdownContentPage
      contentPath="/content/methods-and-lessons/psychology-learning-collaboration"
      title="Methods & Lessons"
    />
  ),
  '/content/knowledge/computer-science/introduction': () => (
    <MarkdownContentPage contentPath="/content/knowledge/computer-science/introduction" title="Knowledge" />
  ),
  '/content/knowledge/computer-science/algorithms': () => (
    <MarkdownContentPage contentPath="/content/knowledge/computer-science/algorithms" title="Knowledge" />
  ),
  '/content/knowledge/marxism-political-economy/introduction': () => (
    <MarkdownContentPage
      contentPath="/content/knowledge/marxism-political-economy/introduction"
      title="Knowledge"
    />
  ),
  '/knowledge/marxism-political-economy/mlm-manifesto': () => (
    <MarkdownContentPage
      contentPath="/content/knowledge/marxism-political-economy/mlm-manifesto"
      title="Marxism / Political Economy"
    />
  ),
  '/content/works/archive-of-sparks/chapter-0-trapped-people': () => (
    <MarkdownContentPage
      contentPath="/content/works/archive-of-sparks/chapter-0-trapped-people"
      title="Archive of Sparks"
    />
  )
}

export type RoutePath = keyof typeof routes

function getRoute(pathname: string): RoutePath {
  return pathname in routes ? (pathname as RoutePath) : '/'
}

export function App() {
  const [route, setRoute] = useState<RoutePath>(() => getRoute(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const Page = useMemo(() => routes[route], [route])

  function navigate(nextRoute: RoutePath) {
    window.history.pushState({}, '', nextRoute)
    setRoute(nextRoute)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Layout currentRoute={route} onNavigate={navigate}>
      <Page onNavigate={navigate} />
    </Layout>
  )
}
