type LegacyKnowledgeTreePageProps = {
  title: string
  sourceFile: string
  componentFile: string
  description: string
  items: string[]
  relatedLinks?: Array<{ label: string; href: string }>
}

export function LegacyKnowledgeTreePage({
  title,
  sourceFile,
  componentFile,
  description,
  items,
  relatedLinks = []
}: LegacyKnowledgeTreePageProps) {
  return (
    <article className="legacy-tree-page">
      <p className="eyebrow">Legacy knowledge tree</p>
      <h1>{title}</h1>
      <p className="legacy-tree-description">{description}</p>

      <section className="legacy-source-card">
        <div>
          <h2>Preserved Source</h2>
          <p>
            This route connects the new MVP frontend to the existing knowledge tree path. The
            original VitePress source files are preserved and remain the source of truth for the
            full old tree UI.
          </p>
        </div>
        <ul>
          <li>{sourceFile}</li>
          <li>{componentFile}</li>
        </ul>
      </section>

      {relatedLinks.length > 0 ? (
        <section className="legacy-link-row" aria-label="Related links">
          {relatedLinks.map((link) => (
            <a key={link.href} className="card-action open" href={link.href}>
              {link.label}
            </a>
          ))}
        </section>
      ) : null}

      <section className="legacy-tree-list">
        {items.map((item) => (
          <article className="legacy-tree-item" key={item}>
            {item}
          </article>
        ))}
      </section>
    </article>
  )
}

export const computerTreeItems = [
  '1. What Is Computer Science?',
  '2. Mathematical Foundations for Computer Science',
  '3. Models of Computation',
  '4. Data Structures and Algorithmic Thinking',
  '5. Classical Algorithms',
  '6. Modern Algorithms for Search, Retrieval, and Decision',
  '7. Programming and Software Construction',
  '8. Programming Languages',
  '9. Compilers and Translation Systems',
  '10. Computer Architecture',
  '11. Operating Systems',
  '12. Computer Networks',
  '13. Databases and Data Systems',
  '14. Distributed Systems',
  '15. Security, Privacy, and Trustworthy Systems',
  '16. Artificial Intelligence',
  '17. Machine Learning',
  '18. Deep Learning and Large Models',
  '19. Optimization and Control',
  '20. Robotics and Embodied Systems',
  '21. Autonomous Driving and Real-Time Systems',
  '22. Search, Recommendation, and Platform Systems',
  '23. Computational Finance and Market Systems',
  '24. Quantum Computing and Quantum Information',
  '25. From Theory to Practice: Building Modern Technological Systems'
]

export const algorithmTreeItems = [
  '1. Why We Still Need a New Introduction to Algorithms',
  '2. From Turing, Shannon, and von Neumann to the Modern Algorithmic World',
  '3. Complexity, Growth, and Resources',
  '4. Data Structures: The Organization of Memory',
  '5. Divide and Conquer',
  '6. Greedy Algorithms',
  '7. Dynamic Programming',
  '8. Graph Algorithms',
  '9. Search and Shortest Path',
  '10. NP-Completeness, Approximation, and Hardness',
  '11. CPU, GPU, TPU, and Heterogeneous Computation',
  '12. Algorithms in Chip Design and Computational Lithography',
  '13. Dynamic Pricing and Revenue Management',
  '14. Platform Allocation, Ranking, and Incentives',
  '15. Time-Decay Markets, Airline Revenue, and Last-Minute Pricing',
  '16. Search, Recommendation, and Information Flow',
  '17. From Statistical Learning to Deep Learning',
  '18. Transformer and Large-Model Algorithms',
  '19. ChatGPT as a Modern Algorithmic System',
  '20. Vector Databases, ANN, and External Memory',
  '21. Inference-Time Algorithms and Test-Time Compute',
  '22. Autonomous Driving and Real-Time Navigation Algorithms',
  '23. UAVs, Rocket Recovery, and Extreme Control Algorithms',
  '24. Humanoid Robotics and Behavior Foundation Models',
  '25. World Models and Retrieval-Native Intelligence',
  '26. Reasoning-Time and System-Aware Computation',
  '27. Toward a Unified Algorithmic Stack'
]
