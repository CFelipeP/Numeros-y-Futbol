<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {
    $division = $_GET['division'] ?? 'primera';

    switch ($division) {
        case 'femenina':
            $tPartidos = 'partidos_femenina'; $tEquipos = 'equipos_primera_femenina';
            $colLocal = 'equipo_local'; $colVisit = 'equipo_visitante'; break;
        case 'ascenso':
            $tPartidos = 'partidos_ascenso'; $tEquipos = 'equipos_ascenso';
            $colLocal = 'local_id'; $colVisit = 'visitante_id'; break;
        case 'reservas':
            $tPartidos = 'partidos_reservas'; $tEquipos = 'equipos_reservas';
            $colLocal = 'equipo_local'; $colVisit = 'equipo_visitante'; break;
        default:
            $tPartidos = 'partidos'; $tEquipos = 'equipos';
            $colLocal = 'equipo_local'; $colVisit = 'equipo_visitante'; break;
    }

    $sql = "
        SELECT 
            p.id,
            p.$colLocal AS local_id,
            p.$colVisit AS visitante_id,
            p.goles_local,
            p.goles_visitante,
            p.estado,
            p.fecha,
            el.nombre AS home_name,
            el.logo AS home_logo,
            ev.nombre AS away_name,
            ev.logo AS away_logo
        FROM $tPartidos p
        INNER JOIN $tEquipos el ON el.id = p.$colLocal
        INNER JOIN $tEquipos ev ON ev.id = p.$colVisit
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
