<?php
$ret = array();
include '../tools.php';
if (!isset($_POST['id'])) {
    $ret['fb'] = "missing data";
} else {
    $conn = newConn();
    $id = $_POST['id'];
    $stmt = $conn->prepare("SELECT * from characters where id = :id");
    $stmt->execute(['id' => $id]);
    if ($stmt->rowCount() == 0) {
        $ret['fb'] = "not found";
    } else {
        $char = array();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $char['id'] = $row['id'];
        $char['name'] = $row['name'];
        $char['profession'] = $row['profession'];
        $char['user_id'] = $row['user_id'];
        $char['server'] = $row['server'];
        $char['level'] = $row['level'];
        $char['skill'] = $row['skill'];

        $ret['fb'] = "success";
        $ret['character'] = $char;
    }
}

echo json_encode($ret);
?>