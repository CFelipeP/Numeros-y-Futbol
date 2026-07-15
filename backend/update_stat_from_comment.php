<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body       = json_decode(file_get_contents("php://input"), true);
$jugador_id = intval($body['jugador_id'] ?? 0);
$division   = trim($body['division']     ?? 'primera');
$tipo       = trim($body['tipo']         ?? '');
$subtipo    = trim($body['subtipo']      ?? '');
$deshacer   = (bool)($body['deshacer']   ?? false);

if (!$jugador_id || !$tipo) {
    echo json_enc(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

// Tabla de stats según división
switch ($division) {
    case 'ascenso': $tabla = 'estadisticas_jugadores_ascenso'; break;
    default:        $tabla = 'estadisticas_jugadores';         break;
}

$delta = $deshacer ? -1 : 1;

// Columna a actualizar
switch ($tipo) {
    case 'gol':
        $cols = ['goles'];
        if ($subtipo === 'penal')  $cols[] = 'goles_penal';
        if ($subtipo === 'cabeza') $cols[] = 'goles_cabeza';
        if ($subtipo === 'libre')  $cols[] = 'goles_tiro_libre';
        break;
    case 'asistencia':
        $cols = ['asistencias'];
        break;
    case 'tarjeta_amarilla':
        $cols = ['tarjetas_amarillas'];
        break;
    case 'tarjeta_roja':
        $cols = ['tarjetas_rojas'];
        break;
    default:
        echo json_enc(["success" => true, "skipped" => true]);
        exit;
}

try {
    // Calcular temporada actual: ej. mayo 2026 -> "2025-2026" (julio a junio)
    $year = (int)date('Y');
    $month = (int)date('n');
    $startYear = ($month >= 7) ? $year : $year - 1;
    $temporada = $startYear . '-' . ($startYear + 1);

    // Upsert – asegurarse de que existe la fila
    $ins = $pdo->prepare("
        INSERT INTO `$tabla` (jugador_id, temporada)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE jugador_id = jugador_id
    ");
    $ins->execute([$jugador_id, $temporada]);

    // Actualizar cada columna
    foreach ($cols as $col) {
        $upd = $pdo->prepare("
            UPDATE `$tabla`
            SET `$col` = GREATEST(0, COALESCE(`$col`, 0) + ?)
            WHERE jugador_id = ? AND temporada = ?
        ");
        $upd->execute([$delta, $jugador_id, $temporada]);
    }

    echo json_enc(["success" => true, "jugador_id" => $jugador_id, "cols" => $cols, "delta" => $delta]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}