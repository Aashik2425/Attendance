<?php
session_start();
if (isset($_SESSION['user'])) {
    $role = $_SESSION['user']['role'];
    header("Location: dashboard_" . $role . ".php");
    exit();
}
$message = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $users = [
        'admin' => ['id' => 'admin', 'password' => 'admin123', 'name' => 'Administrator_Aashik', 'role' => 'admin'],
        'faculty' => ['id' => 'faculty', 'password' => 'faculty123', 'name' => 'Aashik', 'role' => 'faculty'],
        'student' => ['id' => 'S001', 'password' => 'student123', 'name' => 'Aashik', 'class' => '5H', 'role' => 'student']
    ];
    $role = $_POST['role'];
    $id = $_POST['id'];
    $password = $_POST['password'];
    if (isset($users[$role]) && $users[$role]['id'] === $id && $users[$role]['password'] === $password) {
        $_SESSION['user'] = $users[$role];
        header("Location: dashboard_" . $role . ".php");
        exit();
    } else {
        $message = "Invalid credentials!";
    }
}
?>
<!DOCTYPE html>
<html>
<head><title>Login</title><link rel="stylesheet" href="./assets/SAS.css"></head>
<body style="background-image: url('./img/bg-img-1.jpg');">
<div class="login-container">
<form method="post" class="login-form">
    <h2>Login</h2>
    <div class="role-selector">
        <button type="submit" name="role" value="admin" class="role-btn">Admin</button>
        <button type="submit" name="role" value="faculty" class="role-btn">Faculty</button>
        <button type="submit" name="role" value="student" class="role-btn">Student</button>
    </div>
    <div class="form-group"><label>User ID:</label><input type="text" name="id" required></div>
    <div class="form-group"><label>Password:</label><input type="password" name="password" required></div>
    <input type="submit" class="btn" value="Login">
    <div style="color:red;"><?php echo $message; ?></div>
</form>
</div>
</body>
</html>