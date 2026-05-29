<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$result = $conn->query("SELECT p.*, 
    e1.nombre AS local_nombre, e1.nombre AS home_name, 
    e1.logo AS home_logo,
    e2.nombre AS visitante_nombre, e2.nombre AS away_name,
    e2.logo AS away_logo 
    FROM partidos_segunda p 
    LEFT JOIN equipos_segunda e1 ON p.local_id = e1.id 
    LEFT JOIN equipos_segunda e2 ON p.visitante_id = e2.id 
    ORDER BY p.fecha DESC, p.id DESC");

if (!$result) {
    echo json_encode([]);
    exit;
}

$partidos = [];
while ($row = $result->fetch_assoc()) {
    $gl = $row['goles_local'];
    $gv = $row['goles_visitante'];
    $row['score'] = ($gl !== null && $gv !== null) ? "$gl - $gv" : "-";
    $row['date'] = $row['fecha'];
    $row['home_name'] = $row['home_name'] ?? $row['local_nombre'];
    $row['away_name'] = $row['away_name'] ?? $row['visitante_nombre'];
    $row['home_logo'] = $row['home_logo'];
    $row['away_logo'] = $row['away_logo'];
    $partidos[] = $row;
}
echo json_encode($partidos);
