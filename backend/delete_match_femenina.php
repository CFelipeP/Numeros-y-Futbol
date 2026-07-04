<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$id = (int)($_POST['id'] ?? 0);
if (!$id) {
    echo json_enc(["success" => false, "error" => "ID requerido"]);
    exit;
}

$conn->beginTransaction();
try {
    $stmt = $conn->prepare("SELECT equipo_local, equipo_visitante, goles_local, goles_visitante, estado FROM partidos_femenina WHERE id = ?");
    $stmt->execute([$id]);
    $match = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($match && $match['estado'] === 'Finalizado' && $match['goles_local'] !== null && $match['goles_visitante'] !== null) {
        $local = (int)$match['equipo_local'];
        $visitante = (int)$match['equipo_visitante'];
        $gl = (int)$match['goles_local'];
        $gv = (int)$match['goles_visitante'];

        $conn->exec("UPDATE tabla_posiciones_femenina SET partidos_jugados = GREATEST(partidos_jugados - 1, 0) WHERE equipo_id IN ($local, $visitante)");
        $conn->exec("UPDATE tabla_posiciones_femenina SET goles_favor = GREATEST(goles_favor - $gl, 0), goles_contra = GREATEST(goles_contra - $gv, 0) WHERE equipo_id = $local");
        $conn->exec("UPDATE tabla_posiciones_femenina SET goles_favor = GREATEST(goles_favor - $gv, 0), goles_contra = GREATEST(goles_contra - $gl, 0) WHERE equipo_id = $visitante");

        if ($gl > $gv) {
            $conn->exec("UPDATE tabla_posiciones_femenina SET ganados = GREATEST(ganados - 1, 0), puntos = GREATEST(puntos - 3, 0) WHERE equipo_id = $local");
            $conn->exec("UPDATE tabla_posiciones_femenina SET perdidos = GREATEST(perdidos - 1, 0) WHERE equipo_id = $visitante");
        } elseif ($gv > $gl) {
            $conn->exec("UPDATE tabla_posiciones_femenina SET ganados = GREATEST(ganados - 1, 0), puntos = GREATEST(puntos - 3, 0) WHERE equipo_id = $visitante");
            $conn->exec("UPDATE tabla_posiciones_femenina SET perdidos = GREATEST(perdidos - 1, 0) WHERE equipo_id = $local");
        } else {
            $conn->exec("UPDATE tabla_posiciones_femenina SET empatados = GREATEST(empatados - 1, 0), puntos = GREATEST(puntos - 1, 0) WHERE equipo_id IN ($local, $visitante)");
        }
    }

    $conn->prepare("DELETE FROM partidos_femenina WHERE id = ?")->execute([$id]);
    $conn->commit();
    echo json_enc(["success" => true]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_enc(["success" => false, "error" => "Error interno"]);
}
