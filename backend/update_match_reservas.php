<?php
error_reporting(0);
ini_set('display_errors', 0);
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

if (!$id) {
    echo json_enc(["error" => "ID requerido"]);
    exit;
}

if ((string)$g1 === '-1') {
    $stmt = $conn->prepare("SELECT equipo_local, equipo_visitante, goles_local, goles_visitante, estado FROM partidos_reservas WHERE id=?");
    $stmt->bind_param("i", $id); $stmt->execute(); $res = $stmt->get_result(); $m = $res->fetch_assoc(); $stmt->close();
    if ($m && $m['estado'] === 'Finalizado' && $m['goles_local'] !== null) {
        $l = (int)$m['equipo_local']; $v = (int)$m['equipo_visitante'];
        $gl = (int)$m['goles_local']; $gv = (int)$m['goles_visitante'];
        $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET partidos_jugados = GREATEST(partidos_jugados-1,0) WHERE equipo_id IN (?, ?)");
        $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
        $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor = GREATEST(goles_favor-?,0), goles_contra = GREATEST(goles_contra-?,0) WHERE equipo_id=?"); $stmt->bind_param("iii", $gl, $gv, $l); $stmt->execute(); $stmt->close();
        $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor = GREATEST(goles_favor-?,0), goles_contra = GREATEST(goles_contra-?,0) WHERE equipo_id=?"); $stmt->bind_param("iii", $gv, $gl, $v); $stmt->execute(); $stmt->close();
        if ($gl > $gv) {
            $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=GREATEST(ganados-1,0), puntos=GREATEST(puntos-3,0) WHERE equipo_id=?"); $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
            $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?"); $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
        } elseif ($gl < $gv) {
            $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=GREATEST(ganados-1,0), puntos=GREATEST(puntos-3,0) WHERE equipo_id=?"); $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
            $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?"); $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
        } else {
            $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET empatados=GREATEST(empatados-1,0), puntos=GREATEST(puntos-1,0) WHERE equipo_id IN (?, ?)"); $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
        }
    }
    $stmt = $conn->prepare("UPDATE partidos_reservas SET goles_local=NULL, goles_visitante=NULL, estado='Pendiente' WHERE id=?"); $stmt->bind_param("i", $id); $stmt->execute(); $stmt->close();
    echo json_enc(["success" => true, "reset" => true]);
    $conn->close();
    exit;
}

if ($g1 === "" || $g2 === "" || $g1 === null || $g2 === null) {
    echo json_enc(["error" => "Goles inválidos"]);
    exit;
}

$g1 = (int)$g1; $g2 = (int)$g2;
$stmt = $conn->prepare("SELECT equipo_local, equipo_visitante, goles_local, goles_visitante, estado FROM partidos_reservas WHERE id=?");
$stmt->bind_param("i", $id); $stmt->execute(); $res = $stmt->get_result(); $m = $res->fetch_assoc(); $stmt->close();
if (!$m) { echo json_enc(["error" => "Partido no encontrado"]); exit; }
$l = (int)$m['equipo_local']; $v = (int)$m['equipo_visitante'];
$old_gl = $m['goles_local'] !== null ? (int)$m['goles_local'] : null;
$old_gv = $m['goles_visitante'] !== null ? (int)$m['goles_visitante'] : null;
$wasFinal = $m['estado'] === 'Finalizado';

if ($wasFinal && $old_gl !== null) {
    $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET partidos_jugados = GREATEST(partidos_jugados-1,0) WHERE equipo_id IN (?, ?)"); $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
    $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor = GREATEST(goles_favor-?,0), goles_contra = GREATEST(goles_contra-?,0) WHERE equipo_id=?"); $stmt->bind_param("iii", $old_gl, $old_gv, $l); $stmt->execute(); $stmt->close();
    $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor = GREATEST(goles_favor-?,0), goles_contra = GREATEST(goles_contra-?,0) WHERE equipo_id=?"); $stmt->bind_param("iii", $old_gv, $old_gl, $v); $stmt->execute(); $stmt->close();
    if ($old_gl > $old_gv) {
        $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=GREATEST(ganados-1,0), puntos=GREATEST(puntos-3,0) WHERE equipo_id=?"); $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
        $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?"); $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
    } elseif ($old_gl < $old_gv) {
        $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=GREATEST(ganados-1,0), puntos=GREATEST(puntos-3,0) WHERE equipo_id=?"); $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
        $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?"); $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
    } else {
        $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET empatados=GREATEST(empatados-1,0), puntos=GREATEST(puntos-1,0) WHERE equipo_id IN (?, ?)"); $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
    }
}

$stmt = $conn->prepare("UPDATE partidos_reservas SET goles_local=?, goles_visitante=?, estado='Finalizado' WHERE id=?"); $stmt->bind_param("iii", $g1, $g2, $id); $stmt->execute(); $stmt->close();
if ($fecha && $hora) { $fecha_hora = $fecha . ' ' . $hora . ':00'; $stmt = $conn->prepare("UPDATE partidos_reservas SET fecha=? WHERE id=?"); $stmt->bind_param("si", $fecha_hora, $id); $stmt->execute(); $stmt->close(); }
if ($jornada !== null && $jornada !== '') { $jornadaInt = (int)$jornada; $stmt = $conn->prepare("UPDATE partidos_reservas SET jornada=? WHERE id=?"); $stmt->bind_param("ii", $jornadaInt, $id); $stmt->execute(); $stmt->close(); }

$stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET partidos_jugados = partidos_jugados + 1 WHERE equipo_id IN (?, ?)"); $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
$stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor = goles_favor + ?, goles_contra = goles_contra + ? WHERE equipo_id=?"); $stmt->bind_param("iii", $g1, $g2, $l); $stmt->execute(); $stmt->close();
$stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET goles_favor = goles_favor + ?, goles_contra = goles_contra + ? WHERE equipo_id=?"); $stmt->bind_param("iii", $g2, $g1, $v); $stmt->execute(); $stmt->close();

if ($g1 > $g2) {
    $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=ganados+1, puntos=puntos+3 WHERE equipo_id=?"); $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
    $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=perdidos+1 WHERE equipo_id=?"); $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
} elseif ($g1 < $g2) {
    $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET ganados=ganados+1, puntos=puntos+3 WHERE equipo_id=?"); $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
    $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET perdidos=perdidos+1 WHERE equipo_id=?"); $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
} else {
    $stmt = $conn->prepare("UPDATE tabla_posiciones_reservas SET empatados=empatados+1, puntos=puntos+1 WHERE equipo_id IN (?, ?)"); $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
}

echo json_enc(["success" => true]);
$conn->close();
