import { useMemo, useState } from 'react'
import { apiUrl } from '../api'
import { AnnotationPanel } from '../components/AnnotationPanel'

const ARCHIVE_PAGE_ID = 'archive-of-sparks-chapter-0'

const SCENE_IDS = {
  opening: 'chapter0-opening',
  deliveryWorker: 'delivery-worker-scene',
  politicalEconomy: 'political-economy-route',
  mainstreamEconomics: 'mainstream-economics-route',
  technology: 'technology-route',
  stateInstitutions: 'state-institutions-route'
}

const identities = [
  {
    id: 'delivery-worker',
    label: 'Delivery Worker',
    playable: true
  },
  {
    id: 'factory-worker',
    label: 'Factory Worker',
    playable: false
  },
  {
    id: 'student',
    label: 'Student',
    playable: false
  }
]

const routes = [
  {
    id: 'political-economy',
    sceneId: SCENE_IDS.politicalEconomy,
    apiRoute: 'political_economy',
    label: 'Political Economy Route',
    explanation:
      'This route studies algorithmic management as part of the labor process: platforms organize work, measure time, allocate tasks, and shift risk onto workers.',
    links: [
      '/content/knowledge/marxism-political-economy/introduction',
      '/content/knowledge/computer-science/algorithms'
    ]
  },
  {
    id: 'mainstream-economics',
    sceneId: SCENE_IDS.mainstreamEconomics,
    apiRoute: 'mainstream_economics',
    label: 'Mainstream Economics Route',
    explanation:
      'This route examines platforms as market coordinators that match supply and demand, set incentives, reduce transaction costs, and optimize service capacity.',
    links: [
      '/knowledge',
      '/content/knowledge/computer-science/algorithms'
    ]
  },
  {
    id: 'technology',
    sceneId: SCENE_IDS.technology,
    apiRoute: 'technology',
    label: 'Technology Route',
    explanation:
      'This route focuses on ranking, routing, dispatch, timers, metrics, and feedback systems that make platform control appear automatic and neutral.',
    links: [
      '/content/knowledge/computer-science/algorithms',
      '/content/knowledge/marxism-political-economy/introduction'
    ]
  },
  {
    id: 'state-institutions',
    sceneId: SCENE_IDS.stateInstitutions,
    apiRoute: 'state_institutions',
    label: 'State and Institutions Route',
    explanation:
      'This route asks how labor law, regulation, contracts, courts, and public institutions shape what platforms can require from workers.',
    links: [
      '/knowledge',
      '/knowledge'
    ]
  }
]

const narrativeBeats = [
  'The player receives orders from a platform.',
  'The timer is tight.',
  'The route is optimized by an algorithm.',
  'The worker feels controlled by the system.'
]

const deliveryWorkerTargetText = `Delivery Worker scene: ${narrativeBeats.join(' ')}`

