<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body = json_decode(file_get_contents("php://input"), true);

$partido_id  = intval($body['partido_id']  ?? 0);
$division    = trim($body['division']      ?? 'primera');
$minuto      = intval($body['minuto']      ?? 0);
$tipo        = trim($body['tipo']          ?? 'comentario');
$descripcion = trim(strip_tags($body['descripcion']  ?? ''));
$equipo      = trim($body['equipo']        ?? '');
$jugador_id  = !empty($body['jugador_id']) ? intval($body['jugador_id']) : null;

if (!$partido_id || !$descripcion) {
    echo json_enc(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

try {
    // Asegurar que la tabla y columnas existen
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `match_comments` (
            `id`          INT NOT NULL AUTO_INCREMENT,
            `partido_id`  INT NOT NULL,
            `division`    VARCHAR(20) NOT NULL DEFAULT 'primera',
            `minuto`      INT NOT NULL DEFAULT 0,
            `tipo`        ENUM(
                'gol','gol_penal','gol_cabeza','gol_tiro_libre',
                'asistencia','tarjeta_amarilla','tarjeta_roja',
                'cambio','comentario','inicio','descanso','fin','penal'
            ) NOT NULL DEFAULT 'comentario',
            `descripcion` TEXT NOT NULL,
            `equipo`      VARCHAR(150) DEFAULT NULL,
            `jugador_id`  INT DEFAULT NULL,
            `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_partido` (`partido_id`, `division`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Intentar agregar columna si no existe
    try { $pdo->exec("ALTER TABLE `match_comments` ADD COLUMN `jugador_id` INT DEFAULT NULL AFTER `equipo`"); } catch (Exception $e) { if (!str_contains($e->getMessage(), 'Duplicate column')) error_log("create_match_comment.php: " . $e->getMessage()); }

    $stmt = $pdo->prepare("
        INSERT INTO match_comments (partido_id, division, minuto, tipo, descripcion, equipo, jugador_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$partido_id, $division, $minuto, $tipo, $descripcion, $equipo, $jugador_id]);

    echo json_enc(["success" => true, "id" => $pdo->lastInsertId()]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}