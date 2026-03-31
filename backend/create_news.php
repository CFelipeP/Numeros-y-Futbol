<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

require "db.php";

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