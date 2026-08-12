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
-- Current Database: `numeros-y-futbol`
--

/*!40000 DROP DATABASE IF EXISTS `numeros-y-futbol`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `numeros-y-futbol` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `numeros-y-futbol`;

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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (43,'674fde78d5b5805fe59548b10e68cf1c3b05aa54bd885836d4f92cc5ec3c81bc',9,'admin','2026-07-29 19:29:24','2026-07-30 19:29:24');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `browser_visits`
--

LOCK TABLES `browser_visits` WRITE;
/*!40000 ALTER TABLE `browser_visits` DISABLE KEYS */;
INSERT INTO `browser_visits` VALUES (1,'87950662-a6e5-4b0e-8097-979d0cfb3a84','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','2026-07-17 15:44:22','2026-07-17 15:44:22',1),(2,'2d0c9c1b-61ec-4408-8711-26c9363996ed','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','2026-07-17 17:40:34','2026-07-17 17:40:34',1),(3,'5b6fa987-d7f2-453f-bd35-58d686efd2e4','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','2026-07-22 02:46:52','2026-07-22 02:46:52',1),(4,'3b0dcdae-bd89-4830-9269-d384ac3efc09','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','71dda6155cb3194aeed7a8516c4e9c89eef394047b9a02a6f121728a60655b50','2026-07-24 15:38:19','2026-07-25 21:46:44',3),(5,'8fdfca03-4fa7-4eb6-a5dd-027060c8e8e1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','2026-07-24 15:42:01','2026-07-24 15:42:01',1);
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
INSERT INTO `cuerpo_tecnico_seleccion` VALUES (1,'Hern??n Dar??o \"Bolillo\" G??mez','Director T??cnico','/backend/uploads/seleccion_1783695351_4a171df0.png','Colombia','2026-07-10 05:56:25'),(2,'H??ctor \"El Panzer\" Carvajal','Asistente T??cnico','/backend/uploads/seleccion_1783695912_da2a66d4.png','Colombia','2026-07-10 05:58:10'),(3,'Juan Mauricio Rold??n','Preparador F??sico','/backend/uploads/seleccion_1783695986_77ac5a2c.png','Colombia','2026-07-10 05:59:26'),(4,'Asdr??bal \"El Gato\" Men??ndez','Preparador F??sico',NULL,'El Salvador','2026-07-10 06:00:50');
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
INSERT INTO `equipos` VALUES (4,'L.A. Firpo','Usulut??n','Estadio Sergio Torres Rivera','uploads/1775237339_LAFIRPO.png','3-4-3'),(5,'Alianza F.C.','San Salvador',' Estadio Cuscatl??n','uploads/1775237448_alianzafc.png','4-4-2'),(6,'C.D. ??guila','San Miguel','Estadio Juan Francisco Barraza','uploads/1775237638_Aguila.png','4-4-2'),(7,'C.D. Municipal Lime??o','Santa Rosa de Lima','Estadio Dr. Ram??n Flores Berr??os','uploads/escudos/equipo_7_1779945347.png','4-4-2'),(8,'Inter Tecla','Santa Tecla','Estadio Nacional Las Delicias','uploads/escudos/equipo_8_1782942322.png','4-4-2'),(9,'A.D. Isidro Metap??n','Metap??n','Estadio Jorge \"Calero\" Su??rez','uploads/1775241152_metapan.png','4-4-2'),(10,'C.D. Cacahuatique','Ciudad Barrios','Estadio Municipal de Chapeltique','uploads/1775242518_cacahuatique.png','4-4-2'),(11,'C.D. Platense','Zacatecoluca','Antonio Toledo Valle','uploads/1775242938_platense.png','4-4-2'),(12,'C.D. Fuerte San Francisco','San Francisco Gotera','Estadio Correcaminos','uploads/1775243154_morazan.png','4-4-2'),(15,'C.D. FAS','Santa Ana','Estadio ??scar Alberto Quite??o','uploads/1775580005_FAS.png','4-4-2'),(17,'CD ATL.BALBOA','La Uni??n','Marcelino Imbers','uploads/1784694388_balboa.png','4-4-2'),(18,'CD Inca Aruba','Entre R??os','Estadio Anna Mercedes Campos.','uploads/1784694507_incaaruba.png','4-4-2');
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
INSERT INTO `equipos_ascenso` VALUES (1,'C.D. Fuerte Aguilares','Aguilares, San Salvador','Complejo Deportivo Teofilo J. Sim??n','uploads/1775366328_fuerte aguilares.webp','2026-04-05 05:18:48','4-4-2'),(3,'ADET-Aruba FC','Jayaque,  La Libertad','Estadio El Transito','uploads/1775366532_Aruba.webp','2026-04-05 05:22:12',NULL),(9,'C.D. Drag??n','San Miguel','Estadio Juan Fracisco Barraza','uploads/1775371713_dragon.png','2026-04-05 06:48:33',NULL),(11,'C.D. Cruzeiro','San Cayetano Istepeque, San Vicente','Complejo Deportivo Tecoluca','uploads/1775381059_cruzeiro.png','2026-04-05 09:24:19',NULL),(12,'C.D. Olimpico Litoral','Cerro de la Loma Larga','Complejo Deportivo Rafael L??pez','uploads/1775381230_litoral.png','2026-04-05 09:27:10',NULL),(14,'C.D. Neo Pipil','San Juan Nonualco','Estadio Neo Pipil','uploads/1775381481_neopipil.jpg','2026-04-05 09:31:21',NULL),(19,'A.D. Izalco','Izalco, Sonsonate','Estadio Municipal Salvador Mariona','uploads/1778808698_IZALCOs.png','2026-07-06 05:11:00',NULL),(20,'C.D. 11 Municipal','Ahuachap??n','Estadio Arturo Sime??n Maga??a','uploads/1778808985_C.D. 11 Municipal.png','2026-07-06 05:11:00',NULL),(22,'Marte Soyapango','Soyapango, San Salvador','Estadio Las Delicias','uploads/1783484543_martesouya.png','2026-07-06 05:11:00',NULL),(23,'Academia BP','Nuevo Cuscatl??n, La Libertad','Estadio Municipal Florencia','uploads/1778807456_academia bp2.png','2026-07-06 05:11:00',NULL),(24,'A.D. Tenancingo','Cuscatl??n','','uploads/1783347575_ad tenancinango.png','2026-07-06 05:11:00',NULL),(26,'CSD Vendaval','Apopa, San Salvador','Cancha Joaqu??n Guti??rres','uploads/1778807010_vendaval 2.png','2026-07-06 05:11:00',NULL),(30,'Audaz F.C.','Apastepeque, San Vicente','Estadio La Coyotera','uploads/1783563788_audaz.png','2026-07-06 05:11:00',NULL),(33,'A.D. San Marcos','Jiquilisco, Usulut??n','Estadio Topiltz??n','uploads/1783648047_cd sanmarc{.png','2026-07-06 05:11:00',NULL),(34,'FORFUT','Caba??as','','uploads/1783646890_forfut.png','2026-07-06 05:11:00',NULL),(35,'C.D. El Roble','Ilobasco, Caba??as','Estadio Municipal Mauricio Vides','uploads/1783645728_cd roble.png','2026-07-06 05:11:00',NULL),(36,'CD El Vencedor','Santa Elena, Usulut??n','Cancha Municipal Hurac??n','uploads/1778810314_CD EL VENCEDOT.png','2026-07-06 05:11:00',NULL),(37,'A.D. SESA','Guadalupe, San Vicente','Mini Estadio Vista al Volc??n','uploads/1783648245_sesa.png','2026-07-06 05:11:00',NULL),(38,'A.D. San Rafael','San Rafael Obrajuelo, La Paz','Estadio Jose Borjas Castillo','uploads/1783648175_san rafael.png','2026-07-06 05:11:00',NULL),(39,'C.D. Sal Y Mar','San Alejo, La Uni??n','Estadio San Sebastian','uploads/1783647558_cd sal.png','2026-07-06 05:11:00',NULL),(47,'11 LOBOS','Chalchuapa','','uploads/1784744810_11 lobos.png','2026-07-17 15:34:27',NULL),(48,'C.D. PUMAS','San Salvador','Estadio Universitario H??roes y M??rtires','uploads/1784784676_cd pumas.png','2026-07-17 15:40:21',NULL),(49,'ORI??N FC','Usulut??n','','uploads/1784744834_orion fc.png','2026-07-17 15:41:04',NULL),(50,'Nacional FC','Sonsonate','Estadio Municipal Ana Mercedes Campos','uploads/1784899661_nacional fc.jpg','2026-07-17 15:41:33',NULL);
/*!40000 ALTER TABLE `equipos_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_burgerking`
--

DROP TABLE IF EXISTS `equipos_burgerking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_burgerking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estadio` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `formacion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_burgerking`
--

LOCK TABLES `equipos_burgerking` WRITE;
/*!40000 ALTER TABLE `equipos_burgerking` DISABLE KEYS */;
INSERT INTO `equipos_burgerking` VALUES (25,'L.A. Firpo (U17)','Usulut??n','','uploads/escudos/burgerking_25_1784947453.png','4-4-2'),(26,'Alianza F.C. (U17)','San Salvador','','uploads/escudos/burgerking_26_1784947461.png','4-4-2'),(27,'C.D. ??guila (U17)','San Miguel','','uploads/escudos/burgerking_27_1784947470.png','4-4-2'),(28,'C.D. Municipal Lime??o (U17)','Santa Rosa de Lima','','uploads/escudos/burgerking_28_1784947478.png','4-4-2'),(29,'Inter Tecla (U17)','Santa Tecla','','uploads/escudos/burgerking_29_1784947499.png','4-4-2'),(30,'A.D. Isidro Metap??n (U17)','Metap??n','','uploads/escudos/burgerking_30_1784947522.png','4-4-2'),(31,'C.D. Cacahuatique (U17)','Ciudad Barrios','','uploads/escudos/burgerking_31_1784947547.png','4-4-2'),(32,'C.D. Platense (U17)','Zacatecoluca','','uploads/escudos/burgerking_32_1784947644.png','4-4-2'),(33,'C.D. Fuerte San Francisco (U17)','San Francisco Gotera','','uploads/escudos/burgerking_33_1784947654.png','4-4-2'),(34,'C.D. FAS (U17)','Santa Ana','','uploads/escudos/burgerking_34_1784947661.png','4-4-2'),(35,'CD ATL.BALBOA (U17)','La Uni??n','','uploads/escudos/burgerking_35_1784947680.png','4-4-2'),(36,'CD Inca Aruba (U17)','Entre R??os','','uploads/escudos/burgerking_36_1784947730.png','4-4-2');
/*!40000 ALTER TABLE `equipos_burgerking` ENABLE KEYS */;
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
INSERT INTO `equipos_copa` VALUES (199,4,'Primera','L.A. Firpo','uploads/1775237339_LAFIRPO.png','C',1),(200,5,'Primera','Alianza F.C.','uploads/1775237448_alianzafc.png','D',1),(201,6,'Primera','C.D. ??guila','uploads/1775237638_Aguila.png','B',1),(202,7,'Primera','C.D. Municipal Lime??o','uploads/escudos/equipo_7_1779945347.png','A',1),(203,8,'Primera','Inter TECLA','uploads/escudos/equipo_8_1782942322.png','F',1),(204,9,'Primera','A.D. Isidro Metap??n','uploads/1775241152_metapan.png','F',1),(205,10,'Primera','C.D. Cacahuatique','uploads/1775242518_cacahuatique.png','C',1),(206,11,'Primera','C.D. Platense','uploads/1775242938_platense.png','A',1),(207,12,'Primera','C.D. Fuerte','uploads/1775243154_morazan.png','B',1),(210,15,'Primera','C.D. FAS','uploads/1775580005_FAS.png','E',1),(211,1,'Ascenso','CD Fuerte Aguilares','uploads/1775366328_fuerte aguilares.webp','E',1),(212,2,'Ascenso','C.D. Talleres Jr','uploads/1775366458_cd talleres.webp','F',1),(213,3,'Ascenso','CD ADET-Aruba','uploads/1775366532_Aruba.webp',NULL,1),(214,4,'Ascenso',' AD Batanecos','uploads/1775366637_Batanecos.png','D',1),(215,5,'Ascenso','CD Inca','uploads/1775368426_C.D._Inca_S??per_Flat_logo.png',NULL,1),(216,6,'Ascenso','A.D. Juventud Independiente','uploads/1783646402_juventu.png',NULL,1),(217,7,'Ascenso','A.D. Espartano','uploads/1775369682_AD espartano.png',NULL,1),(218,8,'Ascenso','Sensunte FC','uploads/1775370748_sensunte.webp','C',1),(219,9,'Ascenso','C.D. Drag??n','uploads/1775371713_dragon.png','B',1),(220,10,'Ascenso','C.D. Atletico Balboa','uploads/1775381011_balboa.png',NULL,1),(221,11,'Ascenso','C.D. Cruzeiro','uploads/1775381059_cruzeiro.png','A',1),(222,12,'Ascenso','C.D. Olimpico Litoral','uploads/1775381230_litoral.png',NULL,1),(223,13,'Ascenso','C.D. Pipil','uploads/1775381319_pipil.png',NULL,1),(224,14,'Ascenso','C.D. Neo Pipil','uploads/1775381481_neopipil.jpg',NULL,1),(225,15,'Ascenso','AD Municipal','uploads/1783431838_ad municipal.png',NULL,1),(226,16,'Ascenso','CD Buenos Aires ','uploads/1783431010_cd buenos aires fc.png',NULL,1),(227,17,'Ascenso','UD Santos ','uploads/1783473058_U.D santos.png',NULL,1),(228,18,'Ascenso','Hachadura FC','uploads/1783430002_hachadura.png',NULL,1),(229,19,'Ascenso','AD Izalco','uploads/1778808698_IZALCOs.png','E',1),(230,20,'Ascenso','CD 11 Municipal','uploads/1778808985_C.D. 11 Municipal.png','F',1),(231,21,'Ascenso','Juventud Candelare??o','uploads/1783429929_Juventud candelare??o.png',NULL,1),(232,22,'Ascenso','Marte Soyapango','uploads/1783484543_martesouya.png',NULL,1),(233,23,'Ascenso','Academia BP','uploads/1778807456_academia bp2.png',NULL,1),(234,24,'Ascenso','Tenancingo','uploads/1783347575_ad tenancinango.png','A',1),(235,25,'Ascenso','Nacional Las Margaritas','uploads/1783536475_ad nacional.png',NULL,1),(236,26,'Ascenso','Vendaval','uploads/1778807010_vendaval 2.png','D',1),(237,27,'Ascenso','Atl??tico Bel??n','uploads/1783483080_atlbelen.png',NULL,1),(238,28,'Ascenso','Brasilia FC','uploads/1783481284_basilia.png',NULL,1),(239,29,'Ascenso','Santo Tom??s','uploads/1783536538_santotomas.png',NULL,1),(240,30,'Ascenso','CD Audaz','uploads/1783563788_audaz.png',NULL,1),(241,31,'Ascenso','Nonualco FC','uploads/1783647079_nHUlco.png',NULL,1),(242,32,'Ascenso','Atl??tico Verapaz','uploads/1783646583_atverapaz.png',NULL,1),(243,33,'Ascenso','San Marcos','uploads/1783648047_cd sanmarc{.png',NULL,1),(244,34,'Ascenso','FORFUT','uploads/1783646890_forfut.png',NULL,1),(245,35,'Ascenso','CD El Roble','uploads/1783645728_cd roble.png','C',1),(246,36,'Ascenso','CD El Vencedor','uploads/1778810314_CD EL VENCEDOT.png',NULL,1),(247,37,'Ascenso','SESSA','uploads/1783648245_sesa.png',NULL,1),(248,38,'Ascenso','San Rafael Obrajuelo','uploads/1783648175_san rafael.png',NULL,1),(249,39,'Ascenso','Sal Y Mar','uploads/1783647558_cd sal.png',NULL,1),(250,40,'Ascenso','Brasil FC','uploads/1778809144_brasil fc.png',NULL,1),(251,41,'Ascenso','Racing de Gualuca','uploads/1783647122_racing{.png','B',1),(252,42,'Ascenso','Real Sociedad','uploads/1783647422_rel socu.png',NULL,1),(253,43,'Ascenso','Estrellas del Sur','uploads/1778806361_CD ESTRELLAS DEL SUR.png',NULL,1),(254,44,'Ascenso','CD Buenos Aires','uploads/1778807163_buenos aires 2.png',NULL,1),(255,45,'Ascenso','Atl??tico San Sim??n','uploads/1783646198_sansimon.png',NULL,1),(256,46,'Ascenso','Vista Hermosa','uploads/1783648353_vista.png',NULL,1),(261,17,'Primera','CD ATL.BALBOA','uploads/1784694388_balboa.png',NULL,1),(262,18,'Primera','CD Inca Aruba','uploads/1784694507_incaaruba.png',NULL,1);
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
INSERT INTO `equipos_primera_femenina` VALUES (1,'Alianza FC Women ','San Salvador','Estadio Cuscatlan ','uploads/1783693048_Alianza_women.jpg','4-4-2'),(2,'CD ??guila Femenino','San Miguel','Estadio Juan Francisco Barraza','uploads/1782942606_aguila femenil.png','4-4-2'),(3,'C.D. FAS Femenino','Santa Ana','Estadio ??scar Alberto Quite??o','uploads/1784128548_FAS.png','4-4-2'),(4,'C.D. Municipal Lime??o Femenil','La Uni??n','Estadio Dr. Ram??n Flores Berr??os','uploads/1784128664_Lime??o.png','4-4-2'),(5,'A.D. Isidro Metap??n Femenino','Santa Ana','Estadio Jorge \"Calero\" Su??rez Landaverde','uploads/1784128867_metapan.png','4-4-2'),(6,'C.D. Cacahuatique Femenino','San Miguel','Estadio Bolliat','uploads/1784128962_cacahuatique.png','4-4-2'),(7,'Inter Tecla Women','La Paz','Estadio Antonio Toledo Valle','uploads/1784129111_intertecla.png','4-4-2'),(9,'INCA Aruba (F)','','','uploads/1784900771_incaaruba.png','4-4-2'),(10,'CD Luis Angel Firpo (F)','Usulut??n','Estadio Sergio Torres Rivera','uploads/1784900844_LAFIRPO.png','4-4-2'),(11,'CD Fuerte San Francisco (F)','San Francisco Gotera','Estadio Correcaminos','uploads/1784901093_morazan.png','4-4-2'),(12,'CD Platense (F)','Zacatecoluca','Estadio Antonio Toledo Valle','uploads/1784901111_platense.png','4-4-2'),(13,'Atl??tico Balboa (F)','La Uni??n','Estadio Marcelino Imbers','uploads/1784901128_balboa.png','4-4-2');
/*!40000 ALTER TABLE `equipos_primera_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_reservas`
--

DROP TABLE IF EXISTS `equipos_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estadio` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `formacion` varchar(10) COLLATE utf8mb4_general_ci DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_reservas`
--

LOCK TABLES `equipos_reservas` WRITE;
/*!40000 ALTER TABLE `equipos_reservas` DISABLE KEYS */;
INSERT INTO `equipos_reservas` VALUES (181,'L.A. Firpo Reservas','Usulut??n',NULL,'uploads/1775237339_LAFIRPO.png','4-4-2'),(182,'Alianza F.C. Reservas','San Salvador',NULL,'uploads/1775237448_alianzafc.png','4-4-2'),(183,'C.D. ??guila Reservas','San Miguel',NULL,'uploads/1775237638_Aguila.png','4-4-2'),(184,'C.D. Municipal Lime??o Reservas','Santa Rosa de Lima',NULL,'uploads/escudos/equipo_7_1779945347.png','4-4-2'),(185,'Inter Tecla Reservas','Santa Tecla',NULL,'uploads/escudos/equipo_8_1782942322.png','4-4-2'),(186,'A.D. Isidro Metap??n Reservas','Metap??n',NULL,'uploads/1775241152_metapan.png','4-4-2'),(187,'C.D. Cacahuatique Reservas','Ciudad Barrios',NULL,'uploads/1775242518_cacahuatique.png','4-4-2'),(188,'C.D. Platense Reservas','Zacatecoluca',NULL,'uploads/1775242938_platense.png','4-4-2'),(189,'C.D. Fuerte San Francisco Reservas','San Francisco Gotera',NULL,'uploads/1775243154_morazan.png','4-4-2'),(190,'C.D. FAS Reservas','Santa Ana',NULL,'uploads/1775580005_FAS.png','4-4-2'),(191,'CD ATL.BALBOA Reservas','La Uni??n',NULL,'uploads/1784694388_balboa.png','4-4-2'),(192,'CD Inca Aruba Reservas','Entre R??os',NULL,'uploads/1784694507_incaaruba.png','4-4-2');
/*!40000 ALTER TABLE `equipos_reservas` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=496 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores`
--

LOCK TABLES `estadisticas_jugadores` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores` VALUES (454,449,'2025-2026',20,0,0,0,0,0,1,0,1800,19,6),(455,450,'2025-2026',5,0,0,0,0,0,0,0,270,6,1),(456,451,'2025-2026',2,0,0,0,0,0,0,0,90,3,0),(457,452,'2025-2026',18,0,1,0,0,0,2,0,1530,0,0),(458,453,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(459,454,'2025-2026',18,0,1,0,0,0,3,0,1520,0,0),(460,455,'2025-2026',10,0,0,0,0,0,1,0,720,0,0),(461,456,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(462,457,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(463,458,'2025-2026',8,0,0,0,0,0,1,0,490,0,0),(464,459,'2025-2026',18,1,3,0,0,0,2,0,1480,0,0),(465,460,'2025-2026',12,0,2,0,0,0,1,0,820,0,0),(466,461,'2025-2026',17,2,3,0,0,0,2,0,1370,0,0),(467,462,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(468,463,'2025-2026',16,3,2,0,0,0,2,0,1280,0,0),(469,464,'2025-2026',19,1,4,0,0,0,3,0,1560,0,0),(470,465,'2025-2026',16,2,3,0,0,0,2,0,1250,0,0),(471,466,'2025-2026',18,6,2,1,0,2,2,0,1430,0,0),(472,467,'2025-2026',15,5,3,0,0,1,1,0,1150,0,0),(473,468,'2025-2026',10,2,1,0,0,0,1,0,620,0,0),(474,469,'2025-2026',8,1,0,0,0,0,0,0,410,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=720 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores`
--

LOCK TABLES `jugadores` WRITE;
/*!40000 ALTER TABLE `jugadores` DISABLE KEYS */;
INSERT INTO `jugadores` VALUES (449,8,'sergio sibri??n molina','portero',1,NULL,21,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(450,8,'hector ram??rez carvajal','portero',12,NULL,34,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(451,8,'adriel mart??nez castillo','portero',22,NULL,23,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(452,8,'lautaro toledo pacheco','central',4,NULL,23,'argentino','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(453,8,'guillermo nieves','central',3,NULL,27,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(454,8,'ruben marroquin','central',5,NULL,32,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(455,8,'jorge gonz??lez lemus','central',6,NULL,21,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(456,8,'alexis montes renderos','central',2,NULL,27,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(457,8,'kevin molina mart??nez','central',15,NULL,24,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(458,8,'kevin menj??var henriquez','central',16,NULL,24,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(459,8,'kevin oviedo','medio_central',8,NULL,27,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(460,8,'jos?? serrano montano','medio_central',10,NULL,21,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(461,8,'diego coca','medio_central',7,NULL,30,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(462,8,'bryan santos','medio_central',14,NULL,19,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(463,8,'guillermo stradella','medio_central',11,NULL,26,'argentino','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(464,8,'darwin cer??n','medio_central',20,NULL,27,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(465,8,'jairo henr??quez','medio_central',21,NULL,32,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(466,8,'melvin alfaro','centrodelantero',9,NULL,26,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),(467,8,'michell mercado','centrodelantero',18,NULL,26,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(468,8,'carlos alfaro','centrodelantero',NULL,NULL,23,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(469,8,'edson garc??a','centrodelantero',25,NULL,21,'salvadore??o','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),(501,18,'Aldair McKenzie','centrodelantero',NULL,NULL,28,'Paname?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(502,18,'Brayan Paz','centrodelantero',NULL,NULL,28,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(503,18,'Aqu?les M?ndez','centrodelantero',NULL,NULL,33,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(504,18,'Ovidio Hern?ndez','centrodelantero',NULL,NULL,18,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(505,18,'Felix Sanchez','central',NULL,NULL,36,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(506,18,'Mauricio G?mez','medio_central',NULL,NULL,25,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(507,18,'Christopher Jimmy Najarro Gald?mez','medio_central',24,NULL,21,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(508,18,'Eduardo Pinto','medio_central',NULL,NULL,20,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(509,18,'Carlos Herrera','central',NULL,NULL,28,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(510,18,'Cristofer Maldonado','portero',NULL,NULL,22,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(511,18,'Balmore Pineda','portero',NULL,NULL,28,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(512,18,'Franco Chinchilla','portero',NULL,NULL,NULL,'Salvadore?a','2026-07-26 08:43:03',NULL,NULL,NULL,NULL,0),(513,15,'Nelson Bonilla','centrodelantero',9,NULL,35,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(514,15,'Rafael Tejada','centrodelantero',7,NULL,23,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(515,15,'Edgar Medrano','centrodelantero',13,NULL,31,'Colombiana','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(516,15,'C?sar D?az','centrodelantero',17,NULL,24,'Chilena','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(517,15,'Melvin Urbina','extremo_derecho',12,NULL,19,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(518,15,'Wilber D?az','centrodelantero',NULL,NULL,19,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(519,15,'Kevin Santamar?a','medio_ofensivo',17,NULL,35,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(520,15,'Yan Maciel','medio_central',20,NULL,29,'Brasile?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(521,15,'Elmer Bonilla','medio_central',6,NULL,23,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(522,15,'Jos? Isaac Portillo','medio_central',5,NULL,26,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(523,15,'Roberto Melgar','medio_central',19,NULL,31,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(524,15,'Jonathan Nolasco','medio_central',8,NULL,29,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(525,15,'Josue Cartagena','medio_central',26,NULL,27,'Estadounidense','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(526,15,'Samuel Rosales','medio_central',15,NULL,21,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(527,15,'David Montejo','medio_central',37,NULL,20,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(528,15,'Diego Rosales','medio_central',58,NULL,22,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(529,15,'Jorge Cruz','central',29,NULL,26,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(530,15,'Rudy Clavel','lateral_derecho',28,NULL,29,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(531,15,'Miguel Murillo','central',3,NULL,28,'Colombiana','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(532,15,'Jos? Guevara','central',2,NULL,28,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(533,15,'Juan Vega','central',16,NULL,27,'Mexicana','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(534,15,'Edson Mel?ndez','central',4,NULL,32,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(535,15,'Kevin Ard?n','central',NULL,NULL,24,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(536,15,'Kevin Carabantes','portero',1,NULL,31,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(537,15,'Jonathan Valle','portero',25,NULL,25,'Salvadore?a','2026-07-26 08:47:11',NULL,NULL,NULL,NULL,0),(538,5,'Francis Castillo-Orellana','centrodelantero',16,NULL,20,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(539,5,'Gustavo Moura','centrodelantero',11,NULL,30,'Brasile?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(540,5,'Jos? Barreto','extremo_izquierdo',19,NULL,26,'Argentina','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(541,5,'Noel Rivera','centrodelantero',26,NULL,22,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(542,5,'Juan Portillo','extremo_izquierdo',11,NULL,34,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(543,5,'Luis Tobar','centrodelantero',45,NULL,18,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(544,5,'Eduardo Rivas','centrodelantero',NULL,NULL,22,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(545,5,'Harold Osorio','medio_central',45,NULL,22,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(546,5,'Matias Mier','medio_ofensivo',24,NULL,35,'Uruguaya','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(547,5,'Leonardo Menj?var','extremo_izquierdo',10,NULL,24,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(548,5,'Narciso Orellana','medio_central',6,NULL,31,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(549,5,'Bryan Tamacas','lateral_derecho',21,NULL,31,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(550,5,'Juan Cruz Monteagudo','central',NULL,NULL,30,'Argentina','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(551,5,'Julio Sibri?n','central',2,NULL,30,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(552,5,'Henry Romero','central',16,NULL,34,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(553,5,'Nelson Rodr?guez','central',3,NULL,23,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(554,5,'Alejandro Henr?quez','lateral_izquierdo',20,NULL,23,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(555,5,'Jairo Soriano','central',3,NULL,31,'Guatemalteca','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(556,5,'Jafet Soriano','central',30,NULL,30,'Guatemalteca','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(557,5,'Emerson Hern?ndez','lateral_derecho',29,NULL,24,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(558,5,'Willian Flores','central',16,NULL,26,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(559,5,'Roberto Rivas','central',NULL,NULL,23,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(560,5,'Marlon Joya','portero',1,NULL,24,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(561,5,'Daniel Franco','portero',NULL,NULL,19,'Salvadore?a','2026-07-26 08:51:20',NULL,NULL,NULL,NULL,0),(562,6,'Federico Andrada','centrodelantero',7,NULL,32,'Argentina','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(563,6,'Santiago Ayala','centrodelantero',NULL,NULL,24,'Argentina','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(564,6,'Dixon Rivas','centrodelantero',6,NULL,26,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(565,6,'Carlos Garay','centrodelantero',NULL,NULL,20,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(566,6,'Ricardo Villatoro','centrodelantero',11,NULL,20,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(567,6,'Eduardo Cruz','centrodelantero',46,NULL,NULL,'Mexicana','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(568,6,'Santos Ortiz','medio_central',12,NULL,33,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(569,6,'Marcelo D?az','medio_central',27,NULL,25,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(570,6,'Diego Gregori','medio_ofensivo',10,NULL,31,'Espa?ola','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(571,6,'Jairo Mart?nez','medio_central',23,NULL,26,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(572,6,'Oscar Rodr?guez','medio_central',NULL,NULL,31,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(573,6,'Bryan Lovo','medio_central',8,NULL,20,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(574,6,'Joel Turcios','medio_central',16,NULL,28,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(575,6,'Marvin Benitez Jr','medio_central',40,NULL,19,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(576,6,'W?lter Chig?ila','medio_central',NULL,NULL,28,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(577,6,'Alexander Marquez','medio_central',16,NULL,29,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(578,6,'Ronald Rodr?guez','central',28,NULL,27,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(579,6,'Erick Cabalceta','central',3,NULL,33,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(580,6,'Jefferson Perla','central',36,NULL,16,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(581,6,'Tereso Ben?tez','lateral_derecho',7,NULL,24,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(582,6,'Jos? Guatemala','central',NULL,NULL,18,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(583,6,'Stiven D?vila','central',24,NULL,39,'Colombiana','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(584,6,'Daniel Marquez','central',NULL,NULL,29,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(585,6,'Benji Villalobos','portero',22,NULL,38,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(586,6,'Jairo Guardado','portero',1,NULL,26,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(587,6,'Osm?n Loza','portero',59,NULL,NULL,'Salvadore?a','2026-07-26 08:54:13',NULL,NULL,NULL,NULL,0),(588,12,'Carlos Salazar','centrodelantero',NULL,NULL,30,'Colombiana','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(589,12,'Joshua Gallardo','centrodelantero',99,NULL,23,'Paname?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(590,12,'Allan Acevedo','centrodelantero',NULL,NULL,24,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(591,12,'Ronald Aparicio','centrodelantero',NULL,NULL,24,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(592,12,'Carlos Mart?nez','centrodelantero',NULL,NULL,23,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(593,12,'?ngel Caicedo','medio_ofensivo',NULL,NULL,25,'Paname?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(594,12,'Francisco Escobar','medio_central',NULL,NULL,30,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(595,12,'Wilson Rugama','medio_central',14,NULL,36,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(596,12,'Fernando Clavel','medio_central',NULL,NULL,26,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(597,12,'Jordy Bonilla','medio_central',8,NULL,30,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(598,12,'Vinicius Santana','central',16,NULL,27,'Brasile?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(599,12,'Giovanni ?vila','central',NULL,NULL,26,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(600,12,'Alexander Rodr?guez','central',NULL,NULL,27,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(601,12,'Walter Guevara','central',4,NULL,33,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(602,12,'Jonathan Quintanilla','central',6,NULL,25,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(603,12,'Edwin C?rdova','central',NULL,NULL,25,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(604,12,'Alexis Renderos','central',17,NULL,28,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(605,12,'Juan Ben?tez','central',NULL,NULL,28,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(606,12,'Kevin Oviedo','central',NULL,NULL,28,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(607,12,'Emerson Manc?a','central',NULL,NULL,25,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(608,12,'H?ctor Ram?rez','portero',NULL,NULL,35,'Salvadore?a','2026-07-26 08:57:10',NULL,NULL,NULL,NULL,0),(609,4,'Styven V?squez','centrodelantero',7,NULL,23,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(610,4,'Jos? Valencia','centrodelantero',20,NULL,34,'Colombiana','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(611,4,'Cristian Gil','centrodelantero',19,NULL,29,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(612,4,'Nelson D?az','centrodelantero',35,NULL,20,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(613,4,'Michell Mercado','centrodelantero',26,NULL,34,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(614,4,'?scar Cer?n','extremo_derecho',16,NULL,34,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(615,4,'El?as Gumero','centrodelantero',21,NULL,26,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(616,4,'Diego Guevara','centrodelantero',23,NULL,24,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(617,4,'Mauro Gonz?lez','medio_central',NULL,NULL,29,'Argentina','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(618,4,'Mauricio Cerritos','medio_defensivo',17,NULL,22,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(619,4,'Brayan Landaverde','medio_central',8,NULL,31,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(620,4,'Rafael ?guila','medio_central',28,NULL,29,'Paname?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(621,4,'V?ctor Garc?a','extremo_izquierdo',10,NULL,31,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(622,4,'Kevin Ascencio','medio_central',30,NULL,21,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(623,4,'Erivan Flores','medio_central',4,NULL,29,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(624,4,'Diego Ortez','medio_central',27,NULL,22,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(625,4,'Marvin Aranda','medio_central',15,NULL,27,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(626,4,'Steven Mira','medio_central',NULL,NULL,21,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(627,4,'Diego Flores','lateral_izquierdo',12,NULL,25,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(628,4,'Wilber Arizala','central',3,NULL,30,'Colombiana','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(629,4,'Lizandro Claros','central',5,NULL,28,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(630,4,'Eduardo Vigil','central',6,NULL,29,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(631,4,'Jonathan Jim?nez','central',24,NULL,34,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(632,4,'Marlon Cornejo','extremo_izquierdo',2,NULL,32,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(633,4,'Elmer Rodr?guez','central',36,NULL,18,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(634,4,'Herson Rodr?guez','central',14,NULL,22,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(635,4,'Geonathan Barrera','portero',1,NULL,21,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(636,4,'Misael Erazo','portero',NULL,NULL,27,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(637,4,'Felipe Amaya','portero',25,NULL,37,'Salvadore?a','2026-07-26 09:00:04',NULL,NULL,NULL,NULL,0),(638,7,'Juan Carlos Argueta','centrodelantero',NULL,NULL,26,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(639,7,'Wilma Torres','centrodelantero',NULL,NULL,32,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(640,7,'Javier Ferman','centrodelantero',30,NULL,30,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(641,7,'Danis Cerros','centrodelantero',15,NULL,27,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(642,7,'Israel Escalante','extremo_izquierdo',NULL,NULL,27,'Argentina','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(643,7,'Jefferson Valladares','lateral_derecho',15,NULL,23,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(644,7,'?nyelo Rodr?guez','medio_central',NULL,NULL,30,'Uruguaya','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(645,7,'Gerson Mayen','medio_central',NULL,NULL,36,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(646,7,'Enmanuel Hern?ndez','medio_central',12,NULL,26,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(647,7,'Marvin Ramos','medio_central',10,NULL,33,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(648,7,'Jefferson Martinez','medio_central',NULL,NULL,19,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(649,7,'Rudy Ram?rez','medio_central',NULL,NULL,24,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(650,7,'Elvis Claros','central',19,NULL,25,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(651,7,'Franco Mat?as Bent?n','central',15,NULL,31,'Uruguaya','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(652,7,'William Molina','central',NULL,NULL,21,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(653,7,'Fredy Espinoza','central',2,NULL,34,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(654,7,'Rafael Garc?a','portero',1,NULL,36,'Uruguaya','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(655,7,'Oscar S?nchez','portero',NULL,NULL,35,'Salvadore?a','2026-07-26 09:01:29',NULL,NULL,NULL,NULL,0),(656,11,'Yair Arboleda','extremo_derecho',31,NULL,30,'Colombiana','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(657,11,'Carlos Bogot?','centrodelantero',11,NULL,24,'Colombiana','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(658,11,'David Zayas','centrodelantero',NULL,NULL,22,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(659,11,'Bryan R?os','centrodelantero',NULL,NULL,21,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(660,11,'Manuel Gonz?lez','centrodelantero',NULL,NULL,36,'Colombiana','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(661,11,'Luis Aguilar','centrodelantero',NULL,NULL,23,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(662,11,'Jefferson Roque','medio_central',NULL,NULL,19,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(663,11,'Vinicio Mu?oz','medio_central',20,NULL,24,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(664,11,'Jos? Ventura','medio_central',28,NULL,28,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(665,11,'Josu? Palacios','medio_central',33,NULL,23,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(666,11,'Franklin Mart?nez','medio_central',NULL,NULL,21,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(667,11,'Isa? Aguilar','medio_central',NULL,NULL,28,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(668,11,'Wilmer Novoa','medio_central',7,NULL,31,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(669,11,'Anthony Roque','medio_central',NULL,NULL,30,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(670,11,'Brayam Palacios','central',99,NULL,27,'Colombiana','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(671,11,'Moises Xavier Garcia','central',NULL,NULL,36,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(672,11,'Kevin Menj?var','central',NULL,NULL,25,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(673,11,'Diego Mej?a','central',NULL,NULL,20,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(674,11,'Kevin Calder?n','central',4,NULL,32,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(675,11,'Carlos Ar?valo','central',2,NULL,38,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(676,11,'Cristopher Rauda','portero',1,NULL,31,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(677,11,'Daniel Arroyo','portero',NULL,NULL,36,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(678,11,'William Torres','portero',NULL,NULL,33,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(679,11,'M?ximo Sandoval','portero',NULL,NULL,18,'Salvadore?a','2026-07-26 09:04:42',NULL,NULL,NULL,NULL,0),(680,10,'Jomal Williams','extremo_izquierdo',9,NULL,32,'Trinitense','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(681,10,'Dany Cetr?','centrodelantero',21,NULL,28,'Ecuatoriana','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(682,10,'Paolo Ulloa','centrodelantero',NULL,NULL,25,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(683,10,'Hern?n Gonz?lez','centrodelantero',NULL,NULL,34,'Argentina','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(684,10,'Elias Umeres','extremo_izquierdo',NULL,NULL,30,'Argentina','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(685,10,'Herbert Sosa','medio_ofensivo',7,NULL,36,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(686,10,'Anderson Portillo','medio_central',NULL,NULL,18,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(687,10,'William Canales','central',NULL,NULL,31,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(688,10,'Jos? Galindo','central',NULL,NULL,32,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(689,10,'Guillermo Fuentes','central',NULL,NULL,24,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(690,10,'Ronald Padilla','central',NULL,NULL,30,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(691,10,'Francisco Carballo','central',NULL,NULL,31,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(692,10,'Reinaldo Aparicio','central',NULL,NULL,33,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(693,10,'Jeremy Rodr?guez','portero',NULL,NULL,21,'Paname?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(694,10,'Cristian Bonilla','portero',NULL,NULL,21,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(695,10,'Wilberth Hern?ndez','medio_central',NULL,NULL,32,'Salvadore?a','2026-07-26 09:06:11',NULL,NULL,NULL,NULL,0),(696,9,'Steven Guerra','centrodelantero',21,NULL,21,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(697,9,'Kevin Reyes','centrodelantero',7,NULL,26,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(698,9,'Federico Haberkorn','centrodelantero',NULL,NULL,31,'Argentina','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(699,9,'Jos? Posada','centrodelantero',28,NULL,26,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(700,9,'Uriel Miranda','centrodelantero',NULL,NULL,19,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(701,9,'Melvin Cartagena','medio_central',14,NULL,26,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(702,9,'Gustavo Machado','extremo_derecho',80,NULL,25,'Uruguaya','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(703,9,'Marvin Monterroza','medio_ofensivo',21,NULL,35,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(704,9,'Emerson Sandoval','medio_central',NULL,NULL,25,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(705,9,'Cesar Flores','extremo_derecho',8,NULL,30,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(706,9,'Julio Amaya','medio_central',14,NULL,31,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(707,9,'Carlos Ortiz','medio_central',NULL,NULL,26,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(708,9,'Eduardo Galdamez','medio_central',NULL,NULL,18,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(709,9,'Melvin Cruz','central',3,NULL,25,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(710,9,'Miguel Lemus','central',NULL,NULL,32,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(711,9,'Jos? Zalda?a','central',6,NULL,22,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(712,9,'Nicol?s G?mez','central',NULL,NULL,34,'Uruguaya','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(713,9,'Mario Jacobo','central',NULL,NULL,29,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(714,9,'Kevin Vidal','central',15,NULL,26,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(715,9,'Hugo Aguilar','central',NULL,NULL,19,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(716,9,'Ra?l Cruz','central',NULL,NULL,32,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(717,9,'Javier Colli','portero',NULL,NULL,34,'Argentina','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(718,9,'?scar Pleitez','portero',1,NULL,33,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0),(719,9,'Alfredo Esquivel','portero',NULL,NULL,18,'Salvadore?a','2026-07-26 09:08:07',NULL,NULL,NULL,NULL,0);
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
INSERT INTO `jugadores_femenina` VALUES (1,1,'samantha valadez','portero',25,NULL,21,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(2,1,'roxana vega','portero',1,NULL,27,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(3,1,'hazel silva','portero',24,NULL,NULL,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(4,1,'linda guillen','central',4,NULL,26,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(5,1,'priscila ortiz','central',17,NULL,30,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(6,1,'santana pressley','central',5,NULL,NULL,'estadounidense','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(7,1,'joseline rivas','central',8,NULL,32,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(8,1,'nicole cabrera','central',3,NULL,27,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(9,1,'rosmery mendoza','central',6,NULL,24,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(10,1,'iliana molina','central',16,NULL,17,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(11,1,'irma hernandez','central',23,NULL,26,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(12,1,'paola calderon','medio_central',9,NULL,24,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(13,1,'alejandra agundez','medio_central',27,NULL,20,'mexicana','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(14,1,'tatiana dabney','medio_central',7,NULL,NULL,'estadounidense','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(15,1,'paola ceren','medio_central',14,NULL,30,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(16,1,'yaneth sotelo','medio_central',26,NULL,21,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(17,1,'neyda martinez','medio_central',29,NULL,27,'mexicana','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(18,1,'raquel ramirez','medio_central',19,NULL,31,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(19,1,'ashley webb','centrodelantero',10,NULL,31,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(20,1,'genesis carpio','centrodelantero',12,NULL,18,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(21,1,'keyri garcia','centrodelantero',20,NULL,18,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),(22,1,'gladis ulloa','centrodelantero',30,NULL,29,'salvadore??a','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0);
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
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Salvadore??a',
  `club_origen` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atajadas` int DEFAULT '0',
  `es_titular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion`
--

LOCK TABLES `jugadores_seleccion` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion` VALUES (1,'Mario Gonz??lez','portero',1,'/backend/uploads/seleccion_1783695511_6cc8d30a.png',29,'Salvadore??a','Deportivo San Carlos',12,0,0,'2026-06-10 02:30:54',0,0),(2,'Benji Villalobos','portero',12,NULL,26,'Salvadore??a','C.D. ??guila',7,0,0,'2026-06-10 02:30:54',0,0),(3,'Tom??s Romero','portero',22,NULL,26,'Salvadore??a','Minnesota United FC',5,0,0,'2026-06-10 02:30:54',0,0),(4,'Henry Romero','central',3,NULL,28,'Salvadore??a','Alianza FC',8,0,0,'2026-06-10 02:30:54',0,0),(5,'Julio Sibri??n','central',4,NULL,27,'Salvadore??a','C.D. ??guila',10,0,0,'2026-06-10 02:30:54',0,0),(6,'Rudy Clavel','central',5,NULL,25,'Salvadore??a','C.D. FAS',10,0,1,'2026-06-10 02:30:54',0,0),(7,'Jorge Cruz','lateral_derecho',2,NULL,26,'Salvadore??a','C.D. FAS',9,0,0,'2026-06-10 02:30:54',0,0),(8,'Bryan Tamacas','lateral_derecho',13,NULL,31,'Salvadore??a','H??rcules CF',8,0,0,'2026-06-10 02:30:54',0,0),(9,'Alexander Lar??n','lateral_izquierdo',6,NULL,26,'Salvadore??a','Alianza FC',10,0,1,'2026-06-10 02:30:54',0,0),(10,'Ad??n Cl??maco','lateral_izquierdo',23,NULL,24,'Salvadore??a','C.D. ??guila',6,0,0,'2026-06-10 02:30:54',0,0),(11,'Roberto Dom??nguez','central',15,NULL,29,'Salvadore??a','C.D. FAS',6,0,0,'2026-06-10 02:30:54',0,0),(12,'Nelson Rodr??guez','lateral_derecho',16,NULL,23,'Salvadore??a','C.D. ??guila',5,0,0,'2026-06-10 02:30:54',0,0),(13,'Darwin Cer??n','medio_central',7,NULL,33,'Salvadore??a','C.D. ??guila',11,0,0,'2026-06-10 02:30:54',0,0),(14,'Brayan Landaverde','medio_central',8,NULL,26,'Salvadore??a','L.A. Firpo',10,0,0,'2026-06-10 02:30:54',0,0),(15,'Christian Mart??nez','medio_defensivo',14,NULL,25,'Salvadore??a','Alianza FC',9,0,0,'2026-06-10 02:30:54',0,0),(16,'Jefferson Valladares','medio_central',15,NULL,22,'Salvadore??a','C.D. Mpal. Lime??o',7,0,0,'2026-06-10 02:30:54',0,0),(17,'Jairo Henr??quez','medio_ofensivo',17,NULL,24,'Salvadore??a','L.A. Firpo',9,1,0,'2026-06-10 02:30:54',0,0),(18,'Marcelo D??az','medio_central',12,NULL,23,'Salvadore??a','C.D. ??guila',7,0,0,'2026-06-10 02:30:54',0,0),(19,'Mauricio Cerritos','medio_central',20,NULL,22,'Salvadore??a','L.A. Firpo',5,0,0,'2026-06-10 02:30:54',0,0),(20,'Harold Osorio','medio_ofensivo',19,NULL,25,'Salvadore??a','Alianza FC',8,1,0,'2026-06-10 02:30:54',0,0),(21,'Elmer Bonilla','medio_central',21,NULL,23,'Salvadore??a','C.D. FAS',4,0,0,'2026-06-10 02:30:54',0,0),(22,'Joshua P??rez','extremo_derecho',10,NULL,28,'Salvadore??a','Houston Dynamo',9,0,0,'2026-06-10 02:30:54',0,0),(23,'Nathan Ordaz','extremo_izquierdo',11,NULL,22,'Salvadore??a','FC Dallas',8,0,3,'2026-06-10 02:30:54',0,0),(24,'Brayan Gil','extremo_derecho',9,NULL,27,'Salvadore??a','Portland Timbers',9,2,0,'2026-06-10 02:30:54',0,0),(25,'Styven V??squez','extremo_izquierdo',18,NULL,26,'Salvadore??a','Alianza FC',7,0,0,'2026-06-10 02:30:54',0,0),(26,'Emerson Mauricio','centrodelantero',24,NULL,27,'Salvadore??a','C.D. ??guila',6,0,0,'2026-06-10 02:30:54',0,0),(27,'Rafael Tejada','centrodelantero',25,NULL,24,'Salvadore??a','L.A. Firpo',5,0,0,'2026-06-10 02:30:54',0,0),(28,'Francis Castillo','segundo_delantero',26,NULL,24,'Salvadore??a','Columbus Crew',7,0,1,'2026-06-10 02:30:54',0,0);
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
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Salvadore??a',
  `club_origen` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `atajadas` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `es_titular` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion_femenina`
--

LOCK TABLES `jugadores_seleccion_femenina` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion_femenina` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion_femenina` VALUES (4,'Idalia Serrano','portero',NULL,NULL,26,'Salvadore??a','AS Volos 2004 WFC',0,0,0,0,'2026-07-03 16:52:49',0),(5,'Samantha Valadez','portero',NULL,NULL,21,'Salvadore??a','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),(6,'Riley Mel??ndez','portero',NULL,NULL,NULL,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(7,'Juana Plata','lateral_izquierdo',NULL,NULL,26,'Salvadore??a','Monterrey',0,0,0,0,'2026-07-03 16:52:49',0),(8,'Vashy Delgado','central',NULL,NULL,32,'Salvadore??a','Mazatl??n FC',0,0,0,0,'2026-07-03 16:52:49',0),(9,'Elaily Hern??ndez','central',NULL,NULL,26,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(10,'Nicole Amaya','lateral_derecho',NULL,NULL,23,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(11,'Laila Saravia','central',NULL,NULL,NULL,'Salvadore??a','Pacific Tigers',0,0,0,0,'2026-07-03 16:52:49',0),(12,'Linda Guill??n','central',NULL,NULL,26,'Salvadore??a','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),(13,'Priscila Ortiz','central',NULL,NULL,30,'Salvadore??a','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),(14,'Irma Molina','central',NULL,NULL,26,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(15,'Joseline Rivas','central',NULL,NULL,32,'Salvadore??a','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),(16,'Reina Cruz','central',NULL,NULL,30,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(17,'Jasmine Dybala','central',NULL,NULL,NULL,'Salvadore??a','Sam Houston State Bearkats',0,0,0,0,'2026-07-03 16:52:49',0),(18,'Victoria Meza','lateral_derecho',NULL,NULL,NULL,'Salvadore??a','Texas State Bobcats',0,0,0,0,'2026-07-03 16:52:49',0),(19,'Brenda Ceren','extremo_derecho',NULL,NULL,27,'Salvadore??a','Cruz Azul',0,0,0,0,'2026-07-03 16:52:49',0),(20,'Samantha Fisher','centrodelantero',NULL,NULL,26,'Salvadore??a','Sassuolo',0,0,0,0,'2026-07-03 16:52:49',0),(21,'Danielle Fuentes','centrodelantero',NULL,NULL,25,'Salvadore??a','Tijuana',0,0,0,0,'2026-07-03 16:52:49',0),(22,'Danya Guti??rrez','medio_central',NULL,NULL,26,'Salvadore??a','Club Le??n',0,0,0,0,'2026-07-03 16:52:49',0),(23,'Victoria S??nchez','medio_central',NULL,NULL,21,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(24,'Makenna Dom??nguez','medio_central',NULL,NULL,NULL,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(25,'Paola Calder??n','medio_central',NULL,NULL,24,'Salvadore??a','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),(26,'Emely Rubio','medio_central',NULL,NULL,NULL,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(27,'Alejandra Chirino','medio_central',NULL,NULL,35,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(28,'Jackeline Vel??squez','medio_central',NULL,NULL,30,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(29,'Isabella Recinos','medio_central',NULL,NULL,23,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(30,'Amber Marinero','medio_central',NULL,NULL,28,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(31,'Angie Machado','medio_central',NULL,NULL,NULL,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(32,'Katerin Morales','medio_central',NULL,NULL,NULL,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(33,'Gabriela Rodr??guez','medio_central',NULL,NULL,NULL,'Salvadore??a','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),(34,'Karen Reyes','centrodelantero',NULL,NULL,28,'Salvadore??a','NPS Volos',0,0,0,0,'2026-07-03 16:52:49',0),(35,'Samaria G??mez','centrodelantero',NULL,NULL,24,'Salvadore??a','Amed Sportif Faaliyetler',0,0,0,0,'2026-07-03 16:52:49',0),(36,'Yoselyn Abigail Lopez','centrodelantero',NULL,NULL,25,'Salvadore??a','Mazatl??n FC',0,0,0,0,'2026-07-03 16:52:49',0);
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
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Salvadore??a',
  `club_origen` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `atajadas` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `es_titular` tinyint(1) DEFAULT '0',
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion_sub17`
--

LOCK TABLES `jugadores_seleccion_sub17` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion_sub17` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion_sub17` VALUES (22,'J. Alvarenga','portero',1,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(23,'Cristian Martínez','lateral_derecho',2,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(24,'Joandrick Sanchez','portero',3,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(25,'R. Heredia','defensa',4,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(26,'J. Perla','central',5,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(27,'R. Andrade','extremo_derecho',7,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(28,'E. Garay','medio_central',8,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(29,'A. Sorto','centrodelantero',9,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(30,'M. Barillas','medio_ofensivo',10,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(31,'B. Murgas','extremo_izquierdo',11,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(32,'Johan Martínez','medio_central',12,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(33,'G. Salazar','lateral_izquierdo',13,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(34,'Kevin Rivas','central',14,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(35,'E. Ortiz','defensa',15,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(36,'A. Colocho','medio_ofensivo',16,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(37,'S. Merlet','defensa',17,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(38,'X. Graham','delantero',18,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(39,'D. González','medio_central',19,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(40,'R. Hernandez','medio_central',20,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL),(41,'S. Salamanca','portero',21,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:37:52',0,NULL,NULL);
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
  `nacionalidad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Salvadore??a',
  `club_origen` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `partidos_jugados` int DEFAULT '0',
  `goles` int DEFAULT '0',
  `asistencias` int DEFAULT '0',
  `atajadas` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `es_titular` tinyint(1) DEFAULT '0',
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion_sub20`
--

LOCK TABLES `jugadores_seleccion_sub20` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion_sub20` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion_sub20` VALUES (23,'Oliver Alegria Sigernes','portero',1,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(24,'Peter Cornejo','portero',21,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,50,90),(25,'M?ximo Sandoval','portero',12,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(26,'Itzel Colocho','lateral_izquierdo',2,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,88,70),(27,'Jos? Guatemala','central',3,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,36,74),(28,'Emerson Guardado','central',4,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(29,'Hugo Aguilar','central',5,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,64,74),(30,'Jonathan Aguirre','lateral_derecho',13,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,12,70),(31,'Alexander White','central',6,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(32,'Jonathan L?pez','lateral_izquierdo',14,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,64,22),(33,'Gabriel Arnold','medio_central',8,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,40,46),(34,'Johann Ortiz','medio_central',10,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,60,46),(35,'Jefferson Roque','medio_central',15,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(36,'William Cabrera','medio_defensivo',16,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(37,'Anderson Portillo','medio_ofensivo',17,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(38,'Diego Pe?a','medio_central',18,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(39,'Christian Coreas','centrodelantero',9,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,82,48),(40,'Luis Tobar','centrodelantero',19,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,18,48),(41,'Wilber D?az','extremo_izquierdo',7,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL),(42,'Aiden Benitez','centrodelantero',20,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',1,36,22),(43,'Uriel Miranda','extremo_derecho',11,NULL,NULL,'Salvadore??a',NULL,0,0,0,0,'2026-07-26 07:40:24',0,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_attempts`
--

LOCK TABLES `login_attempts` WRITE;
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
INSERT INTO `login_attempts` VALUES (1,'192.168.2.193','unmaje@gmail.com','2026-07-24 15:16:47'),(2,'192.168.2.193','unmaje@gmail.com','2026-07-24 15:16:50'),(3,'192.168.2.193','unmaje@gmail.com','2026-07-24 15:16:51');
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
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_comments`
--

LOCK TABLES `match_comments` WRITE;
/*!40000 ALTER TABLE `match_comments` DISABLE KEYS */;
INSERT INTO `match_comments` VALUES (14,76,'primera',90,'fin','???? ??Pitido final! Resultado definitivo: C.D. Municipal Lime??o 0 - 0 C.D. ??guila.','C.D. Municipal Lime??o',NULL,'2026-06-08 15:39:57'),(16,77,'primera',15,'gol','??? ??GOOOOOL! Oscar Rodr??guez marca para Alianza F.C. en el minuto 15.','Alianza F.C.',138,'2026-06-08 15:42:14'),(17,77,'primera',45,'descanso','??? Pitido final de la primera mitad. Descanso con el marcador 1-0.','Alianza F.C.',NULL,'2026-06-08 15:42:29'),(18,77,'primera',0,'inicio','?????? ??Arranca el partido! Segunda parte en juego.','Alianza F.C.',NULL,'2026-06-08 15:43:03'),(19,77,'primera',45,'comentario','Inicio de la segunda parte','Alianza F.C.',NULL,'2026-06-08 15:43:21'),(20,77,'primera',65,'gol_cabeza','???? ??Gol de CABEZA! William Canales conecta de manera impresionante. Minuto 0.','Alianza F.C.',131,'2026-06-08 15:43:46'),(21,77,'primera',89,'fin','???? ??Pitido final! Resultado definitivo: Alianza F.C. 2 - 0 Inter TECLA.','Alianza F.C.',NULL,'2026-06-08 15:43:52'),(22,78,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-06-08 16:11:26'),(23,78,'primera',9,'cambio','???? Cambio en C.D. FAS: Sale Kevin Carabantes, entra Jonathan Nolasco. Minuto 9.','C.D. FAS',230,'2026-06-08 16:21:19'),(24,78,'primera',140,'descanso','??? Pitido final de la primera mitad. Descanso con el marcador 0-0.','',NULL,'2026-06-08 18:31:34'),(25,78,'primera',45,'inicio','?????? ??Empieza la segunda parte!','',NULL,'2026-06-08 20:13:24'),(26,78,'primera',138,'cambio','???? Cambio en C.D. FAS: Sale Jonathan Valle, entra Kevin Carabantes. Minuto 138.','C.D. FAS',216,'2026-06-08 21:46:28'),(27,78,'primera',153,'tarjeta_amarilla','???? Tarjeta amarilla para Brayan Landaverde de L.A. Firpo. Minuto 153.','L.A. Firpo',109,'2026-06-08 22:02:19'),(28,78,'primera',154,'tarjeta_roja','???? ??Tarjeta ROJA! Brayan Landaverde queda expulsado. Minuto 154.','L.A. Firpo',109,'2026-06-08 22:02:48'),(29,78,'primera',154,'cambio','???? Cambio en L.A. Firpo: Sale Lucas R., entra Marvin Aranda. Minuto 154.','L.A. Firpo',117,'2026-06-08 22:03:21'),(30,78,'primera',182,'cambio','???? Cambio en L.A. Firpo: Sale Wilberth Hern??ndez, entra Misael Erazo. Minuto 182. [SALE:98]','L.A. Firpo',99,'2026-06-08 22:30:29'),(31,78,'primera',204,'fin','???? ??Pitido final! Resultado definitivo: C.D. FAS 0 - 0 L.A. Firpo.','C.D. FAS',NULL,'2026-06-08 22:53:23'),(32,74,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-08 20:17:15'),(33,74,'primera',1,'cambio','???? Cambio en C.D. FAS: Sale Jos?? Guevara, entra Juan Vega. Minuto 1. [SALE:222]','C.D. FAS',224,'2026-07-08 20:18:34'),(34,74,'primera',4,'gol','??? ??GOOOOOL! Juan Vega marca para C.D. FAS en el minuto 4.','C.D. FAS',224,'2026-07-08 20:22:11'),(35,74,'primera',5,'gol','??? ??GOOOOOL! Yan Maciel marca para C.D. FAS en el minuto 5.','C.D. FAS',228,'2026-07-08 20:22:51'),(36,74,'primera',92,'fin','???? ??Pitido final! Resultado definitivo: Alianza F.C. 0 - 2 C.D. FAS.','Alianza F.C.',NULL,'2026-07-10 15:11:07'),(37,74,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-10 15:25:16'),(38,74,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-10 15:25:18'),(39,74,'primera',90,'fin','???? ??Pitido final! Resultado definitivo: Alianza F.C. 0 - 2 C.D. FAS.','Alianza F.C.',NULL,'2026-07-10 15:25:25'),(40,79,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-15 14:27:33'),(41,79,'primera',0,'cambio','???? Cambio en L.A. Firpo: Sale Misael Erazo, entra Wilberth Hern??ndez. Minuto 0. [SALE:99]','L.A. Firpo',98,'2026-07-15 14:28:01'),(42,79,'primera',1,'cambio','???? Cambio en L.A. Firpo: Sale Cristian Gil, entra Diego Ortez. Minuto 1. [SALE:119]','L.A. Firpo',116,'2026-07-15 14:29:13'),(43,79,'primera',26,'gol','??? ??GOOOOOL! Jugador marca para Alianza F.C..','Alianza F.C.',NULL,'2026-07-15 14:29:52'),(44,79,'primera',45,'descanso','??? Pitido final de la primera mitad. Descanso con el marcador 1-0.','Alianza F.C.',NULL,'2026-07-15 14:30:07'),(45,79,'primera',90,'fin','???? ??Pitido final! Resultado definitivo: Alianza F.C. 1 - 0 L.A. Firpo.','Alianza F.C.',NULL,'2026-07-15 14:30:23'),(53,1001,'femenina',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-24 22:11:45'),(60,1001,'femenina',42,'gol','??? ??GOOOOOL! Mayreni Amaya marca para C.D. Cacahuatique Femenino en el minuto 42.','C.D. Cacahuatique Femenino',NULL,'2026-07-25 01:59:46'),(61,1001,'femenina',45,'descanso','??? Pitido final de la primera mitad. Descanso con el marcador 1-0.','C.D. Cacahuatique Femenino',NULL,'2026-07-25 02:00:00'),(62,1001,'femenina',66,'gol','??? ??GOOOOOL! Heisy Ben??tez marca para C.D. Cacahuatique Femenino en el minuto 66.','C.D. Cacahuatique Femenino',NULL,'2026-07-25 02:01:32'),(63,1001,'femenina',90,'fin','???? ??Pitido final! Resultado definitivo: C.D. Cacahuatique Femenino 2 - 0 A.D. Isidro Metap??n Femenino.','C.D. Cacahuatique Femenino',NULL,'2026-07-25 02:02:06'),(64,81,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-25 02:03:32'),(65,81,'primera',13,'gol','??? ??GOOOOOL! Jugador marca para C.D. Municipal Lime??o en el minuto 13.','C.D. Municipal Lime??o',NULL,'2026-07-25 02:04:36'),(66,81,'primera',45,'descanso','Min 45???| FINALIZ?? EL PRIMER TIEMPO EN SANTA ANA ????','C.D. Municipal Lime??o',NULL,'2026-07-25 02:34:05'),(67,81,'primera',66,'gol','66\' ??GOOOOOOL DE FAS!\nNelson Bonilla','C.D. FAS',NULL,'2026-07-25 03:08:45'),(68,81,'primera',77,'gol','77\' ??GOOOOOOL DE FAS!','C.D. FAS',NULL,'2026-07-25 04:03:04'),(70,81,'primera',97,'gol','90+7\' ??QUE SUPER GOLAZO KEVIN!','C.D. FAS',NULL,'2026-07-25 04:04:19'),(71,81,'primera',97,'fin','???? ??Pitido final! Resultado definitivo: C.D. FAS 3 - 1 C.D. Municipal Lime??o.','C.D. FAS',NULL,'2026-07-25 04:04:29'),(72,84,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-25 21:08:13'),(73,84,'primera',6,'gol','??? ??GOOOOOL! JUAN SANCHEZ marca para C.D. Cacahuatique en el minuto 6.','C.D. Cacahuatique',NULL,'2026-07-25 21:14:38'),(74,84,'primera',8,'comentario','Falta de cacahuatique y tiro libre cerca del ??rea para Metap??n','C.D. Cacahuatique',NULL,'2026-07-25 21:16:51'),(75,84,'primera',17,'comentario','Peligro imponente de Metap??n para encontrar el gol, pero Cacahuatique es mejor defensivamente','A.D. Isidro Metap??n',NULL,'2026-07-25 21:26:43'),(76,84,'primera',26,'comentario','Falda para pacheco cerca del ??rea','A.D. Isidro Metap??n',NULL,'2026-07-25 21:34:37'),(77,84,'primera',27,'comentario','Minuto de hidrataci??n','C.D. Cacahuatique',NULL,'2026-07-25 21:36:00'),(78,84,'primera',29,'comentario','Se reanuda el partido','C.D. Cacahuatique',NULL,'2026-07-25 21:38:07'),(79,84,'primera',31,'comentario','ATAJADON DEL ARQUERO DE CACAHUATIQUE','C.D. Cacahuatique',NULL,'2026-07-25 21:39:22'),(80,84,'primera',35,'tarjeta_amarilla','???? Tarjeta amarilla para el jugador con el dorsal 3 de C.D. Cacahuatique. Minuto 34.','C.D. Cacahuatique',NULL,'2026-07-25 21:43:27'),(81,84,'primera',39,'comentario','Otra falta de cacahuatique, metapan tiene otra oportunidad de anotar','C.D. Cacahuatique',NULL,'2026-07-25 21:47:34'),(83,84,'primera',42,'comentario','GOL ANULADO POR MANO DE HABERKORN','C.D. Cacahuatique',NULL,'2026-07-25 21:51:11'),(84,84,'primera',45,'comentario','+4 minutos de agregado','C.D. Cacahuatique',NULL,'2026-07-25 21:53:22'),(86,86,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-25 21:54:56'),(87,86,'primera',30,'comentario','30??? El encuentro entra en la pausa de hidrataci??n. Momento para recuperar energ??as, recibir indicaciones y afrontar con intensidad el resto de la primera mitad. ???','CD ATL.BALBOA',NULL,'2026-07-25 21:56:07'),(88,86,'primera',42,'comentario','Keka Cruz contin??a siendo una constante amenaza en el ??ltimo tercio de la cancha. Su movilidad y desequilibrio siguen generando peligro sobre el ??rea rival.','CD ATL.BALBOA',NULL,'2026-07-25 21:56:38'),(89,84,'primera',49,'descanso','??? Pitido final de la primera mitad. Descanso con el marcador 1-0.','',NULL,'2026-07-25 21:57:16'),(90,86,'primera',45,'descanso','??? Pitido final de la primera mitad. Descanso con el marcador 0-0.','CD ATL.BALBOA',NULL,'2026-07-25 22:01:47'),(91,86,'primera',45,'inicio','?????? ??Arranca el segundo tiempo??','CD ATL.BALBOA',NULL,'2026-07-25 22:10:39'),(92,84,'primera',45,'inicio','?????? ??Empieza la segunda parte!','',NULL,'2026-07-25 22:13:27'),(93,84,'primera',53,'gol','??? ??GOOOOOL! HABERKORN marca para A.D. Isidro Metap??n en el minuto 53.','A.D. Isidro Metap??n',NULL,'2026-07-25 22:22:10'),(94,84,'primera',62,'comentario','Isidro metapan dominando el partido','A.D. Isidro Metap??n',NULL,'2026-07-25 22:30:29'),(95,84,'primera',62,'comentario','Posible penal para metap??n','A.D. Isidro Metap??n',NULL,'2026-07-25 22:32:32'),(96,84,'primera',66,'comentario','PENAL PARA METAP??N','A.D. Isidro Metap??n',NULL,'2026-07-25 22:34:30'),(97,84,'primera',67,'gol_penal','???? ??Gol de PENAL!  DOBLETE DE HABERKORN convierte desde el punto de penalti. Minuto 67.','A.D. Isidro Metap??n',NULL,'2026-07-25 22:36:14'),(98,84,'primera',77,'gol','??? ??GOOOOOL! ANDERSON  marca para C.D. Cacahuatique en el minuto 76.','C.D. Cacahuatique',NULL,'2026-07-25 22:46:22'),(99,84,'primera',78,'gol','??? ??GOOOOOL! HABERKORN ANOTA TRIPLETE para A.D. Isidro Metap??n en el minuto 78.','A.D. Isidro Metap??n',NULL,'2026-07-25 22:47:11'),(100,84,'primera',86,'tarjeta_amarilla','???? Tarjeta amarilla para WILLIAN de C.D. Cacahuatique. Minuto 86.','C.D. Cacahuatique',NULL,'2026-07-25 22:55:10'),(101,84,'primera',89,'tarjeta_amarilla','???? Tarjeta amarilla para Nicolaz gomez de A.D. Isidro Metap??n. Minuto 89.','A.D. Isidro Metap??n',NULL,'2026-07-25 22:57:43'),(102,84,'primera',89,'comentario','Tiro libre para cacahuatique','C.D. Cacahuatique',NULL,'2026-07-25 22:58:00'),(103,84,'primera',90,'comentario','+10 minutos a??adidos','C.D. Cacahuatique',NULL,'2026-07-25 22:58:42'),(104,84,'primera',94,'gol','??? ??GOOOOOL! para A.D. Isidro Metap??n en el minuto 92.','A.D. Isidro Metap??n',NULL,'2026-07-25 23:03:18'),(105,84,'primera',97,'comentario','METAP??N SE PIERDE UN MANO A MANO','A.D. Isidro Metap??n',NULL,'2026-07-25 23:06:19'),(106,84,'primera',100,'fin','???? ??Pitido final! Resultado definitivo: C.D. Cacahuatique 2 - 4 A.D. Isidro Metap??n.','C.D. Cacahuatique',NULL,'2026-07-25 23:08:40'),(108,86,'primera',112,'fin','???? ??Pitido final! Resultado definitivo: CD ATL.BALBOA 0 - 0 Inter Tecla.','CD ATL.BALBOA',NULL,'2026-07-25 23:16:10'),(109,87,'primera',0,'inicio','?????? ??Arranca el partido! Primera parte en juego.','',NULL,'2026-07-26 00:27:25'),(111,87,'primera',45,'comentario','+1 minuto de a??adido','CD Inca Aruba',NULL,'2026-07-26 00:50:51'),(112,87,'primera',46,'descanso','??? Pitido final de la primera mitad. Descanso con el marcador 0-1.','Alianza F.C.',NULL,'2026-07-26 00:51:56'),(114,87,'primera',44,'gol','??? ??GOOOOOL! Noel Rivera marca para Alianza F.C. en el minuto 44.','Alianza F.C.',136,'2026-07-26 01:10:27'),(115,87,'primera',45,'inicio','?????? ??Empieza la segunda parte!','',NULL,'2026-07-26 01:12:02'),(116,87,'primera',46,'tarjeta_amarilla','???? Tarjeta amarilla para el dorsal 4 de CD Inca Aruba. Minuto 46.','CD Inca Aruba',NULL,'2026-07-26 01:13:35'),(117,87,'primera',59,'comentario','PENAL PARA EL ARUBA','CD Inca Aruba',NULL,'2026-07-26 01:26:40'),(118,87,'primera',61,'gol_penal','???? ??Gol de PENAL! BRYAN PAZ convierte desde el punto de penalti. Minuto 61.','CD Inca Aruba',NULL,'2026-07-26 01:28:38'),(119,87,'primera',84,'gol','??? ??GOOOOOL! Gustavo Moura marca para Alianza F.C. en el minuto 85.','Alianza F.C.',142,'2026-07-26 01:52:22'),(120,87,'primera',91,'comentario','PENAL PARA ALIANZAA','Alianza F.C.',NULL,'2026-07-26 01:59:25'),(121,87,'primera',93,'gol','??? ??GOOOOOL!  David Leon marca para Alianza F.C. en el minuto 92.','Alianza F.C.',NULL,'2026-07-26 02:00:54'),(122,87,'primera',98,'tarjeta_roja','???? ??Tarjeta ROJA! para cd Inca Aruba','CD Inca Aruba',NULL,'2026-07-26 02:05:48'),(123,87,'primera',98,'fin','???? ??Pitido final! Resultado definitivo: CD Inca Aruba 1 - 3 Alianza F.C..','CD Inca Aruba',NULL,'2026-07-26 02:05:51');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
INSERT INTO `noticias` VALUES (13,'Nueva Liga de Ascenso en El Salvador #2026','Esta es la lista oficial de los equipos que participaran en la competiciones la liga de ascenso','Liga de Ascenso','N??meros y F??tbol',NULL,'Publicado','2026-07-24 13:32:53','http://numeros-y-futbol.test/backend/uploads/6a636984ef224.mp4'),(14,'SOPORTE DE FVS EN EL SALVADOR!!!!','Football Video Support (FVS) presente la Liga GanaPlay gracias a la organizaci??n y trabajo de la Federaci??n Salvadore??a de F??tbol.\nEl juego de inauguraci??n entre CD FAS vs CD Mpal. Lime??o cont?? con el apoyo del FVS (Football Video Support), con ello inicia una nueva etapa en la profesionalizaci??n y soporte tecnol??ico para arbitraje salvadore??o.','Liga mayor','N??meros y F??tbol',NULL,'Publicado','2026-07-26 00:10:04','/backend/uploads/6a6550de59218.jpg');
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
  `fecha` datetime DEFAULT NULL,
  `jornada` int DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos`
--

LOCK TABLES `partidos` WRITE;
/*!40000 ALTER TABLE `partidos` DISABLE KEYS */;
INSERT INTO `partidos` VALUES (81,15,7,3,1,0,'2026-07-24 19:30:00',1,'Finalizado',0),(84,10,9,2,4,0,'2026-07-25 15:00:00',1,'Finalizado',0),(86,17,8,0,0,0,'2026-07-25 15:00:00',1,'Finalizado',0),(87,18,5,1,3,0,'2026-07-25 18:00:00',1,'Finalizado',0),(88,6,4,NULL,NULL,0,'2026-07-26 15:00:00',1,'Pendiente',0),(89,12,11,NULL,NULL,0,'2026-07-26 15:00:00',1,'Pendiente',0);
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
  `fecha` datetime DEFAULT NULL,
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
/*!40000 ALTER TABLE `partidos_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_burgerking`
--

DROP TABLE IF EXISTS `partidos_burgerking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_burgerking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_local` int DEFAULT NULL,
  `equipo_visitante` int DEFAULT NULL,
  `goles_local` int DEFAULT '0',
  `goles_visitante` int DEFAULT '0',
  `fecha` datetime DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `jornada` int DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_burgerking`
--

LOCK TABLES `partidos_burgerking` WRITE;
/*!40000 ALTER TABLE `partidos_burgerking` DISABLE KEYS */;
INSERT INTO `partidos_burgerking` VALUES (1,31,30,1,4,'2026-07-24 12:00:00',NULL,1,'Finalizado',0),(3,27,25,2,2,'2026-07-25 13:00:00',NULL,1,'Finalizado',0),(4,33,32,0,0,'2026-07-25 14:00:00',NULL,1,'Pendiente',0),(5,36,26,0,0,'2026-07-25 15:00:00',NULL,1,'Pendiente',0),(6,35,29,0,0,'2026-07-26 11:00:00',NULL,1,'Pendiente',0),(7,34,28,0,0,'2026-07-26 11:00:00',NULL,1,'Pendiente',0);
/*!40000 ALTER TABLE `partidos_burgerking` ENABLE KEYS */;
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
  `fecha` datetime DEFAULT NULL,
  `jornada` int DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_femenina`
--

LOCK TABLES `partidos_femenina` WRITE;
/*!40000 ALTER TABLE `partidos_femenina` DISABLE KEYS */;
INSERT INTO `partidos_femenina` VALUES (1001,6,5,2,0,0,'2026-07-24 15:00:00',1,NULL,'Finalizado',0),(1002,11,12,1,1,0,'2026-07-25 14:30:00',1,NULL,'Finalizado',0),(1004,3,4,5,0,0,'2026-07-25 14:30:00',1,NULL,'Finalizado',0),(1005,2,10,1,2,0,'2026-07-25 15:30:00',1,NULL,'Finalizado',0),(1006,13,7,0,0,0,'2026-07-26 15:00:00',1,NULL,'Pendiente',0),(1007,9,1,0,0,0,'2026-07-26 18:00:00',1,NULL,'Pendiente',0);
/*!40000 ALTER TABLE `partidos_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_reservas`
--

DROP TABLE IF EXISTS `partidos_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_local` int DEFAULT NULL,
  `equipo_visitante` int DEFAULT NULL,
  `goles_local` int DEFAULT '0',
  `goles_visitante` int DEFAULT '0',
  `fecha` datetime DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `jornada` int DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_reservas`
--

LOCK TABLES `partidos_reservas` WRITE;
/*!40000 ALTER TABLE `partidos_reservas` DISABLE KEYS */;
INSERT INTO `partidos_reservas` VALUES (3,190,184,4,1,'2026-07-25 11:00:00',NULL,1,'Finalizado',0),(4,191,185,2,5,'2026-07-25 11:00:00',NULL,1,'Finalizado',0),(5,187,186,1,2,'2026-07-25 12:00:00',NULL,1,'Finalizado',0),(6,183,181,0,0,'2026-07-26 12:00:00',NULL,1,'Pendiente',0),(7,189,188,0,0,'2026-07-26 12:00:00',NULL,1,'Pendiente',0),(8,192,182,0,0,'2026-07-26 12:00:00',NULL,1,'Pendiente',0);
/*!40000 ALTER TABLE `partidos_reservas` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_seleccion_sub20`
--

LOCK TABLES `partidos_seleccion_sub20` WRITE;
/*!40000 ALTER TABLE `partidos_seleccion_sub20` DISABLE KEYS */;
INSERT INTO `partidos_seleccion_sub20` VALUES (2,'Cuba',NULL,0,3,'2026-07-20',NULL,'Finalizado','Otro','Neutral','2026-07-26 07:27:42');
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_tokens`
--

LOCK TABLES `reset_tokens` WRITE;
/*!40000 ALTER TABLE `reset_tokens` DISABLE KEYS */;
INSERT INTO `reset_tokens` VALUES (30,'admin@numerosyfutbol.com','104c0342196d2586ea8dd762de5763177113c02a81d7880efc1224e4dd3e9dd0','870622','2026-07-24 15:18:08','2026-07-24 15:33:08',0),(31,'vanesotomayor0411@gmail.com','2efc808c69b00e4f8c2e19b4f41c3d60141f15bf7870eeb973b9c30e046a7bb1','918964','2026-07-24 15:22:52','2026-07-24 15:37:52',0),(32,'arielosotomayor0411@gmail.com','b4ca58cf5e272b849e504643cb15b69138c760a796f48b033cf06a923e0620dd','512493','2026-07-24 15:25:22','2026-07-24 15:40:22',1);
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
INSERT INTO `site_settings` VALUES ('contact_email',''),('facebook_url','https://www.facebook.com/profile.php?id=61590972174662&locale=es_LA'),('hero_banner_url','https://z-cdn-media.chatglm.cn/files/5838caa0-1db5-471c-a0b7-615971e5c6a9.png?auth_key=1874475322-63d59502a9bd4eccb11f4451b8b598a8-0-73a0c525630ab96d6c6d289fa8ba3645'),('hero_btn1_label','??ltimas Noticias'),('hero_btn1_link','/news'),('hero_btn2_label','Ver Resultados'),('hero_btn2_link','/primera'),('hero_description','Cobertura completa de todas las divisiones. Noticias, resultados y an??lisis del mejor f??tbol salvadore??o en vivo.'),('hero_title','Noticias y numeros que genera el f??tbol'),('instagram_url','https://www.youtube.com/channel/UCGQIRz57DlfpAtY570bApOg'),('maintenance_mode','0'),('maintenance_msg','Estamos trabajando para mejorar tu experiencia. Vuelve pronto.'),('site_description','Cobertura completa de todas las divisiones. Noticias, resultados y an??lisis del mejor f??tbol salvadore??o.'),('site_logo_url',''),('site_name','N??meros y F??tbol'),('twitter_url','');
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
INSERT INTO `tabla_posiciones` VALUES (14,4,0,0,0,0,0,0,0),(17,5,1,1,0,0,3,1,3),(18,6,0,0,0,0,0,0,0),(21,7,1,0,0,1,1,3,0),(22,8,1,0,1,0,0,0,1),(23,9,1,1,0,0,4,2,3),(61,10,1,0,0,1,2,4,0),(74,11,0,0,0,0,0,0,0),(75,12,0,0,0,0,0,0,0),(384,15,1,1,0,0,3,1,3),(543,17,1,0,1,0,0,0,1),(544,18,1,0,0,1,1,3,0);
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
-- Table structure for table `tabla_posiciones_burgerking`
--

DROP TABLE IF EXISTS `tabla_posiciones_burgerking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_burgerking` (
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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_burgerking`
--

LOCK TABLES `tabla_posiciones_burgerking` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_burgerking` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_burgerking` VALUES (32,25,1,0,1,0,2,2,1),(33,26,0,0,0,0,0,0,0),(34,27,1,0,1,0,2,2,1),(35,28,0,0,0,0,0,0,0),(36,29,0,0,0,0,0,0,0),(37,30,0,0,0,0,0,0,0),(38,31,0,0,0,0,0,0,0),(39,32,0,0,0,0,0,0,0),(40,33,0,0,0,0,0,0,0),(41,34,0,0,0,0,0,0,0),(42,35,0,0,0,0,0,0,0),(43,36,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `tabla_posiciones_burgerking` ENABLE KEYS */;
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
INSERT INTO `tabla_posiciones_femenina` VALUES (1,1,0,0,0,0,0,0,0),(2,2,1,0,0,1,1,2,0),(3,3,1,1,0,0,5,0,3),(4,4,1,0,0,1,0,5,0),(5,5,1,0,0,1,0,2,0),(6,6,1,1,0,0,2,0,3),(7,7,0,0,0,0,0,0,0),(9,9,0,0,0,0,0,0,0),(10,10,1,1,0,0,2,1,3),(11,11,1,0,1,0,1,1,1),(12,12,1,0,1,0,1,1,1),(13,13,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `tabla_posiciones_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_reservas`
--

DROP TABLE IF EXISTS `tabla_posiciones_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_reservas` (
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_reservas`
--

LOCK TABLES `tabla_posiciones_reservas` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_reservas` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_reservas` VALUES (13,181,0,0,0,0,0,0,0),(14,182,0,0,0,0,0,0,0),(15,183,0,0,0,0,0,0,0),(16,184,1,0,0,1,1,4,0),(17,185,1,1,0,0,5,2,3),(18,186,1,1,0,0,2,1,3),(19,187,1,0,0,1,1,2,0),(20,188,0,0,0,0,0,0,0),(21,189,0,0,0,0,0,0,0),(22,190,1,1,0,0,4,1,3),(23,191,1,0,0,1,2,5,0),(24,192,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `tabla_posiciones_reservas` ENABLE KEYS */;
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
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `justificacion_desactivacion` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `idx_apodo` (`apodo`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (9,'Ariel','Sirenoman123','unmaje@gmail.com','$2y$10$u7QxKMFb3dN2iT/fWCD5b.3bgl5lmRAya893EoHaItD3uWdl19Rue','admin',1,NULL),(12,'Ariel Soto','sirenoman','vanesotomayor0411@gmail.com','$2y$10$G8nLBg96/DSykaQWI2fGzud7oha0.mj3wxdfTojNScxLcoWoeMWeS','usuario',1,NULL),(13,'Alejandro','megatomayor','arielosotomayor0411@gmail.com','$2y$10$IEK7RLdRdYxCCMyPTJ5gguL3mzd43EhVm2WtWKXsFSIDPjiW.z6Bm','usuario',1,NULL),(20,'Administrador','admin','admin@numerosyfutbol.com','$2y$10$U3d8sKZ9wO.S22LGvvv8aOeKyAEzukUloMzM6XqyemMzpVouICVOC','admin',1,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas`
--

LOCK TABLES `visitas` WRITE;
/*!40000 ALTER TABLE `visitas` DISABLE KEYS */;
INSERT INTO `visitas` VALUES (157,'cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.69:8080/teams/femenina',0,'2026-07-17 14:21:06'),(158,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-17 15:44:22'),(159,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/',0,'2026-07-17 15:44:32'),(160,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/ascenso',0,'2026-07-17 15:44:51'),(161,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/partido/3/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/seleccion-femenina',0,'2026-07-17 15:45:08'),(162,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/partido/3/ascenso',0,'2026-07-17 15:45:22'),(163,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/partido/79/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/partido/3/ascenso',0,'2026-07-17 15:45:25'),(164,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/primera',0,'2026-07-17 15:45:57'),(165,'cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.69:8080/manage-seleccion-femenina',0,'2026-07-17 17:40:34'),(166,'ba91d6fa71b2cefb5610e841d538198332150dac3f500730ca0a850fade2f457','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/news',0,'2026-07-19 08:15:03'),(167,'4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','/','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','',0,'2026-07-22 02:46:52'),(168,'4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','/login','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','',0,'2026-07-22 02:47:07'),(169,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/partido/81/primera',0,'2026-07-24 14:57:28'),(170,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-24 14:57:32'),(171,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/noticia/13','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-24 14:57:38'),(172,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/partido/81/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/noticia/13',0,'2026-07-24 14:57:42'),(173,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-24 14:58:01'),(174,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion',0,'2026-07-24 14:58:31'),(175,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/seleccion-sub20','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-femenina',0,'2026-07-24 14:58:36'),(176,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/seleccion-sub17','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 14:58:43'),(177,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 15:10:47'),(178,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/forgot-password','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 15:10:49'),(179,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-24 15:27:16'),(180,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/partido/81/primera',0,'2026-07-24 15:28:27'),(181,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/users','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 15:38:19'),(182,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/manage-news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 15:41:04'),(183,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-24 15:42:01'),(184,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/seleccion-sub20','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.57:8080/',0,'2026-07-24 15:42:15'),(185,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/noticia/13','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-24 15:46:28'),(186,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-24 15:46:53'),(187,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/partido/88/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.57:8080/news',0,'2026-07-24 15:47:34'),(188,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.57:8080/',0,'2026-07-24 15:48:18'),(189,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/teams/reservas',0,'2026-07-24 21:45:38'),(190,'71dda6155cb3194aeed7a8516c4e9c89eef394047b9a02a6f121728a60655b50','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/manage-comments',0,'2026-07-25 21:46:44');
/*!40000 ALTER TABLE `visitas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-29 21:08:27
