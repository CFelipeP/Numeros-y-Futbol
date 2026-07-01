-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para numeros-y-futbol
CREATE DATABASE IF NOT EXISTS `numeros-y-futbol` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `numeros-y-futbol`;

-- Volcando estructura para tabla numeros-y-futbol.auth_tokens
CREATE TABLE IF NOT EXISTS `auth_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(128) NOT NULL,
  `user_id` int NOT NULL,
  `user_role` varchar(20) NOT NULL DEFAULT 'usuario',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.auth_tokens: ~12 rows (aproximadamente)
INSERT INTO `auth_tokens` (`id`, `token`, `user_id`, `user_role`, `created_at`, `expires_at`) VALUES
	(1, '70e8d67ed075fb029ce5bf637fba5c7a0d77fc60b65d2516e5eda3021ccf7dfd', 9, 'admin', '2026-05-28 04:33:27', '2026-05-29 04:33:27'),
	(2, '3058831cabdecee49ae5e3f6b54ee2568e5d671913a384bd60450c21be5adfda', 9, 'admin', '2026-05-28 05:15:10', '2026-05-29 05:15:10'),
	(3, 'cfa6878039209b991039bb5909640feb89a4999915fe33da61a69675a77f8eb9', 9, 'admin', '2026-05-28 17:46:07', '2026-05-29 17:46:07'),
	(4, 'd7de29610f6d331eba9275a34e6cf9754a77acb84349de67ec9069d4f3ac760a', 9, 'admin', '2026-06-05 22:13:23', '2026-06-06 22:13:23'),
	(5, '58cfde98ef2a467304bfe6d80884d3ea01e0620a289ea82a2e8f2cb5d5924031', 9, 'admin', '2026-06-05 22:14:29', '2026-06-06 22:14:29'),
	(6, 'c189fa91585b90f46f02c4fb0bae6122e8bf800c9809b3be2935ea84951c299a', 9, 'admin', '2026-06-08 15:38:24', '2026-06-09 15:38:24'),
	(7, '1c4b0289ba0b8725711ffd76cbc99598d439789f7d222054b73dfdd7924bf149', 9, 'admin', '2026-06-08 15:39:41', '2026-06-09 15:39:41'),
	(8, '4fef4d215b80af4630a3434c536d612269720708cfbcfaa6d498a55ea99050ce', 9, 'admin', '2026-06-08 16:10:59', '2026-06-09 16:10:59'),
	(9, 'ee543bcc08be9736f726c142ec497c90333daff1d95246778ef9d4d139d0cad7', 9, 'admin', '2026-06-09 04:38:38', '2026-06-10 04:38:38'),
	(10, 'fc121784cbf712b7ed5350e7bc6db9719c61aaad40dad8a60b3b2c5307c505b9', 9, 'admin', '2026-06-09 04:38:53', '2026-06-10 04:38:53'),
	(11, '2ec0083de43327887ea0f6afff158276d296e2d56f437ed437b677e615f3a1f7', 9, 'admin', '2026-06-10 04:46:37', '2026-06-11 04:46:37'),
	(12, 'b05b7e9c2a1e90e2f2146745c4131f8625cd3de8134016a3d8cd6789cc4b049a', 9, 'admin', '2026-06-10 04:46:47', '2026-06-11 04:46:47');

-- Volcando estructura para tabla numeros-y-futbol.cuerpo_tecnico_seleccion
CREATE TABLE IF NOT EXISTS `cuerpo_tecnico_seleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.cuerpo_tecnico_seleccion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla numeros-y-futbol.equipos
CREATE TABLE IF NOT EXISTS `equipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `formacion` varchar(10) DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.equipos: ~12 rows (aproximadamente)
INSERT INTO `equipos` (`id`, `nombre`, `ciudad`, `estadio`, `logo`, `formacion`) VALUES
	(4, 'L.A. Firpo', 'Usulut?n', 'Estadio Sergio Torres Rivera', 'uploads/1775237339_LAFIRPO.png', '3-4-3'),
	(5, 'Alianza F.C.', 'San Salvador', ' Estadio Cuscatl?n', 'uploads/1775237448_alianzafc.png', '4-4-2'),
	(6, 'C.D. Águila', 'San Miguel', 'Estadio Juan Francisco Barraza', 'uploads/1775237638_Aguila.png', '4-4-2'),
	(7, 'C.D. Municipal Limeño', 'Santa Rosa de Lima', 'Estadio Dr. Ram?n Flores Berr?os', 'uploads/escudos/equipo_7_1779945347.png', '4-4-2'),
	(8, 'Inter TECLA', 'Santa Tecla', 'Estadio Nacional Las Delicias', 'uploads/escudos/equipo_8_1780697639.png', '4-4-2'),
	(9, 'A.D. Isidro Metapán', 'Metap?n', 'Estadio Jorge "Calero" Su?rez', 'uploads/1775241152_metapan.png', '4-4-2'),
	(10, 'C.D. Cacahuatique', 'Ciudad Barrios', 'Estadio Municipal de Chapeltique', 'uploads/1775242518_cacahuatique.png', '4-4-2'),
	(11, 'C.D. Platense', 'Zacatecoluca', 'Antonio Toledo Valle', 'uploads/1775242938_platense.png', '4-4-2'),
	(12, 'C.D. Fuerte', 'San Francisco Gotera', 'Estadio Correcaminos', 'uploads/1775243154_morazan.png', '4-4-2'),
	(13, 'C.D. Hércules', 'San Salvador', 'Estadio Cuscatl?n', 'uploads/1775243227_hercules.png', '4-4-2'),
	(14, 'Zacatecoluca F.C.', 'Zacatecoluca', 'Estadio Antonio Toledo Valle', 'uploads/1775243292_Zacatecoluca.jpg', '4-4-2'),
	(15, 'C.D. FAS', 'Santa Ana', 'Estadio ?scar Alberto Quite?o', 'uploads/1775580005_FAS.png', '4-4-2');

-- Volcando estructura para tabla numeros-y-futbol.equipos_copa
CREATE TABLE IF NOT EXISTS `equipos_copa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL COMMENT 'ID del equipo en su tabla original',
  `division` enum('Primera','Segunda','Tercera') NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `grupo` char(1) DEFAULT NULL COMMENT 'A-F, asignado por el admin',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_equipo_division` (`equipo_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.equipos_copa: ~34 rows (aproximadamente)
INSERT INTO `equipos_copa` (`id`, `equipo_id`, `division`, `nombre`, `logo`, `grupo`, `activo`) VALUES
	(95, 4, 'Primera', 'L.A. Firpo', 'uploads/1775237339_LAFIRPO.png', NULL, 1),
	(96, 5, 'Primera', 'Alianza F.C.', 'uploads/1775237448_alianzafc.png', NULL, 1),
	(97, 6, 'Primera', 'C.D. ?guila', 'uploads/1775237638_Aguila.png', NULL, 1),
	(98, 7, 'Primera', 'C.D. Municipal Lime?o', 'uploads/1775240889_Lime?o.png', NULL, 1),
	(99, 8, 'Primera', 'Inter FA', 'uploads/1775240989_InterFA.webp', NULL, 1),
	(100, 9, 'Primera', 'A.D. Isidro Metap?n', 'uploads/1775241152_metapan.png', NULL, 1),
	(101, 10, 'Primera', 'C.D. Cacahuatique', 'uploads/1775242518_cacahuatique.png', NULL, 1),
	(102, 11, 'Primera', 'C.D. Platense', 'uploads/1775242938_platense.png', NULL, 1),
	(103, 12, 'Primera', 'C.D. Fuerte', 'uploads/1775243154_morazan.png', NULL, 1),
	(104, 13, 'Primera', 'C.D. H?rcules', 'uploads/1775243227_hercules.png', NULL, 1),
	(105, 14, 'Primera', 'Zacatecoluca F.C.', 'uploads/1775243292_Zacatecoluca.jpg', NULL, 1),
	(106, 15, 'Primera', 'C.D. FAS', 'uploads/1775580005_FAS.png', NULL, 1),
	(107, 4, 'Segunda', 'CD Fuerte Aguilares', 'uploads/1775366328_fuerte aguilares.webp', NULL, 1),
	(108, 5, 'Segunda', 'C.D. Talleres Jr', 'uploads/1775366458_cd talleres.webp', NULL, 1),
	(109, 6, 'Segunda', 'CD ADET-Aruba', 'uploads/1775366532_Aruba.webp', NULL, 1),
	(110, 7, 'Segunda', ' AD Batanecos', 'uploads/1775366637_Batanecos.png', NULL, 1),
	(111, 8, 'Segunda', 'CD Inca', 'uploads/1775368426_C.D._Inca_S?per_Flat_logo.png', NULL, 1),
	(112, 9, 'Segunda', 'A.D. Juventud Independiente', 'uploads/1775369629_juventud.png', NULL, 1),
	(113, 10, 'Segunda', 'A.D. Espartano', 'uploads/1775369682_AD espartano.png', NULL, 1),
	(114, 11, 'Segunda', 'Sensunte FC', 'uploads/1775370748_sensunte.webp', NULL, 1),
	(115, 12, 'Segunda', 'C.D. Drag?n', 'uploads/1775371713_dragon.png', NULL, 1),
	(116, 13, 'Segunda', 'C.D. Atletico Balboa', 'uploads/1775381011_balboa.png', NULL, 1),
	(117, 14, 'Segunda', 'C.D. Cruzeiro', 'uploads/1775381059_cruzeiro.png', NULL, 1),
	(118, 15, 'Segunda', 'C.D. Olimpico Litoral', 'uploads/1775381230_litoral.png', NULL, 1),
	(119, 16, 'Segunda', 'C.D. Pipil', 'uploads/1775381319_pipil.png', NULL, 1),
	(120, 17, 'Segunda', 'C.D. Neo Pipil', 'uploads/1775381481_neopipil.jpg', NULL, 1),
	(121, 9, 'Tercera', 'C.D. Estrellas Del Sur', 'uploads/1778806361_CD ESTRELLAS DEL SUR.png', NULL, 1),
	(122, 10, 'Tercera', 'C.S.D Vendaval', 'uploads/1778807010_vendaval 2.png', NULL, 1),
	(123, 11, 'Tercera', 'C.D. Buenos Aires', 'uploads/1778807163_buenos aires 2.png', NULL, 1),
	(124, 12, 'Tercera', ' Academia BP', 'uploads/1778807456_academia bp2.png', NULL, 1),
	(125, 14, 'Tercera', 'A.D Izalco', 'uploads/1778808698_IZALCOs.png', NULL, 1),
	(126, 15, 'Tercera', 'C.D. 11 Municipal', 'uploads/1778808985_C.D. 11 Municipal.png', NULL, 1),
	(127, 16, 'Tercera', 'Brasil FC', 'uploads/1778809144_brasil fc.png', NULL, 1),
	(128, 17, 'Tercera', 'C.D. El Vencedor', 'uploads/1778810314_CD EL VENCEDOT.png', NULL, 1);

-- Volcando estructura para tabla numeros-y-futbol.equipos_segunda
CREATE TABLE IF NOT EXISTS `equipos_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `grupo` varchar(10) NOT NULL DEFAULT 'West',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `formacion` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.equipos_segunda: ~14 rows (aproximadamente)
INSERT INTO `equipos_segunda` (`id`, `nombre`, `ciudad`, `estadio`, `logo`, `grupo`, `created_at`, `formacion`) VALUES
	(4, 'CD Fuerte Aguilares', 'San Salvador', 'Cancha Te?filo Siman', 'uploads/1775366328_fuerte aguilares.webp', 'East', '2026-04-05 05:18:48', '4-4-2'),
	(5, 'C.D. Talleres Jr', 'Chalatenango', 'Estadio Jos? Gregorio Mart?nez', 'uploads/1775366458_cd talleres.webp', 'East', '2026-04-05 05:20:58', NULL),
	(6, 'CD ADET-Aruba', ' La Libertad', ' Estadio Chilama', 'uploads/1775366532_Aruba.webp', 'East', '2026-04-05 05:22:12', NULL),
	(7, ' AD Batanecos', 'San Vicente', 'Cancha Juan Francisco Molina', 'uploads/1775366637_Batanecos.png', 'East', '2026-04-05 05:23:57', NULL),
	(8, 'CD Inca', 'Cant?n Entre R?os', 'Cancha San Isidro', 'uploads/1775368426_C.D._Inca_S?per_Flat_logo.png', 'East', '2026-04-05 05:53:46', NULL),
	(9, 'A.D. Juventud Independiente', 'San Juan Opico', 'Complejo Deportivo San Juan Opico', 'uploads/1775369629_juventud.png', 'East', '2026-04-05 06:13:49', NULL),
	(10, 'A.D. Espartano', 'San Juli?n', 'Polideportivo Helen Arias', 'uploads/1775369682_AD espartano.png', 'East', '2026-04-05 06:14:42', NULL),
	(11, 'Sensunte FC', 'Caba?as', 'Polideportivo Sensuntepeque', 'uploads/1775370748_sensunte.webp', 'West', '2026-04-05 06:32:28', NULL),
	(12, 'C.D. Dragón', 'San Miguel', 'Estadio Municipal de Quelepa', 'uploads/1775371713_dragon.png', 'West', '2026-04-05 06:48:33', NULL),
	(13, 'C.D. Atletico Balboa', 'La Uni?n', 'Estadio Marcelino Imbers', 'uploads/1775381011_balboa.png', 'West', '2026-04-05 09:23:31', NULL),
	(14, 'C.D. Cruzeiro', 'San Vicente', 'Estadio Jiboa', 'uploads/1775381059_cruzeiro.png', 'West', '2026-04-05 09:24:19', NULL),
	(15, 'C.D. Olimpico Litoral', 'Cerro de la Loma Larga', 'Complejo Deportivo Rafael L?pez', 'uploads/1775381230_litoral.png', 'West', '2026-04-05 09:27:10', NULL),
	(16, 'C.D. Pipil', 'Moraz?n', 'Estadio Vicente Paul Fuentes', 'uploads/1775381319_pipil.png', 'West', '2026-04-05 09:28:39', NULL),
	(17, 'C.D. Neo Pipil', 'San Juan Nonualco', 'Estadio Neo Pipil', 'uploads/1775381481_neopipil.jpg', 'West', '2026-04-05 09:31:21', NULL);

-- Volcando estructura para tabla numeros-y-futbol.equipos_tercera
CREATE TABLE IF NOT EXISTS `equipos_tercera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `formacion` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.equipos_tercera: ~8 rows (aproximadamente)
INSERT INTO `equipos_tercera` (`id`, `nombre`, `ciudad`, `estadio`, `logo`, `created_at`, `formacion`) VALUES
	(9, 'C.D. Estrellas Del Sur', 'Chirilagua', 'Estadio Municipal Carlos Moon', 'uploads/1778806361_CD ESTRELLAS DEL SUR.png', '2026-05-15 00:52:41', '4-4-2'),
	(10, 'C.S.D Vendaval', 'Apopa', 'Estadio Joaqu?n Guti?rrez', 'uploads/1778807010_vendaval 2.png', '2026-05-15 01:03:30', NULL),
	(11, 'C.D. Buenos Aires', 'Moraz?n', 'Estadio Municipal de Osicala', 'uploads/1778807163_buenos aires 2.png', '2026-05-15 01:06:03', NULL),
	(12, ' Academia BP', 'San Salvador', 'Canchas del Estadio Cuscatl?n', 'uploads/1778807456_academia bp2.png', '2026-05-15 01:10:56', NULL),
	(14, 'A.D Izalco', 'Izalco', 'Estadio Salvador Mariona', 'uploads/1778808698_IZALCOs.png', '2026-05-15 01:31:38', NULL),
	(15, 'C.D. 11 Municipal', 'Ahuachap?n', 'Estadio Arturo Sime?n Maga?a', 'uploads/1778808985_C.D. 11 Municipal.png', '2026-05-15 01:36:25', NULL),
	(16, 'Brasil FC', 'Cant?n El Brazo', 'Estadio Juan Francisco Posada', 'uploads/1778809144_brasil fc.png', '2026-05-15 01:39:04', NULL),
	(17, 'C.D. El Vencedor', 'Santa Elena', 'Estadio Jos? Germ?n Rivas', 'uploads/1778810314_CD EL VENCEDOT.png', '2026-05-15 01:58:34', NULL);

