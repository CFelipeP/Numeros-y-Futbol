<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost',
    'http://localhost/Numeros-y-Futbol',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Solo orígenes explícitamente permitidos
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: strict-origin");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");
header("Cache-Control: no-store, must-revalidate");
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function requirePost() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_enc(["success" => false, "error" => "Método no permitido"]);
        exit;
    }
}
