<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body = json_decode(file_get_contents("php://input"), true);

$partido_id  = intval($body['partido_id']  ?? 0);
$division    = trim($body['division']      ?? 'primera');
$minuto      = intval($body['minuto']      ?? 0);
$tipo        = trim($body['tipo']          ?? 'comentario');
$descripcion = trim($body['descripcion']  ?? '');
$equipo      = trim($body['equipo']        ?? '');
$jugador_id  = !empty($body['jugador_id']) ? intval($body['jugador_id']) : null;

if (!$partido_id || !$descripcion) {
    echo json_enc(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

$tiposValidos = ['gol','gol_penal','gol_cabeza','gol_tiro_libre','asistencia','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','descanso','fin','penal'];
if (!in_array($tipo, $tiposValidos, true)) {
    echo json_enc(["success" => false, "error" => "Tipo de evento no válido: " . $tipo]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO match_comments (partido_id, division, minuto, tipo, descripcion, equipo, jugador_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$partido_id, $division, $minuto, $tipo, $descripcion, $equipo, $jugador_id]);

    echo json_enc(["success" => true, "id" => $pdo->lastInsertId()]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}
