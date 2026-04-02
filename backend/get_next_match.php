<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

 $sql = "SELECT 
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

 $result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
    exit;
}

 $sql2 = "SELECT 
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
ORDER BY p.fecha DESC
LIMIT 1";

 $result2 = $conn->query($sql2);

if ($result2 && $result2->num_rows > 0) {
    echo json_encode($result2->fetch_assoc());
    exit;
}

echo json_encode(new stdClass());