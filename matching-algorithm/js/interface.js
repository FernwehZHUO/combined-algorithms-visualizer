/*  The code below deals with the  *
 *  interface of the application   */


/********************
***** Variables *****
********************/
var pseudocodeLong1 = "<li>Initialise matching, <span class='lime-text'>m</span> to &Oslash;</li><li>Set all left-hand vertices as unvisited</li><li>Initialise empty queue, <span class='lime-text'>Q</span></li><li><b>While</b> there exists an exposed and unvisited left-hand vertex:</li><li style='padding-left: 20px;'>Find an exposed and unvisited left-hand vertex, <span class='lime-text'>u</span></li><li style='padding-left: 20px;'>Set all left-hand vertices as non-starting</li><li style='padding-left: 20px;'>Set all right-hand vertices as unvisited</li><li style='padding-left: 20px;'>Insert <span class='lime-text'>u</span> into <span class='lime-text'>Q</span></li><li style='padding-left: 20px;'>Set <span class='lime-text'>u</span> as start vertex</li><li style='padding-left: 20px;'><b>While</b> <span class='lime-text'>Q</span> is not empty:</li><li style='padding-left: 30px;'>Remove vertex <span class='lime-text'>v</span> from <span class='lime-text'>Q</span></li><li style='padding-left: 30px;'>Set <span class='lime-text'>v</span> as visited</li><li style='padding-left: 30px;'><b>For</b> each vertex <span class='lime-text'>w</span> adjacent to <span class='lime-text'>v</span>:</li><li style='padding-left: 40px;'><b>If</b> <span class='lime-text'>w</span> is not visited:</li><li style='padding-left: 50px;'>Set <span class='lime-text'>w</span> as visited</li><li style='padding-left: 50px;'>Set <span class='lime-text'>w</span>'s predecessor as <span class='lime-text'>v</span></li><li style='padding-left: 50px;'><b>If</b> <span class='lime-text'>w</span> is exposed:</li><li style='padding-left: 60px;'><span class='lime-text'>w</span> is the end vertex of the path</li><li style='padding-left: 60px;'><b>While</b> <span class='lime-text'>v</span> is not the start vertex:</li><li style='padding-left: 70px;'>Store <span class='lime-text'>v</span>'s current mate in <span class='lime-text'>temp</span> variable</li><li style='padding-left: 70px;'>Set <span class='lime-text'>v</span>'s new mate as <span class='lime-text'>w</span></li><li style='padding-left: 70px;'>Set <span class='lime-text'>w</span>'s mate as <span class='lime-text'>v</span></li><li style='padding-left: 70px;'>Set <span class='lime-text'>w</span> equal to <span class='lime-text'>v</span>'s previous mate, <span class='lime-text'>temp</span> variable</li><li style='padding-left: 70px;'>Set <span class='lime-text'>v</span> as <span class='lime-text'>w</span>'s predecessor</li><li style='padding-left: 60px;'><b>End While</b></li><li style='padding-left: 60px;'>Set <span class='lime-text'>v</span> and <span class='lime-text'>w</span> as each other's mate</li><li style='padding-left: 60px;'>Empty queue, <span class='lime-text'>Q</span></li><li style='padding-left: 60px;'><b>Break</b></li><li style='padding-left: 50px;'><b>Else</b>:</li><li style='padding-left: 60px;'>Insert <span class='lime-text'>w</span>'s mate into <span class='lime-text'>Q</span></li><li style='padding-left: 50px;'><b>End If</b></li><li style='padding-left: 40px;'><b>End If</b></li><li style='padding-left: 30px;'><b>End For</b></li><li style='padding-left: 20px;'><b>End While</b></li><li style='padding-left: 10px;'><b>End While</b></li>";
var pseudocodeLong2 = "<li>Create a number of clones equal to capacity for each vertex</li><li>Initialise matching, <span class='lime-text'>m</span> to &Oslash;</li><li>Set all left-hand vertices as unvisited</li><li>Initialise empty queue, <span class='lime-text'>Q</span></li><li><b>While</b> there exists an exposed and unvisited left-hand vertex:</li><li style='padding-left: 20px;'>Find an exposed and unvisited left-hand vertex, <span class='lime-text'>u</span></li><li style='padding-left: 20px;'>Set all left-hand vertices as non-starting</li><li style='padding-left: 20px;'>Set all right-hand vertices as unvisited</li><li style='padding-left: 20px;'>Insert <span class='lime-text'>u</span> into <span class='lime-text'>Q</span></li><li style='padding-left: 20px;'>Set <span class='lime-text'>u</span> as start vertex</li><li style='padding-left: 20px;'><b>While</b> <span class='lime-text'>Q</span> is not empty:</li><li style='padding-left: 30px;'>Remove vertex <span class='lime-text'>v</span> from <span class='lime-text'>Q</span></li><li style='padding-left: 30px;'>Set <span class='lime-text'>v</span> as visited</li><li style='padding-left: 30px;'><b>For</b> each vertex <span class='lime-text'>w</span> adjacent to <span class='lime-text'>v</span>:</li><li style='padding-left: 40px;'><b>If</b> <span class='lime-text'>w</span> is not visited and no clone of <span class='lime-text'>v</span> and <span class='lime-text'>w</span> are linked:</li><li style='padding-left: 50px;'>Set <span class='lime-text'>w</span> as visited</li><li style='padding-left: 50px;'>Set <span class='lime-text'>w</span>'s predecessor as <span class='lime-text'>v</span></li><li style='padding-left: 50px;'><b>If</b> <span class='lime-text'>w</span> is exposed:</li><li style='padding-left: 60px;'><span class='lime-text'>w</span> is the end vertex of the path</li><li style='padding-left: 60px;'><b>While</b> <span class='lime-text'>v</span> is not the start vertex:</li><li style='padding-left: 70px;'>Store <span class='lime-text'>v</span>'s current mate in <span class='lime-text'>temp</span> variable</li><li style='padding-left: 70px;'>Set <span class='lime-text'>v</span>'s new mate as <span class='lime-text'>w</span></li><li style='padding-left: 70px;'>Set <span class='lime-text'>w</span>'s mate as <span class='lime-text'>v</span></li><li style='padding-left: 70px;'>Set <span class='lime-text'>w</span> equal to <span class='lime-text'>v</span>'s previous mate, <span class='lime-text'>temp</span> variable</li><li style='padding-left: 70px;'>Set <span class='lime-text'>v</span> as <span class='lime-text'>w</span>'s predecessor</li><li style='padding-left: 60px;'><b>End While</b></li><li style='padding-left: 60px;'>Set <span class='lime-text'>v</span> and <span class='lime-text'>w</span> as each other's mate</li><li style='padding-left: 60px;'>Empty queue, <span class='lime-text'>Q</span></li><li style='padding-left: 60px;'><b>Break</b></li><li style='padding-left: 50px;'><b>Else</b>:</li><li style='padding-left: 60px;'>Insert <span class='lime-text'>w</span>'s mate into <span class='lime-text'>Q</span></li><li style='padding-left: 50px;'><b>End If</b></li><li style='padding-left: 40px;'><b>End If</b></li><li style='padding-left: 30px;'><b>End For</b></li><li style='padding-left: 20px;'><b>End While</b></li><li style='padding-left: 10px;'><b>End While</b></li>";
var pseudocodeLong3 = "<li>Initialise matching, <span class='lime-text'>m</span> to &Oslash;</li><li><b>While</b> an augmenting path or blossom exists:</li><li style='padding-left: 20px;'>Find augmenting path or blossom, <span class='lime-text'>p</span></li><li style='padding-left: 20px;'><b>If</b> <span class='lime-text'>p</span> is a blossom:</li><li style='padding-left: 30px;'>Shrink <span class='lime-text'>p</span></li><li style='padding-left: 20px;'><b>Else</b>:</li><li style='padding-left: 30px;'>Augment <span class='lime-text'>m</span> along <span class='lime-text'>p</span></li><li style='padding-left: 20px;'><b>End If</b></li><li><b>End While</b></li>";
var pseudocodeShort = "<li>Initialise variables</li><li><b>While</b> an augmenting path exists:</li><li style='padding-left: 20px;'>Find an augmenting path</li><li style='padding-left: 20px;'>Augment matching along path</li><li><b>End While</b></li>";
var pseudocodeLong = pseudocodeLong1;   // Long version of pseudocode
var pseudocodeVersion = 1;              // 0 represents short version of pseudocode, 1 represents long version of pseudocode
var playState = false;                  // State to indicate if algorithm animation is running


