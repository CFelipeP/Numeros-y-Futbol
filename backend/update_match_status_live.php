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
        case 'ascenso':
            $table     = 'partidos_ascenso';
            $colEst    = 'status';
            $colLocal  = 'local_id';
            $colVisit  = 'visitante_id';
            $tablaPos  = 'tabla_posiciones_ascenso';
            $colPJ='pj'; $colG='pg'; $colE='pe'; $colP='pp';
            $colGF='gf'; $colGC='gc'; $colDG='dg'; $colPTS='pts';
            break;
        case 'femenina':
            $table     = 'partidos_femenina';
            $colEst    = 'estado';
            $colLocal  = 'equipo_local';
            $colVisit  = 'equipo_visitante';
            $tablaPos  = 'tabla_posiciones_femenina';
            $colPJ='partidos_jugados'; $colG='ganados'; $colE='empatados'; $colP='perdidos';
            $colGF='goles_favor'; $colGC='goles_contra'; $colDG=null; $colPTS='puntos';
            break;
        case 'reservas':
            $table     = 'partidos_reservas';
            $colEst    = 'estado';
            $colLocal  = 'equipo_local';
            $colVisit  = 'equipo_visitante';
            $tablaPos  = 'tabla_posiciones_reservas';
            $colPJ='partidos_jugados'; $colG='ganados'; $colE='empatados'; $colP='perdidos';
            $colGF='goles_favor'; $colGC='goles_contra'; $colDG=null; $colPTS='puntos';
            break;
        default: // primera
            $table     = 'partidos';
            $colEst    = 'estado';
            $colLocal  = 'equipo_local';
            $colVisit  = 'equipo_visitante';
            $tablaPos  = 'tabla_posiciones';
            $colPJ='partidos_jugados'; $colG='ganados'; $colE='empatados'; $colP='perdidos';
            $colGF='goles_favor'; $colGC='goles_contra'; $colDG=null; $colPTS='puntos';
            break;
    }

    // Leer estado previo
    $s = $pdo->prepare("
        SELECT `$colLocal` AS local_id, `$colVisit` AS visitante_id,
               COALESCE(goles_local, 0) AS goles_local,
               COALESCE(goles_visitante, 0) AS goles_visitante,
               `$colEst` AS estado
        FROM `$table` WHERE id = ? LIMIT 1
    ");
    $s->execute([$id]);
    $prev = $s->fetch(PDO::FETCH_ASSOC);

    // Actualizar estado
    $pdo->prepare("UPDATE `$table` SET `$colEst` = ? WHERE id = ?")->execute([$estado, $id]);

    // Actualizar tabla de posiciones si se finaliza y no estaba finalizado antes
    if ($estado === 'Finalizado' && $prev && strtolower(trim($prev['estado'] ?? '')) !== 'finalizado') {
        $l  = (int)$prev['local_id'];
        $v  = (int)$prev['visitante_id'];
        $gl = (int)$prev['goles_local'];
        $gv = (int)$prev['goles_visitante'];

        $pdo->beginTransaction();

        try {
            // Asegurar que los goles estén guardados
            $pdo->prepare("UPDATE `$table` SET goles_local = ?, goles_visitante = ? WHERE id = ?")->execute([$gl, $gv, $id]);

            // PJ +1 para ambos
            $pdo->exec("UPDATE `$tablaPos` SET $colPJ = $colPJ + 1 WHERE equipo_id IN ($l, $v)");

            // GF y GC
            $pdo->exec("UPDATE `$tablaPos` SET $colGF = $colGF + $gl, $colGC = $colGC + $gv WHERE equipo_id = $l");
            $pdo->exec("UPDATE `$tablaPos` SET $colGF = $colGF + $gv, $colGC = $colGC + $gl WHERE equipo_id = $v");

            // G, E, P, PTS
            if ($gl > $gv) {
                $pdo->exec("UPDATE `$tablaPos` SET $colG = $colG + 1, $colPTS = $colPTS + 3 WHERE equipo_id = $l");
                $pdo->exec("UPDATE `$tablaPos` SET $colP = $colP + 1 WHERE equipo_id = $v");
            } elseif ($gl < $gv) {
                $pdo->exec("UPDATE `$tablaPos` SET $colG = $colG + 1, $colPTS = $colPTS + 3 WHERE equipo_id = $v");
                $pdo->exec("UPDATE `$tablaPos` SET $colP = $colP + 1 WHERE equipo_id = $l");
            } else {
                $pdo->exec("UPDATE `$tablaPos` SET $colE = $colE + 1, $colPTS = $colPTS + 1 WHERE equipo_id IN ($l, $v)");
            }

            // DG (solo para ascenso que tiene columna dg)
            if ($colDG) {
                $pdo->exec("UPDATE `$tablaPos` SET $colDG = $colGF - $colGC WHERE equipo_id IN ($l, $v)");
            }

            $pdo->commit();
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    echo json_enc(["success" => true, "estado" => $estado]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}
