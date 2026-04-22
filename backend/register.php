<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "db.php";

try {

    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        echo json_encode([
            "success" => false,
            "error" => "No llegaron datos"
        ]);
        exit;
    }

    $nombre = trim($data->nombre);
    $apodo = trim(strtolower($data->apodo));
    $email = trim(strtolower($data->email));
    $password = $data->password;

    // Validar campos vacíos
    if (!$nombre || !$apodo || !$email || !$password) {
        echo json_encode([
            "success" => false,
            "error" => "Todos los campos son obligatorios"
        ]);
        exit;
    }

    // Validar longitud de contraseña
    if (strlen($password) < 6) {
        echo json_encode([
            "success" => false,
            "error" => "La contraseña debe tener al menos 6 caracteres"
        ]);
        exit;
    }

    // Validar apodo sin espacios y solo caracteres válidos
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $apodo)) {
        echo json_encode([
            "success" => false,
            "error" => "El apodo solo puede contener letras, números y guiones bajos (sin espacios)"
        ]);
        exit;
    }

    // Validar longitud del apodo
    if (strlen($apodo) < 3 || strlen($apodo) > 20) {
        echo json_encode([
            "success" => false,
            "error" => "El apodo debe tener entre 3 y 20 caracteres"
        ]);
        exit;
    }

    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            "success" => false,
            "error" => "El correo electrónico no es válido"
        ]);
        exit;
    }

    // Verificar si el email ya existe
    $check = $conn->prepare("SELECT id FROM usuarios WHERE email=?");
    $check->execute([$email]);

    if ($check->fetch()) {
        echo json_encode([
            "success" => false,
            "error" => "El correo ya existe"
        ]);
        exit;
    }

    // Verificar si el apodo ya existe
    $checkApodo = $conn->prepare("SELECT id FROM usuarios WHERE apodo=?");
    $checkApodo->execute([$apodo]);

    if ($checkApodo->fetch()) {
        echo json_encode([
            "success" => false,
            "error" => "Este apodo ya está en uso. Elige otro."
        ]);
        exit;
    }

    // Hashear contraseña
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insertar usuario
    $sql = $conn->prepare("INSERT INTO usuarios (nombre, apodo, email, password, rol) VALUES (?, ?, ?, ?, 'usuario')");
    $sql->execute([$nombre, $apodo, $email, $hashedPassword]);

    echo json_encode([
        "success" => true,
        "message" => "Registro exitoso"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}