<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

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
