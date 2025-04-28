/*   Note: The work of Avinash Pandey on D3 Graph Theory   *
 *  (https://mrpandey.github.io/d3graphTheory/index.html)  *
 *   has been used as a basis for part of the code below   */


/**************************
***** Nodes and links *****
**************************/
var nodes = [];
var links = [];
var lastNode = 0;


/*********************
***** Graph size *****
*********************/

// Fit graph size within graph panel
$("#graph-panel").height(($(window).height() - $("#title").height() - $("#control-panel").height()) - 100);
var graphWidth = $("#graph-panel").width();
var graphHeight = $("#graph-panel").height() - $("h7").height() - 30;

// Store previous width and height (required for resizing)
var prevWidth = graphWidth;
var prevHeight = graphHeight;
var updateCoordinates = true;


/***********************
***** Graph design *****
***********************/

// Set svg graph size
var svg = d3.select("#graph")
  .attr("width", graphWidth)
  .attr("height", graphHeight);

// Display text to indicate drawing area
svg.append("text")
  .attr("id", "draw-text")
  .attr("x", "50%")
  .attr("y", "50%")
  .attr("dominant-baseline", "middle")
  .attr("text-anchor", "middle")
  .attr("fill", "grey")
  .attr("unselectable", "on")
  .text("🖰 Click to add vertex");

// Hidden line used when connecting one vertex to another
var dragLine = svg.append("path")
  .attr("class", "drag-line hidden")
  .attr("d", "M0,0L0,0");

// Group of edges in graph
var edges = svg.append("g")
  .selectAll(".edge");

// Group of vertices in graph
var vertices = svg.append("g")
  .selectAll(".vertex");

// Annotation to indicate if graph is non-bipartite
svg.append("text")
  .attr("id", "non-bipartite-flag")
  .attr("x", "50%")
  .attr("y", "95%")
  .attr("dominant-baseline", "middle")
  .attr("text-anchor", "middle")
  .attr("fill", "grey")
  .attr("font-size", "12")
  .attr("display", "none")
  .attr("unselectable", "on")
  .text("Not bipartite");

var visitedAnnotations = svg.append("g")
  .attr("class", "annotations")
  .selectAll(".annotation");

var startPredAnnotations = svg.append("g")
  .attr("class", "annotations")
  .selectAll(".annotation");

// Use force layout of D3 library (link strength, charge, gravity and friction set to zero to prevent vertices from moving)
var force = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .size([graphWidth, graphHeight])
  .linkStrength(null)
  .charge(null)
  .gravity(null)
  .friction(null)
  .on("tick", tick)
  .start();

// Colours
var standardColours = d3.scale.category10();          // Used to colour vertices of non-bipartite graph
var customColours = ["#3498DB", "#E74C3C", "gray"];   // Used to colour vertices of bipartite graph (left - red, right - blue, gray - unassigned)


/****************************
***** Graph interaction *****
****************************/

// Boolean to indicate if graph is editable
var editable = true;

// Currently selected algorithm (1: one-to-one bipartite graph matching, 2: many-to-many bipartite graph matching, 3: general graph matching)
var selectedAlgorithm = 1;

// Mouse click down/release nodes
var mousedownNode = null
var mouseupNode = null;

// Node for which capacity is being set
var capacityNode = null;

// To ensure only one response per ctrl keydown (for moving vertices)
var lastKeyDown = -1;

// Position nodes button
$("#position-nodes").click(positionNodes);

// Clear graph button
$("#clear-graph").click(clearGraph);

// Decrement capacity (for many-to-many bipartite graph matching)
$("#capacity-minus").click(function () {
  if (Number($("#capacity-number").html()) > 1)
    $("#capacity-number").html(Number($("#capacity-number").html()) - 1);
});

// Increment capacity (for many-to-many bipartite graph matching)
$("#capacity-plus").click(function () {
  $("#capacity-number").html(Number($("#capacity-number").html()) + 1);
});

// Set capacity of node (for many-to-many bipartite graph matching)
$("#capacity-btn").click(function () {
  capacityNode.capacity = Number($("#capacity-number").html());
  restart();
});

