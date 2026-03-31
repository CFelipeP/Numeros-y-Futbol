<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// 🔥 IMPORTANTE (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

require "db.php";

$id = $_GET['id'];

$sql = $conn->prepare("DELETE FROM noticias WHERE id=?");
$sql->bind_param("i", $id);

if ($sql->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}