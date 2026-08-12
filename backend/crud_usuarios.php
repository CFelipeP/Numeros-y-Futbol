<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';

$user = requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $currentUserId = (int)($user['user_id'] ?? 0);
    $stmt = $conn->prepare("SELECT id, nombre, apodo, email, rol, activo, justificacion_desactivacion FROM usuarios WHERE rol != 'admin' OR id = ? ORDER BY id");
    $stmt->execute([$currentUserId]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_enc(['users' => $users]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_enc(['success' => false, 'error' => 'Metodo no permitido']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$action = $body['action'] ?? '';

if ($action === 'create') {
    $nombre   = trim($body['nombre'] ?? '');
    $apodo    = trim($body['apodo'] ?? '');
    $email    = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';
    $rol      = 'usuario';

    if (!$nombre || !$apodo || !$email || !$password) {
        echo json_enc(['success' => false, 'error' => 'Todos los campos son obligatorios']);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_enc(['success' => false, 'error' => 'La contrasena debe tener al menos 6 caracteres']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_enc(['success' => false, 'error' => 'Email invalido']);
        exit;
    }
    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $nombre)) {
        echo json_enc(['success' => false, 'error' => 'El nombre solo puede contener letras']);
        exit;
    }

    $check = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ?");
    $check->execute([$email]);
    if ((int)$check->fetchColumn() > 0) {
        echo json_enc(['success' => false, 'error' => 'El email ya esta registrado']);
        exit;
    }

    $checkApodo = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE apodo = ?");
    $checkApodo->execute([$apodo]);
    if ((int)$checkApodo->fetchColumn() > 0) {
        echo json_enc(['success' => false, 'error' => 'El nombre de usuario ya existe']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, apodo, email, password, rol) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $apodo, $email, $hash, $rol]);

    echo json_enc(['success' => true]);
    exit;
}

if ($action === 'update') {
    $id       = (int)($body['id'] ?? 0);
    $nombre   = trim($body['nombre'] ?? '');
    $apodo    = trim($body['apodo'] ?? '');
    $email    = trim($body['email'] ?? '');
    $rol      = trim($body['rol'] ?? '');

    if (!$id || !$nombre || !$apodo || !$email) {
        echo json_enc(['success' => false, 'error' => 'Nombre, apodo y email son obligatorios']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_enc(['success' => false, 'error' => 'Email invalido']);
        exit;
    }
    if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $nombre)) {
        echo json_enc(['success' => false, 'error' => 'El nombre solo puede contener letras']);
        exit;
    }

    if ($rol && !in_array($rol, ['admin', 'editor', 'usuario'])) {
        echo json_enc(['success' => false, 'error' => 'Rol inválido']);
        exit;
    }

    $target = $conn->prepare("SELECT rol FROM usuarios WHERE id = ?");
    $target->execute([$id]);
    $targetRol = $target->fetchColumn();
    if (!$targetRol) {
        echo json_enc(['success' => false, 'error' => 'Usuario no encontrado']);
        exit;
    }
    if ($targetRol === 'admin' && (int)$id !== (int)($user['user_id'] ?? 0)) {
        echo json_enc(['success' => false, 'error' => 'No puedes editar a otro administrador']);
        exit;
    }

    $check = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ? AND id != ?");
    $check->execute([$email, $id]);
    if ((int)$check->fetchColumn() > 0) {
        echo json_enc(['success' => false, 'error' => 'El email ya esta en uso por otro usuario']);
        exit;
    }

    $checkApodo = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE apodo = ? AND id != ?");
    $checkApodo->execute([$apodo, $id]);
    if ((int)$checkApodo->fetchColumn() > 0) {
        echo json_enc(['success' => false, 'error' => 'El nombre de usuario ya existe']);
        exit;
    }

    if ($rol && (int)$id !== (int)($user['user_id'] ?? 0)) {
        $stmt = $conn->prepare("UPDATE usuarios SET nombre=?, apodo=?, email=?, rol=? WHERE id=?");
        $stmt->execute([$nombre, $apodo, $email, $rol, $id]);
        if ($rol !== $targetRol) {
            $pdo->prepare("DELETE FROM auth_tokens WHERE user_id = ?")->execute([$id]);
        }
    } else {
        $stmt = $conn->prepare("UPDATE usuarios SET nombre=?, apodo=?, email=? WHERE id=?");
        $stmt->execute([$nombre, $apodo, $email, $id]);
    }

    echo json_enc(['success' => true]);
    exit;
}

if ($action === 'delete') {
    $id = (int)($body['id'] ?? 0);
    $justificacion = trim($body['justificacion'] ?? '');

    if (!$id) {
        echo json_enc(['success' => false, 'error' => 'ID requerido']);
        exit;
    }
    if ((int)$id === (int)($user['user_id'] ?? 0)) {
        echo json_enc(['success' => false, 'error' => 'No puedes desactivarte a ti mismo']);
        exit;
    }

    $target = $conn->prepare("SELECT rol FROM usuarios WHERE id = ?");
    $target->execute([$id]);
    $targetRol = $target->fetchColumn();
    if ($targetRol === 'admin') {
        echo json_enc(['success' => false, 'error' => 'No puedes desactivar a un administrador']);
        exit;
    }
    if (!$justificacion) {
        echo json_enc(['success' => false, 'error' => 'Debe proporcionar una justificacion']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE usuarios SET activo=0, justificacion_desactivacion=? WHERE id = ? AND rol != 'admin'");
    $stmt->execute([$justificacion, $id]);

    $pdo->prepare("DELETE FROM auth_tokens WHERE user_id = ?")->execute([$id]);

    echo json_enc(['success' => true, 'message' => 'Usuario desactivado']);
    exit;
}

if ($action === 'restore') {
    $id = (int)($body['id'] ?? 0);

    if (!$id) {
        echo json_enc(['success' => false, 'error' => 'ID requerido']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE usuarios SET activo=1, justificacion_desactivacion=NULL WHERE id = ?");
    $stmt->execute([$id]);

    echo json_enc(['success' => true, 'message' => 'Usuario restaurado']);
    exit;
}

http_response_code(400);
echo json_enc(['success' => false, 'error' => 'Accion invalida']);
