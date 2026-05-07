type ContentCardProps = {
  title: string
  description: string
  status?: 'open' | 'soon'
  href?: string
}

export function ContentCard({ title, description, status = 'soon', href = '#' }: ContentCardProps) {
  const isOpen = status === 'open'

  return (
    <article className="content-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {isOpen ? (
        <a className="card-action open" href={href}>
          Open
        </a>
      ) : (
        <button className="card-action" type="button" disabled>
          Coming soon
        </button>
      )}
    </article>
  )
}
