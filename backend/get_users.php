<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("db.php");

$sql = "SELECT id, nombre, email, rol FROM usuarios";
$stmt = $conn->query($sql);

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

echo json_encode($users);
?>