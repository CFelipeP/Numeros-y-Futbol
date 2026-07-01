<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$id = (int)($_POST['id'] ?? 0);
if (!$id) {
    echo json_encode(["success" => false, "error" => "ID requerido"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM partidos_femenina WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(["success" => true]);
