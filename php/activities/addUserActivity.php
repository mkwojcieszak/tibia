<?php
$ret = array();
session_start();

if(!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    $user_id = $_SESSION['id'];
    if(!isset($_POST['character_id']) || !isset($_POST['activity_id'])) {
        $ret['fb'] = "missing data";
    } else {
        // check if this activity for this character already exists
        $character_id = $_POST['character_id'];
        $activity_id = $_POST['activity_id'];
        include '../tools.php';
        $conn = newConn();

        $stmt = $conn->prepare("SELECT * from user_activities where character_id = :character_id and activity_id = :activity_id");
        $stmt->execute(['character_id' => $character_id, 'activity_id' => $activity_id]);
        if ($stmt->rowCount() > 0) {
            $ret['fb'] = "already exists";
        } else {
            //check if character belongs to the user
            $stmt = $conn->prepare("SELECT * from characters where id = :id");
            $stmt->execute(['id' => $character_id]);
            if ($stmt->rowCount() == 0) {
                $ret['fb'] = "character does not exist";
            } else {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $owner_id = $row['user_id'];
                $server = $row['server'];
                if ($owner_id != $user_id) {
                    $ret['fb'] = "no ownership";
                } else {
                    //i have server, character id, activity
                    $current_date = new DateTime();
                    $last_check = $current_date->format("Y:m-d H:i");

                    $stmt = $conn->prepare("INSERT into user_activities (user_id, character_id, activity_id, server, last_check)
                    values(:user_id, :character_id, :activity_id, :server, :last_check)");
                    $stmt->execute(['user_id' => $user_id, 'character_id' => $character_id, 'activity_id' => $activity_id, 'server' => $server, 'last_check' => $last_check]);
                    
                    $ret['id'] = $conn->lastInsertId();
                    $ret['character_id'] = $character_id;
                    $ret['activity_id'] = $activity_id;
                    $ret['character'] = getCharacterById($conn, $character_id);
                    $ret['activity'] = getActivityById($conn, $activity_id);
                    $ret['server'] = $server;
                    $ret['last_check'] = $last_check;

                    $ret['fb'] = "success";
                }
            }
        }
    }
}









echo json_encode($ret);
?>