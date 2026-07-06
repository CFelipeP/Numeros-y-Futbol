<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

// 🔥 leer JSON
$data = json_decode(file_get_contents("php://input"), true);

$titulo     = trim(strip_tags($data["title"]    ?? ""));
$categoria   = trim(strip_tags($data["category"]  ?? ""));
$autor       = trim(strip_tags($data["author"]    ?? ""));
$contenido   = trim(strip_tags($data["content"]   ?? "", '<b><i><u><p><br><a><strong><em><ul><ol><li><h1><h2><h3><h4><h5><h6><img><span><div>'));
$imagen      = trim($data["image"] ?? "");
$estado      = "Publicado";

if (!$titulo || !$autor) {
    echo json_enc(["success" => false, "error" => "Campos vacíos"]);
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
    echo json_enc(["success" => true]);
} else {
    echo json_enc(["success" => false]);
}