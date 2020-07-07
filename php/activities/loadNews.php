<?php
include '../tools.php';
$conn = newConn();
$ret = array();
session_start();

if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    $user_id = $_SESSION['id'];
    $servers = array();
    $stmt = $conn->query("SELECT server from characters where user_id = '$user_id'");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $serv = $row['server'];
        if (!in_array($serv, $servers)) { $servers[] = $serv; }
    }
    $activities = array();
    $query = "SELECT * from user_activities where server IN ('".implode("','",$servers)."') LIMIT 20";
    $stmt = $conn->query($query);
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
    $ret['servers'] = $servers;
    $ret['activities'] = $activities;
}

echo json_encode($ret);
?>