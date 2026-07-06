<?php
require_once __DIR__ . '/config.php';

$pdo = null;
$conn = null;
try {
    $pdo = new PDO(
        getDsn(),
        env('DB_USER', 'root'),
        env('DB_PASS', '')
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8mb4");
    $conn = $pdo;
} catch (PDOException $e) {
    http_response_code(500);
    echo json_enc(["error" => "Error de conexión PDO: " . $e->getMessage()]);
    exit;
}

$mysqli = new mysqli(
    env('DB_HOST', '127.0.0.1'),
    env('DB_USER', 'root'),
    env('DB_PASS', ''),
    env('DB_NAME', 'numeros-y-futbol'),
    (int)env('DB_PORT', '3306')
);

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_enc(["error" => "Error de conexión MySQLi: " . $mysqli->connect_error]);
    exit;
}

$mysqli->set_charset('utf8mb4');

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_seleccion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `rival_nombre` VARCHAR(150) NOT NULL,
    `rival_logo` VARCHAR(255) DEFAULT NULL,
    `goles_favor` INT DEFAULT NULL,
    `goles_contra` INT DEFAULT NULL,
    `fecha` DATE DEFAULT NULL,
    `hora` TIME DEFAULT NULL,
    `estado` VARCHAR(50) DEFAULT 'Pendiente',
    `competicion` VARCHAR(100) DEFAULT NULL,
    `lugar` VARCHAR(50) DEFAULT 'Neutral',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores_seleccion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `posicion` VARCHAR(50) DEFAULT NULL,
    `numero_camiseta` INT DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `edad` INT DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT 'Salvadoreña',
    `club_origen` VARCHAR(150) DEFAULT NULL,
    `partidos_jugados` INT DEFAULT 0,
    `goles` INT DEFAULT 0,
    `asistencias` INT DEFAULT 0,
    `atajadas` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
$r = $mysqli->query("SHOW COLUMNS FROM `jugadores_seleccion` LIKE 'atajadas'");
if ($r && $r->num_rows === 0) {
    $mysqli->query("ALTER TABLE `jugadores_seleccion` ADD COLUMN `atajadas` INT DEFAULT 0");
}

