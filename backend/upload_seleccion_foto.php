<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

header("Content-Type: application/json; charset=UTF-8");

$targetDir = __DIR__ . '/uploads/';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "error" => "No se subió ninguna imagen"]);
    exit;
}

$file = $_FILES['foto'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowed = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($ext, $allowed)) {
    echo json_encode(["success" => false, "error" => "Formato no permitido. Usa JPG, PNG o WEBP"]);
    exit;
}

$filename = 'seleccion_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$destPath = $targetDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    echo json_encode(["success" => false, "error" => "Error al guardar la imagen"]);
    exit;
}

echo json_encode([
    "success" => true,
    "url" => '/backend/uploads/' . $filename
]);
