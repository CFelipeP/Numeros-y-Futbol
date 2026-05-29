<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$sql = "
    SELECT 
        p.id,
        p.fecha,
        p.goles_local,
        p.goles_visitante,
        p.estado,
        e1.nombre AS home_name,
        e1.logo AS home_logo,
        e2.nombre AS away_name,
        e2.logo AS away_logo
    FROM partidos p
    JOIN equipos e1 ON p.equipo_local_id = e1.id
    JOIN equipos e2 ON p.equipo_visitante_id = e2.id
    ORDER BY 
        CASE WHEN p.estado = 'En Vivo' THEN 0 
             WHEN p.estado = 'Pendiente' THEN 1 
             ELSE 2 
        END,
        p.fecha DESC
";

$result = $conn->query($sql);

$matches = [];
while ($row = $result->fetch_assoc()) {
    $matches[] = $row;
}

echo json_encode($matches);
$conn->close();
