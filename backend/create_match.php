<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;

$local = $_POST['local'] ?? null;
$visitante = $_POST['visitante'] ?? null;

if (!$local || !$visitante || $local == $visitante) {
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

$local = (int)$local;
$visitante = (int)$visitante;

$stmt = $conn->prepare("INSERT INTO partidos (equipo_local, equipo_visitante, fecha, goles_local, goles_visitante, estado) VALUES (?, ?, NOW(), 0, 0, 'Pendiente')");
$stmt->bind_param("ii", $local, $visitante);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Error interno del servidor"]);
    exit;
}

echo json_encode(["success" => true]);
