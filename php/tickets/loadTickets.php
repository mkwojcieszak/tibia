<?php

include '../tools.php';
$ret = array();
if (checkAdminRights() == false) {
    $ret['fb'] = "no rights";
} else {
    $tickets = array();
    $conn = newConn();
    //ticket status: 0 unread, 1 read, 2 in progress, 3 resolved
    $stmt = $conn->query("SELECT * from tickets");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $ticket = array();
        $ticket['id'] = $row['id'];
        $ticket['user_id'] = $row['user_id'];
        $ticket['message'] = $row['message'];
        $ticket['status'] = $row['status'];
        $tickets[] = $ticket;
    }
    $ret['fb'] = "success";
    $ret['tickets'] = $tickets;
}

echo json_encode($ret);
?>