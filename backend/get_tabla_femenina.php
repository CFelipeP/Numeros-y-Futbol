<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$insert = $conn->query("INSERT INTO tabla_posiciones_femenina (equipo_id, partidos_jugados, ganados, empatados, perdidos, goles_favor, goles_contra, puntos) SELECT id, 0, 0, 0, 0, 0, 0, 0 FROM equipos_primera_femenina WHERE id NOT IN (SELECT equipo_id FROM tabla_posiciones_femenina)");

if (!$insert) {
    echo json_encode(["error" => "Error interno del servidor"]);
    exit;
}

$sql = "SELECT tp.id, tp.equipo_id, tp.partidos_jugados, tp.ganados, tp.empatados, tp.perdidos, tp.goles_favor, tp.goles_contra, tp.puntos, e.nombre, e.logo FROM tabla_posiciones_femenina tp JOIN equipos_primera_femenina e ON tp.equipo_id = e.id ORDER BY tp.puntos DESC, (tp.goles_favor - tp.goles_contra) DESC, tp.goles_favor DESC";

$result = $conn->query($sql);
$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

if (empty($data)) {
    echo json_encode(["error" => "La consulta no devolvió datos. Revisa que la tabla tabla_posiciones_femenina tenga registros."]);
    exit;
}

echo json_encode($data);
