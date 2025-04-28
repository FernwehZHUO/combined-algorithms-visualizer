/**
 * Teacher Substitution Scheduler - Algorithm
 * This file contains the implementation of maximum bipartite matching algorithm
 * used for matching teachers to classes
 */

/********************
***** Variables *****
********************/

// Graph variables
var vAll = [];              // Array of all vertices
var vLeft = [];             // Array of left-hand vertices (teachers)
var matching = 0;           // Matching size
var queue = [];             // Queue to hold exposed and unvisited vertices on left-hand side
var u = null;               // Exposed and unvisited left-hand vertex under consideration
var exposedUnvisitedId = 0; // Id of next exposed and visited node

// Graph visualization variables
var frames = [];            // Array of frames for visualization
var dashedEdges = [];       // Array of dashed edges
var solidEdges = [];        // Array of solid edges
var connectedEdges = [];    // Array of connected edges

/***********************
***** Vertex class *****
***********************/
function Vertex(node) {
    this.node = node;           // Corresponding node from graph
    this.visited = false;       // Visited flag
    this.startVertex = false;   // For left-hand vertex
    this.predecessor = null;    // For right-hand vertex
    this.mate = null;           // Connected vertex
    this.adjacentV = [];        // Array of right-hand vertices connected to left-hand vertex
}

/***********************************
***** Function to augment path *****
***********************************/
function augment(endVertex) {
    // w is the end vertex of the path
    var w = endVertex;
    var v = w.predecessor;
    var temp;

    // Iterate as long as v is not the start vertex
    while (!v.startVertex) {
        // Store v's old mate in temp variable
        temp = v.mate;

        // Set v's new mate as w
        v.mate = w;

        // Update solid and connected edges for visualization
        solidEdges.push({ source: v, target: w });
        connectedEdges.push({ source: v, target: w });

        // Set w's mate as v
        w.mate = v;

        // Set w equal to v's previous mate (previously stored in temp)
        w = temp;

        // Update dashed and connected edges for visualization
        dashedEdges.push({ source: v, target: temp });
        connectedEdges.splice(connectedEdges.indexOf(connectedEdges.filter(function (e) {
            return e.source == v && e.target == temp;
        })[0]), 1);

        // Set v as w's predecessor
        v = w.predecessor;
    }

    // Set v and w as each other's mate
    v.mate = w;
    w.mate = v;

    // Update solid edges for visualization
    solidEdges.push({ source: v, target: w });

    // Increment matching
    matching++;

    // Update connected edges for visualization
    connectedEdges.push({ source: v, target: w });

    // Reset dashed and solid edges for visualization
    dashedEdges = [];
    solidEdges = [];
}

/*****************************************************************
***** Function to get exposed and unvisited left-hand vertex *****
*****************************************************************/
function getExposedUnvisited(vLeft) {
    for (var i = exposedUnvisitedId; i < vLeft.length; i++) {
        if (vLeft[i].visited == false && vLeft[i].mate == null) {
            exposedUnvisitedId = i + 1;
            return vLeft[i];
        }
    }

    // Return null if there exists no exposed and unvisited left-hand vertex
    return null;
}

/********************************************
***** Function to find maximum matching *****
********************************************/
function findMaxMatch(vLeft) {
    // Mark all left-hand vertices as unvisited
    for (var x of vLeft) {
        x.visited = false;
    }

    // Initialise empty queue to hold exposed and unvisited vertices on left-hand side
    queue = [];

    // Exposed and unvisited left-hand vertex under consideration
    u = null;

    // Iterate as long as there exists an exposed and unvisited left-hand vertex
    while ((u = getExposedUnvisited(vLeft)) != null) {  // Get an exposed and unvisited vertex u
        // Mark all left-hand vertices as non-starting
        for (var x of vLeft)
            x.startVertex = false;

        // Mark all right-hand vertices as unvisited
        for (var x of vAll) {
            if (x.node.type === 'class')
                x.visited = false;
        }

        // Insert vertex u into queue
        queue.push(u);

        // Mark vertex u as start vertex (first vertex in alternating path)
        u.startVertex = true;

        // Iterate as long as queue is not empty
        while (queue.length > 0) {
            // Remove vertex v from front of queue
            var v = queue.shift();

            // Mark v as visited
            v.visited = true;

            // For each vertex w adjacent to v
            for (var w of v.adjacentV) {
                // If w is not visited
                if (!w.visited) {
                    // Mark vertex w as visited
                    w.visited = true;

                    // Set w's predecessor as v
                    w.predecessor = v;

                    // If w is exposed
                    if (w.mate == null) {
                        // Augment path with w as end vertex of path
                        augment(w);
                        
                        // Empty queue
                        queue = [];

                        // Break out of for loop
                        break;
                    }
                    else {
                        // Insert w's mate into queue
                        queue.push(w.mate);
                    }
                }
            }
        }
    }
}

/**************************
***** Run the algorithm ***
**************************/
function runAlgorithm(availableTeachers, classesNeeding, connections) {
    // Reset variables
    vAll = [];
    vLeft = [];
    matching = 0;
    exposedUnvisitedId = 0;
    frames = [];
    dashedEdges = [];
    solidEdges = [];
    connectedEdges = [];

    // Create vertices for teachers (left side of bipartite graph)
    availableTeachers.forEach(teacher => {
        var node = { id: teacher.id, name: teacher.name, type: 'teacher' };
        var vertex = new Vertex(node);
        vLeft.push(vertex);
        vAll.push(vertex);
    });

    // Create vertices for classes (right side of bipartite graph)
    classesNeeding.forEach(classObj => {
        var node = { id: classObj.id, name: classObj.name, type: 'class', absentTeacher: classObj.absentTeacher };
        var vertex = new Vertex(node);
        vAll.push(vertex);
    });

    // Add connections as adjacency information
    vLeft.forEach(leftVertex => {
        const teacherConnections = connections.filter(c => c.teacherId === leftVertex.node.id);
        teacherConnections.forEach(conn => {
            const rightVertex = vAll.find(v => v.node.id === conn.classId);
            if (rightVertex) {
                leftVertex.adjacentV.push(rightVertex);
                connectedEdges.push({ source: leftVertex, target: rightVertex });
            }
        });
    });

    // Run the maximum matching algorithm
    findMaxMatch(vLeft);

    // Return the results
    return {
        matching: matching,
        teachers: vAll.filter(v => v.node.type === 'teacher'),
        classes: vAll.filter(v => v.node.type === 'class')
    };
} 