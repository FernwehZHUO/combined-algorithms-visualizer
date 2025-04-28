/**
 * Teacher Substitution Scheduler - Core Functionality
 * This file contains the core functionality for the teacher substitution scheduler
 */

/********************
***** Variables *****
********************/
var availableTeachers = [];  // Array of available teachers
var classesNeeding = [];     // Array of classes needing substitutes
var connections = [];        // Array of teacher-class connections (which teacher can teach which class)
var substitutionResults = null; // Results of substitution matching

// Object models
function Teacher(id, name) {
    this.id = id;
    this.name = name;
    this.assignedClass = null;
}

function ClassNeedingSub(id, name, absentTeacher) {
    this.id = id;
    this.name = name;
    this.absentTeacher = absentTeacher;
    this.substituteTeacher = null;
}

function Connection(teacherId, classId) {
    this.teacherId = teacherId;
    this.classId = classId;
}

/**************************
***** Event Handlers ******
**************************/
$(document).ready(function() {
    // Initialize modals
    $('.modal').modal();
    
    // Initialize help carousel
    $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        indicators: true
    });
    
    // Show welcome modal on start
    $('#welcome-modal').modal('open');
    
    // Start button
    $('#start-btn').click(function() {
        $('#welcome-modal').modal('close');
    });
    
    // Initialize fullscreen button
    $("#fullscreen-button").click(toggleFullScreen);
    
    // Add available teacher
    $("#add-available-teacher").click(function() {
        const teacherName = $("#new-available-teacher").val().trim();
        if (teacherName) {
            addAvailableTeacher(teacherName);
            $("#new-available-teacher").val("");
            updateTeacherSelect();
        }
    });
    
    // Add available teacher on Enter key
    $("#new-available-teacher").keypress(function(e) {
        if (e.which === 13) { // Enter key
            $("#add-available-teacher").click();
            return false;
        }
    });
    
    // Add class needing substitute
    $("#add-class").click(function() {
        const className = $("#new-class").val().trim();
        const absentTeacher = $("#absent-teacher").val().trim();
        if (className && absentTeacher) {
            addClass(className, absentTeacher);
            $("#new-class").val("");
            $("#absent-teacher").val("");
            updateClassSelect();
        }
    });
    
    // Add class on Enter key in absent teacher field
    $("#absent-teacher").keypress(function(e) {
        if (e.which === 13) { // Enter key
            $("#add-class").click();
            return false;
        }
    });
    
    // Focus on absent teacher field when Enter pressed in class name field
    $("#new-class").keypress(function(e) {
        if (e.which === 13) { // Enter key
            $("#absent-teacher").focus();
            return false;
        }
    });
    
    // Connect teacher to class
    $("#connect-teacher-class").click(function() {
        const teacherId = $("#teacher-select").val();
        const classId = $("#class-select").val();
        if (teacherId && classId) {
            addConnection(teacherId, classId);
        }
    });
    
    // Run matching algorithm
    $("#run-matching").click(function() {
        runSubstitutionMatching();
    });
    
    // Load sample data
    $("#load-sample-data").click(function() {
        loadSampleData();
    });
});

/*****************************************
***** Teacher Substitution Functions *****
*****************************************/

// Reset all teacher substitution data
function resetTeacherSubData() {
    availableTeachers = [];
    classesNeeding = [];
    connections = [];
    substitutionResults = null;
    
    // Clear UI lists
    $("#available-teachers-list").empty();
    $("#classes-list").empty();
    $("#results-content").html("<p class='grey-text'>Results will appear here after matching</p>");
    
    // Hide connections table if it exists
    $("#connections-table-container").hide();
    
    // Reset selects
    updateTeacherSelect();
    updateClassSelect();
}

// Add an available teacher
function addAvailableTeacher(name) {
    const id = "teacher-" + availableTeachers.length;
    const teacher = new Teacher(id, name);
    availableTeachers.push(teacher);
    
    // Add to UI list
    $("#available-teachers-list").append(
        `<li class="collection-item">
            <div>${name}
                <a href="#!" class="secondary-content remove-teacher" data-id="${id}">
                    <i class="material-icons">delete</i>
                </a>
            </div>
        </li>`
    );
    
    // Handle remove button
    $(".remove-teacher[data-id='" + id + "']").click(function() {
        removeTeacher(id);
    });
}

// Remove a teacher
function removeTeacher(id) {
    const index = availableTeachers.findIndex(t => t.id === id);
    if (index !== -1) {
        availableTeachers.splice(index, 1);
        // Remove connections involving this teacher
        connections = connections.filter(c => c.teacherId !== id);
        updateTeacherSelect();
        // Update UI
        $(".collection-item").has(`.remove-teacher[data-id='${id}']`).remove();
    }
}

