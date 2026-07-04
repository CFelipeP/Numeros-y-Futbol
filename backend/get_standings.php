<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$sql = "SELECT tp.*, e.nombre, e.logo
FROM tabla_posiciones tp
JOIN equipos e ON tp.equipo_id = e.id
ORDER BY tp.puntos DESC, (tp.goles_favor - tp.goles_contra) DESC";

$res = $conn->query($sql);

$data = [];

while($row = $res->fetch_assoc()){
    $data[] = $row;
}

echo json_enc($data);
