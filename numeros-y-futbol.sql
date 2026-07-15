-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: numeros-y-futbol
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_tokens`
--

DROP TABLE IF EXISTS `auth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(128) NOT NULL,
  `user_id` int NOT NULL,
  `user_role` varchar(20) NOT NULL DEFAULT 'usuario',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (1,'70e8d67ed075fb029ce5bf637fba5c7a0d77fc60b65d2516e5eda3021ccf7dfd',9,'admin','2026-05-28 04:33:27','2026-05-29 04:33:27'),(2,'3058831cabdecee49ae5e3f6b54ee2568e5d671913a384bd60450c21be5adfda',9,'admin','2026-05-28 05:15:10','2026-05-29 05:15:10'),(3,'cfa6878039209b991039bb5909640feb89a4999915fe33da61a69675a77f8eb9',9,'admin','2026-05-28 17:46:07','2026-05-29 17:46:07'),(4,'d7de29610f6d331eba9275a34e6cf9754a77acb84349de67ec9069d4f3ac760a',9,'admin','2026-06-05 22:13:23','2026-06-06 22:13:23'),(5,'58cfde98ef2a467304bfe6d80884d3ea01e0620a289ea82a2e8f2cb5d5924031',9,'admin','2026-06-05 22:14:29','2026-06-06 22:14:29'),(6,'c189fa91585b90f46f02c4fb0bae6122e8bf800c9809b3be2935ea84951c299a',9,'admin','2026-06-08 15:38:24','2026-06-09 15:38:24'),(7,'1c4b0289ba0b8725711ffd76cbc99598d439789f7d222054b73dfdd7924bf149',9,'admin','2026-06-08 15:39:41','2026-06-09 15:39:41'),(8,'4fef4d215b80af4630a3434c536d612269720708cfbcfaa6d498a55ea99050ce',9,'admin','2026-06-08 16:10:59','2026-06-09 16:10:59'),(9,'ee543bcc08be9736f726c142ec497c90333daff1d95246778ef9d4d139d0cad7',9,'admin','2026-06-09 04:38:38','2026-06-10 04:38:38'),(10,'fc121784cbf712b7ed5350e7bc6db9719c61aaad40dad8a60b3b2c5307c505b9',9,'admin','2026-06-09 04:38:53','2026-06-10 04:38:53'),(11,'2ec0083de43327887ea0f6afff158276d296e2d56f437ed437b677e615f3a1f7',9,'admin','2026-06-10 04:46:37','2026-06-11 04:46:37'),(12,'b05b7e9c2a1e90e2f2146745c4131f8625cd3de8134016a3d8cd6789cc4b049a',9,'admin','2026-06-10 04:46:47','2026-06-11 04:46:47'),(13,'4b3304f25946a2a23794728d25277339f74c725188be65d5d894f95d7f9049b6',9,'admin','2026-07-01 21:07:29','2026-07-02 21:07:29'),(14,'c5fbb086839739f24bc160ca798c16f2e71de623d32ce141262b79f8ad9a0533',9,'admin','2026-07-03 14:21:13','2026-07-04 14:21:13');
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuerpo_tecnico_seleccion`
--

DROP TABLE IF EXISTS `cuerpo_tecnico_seleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuerpo_tecnico_seleccion`
--

LOCK TABLES `cuerpo_tecnico_seleccion` WRITE;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuerpo_tecnico_seleccion_femenina`
--

DROP TABLE IF EXISTS `cuerpo_tecnico_seleccion_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuerpo_tecnico_seleccion_femenina`
--

LOCK TABLES `cuerpo_tecnico_seleccion_femenina` WRITE;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion_femenina` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos`
--

DROP TABLE IF EXISTS `equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `formacion` varchar(10) DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
INSERT INTO `equipos` VALUES (4,'L.A. Firpo','Usulután','Estadio Sergio Torres Rivera','uploads/1775237339_LAFIRPO.png','3-4-3'),(5,'Alianza F.C.','San Salvador',' Estadio Cuscatlán','uploads/1775237448_alianzafc.png','4-4-2'),(6,'C.D. Águila','San Miguel','Estadio Juan Francisco Barraza','uploads/1775237638_Aguila.png','4-4-2'),(7,'C.D. Municipal Limeño','Santa Rosa de Lima','Estadio Dr. Ramón Flores Berríos','uploads/escudos/equipo_7_1779945347.png','4-4-2'),(8,'Inter TECLA','Santa Tecla','Estadio Nacional Las Delicias','uploads/escudos/equipo_8_1782942322.png','4-4-2'),(9,'A.D. Isidro Metapán','Metapán','Estadio Jorge \"Calero\" Suárez','uploads/1775241152_metapan.png','4-4-2'),(10,'C.D. Cacahuatique','Ciudad Barrios','Estadio Municipal de Chapeltique','uploads/1775242518_cacahuatique.png','4-4-2'),(11,'C.D. Platense','Zacatecoluca','Antonio Toledo Valle','uploads/1775242938_platense.png','4-4-2'),(12,'C.D. Fuerte','San Francisco Gotera','Estadio Correcaminos','uploads/1775243154_morazan.png','4-4-2'),(13,'C.D. Hércules','San Salvador','Estadio Cuscatlán','uploads/1775243227_hercules.png','4-4-2'),(14,'Zacatecoluca F.C.','Zacatecoluca','Estadio Antonio Toledo Valle','uploads/1775243292_Zacatecoluca.jpg','4-4-2'),(15,'C.D. FAS','Santa Ana','Estadio Óscar Alberto Quiteño','uploads/1775580005_FAS.png','4-4-2');
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_copa`
--

