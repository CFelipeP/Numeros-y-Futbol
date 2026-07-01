<?php
while (ob_get_level()) { ob_end_clean(); }
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['foto'])) {
    echo json_encode(["success" => false, "error" => "No se recibió ninguna imagen"]);
    exit;
}

$archivo = $_FILES['foto'];
$nombreOriginal = $archivo['name'];
$extension = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));
$tiposPermitidos = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

if (!in_array($extension, $tiposPermitidos)) {
    echo json_encode(["success" => false, "error" => "Formato no permitido. Usa JPG, PNG, GIF o WEBP"]);
    exit;
}

$directorio = __DIR__ . '/uploads/seleccion_femenina/';
if (!is_dir($directorio)) {
    mkdir($directorio, 0755, true);
}

$nombreArchivo = 'jug_fem_' . time() . '_' . uniqid() . '.' . $extension;
$rutaCompleta = $directorio . $nombreArchivo;

if (move_uploaded_file($archivo['tmp_name'], $rutaCompleta)) {
    echo json_encode([
        "success" => true,
        "url" => 'uploads/seleccion_femenina/' . $nombreArchivo
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Error al guardar la imagen"]);
}
