<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
$currentUser = requireAuth();

$body = json_decode(file_get_contents("php://input"), true);
$id   = intval($body['id'] ?? 0);

if (!$id) { echo json_encode(["success" => false, "error" => "ID requerido"]); exit; }

if ($id !== (int)$currentUser['user_id']) {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "No puedes modificar otro usuario"]);
    exit;
}

$fields = [];
$params = [];

if (!empty($body['nombre'])) {
    $fields[] = "nombre = ?";
    $params[]  = trim($body['nombre']);
}
if (!empty($body['apodo'])) {
    $fields[] = "apodo = ?";
    $params[]  = trim($body['apodo']);
}
if (!empty($body['email'])) {
    $fields[] = "email = ?";
    $params[]  = trim(strtolower($body['email']));
}
if (!empty($body['password'])) {
    $fields[] = "password = ?";
    $params[]  = password_hash(trim($body['password']), PASSWORD_BCRYPT);
}

if (empty($fields)) {
    echo json_encode(["success" => false, "error" => "Nada que actualizar"]);
    exit;
}

try {
    $params[] = $id;
    $sql = "UPDATE usuarios SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // Return updated user
    $s = $pdo->prepare("SELECT id, nombre, apodo, email, rol FROM usuarios WHERE id = ?");
    $s->execute([$id]);
    $user = $s->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "user" => $user]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["success" => false, "error" => "El email o apodo ya está en uso"]);
    } else {
        echo json_encode(["success" => false, "error" => "Error interno del servidor"]);
    }
}