// Add a class needing substitute
function addClass(name, absentTeacher) {
    const id = "class-" + classesNeeding.length;
    const classObj = new ClassNeedingSub(id, name, absentTeacher);
    classesNeeding.push(classObj);
    
    // Add to UI list
    $("#classes-list").append(
        `<li class="collection-item">
            <div>${name} (Absent: ${absentTeacher})
                <a href="#!" class="secondary-content remove-class" data-id="${id}">
                    <i class="material-icons">delete</i>
                </a>
            </div>
        </li>`
    );
    
    // Handle remove button
    $(".remove-class[data-id='" + id + "']").click(function() {
        removeClass(id);
    });
}

// Remove a class
function removeClass(id) {
    const index = classesNeeding.findIndex(c => c.id === id);
    if (index !== -1) {
        classesNeeding.splice(index, 1);
        // Remove connections involving this class
        connections = connections.filter(c => c.classId !== id);
        updateClassSelect();
        // Update UI
        $(".collection-item").has(`.remove-class[data-id='${id}']`).remove();
    }
}

// Add a connection between teacher and class
function addConnection(teacherId, classId) {
    // Check if connection already exists
    const existingConnection = connections.find(c => 
        c.teacherId === teacherId && c.classId === classId);
    
    if (!existingConnection) {
        const connection = new Connection(teacherId, classId);
        connections.push(connection);
        
        // Get teacher and class names for UI
        const teacher = availableTeachers.find(t => t.id === teacherId);
        const classObj = classesNeeding.find(c => c.id === classId);
        
        // Add notification
        M.toast({html: `Connected "${teacher.name}" to "${classObj.name}"`, displayLength: 2000});
        
        // Display connections table
        displayConnectionsTable();
    }
}

// Display table of teacher-class connections
function displayConnectionsTable() {
    // Check if connections table already exists, if not create it
    let connectionsTableContainer = $("#connections-table-container");
    if (connectionsTableContainer.length === 0) {
        // Append a new container for the connections table after the connection form
        $(".teacher-preferences-content").append(`
            <div class="col s12" id="connections-table-container" style="margin-top: 20px;">
                <h5>Connected Teachers and Classes</h5>
                <table class="striped highlight responsive-table">
                    <thead>
                        <tr>
                            <th>Teacher</th>
                            <th>Class</th>
                            <th>Absent Teacher</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="connections-table-body">
                    </tbody>
                </table>
            </div>
        `);
        connectionsTableContainer = $("#connections-table-container");
    }
    
    // Clear existing rows in the table
    const tableBody = $("#connections-table-body");
    tableBody.empty();
    
    // Add a row for each connection
    connections.forEach((connection, index) => {
        const teacher = availableTeachers.find(t => t.id === connection.teacherId);
        const classObj = classesNeeding.find(c => c.id === connection.classId);
        
        if (teacher && classObj) {
            tableBody.append(`
                <tr>
                    <td>${teacher.name}</td>
                    <td>${classObj.name}</td>
                    <td>${classObj.absentTeacher}</td>
                    <td>
                        <a href="#!" class="btn-small red remove-connection" data-index="${index}">
                            <i class="material-icons">delete</i>
                        </a>
                    </td>
                </tr>
            `);
        }
    });
    
    // Handle remove connection buttons
    $(".remove-connection").click(function() {
        const index = $(this).data("index");
        connections.splice(index, 1);
        displayConnectionsTable();
    });
    
    // If there are no connections, hide the table
    if (connections.length === 0) {
        connectionsTableContainer.hide();
    } else {
        connectionsTableContainer.show();
    }
}

// Update teacher select dropdown
function updateTeacherSelect() {
    const select = $("#teacher-select");
    select.empty();
    select.append('<option value="" disabled selected>Choose a teacher</option>');
    
    availableTeachers.forEach(teacher => {
        select.append(`<option value="${teacher.id}">${teacher.name}</option>`);
    });
    
    // Refresh materialize select
    select.formSelect();
}

// Update class select dropdown
function updateClassSelect() {
    const select = $("#class-select");
    select.empty();
    select.append('<option value="" disabled selected>Choose a class</option>');
    
    classesNeeding.forEach(classObj => {
        select.append(`<option value="${classObj.id}">${classObj.name} (Absent: ${classObj.absentTeacher})</option>`);
    });
    
    // Refresh materialize select
    select.formSelect();
}

