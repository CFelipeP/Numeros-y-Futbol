<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
$conn = $mysqli;
$conn->query("INSERT INTO tabla_posiciones_burgerking (equipo_id, partidos_jugados, ganados, empatados, perdidos, goles_favor, goles_contra, puntos) SELECT id, 0, 0, 0, 0, 0, 0, 0 FROM equipos_burgerking WHERE id NOT IN (SELECT equipo_id FROM tabla_posiciones_burgerking)");
$sql = "SELECT tp.id, tp.equipo_id, tp.partidos_jugados, tp.ganados, tp.empatados, tp.perdidos, tp.goles_favor, tp.goles_contra, tp.puntos, e.nombre, e.logo FROM tabla_posiciones_burgerking tp JOIN equipos_burgerking e ON tp.equipo_id = e.id ORDER BY tp.puntos DESC, (tp.goles_favor - tp.goles_contra) DESC, tp.goles_favor DESC";
$result = $conn->query($sql); $data = [];
if ($result) while ($row = $result->fetch_assoc()) $data[] = $row;
echo json_enc($data);
