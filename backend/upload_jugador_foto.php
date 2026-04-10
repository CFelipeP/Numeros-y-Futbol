<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

 $uploadDir = __DIR__ . '/uploads/jugadores/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
    exit();
}

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "error" => "No se recibió archivo"]);
    exit();
}

 $archivo = $_FILES['foto'];
 $ext = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
 $permitidas = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($ext, $permitidas)) {
    echo json_encode(["success" => false, "error" => "Formato no permitido (jpg, png, webp)"]);
    exit();
}

if ($archivo['size'] > 2 * 1024 * 1024) {
    echo json_encode(["success" => false, "error" => "Máximo 2MB"]);
    exit();
}

 $nombre = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
 $ruta = $uploadDir . $nombre;

if (move_uploaded_file($archivo['tmp_name'], $ruta)) {
    echo json_encode(["success" => true, "path" => "uploads/jugadores/" . $nombre]);
} else {
    echo json_encode(["success" => false, "error" => "Error al guardar"]);
}