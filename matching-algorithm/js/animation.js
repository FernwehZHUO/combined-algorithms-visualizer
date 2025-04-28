/*  The code below deals with the  *
 *  animation of the algorithm     */


/********************
***** Variables *****
********************/
var currentFrame;       // Current frame of animation
var nodeCoordinates;    // Store node coordinates (required so that blossom can be expanded back to original position)


/************************************************************
***** Function to update highlighted line in pseudocode *****
************************************************************/
function updatePseudocode(pseudocodeLongLine, pseudocodeShortLine) {
    var pseudocodeLongLines = $("#pseudocode-long")[0].firstElementChild.children;
    var pseudocodeShortLines = $("#pseudocode-short")[0].firstElementChild.children;

    // Update for long version of pseudocode
    for (var i = 0; i < pseudocodeLongLines.length; i++) {

        // If not pseudocode line of concern, reset to default colour
        if (pseudocodeLongLine != i + 1)
            pseudocodeLongLines[i].style.backgroundColor = "#222";

        // If within the same block statement/loop as pseudocode line, shade in lighter colour
        if (selectedAlgorithm == 1) {
            if (pseudocodeLongLine >= 4 && pseudocodeLongLine <= 9 && i >= 3 && i <= 35)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine >= 10 && pseudocodeLongLine <= 12 && i >= 9 && i <= 33)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine == 13 && i >= 12 && i <= 32)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine >= 14 && pseudocodeLongLine <= 16 && i >= 13 && i <= 31)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine == 17 && i >= 16 && i <= 30)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if ((pseudocodeLongLine == 18 || pseudocodeLongLine >= 26 && pseudocodeLongLine <= 28) && (i >= 16 && i <= 27 || i == 30))
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine >= 19 && pseudocodeLongLine <= 25 && i >= 18 && i <= 24)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine >= 29 && pseudocodeLongLine <= 30 && i >= 28 && i <= 30)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
        }
        else if (selectedAlgorithm == 2) {
            if (pseudocodeLongLine >= 5 && pseudocodeLongLine <= 10 && i >= 4 && i <= 35)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine >= 11 && pseudocodeLongLine <= 13 && i >= 10 && i <= 34)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine == 14 && i + 1 >= 14 && i + 1 <= 34)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine >= 15 && pseudocodeLongLine <= 17 && i >= 14 && i <= 32)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine == 18 && i + 1 >= 18 && i <= 31)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if ((pseudocodeLongLine == 19 || pseudocodeLongLine >= 27 && pseudocodeLongLine <= 29) && (i >= 17 && i <= 28 || i == 31))
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine >= 20 && pseudocodeLongLine <= 26 && i >= 19 && i <= 25)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine >= 30 && pseudocodeLongLine <= 32 && i >= 29 && i <= 31)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
        }
        else if (selectedAlgorithm == 3) {
            if ((pseudocodeLongLine == 2 || pseudocodeLongLine == 3) && i >= 1 && i <= 8)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine == 4 && i >= 3 && i <= 7)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if (pseudocodeLongLine == 5 && (i == 3 || i == 7))
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
            else if ((pseudocodeLongLine == 6 || pseudocodeLongLine == 7) && i >= 5 && i <= 7)
                pseudocodeLongLines[i].style.backgroundColor = "#3A3A3A";
        }

        // If correct pseudocode line
        if (pseudocodeLongLine == i + 1) {

            // Highlight in teal colour
            pseudocodeLongLines[i].style.backgroundColor = "teal";

            // Scroll to keep highlighted line within display
            $("#pseudocode-long").scrollTop(pseudocodeLongLines[i].offsetTop - $(window).height() / 2);

        }


    }

    // Update for short version of pseudocode
    for (var i = 0; i < pseudocodeShortLines.length; i++) {
        if (pseudocodeShortLine != i + 1) {

            // If not pseudocode line of concern, reset to default colour
            pseudocodeShortLines[i].style.backgroundColor = "#222";

        }
        else {

            // If correct pseudocode line, highlight in teal colour
            pseudocodeShortLines[i].style.backgroundColor = "teal";

            // Scroll to keep highlighted line within display
            $("#pseudocode-short").scrollTop($("#pseudocode-short")[0].firstElementChild.children[i].offsetTop - $(window).height() / 2);

        }
    }
}


