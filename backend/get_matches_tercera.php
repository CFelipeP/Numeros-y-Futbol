<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$result = $conn->query("
    SELECT p.*,
           t1.nombre as local_nombre, t1.nombre as home_name,
           t1.logo as local_logo, t1.logo as home_logo,
           t2.nombre as visitante_nombre, t2.nombre as away_name,
           t2.logo as visitante_logo, t2.logo as away_logo
    FROM partidos_tercera p
    LEFT JOIN equipos_tercera t1 ON p.local_id = t1.id
    LEFT JOIN equipos_tercera t2 ON p.visitante_id = t2.id
    ORDER BY p.fecha DESC, p.id DESC
");

if (!$result) {
    echo json_encode([]);
    exit;
}

$datos = [];
while ($row = $result->fetch_assoc()) {
    $gl = $row['goles_local'];
    $gv = $row['goles_visitante'];
    $row['score'] = ($gl !== null && $gv !== null) ? "$gl - $gv" : "-";
    $row['date'] = $row['fecha'];
    $datos[] = $row;
}

echo json_encode($datos);
$conn->close();
