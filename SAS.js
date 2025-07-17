
// Global Variables
let currentUser = null;
let currentRole = 'Admin_Aashik';
let students = [];
let faculty = [];
let attendance = {};
let currentTab = '';

// Demo Data
const demoCredentials = {
    admin: { id: 'admin', password: 'admin123', name: 'Administrator_Aashik' },
    faculty: { id: 'faculty', password: 'faculty123', name: 'Aashik', classes: ['10A', '11B'] },
    student: { id: 'S001', password: 'student123', name: 'John Doe', class: '5H', email: 'john@school.com' }
};

// Initialize demo data
function initializeDemoData() {
    // Demo students
    students = [
        { id: 'S001', name: 'Aashik Thakor', class: '5H', email: 'john@school.com' },
        { id: 'S002', name: 'Birva Patel', class: '5H', email: 'jane@school.com' },
        { id: 'S003', name: 'Utsav Patel', class: '5H', email: 'mike@school.com' },
        { id: 'S004', name: 'Advait Soni', class: '11B', email: 'sarah@school.com' },
        { id: 'S005', name: 'Kalu Chaudhary', class: '12A', email: 'david@school.com' },
        { id: 'S006', name: 'Kush Patel', class: '12B', email: 'emily@school.com' },
        { id: 'S007', name: 'Stuti Shah', class: '11A', email: 'alex@school.com' },
        { id: 'S008', name: 'Arjun Thakor', class: '10A', email: 'maria@school.com' }
    ];

    // Demo faculty
    faculty = [
        { id: 'F001', name: 'Prof. Aashik', subject: 'Computer Science', email: 'aashik@school.com', classes: ['10A', '11B','5H'] },
        { id: 'F002', name: 'Prof. Johnson', subject: 'Physics', email: 'johnson@school.com', classes: ['12A'] },
        { id: 'F003', name: 'Ms. Brown', subject: 'Chemistry', email: 'brown@school.com', classes: ['10B', '5H'] },
        { id: 'F004', name: 'Mr. Davis', subject: 'Biology', email: 'davis@school.com', classes: ['11A', '12B'] }
    ];

    // Demo attendance data
    const today = new Date().toISOString().split('T')[0];
    attendance[today] = {};

    students.forEach(student => {
        if (!attendance[today][student.id]) {
            attendance[today][student.id] = Math.random() > 0.2 ? 'present' : 'absent';
        }
    });

    // Generate some historical data
    for (let i = 1; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        attendance[dateStr] = {};

        students.forEach(student => {
            attendance[dateStr][student.id] = Math.random() > 0.15 ? 'present' : 'absent';
        });
    }
}

// Helper function to display alerts
function showAlert(element, message, type) {
    element.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        element.innerHTML = '';
    }, 3000);
}

// Role Selection
function selectRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Login Function
function login() {
    const id = document.getElementById('loginId').value.trim();
    const password = document.getElementById('loginPassword').value;
    const alertDiv = document.getElementById('loginAlert');

    if (!id || !password) {
        showAlert(alertDiv, 'Please enter both ID and password', 'danger');
        return;
    }

    // Check credentials
    const userCredentials = demoCredentials[currentRole];
    if (userCredentials && id === userCredentials.id && password === userCredentials.password) {
        currentUser = {
            id: id,
            name: userCredentials.name,
            role: currentRole,
            class: userCredentials.class, // For student
            classes: userCredentials.classes, // For faculty
            email: userCredentials.email, // For faculty and student
            subject: userCredentials.subject // For faculty
        };

        // Hide login screen and show main app
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');

        // Update user info
        document.getElementById('userRole').textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
        document.getElementById('userName').textContent = currentUser.name;

        // Show appropriate navigation and default tab
        showRoleInterface();

        showAlert(alertDiv, 'Login successful!', 'success');
    } else {
        showAlert(alertDiv, 'Invalid credentials', 'danger');
    }
}

// Logout Function
function logout() {
    currentUser = null;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');

    // Clear login form
    document.getElementById('loginId').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginAlert').innerHTML = '';

    // Reset to admin role
    currentRole = 'admin';
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.role-btn').classList.add('active');
}

