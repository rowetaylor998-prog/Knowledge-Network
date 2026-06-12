import { useState } from 'react'
import { askTutor } from '../api'

export function AITutorWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [provider, setProvider] = useState('external')
  const [model, setModel] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion) {
      setError('Please enter a question first.')
      return
    }

    setIsLoading(true)
    setError('')
    setAnswer('')

    try {
      const data = await askTutor({
        question: trimmedQuestion,
        context: '',
        page_title: document.title,
        provider,
        model: model.trim() || undefined
      })
      setAnswer(data.answer || 'No answer returned.')
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : ''
      setError(message || 'AI Tutor is unavailable. Start the backend or configure VITE_API_BASE_URL and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <aside className="ai-tutor-widget" aria-label="AI Tutor">
      {isOpen ? (
        <section className="ai-tutor-panel">
          <div className="ai-tutor-header">
            <div>
              <p className="ai-tutor-kicker">Learning helper</p>
              <h2>AI Tutor</h2>
            </div>
            <button type="button" className="ai-tutor-close" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>

          <form className="ai-tutor-form" onSubmit={handleSubmit}>
            <div className="ai-tutor-controls">
              <label htmlFor="ai-provider">
                Provider
                <select
                  id="ai-provider"
                  value={provider}
                  onChange={(event) => setProvider(event.target.value)}
                >
                  <option value="openai">openai</option>
                  <option value="xai">xai</option>
                  <option value="external">external</option>
                </select>
              </label>

              <label htmlFor="ai-model">
                Model
                <input
                  id="ai-model"
                  type="text"
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  placeholder="e.g. gpt-5.4-mini or grok-4"
                />
              </label>
            </div>

            <label htmlFor="ai-tutor-question">Question</label>
            <textarea
              id="ai-tutor-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about this page, a concept, or a learning problem..."
              rows={5}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Thinking...' : 'Send'}
            </button>
          </form>

          <div className="ai-tutor-response" aria-live="polite">
            {error ? <p className="ai-tutor-error">{error}</p> : null}
            {answer ? <p>{answer}</p> : null}
            {!error && !answer && !isLoading ? <p>Ask a concise question to begin.</p> : null}
          </div>
        </section>
      ) : null}

      <button type="button" className="ai-tutor-toggle" onClick={() => setIsOpen((value) => !value)}>
        AI Tutor
      </button>
    </aside>
  )
}
