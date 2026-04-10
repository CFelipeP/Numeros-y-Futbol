<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $local = intval($_POST['local']);
 $visitante = intval($_POST['visitante']);
 $fecha = $_POST['fecha'] ?? date('Y-m-d');

if (!$local || !$visitante) {
    echo json_encode(["error" => "Selecciona ambos equipos"]);
    exit;
}

if ($local === $visitante) {
    echo json_encode(["error" => "No pueden ser el mismo equipo"]);
    exit;
}

 $conn->query("INSERT INTO partidos_tercera (local_id, visitante_id, fecha) VALUES ($local, $visitante, '$fecha')");

echo json_encode(["success" => true, "id" => $conn->insert_id]);
 $conn->close();