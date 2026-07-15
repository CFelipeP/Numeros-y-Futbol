<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents("php://input"), true);

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, nombre, apodo, email, rol, created_at FROM usuarios ORDER BY id ASC");
    echo json_enc(["success" => true, "users" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit;
}

if ($method === 'POST') {
    $action = $body['action'] ?? '';
    $id = intval($body['id'] ?? 0);

    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt->execute([$id]);
        echo json_enc(["success" => true]);
        exit;
    }

    if ($action === 'create') {
        $nombre = trim($body['nombre'] ?? '');
        $apodo = trim($body['apodo'] ?? '');
        $email = trim(strtolower($body['email'] ?? ''));
        $password = $body['password'] ?? '';
        $rol = trim(strtolower($body['rol'] ?? 'usuario'));

        if (!$nombre || !$apodo || !$email || !$password) {
            echo json_enc(["success" => false, "error" => "Todos los campos son obligatorios"]);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_enc(["success" => false, "error" => "Email no válido"]);
            exit;
        }
        if (strlen($password) < 6) {
            echo json_enc(["success" => false, "error" => "La contraseña debe tener al menos 6 caracteres"]);
            exit;
        }

        $chk = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ? OR apodo = ?");
        $chk->execute([$email, $apodo]);
        if ($chk->fetchColumn() > 0) {
            echo json_enc(["success" => false, "error" => "El email o apodo ya están en uso"]);
            exit;
        }

        $h = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, apodo, email, password, rol) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$nombre, $apodo, $email, $h, $rol]);
        echo json_enc(["success" => true, "id" => $pdo->lastInsertId()]);
        exit;
    }

    if ($action === 'update' && $id) {
        $fields = [];
        $params = [];

        if (isset($body['nombre']) && $body['nombre'] !== '') {
            $fields[] = "nombre = ?"; $params[] = trim($body['nombre']);
        }
        if (isset($body['apodo']) && $body['apodo'] !== '') {
            $fields[] = "apodo = ?"; $params[] = trim($body['apodo']);
        }
        if (isset($body['email']) && $body['email'] !== '') {
            $fields[] = "email = ?"; $params[] = trim(strtolower($body['email']));
        }
        if (isset($body['rol']) && $body['rol'] !== '') {
            $fields[] = "rol = ?"; $params[] = trim(strtolower($body['rol']));
        }
        if (!empty($body['password'])) {
            $fields[] = "password = ?"; $params[] = password_hash(trim($body['password']), PASSWORD_BCRYPT);
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
            echo json_enc(["success" => true]);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                echo json_enc(["success" => false, "error" => "El email o apodo ya está en uso"]);
            } else {
                echo json_enc(["success" => false, "error" => "Error interno"]);
            }
        }
        exit;
    }

    echo json_enc(["success" => false, "error" => "Acción no válida"]);
    exit;
}

echo json_enc(["success" => false, "error" => "Método no permitido"]);
