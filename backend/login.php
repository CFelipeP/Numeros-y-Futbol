<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$data = json_decode(file_get_contents("php://input"));

$password = $data->password;
$email = isset($data->email) ? trim(strtolower($data->email)) : null;
$apodo = isset($data->apodo) ? trim(strtolower($data->apodo)) : null;

if (!$email && !$apodo) {
    http_response_code(400);
    echo json_encode(["error" => "Ingresa tu correo electrónico o apodo"]);
    exit;
}

if (!$password) {
    http_response_code(400);
    echo json_encode(["error" => "La contraseña es obligatoria"]);
    exit;
}

if ($email) {
    $sql = $conn->prepare("SELECT * FROM usuarios WHERE email=?");
    $sql->execute([$email]);
} else {
    $sql = $conn->prepare("SELECT * FROM usuarios WHERE apodo=?");
    $sql->execute([$apodo]);
}

$user = $sql->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    $token = bin2hex(random_bytes(32));

    $stmt = $mysqli->prepare(
        "INSERT INTO auth_tokens (token, user_id, user_role, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))"
    );
    $stmt->bind_param("sis", $token, $user['id'], $user['rol']);
    $stmt->execute();
    $stmt->close();

    echo json_encode([
        "id"     => $user['id'],
        "nombre" => $user['nombre'],
        "apodo"  => $user['apodo'],
        "email"  => $user['email'],
        "rol"    => $user['rol'],
        "token"  => $token
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Credenciales incorrectas"]);
}
