<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$id = (int)($_POST['id'] ?? 0);
if (!$id) {
    echo json_enc(["success" => false, "error" => "ID requerido"]);
    exit;
}

$stmt = $conn->prepare("SELECT logo FROM equipos_ascenso WHERE id = ?");
$stmt->execute([$id]);
$old = $stmt->fetch(PDO::FETCH_ASSOC);

if ($old && $old['logo'] && file_exists($old['logo'])) {
    unlink($old['logo']);
}

$stmt2 = $conn->prepare("DELETE FROM tabla_posiciones_ascenso WHERE equipo_id = ?");
$stmt2->execute([$id]);

$stmt3 = $conn->prepare("DELETE FROM equipos_ascenso WHERE id = ?");
$stmt3->execute([$id]);

// Limpiar de equipos_copa
$stmt4 = $conn->prepare("DELETE FROM equipos_copa WHERE equipo_id = ? AND division = 'Ascenso'");
$stmt4->execute([$id]);

echo json_enc(["success" => true]);