// Assign different functions to mouse inputs
svg.on("mousedown", addNode)
  .on("mousemove", updateDragLine)
  .on("mouseup", hideDragLine)
  .on("contextmenu", function () { d3.event.preventDefault(); })
  .on("mouseleave", hideDragLine);

// Configure keyboard key presses (required for dragging nodes by pressing Ctrl)
d3.select(window)
  .on("keydown", keydown)
  .on("keyup", keyup);

// Refresh graph
restart();
checkBipartite();


/***********************************
***** Function to resize graph *****
***********************************/
function resizeGraph() {

  // Reposition vertices based on the ratio of new graph size to old one
  nodes.forEach(function (n) {
    n.x = graphWidth / prevWidth * n.x;
    n.px = n.x;
    n.y = graphHeight / prevHeight * n.y;
    n.py = n.y;
  });

  // Current dimensions become previous dimensions of next resize event
  prevWidth = graphWidth;
  prevHeight = graphHeight;

  force.start();

}


/**********************************
***** Function to clear graph *****
**********************************/
function clearGraph() {
  nodes.splice(0);
  links.splice(0);
  lastNode = 0;
  restart();
  $("#non-bipartite-flag").hide();
  if (selectedAlgorithm == 1 || selectedAlgorithm == 2)
    checkBipartite();
}


/***********************************
***** Function to reset parity *****
***********************************/
function setParity() {
  nodes.forEach(function (n) {
    n.parity = 0;
    n.visited = false;
  });
}


/******************************************************
***** Function to set colour of vertices in graph *****
******************************************************/
function setColour() {
  vertices.selectAll("circle")
    .style("fill", function (v) {

      // If not connected to any other vertex, set colour to grey
      if (!v.degree)
        return customColours[2];

      // If general graph, set colour to red
      if (selectedAlgorithm == 3)
        return customColours[1];

      // If left-hand vertex, set colour to red and if right-hand vertex, set colour to blue
      if (v.parity)
        return customColours[v.parity % 2];

      // If non-bipartite graph, use one of the standard colours
      else
        return standardColours(v.id);

    });
}


/*****************************************************
***** Function to reposition capacity annotation *****
*****************************************************/
function positionCapacity() {
  vertices.selectAll(".capacity-text")
    .attr("x", function (n) {
      if (n.parity == 1)
        return -18;
      else
        return 18;
    });
}


/**********************************************
***** Function to position nodes in graph *****
**********************************************/
function positionNodes() {
  var numA = 0;         // Number of left-hand nodes
  var numB = 0;         // Number of right-hand nodes
  var countA = 1;       // Position of left-hand node of concern among all left-hand nodes
  var countB = 1;       // Position of right-hand node of concern among all right-hand nodes
  var unassigned = [];  // Array of nodes that are linked to any other node

  // If degree of node is 0, push to 'unassigned' array
  nodes.forEach(function (n) {
    if (n.degree == 0)
      unassigned.push(n);
  });

  // Remove unassigned nodes
  unassigned.forEach(function (n) {
    nodes.splice(nodes.indexOf(n), 1);
  });

  restart();

  lastNode = nodes.length;

  // For general graph matching, adjust position of nodes such that they all fit within graph area
  if (selectedAlgorithm == 3) {
    nodes.forEach(function (n) {
      n.rx = Math.max(n.rx, 14 / graphWidth * 100);
      n.rx = Math.min(n.rx, 100 - 14 / graphWidth * 100);
      n.ry = Math.max(n.ry, 14 / graphHeight * 100);
      n.ry = Math.min(n.ry, 100 - 14 / graphHeight * 100);
      n.dx = n.rx / 100 * graphWidth - n.x;
      n.dy = n.ry / 100 * graphHeight - n.y;
    });

    // Animate position change
    var frame = 1;
    animate();
  }

  // Only reposition nodes if graph is bipartite for bipartite graph matching
  else if ((selectedAlgorithm == 1 || selectedAlgorithm == 2) && checkBipartite()) {

    // Count number of left-hand and right-hand nodes
    nodes.forEach(function (n) {
      if (n.parity % 2 == 1) {
        numA++;
      }
      else {
        numB++;
      }
    });

    nodes.forEach(function (n) {

      // Place left-hand nodes on the left and right-hand nodes on the right of graph (equally spaced)
      if (n.parity % 2 == 1) {
        n.dx = 0.35 * graphWidth - n.x;
        n.dy = countA * 0.95 * graphHeight / (numA + 1) + 0.05 * graphHeight - n.y;
        countA++;
      }
      else {
        n.dx = 0.65 * graphWidth - n.x;
        n.dy = countB * 0.95 * graphHeight / (numB + 1) + 0.05 * graphHeight - n.y;
        countB++
      }

    });

    // Animate position change
    var frame = 1;
    animate();

  }

  // Function to animate repositioning of nodes
  function animate() {
    if (frame < 25) {
      requestAnimationFrame(animate);
    }

    nodes.forEach(function (n) {
      n.x = n.x + n.dx / 25;
      n.px = n.x;
      n.y = n.y + n.dy / 25;
      n.py = n.y;
    });

    frame++;
  }

  // Update node IDs
  nodes.forEach(function (n) {
    n.id = nodes.indexOf(n) + 1;
  });

  // For bipartite graph matching, check if graph is bipartite
  if (selectedAlgorithm == 1 || selectedAlgorithm == 2)
    checkBipartite();

  restart();
}


