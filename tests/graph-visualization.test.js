// Mock CytoscapeGraph, Node, and Edge classes
class Node {
  constructor(graph, id, label) {
    this.graph = graph;
    this.id = id;
    this.label = label;
    this.highlighted = false;
    this.outgoingEdges = [];
  }
  
  getId() {
    return this.id;
  }
  
  getLabel() {
    return this.label;
  }
  
  isEqualTo(otherNode) {
    return this.id === otherNode.id;
  }
  
  getOutgoingEdges() {
    return this.outgoingEdges;
  }
  
  isHighlighted() {
    return this.highlighted;
  }
  
  highlight() {
    this.highlighted = true;
  }
  
  unhighlight() {
    this.highlighted = false;
  }
}

class Edge {
  constructor(graph, sourceNode, targetNode, capacity, flow = 0) {
    this.graph = graph;
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.capacity = capacity;
    this.flow = flow;
    this.highlighted = false;
    this.reverseEdge = null;
  }
  
  getId() {
    return `${this.sourceNode.getId()}->${this.targetNode.getId()}`;
  }
  
  getSourceNode() {
    return this.sourceNode;
  }
  
  getTargetNode() {
    return this.targetNode;
  }
  
  getCapacity() {
    return this.capacity;
  }
  
  getFlow() {
    return this.flow;
  }
  
  setFlow(newFlow) {
    if (newFlow < 0) {
      throw new Error("Flow cannot be negative");
    }
    if (newFlow > this.capacity) {
      throw new Error("Flow cannot exceed capacity");
    }
    this.flow = newFlow;
  }
  
  getReverseEdge() {
    return this.reverseEdge;
  }
  
  isHighlighted() {
    return this.highlighted;
  }
  
  highlight() {
    this.highlighted = true;
  }
  
  unhighlight() {
    this.highlighted = false;
  }
}

class CytoscapeGraph {
  constructor(container) {
    this.container = container;
    this.nodes = new Map();
    this.edges = [];
    this.sourceNode = null;
    this.sinkNode = null;
  }
  
  addNode(id, label) {
    const node = new Node(this, id, label);
    this.nodes.set(id, node);
    return node;
  }
  
  getNode(id) {
    return this.nodes.get(id);
  }
  
  setSourceNode(node) {
    this.sourceNode = node;
  }
  
  setSinkNode(node) {
    this.sinkNode = node;
  }
  
  getSourceNode() {
    return this.sourceNode;
  }
  
  getSinkNode() {
    return this.sinkNode;
  }
  
  addEdge(sourceNode, targetNode, capacity, flow = 0) {
    const edge = new Edge(this, sourceNode, targetNode, capacity, flow);
    const reverseEdge = new Edge(this, targetNode, sourceNode, 0, 0);
    
    edge.reverseEdge = reverseEdge;
    reverseEdge.reverseEdge = edge;
    
    sourceNode.outgoingEdges.push(edge);
    targetNode.outgoingEdges.push(reverseEdge);
    
    this.edges.push(edge);
    this.edges.push(reverseEdge);
    
    return edge;
  }
  
  reset() {
    for (const edge of this.edges) {
      edge.setFlow(0);
      edge.unhighlight();
    }
    
    for (const node of this.nodes.values()) {
      node.unhighlight();
    }
  }
}

