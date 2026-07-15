<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body     = json_decode(file_get_contents("php://input"), true);
$id       = intval($body['partido_id'] ?? 0);
$division = trim($body['division']     ?? 'primera');
$equipo   = trim($body['equipo']       ?? 'local');    // 'local' | 'visitante'
$delta    = intval($body['delta']      ?? 1);           // +1 = gol, -1 = deshacer

if (!$id) { echo json_enc(["success" => false, "error" => "ID requerido"]); exit; }

try {
    switch ($division) {
        case 'ascenso':
            $table    = 'partidos_ascenso';
            $colLocal = 'goles_local';
            $colVisit = 'goles_visitante';
            break;
        default:
            $table    = 'partidos';
            $colLocal = 'goles_local';
            $colVisit = 'goles_visitante';
            break;
    }

    $col = ($equipo === 'visitante') ? $colVisit : $colLocal;

    // Prevent going below 0
    $stmt = $pdo->prepare("UPDATE `$table` SET `$col` = GREATEST(0, COALESCE(`$col`,0) + ?) WHERE id = ?");
    $stmt->execute([$delta, $id]);

    // Return updated scores
    $s = $pdo->prepare("SELECT `$colLocal` AS goles_local, `$colVisit` AS goles_visitante FROM `$table` WHERE id = ?");
    $s->execute([$id]);
    $row = $s->fetch(PDO::FETCH_ASSOC);

    echo json_enc(["success" => true, "goles_local" => (int)$row['goles_local'], "goles_visitante" => (int)$row['goles_visitante']]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}