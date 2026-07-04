<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {
    $sql = "
        SELECT 
            p.id,
            p.equipo_local AS local_id,
            p.equipo_visitante AS visitante_id,
            p.goles_local,
            p.goles_visitante,
            p.estado,
            p.fecha,
            el.nombre AS home_name,
            el.logo AS home_logo,
            ev.nombre AS away_name,
            ev.logo AS away_logo
        FROM partidos_femenina p
        INNER JOIN equipos_primera_femenina el ON el.id = p.equipo_local
        INNER JOIN equipos_primera_femenina ev ON ev.id = p.equipo_visitante
        WHERE p.featured = 1
        ORDER BY p.fecha DESC
        LIMIT 1
    ";

    $stmt = $pdo->query($sql);
    $match = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$match) {
        echo json_enc(null);
    } else {
        echo json_enc($match);
    }
} catch (Exception $e) {
    echo json_enc(null);
}
