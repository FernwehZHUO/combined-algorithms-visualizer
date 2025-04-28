/**
 * Teacher Substitution Scheduler - Interface
 * This file contains the interface initialization and UI interaction logic
 */

// Global variables for import/export
var currentImportType = "all"; // "all", "teachers", "classes", "connections"
var currentExportType = "all"; // "all", "teachers", "classes", "connections"

// Initialize UI when document is ready
$(document).ready(function() {
    // Initialize Materialize components
    initializeMaterializeComponents();
    
    // Set up event listeners for modals
    setupModalEventListeners();
    
    // Set up window resize handling
    handleWindowResize();
    
    // Set up import/export functionality
    setupImportExport();
});

// Initialize Materialize components
function initializeMaterializeComponents() {
    // Initialize select dropdowns
    $('select').formSelect();
    
    // Initialize tooltips
    $('.tooltipped').tooltip();
    
    // Initialize floating action button
    $('.fixed-action-btn').floatingActionButton();
    
    // Initialize help carousel
    $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        indicators: true
    });
    
    // Set help modal swipe text
    $("#swipe-text").click(function() {
        $('.carousel').carousel('next');
    });
}

// Set up event listeners for modals
function setupModalEventListeners() {
    // Close help button
    $("#close-help").click(function() {
        $('#help-modal').modal('close');
    });
    
    // Modal close button
    $(".modal-close").click(function() {
        $(this).closest('.modal').modal('close');
    });
}

// Handle window resize
function handleWindowResize() {
    $(window).resize(function() {
        // Update graph size if visible
        if (!$("#graph-panel").parent().parent().is(":hidden")) {
            // Update graph width/height
            graphWidth = $("#graph-panel").width();
            graphHeight = $("#graph-panel").height();
            
            // Update svg dimensions
            d3.select("#graph")
                .attr("width", graphWidth)
                .attr("height", graphHeight);
            
            // Update force layout size
            force.size([graphWidth, graphHeight]);
            
            // Restart force layout
            force.start();
        }
    });
}

// Set up import/export functionality
function setupImportExport() {
    // Import teachers button
    $("#import-teachers-btn").click(function() {
        currentImportType = "teachers";
    });
    
    // Import classes button
    $("#import-classes-btn").click(function() {
        currentImportType = "classes";
    });
    
    // Import connections button
    $("#import-connections-btn").click(function() {
        currentImportType = "connections";
    });
    
    // Export teachers button
    $("#export-teachers-btn").click(function() {
        currentExportType = "teachers";
    });
    
    // Export classes button
    $("#export-classes-btn").click(function() {
        currentExportType = "classes";
    });
    
    // Export connections button
    $("#export-connections-btn").click(function() {
        currentExportType = "connections";
    });
    
    // Import data
    $("#import-data").change(function() {
        var file = this.files[0];
        
        if (file) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    var data = e.target.result;
                    var extension = file.name.split('.').pop().toLowerCase();
                    
                    if (extension === 'csv') {
                        importCSV(data, currentImportType);
                        $("#file-error").hide();
                        $("#import-btn").removeClass("disabled");
                    } else {
                        throw new Error("Only CSV files are supported");
                    }
                } catch (error) {
                    $("#file-error").show();
                    $("#import-btn").addClass("disabled");
                    console.error("Import error:", error);
                }
            };
            
            reader.readAsText(file);
        }
    });
    
    // Clear file input when modal is closed
    $("#import-close").click(function() {
        $("#import-data").val('');
        $("#import-text").val('');
        $("#file-error").hide();
        $("#import-btn").addClass("disabled");
        // Reset import type to all
        currentImportType = "all";
    });
    
    // Import button
    $("#import-btn").click(function() {
        $('#import-modal').modal('close');
        // Reset import type to all
        currentImportType = "all";
    });
    
    // Export button
    $("#export-btn").click(function() {
        exportCSV(currentExportType);
        
        // Reset export type to all
        currentExportType = "all";
    });
    
    // Reset when export modal is closed
    $("#export-close").click(function() {
        // Reset export type to all
        currentExportType = "all";
    });
}

// Import JSON data
function importJSON(data, type) {
    // Function removed - only CSV format is supported
}

// Import TXT data
function importTXT(data, type) {
    // Function removed - only CSV format is supported
}

