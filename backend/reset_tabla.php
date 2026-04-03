<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => $conn->connect_error]);
    exit;
}

// Reiniciar a 0 manteniendo los registros (no hace TRUNCATE para no perder el UNIQUE INDEX)
 $conn->query("
    UPDATE tabla_posiciones SET 
        partidos_jugados = 0,
        ganados = 0,
        empatados = 0,
        perdidos = 0,
        goles_favor = 0,
        goles_contra = 0,
        puntos = 0
");

echo json_encode(["success" => true, "message" => "Tabla reiniciada"]);