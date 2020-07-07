<?php

include '../tools.php';
$ret = array();
session_start();
if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    if (!isset($_POST['id'])) {
        $ret['fb'] = "missing data";
    } else {
        $character_id = $_POST['id'];
        $user_id = $_SESSION['id'];

        $conn = newConn();
        $stmt = $conn->prepare("SELECT * from characters where user_id = :user_id and id = :id");
        $stmt->execute(['id' => $character_id, 'user_id' => $user_id]);

        if ($stmt->rowCount() == 0) {
            $ret['fb'] = "character not found";
        } else {
            $stmt = $conn->prepare("DELETE from characters where id = :id");
            $stmt->execute(['id' => $character_id]);
            $ret['fb'] = "success";
        }
    }
}


echo json_encode($ret);
?>