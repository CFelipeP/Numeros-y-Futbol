<?php
require_once __DIR__ . '/config.php';

$pdo = null;
$conn = null;
try {
    $pdo = new PDO(
        getDsn(),
        env('DB_USER', 'root'),
        env('DB_PASS', '')
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8mb4");
    $conn = $pdo;
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión PDO: " . $e->getMessage()]);
    exit;
}

$mysqli = new mysqli(
    env('DB_HOST', '127.0.0.1'),
    env('DB_USER', 'root'),
    env('DB_PASS', ''),
    env('DB_NAME', 'numeros-y-futbol'),
    (int)env('DB_PORT', '3306')
);

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión MySQLi: " . $mysqli->connect_error]);
    exit;
}

$mysqli->set_charset('utf8mb4');

$mysqli->query("CREATE TABLE IF NOT EXISTS `auth_tokens` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `token`      VARCHAR(128) NOT NULL,
    `user_id`    INT NOT NULL,
    `user_role`  VARCHAR(20) NOT NULL DEFAULT 'usuario',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `expires_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `token` (`token`),
    KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
