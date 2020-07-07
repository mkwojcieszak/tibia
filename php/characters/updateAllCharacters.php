<?php

//updating all characters inb database
include '../tools.php';
$conn = newConn();

$stmt = $conn->query("SELECT * from characters");
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $id = $row['id'];
    $name = str_replace(' ', '%20', $row['name']);

    $content = json_decode(file_get_contents("https://api.tibiadata.com/v2/characters/$name.json"));
    $character = $content->characters->data;
    $name = $character->name;
    $profession = $character->vocation;
    $level = $character->level;
    $server = $character->world;
    $stmt2 = $conn->prepare("UPDATE characters set level = :level, server = :server, profession = :profession, name = :name WHERE id = :id");
    $stmt2->execute(['level' => $level, 'server' => $server, 'profession' => $profession, 'name' => $name, 'id' => $id]);
    var_dump($content);
    echo "<br><br>";
}




?>