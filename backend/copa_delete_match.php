<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

try {

    $body = json_decode(file_get_contents("php://input"), true);
    $id   = (int)($body['id'] ?? 0);

    if (!$id) {
        echo json_enc(["success" => false, "message" => "ID requerido"]);
        exit;
    }

    $pdo->prepare("DELETE FROM partidos_copa WHERE id = ?")->execute([$id]);
    echo json_enc(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_enc(["success" => false, "message" => "Error interno del servidor"]);
}