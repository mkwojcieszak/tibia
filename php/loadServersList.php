<?php
$ret = array();
include './tools.php';
$conn = newConn();
$servers = array();
$stmt = $conn->query("SELECT * from servers");
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $server = array();
    $server['id'] = $row['id'];
    $server['name'] = $row['name'];
    $servers[] = $server;
}

$ret['fb'] = "success";
$ret['servers'] = $servers;
echo json_encode($ret);

?>