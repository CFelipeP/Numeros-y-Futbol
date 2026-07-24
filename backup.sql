-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: numeros-y-futbol
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
  `token` varchar(128) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `user_role` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'usuario',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (33,'fc83b1033a8d6db39fdd3320f42cf11470ea65f5cd180e3a17beffc22d0cac0d',9,'admin','2026-07-24 13:15:55','2026-07-25 13:15:55');
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `browser_visits`
--

DROP TABLE IF EXISTS `browser_visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `browser_visits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `browser_token` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `user_agent` text COLLATE utf8mb4_general_ci,
  `ip_hash` char(64) COLLATE utf8mb4_general_ci NOT NULL,
  `first_visit` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `visit_count` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_browser_token` (`browser_token`),
  KEY `idx_ip_hash` (`ip_hash`),
  KEY `idx_last_visit` (`last_visit`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `browser_visits`
--

LOCK TABLES `browser_visits` WRITE;
/*!40000 ALTER TABLE `browser_visits` DISABLE KEYS */;
INSERT INTO `browser_visits` VALUES (1,'87950662-a6e5-4b0e-8097-979d0cfb3a84','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','2026-07-17 15:44:22','2026-07-17 15:44:22',1),(2,'2d0c9c1b-61ec-4408-8711-26c9363996ed','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','2026-07-17 17:40:34','2026-07-17 17:40:34',1),(3,'5b6fa987-d7f2-453f-bd35-58d686efd2e4','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','2026-07-22 02:46:52','2026-07-22 02:46:52',1);
/*!40000 ALTER TABLE `browser_visits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuerpo_tecnico_seleccion`
--

DROP TABLE IF EXISTS `cuerpo_tecnico_seleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `rol` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuerpo_tecnico_seleccion`
--

LOCK TABLES `cuerpo_tecnico_seleccion` WRITE;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion` DISABLE KEYS */;
INSERT INTO `cuerpo_tecnico_seleccion` VALUES (1,'Hernán Darío \"Bolillo\" Gómez','Director Técnico','/backend/uploads/seleccion_1783695351_4a171df0.png','Colombia','2026-07-10 05:56:25'),(2,'Héctor \"El Panzer\" Carvajal','Asistente Técnico','/backend/uploads/seleccion_1783695912_da2a66d4.png','Colombia','2026-07-10 05:58:10'),(3,'Juan Mauricio Roldán','Preparador Físico','/backend/uploads/seleccion_1783695986_77ac5a2c.png','Colombia','2026-07-10 05:59:26'),(4,'Asdrúbal \"El Gato\" Menéndez','Preparador Físico',NULL,'El Salvador','2026-07-10 06:00:50');
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
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `rol` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
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
-- Table structure for table `cuerpo_tecnico_seleccion_sub17`
--

DROP TABLE IF EXISTS `cuerpo_tecnico_seleccion_sub17`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion_sub17` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `rol` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuerpo_tecnico_seleccion_sub17`
--

LOCK TABLES `cuerpo_tecnico_seleccion_sub17` WRITE;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion_sub17` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion_sub17` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuerpo_tecnico_seleccion_sub20`
--

DROP TABLE IF EXISTS `cuerpo_tecnico_seleccion_sub20`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion_sub20` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `rol` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuerpo_tecnico_seleccion_sub20`
--

LOCK TABLES `cuerpo_tecnico_seleccion_sub20` WRITE;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion_sub20` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion_sub20` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos`
--

DROP TABLE IF EXISTS `equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estadio` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `formacion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
INSERT INTO `equipos` VALUES (4,'L.A. Firpo','Usulután','Estadio Sergio Torres Rivera','uploads/1775237339_LAFIRPO.png','3-4-3'),(5,'Alianza F.C.','San Salvador',' Estadio Cuscatlán','uploads/1775237448_alianzafc.png','4-4-2'),(6,'C.D. Águila','San Miguel','Estadio Juan Francisco Barraza','uploads/1775237638_Aguila.png','4-4-2'),(7,'C.D. Municipal Limeño','Santa Rosa de Lima','Estadio Dr. Ramón Flores Berríos','uploads/escudos/equipo_7_1779945347.png','4-4-2'),(8,'Inter Tecla','Santa Tecla','Estadio Nacional Las Delicias','uploads/escudos/equipo_8_1782942322.png','4-4-2'),(9,'A.D. Isidro Metapán','Metapán','Estadio Jorge \"Calero\" Suárez','uploads/1775241152_metapan.png','4-4-2'),(10,'C.D. Cacahuatique','Ciudad Barrios','Estadio Municipal de Chapeltique','uploads/1775242518_cacahuatique.png','4-4-2'),(11,'C.D. Platense','Zacatecoluca','Antonio Toledo Valle','uploads/1775242938_platense.png','4-4-2'),(12,'C.D. Fuerte San Francisco','San Francisco Gotera','Estadio Correcaminos','uploads/1775243154_morazan.png','4-4-2'),(15,'C.D. FAS','Santa Ana','Estadio Óscar Alberto Quiteño','uploads/1775580005_FAS.png','4-4-2'),(17,'CD ATL.BALBOA','La Unión','Marcelino Imbers','uploads/1784694388_balboa.png','4-4-2'),(18,'CD Inca Aruba','Entre Ríos','Estadio Anna Mercedes Campos.','uploads/1784694507_incaaruba.png','4-4-2');
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_ascenso`
--

DROP TABLE IF EXISTS `equipos_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_ascenso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estadio` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `formacion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_ascenso`
--

LOCK TABLES `equipos_ascenso` WRITE;
/*!40000 ALTER TABLE `equipos_ascenso` DISABLE KEYS */;
INSERT INTO `equipos_ascenso` VALUES (1,'C.D. Fuerte Aguilares','Aguilares, San Salvador','Complejo Deportivo Teofilo J. Simán','uploads/1775366328_fuerte aguilares.webp','2026-04-05 05:18:48','4-4-2'),(3,'ADET-Aruba FC','Jayaque,  La Libertad','Estadio El Transito','uploads/1775366532_Aruba.webp','2026-04-05 05:22:12',NULL),(9,'C.D. Dragón','San Miguel','Estadio Juan Fracisco Barraza','uploads/1775371713_dragon.png','2026-04-05 06:48:33',NULL),(11,'C.D. Cruzeiro','San Cayetano Istepeque, San Vicente','Complejo Deportivo Tecoluca','uploads/1775381059_cruzeiro.png','2026-04-05 09:24:19',NULL),(12,'C.D. Olimpico Litoral','Cerro de la Loma Larga','Complejo Deportivo Rafael López','uploads/1775381230_litoral.png','2026-04-05 09:27:10',NULL),(14,'C.D. Neo Pipil','San Juan Nonualco','Estadio Neo Pipil','uploads/1775381481_neopipil.jpg','2026-04-05 09:31:21',NULL),(19,'A.D. Izalco','Izalco, Sonsonate','Estadio Municipal Salvador Mariona','uploads/1778808698_IZALCOs.png','2026-07-06 05:11:00',NULL),(20,'C.D. 11 Municipal','Ahuachapán','Estadio Arturo Simeón Magaña','uploads/1778808985_C.D. 11 Municipal.png','2026-07-06 05:11:00',NULL),(22,'Marte Soyapango','Soyapango, San Salvador','Estadio Las Delicias','uploads/1783484543_martesouya.png','2026-07-06 05:11:00',NULL),(23,'Academia BP','Nuevo Cuscatlán, La Libertad','Estadio Municipal Florencia','uploads/1778807456_academia bp2.png','2026-07-06 05:11:00',NULL),(24,'A.D. Tenancingo','Cuscatlán','','uploads/1783347575_ad tenancinango.png','2026-07-06 05:11:00',NULL),(26,'CSD Vendaval','Apopa, San Salvador','Cancha Joaquín Gutiérres','uploads/1778807010_vendaval 2.png','2026-07-06 05:11:00',NULL),(30,'Audaz F.C.','Apastepeque, San Vicente','Estadio La Coyotera','uploads/1783563788_audaz.png','2026-07-06 05:11:00',NULL),(33,'A.D. San Marcos','Jiquilisco, Usulután','Estadio Topiltzín','uploads/1783648047_cd sanmarc{.png','2026-07-06 05:11:00',NULL),(34,'FORFUT','Cabañas','','uploads/1783646890_forfut.png','2026-07-06 05:11:00',NULL),(35,'C.D. El Roble','Ilobasco, Cabañas','Estadio Municipal Mauricio Vides','uploads/1783645728_cd roble.png','2026-07-06 05:11:00',NULL),(36,'CD El Vencedor','Santa Elena, Usulután','Cancha Municipal Huracán','uploads/1778810314_CD EL VENCEDOT.png','2026-07-06 05:11:00',NULL),(37,'A.D. SESA','Guadalupe, San Vicente','Mini Estadio Vista al Volcán','uploads/1783648245_sesa.png','2026-07-06 05:11:00',NULL),(38,'A.D. San Rafael','San Rafael Obrajuelo, La Paz','Estadio Jose Borjas Castillo','uploads/1783648175_san rafael.png','2026-07-06 05:11:00',NULL),(39,'C.D. Sal Y Mar','San Alejo, La Unión','Estadio San Sebastian','uploads/1783647558_cd sal.png','2026-07-06 05:11:00',NULL),(47,'11 LOBOS','Chalchuapa','','uploads/1784744810_11 lobos.png','2026-07-17 15:34:27',NULL),(48,'C.D. PUMAS','San Salvador','Estadio Universitario Héroes y Mártires','uploads/1784784676_cd pumas.png','2026-07-17 15:40:21',NULL),(49,'ORIÓN FC','Usulután','','uploads/1784744834_orion fc.png','2026-07-17 15:41:04',NULL),(50,'Nacional FC','Sonsonate','Estadio Municipal Ana Mercedes Campos','uploads/1784899661_nacional fc.jpg','2026-07-17 15:41:33',NULL);
/*!40000 ALTER TABLE `equipos_ascenso` ENABLE KEYS */;
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
  `division` enum('Primera','Ascenso') COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `grupo` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'A-F, asignado por el admin',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_equipo_division` (`equipo_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_copa`
--

LOCK TABLES `equipos_copa` WRITE;
/*!40000 ALTER TABLE `equipos_copa` DISABLE KEYS */;
INSERT INTO `equipos_copa` VALUES (199,4,'Primera','L.A. Firpo','uploads/1775237339_LAFIRPO.png','C',1),(200,5,'Primera','Alianza F.C.','uploads/1775237448_alianzafc.png','D',1),(201,6,'Primera','C.D. Águila','uploads/1775237638_Aguila.png','B',1),(202,7,'Primera','C.D. Municipal Limeño','uploads/escudos/equipo_7_1779945347.png','A',1),(203,8,'Primera','Inter TECLA','uploads/escudos/equipo_8_1782942322.png','F',1),(204,9,'Primera','A.D. Isidro Metapán','uploads/1775241152_metapan.png','F',1),(205,10,'Primera','C.D. Cacahuatique','uploads/1775242518_cacahuatique.png','C',1),(206,11,'Primera','C.D. Platense','uploads/1775242938_platense.png','A',1),(207,12,'Primera','C.D. Fuerte','uploads/1775243154_morazan.png','B',1),(210,15,'Primera','C.D. FAS','uploads/1775580005_FAS.png','E',1),(211,1,'Ascenso','CD Fuerte Aguilares','uploads/1775366328_fuerte aguilares.webp','E',1),(212,2,'Ascenso','C.D. Talleres Jr','uploads/1775366458_cd talleres.webp','F',1),(213,3,'Ascenso','CD ADET-Aruba','uploads/1775366532_Aruba.webp',NULL,1),(214,4,'Ascenso',' AD Batanecos','uploads/1775366637_Batanecos.png','D',1),(215,5,'Ascenso','CD Inca','uploads/1775368426_C.D._Inca_Súper_Flat_logo.png',NULL,1),(216,6,'Ascenso','A.D. Juventud Independiente','uploads/1783646402_juventu.png',NULL,1),(217,7,'Ascenso','A.D. Espartano','uploads/1775369682_AD espartano.png',NULL,1),(218,8,'Ascenso','Sensunte FC','uploads/1775370748_sensunte.webp','C',1),(219,9,'Ascenso','C.D. Dragón','uploads/1775371713_dragon.png','B',1),(220,10,'Ascenso','C.D. Atletico Balboa','uploads/1775381011_balboa.png',NULL,1),(221,11,'Ascenso','C.D. Cruzeiro','uploads/1775381059_cruzeiro.png','A',1),(222,12,'Ascenso','C.D. Olimpico Litoral','uploads/1775381230_litoral.png',NULL,1),(223,13,'Ascenso','C.D. Pipil','uploads/1775381319_pipil.png',NULL,1),(224,14,'Ascenso','C.D. Neo Pipil','uploads/1775381481_neopipil.jpg',NULL,1),(225,15,'Ascenso','AD Municipal','uploads/1783431838_ad municipal.png',NULL,1),(226,16,'Ascenso','CD Buenos Aires ','uploads/1783431010_cd buenos aires fc.png',NULL,1),(227,17,'Ascenso','UD Santos ','uploads/1783473058_U.D santos.png',NULL,1),(228,18,'Ascenso','Hachadura FC','uploads/1783430002_hachadura.png',NULL,1),(229,19,'Ascenso','AD Izalco','uploads/1778808698_IZALCOs.png','E',1),(230,20,'Ascenso','CD 11 Municipal','uploads/1778808985_C.D. 11 Municipal.png','F',1),(231,21,'Ascenso','Juventud Candelareño','uploads/1783429929_Juventud candelareño.png',NULL,1),(232,22,'Ascenso','Marte Soyapango','uploads/1783484543_martesouya.png',NULL,1),(233,23,'Ascenso','Academia BP','uploads/1778807456_academia bp2.png',NULL,1),(234,24,'Ascenso','Tenancingo','uploads/1783347575_ad tenancinango.png','A',1),(235,25,'Ascenso','Nacional Las Margaritas','uploads/1783536475_ad nacional.png',NULL,1),(236,26,'Ascenso','Vendaval','uploads/1778807010_vendaval 2.png','D',1),(237,27,'Ascenso','Atlético Belén','uploads/1783483080_atlbelen.png',NULL,1),(238,28,'Ascenso','Brasilia FC','uploads/1783481284_basilia.png',NULL,1),(239,29,'Ascenso','Santo Tomás','uploads/1783536538_santotomas.png',NULL,1),(240,30,'Ascenso','CD Audaz','uploads/1783563788_audaz.png',NULL,1),(241,31,'Ascenso','Nonualco FC','uploads/1783647079_nHUlco.png',NULL,1),(242,32,'Ascenso','Atlético Verapaz','uploads/1783646583_atverapaz.png',NULL,1),(243,33,'Ascenso','San Marcos','uploads/1783648047_cd sanmarc{.png',NULL,1),(244,34,'Ascenso','FORFUT','uploads/1783646890_forfut.png',NULL,1),(245,35,'Ascenso','CD El Roble','uploads/1783645728_cd roble.png','C',1),(246,36,'Ascenso','CD El Vencedor','uploads/1778810314_CD EL VENCEDOT.png',NULL,1),(247,37,'Ascenso','SESSA','uploads/1783648245_sesa.png',NULL,1),(248,38,'Ascenso','San Rafael Obrajuelo','uploads/1783648175_san rafael.png',NULL,1),(249,39,'Ascenso','Sal Y Mar','uploads/1783647558_cd sal.png',NULL,1),(250,40,'Ascenso','Brasil FC','uploads/1778809144_brasil fc.png',NULL,1),(251,41,'Ascenso','Racing de Gualuca','uploads/1783647122_racing{.png','B',1),(252,42,'Ascenso','Real Sociedad','uploads/1783647422_rel socu.png',NULL,1),(253,43,'Ascenso','Estrellas del Sur','uploads/1778806361_CD ESTRELLAS DEL SUR.png',NULL,1),(254,44,'Ascenso','CD Buenos Aires','uploads/1778807163_buenos aires 2.png',NULL,1),(255,45,'Ascenso','Atlético San Simón','uploads/1783646198_sansimon.png',NULL,1),(256,46,'Ascenso','Vista Hermosa','uploads/1783648353_vista.png',NULL,1),(261,17,'Primera','CD ATL.BALBOA','uploads/1784694388_balboa.png',NULL,1),(262,18,'Primera','CD Inca Aruba','uploads/1784694507_incaaruba.png',NULL,1);
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
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estadio` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `formacion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_primera_femenina`
--