export function ArchiveOfSparks({ onNavigate }) {
  const [identity, setIdentity] = useState('delivery-worker')
  const [selectedRoute, setSelectedRoute] = useState('political-economy')
  const [atangQuestion, setAtangQuestion] = useState('')
  const [atangAnswer, setAtangAnswer] = useState('')
  const [atangArchives, setAtangArchives] = useState([])
  const [atangError, setAtangError] = useState('')
  const [atangLoading, setAtangLoading] = useState(false)

  const currentIdentity = useMemo(
    () => identities.find((item) => item.id === identity) ?? identities[0],
    [identity]
  )

  const currentRoute = useMemo(
    () => routes.find((item) => item.id === selectedRoute) ?? routes[0],
    [selectedRoute]
  )

  async function askAtang(event) {
    event.preventDefault()
    const question = atangQuestion.trim()

    if (!question) {
      setAtangError('Please ask Atang a question first.')
      return
    }

    setAtangLoading(true)
    setAtangError('')
    setAtangAnswer('')
    setAtangArchives([])

    try {
      const response = await fetch(apiUrl('/api/story/character-chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          character: 'Atang',
          scene_context:
            'Archive of Sparks Chapter 0. The player is a delivery worker receiving platform orders under a tight timer. The route is optimized by an algorithm, and the worker feels controlled by the system.',
          route: currentRoute.apiRoute,
          question
        })
      })

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`)
      }

      const data = await response.json()
      setAtangAnswer(data.answer || 'Atang did not return an answer.')
      setAtangArchives(data.suggested_archives || [])
    } catch (error) {
      setAtangError('Atang is unavailable. Start the backend or configure VITE_API_BASE_URL and try again.')
    } finally {
      setAtangLoading(false)
    }
  }

  return (
    <div className="archive-page">
      <button className="text-link" type="button" onClick={() => onNavigate('/')}>
        Back to main platform home
      </button>

      <section className="archive-hero">
        <p className="eyebrow">Interactive narrative prototype</p>
        <h1>Archive of Sparks: Chapter 0 — Trapped People</h1>
        <p className="archive-opening">Everyone is busy. But few people know why they are busy.</p>
      </section>

      <section className="archive-card">
        <div>
          <p className="archive-step">Identity selection</p>
          <h2>Choose a position inside the system</h2>
        </div>
        <div className="identity-grid">
          {identities.map((item) => (
            <button
              key={item.id}
              type="button"
              className={identity === item.id ? 'choice-card active' : 'choice-card'}
              onClick={() => setIdentity(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.playable ? 'Playable MVP' : 'Coming soon'}</small>
            </button>
          ))}
        </div>
      </section>

      {currentIdentity.playable ? (
        <>
          <section className="archive-card narrative-card">
            <div>
              <p className="archive-step">Delivery Worker scene</p>
              <h2>A shift governed by the platform</h2>
            </div>
            <ol className="narrative-list">
              {narrativeBeats.map((beat) => (
                <li key={beat}>{beat}</li>
              ))}
            </ol>
          </section>
          <AnnotationPanel
            pageId={ARCHIVE_PAGE_ID}
            targetId={SCENE_IDS.deliveryWorker}
            targetText={deliveryWorkerTargetText}
          />

          <section className="archive-question">
            <h2>Why are contemporary workers managed by algorithms and platforms?</h2>
          </section>

          <section className="archive-card">
            <div>
              <p className="archive-step">Route choices</p>
              <h2>Select an explanation route</h2>
            </div>
            <div className="route-grid">
              {routes.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  className={selectedRoute === route.id ? 'route-card active' : 'route-card'}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  {route.label}
                </button>
              ))}
            </div>
          </section>

          <section className="archive-card explanation-card">
            <div>
              <p className="archive-step">Selected route</p>
              <h2>{currentRoute.label}</h2>
              <p>{currentRoute.explanation}</p>
            </div>
            <div>
              <p className="archive-step">Related archive links</p>
              <ul className="archive-links">
                {currentRoute.links.map((link) => (
                  <li key={link}>
                    <a href={link}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <AnnotationPanel
            pageId={ARCHIVE_PAGE_ID}
            targetId={currentRoute.sceneId}
            targetText={`${currentRoute.label}: ${currentRoute.explanation}`}
          />

          <section className="archive-card atang-card">
            <div>
              <p className="archive-step">Ask Atang</p>
              <h2>Talk with the guide</h2>
              <p>
                Ask a question about this scene. Atang will connect the problem to knowledge routes
                and suggest archive links for deeper study.
              </p>
            </div>
            <div>
              <form className="atang-form" onSubmit={askAtang}>
                <label htmlFor="atang-question">Your question</label>
                <textarea
                  id="atang-question"
                  value={atangQuestion}
                  onChange={(event) => setAtangQuestion(event.target.value)}
                  placeholder="Why does the platform decide the route for me?"
                  rows={4}
                />
                <button type="submit" disabled={atangLoading}>
                  {atangLoading ? 'Asking Atang...' : 'Ask Atang'}
                </button>
              </form>

              <div className="atang-response" aria-live="polite">
                {atangError ? <p className="ai-tutor-error">{atangError}</p> : null}
                {atangAnswer ? <p>{atangAnswer}</p> : null}
                {atangArchives.length > 0 ? (
                  <ul className="archive-links atang-links">
                    {atangArchives.map((archive) => (
                      <li key={archive.path}>
                        <a href={archive.path}>{archive.title}</a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="archive-card coming-soon-card">
          <div>
            <p className="archive-step">{currentIdentity.label}</p>
            <h2>Coming soon</h2>
            <p>
              This identity will be added after the Delivery Worker route proves the Chapter 0 MVP
              structure.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
