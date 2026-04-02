<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["next" => null, "recent" => []]);
    exit;
}

 $respuesta = ["next" => null, "recent" => []];

// === PRÓXIMO PARTIDO PROGRAMADO ===
 $sql_next = "SELECT 
    p.id,
    p.equipo_local,
    p.equipo_visitante,
    p.goles_local,
    p.goles_visitante,
    p.estado,
    p.fecha,
    e1.nombre AS home_name,
    e1.logo AS home_logo,
    e2.nombre AS away_name,
    e2.logo AS away_logo
FROM partidos p
JOIN equipos e1 ON p.equipo_local = e1.id
JOIN equipos e2 ON p.equipo_visitante = e2.id
WHERE LOWER(p.estado) IN ('programado', 'pendiente', 'por jugar', 'scheduled')
ORDER BY p.fecha ASC
LIMIT 1";

 $result_next = $conn->query($sql_next);
if ($result_next && $result_next->num_rows > 0) {
    $respuesta["next"] = $result_next->fetch_assoc();
}

// === ÚLTIMOS 3 FINALIZADOS ===
 $sql_recent = "SELECT 
    p.id,
    p.equipo_local,
    p.equipo_visitante,
    p.goles_local,
    p.goles_visitante,
    p.estado,
    p.fecha,
    e1.nombre AS home_name,
    e1.logo AS home_logo,
    e2.nombre AS away_name,
    e2.logo AS away_logo
FROM partidos p
JOIN equipos e1 ON p.equipo_local = e1.id
JOIN equipos e2 ON p.equipo_visitante = e2.id
WHERE LOWER(p.estado) IN ('finalizado', 'ft', 'terminado')
ORDER BY p.fecha DESC
LIMIT 3";

 $result_recent = $conn->query($sql_recent);
if ($result_recent && $result_recent->num_rows > 0) {
    while ($row = $result_recent->fetch_assoc()) {
        $respuesta["recent"][] = $row;
    }
}

echo json_encode($respuesta);