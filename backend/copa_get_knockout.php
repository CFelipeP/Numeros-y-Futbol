<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {

    $fases = ["octavos", "cuartos", "semis", "final"];
    $data  = [];

    foreach ($fases as $fase) {
        $stmt = $pdo->prepare("
            SELECT
                p.id,
                p.equipo_local_id      AS team1_id,
                p.equipo_visitante_id  AS team2_id,
                el.nombre  AS team1,
                ev.nombre  AS team2,
                el.logo    AS logo1,
                ev.logo    AS logo2,
                el.division AS division1,
                ev.division AS division2,
                p.goles_local,
                p.goles_visitante,
                p.fecha,
                p.hora,
                p.estado,
                p.fase,
                p.llave,
                p.jornada,
                p.orden,
                p.penales_local,
                p.penales_visitante
            FROM partidos_copa p
            JOIN equipos_copa el ON el.id = p.equipo_local_id
            JOIN equipos_copa ev ON ev.id = p.equipo_visitante_id
            WHERE p.fase = ?
            ORDER BY p.orden, p.id
        ");
        $stmt->execute([$fase]);
        $data[$fase] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_enc(["success" => true, "data" => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_enc(["success" => false, "message" => "Error interno del servidor"]);
}
