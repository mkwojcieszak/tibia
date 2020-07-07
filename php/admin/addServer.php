<?php

include '../tools.php';
$ret = array();
if (checkAdminRights() == false) {
    $ret['fb'] = "no rights";
} else {
    $conn = newConn();
    $name = "New Server";
    $stmt = $conn->query("INSERT into servers (name) values('$name')");
    $ret['fb'] = "success";
    $ret['id'] = $conn->lastInsertId();
    $ret['name'] = $name;
}

echo json_encode($ret);
?>