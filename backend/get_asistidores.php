<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');

 $temporada = isset($_GET['temporada']) ? $_GET['temporada'] : '2025-2026';
 $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 15;

 $host = 'localhost';
 $db   = 'numeros_futbol';
 $user = 'root';
 $pass = 'Info2026/*-';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("
        SELECT 
            j.id, j.nombre, j.posicion, j.numero_camiseta, j.foto, j.equipo_id,
            e.nombre AS equipo_nombre, e.logo AS equipo_logo,
            s.partidos_jugados AS pj, s.asistencias, s.goles,
            ROUND(s.asistencias / NULLIF(s.partidos_jugados, 0), 2) AS promedio_asistencias
        FROM estadisticas_jugadores s
        INNER JOIN jugadores j ON j.id = s.jugador_id
        INNER JOIN equipos e ON e.id = j.equipo_id
        WHERE s.temporada = ? AND s.asistencias > 0
        ORDER BY s.asistencias DESC, s.goles DESC, s.partidos_jugados ASC
        LIMIT ?
    ");
    $stmt->execute([$temporada, $limit]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error']);
}