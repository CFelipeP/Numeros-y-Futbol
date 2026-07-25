<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$jornada = isset($_GET['jornada']) && $_GET['jornada'] !== '' ? (int)$_GET['jornada'] : null;

$recent = []; $next = null;

if ($jornada) {
    $stmt = $conn->prepare("SELECT p.id, p.fecha, p.goles_local, p.goles_visitante, p.estado AS status, p.jornada, p.featured, e1.nombre AS home_name, e1.logo AS home_logo, e2.nombre AS away_name, e2.logo AS away_logo FROM partidos_femenina p LEFT JOIN equipos_primera_femenina e1 ON p.equipo_local = e1.id LEFT JOIN equipos_primera_femenina e2 ON p.equipo_visitante = e2.id WHERE p.jornada = ? AND p.estado = 'Finalizado' ORDER BY p.fecha ASC");
    $stmt->bind_param("i", $jornada); $stmt->execute(); $res = $stmt->get_result();
    while ($row = $res->fetch_assoc()) $recent[] = $row;
} else {
    $res = $conn->query("SELECT p.id, p.fecha, p.goles_local, p.goles_visitante, p.estado AS status, p.jornada, p.featured, e1.nombre AS home_name, e1.logo AS home_logo, e2.nombre AS away_name, e2.logo AS away_logo FROM partidos_femenina p LEFT JOIN equipos_primera_femenina e1 ON p.equipo_local = e1.id LEFT JOIN equipos_primera_femenina e2 ON p.equipo_visitante = e2.id WHERE p.estado = 'Finalizado' ORDER BY p.fecha DESC, p.id DESC LIMIT 10");
    if ($res) while ($row = $res->fetch_assoc()) $recent[] = $row;
}

$resN = $conn->query("SELECT p.id, p.fecha, p.jornada, p.featured, e1.nombre AS home_name, e1.logo AS home_logo, e2.nombre AS away_name, e2.logo AS away_logo FROM partidos_femenina p LEFT JOIN equipos_primera_femenina e1 ON p.equipo_local = e1.id LEFT JOIN equipos_primera_femenina e2 ON p.equipo_visitante = e2.id WHERE p.estado IS NULL OR p.estado != 'Finalizado' ORDER BY p.fecha ASC, p.id ASC LIMIT 1");
if ($resN) $next = $resN->fetch_assoc();

echo json_enc(['recent' => $recent, 'next' => $next]);
$conn->close();
