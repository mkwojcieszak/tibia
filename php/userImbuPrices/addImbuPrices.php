<?php
$ret = array();
session_start();

if(!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    if(!isset($_POST['server'])) {
        $ret['fb'] = "missing data";
    } else {

        $user_id = $_SESSION['id'];
        $server = $_POST['server'];

        include '../tools.php';
        $conn = newConn();

        $stmt = $conn->prepare("SELECT * from user_imbu_prices where user_id = :user_id and server = :server");
        $stmt->execute(['user_id' => $user_id, 'server' => $server]);

        if ($stmt->rowCount() > 0) {
            $ret['fb'] = "already exists";
        } else {
            $val = 0;
            $stmt = $conn->prepare("INSERT into user_imbu_prices (user_id, server, lifesteal1, lifesteal2, lifesteal3, manaleech1, manaleech2, manaleech3, crit1, crit2, crit3, token)
            values(:user_id, :server, :lifesteal1, :lifesteal2, :lifesteal3, :manaleech1, :manaleech2, :manaleech3, :crit1, :crit2, :crit3, :token)");
            $stmt->execute(['user_id' => $user_id, 'server' => $server, 'lifesteal1' => $val, 'lifesteal2' => $val, 'lifesteal3' => $val,
            'manaleech1' => $val, 'manaleech2' => $val, 'manaleech3' => $val, 'crit1' => $val, 'crit2' => $val, 'crit3' => $val, 'token' => $val]);
            
            $ip = array();
            $ip['id'] = $conn->lastInsertId();
            $ip['user_id'] = $user_id;
            $ip['server'] = $server;
            $ip['lifesteal1'] = $val;
            $ip['lifesteal2'] = $val;
            $ip['lifesteal3'] = $val;
            $ip['manaleech1'] = $val;
            $ip['manaleech2'] = $val;
            $ip['manaleech3'] = $val;
            $ip['crit1'] = $val;
            $ip['crit2'] = $val;
            $ip['crit3'] = $val;
            $ip['token'] = $val;

            $ret['imbuPrices'] = $ip;
            $ret['fb'] = "success";
        }
    }
}

echo json_encode($ret);
?>