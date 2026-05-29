<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$id = (int)($_POST['id'] ?? 0);
if (!$id) {
    echo json_encode(["success" => false, "error" => "ID requerido"]);
    exit;
}

$stmt = $conn->prepare("SELECT logo FROM equipos_segunda WHERE id = ?");
$stmt->execute([$id]);
$old = $stmt->fetch(PDO::FETCH_ASSOC);

if ($old && $old['logo'] && file_exists($old['logo'])) {
    unlink($old['logo']);
}

$stmt2 = $conn->prepare("DELETE FROM tabla_posiciones_segunda WHERE equipo_id = ?");
$stmt2->execute([$id]);

$stmt3 = $conn->prepare("DELETE FROM equipos_segunda WHERE id = ?");
$stmt3->execute([$id]);

echo json_encode(["success" => true]);
