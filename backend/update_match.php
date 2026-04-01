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

if (!$id || $g1 === "" || $g2 === "") {
    echo json_encode(["error" => "Datos inválidos", "post" => $_POST]);
    exit;
}

$id = (int)$id;
$g1 = (int)$g1;
$g2 = (int)$g2;

// actualizar partido
$sql = "UPDATE partidos 
SET goles_local=$g1, goles_visitante=$g2, estado='Finalizado'
WHERE id=$id";

if (!$conn->query($sql)) {
    echo json_encode(["error" => "partidos", "msg" => $conn->error]);
    exit;
}

// obtener equipos
$res = $conn->query("SELECT equipo_local, equipo_visitante FROM partidos WHERE id=$id");
$m = $res->fetch_assoc();

$l = $m['equipo_local'];
$v = $m['equipo_visitante'];

// sumar partidos
$conn->query("UPDATE tabla_posiciones SET partidos_jugados = partidos_jugados + 1 WHERE equipo_id IN ($l,$v)");

// goles
$conn->query("UPDATE tabla_posiciones SET goles_favor = goles_favor + $g1, goles_contra = goles_contra + $g2 WHERE equipo_id = $l");
$conn->query("UPDATE tabla_posiciones SET goles_favor = goles_favor + $g2, goles_contra = goles_contra + $g1 WHERE equipo_id = $v");

// resultado
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