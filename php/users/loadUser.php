<?php
// This script is called when opening a website. It checks if user is logged in and returns user's info
$ret = array();
session_start();
if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    $id = $_SESSION['id'];

    include '../tools.php';
    $conn = newConn();
    $stmt = $conn->prepare("SELECT * from users where id = :id");
    $stmt->execute(['id' => $id]);

    if ($stmt->rowCount() < 1) {
        $ret['fb'] = "user does not exist";
    } else {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $ret['id'] = $row['id'];
        $ret['login'] = $row['login'];
        $ret['power'] = $row['power'];
        $ret['fb'] = "success";
    }
}

echo json_encode($ret);
?>