/*********************************************
***** Function to update execution trace *****
*********************************************/
function updateTrace(longTraceLine, shortTraceLine) {
    var executionTrace = "";

    // Append all execution trace lines up to current one
    if (pseudocodeVersion == 1) {
        for (var i = 0; i <= longTraceLine; i++)
            executionTrace += longTrace[i];
    }
    else {
        for (var i = 0; i <= shortTraceLine; i++)
            executionTrace += shortTrace[i];
    }

    // Update displayed execution trace and scroll to last line
    $("#execution-trace ol").html(executionTrace);
    $("#execution-trace").scrollTop($("#execution-trace")[0].scrollHeight);
}


/**********************************
***** Function to get blossom *****
**********************************/
function getBlossom(pseudocodeLongLine, path, blossom) {

    // Reset coordinates of nodes
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].rx = nodeCoordinates[i].x;
        nodes[i].ry = nodeCoordinates[i].y;
    }

    // Create blossom array
    var blossomArray = [];

    // Create sub-arrays to hold nodes of each blossom
    for (var i = 0; i < nodes.length; i++) {
        blossomArray[i] = [];
    }

    // Fill blossom array with nodes
    for (var i = 0; i < blossom.length; i++) {
        var node = nodeCoordinates.filter(function (n) {
            return n.id == i + 1;
        })[0];

        blossomArray[blossom[i]].push(node);
    }

    // Filter out blossoms that have less than two nodes
    blossomArray = blossomArray.filter(function (b) {
        return b.length > 1;
    });

    // Contract blossoms
    blossomArray.forEach(function (b) {
        b.contract = true;

        // If augmenting path involving blossom is found, disable contraction
        if (pseudocodeLongLine == 6 || pseudocodeLongLine == 7) {
            for (var v of b) {
                if (path.includes(v.id)) {
                    b.contract = false;
                    break;
                };
            }
        }

        // If contraction is enabled, update coordinates of nodes in blossom
        if (b.contract) {
            var blossomX = 0;
            var blossomY = 0;

            // Set coordinates of blossom supernode as centre of nodes in blossom
            b.forEach(function (v) {
                blossomX += v.x / b.length;
                blossomY += v.y / b.length;
            });

            b.forEach(function (v) {
                var node = nodes.filter(function (n) {
                    return n.id == v.id;
                })[0];

                node.rx = blossomX;
                node.ry = blossomY;
            });
        }
    });

    return blossomArray;

}


/*********************************************************************
***** Function to update displayed variables for bipartite graph *****
*********************************************************************/
function updateVariables1(queue, u, v, w, matching) {

    // Update queue, Q
    var q = "";

    for (var i = 0; i < queue.length; i++) {
        q += "Vertex " + queue[i].node.id;

        if (selectedAlgorithm == 2)
            q += " (Clone " + queue[i].clone + ")";

        if (i != queue.length - 1)
            q += ", ";
    }

    $("#q").html(q);

    // Update vertex u
    if (u == null)
        $("#u").html("null");
    else if (selectedAlgorithm == 1)
        $("#u").html("Vertex " + u.node.id);
    else if (selectedAlgorithm == 2)
        $("#u").html("Vertex " + u.node.id + " (Clone " + u.clone + ")");

    // Update vertex v
    if (v == null)
        $("#v").html("null");
    else if (selectedAlgorithm == 1)
        $("#v").html("Vertex " + v.node.id);
    else if (selectedAlgorithm == 2)
        $("#v").html("Vertex " + v.node.id + " (Clone " + v.clone + ")");

    // Update vertex w
    if (w == null)
        $("#w").html("null");
    else if (selectedAlgorithm == 1)
        $("#w").html("Vertex " + w.node.id);
    else if (selectedAlgorithm == 2)
        $("#w").html("Vertex " + w.node.id + " (Clone " + w.clone + ")");

    // Update matching size
    $("#bipartite-matching").html(matching);

}


/*******************************************************************
***** Function to update displayed variables for general graph *****
*******************************************************************/
function updateVariables2(graph, path, blossom) {

    // Initialise, p
    var p = "";

    // Initialise matching size
    var matching = 0;

    // Initialise blossom string
    var blossomString = "";

    // Update path, p
    for (var i = 0; i < path.length; i++) {
        p += "Vertex " + path[i];

        if (i != path.length - 1)
            p += ", ";
    }

    $("#p").html(p);

    // Update matching size
    for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++)
            if (graph[i][j])
                matching++;
    }

    $("#general-matching").html(matching);

    // Update blossoms
    blossom.forEach(function (b, blossomIndex) {
        if (b.contract) {
            blossomString += "<span>B" + String(blossomIndex + 1) + " = [ ";

            for (var i = 0; i < b.length; i++) {
                blossomString += "Vertex " + b[i].id;

                if (i != b.length - 1)
                    blossomString += ", ";
            }

            blossomString += " ]</span>";
        }
    });

    $("#blossom").html(blossomString);

}


