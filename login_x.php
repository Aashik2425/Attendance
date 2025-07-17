<?PHP
<>
    <!-- Login Screen -->
    <div id="loginScreen" class="container"> 
        <div class="header">
            <h1>🎓 Student Attendance System</h1>
            <!-- <p>Multi-Role Access Portal</p> -->
        </div>

        <div class="login-container">
            <div class="login-form">
                <h2 style="margin-bottom: 30px; color: #333;">Login to Your Account</h2>

                <div class="role-selector">
                    <button class="role-btn active" onclick="selectRole('admin')">Admin</button>
                    <button class="role-btn" onclick="selectRole('faculty')">Faculty</button>
                    <button class="role-btn" onclick="selectRole('student')">Student</button>
                </div>

                <div class="form-group">
                    <label for="loginId">User ID:</label>
                    <input type="text" id="loginId" placeholder="Enter your ID">
                </div>

                <div class="form-group">
                    <label for="loginPassword">Password:</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password">
                </div>

                <button class="btn" onclick="login()" style="width: 100%;">Login</button>

                <div id="loginAlert" style="margin-top: 20px;"></div>

                <!-- <div style="margin-top: 30px; font-size: 0.9em; color: #666;">
                    <p><strong>Demo Credentials:</strong></p>
                    <p>Admin: admin/admin123</p>
                    <p>Faculty: faculty/faculty123</p>
                    <p>Student: S001/student123</p>
                </div> -->
            </div>
        </div>
    </div>
    </>
    ?>