/*         One-to-one bipartite graph matching         */
/*  Note: The implemented algorithm below is based on  *
 *        Professor David Manlove's lecture notes on   *
 *        Graph and matching algorithms (Part 2)       */


/********************
***** Variables *****
********************/

/* Variables for algorithm */
var vAll = [];              // Array of all vertices
var vLeft = [];             // Array of left-hand vertices
var matching = 0;           // Matching size
var queue = [];             // Queue to hold exposed and unvisited vertices on left-hand side
var u = null;               // Exposed and unvisited left-hand vertex under consideration
var exposedUnvisitedId = 0; // Id of next exposed and visited node (makes getting expexposed and visited node more efficient)

/* Variables for animation */
var frames = [];            // Array of frames
var frame;                  // Frame
var longTrace = [];         // Array of long execution trace lines
var shortTrace = [];        // Array of short execution trace lines
var longTraceNum = 0;       // Line number of long execution trace
var shortTraceNum = 0;      // Line number of short execution trace
var dashedEdges = [];       // Array of dashed edges
var solidEdges = [];        // Array of solid edges
var connectedEdges = [];    // Array of connected edges


/***********************
***** Vertex class *****
***********************/
function Vertex1(node) {
    this.node = node;           // Corresponding node from graph
    this.visited = false;       // Visited flag
    this.startVertex = false;   // For left-hand vertex
    this.predecessor = null;    // For right-hand vertex
    this.mate = null;           // Connected vertex
    this.adjacentV = [];        // Array of right-hand vertices connected to left-hand vertex
}


