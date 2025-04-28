/*                            Edmonds's maximum matching algorithm                            */
/*                    Note: The implemented algorithm below builds upon                       *
 *             Felipe Lopes de Freitas's C++ implementation of the algorithm                  *
 * (https://github.com/evandrix/codejam/blob/master/cpp/algorithms/graph/EdmondsMatching.cpp) */


/********************
***** Variables *****
********************/
var graph = [];     // Array of edges in graph
var match = [];     // Array of flags indicating if each vertex is matched
var blossom = [];   // Array of blossom bases for each vertex
var label = [];     // Array of labels for each vertex
var path = [];      // Array of stored paths (for two paths)
var endPath = [];   // Array of end of path indices (for two paths)
var queueFront;     // Indicates front of queue used to scan labels
var queueBack;      // Indicates back of queue used to scan labels


/**********************
***** Label class *****
**********************/
function Label() {              // Labels (-1 means empty, -2 means undefined)
    this.even = undefined;      // Even label: alternating path of even distance from root to vertex
    this.odd = [];              // Odd label:  base nodes of blossoms can have two
};


/***************************************************
***** Elem class (Element for queue of labels) *****
***************************************************/
function Elem(vertex, type) {
    this.vertex = vertex;       // Vertex ID
    this.type = type;           // 0 means even, 1 means odd
};


/**************************************
***** Frame class (for animation) *****
**************************************/
function Frame2(pseudocodeLongLine, pseudocodeShortLine, longTraceLine, shortTraceLine, graph, path, blossom) {
    this.pseudocodeLongLine = pseudocodeLongLine;
    this.pseudocodeShortLine = pseudocodeShortLine;
    this.longTraceLine = longTraceLine;
    this.shortTraceLine = shortTraceLine;
    this.graph = graph;
    this.path = path;
    this.blossom = blossom;
}


/*************************************************
***** Function to construct alternating path *****
*************************************************/
function backtrace(vert, pathNum, stop, parity, direction) {

    // If stop vertex is reached, return (if stop is set as -1, backtrace climbs whole tree)
    if (vert == stop)
        return;

    // If parity is set to check for even label (0)
    else if (parity == 0) {

        // If reverse direction (-1)
        if (direction == -1) {

            // Recursive call to backtrace
            backtrace(label[vert].even, pathNum, stop, (parity + 1) % 2, -1);
            path[pathNum][endPath[pathNum]++] = vert;

        }

        // If forward direction (1)
        else if (direction == 1) {

            // Recursive call to backtrace
            path[pathNum][endPath[pathNum]++] = vert;
            backtrace(label[vert].even, pathNum, stop, (parity + 1) % 2, 1);

        }

    }

    // If parity is set to check for odd label (1) and second one is undefined
    else if (parity == 1 && label[vert].odd[1] == -2) {

        // If reverse direction (-1)
        if (direction == -1) {

            // Recursive call to backtrace
            backtrace(label[vert].odd[0], pathNum, stop, (parity + 1) % 2, -1);
            path[pathNum][endPath[pathNum]++] = vert;

        }

        // If forward direction (1)
        else if (direction == 1) {

            // Recursive call to backtrace
            path[pathNum][endPath[pathNum]++] = vert;
            backtrace(label[vert].odd[0], pathNum, stop, (parity + 1) % 2, 1);

        }

    }

    // If parity is set to check for odd label (1) and second one is defined (dual odd labels), there exists an odd length alternating path from root to vertex
    else if (parity == 1 && label[vert].odd[1] != -2) {

        // If reverse direction (-1)
        if (direction == -1) {

            // Recursive call to backtrace
            backtrace(label[vert].odd[0], pathNum, -1, (parity + 1) % 2, -1);
            backtrace(label[vert].odd[1], pathNum, vert, (parity + 1) % 2, 1);
            path[pathNum][endPath[pathNum]++] = vert;

        }

        // If forward direction (1)
        else if (direction == 1) {

            // Recursive call to backtrace
            backtrace(label[vert].odd[1], pathNum, vert, (parity + 1) % 2, -1);
            backtrace(label[vert].odd[0], pathNum, -1, (parity + 1) % 2, 1);
            path[pathNum][endPath[pathNum]++] = vert;

        }

    }

}


