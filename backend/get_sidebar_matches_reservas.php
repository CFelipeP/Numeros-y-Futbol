<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$jornada = isset($_GET['jornada']) && $_GET['jornada'] !== '' ? (int)$_GET['jornada'] : null;

$recent = [];
$next = null;

if ($jornada) {
    $q = "SELECT id, equipo_local, equipo_visitante, goles_local, goles_visitante, fecha, estado, jornada, featured FROM partidos_reservas WHERE jornada = ? AND estado = 'Finalizado' ORDER BY fecha ASC";
    $stmt = $conn->prepare($q);
    $stmt->bind_param("i", $jornada);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($row = $res->fetch_assoc()) $recent[] = $row;
} else {
    $q = "SELECT id, equipo_local, equipo_visitante, goles_local, goles_visitante, fecha, estado, jornada, featured FROM partidos_reservas WHERE estado = 'Finalizado' ORDER BY fecha DESC, id DESC LIMIT 10";
    $res = $conn->query($q);
    if ($res) while ($row = $res->fetch_assoc()) $recent[] = $row;
}

$qNext = "SELECT id, equipo_local, equipo_visitante, goles_local, goles_visitante, fecha, estado, jornada, featured FROM partidos_reservas WHERE estado != 'Finalizado' ORDER BY fecha ASC LIMIT 1";
$resN = $conn->query($qNext);
if ($resN) $next = $resN->fetch_assoc();

echo json_enc(["recent" => $recent, "next" => $next]);
