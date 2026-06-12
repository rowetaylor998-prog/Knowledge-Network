import { useEffect, useMemo, useState } from 'react'
import type { RoutePath } from '../App'
import { loadContentIndex, searchContent } from '../api'
import type { ContentIndexItem, ContentSearchItem } from '../api'
import { PageHeader } from '../components/PageHeader'
import { ContentCard } from '../components/ContentCard'

type PageProps = {
  onNavigate: (route: RoutePath) => void
}

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

function formatCategory(category: string) {
  return category
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/[-_]/g, ' '))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' / ')
}

function groupContentItems(items: ContentIndexItem[]) {
  return items.reduce<Record<string, ContentIndexItem[]>>((groups, item) => {
    const category = item.category || 'content'
    groups[category] = groups[category] ?? []
    groups[category].push(item)
    return groups
  }, {})
}

export function KnowledgePage({ onNavigate }: PageProps) {
  const [contentItems, setContentItems] = useState<ContentIndexItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ContentSearchItem[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadIndex() {
      setIsLoading(true)
      setError('')

      try {
        const data = await loadContentIndex(undefined, controller.signal)
        setContentItems(data.items)
      } catch (loadError) {
        if ((loadError as Error).name !== 'AbortError') {
          setError(
            (loadError as Error).message ||
              'The dynamic content index could not be loaded. Start the backend and try again.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadIndex()
    return () => controller.abort()
  }, [])

  const groupedContentItems = useMemo(() => groupContentItems(contentItems), [contentItems])
  const contentCategories = useMemo(() => Object.keys(groupedContentItems).sort(), [groupedContentItems])

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = searchQuery.trim()

    if (!query) {
      setSearchResults([])
      setSearchError('')
      setHasSearched(false)
      return
    }

    setSearchLoading(true)
    setSearchError('')
    setHasSearched(true)

    try {
      const data = await searchContent(query)
      setSearchResults(data.items)
    } catch (searchLoadError) {
      setSearchError(
        (searchLoadError as Error).message ||
          'Content search could not be loaded. Start the backend and try again.'
      )
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Knowledge"
        title="Study the structures that shape the world"
        description="A growing Markdown knowledge base for technical understanding, political economy, scientific socialism, and future fields."
      />
      <section className="knowledge-group">
        <div className="knowledge-group-header">
          <p className="eyebrow">Search</p>
          <h2>Find Markdown content</h2>
          <p>Search titles, headings, and page text from the backend content directory.</p>
        </div>
        <form className="content-search-form" onSubmit={handleSearch}>
          <label htmlFor="content-search">Search query</label>
          <div className="content-search-row">
            <input
              id="content-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Try algorithms, platform, learning, political economy..."
            />
            <button type="submit" disabled={searchLoading}>
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        {searchError ? (
          <section className="markdown-state markdown-error">
            <h1>Could not search content</h1>
            <p>{searchError}</p>
          </section>
        ) : null}
        {hasSearched && !searchLoading && !searchError ? (
          <div className="content-search-results" aria-live="polite">
            <p className="content-search-count">
              {searchResults.length > 0
                ? `${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
                : 'No results found.'}
            </p>
            {searchResults.map((item) => (
              <article className="content-search-result" key={item.path}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.snippet}</p>
                  <code>{item.path}</code>
                </div>
                <button className="card-action open" type="button" onClick={() => onNavigate(item.path as RoutePath)}>
                  Open
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </section>

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
          <p className="eyebrow">Dynamic Markdown index</p>
          <h2>Content Library</h2>
          <p>Markdown pages discovered from the backend content index.</p>
        </div>
        {isLoading ? <p className="markdown-state">Loading content index...</p> : null}
        {error && !isLoading ? (
          <section className="markdown-state markdown-error">
            <h1>Could not load content index</h1>
            <p>{error}</p>
          </section>
        ) : null}
        {!isLoading && !error && contentCategories.length === 0 ? (
          <p className="markdown-state">No Markdown content was found yet.</p>
        ) : null}
        {!isLoading && !error
          ? contentCategories.map((category) => (
              <section className="content-index-group" key={category}>
                <h3>{formatCategory(category)}</h3>
                <div className="content-map">
                  {groupedContentItems[category].map((item) => (
                    <article className="content-card content-index-card" key={item.path}>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description || 'No description available yet.'}</p>
                        <code>{item.path}</code>
                      </div>
                      <button
                        className="card-action open"
                        type="button"
                        onClick={() => onNavigate(item.path as RoutePath)}
                      >
                        Open
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ))
          : null}
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
