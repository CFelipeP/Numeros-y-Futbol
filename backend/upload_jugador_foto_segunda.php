<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

 $directorio = __DIR__ . "/uploads/jugadores_segunda/";
if (!is_dir($directorio)) {
    mkdir($directorio, 0755, true);
}

if (!isset($_FILES["foto"]) || $_FILES["foto"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "error" => "No se recibió archivo válido"]);
    exit;
}

 $archivo = $_FILES["foto"];
 $extension = strtolower(pathinfo($archivo["name"], PATHINFO_EXTENSION));
 $permitidas = ["jpg", "jpeg", "png", "webp", "gif"];

if (!in_array($extension, $permitidas)) {
    echo json_encode(["success" => false, "error" => "Extensión no permitida. Use jpg, png, webp o gif"]);
    exit;
}

if ($archivo["size"] > 5 * 1024 * 1024) {
    echo json_encode(["success" => false, "error" => "El archivo supera los 5MB"]);
    exit;
}

 $nombre_unico = time() . "_" . bin2hex(random_bytes(4)) . "." . $extension;
 $ruta = $directorio . $nombre_unico;

if (move_uploaded_file($archivo["tmp_name"], $ruta)) {
    echo json_encode(["success" => true, "path" => "uploads/jugadores_segunda/" . $nombre_unico]);
} else {
    echo json_encode(["success" => false, "error" => "No se pudo guardar el archivo"]);
}