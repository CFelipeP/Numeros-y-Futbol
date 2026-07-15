<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    echo json_enc(['error' => 'ID de equipo no válido']);
    exit;
}

$year = (int)date('Y');
$month = (int)date('n');
$startYear = ($month >= 7) ? $year : $year - 1;
$temporada = $startYear . '-' . ($startYear + 1);

try {
    $stmt = $pdo->prepare("
        SELECT e.*, 
               t.puntos, t.partidos_jugados, t.ganados, t.empatados, t.perdidos,
               t.goles_favor, t.goles_contra
        FROM equipos_primera_femenina e
        LEFT JOIN tabla_posiciones_femenina t ON t.equipo_id = e.id
        WHERE e.id = ?
    ");
    $stmt->execute([$id]);
    $equipo = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$equipo) {
        echo json_enc(['error' => 'Equipo no encontrado']);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT j.*,
               IFNULL(s.partidos_jugados, 0) AS pj,
               IFNULL(s.goles, 0) AS goles,
               IFNULL(s.asistencias, 0) AS asistencias,
               IFNULL(s.tarjetas_amarillas, 0) AS amarillas,
               IFNULL(s.tarjetas_rojas, 0) AS rojas,
               IFNULL(s.goles_cabeza, 0) AS goles_cabeza,
               IFNULL(s.goles_tiro_libre, 0) AS goles_tiro_libre,
               IFNULL(s.goles_penal, 0) AS goles_penal,
               IFNULL(s.goles_recibidos, 0) AS goles_recibidos,
               IFNULL(s.vaya_invicta, 0) AS vaya_invicta,
               IFNULL(s.minutos_jugados, 0) AS minutos
        FROM jugadores_femenina j
        LEFT JOIN estadisticas_jugadores_femenina s ON s.jugador_id = j.id 
            AND s.temporada = '$temporada'
        WHERE j.equipo_id = ?
        ORDER BY 
            CASE j.posicion
                WHEN 'portero' THEN 1
                WHEN 'defensa' THEN 2
                WHEN 'medio' THEN 3
                WHEN 'delantero' THEN 4
            END,
            j.numero_camiseta ASC
    ");
    $stmt->execute([$id]);
    $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_enc([
        'equipo' => $equipo,
        'jugadores' => $jugadores
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_enc(['error' => "Error interno del servidor"]);
}
