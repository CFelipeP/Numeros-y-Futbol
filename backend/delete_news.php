<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

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