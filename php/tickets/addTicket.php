<?php
include '../tools.php';
$ret = array();

session_start();
if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    if (!isset($_POST['message'])) {
        $ret['fb'] = "missing data";
    } else {
        $message = $_POST['message'];
        if (strlen($message) > 500 || strlen($message) < 10) {
            $ret['fb'] = "invalid length";
        } else {
            $user_id = $_SESSION['id'];
            $conn = newConn();
            $stmt = $conn->prepare("INSERT into tickets (user_id, message) values(:user_id, :message)");
            $stmt->execute(['user_id' => $user_id, 'message' => $message]);
            $ret['fb'] = "success";
        }
    }
}
echo json_encode($ret);
?>
