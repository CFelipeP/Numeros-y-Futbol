<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost',
    'http://localhost/Numeros-y-Futbol',
    // Añade aquí la IP o dominio de tu Raspberry Pi:
    // 'http://192.168.x.x',
    // 'http://tu-dominio.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Permitir cualquier origen de red local (192.168.x.x, 10.x.x.x, 172.16.x.x)
$isPrivateNetwork = preg_match('/^https?:\/\/(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/', $origin);

if (in_array($origin, $allowedOrigins) || $isPrivateNetwork) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