/***********************************
***** Function to update graph *****
***********************************/
function tick() {

  // Continuously adjust coordinates of graph elements
  edges.attr("x1", function (e) { return e.source.x; })
    .attr("y1", function (e) { return e.source.y; })
    .attr("x2", function (e) { return e.target.x; })
    .attr("y2", function (e) { return e.target.y; });

  vertices.attr("transform", function (v) {
    return "translate(" + v.x + "," + v.y + ")";
  });

  // If graph is empty, display text to indicate drawing area
  if (nodes.length == 0) {
    $("#draw-text").show();
  }
  else {
    $("#draw-text").hide();
  }
}


/*******************************
***** Function to add node *****
*******************************/
function addNode() {

  // Add node with coordinates where clicked, provided that editing is enabled
  if (d3.event.button == 0 && editable) {

    // Get coordinates of mouse click
    var coordinates = d3.mouse(this);

    // Create new node
    if (selectedAlgorithm == 1)
      var newNode = { x: coordinates[0], y: coordinates[1], id: ++lastNode, degree: 0 };
    else if (selectedAlgorithm == 2)
      var newNode = { x: coordinates[0], y: coordinates[1], id: ++lastNode, degree: 0, capacity: 1 };
    else if (selectedAlgorithm == 3)
      var newNode = { x: coordinates[0], y: coordinates[1], id: ++lastNode, degree: 0, rx: coordinates[0] / graphWidth * 100, ry: coordinates[1] / graphHeight * 100 };

    // For many-to-many bipartite graph matching, get capacity from capacity modal
    setCapacity(newNode);

    // Add node to nodes array
    nodes.push(newNode);

    restart();

  }

}


/**********************************
***** Function to remove node *****
**********************************/
function removeNode(n) {
  if (editable) {

    // To make ctrl-drag works for mac/osx users
    if (d3.event.ctrlKey) return;

    // Remove links connected to node
    var linksToRemove = links.filter(function (l) {
      return l.source === n || l.target === n;
    });

    linksToRemove.map(function (l) {
      l.source.degree--;
      l.target.degree--;
      links.splice(links.indexOf(l), 1);
    });

    // Remove node
    nodes.splice(nodes.indexOf(n), 1);
    d3.event.preventDefault();

    if (n.id == lastNode)
      lastNode = lastNode - 1;

    restart();

    if (selectedAlgorithm == 1 || selectedAlgorithm == 2)
      checkBipartite();

  }
}


/**********************************
***** Function to remove edge *****
**********************************/
function removeEdge(e) {
  if (editable) {
    e.source.degree--;
    e.target.degree--;
    links.splice(links.indexOf(e), 1);
    d3.event.preventDefault();
    restart();
    if (selectedAlgorithm == 1 || selectedAlgorithm == 2)
      checkBipartite();
  }
}


/**************************************
***** Function to begin drag line *****
**************************************/
function beginDragLine(n) {
  if (editable) {

    // To prevent dragging of svg
    d3.event.preventDefault();

    if (d3.event.ctrlKey || d3.event.button != 0) return;

    mousedownNode = n;
    dragLine.classed("hidden", false)
      .attr("d", "M" + mousedownNode.x + "," + mousedownNode.y +
        "L" + mousedownNode.x + "," + mousedownNode.y);

  }
}


