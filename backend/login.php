<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "db.php";

 $data = json_decode(file_get_contents("php://input"));

 $password = $data->password;
 $email = isset($data->email) ? trim(strtolower($data->email)) : null;
 $apodo = isset($data->apodo) ? trim(strtolower($data->apodo)) : null;

// Si no llega ni email ni apodo
if (!$email && !$apodo) {
    http_response_code(400);
    echo json_encode([
        "error" => "Ingresa tu correo electrónico o apodo"
    ]);
    exit;
}

if (!$password) {
    http_response_code(400);
    echo json_encode([
        "error" => "La contraseña es obligatoria"
    ]);
    exit;
}

// Determinar si buscar por email o por apodo
if ($email) {
    $sql = $conn->prepare("SELECT * FROM usuarios WHERE email=?");
    $sql->execute([$email]);
} else {
    $sql = $conn->prepare("SELECT * FROM usuarios WHERE apodo=?");
    $sql->execute([$apodo]);
}

 $user = $sql->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {

    echo json_encode([
        "id" => $user['id'],
        "nombre" => $user['nombre'],
        "apodo" => $user['apodo'],
        "email" => $user['email'],
        "rol" => $user['rol']
    ]);

} else {

    http_response_code(401);
    echo json_encode([
        "error" => "Credenciales incorrectas"
    ]);

}