// Show Role Interface
function showRoleInterface() {
    // Hide all navigation tabs and content
    document.getElementById('adminNav').classList.add('hidden');
    document.getElementById('facultyNav').classList.add('hidden');
    document.getElementById('studentNav').classList.add('hidden');
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Show relevant navigation and default tab
    if (currentUser.role === 'admin') {
        document.getElementById('adminNav').classList.remove('hidden');
        showTab('admin-dashboard');
        updateAdminDashboard();
        listAdminStudents();
        listFaculty();
    } else if (currentUser.role === 'faculty') {
        document.getElementById('facultyNav').classList.remove('hidden');
        showTab('faculty-dashboard');
        updateFacultyDashboard();
        loadFacultyProfile();
    } else if (currentUser.role === 'student') {
        document.getElementById('studentNav').classList.remove('hidden');
        showTab('student-dashboard');
        updateStudentDashboard();
        loadStudentProfile();
    }
}

// Show Tab Function
function showTab(tabId) {
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Add active class to clicked button
    const clickedButton = document.querySelector(`.nav-tab[onclick="showTab('${tabId}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    currentTab = tabId;

    // Perform specific updates when a tab is shown
    if (tabId === 'admin-dashboard') {
        updateAdminDashboard();
    } else if (tabId === 'admin-students') {
        listAdminStudents();
    } else if (tabId === 'admin-faculty') {
        listFaculty();
    } else if (tabId === 'admin-attendance') {
        renderAdminAttendance();
    } else if (tabId === 'faculty-dashboard') {
        updateFacultyDashboard();
    } else if (tabId === 'faculty-attendance') {
        // Set today's date
        document.getElementById('facultyAttendanceDate').valueAsDate = new Date();
        loadFacultyStudents();
    } else if (tabId === 'faculty-reports') {
        generateFacultyReport();
    } else if (tabId === 'faculty-profile') {
        loadFacultyProfile();
    } else if (tabId === 'student-dashboard') {
        updateStudentDashboard();
    } else if (tabId === 'student-attendance') {
        document.getElementById('studentAttendanceMonth').value = new Date().toISOString().slice(0, 7);
        loadStudentAttendance();
    } else if (tabId === 'student-profile') {
        loadStudentProfile();
    }
}

// --- Admin Functions ---

function updateAdminDashboard() {
    document.getElementById('totalStudentsAdmin').textContent = students.length;
    document.getElementById('totalFaculty').textContent = faculty.length;

    const uniqueClasses = new Set(students.map(s => s.class));
    document.getElementById('totalClasses').textContent = uniqueClasses.size;

    let totalAttendanceDays = 0;
    let totalPresentDays = 0;

    for (const date in attendance) {
        for (const studentId in attendance[date]) {
            totalAttendanceDays++;
            if (attendance[date][studentId] === 'present') {
                totalPresentDays++;
            }
        }
    }

    const avgAttendance = totalAttendanceDays > 0 ? ((totalPresentDays / totalAttendanceDays) * 100).toFixed(2) : 0;
    document.getElementById('avgAttendanceAdmin').textContent = `${avgAttendance}%`;

    let overviewHtml = `
        <p>Welcome, <strong>${currentUser.name}</strong>. Here's a quick overview of the system:</p>
        <ul>
            <li>You can manage student and faculty information.</li>
            <li>Monitor daily attendance and generate detailed reports.</li>
        </ul>
    `;
    document.getElementById('adminOverview').innerHTML = overviewHtml;
}

function addStudentAdmin() {
    const name = document.getElementById('adminStudentName').value.trim();
    const id = document.getElementById('adminStudentId').value.trim();
    const studentClass = document.getElementById('adminStudentClass').value;
    const email = document.getElementById('adminStudentEmail').value.trim();
    const alertDiv = document.getElementById('adminStudentAlert');

    if (!name || !id || !studentClass || !email) {
        showAlert(alertDiv, 'All fields are required to add a student.', 'danger');
        return;
    }

    if (students.some(s => s.id === id)) {
        showAlert(alertDiv, 'Student ID already exists.', 'danger');
        return;
    }

    const newStudent = { id, name, class: studentClass, email };
    students.push(newStudent);
    showAlert(alertDiv, `Student ${name} added successfully!`, 'success');
    clearStudentForm();
    listAdminStudents(); // Refresh the list
    updateAdminDashboard(); // Update dashboard stats
}

function clearStudentForm() {
    document.getElementById('adminStudentName').value = '';
    document.getElementById('adminStudentId').value = '';
    document.getElementById('adminStudentClass').value = '';
    document.getElementById('adminStudentEmail').value = '';
}

function listAdminStudents() {
    const studentDisplay = document.getElementById('adminStudentsDisplay');
    studentDisplay.innerHTML = ''; // Clear previous list

    if (students.length === 0) {
        studentDisplay.innerHTML = '<p>No students registered yet.</p>';
        return;
    }

    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.classList.add('student-card');
        studentCard.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Class:</strong> ${student.class}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <button class="btn btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
        `;
        studentDisplay.appendChild(studentCard);
    });
}

