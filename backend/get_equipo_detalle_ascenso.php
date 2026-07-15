<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    echo json_enc(["success" => false, "error" => "ID requerido"]);
    exit();
}

$year = (int)date('Y');
$month = (int)date('n');
$startYear = ($month >= 7) ? $year : $year - 1;
$temporada = $startYear . '-' . ($startYear + 1);

$stmt = $pdo->prepare("SELECT * FROM equipos_ascenso WHERE id = ?");
$stmt->execute([$id]);
$equipo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$equipo) {
    echo json_enc(["success" => false, "error" => "Equipo no encontrado"]);
    exit();
}

$stmt = $pdo->prepare("
    SELECT 
        j.*,
        est.id AS stats_id,
        est.partidos_jugados AS pj,
        est.goles,
        est.asistencias,
        est.goles_cabeza,
        est.goles_tiro_libre,
        est.goles_penal,
        est.tarjetas_amarillas,
        est.tarjetas_rojas,
        est.minutos_jugados,
        est.goles_recibidos,
        est.vaya_invicta,
        est.temporada
    FROM jugadores_ascenso j
    LEFT JOIN estadisticas_jugadores_ascenso est 
        ON est.jugador_id = j.id AND est.temporada = '$temporada'
    WHERE j.equipo_id = ?
    ORDER BY 
        CASE j.posicion
            WHEN 'portero' THEN 1
            WHEN 'lateral_izquierdo' THEN 2
            WHEN 'lateral_derecho' THEN 3
            WHEN 'central' THEN 4
            WHEN 'medio_defensivo' THEN 5
            WHEN 'medio_central' THEN 6
            WHEN 'medio_ofensivo' THEN 7
            WHEN 'extremo_izquierdo' THEN 8
            WHEN 'extremo_derecho' THEN 9
            WHEN 'centrodelantero' THEN 10
            WHEN 'segundo_delantero' THEN 11
            ELSE 12
        END,
        j.numero_camiseta ASC
");
$stmt->execute([$id]);
$jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_enc([
    "success" => true,
    "equipo" => $equipo,
    "jugadores" => $jugadores
]);