/*******************************************
***** Function to simulate contraction *****
*******************************************/
function newBlossom(a, b) {

    // Declare variables
    var i, base, innerBlossom, innerBase;

    // Find the first common vertex in paths of vertices a and b to their roots
    for (i = 0; path[0][i] == path[1][i]; i++);
    i--;

    // Array of path vertices and stringified path
    var pathArray = [];
    var pathString = "";
    for (var p = endPath[0] - 1; p >= i; p--) {
        pathArray.push(path[0][p] + 1);
        pathString += "<span class='lime-text'>" + String(path[0][p] + 1) + "</span>, ";
    }
    for (var p = i + 1; p < endPath[1]; p++) {
        pathArray.push(path[1][p] + 1);
        pathString += "<span class='lime-text'>" + String(path[1][p] + 1) + "</span>";
        if (p != path[1].length - 1)
            pathString += ", ";
    }

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>There exists an augmenting path or blossom</li>");
    frame = new Frame2(2, 2, longTraceNum++, shortTraceNum, graph.map(g => ([ ...g ])), [], [...blossom]);
    frames.push(frame);

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Path {" + pathString + "} found</li>");
    frame = new Frame2(3, 2, longTraceNum++, shortTraceNum, graph.map(g => ([ ...g ])), pathArray, [...blossom]);
    frames.push(frame);

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Path {" + pathString + "} is a blossom</li>");
    frame = new Frame2(4, 2, longTraceNum++, shortTraceNum, graph.map(g => ([ ...g ])), pathArray, [...blossom]);
    frames.push(frame);

    // Set blossom base as the common vertex
    base = blossom[path[0][i]];

    // Put vertices in path into blossom
    for (var j = i; j < endPath[0]; j++)
        blossom[path[0][j]] = base;

    for (var j = i + 1; j < endPath[1]; j++)
        blossom[path[1][j]] = base;

    // For the path of each of the two vertices
    for (var p = 0; p < 2; p++) {

        // For vertices in path
        for (var j = i + 1; j < endPath[p] - 1; j++) {

            // If no even label, set it as next vertex in path
            if (label[path[p][j]].even == -2) {
                label[path[p][j]].even = path[p][j + 1];
                queue[queueBack++] = new Elem(path[p][j], 0);
            }

            // If no odd label and next vertex has no even label, set it as next vertex in path
            else if (label[path[p][j]].odd[0] == -2 && label[path[p][j + 1]].even == -2) {
                label[path[p][j]].odd[0] = path[p][j + 1];
                queue[queueBack++] = new Elem(path[p][j], 1);
            }

            // If no odd label but next vertex has even label, set it as next vertex in path, current vertex is a blossom base of which next vertex is part of
            else if (label[path[p][j]].odd[0] == -2 && label[path[p][j + 1]].even != -2) {

                // Get the previous blossom
                innerBlossom = blossom[path[p][j]];
                innerBase = j;

                // Go to end of path of previous blossom
                for (; blossom[j] == innerBlossom && j < endPath[p] - 1; j++);
                j--;

                // Apply labels
                label[path[p][innerBase]].odd[0] = path[p][j + 1];
                label[path[p][innerBase]].odd[1] = path[p][j];
                queue[queueBack++] = new Elem(path[p][innerBase], 1);

            }

        }

    }

    // Add labels for vertex a and b

    // If vertex a and b are unmatched, add odd labels
    if (graph[a][b] == false) {
        if (label[a].odd[0] == -2) {
            label[a].odd[0] = b;
            queue[queueBack++] = new Elem(a, 1);
        }
        if (label[b].odd[0] == -2) {
            label[b].odd[0] = a;
            queue[queueBack++] = new Elem(b, 1);
        }
    }

    // If vertex a and b are matched, add even labels
    else if (graph[a][b]) {
        if (label[a].even == -2) {
            label[a].even = b;
            queue[queueBack++] = new Elem(a, 0);
        }
        if (label[b].even == -2) {
            label[b].even = a;
            queue[queueBack++] = new Elem(b, 0);
        }
    }

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Shrink blossom {" + pathString + "}</li>");
    frame = new Frame2(5, 2, longTraceNum++, shortTraceNum, graph.map(g => ([ ...g ])), pathArray, [...blossom]);
    frames.push(frame);

}