function searchAdminStudents() {
    const searchTerm = document.getElementById('searchAdminStudents').value.toLowerCase();
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm) ||
        student.class.toLowerCase().includes(searchTerm)
    );
    renderFilteredStudents(filteredStudents);
}

function renderFilteredStudents(filteredStudents) {
    const studentDisplay = document.getElementById('adminStudentsDisplay');
    studentDisplay.innerHTML = '';

    if (filteredStudents.length === 0) {
        studentDisplay.innerHTML = '<p>No students found matching your search.</p>';
        return;
    }

    filteredStudents.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.classList.add('student-card');
        studentCard.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Class:</strong> ${student.class}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <button class="btn btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
        `;
        studentDisplay.appendChild(studentCard);
    });
}

function deleteStudent(studentId) {
    if (confirm(`Are you sure you want to delete student with ID ${studentId}?`)) {
        students = students.filter(s => s.id !== studentId);
        // Also remove attendance records for this student
        for (const date in attendance) {
            delete attendance[date][studentId];
        }
        showAlert(document.getElementById('adminStudentAlert'), `Student ${studentId} deleted successfully.`, 'success');
        listAdminStudents();
        updateAdminDashboard();
    }
}

function clearAllStudents() {
    if (confirm('Are you sure you want to delete ALL students? This action cannot be undone.')) {
        students = [];
        attendance = {}; // Clear all attendance as well
        showAlert(document.getElementById('adminStudentAlert'), 'All students cleared.', 'success');
        listAdminStudents();
        updateAdminDashboard();
    }
}

function addFaculty() {
    const name = document.getElementById('facultyName').value.trim();
    const id = document.getElementById('facultyId').value.trim();
    const subject = document.getElementById('facultySubject').value.trim();
    const email = document.getElementById('facultyEmail').value.trim();
    const alertDiv = document.getElementById('adminFacultyAlert');

    if (!name || !id || !subject || !email) {
        showAlert(alertDiv, 'All fields are required to add faculty.', 'danger');
        return;
    }

    if (faculty.some(f => f.id === id)) {
        showAlert(alertDiv, 'Faculty ID already exists.', 'danger');
        return;
    }

    const newFaculty = { id, name, subject, email, classes: [] }; // You might add a way to assign classes later
    faculty.push(newFaculty);
    showAlert(alertDiv, `Faculty ${name} added successfully!`, 'success');
    clearFacultyForm();
    listFaculty();
    updateAdminDashboard();
}

function clearFacultyForm() {
    document.getElementById('facultyName').value = '';
    document.getElementById('facultyId').value = '';
    document.getElementById('facultySubject').value = '';
    document.getElementById('facultyEmail').value = '';
}

function listFaculty() {
    const facultyDisplay = document.getElementById('facultyDisplay');
    facultyDisplay.innerHTML = '';

    if (faculty.length === 0) {
        facultyDisplay.innerHTML = '<p>No faculty registered yet.</p>';
        return;
    }

    faculty.forEach(f => {
        const facultyCard = document.createElement('div');
        facultyCard.classList.add('student-card'); // Reusing student-card style
        facultyCard.innerHTML = `
            <h3>${f.name}</h3>
            <p><strong>ID:</strong> ${f.id}</p>
            <p><strong>Subject:</strong> ${f.subject}</p>
            <p><strong>Email:</strong> ${f.email}</p>
            <button class="btn btn-danger" onclick="deleteFaculty('${f.id}')">Delete</button>
        `;
        facultyDisplay.appendChild(facultyCard);
    });
}

function deleteFaculty(facultyId) {
    if (confirm(`Are you sure you want to delete faculty with ID ${facultyId}?`)) {
        faculty = faculty.filter(f => f.id !== facultyId);
        showAlert(document.getElementById('adminFacultyAlert'), `Faculty ${facultyId} deleted successfully.`, 'success');
        listFaculty();
        updateAdminDashboard();
    }
}

function clearAllFaculty() {
    if (confirm('Are you sure you want to delete ALL faculty? This action cannot be undone.')) {
        faculty = [];
        showAlert(document.getElementById('adminFacultyAlert'), 'All faculty cleared.', 'success');
        listFaculty();
        updateAdminDashboard();
    }
}

function renderAdminAttendance() {
    const adminAttendanceDisplay = document.getElementById('adminAttendanceDisplay');
    const date = document.getElementById('adminAttendanceDate').value;
    const selectedClass = document.getElementById('adminClassFilter').value;
    adminAttendanceDisplay.innerHTML = '';

    const dates = Object.keys(attendance).sort((a, b) => new Date(b) - new Date(a));
    if (dates.length === 0) {
        adminAttendanceDisplay.innerHTML = '<p>No attendance data available.</p>';
        return;
    }

    let tableHtml = `
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    let filteredRecords = [];

    dates.forEach(attDate => {
        if (date && attDate !== date) return; // Filter by specific date if selected

        for (const studentId in attendance[attDate]) {
            const student = students.find(s => s.id === studentId);
            if (student) {
                if (selectedClass && student.class !== selectedClass) continue; // Filter by class

                const status = attendance[attDate][studentId];
                filteredRecords.push({
                    date: attDate,
                    id: student.id,
                    name: student.name,
                    class: student.class,
                    status: status
                });
            }
        }
    });

    if (filteredRecords.length === 0) {
        adminAttendanceDisplay.innerHTML = '<p>No attendance records found for the selected filters.</p>';
        return;
    }

    filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date) || a.name.localeCompare(b.name));

    filteredRecords.forEach(record => {
        tableHtml += `
            <tr>
                <td>${record.date}</td>
                <td>${record.id}</td>
                <td>${record.name}</td>
                <td>${record.class}</td>
                <td><span class="attendance-status status-${record.status}">${record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;
    adminAttendanceDisplay.innerHTML = tableHtml;
}

function filterAdminAttendance() {
    renderAdminAttendance();
}

function generateAdminAttendanceReport() {
    renderAdminAttendance(); // Simply re-renders with current filters
    showAlert(document.getElementById('adminAttendanceDisplay').parentElement, 'Attendance report generated below.', 'success');
}

function generateAdminReport() {
    const reportType = document.getElementById('adminReportType').value;
    const reportClass = document.getElementById('adminReportClass').value;
    const reportDisplay = document.getElementById('adminReportDisplay');
    reportDisplay.innerHTML = '';

    let reportHtml = ``;

    if (reportType === 'attendance') {
        let relevantStudents = students;
        if (reportClass) {
            relevantStudents = students.filter(s => s.class === reportClass);
        }

        if (relevantStudents.length === 0) {
            reportDisplay.innerHTML = '<p>No students found for this class or no attendance data.</p>';
            return;
        }

        reportHtml += `<h3>Overall Attendance Report ${reportClass ? `for Class ${reportClass}` : 'All Classes'}</h3>`;
        reportHtml += `<table class="attendance-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Class</th>
                                <th>Total Days</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>`;

        relevantStudents.forEach(student => {
            let totalDays = 0;
            let presentDays = 0;
            for (const date in attendance) {
                if (attendance[date][student.id]) {
                    totalDays++;
                    if (attendance[date][student.id] === 'present') {
                        presentDays++;
                    }
                }
            }
            const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
            reportHtml += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${totalDays}</td>
                    <td>${presentDays}</td>
                    <td>${totalDays - presentDays}</td>
                    <td>${percentage}%
                        <div class="percentage-bar"><div class="percentage-fill" style="width: ${percentage}%"></div></div>
                    </td>
                </tr>
            `;
        });

        reportHtml += `</tbody></table>`;
    } else if (reportType === 'students') {
        let relevantStudents = students;
        if (reportClass) {
            relevantStudents = students.filter(s => s.class === reportClass);
        }
        reportHtml += `<h3>Student List Report ${reportClass ? `for Class ${reportClass}` : 'All Students'}</h3>`;
        reportHtml += `<table class="attendance-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>`;
        relevantStudents.forEach(student => {
            reportHtml += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.email}</td>
                </tr>
            `;
        });
        reportHtml += `</tbody></table>`;
    } else if (reportType === 'faculty') {
        reportHtml += `<h3>Faculty List Report</h3>`;
        reportHtml += `<table class="attendance-table">
                        <thead>
                            <tr>
                                <th>Faculty ID</th>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>`;
        faculty.forEach(f => {
            reportHtml += `
                <tr>
                    <td>${f.id}</td>
                    <td>${f.name}</td>
                    <td>${f.subject}</td>
                    <td>${f.email}</td>
                </tr>
            `;
        });
        reportHtml += `</tbody></table>`;
    }
    reportDisplay.innerHTML = reportHtml;
}

function exportAdminReport() {
    const reportType = document.getElementById('adminReportType').value;
    const reportClass = document.getElementById('adminReportClass').value;
    let data = [];
    let filename = '';
    let headers = [];

    if (reportType === 'attendance') {
        let relevantStudents = students;
        if (reportClass) {
            relevantStudents = students.filter(s => s.class === reportClass);
        }
        headers = ['Student ID', 'Student Name', 'Class', 'Total Days', 'Present', 'Absent', 'Percentage'];
        relevantStudents.forEach(student => {
            let totalDays = 0;
            let presentDays = 0;
            for (const date in attendance) {
                if (attendance[date][student.id]) {
                    totalDays++;
                    if (attendance[date][student.id] === 'present') {
                        presentDays++;
                    }
                }
            }
            const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
            data.push([student.id, student.name, student.class, totalDays, presentDays, totalDays - presentDays, `${percentage}%`]);
        });
        filename = `attendance_report${reportClass ? `_${reportClass}` : ''}.csv`;
    } else if (reportType === 'students') {
        let relevantStudents = students;
        if (reportClass) {
            relevantStudents = students.filter(s => s.class === reportClass);
        }
        headers = ['Student ID', 'Name', 'Class', 'Email'];
        relevantStudents.forEach(student => {
            data.push([student.id, student.name, student.class, student.email]);
        });
        filename = `students_report${reportClass ? `_${reportClass}` : ''}.csv`;
    } else if (reportType === 'faculty') {
        headers = ['Faculty ID', 'Name', 'Subject', 'Email'];
        faculty.forEach(f => {
            data.push([f.id, f.name, f.subject, f.email]);
        });
        filename = 'faculty_report.csv';
    }

    if (data.length === 0) {
        showAlert(document.getElementById('adminReportDisplay').parentElement, 'No data to export for the selected report.', 'warning');
        return;
    }

    let csvContent = headers.join(',') + '\n';
    data.forEach(row => {
        csvContent += row.map(item => `"${item}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showAlert(document.getElementById('adminReportDisplay').parentElement, `Report exported as ${filename}`, 'success');
    }
}


