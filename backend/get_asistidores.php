<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$year = (int)date('Y');
$month = (int)date('n');
$startYear = ($month >= 7) ? $year : $year - 1;
$temporada = $startYear . '-' . ($startYear + 1);
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 15;

try {
    $stmt = $pdo->prepare("
        SELECT 
            j.id, j.nombre, j.posicion, j.numero_camiseta, j.foto, j.equipo_id,
            e.nombre AS equipo_nombre, e.logo AS equipo_logo,
            s.partidos_jugados AS pj, s.asistencias, s.goles
        FROM estadisticas_jugadores s
        INNER JOIN jugadores j ON j.id = s.jugador_id
        INNER JOIN equipos e ON e.id = j.equipo_id
        WHERE s.temporada = ? AND s.asistencias > 0
        ORDER BY s.asistencias DESC
        LIMIT $limit
    ");
    $stmt->execute([$temporada]);
    echo json_enc($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    error_log('Error get_asistidores: ' . $e->getMessage());
    echo json_enc([]);
}
