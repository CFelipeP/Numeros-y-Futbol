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
$fecha = $_POST['fecha'] ?? null;
$hora = $_POST['hora'] ?? null;
$jornada = $_POST['jornada'] ?? null;

if (!$local || !$visitante || $local == $visitante) {
    http_response_code(400);
    echo json_enc(["error" => "Datos inválidos"]);
    exit;
}

$local = (int)$local;
$visitante = (int)$visitante;
$jornada = $jornada !== null && $jornada !== '' ? (int)$jornada : null;

if ($fecha && $hora) {
    $fecha_hora = $fecha . ' ' . $hora . ':00';
} else {
    $fecha_hora = date('Y-m-d H:i:s');
}

if ($jornada !== null && $jornada !== '') {
    $stmt = $conn->prepare("INSERT INTO partidos_reservas (equipo_local, equipo_visitante, fecha, jornada, goles_local, goles_visitante, estado) VALUES (?, ?, ?, ?, 0, 0, 'Pendiente')");
    $stmt->bind_param("iisi", $local, $visitante, $fecha_hora, $jornada);
} else {
    $stmt = $conn->prepare("INSERT INTO partidos_reservas (equipo_local, equipo_visitante, fecha, goles_local, goles_visitante, estado) VALUES (?, ?, ?, 0, 0, 'Pendiente')");
    $stmt->bind_param("iis", $local, $visitante, $fecha_hora);
}

if (!$stmt->execute()) {
    echo json_enc(["error" => "Error interno del servidor"]);
    exit;
}

echo json_enc(["success" => true]);