/***************************************
***** Function to update drag line *****
***************************************/
function updateDragLine() {
  if (editable) {
    if (!mousedownNode) return;

    dragLine.attr("d", "M" + mousedownNode.x + "," + mousedownNode.y +
      "L" + d3.mouse(this)[0] + "," + d3.mouse(this)[1]);
  }
}


/*************************************
***** Function to hide drag line *****
*************************************/
function hideDragLine() {
  if (editable) {
    dragLine.classed("hidden", true);

    // Reset mouse down and up nodes
    mousedownNode = null;
    mouseupNode = null;
    restart();
  }
}


/************************************
***** Function to end drag line *****
************************************/
function endDragLine(n) {
  if (editable) {
    if (!mousedownNode || mousedownNode === n) return;

    // Return if link already exists
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      if ((l.source === mousedownNode && l.target === n) || (l.source === n && l.target === mousedownNode)) {
        return;
      }
    }

    mousedownNode.degree++;
    n.degree++;

    var newLink = { source: mousedownNode, target: n };
    links.push(newLink);

    if (selectedAlgorithm == 1 || selectedAlgorithm == 2)
      checkBipartite();
  }
}


/**********************************
***** Function to drag vertex *****
**********************************/
function keydown() {
  if (lastKeyDown !== -1) return;
  lastKeyDown = d3.event.key;

  // If control key is pressed
  if (lastKeyDown === "Control" && editable) {

    // Drag vertex
    vertices.call(force.drag);

  }
}


/*******************************************
***** Function to stop dragging vertex *****
*******************************************/
function keyup() {
  lastKeyDown = -1;

  // If control key is released
  if (d3.event.key === "Control" && editable) {

    // Stop dragging vertex
    vertices.on("mousedown.drag", null);

  }
}


/*******************************************************************************
***** Function to set capacity (for many-to-many bipartite graph matching) *****
*******************************************************************************/
function setCapacity(n) {

  // If control key is pressed, return and allow vertex to be moved instead
  if (d3.event.ctrlKey || d3.event.button != 0) return;

  else if (d3.event.button == 0 && editable && selectedAlgorithm == 2) {

    // Indicate that this node is to be modified by capacity modal
    capacityNode = n;
    $("#capacity-number").html(n.capacity);

    // Pop up modal at location of vertex on graph
    var modalX = $("#graph").offset().left + n.x;
    var modalY = $("#graph").offset().top + n.y;
    $("#capacity-modal").modal({ opacity: 0, startingTop: modalY, endingTop: modalY });
    M.Modal.getInstance($("#capacity-modal")).open();
    $("#capacity-modal")[0].style.left = modalX + "px";

  }

}


