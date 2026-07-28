<?php
error_reporting(0); ini_set('display_errors', 0);
ob_start();
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$targetDir = __DIR__ . "/uploads/";

if (!file_exists($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if (!isset($_FILES['file'])) {
    echo json_enc(["success" => false, "error" => "No file"]);
    exit;
}

$file = $_FILES['file'] ?? [];

$allowed = ["jpg", "jpeg", "png", "webp", "mp4"];
$ext = strtolower(pathinfo($file["name"] ?? '', PATHINFO_EXTENSION));

if (!in_array($ext, $allowed)) {
    echo json_enc(["success" => false, "error" => "Formato inválido"]);
    exit;
}

// MIME type validation
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name'] ?? '');
finfo_close($finfo);
$allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
if (!in_array($mime, $allowedMimes)) {
    echo json_enc(["success" => false, "error" => "Tipo de archivo no permitido"]);
    exit;
}

$maxSize = 15 * 1024 * 1024;
if (($file['size'] ?? 0) > $maxSize) {
    echo json_enc(["success" => false, "error" => "El archivo excede el limite de 15MB"]);
    exit;
}

$newName = uniqid() . "." . $ext;
$targetFile = $targetDir . $newName;

if (move_uploaded_file($file["tmp_name"], $targetFile)) {
    ob_clean();
    echo json_enc([
        "success" => true,
        "url" => "/backend/uploads/" . $newName
    ]);
} else {
    ob_clean();
    echo json_enc([
        "success" => false,
        "error" => "Error al subir"
    ]);
}