/**************************************
***** Frame class (for animation) *****
**************************************/
function Frame1(pseudocodeLongLine, pseudocodeShortLine, longTraceLine, shortTraceLine, dashedEdges, solidEdges, connectedEdges, vertices, queue, u, v, w, matching) {
    this.pseudocodeLongLine = pseudocodeLongLine;
    this.pseudocodeShortLine = pseudocodeShortLine;
    this.longTraceLine = longTraceLine;
    this.shortTraceLine = shortTraceLine;
    this.dashedEdges = dashedEdges;
    this.solidEdges = solidEdges;
    this.connectedEdges = connectedEdges;
    this.vertices = vertices;
    this.queue = queue;
    this.u = u;
    this.v = v;
    this.w = w;
    this.matching = matching;
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


/***********************************
***** Function to augment path *****
***********************************/
function augment1(endVertex) {

    // w is the end vertex of the path
    var w = endVertex;
    var v = w.predecessor;
    var temp;

    // Create frame and push to frames array (for animation)
    longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> is the end vertex of the path</li>");
    frame = new Frame1(18, 4, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
    frames.push(frame);

    // Iterate as long as v is not the start vertex
    while (!v.startVertex) {

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span> is not the start vertex</li>");
        frame = new Frame1(19, 4, longTraceNum++, shortTraceNum, dashedEdges.slice(), solidEdges.slice(), connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
        frames.push(frame);

        // Store v's old mate in temp variable
        temp = v.mate;

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span>'s current mate is <span class='lime-text'>Vertex " + temp.node.id + "</span></li>");
        frame = new Frame1(20, 4, longTraceNum++, shortTraceNum, dashedEdges.slice(), solidEdges.slice(), connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
        frames.push(frame);

        // Set v's new mate as w
        v.mate = w;

        // Update solid and connected edges (for animation)
        solidEdges.push({ source: v, target: w });
        connectedEdges.push({ source: v, target: w });

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span>'s new mate set as <span class='lime-text'>Vertex " + w.node.id + "</span></li>");
        frame = new Frame1(21, 4, longTraceNum++, shortTraceNum, dashedEdges.slice(), solidEdges.slice(), connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
        frames.push(frame);

        // Set w's mate as v
        w.mate = v;

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span>'s mate set as <span class='lime-text'>Vertex " + v.node.id + "</span></li>");
        shortTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span> and <span class='lime-text'>Vertex " + w.node.id + "</span> set as each other's mate</li>");
        frame = new Frame1(22, 4, longTraceNum++, ++shortTraceNum, dashedEdges.slice(), solidEdges.slice(), connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
        frames.push(frame);

        // Set w equal to v's previous mate (previously stored in temp)
        w = temp;

        // Update dashed and connected edges (for animation)
        dashedEdges.push({ source: v, target: temp });
        connectedEdges.splice(connectedEdges.indexOf(connectedEdges.filter(function (e) {
            return e.source == v && e.target == temp;
        })[0]), 1);

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> is <span class='lime-text'>Vertex " + v.node.id + "</span>'s previous mate");
        shortTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> is <span class='lime-text'>Vertex " + v.node.id + "</span>'s previous mate");
        frame = new Frame1(23, 4, longTraceNum++, ++shortTraceNum, dashedEdges.slice(), solidEdges.slice(), connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
        frames.push(frame);

        // Set v as w's predecessor
        v = w.predecessor;

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span> is <span class='lime-text'>Vertex " + w.node.id + "</span>'s predecessor</li>");
        frame = new Frame1(24, 4, longTraceNum++, shortTraceNum, dashedEdges.slice(), solidEdges.slice(), connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
        frames.push(frame);

    }

    // Create frame and push to frames array (for animation)
    longTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span> is the start vertex</li>");
    frame = new Frame1(19, 4, longTraceNum++, shortTraceNum, dashedEdges.slice(), solidEdges.slice(), connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
    frames.push(frame);

    // Set v and w as each other's mate
    v.mate = w;
    w.mate = v;

    // Update solid edges (for animation)
    solidEdges.push({ source: v, target: w });

    // Create frame and push to frames array (for animation)
    longTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span> and <span class='lime-text'>Vertex " + w.node.id + "</span> set as each other's mate</li>");
    shortTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span> and <span class='lime-text'>Vertex " + w.node.id + "</span> set as each other's mate</li>");
    frame = new Frame1(26, 4, longTraceNum++, ++shortTraceNum, dashedEdges.slice(), solidEdges.slice(), connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
    frames.push(frame);

    // Increment cardinality
    matching++;

    // Update connected edges (for animation)
    connectedEdges.push({ source: v, target: w });

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Matching size incremented");
    shortTrace.push("<li>Matching size incremented");
    frame = new Frame1(26, 4, longTraceNum++, ++shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
    frames.push(frame);

    // Reset dashed and solid edges (for animation)
    dashedEdges = [];
    solidEdges = [];
}


/********************************************
***** Function to find maximum matching *****
********************************************/
function findMaxMatch1(vLeft) {

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Algorithm started</li>");
    shortTrace.push("<li>Algorithm started</li>");
    frame = new Frame1(1, 1, longTraceNum++, shortTraceNum, [], [], [], vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), [], null, null, null, matching);
    frames.push(frame);

    // Mark all left-hand vertices as unvisited
    for (var x of vLeft) {
        x.visited = false;
    }

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>All left-hand vertices set as unvisited</li>");
    frame = new Frame1(2, 1, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue, null, null, null, matching);
    frames.push(frame);

    // Initialise empty queue to hold exposed and unvisited vertices on left-hand side
    queue = [];

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Empty queue, <span class='lime-text'>Q</span>, initialised</li>");
    shortTrace.push("<li>Variables initialised</li>");
    frame = new Frame1(3, 1, longTraceNum++, ++shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), null, null, null, matching);
    frames.push(frame);

    // Exposed and unvisited left-hand vertex under consideration
    u = null;

    // Iterate as long as there exists an exposed and unvisited left-hand vertex
    while ((u = getExposedUnvisited(vLeft)) != null) {  // Get an exposed and unvisited vertex u

        // Create frame and push to frames array (for animation)
        longTrace.push("<li>There exists an exposed and unvisited left-hand vertex</li>");
        shortTrace.push("<li>There exists an exposed and unvisited left-hand vertex</li>");
        frame = new Frame1(4, 2, longTraceNum++, ++shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), null, null, null, matching);
        frames.push(frame);

        // Create frame and push to frames array (for animation)
        longTrace.push("<li>Get exposed and unvisited <span class='lime-text'>Vertex " + u.node.id + "</span></li>");
        frame = new Frame1(5, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, null, null, matching);
        frames.push(frame);

        // Mark all left-hand vertices as non-starting
        for (var x of vLeft)
            x.startVertex = false;

        // Create frame and push to frames array (for animation)
        longTrace.push("<li>All left-hand vertices set as non-starting</li>");
        frame = new Frame1(6, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, null, null, matching);
        frames.push(frame);

        // Mark all right-hand vertices as unvisited
        for (var x of vAll) {
            if (x.node.parity == 2)
                x.visited = false;
        }

        // Create frame and push to frames array (for animation)
        longTrace.push("<li>All right-hand vertices as unvisited</li>");
        frame = new Frame1(7, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, null, null, matching);
        frames.push(frame);

        // Insert vertex u into queue
        queue.push(u);

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Vertex " + u.node.id + "</span> inserted into <span class='lime-text'>Q</span></li>");
        frame = new Frame1(8, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, null, null, matching);
        frames.push(frame);

        // Mark vertex u as start vertex (first vertex in alternating path)
        u.startVertex = true;

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Vertex " + u.node.id + "</span> set as start vertex</li>");
        frame = new Frame1(9, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, null, null, matching);
        frames.push(frame);

        // Iterate as long as queue is not empty
        while (queue.length > 0) {

            // Create frame and push to frames array (for animation)
            longTrace.push("<li><span class='lime-text'>Q</span> is not empty</li>");
            frame = new Frame1(10, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, null, null, matching);
            frames.push(frame);

            // Remove vertex v from front of queue
            var v = queue.shift();

            // Create frame and push to frames array (for animation)
            longTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span> removed from <span class='lime-text'>Q</span></li>");
            frame = new Frame1(11, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, null, matching);
            frames.push(frame);

            // Mark v as visited
            v.visited = true;

            // Create frame and push to frames array (for animation)
            longTrace.push("<li><span class='lime-text'>Vertex " + v.node.id + "</span> set as visited</li>");
            frame = new Frame1(12, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, null, matching);
            frames.push(frame);

            // For each vertex w adjacent to v
            for (var w of v.adjacentV) {

                // Create frame and push to frames array (for animation)
                longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> is adjacent to <span class='lime-text'>Vertex " + v.node.id + "</span></li>");
                frame = new Frame1(13, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
                frames.push(frame);

                // If w is not visited
                if (!w.visited) {

                    // Create frame and push to frames array (for animation)
                    longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> is not visited</li>");
                    frame = new Frame1(14, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
                    frames.push(frame);

                    // Mark vertex w as visited
                    w.visited = true;

                    // Create frame and push to frames array (for animation)
                    longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> set as visited</li>");
                    frame = new Frame1(15, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
                    frames.push(frame);

                    // Set w's predecessor as v
                    w.predecessor = v;

                    // Create frame and push to frames array (for animation)
                    longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span>'s predecessor set as <span class='lime-text'>Vertex " + v.node.id + "</span></li>");
                    frame = new Frame1(16, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
                    frames.push(frame);

                    // If w is exposed
                    if (w.mate == null) {

                        // Create frame and push to frames array (for animation)
                        longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> is exposed</li>");
                        shortTrace.push("<li>Augmenting path found between <span class='lime-text'>Vertex " + u.node.id + "</span> and <span class='lime-text'>Vertex " + w.node.id + "</span></li>");
                        frame = new Frame1(17, 3, longTraceNum++, ++shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
                        frames.push(frame);

                        // Augment path with w as end vertex of path
                        augment1(w);
                        
                        // Empty queue
                        queue = [];

                        // Create frame and push to frames array (for animation)
                        longTrace.push("<li>Queue, <span class='lime-text'>Q</span>, emptied</li>");
                        frame = new Frame1(27, 4, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), [], u, null, null, matching);
                        frames.push(frame);

                        // Create frame and push to frames array (for animation)
                        longTrace.push("<li>Break out of for loop</li>");
                        frame = new Frame1(28, 4, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), [], u, null, null, matching);
                        frames.push(frame);

                        // Break out of for loop
                        break;
                        
                    }
                    else {

                        // Create frame and push to frames array (for animation)
                        longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> is not exposed</li>");
                        frame = new Frame1(17, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
                        frames.push(frame);

                        // Insert w's mate into queue
                        queue.push(w.mate);

                        // Create frame and push to frames array (for animation)
                        longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span>'s mate, <span class='lime-text'>Vertex " + w.mate.node.id + "</span>, inserted into <span class='lime-text'>Q</span></li>");
                        frame = new Frame1(30, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
                        frames.push(frame);

                    }

                }

                // If w is visited
                else {

                    // Create frame and push to frames array (for animation)
                    longTrace.push("<li><span class='lime-text'>Vertex " + w.node.id + "</span> is visited</li>");
                    frame = new Frame1(14, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, v, w, matching);
                    frames.push(frame);

                }

            }

        }

        // Create frame and push to frames array (for animation)
        longTrace.push("<li><span class='lime-text'>Q</span> is empty</li>");
        frame = new Frame1(10, 3, longTraceNum++, shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), u, null, null, matching);
        frames.push(frame);
    }

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>There exists no exposed and unvisited left-hand vertex</li>");
    shortTrace.push("<li>There exists no exposed and unvisited left-hand vertex</li>");
    frame = new Frame1(4, 2, longTraceNum++, ++shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), queue.slice(), null, null, null, matching);
    frames.push(frame);

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Maximum matching found</li>");
    shortTrace.push("<li>Maximum matching found</li>");
    frame = new Frame1(35, 5, longTraceNum++, ++shortTraceNum, [], [], connectedEdges.slice(), vAll.map(v => ({ node: v.node, visited: v.visited, startVertex: v.startVertex, predecessor: v.predecessor })), [], null, null, null, matching);
    frames.push(frame);

}


/************************************
***** Function to run algorithm *****
************************************/
function runAlgorithm1() {

    /* Initialise variables for algorithm */
    vAll = [];              // Array of all vertices
    vLeft = [];             // Array of left-hand vertices
    matching = 0;           // Matching/Cardinatlity
    exposedUnvisitedId = 0; // Id of next exposed and visited node (makes getting expexposed and visited node more efficient)

    /* Initialise variables for animation */
    frames = [];            // Array of frames
    longTrace = [];         // Array of long execution trace lines
    shortTrace = [];        // Array of short execution trace lines
    longTraceNum = 0;       // Line number of long execution trace
    shortTraceNum = 0;      // Line number of short execution trace
    dashedEdges = [];       // Array of dashed edges
    solidEdges = [];        // Array of solid edges
    connectedEdges = [];    // Array of connected edges

    // Create vertices
    for (var n of nodes) {
        var v = new Vertex1(n);
        vAll.push(v);

        // If node has parity 1, assign as left vertex
        if (n.parity == 1)
            vLeft.push(v);
    }

    // Create edges
    for (var l of links) {
        var left = vLeft.filter(function (v) {
            return v.node == l.source;
        });
        var right = vAll.filter(function (v) {
            return v.node == l.target;
        });
        left[0].adjacentV.push(right[0]);
    }

    // Find maximum matching
    findMaxMatch1(vLeft);

}