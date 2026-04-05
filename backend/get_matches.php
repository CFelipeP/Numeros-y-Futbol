<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

 $sql = "SELECT 
    p.id,
    p.equipo_local AS local_id,
    p.equipo_visitante AS visitante_id,
    DATE_FORMAT(p.fecha, '%d/%m/%Y %H:%i') AS date,
    e1.nombre AS local_nombre,
    e2.nombre AS visitante_nombre,
    CASE WHEN p.estado = 'Finalizado' THEN CONCAT(p.goles_local, ' - ', p.goles_visitante) ELSE '-' END AS score,
    p.estado AS status,
    p.featured
FROM partidos p
JOIN equipos e1 ON p.equipo_local = e1.id
JOIN equipos e2 ON p.equipo_visitante = e2.id
ORDER BY p.fecha DESC";

 $result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

 $data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);