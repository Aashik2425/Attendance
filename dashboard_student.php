<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'student') {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html><head><title>Student Dashboard</title><link rel="stylesheet" href="./assets/SAS.css"></head>
<body><div class="header"><h1>Student Dashboard</h1><a href="logout.php" class="btn">Logout</a></div>
<div class="container"><p>Welcome, <?php echo $_SESSION['user']['name']; ?>!</p> <!--assets/SAS.css-->
<p>Your Class: <?php echo $_SESSION['user']['class']; ?></p></div>
</body></html>