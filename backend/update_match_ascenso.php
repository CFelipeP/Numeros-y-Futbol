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

if (!$id) {
    echo json_enc(["error" => "ID requerido"]);
    exit;
}

if ((string)$g1 === '-1') {
    $stmt = $conn->prepare("SELECT local_id, visitante_id, goles_local, goles_visitante, status FROM partidos_ascenso WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $m = $res->fetch_assoc();
    $stmt->close();

    if ($m && $m['status'] === 'Finalizado' && $m['goles_local'] !== null) {
        $l = (int)$m['local_id'];
        $v = (int)$m['visitante_id'];
        $gl = (int)$m['goles_local'];
        $gv = (int)$m['goles_visitante'];

        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pj = GREATEST(pj - 1, 0) WHERE equipo_id IN (?, ?)");
        $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();

        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET gf = GREATEST(gf - ?, 0), gc = GREATEST(gc - ?, 0) WHERE equipo_id = ?");
        $stmt->bind_param("iii", $gl, $gv, $l); $stmt->execute(); $stmt->close();

        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET gf = GREATEST(gf - ?, 0), gc = GREATEST(gc - ?, 0) WHERE equipo_id = ?");
        $stmt->bind_param("iii", $gv, $gl, $v); $stmt->execute(); $stmt->close();

        if ($gl > $gv) {
            $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pg = GREATEST(pg - 1, 0), pts = GREATEST(pts - 3, 0) WHERE equipo_id = ?");
            $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
            $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pp = GREATEST(pp - 1, 0) WHERE equipo_id = ?");
            $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
        } elseif ($gl < $gv) {
            $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pg = GREATEST(pg - 1, 0), pts = GREATEST(pts - 3, 0) WHERE equipo_id = ?");
            $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
            $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pp = GREATEST(pp - 1, 0) WHERE equipo_id = ?");
            $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
        } else {
            $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pe = GREATEST(pe - 1, 0), pts = GREATEST(pts - 1, 0) WHERE equipo_id IN (?, ?)");
            $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
        }

        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET dg = gf - gc WHERE equipo_id IN (?, ?)");
        $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
    }

    $stmt = $conn->prepare("UPDATE partidos_ascenso SET goles_local = NULL, goles_visitante = NULL, status = 'Pendiente' WHERE id = ?");
    $stmt->bind_param("i", $id); $stmt->execute(); $stmt->close();

    echo json_enc(["success" => true, "reset" => true]);
    $conn->close();
    exit;
}

if ($g1 === "" || $g2 === "" || $g1 === null || $g2 === null) {
    echo json_enc(["error" => "Goles inválidos"]);
    exit;
}

$g1 = (int)$g1;
$g2 = (int)$g2;

$stmt = $conn->prepare("SELECT local_id, visitante_id, goles_local, goles_visitante, status FROM partidos_ascenso WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();
$m = $res->fetch_assoc();
$stmt->close();

if (!$m) {
    echo json_enc(["error" => "Partido no encontrado"]);
    exit;
}

$l = (int)$m['local_id'];
$v = (int)$m['visitante_id'];
$old_gl = $m['goles_local'] !== null ? (int)$m['goles_local'] : null;
$old_gv = $m['goles_visitante'] !== null ? (int)$m['goles_visitante'] : 0;
$wasFinal = strtolower(trim($m['status'] ?? '')) === 'finalizado';

if ($wasFinal && $old_gl !== null) {
    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pj = GREATEST(pj - 1, 0) WHERE equipo_id IN (?, ?)");
    $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();

    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET gf = GREATEST(gf - ?, 0), gc = GREATEST(gc - ?, 0) WHERE equipo_id = ?");
    $stmt->bind_param("iii", $old_gl, $old_gv, $l); $stmt->execute(); $stmt->close();

    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET gf = GREATEST(gf - ?, 0), gc = GREATEST(gc - ?, 0) WHERE equipo_id = ?");
    $stmt->bind_param("iii", $old_gv, $old_gl, $v); $stmt->execute(); $stmt->close();

    if ($old_gl > $old_gv) {
        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pg = GREATEST(pg - 1, 0), pts = GREATEST(pts - 3, 0) WHERE equipo_id = ?");
        $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pp = GREATEST(pp - 1, 0) WHERE equipo_id = ?");
        $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
    } elseif ($old_gl < $old_gv) {
        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pg = GREATEST(pg - 1, 0), pts = GREATEST(pts - 3, 0) WHERE equipo_id = ?");
        $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pp = GREATEST(pp - 1, 0) WHERE equipo_id = ?");
        $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
    } else {
        $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pe = GREATEST(pe - 1, 0), pts = GREATEST(pts - 1, 0) WHERE equipo_id IN (?, ?)");
        $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
    }

    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET dg = gf - gc WHERE equipo_id IN (?, ?)");
    $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
}

$stmt = $conn->prepare("UPDATE partidos_ascenso SET goles_local = ?, goles_visitante = ?, status = 'Finalizado' WHERE id = ?");
$stmt->bind_param("iii", $g1, $g2, $id); $stmt->execute(); $stmt->close();

$stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pj = pj + 1 WHERE equipo_id IN (?, ?)");
$stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();

$stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET gf = gf + ?, gc = gc + ? WHERE equipo_id = ?");
$stmt->bind_param("iii", $g1, $g2, $l); $stmt->execute(); $stmt->close();

$stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET gf = gf + ?, gc = gc + ? WHERE equipo_id = ?");
$stmt->bind_param("iii", $g2, $g1, $v); $stmt->execute(); $stmt->close();

if ($g1 > $g2) {
    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pg = pg + 1, pts = pts + 3 WHERE equipo_id = ?");
    $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pp = pp + 1 WHERE equipo_id = ?");
    $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
} elseif ($g1 < $g2) {
    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pg = pg + 1, pts = pts + 3 WHERE equipo_id = ?");
    $stmt->bind_param("i", $v); $stmt->execute(); $stmt->close();
    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pp = pp + 1 WHERE equipo_id = ?");
    $stmt->bind_param("i", $l); $stmt->execute(); $stmt->close();
} else {
    $stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET pe = pe + 1, pts = pts + 1 WHERE equipo_id IN (?, ?)");
    $stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();
}

$stmt = $conn->prepare("UPDATE tabla_posiciones_ascenso SET dg = gf - gc WHERE equipo_id IN (?, ?)");
$stmt->bind_param("ii", $l, $v); $stmt->execute(); $stmt->close();

echo json_enc(["success" => true]);
$conn->close();
