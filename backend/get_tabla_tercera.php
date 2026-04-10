<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $result = $conn->query("
    SELECT tp.*, e.nombre, e.logo, e.ciudad, e.estadio
    FROM tabla_posiciones_tercera tp
    LEFT JOIN equipos_tercera e ON tp.equipo_id = e.id
    ORDER BY tp.pts DESC, (tp.gf - tp.gc) DESC
");

 $datos = [];
while ($row = $result->fetch_assoc()) {
    $datos[] = $row;
}

echo json_encode($datos);
 $conn->close();