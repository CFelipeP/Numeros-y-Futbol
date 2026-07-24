<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if (!$id) { echo json_enc(["error" => "ID requerido"]); exit; }

$eq = $conn->query("SELECT * FROM equipos_reservas WHERE id = $id")->fetch(PDO::FETCH_ASSOC);
if (!$eq) { echo json_enc(["error" => "Equipo no encontrado"]); exit; }

$stats = $conn->query("SELECT * FROM tabla_posiciones_reservas WHERE equipo_id = $id")->fetch(PDO::FETCH_ASSOC);

$temporada = date('Y') . '-' . (date('Y') + 1);

echo json_enc([
    "equipo" => $eq,
    "stats_tabla" => $stats ?: null,
    "jugadores" => [],
    "temporada" => $temporada,
]);
