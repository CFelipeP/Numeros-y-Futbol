<?php
$conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

$sql = "SELECT tp.*, e.nombre, e.logo
FROM tabla_posiciones tp
JOIN equipos e ON tp.equipo_id = e.id
ORDER BY tp.puntos DESC, (tp.goles_favor - tp.goles_contra) DESC";

$res = $conn->query($sql);

$data = [];

while($row = $res->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);