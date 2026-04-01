<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

// ... resto del código ...

$conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    die("Error de conexión");
}

$sql = "
SELECT 
    tp.*,
    e.nombre,
    e.logo
FROM tabla_posiciones tp
JOIN equipos e ON tp.equipo_id = e.id
ORDER BY tp.puntos DESC, (tp.goles_favor - tp.goles_contra) DESC
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);