/*******************************************************************
***** Function to update graph representation based on changes *****
*******************************************************************/
function restart() {

  // Set left-hand node as source and right-hand node as target for each link
  if (selectedAlgorithm == 1 || selectedAlgorithm == 2) {
    links.forEach(function (l) {
      if (l.source.parity == 2) {
        var temp = l.source;
        l.source = l.target;
        l.target = temp;
      }
    });
  }

  // For general graph matching
  else if (selectedAlgorithm == 3) {

    // Update relative x and y coordinates of vertices
    if (updateCoordinates) {
      nodes.forEach(function (n) {
        n.rx = n.x / graphWidth * 100;
        n.ry = n.y / graphHeight * 100;
      });
    }

    // Set node with lower ID as source and other node as target for each link
    links.forEach(function (l) {
      if (l.source.id > l.target.id) {
        var temp = l.source;
        l.source = l.target;
        l.target = temp;
      }
    });

  }

  // Edges in DOM
  edges = edges.data(links, function (e) { return "v" + e.source.id + "-v" + e.target.id; });

  edges.enter()
    .append("line")
    .attr("class", "edge")
    .style("stroke", "#ccc")
    .style("stroke-width", "3")
    .on("mousedown", function () { d3.event.stopPropagation(); })
    .on("contextmenu", removeEdge)
    .append("title")
    .text(function (e) { return "v" + e.source.id + "-v" + e.target.id; });

  edges.exit().remove();

  edges.selectAll("title").text(function (e) { return "v" + e.source.id + "-v" + e.target.id; });

  // Vertices in DOM
  vertices = vertices.data(nodes, function (v) { return v.id; });

  vertices.selectAll(".id-text")
    .text(function (v) { return v.id; });

  if (selectedAlgorithm == 2) {
    vertices.selectAll(".capacity-text")
      .text(function (v) { return v.capacity; });
  }

  var g = vertices.enter()
    .append("g")
    .attr("class", "vertex")
    // So that force.drag and addNode do not interfere
    // Mousedown is initiated on circle which is stopped at .vertex
    .on("mousedown", function () { d3.event.stopPropagation(); });

  g.append("circle")
    .attr("r", 14)
    .style("fill", function (n) {
      if (!n.degree)
        return customColours[2];
      else
        return standardColours(n.id);
    })
    .on("click", setCapacity)
    .on("mousedown", beginDragLine)
    .on("mouseup", endDragLine)
    .on("contextmenu", removeNode)
    .append("title")
    .text(function (n) {
      return "v" + n.id;
    });

  g.append("text")
    .attr("class", "id-text")
    .attr("x", 0)
    .attr("y", 4)
    .text(function (n) {
      return n.id;
    });

  if (selectedAlgorithm == 2) {
    g.append("text")
      .attr("class", "capacity-text")
      .attr("x", 18)
      .attr("y", 18)
      .style("fill", "grey")
      .text(function (n) {
        return n.capacity;
      });
  }

  vertices.exit().remove();

  vertices.selectAll("title").text(function (n) { return "v" + n.id; });

  force.start();

  setColour();

  // Only allow user to run algorithm is graph is non-empty and bipartite for bipartite graph matching
  if (links.length > 0 && (selectedAlgorithm == 3 || checkBipartite())) {
    $("#run-algorithm").removeClass("disabled");
  } else {
    $("#run-algorithm").addClass("disabled");
  }

}


/**************************************************
***** Function to check if graph is bipartite *****
**************************************************/
function checkBipartite() {
  if (nodes.length == 0) {
    return;
  }

  // Reset parity of each node
  setParity();

  // Construct adjacency list of graph
  var adjList = {};

  nodes.forEach(function (n) {
    adjList[n.id] = [];
  });

  links.forEach(function (l) {
    adjList[l.source.id].push(l.target);
    adjList[l.target.id].push(l.source);
  });

  // Perform DFS on nodes
  var q = [];

  q.push(nodes[0]);

  while (q.length > 0) {
    var v1 = q.shift();
    var adj = adjList[v1.id];

    if (adj.length > 0 && v1.parity == 0)
      v1.parity = 1;

    for (var i = 0; i < adj.length; i++) {
      var v2 = adj[i];
      if (v2.visited)
        continue;
      if (v2.parity === v1.parity) {
        setParity();
        setColour();
        $("#non-bipartite-flag").show();
        return false;
      }
      else
        v2.parity = 3 - v1.parity;
      q.push(v2);
    }

    v1.visited = true;

    // Check for disconnected nodes
    if (q.length == 0) {
      for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].visited) {
          q.push(nodes[i]);
          break;
        }
      }
    }
  }

  setColour();

  if (selectedAlgorithm == 2)
    positionCapacity();

  $("#non-bipartite-flag").hide();
  return true;
}


