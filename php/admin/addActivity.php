<?php

include '../tools.php';
$ret = array();
if (checkAdminRights() == false) {
    $ret['fb'] = "no rights";
} else {
    $conn = newConn();
    $name = "New Activity";
    $type = "Quest";
    $stmt = $conn->query("INSERT into activities (name, type) values('$name', '$type')");
    $ret['fb'] = "success";
    $ret['id'] = $conn->lastInsertId();
    $ret['name'] = $name;
    $ret['type'] = $type;
}

echo json_encode($ret);
?>