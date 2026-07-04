<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$id      = (int)($_POST['id'] ?? 0);
$nombre  = $_POST['nombre'] ?? '';
$ciudad  = $_POST['ciudad'] ?? '';
$estadio = $_POST['estadio'] ?? '';

if (!$id || empty($nombre)) {
    echo json_enc(["success" => false, "error" => "ID y nombre son obligatorios"]);
    exit;
}

if (!empty($_FILES['logo']['name'])) {
    $archivo = $_FILES['logo'];
    $nombreArchivo = time() . "_" . basename($archivo['name']);
    $ruta = "uploads/" . $nombreArchivo;
    move_uploaded_file($archivo['tmp_name'], $ruta);

    $stmt = $conn->prepare("SELECT logo FROM equipos_tercera WHERE id = ?");
    $stmt->execute([$id]);
    $old = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($old && $old['logo'] && file_exists($old['logo'])) {
        unlink($old['logo']);
    }

    $stmt2 = $conn->prepare("UPDATE equipos_tercera SET nombre=?, ciudad=?, estadio=?, logo=? WHERE id=?");
    $stmt2->execute([$nombre, $ciudad, $estadio, $ruta, $id]);
} else {
    $stmt2 = $conn->prepare("UPDATE equipos_tercera SET nombre=?, ciudad=?, estadio=? WHERE id=?");
    $stmt2->execute([$nombre, $ciudad, $estadio, $id]);
}

echo json_enc(["success" => true]);
