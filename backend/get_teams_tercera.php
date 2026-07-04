<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$result = $conn->query("SELECT * FROM equipos_tercera ORDER BY nombre ASC");

$datos = [];
while ($row = $result->fetch_assoc()) {
    $datos[] = $row;
}

echo json_enc($datos);
$conn->close();
