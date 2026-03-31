<?php
// 🔥 EVITA CUALQUIER OUTPUT EXTRA
error_reporting(0);
ini_set('display_errors', 0);
ob_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$targetDir = "uploads/";

if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if (!isset($_FILES['file'])) {
    echo json_encode(["success" => false, "error" => "No file"]);
    exit;
}

$file = $_FILES['file'];

$allowed = ["jpg", "jpeg", "png", "mp4"];
$ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed)) {
    echo json_encode(["success" => false, "error" => "Formato inválido"]);
    exit;
}

$newName = uniqid() . "." . $ext;
$targetFile = $targetDir . $newName;

if (move_uploaded_file($file["tmp_name"], $targetFile)) {
    ob_clean(); // 🔥 LIMPIA CUALQUIER BASURA
    echo json_encode([
        "success" => true,
        "url" => "http://numeros-y-futbol.test/backend/" . $targetFile
    ]);
} else {
    ob_clean();
    echo json_encode([
        "success" => false,
        "error" => "Error al subir"
    ]);
}