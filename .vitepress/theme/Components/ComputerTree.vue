<template>
  <section class="icsx-page">
    <div class="icsx-layout">
      <div class="icsx-left">
        <div class="icsx-titlebox">
          <h1 class="icsx-title">Introduction to Modern Computer Science</h1>
        </div>

        <div class="icsx-brace" aria-hidden="true">
          <svg viewBox="0 0 70 1580" preserveAspectRatio="none">
            <path
              d="M60,10
                 C20,10 20,95 20,180
                 L20,680
                 C20,760 6,760 6,810
                 C6,860 20,860 20,940
                 L20,1440
                 C20,1525 20,1570 60,1570"
            />
          </svg>
        </div>
      </div>

      <div class="icsx-main">
        <div class="icsx-grid">
          <div class="icsx-item" v-for="item in introTree" :key="item.title">
            <div class="icsx-head">
              <div class="icsx-topic">{{ item.title }}</div>

              <template v-if="item.general">
                <div class="icsx-arrow">→</div>
                <a class="icsx-general" :href="item.link || '#'">{{ item.general }}</a>

                <details class="icsx-details">
                  <summary>topics</summary>
                  <ul>
                    <li v-for="topic in item.topics" :key="topic">{{ topic }}</li>
                    <li class="icsx-connection-item">
                      <details class="icsx-connection-details">
                        <summary>{{ item.connectionLabel }}</summary>
                        <div class="icsx-connections">{{ item.connections.join(' | ') }}</div>
                      </details>
                    </li>
                  </ul>
                </details>

                <div class="icsx-volumes">{{ item.volumes.join(' | ') }}</div>
              </template>

              <template v-else>
                <div class="icsx-arrow"></div>
                <div class="icsx-related">{{ item.volumes.join(' | ') }}</div>

                <details class="icsx-details">
                  <summary>topics</summary>
                  <ul>
                    <li v-for="topic in item.topics" :key="topic">{{ topic }}</li>
                    <li class="icsx-connection-item">
                      <details class="icsx-connection-details">
                        <summary>{{ item.connectionLabel }}</summary>
                        <div class="icsx-connections">{{ item.connections.join(' | ') }}</div>
                      </details>
                    </li>
                  </ul>
                </details>
              </template>
            </div>
          </div>
        </div>

        <div class="icsx-practice-wrap">
          <div class="icsx-practice-left">
            <div class="icsx-practice-title">Computer Technical Practice</div>
            <div class="icsx-practice-brace" aria-hidden="true">
              <svg viewBox="0 0 60 640" preserveAspectRatio="none">
                <path
                  d="M50,10
                     C20,10 20,60 20,110
                     L20,255
                     C20,305 8,305 8,325
                     C8,345 20,345 20,395
                     L20,540
                     C20,590 20,630 50,630"
                />
              </svg>
            </div>
          </div>

          <div class="icsx-practice-main">
            <div class="icsx-practice-grid">
              <div class="icsx-practice-item" v-for="item in practiceTree" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Next planned companion component: AlgorithmTree.vue using the same structural pattern as this file.
