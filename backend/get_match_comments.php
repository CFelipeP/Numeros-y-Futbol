<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$partido_id = intval($_GET['partido_id'] ?? 0);
$division   = trim($_GET['division']     ?? 'primera');

if (!$partido_id) { echo json_encode(["error" => "ID requerido"]); exit; }

try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `match_comments` (
            `id`          INT NOT NULL AUTO_INCREMENT,
            `partido_id`  INT NOT NULL,
            `division`    VARCHAR(20) NOT NULL DEFAULT 'primera',
            `minuto`      INT NOT NULL DEFAULT 0,
            `tipo`        ENUM('gol','gol_penal','gol_cabeza','gol_tiro_libre','asistencia','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','descanso','fin','penal') NOT NULL DEFAULT 'comentario',
            `descripcion` TEXT NOT NULL,
            `equipo`      VARCHAR(150) DEFAULT NULL,
            `jugador_id`  INT DEFAULT NULL,
            `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_partido` (`partido_id`, `division`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    try { $pdo->exec("ALTER TABLE `match_comments` ADD COLUMN `jugador_id` INT DEFAULT NULL AFTER `equipo`"); } catch (Exception $e) { if (!str_contains($e->getMessage(), 'Duplicate column')) error_log("get_match_comments.php: " . $e->getMessage()); }

    $stmt = $pdo->prepare("
        SELECT id, minuto, tipo, descripcion, equipo, jugador_id, created_at
        FROM match_comments
        WHERE partido_id = ? AND division = ?
        ORDER BY minuto ASC, id ASC
    ");
    $stmt->execute([$partido_id, $division]);
    $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "comentarios" => $comentarios]);
} catch (Exception $e) {
    echo json_encode(["error" => "Error interno del servidor"]);
}