/***********************************
***** Function to import graph *****
***********************************/
function importGraph() {

  // Clear current graph
  clearGraph();

  var file = $("#import-data")[0].files[0];

  // Use FileReader to read contents of file (https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
  var reader = new FileReader();

  reader.onload = (function () {
    return function (e) {

      // If uploaded file is a .txt file
      if (file.type == "text/plain") {

        // Parse data from file to get nodes and links
        var graphData = e.target.result.trim().split(/\s+/);  // Remove spaces around and split data into lines

        // Get nodes from data
        var graphNodes = [];

        for (var l of graphData) {

          // If line starts with "{", data represents link
          if (l[0] == "{") {
            var left = "";
            var right = "";
            var i = 1;

            // Get left node ID
            while (l[i] != ",") {
              if (i > l.length - 4 || isNaN(l[i])) {
                $("#file-error").show();
                return;
              }
              left += l[i++];
            }
            i++;

            // Get right node ID
            while (l[i] != "}") {
              if (i == l.length - 1 || isNaN(l[i])) {
                $("#file-error").show();
                return;
              }
              right += l[i++];
            }

            graphNodes.push(left);
            graphNodes.push(right);
          }

          else if (isNaN(l[0])) {
            $("#file-error").show();
            return;
          }

        }

        // Ensure no duplicates in IDs
        nodeIDs = graphNodes.filter(function (n, index) {
          return graphNodes.indexOf(n) == index;
        }).map(function (n) {
          return Number(n);
        });

        nodeIDs.sort((a, b) => a - b);

        nodeIDs.forEach(function (n) {
          if (selectedAlgorithm == 1)
            nodes.push({ id: Number(n), degree: 0 });
          else if (selectedAlgorithm == 2)
            nodes.push({ id: Number(n), degree: 0, capacity: 1 });
          else if (selectedAlgorithm == 3)
            nodes.push({ id: Number(n), degree: 0 });
        });

        // Set capacities or coordinates
        for (var l of graphData) {

          // If line does not start with "{", data represents capacity
          if (!isNaN(l[0])) {
            var id = "";
            var capacity = "";
            var x = "";
            var y = "";
            var i = 0;

            // Get node ID
            while (l[i] != ":") {
              if (i > l.length - 3 || isNaN(l[i])) {
                $("#file-error").show();
                clearGraph();
                return;
              }
              id += l[i++];
            }
            i++;

            // Get corresponding capacity for bipartite graph matching
            if (selectedAlgorithm == 1 || selectedAlgorithm == 2) {
              while (i != l.length) {
                if (isNaN(l[i])) {
                  $("#file-error").show();
                  clearGraph();
                  return;
                }
                capacity += l[i++];
              }
            }

            // Get corresponding coordinates for general graph matching
            else if (selectedAlgorithm == 3) {

              // If line continues with "(", data represents coordinates
              if (l[i] == "(") {
                i++;

                // Get x coordinate
                while (l[i] != ",") {
                  if (i > l.length - 4) {
                    $("#file-error").show();
                    clearGraph();
                    return;
                  }
                  x += l[i++];
                }
                i++;

                // Get y coordinate
                while (l[i] != ")") {
                  if (i == l.length - 1) {
                    $("#file-error").show();
                    clearGraph();
                    return;
                  }
                  y += l[i++];
                }
              }

              // Check for validity of data
              if (isNaN(x) || isNaN(y) || Number(x) < 0 || Number(y) < 0 || Number(x) > 100 || Number(y) > 100) {
                $("#file-error").show();
                clearGraph();
                return;
              }
            }

            if (selectedAlgorithm == 2 || selectedAlgorithm == 3) {
              var node = nodes.filter(function (n) {
                return n.id == Number(id);
              })[0];

              // Set capacity or coordinates
              if (selectedAlgorithm == 2 && typeof node != "undefined")
                node.capacity = Number(capacity);
              else if (selectedAlgorithm == 3 && typeof node != "undefined") {
                node.rx = Number(x);
                node.ry = Number(y);
              }
            }

          }

        }

        // Create edges based on data provided in file
        for (var i = 0; i < graphNodes.length; i += 2) {
          var source = nodes.filter(function (n) {
            return n.id == graphNodes[i];
          })[0];

          source.degree++;

          var target = nodes.filter(function (n) {
            return n.id == graphNodes[i + 1];
          })[0];

          target.degree++;

          // Only add edge if it does not already exist
          if (!links.some(function (l) { return l.source == source && l.target == target; }))
            links.push({ source: source, target: target });
        }

      }

      // If uploaded file is a .json file
      else if (file.type == "application/json") {

        // Parse data from file to get nodes and links
        try {
          var jsonData = JSON.parse(e.target.result);
        }
        catch (e) {
          $("#file-error").show();
          return;
        }

        // Check for validity of data
        if (Object.keys(jsonData).length == 0 || Object.keys(jsonData).length > 2 || Object.keys(jsonData).length == 1 && typeof jsonData.links == "undefined" || Object.keys(jsonData).length == 2 && (typeof jsonData.links == "undefined" || typeof jsonData.nodes == "undefined")) {
          $("#file-error").show();
          return;
        }

        var graphData = [];

        for (var l of jsonData.links) {
          if (Object.keys(l).length != 2 || typeof l.source == "undefined" || typeof l.target == "undefined" || !Number.isInteger(l.source) || !Number.isInteger(l.target) || l.source < 0 || l.target < 0) {
            $("#file-error").show();
            return;
          }
          graphData.push(l.source);
          graphData.push(l.target);
        }

        // Get nodes from data
        nodeIDs = graphData.filter(function (n, index) {
          return graphData.indexOf(n) == index;
        }).map(function (n) {
          return Number(n);
        });

        nodeIDs.sort((a, b) => a - b);

        nodeIDs.forEach(function (n) {
          if (selectedAlgorithm == 1)
            nodes.push({ id: Number(n), degree: 0 });
          else if (selectedAlgorithm == 2)
            nodes.push({ id: Number(n), degree: 0, capacity: 1 });
          else if (selectedAlgorithm == 3)
            nodes.push({ id: Number(n), degree: 0 });
        });

        // Set capacities or coordinates
        if (typeof jsonData.nodes != "undefined") {
          for (var n of jsonData.nodes) {
            if (typeof n.id == "undefined" || !Number.isInteger(n.id) || n.id < 0 || (selectedAlgorithm == 1 || selectedAlgorithm == 2) && (Object.keys(n).length != 2 || typeof n.capacity == "undefined" || !Number.isInteger(n.capacity) || n.capacity < 1) || selectedAlgorithm == 3 && (Object.keys(n).length != 3 || typeof n.x == "undefined" || typeof n.y == "undefined" || isNaN(n.x) || isNaN(n.y) || n.x < 0 || n.y < 0 || n.x > 100 || n.y > 100)) {
              $("#file-error").show();
              clearGraph();
              return;
            }

            if (selectedAlgorithm == 2 || selectedAlgorithm == 3) {
              var node = nodes.filter(function (x) {
                return n.id == x.id;
              })[0];

              if (selectedAlgorithm == 2 && typeof node != "undefined")
                node.capacity = n.capacity;
              else if (selectedAlgorithm == 3 && typeof node != "undefined") {
                node.rx = n.x;
                node.ry = n.y;
              }
            }
          }
        }

        // Create edges based on data provided in file
        jsonData.links.forEach(function (l) {
          var source = nodes.filter(function (n) {
            return l.source == n.id;
          })[0];

          source.degree++;

          var target = nodes.filter(function (n) {
            return l.target == n.id;
          })[0];

          target.degree++;

          // Only add edge if it does not already exist
          if (!links.some(function (x) { return x.source == source && x.target == target; }))
            links.push({ source: source, target: target });
        });

      }

      // Initially place all nodes at center of graph
      nodes.forEach(function (n) {
        n.x = 0.5 * graphWidth;
        n.px = n.x;
        n.y = 0.525 * graphHeight;
        n.py = n.y;
      });

      // Update graph
      updateCoordinates = false;
      restart();

      var unassigned = [];  // Array of nodes that are not linked to any other node

      // If degree of node is 0, push to 'unassigned' array
      nodes.forEach(function (n) {
        if (n.degree == 0)
          unassigned.push(n);
      });

      // Remove unassigned nodes
      unassigned.forEach(function (n) {
        nodes.splice(nodes.indexOf(n), 1);
      });

      if (selectedAlgorithm == 1 || selectedAlgorithm == 2)
        checkBipartite();

      else if (selectedAlgorithm == 3) {

        // Place nodes with unassigned coordinates in a circular layout for general graph matching
        nodes.forEach(function (n, i) {
          if (typeof n.rx == "undefined" || typeof n.ry == "undefined") {
            n.rx = 50 + 40 * Math.sin(2 * i * Math.PI / nodes.length);
            n.ry = 50 + 40 * Math.cos(2 * i * Math.PI / nodes.length + Math.PI);
          }
        });

      }

      positionNodes();
      updateCoordinates = true;

      // Reset import modal
      M.Modal.getInstance($("#import-modal")).close();
      $("#file-error").hide();
      $("#import-text").val("");
      $("#import-text").removeClass("valid");
      $("#import-data").val("");
      $("#import-btn").addClass("disabled");
    }
  })(file);

  reader.readAsText(file);
  
}


