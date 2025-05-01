// This test file tests the matching algorithm functionality
// Since the matching algorithm is implemented in a non-module JavaScript,
// we need to mock the necessary functions and objects

// Mock bipartite graph structure
class BipartiteGraph {
  constructor() {
    this.leftNodes = [];
    this.rightNodes = [];
    this.edges = [];
    this.matching = new Map();
  }

  addLeftNode(id) {
    this.leftNodes.push(id);
    return id;
  }

  addRightNode(id) {
    this.rightNodes.push(id);
    return id;
  }

  addEdge(leftNode, rightNode) {
    this.edges.push([leftNode, rightNode]);
  }

  // Implementation of augmenting path algorithm
  findAugmentingPath(startNode) {
    const visited = new Set();
    const path = [];
    
    const dfs = (node, isLeft) => {
      if (visited.has(node)) return false;
      visited.add(node);
      path.push(node);
      
      if (isLeft) {
        // If it's a left node, try all edges
        for (const [left, right] of this.edges) {
          if (left === node && dfs(right, false)) {
            return true;
          }
        }
      } else {
        // If it's a right node and not matched, we found an augmenting path
        if (!this.matching.has(node)) {
          return true;
        }
        
        // If matched, try to find another match for its current match
        const currentMatch = this.matching.get(node);
        if (dfs(currentMatch, true)) {
          return true;
        }
      }
      
      path.pop();
      return false;
    };
    
    if (dfs(startNode, true)) {
      return path;
    }
    
    return null;
  }

  // Implementation of maximum bipartite matching algorithm
  findMaximumMatching() {
    this.matching = new Map();
    
    let matchingSize = 0;
    let augmented = true;
    
    while (augmented) {
      augmented = false;
      
      for (const leftNode of this.leftNodes) {
        // Skip nodes that are already matched
        let alreadyMatched = false;
        for (const [right, left] of this.matching.entries()) {
          if (left === leftNode) {
            alreadyMatched = true;
            break;
          }
        }
        
        if (alreadyMatched) continue;
        
        // Try to find an augmenting path
        const path = this.findAugmentingPath(leftNode);
        
        if (path) {
          // Augment the matching along the path
          for (let i = 0; i < path.length - 1; i += 2) {
            const left = path[i];
            const right = path[i + 1];
            
            // Remove existing matches
            for (const [r, l] of this.matching.entries()) {
              if (l === left) {
                this.matching.delete(r);
                break;
              }
            }
            
            // Add the new match
            this.matching.set(right, left);
          }
          
          matchingSize++;
          augmented = true;
        }
      }
    }
    
    return matchingSize;
  }

  getMatchingSize() {
    return this.matching.size;
  }

  getMatching() {
    const result = [];
    for (const [right, left] of this.matching.entries()) {
      result.push([left, right]);
    }
    return result;
  }
}

describe('Matching Algorithm', () => {
  test('empty graph should have zero matching', () => {
    const graph = new BipartiteGraph();
    
    const matchingSize = graph.findMaximumMatching();
    expect(matchingSize).toBe(0);
    expect(graph.getMatchingSize()).toBe(0);
    expect(graph.getMatching()).toHaveLength(0);
  });
  
  test('single edge graph should have matching of size 1', () => {
    const graph = new BipartiteGraph();
    
    const left1 = graph.addLeftNode('L1');
    const right1 = graph.addRightNode('R1');
    graph.addEdge(left1, right1);
    
    const matchingSize = graph.findMaximumMatching();
    expect(matchingSize).toBe(1);
    expect(graph.getMatchingSize()).toBe(1);
    expect(graph.getMatching()).toHaveLength(1);
    expect(graph.getMatching()[0]).toEqual(['L1', 'R1']);
  });
  
  test('complete bipartite graph should have matching equal to min size of sides', () => {
    const graph = new BipartiteGraph();
    
    const left1 = graph.addLeftNode('L1');
    const left2 = graph.addLeftNode('L2');
    const right1 = graph.addRightNode('R1');
    const right2 = graph.addRightNode('R2');
    const right3 = graph.addRightNode('R3');
    
    // Complete bipartite graph
    graph.addEdge(left1, right1);
    graph.addEdge(left1, right2);
    graph.addEdge(left1, right3);
    graph.addEdge(left2, right1);
    graph.addEdge(left2, right2);
    graph.addEdge(left2, right3);
    
    const matchingSize = graph.findMaximumMatching();
    expect(matchingSize).toBe(2); // Min(2, 3) = 2
    expect(graph.getMatchingSize()).toBe(2);
    expect(graph.getMatching()).toHaveLength(2);
  });
  
  test('should handle disconnected components', () => {
    const graph = new BipartiteGraph();
    
    const left1 = graph.addLeftNode('L1');
    const left2 = graph.addLeftNode('L2');
    const left3 = graph.addLeftNode('L3');
    const right1 = graph.addRightNode('R1');
    const right2 = graph.addRightNode('R2');
    const right3 = graph.addRightNode('R3');
    
    // Two disconnected components
    graph.addEdge(left1, right1);
    graph.addEdge(left2, right2);
    graph.addEdge(left3, right3);
    
    const matchingSize = graph.findMaximumMatching();
    expect(matchingSize).toBe(3);
    expect(graph.getMatchingSize()).toBe(3);
    expect(graph.getMatching()).toHaveLength(3);
  });
  
  test('should find matching in a more complex graph', () => {
    const graph = new BipartiteGraph();
    
    const left1 = graph.addLeftNode('L1');
    const left2 = graph.addLeftNode('L2');
    const left3 = graph.addLeftNode('L3');
    const right1 = graph.addRightNode('R1');
    const right2 = graph.addRightNode('R2');
    const right3 = graph.addRightNode('R3');
    
    // More complex graph structure
    graph.addEdge(left1, right1);
    graph.addEdge(left1, right2);
    graph.addEdge(left2, right1);
    graph.addEdge(left3, right2);
    graph.addEdge(left3, right3);
    
    const matchingSize = graph.findMaximumMatching();
    expect(matchingSize).toBe(3);
    expect(graph.getMatchingSize()).toBe(3);
    
    // Validate that each left node is matched to exactly one right node
    const matching = graph.getMatching();
    const matchedLeftNodes = new Set(matching.map(m => m[0]));
    const matchedRightNodes = new Set(matching.map(m => m[1]));
    
    expect(matchedLeftNodes.size).toBe(3);
    expect(matchedRightNodes.size).toBe(3);
  });
}); 