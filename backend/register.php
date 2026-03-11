<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data["nombre"];
$email = $data["email"];
$password = password_hash($data["password"], PASSWORD_BCRYPT);

$sql = $conn->prepare("INSERT INTO usuarios (nombre,email,password,rol) VALUES (?,?,?,?)");

$sql->execute([$nombre,$email,$password,"admin"]);

echo json_encode([
    "success"=>true
]);