<?php

function newConn() {
    $conn = new PDO("mysql:host=localhost;dbname=tibia_db", "root", "");
    //$conn = new PDO("mysql:host=serwer2036060.home.pl;dbname=32235108_tibia;",
    //    "32235108_tibia", "Wojtecek0");
        
    return $conn;
}

function getLogin($id) {
    $conn = newConn();
    $stmt = $conn->prepare("SELECT login from users where id = :id");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['login'];
}

function checkAdminRights() {
    session_start();
    $conn = newConn();
    $id = $_SESSION['id'];
    $stmt = $conn->prepare("SELECT power from users where id = :id");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $power = $row['power'];
    if ($power == 0) { return false; } else { return true; }
}

function getCharacterById($conn, $id) {
    $fstmt = $conn->query("SELECT * from characters where id = '$id'");
    $frow = $fstmt->fetch(PDO::FETCH_ASSOC);

    $fcharacter = array();
    $fcharacter['id'] = $frow['id'];
    $fcharacter['user_id'] = $frow['user_id'];
    $fcharacter['name'] = $frow['name'];
    $fcharacter['profession'] = $frow['profession'];
    $fcharacter['level'] = $frow['level'];
    $fcharacter['skill'] = $frow['skill'];
    $fcharacter['server'] = $frow['server'];
    $fcharacter['status'] = $frow['status'];

    return $fcharacter;
}

function getActivityById($conn, $id) {
    $fstmt = $conn->query("SELECT * from activities where id = '$id'");
    $frow = $fstmt->fetch(PDO::FETCH_ASSOC);

    $factivity = array();
    $factivity['id'] = $frow['id'];
    $factivity['name'] = $frow['name'];
    $factivity['type'] = $frow['type'];

    return $factivity;
}



?>