<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;

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
