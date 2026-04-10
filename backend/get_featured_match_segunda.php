<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $match = $conn->query("
    SELECT p.*, 
           t1.nombre as home_name, t1.logo as home_logo,
           t2.nombre as away_name, t2.logo as away_logo,
           p.fecha as fecha
    FROM partidos_segunda p
    LEFT JOIN equipos_segunda t1 ON p.local_id = t1.id
    LEFT JOIN equipos_segunda t2 ON p.visitante_id = t2.id
    WHERE p.featured = 1
    LIMIT 1
")->fetch_assoc();

if ($match) {
    echo json_encode($match);
} else {
    echo json_encode(null);
}
 $conn->close();