// Import CSV data
function importCSV(data, type) {
    try {
        // Normalize line endings and remove BOM if present
        data = data.replace(/^\ufeff/, ''); // Remove BOM
        data = data.replace(/\r\n|\r/g, '\n'); // Normalize line endings
        
        var lines = data.split('\n');
        
        // Handle connections separately with a more robust approach
        if (type === "connections") {
            importConnectionsFromCSV(lines);
            return;
        }
        
        var headers = lines[0].split(',');
        
        // Reset current data based on type
        if (type === "all" || type === "teachers") {
            if (type === "all") {
                resetTeacherSubData();
            } else {
                // Only clear teacher data
                availableTeachers = [];
                $("#available-teachers-list").empty();
            }
            
            // Check if this is a teacher CSV
            if (headers.some(h => h.trim().toLowerCase() === "teacher" || h.trim().toLowerCase() === "teacher name" || h.trim().toLowerCase() === "name")) {
                var teacherNameIndex = headers.findIndex(h => 
                    h.trim().toLowerCase() === "teacher" || 
                    h.trim().toLowerCase() === "teacher name" || 
                    h.trim().toLowerCase() === "name");
                
                // Skip header row
                for (var i = 1; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line === "") {
                        continue;
                    }
                    
                    var values = line.split(',');
                    if (values.length > teacherNameIndex) {
                        var teacherName = values[teacherNameIndex].trim();
                        if (teacherName) {
                            addAvailableTeacher(teacherName);
                        }
                    }
                }
            }
        }
        
        // Import classes if type is all or classes
        if (type === "all" || type === "classes") {
            if (type === "classes") {
                // Only clear class data
                classesNeeding = [];
                $("#classes-list").empty();
            }
            
            // Check if this is a classes CSV
            if (headers.some(h => h.trim().toLowerCase() === "class" || h.trim().toLowerCase() === "class name") && 
                headers.some(h => h.trim().toLowerCase() === "absent teacher" || h.trim().toLowerCase() === "absent")) {
                
                var classNameIndex = headers.findIndex(h => 
                    h.trim().toLowerCase() === "class" || 
                    h.trim().toLowerCase() === "class name");
                
                var absentTeacherIndex = headers.findIndex(h => 
                    h.trim().toLowerCase() === "absent teacher" || 
                    h.trim().toLowerCase() === "absent");
                
                // Skip header row
                for (var i = 1; i < lines.length; i++) {
                    var line = lines[i].trim();
                    if (line === "") {
                        continue;
                    }
                    
                    var values = line.split(',');
                    if (values.length > Math.max(classNameIndex, absentTeacherIndex)) {
                        var className = values[classNameIndex].trim();
                        var absentTeacher = values[absentTeacherIndex].trim();
                        if (className && absentTeacher) {
                            addClass(className, absentTeacher);
                        }
                    }
                }
            }
        }
        
        // Import all data type
        if (type === "all") {
            // Try to import connections from the same file
            importConnectionsFromCSV(lines);
        }
        
        // Update select dropdowns
        updateTeacherSelect();
        updateClassSelect();
        
        // Display connections table
        displayConnectionsTable();
        
        M.toast({html: 'Data imported successfully!', displayLength: 2000});
    } catch (error) {
        M.toast({html: 'Error importing data: Invalid CSV format', displayLength: 3000});
        console.error("CSV import error:", error);
    }
}

