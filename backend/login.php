<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
requirePost();

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

$identifier = $email ?? $apodo ?? '';

// Obtener IP real considerando proxies
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
if ($forwarded && filter_var($forwarded, FILTER_VALIDATE_IP)) {
    $ip = $forwarded;
}
$ip = substr($ip, 0, 45);

// ─── IP-based rate limiting: 6 attempts per 15 min ───
$rateStmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip=? AND intento > DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
$rateStmt->execute([$ip]);
$ipAttempts = (int)$rateStmt->fetchColumn();

if ($ipAttempts >= 6) {
    http_response_code(429);
    echo json_enc(["error" => "Demasiados intentos. IP bloqueada temporalmente."]);
    exit;
}

// ─── Buscar usuario ───
if ($email) {
    $sql = $conn->prepare("SELECT * FROM usuarios WHERE email=?");
    $sql->execute([$email]);
} else {
    $sql = $conn->prepare("SELECT * FROM usuarios WHERE apodo=?");
    $sql->execute([$apodo]);
}

$user = $sql->fetch(PDO::FETCH_ASSOC);

// ─── Cuenta desactivada → rechazo inmediato, sin verificar contraseña ───
if ($user && (int)$user['activo'] === 0) {
    $pdo->prepare("INSERT INTO login_attempts (ip, email_apodo) VALUES (?, ?)")->execute([$ip, $identifier]);
    http_response_code(401);
    echo json_enc(["error" => "Credenciales incorrectas"]);
    exit;
}

// ─── Account-level lockout: 10+ failed attempts = bloqueo 30 min ───
$accountStmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE email_apodo=? AND intento > DATE_SUB(NOW(), INTERVAL 30 MINUTE)");
$accountStmt->execute([$identifier]);
$accountAttempts = (int)$accountStmt->fetchColumn();

if ($accountAttempts >= 10) {
    http_response_code(429);
    echo json_enc(["error" => "Demasiados intentos. Cuenta temporalmente bloqueada."]);
    exit;
}

// ─── Progressive delay ───
if ($accountAttempts > 0) {
    $delay = min($accountAttempts * 250000, 3000000);
    usleep($delay);
}

// ─── Verificar contraseña ───
if ($user && password_verify($password, $user['password'])) {
    $token = bin2hex(random_bytes(32));

    $pdo->prepare("DELETE FROM auth_tokens WHERE user_id = ?")->execute([$user['id']]);

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
        "rol"    => strtolower($user['rol']),
        "token"  => $token
    ]);
} else {
    $logStmt = $pdo->prepare("INSERT INTO login_attempts (ip, email_apodo) VALUES (?, ?)");
    $logStmt->execute([$ip, $identifier]);

    $remaining = 6 - ($ipAttempts + 1);

    if ($remaining <= 3 && $remaining > 0) {
        http_response_code(401);
        echo json_enc(["error" => "Credenciales incorrectas. Te " . ($remaining === 1 ? "queda" : "quedan") . " $remaining intento" . ($remaining !== 1 ? "s" : "") . "."]);
    } elseif ($remaining <= 0) {
        http_response_code(429);
        echo json_enc(["error" => "Demasiados intentos. IP bloqueada temporalmente."]);
    } else {
        http_response_code(401);
        echo json_enc(["error" => "Credenciales incorrectas"]);
    }
}
