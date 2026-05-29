<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

try {
    $id = intval($_POST['match_id'] ?? 0);
    $featured = intval($_POST['featured'] ?? 0);

    if ($id <= 0) {
        echo json_encode(["error" => "ID invalido"]);
        exit;
    }

    $col = $pdo->query("SHOW COLUMNS FROM partidos_tercera LIKE 'featured'")->fetch(PDO::FETCH_ASSOC);
    if (!$col) {
        $pdo->exec("ALTER TABLE partidos_tercera ADD COLUMN featured TINYINT(1) DEFAULT 0");
    }

    if ($featured === 1) {
        $pdo->exec("UPDATE partidos_tercera SET featured = 0");
        $stmt = $pdo->prepare("UPDATE partidos_tercera SET featured = 1 WHERE id = ?");
        $stmt->execute([$id]);
    } else {
        $stmt = $pdo->prepare("UPDATE partidos_tercera SET featured = 0 WHERE id = ?");
        $stmt->execute([$id]);
    }

    echo json_encode(["success" => true]);
} catch (Throwable $e) {
    echo json_encode(["error" => "Error interno del servidor"]);
}
