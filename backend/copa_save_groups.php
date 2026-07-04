<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body = json_decode(file_get_contents('php://input'), true);
$assignments = $body['assignments'] ?? [];

// Validar: solo letras A-Z
foreach ($assignments as $grupo => $ids) {
    if (!preg_match('/^[A-Z]$/', $grupo)) {
        echo json_enc(['success' => false, 'message' => "Grupo inválido: $grupo"]);
        exit;
    }
    // Máximo 4 por grupo
    if (count($ids) > 4) {
        echo json_enc(['success' => false, 'message' => "Grupo $grupo tiene más de 4 equipos"]);
        exit;
    }
}

try {
    $pdo->beginTransaction();

    // Limpiar grupos actuales
    $pdo->exec("UPDATE equipos_copa SET grupo = NULL WHERE activo = 1");

    // Asignar nuevos grupos
    $stmt = $pdo->prepare("UPDATE equipos_copa SET grupo = ? WHERE id = ? AND activo = 1");
    foreach ($assignments as $grupo => $ids) {
        foreach ($ids as $id) {
            $stmt->execute([$grupo, $id]);
        }
    }

    $pdo->commit();
    echo json_enc(['success' => true, 'message' => 'Grupos guardados']);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_enc(['success' => false, 'message' => "Error interno del servidor"]);
}