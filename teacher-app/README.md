# Teacher Substitution Scheduler

A specialized application of maximum bipartite matching algorithms for scheduling substitute teachers.

## Overview

The Teacher Substitution Scheduler is an application that helps schools manage teacher substitutions when regular teachers are absent. It uses the maximum bipartite matching algorithm to find the optimal assignment of available substitute teachers to classes.

## Features

- Add available substitute teachers
- Add classes needing substitutes with information about absent teachers
- Specify which teachers can teach which classes (constraints)
- Run the matching algorithm to get optimal assignments
- Visualize the matching as a bipartite graph
- Import/export data for saving and sharing

## Usage

1. Add available substitute teachers using the form on the left
2. Add classes needing substitutes using the form on the right
3. Connect teachers to classes they can teach using the connecting form
4. Click "Find Substitutes" to run the matching algorithm
5. View the results at the bottom of the page
6. Optionally, view the graph visualization by clicking "Show Graph"

You can also load sample data to see how the application works.

## Technical Details

This application uses:
- Maximum bipartite matching algorithm to find optimal teacher assignments
- D3.js for graph visualization
- Materialize CSS for the user interface
- JavaScript for frontend functionality

## Development Notes

This application is a specialized version derived from the more general Matching Algorithm Visualizer. It focuses specifically on the teacher substitution use case, making it more user-friendly for school administrators.

The core matching algorithm is an implementation of the Ford-Fulkerson algorithm for maximum bipartite matching, which efficiently finds the optimal assignments given the constraints.

## License

This project is open source, derived from the Matching Algorithm Visualizer. 