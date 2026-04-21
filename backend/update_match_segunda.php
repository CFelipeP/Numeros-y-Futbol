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

$id = (int)($_POST['match_id'] ?? 0);
$g1 = $_POST['goles_local'] ?? null;
$g2 = $_POST['goles_visitante'] ?? null;

if (!$id) {
    echo json_encode(["error" => "ID requerido"]);
    exit;
}

// ====================== MODO RESET ======================
if ((string)$g1 === '-1') {
    $res = $conn->query("SELECT local_id, visitante_id, goles_local, goles_visitante, status 
                         FROM partidos_segunda WHERE id = $id");
    $m = $res->fetch_assoc();

    if ($m && $m['status'] === 'Finalizado' && $m['goles_local'] !== null) {
        $l = (int)$m['local_id'];
        $v = (int)$m['visitante_id'];
        $gl = (int)$m['goles_local'];
        $gv = (int)$m['goles_visitante'];

        // Restar todo
        $conn->query("UPDATE tabla_posiciones_segunda 
                      SET pj = GREATEST(pj - 1, 0) 
                      WHERE equipo_id IN ($l, $v)");

        $conn->query("UPDATE tabla_posiciones_segunda 
                      SET gf = GREATEST(gf - $gl, 0), 
                          gc = GREATEST(gc - $gv, 0) 
                      WHERE equipo_id = $l");

        $conn->query("UPDATE tabla_posiciones_segunda 
                      SET gf = GREATEST(gf - $gv, 0), 
                          gc = GREATEST(gc - $gl, 0) 
                      WHERE equipo_id = $v");

        if ($gl > $gv) {
            $conn->query("UPDATE tabla_posiciones_segunda 
                          SET pg = GREATEST(pg - 1, 0), 
                              pts = GREATEST(pts - 3, 0) 
                          WHERE equipo_id = $l");
            $conn->query("UPDATE tabla_posiciones_segunda 
                          SET pp = GREATEST(pp - 1, 0) 
                          WHERE equipo_id = $v");
        } elseif ($gl < $gv) {
            $conn->query("UPDATE tabla_posiciones_segunda 
                          SET pg = GREATEST(pg - 1, 0), 
                              pts = GREATEST(pts - 3, 0) 
                          WHERE equipo_id = $v");
            $conn->query("UPDATE tabla_posiciones_segunda 
                          SET pp = GREATEST(pp - 1, 0) 
                          WHERE equipo_id = $l");
        } else {
            $conn->query("UPDATE tabla_posiciones_segunda 
                          SET pe = GREATEST(pe - 1, 0), 
                              pts = GREATEST(pts - 1, 0) 
                          WHERE equipo_id IN ($l, $v)");
        }

        // Recalcular DG
        $conn->query("UPDATE tabla_posiciones_segunda SET dg = gf - gc WHERE equipo_id IN ($l, $v)");
    }

    // Resetear partido
    $conn->query("UPDATE partidos_segunda 
                  SET goles_local = NULL, 
                      goles_visitante = NULL, 
                      status = 'Pendiente' 
                  WHERE id = $id");

    echo json_encode(["success" => true, "reset" => true]);
    $conn->close();
    exit;
}

// ====================== MODO NORMAL (Guardar/Editar) ======================
if ($g1 === "" || $g2 === "" || $g1 === null || $g2 === null) {
    echo json_encode(["error" => "Goles inválidos"]);
    exit;
}

$g1 = (int)$g1;
$g2 = (int)$g2;

// 1. Obtener datos anteriores del partido
$res = $conn->query("SELECT local_id, visitante_id, goles_local, goles_visitante, status 
                     FROM partidos_segunda WHERE id = $id");
$m = $res->fetch_assoc();

if (!$m) {
    echo json_encode(["error" => "Partido no encontrado"]);
    exit;
}

$l = (int)$m['local_id'];
$v = (int)$m['visitante_id'];
$old_gl = $m['goles_local'] !== null ? (int)$m['goles_local'] : null;
$old_gv = $m['goles_visitante'] !== null ? (int)$m['goles_visitante'] : null;
$wasFinal = $m['status'] === 'Finalizado';

// 2. Si ya estaba finalizado → RESTAR el resultado anterior
if ($wasFinal && $old_gl !== null) {
    $conn->query("UPDATE tabla_posiciones_segunda 
                  SET pj = GREATEST(pj - 1, 0) 
                  WHERE equipo_id IN ($l, $v)");

    $conn->query("UPDATE tabla_posiciones_segunda 
                  SET gf = GREATEST(gf - $old_gl, 0), 
                      gc = GREATEST(gc - $old_gv, 0) 
                  WHERE equipo_id = $l");

    $conn->query("UPDATE tabla_posiciones_segunda 
                  SET gf = GREATEST(gf - $old_gv, 0), 
                      gc = GREATEST(gc - $old_gl, 0) 
                  WHERE equipo_id = $v");

    if ($old_gl > $old_gv) {
        $conn->query("UPDATE tabla_posiciones_segunda 
                      SET pg = GREATEST(pg - 1, 0), 
                          pts = GREATEST(pts - 3, 0) 
                      WHERE equipo_id = $l");
        $conn->query("UPDATE tabla_posiciones_segunda 
                      SET pp = GREATEST(pp - 1, 0) 
                      WHERE equipo_id = $v");
    } elseif ($old_gl < $old_gv) {
        $conn->query("UPDATE tabla_posiciones_segunda 
                      SET pg = GREATEST(pg - 1, 0), 
                          pts = GREATEST(pts - 3, 0) 
                      WHERE equipo_id = $v");
        $conn->query("UPDATE tabla_posiciones_segunda 
                      SET pp = GREATEST(pp - 1, 0) 
                      WHERE equipo_id = $l");
    } else {
        $conn->query("UPDATE tabla_posiciones_segunda 
                      SET pe = GREATEST(pe - 1, 0), 
                          pts = GREATEST(pts - 1, 0) 
                      WHERE equipo_id IN ($l, $v)");
    }

    $conn->query("UPDATE tabla_posiciones_segunda SET dg = gf - gc WHERE equipo_id IN ($l, $v)");
}

// 3. Actualizar el partido
$conn->query("UPDATE partidos_segunda 
              SET goles_local = $g1, 
                  goles_visitante = $g2, 
                  status = 'Finalizado' 
              WHERE id = $id");

// 4. Sumar el nuevo resultado
$conn->query("UPDATE tabla_posiciones_segunda 
              SET pj = pj + 1 
              WHERE equipo_id IN ($l, $v)");

$conn->query("UPDATE tabla_posiciones_segunda 
              SET gf = gf + $g1, 
                  gc = gc + $g2 
              WHERE equipo_id = $l");

$conn->query("UPDATE tabla_posiciones_segunda 
              SET gf = gf + $g2, 
                  gc = gc + $g1 
              WHERE equipo_id = $v");

if ($g1 > $g2) {
    $conn->query("UPDATE tabla_posiciones_segunda 
                  SET pg = pg + 1, 
                      pts = pts + 3 
                  WHERE equipo_id = $l");
    $conn->query("UPDATE tabla_posiciones_segunda 
                  SET pp = pp + 1 
                  WHERE equipo_id = $v");
} elseif ($g1 < $g2) {
    $conn->query("UPDATE tabla_posiciones_segunda 
                  SET pg = pg + 1, 
                      pts = pts + 3 
                  WHERE equipo_id = $v");
    $conn->query("UPDATE tabla_posiciones_segunda 
                  SET pp = pp + 1 
                  WHERE equipo_id = $l");
} else {
    $conn->query("UPDATE tabla_posiciones_segunda 
                  SET pe = pe + 1, 
                      pts = pts + 1 
                  WHERE equipo_id IN ($l, $v)");
}

// Recalcular DG
$conn->query("UPDATE tabla_posiciones_segunda SET dg = gf - gc WHERE equipo_id IN ($l, $v)");

echo json_encode(["success" => true]);
$conn->close();