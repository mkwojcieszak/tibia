<?php
// called by CharacterManager@userInterface.js
$ret = array();

session_start();
if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    $user_id = $_SESSION['id'];
    
    // character in database has: id, name, profession, level, skill, server
    
    include '../tools.php';
    $conn = newConn();
    $stmt = $conn->query("SELECT * from characters where user_id = '$user_id'");
    $characters = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $character = array();
        $character['id'] = $row['id'];
        $character['name'] = $row['name'];
        $character['user_id'] = $row['user_id'];
        $character['profession'] = $row['profession'];
        $character['level'] = $row['level'];
        $character['skill'] = $row['skill'];
        $character['server'] = $row['server'];
        $character['status'] = $row['status'];
        $characters[] = $character;
    }

    $ret['characters'] = $characters;
    $ret['fb'] = "success";
}


echo json_encode($ret);
?>