/**************************************************
***** Function to augment matching along path *****
**************************************************/
function augment3() {

    // Declare variables to hold vertices
    var a, b;

    // Array of path vertices and stringified path
    var pathArray = [];
    var pathString = "";
    for (var p = 0; p < endPath[0]; p++) {
        pathArray.push(path[0][p] + 1);
        pathString += "<span class='lime-text'>" + String(path[0][p] + 1) + "</span>, ";
    }
    for (var p = endPath[1] - 1; p >= 0; p--) {
        pathArray.push(path[1][p] + 1);
        pathString += "<span class='lime-text'>" + String(path[1][p] + 1) + "</span>";
        if (p != 0)
            pathString += ", ";
    }

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>There exists an augmenting path or blossom</li>");
    shortTrace.push("<li>There exists an augmenting path</li>");
    frame = new Frame2(2, 2, longTraceNum++, ++shortTraceNum, graph.map(g => ([ ...g ])), [], [...blossom]);
    frames.push(frame);

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Path {" + pathString + "} found</li>");
    shortTrace.push("<li>Augmenting path {" + pathString + "} found</li>");
    frame = new Frame2(3, 3, longTraceNum++, ++shortTraceNum, graph.map(g => ([ ...g ])), pathArray, [...blossom]);
    frames.push(frame);

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Path {" + pathString + "} is not a blossom</li>");
    frame = new Frame2(4, 3, longTraceNum++, shortTraceNum, graph.map(g => ([ ...g ])), pathArray, [...blossom]);
    frames.push(frame);

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Path {" + pathString + "} is an augmenting path</li>");
    frame = new Frame2(6, 3, longTraceNum++, shortTraceNum, graph.map(g => ([ ...g ])), pathArray, [...blossom]);
    frames.push(frame);

    // For the path of each of the two vertices
    for (var p = 0; p < 2; p++) {

        // Augment (add unmatched edges, remove matched edges)
        for (var i = 0; i < endPath[p] - 1; i++) {
            a = path[p][i];             // Get vertex in path
            b = path[p][i + 1];         // Get next vertex in path

            // If initially unmatched, add edge
            if (graph[a][b] == false) {
                graph[a][b] = true;
                graph[b][a] = true;
            }

            // If initially matched, remove edge
            else if (graph[a][b]) {
                graph[a][b] = false;
                graph[b][a] = false;
            }
        }

    }

    // Get vertices
    a = path[0][endPath[0] - 1];
    b = path[1][endPath[1] - 1];

    // If initially unmatched, add edge
    if (graph[a][b] == false) {
        graph[a][b] = true;
        graph[b][a] = true;
    }

    // If initially matched, remove edge
    else if (graph[a][b]) {
        graph[a][b] = false;
        graph[b][a] = false;
    }

    // Mark vertices as matched
    match[path[0][0]] = true;
    match[path[1][0]] = true;

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Augment matching along path {" + pathString + "}</li>");
    shortTrace.push("<li>Augment matching along path {" + pathString + "}</li>");
    frame = new Frame2(7, 4, longTraceNum++, ++shortTraceNum, graph.map(g => ([ ...g ])), pathArray, [...blossom]);
    frames.push(frame);

}


