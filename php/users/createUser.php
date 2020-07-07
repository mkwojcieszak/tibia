<?php
$ret = array();
if (!isset($_POST['login']) || !isset($_POST['password']) || !isset($_POST['email'])) {
    $ret['fb'] = "missing data";
} else {
    $login = $_POST['login'];
    $password = $_POST['password'];
    $email = $_POST['email'];
    $power = 0;

    include '../tools.php';
    $conn = newConn();

    $stmt = $conn->prepare("SELECT * from users where login = :login");
    $stmt->execute(['login' => $login]);
    if ($stmt->rowCount() > 0) {
        $ret['fb'] = "login taken";
    } else {
        $stmt = $conn->prepare("INSERT into users(login, password, email, power) values(:login, :password, :email, :power)");
        $stmt->execute(['login' => $login, 'password' => $password, 'email' => $email, 'power' => $power]);

        $id = $conn->lastInsertId();
        session_start();
        $_SESSION['id'] = $id;
        $_SESSION['login'] = $login;

        $ret['fb'] = "success";
    }
}

echo json_encode($ret);
?>