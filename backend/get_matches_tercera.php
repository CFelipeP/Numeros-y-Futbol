<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $result = $conn->query("
    SELECT p.*,
           t1.nombre as local_nombre, t1.logo as local_logo,
           t2.nombre as visitante_nombre, t2.logo as visitante_logo
    FROM partidos_tercera p
    LEFT JOIN equipos_tercera t1 ON p.local_id = t1.id
    LEFT JOIN equipos_tercera t2 ON p.visitante_id = t2.id
    ORDER BY p.fecha DESC, p.id DESC
");

 $datos = [];
while ($row = $result->fetch_assoc()) {
    $datos[] = $row;
}

echo json_encode($datos);
 $conn->close();