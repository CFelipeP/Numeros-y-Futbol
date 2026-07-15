<?php
require_once __DIR__ . '/db.php';

function getAuthToken() {
    $header = $_SERVER['HTTP_AUTHORIZATION']
           ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
           ?? $_ENV['HTTP_AUTHORIZATION']
           ?? $_SERVER['HTTP_AUTHORIZATION']
           ?? '';
    if (!$header && function_exists('getallheaders')) {
        $headers = getallheaders();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (!$header && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        return $m[1];
    }
    return null;
}

function getCurrentUser() {
    $token = getAuthToken();
    if (!$token) return null;

    $stmt = $GLOBALS['mysqli']->prepare(
        "SELECT user_id, user_role FROM auth_tokens
         WHERE token = ? AND (expires_at IS NULL OR expires_at > NOW())"
    );
    if (!$stmt) return null;
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    return $row;
}

function requireAdmin() {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_enc(["success" => false, "error" => "No autorizado"]);
        exit;
    }
    if ($user['user_role'] !== 'admin') {
        http_response_code(403);
        echo json_enc(["success" => false, "error" => "Acceso denegado. Se requiere rol de administrador"]);
        exit;
    }
    return $user;
}

function requireAuth() {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_enc(["success" => false, "error" => "No autorizado"]);
        exit;
    }
    return $user;
}
