<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;

$id = (int)($_POST['match_id'] ?? 0);
$g1 = $_POST['goles_local'] ?? null;
$g2 = $_POST['goles_visitante'] ?? null;
$fecha = $_POST['fecha'] ?? null;
$hora = $_POST['hora'] ?? null;
$jornada = $_POST['jornada'] ?? null;

if (!$id) { echo json_enc(["error" => "ID requerido"]); exit; }

// --- RESET ---
if ((string)$g1 === '-1') {
    $stmt = $conn->prepare("SELECT equipo_local, equipo_visitante, goles_local, goles_visitante, estado FROM partidos_reservas WHERE id=?");
    $stmt->bind_param("i", $id); $stmt->execute(); $res = $stmt->get_result(); $m = $res->fetch_assoc(); $stmt->close();
    if ($m && $m['estado'] === 'Finalizado' && $m['goles_local'] !== null) {
        $l=(int)$m['equipo_local']; $v=(int)$m['equipo_visitante']; $gl=(int)$m['goles_local']; $gv=(int)$m['goles_visitante'];
        $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET partidos_jugados=GREATEST(partidos_jugados-1,0) WHERE equipo_id IN (?,?)");
        $s->bind_param("ii", $l, $v); $s->execute(); $s->close();
        $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor=GREATEST(goles_favor-?,0), goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?");
        $s->bind_param("iii", $gl, $gv, $l); $s->execute(); $s->close();
        $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor=GREATEST(goles_favor-?,0), goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?");
        $s->bind_param("iii", $gv, $gl, $v); $s->execute(); $s->close();
        if ($gl > $gv) {
            $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=GREATEST(ganados-1,0), puntos=GREATEST(puntos-3,0) WHERE equipo_id=?");
            $s->bind_param("i", $l); $s->execute(); $s->close();
            $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?");
            $s->bind_param("i", $v); $s->execute(); $s->close();
        } elseif ($gl < $gv) {
            $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=GREATEST(ganados-1,0), puntos=GREATEST(puntos-3,0) WHERE equipo_id=?");
            $s->bind_param("i", $v); $s->execute(); $s->close();
            $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?");
            $s->bind_param("i", $l); $s->execute(); $s->close();
        } else {
            $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET empatados=GREATEST(empatados-1,0), puntos=GREATEST(puntos-1,0) WHERE equipo_id IN (?,?)");
            $s->bind_param("ii", $l, $v); $s->execute(); $s->close();
        }
    }
    $s = $conn->prepare("UPDATE partidos_reservas SET goles_local=NULL, goles_visitante=NULL, estado='Pendiente' WHERE id=?");
    $s->bind_param("i", $id); $s->execute(); $s->close();
    echo json_enc(["success" => true, "reset" => true]);
    $conn->close(); exit;
}

// --- NORMAL ---
if ($g1 === "" || $g2 === "" || $g1 === null || $g2 === null) { echo json_enc(["error" => "Goles inválidos"]); exit; }
$g1 = (int)$g1; $g2 = (int)$g2;
$stmt = $conn->prepare("SELECT equipo_local, equipo_visitante, goles_local, goles_visitante, estado FROM partidos_reservas WHERE id=?");
$stmt->bind_param("i", $id); $stmt->execute(); $res = $stmt->get_result(); $m = $res->fetch_assoc(); $stmt->close();
if (!$m) { echo json_enc(["error" => "Partido no encontrado"]); exit; }
$l = (int)$m['equipo_local']; $v = (int)$m['equipo_visitante'];
$old_gl = $m['goles_local'] !== null ? (int)$m['goles_local'] : null;
$old_gv = $m['goles_visitante'] !== null ? (int)$m['goles_visitante'] : null;
$wasFinal = $m['estado'] === 'Finalizado';
if ($wasFinal && $old_gl !== null) {
    $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET partidos_jugados=GREATEST(partidos_jugados-1,0) WHERE equipo_id IN (?,?)"); $s->bind_param("ii", $l, $v); $s->execute(); $s->close();
    $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor=GREATEST(goles_favor-?,0), goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?"); $s->bind_param("iii", $old_gl, $old_gv, $l); $s->execute(); $s->close();
    $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor=GREATEST(goles_favor-?,0), goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?"); $s->bind_param("iii", $old_gv, $old_gl, $v); $s->execute(); $s->close();
    if ($old_gl > $old_gv) {
        $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=GREATEST(ganados-1,0), puntos=GREATEST(puntos-3,0) WHERE equipo_id=?"); $s->bind_param("i", $l); $s->execute(); $s->close();
        $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?"); $s->bind_param("i", $v); $s->execute(); $s->close();
    } elseif ($old_gl < $old_gv) {
        $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=GREATEST(ganados-1,0), puntos=GREATEST(puntos-3,0) WHERE equipo_id=?"); $s->bind_param("i", $v); $s->execute(); $s->close();
        $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?"); $s->bind_param("i", $l); $s->execute(); $s->close();
    } else {
        $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET empatados=GREATEST(empatados-1,0), puntos=GREATEST(puntos-1,0) WHERE equipo_id IN (?,?)"); $s->bind_param("ii", $l, $v); $s->execute(); $s->close();
    }
}
$s = $conn->prepare("UPDATE partidos_reservas SET goles_local=?, goles_visitante=?, estado='Finalizado' WHERE id=?");
$s->bind_param("iii", $g1, $g2, $id); $s->execute(); $s->close();
if ($fecha && $hora) { $fh = $fecha . ' ' . $hora . ':00'; $s = $conn->prepare("UPDATE partidos_reservas SET fecha=? WHERE id=?"); $s->bind_param("si", $fh, $id); $s->execute(); $s->close(); }
if ($jornada !== null && $jornada !== '') { $ji = (int)$jornada; $s = $conn->prepare("UPDATE partidos_reservas SET jornada=? WHERE id=?"); $s->bind_param("ii", $ji, $id); $s->execute(); $s->close(); }
$s = $conn->prepare("UPDATE tabla_posiciones_reservas SET partidos_jugados=partidos_jugados+1 WHERE equipo_id IN (?,?)");
$s->bind_param("ii", $l, $v); $s->execute(); $s->close();
$s = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor=goles_favor+?, goles_contra=goles_contra+? WHERE equipo_id=?");
$s->bind_param("iii", $g1, $g2, $l); $s->execute(); $s->close();
$s = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor=goles_favor+?, goles_contra=goles_contra+? WHERE equipo_id=?");
$s->bind_param("iii", $g2, $g1, $v); $s->execute(); $s->close();
if ($g1 > $g2) {
    $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=ganados+1, puntos=puntos+3 WHERE equipo_id=?"); $s->bind_param("i", $l); $s->execute(); $s->close();
    $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=perdidos+1 WHERE equipo_id=?"); $s->bind_param("i", $v); $s->execute(); $s->close();
} elseif ($g1 < $g2) {
    $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=ganados+1, puntos=puntos+3 WHERE equipo_id=?"); $s->bind_param("i", $v); $s->execute(); $s->close();
    $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=perdidos+1 WHERE equipo_id=?"); $s->bind_param("i", $l); $s->execute(); $s->close();
} else {
    $s = $conn->prepare("UPDATE tabla_posiciones_reservas SET empatados=empatados+1, puntos=puntos+1 WHERE equipo_id IN (?,?)"); $s->bind_param("ii", $l, $v); $s->execute(); $s->close();
}
echo json_enc(["success" => true]);
$conn->close();
