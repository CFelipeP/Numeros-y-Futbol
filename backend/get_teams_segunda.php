<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

try {
    $stmt = $conn->query("
        SELECT id, nombre, ciudad, estadio, logo, grupo
        FROM equipos_segunda
        ORDER BY nombre ASC
    ");
    echo json_encode($stmt->fetch_all(MYSQLI_ASSOC));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => "Error interno del servidor"]);
}
