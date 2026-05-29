<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$result = $conn->query("
    SELECT tp.*, e.nombre, e.logo, e.ciudad, e.estadio
    FROM tabla_posiciones_tercera tp
    LEFT JOIN equipos_tercera e ON tp.equipo_id = e.id
    ORDER BY tp.pts DESC, (tp.gf - tp.gc) DESC
");
if (!$result) { echo json_encode([]); exit; }

$datos = [];
while ($row = $result->fetch_assoc()) {
    $datos[] = $row;
}

echo json_encode($datos);
$conn->close();
