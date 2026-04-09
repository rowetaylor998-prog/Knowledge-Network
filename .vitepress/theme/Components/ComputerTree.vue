<template>
  <section class="ics-page">
    <h1 class="ics-title">Introduction to Computer Science</h1>

    <div class="ics-tree-block">
      <div class="ics-tree-label">Tree A — Introduction Structure</div>

      <div class="ics-tree-wrap">
        <div class="ics-brace" aria-hidden="true">
          <svg viewBox="0 0 60 1000" preserveAspectRatio="none">
            <path
              d="M52,10
                 C25,10 25,90 25,170
                 L25,410
                 C25,470 10,470 10,500
                 C10,530 25,530 25,590
                 L25,830
                 C25,910 25,990 52,990"
            />
          </svg>
        </div>

        <div class="ics-tree-list">
          <div class="ics-node" v-for="item in introTree" :key="item.title">
            <div class="ics-row">
              <div class="ics-topic">{{ item.title }}</div>
              <div class="ics-arrow">→</div>
              <a class="ics-general" href="#">{{ item.general }}</a>
            </div>

            <details class="ics-details">
              <summary>Expand topics</summary>
              <ul>
                <li v-for="topic in item.topics" :key="topic">{{ topic }}</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </div>

    <div class="ics-practice-block">
      <div class="ics-tree-label">Tree B — Practice Systems</div>

      <div class="ics-tree-wrap">
        <div class="ics-brace" aria-hidden="true">
          <svg viewBox="0 0 60 1000" preserveAspectRatio="none">
            <path
              d="M52,10
                 C25,10 25,90 25,170
                 L25,410
                 C25,470 10,470 10,500
                 C10,530 25,530 25,590
                 L25,830
                 C25,910 25,990 52,990"
            />
          </svg>
        </div>

        <div class="ics-tree-list">
          <div class="ics-practice-item" v-for="item in practiceTree" :key="item">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const introTree = [
  {
    title: '1. Foundations of Computation',
    general: 'General Introduction to Computer Foundations',
    topics: [
      'What computation is',
      'Representation of information',
      'Models of computation',
      'Limits of computation',
      'Bridge: computation and real systems'
    ]
  },
  {
    title: '2. Data Structures and Algorithmic Thinking',
    general: 'General Introduction to Algorithms',
    topics: [
      'Data structures and abstraction',
      'Searching and sorting',
      'Divide and conquer, greedy, dynamic programming',
      'Graph algorithms and computational complexity',
      'Bridge: algorithms and optimization'
    ]
  },
  {
    title: '3. Programming and Software Construction',
    general: 'General Introduction to Programming and Software Engineering',
    topics: [
      'Programming as structured problem solving',
      'Software construction and modularity',
      'Debugging and testing',
      'Engineering workflow',
      'Bridge: programming and systems'
    ]
  },
  {
    title: '4. Programming Languages',
    general: 'General Introduction to Programming Languages',
    topics: [
      'Syntax and semantics',
      'Abstraction and paradigms',
      'Type systems',
      'Language design',
      'Bridge: languages and compilers'
    ]
  },
  {
    title: '5. Compilers and Translation Systems',
    general: 'General Introduction to Compilers',
    topics: [
      'Lexing and parsing',
      'Intermediate representation',
      'Semantic analysis',
      'Optimization and code generation',
      'Bridge: compilers and architecture'
    ]
  },
  {
    title: '6. Computer Architecture',
    general: 'General Introduction to Computer Architecture',
    topics: [
      'Machine structure',
      'Instruction execution',
      'CPU, memory, storage hierarchy',
      'Performance and parallelism',
      'Bridge: architecture and operating systems'
    ]
  },
  {
    title: '7. Operating Systems',
    general: 'General Introduction to Operating Systems',
    topics: [
      'Processes and threads',
      'Scheduling',
      'Memory management',
      'File systems',
      'Bridge: operating systems and distributed systems'
    ]
  },
  {
    title: '8. Computer Networks',
    general: 'General Introduction to Computer Networks',
    topics: [
      'Protocols and communication',
      'Routing and transport',
      'Reliability and scalability',
      'Distributed communication',
      'Bridge: networks and distributed systems'
    ]
  },
  {
    title: '9. Databases and Data Systems',
    general: 'General Introduction to Databases',
    topics: [
      'Data models',
      'Queries and indexing',
      'Transactions and consistency',
      'Large-scale data systems',
      'Bridge: databases and distributed systems'
    ]
  },
  {
    title: '10. Distributed Systems',
    general: 'General Introduction to Distributed Systems',
    topics: [
      'Replication and coordination',
      'Consistency and fault tolerance',
      'Distributed storage',
      'Messaging and scalability',
      'Bridge: distributed systems and cloud platforms'
    ]
  },
  {
    title: '11. Security, Privacy, and Trust',
    general: 'General Introduction to Security and Trustworthy Systems',
    topics: [
      'Threat models',
      'Cryptographic foundations',
      'Authentication and authorization',
      'Privacy and trust',
      'Bridge: security and platforms'
    ]
  },
  {
    title: '12. Artificial Intelligence',
    general: 'General Introduction to Artificial Intelligence',
    topics: [
      'Search and reasoning',
      'Decision making',
      'Symbolic and statistical approaches',
      'AI as system construction',
      'Bridge: AI and machine learning'
    ]
  },
  {
    title: '13. Machine Learning',
    general: 'General Introduction to Machine Learning',
    topics: [
      'Learning from data',
      'Supervised and unsupervised learning',
      'Reinforcement learning',
      'Generalization and evaluation',
      'Bridge: machine learning and algorithms'
    ]
  },
  {
    title: '14. Deep Learning and Large Models',
    general: 'General Introduction to Deep Learning and Large Models',
    topics: [
      'Neural networks',
      'Transformers',
      'Training and inference',
      'Large model systems',
      'Bridge: large models and distributed systems'
    ]
  },
  {
    title: '15. Optimization and Control',
    general: 'General Introduction to Optimization and Control',
    topics: [
      'Objective functions and constraints',
      'Optimization methods',
      'Feedback and stability',
      'Decision under dynamics',
      'Bridge: control and autonomous systems'
    ]
  },
  {
    title: '16. Robotics and Embodied Systems',
    general: 'General Introduction to Robotics',
    topics: [
      'Perception, planning, and action',
      'Embodiment and interaction',
      'Real-time behavior',
      'System integration',
      'Bridge: robotics and control'
    ]
  },
  {
    title: '17. Autonomous Driving and Real-Time Systems',
    general: 'General Introduction to Autonomous Systems',
    topics: [
      'Perception and scene understanding',
      'Localization and planning',
      'Control and safety',
      'Real-time system constraints',
      'Bridge: autonomy and machine learning systems'
    ]
  },
  {
    title: '18. Search, Recommendation, and Platform Systems',
    general: 'General Introduction to Platform Systems',
    topics: [
      'Search and retrieval',
      'Recommendation and ranking',
      'Feedback loops and user behavior',
      'Platforms as large-scale technical systems',
      'Bridge: platforms and economics'
    ]
  },
  {
    title: '19. Computational Finance and Market Systems',
    general: 'General Introduction to Computational Finance and Markets',
    topics: [
      'Prediction and risk systems',
      'Automation in trading and markets',
      'Financial infrastructure',
      'Computation in market environments',
      'Bridge: computation and mainstream economics'
    ]
  },
  {
    title: '20. Quantum Computing',
    general: 'General Introduction to Quantum Computing',
    topics: [
      'Quantum information',
      'Quantum circuits',
      'Quantum algorithms',
      'Promise and limitations',
      'Bridge: quantum computing and foundations'
    ]
  }
]

const practiceTree = [
  'Large Language Models',
  'Autonomous Driving',
  'Rocket Recovery',
  'Robotics',
  'UAV Systems',
  'Search Systems',
  'Recommendation Systems',
  'Financial Risk Systems',
  'Platform Infrastructure Systems',
  'Intelligent Industrial Systems'
]
</script>