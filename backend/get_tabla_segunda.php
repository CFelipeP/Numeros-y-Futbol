<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$sql = "SELECT tp.id, tp.equipo_id, e.nombre, e.logo, e.grupo,
        tp.pj, tp.pg, tp.pe, tp.pp, tp.gf, tp.gc, tp.dg, tp.pts
        FROM tabla_posiciones_segunda tp
        JOIN equipos_segunda e ON tp.equipo_id = e.id
        ORDER BY e.grupo ASC, tp.pts DESC, tp.dg DESC, tp.gf DESC";

$result = $conn->query($sql);
if (!$result) { echo json_encode([]); exit; }
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode($data);
$conn->close();
