<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

// 🔥 leer JSON
$data = json_decode(file_get_contents("php://input"), true);

$titulo = $data["title"] ?? "";
$categoria = $data["category"] ?? "";
$autor = $data["author"] ?? "";
$contenido = $data["content"] ?? "";
$imagen = $data["image"] ?? "";
$estado = "Publicado";

if (!$titulo || !$autor) {
    echo json_encode(["success" => false, "error" => "Campos vacíos"]);
    exit;
}

// 🔥 PDO CORRECTO (SIN bind_param)
$sql = $conn->prepare("
    INSERT INTO noticias (titulo, contenido, categoria, autor, imagen, estado)
    VALUES (?, ?, ?, ?, ?, ?)
");

$result = $sql->execute([
    $titulo,
    $contenido,
    $categoria,
    $autor,
    $imagen,
    $estado
]);

if ($result) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}