/******************************************************
***** Function to generate random bipartite graph *****
******************************************************/
function randomBipartiteGraph(leftMin, leftMax, rightMin, rightMax, capacityMin, capacityMax, probability) {
  clearGraph();

  // Initialise nodes
  var leftNodes = [];
  var rightNodes = [];

  // Get random numbers of nodes for each side based on settings
  var leftLength = Math.round(Math.random() * (leftMax - leftMin)) + leftMin;
  var rightLength = Math.round(Math.random() * (rightMax - rightMin)) + rightMin;

  // Create nodes
  for (var i = 1; i <= leftLength; i++) {
    if (selectedAlgorithm == 1)
      var node = { id: i, degree: 0 };
    else if (selectedAlgorithm == 2)
      var node = { id: i, degree: 0, capacity: Math.round(Math.random() * (capacityMax - capacityMin)) + capacityMin };
    leftNodes.push(node);
    nodes.push(node);
  }
  for (var i = 1; i <= rightLength; i++) {
    if (selectedAlgorithm == 1)
      var node = { id: leftLength + i, degree: 0 };
    else if (selectedAlgorithm == 2)
      var node = { id: leftLength + i, degree: 0, capacity: Math.round(Math.random() * (capacityMax - capacityMin)) + capacityMin };
    rightNodes.push(node);
    nodes.push(node);
  }

  // Create random links based on edge probability setting
  leftNodes.forEach(function (l) {
    rightNodes.forEach(function (r) {
      if (Math.random() <= probability) {
        links.push({ source: l, target: r });
        l.degree++;
        r.degree++;
      }
    })
  });

  // Place nodes at center of graph
  nodes.forEach(function (n) {
    n.x = 0.5 * graphWidth;
    n.px = n.x;
    n.y = 0.525 * graphHeight;
    n.py = n.y;
  });

  // Generate random graph
  restart();
  checkBipartite();
  positionNodes();
  
  // Ensure edges are visible after positioning
  setTimeout(function() {
    edges.style("stroke", "#ccc");
    edges.style("stroke-width", "3");
  }, 100);
}


