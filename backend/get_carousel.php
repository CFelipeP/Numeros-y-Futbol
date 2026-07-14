<?php
header('Content-Type: application/json');
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';

try {
    require_once __DIR__ . '/db.php';

    $division = $_GET['division'] ?? 'primera';

    switch ($division) {
        case 'femenina':
            $tPartidos = 'partidos_femenina';
            $tEquipos  = 'equipos_primera_femenina';
            $colLocal  = 'equipo_local';
            $colVisit  = 'equipo_visitante';
            break;
        case 'segunda':
        case 'ascenso':
            $tPartidos = 'partidos_segunda';
            $tEquipos  = 'equipos_segunda';
            $colLocal  = 'local_id';
            $colVisit  = 'visitante_id';
            break;
        case 'tercera':
            $tPartidos = 'partidos_tercera';
            $tEquipos  = 'equipos_tercera';
            $colLocal  = 'local_id';
            $colVisit  = 'visitante_id';
            break;
        default:
            $tPartidos = 'partidos';
            $tEquipos  = 'equipos';
            $colLocal  = 'equipo_local';
            $colVisit  = 'equipo_visitante';
            break;
    }

    $sql = $conn->query("
        SELECT
            p.id,
            '$division' AS division,
            p.goles_local,
            p.goles_visitante,
            p.estado,
            p.fecha,
            el.nombre AS team1,
            el.logo   AS logo1,
            ev.nombre AS team2,
            ev.logo   AS logo2
        FROM $tPartidos p
        JOIN $tEquipos el ON p.$colLocal = el.id
        JOIN $tEquipos ev ON p.$colVisit = ev.id
        WHERE p.estado IN ('Finalizado', 'En Curso', 'Pendiente')
        ORDER BY
            FIELD(p.estado, 'En Curso', 'Pendiente', 'Finalizado'),
            p.fecha DESC
        LIMIT 6
    ");

    $partidos = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_enc(["success" => true, "data" => $partidos]);
} catch (PDOException $e) {
    echo json_enc(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_enc(['success' => false, 'message' => 'Error interno del servidor: ' . $e->getMessage()]);
}
