<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

$partido_id = intval($_GET['partido_id'] ?? 0);
$division   = $_GET['division'] ?? 'primera';

if (!$partido_id) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, partido_id, division, minuto, tipo, descripcion, equipo, created_at
        FROM match_comments
        WHERE partido_id = ? AND division = ?
        ORDER BY minuto ASC, id ASC
    ");
    $stmt->execute([$partido_id, $division]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo json_encode([]);
}