<?php

include '../tools.php';
$ret = array();
session_start();

if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    if (!isset($_POST['server'])) {
        $ret['fb'] = "missing data";
    } else {
        $server = $_POST['server'];
        $user_id = $_SESSION['id'];

        $conn = newConn();
        $stmt = $conn->prepare("DELETE from user_imbu_prices where user_id = :user_id and server = :server");
        $stmt->execute(['user_id' => $user_id, 'server' => $server]);
        $ret['fb'] = "success";
    }
}


echo json_encode($ret);
?>