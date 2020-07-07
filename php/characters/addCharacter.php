<?php
// called by CharacterManager@userInterface.js
$ret = array();

session_start();
if (!isset($_SESSION['id'])) {
    $ret['fb'] = "no session";
} else {
    if (!isset($_POST['name'])) {
        $ret['fb'] = "missing data";
    } else {
        $user_id = $_SESSION['id'];
        $name = $_POST['name'];
        $name = str_replace(' ', '%20', $name);
        // load character info from tibia API
        // character in database has: id, name, profession, level, skill, server
        $api_link = "https://api.tibiadata.com/v2/characters/".$name.".json";
        $api_content = json_decode(file_get_contents($api_link));
        $character = $api_content->characters->data;
        $name = $character->name;
        $profession = $character->vocation;
        $level = $character->level;
        $server = $character->world;
        // TEMPORARILY I will generate char info instead of fetching it from api
        //$profession = "Elite Knight";
        //$level = 200;
        $skill = 91;
        //$server = "Duna";
        $status = 1;

        include '../tools.php';
        $conn = newConn();
        $stmt = $conn->prepare("INSERT into characters
        (name, user_id, profession, level, skill, server, status)
        values(:name, :user_id, :profession, :level, :skill, :server, :status)");
        $stmt->execute([
            'name' => $name,
            'user_id' => $user_id,
            'profession' => $profession,
            'level' => $level,
            'skill' => $skill,
            'server' => $server,
            'status' => $status]);
        $id = $conn->lastInsertId();

        $character = array();
        $character['id'] = $id;
        $character['name'] = $name;
        $character['profession'] = $profession;
        $character['level'] = $level;
        $character['skill'] = $skill;
        $character['server'] = $server;
        $character['status'] = $status;
        $ret['character'] = $character;
        $ret['fb'] = "success";
        $ret['content'] = $api_content;
    }
}


echo json_encode($ret);
?>