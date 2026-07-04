<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$temporada = isset($_GET['temporada']) ? $_GET['temporada'] : '2025-2026';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 15;

try {
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
    echo json_enc($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_enc(['error' => 'Error']);
}