LOCK TABLES `equipos_primera_femenina` WRITE;
/*!40000 ALTER TABLE `equipos_primera_femenina` DISABLE KEYS */;
INSERT INTO `equipos_primera_femenina` VALUES (1,'Alianza FC Women ','San Salvador','Estadio Cuscatlan ','uploads/1783693048_Alianza_women.jpg','4-4-2'),(2,'CD Águila Femenino','San Miguel','Estadio Juan Francisco Barraza','uploads/1782942606_aguila femenil.png','4-4-2'),(3,'C.D. FAS Femenino','Santa Ana','Estadio Óscar Alberto Quiteño','uploads/1784128548_FAS.png','4-4-2'),(4,'C.D. Municipal Limeño Femenil','La Unión','Estadio Dr. Ramón Flores Berríos','uploads/1784128664_Limeño.png','4-4-2'),(5,'A.D. Isidro Metapán Femenino','Santa Ana','Estadio Jorge \"Calero\" Suárez Landaverde','uploads/1784128867_metapan.png','4-4-2'),(6,'C.D. Cacahuatique Femenino','San Miguel','Polideportivo de Ciudad Barrios','uploads/1784128962_cacahuatique.png','4-4-2'),(7,'Inter Tecla Women','La Paz','Estadio Antonio Toledo Valle','uploads/1784129111_intertecla.png','4-4-2'),(9,'INCA Aruba (F)','','','uploads/1784900771_incaaruba.png','4-4-2'),(10,'CD Luis Angel Firpo (F)','Usulután','Estadio Sergio Torres Rivera','uploads/1784900844_LAFIRPO.png','4-4-2'),(11,'CD Fuerte San Francisco (F)','San Francisco Gotera','Estadio Correcaminos','uploads/1784901093_morazan.png','4-4-2'),(12,'CD Platense (F)','Zacatecoluca','Estadio Antonio Toledo Valle','uploads/1784901111_platense.png','4-4-2'),(13,'Atlético Balboa (F)','La Unión','Estadio Marcelino Imbers','uploads/1784901128_balboa.png','4-4-2');
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
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estadio` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `formacion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_segunda`
--

LOCK TABLES `equipos_segunda` WRITE;
/*!40000 ALTER TABLE `equipos_segunda` DISABLE KEYS */;
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
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estadio` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `grupo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `formacion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_tercera`
--

LOCK TABLES `equipos_tercera` WRITE;
/*!40000 ALTER TABLE `equipos_tercera` DISABLE KEYS */;
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
  `temporada` varchar(20) COLLATE utf8mb4_general_ci DEFAULT '2025-2026',
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
) ENGINE=InnoDB AUTO_INCREMENT=494 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores`
--

