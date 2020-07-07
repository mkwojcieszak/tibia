<?php

include '../tools.php';
$ret = array();
if (!checkAdminRights()) {
    $ret['fb'] = "no rights";
} else {
    if (!isset($_POST['id']) || !isset($_POST['name'])) {
        $ret['fb'] = "missing data";
    } else {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $conn = newConn();
        $stmt = $conn->prepare("UPDATE servers SET name = :name where id = :id");
        $stmt->execute(['id' => $id, 'name' => $name]);
        $ret['fb'] = "success";
    }
}

echo json_encode($ret);
?>