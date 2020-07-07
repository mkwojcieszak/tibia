<?php

include '../tools.php';
$ret = array();
if (!checkAdminRights()) {
    $ret['fb'] = "no rights";
} else {
    if (!isset($_POST['id'])) {
        $ret['fb'] = "missing data";
    } else {
        $id = $_POST['id'];
        $conn = newConn();
        $stmt = $conn->prepare("DELETE from servers where id = :id");
        $stmt->execute(['id' => $id]);
        $ret['fb'] = "success";
    }
}

echo json_encode($ret);
?>