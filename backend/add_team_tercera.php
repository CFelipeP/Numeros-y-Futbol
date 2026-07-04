<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$nombre  = $_POST['nombre'] ?? '';
$ciudad  = $_POST['ciudad'] ?? '';
$estadio = $_POST['estadio'] ?? '';

if (empty($nombre)) {
    echo json_enc(["success" => false, "error" => "El nombre es obligatorio"]);
    exit;
}

$ruta = '';
if (!empty($_FILES['logo']['name'])) {
    $archivo = $_FILES['logo'];
    $nombreArchivo = time() . "_" . basename($archivo['name']);
    $ruta = "uploads/" . $nombreArchivo;
    move_uploaded_file($archivo['tmp_name'], $ruta);
}

$stmt = $conn->prepare("INSERT INTO equipos_tercera (nombre, ciudad, estadio, logo) VALUES (?, ?, ?, ?)");
$stmt->execute([$nombre, $ciudad, $estadio, $ruta]);

$id = $conn->lastInsertId();

$stmt2 = $conn->prepare("INSERT INTO tabla_posiciones_tercera (equipo_id) VALUES (?)");
$stmt2->execute([$id]);

echo json_enc(["success" => true]);
