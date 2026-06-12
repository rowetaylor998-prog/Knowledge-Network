import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ApiError, loadMarkdown as loadMarkdownContent } from '../api'

export type MarkdownPageProps = {
  contentPath: string
  title?: string
  afterContent?: ReactNode
}

export function MarkdownPage({ contentPath, title, afterContent }: MarkdownPageProps) {
  const [markdown, setMarkdown] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadMarkdown() {
      setIsLoading(true)
      setError('')
      setNotFound(false)
      setMarkdown('')
      try {
        const responseText = await loadMarkdownContent(contentPath, controller.signal)

        if (!responseText.trim()) {
          setNotFound(true)
          return
        }

        setMarkdown(responseText)
      } catch (loadError) {
        if ((loadError as Error).name !== 'AbortError') {
          if (loadError instanceof ApiError && loadError.status === 404) {
            setNotFound(true)
            return
          }

          setError(
            (loadError as Error).message ||
              'This Markdown page could not be loaded. Start the backend and try again.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadMarkdown()
    return () => controller.abort()
  }, [contentPath])

  return (
    <article className="markdown-page">
      {title ? <p className="eyebrow">{title}</p> : null}
      {isLoading ? <p className="markdown-state">Loading Markdown content...</p> : null}
      {notFound && !isLoading ? (
        <section className="markdown-state markdown-not-found">
          <h1>Markdown page not found</h1>
          <p>The requested content page does not exist yet.</p>
          <code>{contentPath}</code>
        </section>
      ) : null}
      {error && !isLoading ? (
        <section className="markdown-state markdown-error">
          <h1>Could not load this page</h1>
          <p>{error}</p>
        </section>
      ) : null}
      {!isLoading && !error && !notFound ? (
        <>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          {afterContent}
        </>
      ) : null}
    </article>
  )
}
