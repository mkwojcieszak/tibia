<?php
$ret = array();
session_start();

if(!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    if(!isset($_POST['id'])) {
        $ret['fb'] = "missing data";
    } else {

        $user_id = $_SESSION['id'];
        $id = $_POST['id'];
        $lifesteal1 = $_POST['lifesteal1'];
        $lifesteal2 = $_POST['lifesteal2'];
        $lifesteal3 = $_POST['lifesteal3'];
        $manaleech1 = $_POST['manaleech1'];
        $manaleech2 = $_POST['manaleech2'];
        $manaleech3 = $_POST['manaleech3'];
        $crit1 = $_POST['crit1'];
        $crit2 = $_POST['crit2'];
        $crit3 = $_POST['crit3'];
        $token = $_POST['token'];

        include '../tools.php';
        $conn = newConn();

        $stmt = $conn->prepare("SELECT * from user_imbu_prices where user_id = :user_id and id = :id");
        $stmt->execute(['user_id' => $user_id, 'id' => $id]);

        if ($stmt->rowCount() == 0) {
            $ret['fb'] = "does not exist";
        } else {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $server = $row['server'];
            $val = 0;
            $stmt = $conn->prepare("UPDATE user_imbu_prices SET
                lifesteal1 = :lifesteal1,
                lifesteal2 = :lifesteal2,
                lifesteal3 = :lifesteal3,
                manaleech1 = :manaleech1,
                manaleech2 = :manaleech2,
                manaleech3 = :manaleech3,
                crit1 = :crit1,
                crit2 = :crit2,
                crit3 = :crit3,
                token = :token
                WHERE id = :id"
            );
            $stmt->execute([
                'id' => $id,
                'lifesteal1' => $lifesteal1,
                'lifesteal2' => $lifesteal2,
                'lifesteal3' => $lifesteal3,
                'manaleech1' => $manaleech1,
                'manaleech2' => $manaleech2,
                'manaleech3' => $manaleech3,
                'crit1' => $crit1,
                'crit2' => $crit2,
                'crit3' => $crit3,
                'token' => $token
            ]);
            
            $ip = array();
            $ip['id'] = $id;
            $ip['server'] = $server;
            $ip['lifesteal1'] = $lifesteal1;
            $ip['lifesteal2'] = $lifesteal2;
            $ip['lifesteal3'] = $lifesteal3;
            $ip['manaleech1'] = $manaleech1;
            $ip['manaleech2'] = $manaleech2;
            $ip['manaleech3'] = $manaleech3;
            $ip['crit1'] = $crit1;
            $ip['crit2'] = $crit2;
            $ip['crit3'] = $crit3;
            $ip['token'] = $token;

            $ret['imbuPrices'] = $ip;
            $ret['fb'] = "success";
        }
    }
}

echo json_encode($ret);
?>