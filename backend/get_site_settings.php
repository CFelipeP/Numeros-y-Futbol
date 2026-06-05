<?php
header('Content-Type: application/json'); // Aseguramos que la respuesta sea JSON
error_reporting(0); ini_set('display_errors', 0); // Deshabilitamos la muestra de errores para producción
require_once __DIR__ . '/cors.php';

try {
    require_once __DIR__ . '/db.php'; // Incluimos la conexión a la base de datos

    // Usamos $conn si está definido en db.php, de lo contrario $pdo.
    // Asumo que db.php define una de estas variables globalmente.
    $db = isset($conn) ? $conn : (isset($pdo) ? $pdo : null);

    if ($db === null) {
        throw new Exception("Conexión a la base de datos no disponible.");
    }

    $db->exec("CREATE TABLE IF NOT EXISTS `site_settings` (
        `key` varchar(100) NOT NULL,
        `value` TEXT DEFAULT NULL,
        PRIMARY KEY (`key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Insertamos valores por defecto si no están presentes
    $defaults = [
        'site_name'         => 'Números y Fútbol',
        'site_description'  => 'Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño.',
        'hero_title'        => 'Noticias y numeros que <span>genera el fútbol</span>',
        'hero_description'  => 'Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño en vivo.',
        'hero_banner_url'   => 'https://z-cdn-media.chatglm.cn/files/5838caa0-1db5-471c-a0b7-615971e5c6a9.png?auth_key=1874475322-63d59502a9bd4eccb11f4451b8b598a8-0-73a0c525630ab96d6c6d289fa8ba3645',
        'hero_btn1_label'   => 'Últimas Noticias',
        'hero_btn1_link'    => '#noticias',
        'hero_btn2_label'   => 'Ver Resultados',
        'hero_btn2_link'    => '#divisiones',
        'maintenance_mode'  => '0',
        'maintenance_msg'   => 'Estamos trabajando para mejorar tu experiencia. Vuelve pronto.',
        'site_logo_url'     => '',
        'contact_email'     => '',
        'facebook_url'      => '',
        'twitter_url'       => '',
        'instagram_url'     => '',
    ];

    $ins = $db->prepare("INSERT IGNORE INTO site_settings (`key`,`value`) VALUES (?,?)");
    foreach ($defaults as $k => $v) { $ins->execute([$k, $v]); }

    $rows = $db->query("SELECT `key`,`value` FROM site_settings")->fetchAll(PDO::FETCH_KEY_PAIR);
    echo json_encode(["success" => true, "settings" => $rows]);
} catch (PDOException $e) {
    // Captura errores de la base de datos
    echo json_encode(["success" => false, "error" => "Error de base de datos: " . $e->getMessage()]);
} catch (Exception $e) {
    // Captura otros errores generales
    echo json_encode(["success" => false, "error" => "Error interno del servidor: " . $e->getMessage()]);
}
