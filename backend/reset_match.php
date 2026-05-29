<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;

$id = $_POST['id'] ?? null;
if (!$id) {
    echo json_encode(['error' => 'ID requerido']);
    exit;
}

$stmt = $conn->prepare("
    UPDATE matches 
    SET goles_local = NULL, goles_visitante = NULL, status = 'Pendiente' 
    WHERE id = ?
");
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Error al resetear']);
}

$stmt->close();
$conn->close();
