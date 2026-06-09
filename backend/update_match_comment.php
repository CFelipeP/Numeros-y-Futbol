<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body = json_decode(file_get_contents("php://input"), true);
$id          = intval($body['id']           ?? 0);
$minuto      = intval($body['minuto']       ?? 0);
$tipo        = trim($body['tipo']           ?? 'comentario');
$descripcion = trim($body['descripcion']   ?? '');
$equipo      = trim($body['equipo']         ?? '');
$jugador_id  = !empty($body['jugador_id'])  ? intval($body['jugador_id']) : null;

if (!$id || !$descripcion) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE match_comments
        SET minuto = ?, tipo = ?, descripcion = ?, equipo = ?, jugador_id = ?
        WHERE id = ?
    ");
    $stmt->execute([$minuto, $tipo, $descripcion, $equipo, $jugador_id, $id]);

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Error interno del servidor"]);
}
