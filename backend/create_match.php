<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

$local = $_POST['local'] ?? null;
$visitante = $_POST['visitante'] ?? null;

if (!$local || !$visitante || $local == $visitante) {
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

$local = (int)$local;
$visitante = (int)$visitante;

$sql = "INSERT INTO partidos (equipo_local, equipo_visitante, fecha, goles_local, goles_visitante, estado)
VALUES ($local, $visitante, NOW(), 0, 0, 'Pendiente')";

if (!$conn->query($sql)) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

echo json_encode(["success" => true]);