/**********************************************************************
***** Function to update highlighted vertices for bipartite graph *****
**********************************************************************/
function updateVertices1(u, v, w) {
    for (var i = 0; i < vertices[0].length; i++) {

        // Reset all vertices as unhighlighted
        vertices[0][i].firstChild.style.stroke = "none";

        // Add yellow stroke around vertex v
        if (v != null && vertices[0][i].__data__ == v.node)
            vertices[0][i].firstChild.style.stroke = "yellow";

        // Add yellow stroke around vertex w
        if (w != null && vertices[0][i].__data__ == w.node)
            vertices[0][i].firstChild.style.stroke = "yellow";

        // Add cyan stroke around vertex u
        if (u != null && vertices[0][i].__data__ == u.node)
            vertices[0][i].firstChild.style.stroke = "cyan";

    }
}


/********************************************************************
***** Function to update highlighted vertices for general graph *****
********************************************************************/
function updateVertices2(pseudocodeLongLine, path, blossom) {

    // Position nodes (required for contraction/expansion of blossoms)
    if (pseudocodeLongLine != 1) {
        updateCoordinates = false;
        positionNodes();
        updateCoordinates = true;
    }

    for (var i = 0; i < vertices[0].length; i++) {

        // Reset all vertices
        vertices[0][i].firstChild.style.stroke = "none";
        vertices[0][i].firstChild.style.fill = "#E74C3C";
        vertices[0][i].children[0].firstChild.innerHTML = "v" + vertices[0][i].__data__.id;
        vertices[0][i].children[1].innerHTML = vertices[0][i].__data__.id;

        // Add yellow stroke around vertex if in path
        path.forEach(function (v) {
            if (vertices[0][i].__data__.id == v)
                vertices[0][i].firstChild.style.stroke = "yellow";
        });

        // For blossoms
        blossom.forEach(function (b, blossomIndex) {
            if (b.contract) {
                b.forEach(function (v) {

                    // Makes nodes in blossom blue in colour
                    if (vertices[0][i].__data__.id == v.id) {
                        vertices[0][i].firstChild.style.fill = "#3498DB";

                        // Update blossom text according to blossom index
                        vertices[0][i].children[1].innerHTML = "B" + String(blossomIndex + 1);

                        // Update hover text to show vertices in blossom
                        vertices[0][i].children[0].firstChild.innerHTML = "";
                        b.forEach(function (n, vertexIndex) {
                            vertices[0][i].children[0].firstChild.innerHTML += "v" + n.id;
                            if (vertexIndex != b.length - 1)
                                vertices[0][i].children[0].firstChild.innerHTML += ", ";
                        });
                    }

                });
            }
        });

    }

}


/*******************************************************************
***** Function to update highlighted edges for bipartite graph *****
*******************************************************************/
function updateEdges1(dashedEdges, solidEdges, connectedEdges) {
    for (var i = 0; i < edges[0].length; i++) {

        // Reset all edges to default style
        edges[0][i].style = "stroke-dasharray: 0; stroke: #ccc;";

        // Make connected edges thicker and light blue in colour
        connectedEdges.forEach(function (e) {
            if (edges[0][i].__data__.source == e.source.node && edges[0][i].__data__.target == e.target.node)
                edges[0][i].style = "stroke-dasharray: 0; stroke: #7affd2; stroke-width: 4px;";
        });

        // Make dashed edges dashed and light blue in colour
        dashedEdges.forEach(function (e) {
            if (edges[0][i].__data__.source == e.source.node && edges[0][i].__data__.target == e.target.node)
                edges[0][i].style = "stroke-dasharray: 5; stroke: #7affd2;";
        });

        // Make solid edges solid and yellow in colour
        solidEdges.forEach(function (e) {
            if (edges[0][i].__data__.source == e.source.node && edges[0][i].__data__.target == e.target.node)
                edges[0][i].style = "stroke-dasharray: 0; stroke: yellow;";
        });

    }
}


