<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once 'db.php';

$body = json_decode(file_get_contents("php://input"), true);

$partido_id  = intval($body['partido_id']  ?? 0);
$division    = trim($body['division']      ?? 'primera');
$minuto      = intval($body['minuto']      ?? 0);
$tipo        = trim($body['tipo']          ?? 'comentario');
$descripcion = trim($body['descripcion']  ?? '');
$equipo      = trim($body['equipo']        ?? '');

if (!$partido_id || !$descripcion) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

try {
    // Crear tabla si no existe
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `match_comments` (
            `id`          INT NOT NULL AUTO_INCREMENT,
            `partido_id`  INT NOT NULL,
            `division`    VARCHAR(20) NOT NULL DEFAULT 'primera',
            `minuto`      INT NOT NULL DEFAULT 0,
            `tipo`        ENUM('gol','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','fin','penal') NOT NULL DEFAULT 'comentario',
            `descripcion` TEXT NOT NULL,
            `equipo`      VARCHAR(150) DEFAULT NULL,
            `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_partido` (`partido_id`, `division`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $stmt = $pdo->prepare("
        INSERT INTO match_comments (partido_id, division, minuto, tipo, descripcion, equipo)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$partido_id, $division, $minuto, $tipo, $descripcion, $equipo]);

    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}