$mysqli->query("CREATE TABLE IF NOT EXISTS `cuerpo_tecnico_seleccion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `rol` VARCHAR(100) DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_seleccion_femenina` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `rival_nombre` VARCHAR(150) NOT NULL,
    `rival_logo` VARCHAR(255) DEFAULT NULL,
    `goles_favor` INT DEFAULT NULL,
    `goles_contra` INT DEFAULT NULL,
    `fecha` DATE DEFAULT NULL,
    `hora` TIME DEFAULT NULL,
    `estado` VARCHAR(50) DEFAULT 'Pendiente',
    `competicion` VARCHAR(100) DEFAULT NULL,
    `lugar` VARCHAR(50) DEFAULT 'Neutral',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores_seleccion_femenina` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `posicion` VARCHAR(50) DEFAULT NULL,
    `numero_camiseta` INT DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `edad` INT DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT 'Salvadoreña',
    `club_origen` VARCHAR(150) DEFAULT NULL,
    `partidos_jugados` INT DEFAULT 0,
    `goles` INT DEFAULT 0,
    `asistencias` INT DEFAULT 0,
    `atajadas` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `cuerpo_tecnico_seleccion_femenina` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `rol` VARCHAR(100) DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_seleccion_sub20` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `rival_nombre` VARCHAR(150) NOT NULL,
    `rival_logo` VARCHAR(255) DEFAULT NULL,
    `goles_favor` INT DEFAULT NULL,
    `goles_contra` INT DEFAULT NULL,
    `fecha` DATE DEFAULT NULL,
    `hora` TIME DEFAULT NULL,
    `estado` VARCHAR(50) DEFAULT 'Pendiente',
    `competicion` VARCHAR(100) DEFAULT NULL,
    `lugar` VARCHAR(50) DEFAULT 'Neutral',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores_seleccion_sub20` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `posicion` VARCHAR(50) DEFAULT NULL,
    `numero_camiseta` INT DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `edad` INT DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT 'Salvadoreña',
    `club_origen` VARCHAR(150) DEFAULT NULL,
    `partidos_jugados` INT DEFAULT 0,
    `goles` INT DEFAULT 0,
    `asistencias` INT DEFAULT 0,
    `atajadas` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `cuerpo_tecnico_seleccion_sub20` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `rol` VARCHAR(100) DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_seleccion_sub17` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `rival_nombre` VARCHAR(150) NOT NULL,
    `rival_logo` VARCHAR(255) DEFAULT NULL,
    `goles_favor` INT DEFAULT NULL,
    `goles_contra` INT DEFAULT NULL,
    `fecha` DATE DEFAULT NULL,
    `hora` TIME DEFAULT NULL,
    `estado` VARCHAR(50) DEFAULT 'Pendiente',
    `competicion` VARCHAR(100) DEFAULT NULL,
    `lugar` VARCHAR(50) DEFAULT 'Neutral',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores_seleccion_sub17` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `posicion` VARCHAR(50) DEFAULT NULL,
    `numero_camiseta` INT DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `edad` INT DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT 'Salvadoreña',
    `club_origen` VARCHAR(150) DEFAULT NULL,
    `partidos_jugados` INT DEFAULT 0,
    `goles` INT DEFAULT 0,
    `asistencias` INT DEFAULT 0,
    `atajadas` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `cuerpo_tecnico_seleccion_sub17` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `rol` VARCHAR(100) DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `equipos_primera_femenina` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) DEFAULT NULL,
    `ciudad` VARCHAR(100) DEFAULT NULL,
    `estadio` VARCHAR(100) DEFAULT NULL,
    `logo` VARCHAR(255) DEFAULT NULL,
    `formacion` VARCHAR(10) DEFAULT '4-4-2',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores_femenina` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `equipo_id` INT NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `posicion` VARCHAR(30) NOT NULL DEFAULT 'centrodelantero',
    `numero_camiseta` INT DEFAULT NULL,
    `foto` VARCHAR(255) DEFAULT NULL,
    `edad` INT DEFAULT NULL,
    `nacionalidad` VARCHAR(100) DEFAULT NULL,
    `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `posicion_x` DECIMAL(5,2) DEFAULT NULL,
    `posicion_y` DECIMAL(5,2) DEFAULT NULL,
    `pos_x` FLOAT DEFAULT NULL,
    `pos_y` FLOAT DEFAULT NULL,
    `es_titular` TINYINT(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `estadisticas_jugadores_femenina` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `jugador_id` INT NOT NULL,
    `temporada` VARCHAR(20) DEFAULT '2025-2026',
    `partidos_jugados` INT DEFAULT 0,
    `goles` INT DEFAULT 0,
    `asistencias` INT DEFAULT 0,
    `goles_cabeza` INT DEFAULT 0,
    `goles_tiro_libre` INT DEFAULT 0,
    `goles_penal` INT DEFAULT 0,
    `tarjetas_amarillas` INT DEFAULT 0,
    `tarjetas_rojas` INT DEFAULT 0,
    `minutos_jugados` INT DEFAULT 0,
    `goles_recibidos` INT DEFAULT 0,
    `vaya_invicta` INT DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `jugador_id` (`jugador_id`),
    KEY `goles` (`goles`),
    KEY `tarjetas_amarillas` (`tarjetas_amarillas`),
    KEY `tarjetas_rojas` (`tarjetas_rojas`),
    KEY `goles_recibidos` (`goles_recibidos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_femenina` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `equipo_local` INT DEFAULT NULL,
    `equipo_visitante` INT DEFAULT NULL,
    `goles_local` INT DEFAULT 0,
    `goles_visitante` INT DEFAULT 0,
    `jugado` TINYINT(1) DEFAULT 0,
    `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `estado` VARCHAR(20) DEFAULT 'Pendiente',
    `featured` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `tabla_posiciones_femenina` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `equipo_id` INT NOT NULL,
    `partidos_jugados` INT NOT NULL DEFAULT 0,
    `ganados` INT NOT NULL DEFAULT 0,
    `empatados` INT NOT NULL DEFAULT 0,
    `perdidos` INT NOT NULL DEFAULT 0,
    `goles_favor` INT NOT NULL DEFAULT 0,
    `goles_contra` INT NOT NULL DEFAULT 0,
    `puntos` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `auth_tokens` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `token`      VARCHAR(128) NOT NULL,
    `user_id`    INT NOT NULL,
    `user_role`  VARCHAR(20) NOT NULL DEFAULT 'usuario',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `expires_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `token` (`token`),
    KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `login_attempts` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `ip`          VARCHAR(45) NOT NULL,
    `email_apodo` VARCHAR(150) DEFAULT NULL,
    `intento`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_ip_intento` (`ip`, `intento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `equipos_tercera` (
    `id`        INT NOT NULL AUTO_INCREMENT,
    `nombre`    VARCHAR(100) NOT NULL,
    `ciudad`    VARCHAR(100) DEFAULT NULL,
    `estadio`   VARCHAR(150) DEFAULT NULL,
    `grupo`     VARCHAR(50) DEFAULT NULL,
    `logo`      VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `formacion` VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

try { $mysqli->query("ALTER TABLE equipos_tercera ADD COLUMN `grupo` VARCHAR(50) DEFAULT NULL AFTER `estadio`"); }
catch (Exception $e) { if (!str_contains($e->getMessage(), 'Duplicate column')) { /* ignorar si ya existe */ } }

$mysqli->query("CREATE TABLE IF NOT EXISTS `tabla_posiciones_tercera` (
    `id`              INT NOT NULL AUTO_INCREMENT,
    `equipo_id`       INT NOT NULL,
    `pj`              INT NOT NULL DEFAULT 0,
    `pg`              INT NOT NULL DEFAULT 0,
    `pe`              INT NOT NULL DEFAULT 0,
    `pp`              INT NOT NULL DEFAULT 0,
    `gf`              INT NOT NULL DEFAULT 0,
    `gc`              INT NOT NULL DEFAULT 0,
    `dg`              INT NOT NULL DEFAULT 0,
    `pts`             INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