$(document).ready(function () {

    /***************************************************
    ***** Elements and Materialize initialisations *****
    ***************************************************/
    $("select").formSelect();
    $(".fixed-action-btn").floatingActionButton({ direction: "left", hoverEnabled: false });
    $(".tooltipped").tooltip();
    $(".modal").modal();
    $(".carousel").carousel({ fullWidth: true, indicators: true });
    $("#pseudocode-long ol").html(pseudocodeLong);
    $("#pseudocode-short ol").html(pseudocodeShort);
    $("#algorithm1").prop("checked", true);
    $("#txt-select").prop("checked", true);
    $("#general-variables").hide();
    $("#bipartite-variables").show();
    $("#algorithm-modal").modal({ startingTop: "50%", endingTop: "50%" });
    $("#help-modal").modal({
        startingTop: "50%", endingTop: "50%", onOpenEnd: function () {
            $(".carousel").carousel({ fullWidth: true, indicators: true });
            $(".carousel").height($(".carousel-item").height());
            $("#help-play-button i").html("play_arrow");
            $("#help-play-button").addClass("blue");
            $("#help-play-button").removeClass("red");
            $("#help-play-text").html("Start animation");
            $("#help-edit-button i").html("stop");
            $("#help-edit-button").addClass("red");
            $("#help-edit-button").removeClass("blue");
            $("#help-edit-text").html("Edit graph");
            $("#help-details-button i").html("unfold_less");
            $("#help-details-text").html("Less detailed animation");
        }
    });
    $("#welcome-modal").modal({ inDuration: 500, outDuration: 1000, opacity: 0.85, startingTop: "50%", endingTop: "50%" });


    /******************************
    ***** Size initilisations *****
    ******************************/
    $("#pseudocode-panel").height($(window).height() - $("#title").height() - 60);
    $("#graph-panel").height(($(window).height() - $("#title").height() - $("#control-panel").height()) - 90);
    $("#execution-panel").height(($(window).height() - $("#title").height() - 100) / 2);
    $("#variables-panel").height(($(window).height() - $("#title").height() - 100) / 2);
    $("#pseudocode-long").height($("#pseudocode-panel").height() - $("h7").height() - 50);
    $("#pseudocode-short").height($("#pseudocode-panel").height() - $("h7").height() - 50);
    $("#execution-trace").height($("#execution-panel").height() - $("h7").height() - 50);
    $(".variables").height($("#variables-panel").height() - $("h7").height() - 50);


    /**************************
    ***** Resize handling *****
    **************************/
    $(window).resize(function () {
        $("#pseudocode-panel").height($(window).height() - $("#title").height() - 60);
        $("#graph-panel").height(($(window).height() - $("#title").height() - $("#control-panel").height()) - 90);
        $("#execution-panel").height(($(window).height() - $("#title").height() - 100) / 2);
        $("#variables-panel").height(($(window).height() - $("#title").height() - 100) / 2);
        $("#pseudocode-long").height($("#pseudocode-panel").height() - $("h7").height() - 50);
        $("#pseudocode-short").height($("#pseudocode-panel").height() - $("h7").height() - 50);
        $("#execution-trace").height($("#execution-panel").height() - $("h7").height() - 50);
        $(".variables").height($("#variables-panel").height() - $("h7").height() - 50);
        graphWidth = $("#graph-panel").width();
        graphHeight = $("#graph-panel").height() - $("h7").height() - 30;
        $("#graph").width(graphWidth);
        $("#graph").height(graphHeight);
        resizeGraph();  // Reposition nodes on resize (function in graph.js)
        if (playState)
            update();   // Reposition annotations on resize (function in animation.js)
    });


    /***************
    ***** Menu *****
    ***************/

    // Display welcome modal on start up
    M.Modal.getInstance($("#welcome-modal")).open();

    // Show algorithm selection in welcome modal
    $("#start-btn").click(function () {
        $("#welcome-controls").hide("slow");
        $("#welcome-algorithms").show("slow");
    });

    // Set selected algorithm and update necessary elements
    $("#one-to-one-btn").click(function () {
        selectedAlgorithm = 1;
        pseudocodeLong = pseudocodeLong1;
        $("#pseudocode-long ol").html(pseudocodeLong);
        $("#title h1").html("One-to-one bipartite graph matching");
        $("#error-type").html("one-to-one bipartite graph matching");
        $("#general-variables").hide();
        $("#bipartite-variables").show();
        $("#algorithm1").prop("checked", true);
    });

    $("#many-to-many-btn").click(function () {
        selectedAlgorithm = 2;
        pseudocodeLong = pseudocodeLong2;
        $("#pseudocode-long ol").html(pseudocodeLong);
        $("#title h1").html("Many-to-many bipartite graph matching");
        $("#error-type").html("many-to-many bipartite graph matching");
        $("#general-variables").hide();
        $("#bipartite-variables").show();
        $("#algorithm2").prop("checked", true);
    });

    $("#general-graph-btn").click(function () {
        selectedAlgorithm = 3;
        pseudocodeLong = pseudocodeLong3;
        $("#pseudocode-long ol").html(pseudocodeLong);
        $("#title h1").html("General graph matching");
        $("#error-type").html("general graph matching");
        $("#bipartite-variables").hide();
        $("#general-variables").show();
        $("#algorithm3").prop("checked", true);
    });

    // Disable pulse on menu button if it has been clicked at least once
    $(".pulse").click(function () {
        $(".pulse").removeClass("pulse");
    });

    // Import data
    $("#import-btn").click(function () {

        // Import data and update graph (function in graph.js)
        importGraph();

        // If in the middle of an animation, return to edit mode
        if (!editable)
            editGraph();

    });

    // Check if file is present and if it is a .txt or .json file
    $("#import-data").change(function () {
        $("#file-error").hide();
        if ($("#import-data")[0].files.length !== 0 && ($("#import-data")[0].files[0].type == "text/plain" || $("#import-data")[0].files[0].type == "application/json"))
            $("#import-btn").removeClass("disabled");
        else
            $("#import-btn").addClass("disabled");
    });

    // Reset import field when import modal is closed
    $("#import-close").click(function () {
        $("#file-error").hide();
        $("#import-data").val("");
        $("#import-text").val("");
        $("#import-text").removeClass("valid");
        $("#import-btn").addClass("disabled");
    });

    // Export graph
    $("#export-trigger").click(function () {

        // Position nodes (function in graph.js)
        positionNodes();

        // Reset radio buttons
        $("#txt-select").prop("checked", true);

        // Convert graph data into text
        var graphData = "";

        // Append links to text as {v,w}
        links.forEach(function (l, index) {
            graphData += "{" + l.source.id + "," + l.target.id + "}";
            if (index !== links.length - 1)
                graphData += "\n";
        });

        // Append capacity to text as v:c if selected algorithm is many-to-many bipartite graph matching
        if (selectedAlgorithm == 2) {
            nodes.forEach(function (n) {
                if (n.capacity != 1) {
                    graphData += "\n" + n.id + ":" + n.capacity;
                }
            });
        }

        // Append coordinates on a scale of 100 to text as v:(x,y) if selected algorithm is general graph matching
        else if (selectedAlgorithm == 3) {
            nodes.forEach(function (n) {
                graphData += "\n" + n.id + ":(" + n.rx + "," + n.ry + ")";
            });
        }

        // Create Blob object (https://developer.mozilla.org/en-US/docs/Web/API/Blob)
        var blob = new Blob([graphData], { type: "text/plain" });
        var url = URL.createObjectURL(blob);

        // Set export button as download button of graph data file
        $("#export-btn").attr("download", "graph.txt");
        $("#export-btn").attr("href", url);

    });

    // Format graph data as .txt file
    $("#txt-select").click(function () {

        // Convert graph data into text
        var graphData = "";

        // Append links to text as {v,w}
        links.forEach(function (l, index) {
            graphData += "{" + l.source.id + "," + l.target.id + "}";
            if (index !== links.length - 1)
                graphData += "\n";
        });

        // Append capacity to text as v:c if selected algorithm is many-to-many bipartite graph matching
        if (selectedAlgorithm == 2) {
            nodes.forEach(function (n) {
                if (n.capacity != 1) {
                    graphData += "\n" + n.id + ":" + n.capacity;
                }
            });
        }

        // Append coordinates to text as v:(x,y) if selected algorithm is general graph matching
        else if (selectedAlgorithm == 3) {
            nodes.forEach(function (n) {
                graphData += "\n" + n.id + ":(" + n.rx + "," + n.ry + ")";
            });
        }

        // Create Blob object (https://developer.mozilla.org/en-US/docs/Web/API/Blob)
        var blob = new Blob([graphData], { type: "text/plain" });
        var url = URL.createObjectURL(blob);

        // Set export button as download button of graph data file
        $("#export-btn").attr("download", "graph.txt");
        $("#export-btn").attr("href", url);

    });

    // Format graph data as .json file
    $("#json-select").click(function () {

        // Convert graph data into json
        var graphData = {
            links: links.map(function (l) {
                return { source: l.source.id, target: l.target.id };
            })
        }

        // Save capacities that are not equal to 1 for many-to-many bipartite graph matching
        if (selectedAlgorithm == 2) {
            capacityNodes = [];

            nodes.forEach(function (n) {
                if (n.capacity != 1) {
                    capacityNodes.push({ id: n.id, capacity: n.capacity });
                }
            });

            if (capacityNodes.length > 0)
                graphData.nodes = capacityNodes;
        }

        // Save coordinates for general graph matching
        else if (selectedAlgorithm == 3) {
            graphData.nodes = nodes.map(function (n) {
                return { id: n.id, x: n.rx, y: n.ry };
            })
        }

        // Create Blob object (https://developer.mozilla.org/en-US/docs/Web/API/Blob)
        var blob = new Blob([JSON.stringify(graphData)], { type: "application/json" });
        var url = URL.createObjectURL(blob);

        // Set export button as download button of graph data file
        $("#export-btn").attr("download", "graph.json");
        $("#export-btn").attr("href", url);

    });

    // Change algorithm selection
    $("#algorithm-btn").click(function () {
        // Clear current graph
        clearGraph();

        // Update necessary elements
        if ($("#algorithm1").prop("checked")) {
            selectedAlgorithm = 1;
            pseudocodeLong = pseudocodeLong1;
            $("#pseudocode-long ol").html(pseudocodeLong);
            $("#title h1").html("One-to-one bipartite graph matching");
            $("#error-type").html("one-to-one bipartite graph matching");
            $("#general-variables").hide();
            $("#bipartite-variables").show();
        }
        else if ($("#algorithm2").prop("checked")) {
            selectedAlgorithm = 2;
            pseudocodeLong = pseudocodeLong2;
            $("#pseudocode-long ol").html(pseudocodeLong);
            $("#title h1").html("Many-to-many bipartite graph matching");
            $("#error-type").html("many-to-many bipartite graph matching");
            $("#general-variables").hide();
            $("#bipartite-variables").show();
        }
        else if ($("#algorithm3").prop("checked")) {
            selectedAlgorithm = 3;
            pseudocodeLong = pseudocodeLong3;
            $("#pseudocode-long ol").html(pseudocodeLong);
            $("#title h1").html("General graph matching");
            $("#error-type").html("general graph matching");
            $("#bipartite-variables").hide();
            $("#general-variables").show();
        }

        // If in the middle of an animation, return to edit mode
        if (!editable)
            editGraph();
    });

    // Reset radio buttons when algorithm selection modal is closed
    $("#algorithm-close").click(function () {
        if (selectedAlgorithm == 1)
            $("#algorithm1").prop("checked", true);
        else if (selectedAlgorithm == 2)
            $("#algorithm2").prop("checked", true);
        else if (selectedAlgorithm == 3)
            $("#algorithm3").prop("checked", true);
    });

    // Fullscreen (https://www.w3schools.com/howto/howto_js_fullscreen.asp)
    $("#fullscreen-button").click(function () {

        // If not in fullscreen, switch to fullscreen
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            if (document.documentElement.requestFullscreen)
                document.documentElement.requestFullscreen();

            // Firefox
            else if (document.documentElement.mozRequestFullScreen)
                document.documentElement.mozRequestFullScreen();

            // Chrome, Safari and Opera
            else if (document.documentElement.webkitRequestFullscreen)
                document.documentElement.webkitRequestFullscreen();

            // Internet Explorer and Edge
            else if (document.documentElement.msRequestFullscreen)
                document.documentElement.msRequestFullscreen();
        }

        // If in fullscreen, exit fullscreen
        else {
            if (document.exitFullscreen)
                document.exitFullscreen();

            // Firefox
            else if (document.mozCancelFullScreen)
                document.mozCancelFullScreen();

            // Chrome, Safari and Opera
            else if (document.webkitExitFullscreen)
                document.webkitExitFullscreen();

            // Internet Explorer and Edge
            else if (document.msExitFullscreen)
                document.msExitFullscreen();
        }

    });

    // Change enter/exit fullscreen button depending on fullscreen status
    document.addEventListener("fullscreenchange", function () {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
            $("#fullscreen-button i").html("fullscreen");
            $("#fullscreen-button").attr("data-tooltip", "Fullscreen");
        }
        else {
            $("#fullscreen-button i").html("fullscreen_exit");
            $("#fullscreen-button").attr("data-tooltip", "Exit fullscreen");
        }
    });

    // Start animation/Edit graph button in help section
    $("#help-play-button, #help-edit-button").click(function () {

        // If first button shows play button
        if ($("#help-play-text").html() == "Start animation") {
            $("#help-play-button i").html("stop");
            $("#help-play-button").addClass("red");
            $("#help-play-button").removeClass("blue");
            $("#help-play-text").html("Edit graph");
            $("#help-edit-button i").html("play_arrow");
            $("#help-edit-button").addClass("blue");
            $("#help-edit-button").removeClass("red");
            $("#help-edit-text").html("Start animation");
        }

        // If first button shows stop button
        else {
            $("#help-play-button i").html("play_arrow");
            $("#help-play-button").addClass("blue");
            $("#help-play-button").removeClass("red");
            $("#help-play-text").html("Start animation");
            $("#help-edit-button i").html("stop");
            $("#help-edit-button").addClass("red");
            $("#help-edit-button").removeClass("blue");
            $("#help-edit-text").html("Edit graph");
        }

    });

    // Details button click handling in help section
    $("#help-details-button").click(function () {

        // If less details button, convert to more details button
        if ($("#help-details-text").html() == "Less detailed animation") {
            $("#help-details-button i").html("unfold_more");
            $("#help-details-text").html("More detailed animation");
        }

        // If more details button, convert to less details button
        else {
            $("#help-details-button i").html("unfold_less");
            $("#help-details-text").html("Less detailed animation");
        }

    });

    // Random graph settings (right-click handling) in help section
    $("#help-random-button").contextmenu(function (e) {

        // Disable default right-click
        e.preventDefault();

        // Reset numbers in modal to default values
        $("#help-left-number").html(5);
        $("#help-right-number").html(5);
        $("#help-probability-number").html(0.5);

        // Pop up random graph settings help modal
        var modalX = $("#help-random-button").offset().left - $("#help-random-modal").width() - 20;
        var modalY = $("#help-random-button").offset().top - ($("#help-random-modal").height() - $("#help-random-button").height()) / 2;
        $("#help-random-modal").modal({ opacity: 0, startingTop: modalY, endingTop: modalY });
        M.Modal.getInstance($("#help-random-modal")).open();
        $("#help-random-modal")[0].style.left = modalX + "px";

    });

    // Decrement number of left-hand vertices in help section
    $("#help-left-minus").click(function () {
        if (Number($("#help-left-number").html()) > 1)
            $("#help-left-number").html(Number($("#help-left-number").html()) - 1);
    });

    // Increment number of left-hand vertices in help section
    $("#help-left-plus").click(function () {
        $("#help-left-number").html(Number($("#help-left-number").html()) + 1);
    });

    // Decrement number of right-hand vertices in help section
    $("#help-right-minus").click(function () {
        if (Number($("#help-right-number").html()) > 1)
            $("#help-right-number").html(Number($("#help-right-number").html()) - 1);
    });

    // Increment number of right-hand vertices in help section
    $("#help-right-plus").click(function () {
        $("#help-right-number").html(Number($("#help-right-number").html()) + 1);
    });

    // Decrement edge probability in help section
    $("#help-probability-minus").click(function () {
        if (Number($("#help-probability-number").html()) > 0.1)
            $("#help-probability-number").html(Math.round((Number($("#help-probability-number").html()) - 0.1) * 10) / 10);
    });

    // Increment edge probability in help section
    $("#help-probability-plus").click(function () {
        if (Number($("#help-probability-number").html()) < 1)
            $("#help-probability-number").html(Math.round((Number($("#help-probability-number").html()) + 0.1) * 10) / 10);
    });


    /*************************
    ***** Graph controls *****
    *************************/

    // Start algorithm animation
    $("#run-algorithm").click(function () {

        // Disable graph editing
        editable = false;

        // Update interface
        $("#graph-controls").hide();
        $("#algorithm-controls").fadeIn();
        $("#graph-panel").height(($(window).height() - $("#title").height() - $("#control-panel").height()) - 100);
        graphWidth = $("#graph-panel").width();
        graphHeight = $("#graph-panel").height() - $("h7").height() - 30;
        $("#graph").height(graphHeight);
        $("#graph").width(graphWidth);

        // Position nodes (function in graph.js)
        updateCoordinates = false;
        positionNodes();
        updateCoordinates = true;

        // Run algorithm (function in algorithm(1/2/3).js)
        if (selectedAlgorithm == 1)
            runAlgorithm1();
        else if (selectedAlgorithm == 2)
            runAlgorithm2();
        else if (selectedAlgorithm == 3) {

            // Save original coordinates of nodes in graph
            nodeCoordinates = [];

            nodes.forEach(function (n) {
                nodeCoordinates.push({ id: n.id, x: n.rx, y: n.ry });
            });

            runAlgorithm3();

        }

        // Set range of progress bar according to number of steps in algorithm
        if (pseudocodeVersion == 1)
            $("#progress-bar")[0].max = frames.length - 1;
        else
            $("#progress-bar")[0].max = shortTrace.length - 1;

        // Reset to first step of algorithm
        $("#progress-bar").val(0);

        // Update animation (function in animation.js)
        update();

        // Update state to indicate that algorithm animation is running
        playState = true;

        // Change play icon to pause icon
        $("#play-button").html("pause");
        $("#play-button").attr("data-tooltip", "Pause");

        // Go through each frame of algorithm consecutively
        setTimeout(playAlgorithm, 5000 / $("#speed-bar").val());

    });

    // Generate random graph (functions in graph.js)
    $("#random-graph").click(function () {
        if (selectedAlgorithm == 1 || selectedAlgorithm == 2)
            randomBipartiteGraph(1, 5, 1, 5, 1, 5, 0.5);
        else if (selectedAlgorithm == 3)
            randomGeneralGraph(1, 10, 0.2);
    });

    // Random graph settings by right-clicking on random graph button (function in graph.js)
    $("#random-graph").contextmenu(function (e) {

        // Disable default right-click
        e.preventDefault();

        // Initialise values
        if (selectedAlgorithm == 1) {
            $("#random-general-vertices").hide();
            $("#random-capacity").hide();
            $("#random-bipartite-vertices").show();
        }
        else if (selectedAlgorithm == 2) {
            $("#random-general-vertices").hide();
            $("#random-bipartite-vertices").show();
            $("#random-capacity").show();
        }
        else if (selectedAlgorithm == 3) {
            $("#random-bipartite-vertices").hide();
            $("#random-capacity").hide();
            $("#random-general-vertices").show();
        }

        $("#left-number").html(5);
        $("#right-number").html(5);
        $("#vertices-number").html(10);
        $("#capacity-min-number").html(1);
        $("#capacity-max-number").html(5);
        $("#probability-number").html(0.5);

        // Pop up random graph settings modal
        var modalX = $("#random-graph").offset().left - ($("#random-modal").width() - $("#random-graph").width()) / 2;
        var modalY = $("#random-graph").offset().top - $("#random-modal").height() - 20;
        $("#random-modal").modal({ opacity: 0, startingTop: $("#random-graph").offset().top - ($("#random-modal").height() - $("#random-graph").height() / 2), endingTop: modalY });
        M.Modal.getInstance($("#random-modal")).open();
        $("#random-modal")[0].style.left = modalX + "px";

    });

    // Decrement number of left-hand vertices
    $("#left-minus").click(function () {
        if (Number($("#left-number").html()) > 1)
            $("#left-number").html(Number($("#left-number").html()) - 1);
    });

    // Increment number of left-hand vertices
    $("#left-plus").click(function () {
        $("#left-number").html(Number($("#left-number").html()) + 1);
    });

    // Decrement number of right-hand vertices
    $("#right-minus").click(function () {
        if (Number($("#right-number").html()) > 1)
            $("#right-number").html(Number($("#right-number").html()) - 1);
    });

    // Increment number of right-hand vertices
    $("#right-plus").click(function () {
        $("#right-number").html(Number($("#right-number").html()) + 1);
    });

    // Decrement number of general graph vertices
    $("#vertices-minus").click(function () {
        if (Number($("#vertices-number").html()) > 1)
            $("#vertices-number").html(Number($("#vertices-number").html()) - 1);
    });

    // Increment number of general graph vertices
    $("#vertices-plus").click(function () {
        $("#vertices-number").html(Number($("#vertices-number").html()) + 1);
    });

    // Decrement minimum capacity
    $("#capacity-min-minus").click(function () {
        if (Number($("#capacity-min-number").html()) > 1)
            $("#capacity-min-number").html(Number($("#capacity-min-number").html()) - 1);
    });

    // Increment minimum capacity
    $("#capacity-min-plus").click(function () {
        if (Number($("#capacity-min-number").html()) < Number($("#capacity-max-number").html()))
            $("#capacity-min-number").html(Number($("#capacity-min-number").html()) + 1);
    });

    // Decrement maximum capacity
    $("#capacity-max-minus").click(function () {
        if (Number($("#capacity-max-number").html()) > 1 && Number($("#capacity-max-number").html()) > Number($("#capacity-min-number").html()))
            $("#capacity-max-number").html(Number($("#capacity-max-number").html()) - 1);
    });

    // Increment maximum capacity
    $("#capacity-max-plus").click(function () {
        $("#capacity-max-number").html(Number($("#capacity-max-number").html()) + 1);
    });

    // Decrement edge probability
    $("#probability-minus").click(function () {
        if (Number($("#probability-number").html()) > 0.1)
            $("#probability-number").html(Math.round((Number($("#probability-number").html()) - 0.1) * 10) / 10);
    });

    // Increment edge probability
    $("#probability-plus").click(function () {
        if (Number($("#probability-number").html()) < 1)
            $("#probability-number").html(Math.round((Number($("#probability-number").html()) + 0.1) * 10) / 10);
    });

    // Generate random graph with custom settings (functions in graph.js)
    $("#random-btn").click(function () {
        if (selectedAlgorithm == 1 || selectedAlgorithm == 2)
            randomBipartiteGraph(Number($("#left-number").html()), Number($("#left-number").html()), Number($("#right-number").html()), Number($("#right-number").html()), Number($("#capacity-min-number").html()), Number($("#capacity-max-number").html()), Number($("#probability-number").html()));
        else if (selectedAlgorithm == 3)
            randomGeneralGraph(Number($("#vertices-number").html()), Number($("#vertices-number").html()), Number($("#probability-number").html()));
    });


    /***************************************
    ***** Algorithm animation controls *****
    ***************************************/

    // Switch between long and short pseudocode
    $("#details-button").click(function () {

        // If long version of pseudocode currently being shown, switch to short version
        if (pseudocodeVersion == 1) {
            $("#pseudocode-long").hide();
            $("#pseudocode-short").show();
            $("#details-button").html("unfold_more");
            $("#details-button").attr("data-tooltip", "More details");
            pseudocodeVersion = 0;

            // Update animation accordingly
            if (!editable) {
                $("#progress-bar")[0].max = shortTrace.length - 1;
                $("#progress-bar").val(currentFrame.shortTraceLine);
                update();
            }
        }

        // If short version of pseudocode currently being shown, switch to long version
        else {
            $("#pseudocode-long").show();
            $("#pseudocode-short").hide();
            $("#details-button").html("unfold_less");
            $("#details-button").attr("data-tooltip", "Less details");
            pseudocodeVersion = 1;

            // Update animation accordingly
            if (!editable) {
                $("#progress-bar")[0].max = frames.length - 1;
                $("#progress-bar").val(currentFrame.longTraceLine);
                update();
            }
        }

    });

    // Stop algorithm animation
    $("#stop-button").click(editGraph);

    // Play/Pause algorithm animation
    $("#play-button").click(function () {

        // Check if animation is paused
        if (!playState) {

            // If on last frame of animation of animation, restart from first frame
            if ($("#progress-bar").val() == $("#progress-bar")[0].max) {
                $("#progress-bar").val(0);
                update();
            }

            // Update state to indicate that algorithm animation is running
            playState = true;

            // Change play icon to pause icon
            $("#play-button").html("pause");
            $("#play-button").attr("data-tooltip", "Pause");

            // Go through each frame of algorithm consecutively
            setTimeout(playAlgorithm, 5000 / $("#speed-bar").val());

        }
        else {  // If animation is running

            // Update state to indicate that algorithm animation is not running
            playState = false;

            // Change pause icon to play icon
            $("#play-button").html("play_arrow");
            $("#play-button").attr("data-tooltip", "Play");

        }

    });

    // Previous frame of algorithm animation
    $("#previous-button").click(function () {
        $("#progress-bar")[0].value--;
        update();
    });

    // Next frame of algorithm animation
    $("#next-button").click(function () {
        $("#progress-bar")[0].value++;
        update();
    });

    // Decrease algorithm animation speed
    $("#faster-button").click(function () {
        $("#speed-bar")[0].value++;
    });

    // Increase algorithm animation speed
    $("#slower-button").click(function () {
        $("#speed-bar")[0].value--;
    });

    // Update animation frame when progress bar is changed
    $("#progress-bar").change(update);


    /*********************************
    ***** Function to edit graph *****
    *********************************/
    function editGraph() {

        // Clear animation components (function in animation.js)
        clearAnimation();

        // Change algorithm animation controls to graph editing controls
        $("#algorithm-controls").hide();
        $("#graph-controls").fadeIn();
        $("#graph-panel").height(($(window).height() - $("#title").height() - $("#control-panel").height()) - 100);
        graphWidth = $("#graph-panel").width();
        graphHeight = $("#graph-panel").height() - $("h7").height() - 30;
        $("#graph").height(graphHeight);
        $("#graph").width(graphWidth);

        // Reposition nodes within graph area (expand all blossoms if any were contracted)
        if (selectedAlgorithm == 3) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].rx = nodeCoordinates[i].x;
                nodes[i].ry = nodeCoordinates[i].y;
            }
        }
        updateCoordinates = false;
        positionNodes();
        updateCoordinates = true;

        // Enable graph editing
        editable = true;

    }


    /**********************************************
    ***** Function to run algorithm animation *****
    **********************************************/
    function playAlgorithm() {

        // If algorithm animation is running, increment step and update animation
        if (playState) {
            $("#progress-bar")[0].value++;
            update();
        }

        // Check if end of algorithm animation is not yet reached and algorithm is still running
        if ($("#progress-bar").val() != $("#progress-bar")[0].max && playState) {

            // Move to next frame after a delay which depends on the speed slider
            setTimeout(playAlgorithm, 5000 / $("#speed-bar").val());

        }
        else {

            // Change pause icon to play icon
            $("#play-button").html("play_arrow");
            $("#play-button").attr("data-tooltip", "Play");

            // Update state to indicate that algorithm animation is not running
            playState = false;

        }

    }

});