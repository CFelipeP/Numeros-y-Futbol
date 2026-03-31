<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_encode(["success" => false, "error" => "ID requerido"]);
    exit;
}

$id = $data["id"];

$sql = $conn->prepare("DELETE FROM noticias WHERE id = ?");
$result = $sql->execute([$id]);

echo json_encode(["success" => $result]);
?>