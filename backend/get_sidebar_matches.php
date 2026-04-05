<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
} catch (Exception $e) {
    echo json_encode(['recent' => [], 'next' => null, 'error' => 'Error de conexión']);
    exit;
}

if ($conn->connect_error) {
    echo json_encode(['recent' => [], 'next' => null, 'error' => 'Error de conexión']);
    exit;
}

 $recent = [];
try {
    $res = $conn->query("
        SELECT p.id, p.fecha, p.goles_local, p.goles_visitante, p.estado AS status,
               e1.nombre AS home_name, e1.logo AS home_logo,
               e2.nombre AS away_name, e2.logo AS away_logo
        FROM partidos p
        LEFT JOIN equipos e1 ON p.equipo_local = e1.id
        LEFT JOIN equipos e2 ON p.equipo_visitante = e2.id
        WHERE p.estado = 'Finalizado'
        ORDER BY p.fecha DESC, p.id DESC
        LIMIT 5
    ");
    while ($row = $res->fetch_assoc()) {
        $recent[] = $row;
    }
} catch (Exception $e) {
    $recent = [];
}

 $next = null;
try {
    $res2 = $conn->query("
        SELECT p.id, p.fecha,
               e1.nombre AS home_name, e1.logo AS home_logo,
               e2.nombre AS away_name, e2.logo AS away_logo
        FROM partidos p
        LEFT JOIN equipos e1 ON p.equipo_local = e1.id
        LEFT JOIN equipos e2 ON p.equipo_visitante = e2.id
        WHERE p.estado IS NULL OR p.estado != 'Finalizado'
        ORDER BY p.fecha ASC, p.id ASC
        LIMIT 1
    ");
    // CORREGIDO: $row2 nunca estaba definido, faltaba fetch_assoc()
    $row2 = $res2->fetch_assoc();
    if ($row2) {
        $next = $row2;
    }
} catch (Exception $e) {
    $next = null;
}

echo json_encode(['recent' => $recent, 'next' => $next]);

 $conn->close();