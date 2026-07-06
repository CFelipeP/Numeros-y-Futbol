<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {

    $data = json_decode(file_get_contents("php://input"));

    if (!$data) {
        http_response_code(400);
        echo json_enc([
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
        http_response_code(400);
        echo json_enc([
            "success" => false,
            "error" => "Todos los campos son obligatorios"
        ]);
        exit;
    }

    // Validar longitud y complejidad de contraseña
    if (strlen($password) < 5 || strlen($password) > 12) {
        http_response_code(422);
        echo json_enc([
            "success" => false,
            "error" => "La contraseña debe tener entre 5 y 12 caracteres"
        ]);
        exit;
    }

    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\\\|,.<>\/?])/', $password)) {
        http_response_code(422);
        echo json_enc([
            "success" => false,
            "error" => "La contraseña debe contener al menos una mayúscula, una minúscula y un carácter especial"
        ]);
        exit;
    }

    // Validar apodo sin espacios y solo caracteres válidos
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $apodo)) {
        http_response_code(422);
        echo json_enc([
            "success" => false,
            "error" => "El apodo solo puede contener letras, números y guiones bajos (sin espacios)"
        ]);
        exit;
    }

    // Validar longitud del apodo
    if (strlen($apodo) < 3 || strlen($apodo) > 20) {
        http_response_code(422);
        echo json_enc([
            "success" => false,
            "error" => "El apodo debe tener entre 3 y 20 caracteres"
        ]);
        exit;
    }

    // Validar email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        echo json_enc([
            "success" => false,
            "error" => "El correo electrónico no es válido"
        ]);
        exit;
    }

    // Verificar si el email ya existe
    $check = $conn->prepare("SELECT id FROM usuarios WHERE email=?");
    $check->execute([$email]);

    if ($check->fetch()) {
        http_response_code(409);
        echo json_enc([
            "success" => false,
            "error" => "El correo ya existe"
        ]);
        exit;
    }

    // Verificar si el apodo ya existe
    $checkApodo = $conn->prepare("SELECT id FROM usuarios WHERE apodo=?");
    $checkApodo->execute([$apodo]);

    if ($checkApodo->fetch()) {
        http_response_code(409);
        echo json_enc([
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

    echo json_enc([
        "success" => true,
        "message" => "Registro exitoso"
    ]);

} catch (Exception $e) {

    echo json_enc([
        "success" => false,
        "error" => "Error interno del servidor"
    ]);
}