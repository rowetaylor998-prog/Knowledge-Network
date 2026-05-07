import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { apiUrl } from '../api'

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
        const response = await fetch(
          apiUrl(`/api/content/markdown?path=${encodeURIComponent(contentPath)}`),
          { signal: controller.signal }
        )

        const responseText = await response.text()

        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true)
            return
          }

          let detail = 'This Markdown page could not be loaded.'
          try {
            const parsed = JSON.parse(responseText) as { detail?: string }
            if (parsed.detail) {
              detail = parsed.detail
            }
          } catch {
            // Keep the friendly fallback instead of rendering raw backend output.
          }
          throw new Error(detail)
        }

        if (!responseText.trim()) {
          setNotFound(true)
          return
        }

        setMarkdown(responseText)
      } catch (loadError) {
        if ((loadError as Error).name !== 'AbortError') {
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
