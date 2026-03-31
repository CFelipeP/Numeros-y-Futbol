<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_encode(["error" => "ID requerido"]);
    exit;
}

$sql = "UPDATE noticias 
        SET titulo = ?, contenido = ?, imagen = ?, categoria = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->execute([
    $data["titulo"],
    $data["contenido"],
    $data["imagen"],
    $data["categoria"],
    $data["id"]
]);

echo json_encode(["success" => true]);
?>