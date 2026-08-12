<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
$user = requireAdmin();

$currentUserId = (int)($user['user_id'] ?? 0);
$sql = "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$currentUserId]);

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