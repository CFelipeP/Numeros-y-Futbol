<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    http_response_code(400);
    echo json_enc(["error" => "ID requerido"]);
    exit;
}

$id        = intval($data["id"]);
$titulo    = trim(strip_tags($data["titulo"]    ?? ""));
$contenido = trim(strip_tags($data["contenido"] ?? "", '<b><i><u><p><br><a><strong><em><ul><ol><li><h1><h2><h3><h4><h5><h6><img><span><div>'));
$imagen    = trim($data["imagen"]    ?? "");
$categoria = trim(strip_tags($data["categoria"] ?? ""));

$sql = "UPDATE noticias 
        SET titulo = ?, contenido = ?, imagen = ?, categoria = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->execute([
    $titulo,
    $contenido,
    $imagen,
    $categoria,
    $id
]);

echo json_enc(["success" => true]);
?>