// --- Faculty Functions ---

function updateFacultyDashboard() {
    const facultyAssignedClasses = currentUser.classes || [];
    let studentsInAssignedClasses = students.filter(student => facultyAssignedClasses.includes(student.class));

    document.getElementById('facultyTotalStudents').textContent = studentsInAssignedClasses.length;

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance[today] || {};

    let presentToday = 0;
    let absentToday = 0;

    studentsInAssignedClasses.forEach(student => {
        if (todayAttendance[student.id] === 'present') {
            presentToday++;
        } else if (todayAttendance[student.id] === 'absent') {
            absentToday++;
        }
    });

    document.getElementById('facultyPresentToday').textContent = presentToday;
    document.getElementById('facultyAbsentToday').textContent = absentToday;

    let totalAttendanceRecords = 0;
    let totalPresentRecords = 0;

    for (const date in attendance) {
        studentsInAssignedClasses.forEach(student => {
            if (attendance[date][student.id]) {
                totalAttendanceRecords++;
                if (attendance[date][student.id] === 'present') {
                    totalPresentRecords++;
                }
            }
        });
    }

    const facultyAvgAttendance = totalAttendanceRecords > 0 ? ((totalPresentRecords / totalAttendanceRecords) * 100).toFixed(2) : 0;
    document.getElementById('facultyAvgAttendance').textContent = `${facultyAvgAttendance}%`;

    let summaryHtml = `
        <p>Hello, <strong>${currentUser.name}</strong>. Here's a summary for today's attendance in your assigned classes (${facultyAssignedClasses.join(', ')}):</p>
        <ul>
            <li>Total students in your classes: ${studentsInAssignedClasses.length}</li>
            <li>Students marked Present today: ${presentToday}</li>
            <li>Students marked Absent today: ${absentToday}</li>
        </ul>
        <p>Don't forget to mark attendance for today!</p>
    `;
    document.getElementById('facultyTodaySummary').innerHTML = summaryHtml;
}

