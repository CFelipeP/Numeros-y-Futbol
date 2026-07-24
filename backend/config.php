<?php

mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
ini_set('default_charset', 'UTF-8');
date_default_timezone_set('America/El_Salvador');

$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $val = trim($parts[1]);
            $_ENV[$key] = $val;
            putenv("$key=$val");
        }
    }
}

function json_enc($data, $flags = 0) {
    return json_encode($data, $flags | JSON_UNESCAPED_UNICODE);
}

function env($key, $default = null) {
    $val = $_ENV[$key] ?? getenv($key);
    return $val !== false && $val !== null ? $val : $default;
}

function getDsn() {
    return "mysql:host=" . env('DB_HOST', '127.0.0.1') . ";port=" . env('DB_PORT', '3306') . ";dbname=" . env('DB_NAME', 'numeros-y-futbol') . ";charset=utf8mb4";
}
