<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once 'db.php';

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
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}