function loadFacultyStudents() {
    const selectedClass = document.getElementById('facultyClassSelect').value;
    const facultyAttendanceList = document.getElementById('facultyAttendanceList');
    facultyAttendanceList.innerHTML = '';

    if (!selectedClass) {
        facultyAttendanceList.innerHTML = '<p>Please select a class to mark attendance.</p>';
        return;
    }

    const today = document.getElementById('facultyAttendanceDate').value;
    if (!today) {
        showAlert(document.getElementById('facultyAttendanceAlert'), 'Please select a date.', 'danger');
        return;
    }

    const studentsInClass = students.filter(student => student.class === selectedClass);

    if (studentsInClass.length === 0) {
        facultyAttendanceList.innerHTML = '<p>No students found in this class.</p>';
        return;
    }

    let tableHtml = `
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    studentsInClass.forEach(student => {
        const currentStatus = attendance[today] && attendance[today][student.id] ? attendance[today][student.id] : 'absent';
        tableHtml += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>
                    <select id="status-${student.id}" class="form-group-inline">
                        <option value="present" ${currentStatus === 'present' ? 'selected' : ''}>Present</option>
                        <option value="absent" ${currentStatus === 'absent' ? 'selected' : ''}>Absent</option>
                        <option value="late" ${currentStatus === 'late' ? 'selected' : ''}>Late</option>
                    </select>
                </td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;
    facultyAttendanceList.innerHTML = tableHtml;
}

function markAllPresentFaculty() {
    const selectedClass = document.getElementById('facultyClassSelect').value;
    if (!selectedClass) {
        showAlert(document.getElementById('facultyAttendanceAlert'), 'Please select a class first.', 'danger');
        return;
    }
    const studentsInClass = students.filter(student => student.class === selectedClass);
    studentsInClass.forEach(student => {
        const selectElement = document.getElementById(`status-${student.id}`);
        if (selectElement) {
            selectElement.value = 'present';
        }
    });
    showAlert(document.getElementById('facultyAttendanceAlert'), 'All students marked Present.', 'success');
}

function markAllAbsentFaculty() {
    const selectedClass = document.getElementById('facultyClassSelect').value;
    if (!selectedClass) {
        showAlert(document.getElementById('facultyAttendanceAlert'), 'Please select a class first.', 'danger');
        return;
    }
    const studentsInClass = students.filter(student => student.class === selectedClass);
    studentsInClass.forEach(student => {
        const selectElement = document.getElementById(`status-${student.id}`);
        if (selectElement) {
            selectElement.value = 'absent';
        }
    });
    showAlert(document.getElementById('facultyAttendanceAlert'), 'All students marked Absent.', 'success');
}

function saveFacultyAttendance() {
    const selectedClass = document.getElementById('facultyClassSelect').value;
    const date = document.getElementById('facultyAttendanceDate').value;
    const alertDiv = document.getElementById('facultyAttendanceAlert');

    if (!selectedClass || !date) {
        showAlert(alertDiv, 'Please select a class and date.', 'danger');
        return;
    }

    if (!attendance[date]) {
        attendance[date] = {};
    }

    const studentsInClass = students.filter(student => student.class === selectedClass);
    studentsInClass.forEach(student => {
        const selectElement = document.getElementById(`status-${student.id}`);
        if (selectElement) {
            attendance[date][student.id] = selectElement.value;
        }
    });

    showAlert(alertDiv, `Attendance for ${selectedClass} on ${date} saved successfully!`, 'success');
    updateFacultyDashboard();
}

function generateFacultyReport() {
    const selectedClass = document.getElementById('facultyReportClass').value;
    const facultyReportDisplay = document.getElementById('facultyReportDisplay');
    facultyReportDisplay.innerHTML = '';

    if (!selectedClass) {
        facultyReportDisplay.innerHTML = '<p>Please select a class to generate a report.</p>';
        return;
    }

    const studentsInClass = students.filter(student => student.class === selectedClass);

    if (studentsInClass.length === 0) {
        facultyReportDisplay.innerHTML = '<p>No students found in this class.</p>';
        return;
    }

    let reportHtml = `<h3>Attendance Report for Class ${selectedClass}</h3>`;
    reportHtml += `<table class="attendance-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Total Days</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>`;

    studentsInClass.forEach(student => {
        let totalDays = 0;
        let presentDays = 0;
        for (const date in attendance) {
            if (attendance[date][student.id]) {
                totalDays++;
                if (attendance[date][student.id] === 'present') {
                    presentDays++;
                }
            }
        }
        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
        reportHtml += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${totalDays}</td>
                <td>${presentDays}</td>
                <td>${totalDays - presentDays}</td>
                <td>${percentage}%
                    <div class="percentage-bar"><div class="percentage-fill" style="width: ${percentage}%"></div></div>
                </td>
            </tr>
        `;
    });

    reportHtml += `</tbody></table>`;
    facultyReportDisplay.innerHTML = reportHtml;
}

function exportFacultyReport() {
    const selectedClass = document.getElementById('facultyReportClass').value;
    if (!selectedClass) {
        showAlert(document.getElementById('facultyReportDisplay').parentElement, 'Please select a class to export.', 'danger');
        return;
    }

    const studentsInClass = students.filter(student => student.class === selectedClass);
    if (studentsInClass.length === 0) {
        showAlert(document.getElementById('facultyReportDisplay').parentElement, 'No students in this class to export.', 'warning');
        return;
    }

    let data = [];
    let headers = ['Student ID', 'Student Name', 'Total Days', 'Present', 'Absent', 'Percentage'];

    studentsInClass.forEach(student => {
        let totalDays = 0;
        let presentDays = 0;
        for (const date in attendance) {
            if (attendance[date][student.id]) {
                totalDays++;
                if (attendance[date][student.id] === 'present') {
                    presentDays++;
                }
            }
        }
        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
        data.push([student.id, student.name, totalDays, presentDays, totalDays - presentDays, `${percentage}%`]);
    });

    let csvContent = headers.join(',') + '\n';
    data.forEach(row => {
        csvContent += row.map(item => `"${item}"`).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `class_${selectedClass}_attendance_report.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showAlert(document.getElementById('facultyReportDisplay').parentElement, `Report exported as class_${selectedClass}_attendance_report.csv`, 'success');
    }
}

function loadFacultyProfile() {
    document.getElementById('facultyProfileName').textContent = currentUser.name;
    document.getElementById('facultyProfileId').textContent = currentUser.id;
    document.getElementById('facultyProfileSubject').textContent = currentUser.subject;
    document.getElementById('facultyProfileEmail').textContent = currentUser.email;
    document.getElementById('facultyProfileClasses').textContent = currentUser.classes ? currentUser.classes.join(', ') : 'N/A';
}

function editFacultyProfile() {
    // In a real application, this would open a modal or navigate to an edit page.
    // For this demo, we'll just show an alert.
    alert('Faculty profile editing functionality is not implemented in this demo. You can imagine a form popping up here!');
}

// --- Student Functions ---

function updateStudentDashboard() {
    const student = students.find(s => s.id === currentUser.id);
    if (!student) {
        document.getElementById('studentAttendanceSummary').innerHTML = '<p>Student data not found.</p>';
        return;
    }

    let totalDays = 0;
    let presentDays = 0;
    let absentDays = 0;

    for (const date in attendance) {
        if (attendance[date][student.id]) {
            totalDays++;
            if (attendance[date][student.id] === 'present') {
                presentDays++;
            } else if (attendance[date][student.id] === 'absent') {
                absentDays++;
            }
        }
    }

    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    document.getElementById('studentTotalDays').textContent = totalDays;
    document.getElementById('studentPresentDays').textContent = presentDays;
    document.getElementById('studentAbsentDays').textContent = absentDays;
    document.getElementById('studentAttendancePercentage').textContent = `${attendancePercentage}%`;

    document.getElementById('studentProfileAttendance').textContent = `${attendancePercentage}%`;
    document.getElementById('studentProfileBar').style.width = `${attendancePercentage}%`;


    let summaryHtml = `
        <p>Hello, <strong>${currentUser.name}</strong>. Here's a summary of your attendance:</p>
        <ul>
            <li>You have attended <strong>${presentDays}</strong> out of <strong>${totalDays}</strong> total recorded days.</li>
            <li>Your overall attendance rate is <strong>${attendancePercentage}%</strong>.</li>
            ${attendancePercentage < 75 && totalDays > 0 ? '<li style="color:red; font-weight:bold;">Warning: Your attendance is below 75%. Please improve!</li>' : ''}
        </ul>
    `;
    document.getElementById('studentAttendanceSummary').innerHTML = summaryHtml;
}

function loadStudentAttendance() {
    const selectedMonth = document.getElementById('studentAttendanceMonth').value; // YYYY-MM
    const studentAttendanceDisplay = document.getElementById('studentAttendanceDisplay');
    studentAttendanceDisplay.innerHTML = '';

    const student = students.find(s => s.id === currentUser.id);
    if (!student) {
        studentAttendanceDisplay.innerHTML = '<p>Student data not found.</p>';
        return;
    }

    let tableHtml = `
        <table class="attendance-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    let filteredAttendance = [];
    for (const date in attendance) {
        if (date.startsWith(selectedMonth) && attendance[date][student.id]) {
            filteredAttendance.push({
                date: date,
                status: attendance[date][student.id]
            });
        }
    }

    if (filteredAttendance.length === 0) {
        studentAttendanceDisplay.innerHTML = '<p>No attendance records found for the selected month.</p>';
        return;
    }

    filteredAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));

    filteredAttendance.forEach(record => {
        tableHtml += `
            <tr>
                <td>${record.date}</td>
                <td><span class="attendance-status status-${record.status}">${record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;
    studentAttendanceDisplay.innerHTML = tableHtml;
}

function loadStudentProfile() {
    const student = students.find(s => s.id === currentUser.id);
    if (student) {
        document.getElementById('studentProfileName').textContent = student.name;
        document.getElementById('studentProfileId').textContent = student.id;
        document.getElementById('studentProfileClass').textContent = student.class;
        document.getElementById('studentProfileEmail').textContent = student.email;

        let totalDays = 0;
        let presentDays = 0;
        for (const date in attendance) {
            if (attendance[date][student.id]) {
                totalDays++;
                if (attendance[date][student.id] === 'present') {
                    presentDays++;
                }
            }
        }
        const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
        document.getElementById('studentProfileAttendance').textContent = `${attendancePercentage}%`;
        document.getElementById('studentProfileBar').style.width = `${attendancePercentage}%`;
    } else {
        document.getElementById('studentProfileName').textContent = 'N/A';
        document.getElementById('studentProfileId').textContent = 'N/A';
        document.getElementById('studentProfileClass').textContent = 'N/A';
        document.getElementById('studentProfileEmail').textContent = 'N/A';
        document.getElementById('studentProfileAttendance').textContent = 'N/A';
        document.getElementById('studentProfileBar').style.width = '0%';
    }
}

function editStudentProfile() {
    alert('Student profile editing functionality is not implemented in this demo. You can imagine a form popping up here!');
}

// Initialize data and hide main app on load
document.addEventListener('DOMContentLoaded', () => {
    initializeDemoData();
    document.getElementById('mainApp').classList.add('hidden');
});