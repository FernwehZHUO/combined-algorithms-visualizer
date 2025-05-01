# Combined Algorithms Visualizer

A collection of algorithm visualization tools designed to help understand complex algorithms through interactive visual representations.

## Overview

This project combines multiple algorithm visualization tools into a single unified platform. It includes:

- **Maxflow Algorithm Visualizer**: Interactive visualization of maximum flow algorithms in networks
- **Matching Algorithm Visualizer**: Visual representation of matching algorithms
- **Teacher Substitution App**: An application for teacher substitution management

## Live Demo

The application is deployed on GitHub Pages at: [https://yourusername.github.io/combined-algorithms-visualizer/](https://yourusername.github.io/combined-algorithms-visualizer/)

## Features

### Maxflow Algorithm Visualizer
- Interactive network graph creation
- Step-by-step visualization of maximum flow algorithms
- Multiple algorithm implementations
- Detailed explanation of each step

### Matching Algorithm Visualizer
- Visualization of various matching algorithms
- Interactive examples
- Performance metrics

### Teacher Substitution App
- Manage teacher substitutions
- Schedule visualization
- Conflict resolution

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/combined-algorithms-visualizer.git
   ```

2. Install dependencies:
   ```
   cd combined-algorithms-visualizer
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

This will launch all applications on different ports:
- Main application: http://localhost:3000
- Maxflow visualizer: http://localhost:3001
- Matching algorithm: http://localhost:3002
- Teacher app: http://localhost:3003

## Project Structure

```
combined-algorithms-visualizer/
├── maxflow/                # Maxflow algorithm visualization
├── matching-algorithm/     # Matching algorithm visualization
├── teacher-app/            # Teacher substitution application
├── css/                    # Shared CSS files
├── scripts/                # Build and utility scripts
└── README.md
```

## Building for Production

To build all applications for production:

```
npm run build
```

This builds each individual application and combines them into the main directory structure.

## Technologies Used

- React.js
- TypeScript
- Cytoscape.js
- SASS/SCSS
- Webpack

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped with the development of these visualization tools
- Special thanks to the academic advisors who provided guidance on the algorithm implementations