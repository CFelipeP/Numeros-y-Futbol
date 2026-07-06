<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$data = json_decode(file_get_contents("php://input"));

$password = $data->password;
$email = isset($data->email) ? trim(strtolower($data->email)) : null;
$apodo = isset($data->apodo) ? trim(strtolower($data->apodo)) : null;

if (!$email && !$apodo) {
    http_response_code(400);
    echo json_enc(["error" => "Ingresa tu correo electrónico o apodo"]);
    exit;
}

if (!$password) {
    http_response_code(400);
    echo json_enc(["error" => "La contraseña es obligatoria"]);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'];
$rateStmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip=? AND intento > DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
$rateStmt->execute([$ip]);
$attempts = (int)$rateStmt->fetchColumn();

if ($attempts >= 6) {
    http_response_code(429);
    echo json_enc(["error" => "Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos."]);
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

    echo json_enc([
        "id"     => $user['id'],
        "nombre" => $user['nombre'],
        "apodo"  => $user['apodo'],
        "email"  => $user['email'],
        "rol"    => $user['rol'],
        "token"  => $token
    ]);
} else {
    $logStmt = $pdo->prepare("INSERT INTO login_attempts (ip, email_apodo) VALUES (?, ?)");
    $logStmt->execute([$ip, $email ?? $apodo ?? '']);

    $attemptsAfter = $attempts + 1;
    $remaining = 6 - $attemptsAfter;

    if ($remaining <= 3 && $remaining > 0) {
        http_response_code(401);
        echo json_enc(["error" => "Credenciales incorrectas. Te " . ($remaining === 1 ? "queda" : "quedan") . " $remaining intento" . ($remaining !== 1 ? "s" : "") . "."]);
    } elseif ($remaining <= 0) {
        http_response_code(429);
        echo json_enc(["error" => "Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos."]);
    } else {
        http_response_code(401);
        echo json_enc(["error" => "Credenciales incorrectas"]);
    }
}
