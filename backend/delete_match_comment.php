<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body = json_decode(file_get_contents("php://input"), true);
$id = intval($body['id'] ?? 0);

if (!$id) {
    echo json_encode(["success" => false, "error" => "ID inválido"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM match_comments WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Error interno del servidor"]);
}