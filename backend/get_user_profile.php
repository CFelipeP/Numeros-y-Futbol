<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
$currentUser = requireAuth();

$id = intval($_GET['id'] ?? 0);
if (!$id) { echo json_encode(["error" => "ID requerido"]); exit; }

if ($id !== (int)$currentUser['user_id'] && $currentUser['user_role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "No autorizado"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, nombre, apodo, email, rol FROM usuarios WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) { echo json_encode(["error" => "Usuario no encontrado"]); exit; }
    echo json_encode(["success" => true, "user" => $user]);
} catch (Exception $e) {
    echo json_encode(["error" => "Error interno del servidor"]);
}