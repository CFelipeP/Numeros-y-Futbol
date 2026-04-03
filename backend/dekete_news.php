<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_encode(["error" => "ID requerido"]);
    exit;
}

$sql = "DELETE FROM news WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$data["id"]]);

echo json_encode(["success" => true]);
?>