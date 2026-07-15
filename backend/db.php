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
    UNIQUE KEY `uniq_jugador_temp` (`jugador_id`, `temporada`),
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

$mysqli->query("CREATE TABLE IF NOT EXISTS `equipos_ascenso` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `nombre`     VARCHAR(100) NOT NULL,
    `ciudad`     VARCHAR(100) DEFAULT NULL,
    `estadio`    VARCHAR(150) DEFAULT NULL,
    `logo`       VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `formacion`  VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `tabla_posiciones_ascenso` (
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

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_ascenso` (
    `id`              INT NOT NULL AUTO_INCREMENT,
    `local_id`        INT DEFAULT NULL,
    `visitante_id`    INT DEFAULT NULL,
    `goles_local`     INT DEFAULT 0,
    `goles_visitante` INT DEFAULT 0,
    `fecha`           DATE DEFAULT NULL,
    `hora`            TIME DEFAULT NULL,
    `status`          VARCHAR(20) DEFAULT 'Pendiente',
    `featured`        TINYINT(1) NOT NULL DEFAULT 0,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores_ascenso` (
    `id`              INT NOT NULL AUTO_INCREMENT,
    `equipo_id`       INT NOT NULL,
    `nombre`          VARCHAR(150) NOT NULL,
    `posicion`        VARCHAR(30) NOT NULL DEFAULT 'centrodelantero',
    `numero_camiseta` INT DEFAULT NULL,
    `foto`            VARCHAR(255) DEFAULT NULL,
    `edad`            INT DEFAULT NULL,
    `nacionalidad`    VARCHAR(100) DEFAULT NULL,
    `posicion_x`      DECIMAL(5,2) DEFAULT NULL,
    `posicion_y`      DECIMAL(5,2) DEFAULT NULL,
    `pos_x`           FLOAT DEFAULT NULL,
    `pos_y`           FLOAT DEFAULT NULL,
    `es_titular`      TINYINT(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `estadisticas_jugadores_ascenso` (
    `id`                 INT NOT NULL AUTO_INCREMENT,
    `jugador_id`         INT NOT NULL,
    `temporada`          VARCHAR(20) DEFAULT '2025-2026',
    `partidos_jugados`   INT DEFAULT 0,
    `goles`              INT DEFAULT 0,
    `asistencias`        INT DEFAULT 0,
    `goles_cabeza`       INT DEFAULT 0,
    `goles_tiro_libre`   INT DEFAULT 0,
    `goles_penal`        INT DEFAULT 0,
    `tarjetas_amarillas` INT DEFAULT 0,
    `tarjetas_rojas`     INT DEFAULT 0,
    `minutos_jugados`    INT DEFAULT 0,
    `goles_recibidos`    INT DEFAULT 0,
    `vaya_invicta`       INT DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `jugador_id` (`jugador_id`),
    UNIQUE KEY `uniq_jugador_temp` (`jugador_id`, `temporada`),
    KEY `goles` (`goles`),
    KEY `tarjetas_amarillas` (`tarjetas_amarillas`),
    KEY `tarjetas_rojas` (`tarjetas_rojas`),
    KEY `goles_recibidos` (`goles_recibidos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `equipos_segunda` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `nombre`     VARCHAR(100) NOT NULL,
    `ciudad`     VARCHAR(100) DEFAULT NULL,
    `estadio`    VARCHAR(150) DEFAULT NULL,
    `logo`       VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `formacion`  VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `tabla_posiciones_segunda` (
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

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_segunda` (
    `id`              INT NOT NULL AUTO_INCREMENT,
    `local_id`        INT DEFAULT NULL,
    `visitante_id`    INT DEFAULT NULL,
    `goles_local`     INT DEFAULT 0,
    `goles_visitante` INT DEFAULT 0,
    `fecha`           DATE DEFAULT NULL,
    `hora`            TIME DEFAULT NULL,
    `status`          VARCHAR(20) DEFAULT 'Pendiente',
    `featured`        TINYINT(1) NOT NULL DEFAULT 0,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores_segunda` (
    `id`              INT NOT NULL AUTO_INCREMENT,
    `equipo_id`       INT NOT NULL,
    `nombre`          VARCHAR(150) NOT NULL,
    `posicion`        VARCHAR(30) NOT NULL DEFAULT 'centrodelantero',
    `numero_camiseta` INT DEFAULT NULL,
    `foto`            VARCHAR(255) DEFAULT NULL,
    `edad`            INT DEFAULT NULL,
    `nacionalidad`    VARCHAR(100) DEFAULT NULL,
    `posicion_x`      DECIMAL(5,2) DEFAULT NULL,
    `posicion_y`      DECIMAL(5,2) DEFAULT NULL,
    `es_titular`      TINYINT(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `estadisticas_jugadores_segunda` (
    `id`                 INT NOT NULL AUTO_INCREMENT,
    `jugador_id`         INT NOT NULL,
    `temporada`          VARCHAR(20) DEFAULT '2025-2026',
    `partidos_jugados`   INT DEFAULT 0,
    `goles`              INT DEFAULT 0,
    `asistencias`        INT DEFAULT 0,
    `goles_cabeza`       INT DEFAULT 0,
    `goles_tiro_libre`   INT DEFAULT 0,
    `goles_penal`        INT DEFAULT 0,
    `tarjetas_amarillas` INT DEFAULT 0,
    `tarjetas_rojas`     INT DEFAULT 0,
    `minutos_jugados`    INT DEFAULT 0,
    `goles_recibidos`    INT DEFAULT 0,
    `vaya_invicta`       INT DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `jugador_id` (`jugador_id`),
    UNIQUE KEY `uniq_jugador_temp` (`jugador_id`, `temporada`),
    KEY `goles` (`goles`),
    KEY `tarjetas_amarillas` (`tarjetas_amarillas`),
    KEY `tarjetas_rojas` (`tarjetas_rojas`),
    KEY `goles_recibidos` (`goles_recibidos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `visitas` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `ip_hash`     CHAR(64) NOT NULL,
    `pagina`      VARCHAR(255) DEFAULT NULL,
    `user_agent`  TEXT DEFAULT NULL,
    `referer`     VARCHAR(500) DEFAULT NULL,
    `es_bot`      TINYINT(1) DEFAULT 0,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_ip_hash` (`ip_hash`),
    KEY `idx_created` (`created_at`),
    KEY `idx_pagina` (`pagina`),
    KEY `idx_dedup` (`ip_hash`, `pagina`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `ips_bloqueadas` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `ip`         VARCHAR(45) NOT NULL,
    `motivo`     VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `ip` (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// --- Migrar visitas viejas: renombrar columna ip -> ip_hash si existe ---
try {
    $mysqli->query("ALTER TABLE `visitas` CHANGE COLUMN `ip` `ip_hash` CHAR(64) NOT NULL");
} catch (Exception $e) {}
try {
    $mysqli->query("ALTER TABLE `visitas` DROP COLUMN `bloqueado`");
} catch (Exception $e) {}
try {
    $mysqli->query("DROP TABLE IF EXISTS `ips_bloqueadas`");
} catch (Exception $e) {}

// --- Tablas Primera División ---
$mysqli->query("CREATE TABLE IF NOT EXISTS `equipos` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `nombre`     VARCHAR(100) NOT NULL,
    `ciudad`     VARCHAR(100) DEFAULT NULL,
    `estadio`    VARCHAR(150) DEFAULT NULL,
    `logo`       VARCHAR(255) DEFAULT NULL,
    `formacion`  VARCHAR(10) DEFAULT '4-4-2',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos` (
    `id`              INT NOT NULL AUTO_INCREMENT,
    `equipo_local`    INT DEFAULT NULL,
    `equipo_visitante` INT DEFAULT NULL,
    `goles_local`     INT DEFAULT 0,
    `goles_visitante` INT DEFAULT 0,
    `fecha`           DATE DEFAULT NULL,
    `hora`            TIME DEFAULT NULL,
    `estado`          VARCHAR(20) DEFAULT 'Pendiente',
    `featured`        TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `tabla_posiciones` (
    `id`                INT NOT NULL AUTO_INCREMENT,
    `equipo_id`         INT NOT NULL,
    `partidos_jugados`  INT NOT NULL DEFAULT 0,
    `ganados`           INT NOT NULL DEFAULT 0,
    `empatados`         INT NOT NULL DEFAULT 0,
    `perdidos`          INT NOT NULL DEFAULT 0,
    `goles_favor`       INT NOT NULL DEFAULT 0,
    `goles_contra`      INT NOT NULL DEFAULT 0,
    `puntos`            INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `jugadores` (
    `id`              INT NOT NULL AUTO_INCREMENT,
    `equipo_id`       INT NOT NULL,
    `nombre`          VARCHAR(150) NOT NULL,
    `posicion`        VARCHAR(30) NOT NULL DEFAULT 'centrodelantero',
    `numero_camiseta` INT DEFAULT NULL,
    `foto`            VARCHAR(255) DEFAULT NULL,
    `edad`            INT DEFAULT NULL,
    `nacionalidad`    VARCHAR(100) DEFAULT NULL,
    `posicion_x`      DECIMAL(5,2) DEFAULT NULL,
    `posicion_y`      DECIMAL(5,2) DEFAULT NULL,
    `pos_x`           FLOAT DEFAULT NULL,
    `pos_y`           FLOAT DEFAULT NULL,
    `es_titular`      TINYINT(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `estadisticas_jugadores` (
    `id`                 INT NOT NULL AUTO_INCREMENT,
    `jugador_id`         INT NOT NULL,
    `temporada`          VARCHAR(20) DEFAULT '2025-2026',
    `partidos_jugados`   INT DEFAULT 0,
    `goles`              INT DEFAULT 0,
    `asistencias`        INT DEFAULT 0,
    `goles_cabeza`       INT DEFAULT 0,
    `goles_tiro_libre`   INT DEFAULT 0,
    `goles_penal`        INT DEFAULT 0,
    `tarjetas_amarillas` INT DEFAULT 0,
    `tarjetas_rojas`     INT DEFAULT 0,
    `minutos_jugados`    INT DEFAULT 0,
    `goles_recibidos`    INT DEFAULT 0,
    `vaya_invicta`       INT DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `jugador_id` (`jugador_id`),
    UNIQUE KEY `uniq_jugador_temp` (`jugador_id`, `temporada`),
    KEY `goles` (`goles`),
    KEY `tarjetas_amarillas` (`tarjetas_amarillas`),
    KEY `tarjetas_rojas` (`tarjetas_rojas`),
    KEY `goles_recibidos` (`goles_recibidos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// --- Tablas Copa Presidente ---
$mysqli->query("CREATE TABLE IF NOT EXISTS `equipos_copa` (
    `id`        INT NOT NULL AUTO_INCREMENT,
    `equipo_id` INT NOT NULL,
    `division`  VARCHAR(20) NOT NULL,
    `nombre`    VARCHAR(100) NOT NULL,
    `logo`      VARCHAR(255) DEFAULT NULL,
    `grupo`     CHAR(1) DEFAULT NULL,
    `activo`    TINYINT(1) DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_equipo_division` (`equipo_id`, `division`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_copa` (
    `id`                 INT NOT NULL AUTO_INCREMENT,
    `equipo_local_id`    INT DEFAULT NULL,
    `equipo_visitante_id` INT DEFAULT NULL,
    `goles_local`        INT DEFAULT NULL,
    `goles_visitante`    INT DEFAULT NULL,
    `fecha`              DATE DEFAULT NULL,
    `hora`               TIME DEFAULT NULL,
    `estado`             VARCHAR(20) DEFAULT 'Pendiente',
    `fase`               VARCHAR(20) NOT NULL DEFAULT 'grupos',
    `llave`              INT DEFAULT NULL,
    `grupo_copa`         CHAR(1) DEFAULT NULL,
    `jornada`            VARCHAR(10) DEFAULT NULL,
    `penales_local`      INT DEFAULT NULL,
    `penales_visitante`  INT DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// --- Noticias y Usuarios ---
$mysqli->query("CREATE TABLE IF NOT EXISTS `noticias` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `titulo`     VARCHAR(255) NOT NULL,
    `contenido`  TEXT NOT NULL,
    `categoria`  VARCHAR(50) DEFAULT NULL,
    `autor`      VARCHAR(100) DEFAULT NULL,
    `imagen`     VARCHAR(255) DEFAULT NULL,
    `estado`     VARCHAR(20) DEFAULT 'Borrador',
    `fecha`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$mysqli->query("CREATE TABLE IF NOT EXISTS `usuarios` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `nombre`     VARCHAR(100) NOT NULL,
    `apodo`      VARCHAR(50) DEFAULT NULL,
    `email`      VARCHAR(100) NOT NULL,
    `password`   VARCHAR(255) NOT NULL,
    `rol`        VARCHAR(20) NOT NULL DEFAULT 'usuario',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `apodo` (`apodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// --- Tabla Tercera ---
$mysqli->query("CREATE TABLE IF NOT EXISTS `partidos_tercera` (
    `id`              INT NOT NULL AUTO_INCREMENT,
    `local_id`        INT DEFAULT NULL,
    `visitante_id`    INT DEFAULT NULL,
    `goles_local`     INT DEFAULT 0,
    `goles_visitante` INT DEFAULT 0,
    `fecha`           DATE DEFAULT NULL,
    `hora`            TIME DEFAULT NULL,
    `status`          VARCHAR(20) DEFAULT 'Pendiente',
    `featured`        TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// --- Tabla match_comments ---
$mysqli->query("CREATE TABLE IF NOT EXISTS `match_comments` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `partido_id`  INT NOT NULL,
    `division`    VARCHAR(20) NOT NULL DEFAULT 'primera',
    `minuto`      INT NOT NULL DEFAULT 0,
    `tipo`        ENUM('gol','gol_penal','gol_cabeza','gol_tiro_libre','asistencia','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','descanso','fin','penal') NOT NULL DEFAULT 'comentario',
    `descripcion` TEXT NOT NULL,
    `equipo`      VARCHAR(150) DEFAULT NULL,
    `jugador_id`  INT DEFAULT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_partido` (`partido_id`, `division`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// --- Migración: agregar UNIQUE KEY a tablas de stats existentes ---
try { $mysqli->query("ALTER TABLE estadisticas_jugadores_ascenso ADD UNIQUE KEY uniq_jugador_temp (jugador_id, temporada)"); } catch (Exception $e) {}
try { $mysqli->query("ALTER TABLE estadisticas_jugadores_femenina ADD UNIQUE KEY uniq_jugador_temp (jugador_id, temporada)"); } catch (Exception $e) {}

// --- Limpiar duplicados de stats (conservar la fila con menor id) ---
try { $mysqli->query("DELETE t1 FROM estadisticas_jugadores_ascenso t1 INNER JOIN estadisticas_jugadores_ascenso t2 WHERE t1.id > t2.id AND t1.jugador_id = t2.jugador_id AND t1.temporada = t2.temporada"); } catch (Exception $e) {}
try { $mysqli->query("DELETE t1 FROM estadisticas_jugadores_femenina t1 INNER JOIN estadisticas_jugadores_femenina t2 WHERE t1.id > t2.id AND t1.jugador_id = t2.jugador_id AND t1.temporada = t1.temporada"); } catch (Exception $e) {}

// --- Tabla reset_tokens (recuperación de contraseña) ---
$mysqli->query("CREATE TABLE IF NOT EXISTS `reset_tokens` (
    `id`         INT NOT NULL AUTO_INCREMENT,
    `email`      VARCHAR(255) NOT NULL,
    `token`      VARCHAR(255) NOT NULL,
    `codigo`     VARCHAR(6) NOT NULL,
    `usado`      TINYINT(1) NOT NULL DEFAULT 0,
    `expira_en`  DATETIME NOT NULL,
    `creado_en`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// --- Admin por defecto (solo si la tabla está vacía) ---
try {
    $check = $mysqli->query("SELECT COUNT(*) FROM usuarios WHERE email = 'admin@numerosyfutbol.com'");
    if ((int)$check->fetch_row()[0] === 0) {
        $mysqli->query("INSERT INTO usuarios (nombre, apodo, email, password, rol) VALUES ('Administrador', 'admin', 'admin@numerosyfutbol.com', '" . password_hash('Admin2026', PASSWORD_DEFAULT) . "', 'admin')");
    }
} catch (Exception $e) {}
