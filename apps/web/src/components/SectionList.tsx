type SectionListProps = {
  title: string
  description: string
  items: string[]
}

export function SectionList({ title, description, items }: SectionListProps) {
  return (
    <section className="section-block">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
