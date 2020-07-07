<?php

include '../tools.php';
$ret = array();
if (!checkAdminRights()) {
    $ret['fb'] = "no rights";
} else {
    if (!isset($_POST['id']) || !isset($_POST['name']) || !isset($_POST['type'])) {
        $ret['fb'] = "missing data";
    } else {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $type = $_POST['type'];
        $conn = newConn();
        $stmt = $conn->prepare("UPDATE activities SET name = :name, type = :type where id = :id");
        $stmt->execute(['id' => $id, 'name' => $name, 'type' => $type]);
        $ret['fb'] = "success";
    }
}

echo json_encode($ret);
?>