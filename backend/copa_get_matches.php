<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {

    $stmt = $pdo->query("
        SELECT
            p.id,
            p.equipo_local_id   AS team1_id,
            p.equipo_visitante_id AS team2_id,
            el.nombre   AS team1,
            ev.nombre   AS team2,
            el.logo     AS logo1,
            ev.logo     AS logo2,
            el.division AS division1,
            ev.division AS division2,
            p.goles_local,
            p.goles_visitante,
            p.fecha,
            p.hora,
            p.estado,
            p.fase,
            p.llave,
            p.grupo_copa AS grupo,
            p.jornada,
            p.penales_local,
            p.penales_visitante
        FROM partidos_copa p
        JOIN equipos_copa el ON el.id = p.equipo_local_id
        JOIN equipos_copa ev ON ev.id = p.equipo_visitante_id
        ORDER BY
            FIELD(p.fase,'grupos','octavos','cuartos','semis','final'),
            p.grupo_copa,
            p.fecha,
            p.hora,
            p.id
    ");

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertir tipos numéricos correctamente
    foreach ($data as &$row) {
        $row['id']               = (int)$row['id'];
        $row['team1_id']         = (int)$row['team1_id'];
        $row['team2_id']         = (int)$row['team2_id'];
        $row['goles_local']      = $row['goles_local']      !== null ? (int)$row['goles_local']      : null;
        $row['goles_visitante']  = $row['goles_visitante']  !== null ? (int)$row['goles_visitante']  : null;
        $row['llave']            = $row['llave']            !== null ? (int)$row['llave']            : null;
        $row['penales_local']    = $row['penales_local']    !== null ? (int)$row['penales_local']    : null;
        $row['penales_visitante']= $row['penales_visitante']!== null ? (int)$row['penales_visitante']: null;
    }

    echo json_enc(["success" => true, "data" => $data]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_enc(["success" => false, "message" => "Error interno del servidor"]);
}
