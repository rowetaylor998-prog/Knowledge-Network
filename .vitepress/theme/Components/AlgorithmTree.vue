<template>
  <section class="icsx-page">
    <div class="icsx-layout">
      <div class="icsx-left">
        <div class="icsx-titlebox">
          <h1 class="icsx-title">General Introduction to Algorithms</h1>
        </div>
        <div class="icsx-brace" aria-hidden="true">
          <svg viewBox="0 0 70 1660" preserveAspectRatio="none">
            <path
  d="M60,10
     C20,10 20,105 20,200
     L20,690
     C20,780 6,780 6,830
     C6,880 20,880 20,970
     L20,1460
     C20,1555 20,1650 60,1650"
/>
            />
          </svg>
        </div>
      </div>
      <div class="icsx-main">
        <div class="icsx-grid">
          <div class="icsx-item" v-for="item in algorithmTree" :key="item.title">
            <div class="icsx-topic">{{ item.title }}</div>
            <details class="icsx-details">
              <summary>topics</summary>
              <ul>
                <li v-for="topic in item.topics" :key="topic">{{ topic }}</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const algorithmTree = [
  {
    title: '1. Why We Still Need a New Introduction to Algorithms',
    topics: [
      'Why classical algorithms remain necessary',
      'Why classical algorithms are no longer sufficient',
      'Why algorithms must be rewritten for intelligent systems',
      'Algorithms as the language of modern real-world systems',
      'From problem solving to system construction'
    ]
  },
  {
    title: '2. From Turing, Shannon, and von Neumann to the Modern Algorithmic World',
    topics: [
      'Computability and the boundaries of computation',
      'Information and the organization of signals',
      'Stored-program machines and executable structure',
      'Why algorithms cannot be separated from machines',
      'From formal structure to physical realization'
    ]
  },
  {
    title: '3. Complexity, Growth, and Resources',
    topics: [
      'Big-O, time, space, and asymptotic analysis',
      'Worst-case, average-case, and amortized reasoning',
      'Latency, throughput, bandwidth, memory, and compute budget',
      'Why modern cost models differ across hardware environments',
      'Formal complexity versus real system cost'
    ]
  },
  {
    title: '4. Data Structures: The Organization of Memory',
    topics: [
      'Arrays, linked lists, stacks, queues, heaps, trees, and hash tables',
      'Structured memory, indexing, and information layout',
      'Caches, feature stores, vector memory, and retrieval memory',
      'KV cache, external memory, and algorithmic organization',
      'How structure changes what algorithms can do'
    ]
  },
  {
    title: '5. Divide and Conquer',
    topics: [
      'Recursive decomposition and structural splitting',
      'Merge sort, quicksort, and recurrence-driven analysis',
      'Subproblem independence and recombination',
      'Parallel decomposition in modern execution environments',
      'Divide-and-conquer thinking in large computational systems'
    ]
  },
  {
    title: '6. Greedy Algorithms',
    topics: [
      'Local choice and global structure',
      'Correctness conditions for greedy methods',
      'Scheduling, resource allocation, and selection',
      'Greedy methods in caching, platform allocation, and compute budgeting',
      'When greed succeeds and when it fails'
    ]
  },
  {
    title: '7. Dynamic Programming',
    topics: [
      'Optimal substructure and overlapping subproblems',
      'Bellman-style recursive reasoning',
      'Memoization, table construction, and stage decomposition',
      'Dynamic programming in planning, budgeting, and decision systems',
      'From classical DP to modern reinforcement-style reasoning'
    ]
  },
  {
    title: '8. Graph Algorithms',
    topics: [
      'Graphs as models of relation, dependency, and movement',
      'Traversal, connectivity, shortest paths, and spanning structures',
      'Flow, matching, and graph-structured optimization',
      'Road networks, knowledge graphs, social graphs, and recommendation graphs',
      'Why graph structure remains central in modern systems'
    ]
  },
  {
    title: '9. Search and Shortest Path',
    topics: [
      'State-space search and problem representation',
      'Breadth-first, depth-first, uniform-cost, and informed search',
      'Shortest path, A*, and heuristic guidance',
      'Navigation in autonomous systems and robotic planning',
      'Search as a bridge from classical algorithms to modern intelligence'
    ]
  },
  {
    title: '10. NP-Completeness, Approximation, and Hardness',
    topics: [
      'Why some problems resist efficient exact solution',
      'Reductions, hardness, and computational difficulty',
      'Approximation algorithms and bounded imperfection',
      'Heuristics, tradeoffs, and real-world limits',
      'Why modern systems often optimize under impossibility'
    ]
  },
  {
    title: '11. CPU, GPU, TPU, and Heterogeneous Computation',
    topics: [
      'CPU for control, branching, and general-purpose logic',
      'GPU for parallel numerical computation and matrix workloads',
      'TPU and specialized accelerators for machine learning',
      'Memory hierarchy, bandwidth, latency, and execution environment',
      'Why algorithms must be matched to hardware form'
    ]
  },
  {
    title: '12. Algorithms in Chip Design and Computational Lithography',
    topics: [
      'Why chip production is deeply algorithmic',
      'Simulation, optimization, inverse problems, and computational lithography',
      'EDA as algorithmic automation of design',
      'Constraint solving in industrial semiconductor systems',
      'How manufacturing limits push new algorithmic forms'
    ]
  },
  {
    title: '13. Dynamic Pricing and Revenue Management',
    topics: [
      'Uncertain demand, constrained capacity, and time decay',
      'Dynamic pricing as algorithmic decision making',
      'Revenue management, inventory control, and competition response',
      'Pricing paths in airline and other expiring-capacity systems',
      'Prices as decisions, not as fixed labels'
    ]
  },
  {
    title: '14. Platform Allocation, Ranking, and Incentives',
    topics: [
      'User segmentation, promotion, and exposure allocation',
      'Ranking, subsidy, and fulfillment matching in platforms',
      'Merchant incentives, platform power, and multi-sided optimization',
      'Delivery platforms and operational algorithmic systems',
      'Efficiency, fairness, and strategic allocation'
    ]
  },
  {
    title: '15. Time-Decay Markets, Airline Revenue, and Last-Minute Pricing',
    topics: [
      'Revenue management under uncertain demand and fixed capacity',
      'Time decay, expiring inventory, and last-minute adjustment',
      'Airline pricing, event seating, and perishable capacity',
      'Demand prediction, inventory clearing, and optimal timing',
      'Algorithms for price paths under time pressure'
    ]
  },
  {
    title: '16. Search, Recommendation, and Information Flow',
    topics: [
      'Ranking, recommendation, and engagement optimization',
      'Feedback loops, network effects, and exposure diversity',
      'Search and recommendation as platform-wide control systems',
      'Information filtering, media distribution, and attention allocation',
      'How algorithms shape what different people are able to see'
    ]
  },
  {
    title: '17. From Statistical Learning to Deep Learning',
    topics: [
      'Learning, prediction, and representation',
      'Statistical learning versus neural learning paradigms',
      'Optimization, backpropagation, and distributed parameter fitting',
      'Why learned algorithms became central to modern computing',
      'The shift from handcrafted procedures to learned structure'
    ]
  },
  {
    title: '18. Transformer and Large-Model Algorithms',
    topics: [
      'Attention, sequence modeling, and scalable representation learning',
      'Transformer architecture as an algorithmic system',
      'Conditional generation, context handling, and long-range dependence',
      'Large language models and multimodal systems',
      'Why Transformer changed the algorithmic landscape'
    ]
  },
  {
    title: '19. ChatGPT as a Modern Algorithmic System',
    topics: [
      'Tokenization, context management, and conditional generation',
      'Retrieval, ranking, selection, and caching',
      'Why multi-turn dialogue is an algorithmic construction process',
      'External files, memory systems, and response shaping',
      'Language generation as structured system behavior'
    ]
  },
  {
    title: '20. Vector Databases, ANN, and External Memory',
    topics: [
      'Embeddings, vector indexes, and approximate nearest neighbor search',
      'Hybrid retrieval, external memory, and long-context support',
      'RAG and document-grounded generation',
      'Memory systems beyond the model weights themselves',
      'How retrieval changes the structure of intelligence'
    ]
  },
  {
    title: '21. Inference-Time Algorithms and Test-Time Compute',
    topics: [
      'Decoding, verifier structures, and search at inference time',
      'Budget allocation, context selection, and answer shaping',
      'Why answers may be shallow or deep under different compute budgets',
      'Test-time reasoning as algorithmic resource allocation',
      'Why output is constructed rather than simply emitted'
    ]
  },
  {
    title: '22. Autonomous Driving and Real-Time Navigation Algorithms',
    topics: [
      'Perception, localization, prediction, planning, and control',
      'Search, filtering, optimization, and trajectory generation',
      'Real-time navigation under uncertainty and safety constraints',
      'Hybrid policy and learned-policy perspectives',
      'Autonomous driving as a full algorithmic stack'
    ]
  },
  {
    title: '23. UAVs, Rocket Recovery, and Extreme Control Algorithms',
    topics: [
      'Path planning, tracking, coordination, and constrained motion',
      'Guidance, navigation, and powered descent control',
      'Trajectory optimization and model predictive control',
      'Algorithms in extreme physical environments',
      'Real-time computation under strict dynamic limits'
    ]
  },
  {
    title: '24. Humanoid Robotics and Behavior Foundation Models',
    topics: [
      'Whole-body control, imitation learning, and reinforcement learning',
      'Vision-language-action systems and behavior foundation models',
      'Embodiment and the perception-action loop',
      'From language systems to physically grounded intelligence',
      'Humanoid robotics as unified algorithmic construction'
    ]
  },
  {
    title: '25. World Models and Retrieval-Native Intelligence',
    topics: [
      'Internal modeling of environments and future states',
      'Prediction, simulation, and latent-space structure',
      'Retrieval as a native mechanism of intelligence',
      'Dynamic context construction through external knowledge access',
      'Toward predictive and memory-rich intelligent systems'
    ]
  },
  {
    title: '26. Reasoning-Time and System-Aware Computation',
    topics: [
      'Reasoning as dynamic allocation of inference-time computation',
      'Search, verification, branching, and test-time control',
      'Algorithms that adapt to hardware and runtime conditions',
      'Memory, latency, scheduling, and communication as algorithmic variables',
      'The collapse of the boundary between algorithm and system'
    ]
  },
  {
    title: '27. Toward a Unified Algorithmic Stack',
    topics: [
      'The convergence of learning, retrieval, reasoning, planning, and control',
      'From isolated modules to integrated intelligent stacks',
      'Unified algorithmic architectures for future systems',
      'Why modern intelligent systems are built from layered algorithmic integration',
      'The possible future structure of general intelligent systems'
    ]
  }
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
  min-height: 1660px;
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
  height: 1660px;
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
  background: transparent;
}
.icsx-topic {
  font-weight: 700;
  font-size: 17px;
  line-height: 1.2;
  color: #4f3520;
  margin: 0;
}
.icsx-details {
  margin-top: 2px;
}
.icsx-details summary {
  cursor: pointer;
  color: #b24b3e;
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
@media (max-width: 1200px) {
  .icsx-layout {
    grid-template-columns: 1fr;
  }
  .icsx-left {
    position: static;
    min-height: auto;
  }
  .icsx-brace {
    display: none;
  }
}
</style>