/*******************************************
***** Function to find augmenting path *****
*******************************************/
function findAugmentingPath() {

    // Node and corresponding label
    var node;
    var nodeLabel;

    // Initialise queue front and back (queue is empty)
    queueFront = 0;
    queueBack = 0;

    // For each vertex
    for (var i = 0; i < nodes.length; i++) {

        // Set each vertex as being in its own blossom
        blossom[i] = i;

        // Initialise all labels as -2 (undefined)
        label[i].even = -2;
        label[i].odd[0] = -2;
        label[i].odd[1] = -2;

        // If vertex is exposed
        if (!match[i]) {
            label[i].even = -1;                     // Set even label as -1 (empty)
            queue[queueBack++] = new Elem(i, 0);    // Add exposed vertex to queue (a root in forest)
        }

    }

    // While there exists an unvisited vertex
    while (queueFront < queueBack) {

        // Get vertex from queue
        node = queue[queueFront].vertex;
        nodeLabel = queue[queueFront].type;

        // If vertex is at even distance from root
        if (nodeLabel == 0) {

            // For each vertex
            for (var i = 0; i < nodes.length; i++) {

                // If there exists an unmatched edge
                if (graph[node][i] == false) {

                    // If both vertices are in the same blossom
                    if (blossom[node] == blossom[i]);
                    // Do nothing

                    // Else if an odd-length alternating path is found
                    else if (label[i].even != -2) {

                        // Initialise path end
                        endPath[0] = 0;
                        endPath[1] = 0;

                        // Construct alternating paths from vertices to roots
                        backtrace(node, 0, -1, 0, -1);
                        backtrace(i, 1, -1, 0, -1);

                        // If vertices have the same root, path is a blossom
                        if (path[0][0] == path[1][0])
                            newBlossom(node, i);    // Simulate contraction

                        // If vertices have different roots, path is an augmenting path
                        else {
                            augment3();             // Augment matching along path

                            return true;            // Indicate that matching size increased
                        }

                    }

                    // Else if an unlabelled vertex is found
                    else if (label[i].even == -2 && label[i].odd[0] == -2) {
                        label[i].odd[0] = node;                 // Set odd label as the other vertex
                        queue[queueBack++] = new Elem(i, 1);    // Add vertex to queue
                    }

                }

            }

        }

        // If vertex is at odd distance from root
        else if (nodeLabel == 1) {

            // For each vertex
            for (var i = 0; i < nodes.length; i++) {

                // If there exists a matched edge
                if (graph[node][i]) {

                    // If both vertices are in the same blossom
                    if (blossom[node] == blossom[i]);
                    // Do nothing

                    // Else if an odd-length alternating path is found
                    else if (label[i].odd[0] != -2) {

                        // Initialise path end
                        endPath[0] = 0;
                        endPath[1] = 0;

                        // Construct alternating paths from vertices to roots
                        backtrace(node, 0, -1, 1, -1);
                        backtrace(i, 1, -1, 1, -1);

                        // If vertices have the same root, path is a blossom
                        if (path[0][0] == path[1][0])
                            newBlossom(node, i);    // Simulate contraction

                        // If vertices have different roots, path is an augmenting path
                        else {
                            augment3();             // Augment matching along path
                            return true;            // Indicate that matching size increased
                        }

                    }

                    // Else if an unlabelled vertex is found
                    else if (label[i].even == -2 && label[i].odd[0] == -2) {
                        label[i].even = node;                   // Set even label as the other vertex
                        queue[queueBack++] = new Elem(i, 0);    // Add vertex to queue
                    }

                }

            }

        }

        // Move to next element of queue
        queueFront++;

    }

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>There exists no augmenting path or blossom</li>");
    shortTrace.push("<li>There exists no augmenting path</li>");
    frame = new Frame2(2, 2, longTraceNum++, ++shortTraceNum, graph.map(g => ([ ...g ])), [], [...blossom]);
    frames.push(frame);

    // Scanning complete, no augmenting path found
    return false;
}


/********************************************
***** Function to find maximum matching *****
********************************************/
function findMaxMatch3() {

    // Initialise empty matching (reset flags)
    for (var i = 0; i < nodes.length; i++)
        match[i] = false;

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Algorithm started</li>");
    shortTrace.push("<li>Algorithm started</li>");
    frame = new Frame2(1, 1, longTraceNum++, shortTraceNum, graph.map(g => ([ ...g ])), [], [...blossom]);
    frames.push(frame);

    // Find augmenting path and augment matching along path until maximum matching is found
    while (findAugmentingPath());

    // Create frame and push to frames array (for animation)
    longTrace.push("<li>Maximum matching found</li>");
    shortTrace.push("<li>Maximum matching found</li>");
    frame = new Frame2(9, 5, longTraceNum++, ++shortTraceNum, graph.map(g => ([ ...g ])), [], []);
    frames.push(frame);

}


/************************************
***** Function to run algorithm *****
************************************/
function runAlgorithm3() {

    /* Initialise variables for algorithm */
    graph = [];     // Array of edges in graph
    match = [];     // Array of flags indicating if each vertex is matched
    blossom = [];   // Array of blossom bases for each vertex
    label = [];     // Array of labels for each vertex
    path = [];      // Array of stored paths (up to two)
    endPath = [];   // Array of end of paths (up to two)
    queue = [];     // Queue used to scan labels

    /* Initialise variables for animation */
    frames = [];            // Array of frames
    longTrace = [];         // Array of long execution trace lines
    shortTrace = [];        // Array of short execution trace lines
    longTraceNum = 0;       // Line number of long execution trace
    shortTraceNum = 0;      // Line number of short execution trace

    // Initialise graph matrix
    for (var i = 0; i < nodes.length; i++) {
        graph[i] = [];
        for (var j = 0; j < nodes.length; j++)
            graph[i][j] = null;
    }

    // Transfer edges from D3 graph to graph matrix
    for (var l of links) {
        graph[l.source.id - 1][l.target.id - 1] = false;
        graph[l.target.id - 1][l.source.id - 1] = false;
    }

    // Initialise paths (two)
    for (var i = 0; i < 2; i++) {
        path[i] = [];
    }

    // Initialise labels
    for (var i = 0; i < nodes.length; i++) {
        label[i] = new Label();
    }

    // Find maximum matching
    findMaxMatch3();

}