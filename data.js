// These are the default seed values, loaded into the admin-editable store (see storage.js) the first time the site runs.
// AlgoCraft — levels and lesson content

const SEED_LEVELS = {
  1: { name: "Level 1", label: "Foundations", tier: "Beginner", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
       topics: ["time-complexity","arrays-strings","binary-search","two-pointers","sliding-window"] },
  2: { name: "Level 2", label: "Data Structures I", tier: "Beginner", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
       topics: ["stacks-queues","linked-lists","hashing","prefix-sums"] },
  3: { name: "Level 3", label: "Recursion & Trees", tier: "Intermediate", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
       topics: ["recursion-backtracking","trees-bst","tree-traversal","binary-search-on-answer"] },
  4: { name: "Level 4", label: "Graphs", tier: "Intermediate", image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
       topics: ["graph-traversal","shortest-paths","union-find","topological-sort"] },
  5: { name: "Level 5", label: "Dynamic Programming", tier: "Advanced", image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=900&q=80",
       topics: ["dp-basics","knapsack","dp-subsequences","bitmask-dp"] },
  6: { name: "Level 6", label: "Advanced Topics", tier: "Advanced", image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80",
       topics: ["number-theory","combinatorics-probability","bit-manipulation","segment-trees"] }
};

const SEED_TOPICS = {

  "time-complexity": { title: "Time Complexity", level: 1,
    intro: "Time complexity measures how the running time of an algorithm grows as the input size grows. In competitive programming it's the first filter you apply to any idea, before you write a single line of code.",
    sections: [
      { h: "Big-O Notation", body: "Big-O describes the worst-case growth rate of an algorithm, ignoring constant factors and lower-order terms. O(n) means the work grows linearly with input size n; O(n²) means it grows quadratically, and so on." },
      { h: "Common Complexities", body: "From fastest to slowest for large n: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!). Competitive judges usually run at around 10⁸ simple operations per second, so this is what tells you whether a given complexity fits inside the time limit for a given n." },
      { h: "Why It Matters in CP", body: "Before coding, estimate n from the constraints and pick a complexity that fits. If n ≤ 10⁵, an O(n²) solution will likely time out; you need O(n log n) or better. This estimation habit saves enormous time during a contest." }
    ] },

  "arrays-strings": { title: "Arrays & Strings", level: 1,
    intro: "Arrays and strings are the most fundamental data structures in competitive programming — nearly every problem starts by reading one and manipulating it efficiently.",
    sections: [
      { h: "Arrays", body: "An array stores elements in contiguous memory, giving O(1) access by index. Common patterns include prefix computation, in-place reversal, sorting, and frequency counting." },
      { h: "Strings", body: "Strings are usually treated as arrays of characters. Typical operations include substring search, palindrome checks, and character-frequency comparisons — many of which reduce to array techniques you already know." },
      { h: "Key Idea", body: "Most array/string problems become easy once you find the right traversal pattern — a single pass, two passes, or a pass combined with an auxiliary array (like prefix sums or a frequency table)." }
    ] },

  "binary-search": { title: "Binary Search", level: 1,
    intro: "Binary Search is a searching algorithm that operates on a sorted or monotonic search space, repeatedly dividing it into halves to find a target value or optimal answer in logarithmic time O(log N).",
    sections: [
      { h: "Conditions to Apply Binary Search", body: "Binary search requires the search space to be sorted, or more generally monotonic — meaning a predicate (true/false) applied over the range flips at most once, from false to true (or vice versa)." },
      { h: "Binary Search Algorithm", body: "Maintain a low and high pointer bounding the search space. Repeatedly check the middle element: if it matches the condition, narrow the range toward it; otherwise, discard the half that cannot contain the answer. Each step halves the space, giving O(log N) time." },
      { h: "How to Implement Binary Search?", body: "while (low <= high) { mid = (low + high) / 2; if (arr[mid] == target) return mid; else if (arr[mid] < target) low = mid + 1; else high = mid - 1; } — return -1 if not found. Watch for the classic off-by-one and infinite-loop bugs around how low/high are updated." }
    ] },

  "two-pointers": { title: "Two Pointers", level: 1,
    intro: "The two-pointer technique uses two indices moving through a data structure — often from opposite ends or at different speeds — to avoid nested loops and bring an O(n²) idea down to O(n).",
    sections: [
      { h: "Opposite-End Pointers", body: "One pointer starts at the beginning, one at the end. On each step, move the pointer that helps you get closer to the goal — classic uses include finding a pair with a target sum in a sorted array, or checking palindromes." },
      { h: "Same-Direction Pointers", body: "Both pointers move forward, with one (the slow pointer) trailing the other (the fast pointer). This pattern is common for removing duplicates in-place or detecting cycles in linked lists." },
      { h: "When to Use It", body: "Reach for two pointers whenever you're scanning a sorted array or a linear structure and your brute-force idea involves a nested loop that re-scans data you've already looked at." }
    ] },

  "sliding-window": { title: "Sliding Window", level: 1,
    intro: "Sliding window is a technique for problems that ask about a contiguous subarray or substring, letting you maintain a running window instead of recomputing from scratch for every start index.",
    sections: [
      { h: "Fixed-Size Window", body: "When the window length k is fixed, slide it one step at a time: add the incoming element, remove the outgoing one, and update your running answer (sum, max, count) in O(1) per step." },
      { h: "Variable-Size Window", body: "When the window size depends on a condition (e.g. 'smallest subarray with sum ≥ target'), expand the right edge until the condition holds, then shrink the left edge as far as possible while it still holds." },
      { h: "Why It's Fast", body: "Each element enters and leaves the window at most once, so the whole scan runs in O(n) total instead of the O(n²) or O(n³) you'd get by checking every subarray independently." }
    ] },

  "stacks-queues": { title: "Stacks & Queues", level: 2,
    intro: "Stacks and queues are linear structures that restrict how you insert and remove elements — that restriction is exactly what makes them useful for a huge range of classic problems.",
    sections: [
      { h: "Stack (LIFO)", body: "A stack allows push/pop only from one end (Last In, First Out). It's the natural tool for matching brackets, undo operations, and depth-first traversal implemented iteratively." },
      { h: "Queue (FIFO)", body: "A queue allows insertion at the back and removal from the front (First In, First Out). It's the backbone of breadth-first search and any 'process in the order received' simulation." },
      { h: "Monotonic Stacks/Queues", body: "A monotonic stack keeps its elements sorted (increasing or decreasing) by popping elements that violate the order before pushing a new one. This pattern solves 'next greater element' style problems in O(n)." }
    ] },

  "linked-lists": { title: "Linked Lists", level: 2,
    intro: "A linked list stores elements as nodes connected by pointers rather than contiguous memory, trading O(1) index access for O(1) insertion/deletion at a known position.",
    sections: [
      { h: "Singly vs Doubly Linked", body: "A singly linked list has nodes pointing only forward; a doubly linked list also points backward, making backward traversal and certain deletions easier at the cost of extra memory." },
      { h: "Fast & Slow Pointers", body: "Moving one pointer twice as fast as another lets you find the middle of a list in one pass, or detect a cycle (Floyd's algorithm) without extra memory." },
      { h: "Common Operations", body: "Reversing a list, merging two sorted lists, and detecting/removing a cycle are the interview-and-contest staples — all solvable in O(n) time and O(1) extra space." }
    ] },

  "hashing": { title: "Hashing", level: 2,
    intro: "Hashing maps data to fixed-size values (hashes) so that lookup, insertion, and deletion can happen in average O(1) time — it's the backbone of hash maps and hash sets.",
    sections: [
      { h: "Hash Maps & Sets", body: "A hash map stores key-value pairs and a hash set stores unique keys, both backed by a hash function that converts a key into an array index. Collisions are handled via chaining or open addressing." },
      { h: "Frequency Counting", body: "One of the most common CP patterns: build a hash map of element → count in one pass, then answer queries about duplicates, majority elements, or anagram groupings in O(1) per lookup." },
      { h: "Caveats", body: "Average-case O(1) can degrade to O(n) under adversarial inputs or poor hash functions — this is why some competitive judges specifically try to break naive hash-map solutions with crafted test cases." }
    ] },

  "prefix-sums": { title: "Prefix Sums", level: 2,
    intro: "A prefix sum array precomputes cumulative sums so that the sum of any subrange can be answered in O(1) after O(n) preprocessing — a small idea with an outsized impact.",
    sections: [
      { h: "Building the Array", body: "prefix[i] = arr[0] + arr[1] + ... + arr[i-1]. Once built, the sum of the range [l, r] is simply prefix[r+1] - prefix[l]." },
      { h: "2D Prefix Sums", body: "The same idea extends to grids: precompute cumulative sums over rows and columns so any rectangular sub-region's sum can be answered in O(1), useful for matrix range-sum queries." },
      { h: "Difference Arrays", body: "The reverse trick — a difference array — lets you apply O(1) range updates and recover the final array with a single prefix-sum pass, which is handy when you have many range-add operations." }
    ] },

  "recursion-backtracking": { title: "Recursion & Backtracking", level: 3,
    intro: "Recursion solves a problem by breaking it into smaller instances of itself. Backtracking extends this by exploring choices, undoing ('backtracking') the ones that fail, to search a space of possibilities.",
    sections: [
      { h: "Recursive Thinking", body: "Every recursive solution needs a base case (when to stop) and a recursive case (how to reduce the problem). Trust the recursion: assume the smaller call is correct and just build on top of it." },
      { h: "Backtracking Pattern", body: "Make a choice, recurse, then undo the choice before trying the next option. This 'try, recurse, undo' loop is exactly how permutations, combinations, and constraint-satisfaction problems like N-Queens are solved." },
      { h: "Pruning", body: "The difference between a backtracking solution that runs instantly and one that times out is usually pruning — cutting a branch early the moment you know it cannot lead to a valid answer." }
    ] },

  "trees-bst": { title: "Trees & BST", level: 3,
    intro: "A tree is a hierarchical structure of nodes connected by edges with no cycles. A Binary Search Tree (BST) additionally keeps left children smaller and right children larger than their parent.",
    sections: [
      { h: "Tree Terminology", body: "Root, parent, child, leaf, height and depth are the vocabulary you'll use constantly. A binary tree restricts each node to at most two children." },
      { h: "BST Property", body: "For every node, all values in its left subtree are smaller and all values in its right subtree are larger. This property makes search, insertion, and deletion run in O(h), where h is the tree's height." },
      { h: "Balance Matters", body: "A BST built from sorted input degenerates into a linked list with O(n) operations. Self-balancing variants (AVL, Red-Black trees) guarantee O(log n) height regardless of insertion order." }
    ] },

  "tree-traversal": { title: "Tree Traversal (DFS/BFS)", level: 3,
    intro: "Traversal is how you systematically visit every node in a tree or graph — the two fundamental strategies are depth-first (go deep before wide) and breadth-first (go wide before deep).",
    sections: [
      { h: "Depth-First Search (DFS)", body: "DFS explores as far as possible along a branch before backtracking, implemented recursively or with an explicit stack. Pre-order, in-order and post-order are the three classic DFS variants on trees." },
      { h: "Breadth-First Search (BFS)", body: "BFS visits nodes level by level using a queue, which makes it the natural choice whenever you need the shortest path in an unweighted tree or graph." },
      { h: "Choosing Between Them", body: "Use DFS when you need to explore full paths or when memory for a queue would be worse than the recursion stack; use BFS when you specifically need shortest-path or level-order information." }
    ] },

  "binary-search-on-answer": { title: "Binary Search on Answer", level: 3,
    intro: "Binary search isn't only for finding a value in a sorted array — it can also search over the space of possible answers whenever 'can we achieve X?' is monotonic in X.",
    sections: [
      { h: "The Core Trick", body: "Instead of searching an array, you binary search over a numeric answer range. You need a check(x) function that returns true/false, and that truth value must flip at most once across the range." },
      { h: "Typical Pattern", body: "'Minimize the maximum' or 'maximize the minimum' problems are the classic signal — for example, minimizing the largest load when splitting an array into k parts. You binary search the answer and use check(x) to test feasibility." },
      { h: "Complexity Win", body: "If check(x) runs in O(n) and the answer range spans V possible values, this pattern solves the problem in O(n log V) — often far faster than trying every possible answer directly." }
    ] },

  "graph-traversal": { title: "Graph Traversal (BFS/DFS)", level: 4,
    intro: "Graphs generalize trees by allowing cycles and multiple connections between nodes. BFS and DFS remain the two core ways to explore them, just with a 'visited' set to avoid infinite loops.",
    sections: [
      { h: "Representations", body: "Graphs are usually stored as an adjacency list (a map of node → neighbors), which is efficient for sparse graphs, or an adjacency matrix, which suits dense graphs or when O(1) edge lookups matter." },
      { h: "BFS for Shortest Steps", body: "In an unweighted graph, BFS from a source finds the shortest path (in number of edges) to every reachable node, since it explores nodes in increasing distance order." },
      { h: "DFS for Structure", body: "DFS is the workhorse for detecting cycles, finding connected components, and computing topological order — problems about the graph's structure rather than shortest distance." }
    ] },

  "shortest-paths": { title: "Shortest Paths (Dijkstra)", level: 4,
    intro: "Dijkstra's algorithm finds the shortest path from a source to all other nodes in a graph with non-negative edge weights, using a greedy strategy backed by a priority queue.",
    sections: [
      { h: "Core Idea", body: "Maintain a distance estimate for every node, initialized to infinity except the source (0). Repeatedly pick the unvisited node with the smallest known distance, and relax its outgoing edges — updating neighbors if a shorter path is found." },
      { h: "Why a Priority Queue", body: "A min-heap lets you always extract the currently-closest unvisited node in O(log n), giving the whole algorithm a total complexity of O((V + E) log V) for V nodes and E edges." },
      { h: "Limitation", body: "Dijkstra assumes non-negative weights — a single negative edge can break its greedy guarantee. Graphs with negative weights need Bellman-Ford instead." }
    ] },

  "union-find": { title: "Union-Find (DSU)", level: 4,
    intro: "Disjoint Set Union (Union-Find) tracks a collection of elements split into non-overlapping sets, supporting 'are these two connected?' and 'merge these two groups' extremely efficiently.",
    sections: [
      { h: "Find & Union", body: "find(x) returns a representative ('parent') for the set containing x; union(x, y) merges the two sets containing x and y by attaching one representative under the other." },
      { h: "Path Compression", body: "During find(x), point every visited node directly at the root, flattening the tree so future queries on those nodes are near O(1)." },
      { h: "Union by Rank/Size", body: "Always attach the smaller tree under the root of the larger one. Combined with path compression, this gives DSU operations an amortized complexity so close to O(1) it's treated as constant in practice." }
    ] },

  "topological-sort": { title: "Topological Sort", level: 4,
    intro: "A topological sort orders the nodes of a Directed Acyclic Graph (DAG) so that every edge u → v places u before v — essential whenever tasks have dependencies.",
    sections: [
      { h: "DFS-Based Approach", body: "Run DFS from every unvisited node, and after fully exploring a node's descendants, push it onto a stack. Popping the stack at the end gives a valid topological order." },
      { h: "Kahn's Algorithm (BFS-Based)", body: "Compute the in-degree of every node, repeatedly remove nodes with in-degree 0 (adding them to the order), and decrease the in-degree of their neighbors — a queue-driven alternative to the DFS approach." },
      { h: "Cycle Detection for Free", body: "If a topological sort can't include all nodes (Kahn's queue empties early, or DFS finds a back edge), the graph contains a cycle and no valid ordering exists." }
    ] },

  "dp-basics": { title: "Dynamic Programming Basics", level: 5,
    intro: "Dynamic Programming (DP) solves problems by breaking them into overlapping subproblems, solving each one once, and reusing the result — turning exponential brute force into polynomial time.",
    sections: [
      { h: "Two Ingredients", body: "DP applies when a problem has optimal substructure (an optimal solution is built from optimal solutions to subproblems) and overlapping subproblems (the same subproblem recurs many times)." },
      { h: "Memoization vs Tabulation", body: "Memoization is top-down: write the natural recursion and cache results. Tabulation is bottom-up: fill a table iteratively from the smallest subproblems upward. Both compute the same answer; the choice is often about clarity vs. avoiding recursion overhead." },
      { h: "State Design", body: "The hardest part of DP is usually defining the state — what does dp[i] (or dp[i][j]) actually represent? Once the state and transition are clear, the code almost writes itself." }
    ] },

  "knapsack": { title: "Knapsack", level: 5,
    intro: "The Knapsack problem asks: given items with weights and values, and a capacity limit, which items maximize total value without exceeding the capacity? It's the archetypal DP problem.",
    sections: [
      { h: "0/1 Knapsack", body: "Each item can be taken at most once. dp[i][w] = the best value using the first i items with capacity w, with the choice at each step being 'skip item i' or 'take item i' (if it fits)." },
      { h: "Unbounded Knapsack", body: "When items can be reused an unlimited number of times, the recurrence changes slightly so that taking an item doesn't move you to the next item index — you can take the same item again." },
      { h: "Space Optimization", body: "Because dp[i][w] only depends on the previous row, you can often compress the table to a single 1D array, iterated in the right direction, cutting memory from O(n·W) to O(W)." }
    ] },

  "dp-subsequences": { title: "DP on Subsequences", level: 5,
    intro: "A large family of DP problems operates on sequences — comparing, matching, or selecting elements — with classics like Longest Common Subsequence (LCS) and Longest Increasing Subsequence (LIS).",
    sections: [
      { h: "Longest Common Subsequence", body: "dp[i][j] = length of the LCS of the first i characters of one string and the first j of another. If the characters match, extend the diagonal; otherwise take the best of skipping one character from either string." },
      { h: "Longest Increasing Subsequence", body: "The straightforward DP runs in O(n²): dp[i] = the LIS ending at index i. A patience-sorting technique with binary search improves this to O(n log n)." },
      { h: "Pattern Recognition", body: "Most subsequence DP problems reduce to a 2D grid where each cell represents a decision to include, exclude, or match an element — recognizing this shape is most of the battle." }
    ] },

  "bitmask-dp": { title: "Bitmask DP", level: 5,
    intro: "Bitmask DP represents a subset of a small set of elements (usually n ≤ ~20) as an integer bitmask, letting the DP state track 'which elements have been used' compactly.",
    sections: [
      { h: "Encoding Subsets", body: "A bitmask of n bits represents 2ⁿ possible subsets; bit i being 1 means element i is included. Checking, setting, or clearing a bit are all O(1) operations." },
      { h: "Classic Example: TSP", body: "The Traveling Salesman Problem uses dp[mask][i] = the minimum cost to visit exactly the cities in mask, ending at city i — solving an otherwise exponential search in O(2ⁿ · n²)." },
      { h: "When It's Feasible", body: "Bitmask DP is only practical when n is small (roughly n ≤ 20), since the state space grows as 2ⁿ — always check the constraints before reaching for this technique." }
    ] },

  "number-theory": { title: "Number Theory", level: 6,
    intro: "Number theory in competitive programming covers primes, divisibility, and modular arithmetic — tools that show up constantly whenever a problem mentions 'mod 10⁹+7' or asks about factors.",
    sections: [
      { h: "Primes & Sieve of Eratosthenes", body: "The Sieve of Eratosthenes precomputes all primes up to n in O(n log log n) by iteratively marking multiples of each prime as composite — far faster than checking primality one number at a time." },
      { h: "GCD & LCM", body: "The Euclidean algorithm computes gcd(a, b) in O(log(min(a,b))) using the identity gcd(a, b) = gcd(b, a mod b). LCM follows directly: lcm(a,b) = a·b / gcd(a,b)." },
      { h: "Modular Arithmetic", body: "Since answers can be astronomically large, problems often ask for the result mod a prime like 10⁹+7. Modular addition, subtraction and multiplication behave normally; modular division requires the modular inverse (via Fermat's little theorem when the modulus is prime)." }
    ] },

  "combinatorics-probability": { title: "Combinatorics & Probability", level: 6,
    intro: "Combinatorics counts the number of ways things can happen; probability measures how likely they are. Together they answer 'how many' and 'how likely' questions that show up throughout CP.",
    sections: [
      { h: "Permutations & Combinations", body: "Permutations (nPr) count ordered selections; combinations (nCr) count unordered ones. Precomputing factorials and modular inverses lets you answer nCr mod p queries in O(1) after O(n) preprocessing." },
      { h: "Pascal's Triangle", body: "nCr can also be built iteratively via Pascal's identity, nCr = (n-1)C(r-1) + (n-1)Cr, which avoids factorials entirely and is easy to compute mod a small modulus." },
      { h: "Basic Probability", body: "Expected value problems are common: E[X] = Σ (outcome × probability). Many CP problems ask for expected value mod p, which combines this idea with the modular inverse from number theory." }
    ] },

  "bit-manipulation": { title: "Bit Manipulation", level: 6,
    intro: "Bit manipulation uses an integer's binary representation directly, via operations like AND, OR, XOR and shifts — often turning slow set/array logic into a handful of O(1) instructions.",
    sections: [
      { h: "Core Operations", body: "AND (&) tests/keeps common bits, OR (|) combines bits, XOR (^) flips exactly the differing bits, and NOT (~) inverts all bits. Left shift (<<) multiplies by powers of two; right shift (>>) divides." },
      { h: "Useful Tricks", body: "n & (n-1) clears the lowest set bit — useful for counting set bits or checking if n is a power of two (n & (n-1) == 0). n & -n isolates the lowest set bit." },
      { h: "XOR Properties", body: "XOR is its own inverse (a ^ a = 0) and commutative/associative, which is why it's the standard tool for 'find the single non-duplicate element' problems — XOR everything together and duplicates cancel out." }
    ] },

  "segment-trees": { title: "Segment Trees", level: 6,
    intro: "A segment tree is a binary tree structure that answers range queries (sum, min, max) and supports point or range updates in O(log n), far faster than recomputing over a range every time.",
    sections: [
      { h: "Structure", body: "Each leaf represents a single array element; each internal node represents the combined result (e.g. sum) of its two children's ranges, so the root represents the whole array." },
      { h: "Query & Update", body: "A range query decomposes the requested range into O(log n) tree segments and combines their stored results. A point update walks from the leaf to the root, recombining each ancestor's value along the way." },
      { h: "Lazy Propagation", body: "For range updates (e.g. 'add 5 to every element from l to r'), lazy propagation defers pushing the update down to children until they're actually needed, keeping range updates at O(log n) instead of O(n)." }
    ] }

};
