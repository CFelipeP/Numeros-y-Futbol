<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

 $id = $_POST['match_id'] ?? null;
 $g1 = $_POST['goles_local'] ?? null;
 $g2 = $_POST['goles_visitante'] ?? null;

if (!$id) {
    echo json_encode(["error" => "ID requerido"]);
    exit;
}

// MODO RESET
if ((string)$g1 === '-1') {
    $id = (int)$id;
    $res = $conn->query("SELECT local_id, visitante_id, goles_local, goles_visitante, status FROM partidos_tercera WHERE id=$id");
    $m = $res->fetch_assoc();

    if (!$m) {
        echo json_encode(["error" => "Partido no encontrado"]);
        exit;
    }

    if ($m['status'] === 'Finalizado' && $m['goles_local'] !== null) {
        $l = (int)$m['local_id'];
        $v = (int)$m['visitante_id'];
        $gl = (int)$m['goles_local'];
        $gv = (int)$m['goles_visitante'];

        $conn->query("UPDATE tabla_posiciones_tercera SET pj = GREATEST(pj - 1, 0) WHERE equipo_id IN ($l,$v)");
        $conn->query("UPDATE tabla_posiciones_tercera SET gf = GREATEST(gf - $gl, 0), gc = GREATEST(gc - $gv, 0) WHERE equipo_id = $l");
        $conn->query("UPDATE tabla_posiciones_tercera SET gf = GREATEST(gf - $gv, 0), gc = GREATEST(gc - $gl, 0) WHERE equipo_id = $v");

        if ($gl > $gv) {
            $conn->query("UPDATE tabla_posiciones_tercera SET pg = GREATEST(pg - 1, 0), pts = GREATEST(pts - 3, 0) WHERE equipo_id = $l");
            $conn->query("UPDATE tabla_posiciones_tercera SET pp = GREATEST(pp - 1, 0) WHERE equipo_id = $v");
        } elseif ($gl < $gv) {
            $conn->query("UPDATE tabla_posiciones_tercera SET pg = GREATEST(pg - 1, 0), pts = GREATEST(pts - 3, 0) WHERE equipo_id = $v");
            $conn->query("UPDATE tabla_posiciones_tercera SET pp = GREATEST(pp - 1, 0) WHERE equipo_id = $l");
        } else {
            $conn->query("UPDATE tabla_posiciones_tercera SET pe = GREATEST(pe - 1, 0), pts = GREATEST(pts - 1, 0) WHERE equipo_id IN ($l,$v)");
        }

        $conn->query("UPDATE tabla_posiciones_tercera SET dg = gf - gc WHERE equipo_id IN ($l,$v)");
    }

    $conn->query("UPDATE partidos_tercera SET goles_local = NULL, goles_visitante = NULL, status = 'Pendiente' WHERE id = $id");

    echo json_encode(["success" => true, "reset" => true]);
    $conn->close();
    exit;
}

// MODO NORMAL
if ($g1 === "" || $g2 === "") {
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

 $id = (int)$id;
 $g1 = (int)$g1;
 $g2 = (int)$g2;

 $conn->query("UPDATE partidos_tercera SET goles_local=$g1, goles_visitante=$g2, status='Finalizado' WHERE id=$id");

 $res = $conn->query("SELECT local_id, visitante_id FROM partidos_tercera WHERE id=$id");
 $m = $res->fetch_assoc();
 $l = $m['local_id'];
 $v = $m['visitante_id'];

 $conn->query("UPDATE tabla_posiciones_tercera SET pj = pj + 1 WHERE equipo_id IN ($l,$v)");
 $conn->query("UPDATE tabla_posiciones_tercera SET gf = gf + $g1, gc = gc + $g2 WHERE equipo_id = $l");
 $conn->query("UPDATE tabla_posiciones_tercera SET gf = gf + $g2, gc = gc + $g1 WHERE equipo_id = $v");

if ($g1 > $g2) {
    $conn->query("UPDATE tabla_posiciones_tercera SET pg = pg + 1, pts = pts + 3 WHERE equipo_id = $l");
    $conn->query("UPDATE tabla_posiciones_tercera SET pp = pp + 1 WHERE equipo_id = $v");
} elseif ($g1 < $g2) {
    $conn->query("UPDATE tabla_posiciones_tercera SET pg = pg + 1, pts = pts + 3 WHERE equipo_id = $v");
    $conn->query("UPDATE tabla_posiciones_tercera SET pp = pp + 1 WHERE equipo_id = $l");
} else {
    $conn->query("UPDATE tabla_posiciones_tercera SET pe = pe + 1, pts = pts + 1 WHERE equipo_id IN ($l,$v)");
}

 $conn->query("UPDATE tabla_posiciones_tercera SET dg = gf - gc WHERE equipo_id IN ($l,$v)");

echo json_encode(["success" => true]);
 $conn->close();