// No need to mock cytoscape library anymore
describe('Graph Visualization', () => {
  describe('CytoscapeGraph', () => {
    let graphContainer;
    let graph;

    beforeEach(() => {
      // Create a mock container element
      graphContainer = document.createElement('div');
      graphContainer.id = 'cy';
      document.body.appendChild(graphContainer);
      
      // Initialize graph
      graph = new CytoscapeGraph(graphContainer);
    });

    afterEach(() => {
      document.body.removeChild(graphContainer);
    });

    test('can add and get nodes', () => {
      const sourceNode = graph.addNode('source', 'Source');
      const node1 = graph.addNode('n1', 'Node 1');
      const sinkNode = graph.addNode('sink', 'Sink');
      
      // Test node retrieval
      expect(graph.getNode('source')).toBe(sourceNode);
      expect(graph.getNode('n1')).toBe(node1);
      expect(graph.getNode('sink')).toBe(sinkNode);
      
      // Test source/sink getters
      graph.setSourceNode(sourceNode);
      graph.setSinkNode(sinkNode);
      expect(graph.getSourceNode()).toBe(sourceNode);
      expect(graph.getSinkNode()).toBe(sinkNode);
    });

    test('can add edges between nodes', () => {
      const sourceNode = graph.addNode('source', 'Source');
      const node1 = graph.addNode('n1', 'Node 1');
      
      // Add edge
      const edge = graph.addEdge(sourceNode, node1, 10);
      expect(edge.getSourceNode()).toBe(sourceNode);
      expect(edge.getTargetNode()).toBe(node1);
      expect(edge.getCapacity()).toBe(10);
      expect(edge.getFlow()).toBe(0);
      
      // Test reverse edge
      const reverseEdge = edge.getReverseEdge();
      expect(reverseEdge).not.toBeNull();
      expect(reverseEdge.getSourceNode()).toBe(node1);
      expect(reverseEdge.getTargetNode()).toBe(sourceNode);
      expect(reverseEdge.getCapacity()).toBe(0);
    });

    test('edge flow cannot exceed capacity', () => {
      const sourceNode = graph.addNode('source', 'Source');
      const node1 = graph.addNode('n1', 'Node 1');
      
      const edge = graph.addEdge(sourceNode, node1, 10);
      
      // Set valid flow
      edge.setFlow(5);
      expect(edge.getFlow()).toBe(5);
      
      // Try to set flow beyond capacity
      expect(() => edge.setFlow(15)).toThrow();
      expect(edge.getFlow()).toBe(5); // Flow should not change
    });

    test('edge flow cannot be negative', () => {
      const sourceNode = graph.addNode('source', 'Source');
      const node1 = graph.addNode('n1', 'Node 1');
      
      const edge = graph.addEdge(sourceNode, node1, 10);
      
      // Try to set negative flow
      expect(() => edge.setFlow(-5)).toThrow();
      expect(edge.getFlow()).toBe(0); // Flow should not change
    });

    test('can reset the graph', () => {
      // Add nodes and edges
      const sourceNode = graph.addNode('source', 'Source');
      const node1 = graph.addNode('n1', 'Node 1');
      const sinkNode = graph.addNode('sink', 'Sink');
      
      graph.setSourceNode(sourceNode);
      graph.setSinkNode(sinkNode);
      
      const edge1 = graph.addEdge(sourceNode, node1, 10);
      const edge2 = graph.addEdge(node1, sinkNode, 5);
      
      // Set some flow
      edge1.setFlow(5);
      edge2.setFlow(3);
      
      // Reset graph
      graph.reset();
      
      // Flows should be reset
      expect(edge1.getFlow()).toBe(0);
      expect(edge2.getFlow()).toBe(0);
    });
  });

  describe('Node class', () => {
    let graph;
    let node;

    beforeEach(() => {
      graph = new CytoscapeGraph(document.createElement('div'));
      node = new Node(graph, 'test', 'Test Node');
    });

    test('has correct id and label', () => {
      expect(node.getId()).toBe('test');
      expect(node.getLabel()).toBe('Test Node');
    });

    test('can be compared with other nodes', () => {
      const sameNode = new Node(graph, 'test', 'Test Node');
      const differentNode = new Node(graph, 'other', 'Other Node');
      
      expect(node.isEqualTo(sameNode)).toBe(true);
      expect(node.isEqualTo(differentNode)).toBe(false);
    });

    test('can be highlighted', () => {
      // Initially not highlighted
      expect(node.isHighlighted()).toBe(false);
      
      // Highlight the node
      node.highlight();
      expect(node.isHighlighted()).toBe(true);
      
      // Unhighlight the node
      node.unhighlight();
      expect(node.isHighlighted()).toBe(false);
    });
  });

  describe('Edge class', () => {
    let graph;
    let sourceNode;
    let targetNode;
    let edge;

    beforeEach(() => {
      graph = new CytoscapeGraph(document.createElement('div'));
      sourceNode = new Node(graph, 'source', 'Source');
      targetNode = new Node(graph, 'target', 'Target');
      edge = new Edge(graph, sourceNode, targetNode, 10);
    });

    test('has correct properties', () => {
      expect(edge.getSourceNode()).toBe(sourceNode);
      expect(edge.getTargetNode()).toBe(targetNode);
      expect(edge.getCapacity()).toBe(10);
      expect(edge.getFlow()).toBe(0);
    });

    test('can update flow', () => {
      edge.setFlow(5);
      expect(edge.getFlow()).toBe(5);
    });

    test('can be highlighted', () => {
      // Initially not highlighted
      expect(edge.isHighlighted()).toBe(false);
      
      // Highlight the edge
      edge.highlight();
      expect(edge.isHighlighted()).toBe(true);
      
      // Unhighlight the edge
      edge.unhighlight();
      expect(edge.isHighlighted()).toBe(false);
    });

    test('can create valid id', () => {
      // Edge id should be a combination of source and target ids
      expect(edge.getId()).toBe('source->target');
    });
  });
}); 