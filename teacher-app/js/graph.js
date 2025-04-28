/**
 * Teacher Substitution Scheduler - Graph
 * This file contains the implementation of graph visualization
 */

/**************************
***** Nodes and links *****
**************************/
var nodes = [];
var links = [];

/*********************
***** Graph size *****
*********************/
var graphWidth = 0;
var graphHeight = 0;

/***********************
***** Graph design *****
***********************/
var svg = null;
var force = null;
var edges = null;
var vertices = null;

/***********************
***** Graph setup ******
***********************/
function initializeGraph() {
    // Set graph panel dimensions
    graphWidth = $("#graph-panel").width();
    graphHeight = $("#graph-panel").height();

    // Create SVG
    svg = d3.select("#graph")
        .attr("width", graphWidth)
        .attr("height", graphHeight);

    // Clear existing content
    svg.selectAll("*").remove();

    // Add text to indicate drawing area
    svg.append("text")
        .attr("id", "draw-text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("fill", "grey")
        .attr("unselectable", "on")
        .text("Graph visualization will appear here");

    // Group of edges in graph
    edges = svg.append("g")
        .selectAll(".edge");

    // Group of vertices in graph
    vertices = svg.append("g")
        .selectAll(".vertex");

    // Initialize force layout
    force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .size([graphWidth, graphHeight])
        .linkDistance(100)
        .charge(-300)
        .on("tick", tick);

    // Initially hide the graph panel
    $("#graph-panel").parent().parent().hide();
}

/****************************
***** Graph interaction *****
****************************/

// Position nodes button
$("#position-nodes").click(positionNodes);

// Show graph button
$("#show-graph").click(showGraph);

/**********************************
***** Function to position nodes **
***********************************/
function positionNodes() {
    if (nodes.length === 0) return;
    
    // Position teachers on the left
    var teacherCount = nodes.filter(n => n.type === 'teacher').length;
    if (teacherCount > 0) {
        var teacherSpacing = graphHeight / (teacherCount + 1);
        
        nodes.filter(n => n.type === 'teacher').forEach((node, i) => {
            node.x = graphWidth * 0.25;
            node.y = teacherSpacing * (i + 1);
            node.px = node.x; // Set physical position to match display position
            node.py = node.y;
            node.fixed = true; // Fix the node in place
        });
    }
    
    // Position classes on the right
    var classCount = nodes.filter(n => n.type === 'class').length;
    if (classCount > 0) {
        var classSpacing = graphHeight / (classCount + 1);
        
        nodes.filter(n => n.type === 'class').forEach((node, i) => {
            node.x = graphWidth * 0.75;
            node.y = classSpacing * (i + 1);
            node.px = node.x; // Set physical position to match display position
            node.py = node.y;
            node.fixed = true; // Fix the node in place
        });
    }
    
    // Update force layout
    force.start();
    
    // We need to call tick manually to immediately update the graph
    // without waiting for the force layout simulation
    tick();
    
    // Stop force layout after positions are set
    force.stop();
}

/********************************
***** Function to show graph ****
********************************/
function showGraph() {
    // Show the graph panel
    $("#graph-panel").parent().parent().show();
    
    // Check if there's data to display
    if (nodes.length === 0 || links.length === 0) {
        // If there's no current data in the graph, try to build it
        // from the currently available teachers, classes and connections
        if (typeof availableTeachers !== 'undefined' && 
            typeof classesNeeding !== 'undefined' && 
            typeof connections !== 'undefined') {
            buildGraph(availableTeachers, classesNeeding, connections, substitutionResults);
        }
    }
    
    // Position nodes properly after showing the graph
    setTimeout(positionNodes, 100);
}

/********************************
***** Function to reset graph **
********************************/
function resetGraph() {
    // Clear nodes and links
    nodes = [];
    links = [];
    
    // Update force layout
    force
        .nodes(nodes)
        .links(links);
}

/********************************
***** Function to build graph ***
********************************/
function buildGraph(teachers, classes, connections, matchingResults) {
    // Reset graph
    resetGraph();
    
    // Add teacher nodes
    teachers.forEach(teacher => {
        nodes.push({
            id: teacher.id,
            name: teacher.name,
            type: 'teacher',
            matched: matchingResults ? (matchingResults.teachers.find(t => t.node.id === teacher.id)?.mate !== null) : false
        });
    });
    
    // Add class nodes
    classes.forEach(classObj => {
        nodes.push({
            id: classObj.id,
            name: classObj.name,
            type: 'class',
            absentTeacher: classObj.absentTeacher,
            matched: matchingResults ? (matchingResults.classes.find(c => c.node.id === classObj.id)?.mate !== null) : false
        });
    });
    
    // Add links
    connections.forEach(conn => {
        // Find source and target nodes
        var source = nodes.find(n => n.id === conn.teacherId);
        var target = nodes.find(n => n.id === conn.classId);
        
        if (source && target) {
            // Check if this link is part of the matching
            var isMatched = false;
            if (matchingResults) {
                var teacherVertex = matchingResults.teachers.find(t => t.node.id === conn.teacherId);
                var classVertex = matchingResults.classes.find(c => c.node.id === conn.classId);
                isMatched = teacherVertex && classVertex && teacherVertex.mate?.node.id === conn.classId;
            }
            
            links.push({
                source: source,
                target: target,
                matched: isMatched
            });
        }
    });
    
    // Update force layout
    force
        .nodes(nodes)
        .links(links)
        .start();
    
    // Update graph
    updateGraph();
    
    // Position nodes
    positionNodes();
}

/********************************
***** Function to update graph **
********************************/
function updateGraph() {
    // Update links
    edges = edges.data(links);
    
    edges.enter()
        .append("line")
        .attr("class", d => "edge" + (d.matched ? " matched" : ""));
    
    edges.exit().remove();
    
    // Update nodes
    vertices = vertices.data(nodes);
    
    var vertex = vertices.enter()
        .append("g")
        .attr("class", d => "vertex " + d.type + (d.matched ? " matched" : ""));
    
    // Add circles for each vertex
    vertex.append("circle")
        .attr("r", 15)
        .attr("class", d => d.type);
    
    // Add text labels for each vertex
    vertex.append("text")
        .attr("dy", "0.35em")
        .text(d => d.name.split(' ')[0]);  // Show only first name for brevity
    
    vertices.exit().remove();
    
    // Update force layout with reduced strength to maintain positions better
    force
        .linkStrength(0.1)
        .charge(-100)
        .start();
}

/********************************
***** Function for force ticks **
********************************/
function tick() {
    // Update positions of vertices and edges
    vertices.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
    
    edges
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
} 