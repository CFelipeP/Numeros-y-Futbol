<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $result = $conn->query("SELECT * FROM equipos_tercera ORDER BY nombre ASC");

 $datos = [];
while ($row = $result->fetch_assoc()) {
    $datos[] = $row;
}

echo json_encode($datos);
 $conn->close();