DROP TABLE IF EXISTS `equipos_copa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_copa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL COMMENT 'ID del equipo en su tabla original',
  `division` enum('Primera','Segunda','Tercera') NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `grupo` char(1) DEFAULT NULL COMMENT 'A-F, asignado por el admin',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_equipo_division` (`equipo_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_copa`
--

LOCK TABLES `equipos_copa` WRITE;
/*!40000 ALTER TABLE `equipos_copa` DISABLE KEYS */;
INSERT INTO `equipos_copa` VALUES (95,4,'Primera','L.A. Firpo','uploads/1775237339_LAFIRPO.png',NULL,1),(96,5,'Primera','Alianza F.C.','uploads/1775237448_alianzafc.png',NULL,1),(97,6,'Primera','C.D. Águila','uploads/1775237638_Aguila.png',NULL,1),(98,7,'Primera','C.D. Municipal Limeño','uploads/1775240889_Limeño.png',NULL,1),(99,8,'Primera','Inter FA','uploads/1775240989_InterFA.webp',NULL,1),(100,9,'Primera','A.D. Isidro Metapán','uploads/1775241152_metapan.png',NULL,1),(101,10,'Primera','C.D. Cacahuatique','uploads/1775242518_cacahuatique.png',NULL,1),(102,11,'Primera','C.D. Platense','uploads/1775242938_platense.png',NULL,1),(103,12,'Primera','C.D. Fuerte','uploads/1775243154_morazan.png',NULL,1),(104,13,'Primera','C.D. Hércules','uploads/1775243227_hercules.png',NULL,1),(105,14,'Primera','Zacatecoluca F.C.','uploads/1775243292_Zacatecoluca.jpg',NULL,1),(106,15,'Primera','C.D. FAS','uploads/1775580005_FAS.png',NULL,1),(107,4,'Segunda','CD Fuerte Aguilares','uploads/1775366328_fuerte aguilares.webp',NULL,1),(108,5,'Segunda','C.D. Talleres Jr','uploads/1775366458_cd talleres.webp',NULL,1),(109,6,'Segunda','CD ADET-Aruba','uploads/1775366532_Aruba.webp',NULL,1),(110,7,'Segunda',' AD Batanecos','uploads/1775366637_Batanecos.png',NULL,1),(111,8,'Segunda','CD Inca','uploads/1775368426_C.D._Inca_Súper_Flat_logo.png',NULL,1),(112,9,'Segunda','A.D. Juventud Independiente','uploads/1775369629_juventud.png',NULL,1),(113,10,'Segunda','A.D. Espartano','uploads/1775369682_AD espartano.png',NULL,1),(114,11,'Segunda','Sensunte FC','uploads/1775370748_sensunte.webp',NULL,1),(115,12,'Segunda','C.D. Dragón','uploads/1775371713_dragon.png',NULL,1),(116,13,'Segunda','C.D. Atletico Balboa','uploads/1775381011_balboa.png',NULL,1),(117,14,'Segunda','C.D. Cruzeiro','uploads/1775381059_cruzeiro.png',NULL,1),(118,15,'Segunda','C.D. Olimpico Litoral','uploads/1775381230_litoral.png',NULL,1),(119,16,'Segunda','C.D. Pipil','uploads/1775381319_pipil.png',NULL,1),(120,17,'Segunda','C.D. Neo Pipil','uploads/1775381481_neopipil.jpg',NULL,1),(121,9,'Tercera','C.D. Estrellas Del Sur','uploads/1778806361_CD ESTRELLAS DEL SUR.png',NULL,1),(122,10,'Tercera','C.S.D Vendaval','uploads/1778807010_vendaval 2.png',NULL,1),(123,11,'Tercera','C.D. Buenos Aires','uploads/1778807163_buenos aires 2.png',NULL,1),(124,12,'Tercera',' Academia BP','uploads/1778807456_academia bp2.png',NULL,1),(125,14,'Tercera','A.D Izalco','uploads/1778808698_IZALCOs.png',NULL,1),(126,15,'Tercera','C.D. 11 Municipal','uploads/1778808985_C.D. 11 Municipal.png',NULL,1),(127,16,'Tercera','Brasil FC','uploads/1778809144_brasil fc.png',NULL,1),(128,17,'Tercera','C.D. El Vencedor','uploads/1778810314_CD EL VENCEDOT.png',NULL,1);
/*!40000 ALTER TABLE `equipos_copa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_primera_femenina`
--

DROP TABLE IF EXISTS `equipos_primera_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_primera_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `formacion` varchar(10) DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_primera_femenina`
--

LOCK TABLES `equipos_primera_femenina` WRITE;
/*!40000 ALTER TABLE `equipos_primera_femenina` DISABLE KEYS */;
INSERT INTO `equipos_primera_femenina` VALUES (1,'Alianza FC Women ','San Salvador','Estadio Cuscatlan ','uploads/1782941868_Alianza_women.jpg','4-4-2'),(2,'CD Águila Femenino','San Miguel','Estadio Juan Francisco Barraza','uploads/1782942606_aguila femenil.png','4-4-2');
/*!40000 ALTER TABLE `equipos_primera_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_segunda`
--

DROP TABLE IF EXISTS `equipos_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `grupo` varchar(10) NOT NULL DEFAULT 'West',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `formacion` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_segunda`
--

LOCK TABLES `equipos_segunda` WRITE;
/*!40000 ALTER TABLE `equipos_segunda` DISABLE KEYS */;
INSERT INTO `equipos_segunda` VALUES (4,'CD Fuerte Aguilares','San Salvador','Cancha Teófilo Siman','uploads/1775366328_fuerte aguilares.webp','East','2026-04-05 05:18:48','4-4-2'),(5,'C.D. Talleres Jr','Chalatenango','Estadio José Gregorio Martínez','uploads/1775366458_cd talleres.webp','East','2026-04-05 05:20:58',NULL),(6,'CD ADET-Aruba',' La Libertad',' Estadio Chilama','uploads/1775366532_Aruba.webp','East','2026-04-05 05:22:12',NULL),(7,' AD Batanecos','San Vicente','Cancha Juan Francisco Molina','uploads/1775366637_Batanecos.png','East','2026-04-05 05:23:57',NULL),(8,'CD Inca','Cantón Entre Ríos','Cancha San Isidro','uploads/1775368426_C.D._Inca_Súper_Flat_logo.png','East','2026-04-05 05:53:46',NULL),(9,'A.D. Juventud Independiente','San Juan Opico','Complejo Deportivo San Juan Opico','uploads/1775369629_juventud.png','East','2026-04-05 06:13:49',NULL),(10,'A.D. Espartano','San Julián','Polideportivo Helen Arias','uploads/1775369682_AD espartano.png','East','2026-04-05 06:14:42',NULL),(11,'Sensunte FC','Cabañas','Polideportivo Sensuntepeque','uploads/1775370748_sensunte.webp','West','2026-04-05 06:32:28',NULL),(12,'C.D. Dragón','San Miguel','Estadio Municipal de Quelepa','uploads/1775371713_dragon.png','West','2026-04-05 06:48:33',NULL),(13,'C.D. Atletico Balboa','La Unión','Estadio Marcelino Imbers','uploads/1775381011_balboa.png','West','2026-04-05 09:23:31',NULL),(14,'C.D. Cruzeiro','San Vicente','Estadio Jiboa','uploads/1775381059_cruzeiro.png','West','2026-04-05 09:24:19',NULL),(15,'C.D. Olimpico Litoral','Cerro de la Loma Larga','Complejo Deportivo Rafael López','uploads/1775381230_litoral.png','West','2026-04-05 09:27:10',NULL),(16,'C.D. Pipil','Morazán','Estadio Vicente Paul Fuentes','uploads/1775381319_pipil.png','West','2026-04-05 09:28:39',NULL),(17,'C.D. Neo Pipil','San Juan Nonualco','Estadio Neo Pipil','uploads/1775381481_neopipil.jpg','West','2026-04-05 09:31:21',NULL);
/*!40000 ALTER TABLE `equipos_segunda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_tercera`
--

DROP TABLE IF EXISTS `equipos_tercera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_tercera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `grupo` varchar(50) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `formacion` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_tercera`
--

LOCK TABLES `equipos_tercera` WRITE;
/*!40000 ALTER TABLE `equipos_tercera` DISABLE KEYS */;
INSERT INTO `equipos_tercera` VALUES
(1,'Municipal','Sonsonate',NULL,'Occidente A',NULL,'2026-07-05 00:00:00',NULL),
(2,'Buenos Aires FC','Morazán',NULL,'Occidente A',NULL,'2026-07-05 00:00:00',NULL),
(3,'UD Santos','La Libertad',NULL,'Occidente A',NULL,'2026-07-05 00:00:00',NULL),
(4,'La Hachadura','Sonsonate',NULL,'Occidente A',NULL,'2026-07-05 00:00:00',NULL),
(5,'AD Izalco','Sonsonate',NULL,'Occidente A',NULL,'2026-07-05 00:00:00',NULL),
(6,'11 Municipal','Ahuachapán',NULL,'Occidente A',NULL,'2026-07-05 00:00:00',NULL),
(7,'Juventud Candelareño','Santa Ana',NULL,'Occidente A',NULL,'2026-07-05 00:00:00',NULL),
(8,'Marte Soyapango','San Salvador',NULL,'Occidente B',NULL,'2026-07-05 00:00:00',NULL),
(9,'Academia BP','La Libertad',NULL,'Occidente B',NULL,'2026-07-05 00:00:00',NULL),
(10,'Tenancingo','Cuscatlán',NULL,'Occidente B',NULL,'2026-07-05 00:00:00',NULL),
(11,'Nacional Las Margaritas','La Libertad',NULL,'Occidente B',NULL,'2026-07-05 00:00:00',NULL),
(12,'Vendaval','San Salvador',NULL,'Occidente B',NULL,'2026-07-05 00:00:00',NULL),
(13,'Atlético Belén','San Salvador',NULL,'Occidente B',NULL,'2026-07-05 00:00:00',NULL),
(14,'Brasilia FC','Cuscatlán',NULL,'Occidente B',NULL,'2026-07-05 00:00:00',NULL),
(15,'Santo Tomás','Chalatenango',NULL,'Occidente B',NULL,'2026-07-05 00:00:00',NULL),
(16,'CD Audaz','San Vicente',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(17,'Nonualco FC','La Paz',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(18,'Atlético Verapaz','San Vicente',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(19,'San Marcos','Usulután',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(20,'FORFUT','Cabañas',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(21,'CD El Roble','Cabañas',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(22,'CD El Vencedor','Usulután',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(23,'SESSA','San Vicente',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(24,'San Rafael Obrajuelo','San Salvador',NULL,'Oriente A',NULL,'2026-07-05 00:00:00',NULL),
(25,'Sal Y Mar','La Unión',NULL,'Oriente B',NULL,'2026-07-05 00:00:00',NULL),
(26,'Brasil FC','San Miguel',NULL,'Oriente B',NULL,'2026-07-05 00:00:00',NULL),
(27,'Racing de Gualuca','San Miguel',NULL,'Oriente B',NULL,'2026-07-05 00:00:00',NULL),
(28,'Real Sociedad','Morazán',NULL,'Oriente B',NULL,'2026-07-05 00:00:00',NULL),
(29,'Estrellas del Sur','San Miguel',NULL,'Oriente B',NULL,'2026-07-05 00:00:00',NULL),
(30,'CD Buenos Aires','Morazán',NULL,'Oriente B',NULL,'2026-07-05 00:00:00',NULL),
(31,'Atlético San Simón','Morazán',NULL,'Oriente B',NULL,'2026-07-05 00:00:00',NULL),
(32,'Vista Hermosa','Morazán',NULL,'Oriente B',NULL,'2026-07-05 00:00:00',NULL);
/*!40000 ALTER TABLE `equipos_tercera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores`
--

DROP TABLE IF EXISTS `estadisticas_jugadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores` (
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
) ENGINE=InnoDB AUTO_INCREMENT=416 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores`
--

LOCK TABLES `estadisticas_jugadores` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores` VALUES (122,98,'2025-2026',20,0,0,0,0,0,1,0,1800,22,5),(123,99,'2025-2026',5,0,0,0,0,0,0,0,270,6,1),(124,100,'2025-2026',2,0,0,0,0,0,0,0,90,3,0),(125,101,'2025-2026',18,1,0,1,0,0,3,0,1550,0,0),(126,102,'2025-2026',17,2,1,1,0,0,4,1,1450,0,0),(127,103,'2025-2026',16,0,1,0,0,0,2,0,1350,0,0),(128,104,'2025-2026',15,2,0,2,0,0,3,0,1280,0,0),(129,105,'2025-2026',10,0,0,0,0,0,1,0,760,0,0),(130,106,'2025-2026',17,5,0,2,0,0,3,0,1450,0,0),(131,107,'2025-2026',8,0,0,0,0,0,1,0,520,0,0),(132,108,'2025-2026',19,6,3,0,0,0,4,0,1650,0,0),(133,109,'2025-2026',18,4,5,0,0,0,4,1,1530,0,0),(134,110,'2025-2026',17,6,2,0,0,0,2,0,1420,0,0),(135,111,'2025-2026',12,1,2,0,0,0,2,0,870,0,0),(136,112,'2025-2026',9,0,1,0,0,0,1,0,610,0,0),(137,113,'2025-2026',16,2,3,0,0,0,3,0,1320,0,0),(138,114,'2025-2026',11,1,1,0,0,0,2,0,780,0,0),(139,115,'2025-2026',7,0,0,0,0,0,1,0,430,0,0),(140,116,'2025-2026',6,0,1,0,0,0,0,0,310,0,0),(141,117,'2025-2026',8,0,0,0,0,0,1,0,450,0,0),(142,118,'2025-2026',18,5,2,1,0,1,2,0,1480,0,0),(143,119,'2025-2026',17,5,3,1,0,1,1,1,1380,0,0),(144,120,'2025-2026',19,6,4,0,0,2,2,0,1560,0,0),(145,121,'2025-2026',16,8,2,2,0,1,3,0,1300,0,0),(146,122,'2025-2026',10,2,1,0,0,0,1,0,650,0,0),(147,123,'2025-2026',19,0,0,0,0,0,1,0,1710,20,6),(148,124,'2025-2026',6,1,0,0,0,0,0,0,360,8,1),(149,125,'2025-2026',18,0,1,0,0,0,2,0,1550,0,0),(150,126,'2025-2026',17,1,0,1,0,0,3,0,1450,0,0),(151,127,'2025-2026',16,0,0,0,0,0,2,0,1350,0,0),(152,128,'2025-2026',15,0,1,0,0,0,1,0,1280,0,0),(153,129,'2025-2026',10,0,0,0,0,0,1,0,760,0,0),(154,130,'2025-2026',17,1,0,1,0,0,2,0,1450,0,0),(155,131,'2025-2026',9,2,0,1,0,1,1,0,620,0,0),(156,132,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(157,133,'2025-2026',7,0,0,0,0,0,1,0,410,0,0),(158,134,'2025-2026',19,1,4,0,0,0,3,0,1640,0,0),(159,135,'2025-2026',18,2,5,0,0,0,2,0,1520,0,0),(160,136,'2025-2026',17,1,3,0,0,0,2,0,1400,0,0),(161,137,'2025-2026',12,0,2,0,0,0,2,0,820,0,0),(162,138,'2025-2026',10,2,1,0,0,0,1,0,680,0,0),(163,139,'2025-2026',9,0,1,0,0,0,2,0,550,0,0),(164,140,'2025-2026',18,7,3,1,0,2,2,0,1500,0,0),(165,141,'2025-2026',17,5,4,0,0,1,1,0,1380,0,0),(166,142,'2025-2026',16,4,2,1,0,1,2,0,1250,0,0),(167,143,'2025-2026',15,6,2,0,0,2,1,0,1180,0,0),(168,144,'2025-2026',10,2,1,0,0,0,1,0,640,0,0),(169,145,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(170,146,'2025-2026',11,4,1,0,0,1,2,0,720,0,0),(171,147,'2025-2026',20,0,0,0,0,0,1,0,1800,18,7),(172,148,'2025-2026',4,0,0,0,0,0,0,0,180,5,1),(173,149,'2025-2026',2,0,0,0,0,0,0,0,90,2,0),(174,150,'2025-2026',19,2,1,2,0,0,3,0,1650,0,0),(175,151,'2025-2026',18,2,0,1,0,0,2,0,1530,0,0),(176,152,'2025-2026',17,0,1,0,0,0,3,1,1420,0,0),(177,153,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(178,154,'2025-2026',19,0,2,0,0,0,1,0,1620,0,0),(179,155,'2025-2026',16,0,0,0,0,0,2,0,1280,0,0),(180,156,'2025-2026',10,0,0,0,0,0,1,0,700,0,0),(181,157,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(182,158,'2025-2026',7,0,1,0,0,0,1,0,420,0,0),(183,159,'2025-2026',18,2,4,0,0,0,3,0,1520,0,0),(184,160,'2025-2026',17,3,5,0,0,0,2,0,1400,0,0),(185,161,'2025-2026',16,1,3,0,0,0,2,0,1300,0,0),(186,162,'2025-2026',19,2,3,0,0,0,3,0,1580,0,0),(187,163,'2025-2026',11,0,2,0,0,0,2,0,760,0,0),(188,164,'2025-2026',9,1,1,0,0,0,1,0,590,0,0),(189,165,'2025-2026',10,1,0,0,0,0,2,0,680,0,0),(190,166,'2025-2026',7,0,1,0,0,0,0,0,380,0,0),(191,167,'2025-2026',6,0,0,0,0,0,1,0,320,0,0),(192,168,'2025-2026',5,0,0,0,0,0,0,0,260,0,0),(193,169,'2025-2026',17,4,2,1,0,1,2,0,1380,0,0),(194,170,'2025-2026',19,4,1,0,0,1,1,0,1520,0,0),(195,171,'2025-2026',15,3,2,1,0,0,2,0,1150,0,0),(196,172,'2025-2026',16,3,1,0,0,1,1,0,1200,0,0),(197,173,'2025-2026',9,1,0,0,0,0,1,0,540,0,0),(198,174,'2025-2026',8,4,0,1,0,2,0,0,480,0,0),(199,175,'2025-2026',19,0,0,0,0,0,1,0,1710,26,3),(200,176,'2025-2026',5,0,0,0,0,0,0,0,270,7,1),(201,177,'2025-2026',2,0,0,0,0,0,0,0,90,4,0),(202,178,'2025-2026',18,0,1,0,0,0,3,0,1550,0,0),(203,179,'2025-2026',17,1,0,1,0,0,2,0,1450,0,0),(204,180,'2025-2026',20,0,1,0,0,0,4,1,1720,0,0),(205,181,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(206,182,'2025-2026',19,0,1,0,0,0,3,0,1620,0,0),(207,183,'2025-2026',20,1,4,0,0,0,3,0,1700,0,0),(208,184,'2025-2026',17,3,2,0,0,1,2,0,1420,0,0),(209,185,'2025-2026',12,1,2,0,0,0,2,0,850,0,0),(210,186,'2025-2026',13,1,2,0,0,0,1,0,880,0,0),(211,187,'2025-2026',20,3,0,0,0,0,4,0,1700,0,0),(212,188,'2025-2026',10,1,1,0,0,0,2,0,700,0,0),(213,189,'2025-2026',8,0,1,0,0,0,1,0,480,0,0),(214,190,'2025-2026',20,10,3,2,0,1,2,0,1680,0,0),(215,191,'2025-2026',15,3,2,1,0,0,1,0,1150,0,0),(216,192,'2025-2026',20,10,4,1,0,2,2,1,1600,0,0),(217,193,'2025-2026',10,1,1,0,0,0,1,0,620,0,0),(218,194,'2025-2026',14,5,2,1,0,1,1,0,1050,0,0),(219,195,'2025-2026',20,0,0,0,0,0,1,0,1800,19,6),(220,196,'2025-2026',5,0,0,0,0,0,0,0,270,6,1),(221,197,'2025-2026',2,0,0,0,0,0,0,0,90,3,0),(222,198,'2025-2026',18,0,1,0,0,0,2,0,1530,0,0),(223,199,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(224,200,'2025-2026',18,0,1,0,0,0,3,0,1520,0,0),(225,201,'2025-2026',10,0,0,0,0,0,1,0,720,0,0),(226,202,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(227,203,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(228,204,'2025-2026',8,0,0,0,0,0,1,0,490,0,0),(229,205,'2025-2026',18,1,3,0,0,0,2,0,1480,0,0),(230,206,'2025-2026',12,0,2,0,0,0,1,0,820,0,0),(231,207,'2025-2026',17,2,3,0,0,0,2,0,1370,0,0),(232,208,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(233,209,'2025-2026',16,3,2,0,0,0,2,0,1280,0,0),(234,210,'2025-2026',19,1,4,0,0,0,3,0,1560,0,0),(235,211,'2025-2026',16,2,3,0,0,0,2,0,1250,0,0),(236,212,'2025-2026',18,6,2,1,0,2,2,0,1430,0,0),(237,213,'2025-2026',15,5,3,0,0,1,1,0,1150,0,0),(238,214,'2025-2026',10,2,1,0,0,0,1,0,620,0,0),(239,215,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(240,216,'2025-2026',19,0,0,0,0,0,1,0,1710,21,5),(241,217,'2025-2026',6,0,0,0,0,0,0,0,360,7,1),(242,218,'2025-2026',18,0,2,0,0,0,2,0,1520,0,0),(243,219,'2025-2026',17,1,1,1,0,0,3,0,1420,0,0),(244,220,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(245,221,'2025-2026',18,0,1,0,0,0,2,0,1500,0,0),(246,222,'2025-2026',15,0,0,0,0,0,1,0,1200,0,0),(247,223,'2025-2026',11,0,0,0,0,0,1,0,760,0,0),(248,224,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(249,225,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(250,226,'2025-2026',7,0,0,0,0,0,0,0,380,0,0),(251,227,'2025-2026',18,2,4,0,0,0,3,0,1480,0,0),(252,228,'2025-2026',17,4,5,0,0,0,2,0,1370,0,0),(253,229,'2025-2026',16,2,3,0,0,0,2,0,1270,0,0),(254,230,'2025-2026',12,1,1,0,0,0,2,0,800,0,0),(255,231,'2025-2026',10,0,2,0,0,0,1,0,640,0,0),(256,232,'2025-2026',9,1,1,0,0,0,1,0,560,0,0),(257,233,'2025-2026',8,0,1,0,0,0,1,0,480,0,0),(258,234,'2025-2026',17,8,3,2,0,2,2,0,1350,0,0),(259,235,'2025-2026',16,7,4,1,0,1,1,0,1230,0,0),(260,236,'2025-2026',11,3,1,1,0,0,2,0,720,0,0),(261,237,'2025-2026',15,4,2,0,0,1,1,0,1120,0,0),(262,238,'2025-2026',9,1,0,0,0,0,1,0,540,0,0),(263,239,'2025-2026',19,0,0,0,0,0,1,0,1710,28,3),(264,240,'2025-2026',6,0,0,0,0,0,0,0,360,8,0),(265,241,'2025-2026',20,1,2,1,0,0,3,0,1720,0,0),(266,242,'2025-2026',19,0,1,0,0,0,3,0,1620,0,0),(267,243,'2025-2026',18,0,0,0,0,0,2,0,1480,0,0),(268,244,'2025-2026',17,0,0,0,0,0,2,0,1380,0,0),(269,245,'2025-2026',16,0,1,0,0,0,1,0,1280,0,0),(270,246,'2025-2026',11,0,0,0,0,0,2,0,760,0,0),(271,247,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(272,248,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(273,249,'2025-2026',7,0,0,0,0,0,0,0,390,0,0),(274,250,'2025-2026',6,0,0,0,0,0,1,0,310,0,0),(275,251,'2025-2026',18,1,3,0,0,0,3,0,1480,0,0),(276,252,'2025-2026',17,2,3,0,0,0,2,0,1370,0,0),(277,253,'2025-2026',16,2,2,0,0,0,2,0,1270,0,0),(278,254,'2025-2026',12,1,1,0,0,0,2,0,800,0,0),(279,255,'2025-2026',10,0,2,0,0,0,1,0,640,0,0),(280,256,'2025-2026',9,1,0,0,0,0,1,0,560,0,0),(281,257,'2025-2026',8,0,1,0,0,0,1,0,480,0,0),(282,258,'2025-2026',9,1,0,0,0,0,2,0,560,0,0),(283,259,'2025-2026',7,0,0,0,0,0,0,0,380,0,0),(284,260,'2025-2026',5,0,0,0,0,0,0,0,270,0,0),(285,261,'2025-2026',17,5,2,0,0,1,2,0,1330,0,0),(286,262,'2025-2026',16,4,2,1,0,0,1,0,1230,0,0),(287,263,'2025-2026',15,3,1,0,0,1,2,1,1120,0,0),(288,264,'2025-2026',10,2,0,0,0,0,1,0,620,0,0),(289,265,'2025-2026',9,1,1,0,0,0,1,0,540,0,0),(290,266,'2025-2026',7,1,0,0,0,0,0,0,380,0,0),(291,267,'2025-2026',6,0,0,0,0,0,1,0,310,0,0),(312,288,'2025-2026',18,0,0,0,0,0,1,0,1620,28,2),(313,289,'2025-2026',7,0,0,0,0,0,0,0,450,10,0),(314,290,'2025-2026',17,0,1,0,0,0,3,0,1420,0,0),(315,291,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(316,292,'2025-2026',15,0,0,0,0,0,2,0,1200,0,0),(317,293,'2025-2026',14,0,0,0,0,0,1,0,1100,0,0),(318,294,'2025-2026',16,0,1,0,0,0,2,0,1300,0,0),(319,295,'2025-2026',17,1,2,0,0,0,2,0,1380,0,0),(320,296,'2025-2026',16,2,3,0,0,0,2,0,1270,0,0),(321,297,'2025-2026',15,1,2,0,0,0,1,0,1170,0,0),(322,298,'2025-2026',11,0,1,0,0,0,2,0,740,0,0),(323,299,'2025-2026',10,1,0,0,0,0,1,0,640,0,0),(324,300,'2025-2026',9,0,1,0,0,0,1,0,560,0,0),(325,301,'2025-2026',8,1,0,0,0,0,1,0,490,0,0),(326,302,'2025-2026',16,5,2,1,0,1,2,0,1250,0,0),(327,303,'2025-2026',15,4,2,1,0,0,1,0,1150,0,0),(328,304,'2025-2026',10,1,1,0,0,0,1,0,620,0,0),(329,305,'2025-2026',9,2,0,0,0,0,0,0,540,0,0),(330,306,'2025-2026',7,1,0,0,0,0,1,0,380,0,0),(331,307,'2025-2026',18,0,0,0,0,0,1,0,1620,32,2),(332,308,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(333,309,'2025-2026',16,0,1,0,0,0,2,0,1300,0,0),(334,310,'2025-2026',15,0,0,0,0,0,2,0,1200,0,0),(335,311,'2025-2026',14,0,0,0,0,0,1,0,1100,0,0),(336,312,'2025-2026',16,0,1,0,0,0,1,0,1300,0,0),(337,313,'2025-2026',17,1,2,0,0,0,3,0,1380,0,0),(338,314,'2025-2026',16,0,2,0,0,0,2,0,1270,0,0),(339,315,'2025-2026',15,1,1,0,0,0,2,0,1170,0,0),(340,316,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(341,317,'2025-2026',16,3,2,0,0,1,2,0,1250,0,0),(342,318,'2025-2026',9,0,1,0,0,0,1,0,550,0,0),(343,319,'2025-2026',16,4,2,0,0,1,2,0,1230,0,0),(344,320,'2025-2026',15,3,1,1,0,0,1,0,1130,0,0),(345,321,'2025-2026',10,1,0,0,0,0,1,0,600,0,0),(346,322,'2025-2026',18,0,0,0,0,0,1,0,1620,20,5),(347,323,'2025-2026',7,0,0,0,0,0,0,0,450,9,1),(348,324,'2025-2026',18,0,1,0,0,0,2,0,1520,0,0),(349,325,'2025-2026',17,1,0,1,0,0,3,0,1420,0,0),(350,326,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(351,327,'2025-2026',15,0,1,0,0,0,2,0,1200,0,0),(352,328,'2025-2026',17,0,0,0,0,0,1,0,1420,0,0),(353,329,'2025-2026',10,0,0,0,0,0,2,0,720,0,0),(354,330,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(355,331,'2025-2026',18,2,3,0,0,0,3,0,1480,0,0),(356,332,'2025-2026',17,3,4,0,0,0,2,0,1370,0,0),(357,333,'2025-2026',16,1,2,0,0,0,2,0,1270,0,0),(358,334,'2025-2026',15,2,2,0,0,0,1,0,1180,0,0),(359,335,'2025-2026',11,0,2,0,0,0,2,0,760,0,0),(360,336,'2025-2026',9,1,1,0,0,0,1,0,580,0,0),(361,337,'2025-2026',17,7,3,1,0,2,2,0,1380,0,0),(362,338,'2025-2026',16,5,2,1,0,1,1,0,1250,0,0),(363,339,'2025-2026',11,2,1,0,0,0,1,0,700,0,0),(364,340,'2025-2026',10,3,1,0,0,1,1,0,640,0,0),(365,341,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(366,342,'2025-2026',20,0,0,0,0,0,2,0,1800,30,3),(367,343,'2025-2026',18,0,0,0,0,0,3,0,1530,0,0),(368,344,'2025-2026',17,0,1,0,0,0,2,0,1420,0,0),(369,345,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(370,346,'2025-2026',15,0,0,0,0,0,1,0,1200,0,0),(371,347,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(372,348,'2025-2026',10,0,0,0,0,0,1,0,680,0,0),(373,349,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(374,350,'2025-2026',18,1,3,0,0,0,3,0,1480,0,0),(375,351,'2025-2026',17,2,2,0,0,0,2,0,1370,0,0),(376,352,'2025-2026',16,1,2,0,0,0,2,0,1270,0,0),(377,353,'2025-2026',12,0,1,0,0,0,2,0,800,0,0),(378,354,'2025-2026',15,1,2,0,0,0,1,0,1170,0,0),(379,355,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(380,356,'2025-2026',9,0,0,0,0,0,1,0,560,0,0),(381,357,'2025-2026',8,1,0,0,0,0,1,0,490,0,0),(382,358,'2025-2026',17,4,2,0,0,1,2,0,1330,0,0),(383,359,'2025-2026',16,5,1,1,0,1,1,0,1230,0,0),(384,360,'2025-2026',11,2,1,0,0,0,1,0,700,0,0),(385,361,'2025-2026',9,1,0,0,0,0,0,0,480,0,0),(386,362,'2025-2026',7,1,0,0,0,0,1,0,380,0,0),(387,363,'2025-2026',18,0,0,0,0,0,1,0,1620,25,3),(388,364,'2025-2026',6,0,0,0,0,0,0,0,360,9,0),(389,365,'2025-2026',2,0,0,0,0,0,0,0,90,4,0),(390,366,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(391,367,'2025-2026',16,0,1,0,0,0,3,0,1300,0,0),(392,368,'2025-2026',15,1,0,1,0,0,2,0,1200,0,0),(393,369,'2025-2026',14,0,0,0,0,0,2,0,1100,0,0),(394,370,'2025-2026',16,0,0,0,0,0,1,0,1300,0,0),(395,371,'2025-2026',10,0,0,0,0,0,1,0,680,0,0),(396,372,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(397,373,'2025-2026',17,1,3,0,0,0,2,0,1380,0,0),(398,374,'2025-2026',16,2,2,0,0,0,2,0,1270,0,0),(399,375,'2025-2026',15,3,2,0,0,0,1,0,1170,0,0),(400,376,'2025-2026',11,1,1,0,0,0,2,0,740,0,0),(401,377,'2025-2026',9,0,1,0,0,0,1,0,560,0,0),(402,378,'2025-2026',16,4,2,1,0,1,2,0,1250,0,0),(403,379,'2025-2026',15,5,1,0,0,1,1,0,1150,0,0),(404,380,'2025-2026',10,2,1,0,0,0,1,0,620,0,0),(408,138,'2026',0,1,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `estadisticas_jugadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores_femenina`
--

DROP TABLE IF EXISTS `estadisticas_jugadores_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores_femenina` (
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores_femenina`
--

LOCK TABLES `estadisticas_jugadores_femenina` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores_femenina` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores_femenina` VALUES (1,1,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(2,2,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(3,3,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(4,4,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(5,5,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(6,6,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(7,7,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(8,8,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(9,9,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(10,10,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(11,11,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(12,12,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(13,13,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(14,14,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(15,15,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(16,16,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(17,17,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(18,18,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(19,19,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(20,20,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(21,21,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),(22,22,'2025-2026',0,0,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `estadisticas_jugadores_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores_segunda`
--

DROP TABLE IF EXISTS `estadisticas_jugadores_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores_segunda` (
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores_segunda`
--

LOCK TABLES `estadisticas_jugadores_segunda` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores_segunda` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores_segunda` VALUES (1,1,'2025-2026',3,2,1,0,0,0,0,0,90,0,0),(2,2,'2025-2026',0,0,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `estadisticas_jugadores_segunda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores_tercera`
--

DROP TABLE IF EXISTS `estadisticas_jugadores_tercera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores_tercera` (
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores_tercera`
--

LOCK TABLES `estadisticas_jugadores_tercera` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores_tercera` DISABLE KEYS */;
