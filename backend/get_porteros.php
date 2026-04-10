<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

 $host = 'localhost';
 $db   = 'numeros-y-futbol';
 $user = 'root';
 $pass = 'Info2026/*-';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("
        SELECT 
            j.id,
            j.nombre,
            j.numero_camiseta,
            j.foto,
            e.nombre AS equipo,
            e.logo AS equipo_logo,
            s.partidos_jugados AS pj,
            s.goles_recibidos AS gc,
            s.vaya_invicta,
            ROUND(
                (s.goles_recibidos / NULLIF(s.partidos_jugados, 0)) - (s.vaya_invicta * 0.5),
                2
            ) AS score
        FROM estadisticas_jugadores s
        INNER JOIN jugadores j ON j.id = s.jugador_id
        INNER JOIN equipos e ON e.id = j.equipo_id
        WHERE s.temporada = '2025-2026' AND j.posicion = 'portero'
        ORDER BY score ASC
        LIMIT 10
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'line' => $e->getLine()
    ]);
}