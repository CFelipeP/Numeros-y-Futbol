<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body     = json_decode(file_get_contents("php://input"), true);
$id       = intval($body['id']       ?? 0);
$division = trim($body['division']   ?? 'primera');
$estado   = trim($body['estado']     ?? 'En Curso');

if (!$id) { echo json_enc(["success" => false, "error" => "ID requerido"]); exit; }

$allowed = ['Pendiente', 'En Curso', 'Finalizado'];
if (!in_array($estado, $allowed)) { echo json_enc(["success" => false, "error" => "Estado inválido"]); exit; }

try {
    switch ($division) {
        case 'segunda':
            $table  = 'partidos_segunda';
            $colEst = 'status';
            $colLocalId = 'local_id';
            $colVisitId = 'visitante_id';
            $tablaPos = 'tabla_posiciones_segunda';
            break;
        case 'tercera':
            $table  = 'partidos_tercera';
            $colEst = 'status';
            $colLocalId = 'local_id';
            $colVisitId = 'visitante_id';
            $tablaPos = 'tabla_posiciones_tercera';
            break;
        default:
            $table  = 'partidos';
            $colEst = 'estado';
            $colLocalId = 'equipo_local';
            $colVisitId = 'equipo_visitante';
            $tablaPos = null;
            break;
    }

    $prev = null;
    if ($tablaPos) {
        $s = $pdo->prepare("
            SELECT `$colLocalId` AS local_id, `$colVisitId` AS visitante_id,
                   COALESCE(goles_local, 0) AS goles_local,
                   COALESCE(goles_visitante, 0) AS goles_visitante,
                   `$colEst` AS estado
            FROM `$table`
            WHERE id = ?
            LIMIT 1
        ");
        $s->execute([$id]);
        $prev = $s->fetch(PDO::FETCH_ASSOC);
    }

    $stmt = $pdo->prepare("UPDATE `$table` SET `$colEst` = ? WHERE id = ?");
    $stmt->execute([$estado, $id]);

    if ($tablaPos && $estado === 'Finalizado' && $prev && strtolower(trim($prev['estado'] ?? '')) !== 'finalizado') {
        $l = (int)$prev['local_id'];
        $v = (int)$prev['visitante_id'];
        $gl = (int)$prev['goles_local'];
        $gv = (int)$prev['goles_visitante'];

        $pdo->prepare("UPDATE `$table` SET goles_local = ?, goles_visitante = ? WHERE id = ?")->execute([$gl, $gv, $id]);

        $pdo->exec("UPDATE `$tablaPos` SET pj = pj + 1 WHERE equipo_id IN ($l, $v)");
        $pdo->exec("UPDATE `$tablaPos` SET gf = gf + $gl, gc = gc + $gv WHERE equipo_id = $l");
        $pdo->exec("UPDATE `$tablaPos` SET gf = gf + $gv, gc = gc + $gl WHERE equipo_id = $v");

        if ($gl > $gv) {
            $pdo->exec("UPDATE `$tablaPos` SET pg = pg + 1, pts = pts + 3 WHERE equipo_id = $l");
            $pdo->exec("UPDATE `$tablaPos` SET pp = pp + 1 WHERE equipo_id = $v");
        } elseif ($gl < $gv) {
            $pdo->exec("UPDATE `$tablaPos` SET pg = pg + 1, pts = pts + 3 WHERE equipo_id = $v");
            $pdo->exec("UPDATE `$tablaPos` SET pp = pp + 1 WHERE equipo_id = $l");
        } else {
            $pdo->exec("UPDATE `$tablaPos` SET pe = pe + 1, pts = pts + 1 WHERE equipo_id IN ($l, $v)");
        }

        $pdo->exec("UPDATE `$tablaPos` SET dg = gf - gc WHERE equipo_id IN ($l, $v)");
    }

    echo json_enc(["success" => true, "estado" => $estado]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}
