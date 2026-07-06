<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once 'auth_check.php';
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
$urlKeys = ['facebook_url', 'twitter_url', 'instagram_url', 'hero_banner_url', 'site_logo_url'];

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `site_settings` (
        `key` varchar(100) NOT NULL, `value` TEXT DEFAULT NULL, PRIMARY KEY (`key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $stmt = $pdo->prepare("INSERT INTO site_settings (`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`)");
    foreach ($settings as $k => $v) {
        if (in_array($k, $allowed)) {
            $val = trim($v);
            if (in_array($k, $stripHtmlKeys)) {
                $val = strip_tags($val);
            }
            if (in_array($k, $urlKeys) && $val !== '' && !filter_var($val, FILTER_VALIDATE_URL)) {
                echo json_enc(["success" => false, "error" => "URL inválida en $k"]);
                exit;
            }
            $stmt->execute([$k, $val]);
        }
    }
    echo json_enc(["success" => true]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}