// Specialized function to import connections from CSV data
function importConnectionsFromCSV(lines) {
    console.log("Attempting to import connections from CSV");
    
    // Only clear connections data for connections import
    if (currentImportType === "connections") {
        connections = [];
    }
    
    // Try multiple approaches to find the right format
    var success = false;
    
    // Approach 1: Look for specific headers (Teacher ID, Class ID)
    if (lines.length > 0) {
        var headerLine = lines[0];
        var headers = headerLine.split(',');
        
        var teacherIdIndex = -1;
        var classIdIndex = -1;
        
        // Find indices of required columns with flexible matching
        for (var i = 0; i < headers.length; i++) {
            var header = headers[i].trim().toLowerCase();
            
            if (header.includes("teacher") && header.includes("id")) {
                teacherIdIndex = i;
            }
            
            if (header.includes("class") && header.includes("id")) {
                classIdIndex = i;
            }
        }
        
        // If we found both required columns
        if (teacherIdIndex >= 0 && classIdIndex >= 0) {
            console.log("Found Teacher ID and Class ID columns at indices:", teacherIdIndex, classIdIndex);
            
            // Process data rows
            for (var i = 1; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line === "") continue;
                
                // Handle both comma and tab separated values
                var values = line.includes('\t') ? line.split('\t') : line.split(',');
                
                if (values.length > Math.max(teacherIdIndex, classIdIndex)) {
                    var teacherId = values[teacherIdIndex].trim();
                    var classId = values[classIdIndex].trim();
                    
                    console.log("Processing connection:", teacherId, classId);
                    
                    if (teacherId && classId) {
                        addConnection(teacherId, classId);
                        success = true;
                    }
                }
            }
        }
    }
    
    // Approach 2: Fallback to assuming the first two columns are teacher ID and class ID
    if (!success && currentImportType === "connections") {
        console.log("Trying fallback approach for connections import");
        
        // Determine if first line is a header
        var startRow = 0;
        if (lines[0].toLowerCase().includes("teacher") || lines[0].toLowerCase().includes("class")) {
            startRow = 1;
        }
        
        for (var i = startRow; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line === "") continue;
            
            // Try both comma and tab as separators
            var values = line.includes('\t') ? line.split('\t') : line.split(',');
            
            if (values.length >= 2) {
                var teacherId = values[0].trim();
                var classId = values[1].trim();
                
                // Check if they match the expected format for IDs
                if (teacherId && classId && 
                    teacherId.toLowerCase().includes("teacher") && 
                    classId.toLowerCase().includes("class")) {
                    
                    console.log("Adding connection from fallback:", teacherId, classId);
                    addConnection(teacherId, classId);
                    success = true;
                }
            }
        }
    }
    
    // Approach 3: Last resort - just try lines directly if they look like "teacher-X,class-Y"
    if (!success && currentImportType === "connections") {
        console.log("Trying last resort approach for connections");
        
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line === "" || line.toLowerCase().includes("teacher id")) continue;
            
            // Check if line directly matches the pattern teacher-X,class-Y
            var match = line.match(/^(teacher-\d+)[,\t](class-\d+)/i);
            if (match) {
                var teacherId = match[1];
                var classId = match[2];
                
                console.log("Direct match found:", teacherId, classId);
                addConnection(teacherId, classId);
                success = true;
            }
        }
    }
    
    if (success) {
        console.log("Successfully imported connections");
    } else {
        console.log("Failed to import any connections");
    }
}

// Export data as JSON
function exportJSON(type) {
    // Function removed - only CSV format is supported
}

// Export data as TXT
function exportTXT(type) {
    // Function removed - only CSV format is supported
}

// Export data as CSV
function exportCSV(type) {
    var csv = "";
    
    if (type === "teachers") {
        // Export teachers only
        csv = "Teacher Name\n";
        availableTeachers.forEach(function(teacher) {
            csv += teacher.name + "\n";
        });
        downloadFile("teachers.csv", csv);
    } else if (type === "classes") {
        // Export classes only
        csv = "Class Name,Absent Teacher\n";
        classesNeeding.forEach(function(cls) {
            csv += cls.name + "," + cls.absentTeacher + "\n";
        });
        downloadFile("classes.csv", csv);
    } else if (type === "connections") {
        // Export connections only
        csv = "Teacher ID,Class ID,Teacher Name,Class Name,Absent Teacher\n";
        connections.forEach(function(conn) {
            var teacher = availableTeachers.find(t => t.id === conn.teacherId);
            var classObj = classesNeeding.find(c => c.id === conn.classId);
            if (teacher && classObj) {
                csv += conn.teacherId + "," + conn.classId + "," + teacher.name + "," + classObj.name + "," + classObj.absentTeacher + "\n";
            }
        });
        downloadFile("connections.csv", csv);
    } else if (type === "all") {
        // Export all data as separate CSV files
        
        // Teachers CSV
        var teachersCSV = "Teacher ID,Teacher Name\n";
        availableTeachers.forEach(function(teacher) {
            teachersCSV += teacher.id + "," + teacher.name + "\n";
        });
        downloadFile("teachers.csv", teachersCSV);
        
        // Classes CSV
        var classesCSV = "Class ID,Class Name,Absent Teacher\n";
        classesNeeding.forEach(function(cls) {
            classesCSV += cls.id + "," + cls.name + "," + cls.absentTeacher + "\n";
        });
        downloadFile("classes.csv", classesCSV);
        
        // Connections CSV
        var connectionsCSV = "Teacher ID,Class ID,Teacher Name,Class Name\n";
        connections.forEach(function(conn) {
            var teacher = availableTeachers.find(t => t.id === conn.teacherId);
            var classObj = classesNeeding.find(c => c.id === conn.classId);
            if (teacher && classObj) {
                connectionsCSV += conn.teacherId + "," + conn.classId + "," + teacher.name + "," + classObj.name + "\n";
            }
        });
        downloadFile("connections.csv", connectionsCSV);
    }
}

// Helper function to download a file
function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
} 