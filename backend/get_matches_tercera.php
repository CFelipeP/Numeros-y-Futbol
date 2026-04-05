<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $result = $conn->query("SELECT p.*, e1.nombre AS local_nombre, e1.logo AS home_logo, e2.nombre AS visitante_nombre, e2.logo AS away_logo FROM partidos_tercera p LEFT JOIN equipos_tercera e1 ON p.local_id = e1.id LEFT JOIN equipos_tercera e2 ON p.visitante_id = e2.id ORDER BY p.fecha DESC, p.id DESC");

 $partidos = [];
while ($row = $result->fetch_assoc()) {
    $gl = $row['goles_local'];
    $gv = $row['goles_visitante'];
    $row['score'] = ($gl !== null && $gv !== null) ? "$gl - $gv" : "-";
    $row['date'] = $row['fecha'];
    $partidos[] = $row;
}
echo json_encode($partidos);