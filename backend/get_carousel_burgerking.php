<?php
header('Content-Type: application/json');
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
$sql = $conn->query("SELECT p.id, 'burgerking' AS division, p.goles_local, p.goles_visitante, p.estado, p.fecha, el.nombre AS team1, el.logo AS logo1, ev.nombre AS team2, ev.logo AS logo2 FROM partidos_burgerking p JOIN equipos_burgerking el ON p.equipo_local = el.id JOIN equipos_burgerking ev ON p.equipo_visitante = ev.id WHERE p.estado IN ('Finalizado', 'En Curso', 'Pendiente') ORDER BY FIELD(p.estado, 'En Curso', 'Pendiente', 'Finalizado'), p.fecha DESC LIMIT 6");
$partidos = $sql->fetchAll(PDO::FETCH_ASSOC);
echo json_enc(["success" => true, "data" => $partidos]);
