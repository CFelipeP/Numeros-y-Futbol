<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$local     = (int)($_POST['local'] ?? 0);
$visitante = (int)($_POST['visitante'] ?? 0);

if (!$local || !$visitante || $local === $visitante) {
    echo json_enc(["error" => "Selecciona ambos equipos y que sean diferentes"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO partidos_ascenso (local_id, visitante_id, fecha, goles_local, goles_visitante, status) VALUES (?, ?, NOW(), 0, 0, 'Pendiente')");
$stmt->execute([$local, $visitante]);

echo json_enc(["success" => true, "id" => $conn->lastInsertId()]);
