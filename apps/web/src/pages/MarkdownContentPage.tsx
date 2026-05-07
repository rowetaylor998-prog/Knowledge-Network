import { MarkdownPage } from '../components/MarkdownPage'
import { AnnotationPanel } from '../components/AnnotationPanel'

export type MarkdownContentPageProps = {
  contentPath: string
  title?: string
}

export function MarkdownContentPage({ contentPath, title }: MarkdownContentPageProps) {
  return (
    <MarkdownPage
      contentPath={contentPath}
      title={title}
      afterContent={<AnnotationPanel pageId={contentPath} />}
    />
  )
}
