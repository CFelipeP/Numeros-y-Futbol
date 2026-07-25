<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$local     = (int)($_POST['local'] ?? 0);
$visitante = (int)($_POST['visitante'] ?? 0);
$fecha     = $_POST['fecha'] ?? null;
$hora      = $_POST['hora'] ?? null;
$jornada   = $_POST['jornada'] ?? null;

if (!$local || !$visitante || $local === $visitante) {
    echo json_enc(["success" => false, "error" => "Selecciona ambos equipos y que sean diferentes"]);
    exit;
}

$jornada = $jornada !== null && $jornada !== '' ? (int)$jornada : null;

if ($fecha && $hora) {
    $fecha_hora = $fecha . ' ' . $hora . ':00';
} else {
    $fecha_hora = date('Y-m-d H:i:s');
}

if ($jornada !== null) {
    $stmt = $conn->prepare("INSERT INTO partidos_femenina (equipo_local, equipo_visitante, fecha, jornada, goles_local, goles_visitante, estado) VALUES (?, ?, ?, ?, 0, 0, 'Pendiente')");
    $stmt->execute([$local, $visitante, $fecha_hora, $jornada]);
} else {
    $stmt = $conn->prepare("INSERT INTO partidos_femenina (equipo_local, equipo_visitante, fecha, goles_local, goles_visitante, estado) VALUES (?, ?, ?, 0, 0, 'Pendiente')");
    $stmt->execute([$local, $visitante, $fecha_hora]);
}

echo json_enc(["success" => true, "id" => $conn->lastInsertId()]);
