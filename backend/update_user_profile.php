<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
$currentUser = requireAuth();

$body = json_decode(file_get_contents("php://input"), true);
$id   = intval($body['id'] ?? 0);

if (!$id) { echo json_enc(["success" => false, "error" => "ID requerido"]); exit; }

if ($id !== (int)$currentUser['user_id']) {
    http_response_code(403);
    echo json_enc(["success" => false, "error" => "No puedes modificar otro usuario"]);
    exit;
}

$fields = [];
$params = [];

if (!empty($body['nombre'])) {
    $nombre = trim($body['nombre']);
    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $nombre)) {
        echo json_enc(["success" => false, "error" => "El nombre solo puede contener letras"]);
        exit;
    }
    $fields[] = "nombre = ?";
    $params[]  = $nombre;
}
if (!empty($body['apodo'])) {
    $apodo = trim($body['apodo']);
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $apodo)) {
        echo json_enc(["success" => false, "error" => "El apodo solo puede contener letras, números y guiones bajos"]);
        exit;
    }
    if (strlen($apodo) < 3 || strlen($apodo) > 20) {
        echo json_enc(["success" => false, "error" => "El apodo debe tener entre 3 y 20 caracteres"]);
        exit;
    }
    $dup = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE apodo = ? AND id != ?");
    $dup->execute([$apodo, $id]);
    if ((int)$dup->fetchColumn() > 0) {
        echo json_enc(["success" => false, "error" => "Este apodo ya está en uso"]);
        exit;
    }
    $fields[] = "apodo = ?";
    $params[]  = $apodo;
}
if (!empty($body['email'])) {
    $email = trim(strtolower($body['email']));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_enc(["success" => false, "error" => "Email inválido"]);
        exit;
    }
    $dup = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ? AND id != ?");
    $dup->execute([$email, $id]);
    if ((int)$dup->fetchColumn() > 0) {
        echo json_enc(["success" => false, "error" => "El email ya está en uso"]);
        exit;
    }
    $fields[] = "email = ?";
    $params[]  = $email;
}
if (!empty($body['new_password'])) {
    $newPassword = trim($body['new_password']);
    if (strlen($newPassword) < 6 || strlen($newPassword) > 12) {
        echo json_enc(["success" => false, "error" => "La contraseña debe tener entre 6 y 12 caracteres"]);
        exit;
    }
    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:\"\\\\|,.<>\/?])/', $newPassword)) {
        echo json_enc(["success" => false, "error" => "La contraseña debe contener al menos una mayúscula, una minúscula y un carácter especial"]);
        exit;
    }
    $action = $body['action'] ?? '';
    if ($action === 'change_password') {
        $currentPassword = $body['current_password'] ?? '';
        $chk = $pdo->prepare("SELECT password FROM usuarios WHERE id = ?");
        $chk->execute([$id]);
        $userRow = $chk->fetch(PDO::FETCH_ASSOC);
        if (!$userRow || !password_verify($currentPassword, $userRow['password'])) {
            echo json_enc(["success" => false, "error" => "La contraseña actual es incorrecta"]);
            exit;
        }
    }
    $fields[] = "password = ?";
    $params[]  = password_hash($newPassword, PASSWORD_DEFAULT);
}

if (empty($fields)) {
    echo json_enc(["success" => false, "error" => "Nada que actualizar"]);
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

    echo json_enc(["success" => true, "user" => $user]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_enc(["success" => false, "error" => "El email o apodo ya está en uso"]);
    } else {
        echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
    }
}