<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain; charset=utf-8");

require_once __DIR__ . '/config.php';

// Solo accesible desde localhost
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if (!in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
    http_response_code(403);
    echo "Acceso denegado";
    exit;
}

echo "=== DIAGNÓSTICO ===\n\n";

echo "✓ PHP ejecutándose: " . phpversion() . "\n\n";

try {
    $pdo = new PDO(getDsn(), env('DB_USER', 'root'), env('DB_PASS', ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo "✓ Conexión EXITOSA\n\n";
} catch (PDOException $e) {
    echo "✗ ERROR DE CONEXIÓN: " . $e->getMessage() . "\n";
    exit;
}

echo "→ Tablas en la base de datos:\n";
$tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
foreach ($tables as $table) {
    echo "  - $table\n";
}
echo "\n";

echo "=== FIN DIAGNÓSTICO ===";
