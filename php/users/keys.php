<?php
// This script is called when opening a website. It checks if user is logged in and returns user's info

    include '../tools.php';
    $conn = newConn();
    $stmt = $conn->query("ALTER TABLE user_activities ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL");
    $stmt = $conn->query("ALTER TABLE user_imbu_prices ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL");
    $stmt = $conn->query("ALTER TABLE characters ADD FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL");


?>