/*****************************************************************
***** Function to update highlighted edges for general graph *****
*****************************************************************/
function updateEdges2(pseudocodeLongLine, graph, path) {

    // Array of matched edges
    var matched = [];

    // Add matched edges from graph to array
    for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++)
            if (graph[i][j])
                matched.push([i + 1, j + 1]);
    }

    for (var i = 0; i < edges[0].length; i++) {

        // Reset all edges to default style
        edges[0][i].style = "stroke-dasharray: 0; stroke: #ccc;";

        // Make matched edges thicker and light blue in colour
        matched.forEach(function (e) {
            if (edges[0][i].__data__.source.id == e[0] && edges[0][i].__data__.target.id == e[1])
                edges[0][i].style = "stroke-dasharray: 0; stroke: #7affd2; stroke-width: 4px;";
        });

        // Change colours of edges in path
        if (pseudocodeLongLine == 6) {
            for (var j = 0; j < path.length - 1; j++) {
                if (edges[0][i].__data__.source.id == path[j] && edges[0][i].__data__.target.id == path[j + 1] || edges[0][i].__data__.source.id == path[j + 1] && edges[0][i].__data__.target.id == path[j]) {

                    // Make unmatched edges in path yellow in colour
                    edges[0][i].style = "stroke-dasharray: 0; stroke: yellow;";

                    // Make matched edges in path dashed and light blue in colour
                    matched.forEach(function (e) {
                        if (path[j] == e[0] && path[j + 1] == e[1] || path[j + 1] == e[0] && path[j] == e[1])
                            edges[0][i].style = "stroke-dasharray: 5; stroke: #7affd2;";
                    });

                }
            }
        }

    }

}


/***************************************
***** Function to update animation *****
***************************************/
function update() {

    // Get animation step based on position of step slider
    var step = $("#progress-bar").val();

    // Get corresponding frame from frames array
    if (pseudocodeVersion == 1)
        currentFrame = frames[step];
    else {
        currentFrame = frames.filter(function (f) {
            return step == f.shortTraceLine;
        })[0];
    }

    // Update different components of animation
    updatePseudocode(currentFrame.pseudocodeLongLine, currentFrame.pseudocodeShortLine);
    updateTrace(currentFrame.longTraceLine, currentFrame.shortTraceLine);

    if (selectedAlgorithm == 1 || selectedAlgorithm == 2) {
        updateVariables1(currentFrame.queue, currentFrame.u, currentFrame.v, currentFrame.w, currentFrame.matching);
        updateVertices1(currentFrame.u, currentFrame.v, currentFrame.w);
        updateEdges1(currentFrame.dashedEdges, currentFrame.solidEdges, currentFrame.connectedEdges);
    }
    else if (selectedAlgorithm == 3) {
        var blossomArray = getBlossom(currentFrame.pseudocodeLongLine, currentFrame.path, currentFrame.blossom);
        updateVariables2(currentFrame.graph, currentFrame.path, blossomArray);
        updateVertices2(currentFrame.pseudocodeLongLine, currentFrame.path, blossomArray);
        updateEdges2(currentFrame.pseudocodeLongLine, currentFrame.graph, currentFrame.path);
    }
}


/**************************************
***** Function to clear animation *****
**************************************/
function clearAnimation() {
    $("#progress-bar").val(0);              // Reset animation to beginning
    $("#speed-bar").val(5);                 // Reset speed to default value
    $("#play-button").html("play_arrow");   // Reset pause button to play button
    playState = false;                      // Mark animation play state as false
    $(".annotations").html("");             // Clear annotations

    // Remove highlight in pseudocode
    for (var i = 0; i < $("#pseudocode-long")[0].firstElementChild.children.length; i++)
        $("#pseudocode-long")[0].firstElementChild.children[i].style.backgroundColor = "#222";

    for (var i = 0; i < $("#pseudocode-short")[0].firstElementChild.children.length; i++)
        $("#pseudocode-short")[0].firstElementChild.children[i].style.backgroundColor = "#222";

    // Scroll pseudocode back to top
    $("#pseudocode-long").scrollTop(0);
    $("#pseudocode-short").scrollTop(0);

    // Clear execution trace
    $("#execution-trace ol").html("");

    // Reset displayed variables to default values
    $("#q").html("");
    $("#p").html("");
    $("#u").html("null");
    $("#v").html("null");
    $("#w").html("null");
    $("#bipartite-matching").html(0);
    $("#general-matching").html(0);
    $("#blossom").html("");

    // Reset all vertices as unhighlighted
    for (var i = 0; i < vertices[0].length; i++)
        vertices[0][i].firstChild.style.stroke = "none";

    // Reset all edges to default style
    for (var i = 0; i < edges[0].length; i++) {
        edges[0][i].style.stroke = "#ccc";
        edges[0][i].style.strokeDasharray = "0";
        edges[0][i].style.strokeWidth = "3";
    }
}