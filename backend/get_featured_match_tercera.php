<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
header("Cache-Control: no-store, no-cache, must-revalidate");
require_once __DIR__ . '/db.php';

try {
    $col = $pdo->query("SHOW COLUMNS FROM partidos_tercera LIKE 'featured'")->fetch(PDO::FETCH_ASSOC);
    if (!$col) {
        $pdo->exec("ALTER TABLE partidos_tercera ADD COLUMN featured TINYINT(1) DEFAULT 0");
    }

    $stmt = $pdo->query("
        SELECT p.*,
               t1.nombre AS home_name, t1.logo AS home_logo,
               t2.nombre AS away_name, t2.logo AS away_logo,
               p.fecha AS fecha
        FROM partidos_tercera p
        LEFT JOIN equipos_tercera t1 ON p.local_id = t1.id
        LEFT JOIN equipos_tercera t2 ON p.visitante_id = t2.id
        WHERE p.featured = 1
        ORDER BY p.fecha DESC, p.id DESC
        LIMIT 1
    ");

    $match = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($match ?: null);
} catch (Throwable $e) {
    echo json_encode(null);
}