-- Volcando estructura para tabla numeros-y-futbol.estadisticas_jugadores
CREATE TABLE IF NOT EXISTS `estadisticas_jugadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jugador_id` int NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `goles_cabeza` int DEFAULT '0',
  `goles_tiro_libre` int DEFAULT '0',
  `goles_penal` int DEFAULT '0',
  `tarjetas_amarillas` int DEFAULT '0',
  `tarjetas_rojas` int DEFAULT '0',
  `minutos_jugados` int DEFAULT '0',
  `goles_recibidos` int DEFAULT '0',
  `vaya_invicta` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_jugador_temp` (`jugador_id`,`temporada`),
  KEY `idx_stats_goles` (`goles` DESC),
  KEY `idx_stats_amarillas` (`tarjetas_amarillas` DESC),
  KEY `idx_stats_rojas` (`tarjetas_rojas` DESC),
  KEY `idx_stats_portero` (`goles_recibidos`),
  CONSTRAINT `estadisticas_jugadores_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=416 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.estadisticas_jugadores: ~264 rows (aproximadamente)
INSERT INTO `estadisticas_jugadores` (`id`, `jugador_id`, `temporada`, `partidos_jugados`, `goles`, `asistencias`, `goles_cabeza`, `goles_tiro_libre`, `goles_penal`, `tarjetas_amarillas`, `tarjetas_rojas`, `minutos_jugados`, `goles_recibidos`, `vaya_invicta`) VALUES
	(122, 98, '2025-2026', 20, 0, 0, 0, 0, 0, 1, 0, 1800, 22, 5),
	(123, 99, '2025-2026', 5, 0, 0, 0, 0, 0, 0, 0, 270, 6, 1),
	(124, 100, '2025-2026', 2, 0, 0, 0, 0, 0, 0, 0, 90, 3, 0),
	(125, 101, '2025-2026', 18, 1, 0, 1, 0, 0, 3, 0, 1550, 0, 0),
	(126, 102, '2025-2026', 17, 2, 1, 1, 0, 0, 4, 1, 1450, 0, 0),
	(127, 103, '2025-2026', 16, 0, 1, 0, 0, 0, 2, 0, 1350, 0, 0),
	(128, 104, '2025-2026', 15, 2, 0, 2, 0, 0, 3, 0, 1280, 0, 0),
	(129, 105, '2025-2026', 10, 0, 0, 0, 0, 0, 1, 0, 760, 0, 0),
	(130, 106, '2025-2026', 17, 5, 0, 2, 0, 0, 3, 0, 1450, 0, 0),
	(131, 107, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 520, 0, 0),
	(132, 108, '2025-2026', 19, 6, 3, 0, 0, 0, 4, 0, 1650, 0, 0),
	(133, 109, '2025-2026', 18, 4, 5, 0, 0, 0, 4, 1, 1530, 0, 0),
	(134, 110, '2025-2026', 17, 6, 2, 0, 0, 0, 2, 0, 1420, 0, 0),
	(135, 111, '2025-2026', 12, 1, 2, 0, 0, 0, 2, 0, 870, 0, 0),
	(136, 112, '2025-2026', 9, 0, 1, 0, 0, 0, 1, 0, 610, 0, 0),
	(137, 113, '2025-2026', 16, 2, 3, 0, 0, 0, 3, 0, 1320, 0, 0),
	(138, 114, '2025-2026', 11, 1, 1, 0, 0, 0, 2, 0, 780, 0, 0),
	(139, 115, '2025-2026', 7, 0, 0, 0, 0, 0, 1, 0, 430, 0, 0),
	(140, 116, '2025-2026', 6, 0, 1, 0, 0, 0, 0, 0, 310, 0, 0),
	(141, 117, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 450, 0, 0),
	(142, 118, '2025-2026', 18, 5, 2, 1, 0, 1, 2, 0, 1480, 0, 0),
	(143, 119, '2025-2026', 17, 5, 3, 1, 0, 1, 1, 1, 1380, 0, 0),
	(144, 120, '2025-2026', 19, 6, 4, 0, 0, 2, 2, 0, 1560, 0, 0),
	(145, 121, '2025-2026', 16, 8, 2, 2, 0, 1, 3, 0, 1300, 0, 0),
	(146, 122, '2025-2026', 10, 2, 1, 0, 0, 0, 1, 0, 650, 0, 0),
	(147, 123, '2025-2026', 19, 0, 0, 0, 0, 0, 1, 0, 1710, 20, 6),
	(148, 124, '2025-2026', 6, 1, 0, 0, 0, 0, 0, 0, 360, 8, 1),
	(149, 125, '2025-2026', 18, 0, 1, 0, 0, 0, 2, 0, 1550, 0, 0),
	(150, 126, '2025-2026', 17, 1, 0, 1, 0, 0, 3, 0, 1450, 0, 0),
	(151, 127, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1350, 0, 0),
	(152, 128, '2025-2026', 15, 0, 1, 0, 0, 0, 1, 0, 1280, 0, 0),
	(153, 129, '2025-2026', 10, 0, 0, 0, 0, 0, 1, 0, 760, 0, 0),
	(154, 130, '2025-2026', 17, 1, 0, 1, 0, 0, 2, 0, 1450, 0, 0),
	(155, 131, '2025-2026', 9, 2, 0, 1, 0, 1, 1, 0, 620, 0, 0),
	(156, 132, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 480, 0, 0),
	(157, 133, '2025-2026', 7, 0, 0, 0, 0, 0, 1, 0, 410, 0, 0),
	(158, 134, '2025-2026', 19, 1, 4, 0, 0, 0, 3, 0, 1640, 0, 0),
	(159, 135, '2025-2026', 18, 2, 5, 0, 0, 0, 2, 0, 1520, 0, 0),
	(160, 136, '2025-2026', 17, 1, 3, 0, 0, 0, 2, 0, 1400, 0, 0),
	(161, 137, '2025-2026', 12, 0, 2, 0, 0, 0, 2, 0, 820, 0, 0),
	(162, 138, '2025-2026', 10, 2, 1, 0, 0, 0, 1, 0, 680, 0, 0),
	(163, 139, '2025-2026', 9, 0, 1, 0, 0, 0, 2, 0, 550, 0, 0),
	(164, 140, '2025-2026', 18, 7, 3, 1, 0, 2, 2, 0, 1500, 0, 0),
	(165, 141, '2025-2026', 17, 5, 4, 0, 0, 1, 1, 0, 1380, 0, 0),
	(166, 142, '2025-2026', 16, 4, 2, 1, 0, 1, 2, 0, 1250, 0, 0),
	(167, 143, '2025-2026', 15, 6, 2, 0, 0, 2, 1, 0, 1180, 0, 0),
	(168, 144, '2025-2026', 10, 2, 1, 0, 0, 0, 1, 0, 640, 0, 0),
	(169, 145, '2025-2026', 8, 1, 0, 0, 0, 0, 0, 0, 410, 0, 0),
	(170, 146, '2025-2026', 11, 4, 1, 0, 0, 1, 2, 0, 720, 0, 0),
	(171, 147, '2025-2026', 20, 0, 0, 0, 0, 0, 1, 0, 1800, 18, 7),
	(172, 148, '2025-2026', 4, 0, 0, 0, 0, 0, 0, 0, 180, 5, 1),
	(173, 149, '2025-2026', 2, 0, 0, 0, 0, 0, 0, 0, 90, 2, 0),
	(174, 150, '2025-2026', 19, 2, 1, 2, 0, 0, 3, 0, 1650, 0, 0),
	(175, 151, '2025-2026', 18, 2, 0, 1, 0, 0, 2, 0, 1530, 0, 0),
	(176, 152, '2025-2026', 17, 0, 1, 0, 0, 0, 3, 1, 1420, 0, 0),
	(177, 153, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1300, 0, 0),
	(178, 154, '2025-2026', 19, 0, 2, 0, 0, 0, 1, 0, 1620, 0, 0),
	(179, 155, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1280, 0, 0),
	(180, 156, '2025-2026', 10, 0, 0, 0, 0, 0, 1, 0, 700, 0, 0),
	(181, 157, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 480, 0, 0),
	(182, 158, '2025-2026', 7, 0, 1, 0, 0, 0, 1, 0, 420, 0, 0),
	(183, 159, '2025-2026', 18, 2, 4, 0, 0, 0, 3, 0, 1520, 0, 0),
	(184, 160, '2025-2026', 17, 3, 5, 0, 0, 0, 2, 0, 1400, 0, 0),
	(185, 161, '2025-2026', 16, 1, 3, 0, 0, 0, 2, 0, 1300, 0, 0),
	(186, 162, '2025-2026', 19, 2, 3, 0, 0, 0, 3, 0, 1580, 0, 0),
	(187, 163, '2025-2026', 11, 0, 2, 0, 0, 0, 2, 0, 760, 0, 0),
	(188, 164, '2025-2026', 9, 1, 1, 0, 0, 0, 1, 0, 590, 0, 0),
	(189, 165, '2025-2026', 10, 1, 0, 0, 0, 0, 2, 0, 680, 0, 0),
	(190, 166, '2025-2026', 7, 0, 1, 0, 0, 0, 0, 0, 380, 0, 0),
	(191, 167, '2025-2026', 6, 0, 0, 0, 0, 0, 1, 0, 320, 0, 0),
	(192, 168, '2025-2026', 5, 0, 0, 0, 0, 0, 0, 0, 260, 0, 0),
	(193, 169, '2025-2026', 17, 4, 2, 1, 0, 1, 2, 0, 1380, 0, 0),
	(194, 170, '2025-2026', 19, 4, 1, 0, 0, 1, 1, 0, 1520, 0, 0),
	(195, 171, '2025-2026', 15, 3, 2, 1, 0, 0, 2, 0, 1150, 0, 0),
	(196, 172, '2025-2026', 16, 3, 1, 0, 0, 1, 1, 0, 1200, 0, 0),
	(197, 173, '2025-2026', 9, 1, 0, 0, 0, 0, 1, 0, 540, 0, 0),
	(198, 174, '2025-2026', 8, 4, 0, 1, 0, 2, 0, 0, 480, 0, 0),
	(199, 175, '2025-2026', 19, 0, 0, 0, 0, 0, 1, 0, 1710, 26, 3),
	(200, 176, '2025-2026', 5, 0, 0, 0, 0, 0, 0, 0, 270, 7, 1),
	(201, 177, '2025-2026', 2, 0, 0, 0, 0, 0, 0, 0, 90, 4, 0),
	(202, 178, '2025-2026', 18, 0, 1, 0, 0, 0, 3, 0, 1550, 0, 0),
	(203, 179, '2025-2026', 17, 1, 0, 1, 0, 0, 2, 0, 1450, 0, 0),
	(204, 180, '2025-2026', 20, 0, 1, 0, 0, 0, 4, 1, 1720, 0, 0),
	(205, 181, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1300, 0, 0),
	(206, 182, '2025-2026', 19, 0, 1, 0, 0, 0, 3, 0, 1620, 0, 0),
	(207, 183, '2025-2026', 20, 1, 4, 0, 0, 0, 3, 0, 1700, 0, 0),
	(208, 184, '2025-2026', 17, 3, 2, 0, 0, 1, 2, 0, 1420, 0, 0),
	(209, 185, '2025-2026', 12, 1, 2, 0, 0, 0, 2, 0, 850, 0, 0),
	(210, 186, '2025-2026', 13, 1, 2, 0, 0, 0, 1, 0, 880, 0, 0),
	(211, 187, '2025-2026', 20, 3, 0, 0, 0, 0, 4, 0, 1700, 0, 0),
	(212, 188, '2025-2026', 10, 1, 1, 0, 0, 0, 2, 0, 700, 0, 0),
	(213, 189, '2025-2026', 8, 0, 1, 0, 0, 0, 1, 0, 480, 0, 0),
	(214, 190, '2025-2026', 20, 10, 3, 2, 0, 1, 2, 0, 1680, 0, 0),
	(215, 191, '2025-2026', 15, 3, 2, 1, 0, 0, 1, 0, 1150, 0, 0),
	(216, 192, '2025-2026', 20, 10, 4, 1, 0, 2, 2, 1, 1600, 0, 0),
	(217, 193, '2025-2026', 10, 1, 1, 0, 0, 0, 1, 0, 620, 0, 0),
	(218, 194, '2025-2026', 14, 5, 2, 1, 0, 1, 1, 0, 1050, 0, 0),
	(219, 195, '2025-2026', 20, 0, 0, 0, 0, 0, 1, 0, 1800, 19, 6),
	(220, 196, '2025-2026', 5, 0, 0, 0, 0, 0, 0, 0, 270, 6, 1),
	(221, 197, '2025-2026', 2, 0, 0, 0, 0, 0, 0, 0, 90, 3, 0),
	(222, 198, '2025-2026', 18, 0, 1, 0, 0, 0, 2, 0, 1530, 0, 0),
	(223, 199, '2025-2026', 17, 0, 0, 0, 0, 0, 2, 0, 1420, 0, 0),
	(224, 200, '2025-2026', 18, 0, 1, 0, 0, 0, 3, 0, 1520, 0, 0),
	(225, 201, '2025-2026', 10, 0, 0, 0, 0, 0, 1, 0, 720, 0, 0),
	(226, 202, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1300, 0, 0),
	(227, 203, '2025-2026', 9, 0, 0, 0, 0, 0, 1, 0, 590, 0, 0),
	(228, 204, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 490, 0, 0),
	(229, 205, '2025-2026', 18, 1, 3, 0, 0, 0, 2, 0, 1480, 0, 0),
	(230, 206, '2025-2026', 12, 0, 2, 0, 0, 0, 1, 0, 820, 0, 0),
	(231, 207, '2025-2026', 17, 2, 3, 0, 0, 0, 2, 0, 1370, 0, 0),
	(232, 208, '2025-2026', 10, 0, 1, 0, 0, 0, 1, 0, 640, 0, 0),
	(233, 209, '2025-2026', 16, 3, 2, 0, 0, 0, 2, 0, 1280, 0, 0),
	(234, 210, '2025-2026', 19, 1, 4, 0, 0, 0, 3, 0, 1560, 0, 0),
	(235, 211, '2025-2026', 16, 2, 3, 0, 0, 0, 2, 0, 1250, 0, 0),
	(236, 212, '2025-2026', 18, 6, 2, 1, 0, 2, 2, 0, 1430, 0, 0),
	(237, 213, '2025-2026', 15, 5, 3, 0, 0, 1, 1, 0, 1150, 0, 0),
	(238, 214, '2025-2026', 10, 2, 1, 0, 0, 0, 1, 0, 620, 0, 0),
	(239, 215, '2025-2026', 8, 1, 0, 0, 0, 0, 0, 0, 410, 0, 0),
	(240, 216, '2025-2026', 19, 0, 0, 0, 0, 0, 1, 0, 1710, 21, 5),
	(241, 217, '2025-2026', 6, 0, 0, 0, 0, 0, 0, 0, 360, 7, 1),
	(242, 218, '2025-2026', 18, 0, 2, 0, 0, 0, 2, 0, 1520, 0, 0),
	(243, 219, '2025-2026', 17, 1, 1, 1, 0, 0, 3, 0, 1420, 0, 0),
	(244, 220, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1300, 0, 0),
	(245, 221, '2025-2026', 18, 0, 1, 0, 0, 0, 2, 0, 1500, 0, 0),
	(246, 222, '2025-2026', 15, 0, 0, 0, 0, 0, 1, 0, 1200, 0, 0),
	(247, 223, '2025-2026', 11, 0, 0, 0, 0, 0, 1, 0, 760, 0, 0),
	(248, 224, '2025-2026', 9, 0, 0, 0, 0, 0, 1, 0, 590, 0, 0),
	(249, 225, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 480, 0, 0),
	(250, 226, '2025-2026', 7, 0, 0, 0, 0, 0, 0, 0, 380, 0, 0),
	(251, 227, '2025-2026', 18, 2, 4, 0, 0, 0, 3, 0, 1480, 0, 0),
	(252, 228, '2025-2026', 17, 4, 5, 0, 0, 0, 2, 0, 1370, 0, 0),
	(253, 229, '2025-2026', 16, 2, 3, 0, 0, 0, 2, 0, 1270, 0, 0),
	(254, 230, '2025-2026', 12, 1, 1, 0, 0, 0, 2, 0, 800, 0, 0),
	(255, 231, '2025-2026', 10, 0, 2, 0, 0, 0, 1, 0, 640, 0, 0),
	(256, 232, '2025-2026', 9, 1, 1, 0, 0, 0, 1, 0, 560, 0, 0),
	(257, 233, '2025-2026', 8, 0, 1, 0, 0, 0, 1, 0, 480, 0, 0),
	(258, 234, '2025-2026', 17, 8, 3, 2, 0, 2, 2, 0, 1350, 0, 0),
	(259, 235, '2025-2026', 16, 7, 4, 1, 0, 1, 1, 0, 1230, 0, 0),
	(260, 236, '2025-2026', 11, 3, 1, 1, 0, 0, 2, 0, 720, 0, 0),
	(261, 237, '2025-2026', 15, 4, 2, 0, 0, 1, 1, 0, 1120, 0, 0),
	(262, 238, '2025-2026', 9, 1, 0, 0, 0, 0, 1, 0, 540, 0, 0),
	(263, 239, '2025-2026', 19, 0, 0, 0, 0, 0, 1, 0, 1710, 28, 3),
	(264, 240, '2025-2026', 6, 0, 0, 0, 0, 0, 0, 0, 360, 8, 0),
	(265, 241, '2025-2026', 20, 1, 2, 1, 0, 0, 3, 0, 1720, 0, 0),
	(266, 242, '2025-2026', 19, 0, 1, 0, 0, 0, 3, 0, 1620, 0, 0),
	(267, 243, '2025-2026', 18, 0, 0, 0, 0, 0, 2, 0, 1480, 0, 0),
	(268, 244, '2025-2026', 17, 0, 0, 0, 0, 0, 2, 0, 1380, 0, 0),
	(269, 245, '2025-2026', 16, 0, 1, 0, 0, 0, 1, 0, 1280, 0, 0),
	(270, 246, '2025-2026', 11, 0, 0, 0, 0, 0, 2, 0, 760, 0, 0),
	(271, 247, '2025-2026', 9, 0, 0, 0, 0, 0, 1, 0, 590, 0, 0),
	(272, 248, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 480, 0, 0),
	(273, 249, '2025-2026', 7, 0, 0, 0, 0, 0, 0, 0, 390, 0, 0),
	(274, 250, '2025-2026', 6, 0, 0, 0, 0, 0, 1, 0, 310, 0, 0),
	(275, 251, '2025-2026', 18, 1, 3, 0, 0, 0, 3, 0, 1480, 0, 0),
	(276, 252, '2025-2026', 17, 2, 3, 0, 0, 0, 2, 0, 1370, 0, 0),
	(277, 253, '2025-2026', 16, 2, 2, 0, 0, 0, 2, 0, 1270, 0, 0),
	(278, 254, '2025-2026', 12, 1, 1, 0, 0, 0, 2, 0, 800, 0, 0),
	(279, 255, '2025-2026', 10, 0, 2, 0, 0, 0, 1, 0, 640, 0, 0),
	(280, 256, '2025-2026', 9, 1, 0, 0, 0, 0, 1, 0, 560, 0, 0),
	(281, 257, '2025-2026', 8, 0, 1, 0, 0, 0, 1, 0, 480, 0, 0),
	(282, 258, '2025-2026', 9, 1, 0, 0, 0, 0, 2, 0, 560, 0, 0),
	(283, 259, '2025-2026', 7, 0, 0, 0, 0, 0, 0, 0, 380, 0, 0),
	(284, 260, '2025-2026', 5, 0, 0, 0, 0, 0, 0, 0, 270, 0, 0),
	(285, 261, '2025-2026', 17, 5, 2, 0, 0, 1, 2, 0, 1330, 0, 0),
	(286, 262, '2025-2026', 16, 4, 2, 1, 0, 0, 1, 0, 1230, 0, 0),
	(287, 263, '2025-2026', 15, 3, 1, 0, 0, 1, 2, 1, 1120, 0, 0),
	(288, 264, '2025-2026', 10, 2, 0, 0, 0, 0, 1, 0, 620, 0, 0),
	(289, 265, '2025-2026', 9, 1, 1, 0, 0, 0, 1, 0, 540, 0, 0),
	(290, 266, '2025-2026', 7, 1, 0, 0, 0, 0, 0, 0, 380, 0, 0),
	(291, 267, '2025-2026', 6, 0, 0, 0, 0, 0, 1, 0, 310, 0, 0),
	(312, 288, '2025-2026', 18, 0, 0, 0, 0, 0, 1, 0, 1620, 28, 2),
	(313, 289, '2025-2026', 7, 0, 0, 0, 0, 0, 0, 0, 450, 10, 0),
	(314, 290, '2025-2026', 17, 0, 1, 0, 0, 0, 3, 0, 1420, 0, 0),
	(315, 291, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1300, 0, 0),
	(316, 292, '2025-2026', 15, 0, 0, 0, 0, 0, 2, 0, 1200, 0, 0),
	(317, 293, '2025-2026', 14, 0, 0, 0, 0, 0, 1, 0, 1100, 0, 0),
	(318, 294, '2025-2026', 16, 0, 1, 0, 0, 0, 2, 0, 1300, 0, 0),
	(319, 295, '2025-2026', 17, 1, 2, 0, 0, 0, 2, 0, 1380, 0, 0),
	(320, 296, '2025-2026', 16, 2, 3, 0, 0, 0, 2, 0, 1270, 0, 0),
	(321, 297, '2025-2026', 15, 1, 2, 0, 0, 0, 1, 0, 1170, 0, 0),
	(322, 298, '2025-2026', 11, 0, 1, 0, 0, 0, 2, 0, 740, 0, 0),
	(323, 299, '2025-2026', 10, 1, 0, 0, 0, 0, 1, 0, 640, 0, 0),
	(324, 300, '2025-2026', 9, 0, 1, 0, 0, 0, 1, 0, 560, 0, 0),
	(325, 301, '2025-2026', 8, 1, 0, 0, 0, 0, 1, 0, 490, 0, 0),
	(326, 302, '2025-2026', 16, 5, 2, 1, 0, 1, 2, 0, 1250, 0, 0),
	(327, 303, '2025-2026', 15, 4, 2, 1, 0, 0, 1, 0, 1150, 0, 0),
	(328, 304, '2025-2026', 10, 1, 1, 0, 0, 0, 1, 0, 620, 0, 0),
	(329, 305, '2025-2026', 9, 2, 0, 0, 0, 0, 0, 0, 540, 0, 0),
	(330, 306, '2025-2026', 7, 1, 0, 0, 0, 0, 1, 0, 380, 0, 0),
	(331, 307, '2025-2026', 18, 0, 0, 0, 0, 0, 1, 0, 1620, 32, 2),
	(332, 308, '2025-2026', 17, 0, 0, 0, 0, 0, 2, 0, 1420, 0, 0),
	(333, 309, '2025-2026', 16, 0, 1, 0, 0, 0, 2, 0, 1300, 0, 0),
	(334, 310, '2025-2026', 15, 0, 0, 0, 0, 0, 2, 0, 1200, 0, 0),
	(335, 311, '2025-2026', 14, 0, 0, 0, 0, 0, 1, 0, 1100, 0, 0),
	(336, 312, '2025-2026', 16, 0, 1, 0, 0, 0, 1, 0, 1300, 0, 0),
	(337, 313, '2025-2026', 17, 1, 2, 0, 0, 0, 3, 0, 1380, 0, 0),
	(338, 314, '2025-2026', 16, 0, 2, 0, 0, 0, 2, 0, 1270, 0, 0),
	(339, 315, '2025-2026', 15, 1, 1, 0, 0, 0, 2, 0, 1170, 0, 0),
	(340, 316, '2025-2026', 10, 0, 1, 0, 0, 0, 1, 0, 640, 0, 0),
	(341, 317, '2025-2026', 16, 3, 2, 0, 0, 1, 2, 0, 1250, 0, 0),
	(342, 318, '2025-2026', 9, 0, 1, 0, 0, 0, 1, 0, 550, 0, 0),
	(343, 319, '2025-2026', 16, 4, 2, 0, 0, 1, 2, 0, 1230, 0, 0),
	(344, 320, '2025-2026', 15, 3, 1, 1, 0, 0, 1, 0, 1130, 0, 0),
	(345, 321, '2025-2026', 10, 1, 0, 0, 0, 0, 1, 0, 600, 0, 0),
	(346, 322, '2025-2026', 18, 0, 0, 0, 0, 0, 1, 0, 1620, 20, 5),
	(347, 323, '2025-2026', 7, 0, 0, 0, 0, 0, 0, 0, 450, 9, 1),
	(348, 324, '2025-2026', 18, 0, 1, 0, 0, 0, 2, 0, 1520, 0, 0),
	(349, 325, '2025-2026', 17, 1, 0, 1, 0, 0, 3, 0, 1420, 0, 0),
	(350, 326, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1300, 0, 0),
	(351, 327, '2025-2026', 15, 0, 1, 0, 0, 0, 2, 0, 1200, 0, 0),
	(352, 328, '2025-2026', 17, 0, 0, 0, 0, 0, 1, 0, 1420, 0, 0),
	(353, 329, '2025-2026', 10, 0, 0, 0, 0, 0, 2, 0, 720, 0, 0),
	(354, 330, '2025-2026', 9, 0, 0, 0, 0, 0, 1, 0, 590, 0, 0),
	(355, 331, '2025-2026', 18, 2, 3, 0, 0, 0, 3, 0, 1480, 0, 0),
	(356, 332, '2025-2026', 17, 3, 4, 0, 0, 0, 2, 0, 1370, 0, 0),
	(357, 333, '2025-2026', 16, 1, 2, 0, 0, 0, 2, 0, 1270, 0, 0),
	(358, 334, '2025-2026', 15, 2, 2, 0, 0, 0, 1, 0, 1180, 0, 0),
	(359, 335, '2025-2026', 11, 0, 2, 0, 0, 0, 2, 0, 760, 0, 0),
	(360, 336, '2025-2026', 9, 1, 1, 0, 0, 0, 1, 0, 580, 0, 0),
	(361, 337, '2025-2026', 17, 7, 3, 1, 0, 2, 2, 0, 1380, 0, 0),
	(362, 338, '2025-2026', 16, 5, 2, 1, 0, 1, 1, 0, 1250, 0, 0),
	(363, 339, '2025-2026', 11, 2, 1, 0, 0, 0, 1, 0, 700, 0, 0),
	(364, 340, '2025-2026', 10, 3, 1, 0, 0, 1, 1, 0, 640, 0, 0),
	(365, 341, '2025-2026', 8, 1, 0, 0, 0, 0, 0, 0, 410, 0, 0),
	(366, 342, '2025-2026', 20, 0, 0, 0, 0, 0, 2, 0, 1800, 30, 3),
	(367, 343, '2025-2026', 18, 0, 0, 0, 0, 0, 3, 0, 1530, 0, 0),
	(368, 344, '2025-2026', 17, 0, 1, 0, 0, 0, 2, 0, 1420, 0, 0),
	(369, 345, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1300, 0, 0),
	(370, 346, '2025-2026', 15, 0, 0, 0, 0, 0, 1, 0, 1200, 0, 0),
	(371, 347, '2025-2026', 16, 0, 0, 0, 0, 0, 2, 0, 1300, 0, 0),
	(372, 348, '2025-2026', 10, 0, 0, 0, 0, 0, 1, 0, 680, 0, 0),
	(373, 349, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 480, 0, 0),
	(374, 350, '2025-2026', 18, 1, 3, 0, 0, 0, 3, 0, 1480, 0, 0),
	(375, 351, '2025-2026', 17, 2, 2, 0, 0, 0, 2, 0, 1370, 0, 0),
	(376, 352, '2025-2026', 16, 1, 2, 0, 0, 0, 2, 0, 1270, 0, 0),
	(377, 353, '2025-2026', 12, 0, 1, 0, 0, 0, 2, 0, 800, 0, 0),
	(378, 354, '2025-2026', 15, 1, 2, 0, 0, 0, 1, 0, 1170, 0, 0),
	(379, 355, '2025-2026', 10, 0, 1, 0, 0, 0, 1, 0, 640, 0, 0),
	(380, 356, '2025-2026', 9, 0, 0, 0, 0, 0, 1, 0, 560, 0, 0),
	(381, 357, '2025-2026', 8, 1, 0, 0, 0, 0, 1, 0, 490, 0, 0),
	(382, 358, '2025-2026', 17, 4, 2, 0, 0, 1, 2, 0, 1330, 0, 0),
	(383, 359, '2025-2026', 16, 5, 1, 1, 0, 1, 1, 0, 1230, 0, 0),
	(384, 360, '2025-2026', 11, 2, 1, 0, 0, 0, 1, 0, 700, 0, 0),
	(385, 361, '2025-2026', 9, 1, 0, 0, 0, 0, 0, 0, 480, 0, 0),
	(386, 362, '2025-2026', 7, 1, 0, 0, 0, 0, 1, 0, 380, 0, 0),
	(387, 363, '2025-2026', 18, 0, 0, 0, 0, 0, 1, 0, 1620, 25, 3),
	(388, 364, '2025-2026', 6, 0, 0, 0, 0, 0, 0, 0, 360, 9, 0),
	(389, 365, '2025-2026', 2, 0, 0, 0, 0, 0, 0, 0, 90, 4, 0),
	(390, 366, '2025-2026', 17, 0, 0, 0, 0, 0, 2, 0, 1420, 0, 0),
	(391, 367, '2025-2026', 16, 0, 1, 0, 0, 0, 3, 0, 1300, 0, 0),
	(392, 368, '2025-2026', 15, 1, 0, 1, 0, 0, 2, 0, 1200, 0, 0),
	(393, 369, '2025-2026', 14, 0, 0, 0, 0, 0, 2, 0, 1100, 0, 0),
	(394, 370, '2025-2026', 16, 0, 0, 0, 0, 0, 1, 0, 1300, 0, 0),
	(395, 371, '2025-2026', 10, 0, 0, 0, 0, 0, 1, 0, 680, 0, 0),
	(396, 372, '2025-2026', 8, 0, 0, 0, 0, 0, 1, 0, 480, 0, 0),
	(397, 373, '2025-2026', 17, 1, 3, 0, 0, 0, 2, 0, 1380, 0, 0),
	(398, 374, '2025-2026', 16, 2, 2, 0, 0, 0, 2, 0, 1270, 0, 0),
	(399, 375, '2025-2026', 15, 3, 2, 0, 0, 0, 1, 0, 1170, 0, 0),
	(400, 376, '2025-2026', 11, 1, 1, 0, 0, 0, 2, 0, 740, 0, 0),
	(401, 377, '2025-2026', 9, 0, 1, 0, 0, 0, 1, 0, 560, 0, 0),
	(402, 378, '2025-2026', 16, 4, 2, 1, 0, 1, 2, 0, 1250, 0, 0),
	(403, 379, '2025-2026', 15, 5, 1, 0, 0, 1, 1, 0, 1150, 0, 0),
	(404, 380, '2025-2026', 10, 2, 1, 0, 0, 0, 1, 0, 620, 0, 0),
	(408, 138, '2026', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Volcando estructura para tabla numeros-y-futbol.estadisticas_jugadores_segunda
CREATE TABLE IF NOT EXISTS `estadisticas_jugadores_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jugador_id` int NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `goles_cabeza` int DEFAULT '0',
  `goles_tiro_libre` int DEFAULT '0',
  `goles_penal` int DEFAULT '0',
  `tarjetas_amarillas` int DEFAULT '0',
  `tarjetas_rojas` int DEFAULT '0',
  `minutos_jugados` int DEFAULT '0',
  `goles_recibidos` int DEFAULT '0',
  `vaya_invicta` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_jugador_temp_seg` (`jugador_id`,`temporada`),
  KEY `idx_stats_goles_seg` (`goles` DESC),
  KEY `idx_stats_amarillas_seg` (`tarjetas_amarillas` DESC),
  KEY `idx_stats_rojas_seg` (`tarjetas_rojas` DESC),
  KEY `idx_stats_portero_seg` (`goles_recibidos`),
  CONSTRAINT `estadisticas_jugadores_segunda_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores_segunda` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.estadisticas_jugadores_segunda: ~2 rows (aproximadamente)
INSERT INTO `estadisticas_jugadores_segunda` (`id`, `jugador_id`, `temporada`, `partidos_jugados`, `goles`, `asistencias`, `goles_cabeza`, `goles_tiro_libre`, `goles_penal`, `tarjetas_amarillas`, `tarjetas_rojas`, `minutos_jugados`, `goles_recibidos`, `vaya_invicta`) VALUES
	(1, 1, '2025-2026', 3, 2, 1, 0, 0, 0, 0, 0, 90, 0, 0),
	(2, 2, '2025-2026', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Volcando estructura para tabla numeros-y-futbol.estadisticas_jugadores_tercera
CREATE TABLE IF NOT EXISTS `estadisticas_jugadores_tercera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jugador_id` int NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `goles_cabeza` int DEFAULT '0',
  `goles_tiro_libre` int DEFAULT '0',
  `goles_penal` int DEFAULT '0',
  `tarjetas_amarillas` int DEFAULT '0',
  `tarjetas_rojas` int DEFAULT '0',
  `minutos_jugados` int DEFAULT '0',
  `goles_recibidos` int DEFAULT '0',
  `vaya_invicta` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_jugador_temp_ter` (`jugador_id`,`temporada`),
  KEY `idx_stats_goles_ter` (`goles` DESC),
  KEY `idx_stats_amarillas_ter` (`tarjetas_amarillas` DESC),
  KEY `idx_stats_rojas_ter` (`tarjetas_rojas` DESC),
  KEY `idx_stats_portero_ter` (`goles_recibidos`),
  CONSTRAINT `estadisticas_jugadores_tercera_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores_tercera` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.estadisticas_jugadores_tercera: ~0 rows (aproximadamente)

-- Volcando estructura para tabla numeros-y-futbol.jugadores
CREATE TABLE IF NOT EXISTS `jugadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(30) NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_jugador_equipo` (`equipo_id`),
  CONSTRAINT `jugadores_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=382 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.jugadores: ~263 rows (aproximadamente)
INSERT INTO `jugadores` (`id`, `equipo_id`, `nombre`, `posicion`, `numero_camiseta`, `foto`, `edad`, `nacionalidad`, `fecha_creacion`, `posicion_x`, `posicion_y`, `pos_x`, `pos_y`, `es_titular`) VALUES
	(98, 4, 'Wilberth Hernández', 'portero', 1, NULL, 28, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(99, 4, 'Misael Erazo', 'portero', 12, NULL, 24, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 50, 90, 1),
	(100, 4, 'Felipe Amaya', 'portero', 22, NULL, 21, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(101, 4, 'Diego Flores', 'defensa', 4, NULL, 26, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 75, 74, 0),
	(102, 4, 'Wilber Arizala', 'defensa', 3, NULL, 27, 'Colombiano', '2026-04-17 21:00:39', NULL, NULL, 50, 76, 0),
	(103, 4, 'Lizandro Claros', 'defensa', 5, NULL, 25, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(104, 4, 'Eduardo Vigil', 'defensa', 6, NULL, 29, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(105, 4, 'César Orellana', 'defensa', 2, NULL, 23, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 25, 74, 0),
	(106, 4, 'José Quintanilla', 'defensa', 15, NULL, 30, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(107, 4, 'Marlon Cornejo', 'defensa', 17, NULL, 24, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(108, 4, 'Mauricio Cerritos', 'centrocampista', 8, NULL, 28, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 62, 48, 0),
	(109, 4, 'Brayan Landaverde', 'centrocampista', 10, NULL, 27, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 88, 50, 0),
	(110, 4, 'Lucas R.', 'centrocampista', 7, NULL, 26, 'Brasile?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(111, 4, 'Kevin Ascencio', 'centrocampista', 16, NULL, 22, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(112, 4, 'Erivan Flores', 'centrocampista', 20, NULL, 21, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(113, 4, 'Victor Garcia', 'centrocampista', 14, NULL, 25, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(114, 4, 'Brian Martínez', 'centrocampista', 11, NULL, 23, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 12, 50, 0),
	(115, 4, 'Jeremías Lemus', 'centrocampista', 19, NULL, 20, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(116, 4, 'Diego Ortez', 'centrocampista', 21, NULL, 22, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(117, 4, 'Marvin Aranda', 'centrocampista', 13, NULL, 26, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 38, 48, 1),
	(118, 4, 'Marcelo Ferreira', 'delantero', 9, NULL, 28, 'Brasile?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(119, 4, 'Cristian Gil', 'delantero', 18, NULL, 27, 'Colombiano', '2026-04-17 21:00:39', NULL, NULL, 18, 22, 0),
	(120, 4, 'Nelson Díaz', 'delantero', 11, NULL, 25, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, NULL, NULL, 0),
	(121, 4, 'Elías Gumero', 'delantero', 23, NULL, 24, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 50, 18, 0),
	(122, 4, 'Andrés Morales', 'delantero', 25, NULL, 22, 'Salvadore?o', '2026-04-17 21:00:39', NULL, NULL, 82, 22, 0),
	(123, 5, 'Daniel Franco', 'portero', 1, NULL, 28, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(124, 5, 'Cristopher Rauda', 'portero', 12, NULL, 22, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 50, 90, 0),
	(125, 5, 'Henry Romero', 'defensa', 4, NULL, 27, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 64, 74, 0),
	(126, 5, 'Alejandro Henríquez', 'defensa', 3, NULL, 26, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 36, 74, 0),
	(127, 5, 'Juan Barahona', 'defensa', 5, NULL, 29, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 88, 70, 0),
	(128, 5, 'Matías Steib', 'defensa', 6, NULL, 24, 'Argentino', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(129, 5, 'Jonathan Jiménez', 'defensa', 2, NULL, 23, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 12, 70, 0),
	(130, 5, 'Emerson Hernández', 'defensa', 15, NULL, 25, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(131, 5, 'William Canales', 'defensa', 16, NULL, 28, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(132, 5, 'Diego Lemus', 'defensa', 17, NULL, 22, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(133, 5, 'Mario Jacobo', 'defensa', 20, NULL, 30, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(134, 5, 'Harold Osorio', 'centrocampista', 8, NULL, 27, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(135, 5, 'Leonardo Menjívar', 'centrocampista', 10, NULL, 26, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 72, 48, 0),
	(136, 5, 'Noel Rivera', 'centrocampista', 7, NULL, 25, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 50, 44, 0),
	(137, 5, 'Narciso Orellana', 'centrocampista', 11, NULL, 24, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 28, 48, 0),
	(138, 5, 'Oscar Rodríguez', 'centrocampista', 14, NULL, 23, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(139, 5, 'Christopher Guardado', 'centrocampista', 19, NULL, 22, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(140, 5, 'Enrico Dueñas Hernández', 'delantero', 9, NULL, 25, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 18, 22, 0),
	(141, 5, 'Francis Castillo-Orellana', 'delantero', 18, NULL, 24, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, 82, 22, 0),
	(142, 5, 'Gustavo Moura', 'delantero', 23, NULL, 27, 'Brasile?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(143, 5, 'Michell Mercado', 'delantero', 21, NULL, 26, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(144, 5, 'Juan Portillo', 'delantero', 22, NULL, 22, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(145, 5, 'Allan Acevedo', 'delantero', 25, NULL, 21, 'Salvadore?o', '2026-04-17 21:02:43', NULL, NULL, NULL, NULL, 0),
	(146, 5, 'Luis Tobar', 'delantero', 11, NULL, 28, 'Chileno', '2026-04-17 21:02:43', NULL, NULL, 50, 18, 0),
	(147, 6, 'Benji Villalobos', 'portero', 1, NULL, 30, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(148, 6, 'Jairo Guardado', 'portero', 12, NULL, 24, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(149, 6, 'Osmán Loza', 'portero', 22, NULL, 23, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(150, 6, 'Ronald Rodríguez', 'defensa', 4, NULL, 29, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(151, 6, 'Julio Sibrián', 'defensa', 3, NULL, 28, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(152, 6, 'Erick Cabalceta', 'defensa', 5, NULL, 26, 'Costarricense', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(153, 6, 'Jefferson Perla', 'defensa', 6, NULL, 24, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(154, 6, 'Tereso Benítez', 'defensa', 2, NULL, 31, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(155, 6, 'Walter Pineda', 'defensa', 15, NULL, 27, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(156, 6, 'Juan Franco Cacace', 'defensa', 17, NULL, 25, 'Uruguayo', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(157, 6, 'José Guatemala', 'defensa', 20, NULL, 23, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(158, 6, 'Stiven Dávila', 'defensa', 16, NULL, 22, 'Colombiano', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(159, 6, 'Santos Ortiz', 'centrocampista', 8, NULL, 27, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(160, 6, 'Tomás Granitto', 'centrocampista', 10, NULL, 26, 'Argentino', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(161, 6, 'Diego Gregori', 'centrocampista', 7, NULL, 25, 'Argentino', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(162, 6, 'Marcelo Díaz', 'centrocampista', 11, NULL, 28, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(163, 6, 'Jairo Martínez', 'centrocampista', 14, NULL, 24, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(164, 6, 'Bryan Lovo', 'centrocampista', 19, NULL, 22, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(165, 6, 'Joel Turcios', 'centrocampista', 21, NULL, 26, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(166, 6, 'Carlos Ortiz', 'centrocampista', 23, NULL, 23, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(167, 6, 'Marvin Benitez Jr', 'centrocampista', 18, NULL, 21, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(168, 6, 'Herberth Marcelo Diaz Rivas', 'centrocampista', 24, NULL, 22, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(169, 6, 'Federico Andrada', 'delantero', 9, NULL, 28, 'Argentino', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(170, 6, 'Dixon Rivas', 'delantero', 18, NULL, 26, 'Colombiano', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(171, 6, 'Ricardo Villatoro', 'delantero', 13, NULL, 25, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(172, 6, 'Carlos Garay', 'delantero', 11, NULL, 27, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(173, 6, 'Allan Benítez', 'delantero', 25, NULL, 22, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(174, 6, 'Eduardo Cruz', 'delantero', 26, NULL, 24, 'Salvadore?o', '2026-04-17 21:03:03', NULL, NULL, NULL, NULL, 0),
	(175, 7, 'Julián Chicas', 'portero', 1, NULL, 28, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(176, 7, 'Oscar Sánchez', 'portero', 12, NULL, 25, 'Salvadore?o', '2026-04-17 21:03:27', 50.00, 90.00, NULL, NULL, 1),
	(177, 7, 'Ricardo Funes', 'portero', 22, NULL, 22, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(178, 7, 'Leyvin Balanta', 'defensa', 4, NULL, 27, 'Colombiano', '2026-04-17 21:03:27', 64.00, 74.00, NULL, NULL, 1),
	(179, 7, 'Elvis Claros', 'defensa', 3, NULL, 26, 'Salvadore?o', '2026-04-17 21:03:27', 36.00, 74.00, NULL, NULL, 1),
	(180, 7, 'Fredy Espinoza', 'defensa', 5, NULL, 30, 'Salvadore?o', '2026-04-17 21:03:27', 88.00, 70.00, NULL, NULL, 1),
	(181, 7, 'William Molina', 'defensa', 6, NULL, 28, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(182, 7, 'Rubén Marroquín', 'defensa', 2, NULL, 32, 'Salvadore?o', '2026-04-17 21:03:27', 12.00, 70.00, NULL, NULL, 1),
	(183, 7, 'Jefferson Valladares', 'centrocampista', 10, NULL, 26, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(184, 7, 'Paolo Dantaz', 'centrocampista', 8, NULL, 26, 'Argentino', '2026-04-17 21:03:27', 60.00, 46.00, NULL, NULL, 1),
	(185, 7, 'Enmanuel Hernández', 'centrocampista', 7, NULL, 23, 'Salvadore?o', '2026-04-17 21:03:27', 40.00, 46.00, NULL, NULL, 1),
	(186, 7, 'Elmer Bonilla', 'centrocampista', 14, NULL, 27, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(187, 7, 'Marvin Ramos', 'centrocampista', 11, NULL, 28, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(188, 7, 'Jefferson Martinez', 'centrocampista', 16, NULL, 24, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(189, 7, 'Jordy Bonilla', 'centrocampista', 19, NULL, 21, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(190, 7, 'José Correa', 'delantero', 9, NULL, 27, 'Salvadore?o', '2026-04-17 21:03:27', 18.00, 48.00, NULL, NULL, 1),
	(191, 7, 'Clayvin Zúñiga', 'delantero', 18, NULL, 25, 'Hondure?o', '2026-04-17 21:03:27', 36.00, 22.00, NULL, NULL, 1),
	(192, 7, 'Javier Ferman', 'delantero', 11, NULL, 28, 'Salvadore?o', '2026-04-17 21:03:27', 82.00, 48.00, NULL, NULL, 1),
	(193, 7, 'Danis Cerros', 'delantero', 21, NULL, 22, 'Salvadore?o', '2026-04-17 21:03:27', 64.00, 22.00, NULL, NULL, 1),
	(194, 7, 'Juan Carlos Argueta', 'delantero', 25, NULL, 24, 'Salvadore?o', '2026-04-17 21:03:27', NULL, NULL, NULL, NULL, 0),
	(195, 8, 'Sergio Sibrián Molina', 'portero', 1, NULL, 21, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(196, 8, 'Hector Ramírez Carvajal', 'portero', 12, NULL, 34, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(197, 8, 'Adriel Martínez Castillo', 'portero', 22, NULL, 23, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(198, 8, 'Lautaro Toledo Pacheco', 'central', 4, NULL, 23, 'Argentino', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(199, 8, 'Guillermo Nieves', 'central', 3, NULL, 27, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(200, 8, 'Ruben Marroquin', 'central', 5, NULL, 32, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(201, 8, 'Jorge González Lemus', 'central', 6, NULL, 21, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(202, 8, 'Alexis Montes Renderos', 'medio_ofensivo', 2, NULL, 27, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(203, 8, 'Kevin Molina Martínez', 'central', 15, NULL, 24, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(204, 8, 'Kevin Menjívar Henriquez', 'central', 16, NULL, 24, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(205, 8, 'Kevin Oviedo', 'centrodelantero', 8, NULL, 27, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(206, 8, 'José Serrano Montano', 'centrodelantero', 10, NULL, 21, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(207, 8, 'Diego Coca', 'centrodelantero', 7, NULL, 30, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(208, 8, 'Bryan Santos', 'centrodelantero', 14, NULL, 19, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(209, 8, 'Guillermo Stradella', 'centrodelantero', 11, NULL, 26, 'Argentino', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(210, 8, 'Darwin Cerén', 'centrodelantero', 20, NULL, 27, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(211, 8, 'Jairo Henríquez', 'centrodelantero', 21, NULL, 32, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(212, 8, 'Melvin Alfaro', 'centrodelantero', 9, NULL, 26, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(213, 8, 'Michell Mercado', 'centrodelantero', 18, NULL, 26, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(214, 8, 'Carlos Alfaro', 'centrodelantero', 22, NULL, 23, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(215, 8, 'Edson García', 'centrodelantero', 25, NULL, 21, 'Salvadore?o', '2026-04-18 17:40:27', NULL, NULL, NULL, NULL, 0),
	(216, 15, 'Kevin Carabantes', 'portero', 1, NULL, 29, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(217, 15, 'Jonathan Valle', 'portero', 12, NULL, 24, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(218, 15, 'Diogo Figueiras', 'central', 4, NULL, 28, 'Portugu?s', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(219, 15, 'Jorge Cruz', 'central', 3, NULL, 27, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(220, 15, 'Miguel Murillo', 'central', 5, NULL, 26, 'Colombiano', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(221, 15, 'Rudy Clavel', 'central', 6, NULL, 29, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(222, 15, 'José Guevara', 'central', 2, NULL, 25, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(223, 15, 'Edson Meléndez', 'central', 15, NULL, 24, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(224, 15, 'Juan Vega', 'central', 17, NULL, 23, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(225, 15, 'Diego Chávez', 'central', 20, NULL, 22, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(226, 15, 'David Funes', 'central', 16, NULL, 25, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(227, 15, 'Kevin Santamaría', 'centrodelantero', 8, NULL, 26, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(228, 15, 'Yan Maciel', 'centrodelantero', 10, NULL, 27, 'Brasile?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(229, 15, 'Elmer Bonilla', 'centrodelantero', 7, NULL, 27, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(230, 15, 'Jonathan Nolasco', 'centrodelantero', 11, NULL, 25, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(231, 15, 'José Isaac Portillo', 'centrodelantero', 14, NULL, 23, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(232, 15, 'Roberto Melgar', 'centrodelantero', 19, NULL, 28, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(233, 15, 'David Montejo', 'centrodelantero', 21, NULL, 24, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(234, 15, 'Nelson Bonilla', 'centrodelantero', 9, NULL, 29, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(235, 15, 'Rafael Tejada', 'centrodelantero', 18, NULL, 26, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(236, 15, 'Edgar Medrano', 'centrodelantero', 21, NULL, 25, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(237, 15, 'Dustin Corea', 'centrodelantero', 22, NULL, 24, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(238, 15, 'Christopher Ortiz', 'centrodelantero', 25, NULL, 22, 'Salvadore?o', '2026-04-18 17:42:41', NULL, NULL, NULL, NULL, 0),
	(239, 13, 'Gerson López', 'portero', 1, NULL, 27, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(240, 13, 'César Melara', 'portero', 12, NULL, 24, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(241, 13, 'Bryan Tamacas', 'central', 4, NULL, 29, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(242, 13, 'Alexander Larin', 'central', 3, NULL, 28, 'Colombiano', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(243, 13, 'Iván Mancía', 'central', 5, NULL, 26, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(244, 13, 'Mario Martínez Donis', 'central', 6, NULL, 25, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(245, 13, 'Diego Chávez', 'central', 2, NULL, 24, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(246, 13, 'Efraín Cárcamo', 'central', 15, NULL, 27, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(247, 13, 'Bayron López', 'central', 17, NULL, 23, 'Hondure?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(248, 13, 'Marvin Morales', 'central', 20, NULL, 26, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(249, 13, 'Elias Rivas', 'central', 16, NULL, 22, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(250, 13, 'William Sibrián', 'central', 21, NULL, 25, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(251, 13, 'Rodrigo Rivera', 'centrodelantero', 8, NULL, 26, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(252, 13, 'Samuel Rosales', 'centrodelantero', 10, NULL, 25, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(253, 13, 'Cesar Flores', 'centrodelantero', 7, NULL, 27, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(254, 13, 'Inner Guevara', 'centrodelantero', 11, NULL, 24, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(255, 13, 'Eduardo González', 'centrodelantero', 14, NULL, 23, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(256, 13, 'Dennis García', 'centrodelantero', 19, NULL, 26, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(257, 13, 'Ángel Ortega', 'centrodelantero', 22, NULL, 22, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(258, 13, 'Kelvin Hernández', 'centrodelantero', 18, NULL, 23, 'Hondure?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(259, 13, 'Julio Paulino', 'centrodelantero', 23, NULL, 25, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(260, 13, 'Diego Rosales', 'centrodelantero', 24, NULL, 21, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(261, 13, 'Ezequiel Rivas', 'centrodelantero', 9, NULL, 26, 'Argentino', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(262, 13, 'Melvin Urbina', 'centrodelantero', 18, NULL, 25, 'Hondure?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(263, 13, 'Isaac Esquivel', 'centrodelantero', 13, NULL, 24, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(264, 13, 'Enrique Vásquez', 'centrodelantero', 22, NULL, 23, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(265, 13, 'Christian Aguilar', 'centrodelantero', 25, NULL, 22, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(266, 13, 'Kevin Velásquez', 'centrodelantero', 26, NULL, 21, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(267, 13, 'José Posada', 'centrodelantero', 27, NULL, 28, 'Salvadore?o', '2026-04-18 17:42:59', NULL, NULL, NULL, NULL, 0),
	(288, 11, 'Daniel Arroyo', 'portero', 1, NULL, 27, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(289, 11, 'William Torres', 'portero', 12, NULL, 24, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(290, 11, 'Moises Xavier Garcia', 'central', 4, NULL, 28, 'Colombiano', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(291, 11, 'Kevin Menjívar', 'central', 3, NULL, 25, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(292, 11, 'Diego Mejía', 'central', 5, NULL, 27, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(293, 11, 'Kevin Calderón', 'central', 6, NULL, 24, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(294, 11, 'Carlos Arévalo', 'central', 2, NULL, 26, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(295, 11, 'Emerson Sandoval', 'centrodelantero', 8, NULL, 26, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(296, 11, 'Jefferson Roque', 'centrodelantero', 10, NULL, 25, 'Colombiano', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(297, 11, 'Josué Palacios', 'centrodelantero', 7, NULL, 24, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(298, 11, 'José Ventura', 'centrodelantero', 11, NULL, 27, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(299, 11, 'Franklin Martínez', 'centrodelantero', 14, NULL, 23, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(300, 11, 'Wilmer Novoa', 'centrodelantero', 19, NULL, 26, 'Venezolano', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(301, 11, 'Anthony Roque', 'centrodelantero', 20, NULL, 22, 'Colombiano', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(302, 11, 'Yair Arboleda', 'centrodelantero', 9, NULL, 27, 'Colombiano', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(303, 11, 'Carlos Bogotá', 'centrodelantero', 18, NULL, 25, 'Colombiano', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(304, 11, 'Bryan Ríos', 'centrodelantero', 21, NULL, 22, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(305, 11, 'Luis Aguilar', 'centrodelantero', 25, NULL, 24, 'Salvadore?o', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(306, 11, 'Sebastian Ortiz', 'centrodelantero', 22, NULL, 23, 'Colombiano', '2026-04-18 17:45:22', NULL, NULL, NULL, NULL, 0),
	(307, 14, 'sandro melgarejo', 'portero', 1, NULL, 28, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, NULL, NULL, 0),
	(308, 14, 'jonathan santana', 'central', 4, NULL, 27, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, 12, 70, 0),
	(309, 14, 'mauricio cuellar', 'central', 3, NULL, 26, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, 64, 74, 0),
	(310, 14, 'walter guevara', 'central', 5, NULL, 29, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, 88, 70, 0),
	(311, 14, 'marlon trejo', 'central', 6, NULL, 25, 'hondure?o', '2026-04-21 17:53:16', NULL, NULL, 64, 22, 0),
	(312, 14, 'willian flores', 'central', 2, NULL, 28, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, 36, 74, 0),
	(313, 14, 'gerson mayen', 'medio_central', 8, NULL, 26, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, 60, 46, 0),
	(314, 14, 'vinicio muñoz', 'medio_central', 10, NULL, 25, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, NULL, NULL, 0),
	(315, 14, 'blas lizama', 'medio_central', 7, NULL, 27, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, 40, 46, 0),
	(316, 14, 'jonathan pérez', 'medio_central', 11, NULL, 24, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, NULL, NULL, 0),
	(317, 14, 'matías mier', 'medio_central', 14, NULL, 26, 'uruguayo', '2026-04-21 17:53:16', NULL, NULL, NULL, NULL, 0),
	(318, 14, 'melvin alfaro', 'medio_central', 19, NULL, 25, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, NULL, NULL, 0),
	(319, 14, 'josé zaldaña', 'centrodelantero', 9, NULL, 26, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, 18, 48, 0),
	(320, 14, 'josé cabañas', 'centrodelantero', 18, NULL, 24, 'salvadore?o', '2026-04-21 17:53:16', NULL, NULL, 82, 48, 0),
	(321, 14, 'josué dubón', 'centrodelantero', 21, NULL, 22, 'hondure?o', '2026-04-21 17:53:16', NULL, NULL, 36, 22, 0),
	(322, 9, 'óscar pleitez', 'portero', 1, NULL, 30, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, 50, 90, 0),
	(323, 9, 'cristofer maldonado', 'portero', 12, NULL, 24, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(324, 9, 'roberto carlos dominguez', 'central', 4, NULL, 28, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, 12, 70, 0),
	(325, 9, 'nicolás gómez', 'central', 3, NULL, 25, 'argentino', '2026-04-21 17:54:23', NULL, NULL, 64, 74, 0),
	(326, 9, 'giovanni ávila', 'central', 5, NULL, 27, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, 88, 70, 0),
	(327, 9, 'kevin vidal', 'central', 6, NULL, 24, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(328, 9, 'milton molina', 'central', 2, NULL, 29, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, 36, 74, 0),
	(329, 9, 'raúl cruz', 'central', 15, NULL, 26, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(330, 9, 'hugo aguilar', 'central', 17, NULL, 28, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(331, 9, 'melvin cartagena', 'medio_central', 8, NULL, 26, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, 60, 46, 0),
	(332, 9, 'gustavo machado', 'medio_central', 10, NULL, 27, 'venezolano', '2026-04-21 17:54:23', NULL, NULL, 18, 48, 0),
	(333, 9, 'elvin alvarado', 'medio_central', 7, NULL, 25, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, 40, 46, 0),
	(334, 9, 'marvin monterroza', 'medio_central', 11, NULL, 24, 'colombiano', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(335, 9, 'julio amaya', 'medio_central', 14, NULL, 28, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(336, 9, 'carlos anzora', 'medio_central', 19, NULL, 23, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(337, 9, 'emiliano villar', 'centrodelantero', 9, NULL, 27, 'argentino', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(338, 9, 'steven guerra', 'centrodelantero', 18, NULL, 26, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, 82, 48, 0),
	(339, 9, 'kevin reyes', 'centrodelantero', 21, NULL, 23, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, 36, 22, 0),
	(340, 9, 'jhonatan urrutia', 'centrodelantero', 22, NULL, 25, 'colombiano', '2026-04-21 17:54:23', NULL, NULL, 64, 22, 0),
	(341, 9, 'jesús zúñiga', 'centrodelantero', 25, NULL, 22, 'salvadore?o', '2026-04-21 17:54:23', NULL, NULL, NULL, NULL, 0),
	(342, 12, 'josué funes', 'portero', 1, NULL, 27, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 1),
	(343, 12, 'melvin cruz', 'central', 4, NULL, 28, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 12, 70, 1),
	(344, 12, 'alexander rodríguez', 'central', 3, NULL, 26, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 64, 74, 1),
	(345, 12, 'walter guevara', 'central', 5, NULL, 29, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 88, 70, 1),
	(346, 12, 'juan benítez', 'central', 6, NULL, 25, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 50, 90, 1),
	(347, 12, 'kevin oviedo', 'central', 2, NULL, 24, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 36, 74, 1),
	(348, 12, 'giuviny esquivel', 'central', 15, NULL, 23, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 0),
	(349, 12, 'emerson mancía', 'central', 17, NULL, 22, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 0),
	(350, 12, 'robin borjas', 'medio_central', 8, NULL, 26, 'hondure?o', '2026-04-21 19:19:57', NULL, NULL, 60, 46, 1),
	(351, 12, 'michael rodríguez quiñonez', 'medio_central', 10, NULL, 27, 'nicarag?ense', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 1),
	(352, 12, 'edwin Sánchez', 'medio_central', 7, NULL, 25, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 40, 46, 1),
	(353, 12, 'wilson rugama', 'medio_central', 11, NULL, 24, 'nicarag?ense', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 0),
	(354, 12, 'fernando clavel', 'medio_central', 14, NULL, 28, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 1),
	(355, 12, 'rené granados', 'medio_central', 19, NULL, 26, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 0),
	(356, 12, 'wálter chigüila', 'medio_central', 20, NULL, 27, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 0),
	(357, 12, 'víctor torres', 'medio_central', 21, NULL, 23, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 0),
	(358, 12, 'joshua gallardo', 'centrodelantero', 9, NULL, 26, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 82, 48, 1),
	(359, 12, 'dany cetré', 'centrodelantero', 18, NULL, 25, 'colombiano', '2026-04-21 19:19:57', NULL, NULL, 36, 22, 0),
	(360, 12, 'enrique rivas', 'centrodelantero', 22, NULL, 24, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 64, 22, 0),
	(361, 12, 'carlos martínez', 'centrodelantero', 25, NULL, 23, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, NULL, NULL, 0),
	(362, 12, 'jonathan hernández', 'centrodelantero', NULL, NULL, 22, 'salvadore?o', '2026-04-21 19:19:57', NULL, NULL, 18, 48, 0),
	(363, 10, 'marlon joya', 'portero', 1, NULL, 27, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(364, 10, 'cristian bonilla', 'portero', 12, NULL, 23, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 0),
	(365, 10, 'jeremy rodríguez', 'portero', 22, NULL, 20, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 0),
	(366, 10, 'guillermo fuentes', 'central', 4, NULL, 27, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(367, 10, 'anderson portillo', 'central', 3, NULL, 25, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(368, 10, 'jonathan quintanilla', 'central', 5, NULL, 28, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(369, 10, 'ronald padilla', 'central', 6, NULL, 26, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(370, 10, 'francisco carballo', 'central', 2, NULL, 29, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(371, 10, 'reinaldo aparicio', 'central', 15, NULL, 24, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 0),
	(372, 10, 'daniel marquez', 'central', 17, NULL, 23, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 0),
	(373, 10, 'daniel arévalo', 'medio_central', 8, NULL, 25, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(374, 10, 'elias umeres', 'medio_central', 10, NULL, 27, 'peruano', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(375, 10, 'luis hinestroza', 'medio_central', 7, NULL, 26, 'colombiano', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(376, 10, 'herbert sosa', 'medio_central', 11, NULL, 24, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 0),
	(377, 10, 'kevin garay', 'medio_central', 14, NULL, 23, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 0),
	(378, 10, 'oscar cerén', 'centrodelantero', 9, NULL, 26, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(379, 10, 'alesson', 'centrodelantero', 18, NULL, 24, 'brasile?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 1),
	(380, 10, 'paolo ulloa', 'centrodelantero', 21, NULL, 22, 'salvadore?o', '2026-04-21 19:21:15', NULL, NULL, NULL, NULL, 0);

-- Volcando estructura para tabla numeros-y-futbol.jugadores_segunda
CREATE TABLE IF NOT EXISTS `jugadores_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(30) NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `es_titular` tinyint(1) DEFAULT '0',
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pj` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `goles_penal` int DEFAULT '0',
  `goles_cabeza` int DEFAULT '0',
  `goles_tiro_libre` int DEFAULT '0',
  `tarjetas_amarillas` int DEFAULT '0',
  `tarjetas_rojas` int DEFAULT '0',
  `minutos_jugados` int DEFAULT '0',
  `goles_recibidos` int DEFAULT '0',
  `vaya_invicta` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_jugador_equipo` (`equipo_id`),
  CONSTRAINT `jugadores_segunda_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos_segunda` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.jugadores_segunda: ~12 rows (aproximadamente)
INSERT INTO `jugadores_segunda` (`id`, `equipo_id`, `nombre`, `posicion`, `numero_camiseta`, `foto`, `edad`, `nacionalidad`, `fecha_creacion`, `es_titular`, `posicion_x`, `posicion_y`, `pj`, `goles`, `asistencias`, `goles_penal`, `goles_cabeza`, `goles_tiro_libre`, `tarjetas_amarillas`, `tarjetas_rojas`, `minutos_jugados`, `goles_recibidos`, `vaya_invicta`) VALUES
	(1, 7, 'esemaje', 'central', 34, 'uploads/jugadores_segunda/1775967215_ba8a0ca9.png', 23, '223223', '2026-04-12 04:13:46', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(2, 7, 'eseotromaje', 'lateral_derecho', 14, 'uploads/jugadores_segunda/1775967235_ab9a59cd.png', 34, '13232123', '2026-04-12 04:14:17', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(3, 7, 'Neuer', 'portero', 1, NULL, 20, 'Aleman', '2026-04-18 17:58:00', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(4, 7, 'Lateral I', 'lateral_izquierdo', 2, NULL, 30, NULL, '2026-04-18 17:58:17', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(5, 7, 'OTRO DF', 'central', 5, NULL, NULL, NULL, '2026-04-18 17:58:47', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(6, 7, 'MCD', 'medio_defensivo', 5, NULL, 20, NULL, '2026-04-18 17:59:11', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(7, 7, 'MC', 'medio_central', 56, NULL, 20, NULL, '2026-04-18 17:59:49', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(8, 7, 'MCO', 'medio_ofensivo', 7, NULL, 30, NULL, '2026-04-18 18:00:15', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(9, 7, 'dsds', 'centrodelantero', 44, NULL, 45, NULL, '2026-04-18 18:01:09', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(10, 7, 'SD', 'segundo_delantero', 9, NULL, 44, NULL, '2026-04-18 18:01:28', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(11, 7, 'extremo i', 'extremo_izquierdo', 21, NULL, 22, NULL, '2026-04-18 18:02:16', 1, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
	(12, 7, 'EXT DER', 'extremo_derecho', 65, NULL, 21, NULL, '2026-04-18 18:03:07', 0, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Volcando estructura para tabla numeros-y-futbol.jugadores_seleccion
CREATE TABLE IF NOT EXISTS `jugadores_seleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(50) DEFAULT NULL,
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atajadas` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.jugadores_seleccion: ~28 rows (aproximadamente)
INSERT INTO `jugadores_seleccion` (`id`, `nombre`, `posicion`, `numero_camiseta`, `foto`, `edad`, `nacionalidad`, `club_origen`, `partidos_jugados`, `goles`, `asistencias`, `created_at`, `atajadas`) VALUES
	(1, 'Mario González', 'portero', 1, NULL, 29, 'Salvadoreña', 'Deportivo San Carlos', 11, 0, 0, '2026-06-10 02:30:54', 0),
	(2, 'Benji Villalobos', 'portero', 12, NULL, 26, 'Salvadoreña', 'C.D. Águila', 7, 0, 0, '2026-06-10 02:30:54', 0),
	(3, 'Tomás Romero', 'portero', 22, NULL, 26, 'Salvadoreña', 'Minnesota United FC', 5, 0, 0, '2026-06-10 02:30:54', 0),
	(4, 'Henry Romero', 'central', 3, NULL, 28, 'Salvadoreña', 'Alianza FC', 8, 0, 0, '2026-06-10 02:30:54', 0),
	(5, 'Julio Sibrián', 'central', 4, NULL, 27, 'Salvadoreña', 'C.D. Águila', 10, 0, 0, '2026-06-10 02:30:54', 0),
	(6, 'Rudy Clavel', 'central', 5, NULL, 25, 'Salvadoreña', 'C.D. FAS', 10, 0, 1, '2026-06-10 02:30:54', 0),
	(7, 'Jorge Cruz', 'lateral_derecho', 2, NULL, 26, 'Salvadoreña', 'C.D. FAS', 9, 0, 0, '2026-06-10 02:30:54', 0),
	(8, 'Bryan Tamacas', 'lateral_derecho', 13, NULL, 31, 'Salvadoreña', 'Hércules CF', 8, 0, 0, '2026-06-10 02:30:54', 0),
	(9, 'Alexander Larín', 'lateral_izquierdo', 6, NULL, 26, 'Salvadoreña', 'Alianza FC', 10, 0, 1, '2026-06-10 02:30:54', 0),
	(10, 'Adán Clímaco', 'lateral_izquierdo', 23, NULL, 24, 'Salvadoreña', 'C.D. Águila', 6, 0, 0, '2026-06-10 02:30:54', 0),
	(11, 'Roberto Domínguez', 'central', 15, NULL, 29, 'Salvadoreña', 'C.D. FAS', 6, 0, 0, '2026-06-10 02:30:54', 0),
	(12, 'Nelson Rodríguez', 'lateral_derecho', 16, NULL, 23, 'Salvadoreña', 'C.D. Águila', 5, 0, 0, '2026-06-10 02:30:54', 0),
	(13, 'Darwin Cerén', 'medio_central', 7, NULL, 33, 'Salvadoreña', 'C.D. Águila', 11, 0, 0, '2026-06-10 02:30:54', 0),
	(14, 'Brayan Landaverde', 'medio_central', 8, NULL, 26, 'Salvadoreña', 'L.A. Firpo', 10, 0, 0, '2026-06-10 02:30:54', 0),
	(15, 'Christian Martínez', 'medio_defensivo', 14, NULL, 25, 'Salvadoreña', 'Alianza FC', 9, 0, 0, '2026-06-10 02:30:54', 0),
	(16, 'Jefferson Valladares', 'medio_central', 15, NULL, 22, 'Salvadoreña', 'C.D. Mpal. Limeño', 7, 0, 0, '2026-06-10 02:30:54', 0),
	(17, 'Jairo Henríquez', 'medio_ofensivo', 17, NULL, 24, 'Salvadoreña', 'L.A. Firpo', 9, 1, 0, '2026-06-10 02:30:54', 0),
	(18, 'Marcelo Díaz', 'medio_central', 12, NULL, 23, 'Salvadoreña', 'C.D. Águila', 7, 0, 0, '2026-06-10 02:30:54', 0),
	(19, 'Mauricio Cerritos', 'medio_central', 20, NULL, 22, 'Salvadoreña', 'L.A. Firpo', 5, 0, 0, '2026-06-10 02:30:54', 0),
	(20, 'Harold Osorio', 'medio_ofensivo', 19, NULL, 25, 'Salvadoreña', 'Alianza FC', 8, 1, 0, '2026-06-10 02:30:54', 0),
	(21, 'Elmer Bonilla', 'medio_central', 21, NULL, 23, 'Salvadoreña', 'C.D. FAS', 4, 0, 0, '2026-06-10 02:30:54', 0),
	(22, 'Joshua Pérez', 'extremo_derecho', 10, NULL, 28, 'Salvadoreña', 'Houston Dynamo', 9, 0, 0, '2026-06-10 02:30:54', 0),
	(23, 'Nathan Ordaz', 'extremo_izquierdo', 11, NULL, 22, 'Salvadoreña', 'FC Dallas', 8, 0, 3, '2026-06-10 02:30:54', 0),
	(24, 'Brayan Gil', 'extremo_derecho', 9, NULL, 27, 'Salvadoreña', 'Portland Timbers', 9, 2, 0, '2026-06-10 02:30:54', 0),
	(25, 'Styven Vásquez', 'extremo_izquierdo', 18, NULL, 26, 'Salvadoreña', 'Alianza FC', 7, 0, 0, '2026-06-10 02:30:54', 0),
	(26, 'Emerson Mauricio', 'centrodelantero', 24, NULL, 27, 'Salvadoreña', 'C.D. Águila', 6, 0, 0, '2026-06-10 02:30:54', 0),
	(27, 'Rafael Tejada', 'centrodelantero', 25, NULL, 24, 'Salvadoreña', 'L.A. Firpo', 5, 0, 0, '2026-06-10 02:30:54', 0),
	(28, 'Francis Castillo', 'segundo_delantero', 26, NULL, 24, 'Salvadoreña', 'Columbus Crew', 7, 0, 1, '2026-06-10 02:30:54', 0);

-- Volcando estructura para tabla numeros-y-futbol.jugadores_tercera
CREATE TABLE IF NOT EXISTS `jugadores_tercera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(30) NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `es_titular` tinyint(1) DEFAULT '0',
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_jugador_equipo_ter` (`equipo_id`),
  CONSTRAINT `jugadores_tercera_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos_tercera` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.jugadores_tercera: ~0 rows (aproximadamente)

-- Volcando estructura para tabla numeros-y-futbol.match_comments
CREATE TABLE IF NOT EXISTS `match_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `partido_id` int NOT NULL,
  `division` varchar(20) NOT NULL DEFAULT 'primera',
  `minuto` int NOT NULL DEFAULT '0',
  `tipo` enum('gol','gol_penal','gol_cabeza','gol_tiro_libre','asistencia','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','descanso','fin','penal') NOT NULL DEFAULT 'comentario',
  `descripcion` text NOT NULL,
  `equipo` varchar(150) DEFAULT NULL,
  `jugador_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_partido` (`partido_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.match_comments: ~22 rows (aproximadamente)
INSERT INTO `match_comments` (`id`, `partido_id`, `division`, `minuto`, `tipo`, `descripcion`, `equipo`, `jugador_id`, `created_at`) VALUES
	(9, 74, 'primera', 1, 'gol', '⚽ ¡GOOOOOL! Cristopher Rauda marca para Alianza F.C. en el minuto 1.', 'Alianza F.C.', 124, '2026-05-28 04:34:00'),
	(10, 74, 'primera', 1, 'asistencia', '👟 Asistencia de Jugador para el gol de Alianza F.C..', 'Alianza F.C.', NULL, '2026-05-28 04:34:04'),
	(11, 74, 'primera', 14, 'tarjeta_amarilla', '🟨 Tarjeta amarilla para Christopher Guardado de Alianza F.C.. Minuto 14.', 'Alianza F.C.', 139, '2026-05-28 04:47:34'),
	(12, 74, 'primera', 15, 'gol_penal', '🎯 ¡Gol de PENAL! William Canales convierte desde el punto de penalti. Minuto 15.', 'Alianza F.C.', 131, '2026-05-28 04:47:58'),
	(13, 74, 'primera', 90, 'fin', '🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 2 - 0 C.D. FAS.', 'Alianza F.C.', NULL, '2026-05-28 04:48:06'),
	(14, 76, 'primera', 90, 'fin', '🏁 ¡Pitido final! Resultado definitivo: C.D. Municipal Limeño 0 - 0 C.D. Águila.', 'C.D. Municipal Limeño', NULL, '2026-06-08 15:39:57'),
	(16, 77, 'primera', 15, 'gol', '⚽ ¡GOOOOOL! Oscar Rodr?guez marca para Alianza F.C. en el minuto 15.', 'Alianza F.C.', 138, '2026-06-08 15:42:14'),
	(17, 77, 'primera', 45, 'descanso', '☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.', 'Alianza F.C.', NULL, '2026-06-08 15:42:29'),
	(18, 77, 'primera', 0, 'inicio', '▶️ ¡Arranca el partido! Segunda parte en juego.', 'Alianza F.C.', NULL, '2026-06-08 15:43:03'),
	(19, 77, 'primera', 45, 'comentario', 'Inicio de la segunda parte', 'Alianza F.C.', NULL, '2026-06-08 15:43:21'),
	(20, 77, 'primera', 65, 'gol_cabeza', '🤕 ¡Gol de CABEZA! William Canales conecta de manera impresionante. Minuto 0.', 'Alianza F.C.', 131, '2026-06-08 15:43:46'),
	(21, 77, 'primera', 89, 'fin', '🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 2 - 0 Inter TECLA.', 'Alianza F.C.', NULL, '2026-06-08 15:43:52'),
	(22, 78, 'primera', 0, 'inicio', '▶️ ¡Arranca el partido! Primera parte en juego.', '', NULL, '2026-06-08 16:11:26'),
	(23, 78, 'primera', 9, 'cambio', '🔄 Cambio en C.D. FAS: Sale Kevin Carabantes, entra Jonathan Nolasco. Minuto 9.', 'C.D. FAS', 230, '2026-06-08 16:21:19'),
	(24, 78, 'primera', 140, 'descanso', '☕ Pitido final de la primera mitad. Descanso con el marcador 0-0.', '', NULL, '2026-06-08 18:31:34'),
	(25, 78, 'primera', 45, 'inicio', '▶️ ¡Empieza la segunda parte!', '', NULL, '2026-06-08 20:13:24'),
	(26, 78, 'primera', 138, 'cambio', '🔄 Cambio en C.D. FAS: Sale Jonathan Valle, entra Kevin Carabantes. Minuto 138.', 'C.D. FAS', 216, '2026-06-08 21:46:28'),
	(27, 78, 'primera', 153, 'tarjeta_amarilla', '🟨 Tarjeta amarilla para Brayan Landaverde de L.A. Firpo. Minuto 153.', 'L.A. Firpo', 109, '2026-06-08 22:02:19'),
	(28, 78, 'primera', 154, 'tarjeta_roja', '🟥 ¡Tarjeta ROJA! Brayan Landaverde queda expulsado. Minuto 154.', 'L.A. Firpo', 109, '2026-06-08 22:02:48'),
	(29, 78, 'primera', 154, 'cambio', '🔄 Cambio en L.A. Firpo: Sale Lucas R?, entra Marvin Aranda. Minuto 154.', 'L.A. Firpo', 117, '2026-06-08 22:03:21'),
	(30, 78, 'primera', 182, 'cambio', '🔄 Cambio en L.A. Firpo: Sale Wilberth Hernández, entra Misael Erazo. Minuto 182. [SALE:98]', 'L.A. Firpo', 99, '2026-06-08 22:30:29'),
	(31, 78, 'primera', 204, 'fin', '🏁 ¡Pitido final! Resultado definitivo: C.D. FAS 0 - 0 L.A. Firpo.', 'C.D. FAS', NULL, '2026-06-08 22:53:23');

-- Volcando estructura para tabla numeros-y-futbol.noticias
CREATE TABLE IF NOT EXISTS `noticias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `contenido` text,
  `categoria` varchar(100) DEFAULT NULL,
  `autor` varchar(100) DEFAULT NULL,
  `media` text,
  `estado` enum('Publicado','Borrador') DEFAULT 'Publicado',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.noticias: ~6 rows (aproximadamente)
INSERT INTO `noticias` (`id`, `titulo`, `contenido`, `categoria`, `autor`, `media`, `estado`, `fecha`, `imagen`) VALUES
	(1, 'El Salvador pierde 2-0 Contra honduras', 'Triste derrota para El Salvador', 'Selecci?n', 'Jose Felix Sinto Masin', NULL, 'Publicado', '2026-04-02 08:08:50', 'http://numeros-y-futbol.test/backend/uploads/69ce2412160eb.jpg'),
	(3, '?guila impone su jerarqu?a y vence 3-1 a Cacahuatique', 'En una tarde donde la diferencia de calidad fue evidente, CD ?guila se qued? con una victoria contundente 3-1 sobre CD Cacahuatique.\n\nDesde los primeros minutos, ?guila mostr? intensidad y control del bal?n, dominando el ritmo del partido y generando peligro constante en el ?rea rival. La apertura del marcador lleg? tras una jugada bien construida, reflejando la superioridad ofensiva de los locales.\n\nCacahuatique intent? reaccionar y logr? descontar, metiendo algo de presi?n en el encuentro, pero la respuesta de ?guila fue inmediata. Con orden t?ctico y efectividad frente al arco, los emplumados ampliaron la ventaja y sentenciaron el partido sin mayores complicaciones.\n\nEl pitazo final confirm? una victoria s?lida que reafirma el buen momento de ?guila, mientras que Cacahuatique deber? ajustar en defensa si quiere competir en las pr?ximas jornadas.', 'Liga Mayor', 'Jose Felix Sinto Masin', NULL, 'Publicado', '2026-04-03 19:12:32', 'http://numeros-y-futbol.test/backend/uploads/69d0112080e10.jpg'),
	(5, 'Alianza impone su jerarqu?a con goleada 5-2 sobre LA Firpo', 'Alianza FC firm? una actuaci?n contundente y ofensivamente eficaz al superar 5-2 a LA Firpo, consolidando su dominio en el encuentro desde los primeros compases. El conjunto capitalino mostr? superioridad en la circulaci?n de bal?n, aprovechamiento de espacios y definici?n en el ?ltimo tercio, aspectos que marcaron la diferencia en el marcador.\n\nPor su parte, Firpo logr? generar ocasiones y anotar en dos oportunidades, pero evidenci? fragilidad defensiva y dificultades para contener las transiciones r?pidas del rival. El resultado refleja no solo la efectividad de Alianza, sino tambi?n su capacidad para gestionar el ritmo del partido y capitalizar errores defensivos.\n\nCon este triunfo, Alianza reafirma su condici?n de candidato, mientras que Firpo deber? ajustar su estructura defensiva si pretende competir con mayor solidez en pr?ximos compromisos.', 'Liga Mayor', 'Jose Felix Sinto Masin', NULL, 'Publicado', '2026-04-07 12:15:46', 'http://numeros-y-futbol.test/backend/uploads/69d4f572a9e5f.jpg'),
	(6, 'Zacatecoluca se impone por la m?nima ante Platense en un duelo cerrado', 'Zacatecoluca logr? una victoria ajustada de 1-0 frente a Platense en un encuentro caracterizado por la paridad t?ctica y la intensidad en el mediocampo. El ?nico gol del compromiso lleg? como resultado de una acci?n bien estructurada, en la que el equipo local supo capitalizar una de las pocas oportunidades claras generadas.\n\nA lo largo del partido, Platense intent? reaccionar mediante transiciones r?pidas y juego por bandas, pero se encontr? con una defensa bien organizada que neutraliz? sus avances. Zacatecoluca, por su parte, mostr? orden defensivo y disciplina t?ctica para sostener la ventaja.\n\nEl resultado refleja un partido equilibrado, donde la eficacia y la solidez defensiva fueron determinantes. Zacatecoluca suma tres puntos importantes, mientras Platense deber? mejorar su contundencia en ataque para futuros compromisos.', 'Liga Mayor', 'Jose Felix Sinto Masin', NULL, 'Publicado', '2026-04-07 12:18:28', 'http://numeros-y-futbol.test/backend/uploads/69d4f61479054.jpg'),
	(7, 'Firpo resumen', 'Text', 'Liga Mayor', 'Jose Felix Sinto Masin', NULL, 'Publicado', '2026-04-07 16:26:56', 'http://numeros-y-futbol.test/backend/uploads/69d53050461a7.mp4'),
	(9, 'FAS y Alianza se enfrentan en duelo decisivo', 'El f?tbol salvadore?o vive una de sus noches m?s intensas con el enfrentamiento entre C.D. FAS y Alianza F.C., dos de los equipos m?s hist?ricos y competitivos del pa?s. El partido, marcado por un ambiente electrizante en las gradas, re?ne a miles de aficionados que convierten el estadio en un aut?ntico espect?culo.\n\nAmbos conjuntos llegan con altas expectativas, buscando no solo los tres puntos, sino tambi?n el orgullo de imponerse en el cl?sico nacional. FAS apuesta por su tradici?n y garra, mientras que Alianza intenta imponer su estilo din?mico y ofensivo.\n\nDesde el inicio, el encuentro promete intensidad, con jugadas r?pidas, presi?n constante y una rivalidad que trasciende generaciones. Este tipo de partidos no solo define posiciones en la tabla, sino que tambi?n fortalece la identidad y pasi?n del f?tbol salvadore?o.\n\nSin duda, este duelo entre FAS y Alianza reafirma por qu? es considerado uno de los enfrentamientos m?s importantes del pa?s, dejando emociones, pol?micas y momentos memorables dentro y fuera del campo.', 'Liga Mayor', 'Jose Felix Sinto Masin', NULL, 'Publicado', '2026-04-17 20:06:28', 'http://numeros-y-futbol.test/backend/uploads/69e292c46f5d6.jpg');

-- Volcando estructura para tabla numeros-y-futbol.partidos
CREATE TABLE IF NOT EXISTS `partidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_local` int DEFAULT NULL,
  `equipo_visitante` int DEFAULT NULL,
  `goles_local` int DEFAULT '0',
  `goles_visitante` int DEFAULT '0',
  `jugado` tinyint(1) DEFAULT '0',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.partidos: ~4 rows (aproximadamente)
INSERT INTO `partidos` (`id`, `equipo_local`, `equipo_visitante`, `goles_local`, `goles_visitante`, `jugado`, `fecha`, `estado`, `featured`) VALUES
	(74, 5, 15, 2, 0, 0, '2026-05-25 05:19:35', 'Finalizado', 0),
	(76, 7, 6, 0, 0, 0, '2026-05-28 04:36:32', 'Finalizado', 0),
	(77, 5, 8, 2, 0, 0, '2026-06-08 15:41:12', 'Finalizado', 0),
	(78, 15, 4, 0, 0, 0, '2026-06-08 16:11:16', 'Finalizado', 0);

-- Volcando estructura para tabla numeros-y-futbol.partidos_copa
CREATE TABLE IF NOT EXISTS `partidos_copa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_local_id` int NOT NULL COMMENT 'ID en equipos_copa',
  `equipo_visitante_id` int NOT NULL COMMENT 'ID en equipos_copa',
  `goles_local` int DEFAULT NULL,
  `goles_visitante` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` enum('Pendiente','En Curso','Finalizado') DEFAULT 'Pendiente',
  `fase` enum('grupos','octavos','cuartos','semis','final') DEFAULT 'grupos',
  `llave` int DEFAULT NULL,
  `grupo_copa` char(1) DEFAULT NULL COMMENT 'Solo fase grupos: A-F',
  `jornada` varchar(10) DEFAULT NULL COMMENT 'ida/vuelta',
  `penales_local` int DEFAULT NULL,
  `penales_visitante` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fase` (`fase`),
  KEY `idx_grupo` (`grupo_copa`),
  KEY `idx_estado` (`estado`),
  KEY `fk_copa_local` (`equipo_local_id`),
  KEY `fk_copa_visitante` (`equipo_visitante_id`),
  CONSTRAINT `fk_copa_local` FOREIGN KEY (`equipo_local_id`) REFERENCES `equipos_copa` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_copa_visitante` FOREIGN KEY (`equipo_visitante_id`) REFERENCES `equipos_copa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=417 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.partidos_copa: ~0 rows (aproximadamente)

-- Volcando estructura para tabla numeros-y-futbol.partidos_segunda
CREATE TABLE IF NOT EXISTS `partidos_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int NOT NULL,
  `visitante_id` int NOT NULL,
  `goles_local` int DEFAULT NULL,
  `goles_visitante` int DEFAULT NULL,
  `fecha` date DEFAULT (curdate()),
  `status` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `local_id` (`local_id`),
  KEY `visitante_id` (`visitante_id`),
  CONSTRAINT `partidos_segunda_ibfk_1` FOREIGN KEY (`local_id`) REFERENCES `equipos_segunda` (`id`) ON DELETE CASCADE,
  CONSTRAINT `partidos_segunda_ibfk_2` FOREIGN KEY (`visitante_id`) REFERENCES `equipos_segunda` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.partidos_segunda: ~2 rows (aproximadamente)
INSERT INTO `partidos_segunda` (`id`, `local_id`, `visitante_id`, `goles_local`, `goles_visitante`, `fecha`, `status`, `featured`) VALUES
	(16, 7, 5, NULL, NULL, '2026-04-17', 'En Curso', 0),
	(17, 10, 6, NULL, NULL, '2026-05-24', 'Pendiente', 0);

-- Volcando estructura para tabla numeros-y-futbol.partidos_seleccion
CREATE TABLE IF NOT EXISTS `partidos_seleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) NOT NULL,
  `rival_logo` varchar(255) DEFAULT NULL,
  `goles_favor` int DEFAULT NULL,
  `goles_contra` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente',
  `competicion` varchar(100) DEFAULT NULL,
  `lugar` varchar(50) DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.partidos_seleccion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla numeros-y-futbol.partidos_tercera
CREATE TABLE IF NOT EXISTS `partidos_tercera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int NOT NULL,
  `visitante_id` int NOT NULL,
  `goles_local` int DEFAULT NULL,
  `goles_visitante` int DEFAULT NULL,
  `fecha` date DEFAULT (curdate()),
  `status` varchar(20) DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `local_id` (`local_id`),
  KEY `visitante_id` (`visitante_id`),
  CONSTRAINT `partidos_tercera_ibfk_1` FOREIGN KEY (`local_id`) REFERENCES `equipos_tercera` (`id`) ON DELETE CASCADE,
  CONSTRAINT `partidos_tercera_ibfk_2` FOREIGN KEY (`visitante_id`) REFERENCES `equipos_tercera` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.partidos_tercera: ~1 rows (aproximadamente)
INSERT INTO `partidos_tercera` (`id`, `local_id`, `visitante_id`, `goles_local`, `goles_visitante`, `fecha`, `status`) VALUES
	(2, 12, 15, NULL, NULL, '2026-05-25', 'Pendiente');

-- Volcando estructura para tabla numeros-y-futbol.reset_tokens
CREATE TABLE IF NOT EXISTS `reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `token` varchar(64) NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expira_en` timestamp NOT NULL DEFAULT ((now() + interval 15 minute)),
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.reset_tokens: ~2 rows (aproximadamente)
INSERT INTO `reset_tokens` (`id`, `email`, `token`, `codigo`, `creado_en`, `expira_en`, `usado`) VALUES
	(25, 'vanesotomayor0411@gmail.com', 'b5f5e7b7ad927f88674acd84a4fb06c25f002a3f1d372972f02eb2ba4ee0234d', '768649', '2026-04-22 05:11:21', '2026-04-22 05:26:21', 0),
	(26, 'arielosotomayor0411@gmail.com', 'd4eed72b0cb0773d328b3f0bc4729d8a9c6d1e240a467b38ebca26cda6c602f5', '889402', '2026-05-06 21:29:23', '2026-05-06 21:44:23', 1);

-- Volcando estructura para tabla numeros-y-futbol.site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `key` varchar(100) NOT NULL,
  `value` text,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.site_settings: ~16 rows (aproximadamente)
INSERT INTO `site_settings` (`key`, `value`) VALUES
	('contact_email', ''),
	('facebook_url', ''),
	('hero_banner_url', 'https://z-cdn-media.chatglm.cn/files/5838caa0-1db5-471c-a0b7-615971e5c6a9.png?auth_key=1874475322-63d59502a9bd4eccb11f4451b8b598a8-0-73a0c525630ab96d6c6d289fa8ba3645'),
	('hero_btn1_label', 'Últimas Noticias'),
	('hero_btn1_link', '#noticias'),
	('hero_btn2_label', 'Ver Resultados'),
	('hero_btn2_link', '#divisiones'),
	('hero_description', 'Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño en vivo.'),
	('hero_title', 'Noticias y numeros que <span>genera el fútbol</span>'),
	('instagram_url', ''),
	('maintenance_mode', '1'),
	('maintenance_msg', 'Estamos trabajando para mejorar tu experiencia. Vuelve pronto.'),
	('site_description', 'Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño.'),
	('site_logo_url', ''),
	('site_name', 'Números y Fútbol'),
	('twitter_url', '');

-- Volcando estructura para tabla numeros-y-futbol.tabla_posiciones
CREATE TABLE IF NOT EXISTS `tabla_posiciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `partidos_jugados` int NOT NULL DEFAULT '0',
  `ganados` int NOT NULL DEFAULT '0',
  `empatados` int NOT NULL DEFAULT '0',
  `perdidos` int NOT NULL DEFAULT '0',
  `goles_favor` int NOT NULL DEFAULT '0',
  `goles_contra` int NOT NULL DEFAULT '0',
  `puntos` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_equipo_unico` (`equipo_id`),
  KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=543 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.tabla_posiciones: ~12 rows (aproximadamente)
INSERT INTO `tabla_posiciones` (`id`, `equipo_id`, `partidos_jugados`, `ganados`, `empatados`, `perdidos`, `goles_favor`, `goles_contra`, `puntos`) VALUES
	(14, 4, 2, 1, 0, 1, 1, 1, 3),
	(17, 5, 1, 1, 0, 0, 1, 0, 3),
	(18, 6, 0, 0, 0, 0, 0, 0, 0),
	(21, 7, 1, 0, 0, 1, 0, 1, 0),
	(22, 8, 0, 0, 0, 0, 0, 0, 0),
	(23, 9, 0, 0, 0, 0, 0, 0, 0),
	(61, 10, 0, 0, 0, 0, 0, 0, 0),
	(74, 11, 0, 0, 0, 0, 0, 0, 0),
	(75, 12, 0, 0, 0, 0, 0, 0, 0),
	(76, 13, 0, 0, 0, 0, 0, 0, 0),
	(77, 14, 0, 0, 0, 0, 0, 0, 0),
	(384, 15, 0, 0, 0, 0, 0, 0, 0);

-- Volcando estructura para tabla numeros-y-futbol.tabla_posiciones_segunda
CREATE TABLE IF NOT EXISTS `tabla_posiciones_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `pj` int DEFAULT '0',
  `pg` int DEFAULT '0',
  `pe` int DEFAULT '0',
  `pp` int DEFAULT '0',
  `gf` int DEFAULT '0',
  `gc` int DEFAULT '0',
  `dg` int DEFAULT '0',
  `pts` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`),
  CONSTRAINT `tabla_posiciones_segunda_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos_segunda` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.tabla_posiciones_segunda: ~14 rows (aproximadamente)
INSERT INTO `tabla_posiciones_segunda` (`id`, `equipo_id`, `pj`, `pg`, `pe`, `pp`, `gf`, `gc`, `dg`, `pts`) VALUES
	(4, 4, 0, 0, 0, 0, 0, 0, 0, 0),
	(5, 5, 0, 0, 0, 0, 0, 0, 0, 0),
	(6, 6, 0, 0, 0, 0, 0, 0, 0, 0),
	(7, 7, 0, 0, 0, 0, 0, 0, 0, 0),
	(8, 8, 0, 0, 0, 0, 0, 0, 0, 0),
	(9, 9, 0, 0, 0, 0, 0, 0, 0, 0),
	(10, 10, 0, 0, 0, 0, 0, 0, 0, 0),
	(11, 11, 0, 0, 0, 0, 0, 0, 0, 0),
	(12, 12, 0, 0, 0, 0, 0, 0, 0, 0),
	(13, 13, 0, 0, 0, 0, 0, 0, 0, 0),
	(14, 14, 0, 0, 0, 0, 0, 0, 0, 0),
	(15, 15, 0, 0, 0, 0, 0, 0, 0, 0),
	(16, 16, 0, 0, 0, 0, 0, 0, 0, 0),
	(17, 17, 0, 0, 0, 0, 0, 0, 0, 0);

-- Volcando estructura para tabla numeros-y-futbol.tabla_posiciones_tercera
CREATE TABLE IF NOT EXISTS `tabla_posiciones_tercera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `pj` int DEFAULT '0',
  `pg` int DEFAULT '0',
  `pe` int DEFAULT '0',
  `pp` int DEFAULT '0',
  `gf` int DEFAULT '0',
  `gc` int DEFAULT '0',
  `dg` int DEFAULT '0',
  `pts` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`),
  CONSTRAINT `tabla_posiciones_tercera_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos_tercera` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.tabla_posiciones_tercera: ~8 rows (aproximadamente)
INSERT INTO `tabla_posiciones_tercera` (`id`, `equipo_id`, `pj`, `pg`, `pe`, `pp`, `gf`, `gc`, `dg`, `pts`) VALUES
	(9, 9, 0, 0, 0, 0, 0, 0, 0, 0),
	(10, 10, 0, 0, 0, 0, 0, 0, 0, 0),
	(11, 11, 0, 0, 0, 0, 0, 0, 0, 0),
	(12, 12, 0, 0, 0, 0, 0, 0, 0, 0),
	(14, 14, 0, 0, 0, 0, 0, 0, 0, 0),
	(15, 15, 0, 0, 0, 0, 0, 0, 0, 0),
	(16, 16, 0, 0, 0, 0, 0, 0, 0, 0),
	(17, 17, 0, 0, 0, 0, 0, 0, 0, 0);

-- Volcando estructura para tabla numeros-y-futbol.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `apodo` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `idx_apodo` (`apodo`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla numeros-y-futbol.equipos_primera_femenina
DROP TABLE IF EXISTS `equipos_primera_femenina`;
CREATE TABLE IF NOT EXISTS `equipos_primera_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `formacion` varchar(10) DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla numeros-y-futbol.partidos_femenina
DROP TABLE IF EXISTS `partidos_femenina`;
CREATE TABLE IF NOT EXISTS `partidos_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_local` int DEFAULT NULL,
  `equipo_visitante` int DEFAULT NULL,
  `goles_local` int DEFAULT '0',
  `goles_visitante` int DEFAULT '0',
  `jugado` tinyint(1) DEFAULT '0',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla numeros-y-futbol.tabla_posiciones_femenina
DROP TABLE IF EXISTS `tabla_posiciones_femenina`;
CREATE TABLE IF NOT EXISTS `tabla_posiciones_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `partidos_jugados` int NOT NULL DEFAULT '0',
  `ganados` int NOT NULL DEFAULT '0',
  `empatados` int NOT NULL DEFAULT '0',
  `perdidos` int NOT NULL DEFAULT '0',
  `goles_favor` int NOT NULL DEFAULT '0',
  `goles_contra` int NOT NULL DEFAULT '0',
  `puntos` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla numeros-y-futbol.jugadores_femenina
DROP TABLE IF EXISTS `jugadores_femenina`;
CREATE TABLE IF NOT EXISTS `jugadores_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(30) NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla numeros-y-futbol.estadisticas_jugadores_femenina
DROP TABLE IF EXISTS `estadisticas_jugadores_femenina`;
CREATE TABLE IF NOT EXISTS `estadisticas_jugadores_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jugador_id` int NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `goles_cabeza` int DEFAULT '0',
  `goles_tiro_libre` int DEFAULT '0',
  `goles_penal` int DEFAULT '0',
  `tarjetas_amarillas` int DEFAULT '0',
  `tarjetas_rojas` int DEFAULT '0',
  `minutos_jugados` int DEFAULT '0',
  `goles_recibidos` int DEFAULT '0',
  `vaya_invicta` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `jugador_id` (`jugador_id`),
  KEY `goles` (`goles`),
  KEY `tarjetas_amarillas` (`tarjetas_amarillas`),
  KEY `tarjetas_rojas` (`tarjetas_rojas`),
  KEY `goles_recibidos` (`goles_recibidos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla numeros-y-futbol.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nombre`, `apodo`, `email`, `password`, `rol`) VALUES
	(9, 'Ariel', NULL, 'unmaje@gmail.com', '$2y$10$u7QxKMFb3dN2iT/fWCD5b.3bgl5lmRAya893EoHaItD3uWdl19Rue', 'admin'),
	(12, 'Ariel Soto', 'sirenoman', 'vanesotomayor0411@gmail.com', '$2y$10$G8nLBg96/DSykaQWI2fGzud7oha0.mj3wxdfTojNScxLcoWoeMWeS', 'usuario'),
	(13, 'Alejandro', 'megatomayor', 'arielosotomayor0411@gmail.com', '$2y$10$u.E3hJUD9o5jZF4LvMj2xOrRiZDgKBtXNtpOQAwImuRUkTls4/J82', 'usuario');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
