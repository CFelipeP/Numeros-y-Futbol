<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

try {
    $id       = (int)($_POST['match_id'] ?? 0);
    $featured = (int)($_POST['featured'] ?? 0);

    if ($id <= 0) {
        echo json_enc(["error" => "ID inválido"]);
        exit;
    }

    if ($featured == 1) {
        $pdo->exec("UPDATE partidos_femenina SET featured = 0");
        $stmt = $pdo->prepare("UPDATE partidos_femenina SET featured = 1 WHERE id = ?");
        $stmt->execute([$id]);
    } else {
        $stmt = $pdo->prepare("UPDATE partidos_femenina SET featured = 0 WHERE id = ?");
        $stmt->execute([$id]);
    }

    echo json_enc(["success" => true]);
} catch (Throwable $e) {
    echo json_enc(["error" => "Error interno del servidor"]);
}
