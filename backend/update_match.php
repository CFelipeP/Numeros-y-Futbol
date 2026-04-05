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

// ============================================
// MODO RESET: goles_local = "-1"
// Restar todo de la tabla de posiciones
// ============================================
if ((string)$g1 === '-1') {
    $id = (int)$id;

    // Leer valores actuales del partido
    $res = $conn->query("SELECT equipo_local, equipo_visitante, goles_local, goles_visitante, estado FROM partidos WHERE id=$id");
    $m = $res->fetch_assoc();

    if (!$m) {
        echo json_encode(["error" => "Partido no encontrado"]);
        exit;
    }

    // Solo restar si estaba finalizado y tenía goles
    if ($m['estado'] === 'Finalizado' && $m['goles_local'] !== null) {
        $l = (int)$m['equipo_local'];
        $v = (int)$m['equipo_visitante'];
        $gl = (int)$m['goles_local'];
        $gv = (int)$m['goles_visitante'];

        // Restar partidos jugados
        $conn->query("UPDATE tabla_posiciones SET partidos_jugados = GREATEST(partidos_jugados - 1, 0) WHERE equipo_id IN ($l,$v)");

        // Restar goles
        $conn->query("UPDATE tabla_posiciones SET goles_favor = GREATEST(goles_favor - $gl, 0), goles_contra = GREATEST(goles_contra - $gv, 0) WHERE equipo_id = $l");
        $conn->query("UPDATE tabla_posiciones SET goles_favor = GREATEST(goles_favor - $gv, 0), goles_contra = GREATEST(goles_contra - $gl, 0) WHERE equipo_id = $v");

        // Restar resultado
        if ($gl > $gv) {
            $conn->query("UPDATE tabla_posiciones SET ganados = GREATEST(ganados - 1, 0), puntos = GREATEST(puntos - 3, 0) WHERE equipo_id = $l");
            $conn->query("UPDATE tabla_posiciones SET perdidos = GREATEST(perdidos - 1, 0) WHERE equipo_id = $v");
        } elseif ($gl < $gv) {
            $conn->query("UPDATE tabla_posiciones SET ganados = GREATEST(ganados - 1, 0), puntos = GREATEST(puntos - 3, 0) WHERE equipo_id = $v");
            $conn->query("UPDATE tabla_posiciones SET perdidos = GREATEST(perdidos - 1, 0) WHERE equipo_id = $l");
        } else {
            $conn->query("UPDATE tabla_posiciones SET empatados = GREATEST(empatados - 1, 0), puntos = GREATEST(puntos - 1, 0) WHERE equipo_id IN ($l,$v)");
        }
    }

    // Resetear el partido
    $conn->query("UPDATE partidos SET goles_local = NULL, goles_visitante = NULL, estado = 'Pendiente' WHERE id = $id");

    echo json_encode(["success" => true, "reset" => true]);
    $conn->close();
    exit;
}

// ============================================
// MODO NORMAL: Guardar resultado
// ============================================

if ($g1 === "" || $g2 === "") {
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

 $id = (int)$id;
 $g1 = (int)$g1;
 $g2 = (int)$g2;

// Actualizar partido
 $sql = "UPDATE partidos SET goles_local=$g1, goles_visitante=$g2, estado='Finalizado' WHERE id=$id";

if (!$conn->query($sql)) {
    echo json_encode(["error" => "Error al actualizar partido", "msg" => $conn->error]);
    exit;
}

// Obtener equipos
 $res = $conn->query("SELECT equipo_local, equipo_visitante FROM partidos WHERE id=$id");
 $m = $res->fetch_assoc();

 $l = $m['equipo_local'];
 $v = $m['equipo_visitante'];

// Sumar partidos jugados
 $conn->query("UPDATE tabla_posiciones SET partidos_jugados = partidos_jugados + 1 WHERE equipo_id IN ($l,$v)");

// Sumar goles
 $conn->query("UPDATE tabla_posiciones SET goles_favor = goles_favor + $g1, goles_contra = goles_contra + $g2 WHERE equipo_id = $l");
 $conn->query("UPDATE tabla_posiciones SET goles_favor = goles_favor + $g2, goles_contra = goles_contra + $g1 WHERE equipo_id = $v");

// Resultado
if ($g1 > $g2) {
    $conn->query("UPDATE tabla_posiciones SET ganados = ganados + 1, puntos = puntos + 3 WHERE equipo_id = $l");
    $conn->query("UPDATE tabla_posiciones SET perdidos = perdidos + 1 WHERE equipo_id = $v");
} elseif ($g1 < $g2) {
    $conn->query("UPDATE tabla_posiciones SET ganados = ganados + 1, puntos = puntos + 3 WHERE equipo_id = $v");
    $conn->query("UPDATE tabla_posiciones SET perdidos = perdidos + 1 WHERE equipo_id = $l");
} else {
    $conn->query("UPDATE tabla_posiciones SET empatados = empatados + 1, puntos = puntos + 1 WHERE equipo_id IN ($l,$v)");
}

echo json_encode(["success" => true]);
 $conn->close();