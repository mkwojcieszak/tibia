<?php
$ret = array();
session_start();

if(!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    include '../tools.php';
    $conn = newConn();
    $user_id = $_SESSION['id'];

    $stmt = $conn->prepare("SELECT * from user_imbu_prices where user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);

    $imbuPrices = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $ip = array();
        $ip['id'] = $row['id'];
        $ip['user_id'] = $row['user_id'];
        $ip['server'] = $row['server'];
        $ip['lifesteal1'] = $row['lifesteal1'];
        $ip['lifesteal2'] = $row['lifesteal2'];
        $ip['lifesteal3'] = $row['lifesteal3'];
        $ip['manaleech1'] = $row['manaleech1'];
        $ip['manaleech2'] = $row['manaleech2'];
        $ip['manaleech3'] = $row['manaleech3'];
        $ip['crit1'] = $row['crit1'];
        $ip['crit2'] = $row['crit2'];
        $ip['crit3'] = $row['crit3'];
        $ip['token'] = $row['token'];
        $imbuPrices[] = $ip;
    }
    $ret['fb'] = "success";
    $ret['imbuPrices'] = $imbuPrices;
}
echo json_encode($ret);
?>