<?php


include '../tools.php';
$ret = array();
if (!checkAdminRights()) {
    $ret['fb'] = "no rights";
} else {
    $conn = newConn();
    $stmt = $conn-> query("TRUNCATE TABLE `servers`");

    $api_link = "https://api.tibiadata.com/v2/worlds.json";
    $content = json_decode(file_get_contents($api_link));
    $allonline = $content->worlds->online;
    $servers = $content->worlds->allworlds;
    foreach($servers as $server) {
        $name = $server->name;
        $online = $server->online;
        $location = $server->location;
        $worldtype = $server->worldtype;
        echo "$name $online $location $worldtype <br>";
        $stmt = $conn->prepare("INSERT into servers (name, online, location, type)
            values(:name, :online, :location, :type)");
        $stmt->execute(['name' => $name, 'online' => $online, 'location' => $location, 'type' => $worldtype]);
    }
    $ret['fb'] = "success";
}

echo json_encode($ret);

?>