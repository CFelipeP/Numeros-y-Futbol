<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$jornadaFilter = isset($_GET['jornada']) && $_GET['jornada'] !== '' ? (int)$_GET['jornada'] : null;

$sql = "SELECT 
    p.id,
    p.equipo_local AS local_id,
    p.equipo_visitante AS visitante_id,
    p.fecha,
    p.jornada,
    DATE_FORMAT(p.fecha, '%d/%m/%Y %H:%i') AS date,
    e1.nombre AS local_nombre,
    e2.nombre AS visitante_nombre,
    CASE WHEN p.estado = 'Finalizado' THEN CONCAT(p.goles_local, ' - ', p.goles_visitante) ELSE '-' END AS score,
    p.estado AS status,
    p.featured
FROM partidos_reservas p
JOIN equipos_reservas e1 ON p.equipo_local = e1.id
JOIN equipos_reservas e2 ON p.equipo_visitante = e2.id";

if ($jornadaFilter !== null) {
    $sql .= " WHERE p.jornada = " . $jornadaFilter;
}

$sql .= " ORDER BY p.jornada ASC, p.fecha ASC";

$result = $conn->query($sql);

if (!$result) {
    echo json_enc(["error" => "Error interno del servidor"]);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_enc($data);