/****************************************************
***** Function to generate random general graph *****
****************************************************/
function randomGeneralGraph(verticesMin, verticesMax, probability) {
  clearGraph();

  // Get random number of nodes based on settings
  var randomLength = Math.round(Math.random() * (verticesMax - verticesMin)) + verticesMin;

  // Create nodes
  for (var i = 1; i <= randomLength; i++) {
    var node = { id: i, degree: 0, rx: 50, ry: 50 };
    nodes.push(node);
  }

  // Create random links based on edge propability setting
  nodes.forEach(function (source) {
    nodes.forEach(function (target) {

      // Check if link already exists
      var existingLink = links.filter(function (l) {
        return l.source == target && l.target == source;
      });

      // Add link if it does not already exist
      if (source != target && existingLink.length == 0 && Math.random() <= probability) {
        links.push({ source: source, target: target });
        source.degree++;
        target.degree++;
      }

    })
  });

  // Place nodes at center of graph
  nodes.forEach(function (n, i) {
    n.x = 0.5 * graphWidth;
    n.px = n.x;
    n.y = 0.5 * graphHeight;
    n.py = n.y;
  });

  // Generate random graph
  updateCoordinates = false;
  restart();

  var unassigned = [];  // Array of nodes that are not linked to any other node

  // If degree of node is 0, push to 'unassigned' array
  nodes.forEach(function (n) {
    if (n.degree == 0)
      unassigned.push(n);
  });

  // Remove unassigned nodes
  unassigned.forEach(function (n) {
    nodes.splice(nodes.indexOf(n), 1);
  });

  // Place nodes in a circular layout
  nodes.forEach(function (n, i) {
    n.rx = 50 + 40 * Math.sin(2 * i * Math.PI / nodes.length);
    n.ry = 50 + 40 * Math.cos(2 * i * Math.PI / nodes.length + Math.PI);
  });

  positionNodes();
  updateCoordinates = true;
  
  // Ensure edges are visible after positioning
  setTimeout(function() {
    edges.style("stroke", "#ccc");
    edges.style("stroke-width", "3");
  }, 100);
}