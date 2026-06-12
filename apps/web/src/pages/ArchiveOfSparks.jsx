import { useEffect, useMemo, useState } from 'react'
import { characterChat, improveAnnotation } from '../api'
import { AnnotationPanel } from '../components/AnnotationPanel'
import deliveryWorkerScene from '../../../../content/works/archive-of-sparks/scenes/chapter-0-delivery-worker.json'

const ARCHIVE_PAGE_ID = deliveryWorkerScene.chapter_id
const LEARNING_NOTE_STORAGE_KEY = 'bkfi_archive_learning_notes_v1'

const playableScenes = [deliveryWorkerScene]

const identities = [
  ...playableScenes.map((scene) => ({
    id: scene.identity.id,
    label: scene.identity.label,
    playable: scene.identity.playable
  })),
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

function sceneRoutes(scene) {
  return scene.route_choices.map((route) => ({
    id: route.id,
    sceneId: route.scene_id,
    apiRoute: route.api_route,
    label: route.label,
    explanation: route.explanation,
    links: route.related_archives
  }))
}

function readLearningNotes() {
  try {
    const raw = window.localStorage.getItem(LEARNING_NOTE_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function readLearningNote(sceneId) {
  return (
    readLearningNotes()[sceneId] || {
      sceneId,
      noticedProblem: '',
      routeReflection: '',
      remainingQuestion: '',
      improvedNote: '',
      createdAt: '',
      updatedAt: ''
    }
  )
}

function writeLearningNote(sceneId, note) {
  const notes = readLearningNotes()
  notes[sceneId] = note
  window.localStorage.setItem(LEARNING_NOTE_STORAGE_KEY, JSON.stringify(notes))
}

function formatLearningNote(note) {
  return [
    `What problem did you notice in this scene?\n${note.noticedProblem}`,
    `Which explanation route did you choose, and why?\n${note.routeReflection}`,
    `What question do you still have?\n${note.remainingQuestion}`
  ].join('\n\n')
}

export function ArchiveOfSparks({ onNavigate }) {
  const [identity, setIdentity] = useState('delivery-worker')
  const [selectedRoute, setSelectedRoute] = useState('political-economy')
  const [atangQuestion, setAtangQuestion] = useState('')
  const [atangAnswer, setAtangAnswer] = useState('')
  const [atangArchives, setAtangArchives] = useState([])
  const [atangError, setAtangError] = useState('')
  const [atangLoading, setAtangLoading] = useState(false)
  const [learningNote, setLearningNote] = useState(() =>
    readLearningNote(deliveryWorkerScene.identity.scene_id)
  )
  const [learningNoteSaved, setLearningNoteSaved] = useState(false)
  const [learningNoteAi, setLearningNoteAi] = useState({ error: '', result: null })
  const [learningNoteAiLoading, setLearningNoteAiLoading] = useState(false)

  const currentIdentity = useMemo(
    () => identities.find((item) => item.id === identity) ?? identities[0],
    [identity]
  )

  const currentScene = useMemo(
    () => playableScenes.find((scene) => scene.identity.id === identity) ?? deliveryWorkerScene,
    [identity]
  )

  const routes = useMemo(() => sceneRoutes(currentScene), [currentScene])

  const currentRoute = useMemo(
    () => routes.find((item) => item.id === selectedRoute) ?? routes[0],
    [routes, selectedRoute]
  )

  const narrativeBeats = currentScene.scene_steps
  const sceneTargetText = `${currentScene.identity.scene_label}: ${narrativeBeats.join(' ')}`
  const knowledgeDeepLinks = currentScene.related_archives

  useEffect(() => {
    setLearningNote(readLearningNote(currentScene.identity.scene_id))
    setLearningNoteSaved(false)
    setLearningNoteAi({ error: '', result: null })
  }, [currentScene])

  const sceneContext = useMemo(
    () =>
      [
        currentScene.atang_context.base_context,
        currentScene.atang_context.role,
        currentScene.atang_context.safety,
        `Scene steps: ${narrativeBeats.join(' ')}`,
        `Central question: ${currentScene.core_question}`,
        `Selected route: ${currentRoute.label}. ${currentRoute.explanation}`
      ].join(' '),
    [currentRoute, currentScene, narrativeBeats]
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
      const data = await characterChat({
        character: 'Atang',
        scene_context: sceneContext,
        route: currentRoute.apiRoute,
        question
      })

      setAtangAnswer(data.answer || 'Atang did not return an answer.')
      setAtangArchives(data.suggested_archives || [])
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      setAtangError(
        message || 'Atang is unavailable. Start the backend or configure VITE_API_BASE_URL and try again.'
      )
    } finally {
      setAtangLoading(false)
    }
  }

  function updateLearningNote(field, value) {
    setLearningNote((current) => ({
      ...current,
      sceneId: currentScene.identity.scene_id,
      [field]: value
    }))
    setLearningNoteSaved(false)
  }

  function saveLearningNote(event) {
    event.preventDefault()
    const now = new Date().toISOString()
    const nextNote = {
      ...learningNote,
      sceneId: currentScene.identity.scene_id,
      selectedRoute: currentRoute.id,
      selectedRouteLabel: currentRoute.label,
      createdAt: learningNote.createdAt || now,
      updatedAt: now
    }
    setLearningNote(nextNote)
    writeLearningNote(currentScene.identity.scene_id, nextNote)
    setLearningNoteSaved(true)
  }

  async function improveLearningNote() {
    const formattedNote = formatLearningNote(learningNote).trim()
    if (!learningNote.noticedProblem && !learningNote.routeReflection && !learningNote.remainingQuestion) {
      setLearningNoteAi({
        error: 'Write a learning note first, then ask AI to improve it.',
        result: null
      })
      return
    }

    setLearningNoteAiLoading(true)
    setLearningNoteAi({ error: '', result: null })

    try {
      const result = await improveAnnotation({
        source_text: `${sceneContext}\n\nCurrent route: ${currentRoute.label}`,
        annotation: formattedNote
      })
      setLearningNoteAi({ error: '', result })
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      setLearningNoteAi({
        error: message || 'AI learning note improvement is unavailable. Start the backend and try again.',
        result: null
      })
    } finally {
      setLearningNoteAiLoading(false)
    }
  }

  function useImprovedLearningNote() {
    if (!learningNoteAi.result?.improved_annotation) {
      return
    }

    const now = new Date().toISOString()
    const nextNote = {
      ...learningNote,
      sceneId: currentScene.identity.scene_id,
      improvedNote: learningNoteAi.result.improved_annotation,
      updatedAt: now
    }
    setLearningNote(nextNote)
    writeLearningNote(currentScene.identity.scene_id, nextNote)
    setLearningNoteSaved(true)
  }

  return (
    <div className="archive-page">
      <button className="text-link" type="button" onClick={() => onNavigate('/')}>
        Back to main platform home
      </button>

      <section className="archive-hero">
        <p className="eyebrow">Interactive narrative prototype</p>
        <h1>{currentScene.title}</h1>
        <p className="archive-opening">{currentScene.opening_text}</p>
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
              <p className="archive-step">{currentScene.identity.scene_label}</p>
              <h2>{currentScene.identity.scene_title}</h2>
            </div>
            <ol className="narrative-list">
              {narrativeBeats.map((beat) => (
                <li key={beat}>{beat}</li>
              ))}
            </ol>
          </section>
          <AnnotationPanel
            pageId={ARCHIVE_PAGE_ID}
            targetId={currentScene.identity.scene_id}
            targetText={sceneTargetText}
          />

          <section className="archive-question">
            <h2>{currentScene.core_question}</h2>
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
                  <li key={link.href}>
                    <a href={link.href}>
                      <span>{link.label}</span>
                      <small>{link.href}</small>
                    </a>
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
                        <a href={archive.path}>
                          <span>{archive.title}</span>
                          <small>{archive.path}</small>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </section>

          <section className="archive-card learning-note-card">
            <div>
              <p className="archive-step">Your Learning Note</p>
              <h2>Write a short output</h2>
              <p>
                Save a small note about what you understood. It stays in this browser for the MVP
                and can be edited after refresh.
              </p>
            </div>
            <div>
              <form className="learning-note-form" onSubmit={saveLearningNote}>
                <label htmlFor="learning-note-problem">What problem did you notice in this scene?</label>
                <textarea
                  id="learning-note-problem"
                  value={learningNote.noticedProblem}
                  onChange={(event) => updateLearningNote('noticedProblem', event.target.value)}
                  rows={3}
                  placeholder="Example: the worker has little control over time, route, and evaluation."
                />

                <label htmlFor="learning-note-route">Which explanation route did you choose, and why?</label>
                <textarea
                  id="learning-note-route"
                  value={learningNote.routeReflection}
                  onChange={(event) => updateLearningNote('routeReflection', event.target.value)}
                  rows={3}
                  placeholder={`Current route: ${currentRoute.label}. Why does this route help explain the scene?`}
                />

                <label htmlFor="learning-note-question">What question do you still have?</label>
                <textarea
                  id="learning-note-question"
                  value={learningNote.remainingQuestion}
                  onChange={(event) => updateLearningNote('remainingQuestion', event.target.value)}
                  rows={3}
                  placeholder="Example: who decides what the platform should optimize?"
                />

                <div className="learning-note-actions">
                  <button type="submit">Save learning note</button>
                  <button type="button" onClick={improveLearningNote} disabled={learningNoteAiLoading}>
                    {learningNoteAiLoading ? 'Improving...' : 'Improve with AI'}
                  </button>
                </div>
              </form>

              <div className="learning-note-status" aria-live="polite">
                {learningNoteSaved ? <p>Learning note saved in this browser.</p> : null}
                {learningNote.updatedAt ? <p>Last saved: {new Date(learningNote.updatedAt).toLocaleString()}</p> : null}
                {learningNoteAi.error ? <p className="ai-tutor-error">{learningNoteAi.error}</p> : null}
                {learningNoteAi.result ? (
                  <section className="learning-note-ai-result">
                    <h3>AI suggestion</h3>
                    <p>
                      <strong>Feedback:</strong> {learningNoteAi.result.feedback}
                    </p>
                    <p>
                      <strong>Improved version:</strong> {learningNoteAi.result.improved_annotation}
                    </p>
                    <p>
                      <strong>Follow-up question:</strong> {learningNoteAi.result.follow_up_question}
                    </p>
                    <button type="button" onClick={useImprovedLearningNote}>
                      Use improved version
                    </button>
                  </section>
                ) : null}
                {learningNote.improvedNote ? (
                  <section className="learning-note-improved">
                    <h3>Saved improved version</h3>
                    <p>{learningNote.improvedNote}</p>
                  </section>
                ) : null}
              </div>
            </div>
          </section>

          <section className="archive-card knowledge-deeper-card">
            <div>
              <p className="archive-step">Go deeper in Knowledge Platform</p>
              <h2>Turn the scene into study routes</h2>
              <p>
                The delivery scene is a starting point. Follow one of these paths to connect the
                story problem to the wider knowledge base.
              </p>
            </div>
            <div className="knowledge-deeper-grid">
              {knowledgeDeepLinks.map((item) => (
                <a className="knowledge-deeper-link" href={item.href} key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </a>
              ))}
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
