<?php

include '../tools.php';
$ret = array();
session_start();
if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    $user_id = $_SESSION['id'];
    $date = new DateTime();
    $new_check = $date->format("Y-m-d H:s");

    $conn = newConn();
    $stmt = $conn->prepare("UPDATE user_activities SET last_check = :new_check WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id, 'new_check' => $new_check]);

    $ret['fb'] = "success";
}


echo json_encode($ret);
?>