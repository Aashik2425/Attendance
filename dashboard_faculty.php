<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'faculty') {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html><head><title>Faculty Dashboard</title><link rel="stylesheet" href="assets/SAS.css"></head>
<body><div class="header"><h1>Faculty Dashboard</h1><a href="logout.php" class="btn">Logout</a></div>
<div class="container"><p>Welcome, <?php echo $_SESSION['user']['name']; ?>!</p></div>
</body></html>