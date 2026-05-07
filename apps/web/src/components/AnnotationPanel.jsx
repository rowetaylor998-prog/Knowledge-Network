import { useEffect, useMemo, useState } from 'react'
import { apiUrl } from '../api'

const STORAGE_KEY = 'bkfi_annotations_v1'

function readAnnotations() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAnnotations(annotations) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations))
}

function createId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }
  return `annotation-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

export function AnnotationPanel({ pageId, targetText = '', targetId = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [annotations, setAnnotations] = useState([])
  const [improvements, setImprovements] = useState({})
  const [improvingId, setImprovingId] = useState('')

  useEffect(() => {
    setAnnotations(readAnnotations())
  }, [])

  const visibleAnnotations = useMemo(
    () =>
      annotations
        .filter((annotation) => annotation.pageId === pageId)
        .filter((annotation) => (targetId ? annotation.targetId === targetId : !annotation.targetId))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [annotations, pageId, targetId]
  )

  function saveAnnotation(event) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    const now = new Date().toISOString()
    const annotation = {
      id: createId(),
      pageId,
      targetId: targetId || undefined,
      targetText: targetText || undefined,
      text: trimmed,
      createdAt: now
    }

    const nextAnnotations = [...annotations, annotation]
    setAnnotations(nextAnnotations)
    writeAnnotations(nextAnnotations)
    setText('')
    setIsOpen(true)
  }

  function deleteAnnotation(id) {
    const nextAnnotations = annotations.filter((annotation) => annotation.id !== id)
    setAnnotations(nextAnnotations)
    writeAnnotations(nextAnnotations)
    setImprovements((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  async function improveAnnotation(annotation) {
    setImprovingId(annotation.id)
    setImprovements((current) => ({
      ...current,
      [annotation.id]: {
        error: '',
        result: null
      }
    }))

    try {
      const response = await fetch(apiUrl('/api/tutor/improve-annotation'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_text: annotation.targetText || targetText || document.title || pageId,
          annotation: annotation.text
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || `Backend returned ${response.status}`)
      }

      setImprovements((current) => ({
        ...current,
        [annotation.id]: {
          error: '',
          result: data
        }
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      setImprovements((current) => ({
        ...current,
        [annotation.id]: {
          error: message || 'AI annotation improvement is unavailable. Start the backend and try again.',
          result: null
        }
      }))
    } finally {
      setImprovingId('')
    }
  }

  function replaceAnnotation(annotation, improvedText) {
    const now = new Date().toISOString()
    const nextAnnotations = annotations.map((item) =>
      item.id === annotation.id ? { ...item, text: improvedText, updatedAt: now } : item
    )
    setAnnotations(nextAnnotations)
    writeAnnotations(nextAnnotations)
    setImprovements((current) => {
      const next = { ...current }
      delete next[annotation.id]
      return next
    })
  }

  function keepOriginal(id) {
    setImprovements((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  return (
    <section className="annotation-panel">
      <button type="button" className="annotation-toggle" onClick={() => setIsOpen((value) => !value)}>
        {isOpen ? 'Hide annotations' : `Annotations (${visibleAnnotations.length})`}
      </button>

      {isOpen ? (
        <div className="annotation-body">
          {targetText ? (
            <blockquote className="annotation-target">
              <p>{targetText}</p>
            </blockquote>
          ) : null}

          <form className="annotation-form" onSubmit={saveAnnotation}>
            <label htmlFor={`annotation-${pageId}-${targetId || 'page'}`}>Write annotation</label>
            <textarea
              id={`annotation-${pageId}-${targetId || 'page'}`}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write your note, question, insight, or disagreement..."
              rows={4}
            />
            <button type="submit">Save annotation</button>
          </form>

          <div className="annotation-list">
            {visibleAnnotations.length === 0 ? <p>No annotations yet.</p> : null}
            {visibleAnnotations.map((annotation) => (
              <article className="annotation-item" key={annotation.id}>
                <div>
                  <time dateTime={annotation.createdAt}>{formatTime(annotation.createdAt)}</time>
                  {annotation.updatedAt ? (
                    <time dateTime={annotation.updatedAt}>Updated {formatTime(annotation.updatedAt)}</time>
                  ) : null}
                  {annotation.targetText ? <p className="annotation-item-target">{annotation.targetText}</p> : null}
                  <p>{annotation.text}</p>
                  {improvements[annotation.id]?.error ? (
                    <p className="annotation-ai-error">{improvements[annotation.id].error}</p>
                  ) : null}
                  {improvements[annotation.id]?.result ? (
                    <section className="annotation-ai-result">
                      <h4>AI 修改建议</h4>
                      <p>
                        <strong>Feedback:</strong> {improvements[annotation.id].result.feedback}
                      </p>
                      <p>
                        <strong>Improved annotation:</strong>{' '}
                        {improvements[annotation.id].result.improved_annotation}
                      </p>
                      <p>
                        <strong>Follow-up question:</strong>{' '}
                        {improvements[annotation.id].result.follow_up_question}
                      </p>
                      <div className="annotation-actions">
                        <button
                          type="button"
                          onClick={() =>
                            replaceAnnotation(
                              annotation,
                              improvements[annotation.id].result.improved_annotation
                            )
                          }
                        >
                          Replace my annotation
                        </button>
                        <button type="button" onClick={() => keepOriginal(annotation.id)}>
                          Keep original
                        </button>
                      </div>
                    </section>
                  ) : null}
                </div>
                <div className="annotation-actions">
                  <button
                    type="button"
                    onClick={() => improveAnnotation(annotation)}
                    disabled={improvingId === annotation.id}
                  >
                    {improvingId === annotation.id ? 'Improving...' : 'AI 修改批注'}
                  </button>
                  <button type="button" onClick={() => deleteAnnotation(annotation.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
