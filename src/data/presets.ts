import { StudyPlan } from '../types';

export const PRESET_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'preset-ap-bio',
    title: 'AP Biology: Cellular Energetics & Genetics Exam',
    subject: 'AP Biology',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyHours: 2.5,
    intensity: 'balanced',
    createdAt: new Date().toISOString(),
    colorTheme: '#10b981', // Emerald Green
    summary: 'Master ATP synthesis, photosynthesis, Meiosis vs Mitosis, and Mendelian pedigree patterns through targeted visual recall and problem sets.',
    motivationQuote: 'Biology is the only science in which multiplication means the same thing as division! Keep growing.',
    totalEstimatedHours: 17.5,
    schedule: [
      {
        dayNumber: 1,
        dateStr: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: 'Cellular Respiration & Glycolysis',
        focusTopic: 'Glycolysis, Krebs Cycle, Oxidative Phosphorylation & Chemiosmosis',
        technique: 'Pomodoro + Diagram Sketching',
        estimatedHours: 2.5,
        completed: false,
        tasks: [
          { id: 't1-1', title: 'Review Glycolysis inputs (Glucose, 2 NAD+, 2 ATP) and net output (2 Pyruvate, 2 NADH, 2 ATP)', durationMinutes: 45, completed: false, type: 'concept' },
          { id: 't1-2', title: 'Draw Mitochondrial Matrix vs Inner Membrane electron transport chain & ATP Synthase H+ gradient', durationMinutes: 45, completed: false, type: 'practice' },
          { id: 't1-3', title: 'Run Flashcards on Respiration enzymes & Electron acceptors', durationMinutes: 30, completed: false, type: 'flashcards' },
          { id: 't1-4', title: 'Complete Glycolysis & ETC Practice Quiz', durationMinutes: 30, completed: false, type: 'quiz' }
        ]
      },
      {
        dayNumber: 2,
        dateStr: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: 'Photosynthesis & Light Reactions',
        focusTopic: 'Photosystems I & II, Calvin Cycle, C3 vs C4 vs CAM Plants',
        technique: 'Feynman Method (Explain to a peer)',
        estimatedHours: 2.5,
        completed: false,
        tasks: [
          { id: 't2-1', title: 'Study Chloroplast Anatomy (Thylakoid, Stroma) & Light Absorption spectra', durationMinutes: 40, completed: false, type: 'concept' },
          { id: 't2-2', title: 'Compare Cyclic vs Non-Cyclic Photophosphorylation', durationMinutes: 40, completed: false, type: 'concept' },
          { id: 't2-3', title: 'Calvin Cycle RuBisCO enzyme mechanics & Carbon Fixation step', durationMinutes: 40, completed: false, type: 'practice' },
          { id: 't2-4', title: 'Review Key Concepts & Analogies', durationMinutes: 30, completed: false, type: 'review' }
        ]
      },
      {
        dayNumber: 3,
        dateStr: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: 'Mitosis, Meiosis & Genetic Variation',
        focusTopic: 'Cell Cycle Regulation, Cyclins/CDKs, Crossing Over, Independent Assortment',
        technique: 'Active Recall Table Comparison',
        estimatedHours: 2.5,
        completed: false,
        tasks: [
          { id: 't3-1', title: 'Detail Mitosis phases (Prophase to Telophase) vs Meiosis I & II chromosome counts', durationMinutes: 50, completed: false, type: 'concept' },
          { id: 't3-2', title: 'Solve 5 Pedigree & Non-Disjunction chromosome anomaly scenarios', durationMinutes: 50, completed: false, type: 'practice' },
          { id: 't3-3', title: 'Practice Flashcards on Genetic Terms (Allele, Heterozygous, Autosomal)', durationMinutes: 50, completed: false, type: 'flashcards' }
        ]
      },
      {
        dayNumber: 4,
        dateStr: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: 'Mendelian Genetics & Gene Linkage',
        focusTopic: 'Punnett Squares, Chi-Square Goodness-of-Fit Test, Recombination Frequency',
        technique: 'Problem-Solving Drill',
        estimatedHours: 2.5,
        completed: false,
        tasks: [
          { id: 't4-1', title: 'Practice Dihybrid Cross ratios (9:3:3:1) & Sex-linked trait problems', durationMinutes: 60, completed: false, type: 'practice' },
          { id: 't4-2', title: 'Master Chi-Square Null Hypothesis calculation formula (Observed - Expected)^2 / Expected', durationMinutes: 50, completed: false, type: 'practice' },
          { id: 't4-3', title: 'Take Practice Quiz on Inheritance Patterns', durationMinutes: 40, completed: false, type: 'quiz' }
        ]
      }
    ],
    notesMarkdown: `## 🧬 Cellular Energetics & Genetics Master Guide

### 1. Cellular Respiration Breakdown
Cellular respiration converts chemical energy in organic molecules (glucose) into ATP via 3 main stages:

* **Glycolysis (Cytoplasm):** Anaerobic stage. 1 Glucose (6C) $\\rightarrow$ 2 Pyruvate (3C) + 2 Net ATP (via substrate-level phosphorylation) + 2 NADH.
* **Pyruvate Oxidation & Krebs Cycle (Mitochondrial Matrix):** Pyruvate is converted to Acetyl-CoA ($CO_2$ released). Acetyl-CoA enters the Citric Acid Cycle yielding 2 ATP, 6 NADH, and 2 $FADH_2$ per glucose molecule.
* **Oxidative Phosphorylation (Inner Mitochondrial Membrane):** 
  - **ETC:** High-energy electrons passed along cytochromes, pumping $H^+$ ions into the intermembrane space.
  - **Chemiosmosis:** $H^+$ ions flow back into the matrix through **ATP Synthase**, generating ~26-28 ATP. Oxygen acts as the **final electron acceptor**, producing $H_2O$.

> ⚠️ **Common Trap:** Remember that Prokaryotes DO perform cellular respiration—they use their plasma membrane for the electron transport chain instead of mitochondria!

---

### 2. Photosynthesis & The Light Reactions
Leaves absorb photons via Chlorophyll $a$ and $b$ pigments:

1. **Light-Dependent Reactions (Thylakoid Membrane):**
   - Photolysis: Water is split ($2H_2O \\rightarrow O_2 + 4H^+ + 4e^-$).
   - Light excites $e^-$ in **Photosystem II (P680)**, driving $H^+$ gradient for ATP production.
   - $e^-$ travels to **Photosystem I (P700)** to reduce $NADP^+$ into **NADPH**.

2. **Calvin Cycle (Stroma):**
   - **Carbon Fixation:** $CO_2$ attached to **RuBP** by the enzyme **RuBisCO**.
   - **Reduction:** Consumes ATP & NADPH to produce **G3P** (precursor to Glucose).
   - **Regeneration:** 5 G3P molecules converted back into 3 RuBP molecules using ATP.

---

### 3. Genetics & Pedigree Analysis
* **Autosomal Dominant:** Does not skip generations. Affected child must have affected parent.
* **Autosomal Recessive:** Can skip generations. Heterozygous parents are asymptomatic carriers.
* **X-Linked Recessive:** Far more common in males ($X^Y$). Affected mothers pass the trait to 100% of sons.`,
    keyConcepts: [
      { term: 'ATP Synthase', definition: 'A membrane-bound protein complex that synthesizes ATP from ADP and inorganic phosphate using a proton (H+) gradient.', exampleOrAnalogy: 'A hydroelectric dam turbine driven by water pressure (H+ ion flow).', importance: 'critical' },
      { term: 'RuBisCO', definition: 'The primary enzyme involved in carbon fixation during the Calvin Cycle of photosynthesis.', exampleOrAnalogy: 'A magnet that snatches carbon dioxide out of the air and glues it onto biological sugars.', importance: 'high' },
      { term: 'Chi-Square Test', definition: 'A statistical test used to determine if observed genetic offspring ratios differ significantly from expected Mendelian ratios.', exampleOrAnalogy: 'Comparing how many coin flips came up heads vs. what a fair coin should statistically give.', importance: 'high' }
    ],
    flashcards: [
      { id: 'f1', front: 'What is the final electron acceptor in mitochondrial aerobic cellular respiration?', back: 'Oxygen (O2), which combines with H+ and electrons to form Water (H2O).', hint: 'Gas you breathe in!', category: 'Cellular Respiration', difficulty: 'easy' },
      { id: 'f2', front: 'Where do the Light-Dependent reactions of photosynthesis occur inside the chloroplast?', back: 'Across the Thylakoid Membrane inside the Chloroplast.', hint: 'Think stack of green coins.', category: 'Photosynthesis', difficulty: 'easy' },
      { id: 'f3', front: 'What enzyme attaches CO2 to RuBP during Carbon Fixation in the Calvin Cycle?', back: 'RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase).', hint: 'Most abundant enzyme on Earth.', category: 'Photosynthesis', difficulty: 'medium' },
      { id: 'f4', front: 'In Meiosis, during which phase does Crossing Over (genetic recombination) occur?', back: 'Prophase I of Meiosis I.', hint: 'Homologous chromosomes pair up as tetrads.', category: 'Genetics', difficulty: 'medium' },
      { id: 'f5', front: 'If a trait is X-linked recessive, can an unaffected father pass it to his daughter?', back: 'No. The father passes his normal X chromosome to all daughters, making them at most carriers if mother is affected.', hint: 'Think about chromosome passing.', category: 'Pedigrees', difficulty: 'hard' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which of the following process occurs in the cytosol/cytoplasm of BOTH prokaryotic and eukaryotic cells?',
        options: ['Krebs Cycle', 'Glycolysis', 'Oxidative Phosphorylation', 'Calvin Cycle'],
        correctIndex: 1,
        explanation: 'Glycolysis is the most ancient metabolic pathway and occurs in the cytoplasm of virtually all living organisms without requiring membrane-bound organelles.',
        category: 'Cellular Respiration'
      },
      {
        id: 'q2',
        question: 'A plant is exposed to light containing only green wavelengths (~500-550 nm). What will happen to its rate of photosynthesis?',
        options: ['It will peak at maximum efficiency', 'It will drop drastically because chlorophyll reflects green light', 'It will switch to anaerobic respiration', 'It will produce excess NADPH'],
        correctIndex: 1,
        explanation: 'Chlorophyll a and b pigments absorb red and blue light strongly while reflecting green light (which gives leaves their green appearance). Green light cannot effectively drive photolysis.',
        category: 'Photosynthesis'
      },
      {
        id: 'q3',
        question: 'In a genetic cross between two heterozygous purple flower pea plants (Pp x Pp), what is the expected phenotypic ratio of offspring?',
        options: ['1 Purple : 1 White', '3 Purple : 1 White', '9 Purple : 3 White', '100% Purple'],
        correctIndex: 1,
        explanation: 'A monohybrid cross between two heterozygotes yields genotypes 1 PP : 2 Pp : 1 pp, resulting in 3 dominant (purple) to 1 recessive (white) phenotype ratio.',
        category: 'Genetics'
      }
    ],
    cheatSheet: [
      'Glycolysis: Cytoplasm | Inputs: Glucose + 2 NAD+ | Outputs: 2 Pyruvate + 2 NADH + 2 ATP net',
      'Krebs Cycle: Matrix | Outputs per glucose: 6 NADH + 2 FADH2 + 2 ATP + 4 CO2',
      'Light Reactions: Thylakoid | Split H2O -> Release O2 -> Make ATP + NADPH for Calvin Cycle',
      'Chi-Square Formula: χ² = Σ [(Observed - Expected)² / Expected] | Degrees of Freedom = n - 1',
      'Meiosis vs Mitosis: Meiosis creates 4 haploid (1n) distinct gametes; Mitosis yields 2 diploid (2n) identical cells.'
    ]
  },

  {
    id: 'preset-dsa',
    title: 'Data Structures & Algorithms: Midterm Mastery',
    subject: 'Computer Science',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyHours: 3.0,
    intensity: 'intense',
    createdAt: new Date().toISOString(),
    colorTheme: '#6366f1', // Indigo / Cyber Violet
    summary: 'Crush Binary Trees, Graph Traversals (BFS/DFS), Dynamic Programming memoization, and Time/Space Big-O complexity bounds.',
    motivationQuote: 'Code is like humor. When you have to explain it, it’s bad. Keep it clean and optimal!',
    totalEstimatedHours: 15,
    schedule: [
      {
        dayNumber: 1,
        dateStr: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: 'Trees & Binary Search Trees (BST)',
        focusTopic: 'In-order, Pre-order, Post-order Traversals, BST Insert & Delete',
        technique: 'Code Implementation + Dry Run',
        estimatedHours: 3,
        completed: false,
        tasks: [
          { id: 'dt1-1', title: 'Implement Recursive & Iterative In-order Traversal in TypeScript/Python', durationMinutes: 60, completed: false, type: 'practice' },
          { id: 'dt1-2', title: 'Solve Lowest Common Ancestor (LCA) in BST on LeetCode', durationMinutes: 60, completed: false, type: 'practice' },
          { id: 'dt1-3', title: 'Review Tree Flashcards & Big-O Time Complexities', durationMinutes: 60, completed: false, type: 'flashcards' }
        ]
      },
      {
        dayNumber: 2,
        dateStr: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: 'Graph Traversals (BFS vs DFS) & Topological Sort',
        focusTopic: 'Adjacency List, Breadth-First Search (Queue), Depth-First Search (Stack/Recursion)',
        technique: 'Visual Graph Drawing',
        estimatedHours: 3,
        completed: false,
        tasks: [
          { id: 'dt2-1', title: 'Build Graph Adjacency List class & BFS shortest path algorithm', durationMinutes: 70, completed: false, type: 'practice' },
          { id: 'dt2-2', title: 'Kahn Algorithm for Topological Sorting in Directed Acyclic Graphs (DAG)', durationMinutes: 60, completed: false, type: 'concept' },
          { id: 'dt2-3', title: 'Graph Traversal Quiz & Edge Case Drills', durationMinutes: 50, completed: false, type: 'quiz' }
        ]
      }
    ],
    notesMarkdown: `## 💻 Data Structures & Algorithms Core Review

### 1. Big-O Complexity Quick Reference
| Operation | Array / Vector | Hash Map | Binary Search Tree (Balanced) |
|---|---|---|---|
| Access | $O(1)$ | N/A | $O(\\log N)$ |
| Search | $O(N)$ | $O(1)$ avg | $O(\\log N)$ |
| Insertion | $O(N)$ end amortized | $O(1)$ avg | $O(\\log N)$ |
| Deletion | $O(N)$ | $O(1)$ avg | $O(\\log N)$ |

---

### 2. Graph Traversal Paradigms
- **BFS (Breadth-First Search):** Uses a **Queue (FIFO)**. Best for finding the **shortest path** in an unweighted graph. Space complexity $O(V)$ where $V$ is vertex count.
- **DFS (Depth-First Search):** Uses a **Stack / Call Stack (LIFO)**. Best for detecting cycles, maze exploration, and topological sorting.

\`\`\`typescript
// BFS Implementation Pattern
function bfs(startNode: Node) {
  const queue: Node[] = [startNode];
  const visited = new Set<Node>([startNode]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    console.log(current.value);

    for (const neighbor of current.neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
\`\`\``,
    keyConcepts: [
      { term: 'Dynamic Programming (DP)', definition: 'An optimization method that solves complex problems by breaking them down into overlapping subproblems and storing subproblem solutions (memoization / tabulation).', exampleOrAnalogy: 'Writing down 1 + 1 + 1 = 3 on paper, then adding another 1 and remembering the previous total without re-counting from scratch.', importance: 'critical' },
      { term: 'Topological Sort', definition: 'A linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u comes before v.', exampleOrAnalogy: 'Determining the sequence of university course prerequisites before taking Advanced AI.', importance: 'high' }
    ],
    flashcards: [
      { id: 'f-dsa-1', front: 'What data structure is used to implement Breadth-First Search (BFS)?', back: 'A Queue (First-In, First-Out / FIFO).', category: 'Graphs', difficulty: 'easy' },
      { id: 'f-dsa-2', front: 'What is the worst-case time complexity of searching in an UNBALANCED Binary Search Tree?', back: 'O(N) - when the tree degrades into a linked list.', category: 'Trees', difficulty: 'medium' }
    ],
    quiz: [
      {
        id: 'q-dsa-1',
        question: 'Which algorithmic technique guarantees finding the shortest path in an unweighted graph?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'In-Order Traversal', 'Binary Search'],
        correctIndex: 1,
        explanation: 'BFS explores graph nodes in distance order level by level from the source node, making it optimal for shortest path in unweighted graphs.',
        category: 'Graphs'
      }
    ],
    cheatSheet: [
      'BST In-Order Traversal yields elements in sorted ascending order.',
      'Hash Table Collision Resolution: Chaining (linked lists/trees) or Open Addressing (linear probing).',
      'Fibonacci DP: Space complexity can be optimized from O(N) to O(1) using 2 state variables.'
    ]
  }
];
