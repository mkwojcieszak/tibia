<?php
$ret = array();
include './tools.php';
$conn = newConn();
$activities = array();
$stmt = $conn->query("SELECT * from activities");
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $activity = array();
    $activity['id'] = $row['id'];
    $activity['name'] = $row['name'];
    $activity['type'] = $row['type'];
    $activities[] = $activity;
}
$ret['fb'] = "success";
$ret['activities'] = $activities;
echo json_encode($ret);

?>