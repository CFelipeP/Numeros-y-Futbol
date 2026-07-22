<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

 $directorio = __DIR__ . "/uploads/jugadores_segunda/";
if (!is_dir($directorio)) {
    mkdir($directorio, 0755, true);
}

if (!isset($_FILES["foto"]) || $_FILES["foto"]["error"] !== UPLOAD_ERR_OK) {
    echo json_enc(["success" => false, "error" => "No se recibió archivo válido"]);
    exit;
}

 $archivo = $_FILES["foto"] ?? [];
 $extension = strtolower(pathinfo($archivo["name"], PATHINFO_EXTENSION));
 $permitidas = ["jpg", "jpeg", "png", "webp", "gif"];

if (!in_array($extension, $permitidas)) {
    echo json_enc(["success" => false, "error" => "Extensión no permitida. Use jpg, png, webp o gif"]);
    exit;
}

if ($archivo["size"] > 5 * 1024 * 1024) {
    echo json_enc(["success" => false, "error" => "El archivo supera los 5MB"]);
    exit;
}

 $nombre_unico = time() . "_" . bin2hex(random_bytes(4)) . "." . $extension;
 $ruta = $directorio . $nombre_unico;

if (move_uploaded_file($archivo["tmp_name"], $ruta)) {
    echo json_enc(["success" => true, "path" => "uploads/jugadores_segunda/" . $nombre_unico]);
} else {
    echo json_enc(["success" => false, "error" => "No se pudo guardar el archivo"]);
}