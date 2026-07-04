<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_enc(["error" => "ID requerido"]);
    exit;
}

$sql = "UPDATE noticias 
        SET titulo = ?, contenido = ?, imagen = ?, categoria = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->execute([
    $data["titulo"],
    $data["contenido"],
    $data["imagen"],
    $data["categoria"],
    $data["id"]
]);

echo json_enc(["success" => true]);
?>