// Run the substitution matching algorithm
function runSubstitutionMatching() {
    if (availableTeachers.length === 0 || classesNeeding.length === 0) {
        M.toast({html: 'Add teachers and classes before running matching', displayLength: 3000});
        return;
    }
    
    // Run the algorithm
    substitutionResults = runAlgorithm(availableTeachers, classesNeeding, connections);
    
    // Display results
    displaySubstitutionResults();
}

// Display the results of the substitution matching
function displaySubstitutionResults() {
    const resultsDiv = $("#results-content");
    resultsDiv.empty();
    
    if (substitutionResults.matching === 0) {
        resultsDiv.html(`<p class="red-text">No valid substitution assignments found.</p>`);
        return;
    }
    
    // Create result HTML
    let resultsHtml = `
        <p class="green-text">Found ${substitutionResults.matching} substitution assignments out of ${classesNeeding.length} classes.</p>
        <ul class="collection">
    `;
    
    // Process matching results
    substitutionResults.teachers.forEach(teacherVertex => {
        if (teacherVertex.mate) {
            const teacher = availableTeachers.find(t => t.id === teacherVertex.node.id);
            const classObj = classesNeeding.find(c => c.id === teacherVertex.mate.node.id);
            
            if (teacher && classObj) {
                resultsHtml += `
                    <li class="collection-item">
                        <span class="badge green white-text">ASSIGNED</span>
                        Teacher <b>${teacher.name}</b> will substitute class <b>${classObj.name}</b> 
                        (absent teacher: ${classObj.absentTeacher})
                    </li>
                `;
            }
        }
    });
    
    // Add unassigned classes
    const assignedClassIds = substitutionResults.teachers
        .filter(tv => tv.mate)
        .map(tv => tv.mate.node.id);
    
    const unassignedClasses = classesNeeding.filter(c => !assignedClassIds.includes(c.id));
    
    unassignedClasses.forEach(classObj => {
        resultsHtml += `
            <li class="collection-item">
                <span class="badge red white-text">UNASSIGNED</span>
                No substitute found for class <b>${classObj.name}</b> 
                (absent teacher: ${classObj.absentTeacher})
            </li>
        `;
    });
    
    resultsHtml += `</ul>`;
    resultsDiv.html(resultsHtml);
}

// Load sample data for testing
function loadSampleData() {
    // Clear existing data
    resetTeacherSubData();
    
    // Add sample teachers
    const teachers = [
        "Ms. Johnson",
        "Mr. Rodriguez",
        "Mrs. Smith",
        "Dr. Chen",
        "Ms. Wilson"
    ];
    
    teachers.forEach(teacher => {
        addAvailableTeacher(teacher);
    });
    
    // Add sample classes
    const classes = [
        { name: "Math 101", absent: "Mr. Davis" },
        { name: "English 202", absent: "Mrs. Garcia" },
        { name: "Physics 301", absent: "Dr. Patel" },
        { name: "History 103", absent: "Ms. Thompson" },
        { name: "Chemistry 205", absent: "Mr. Anderson" },
        { name: "Art 110", absent: "Ms. Martinez" }
    ];
    
    classes.forEach(cls => {
        addClass(cls.name, cls.absent);
    });
    
    // Add sample connections (who can teach what)
    const sampleConnections = [
        { teacher: 0, class: 0 }, // Ms. Johnson can teach Math 101
        { teacher: 0, class: 4 }, // Ms. Johnson can teach Chemistry 205
        { teacher: 1, class: 3 }, // Mr. Rodriguez can teach History 103
        { teacher: 1, class: 5 }, // Mr. Rodriguez can teach Art 110
        { teacher: 2, class: 1 }, // Mrs. Smith can teach English 202
        { teacher: 2, class: 3 }, // Mrs. Smith can teach History 103
        { teacher: 2, class: 5 }, // Mrs. Smith can teach Art 110
        { teacher: 3, class: 0 }, // Dr. Chen can teach Math 101
        { teacher: 3, class: 2 }, // Dr. Chen can teach Physics 301
        { teacher: 3, class: 4 }, // Dr. Chen can teach Chemistry 205
        { teacher: 4, class: 1 }, // Ms. Wilson can teach English 202
        { teacher: 4, class: 5 }  // Ms. Wilson can teach Art 110
    ];
    
    sampleConnections.forEach(conn => {
        const teacherId = "teacher-" + conn.teacher;
        const classId = "class-" + conn.class;
        addConnection(teacherId, classId);
    });
    
    // Update select dropdowns
    updateTeacherSelect();
    updateClassSelect();
    
    // Display connections table
    displayConnectionsTable();
    
    M.toast({html: 'Sample data loaded!', displayLength: 2000});
}

// Toggle fullscreen
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
} 