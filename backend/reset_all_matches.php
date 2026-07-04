<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;

$result = $conn->query("
    UPDATE matches 
    SET goles_local = NULL, goles_visitante = NULL, status = 'Pendiente' 
    WHERE status = 'Finalizado'
");
$afectados = $conn->affected_rows;

echo json_enc([
    'success' => true,
    'reset_count' => $afectados
]);

$conn->close();