LOCK TABLES `estadisticas_jugadores` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores` VALUES (122,98,'2025-2026',20,0,0,0,0,0,1,0,1800,22,5),(123,99,'2025-2026',5,0,0,0,0,0,0,0,270,6,1),(124,100,'2025-2026',2,0,0,0,0,0,0,0,90,3,0),(125,101,'2025-2026',18,1,0,1,0,0,3,0,1550,0,0),(126,102,'2025-2026',17,2,1,1,0,0,4,1,1450,0,0),(127,103,'2025-2026',16,0,1,0,0,0,2,0,1350,0,0),(128,104,'2025-2026',15,2,0,2,0,0,3,0,1280,0,0),(129,105,'2025-2026',10,0,0,0,0,0,1,0,760,0,0),(130,106,'2025-2026',17,5,0,2,0,0,3,0,1450,0,0),(131,107,'2025-2026',8,0,0,0,0,0,1,0,520,0,0),(132,108,'2025-2026',19,6,3,0,0,0,4,0,1650,0,0),(133,109,'2025-2026',18,4,5,0,0,0,4,1,1530,0,0),(134,110,'2025-2026',17,6,2,0,0,0,2,0,1420,0,0),(135,111,'2025-2026',12,1,2,0,0,0,2,0,870,0,0),(136,112,'2025-2026',9,0,1,0,0,0,1,0,610,0,0),(137,113,'2025-2026',16,2,3,0,0,0,3,0,1320,0,0),(138,114,'2025-2026',11,1,1,0,0,0,2,0,780,0,0),(139,115,'2025-2026',7,0,0,0,0,0,1,0,430,0,0),(140,116,'2025-2026',6,0,1,0,0,0,0,0,310,0,0),(141,117,'2025-2026',8,0,0,0,0,0,1,0,450,0,0),(142,118,'2025-2026',18,5,2,1,0,1,2,0,1480,0,0),(143,119,'2025-2026',17,5,3,1,0,1,1,1,1380,0,0),(144,120,'2025-2026',19,6,4,0,0,2,2,0,1560,0,0),(145,121,'2025-2026',16,8,2,2,0,1,3,0,1300,0,0),(146,122,'2025-2026',10,2,1,0,0,0,1,0,650,0,0),(147,123,'2025-2026',19,0,0,0,0,0,1,0,1710,20,6),(148,124,'2025-2026',6,1,0,0,0,0,0,0,360,8,1),(149,125,'2025-2026',18,0,1,0,0,0,2,0,1550,0,0),(150,126,'2025-2026',17,1,0,1,0,0,3,0,1450,0,0),(151,127,'2025-2026',16,0,0,0,0,0,2,0,1350,0,0),(152,128,'2025-2026',15,0,1,0,0,0,1,0,1280,0,0),(153,129,'2025-2026',10,0,0,0,0,0,1,0,760,0,0),(154,130,'2025-2026',17,1,0,1,0,0,2,0,1450,0,0),(155,131,'2025-2026',9,2,0,1,0,1,1,0,620,0,0),(156,132,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(157,133,'2025-2026',7,0,0,0,0,0,1,0,410,0,0),(158,134,'2025-2026',19,1,4,0,0,0,3,0,1640,0,0),(159,135,'2025-2026',18,2,5,0,0,0,2,0,1520,0,0),(160,136,'2025-2026',17,1,3,0,0,0,2,0,1400,0,0),(161,137,'2025-2026',12,0,2,0,0,0,2,0,820,0,0),(162,138,'2025-2026',10,2,1,0,0,0,1,0,680,0,0),(163,139,'2025-2026',9,0,1,0,0,0,2,0,550,0,0),(164,140,'2025-2026',18,7,3,1,0,2,2,0,1500,0,0),(165,141,'2025-2026',17,5,4,0,0,1,1,0,1380,0,0),(166,142,'2025-2026',16,4,2,1,0,1,2,0,1250,0,0),(167,143,'2025-2026',15,6,2,0,0,2,1,0,1180,0,0),(168,144,'2025-2026',10,2,1,0,0,0,1,0,640,0,0),(169,145,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(170,146,'2025-2026',11,4,1,0,0,1,2,0,720,0,0),(171,147,'2025-2026',20,0,0,0,0,0,1,0,1800,18,7),(172,148,'2025-2026',4,0,0,0,0,0,0,0,180,5,1),(173,149,'2025-2026',2,0,0,0,0,0,0,0,90,2,0),(174,150,'2025-2026',19,2,1,2,0,0,3,0,1650,0,0),(175,151,'2025-2026',18,2,0,1,0,0,2,0,1530,0,0),(176,152,'2025-2026',17,0,1,0,0,0,3,1,1420,0,0),(177,153,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(178,154,'2025-2026',19,0,2,0,0,0,1,0,1620,0,0),(179,155,'2025-2026',16,0,0,0,0,0,2,0,1280,0,0),(180,156,'2025-2026',10,0,0,0,0,0,1,0,700,0,0),(181,157,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(182,158,'2025-2026',7,0,1,0,0,0,1,0,420,0,0),(183,159,'2025-2026',18,2,4,0,0,0,3,0,1520,0,0),(184,160,'2025-2026',17,3,5,0,0,0,2,0,1400,0,0),(185,161,'2025-2026',16,1,3,0,0,0,2,0,1300,0,0),(186,162,'2025-2026',19,2,3,0,0,0,3,0,1580,0,0),(187,163,'2025-2026',11,0,2,0,0,0,2,0,760,0,0),(188,164,'2025-2026',9,1,1,0,0,0,1,0,590,0,0),(189,165,'2025-2026',10,1,0,0,0,0,2,0,680,0,0),(190,166,'2025-2026',7,0,1,0,0,0,0,0,380,0,0),(191,167,'2025-2026',6,0,0,0,0,0,1,0,320,0,0),(192,168,'2025-2026',5,0,0,0,0,0,0,0,260,0,0),(193,169,'2025-2026',17,4,2,1,0,1,2,0,1380,0,0),(194,170,'2025-2026',19,4,1,0,0,1,1,0,1520,0,0),(195,171,'2025-2026',15,3,2,1,0,0,2,0,1150,0,0),(196,172,'2025-2026',16,3,1,0,0,1,1,0,1200,0,0),(197,173,'2025-2026',9,1,0,0,0,0,1,0,540,0,0),(198,174,'2025-2026',8,4,0,1,0,2,0,0,480,0,0),(199,175,'2025-2026',19,0,0,0,0,0,1,0,1710,26,3),(200,176,'2025-2026',5,0,0,0,0,0,0,0,270,7,1),(201,177,'2025-2026',2,0,0,0,0,0,0,0,90,4,0),(202,178,'2025-2026',18,0,1,0,0,0,3,0,1550,0,0),(203,179,'2025-2026',17,1,0,1,0,0,2,0,1450,0,0),(204,180,'2025-2026',20,0,1,0,0,0,4,1,1720,0,0),(205,181,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(206,182,'2025-2026',19,0,1,0,0,0,3,0,1620,0,0),(207,183,'2025-2026',20,1,4,0,0,0,3,0,1700,0,0),(208,184,'2025-2026',17,3,2,0,0,1,2,0,1420,0,0),(209,185,'2025-2026',12,1,2,0,0,0,2,0,850,0,0),(210,186,'2025-2026',13,1,2,0,0,0,1,0,880,0,0),(211,187,'2025-2026',20,3,0,0,0,0,4,0,1700,0,0),(212,188,'2025-2026',10,1,1,0,0,0,2,0,700,0,0),(213,189,'2025-2026',8,0,1,0,0,0,1,0,480,0,0),(214,190,'2025-2026',20,10,3,2,0,1,2,0,1680,0,0),(215,191,'2025-2026',15,3,2,1,0,0,1,0,1150,0,0),(216,192,'2025-2026',20,10,4,1,0,2,2,1,1600,0,0),(217,193,'2025-2026',10,1,1,0,0,0,1,0,620,0,0),(218,194,'2025-2026',14,5,2,1,0,1,1,0,1050,0,0),(346,322,'2025-2026',18,0,0,0,0,0,1,0,1620,20,5),(347,323,'2025-2026',7,0,0,0,0,0,0,0,450,9,1),(348,324,'2025-2026',18,0,1,0,0,0,2,0,1520,0,0),(349,325,'2025-2026',17,1,0,1,0,0,3,0,1420,0,0),(350,326,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(351,327,'2025-2026',15,0,1,0,0,0,2,0,1200,0,0),(352,328,'2025-2026',17,0,0,0,0,0,1,0,1420,0,0),(353,329,'2025-2026',10,0,0,0,0,0,2,0,720,0,0),(354,330,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(355,331,'2025-2026',18,2,3,0,0,0,3,0,1480,0,0),(356,332,'2025-2026',17,3,4,0,0,0,2,0,1370,0,0),(357,333,'2025-2026',16,1,2,0,0,0,2,0,1270,0,0),(358,334,'2025-2026',15,2,2,0,0,0,1,0,1180,0,0),(359,335,'2025-2026',11,0,2,0,0,0,2,0,760,0,0),(360,336,'2025-2026',9,1,1,0,0,0,1,0,580,0,0),(361,337,'2025-2026',17,7,3,1,0,2,2,0,1380,0,0),(362,338,'2025-2026',16,5,2,1,0,1,1,0,1250,0,0),(363,339,'2025-2026',11,2,1,0,0,0,1,0,700,0,0),(364,340,'2025-2026',10,3,1,0,0,1,1,0,640,0,0),(365,341,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(366,342,'2025-2026',20,0,0,0,0,0,2,0,1800,30,3),(367,343,'2025-2026',18,0,0,0,0,0,3,0,1530,0,0),(368,344,'2025-2026',17,0,1,0,0,0,2,0,1420,0,0),(369,345,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(370,346,'2025-2026',15,0,0,0,0,0,1,0,1200,0,0),(371,347,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(372,348,'2025-2026',10,0,0,0,0,0,1,0,680,0,0),(373,349,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(374,350,'2025-2026',18,1,3,0,0,0,3,0,1480,0,0),(375,351,'2025-2026',17,2,2,0,0,0,2,0,1370,0,0),(376,352,'2025-2026',16,1,2,0,0,0,2,0,1270,0,0),(377,353,'2025-2026',12,0,1,0,0,0,2,0,800,0,0),(378,354,'2025-2026',15,1,2,0,0,0,1,0,1170,0,0),(379,355,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(380,356,'2025-2026',9,0,0,0,0,0,1,0,560,0,0),(381,357,'2025-2026',8,1,0,0,0,0,1,0,490,0,0),(382,358,'2025-2026',17,4,2,0,0,1,2,0,1330,0,0),(383,359,'2025-2026',16,5,1,1,0,1,1,0,1230,0,0),(384,360,'2025-2026',11,2,1,0,0,0,1,0,700,0,0),(385,361,'2025-2026',9,1,0,0,0,0,0,0,480,0,0),(386,362,'2025-2026',7,1,0,0,0,0,1,0,380,0,0),(387,363,'2025-2026',18,0,0,0,0,0,1,0,1620,25,3),(388,364,'2025-2026',6,0,0,0,0,0,0,0,360,9,0),(389,365,'2025-2026',2,0,0,0,0,0,0,0,90,4,0),(390,366,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(391,367,'2025-2026',16,0,1,0,0,0,3,0,1300,0,0),(392,368,'2025-2026',15,1,0,1,0,0,2,0,1200,0,0),(393,369,'2025-2026',14,0,0,0,0,0,2,0,1100,0,0),(394,370,'2025-2026',16,0,0,0,0,0,1,0,1300,0,0),(395,371,'2025-2026',10,0,0,0,0,0,1,0,680,0,0),(396,372,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(397,373,'2025-2026',17,1,3,0,0,0,2,0,1380,0,0),(398,374,'2025-2026',16,2,2,0,0,0,2,0,1270,0,0),(399,375,'2025-2026',15,3,2,0,0,0,1,0,1170,0,0),(400,376,'2025-2026',11,1,1,0,0,0,2,0,740,0,0),(401,377,'2025-2026',9,0,1,0,0,0,1,0,560,0,0),(402,378,'2025-2026',16,4,2,1,0,1,2,0,1250,0,0),(403,379,'2025-2026',15,5,1,0,0,1,1,0,1150,0,0),(404,380,'2025-2026',10,2,1,0,0,0,1,0,620,0,0),(408,138,'2026',0,1,0,0,0,0,0,0,0,0,0),(416,131,'2026-2027',0,0,0,0,0,0,0,0,0,0,0),(417,139,'2026-2027',0,0,0,0,0,0,0,0,0,0,0),(418,124,'2026-2027',0,0,0,0,0,0,0,0,0,0,0),(431,426,'2025-2026',19,0,0,0,0,0,1,0,1710,21,5),(432,427,'2025-2026',6,0,0,0,0,0,0,0,360,7,1),(433,428,'2025-2026',18,0,2,0,0,0,2,0,1520,0,0),(434,429,'2025-2026',17,1,1,1,0,0,3,0,1420,0,0),(435,430,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(436,431,'2025-2026',18,0,1,0,0,0,2,0,1500,0,0),(437,432,'2025-2026',15,0,0,0,0,0,1,0,1200,0,0),(438,433,'2025-2026',11,0,0,0,0,0,1,0,760,0,0),(439,434,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(440,435,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(441,436,'2025-2026',7,0,0,0,0,0,0,0,380,0,0),(442,437,'2025-2026',18,2,4,0,0,0,3,0,1480,0,0),(443,438,'2025-2026',17,4,5,0,0,0,2,0,1370,0,0),(444,439,'2025-2026',16,2,3,0,0,0,2,0,1270,0,0),(445,440,'2025-2026',12,1,1,0,0,0,2,0,800,0,0),(446,441,'2025-2026',10,0,2,0,0,0,1,0,640,0,0),(447,442,'2025-2026',9,1,1,0,0,0,1,0,560,0,0),(448,443,'2025-2026',8,0,1,0,0,0,1,0,480,0,0),(449,444,'2025-2026',17,8,3,2,0,2,2,0,1350,0,0),(450,445,'2025-2026',16,7,4,1,0,1,1,0,1230,0,0),(451,446,'2025-2026',11,3,1,1,0,0,2,0,720,0,0),(452,447,'2025-2026',15,4,2,0,0,1,1,0,1120,0,0),(453,448,'2025-2026',9,1,0,0,0,0,1,0,540,0,0),(454,449,'2025-2026',20,0,0,0,0,0,1,0,1800,19,6),(455,450,'2025-2026',5,0,0,0,0,0,0,0,270,6,1),(456,451,'2025-2026',2,0,0,0,0,0,0,0,90,3,0),(457,452,'2025-2026',18,0,1,0,0,0,2,0,1530,0,0),(458,453,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(459,454,'2025-2026',18,0,1,0,0,0,3,0,1520,0,0),(460,455,'2025-2026',10,0,0,0,0,0,1,0,720,0,0),(461,456,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(462,457,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(463,458,'2025-2026',8,0,0,0,0,0,1,0,490,0,0),(464,459,'2025-2026',18,1,3,0,0,0,2,0,1480,0,0),(465,460,'2025-2026',12,0,2,0,0,0,1,0,820,0,0),(466,461,'2025-2026',17,2,3,0,0,0,2,0,1370,0,0),(467,462,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(468,463,'2025-2026',16,3,2,0,0,0,2,0,1280,0,0),(469,464,'2025-2026',19,1,4,0,0,0,3,0,1560,0,0),(470,465,'2025-2026',16,2,3,0,0,0,2,0,1250,0,0),(471,466,'2025-2026',18,6,2,1,0,2,2,0,1430,0,0),(472,467,'2025-2026',15,5,3,0,0,1,1,0,1150,0,0),(473,468,'2025-2026',10,2,1,0,0,0,1,0,620,0,0),(474,469,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(475,470,'2025-2026',18,0,0,0,0,0,1,0,1620,28,2),(476,471,'2025-2026',7,0,0,0,0,0,0,0,450,10,0),(477,472,'2025-2026',17,0,1,0,0,0,3,0,1420,0,0),(478,473,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(479,474,'2025-2026',15,0,0,0,0,0,2,0,1200,0,0),(480,475,'2025-2026',14,0,0,0,0,0,1,0,1100,0,0),(481,476,'2025-2026',16,0,1,0,0,0,2,0,1300,0,0),(482,477,'2025-2026',17,1,2,0,0,0,2,0,1380,0,0),(483,478,'2025-2026',16,2,3,0,0,0,2,0,1270,0,0),(484,479,'2025-2026',15,1,2,0,0,0,1,0,1170,0,0),(485,480,'2025-2026',11,0,1,0,0,0,2,0,740,0,0),(486,481,'2025-2026',10,1,0,0,0,0,1,0,640,0,0),(487,482,'2025-2026',9,0,1,0,0,0,1,0,560,0,0),(488,483,'2025-2026',8,1,0,0,0,0,1,0,490,0,0),(489,484,'2025-2026',16,5,2,1,0,1,2,0,1250,0,0),(490,485,'2025-2026',15,4,2,1,0,0,1,0,1150,0,0),(491,486,'2025-2026',10,1,1,0,0,0,1,0,620,0,0),(492,487,'2025-2026',9,2,0,0,0,0,0,0,540,0,0),(493,488,'2025-2026',7,1,0,0,0,0,1,0,380,0,0);
/*!40000 ALTER TABLE `estadisticas_jugadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores_ascenso`
--

DROP TABLE IF EXISTS `estadisticas_jugadores_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores_ascenso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jugador_id` int NOT NULL,
  `temporada` varchar(20) COLLATE utf8mb4_general_ci DEFAULT '2025-2026',
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
  KEY `jugador_id` (`jugador_id`),
  KEY `goles` (`goles`),
  KEY `tarjetas_amarillas` (`tarjetas_amarillas`),
  KEY `tarjetas_rojas` (`tarjetas_rojas`),
  KEY `goles_recibidos` (`goles_recibidos`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores_ascenso`
--

