# Algorithm Visualization System Tests

This directory contains tests for the Algorithm Visualization System. The test suite covers various aspects of the system including algorithm correctness, UI components, and graph visualization.

## Test Structure

The test suite is organized into several files:

1. **maxflow-algorithms.test.js**: Tests the core network flow algorithms (Ford-Fulkerson, Edmonds-Karp, Push-Relabel)
2. **ui-components.test.js**: Tests basic UI components like Dropdown, Switch, and Checkbox
3. **graph-visualization.test.js**: Tests the graph visualization components and operations
4. **matching-algorithm.test.js**: Tests the bipartite matching algorithm implementation

## Running Tests

To run all tests:

```bash
npm test
```

To run specific tests:

```bash
npm test -- maxflow-algorithms
npm test -- ui-components
npm test -- graph-visualization
npm test -- matching-algorithm
```

## Test Coverage

The test suite covers:
- Algorithm correctness: Verifies that the algorithms produce the expected outputs
- UI component functionality: Ensures UI components render correctly and handle events properly
- Graph operations: Tests graph creation, modification, and traversal operations
- Matching algorithm: Validates bipartite matching algorithm functionality

## Adding New Tests

When adding new tests:

1. Create a new test file or add tests to an existing file
2. Use descriptive test names and group related tests with `describe`
3. Set up and tear down test fixtures with `beforeEach` and `afterEach`
4. Mock external dependencies when necessary

## Mocks

The test suite includes mocks for:
- CSS/SCSS files
- Image and other static asset files
- External libraries like cytoscape
- DOM APIs

## Continuous Integration

Tests are automatically run in CI/CD pipelines to ensure code quality before deployment. 