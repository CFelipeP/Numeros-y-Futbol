<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once 'auth_check.php';
requirePost();
requireAdmin();

$body = json_decode(file_get_contents("php://input"), true);
$settings = $body['settings'] ?? [];

if (empty($settings)) {
    echo json_enc(["success" => false, "error" => "No settings received"]);
    exit;
}

$allowed = ['site_name','site_description','hero_title','hero_description','hero_banner_url',
            'hero_btn1_label','hero_btn1_link','hero_btn2_label','hero_btn2_link',
            'maintenance_mode','maintenance_msg','site_logo_url','contact_email',
            'facebook_url','twitter_url','instagram_url'];

$stripHtmlKeys = ['hero_title', 'site_name', 'hero_btn1_label', 'hero_btn2_label', 'maintenance_msg'];
$urlKeys = ['facebook_url', 'twitter_url', 'instagram_url'];

$maxLengths = [
    'maintenance_msg' => 100,
];

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `site_settings` (
        `key` varchar(100) NOT NULL, `value` TEXT DEFAULT NULL, PRIMARY KEY (`key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $stmt = $pdo->prepare("INSERT INTO site_settings (`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)");
    foreach ($settings as $k => $v) {
        if (in_array($k, $allowed)) {
            $val = trim($v);
            if (isset($maxLengths[$k]) && mb_strlen($val) > $maxLengths[$k]) {
                echo json_enc(["success" => false, "error" => "$k excede el límite de {$maxLengths[$k]} caracteres"]);
                exit;
            }
            if (in_array($k, $stripHtmlKeys)) {
                $val = strip_tags($val);
            }
            if (in_array($k, $urlKeys) && $val !== '') {
                // Permitir rutas relativas (subidas internas como banners/logos)
                if (str_starts_with($val, '/')) {
                    // ruta relativa válida, continuar sin validar
                } else if (!filter_var($val, FILTER_VALIDATE_URL)) {
                    echo json_enc(["success" => false, "error" => "URL inválida en $k"]);
                    exit;
                } else {
                    $scheme = strtolower(parse_url($val, PHP_URL_SCHEME) ?: '');
                    if (!in_array($scheme, ['http', 'https'])) {
                        echo json_enc(["success" => false, "error" => "Solo se permiten URLs http/https en $k"]);
                        exit;
                    }
                }
            }
            if ($k === 'site_logo_url' && $val !== '') {
                if (!str_starts_with($val, '/backend/uploads/')) {
                    echo json_enc(["success" => false, "error" => "El logo debe ser una imagen subida desde el panel"]);
                    exit;
                }
            }
            if ($k === 'hero_banner_url' && $val !== '') {
                if (!str_starts_with($val, '/backend/uploads/')) {
                    echo json_enc(["success" => false, "error" => "El banner debe ser una imagen subida desde el panel"]);
                    exit;
                }
            }
            if ($k === 'contact_email' && $val !== '') {
                if (!filter_var($val, FILTER_VALIDATE_EMAIL)) {
                    echo json_enc(["success" => false, "error" => "El email de contacto no es válido"]);
                    exit;
                }
            }
            if (in_array($k, ['facebook_url','twitter_url','instagram_url']) && $val !== '') {
                if (!filter_var($val, FILTER_VALIDATE_URL)) {
                    echo json_enc(["success" => false, "error" => "URL inválida en $k"]);
                    exit;
                }
                $scheme = strtolower(parse_url($val, PHP_URL_SCHEME) ?: '');
                if (!in_array($scheme, ['http', 'https'])) {
                    echo json_enc(["success" => false, "error" => "Solo se permiten URLs http/https en $k"]);
                    exit;
                }
                $host = strtolower(parse_url($val, PHP_URL_HOST) ?: '');
                $platformMap = [
                    'facebook_url' => ['facebook.com', 'www.facebook.com', 'fb.com'],
                    'twitter_url' => ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
                    'instagram_url' => ['instagram.com', 'www.instagram.com'],
                ];
                if (isset($platformMap[$k]) && !in_array($host, $platformMap[$k])) {
                    echo json_enc(["success" => false, "error" => "La URL de $k debe ser de la plataforma correspondiente"]);
                    exit;
                }
            }
            $stmt->execute([$k, $val]);
        }
    }
    echo json_enc(["success" => true]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}