LOCK TABLES `estadisticas_jugadores_ascenso` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores_ascenso` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores_ascenso` VALUES (1,1,'2025-2026',3,2,1,0,0,0,0,0,90,0,0),(2,2,'2025-2026',0,0,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `estadisticas_jugadores_ascenso` ENABLE KEYS */;
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
  `temporada` varchar(20) COLLATE utf8mb4_general_ci DEFAULT '2025-2026',
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
  `temporada` varchar(20) COLLATE utf8mb4_general_ci DEFAULT '2025-2026',
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
  KEY `jugador_id` (`jugador_id`),
  KEY `goles` (`goles`),
  KEY `tarjetas_amarillas` (`tarjetas_amarillas`),
  KEY `tarjetas_rojas` (`tarjetas_rojas`),
  KEY `goles_recibidos` (`goles_recibidos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores_segunda`
--

LOCK TABLES `estadisticas_jugadores_segunda` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores_segunda` DISABLE KEYS */;
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
  `temporada` varchar(20) COLLATE utf8mb4_general_ci DEFAULT '2025-2026',
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
/*!40000 ALTER TABLE `estadisticas_jugadores_tercera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores`
--

DROP TABLE IF EXISTS `jugadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `posicion` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_jugador_equipo` (`equipo_id`),
  CONSTRAINT `jugadores_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=489 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores`
--

LOCK TABLES `jugadores` WRITE;
/*!40000 ALTER TABLE `jugadores` DISABLE KEYS */;
INSERT INTO `jugadores` VALUES (98,4,'Wilberth Hernández','portero',1,NULL,28,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,50,90,1),(99,4,'Misael Erazo','portero',12,NULL,24,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(100,4,'Felipe Amaya','portero',22,NULL,21,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(101,4,'Diego Flores','defensa',4,NULL,26,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,75,74,0),(102,4,'Wilber Arizala','defensa',3,NULL,27,'Colombiano','2026-04-17 21:00:39',NULL,NULL,50,76,0),(103,4,'Lizandro Claros','defensa',5,NULL,25,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(104,4,'Eduardo Vigil','defensa',6,NULL,29,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(105,4,'César Orellana','defensa',2,NULL,23,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,25,74,0),(106,4,'José Quintanilla','defensa',15,NULL,30,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(107,4,'Marlon Cornejo','defensa',17,NULL,24,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(108,4,'Mauricio Cerritos','centrocampista',8,NULL,28,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,62,48,0),(109,4,'Brayan Landaverde','centrocampista',10,NULL,27,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,88,50,0),(110,4,'Lucas R.','centrocampista',7,NULL,26,'Brasileño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(111,4,'Kevin Ascencio','centrocampista',16,NULL,22,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(112,4,'Erivan Flores','centrocampista',20,NULL,21,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(113,4,'Victor Garcia','centrocampista',14,NULL,25,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(114,4,'Brian Martínez','centrocampista',11,NULL,23,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,12,50,0),(115,4,'Jeremías Lemus','centrocampista',19,NULL,20,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(116,4,'Diego Ortez','centrocampista',21,NULL,22,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,18,22,1),(117,4,'Marvin Aranda','centrocampista',13,NULL,26,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,38,48,1),(118,4,'Marcelo Ferreira','delantero',9,NULL,28,'Brasileño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(119,4,'Cristian Gil','delantero',18,NULL,27,'Colombiano','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(120,4,'Nelson Díaz','delantero',11,NULL,25,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(121,4,'Elías Gumero','delantero',23,NULL,24,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,50,18,0),(122,4,'Andrés Morales','delantero',25,NULL,22,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,82,22,0),(123,5,'Daniel Franco','portero',1,NULL,28,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(124,5,'Cristopher Rauda','portero',12,NULL,22,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,50,90,1),(125,5,'Henry Romero','defensa',4,NULL,27,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,64,74,1),(126,5,'Alejandro Henríquez','defensa',3,NULL,26,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,36,74,1),(127,5,'Juan Barahona','defensa',5,NULL,29,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,88,70,1),(128,5,'Matías Steib','defensa',6,NULL,24,'Argentino','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(129,5,'Jonathan Jiménez','defensa',2,NULL,23,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,12,70,1),(130,5,'Emerson Hernández','defensa',15,NULL,25,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(131,5,'William Canales','defensa',16,NULL,28,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(132,5,'Diego Lemus','defensa',17,NULL,22,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(133,5,'Mario Jacobo','defensa',20,NULL,30,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(134,5,'Harold Osorio','centrocampista',8,NULL,27,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(135,5,'Leonardo Menjívar','centrocampista',10,NULL,26,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,72,48,1),(136,5,'Noel Rivera','centrocampista',7,NULL,25,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,50,44,1),(137,5,'Narciso Orellana','centrocampista',11,NULL,24,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,28,48,1),(138,5,'Oscar Rodríguez','centrocampista',14,NULL,23,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(139,5,'Christopher Guardado','centrocampista',19,NULL,22,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(140,5,'Enrico Dueñas Hernández','delantero',9,NULL,25,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,18,22,1),(141,5,'Francis Castillo-Orellana','delantero',18,NULL,24,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,82,22,1),(142,5,'Gustavo Moura','delantero',23,NULL,27,'Brasileño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(143,5,'Michell Mercado','delantero',21,NULL,26,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(144,5,'Juan Portillo','delantero',22,NULL,22,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,50,18,1),(145,5,'Allan Acevedo','delantero',25,NULL,21,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(146,5,'Luis Tobar','delantero',11,NULL,28,'Chileno','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(147,6,'Benji Villalobos','portero',1,NULL,30,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(148,6,'Jairo Guardado','portero',12,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(149,6,'Osmán Loza','portero',22,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(150,6,'Ronald Rodríguez','defensa',4,NULL,29,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(151,6,'Julio Sibrián','defensa',3,NULL,28,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(152,6,'Erick Cabalceta','defensa',5,NULL,26,'Costarricense','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(153,6,'Jefferson Perla','defensa',6,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(154,6,'Tereso Benítez','defensa',2,NULL,31,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(155,6,'Walter Pineda','defensa',15,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(156,6,'Juan Franco Cacace','defensa',17,NULL,25,'Uruguayo','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(157,6,'José Guatemala','defensa',20,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(158,6,'Stiven Dávila','defensa',16,NULL,22,'Colombiano','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(159,6,'Santos Ortiz','centrocampista',8,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(160,6,'Tomás Granitto','centrocampista',10,NULL,26,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(161,6,'Diego Gregori','centrocampista',7,NULL,25,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(162,6,'Marcelo Díaz','centrocampista',11,NULL,28,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(163,6,'Jairo Martínez','centrocampista',14,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(164,6,'Bryan Lovo','centrocampista',19,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(165,6,'Joel Turcios','centrocampista',21,NULL,26,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(166,6,'Carlos Ortiz','centrocampista',23,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(167,6,'Marvin Benitez Jr','centrocampista',18,NULL,21,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(168,6,'Herberth Marcelo Diaz Rivas','centrocampista',24,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(169,6,'Federico Andrada','delantero',9,NULL,28,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(170,6,'Dixon Rivas','delantero',18,NULL,26,'Colombiano','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(171,6,'Ricardo Villatoro','delantero',13,NULL,25,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(172,6,'Carlos Garay','delantero',11,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(173,6,'Allan Benítez','delantero',25,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(174,6,'Eduardo Cruz','delantero',26,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(175,7,'Julián Chicas','portero',1,NULL,28,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(176,7,'Oscar Sánchez','portero',12,NULL,25,'Salvadoreño','2026-04-17 21:03:27',50.00,90.00,NULL,NULL,1),(177,7,'Ricardo Funes','portero',22,NULL,22,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(178,7,'Leyvin Balanta','defensa',4,NULL,27,'Colombiano','2026-04-17 21:03:27',64.00,74.00,NULL,NULL,1),(179,7,'Elvis Claros','defensa',3,NULL,26,'Salvadoreño','2026-04-17 21:03:27',36.00,74.00,NULL,NULL,1),(180,7,'Fredy Espinoza','defensa',5,NULL,30,'Salvadoreño','2026-04-17 21:03:27',88.00,70.00,NULL,NULL,1),(181,7,'William Molina','defensa',6,NULL,28,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(182,7,'Rubén Marroquín','defensa',2,NULL,32,'Salvadoreño','2026-04-17 21:03:27',12.00,70.00,NULL,NULL,1),(183,7,'Jefferson Valladares','centrocampista',10,NULL,26,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(184,7,'Paolo Dantaz','centrocampista',8,NULL,26,'Argentino','2026-04-17 21:03:27',60.00,46.00,NULL,NULL,1),(185,7,'Enmanuel Hernández','centrocampista',7,NULL,23,'Salvadoreño','2026-04-17 21:03:27',40.00,46.00,NULL,NULL,1),(186,7,'Elmer Bonilla','centrocampista',14,NULL,27,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(187,7,'Marvin Ramos','centrocampista',11,NULL,28,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(188,7,'Jefferson Martinez','centrocampista',16,NULL,24,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(189,7,'Jordy Bonilla','centrocampista',19,NULL,21,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(190,7,'José Correa','delantero',9,NULL,27,'Salvadoreño','2026-04-17 21:03:27',18.00,48.00,NULL,NULL,1),(191,7,'Clayvin Zúñiga','delantero',18,NULL,25,'Hondureño','2026-04-17 21:03:27',36.00,22.00,NULL,NULL,1),(192,7,'Javier Ferman','delantero',11,NULL,28,'Salvadoreño','2026-04-17 21:03:27',82.00,48.00,NULL,NULL,1),(193,7,'Danis Cerros','delantero',21,NULL,22,'Salvadoreño','2026-04-17 21:03:27',64.00,22.00,NULL,NULL,1),(194,7,'Juan Carlos Argueta','delantero',25,NULL,24,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(322,9,'óscar pleitez','portero',1,NULL,30,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,50,90,1),(323,9,'cristofer maldonado','portero',12,NULL,24,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(324,9,'roberto carlos dominguez','central',4,NULL,28,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,12,70,1),(325,9,'nicolás gómez','central',3,NULL,25,'argentino','2026-04-21 17:54:23',NULL,NULL,64,74,1),(326,9,'giovanni ávila','central',5,NULL,27,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,88,70,1),(327,9,'kevin vidal','central',6,NULL,24,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(328,9,'milton molina','central',2,NULL,29,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,36,74,1),(329,9,'raúl cruz','central',15,NULL,26,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(330,9,'hugo aguilar','central',17,NULL,28,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(331,9,'melvin cartagena','medio_central',8,NULL,26,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,60,46,1),(332,9,'gustavo machado','medio_central',10,NULL,27,'venezolano','2026-04-21 17:54:23',NULL,NULL,18,48,1),(333,9,'elvin alvarado','medio_central',7,NULL,25,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,40,46,1),(334,9,'marvin monterroza','medio_central',11,NULL,24,'colombiano','2026-04-21 17:54:23',NULL,NULL,82,48,1),(335,9,'julio amaya','medio_central',14,NULL,28,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(336,9,'carlos anzora','medio_central',19,NULL,23,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(337,9,'emiliano villar','centrodelantero',9,NULL,27,'argentino','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(338,9,'steven guerra','centrodelantero',18,NULL,26,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(339,9,'kevin reyes','centrodelantero',21,NULL,23,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,36,22,1),(340,9,'jhonatan urrutia','centrodelantero',22,NULL,25,'colombiano','2026-04-21 17:54:23',NULL,NULL,64,22,1),(341,9,'jesús zúñiga','centrodelantero',25,NULL,22,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(342,12,'josué funes','portero',1,NULL,27,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,1),(343,12,'melvin cruz','central',4,NULL,28,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,12,70,1),(344,12,'alexander rodríguez','central',3,NULL,26,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,64,74,1),(345,12,'walter guevara','central',5,NULL,29,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,88,70,1),(346,12,'juan benítez','central',6,NULL,25,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,50,90,1),(347,12,'kevin oviedo','central',2,NULL,24,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,36,74,1),(348,12,'giuviny esquivel','central',15,NULL,23,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(349,12,'emerson mancía','central',17,NULL,22,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(350,12,'robin borjas','medio_central',8,NULL,26,'hondureño','2026-04-21 19:19:57',NULL,NULL,60,46,1),(351,12,'michael rodríguez quiñonez','medio_central',10,NULL,27,'nicaragüense','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,1),(352,12,'edwin Sánchez','medio_central',7,NULL,25,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,40,46,1),(353,12,'wilson rugama','medio_central',11,NULL,24,'nicaragüense','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(354,12,'fernando clavel','medio_central',14,NULL,28,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,1),(355,12,'rené granados','medio_central',19,NULL,26,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(356,12,'wálter chigüila','medio_central',20,NULL,27,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(357,12,'víctor torres','medio_central',21,NULL,23,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(358,12,'joshua gallardo','centrodelantero',9,NULL,26,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,82,48,1),(359,12,'dany cetré','centrodelantero',18,NULL,25,'colombiano','2026-04-21 19:19:57',NULL,NULL,36,22,0),(360,12,'enrique rivas','centrodelantero',22,NULL,24,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,64,22,0),(361,12,'carlos martínez','centrodelantero',25,NULL,23,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(362,12,'jonathan hernández','centrodelantero',29,NULL,22,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,18,48,0),(363,10,'marlon joya','portero',1,NULL,27,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(364,10,'cristian bonilla','portero',12,NULL,23,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(365,10,'jeremy rodríguez','portero',22,NULL,20,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(366,10,'guillermo fuentes','central',4,NULL,27,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(367,10,'anderson portillo','central',3,NULL,25,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(368,10,'jonathan quintanilla','central',5,NULL,28,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(369,10,'ronald padilla','central',6,NULL,26,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(370,10,'francisco carballo','central',2,NULL,29,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(371,10,'reinaldo aparicio','central',15,NULL,24,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(372,10,'daniel marquez','central',17,NULL,23,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(373,10,'daniel arévalo','medio_central',8,NULL,25,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(374,10,'elias umeres','medio_central',10,NULL,27,'peruano','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(375,10,'luis hinestroza','medio_central',7,NULL,26,'colombiano','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(376,10,'herbert sosa','medio_central',11,NULL,24,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(377,10,'kevin garay','medio_central',14,NULL,23,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(378,10,'oscar cerén','centrodelantero',9,NULL,26,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(379,10,'alesson','centrodelantero',18,NULL,24,'brasileño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(380,10,'paolo ulloa','centrodelantero',21,NULL,22,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(426,15,'kevin carabantes','portero',1,NULL,29,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(427,15,'jonathan valle','portero',12,NULL,24,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(428,15,'diogo figueiras','central',4,NULL,28,'portugués','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(429,15,'jorge cruz','central',3,NULL,27,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(430,15,'miguel murillo','central',5,NULL,26,'colombiano','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(431,15,'rudy clavel','central',6,NULL,29,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(432,15,'josé guevara','central',2,NULL,25,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(433,15,'edson meléndez','central',15,NULL,24,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(434,15,'juan vega','central',17,NULL,23,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(435,15,'diego chávez','central',20,NULL,22,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(436,15,'david funes','central',16,NULL,25,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(437,15,'kevin santamaría','medio_central',8,NULL,26,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(438,15,'yan maciel','medio_central',10,NULL,27,'brasileño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(439,15,'elmer bonilla','medio_central',7,NULL,27,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(440,15,'jonathan nolasco','medio_central',11,NULL,25,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(441,15,'josé isaac portillo','medio_central',14,NULL,23,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(442,15,'roberto melgar','medio_central',19,NULL,28,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(443,15,'david montejo','medio_central',21,NULL,24,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(444,15,'nelson bonilla','centrodelantero',9,NULL,29,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(445,15,'rafael tejada','centrodelantero',18,NULL,26,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,1),(446,15,'edgar medrano','centrodelantero',NULL,NULL,25,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(447,15,'dustin corea','centrodelantero',22,NULL,24,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(448,15,'christopher ortiz','centrodelantero',25,NULL,22,'salvadoreño','2026-07-22 19:40:47',NULL,NULL,NULL,NULL,0),(449,8,'sergio sibrián molina','portero',1,NULL,21,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(450,8,'hector ramírez carvajal','portero',12,NULL,34,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(451,8,'adriel martínez castillo','portero',22,NULL,23,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(452,8,'lautaro toledo pacheco','central',4,NULL,23,'argentino','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(453,8,'guillermo nieves','central',3,NULL,27,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(454,8,'ruben marroquin','central',5,NULL,32,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(455,8,'jorge gonzález lemus','central',6,NULL,21,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(456,8,'alexis montes renderos','central',2,NULL,27,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(457,8,'kevin molina martínez','central',15,NULL,24,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(458,8,'kevin menjívar henriquez','central',16,NULL,24,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(459,8,'kevin oviedo','medio_central',8,NULL,27,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(460,8,'josé serrano montano','medio_central',10,NULL,21,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(461,8,'diego coca','medio_central',7,NULL,30,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(462,8,'bryan santos','medio_central',14,NULL,19,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(463,8,'guillermo stradella','medio_central',11,NULL,26,'argentino','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(464,8,'darwin cerén','medio_central',20,NULL,27,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(465,8,'jairo henríquez','medio_central',21,NULL,32,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(466,8,'melvin alfaro','centrodelantero',9,NULL,26,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(467,8,'michell mercado','centrodelantero',18,NULL,26,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(468,8,'carlos alfaro','centrodelantero',NULL,NULL,23,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(469,8,'edson garcía','centrodelantero',25,NULL,21,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(470,11,'daniel arroyo','portero',1,NULL,27,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(471,11,'william torres','portero',12,NULL,24,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,0),(472,11,'moises xavier garcia','central',4,NULL,28,'colombiano','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(473,11,'kevin menjívar','central',3,NULL,25,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(474,11,'diego mejía','central',5,NULL,27,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(475,11,'kevin calderón','central',6,NULL,24,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(476,11,'carlos arévalo','central',2,NULL,26,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(477,11,'emerson sandoval','medio_central',8,NULL,26,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(478,11,'jefferson roque','medio_central',10,NULL,25,'colombiano','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(479,11,'josué palacios','medio_central',7,NULL,24,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(480,11,'josé ventura','medio_central',11,NULL,27,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,0),(481,11,'franklin martínez','medio_central',14,NULL,23,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,0),(482,11,'wilmer novoa','medio_central',19,NULL,26,'venezolano','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,0),(483,11,'anthony roque','medio_central',20,NULL,22,'colombiano','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,0),(484,11,'yair arboleda','centrodelantero',9,NULL,27,'colombiano','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(485,11,'carlos bogotá','centrodelantero',18,NULL,25,'colombiano','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,1),(486,11,'bryan ríos','centrodelantero',21,NULL,22,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,0),(487,11,'luis aguilar','centrodelantero',25,NULL,24,'salvadoreño','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,0),(488,11,'sebastian ortiz','centrodelantero',22,NULL,23,'colombiano','2026-07-22 19:45:57',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `jugadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_ascenso`
--

DROP TABLE IF EXISTS `jugadores_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_ascenso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `posicion` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_ascenso`
--

LOCK TABLES `jugadores_ascenso` WRITE;
/*!40000 ALTER TABLE `jugadores_ascenso` DISABLE KEYS */;
INSERT INTO `jugadores_ascenso` VALUES (1,4,'esemaje','central',34,'uploads/jugadores_segunda/1775967215_ba8a0ca9.png',23,'223223','2026-04-12 04:13:46',NULL,NULL,NULL,NULL,1),(2,4,'eseotromaje','lateral_derecho',14,'uploads/jugadores_segunda/1775967235_ab9a59cd.png',34,'13232123','2026-04-12 04:14:17',NULL,NULL,NULL,NULL,1),(3,4,'Neuer','portero',1,NULL,20,'Aleman','2026-04-18 17:58:00',NULL,NULL,NULL,NULL,1),(4,4,'Lateral I','lateral_izquierdo',2,NULL,30,NULL,'2026-04-18 17:58:17',NULL,NULL,NULL,NULL,1),(5,4,'OTRO DF','central',5,NULL,NULL,NULL,'2026-04-18 17:58:47',NULL,NULL,NULL,NULL,1),(6,4,'MCD','medio_defensivo',5,NULL,20,NULL,'2026-04-18 17:59:11',NULL,NULL,NULL,NULL,1),(7,4,'MC','medio_central',56,NULL,20,NULL,'2026-04-18 17:59:49',NULL,NULL,NULL,NULL,1),(8,4,'MCO','medio_ofensivo',7,NULL,30,NULL,'2026-04-18 18:00:15',NULL,NULL,NULL,NULL,1),(9,4,'dsds','centrodelantero',44,NULL,45,NULL,'2026-04-18 18:01:09',NULL,NULL,NULL,NULL,1),(10,4,'SD','segundo_delantero',9,NULL,44,NULL,'2026-04-18 18:01:28',NULL,NULL,NULL,NULL,1),(11,4,'extremo i','extremo_izquierdo',21,NULL,22,NULL,'2026-04-18 18:02:16',NULL,NULL,NULL,NULL,1),(12,4,'EXT DER','extremo_derecho',65,NULL,21,NULL,'2026-04-18 18:03:07',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `jugadores_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_femenina`
--

DROP TABLE IF EXISTS `jugadores_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `posicion` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_femenina`
--

LOCK TABLES `jugadores_femenina` WRITE;
/*!40000 ALTER TABLE `jugadores_femenina` DISABLE KEYS */;
INSERT INTO `jugadores_femenina` VALUES (1,1,'samantha valadez','portero',25,NULL,21,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(2,1,'roxana vega','portero',1,NULL,27,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(3,1,'hazel silva','portero',24,NULL,NULL,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(4,1,'linda guillen','central',4,NULL,26,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(5,1,'priscila ortiz','central',17,NULL,30,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(6,1,'santana pressley','central',5,NULL,NULL,'estadounidense','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(7,1,'joseline rivas','central',8,NULL,32,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(8,1,'nicole cabrera','central',3,NULL,27,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(9,1,'rosmery mendoza','central',6,NULL,24,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(10,1,'iliana molina','central',16,NULL,17,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(11,1,'irma hernandez','central',23,NULL,26,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(12,1,'paola calderon','medio_central',9,NULL,24,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(13,1,'alejandra agundez','medio_central',27,NULL,20,'mexicana','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(14,1,'tatiana dabney','medio_central',7,NULL,NULL,'estadounidense','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(15,1,'paola ceren','medio_central',14,NULL,30,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(16,1,'yaneth sotelo','medio_central',26,NULL,21,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(17,1,'neyda martinez','medio_central',29,NULL,27,'mexicana','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(18,1,'raquel ramirez','medio_central',19,NULL,31,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(19,1,'ashley webb','centrodelantero',10,NULL,31,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(20,1,'genesis carpio','centrodelantero',12,NULL,18,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(21,1,'keyri garcia','centrodelantero',20,NULL,18,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(22,1,'gladis ulloa','centrodelantero',30,NULL,29,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `jugadores_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_segunda`
--

DROP TABLE IF EXISTS `jugadores_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `posicion` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_segunda`
--

LOCK TABLES `jugadores_segunda` WRITE;
/*!40000 ALTER TABLE `jugadores_segunda` DISABLE KEYS */;
/*!40000 ALTER TABLE `jugadores_segunda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_seleccion`
--

DROP TABLE IF EXISTS `jugadores_seleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `posicion` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atajadas` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion`
--

LOCK TABLES `jugadores_seleccion` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion` VALUES (1,'Mario González','portero',1,'/backend/uploads/seleccion_1783695511_6cc8d30a.png',29,'Salvadoreña','Deportivo San Carlos',12,0,0,'2026-06-10 02:30:54',0),(2,'Benji Villalobos','portero',12,NULL,26,'Salvadoreña','C.D. Águila',7,0,0,'2026-06-10 02:30:54',0),(3,'Tomás Romero','portero',22,NULL,26,'Salvadoreña','Minnesota United FC',5,0,0,'2026-06-10 02:30:54',0),(4,'Henry Romero','central',3,NULL,28,'Salvadoreña','Alianza FC',8,0,0,'2026-06-10 02:30:54',0),(5,'Julio Sibrián','central',4,NULL,27,'Salvadoreña','C.D. Águila',10,0,0,'2026-06-10 02:30:54',0),(6,'Rudy Clavel','central',5,NULL,25,'Salvadoreña','C.D. FAS',10,0,1,'2026-06-10 02:30:54',0),(7,'Jorge Cruz','lateral_derecho',2,NULL,26,'Salvadoreña','C.D. FAS',9,0,0,'2026-06-10 02:30:54',0),(8,'Bryan Tamacas','lateral_derecho',13,NULL,31,'Salvadoreña','Hércules CF',8,0,0,'2026-06-10 02:30:54',0),(9,'Alexander Larín','lateral_izquierdo',6,NULL,26,'Salvadoreña','Alianza FC',10,0,1,'2026-06-10 02:30:54',0),(10,'Adán Clímaco','lateral_izquierdo',23,NULL,24,'Salvadoreña','C.D. Águila',6,0,0,'2026-06-10 02:30:54',0),(11,'Roberto Domínguez','central',15,NULL,29,'Salvadoreña','C.D. FAS',6,0,0,'2026-06-10 02:30:54',0),(12,'Nelson Rodríguez','lateral_derecho',16,NULL,23,'Salvadoreña','C.D. Águila',5,0,0,'2026-06-10 02:30:54',0),(13,'Darwin Cerén','medio_central',7,NULL,33,'Salvadoreña','C.D. Águila',11,0,0,'2026-06-10 02:30:54',0),(14,'Brayan Landaverde','medio_central',8,NULL,26,'Salvadoreña','L.A. Firpo',10,0,0,'2026-06-10 02:30:54',0),(15,'Christian Martínez','medio_defensivo',14,NULL,25,'Salvadoreña','Alianza FC',9,0,0,'2026-06-10 02:30:54',0),(16,'Jefferson Valladares','medio_central',15,NULL,22,'Salvadoreña','C.D. Mpal. Limeño',7,0,0,'2026-06-10 02:30:54',0),(17,'Jairo Henríquez','medio_ofensivo',17,NULL,24,'Salvadoreña','L.A. Firpo',9,1,0,'2026-06-10 02:30:54',0),(18,'Marcelo Díaz','medio_central',12,NULL,23,'Salvadoreña','C.D. Águila',7,0,0,'2026-06-10 02:30:54',0),(19,'Mauricio Cerritos','medio_central',20,NULL,22,'Salvadoreña','L.A. Firpo',5,0,0,'2026-06-10 02:30:54',0),(20,'Harold Osorio','medio_ofensivo',19,NULL,25,'Salvadoreña','Alianza FC',8,1,0,'2026-06-10 02:30:54',0),(21,'Elmer Bonilla','medio_central',21,NULL,23,'Salvadoreña','C.D. FAS',4,0,0,'2026-06-10 02:30:54',0),(22,'Joshua Pérez','extremo_derecho',10,NULL,28,'Salvadoreña','Houston Dynamo',9,0,0,'2026-06-10 02:30:54',0),(23,'Nathan Ordaz','extremo_izquierdo',11,NULL,22,'Salvadoreña','FC Dallas',8,0,3,'2026-06-10 02:30:54',0),(24,'Brayan Gil','extremo_derecho',9,NULL,27,'Salvadoreña','Portland Timbers',9,2,0,'2026-06-10 02:30:54',0),(25,'Styven Vásquez','extremo_izquierdo',18,NULL,26,'Salvadoreña','Alianza FC',7,0,0,'2026-06-10 02:30:54',0),(26,'Emerson Mauricio','centrodelantero',24,NULL,27,'Salvadoreña','C.D. Águila',6,0,0,'2026-06-10 02:30:54',0),(27,'Rafael Tejada','centrodelantero',25,NULL,24,'Salvadoreña','L.A. Firpo',5,0,0,'2026-06-10 02:30:54',0),(28,'Francis Castillo','segundo_delantero',26,NULL,24,'Salvadoreña','Columbus Crew',7,0,1,'2026-06-10 02:30:54',0);
/*!40000 ALTER TABLE `jugadores_seleccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_seleccion_femenina`
--

DROP TABLE IF EXISTS `jugadores_seleccion_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `posicion` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `atajadas` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion_femenina`
--

LOCK TABLES `jugadores_seleccion_femenina` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion_femenina` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion_femenina` VALUES (4,'Idalia Serrano','portero',NULL,NULL,26,'Salvadoreña','AS Volos 2004 WFC',0,0,0,0,'2026-07-03 16:52:49'),(5,'Samantha Valadez','portero',NULL,NULL,21,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49'),(6,'Riley Meléndez','portero',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(7,'Juana Plata','lateral_izquierdo',NULL,NULL,26,'Salvadoreña','Monterrey',0,0,0,0,'2026-07-03 16:52:49'),(8,'Vashy Delgado','central',NULL,NULL,32,'Salvadoreña','Mazatlán FC',0,0,0,0,'2026-07-03 16:52:49'),(9,'Elaily Hernández','central',NULL,NULL,26,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(10,'Nicole Amaya','lateral_derecho',NULL,NULL,23,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(11,'Laila Saravia','central',NULL,NULL,NULL,'Salvadoreña','Pacific Tigers',0,0,0,0,'2026-07-03 16:52:49'),(12,'Linda Guillén','central',NULL,NULL,26,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49'),(13,'Priscila Ortiz','central',NULL,NULL,30,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49'),(14,'Irma Molina','central',NULL,NULL,26,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(15,'Joseline Rivas','central',NULL,NULL,32,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49'),(16,'Reina Cruz','central',NULL,NULL,30,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(17,'Jasmine Dybala','central',NULL,NULL,NULL,'Salvadoreña','Sam Houston State Bearkats',0,0,0,0,'2026-07-03 16:52:49'),(18,'Victoria Meza','lateral_derecho',NULL,NULL,NULL,'Salvadoreña','Texas State Bobcats',0,0,0,0,'2026-07-03 16:52:49'),(19,'Brenda Ceren','extremo_derecho',NULL,NULL,27,'Salvadoreña','Cruz Azul',0,0,0,0,'2026-07-03 16:52:49'),(20,'Samantha Fisher','centrodelantero',NULL,NULL,26,'Salvadoreña','Sassuolo',0,0,0,0,'2026-07-03 16:52:49'),(21,'Danielle Fuentes','centrodelantero',NULL,NULL,25,'Salvadoreña','Tijuana',0,0,0,0,'2026-07-03 16:52:49'),(22,'Danya Gutiérrez','medio_central',NULL,NULL,26,'Salvadoreña','Club León',0,0,0,0,'2026-07-03 16:52:49'),(23,'Victoria Sánchez','medio_central',NULL,NULL,21,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(24,'Makenna Domínguez','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(25,'Paola Calderón','medio_central',NULL,NULL,24,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49'),(26,'Emely Rubio','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(27,'Alejandra Chirino','medio_central',NULL,NULL,35,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(28,'Jackeline Velásquez','medio_central',NULL,NULL,30,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(29,'Isabella Recinos','medio_central',NULL,NULL,23,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(30,'Amber Marinero','medio_central',NULL,NULL,28,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(31,'Angie Machado','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(32,'Katerin Morales','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(33,'Gabriela Rodríguez','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49'),(34,'Karen Reyes','centrodelantero',NULL,NULL,28,'Salvadoreña','NPS Volos',0,0,0,0,'2026-07-03 16:52:49'),(35,'Samaria Gómez','centrodelantero',NULL,NULL,24,'Salvadoreña','Amed Sportif Faaliyetler',0,0,0,0,'2026-07-03 16:52:49'),(36,'Yoselyn Abigail Lopez','centrodelantero',NULL,NULL,25,'Salvadoreña','Mazatlán FC',0,0,0,0,'2026-07-03 16:52:49');
/*!40000 ALTER TABLE `jugadores_seleccion_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_seleccion_sub17`
--

DROP TABLE IF EXISTS `jugadores_seleccion_sub17`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion_sub17` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `posicion` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `atajadas` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion_sub17`
--

LOCK TABLES `jugadores_seleccion_sub17` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion_sub17` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion_sub17` VALUES (1,'Oliver Alegría-Sigernes','portero',1,NULL,19,'Salvadoreña','El Salvador',3,0,0,22,'2026-07-03 18:12:52'),(2,'Peter Cornejo','portero',18,NULL,17,'Salvadoreña','El Salvador',1,0,0,0,'2026-07-03 18:12:52'),(3,'Alfredo Esquivel','portero',21,NULL,18,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 18:12:52'),(4,'José Gutierrez','central',2,NULL,18,'Salvadoreña','El Salvador',3,0,1,0,'2026-07-03 18:12:52'),(5,'Marvin Mejía','central',4,NULL,18,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(6,'Jefferson Perla','central',5,NULL,16,'Salvadoreña','El Salvador',2,0,0,0,'2026-07-03 18:12:52'),(7,'Andrew Reyes','central',13,NULL,18,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(8,'Emerson Guardado','central',17,NULL,17,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(9,'Adonis Campos','central',20,NULL,18,'Salvadoreña','El Salvador',2,0,0,0,'2026-07-03 18:12:52'),(10,'Esteban Hernández','medio_central',6,NULL,17,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 18:12:52'),(11,'Rafael Inojosa','medio_central',8,NULL,18,'Salvadoreña','El Salvador',1,0,0,0,'2026-07-03 18:12:52'),(12,'Anthony Umanzor','medio_central',10,NULL,18,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(13,'Jarell Bonilla','medio_central',11,NULL,18,'Salvadoreña','El Salvador',1,0,0,0,'2026-07-03 18:12:52'),(14,'Anderson Castillo','centrodelantero',3,NULL,22,'Salvadoreña','Ecuador',3,0,0,0,'2026-07-03 18:12:52'),(15,'Kerin Torres','centrodelantero',7,NULL,17,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(16,'Luis Tobar','centrodelantero',9,NULL,18,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(17,'Mayson Barillas','centrodelantero',12,NULL,17,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(18,'Brandon Ramírez','centrodelantero',14,NULL,17,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(19,'Steven Espinoza','centrodelantero',15,NULL,18,'Salvadoreña','El Salvador',3,0,0,0,'2026-07-03 18:12:52'),(20,'Diego Mejía','centrodelantero',16,NULL,17,'Salvadoreña','El Salvador',1,0,0,0,'2026-07-03 18:12:52'),(21,'Ovidio Hernández','centrodelantero',19,NULL,17,'Salvadoreña','El Salvador',2,0,0,0,'2026-07-03 18:12:52');
/*!40000 ALTER TABLE `jugadores_seleccion_sub17` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_seleccion_sub20`
--

DROP TABLE IF EXISTS `jugadores_seleccion_sub20`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion_sub20` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `posicion` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numero_camiseta` int DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `atajadas` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion_sub20`
--

LOCK TABLES `jugadores_seleccion_sub20` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion_sub20` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion_sub20` VALUES (1,'Oliver Alegría Sigernes','portero',NULL,NULL,17,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(2,'Peter Cornejo','portero',NULL,NULL,17,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(3,'Máximo Sandoval','portero',NULL,NULL,18,'Salvadoreña','C.D. Platense Zacatecoluca',0,0,0,0,'2026-07-03 18:07:26'),(4,'Itzel Colocho','central',NULL,NULL,19,'Salvadoreña','Espanyol U18',0,0,0,0,'2026-07-03 18:07:26'),(5,'José Guatemala','central',NULL,NULL,18,'Salvadoreña','CD Águila',0,0,0,0,'2026-07-03 18:07:26'),(6,'Emerson Guardado','central',NULL,NULL,17,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(7,'Hugo Aguilar','central',NULL,NULL,19,'Salvadoreña','Isidro Metapán',0,0,0,0,'2026-07-03 18:07:26'),(8,'Jonathan López','central',NULL,NULL,19,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(9,'Jonathan Aguirre','central',NULL,NULL,19,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(10,'Alexander White','central',NULL,NULL,17,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(11,'Gabriel Arnold','medio_central',NULL,NULL,19,'Salvadoreña','Ventura County FC',0,0,0,0,'2026-07-03 18:07:26'),(12,'Johann Ortiz','medio_central',NULL,NULL,19,'Salvadoreña','Sporting Kansas City II',0,0,0,0,'2026-07-03 18:07:26'),(13,'Steven Espinoza','medio_central',NULL,NULL,18,'Salvadoreña','Juventud Independiente',0,0,0,0,'2026-07-03 18:07:26'),(14,'Jefferson Roque','medio_central',NULL,NULL,19,'Salvadoreña','C.D. Platense Zacatecoluca',0,0,0,0,'2026-07-03 18:07:26'),(15,'William Cabrera','medio_central',NULL,NULL,18,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(16,'Anderson Portillo','medio_central',NULL,NULL,18,'Salvadoreña','CD Cacahuatique',0,0,0,0,'2026-07-03 18:07:26'),(17,'Diego Peña','medio_central',NULL,NULL,19,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(18,'Christian Coreas','centrodelantero',NULL,NULL,19,'Salvadoreña','No team',0,0,0,0,'2026-07-03 18:07:26'),(19,'Luis Tobar','centrodelantero',NULL,NULL,18,'Salvadoreña','Alianza FC',0,0,0,0,'2026-07-03 18:07:26'),(20,'Wilber Díaz','centrodelantero',NULL,NULL,19,'Salvadoreña','CD FAS',0,0,0,0,'2026-07-03 18:07:26'),(21,'Aiden Benítez','centrodelantero',NULL,NULL,19,'Salvadoreña','Butler Bulldogs',0,0,0,0,'2026-07-03 18:07:26'),(22,'Ariel Miranda','centrodelantero',NULL,NULL,19,'Salvadoreña','Isidro Metapán',0,0,0,0,'2026-07-03 18:07:26');
/*!40000 ALTER TABLE `jugadores_seleccion_sub20` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `email_apodo` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `intento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ip_intento` (`ip`,`intento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_attempts`
--

LOCK TABLES `login_attempts` WRITE;
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `login_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match_comments`
--

DROP TABLE IF EXISTS `match_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `partido_id` int NOT NULL,
  `division` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'primera',
  `minuto` int NOT NULL DEFAULT '0',
  `tipo` enum('gol','gol_penal','gol_cabeza','gol_tiro_libre','asistencia','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','descanso','fin','penal') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'comentario',
  `descripcion` text COLLATE utf8mb4_general_ci NOT NULL,
  `equipo` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `jugador_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_partido` (`partido_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_comments`
--

LOCK TABLES `match_comments` WRITE;
/*!40000 ALTER TABLE `match_comments` DISABLE KEYS */;
INSERT INTO `match_comments` VALUES (14,76,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. Municipal Limeño 0 - 0 C.D. Águila.','C.D. Municipal Limeño',NULL,'2026-06-08 15:39:57'),(16,77,'primera',15,'gol','⚽ ¡GOOOOOL! Oscar Rodríguez marca para Alianza F.C. en el minuto 15.','Alianza F.C.',138,'2026-06-08 15:42:14'),(17,77,'primera',45,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.','Alianza F.C.',NULL,'2026-06-08 15:42:29'),(18,77,'primera',0,'inicio','▶️ ¡Arranca el partido! Segunda parte en juego.','Alianza F.C.',NULL,'2026-06-08 15:43:03'),(19,77,'primera',45,'comentario','Inicio de la segunda parte','Alianza F.C.',NULL,'2026-06-08 15:43:21'),(20,77,'primera',65,'gol_cabeza','🤕 ¡Gol de CABEZA! William Canales conecta de manera impresionante. Minuto 0.','Alianza F.C.',131,'2026-06-08 15:43:46'),(21,77,'primera',89,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 2 - 0 Inter TECLA.','Alianza F.C.',NULL,'2026-06-08 15:43:52'),(22,78,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-06-08 16:11:26'),(23,78,'primera',9,'cambio','🔄 Cambio en C.D. FAS: Sale Kevin Carabantes, entra Jonathan Nolasco. Minuto 9.','C.D. FAS',230,'2026-06-08 16:21:19'),(24,78,'primera',140,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 0-0.','',NULL,'2026-06-08 18:31:34'),(25,78,'primera',45,'inicio','▶️ ¡Empieza la segunda parte!','',NULL,'2026-06-08 20:13:24'),(26,78,'primera',138,'cambio','🔄 Cambio en C.D. FAS: Sale Jonathan Valle, entra Kevin Carabantes. Minuto 138.','C.D. FAS',216,'2026-06-08 21:46:28'),(27,78,'primera',153,'tarjeta_amarilla','🟨 Tarjeta amarilla para Brayan Landaverde de L.A. Firpo. Minuto 153.','L.A. Firpo',109,'2026-06-08 22:02:19'),(28,78,'primera',154,'tarjeta_roja','🟥 ¡Tarjeta ROJA! Brayan Landaverde queda expulsado. Minuto 154.','L.A. Firpo',109,'2026-06-08 22:02:48'),(29,78,'primera',154,'cambio','🔄 Cambio en L.A. Firpo: Sale Lucas R., entra Marvin Aranda. Minuto 154.','L.A. Firpo',117,'2026-06-08 22:03:21'),(30,78,'primera',182,'cambio','🔄 Cambio en L.A. Firpo: Sale Wilberth Hernández, entra Misael Erazo. Minuto 182. [SALE:98]','L.A. Firpo',99,'2026-06-08 22:30:29'),(31,78,'primera',204,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. FAS 0 - 0 L.A. Firpo.','C.D. FAS',NULL,'2026-06-08 22:53:23'),(32,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-08 20:17:15'),(33,74,'primera',1,'cambio','🔄 Cambio en C.D. FAS: Sale José Guevara, entra Juan Vega. Minuto 1. [SALE:222]','C.D. FAS',224,'2026-07-08 20:18:34'),(34,74,'primera',4,'gol','⚽ ¡GOOOOOL! Juan Vega marca para C.D. FAS en el minuto 4.','C.D. FAS',224,'2026-07-08 20:22:11'),(35,74,'primera',5,'gol','⚽ ¡GOOOOOL! Yan Maciel marca para C.D. FAS en el minuto 5.','C.D. FAS',228,'2026-07-08 20:22:51'),(36,74,'primera',92,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 0 - 2 C.D. FAS.','Alianza F.C.',NULL,'2026-07-10 15:11:07'),(37,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-10 15:25:16'),(38,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-10 15:25:18'),(39,74,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 0 - 2 C.D. FAS.','Alianza F.C.',NULL,'2026-07-10 15:25:25'),(40,79,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-15 14:27:33'),(41,79,'primera',0,'cambio','🔄 Cambio en L.A. Firpo: Sale Misael Erazo, entra Wilberth Hernández. Minuto 0. [SALE:99]','L.A. Firpo',98,'2026-07-15 14:28:01'),(42,79,'primera',1,'cambio','🔄 Cambio en L.A. Firpo: Sale Cristian Gil, entra Diego Ortez. Minuto 1. [SALE:119]','L.A. Firpo',116,'2026-07-15 14:29:13'),(43,79,'primera',26,'gol','⚽ ¡GOOOOOL! Jugador marca para Alianza F.C..','Alianza F.C.',NULL,'2026-07-15 14:29:52'),(44,79,'primera',45,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.','Alianza F.C.',NULL,'2026-07-15 14:30:07'),(45,79,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 1 - 0 L.A. Firpo.','Alianza F.C.',NULL,'2026-07-15 14:30:23');
/*!40000 ALTER TABLE `match_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticias`
--

DROP TABLE IF EXISTS `noticias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `contenido` text COLLATE utf8mb4_general_ci,
  `categoria` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `autor` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `media` text COLLATE utf8mb4_general_ci,
  `estado` enum('Publicado','Borrador') COLLATE utf8mb4_general_ci DEFAULT 'Publicado',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
INSERT INTO `noticias` VALUES (13,'Nueva Liga de Ascenso en El Salvador #2026','Esta es la lista oficial de los equipos que participaran en la competiciones la liga de ascenso','Liga de Ascenso','Números y Fútbol',NULL,'Publicado','2026-07-24 13:32:53','http://numeros-y-futbol.test/backend/uploads/6a636984ef224.mp4');
/*!40000 ALTER TABLE `noticias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos`
--

DROP TABLE IF EXISTS `partidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_local` int DEFAULT NULL,
  `equipo_visitante` int DEFAULT NULL,
  `goles_local` int DEFAULT '0',
  `goles_visitante` int DEFAULT '0',
  `jugado` tinyint(1) DEFAULT '0',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `jornada` int DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos`
--

LOCK TABLES `partidos` WRITE;
/*!40000 ALTER TABLE `partidos` DISABLE KEYS */;
INSERT INTO `partidos` VALUES (81,15,7,NULL,NULL,0,'2026-07-25 01:30:00',1,'Pendiente',0),(84,10,9,0,0,0,'2026-07-25 21:00:00',1,'Pendiente',0),(86,17,8,0,0,0,'2026-07-25 21:00:00',1,'Pendiente',0),(87,18,5,0,0,0,'2026-07-26 00:00:00',1,'Pendiente',0),(88,6,4,0,0,0,'2026-07-26 21:00:00',1,'Pendiente',0),(89,12,11,0,0,0,'2026-07-26 21:00:00',1,'Pendiente',0);
/*!40000 ALTER TABLE `partidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_ascenso`
--

DROP TABLE IF EXISTS `partidos_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_ascenso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int DEFAULT NULL,
  `visitante_id` int DEFAULT NULL,
  `goles_local` int DEFAULT NULL,
  `goles_visitante` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_ascenso`
--

LOCK TABLES `partidos_ascenso` WRITE;
/*!40000 ALTER TABLE `partidos_ascenso` DISABLE KEYS */;
INSERT INTO `partidos_ascenso` VALUES (3,47,24,0,0,'2026-07-17',NULL,'Pendiente',1,'2026-07-17 15:44:46');
/*!40000 ALTER TABLE `partidos_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_copa`
--

DROP TABLE IF EXISTS `partidos_copa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_copa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_local_id` int NOT NULL COMMENT 'ID en equipos_copa',
  `equipo_visitante_id` int NOT NULL COMMENT 'ID en equipos_copa',
  `goles_local` int DEFAULT NULL,
  `goles_visitante` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` enum('Pendiente','En Curso','Finalizado') COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `fase` enum('grupos','octavos','cuartos','semis','final') COLLATE utf8mb4_general_ci DEFAULT 'grupos',
  `llave` int DEFAULT NULL,
  `grupo_copa` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Solo fase grupos: A-F',
  `jornada` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'ida/vuelta',
  `orden` int NOT NULL DEFAULT '0',
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
) ENGINE=InnoDB AUTO_INCREMENT=698 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_copa`
--

LOCK TABLES `partidos_copa` WRITE;
/*!40000 ALTER TABLE `partidos_copa` DISABLE KEYS */;
INSERT INTO `partidos_copa` VALUES (606,214,199,0,2,'2026-04-08','15:00:00','Finalizado','octavos',NULL,NULL,'ida',1,NULL,NULL,'2026-07-10 22:09:26','2026-07-15 13:38:04'),(607,199,214,3,0,'2026-04-24','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',1,NULL,NULL,'2026-07-10 22:10:22','2026-07-15 13:38:04'),(608,200,204,3,1,'2026-04-07','19:00:00','Finalizado','octavos',NULL,NULL,'ida',2,NULL,NULL,'2026-07-11 02:28:10','2026-07-15 13:38:04'),(609,204,200,1,1,'2026-04-21','17:00:00','Finalizado','octavos',NULL,NULL,'vuelta',2,NULL,NULL,'2026-07-11 19:38:12','2026-07-15 13:38:04'),(610,245,202,0,0,'2026-04-09','17:00:00','Finalizado','octavos',NULL,NULL,'ida',3,NULL,NULL,'2026-07-12 01:26:24','2026-07-15 13:38:04'),(611,202,245,2,1,'2026-04-23','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',3,NULL,NULL,'2026-07-12 01:27:07','2026-07-15 13:38:04'),(612,229,201,2,4,'2026-04-08','17:00:00','Finalizado','octavos',NULL,NULL,'ida',4,NULL,NULL,'2026-07-12 02:03:01','2026-07-15 13:44:13'),(613,201,229,4,1,'2026-04-22','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',4,NULL,NULL,'2026-07-12 02:04:10','2026-07-15 13:44:13'),(614,219,210,1,5,'2026-04-08','17:00:00','Finalizado','octavos',NULL,NULL,'ida',5,NULL,NULL,'2026-07-12 02:05:35','2026-07-15 13:44:16'),(615,210,219,4,1,'2026-04-21','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',5,NULL,NULL,'2026-07-12 02:07:36','2026-07-15 13:44:16'),(616,206,207,1,1,'2026-04-09','17:00:00','Finalizado','octavos',NULL,NULL,'ida',6,NULL,NULL,'2026-07-12 02:11:22','2026-07-15 13:44:19'),(617,207,206,1,0,'2026-04-21','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',6,NULL,NULL,'2026-07-12 02:15:16','2026-07-15 13:44:19'),(622,199,200,NULL,NULL,'2026-09-02','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',1,NULL,NULL,'2026-07-12 02:25:53','2026-07-15 13:49:20'),(623,205,203,NULL,NULL,'2026-09-09','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',4,NULL,NULL,'2026-07-15 13:21:04','2026-07-15 13:50:25'),(624,202,201,NULL,NULL,'2026-09-02','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',2,NULL,NULL,'2026-07-15 13:49:48','2026-07-15 13:50:30'),(625,210,207,NULL,NULL,'2026-09-02','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',3,NULL,NULL,'2026-07-15 13:50:20','2026-07-15 13:50:30'),(662,202,221,1,1,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(663,206,234,3,1,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(664,202,234,1,1,'2026-02-25','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(665,206,221,0,0,'2026-02-25','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(666,221,234,0,0,'2026-03-10','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(667,202,206,2,1,'2026-03-11','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(668,219,201,1,4,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(669,251,207,0,3,'2026-02-12','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(670,207,201,0,1,'2026-02-26','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(671,251,219,0,1,'2026-02-26','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(672,219,207,3,3,'2026-03-11','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(673,201,251,2,0,'2026-03-12','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(674,199,218,0,3,'2026-02-10','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(675,205,245,4,1,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(676,245,218,3,0,'2026-02-24','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(677,205,199,0,1,'2026-02-25','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(678,199,245,1,1,'2026-03-10','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(679,205,218,3,0,'2026-03-11','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(680,200,236,2,2,'2026-02-12','15:00:00','Finalizado','grupos',NULL,'D',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(682,200,214,1,0,'2026-02-24','15:00:00','Finalizado','grupos',NULL,'D',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(685,214,236,1,0,'2026-03-12','15:00:00','Finalizado','grupos',NULL,'D',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(686,229,211,2,0,'2026-02-10','15:00:00','Finalizado','grupos',NULL,'E',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(687,210,229,3,2,'2026-02-24','15:00:00','Finalizado','grupos',NULL,'E',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(689,210,211,2,0,'2026-03-10','15:00:00','Finalizado','grupos',NULL,'E',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(692,203,230,4,1,'2026-02-10','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(693,204,212,2,0,'2026-02-12','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(694,212,230,2,0,'2026-02-24','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(695,204,203,1,1,'2026-02-26','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(696,204,230,1,0,'2026-03-10','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),(697,203,212,3,1,'2026-03-11','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06');
/*!40000 ALTER TABLE `partidos_copa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_femenina`
--

DROP TABLE IF EXISTS `partidos_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_local` int DEFAULT NULL,
  `equipo_visitante` int DEFAULT NULL,
  `goles_local` int DEFAULT '0',
  `goles_visitante` int DEFAULT '0',
  `jugado` tinyint(1) DEFAULT '0',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_femenina`
--

LOCK TABLES `partidos_femenina` WRITE;
/*!40000 ALTER TABLE `partidos_femenina` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidos_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_segunda`
--

DROP TABLE IF EXISTS `partidos_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int DEFAULT NULL,
  `visitante_id` int DEFAULT NULL,
  `goles_local` int DEFAULT '0',
  `goles_visitante` int DEFAULT '0',
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_segunda`
--

LOCK TABLES `partidos_segunda` WRITE;
/*!40000 ALTER TABLE `partidos_segunda` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidos_segunda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_seleccion`
--

DROP TABLE IF EXISTS `partidos_seleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `rival_logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `goles_favor` int DEFAULT NULL,
  `goles_contra` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `competicion` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lugar` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_seleccion`
--

LOCK TABLES `partidos_seleccion` WRITE;
/*!40000 ALTER TABLE `partidos_seleccion` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidos_seleccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_seleccion_femenina`
--

DROP TABLE IF EXISTS `partidos_seleccion_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion_femenina` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `rival_logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `goles_favor` int DEFAULT NULL,
  `goles_contra` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `competicion` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lugar` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_seleccion_femenina`
--

LOCK TABLES `partidos_seleccion_femenina` WRITE;
/*!40000 ALTER TABLE `partidos_seleccion_femenina` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidos_seleccion_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_seleccion_sub17`
--

DROP TABLE IF EXISTS `partidos_seleccion_sub17`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion_sub17` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `rival_logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `goles_favor` int DEFAULT NULL,
  `goles_contra` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `competicion` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lugar` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_seleccion_sub17`
--

LOCK TABLES `partidos_seleccion_sub17` WRITE;
/*!40000 ALTER TABLE `partidos_seleccion_sub17` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidos_seleccion_sub17` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_seleccion_sub20`
--

DROP TABLE IF EXISTS `partidos_seleccion_sub20`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion_sub20` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `rival_logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `goles_favor` int DEFAULT NULL,
  `goles_contra` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `competicion` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lugar` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_seleccion_sub20`
--

LOCK TABLES `partidos_seleccion_sub20` WRITE;
/*!40000 ALTER TABLE `partidos_seleccion_sub20` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidos_seleccion_sub20` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_tercera`
--

DROP TABLE IF EXISTS `partidos_tercera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_tercera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `local_id` int DEFAULT NULL,
  `visitante_id` int DEFAULT NULL,
  `goles_local` int DEFAULT '0',
  `goles_visitante` int DEFAULT '0',
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_tercera`
--

LOCK TABLES `partidos_tercera` WRITE;
/*!40000 ALTER TABLE `partidos_tercera` DISABLE KEYS */;
/*!40000 ALTER TABLE `partidos_tercera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_tokens`
--

DROP TABLE IF EXISTS `reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `codigo` varchar(6) COLLATE utf8mb4_general_ci NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expira_en` timestamp NOT NULL DEFAULT ((now() + interval 15 minute)),
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_tokens`
--

LOCK TABLES `reset_tokens` WRITE;
/*!40000 ALTER TABLE `reset_tokens` DISABLE KEYS */;
INSERT INTO `reset_tokens` VALUES (25,'vanesotomayor0411@gmail.com','b5f5e7b7ad927f88674acd84a4fb06c25f002a3f1d372972f02eb2ba4ee0234d','768649','2026-04-22 05:11:21','2026-04-22 05:26:21',0),(27,'arielosotomayor0411@gmail.com','e2c21a18871756ae6b5735e6a6a9ee66718787f03b974436452c476f1e755040','067476','2026-07-03 22:09:05','2026-07-03 22:24:05',0);
/*!40000 ALTER TABLE `reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `key` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `value` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES ('contact_email',''),('facebook_url','https://www.facebook.com/profile.php?id=61590972174662&locale=es_LA'),('hero_banner_url','https://z-cdn-media.chatglm.cn/files/5838caa0-1db5-471c-a0b7-615971e5c6a9.png?auth_key=1874475322-63d59502a9bd4eccb11f4451b8b598a8-0-73a0c525630ab96d6c6d289fa8ba3645'),('hero_btn1_label','Últimas Noticias'),('hero_btn1_link','/news'),('hero_btn2_label','Ver Resultados'),('hero_btn2_link','/primera'),('hero_description','Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño en vivo.'),('hero_title','Noticias y numeros que genera el fútbol'),('instagram_url','https://www.youtube.com/channel/UCGQIRz57DlfpAtY570bApOg'),('maintenance_mode','0'),('maintenance_msg','Estamos trabajando para mejorar tu experiencia. Vuelve pronto.'),('site_description','Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño.'),('site_logo_url',''),('site_name','Números y Fútbol'),('twitter_url','');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones`
--

DROP TABLE IF EXISTS `tabla_posiciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones` (
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
) ENGINE=InnoDB AUTO_INCREMENT=545 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones`
--

LOCK TABLES `tabla_posiciones` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones` DISABLE KEYS */;
INSERT INTO `tabla_posiciones` VALUES (14,4,0,0,0,0,0,0,0),(17,5,0,0,0,0,0,0,0),(18,6,0,0,0,0,0,0,0),(21,7,0,0,0,0,0,0,0),(22,8,0,0,0,0,0,0,0),(23,9,0,0,0,0,0,0,0),(61,10,0,0,0,0,0,0,0),(74,11,0,0,0,0,0,0,0),(75,12,0,0,0,0,0,0,0),(384,15,0,0,0,0,0,0,0),(543,17,0,0,0,0,0,0,0),(544,18,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `tabla_posiciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_ascenso`
--

DROP TABLE IF EXISTS `tabla_posiciones_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_ascenso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `pj` int NOT NULL DEFAULT '0',
  `pg` int NOT NULL DEFAULT '0',
  `pe` int NOT NULL DEFAULT '0',
  `pp` int NOT NULL DEFAULT '0',
  `gf` int NOT NULL DEFAULT '0',
  `gc` int NOT NULL DEFAULT '0',
  `dg` int NOT NULL DEFAULT '0',
  `pts` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_ascenso`
--

LOCK TABLES `tabla_posiciones_ascenso` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_ascenso` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_ascenso` VALUES (1,1,0,0,0,0,0,0,0,0),(3,3,0,0,0,0,0,0,0,0),(9,9,0,0,0,0,0,0,0,0),(11,11,0,0,0,0,0,0,0,0),(12,12,0,0,0,0,0,0,0,0),(14,14,0,0,0,0,0,0,0,0),(19,19,0,0,0,0,0,0,0,0),(20,20,0,0,0,0,0,0,0,0),(22,22,0,0,0,0,0,0,0,0),(23,23,0,0,0,0,0,0,0,0),(24,24,0,0,0,0,0,0,0,0),(26,26,0,0,0,0,0,0,0,0),(30,30,0,0,0,0,0,0,0,0),(33,33,0,0,0,0,0,0,0,0),(34,34,0,0,0,0,0,0,0,0),(35,35,0,0,0,0,0,0,0,0),(36,36,0,0,0,0,0,0,0,0),(37,37,0,0,0,0,0,0,0,0),(38,38,0,0,0,0,0,0,0,0),(39,39,0,0,0,0,0,0,0,0),(47,47,0,0,0,0,0,0,0,0),(48,48,0,0,0,0,0,0,0,0),(49,49,0,0,0,0,0,0,0,0),(50,50,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `tabla_posiciones_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_femenina`
--

DROP TABLE IF EXISTS `tabla_posiciones_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_femenina` (
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_femenina`
--

LOCK TABLES `tabla_posiciones_femenina` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_femenina` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_femenina` VALUES (1,1,0,0,0,0,0,0,0),(2,2,0,0,0,0,0,0,0),(3,3,0,0,0,0,0,0,0),(4,4,0,0,0,0,0,0,0),(5,5,0,0,0,0,0,0,0),(6,6,0,0,0,0,0,0,0),(7,7,0,0,0,0,0,0,0),(9,9,0,0,0,0,0,0,0),(10,10,0,0,0,0,0,0,0),(11,11,0,0,0,0,0,0,0),(12,12,0,0,0,0,0,0,0),(13,13,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `tabla_posiciones_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_segunda`
--

DROP TABLE IF EXISTS `tabla_posiciones_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_segunda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `pj` int NOT NULL DEFAULT '0',
  `pg` int NOT NULL DEFAULT '0',
  `pe` int NOT NULL DEFAULT '0',
  `pp` int NOT NULL DEFAULT '0',
  `gf` int NOT NULL DEFAULT '0',
  `gc` int NOT NULL DEFAULT '0',
  `dg` int NOT NULL DEFAULT '0',
  `pts` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_segunda`
--

LOCK TABLES `tabla_posiciones_segunda` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_segunda` DISABLE KEYS */;
/*!40000 ALTER TABLE `tabla_posiciones_segunda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_tercera`
--

DROP TABLE IF EXISTS `tabla_posiciones_tercera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_tercera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `pj` int NOT NULL DEFAULT '0',
  `pg` int NOT NULL DEFAULT '0',
  `pe` int NOT NULL DEFAULT '0',
  `pp` int NOT NULL DEFAULT '0',
  `gf` int NOT NULL DEFAULT '0',
  `gc` int NOT NULL DEFAULT '0',
  `dg` int NOT NULL DEFAULT '0',
  `pts` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_tercera`
--

LOCK TABLES `tabla_posiciones_tercera` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_tercera` DISABLE KEYS */;
/*!40000 ALTER TABLE `tabla_posiciones_tercera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apodo` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rol` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `idx_apodo` (`apodo`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (9,'Ariel','Sirenoman123','unmaje@gmail.com','$2y$10$u7QxKMFb3dN2iT/fWCD5b.3bgl5lmRAya893EoHaItD3uWdl19Rue','admin'),(12,'Ariel Soto','sirenoman','vanesotomayor0411@gmail.com','$2y$10$G8nLBg96/DSykaQWI2fGzud7oha0.mj3wxdfTojNScxLcoWoeMWeS','usuario'),(13,'Alejandro','megatomayor','arielosotomayor0411@gmail.com','$2y$10$u.E3hJUD9o5jZF4LvMj2xOrRiZDgKBtXNtpOQAwImuRUkTls4/J82','usuario'),(14,'Administrador','admin','admin@numerosyfutbol.com','$2y$10$rKrhHWUuT21yNT4uQ0kjD./fQ4Dpnf1NLuOKRIVGwHAFCa5GF8/yO','admin');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitas`
--

DROP TABLE IF EXISTS `visitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip_hash` char(64) COLLATE utf8mb4_general_ci NOT NULL,
  `pagina` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_agent` text COLLATE utf8mb4_general_ci,
  `referer` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `es_bot` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ip` (`ip_hash`),
  KEY `idx_created` (`created_at`),
  KEY `idx_pagina` (`pagina`)
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas`
--

LOCK TABLES `visitas` WRITE;
/*!40000 ALTER TABLE `visitas` DISABLE KEYS */;
INSERT INTO `visitas` VALUES (157,'cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.69:8080/teams/femenina',0,'2026-07-17 14:21:06'),(158,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-17 15:44:22'),(159,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/',0,'2026-07-17 15:44:32'),(160,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/ascenso',0,'2026-07-17 15:44:51'),(161,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/partido/3/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/seleccion-femenina',0,'2026-07-17 15:45:08'),(162,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/partido/3/ascenso',0,'2026-07-17 15:45:22'),(163,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/partido/79/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/partido/3/ascenso',0,'2026-07-17 15:45:25'),(164,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/primera',0,'2026-07-17 15:45:57'),(165,'cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.69:8080/manage-seleccion-femenina',0,'2026-07-17 17:40:34'),(166,'ba91d6fa71b2cefb5610e841d538198332150dac3f500730ca0a850fade2f457','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/news',0,'2026-07-19 08:15:03'),(167,'4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','/','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','',0,'2026-07-22 02:46:52'),(168,'4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','/login','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','',0,'2026-07-22 02:47:07');
/*!40000 ALTER TABLE `visitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'numeros-y-futbol'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24  8:51:30
