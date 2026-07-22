<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

 $uploadDir = __DIR__ . '/uploads/jugadores/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_enc(["success" => false, "error" => "Método no permitido"]);
    exit();
}

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    echo json_enc(["success" => false, "error" => "No se recibió archivo"]);
    exit();
}

 $archivo = $_FILES['foto'] ?? [];
 $ext = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
 $permitidas = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($ext, $permitidas)) {
    echo json_enc(["success" => false, "error" => "Formato no permitido (jpg, png, webp)"]);
    exit();
}

if ($archivo['size'] > 2 * 1024 * 1024) {
    echo json_enc(["success" => false, "error" => "Máximo 2MB"]);
    exit();
}

 $nombre = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
 $ruta = $uploadDir . $nombre;

if (move_uploaded_file($archivo['tmp_name'], $ruta)) {
    echo json_enc(["success" => true, "path" => "uploads/jugadores/" . $nombre]);
} else {
    echo json_enc(["success" => false, "error" => "Error al guardar"]);
}