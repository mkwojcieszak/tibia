<?php
session_start();
$ret = array();
if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    $userid = $_SESSION['id'];

    include '../tools.php';

    $conn = newConn();
    $stmt = $conn->prepare("SELECT * from user_activities where user_id = :userid ORDER by character_id");
    $stmt->execute(['userid' => $userid]);

    $activities = array();

    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // user activity should have activity and character objects included

        $userActivity = array();
        $userActivity['id'] = $row['id'];
        $userActivity['character_id'] = $row['character_id'];
        $userActivity['activity_id'] = $row['activity_id'];
        $userActivity['server'] = $row['server'];
        $userActivity['last_check'] = $row['last_check'];

        $userActivity['character'] = getCharacterById($conn, $row['character_id']);
        $userActivity['activity'] = getActivityById($conn, $row['activity_id']);
        
        $activities[] = $userActivity;
    }
    $ret['fb'] = "success";
    $ret['activities'] = $activities;
}

echo json_encode($ret);
?>