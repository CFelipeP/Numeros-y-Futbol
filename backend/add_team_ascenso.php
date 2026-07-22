<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$nombre  = trim(strip_tags($_POST['nombre']  ?? ''));
$ciudad  = trim(strip_tags($_POST['ciudad']  ?? ''));
$estadio = trim(strip_tags($_POST['estadio'] ?? ''));

if (empty($nombre)) {
    echo json_enc(["success" => false, "error" => "El nombre es obligatorio"]);
    exit;
}

$ruta = '';
if (!empty($_FILES['logo']['name'])) {
    $archivo = $_FILES['logo'] ?? [];
    $nombreArchivo = time() . "_" . basename($archivo['name']);
    $ruta = "uploads/" . $nombreArchivo;
    move_uploaded_file($archivo['tmp_name'], $ruta);
}

$stmt = $conn->prepare("INSERT INTO equipos_ascenso (nombre, ciudad, estadio, logo) VALUES (?, ?, ?, ?)");
$stmt->execute([$nombre, $ciudad, $estadio, $ruta]);

$id = $conn->lastInsertId();

$stmt2 = $conn->prepare("INSERT INTO tabla_posiciones_ascenso (equipo_id) VALUES (?)");
$stmt2->execute([$id]);

// Sincronizar a Copa Presidente automáticamente
$stmt3 = $conn->prepare("INSERT IGNORE INTO equipos_copa (equipo_id, division, nombre, logo, activo) VALUES (?, 'Ascenso', ?, ?, 1)");
$stmt3->execute([$id, $nombre, $ruta]);

echo json_enc(["success" => true]);
