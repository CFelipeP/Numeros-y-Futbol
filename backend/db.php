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

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_seleccion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `rival_nombre` VARCHAR(150) NOT NULL,
    `rival_logo` VARCHAR(255) DEFAULT NULL,
    `goles_favor` INT DEFAULT NULL,
    `goles_contra` INT DEFAULT NULL,
    `fecha` DATE DEFAULT NULL,
    `hora` TIME DEFAULT NULL,
    `estado` VARCHAR(50) DEFAULT 'Pendiente',
    `competicion` VARCHAR(100) DEFAULT NULL,
    `lugar` VARCHAR(50) DEFAULT 'Neutral',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores_seleccion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `posicion` VARCHAR(50) DEFAULT NULL,
    `numero_camiseta` INT DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `edad` INT DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT 'Salvadoreña',
    `club_origen` VARCHAR(150) DEFAULT NULL,
    `partidos_jugados` INT DEFAULT 0,
    `goles` INT DEFAULT 0,
    `asistencias` INT DEFAULT 0,
    `atajadas` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
$r = $mysqli->query("SHOW COLUMNS FROM `jugadores_seleccion` LIKE 'atajadas'");
if ($r && $r->num_rows === 0) {
    $mysqli->query("ALTER TABLE `jugadores_seleccion` ADD COLUMN `atajadas` INT DEFAULT 0");
}

$mysqli->query("CREATE TABLE IF NOT EXISTS `cuerpo_tecnico_seleccion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `rol` VARCHAR(100) DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

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
