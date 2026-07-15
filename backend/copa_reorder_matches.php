<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body = json_decode(file_get_contents("php://input"), true);

if (!is_array($body) || !isset($body['fase']) || !isset($body['ordenes'])) {
    http_response_code(400);
    echo json_enc(['success' => false, 'message' => 'Se requiere fase y ordenes']);
    exit;
}

$fase = trim($body['fase']);
$ordenes = $body['ordenes'];

$validFases = ['octavos', 'cuartos', 'semis', 'final'];
if (!in_array($fase, $validFases, true)) {
    http_response_code(400);
    echo json_enc(['success' => false, 'message' => 'Fase inválida']);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("UPDATE partidos_copa SET orden = ? WHERE id = ? AND fase = ?");

    foreach ($ordenes as $item) {
        if (!isset($item['id']) || !isset($item['orden'])) continue;
        $stmt->execute([(int)$item['orden'], (int)$item['id'], $fase]);
    }

    $pdo->commit();

    echo json_enc(['success' => true, 'message' => 'Orden actualizado']);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_enc(['success' => false, 'message' => 'Error interno del servidor']);
}
