<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
$currentUser = requireAuth();

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

if ($token) {
    try {
        $stmt = $pdo->prepare("DELETE FROM auth_tokens WHERE token = ?");
        $stmt->execute([$token]);
    } catch (Exception $e) {}
}

echo json_enc(["success" => true]);
