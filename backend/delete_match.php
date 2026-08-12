<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();
requirePost();

$conn = $mysqli;

$id = intval($_POST['id'] ?? 0);
if (!$id) { echo json_enc(["error" => "ID requerido"]); exit; }

$stmt = $conn->prepare("SELECT equipo_local, equipo_visitante, goles_local, goles_visitante, estado FROM partidos WHERE id = ?");
$stmt->bind_param("i", $id); $stmt->execute(); $res = $stmt->get_result(); $m = $res->fetch_assoc(); $stmt->close();

if (!$m) { echo json_enc(["error" => "No existe"]); exit; }

if ($m['estado'] === 'Finalizado' && $m['goles_local'] !== null) {
    $l=(int)$m['equipo_local'];$v=(int)$m['equipo_visitante'];$gl=(int)$m['goles_local'];$gv=(int)$m['goles_visitante'];
    $s = $conn->prepare("UPDATE tabla_posiciones SET partidos_jugados=GREATEST(partidos_jugados-1,0) WHERE equipo_id IN (?,?)"); $s->bind_param("ii", $l, $v); $s->execute(); $s->close();
    $s = $conn->prepare("UPDATE tabla_posiciones SET goles_favor=GREATEST(goles_favor-?,0),goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?"); $s->bind_param("iii", $gl, $gv, $l); $s->execute(); $s->close();
    $s = $conn->prepare("UPDATE tabla_posiciones SET goles_favor=GREATEST(goles_favor-?,0),goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?"); $s->bind_param("iii", $gv, $gl, $v); $s->execute(); $s->close();
    if ($gl > $gv) {
        $s = $conn->prepare("UPDATE tabla_posiciones SET ganados=GREATEST(ganados-1,0),puntos=GREATEST(puntos-3,0) WHERE equipo_id=?"); $s->bind_param("i", $l); $s->execute(); $s->close();
        $s = $conn->prepare("UPDATE tabla_posiciones SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?"); $s->bind_param("i", $v); $s->execute(); $s->close();
    } elseif ($gl < $gv) {
        $s = $conn->prepare("UPDATE tabla_posiciones SET ganados=GREATEST(ganados-1,0),puntos=GREATEST(puntos-3,0) WHERE equipo_id=?"); $s->bind_param("i", $v); $s->execute(); $s->close();
        $s = $conn->prepare("UPDATE tabla_posiciones SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?"); $s->bind_param("i", $l); $s->execute(); $s->close();
    } else {
        $s = $conn->prepare("UPDATE tabla_posiciones SET empatados=GREATEST(empatados-1,0),puntos=GREATEST(puntos-1,0) WHERE equipo_id IN (?,?)"); $s->bind_param("ii", $l, $v); $s->execute(); $s->close();
    }
}

$s = $conn->prepare("DELETE FROM partidos WHERE id = ?");
$s->bind_param("i", $id);
$s->execute(); $s->close();
echo json_enc(["success" => true]);
$conn->close();
