import { useEffect, useMemo, useState } from 'react'
import { improveAnnotation as improveAnnotationRequest } from '../api'

const STORAGE_KEY = 'bkfi_annotations_v1'

function normalizeAnnotation(annotation) {
  const createdAt = annotation.createdAt || new Date().toISOString()

  return {
    ...annotation,
    id: annotation.id || createId(),
    pagePath: annotation.pagePath || annotation.pageId || '',
    selectedText: annotation.selectedText || annotation.targetText || '',
    annotationText: annotation.annotationText || annotation.text || '',
    createdAt,
    updatedAt: annotation.updatedAt || createdAt
  }
}

function readAnnotationStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}

    if (Array.isArray(parsed)) {
      return parsed.reduce((store, annotation) => {
        const normalized = normalizeAnnotation(annotation)
        if (!normalized.pagePath) {
          return store
        }

        store[normalized.pagePath] = store[normalized.pagePath] || []
        store[normalized.pagePath].push(normalized)
        return store
      }, {})
    }

    if (!parsed || typeof parsed !== 'object') {
      return {}
    }

    return Object.entries(parsed).reduce((store, [pagePath, annotations]) => {
      store[pagePath] = Array.isArray(annotations)
        ? annotations.map((annotation) => normalizeAnnotation({ ...annotation, pagePath }))
        : []
      return store
    }, {})
  } catch {
    return {}
  }
}

function readAnnotations(pagePath) {
  const store = readAnnotationStore()
  return store[pagePath] || []
}

function writeAnnotations(pagePath, annotations) {
  const store = readAnnotationStore()
  store[pagePath] = annotations
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
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
  const pagePath = pageId
  const [isOpen, setIsOpen] = useState(false)
  const [annotationText, setAnnotationText] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [annotations, setAnnotations] = useState([])
  const [editingId, setEditingId] = useState('')
  const [editingText, setEditingText] = useState('')
  const [editingSelectedText, setEditingSelectedText] = useState('')
  const [improvements, setImprovements] = useState({})
  const [improvingId, setImprovingId] = useState('')

  useEffect(() => {
    setAnnotations(readAnnotations(pagePath))
  }, [pagePath])

  const visibleAnnotations = useMemo(
    () =>
      annotations
        .filter((annotation) => (targetId ? annotation.targetId === targetId : !annotation.targetId))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [annotations, targetId]
  )

  function captureSelectedText() {
    const selection = window.getSelection?.().toString().trim()
    if (selection) {
      setSelectedText(selection)
    }
  }

  function saveAnnotation(event) {
    event.preventDefault()
    const trimmed = annotationText.trim()
    if (!trimmed) {
      return
    }

    const now = new Date().toISOString()
    const annotation = {
      id: createId(),
      pagePath,
      targetId: targetId || undefined,
      selectedText: selectedText.trim() || targetText || '',
      annotationText: trimmed,
      createdAt: now,
      updatedAt: now
    }

    const nextAnnotations = [...annotations, annotation]
    setAnnotations(nextAnnotations)
    writeAnnotations(pagePath, nextAnnotations)
    setAnnotationText('')
    setSelectedText('')
    setIsOpen(true)
  }

  function startEditing(annotation) {
    setEditingId(annotation.id)
    setEditingText(annotation.annotationText)
    setEditingSelectedText(annotation.selectedText || '')
  }

  function cancelEditing() {
    setEditingId('')
    setEditingText('')
    setEditingSelectedText('')
  }

  function saveEditedAnnotation(event, annotation) {
    event.preventDefault()
    const trimmed = editingText.trim()
    if (!trimmed) {
      return
    }

    const now = new Date().toISOString()
    const nextAnnotations = annotations.map((item) =>
      item.id === annotation.id
        ? {
            ...item,
            selectedText: editingSelectedText.trim(),
            annotationText: trimmed,
            updatedAt: now
          }
        : item
    )
    setAnnotations(nextAnnotations)
    writeAnnotations(pagePath, nextAnnotations)
    cancelEditing()
  }

  function deleteAnnotation(id) {
    const nextAnnotations = annotations.filter((annotation) => annotation.id !== id)
    setAnnotations(nextAnnotations)
    writeAnnotations(pagePath, nextAnnotations)
    setImprovements((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
    if (editingId === id) {
      cancelEditing()
    }
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
      const data = await improveAnnotationRequest({
        source_text: annotation.selectedText || targetText || document.title || pagePath,
        annotation: annotation.annotationText
      })

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
      item.id === annotation.id ? { ...item, annotationText: improvedText, updatedAt: now } : item
    )
    setAnnotations(nextAnnotations)
    writeAnnotations(pagePath, nextAnnotations)
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
            <label htmlFor={`annotation-selected-${pagePath}-${targetId || 'page'}`}>
              Selected text or page context
            </label>
            <textarea
              id={`annotation-selected-${pagePath}-${targetId || 'page'}`}
              value={selectedText}
              onChange={(event) => setSelectedText(event.target.value)}
              placeholder="Optional: paste selected text here, or select text on the page and use the button below."
              rows={2}
            />
            <button type="button" className="annotation-secondary-button" onClick={captureSelectedText}>
              Use current selection
            </button>
            <label htmlFor={`annotation-${pagePath}-${targetId || 'page'}`}>Write annotation</label>
            <textarea
              id={`annotation-${pagePath}-${targetId || 'page'}`}
              value={annotationText}
              onChange={(event) => setAnnotationText(event.target.value)}
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
                  {editingId === annotation.id ? (
                    <form
                      className="annotation-form annotation-edit-form"
                      onSubmit={(event) => saveEditedAnnotation(event, annotation)}
                    >
                      <label htmlFor={`annotation-edit-selected-${annotation.id}`}>
                        Selected text or page context
                      </label>
                      <textarea
                        id={`annotation-edit-selected-${annotation.id}`}
                        value={editingSelectedText}
                        onChange={(event) => setEditingSelectedText(event.target.value)}
                        rows={2}
                      />
                      <label htmlFor={`annotation-edit-${annotation.id}`}>Annotation</label>
                      <textarea
                        id={`annotation-edit-${annotation.id}`}
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        rows={4}
                      />
                      <div className="annotation-actions">
                        <button type="submit">Save changes</button>
                        <button type="button" className="annotation-secondary-button" onClick={cancelEditing}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {annotation.selectedText ? (
                        <p className="annotation-item-target">{annotation.selectedText}</p>
                      ) : null}
                      <p>{annotation.annotationText}</p>
                    </>
                  )}
                  {improvements[annotation.id]?.error ? (
                    <p className="annotation-ai-error">{improvements[annotation.id].error}</p>
                  ) : null}
                  {improvements[annotation.id]?.result ? (
                    <section className="annotation-ai-result">
                      <h4>AI improvement</h4>
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
                          Use improved version
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
                    {improvingId === annotation.id ? 'Improving...' : 'Improve with AI'}
                  </button>
                  <button type="button" onClick={() => startEditing(annotation)}>
                    Edit
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
