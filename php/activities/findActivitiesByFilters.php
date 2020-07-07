<?php

include '../tools.php';
$ret = array();
session_start();

if(!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    if (!isset($_POST['activity']) || !isset($_POST['server'])) {
        $ret['fb'] = "missing data";
    } else {
        $server = $_POST['server'];
        $activity = $_POST['activity'];
        if ($server == "none" && $activity == 0) {
            $ret['filters'] = "Server: ".$server.", Activity: ".$activity;
            $ret['fb'] = "filters not strict enough";
        } else {
            
            $conn = newConn();
            $activities = array();
            $stmt = 0;

            if ($activity == 0) {
                $stmt = $conn->prepare("SELECT * from user_activities where server = :server");
                $stmt->execute(['server' => $server]);
            } else if ($server == "none") {
                $stmt = $conn->prepare("SELECT * from user_activities where activity_id = :activity");
                $stmt->execute(['activity' => $activity]);
            } else {
                $stmt = $conn->prepare("SELECT * from user_activities where activity_id = :activity and server = :server");
                $stmt->execute(['activity' => $activity, 'server' => $server]);
            }

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $act = array();
                $act['id'] = $row['id'];
                $act['character_id'] = $row['character_id'];
                $act['activity_id'] = $row['activity_id'];
                $act['server'] = $row['server'];
                $act['last_check'] = $row['last_check'];
                $activities[] = $act;
            }
            $ret['filters'] = "Server: ".$server.", Activity: ".$activity;
            $ret['activities'] = $activities;
            $ret['fb'] = "success";
        }
    }
}

echo json_encode($ret);
?>