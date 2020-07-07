<?php
// This script is called after user enters user's credentials, It starts a session if credentials are valid
$ret = array();
if (!isset($_POST['login']) || !isset($_POST['password'])) {
    $ret['fb'] = "missing data";
} else {
    include '../tools.php';

    $login = $_POST['login'];
    $password = $_POST['password'];

    $conn = newConn();
    $stmt = $conn->prepare("SELECT * from users where login = :login and password = :password");
    $stmt->execute(['login' => $login, 'password' => $password]);
    if ($stmt->rowCount() < 1) {
        $ret['fb'] = "wrong credentials";
    } else {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $row['id'];
        $login = $row['login'];
        session_start();
        $_SESSION['id'] = $id;
        $_SESSION['login'] = $login;
        $ret['fb'] = "success";
    }
}

echo json_encode($ret);
?>