<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$sql = "SELECT id, nombre, email, rol FROM usuarios";
$stmt = $conn->query($sql);
if (!$stmt) { echo json_enc([]); exit; }

$users = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $users[] = [
        "id" => $row["id"],
        "name" => $row["nombre"],
        "email" => $row["email"],
        "role" => $row["rol"],
        "status" => "Activo",
        "avatar" => "https://ui-avatars.com/api/?name=" . urlencode($row["nombre"])
    ];
}

echo json_enc($users);
?>