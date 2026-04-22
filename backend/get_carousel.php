<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "db.php";

// Solo Primera División, los más recientes primero
$sql = $conn->query("
    SELECT
        p.id,
        p.goles_local,
        p.goles_visitante,
        p.estado,
        p.fecha,
        el.nombre AS team1,
        el.logo   AS logo1,
        ev.nombre AS team2,
        ev.logo   AS logo2
    FROM partidos p
    JOIN equipos el ON p.equipo_local     = el.id
    JOIN equipos ev ON p.equipo_visitante = ev.id
    WHERE p.estado IN ('Finalizado', 'En Curso', 'Pendiente')
    ORDER BY
        FIELD(p.estado, 'En Curso', 'Pendiente', 'Finalizado'),
        p.fecha DESC
    LIMIT 6
");

$partidos = $sql->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "data" => $partidos]);