const introTree = [
  {
    title: '1. What Is Computer Science?',
    general: '',
    link: '',
    volumes: ['Foundations', 'Systems', 'AI/ML'],
    topics: [
      'Information, computation, and representation',
      'Programs, systems, and intelligence',
      'Theory, engineering, and practice',
      'Modern technological systems as computational systems'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Foundations', 'Systems', 'AI/ML']
  },
  {
    title: '2. Mathematical Foundations for Computer Science',
    general: 'General Introduction to Foundations of Computation',
    link: '#',
    volumes: ['Foundations', 'Algorithms', 'AI/ML', 'Control', 'Quantum'],
    topics: [
      'Logic, sets, and relations',
      'Graphs, combinatorics, and discrete structures',
      'Probability, linear algebra, and optimization',
      'Mathematics for modern computational systems'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Algorithms', 'AI/ML', 'Control', 'Quantum']
  },
  {
    title: '3. Models of Computation',
    general: '',
    link: '',
    volumes: ['Foundations', 'Programming Languages', 'Quantum'],
    topics: [
      'Computation as process and transformation',
      'Automata, grammars, and formal systems',
      'Computability and complexity',
      'Abstraction and computational limits'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Foundations', 'Programming Languages', 'Quantum']
  },
  {
    title: '4. Data Structures and Algorithmic Thinking',
    general: 'General Introduction to Algorithms',
    link: '/repositories/algorithms',
    volumes: ['Algorithms', 'Databases', 'AI/ML', 'Finance'],
    topics: [
      'Arrays, lists, trees, heaps, and hash tables',
      'Graphs, states, and structured representations',
      'Correctness, complexity, and tradeoffs',
      'Data structures in modern computational systems'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Databases', 'AI/ML', 'Finance', 'Systems']
  },
  {
    title: '5. Classical Algorithms',
    general: '',
    link: '',
    volumes: ['Algorithms', 'Foundations', 'AI/ML'],
    topics: [
      'Sorting, searching, and selection',
      'Divide and conquer',
      'Greedy methods and dynamic programming',
      'Graph algorithms and computational efficiency'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Foundations', 'AI/ML', 'Control', 'Finance']
  },
  {
    title: '6. Modern Algorithms for Search, Retrieval, and Decision',
    general: '',
    link: '',
    volumes: ['Algorithms', 'AI/ML', 'Search/Recommendation'],
    topics: [
      'State-space search and planning',
      'Sequence decoding and beam search',
      'Retrieval and approximate nearest neighbors',
      'Online, randomized, and real-time decision algorithms'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['AI/ML', 'Search/Recommendation', 'Finance', 'Databases']
  },
  {
    title: '7. Programming and Software Construction',
    general: 'General Introduction to Programming and Software Construction',
    link: '#',
    volumes: ['Programming', 'Systems', 'AI/ML'],
    topics: [
      'Programs as structured artifacts',
      'Modularity, abstraction, and interfaces',
      'Testing, debugging, and correctness',
      'Software engineering as the bridge from theory to systems'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Systems', 'AI/ML', 'Security/Trust', 'Compilers']
  },
  {
    title: '8. Programming Languages',
    general: 'General Introduction to Programming Languages',
    link: '#',
    volumes: ['Programming Languages', 'Compilers', 'Foundations'],
    topics: [
      'Syntax, semantics, and meaning',
      'Programming paradigms and abstraction',
      'Type systems and safety',
      'Language design for modern computation'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Compilers', 'Foundations', 'Systems', 'AI/ML']
  },
  {
    title: '9. Compilers and Translation Systems',
    general: 'General Introduction to Compilers and Translation Systems',
    link: '#',
    volumes: ['Compilers', 'Programming Languages', 'Systems', 'AI/ML'],
    topics: [
      'Lexical and syntactic analysis',
      'Intermediate representations',
      'Optimization and transformation',
      'Code generation for modern hardware and AI workloads'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Programming Languages', 'Systems', 'AI/ML', 'Architecture']
  },
  {
    title: '10. Computer Architecture',
    general: 'General Introduction to Computer Architecture and Systems',
    link: '#',
    volumes: ['Architecture', 'Systems', 'AI/ML', 'Control'],
    topics: [
      'Processors, memory, and storage',
      'Hardware-software interaction',
      'Parallelism and performance',
      'Architectures for modern intelligent systems'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Systems', 'AI/ML', 'Control', 'Quantum']
  },
  {
    title: '11. Operating Systems',
    general: '',
    link: '',
    volumes: ['Architecture/Systems', 'Distributed Systems', 'Security/Trust'],
    topics: [
      'Processes, threads, and scheduling',
      'Memory, files, and resources',
      'Concurrency and synchronization',
      'Operating systems for modern services and real-time execution'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Architecture', 'Distributed Systems', 'Security/Trust', 'Robotics']
  },
  {
    title: '12. Computer Networks',
    general: 'General Introduction to Computer Networks',
    link: '#',
    volumes: ['Networks', 'Distributed Systems', 'Systems', 'Finance'],
    topics: [
      'Communication, protocols, and reliability',
      'Latency, throughput, and scalability',
      'Internet and service communication',
      'Streaming and real-time networking'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Distributed Systems', 'Systems', 'Finance', 'AI/ML']
  },
  {
    title: '13. Databases and Data Systems',
    general: 'General Introduction to Databases and Data Systems',
    link: '#',
    volumes: ['Databases', 'Systems', 'Search/Recommendation', 'Finance'],
    topics: [
      'Relational data and data modeling',
      'Transactions, indexing, and queries',
      'NoSQL, logs, and feature stores',
      'Vector databases and modern memory systems'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Systems', 'Search/Recommendation', 'Finance', 'AI/ML']
  },
  {
    title: '14. Distributed Systems',
    general: 'General Introduction to Distributed Systems, Security, Privacy, and Trust',
    link: '#',
    volumes: ['Distributed Systems', 'Networks', 'Systems', 'Security/Trust'],
    topics: [
      'Replication, coordination, and consistency',
      'Fault tolerance and reliability',
      'Scalability and service orchestration',
      'Distributed systems for AI, markets, and platforms'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Networks', 'Systems', 'Security/Trust', 'Databases']
  },
  {
    title: '15. Security, Privacy, and Trustworthy Systems',
    general: '',
    link: '',
    volumes: ['Distributed Systems', 'Security/Trust', 'AI/ML'],
    topics: [
      'Threat models and security foundations',
      'Authentication, authorization, and trust',
      'Privacy and data protection',
      'Robustness and trustworthy system design'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Systems', 'AI/ML', 'Finance', 'Quantum']
  },
  {
    title: '16. Artificial Intelligence',
    general: 'General Introduction to Artificial Intelligence, Machine Learning, and Large Models',
    link: '#',
    volumes: ['AI/ML', 'Algorithms', 'Search/Recommendation', 'Robotics'],
    topics: [
      'Intelligence as search, reasoning, and action',
      'Symbolic methods and modern AI',
      'Planning, inference, and decision making',
      'AI as system construction'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Algorithms', 'Search/Recommendation', 'Robotics', 'Systems']
  },
  {
    title: '17. Machine Learning',
    general: '',
    link: '',
    volumes: ['AI/ML', 'Foundations', 'Algorithms'],
    topics: [
      'Learning from data',
      'Prediction, representation, and generalization',
      'Supervised, unsupervised, and reinforcement learning',
      'Machine learning in real-world practice'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Foundations', 'Algorithms', 'Finance', 'Databases']
  },
  {
    title: '18. Deep Learning and Large Models',
    general: '',
    link: '',
    volumes: ['AI/ML', 'Algorithms', 'Systems', 'Databases'],
    topics: [
      'Neural representations and deep architectures',
      'Transformers and sequence modeling',
      'Multimodal systems, LLMs, and agents',
      'Inference, deployment, and scaling'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Algorithms', 'Systems', 'Databases', 'Search/Recommendation']
  },
  {
    title: '19. Optimization and Control',
    general: 'General Introduction to Optimization, Control, Robotics, and Autonomous Systems',
    link: '#',
    volumes: ['Control', 'Foundations', 'AI/ML', 'Finance'],
    topics: [
      'Objective functions, constraints, and tradeoffs',
      'Gradient-based and constrained optimization',
      'Feedback, estimation, and stability',
      'Optimization in learning, markets, and autonomy'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Foundations', 'AI/ML', 'Finance', 'Robotics']
  },
  {
    title: '20. Robotics and Embodied Systems',
    general: 'General Introduction to Optimization, Control, Robotics, and Autonomous Systems',
    link: '#',
    volumes: ['Robotics', 'Control', 'Systems', 'AI/ML'],
    topics: [
      'Sensing, perception, and embodiment',
      'Planning, action, and interaction',
      'Robot architectures and middleware',
      'Learning for physical systems'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Control', 'Systems', 'AI/ML', 'Networks']
  },
  {
    title: '21. Autonomous Driving and Real-Time Systems',
    general: '',
    link: '',
    volumes: ['Control/Robotics', 'Systems', 'AI/ML', 'Networks'],
    topics: [
      'Perception, prediction, and planning',
      'Control in dynamic environments',
      'Real-time decision making',
      'Safety and verification'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Control', 'Systems', 'AI/ML', 'Networks']
  },
  {
    title: '22. Search, Recommendation, and Platform Systems',
    general: 'General Introduction to Search, Recommendation, and Platform Systems',
    link: '#',
    volumes: ['Search/Recommendation', 'Algorithms', 'Databases', 'AI/ML', 'Finance'],
    topics: [
      'Search, retrieval, and ranking',
      'Recommendation and online feedback loops',
      'User modeling and platform objectives',
      'Attention allocation in large-scale systems'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Algorithms', 'Databases', 'AI/ML', 'Finance']
  },
  {
    title: '23. Computational Finance and Market Systems',
    general: 'General Introduction to Computational Finance and Market Systems',
    link: '#',
    volumes: ['Finance', 'Algorithms', 'Systems', 'Networks', 'Databases'],
    topics: [
      'Markets as computational systems',
      'Order books, matching engines, and execution',
      'Risk, latency, and real-time infrastructure',
      'Quantitative systems and financial data'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Algorithms', 'Systems', 'Networks', 'Databases']
  },
  {
    title: '24. Quantum Computing and Quantum Information',
    general: 'General Introduction to Quantum Computing and Quantum Information',
    link: '#',
    volumes: ['Quantum', 'Foundations', 'Algorithms', 'Security/Trust'],
    topics: [
      'Qubits, states, and quantum information',
      'Quantum gates and circuits',
      'Quantum algorithms and complexity',
      'Quantum opportunities and limits'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['Foundations', 'Algorithms', 'Security/Trust', 'Architecture']
  },
  {
    title: '25. From Theory to Practice: Building Modern Technological Systems',
    general: '',
    link: '',
    volumes: ['All Volumes'],
    topics: [
      'How theories become system components',
      'How departments become technological stacks',
      'How modern systems are assembled',
      'How study leads to construction and practice'
    ],
    connectionLabel: 'Connections to Other Fields',
    connections: ['All Volumes']
  }
]

const practiceTree = [
  'Large Language Models',
  'Agent Systems',
  'Search Systems',
  'Recommendation Systems',
  'Autonomous Driving',
  'Robotics',
  'UAV Systems',
  'Rocket Recovery',
  'Financial Market Systems',
  'Platform Infrastructure Systems',
  'Distributed AI Services',
  'Intelligent Industrial Systems'
]
</script>

<style scoped>
.icsx-page {
  width: 100%;
}

.icsx-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.icsx-left {
  position: sticky;
  top: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 1580px;
}

.icsx-titlebox {
  width: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icsx-title {
  margin: 0;
  font-size: 34px;
  line-height: 1.05;
  text-align: center;
  color: #7a4b28;
  font-weight: 700;
}

.icsx-brace {
  width: 62px;
  height: 1580px;
  display: flex;
  align-items: center;
}

.icsx-brace svg,
.icsx-practice-brace svg {
  width: 100%;
  height: 100%;
}

.icsx-brace path,
.icsx-practice-brace path {
  fill: none;
  stroke: #8c6a4a;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icsx-main {
  min-width: 0;
}

.icsx-grid {
  display: grid;
  gap: 6px;
}

.icsx-item {
  padding: 6px 10px 4px 10px;
  border-top: 1px solid #d9c8b5;
  border-bottom: 1px solid #d9c8b5;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  background: transparent;
}

.icsx-head {
  display: grid;
  grid-template-columns: minmax(420px, 1fr) 24px minmax(430px, 1fr);
  column-gap: 10px;
  row-gap: 0;
  align-items: start;
}

.icsx-topic {
  grid-column: 1;
  font-weight: 700;
  font-size: 17px;
  line-height: 1.2;
  color: #4f3520;
  margin: 0;
}

.icsx-arrow {
  grid-column: 2;
  text-align: center;
  font-weight: 700;
  color: #8c6a4a;
  line-height: 1.2;
}

.icsx-general {
  grid-column: 3;
  font-size: 16px;
  line-height: 1.2;
  color: #8c5a2b;
  text-decoration: none;
  font-weight: 600;
  margin: 0;
}
 .icsx-related {
  grid-column: 3;
  font-size: 12px;
  line-height: 1.15;
  color: #8c6a4a;
}
.icsx-general:hover {
  text-decoration: underline;
}

.icsx-details {
  grid-column: 1;
  margin-top: 2px;
}

.icsx-volumes {
  grid-column: 3;
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.15;
  color: #8c6a4a;
}

.icsx-details summary {
  cursor: pointer;
  color: #b24b3e;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.1;
}

.icsx-connection-details summary {
  cursor: pointer;
  color: #8c6a4a;
  font-weight: 600;
  font-size: 13px;
  line-height: 1.1;
}

.icsx-details ul {
  margin: 4px 0 0 16px;
  padding: 0;
}

.icsx-details li {
  margin: 2px 0;
  color: #5e4633;
  line-height: 1.3;
  font-size: 13px;
}

.icsx-connection-item {
  list-style: none;
  margin-left: 0;
  margin-top: 2px;
}

.icsx-connection-details {
  margin-top: 0;
}

.icsx-connections {
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.25;
  color: #6f5237;
}

.icsx-practice-wrap {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.icsx-practice-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 640px;
}

.icsx-practice-title {
  width: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 28px;
  line-height: 1.05;
  color: #7a4b28;
  font-weight: 700;
}

.icsx-practice-brace {
  width: 52px;
  height: 640px;
  display: flex;
  align-items: center;
}

.icsx-practice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.icsx-practice-item {
  padding: 8px 10px;
  border-top: 1px solid #d9c8b5;
  border-bottom: 1px solid #d9c8b5;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  background: transparent;
  color: #5e4633;
  font-weight: 600;
  line-height: 1.25;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .icsx-layout,
  .icsx-practice-wrap {
    grid-template-columns: 1fr;
  }

  .icsx-left,
  .icsx-practice-left {
    position: static;
    min-height: auto;
  }

  .icsx-brace,
  .icsx-practice-brace {
    display: none;
  }
}

@media (max-width: 860px) {
  .icsx-head {
    grid-template-columns: 1fr;
  }

  .icsx-arrow,
  .icsx-general,
  .icsx-volumes {
    grid-column: 1;
  }

  .icsx-arrow {
    text-align: left;
  }

  .icsx-details {
    margin-top: 6px;
  }

  .icsx-practice-grid {
    grid-template-columns: 1fr;
  }
}
</style>