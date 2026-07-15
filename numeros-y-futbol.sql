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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (1,'70e8d67ed075fb029ce5bf637fba5c7a0d77fc60b65d2516e5eda3021ccf7dfd',9,'admin','2026-05-28 04:33:27','2026-05-29 04:33:27'),(2,'3058831cabdecee49ae5e3f6b54ee2568e5d671913a384bd60450c21be5adfda',9,'admin','2026-05-28 05:15:10','2026-05-29 05:15:10'),(3,'cfa6878039209b991039bb5909640feb89a4999915fe33da61a69675a77f8eb9',9,'admin','2026-05-28 17:46:07','2026-05-29 17:46:07'),(4,'d7de29610f6d331eba9275a34e6cf9754a77acb84349de67ec9069d4f3ac760a',9,'admin','2026-06-05 22:13:23','2026-06-06 22:13:23'),(5,'58cfde98ef2a467304bfe6d80884d3ea01e0620a289ea82a2e8f2cb5d5924031',9,'admin','2026-06-05 22:14:29','2026-06-06 22:14:29'),(6,'c189fa91585b90f46f02c4fb0bae6122e8bf800c9809b3be2935ea84951c299a',9,'admin','2026-06-08 15:38:24','2026-06-09 15:38:24'),(7,'1c4b0289ba0b8725711ffd76cbc99598d439789f7d222054b73dfdd7924bf149',9,'admin','2026-06-08 15:39:41','2026-06-09 15:39:41'),(8,'4fef4d215b80af4630a3434c536d612269720708cfbcfaa6d498a55ea99050ce',9,'admin','2026-06-08 16:10:59','2026-06-09 16:10:59'),(9,'ee543bcc08be9736f726c142ec497c90333daff1d95246778ef9d4d139d0cad7',9,'admin','2026-06-09 04:38:38','2026-06-10 04:38:38'),(10,'fc121784cbf712b7ed5350e7bc6db9719c61aaad40dad8a60b3b2c5307c505b9',9,'admin','2026-06-09 04:38:53','2026-06-10 04:38:53'),(11,'2ec0083de43327887ea0f6afff158276d296e2d56f437ed437b677e615f3a1f7',9,'admin','2026-06-10 04:46:37','2026-06-11 04:46:37'),(12,'b05b7e9c2a1e90e2f2146745c4131f8625cd3de8134016a3d8cd6789cc4b049a',9,'admin','2026-06-10 04:46:47','2026-06-11 04:46:47'),(13,'4b3304f25946a2a23794728d25277339f74c725188be65d5d894f95d7f9049b6',9,'admin','2026-07-01 21:07:29','2026-07-02 21:07:29'),(14,'c5fbb086839739f24bc160ca798c16f2e71de623d32ce141262b79f8ad9a0533',9,'admin','2026-07-03 14:21:13','2026-07-04 14:21:13'),(15,'2e91855135743e4c27f48b86ef7252d53f8874dc1ba5239daad745fa74e3ec3f',9,'admin','2026-07-03 20:02:56','2026-07-04 20:02:56'),(16,'3deb95ba3fe7bb2c32c045eb209cf5a277ec4732a9cb822d758f3d6be971bafe',9,'admin','2026-07-03 20:14:37','2026-07-04 20:14:37'),(17,'1f31ece4b3f6b1f04119e92cf548cf46ef870b088181a8872bba4bedbaa483f2',9,'admin','2026-07-06 04:58:23','2026-07-07 04:58:23'),(18,'ab65c2fba3cafb30b73237926db6d0c04e7a8b8009445312467a3c310fb62bef',9,'admin','2026-07-07 13:08:20','2026-07-08 13:08:20'),(19,'9660b4977c5b41ce4116a72b4744e9335f0f240ca907ef4e349722dbc0ee6105',9,'admin','2026-07-08 18:46:26','2026-07-09 18:46:26'),(20,'07dbc6b913d027a955b988472edc86cfe3b6d44d5543812e9ade7fc183ee4aa6',9,'admin','2026-07-10 01:08:21','2026-07-11 01:08:21'),(21,'b695b9fa91ebdc63b2fa3efbfc5d0edaa677c8079613907dd1cdf9f86dfc2580',9,'admin','2026-07-10 13:57:00','2026-07-11 13:57:00'),(22,'57b260849b4dc78c8daeee702d7134f36c683ee91d4ce264018ad7e73d8d2931',9,'admin','2026-07-10 14:17:17','2026-07-11 14:17:17'),(23,'2a9cf61dc1155a99cf6d4a5658b739be76b5b1240a9211fdf6385176504deeb9',9,'admin','2026-07-10 14:19:14','2026-07-11 14:19:14'),(24,'ed6c266a8aef258d68e57e237c1b408083885c0597abbc0c9e7120e55d37ff47',9,'admin','2026-07-11 19:37:40','2026-07-12 19:37:40');
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
-- Table structure for table `cuerpo_tecnico_seleccion_sub17`
--

DROP TABLE IF EXISTS `cuerpo_tecnico_seleccion_sub17`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion_sub17` (
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
  `nombre` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
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
INSERT INTO `equipos` VALUES (4,'L.A. Firpo','Usulután','Estadio Sergio Torres Rivera','uploads/1775237339_LAFIRPO.png','3-4-3'),(5,'Alianza F.C.','San Salvador',' Estadio Cuscatlán','uploads/1775237448_alianzafc.png','4-4-2'),(6,'C.D. Águila','San Miguel','Estadio Juan Francisco Barraza','uploads/1775237638_Aguila.png','4-4-2'),(7,'C.D. Municipal Limeño','Santa Rosa de Lima','Estadio Dr. Ramón Flores Berríos','uploads/escudos/equipo_7_1779945347.png','4-4-2'),(8,'Inter TECLA','Santa Tecla','Estadio Nacional Las Delicias','uploads/escudos/equipo_8_1782942322.png','4-4-2'),(9,'A.D. Isidro Metapán','Metapán','Estadio Jorge \"Calero\" Suárez','uploads/1775241152_metapan.png','4-4-2'),(10,'C.D. Cacahuatique','Ciudad Barrios','Estadio Municipal de Chapeltique','uploads/1775242518_cacahuatique.png','4-4-2'),(11,'C.D. Platense','Zacatecoluca','Antonio Toledo Valle','uploads/1775242938_platense.png','4-4-2'),(12,'C.D. Fuerte San Francisco','San Francisco Gotera','Estadio Correcaminos','uploads/1775243154_morazan.png','4-4-2'),(13,'C.D. Hércules','San Salvador','Estadio Cuscatlán','uploads/1775243227_hercules.png','4-4-2'),(14,'Zacatecoluca F.C.','Zacatecoluca','Estadio Antonio Toledo Valle','uploads/1775243292_Zacatecoluca.jpg','3-5-2'),(15,'C.D. FAS','Santa Ana','Estadio Óscar Alberto Quiteño','uploads/1775580005_FAS.png','4-4-2');
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
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `formacion` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_ascenso`
--

LOCK TABLES `equipos_ascenso` WRITE;
/*!40000 ALTER TABLE `equipos_ascenso` DISABLE KEYS */;
INSERT INTO `equipos_ascenso` VALUES (1,'CD Fuerte Aguilares','San Salvador','Cancha Teófilo Siman','uploads/1775366328_fuerte aguilares.webp','2026-04-05 05:18:48','4-4-2'),(2,'C.D. Talleres Jr','Chalatenango','Estadio José Gregorio Martínez','uploads/1775366458_cd talleres.webp','2026-04-05 05:20:58',NULL),(3,'CD ADET-Aruba',' La Libertad',' Estadio Chilama','uploads/1775366532_Aruba.webp','2026-04-05 05:22:12',NULL),(4,' AD Batanecos','San Vicente','Cancha Juan Francisco Molina','uploads/1775366637_Batanecos.png','2026-04-05 05:23:57',NULL),(5,'CD Inca','Cantón Entre Ríos','Cancha San Isidro','uploads/1775368426_C.D._Inca_Súper_Flat_logo.png','2026-04-05 05:53:46',NULL),(6,'A.D. Juventud Independiente','San Juan Opico','Complejo Deportivo San Juan Opico','uploads/1783646402_juventu.png','2026-04-05 06:13:49',NULL),(7,'A.D. Espartano','San Julián','Polideportivo Helen Arias','uploads/1775369682_AD espartano.png','2026-04-05 06:14:42',NULL),(8,'Sensunte FC','Cabañas','Polideportivo Sensuntepeque','uploads/1775370748_sensunte.webp','2026-04-05 06:32:28',NULL),(9,'C.D. Dragón','San Miguel','Estadio Municipal de Quelepa','uploads/1775371713_dragon.png','2026-04-05 06:48:33',NULL),(10,'C.D. Atletico Balboa','La Unión','Estadio Marcelino Imbers','uploads/1775381011_balboa.png','2026-04-05 09:23:31',NULL),(11,'C.D. Cruzeiro','San Vicente','Estadio Jiboa','uploads/1775381059_cruzeiro.png','2026-04-05 09:24:19',NULL),(12,'C.D. Olimpico Litoral','Cerro de la Loma Larga','Complejo Deportivo Rafael López','uploads/1775381230_litoral.png','2026-04-05 09:27:10',NULL),(13,'C.D. Pipil','Morazán','Estadio Vicente Paul Fuentes','uploads/1775381319_pipil.png','2026-04-05 09:28:39',NULL),(14,'C.D. Neo Pipil','San Juan Nonualco','Estadio Neo Pipil','uploads/1775381481_neopipil.jpg','2026-04-05 09:31:21',NULL),(15,'AD Municipal','Sonsonate','','uploads/1783431838_ad municipal.png','2026-07-06 05:11:00',NULL),(16,'CD Buenos Aires ','Morazán','','uploads/1783431010_cd buenos aires fc.png','2026-07-06 05:11:00',NULL),(17,'UD Santos ','La Libertad','','uploads/1783473058_U.D santos.png','2026-07-06 05:11:00',NULL),(18,'Hachadura FC','Sonsonate','','uploads/1783430002_hachadura.png','2026-07-06 05:11:00',NULL),(19,'AD Izalco','Sonsonate',NULL,'uploads/1778808698_IZALCOs.png','2026-07-06 05:11:00',NULL),(20,'CD 11 Municipal','Ahuachapán','','uploads/1778808985_C.D. 11 Municipal.png','2026-07-06 05:11:00',NULL),(21,'Juventud Candelareño','Santa Ana','','uploads/1783429929_Juventud candelareño.png','2026-07-06 05:11:00',NULL),(22,'Marte Soyapango','San Salvador','','uploads/1783484543_martesouya.png','2026-07-06 05:11:00',NULL),(23,'Academia BP','La Libertad',NULL,'uploads/1778807456_academia bp2.png','2026-07-06 05:11:00',NULL),(24,'Tenancingo','Cuscatlán','','uploads/1783347575_ad tenancinango.png','2026-07-06 05:11:00',NULL),(25,'Nacional Las Margaritas','La Libertad','','uploads/1783536475_ad nacional.png','2026-07-06 05:11:00',NULL),(26,'Vendaval','San Salvador',NULL,'uploads/1778807010_vendaval 2.png','2026-07-06 05:11:00',NULL),(27,'Atlético Belén','San Salvador','','uploads/1783483080_atlbelen.png','2026-07-06 05:11:00',NULL),(28,'Brasilia FC','Cuscatlán','','uploads/1783481284_basilia.png','2026-07-06 05:11:00',NULL),(29,'Santo Tomás','Chalatenango','','uploads/1783536538_santotomas.png','2026-07-06 05:11:00',NULL),(30,'CD Audaz','San Vicente','','uploads/1783563788_audaz.png','2026-07-06 05:11:00',NULL),(31,'Nonualco FC','La Paz','','uploads/1783647079_nHUlco.png','2026-07-06 05:11:00',NULL),(32,'Atlético Verapaz','San Vicente','','uploads/1783646583_atverapaz.png','2026-07-06 05:11:00',NULL),(33,'San Marcos','Usulután','','uploads/1783648047_cd sanmarc{.png','2026-07-06 05:11:00',NULL),(34,'FORFUT','Cabañas','','uploads/1783646890_forfut.png','2026-07-06 05:11:00',NULL),(35,'CD El Roble','Cabañas','','uploads/1783645728_cd roble.png','2026-07-06 05:11:00',NULL),(36,'CD El Vencedor','Usulután',NULL,'uploads/1778810314_CD EL VENCEDOT.png','2026-07-06 05:11:00',NULL),(37,'SESSA','San Vicente','','uploads/1783648245_sesa.png','2026-07-06 05:11:00',NULL),(38,'San Rafael Obrajuelo','San Salvador','','uploads/1783648175_san rafael.png','2026-07-06 05:11:00',NULL),(39,'Sal Y Mar','La Unión','','uploads/1783647558_cd sal.png','2026-07-06 05:11:00',NULL),(40,'Brasil FC','San Miguel',NULL,'uploads/1778809144_brasil fc.png','2026-07-06 05:11:00',NULL),(41,'Racing de Gualuca','San Miguel','','uploads/1783647122_racing{.png','2026-07-06 05:11:00',NULL),(42,'Real Sociedad','Morazán','','uploads/1783647422_rel socu.png','2026-07-06 05:11:00',NULL),(43,'Estrellas del Sur','San Miguel',NULL,'uploads/1778806361_CD ESTRELLAS DEL SUR.png','2026-07-06 05:11:00',NULL),(44,'CD Buenos Aires','Morazán',NULL,'uploads/1778807163_buenos aires 2.png','2026-07-06 05:11:00',NULL),(45,'Atlético San Simón','Morazán','','uploads/1783646198_sansimon.png','2026-07-06 05:11:00',NULL),(46,'Vista Hermosa','Morazán','','uploads/1783648353_vista.png','2026-07-06 05:11:00',NULL);
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
  `division` enum('Primera','Ascenso') NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `grupo` char(1) DEFAULT NULL COMMENT 'A-F, asignado por el admin',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_equipo_division` (`equipo_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=257 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_copa`
--

LOCK TABLES `equipos_copa` WRITE;
/*!40000 ALTER TABLE `equipos_copa` DISABLE KEYS */;
INSERT INTO `equipos_copa` VALUES (199,4,'Primera','L.A. Firpo','uploads/1775237339_LAFIRPO.png','C',1),(200,5,'Primera','Alianza F.C.','uploads/1775237448_alianzafc.png','D',1),(201,6,'Primera','C.D. Águila','uploads/1775237638_Aguila.png','B',1),(202,7,'Primera','C.D. Municipal Limeño','uploads/escudos/equipo_7_1779945347.png','A',1),(203,8,'Primera','Inter TECLA','uploads/escudos/equipo_8_1782942322.png','F',1),(204,9,'Primera','A.D. Isidro Metapán','uploads/1775241152_metapan.png','F',1),(205,10,'Primera','C.D. Cacahuatique','uploads/1775242518_cacahuatique.png','C',1),(206,11,'Primera','C.D. Platense','uploads/1775242938_platense.png','A',1),(207,12,'Primera','C.D. Fuerte','uploads/1775243154_morazan.png','B',1),(208,13,'Primera','C.D. Hércules','uploads/1775243227_hercules.png','E',1),(209,14,'Primera','Zacatecoluca F.C.','uploads/1775243292_Zacatecoluca.jpg','D',1),(210,15,'Primera','C.D. FAS','uploads/1775580005_FAS.png','E',1),(211,1,'Ascenso','CD Fuerte Aguilares','uploads/1775366328_fuerte aguilares.webp','E',1),(212,2,'Ascenso','C.D. Talleres Jr','uploads/1775366458_cd talleres.webp','F',1),(213,3,'Ascenso','CD ADET-Aruba','uploads/1775366532_Aruba.webp',NULL,1),(214,4,'Ascenso',' AD Batanecos','uploads/1775366637_Batanecos.png','D',1),(215,5,'Ascenso','CD Inca','uploads/1775368426_C.D._Inca_Súper_Flat_logo.png',NULL,1),(216,6,'Ascenso','A.D. Juventud Independiente','uploads/1783646402_juventu.png',NULL,1),(217,7,'Ascenso','A.D. Espartano','uploads/1775369682_AD espartano.png',NULL,1),(218,8,'Ascenso','Sensunte FC','uploads/1775370748_sensunte.webp','C',1),(219,9,'Ascenso','C.D. Dragón','uploads/1775371713_dragon.png','B',1),(220,10,'Ascenso','C.D. Atletico Balboa','uploads/1775381011_balboa.png',NULL,1),(221,11,'Ascenso','C.D. Cruzeiro','uploads/1775381059_cruzeiro.png','A',1),(222,12,'Ascenso','C.D. Olimpico Litoral','uploads/1775381230_litoral.png',NULL,1),(223,13,'Ascenso','C.D. Pipil','uploads/1775381319_pipil.png',NULL,1),(224,14,'Ascenso','C.D. Neo Pipil','uploads/1775381481_neopipil.jpg',NULL,1),(225,15,'Ascenso','AD Municipal','uploads/1783431838_ad municipal.png',NULL,1),(226,16,'Ascenso','CD Buenos Aires ','uploads/1783431010_cd buenos aires fc.png',NULL,1),(227,17,'Ascenso','UD Santos ','uploads/1783473058_U.D santos.png',NULL,1),(228,18,'Ascenso','Hachadura FC','uploads/1783430002_hachadura.png',NULL,1),(229,19,'Ascenso','AD Izalco','uploads/1778808698_IZALCOs.png','E',1),(230,20,'Ascenso','CD 11 Municipal','uploads/1778808985_C.D. 11 Municipal.png','F',1),(231,21,'Ascenso','Juventud Candelareño','uploads/1783429929_Juventud candelareño.png',NULL,1),(232,22,'Ascenso','Marte Soyapango','uploads/1783484543_martesouya.png',NULL,1),(233,23,'Ascenso','Academia BP','uploads/1778807456_academia bp2.png',NULL,1),(234,24,'Ascenso','Tenancingo','uploads/1783347575_ad tenancinango.png','A',1),(235,25,'Ascenso','Nacional Las Margaritas','uploads/1783536475_ad nacional.png',NULL,1),(236,26,'Ascenso','Vendaval','uploads/1778807010_vendaval 2.png','D',1),(237,27,'Ascenso','Atlético Belén','uploads/1783483080_atlbelen.png',NULL,1),(238,28,'Ascenso','Brasilia FC','uploads/1783481284_basilia.png',NULL,1),(239,29,'Ascenso','Santo Tomás','uploads/1783536538_santotomas.png',NULL,1),(240,30,'Ascenso','CD Audaz','uploads/1783563788_audaz.png',NULL,1),(241,31,'Ascenso','Nonualco FC','uploads/1783647079_nHUlco.png',NULL,1),(242,32,'Ascenso','Atlético Verapaz','uploads/1783646583_atverapaz.png',NULL,1),(243,33,'Ascenso','San Marcos','uploads/1783648047_cd sanmarc{.png',NULL,1),(244,34,'Ascenso','FORFUT','uploads/1783646890_forfut.png',NULL,1),(245,35,'Ascenso','CD El Roble','uploads/1783645728_cd roble.png','C',1),(246,36,'Ascenso','CD El Vencedor','uploads/1778810314_CD EL VENCEDOT.png',NULL,1),(247,37,'Ascenso','SESSA','uploads/1783648245_sesa.png',NULL,1),(248,38,'Ascenso','San Rafael Obrajuelo','uploads/1783648175_san rafael.png',NULL,1),(249,39,'Ascenso','Sal Y Mar','uploads/1783647558_cd sal.png',NULL,1),(250,40,'Ascenso','Brasil FC','uploads/1778809144_brasil fc.png',NULL,1),(251,41,'Ascenso','Racing de Gualuca','uploads/1783647122_racing{.png','B',1),(252,42,'Ascenso','Real Sociedad','uploads/1783647422_rel socu.png',NULL,1),(253,43,'Ascenso','Estrellas del Sur','uploads/1778806361_CD ESTRELLAS DEL SUR.png',NULL,1),(254,44,'Ascenso','CD Buenos Aires','uploads/1778807163_buenos aires 2.png',NULL,1),(255,45,'Ascenso','Atlético San Simón','uploads/1783646198_sansimon.png',NULL,1),(256,46,'Ascenso','Vista Hermosa','uploads/1783648353_vista.png',NULL,1);
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
INSERT INTO `equipos_primera_femenina` VALUES (1,'Alianza FC Women ','San Salvador','Estadio Cuscatlan ','uploads/1783693048_Alianza_women.jpg','4-4-2'),(2,'CD Águila Femenino','San Miguel','Estadio Juan Francisco Barraza','uploads/1782942606_aguila femenil.png','4-4-2');
/*!40000 ALTER TABLE `equipos_primera_femenina` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=421 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores`
--

LOCK TABLES `estadisticas_jugadores` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores` VALUES (122,98,'2025-2026',20,0,0,0,0,0,1,0,1800,22,5),(123,99,'2025-2026',5,0,0,0,0,0,0,0,270,6,1),(124,100,'2025-2026',2,0,0,0,0,0,0,0,90,3,0),(125,101,'2025-2026',18,1,0,1,0,0,3,0,1550,0,0),(126,102,'2025-2026',17,2,1,1,0,0,4,1,1450,0,0),(127,103,'2025-2026',16,0,1,0,0,0,2,0,1350,0,0),(128,104,'2025-2026',15,2,0,2,0,0,3,0,1280,0,0),(129,105,'2025-2026',10,0,0,0,0,0,1,0,760,0,0),(130,106,'2025-2026',17,5,0,2,0,0,3,0,1450,0,0),(131,107,'2025-2026',8,0,0,0,0,0,1,0,520,0,0),(132,108,'2025-2026',19,6,3,0,0,0,4,0,1650,0,0),(133,109,'2025-2026',18,4,5,0,0,0,4,1,1530,0,0),(134,110,'2025-2026',17,6,2,0,0,0,2,0,1420,0,0),(135,111,'2025-2026',12,1,2,0,0,0,2,0,870,0,0),(136,112,'2025-2026',9,0,1,0,0,0,1,0,610,0,0),(137,113,'2025-2026',16,2,3,0,0,0,3,0,1320,0,0),(138,114,'2025-2026',11,1,1,0,0,0,2,0,780,0,0),(139,115,'2025-2026',7,0,0,0,0,0,1,0,430,0,0),(140,116,'2025-2026',6,0,1,0,0,0,0,0,310,0,0),(141,117,'2025-2026',8,0,0,0,0,0,1,0,450,0,0),(142,118,'2025-2026',18,5,2,1,0,1,2,0,1480,0,0),(143,119,'2025-2026',17,5,3,1,0,1,1,1,1380,0,0),(144,120,'2025-2026',19,6,4,0,0,2,2,0,1560,0,0),(145,121,'2025-2026',16,8,2,2,0,1,3,0,1300,0,0),(146,122,'2025-2026',10,2,1,0,0,0,1,0,650,0,0),(147,123,'2025-2026',19,0,0,0,0,0,1,0,1710,20,6),(148,124,'2025-2026',6,1,0,0,0,0,0,0,360,8,1),(149,125,'2025-2026',18,0,1,0,0,0,2,0,1550,0,0),(150,126,'2025-2026',17,1,0,1,0,0,3,0,1450,0,0),(151,127,'2025-2026',16,0,0,0,0,0,2,0,1350,0,0),(152,128,'2025-2026',15,0,1,0,0,0,1,0,1280,0,0),(153,129,'2025-2026',10,0,0,0,0,0,1,0,760,0,0),(154,130,'2025-2026',17,1,0,1,0,0,2,0,1450,0,0),(155,131,'2025-2026',9,2,0,1,0,1,1,0,620,0,0),(156,132,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(157,133,'2025-2026',7,0,0,0,0,0,1,0,410,0,0),(158,134,'2025-2026',19,1,4,0,0,0,3,0,1640,0,0),(159,135,'2025-2026',18,2,5,0,0,0,2,0,1520,0,0),(160,136,'2025-2026',17,1,3,0,0,0,2,0,1400,0,0),(161,137,'2025-2026',12,0,2,0,0,0,2,0,820,0,0),(162,138,'2025-2026',10,2,1,0,0,0,1,0,680,0,0),(163,139,'2025-2026',9,0,1,0,0,0,2,0,550,0,0),(164,140,'2025-2026',18,7,3,1,0,2,2,0,1500,0,0),(165,141,'2025-2026',17,5,4,0,0,1,1,0,1380,0,0),(166,142,'2025-2026',16,4,2,1,0,1,2,0,1250,0,0),(167,143,'2025-2026',15,6,2,0,0,2,1,0,1180,0,0),(168,144,'2025-2026',10,2,1,0,0,0,1,0,640,0,0),(169,145,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(170,146,'2025-2026',11,4,1,0,0,1,2,0,720,0,0),(171,147,'2025-2026',20,0,0,0,0,0,1,0,1800,18,7),(172,148,'2025-2026',4,0,0,0,0,0,0,0,180,5,1),(173,149,'2025-2026',2,0,0,0,0,0,0,0,90,2,0),(174,150,'2025-2026',19,2,1,2,0,0,3,0,1650,0,0),(175,151,'2025-2026',18,2,0,1,0,0,2,0,1530,0,0),(176,152,'2025-2026',17,0,1,0,0,0,3,1,1420,0,0),(177,153,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(178,154,'2025-2026',19,0,2,0,0,0,1,0,1620,0,0),(179,155,'2025-2026',16,0,0,0,0,0,2,0,1280,0,0),(180,156,'2025-2026',10,0,0,0,0,0,1,0,700,0,0),(181,157,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(182,158,'2025-2026',7,0,1,0,0,0,1,0,420,0,0),(183,159,'2025-2026',18,2,4,0,0,0,3,0,1520,0,0),(184,160,'2025-2026',17,3,5,0,0,0,2,0,1400,0,0),(185,161,'2025-2026',16,1,3,0,0,0,2,0,1300,0,0),(186,162,'2025-2026',19,2,3,0,0,0,3,0,1580,0,0),(187,163,'2025-2026',11,0,2,0,0,0,2,0,760,0,0),(188,164,'2025-2026',9,1,1,0,0,0,1,0,590,0,0),(189,165,'2025-2026',10,1,0,0,0,0,2,0,680,0,0),(190,166,'2025-2026',7,0,1,0,0,0,0,0,380,0,0),(191,167,'2025-2026',6,0,0,0,0,0,1,0,320,0,0),(192,168,'2025-2026',5,0,0,0,0,0,0,0,260,0,0),(193,169,'2025-2026',17,4,2,1,0,1,2,0,1380,0,0),(194,170,'2025-2026',19,4,1,0,0,1,1,0,1520,0,0),(195,171,'2025-2026',15,3,2,1,0,0,2,0,1150,0,0),(196,172,'2025-2026',16,3,1,0,0,1,1,0,1200,0,0),(197,173,'2025-2026',9,1,0,0,0,0,1,0,540,0,0),(198,174,'2025-2026',8,4,0,1,0,2,0,0,480,0,0),(199,175,'2025-2026',19,0,0,0,0,0,1,0,1710,26,3),(200,176,'2025-2026',5,0,0,0,0,0,0,0,270,7,1),(201,177,'2025-2026',2,0,0,0,0,0,0,0,90,4,0),(202,178,'2025-2026',18,0,1,0,0,0,3,0,1550,0,0),(203,179,'2025-2026',17,1,0,1,0,0,2,0,1450,0,0),(204,180,'2025-2026',20,0,1,0,0,0,4,1,1720,0,0),(205,181,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(206,182,'2025-2026',19,0,1,0,0,0,3,0,1620,0,0),(207,183,'2025-2026',20,1,4,0,0,0,3,0,1700,0,0),(208,184,'2025-2026',17,3,2,0,0,1,2,0,1420,0,0),(209,185,'2025-2026',12,1,2,0,0,0,2,0,850,0,0),(210,186,'2025-2026',13,1,2,0,0,0,1,0,880,0,0),(211,187,'2025-2026',20,3,0,0,0,0,4,0,1700,0,0),(212,188,'2025-2026',10,1,1,0,0,0,2,0,700,0,0),(213,189,'2025-2026',8,0,1,0,0,0,1,0,480,0,0),(214,190,'2025-2026',20,10,3,2,0,1,2,0,1680,0,0),(215,191,'2025-2026',15,3,2,1,0,0,1,0,1150,0,0),(216,192,'2025-2026',20,10,4,1,0,2,2,1,1600,0,0),(217,193,'2025-2026',10,1,1,0,0,0,1,0,620,0,0),(218,194,'2025-2026',14,5,2,1,0,1,1,0,1050,0,0),(219,195,'2025-2026',20,0,0,0,0,0,1,0,1800,19,6),(220,196,'2025-2026',5,0,0,0,0,0,0,0,270,6,1),(221,197,'2025-2026',2,0,0,0,0,0,0,0,90,3,0),(222,198,'2025-2026',18,0,1,0,0,0,2,0,1530,0,0),(223,199,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(224,200,'2025-2026',18,0,1,0,0,0,3,0,1520,0,0),(225,201,'2025-2026',10,0,0,0,0,0,1,0,720,0,0),(226,202,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(227,203,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(228,204,'2025-2026',8,0,0,0,0,0,1,0,490,0,0),(229,205,'2025-2026',18,1,3,0,0,0,2,0,1480,0,0),(230,206,'2025-2026',12,0,2,0,0,0,1,0,820,0,0),(231,207,'2025-2026',17,2,3,0,0,0,2,0,1370,0,0),(232,208,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(233,209,'2025-2026',16,3,2,0,0,0,2,0,1280,0,0),(234,210,'2025-2026',19,1,4,0,0,0,3,0,1560,0,0),(235,211,'2025-2026',16,2,3,0,0,0,2,0,1250,0,0),(236,212,'2025-2026',18,6,2,1,0,2,2,0,1430,0,0),(237,213,'2025-2026',15,5,3,0,0,1,1,0,1150,0,0),(238,214,'2025-2026',10,2,1,0,0,0,1,0,620,0,0),(239,215,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(240,216,'2025-2026',19,0,0,0,0,0,1,0,1710,21,5),(241,217,'2025-2026',6,0,0,0,0,0,0,0,360,7,1),(242,218,'2025-2026',18,0,2,0,0,0,2,0,1520,0,0),(243,219,'2025-2026',17,1,1,1,0,0,3,0,1420,0,0),(244,220,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(245,221,'2025-2026',18,0,1,0,0,0,2,0,1500,0,0),(246,222,'2025-2026',15,0,0,0,0,0,1,0,1200,0,0),(247,223,'2025-2026',11,0,0,0,0,0,1,0,760,0,0),(248,224,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(249,225,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(250,226,'2025-2026',7,0,0,0,0,0,0,0,380,0,0),(251,227,'2025-2026',18,2,4,0,0,0,3,0,1480,0,0),(252,228,'2025-2026',17,4,5,0,0,0,2,0,1370,0,0),(253,229,'2025-2026',16,2,3,0,0,0,2,0,1270,0,0),(254,230,'2025-2026',12,1,1,0,0,0,2,0,800,0,0),(255,231,'2025-2026',10,0,2,0,0,0,1,0,640,0,0),(256,232,'2025-2026',9,1,1,0,0,0,1,0,560,0,0),(257,233,'2025-2026',8,0,1,0,0,0,1,0,480,0,0),(258,234,'2025-2026',17,8,3,2,0,2,2,0,1350,0,0),(259,235,'2025-2026',16,7,4,1,0,1,1,0,1230,0,0),(260,236,'2025-2026',11,3,1,1,0,0,2,0,720,0,0),(261,237,'2025-2026',15,4,2,0,0,1,1,0,1120,0,0),(262,238,'2025-2026',9,1,0,0,0,0,1,0,540,0,0),(263,239,'2025-2026',19,0,0,0,0,0,1,0,1710,28,3),(264,240,'2025-2026',6,0,0,0,0,0,0,0,360,8,0),(265,241,'2025-2026',20,1,2,1,0,0,3,0,1720,0,0),(266,242,'2025-2026',19,0,1,0,0,0,3,0,1620,0,0),(267,243,'2025-2026',18,0,0,0,0,0,2,0,1480,0,0),(268,244,'2025-2026',17,0,0,0,0,0,2,0,1380,0,0),(269,245,'2025-2026',16,0,1,0,0,0,1,0,1280,0,0),(270,246,'2025-2026',11,0,0,0,0,0,2,0,760,0,0),(271,247,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(272,248,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(273,249,'2025-2026',7,0,0,0,0,0,0,0,390,0,0),(274,250,'2025-2026',6,0,0,0,0,0,1,0,310,0,0),(275,251,'2025-2026',18,1,3,0,0,0,3,0,1480,0,0),(276,252,'2025-2026',17,2,3,0,0,0,2,0,1370,0,0),(277,253,'2025-2026',16,2,2,0,0,0,2,0,1270,0,0),(278,254,'2025-2026',12,1,1,0,0,0,2,0,800,0,0),(279,255,'2025-2026',10,0,2,0,0,0,1,0,640,0,0),(280,256,'2025-2026',9,1,0,0,0,0,1,0,560,0,0),(281,257,'2025-2026',8,0,1,0,0,0,1,0,480,0,0),(282,258,'2025-2026',9,1,0,0,0,0,2,0,560,0,0),(283,259,'2025-2026',7,0,0,0,0,0,0,0,380,0,0),(284,260,'2025-2026',5,0,0,0,0,0,0,0,270,0,0),(285,261,'2025-2026',17,5,2,0,0,1,2,0,1330,0,0),(286,262,'2025-2026',16,4,2,1,0,0,1,0,1230,0,0),(287,263,'2025-2026',15,3,1,0,0,1,2,1,1120,0,0),(288,264,'2025-2026',10,2,0,0,0,0,1,0,620,0,0),(289,265,'2025-2026',9,1,1,0,0,0,1,0,540,0,0),(290,266,'2025-2026',7,1,0,0,0,0,0,0,380,0,0),(291,267,'2025-2026',6,0,0,0,0,0,1,0,310,0,0),(312,288,'2025-2026',18,0,0,0,0,0,1,0,1620,28,2),(313,289,'2025-2026',7,0,0,0,0,0,0,0,450,10,0),(314,290,'2025-2026',17,0,1,0,0,0,3,0,1420,0,0),(315,291,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(316,292,'2025-2026',15,0,0,0,0,0,2,0,1200,0,0),(317,293,'2025-2026',14,0,0,0,0,0,1,0,1100,0,0),(318,294,'2025-2026',16,0,1,0,0,0,2,0,1300,0,0),(319,295,'2025-2026',17,1,2,0,0,0,2,0,1380,0,0),(320,296,'2025-2026',16,2,3,0,0,0,2,0,1270,0,0),(321,297,'2025-2026',15,1,2,0,0,0,1,0,1170,0,0),(322,298,'2025-2026',11,0,1,0,0,0,2,0,740,0,0),(323,299,'2025-2026',10,1,0,0,0,0,1,0,640,0,0),(324,300,'2025-2026',9,0,1,0,0,0,1,0,560,0,0),(325,301,'2025-2026',8,1,0,0,0,0,1,0,490,0,0),(326,302,'2025-2026',16,5,2,1,0,1,2,0,1250,0,0),(327,303,'2025-2026',15,4,2,1,0,0,1,0,1150,0,0),(328,304,'2025-2026',10,1,1,0,0,0,1,0,620,0,0),(329,305,'2025-2026',9,2,0,0,0,0,0,0,540,0,0),(330,306,'2025-2026',7,1,0,0,0,0,1,0,380,0,0),(331,307,'2025-2026',18,0,0,0,0,0,1,0,1620,32,2),(332,308,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(333,309,'2025-2026',16,0,1,0,0,0,2,0,1300,0,0),(334,310,'2025-2026',15,0,0,0,0,0,2,0,1200,0,0),(335,311,'2025-2026',14,0,0,0,0,0,1,0,1100,0,0),(336,312,'2025-2026',16,0,1,0,0,0,1,0,1300,0,0),(337,313,'2025-2026',17,1,2,0,0,0,3,0,1380,0,0),(338,314,'2025-2026',16,0,2,0,0,0,2,0,1270,0,0),(339,315,'2025-2026',15,1,1,0,0,0,2,0,1170,0,0),(340,316,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(341,317,'2025-2026',16,3,2,0,0,1,2,0,1250,0,0),(342,318,'2025-2026',9,0,1,0,0,0,1,0,550,0,0),(343,319,'2025-2026',16,4,2,0,0,1,2,0,1230,0,0),(344,320,'2025-2026',15,3,1,1,0,0,1,0,1130,0,0),(345,321,'2025-2026',10,1,0,0,0,0,1,0,600,0,0),(346,322,'2025-2026',18,0,0,0,0,0,1,0,1620,20,5),(347,323,'2025-2026',7,0,0,0,0,0,0,0,450,9,1),(348,324,'2025-2026',18,0,1,0,0,0,2,0,1520,0,0),(349,325,'2025-2026',17,1,0,1,0,0,3,0,1420,0,0),(350,326,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(351,327,'2025-2026',15,0,1,0,0,0,2,0,1200,0,0),(352,328,'2025-2026',17,0,0,0,0,0,1,0,1420,0,0),(353,329,'2025-2026',10,0,0,0,0,0,2,0,720,0,0),(354,330,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),(355,331,'2025-2026',18,2,3,0,0,0,3,0,1480,0,0),(356,332,'2025-2026',17,3,4,0,0,0,2,0,1370,0,0),(357,333,'2025-2026',16,1,2,0,0,0,2,0,1270,0,0),(358,334,'2025-2026',15,2,2,0,0,0,1,0,1180,0,0),(359,335,'2025-2026',11,0,2,0,0,0,2,0,760,0,0),(360,336,'2025-2026',9,1,1,0,0,0,1,0,580,0,0),(361,337,'2025-2026',17,7,3,1,0,2,2,0,1380,0,0),(362,338,'2025-2026',16,5,2,1,0,1,1,0,1250,0,0),(363,339,'2025-2026',11,2,1,0,0,0,1,0,700,0,0),(364,340,'2025-2026',10,3,1,0,0,1,1,0,640,0,0),(365,341,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),(366,342,'2025-2026',20,0,0,0,0,0,2,0,1800,30,3),(367,343,'2025-2026',18,0,0,0,0,0,3,0,1530,0,0),(368,344,'2025-2026',17,0,1,0,0,0,2,0,1420,0,0),(369,345,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(370,346,'2025-2026',15,0,0,0,0,0,1,0,1200,0,0),(371,347,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),(372,348,'2025-2026',10,0,0,0,0,0,1,0,680,0,0),(373,349,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(374,350,'2025-2026',18,1,3,0,0,0,3,0,1480,0,0),(375,351,'2025-2026',17,2,2,0,0,0,2,0,1370,0,0),(376,352,'2025-2026',16,1,2,0,0,0,2,0,1270,0,0),(377,353,'2025-2026',12,0,1,0,0,0,2,0,800,0,0),(378,354,'2025-2026',15,1,2,0,0,0,1,0,1170,0,0),(379,355,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),(380,356,'2025-2026',9,0,0,0,0,0,1,0,560,0,0),(381,357,'2025-2026',8,1,0,0,0,0,1,0,490,0,0),(382,358,'2025-2026',17,4,2,0,0,1,2,0,1330,0,0),(383,359,'2025-2026',16,5,1,1,0,1,1,0,1230,0,0),(384,360,'2025-2026',11,2,1,0,0,0,1,0,700,0,0),(385,361,'2025-2026',9,1,0,0,0,0,0,0,480,0,0),(386,362,'2025-2026',7,1,0,0,0,0,1,0,380,0,0),(387,363,'2025-2026',18,0,0,0,0,0,1,0,1620,25,3),(388,364,'2025-2026',6,0,0,0,0,0,0,0,360,9,0),(389,365,'2025-2026',2,0,0,0,0,0,0,0,90,4,0),(390,366,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),(391,367,'2025-2026',16,0,1,0,0,0,3,0,1300,0,0),(392,368,'2025-2026',15,1,0,1,0,0,2,0,1200,0,0),(393,369,'2025-2026',14,0,0,0,0,0,2,0,1100,0,0),(394,370,'2025-2026',16,0,0,0,0,0,1,0,1300,0,0),(395,371,'2025-2026',10,0,0,0,0,0,1,0,680,0,0),(396,372,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),(397,373,'2025-2026',17,1,3,0,0,0,2,0,1380,0,0),(398,374,'2025-2026',16,2,2,0,0,0,2,0,1270,0,0),(399,375,'2025-2026',15,3,2,0,0,0,1,0,1170,0,0),(400,376,'2025-2026',11,1,1,0,0,0,2,0,740,0,0),(401,377,'2025-2026',9,0,1,0,0,0,1,0,560,0,0),(402,378,'2025-2026',16,4,2,1,0,1,2,0,1250,0,0),(403,379,'2025-2026',15,5,1,0,0,1,1,0,1150,0,0),(404,380,'2025-2026',10,2,1,0,0,0,1,0,620,0,0),(408,138,'2026',0,1,0,0,0,0,0,0,0,0,0),(416,131,'2026-2027',0,0,0,0,0,0,0,0,0,0,0),(417,139,'2026-2027',0,0,0,0,0,0,0,0,0,0,0),(418,124,'2026-2027',0,0,0,0,0,0,0,0,0,0,0),(419,224,'2026-2027',0,1,0,0,0,0,0,0,0,0,0),(420,228,'2026-2027',0,1,0,0,0,0,0,0,0,0,0);
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
-- Table structure for table `jugadores`
--

DROP TABLE IF EXISTS `jugadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores` (
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
) ENGINE=InnoDB AUTO_INCREMENT=426 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores`
--

LOCK TABLES `jugadores` WRITE;
/*!40000 ALTER TABLE `jugadores` DISABLE KEYS */;
INSERT INTO `jugadores` VALUES (98,4,'Wilberth Hernández','portero',1,NULL,28,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(99,4,'Misael Erazo','portero',12,NULL,24,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,50,90,1),(100,4,'Felipe Amaya','portero',22,NULL,21,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(101,4,'Diego Flores','defensa',4,NULL,26,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,75,74,0),(102,4,'Wilber Arizala','defensa',3,NULL,27,'Colombiano','2026-04-17 21:00:39',NULL,NULL,50,76,0),(103,4,'Lizandro Claros','defensa',5,NULL,25,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(104,4,'Eduardo Vigil','defensa',6,NULL,29,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(105,4,'César Orellana','defensa',2,NULL,23,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,25,74,0),(106,4,'José Quintanilla','defensa',15,NULL,30,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(107,4,'Marlon Cornejo','defensa',17,NULL,24,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(108,4,'Mauricio Cerritos','centrocampista',8,NULL,28,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,62,48,0),(109,4,'Brayan Landaverde','centrocampista',10,NULL,27,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,88,50,0),(110,4,'Lucas R.','centrocampista',7,NULL,26,'Brasileño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(111,4,'Kevin Ascencio','centrocampista',16,NULL,22,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(112,4,'Erivan Flores','centrocampista',20,NULL,21,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(113,4,'Victor Garcia','centrocampista',14,NULL,25,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(114,4,'Brian Martínez','centrocampista',11,NULL,23,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,12,50,0),(115,4,'Jeremías Lemus','centrocampista',19,NULL,20,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(116,4,'Diego Ortez','centrocampista',21,NULL,22,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(117,4,'Marvin Aranda','centrocampista',13,NULL,26,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,38,48,1),(118,4,'Marcelo Ferreira','delantero',9,NULL,28,'Brasileño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(119,4,'Cristian Gil','delantero',18,NULL,27,'Colombiano','2026-04-17 21:00:39',NULL,NULL,18,22,0),(120,4,'Nelson Díaz','delantero',11,NULL,25,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,NULL,NULL,0),(121,4,'Elías Gumero','delantero',23,NULL,24,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,50,18,0),(122,4,'Andrés Morales','delantero',25,NULL,22,'Salvadoreño','2026-04-17 21:00:39',NULL,NULL,82,22,0),(123,5,'Daniel Franco','portero',1,NULL,28,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(124,5,'Cristopher Rauda','portero',12,NULL,22,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,50,90,1),(125,5,'Henry Romero','defensa',4,NULL,27,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,64,74,1),(126,5,'Alejandro Henríquez','defensa',3,NULL,26,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,36,74,1),(127,5,'Juan Barahona','defensa',5,NULL,29,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,88,70,1),(128,5,'Matías Steib','defensa',6,NULL,24,'Argentino','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(129,5,'Jonathan Jiménez','defensa',2,NULL,23,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,12,70,1),(130,5,'Emerson Hernández','defensa',15,NULL,25,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(131,5,'William Canales','defensa',16,NULL,28,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(132,5,'Diego Lemus','defensa',17,NULL,22,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(133,5,'Mario Jacobo','defensa',20,NULL,30,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(134,5,'Harold Osorio','centrocampista',8,NULL,27,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(135,5,'Leonardo Menjívar','centrocampista',10,NULL,26,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,72,48,1),(136,5,'Noel Rivera','centrocampista',7,NULL,25,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,50,44,1),(137,5,'Narciso Orellana','centrocampista',11,NULL,24,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,28,48,1),(138,5,'Oscar Rodríguez','centrocampista',14,NULL,23,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(139,5,'Christopher Guardado','centrocampista',19,NULL,22,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(140,5,'Enrico Dueñas Hernández','delantero',9,NULL,25,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,18,22,1),(141,5,'Francis Castillo-Orellana','delantero',18,NULL,24,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,82,22,1),(142,5,'Gustavo Moura','delantero',23,NULL,27,'Brasileño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(143,5,'Michell Mercado','delantero',21,NULL,26,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(144,5,'Juan Portillo','delantero',22,NULL,22,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,50,18,1),(145,5,'Allan Acevedo','delantero',25,NULL,21,'Salvadoreño','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(146,5,'Luis Tobar','delantero',11,NULL,28,'Chileno','2026-04-17 21:02:43',NULL,NULL,NULL,NULL,0),(147,6,'Benji Villalobos','portero',1,NULL,30,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(148,6,'Jairo Guardado','portero',12,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(149,6,'Osmán Loza','portero',22,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(150,6,'Ronald Rodríguez','defensa',4,NULL,29,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(151,6,'Julio Sibrián','defensa',3,NULL,28,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(152,6,'Erick Cabalceta','defensa',5,NULL,26,'Costarricense','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(153,6,'Jefferson Perla','defensa',6,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(154,6,'Tereso Benítez','defensa',2,NULL,31,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(155,6,'Walter Pineda','defensa',15,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(156,6,'Juan Franco Cacace','defensa',17,NULL,25,'Uruguayo','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(157,6,'José Guatemala','defensa',20,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(158,6,'Stiven Dávila','defensa',16,NULL,22,'Colombiano','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(159,6,'Santos Ortiz','centrocampista',8,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(160,6,'Tomás Granitto','centrocampista',10,NULL,26,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(161,6,'Diego Gregori','centrocampista',7,NULL,25,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(162,6,'Marcelo Díaz','centrocampista',11,NULL,28,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(163,6,'Jairo Martínez','centrocampista',14,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(164,6,'Bryan Lovo','centrocampista',19,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(165,6,'Joel Turcios','centrocampista',21,NULL,26,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(166,6,'Carlos Ortiz','centrocampista',23,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(167,6,'Marvin Benitez Jr','centrocampista',18,NULL,21,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(168,6,'Herberth Marcelo Diaz Rivas','centrocampista',24,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(169,6,'Federico Andrada','delantero',9,NULL,28,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(170,6,'Dixon Rivas','delantero',18,NULL,26,'Colombiano','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(171,6,'Ricardo Villatoro','delantero',13,NULL,25,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(172,6,'Carlos Garay','delantero',11,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(173,6,'Allan Benítez','delantero',25,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(174,6,'Eduardo Cruz','delantero',26,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),(175,7,'Julián Chicas','portero',1,NULL,28,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(176,7,'Oscar Sánchez','portero',12,NULL,25,'Salvadoreño','2026-04-17 21:03:27',50.00,90.00,NULL,NULL,1),(177,7,'Ricardo Funes','portero',22,NULL,22,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(178,7,'Leyvin Balanta','defensa',4,NULL,27,'Colombiano','2026-04-17 21:03:27',64.00,74.00,NULL,NULL,1),(179,7,'Elvis Claros','defensa',3,NULL,26,'Salvadoreño','2026-04-17 21:03:27',36.00,74.00,NULL,NULL,1),(180,7,'Fredy Espinoza','defensa',5,NULL,30,'Salvadoreño','2026-04-17 21:03:27',88.00,70.00,NULL,NULL,1),(181,7,'William Molina','defensa',6,NULL,28,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(182,7,'Rubén Marroquín','defensa',2,NULL,32,'Salvadoreño','2026-04-17 21:03:27',12.00,70.00,NULL,NULL,1),(183,7,'Jefferson Valladares','centrocampista',10,NULL,26,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(184,7,'Paolo Dantaz','centrocampista',8,NULL,26,'Argentino','2026-04-17 21:03:27',60.00,46.00,NULL,NULL,1),(185,7,'Enmanuel Hernández','centrocampista',7,NULL,23,'Salvadoreño','2026-04-17 21:03:27',40.00,46.00,NULL,NULL,1),(186,7,'Elmer Bonilla','centrocampista',14,NULL,27,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(187,7,'Marvin Ramos','centrocampista',11,NULL,28,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(188,7,'Jefferson Martinez','centrocampista',16,NULL,24,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(189,7,'Jordy Bonilla','centrocampista',19,NULL,21,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(190,7,'José Correa','delantero',9,NULL,27,'Salvadoreño','2026-04-17 21:03:27',18.00,48.00,NULL,NULL,1),(191,7,'Clayvin Zúñiga','delantero',18,NULL,25,'Hondureño','2026-04-17 21:03:27',36.00,22.00,NULL,NULL,1),(192,7,'Javier Ferman','delantero',11,NULL,28,'Salvadoreño','2026-04-17 21:03:27',82.00,48.00,NULL,NULL,1),(193,7,'Danis Cerros','delantero',21,NULL,22,'Salvadoreño','2026-04-17 21:03:27',64.00,22.00,NULL,NULL,1),(194,7,'Juan Carlos Argueta','delantero',25,NULL,24,'Salvadoreño','2026-04-17 21:03:27',NULL,NULL,NULL,NULL,0),(195,8,'Sergio Sibrián Molina','portero',1,NULL,21,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(196,8,'Hector Ramírez Carvajal','portero',12,NULL,34,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(197,8,'Adriel Martínez Castillo','portero',22,NULL,23,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(198,8,'Lautaro Toledo Pacheco','central',4,NULL,23,'Argentino','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(199,8,'Guillermo Nieves','central',3,NULL,27,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(200,8,'Ruben Marroquin','central',5,NULL,32,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(201,8,'Jorge González Lemus','central',6,NULL,21,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(202,8,'Alexis Montes Renderos','medio_ofensivo',2,NULL,27,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(203,8,'Kevin Molina Martínez','central',15,NULL,24,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(204,8,'Kevin Menjívar Henriquez','central',16,NULL,24,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(205,8,'Kevin Oviedo','centrodelantero',8,NULL,27,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(206,8,'José Serrano Montano','centrodelantero',10,NULL,21,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(207,8,'Diego Coca','centrodelantero',7,NULL,30,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(208,8,'Bryan Santos','centrodelantero',14,NULL,19,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(209,8,'Guillermo Stradella','centrodelantero',11,NULL,26,'Argentino','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(210,8,'Darwin Cerén','centrodelantero',20,NULL,27,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(211,8,'Jairo Henríquez','centrodelantero',21,NULL,32,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(212,8,'Melvin Alfaro','centrodelantero',9,NULL,26,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(213,8,'Michell Mercado','centrodelantero',18,NULL,26,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(214,8,'Carlos Alfaro','centrodelantero',22,NULL,23,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(215,8,'Edson García','centrodelantero',25,NULL,21,'Salvadoreño','2026-04-18 17:40:27',NULL,NULL,NULL,NULL,0),(216,15,'Kevin Carabantes','portero',1,NULL,29,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(217,15,'Jonathan Valle','portero',12,NULL,24,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(218,15,'Diogo Figueiras','central',4,NULL,28,'Portugués','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(219,15,'Jorge Cruz','central',3,NULL,27,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(220,15,'Miguel Murillo','central',5,NULL,26,'Colombiano','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(221,15,'Rudy Clavel','central',6,NULL,29,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(222,15,'José Guevara','central',2,NULL,25,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(223,15,'Edson Meléndez','central',15,NULL,24,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(224,15,'Juan Vega','central',17,NULL,23,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(225,15,'Diego Chávez','central',20,NULL,22,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(226,15,'David Funes','central',16,NULL,25,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(227,15,'Kevin Santamaría','centrodelantero',8,NULL,26,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(228,15,'Yan Maciel','centrodelantero',10,NULL,27,'Brasileño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(229,15,'Elmer Bonilla','centrodelantero',7,NULL,27,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(230,15,'Jonathan Nolasco','centrodelantero',11,NULL,25,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(231,15,'José Isaac Portillo','centrodelantero',14,NULL,23,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(232,15,'Roberto Melgar','centrodelantero',19,NULL,28,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(233,15,'David Montejo','centrodelantero',21,NULL,24,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(234,15,'Nelson Bonilla','centrodelantero',9,NULL,29,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(235,15,'Rafael Tejada','centrodelantero',18,NULL,26,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(236,15,'Edgar Medrano','centrodelantero',21,NULL,25,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(237,15,'Dustin Corea','centrodelantero',22,NULL,24,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(238,15,'Christopher Ortiz','centrodelantero',25,NULL,22,'Salvadoreño','2026-04-18 17:42:41',NULL,NULL,NULL,NULL,0),(239,13,'Gerson López','portero',1,NULL,27,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(240,13,'César Melara','portero',12,NULL,24,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(241,13,'Bryan Tamacas','central',4,NULL,29,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(242,13,'Alexander Larin','central',3,NULL,28,'Colombiano','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(243,13,'Iván Mancía','central',5,NULL,26,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(244,13,'Mario Martínez Donis','central',6,NULL,25,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(245,13,'Diego Chávez','central',2,NULL,24,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(246,13,'Efraín Cárcamo','central',15,NULL,27,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(247,13,'Bayron López','central',17,NULL,23,'Hondureño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(248,13,'Marvin Morales','central',20,NULL,26,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(249,13,'Elias Rivas','central',16,NULL,22,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(250,13,'William Sibrián','central',21,NULL,25,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(251,13,'Rodrigo Rivera','centrodelantero',8,NULL,26,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(252,13,'Samuel Rosales','centrodelantero',10,NULL,25,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(253,13,'Cesar Flores','centrodelantero',7,NULL,27,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(254,13,'Inner Guevara','centrodelantero',11,NULL,24,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(255,13,'Eduardo González','centrodelantero',14,NULL,23,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(256,13,'Dennis García','centrodelantero',19,NULL,26,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(257,13,'Ángel Ortega','centrodelantero',22,NULL,22,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(258,13,'Kelvin Hernández','centrodelantero',18,NULL,23,'Hondureño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(259,13,'Julio Paulino','centrodelantero',23,NULL,25,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(260,13,'Diego Rosales','centrodelantero',24,NULL,21,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(261,13,'Ezequiel Rivas','centrodelantero',9,NULL,26,'Argentino','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(262,13,'Melvin Urbina','centrodelantero',18,NULL,25,'Hondureño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(263,13,'Isaac Esquivel','centrodelantero',13,NULL,24,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(264,13,'Enrique Vásquez','centrodelantero',22,NULL,23,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(265,13,'Christian Aguilar','centrodelantero',25,NULL,22,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(266,13,'Kevin Velásquez','centrodelantero',26,NULL,21,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(267,13,'José Posada','centrodelantero',27,NULL,28,'Salvadoreño','2026-04-18 17:42:59',NULL,NULL,NULL,NULL,0),(288,11,'Daniel Arroyo','portero',1,NULL,27,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(289,11,'William Torres','portero',12,NULL,24,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(290,11,'Moises Xavier Garcia','central',4,NULL,28,'Colombiano','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(291,11,'Kevin Menjívar','central',3,NULL,25,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(292,11,'Diego Mejía','central',5,NULL,27,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(293,11,'Kevin Calderón','central',6,NULL,24,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(294,11,'Carlos Arévalo','central',2,NULL,26,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(295,11,'Emerson Sandoval','centrodelantero',8,NULL,26,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(296,11,'Jefferson Roque','centrodelantero',10,NULL,25,'Colombiano','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(297,11,'Josué Palacios','centrodelantero',7,NULL,24,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(298,11,'José Ventura','centrodelantero',11,NULL,27,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(299,11,'Franklin Martínez','centrodelantero',14,NULL,23,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(300,11,'Wilmer Novoa','centrodelantero',19,NULL,26,'Venezolano','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(301,11,'Anthony Roque','centrodelantero',20,NULL,22,'Colombiano','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(302,11,'Yair Arboleda','centrodelantero',9,NULL,27,'Colombiano','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(303,11,'Carlos Bogotá','centrodelantero',18,NULL,25,'Colombiano','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(304,11,'Bryan Ríos','centrodelantero',21,NULL,22,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(305,11,'Luis Aguilar','centrodelantero',25,NULL,24,'Salvadoreño','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(306,11,'Sebastian Ortiz','centrodelantero',22,NULL,23,'Colombiano','2026-04-18 17:45:22',NULL,NULL,NULL,NULL,0),(307,14,'sandro melgarejo','portero',1,NULL,28,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,50,90,1),(308,14,'jonathan santana','central',4,NULL,27,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,75,74,1),(309,14,'mauricio cuellar','central',3,NULL,26,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,50,76,1),(310,14,'walter guevara','central',5,NULL,29,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,NULL,NULL,0),(311,14,'marlon trejo','central',6,NULL,25,'hondureño','2026-04-21 17:53:16',NULL,NULL,NULL,NULL,0),(312,14,'willian flores','central',2,NULL,28,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,25,74,1),(313,14,'gerson mayen','medio_central',8,NULL,26,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,50,44,1),(314,14,'vinicio muñoz','medio_central',10,NULL,25,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,70,48,1),(315,14,'blas lizama','medio_central',7,NULL,27,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,30,48,1),(316,14,'jonathan pérez','medio_central',11,NULL,24,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,NULL,NULL,0),(317,14,'matías mier','medio_central',14,NULL,26,'uruguayo','2026-04-21 17:53:16',NULL,NULL,10,50,1),(318,14,'melvin alfaro','medio_central',19,NULL,25,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,90,50,1),(319,14,'josé zaldaña','centrodelantero',9,NULL,26,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,36,22,1),(320,14,'josé cabañas','centrodelantero',18,NULL,24,'salvadoreño','2026-04-21 17:53:16',NULL,NULL,64,22,1),(321,14,'josué dubón','centrodelantero',21,NULL,22,'hondureño','2026-04-21 17:53:16',NULL,NULL,NULL,NULL,0),(322,9,'óscar pleitez','portero',1,NULL,30,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,50,90,0),(323,9,'cristofer maldonado','portero',12,NULL,24,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(324,9,'roberto carlos dominguez','central',4,NULL,28,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,12,70,0),(325,9,'nicolás gómez','central',3,NULL,25,'argentino','2026-04-21 17:54:23',NULL,NULL,64,74,0),(326,9,'giovanni ávila','central',5,NULL,27,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,88,70,0),(327,9,'kevin vidal','central',6,NULL,24,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(328,9,'milton molina','central',2,NULL,29,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,36,74,0),(329,9,'raúl cruz','central',15,NULL,26,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(330,9,'hugo aguilar','central',17,NULL,28,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(331,9,'melvin cartagena','medio_central',8,NULL,26,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,60,46,0),(332,9,'gustavo machado','medio_central',10,NULL,27,'venezolano','2026-04-21 17:54:23',NULL,NULL,18,48,0),(333,9,'elvin alvarado','medio_central',7,NULL,25,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,40,46,0),(334,9,'marvin monterroza','medio_central',11,NULL,24,'colombiano','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(335,9,'julio amaya','medio_central',14,NULL,28,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(336,9,'carlos anzora','medio_central',19,NULL,23,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(337,9,'emiliano villar','centrodelantero',9,NULL,27,'argentino','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(338,9,'steven guerra','centrodelantero',18,NULL,26,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,82,48,0),(339,9,'kevin reyes','centrodelantero',21,NULL,23,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,36,22,0),(340,9,'jhonatan urrutia','centrodelantero',22,NULL,25,'colombiano','2026-04-21 17:54:23',NULL,NULL,64,22,0),(341,9,'jesús zúñiga','centrodelantero',25,NULL,22,'salvadoreño','2026-04-21 17:54:23',NULL,NULL,NULL,NULL,0),(342,12,'josué funes','portero',1,NULL,27,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,1),(343,12,'melvin cruz','central',4,NULL,28,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,12,70,1),(344,12,'alexander rodríguez','central',3,NULL,26,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,64,74,1),(345,12,'walter guevara','central',5,NULL,29,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,88,70,1),(346,12,'juan benítez','central',6,NULL,25,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,50,90,1),(347,12,'kevin oviedo','central',2,NULL,24,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,36,74,1),(348,12,'giuviny esquivel','central',15,NULL,23,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(349,12,'emerson mancía','central',17,NULL,22,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(350,12,'robin borjas','medio_central',8,NULL,26,'hondureño','2026-04-21 19:19:57',NULL,NULL,60,46,1),(351,12,'michael rodríguez quiñonez','medio_central',10,NULL,27,'nicaragüense','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,1),(352,12,'edwin Sánchez','medio_central',7,NULL,25,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,40,46,1),(353,12,'wilson rugama','medio_central',11,NULL,24,'nicaragüense','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(354,12,'fernando clavel','medio_central',14,NULL,28,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,1),(355,12,'rené granados','medio_central',19,NULL,26,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(356,12,'wálter chigüila','medio_central',20,NULL,27,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(357,12,'víctor torres','medio_central',21,NULL,23,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(358,12,'joshua gallardo','centrodelantero',9,NULL,26,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,82,48,1),(359,12,'dany cetré','centrodelantero',18,NULL,25,'colombiano','2026-04-21 19:19:57',NULL,NULL,36,22,0),(360,12,'enrique rivas','centrodelantero',22,NULL,24,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,64,22,0),(361,12,'carlos martínez','centrodelantero',25,NULL,23,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,NULL,NULL,0),(362,12,'jonathan hernández','centrodelantero',NULL,NULL,22,'salvadoreño','2026-04-21 19:19:57',NULL,NULL,18,48,0),(363,10,'marlon joya','portero',1,NULL,27,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(364,10,'cristian bonilla','portero',12,NULL,23,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(365,10,'jeremy rodríguez','portero',22,NULL,20,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(366,10,'guillermo fuentes','central',4,NULL,27,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(367,10,'anderson portillo','central',3,NULL,25,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(368,10,'jonathan quintanilla','central',5,NULL,28,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(369,10,'ronald padilla','central',6,NULL,26,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(370,10,'francisco carballo','central',2,NULL,29,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(371,10,'reinaldo aparicio','central',15,NULL,24,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(372,10,'daniel marquez','central',17,NULL,23,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(373,10,'daniel arévalo','medio_central',8,NULL,25,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(374,10,'elias umeres','medio_central',10,NULL,27,'peruano','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(375,10,'luis hinestroza','medio_central',7,NULL,26,'colombiano','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(376,10,'herbert sosa','medio_central',11,NULL,24,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(377,10,'kevin garay','medio_central',14,NULL,23,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0),(378,10,'oscar cerén','centrodelantero',9,NULL,26,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(379,10,'alesson','centrodelantero',18,NULL,24,'brasileño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,1),(380,10,'paolo ulloa','centrodelantero',21,NULL,22,'salvadoreño','2026-04-21 19:21:15',NULL,NULL,NULL,NULL,0);
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
-- Table structure for table `jugadores_seleccion`
--

DROP TABLE IF EXISTS `jugadores_seleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion` (
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
  `ip` varchar(45) NOT NULL,
  `email_apodo` varchar(150) DEFAULT NULL,
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
  `division` varchar(20) NOT NULL DEFAULT 'primera',
  `minuto` int NOT NULL DEFAULT '0',
  `tipo` enum('gol','gol_penal','gol_cabeza','gol_tiro_libre','asistencia','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','descanso','fin','penal') NOT NULL DEFAULT 'comentario',
  `descripcion` text NOT NULL,
  `equipo` varchar(150) DEFAULT NULL,
  `jugador_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_partido` (`partido_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_comments`
--

LOCK TABLES `match_comments` WRITE;
/*!40000 ALTER TABLE `match_comments` DISABLE KEYS */;
INSERT INTO `match_comments` VALUES (14,76,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. Municipal Limeño 0 - 0 C.D. Águila.','C.D. Municipal Limeño',NULL,'2026-06-08 15:39:57'),(16,77,'primera',15,'gol','⚽ ¡GOOOOOL! Oscar Rodríguez marca para Alianza F.C. en el minuto 15.','Alianza F.C.',138,'2026-06-08 15:42:14'),(17,77,'primera',45,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.','Alianza F.C.',NULL,'2026-06-08 15:42:29'),(18,77,'primera',0,'inicio','▶️ ¡Arranca el partido! Segunda parte en juego.','Alianza F.C.',NULL,'2026-06-08 15:43:03'),(19,77,'primera',45,'comentario','Inicio de la segunda parte','Alianza F.C.',NULL,'2026-06-08 15:43:21'),(20,77,'primera',65,'gol_cabeza','🤕 ¡Gol de CABEZA! William Canales conecta de manera impresionante. Minuto 0.','Alianza F.C.',131,'2026-06-08 15:43:46'),(21,77,'primera',89,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 2 - 0 Inter TECLA.','Alianza F.C.',NULL,'2026-06-08 15:43:52'),(22,78,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-06-08 16:11:26'),(23,78,'primera',9,'cambio','🔄 Cambio en C.D. FAS: Sale Kevin Carabantes, entra Jonathan Nolasco. Minuto 9.','C.D. FAS',230,'2026-06-08 16:21:19'),(24,78,'primera',140,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 0-0.','',NULL,'2026-06-08 18:31:34'),(25,78,'primera',45,'inicio','▶️ ¡Empieza la segunda parte!','',NULL,'2026-06-08 20:13:24'),(26,78,'primera',138,'cambio','🔄 Cambio en C.D. FAS: Sale Jonathan Valle, entra Kevin Carabantes. Minuto 138.','C.D. FAS',216,'2026-06-08 21:46:28'),(27,78,'primera',153,'tarjeta_amarilla','🟨 Tarjeta amarilla para Brayan Landaverde de L.A. Firpo. Minuto 153.','L.A. Firpo',109,'2026-06-08 22:02:19'),(28,78,'primera',154,'tarjeta_roja','🟥 ¡Tarjeta ROJA! Brayan Landaverde queda expulsado. Minuto 154.','L.A. Firpo',109,'2026-06-08 22:02:48'),(29,78,'primera',154,'cambio','🔄 Cambio en L.A. Firpo: Sale Lucas R., entra Marvin Aranda. Minuto 154.','L.A. Firpo',117,'2026-06-08 22:03:21'),(30,78,'primera',182,'cambio','🔄 Cambio en L.A. Firpo: Sale Wilberth Hernández, entra Misael Erazo. Minuto 182. [SALE:98]','L.A. Firpo',99,'2026-06-08 22:30:29'),(31,78,'primera',204,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. FAS 0 - 0 L.A. Firpo.','C.D. FAS',NULL,'2026-06-08 22:53:23'),(32,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-08 20:17:15'),(33,74,'primera',1,'cambio','🔄 Cambio en C.D. FAS: Sale José Guevara, entra Juan Vega. Minuto 1. [SALE:222]','C.D. FAS',224,'2026-07-08 20:18:34'),(34,74,'primera',4,'gol','⚽ ¡GOOOOOL! Juan Vega marca para C.D. FAS en el minuto 4.','C.D. FAS',224,'2026-07-08 20:22:11'),(35,74,'primera',5,'gol','⚽ ¡GOOOOOL! Yan Maciel marca para C.D. FAS en el minuto 5.','C.D. FAS',228,'2026-07-08 20:22:51'),(36,74,'primera',92,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 0 - 2 C.D. FAS.','Alianza F.C.',NULL,'2026-07-10 15:11:07'),(37,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-10 15:25:16'),(38,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-10 15:25:18'),(39,74,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 0 - 2 C.D. FAS.','Alianza F.C.',NULL,'2026-07-10 15:25:25');
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
  `titulo` varchar(255) NOT NULL,
  `contenido` text,
  `categoria` varchar(100) DEFAULT NULL,
  `autor` varchar(100) DEFAULT NULL,
  `media` text,
  `estado` enum('Publicado','Borrador') DEFAULT 'Publicado',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
INSERT INTO `noticias` VALUES (1,'El Salvador pierde 2-0 Contra honduras','Triste derrota para El Salvador','Selección','Jose Felix Sinto Masin',NULL,'Publicado','2026-04-02 08:08:50','http://numeros-y-futbol.test/backend/uploads/69ce2412160eb.jpg'),(3,'Águila impone su jerarquía y vence 3-1 a Cacahuatique','En una tarde donde la diferencia de calidad fue evidente, CD Águila se quedó con una victoria contundente 3-1 sobre CD Cacahuatique.\n\nDesde los primeros minutos, Águila mostró intensidad y control del balón, dominando el ritmo del partido y generando peligro constante en el área rival. La apertura del marcador llegó tras una jugada bien construida, reflejando la superioridad ofensiva de los locales.\n\nCacahuatique intentó reaccionar y logró descontar, metiendo algo de presión en el encuentro, pero la respuesta de Águila fue inmediata. Con orden táctico y efectividad frente al arco, los emplumados ampliaron la ventaja y sentenciaron el partido sin mayores complicaciones.\n\nEl pitazo final confirmó una victoria sólida que reafirma el buen momento de Águila, mientras que Cacahuatique deberá ajustar en defensa si quiere competir en las próximas jornadas.','Liga Mayor','Jose Felix Sinto Masin',NULL,'Publicado','2026-04-03 19:12:32','http://numeros-y-futbol.test/backend/uploads/69d0112080e10.jpg'),(5,'Alianza impone su jerarquía con goleada 5-2 sobre LA Firpo','Alianza FC firmó una actuación contundente y ofensivamente eficaz al superar 5-2 a LA Firpo, consolidando su dominio en el encuentro desde los primeros compases. El conjunto capitalino mostró superioridad en la circulación de balón, aprovechamiento de espacios y definición en el último tercio, aspectos que marcaron la diferencia en el marcador.\n\nPor su parte, Firpo logró generar ocasiones y anotar en dos oportunidades, pero evidenció fragilidad defensiva y dificultades para contener las transiciones rápidas del rival. El resultado refleja no solo la efectividad de Alianza, sino también su capacidad para gestionar el ritmo del partido y capitalizar errores defensivos.\n\nCon este triunfo, Alianza reafirma su condición de candidato, mientras que Firpo deberá ajustar su estructura defensiva si pretende competir con mayor solidez en próximos compromisos.','Liga Mayor','Jose Felix Sinto Masin',NULL,'Publicado','2026-04-07 12:15:46','http://numeros-y-futbol.test/backend/uploads/69d4f572a9e5f.jpg'),(6,'Zacatecoluca se impone por la mínima ante Platense en un duelo cerrado','Zacatecoluca logró una victoria ajustada de 1-0 frente a Platense en un encuentro caracterizado por la paridad táctica y la intensidad en el mediocampo. El único gol del compromiso llegó como resultado de una acción bien estructurada, en la que el equipo local supo capitalizar una de las pocas oportunidades claras generadas.\n\nA lo largo del partido, Platense intentó reaccionar mediante transiciones rápidas y juego por bandas, pero se encontró con una defensa bien organizada que neutralizó sus avances. Zacatecoluca, por su parte, mostró orden defensivo y disciplina táctica para sostener la ventaja.\n\nEl resultado refleja un partido equilibrado, donde la eficacia y la solidez defensiva fueron determinantes. Zacatecoluca suma tres puntos importantes, mientras Platense deberá mejorar su contundencia en ataque para futuros compromisos.','Liga Mayor','Jose Felix Sinto Masin',NULL,'Publicado','2026-04-07 12:18:28','http://numeros-y-futbol.test/backend/uploads/69d4f61479054.jpg'),(7,'Firpo resumen','Text','Liga Mayor','Jose Felix Sinto Masin',NULL,'Publicado','2026-04-07 16:26:56','http://numeros-y-futbol.test/backend/uploads/69d53050461a7.mp4'),(9,'FAS y Alianza se enfrentan en duelo decisivo','El fútbol salvadoreño vive una de sus noches más intensas con el enfrentamiento entre C.D. FAS y Alianza F.C., dos de los equipos más históricos y competitivos del país. El partido, marcado por un ambiente electrizante en las gradas, reúne a miles de aficionados que convierten el estadio en un auténtico espectáculo.\n\nAmbos conjuntos llegan con altas expectativas, buscando no solo los tres puntos, sino también el orgullo de imponerse en el clásico nacional. FAS apuesta por su tradición y garra, mientras que Alianza intenta imponer su estilo dinámico y ofensivo.\n\nDesde el inicio, el encuentro promete intensidad, con jugadas rápidas, presión constante y una rivalidad que trasciende generaciones. Este tipo de partidos no solo define posiciones en la tabla, sino que también fortalece la identidad y pasión del fútbol salvadoreño.\n\nSin duda, este duelo entre FAS y Alianza reafirma por qué es considerado uno de los enfrentamientos más importantes del país, dejando emociones, polémicas y momentos memorables dentro y fuera del campo.','Liga Mayor','Jose Felix Sinto Masin',NULL,'Publicado','2026-04-17 20:06:28','http://numeros-y-futbol.test/backend/uploads/69e292c46f5d6.jpg');
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
  `estado` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos`
--

LOCK TABLES `partidos` WRITE;
/*!40000 ALTER TABLE `partidos` DISABLE KEYS */;
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
  `status` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_ascenso`
--

LOCK TABLES `partidos_ascenso` WRITE;
/*!40000 ALTER TABLE `partidos_ascenso` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=623 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_copa`
--

LOCK TABLES `partidos_copa` WRITE;
/*!40000 ALTER TABLE `partidos_copa` DISABLE KEYS */;
INSERT INTO `partidos_copa` VALUES (554,200,209,3,3,'2026-03-12','14:44:00','Finalizado','grupos',NULL,'D',NULL,NULL,NULL,'2026-07-10 18:16:00','2026-07-10 20:43:57'),(555,200,214,1,0,'2026-02-24','14:39:00','Finalizado','grupos',NULL,'D',NULL,NULL,NULL,'2026-07-10 18:16:01','2026-07-10 20:39:15'),(556,200,236,2,2,'2026-02-12','14:38:00','Finalizado','grupos',NULL,'D',NULL,NULL,NULL,'2026-07-10 18:16:01','2026-07-10 20:38:28'),(557,209,214,0,3,'2026-02-12','14:30:00','Finalizado','grupos',NULL,'D',NULL,NULL,NULL,'2026-07-10 18:16:01','2026-07-10 20:37:34'),(558,209,236,1,0,'2026-02-25','14:39:00','Finalizado','grupos',NULL,'D',NULL,NULL,NULL,'2026-07-10 18:16:01','2026-07-10 20:39:53'),(559,214,236,1,0,'2026-03-12','14:43:00','Finalizado','grupos',NULL,'D',NULL,NULL,NULL,'2026-07-10 18:16:02','2026-07-10 20:43:37'),(560,210,208,1,1,'2026-07-10','14:49:00','Finalizado','grupos',NULL,'E',NULL,NULL,NULL,'2026-07-10 18:16:02','2026-07-10 21:29:45'),(561,210,229,3,2,'2026-02-24','15:30:00','Finalizado','grupos',NULL,'E',NULL,NULL,NULL,'2026-07-10 18:16:02','2026-07-10 21:31:37'),(562,210,211,2,0,'2026-03-10','15:30:00','Finalizado','grupos',NULL,'E',NULL,NULL,NULL,'2026-07-10 18:16:02','2026-07-10 21:32:54'),(563,208,229,2,2,'2026-03-11','15:30:00','Finalizado','grupos',NULL,'E',NULL,NULL,NULL,'2026-07-10 18:16:03','2026-07-10 21:33:13'),(564,208,211,3,1,'2026-02-25','15:30:00','Finalizado','grupos',NULL,'E',NULL,NULL,NULL,'2026-07-10 18:16:03','2026-07-10 21:32:28'),(565,229,211,2,0,'2026-02-10','14:48:00','Finalizado','grupos',NULL,'E',NULL,NULL,NULL,'2026-07-10 18:16:03','2026-07-10 20:49:00'),(566,204,203,1,1,'2026-02-26','15:59:00','Finalizado','grupos',NULL,'F',NULL,NULL,NULL,'2026-07-10 18:16:03','2026-07-10 21:59:39'),(567,204,212,2,0,'2026-02-12','15:56:00','Finalizado','grupos',NULL,'F',NULL,NULL,NULL,'2026-07-10 18:16:04','2026-07-10 21:57:03'),(568,204,230,1,0,'2026-03-10','15:59:00','Finalizado','grupos',NULL,'F',NULL,NULL,NULL,'2026-07-10 18:16:04','2026-07-10 22:00:04'),(569,203,212,3,1,'2026-03-11','16:00:00','Finalizado','grupos',NULL,'F',NULL,NULL,NULL,'2026-07-10 18:16:04','2026-07-10 22:00:47'),(570,203,230,4,1,'2026-02-10','15:55:00','Finalizado','grupos',NULL,'F',NULL,NULL,NULL,'2026-07-10 18:16:05','2026-07-10 21:56:14'),(571,212,230,2,0,'2026-02-24','15:57:00','Finalizado','grupos',NULL,'F',NULL,NULL,NULL,'2026-07-10 18:16:05','2026-07-10 21:57:33'),(572,202,206,2,1,'2026-03-11','14:30:00','Finalizado','grupos',NULL,'A',NULL,NULL,NULL,'2026-07-10 18:18:30','2026-07-10 18:27:46'),(573,202,221,1,1,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'A',NULL,NULL,NULL,'2026-07-10 18:18:30','2026-07-10 21:27:56'),(574,202,234,1,1,'2026-02-25','14:29:00','Finalizado','grupos',NULL,'A',NULL,NULL,NULL,'2026-07-10 18:18:30','2026-07-10 18:27:30'),(575,206,221,0,0,'2026-02-25','14:30:00','Finalizado','grupos',NULL,'A',NULL,NULL,NULL,'2026-07-10 18:18:30','2026-07-10 18:27:22'),(576,206,234,3,1,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'A',NULL,NULL,NULL,'2026-07-10 18:18:31','2026-07-10 21:28:30'),(577,221,234,0,0,'2026-03-10','14:30:00','Finalizado','grupos',NULL,'A',NULL,NULL,NULL,'2026-07-10 18:18:31','2026-07-10 18:27:35'),(578,207,201,0,1,'2026-02-26','14:00:00','Finalizado','grupos',NULL,'B',NULL,NULL,NULL,'2026-07-10 18:18:31','2026-07-10 20:09:56'),(579,219,201,1,4,'2026-02-11','12:30:00','Finalizado','grupos',NULL,'B',NULL,NULL,NULL,'2026-07-10 18:18:31','2026-07-10 18:29:25'),(580,201,251,2,0,'2026-03-12','14:15:00','Finalizado','grupos',NULL,'B',NULL,NULL,NULL,'2026-07-10 18:18:31','2026-07-10 20:15:18'),(581,219,207,3,3,'2026-03-11','14:00:00','Finalizado','grupos',NULL,'B',NULL,NULL,NULL,'2026-07-10 18:18:32','2026-07-10 20:11:11'),(582,251,207,0,3,'2026-02-12','14:30:00','Finalizado','grupos',NULL,'B',NULL,NULL,NULL,'2026-07-10 18:18:32','2026-07-10 20:08:18'),(583,251,219,0,1,'2026-02-26','14:30:00','Finalizado','grupos',NULL,'B',NULL,NULL,NULL,'2026-07-10 18:18:32','2026-07-10 20:08:50'),(584,205,199,0,1,'2026-02-25','14:22:00','Finalizado','grupos',NULL,'C',NULL,NULL,NULL,'2026-07-10 18:18:32','2026-07-10 20:22:54'),(585,205,245,4,1,'2026-02-11','14:19:00','Finalizado','grupos',NULL,'C',NULL,NULL,NULL,'2026-07-10 18:18:33','2026-07-10 20:19:58'),(586,205,218,3,0,'2026-03-11','14:24:00','Finalizado','grupos',NULL,'C',NULL,NULL,NULL,'2026-07-10 18:18:33','2026-07-10 20:24:20'),(587,199,245,1,1,'2026-03-10','14:23:00','Finalizado','grupos',NULL,'C',NULL,NULL,NULL,'2026-07-10 18:18:33','2026-07-10 20:23:26'),(588,199,218,0,3,'2026-02-10','14:17:00','Finalizado','grupos',NULL,'C',NULL,NULL,NULL,'2026-07-10 18:18:33','2026-07-10 20:18:45'),(589,245,218,3,0,'2026-02-24','14:20:00','Finalizado','grupos',NULL,'C',NULL,NULL,NULL,'2026-07-10 18:18:33','2026-07-10 20:21:18'),(606,214,199,0,2,'2026-04-08','15:00:00','Finalizado','octavos',NULL,NULL,'ida',NULL,NULL,'2026-07-10 22:09:26','2026-07-10 22:09:26'),(607,199,214,3,0,'2026-04-24','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',NULL,NULL,'2026-07-10 22:10:22','2026-07-10 22:10:22'),(608,200,204,3,1,'2026-04-07','19:00:00','Finalizado','octavos',NULL,NULL,'ida',NULL,NULL,'2026-07-11 02:28:10','2026-07-11 02:28:10'),(609,204,200,1,1,'2026-04-21','17:00:00','Finalizado','octavos',NULL,NULL,'vuelta',NULL,NULL,'2026-07-11 19:38:12','2026-07-11 19:38:12'),(610,245,202,0,0,'2026-04-09','17:00:00','Finalizado','octavos',NULL,NULL,'ida',NULL,NULL,'2026-07-12 01:26:24','2026-07-12 01:26:24'),(611,202,245,2,1,'2026-04-23','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',NULL,NULL,'2026-07-12 01:27:07','2026-07-12 01:27:07'),(612,229,201,2,4,'2026-04-08','17:00:00','Finalizado','octavos',NULL,NULL,'ida',NULL,NULL,'2026-07-12 02:03:01','2026-07-12 02:03:01'),(613,201,229,4,1,'2026-04-22','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',NULL,NULL,'2026-07-12 02:04:10','2026-07-12 02:04:10'),(614,219,210,1,5,'2026-04-08','17:00:00','Finalizado','octavos',NULL,NULL,'ida',NULL,NULL,'2026-07-12 02:05:35','2026-07-12 02:05:35'),(615,210,219,4,1,'2026-04-21','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',NULL,NULL,'2026-07-12 02:07:36','2026-07-12 02:07:36'),(616,206,207,1,1,'2026-04-09','17:00:00','Finalizado','octavos',NULL,NULL,'ida',NULL,NULL,'2026-07-12 02:11:22','2026-07-12 02:11:22'),(617,207,206,1,0,'2026-04-21','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',NULL,NULL,'2026-07-12 02:15:16','2026-07-12 02:15:16'),(618,208,205,0,2,'2026-04-08','15:00:00','Finalizado','octavos',NULL,NULL,'ida',NULL,NULL,'2026-07-12 02:19:50','2026-07-12 02:19:50'),(619,205,208,0,2,'2026-04-23','19:20:00','Finalizado','octavos',NULL,NULL,'vuelta',4,2,'2026-07-12 02:22:28','2026-07-12 02:22:28'),(620,209,203,0,4,'2026-04-07','17:00:00','Finalizado','octavos',NULL,NULL,'ida',NULL,NULL,'2026-07-12 02:24:24','2026-07-12 02:24:24'),(621,203,209,2,1,'2026-04-22','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',NULL,NULL,'2026-07-12 02:25:04','2026-07-12 02:25:04'),(622,199,200,NULL,NULL,'2026-09-02','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',NULL,NULL,'2026-07-12 02:25:53','2026-07-12 02:25:53');
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
  `estado` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_femenina`
--

LOCK TABLES `partidos_femenina` WRITE;
/*!40000 ALTER TABLE `partidos_femenina` DISABLE KEYS */;
INSERT INTO `partidos_femenina` VALUES (1000,1,2,0,0,0,'2026-07-03 17:46:10','Pendiente',0);
/*!40000 ALTER TABLE `partidos_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_seleccion`
--

DROP TABLE IF EXISTS `partidos_seleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion` (
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_seleccion`
--

LOCK TABLES `partidos_seleccion` WRITE;
/*!40000 ALTER TABLE `partidos_seleccion` DISABLE KEYS */;
INSERT INTO `partidos_seleccion` VALUES (1,'Argentina','https://minixcollection.com/wp-content/uploads/2023/10/logo-afa.png',1,3,'2026-07-02','15:15:00','Finalizado','Amistoso','Visitante','2026-07-03 20:16:00');
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
-- Table structure for table `reset_tokens`
--

DROP TABLE IF EXISTS `reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_tokens` (
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
  `key` varchar(100) NOT NULL,
  `value` text,
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
) ENGINE=InnoDB AUTO_INCREMENT=543 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones`
--

LOCK TABLES `tabla_posiciones` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones` DISABLE KEYS */;
INSERT INTO `tabla_posiciones` VALUES (14,4,0,0,0,0,0,0,0),(17,5,0,0,0,0,0,0,0),(18,6,0,0,0,0,0,0,0),(21,7,0,0,0,0,0,0,0),(22,8,0,0,0,0,0,0,0),(23,9,0,0,0,0,0,0,0),(61,10,0,0,0,0,0,0,0),(74,11,0,0,0,0,0,0,0),(75,12,0,0,0,0,0,0,0),(76,13,0,0,0,0,0,0,0),(77,14,0,0,0,0,0,0,0),(384,15,0,0,0,0,0,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_ascenso`
--

LOCK TABLES `tabla_posiciones_ascenso` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_ascenso` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_ascenso` VALUES (1,1,0,0,0,0,0,0,0,0),(2,2,0,0,0,0,0,0,0,0),(3,3,0,0,0,0,0,0,0,0),(4,4,0,0,0,0,0,0,0,0),(5,5,0,0,0,0,0,0,0,0),(6,6,0,0,0,0,0,0,0,0),(7,7,0,0,0,0,0,0,0,0),(8,8,0,0,0,0,0,0,0,0),(9,9,0,0,0,0,0,0,0,0),(10,10,0,0,0,0,0,0,0,0),(11,11,0,0,0,0,0,0,0,0),(12,12,0,0,0,0,0,0,0,0),(13,13,0,0,0,0,0,0,0,0),(14,14,0,0,0,0,0,0,0,0),(15,15,0,0,0,0,0,0,0,0),(16,16,0,0,0,0,0,0,0,0),(17,17,0,0,0,0,0,0,0,0),(18,18,0,0,0,0,0,0,0,0),(19,19,0,0,0,0,0,0,0,0),(20,20,0,0,0,0,0,0,0,0),(21,21,0,0,0,0,0,0,0,0),(22,22,0,0,0,0,0,0,0,0),(23,23,0,0,0,0,0,0,0,0),(24,24,0,0,0,0,0,0,0,0),(25,25,0,0,0,0,0,0,0,0),(26,26,0,0,0,0,0,0,0,0),(27,27,0,0,0,0,0,0,0,0),(28,28,0,0,0,0,0,0,0,0),(29,29,0,0,0,0,0,0,0,0),(30,30,0,0,0,0,0,0,0,0),(31,31,0,0,0,0,0,0,0,0),(32,32,0,0,0,0,0,0,0,0),(33,33,0,0,0,0,0,0,0,0),(34,34,0,0,0,0,0,0,0,0),(35,35,0,0,0,0,0,0,0,0),(36,36,0,0,0,0,0,0,0,0),(37,37,0,0,0,0,0,0,0,0),(38,38,0,0,0,0,0,0,0,0),(39,39,0,0,0,0,0,0,0,0),(40,40,0,0,0,0,0,0,0,0),(41,41,0,0,0,0,0,0,0,0),(42,42,0,0,0,0,0,0,0,0),(43,43,0,0,0,0,0,0,0,0),(44,44,0,0,0,0,0,0,0,0),(45,45,0,0,0,0,0,0,0,0),(46,46,0,0,0,0,0,0,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_femenina`
--

LOCK TABLES `tabla_posiciones_femenina` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_femenina` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_femenina` VALUES (1,1,0,0,0,0,0,0,0),(2,2,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `tabla_posiciones_femenina` ENABLE KEYS */;
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
  `nombre` varchar(100) DEFAULT NULL,
  `apodo` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `idx_apodo` (`apodo`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (9,'Ariel','Sirenoman123','unmaje@gmail.com','$2y$10$u7QxKMFb3dN2iT/fWCD5b.3bgl5lmRAya893EoHaItD3uWdl19Rue','admin'),(12,'Ariel Soto','sirenoman','vanesotomayor0411@gmail.com','$2y$10$G8nLBg96/DSykaQWI2fGzud7oha0.mj3wxdfTojNScxLcoWoeMWeS','usuario'),(13,'Alejandro','megatomayor','arielosotomayor0411@gmail.com','$2y$10$u.E3hJUD9o5jZF4LvMj2xOrRiZDgKBtXNtpOQAwImuRUkTls4/J82','usuario');
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
  `ip_hash` char(64) NOT NULL,
  `pagina` varchar(255) NOT NULL,
  `user_agent` text,
  `referer` varchar(500) DEFAULT NULL,
  `es_bot` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ip` (`ip_hash`),
  KEY `idx_created` (`created_at`),
  KEY `idx_pagina` (`pagina`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas`
--

LOCK TABLES `visitas` WRITE;
/*!40000 ALTER TABLE `visitas` DISABLE KEYS */;
INSERT INTO `visitas` VALUES (1,'::1','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/primera',0,'2026-07-10 05:13:27'),(2,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-10 05:48:42'),(3,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-10 05:52:53'),(4,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-10 05:53:41'),(5,'::1','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 05:53:44'),(6,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/primera',0,'2026-07-10 05:53:48'),(7,'::1','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 05:55:31'),(8,'::1','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 05:55:42'),(9,'::1','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 05:55:43'),(10,'::1','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 05:55:45'),(11,'::1','/manage-seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 05:55:49'),(12,'::1','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion-femenina',0,'2026-07-10 05:59:13'),(13,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:01:09'),(14,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:03:11'),(15,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:03:46'),(16,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:04:36'),(17,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:08:01'),(18,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 06:13:32'),(19,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 06:16:32'),(20,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 06:26:52'),(21,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 06:26:59'),(22,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:27:29'),(23,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:31:26'),(24,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:32:18'),(25,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:33:36'),(26,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:34:51'),(27,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:37:47'),(28,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 06:38:13'),(29,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 06:39:07'),(30,'::1','/manage-seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 06:40:05'),(31,'::1','/admin/plantilla','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 06:40:09'),(32,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 12:53:18'),(33,'::1','/admin/plantilla','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 12:53:18'),(34,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 13:22:42'),(35,'::1','/admin/plantilla','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:22:42'),(36,'::1','/admin/plantilla','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:22:47'),(37,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 13:22:47'),(38,'::1','/admin/plantilla','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:25:14'),(39,'::1','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 13:25:14'),(40,'::1','/manage-seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:30:58'),(41,'::1','/teams/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:35:22'),(42,'::1','/teams/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:35:43'),(43,'::1','/teams/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:35:51'),(44,'::1','/mynews','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:35:53'),(45,'::1','/manage-news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:36:41'),(46,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:37:47'),(47,'::1','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 13:54:56'),(48,'::1','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 13:55:05'),(49,'::1','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-10 13:55:33'),(50,'::1','/partido/1000/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-10 13:55:40'),(51,'::1','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-10 13:55:45'),(52,'::1','/teams/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:55:51'),(53,'::1','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:56:27'),(54,'::1','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:57:01'),(55,'::1','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:57:02'),(56,'::1','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/plantilla',0,'2026-07-10 13:57:03'),(57,'::1','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 13:57:09'),(58,'::1','/teams/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 14:31:38'),(59,'::1','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 14:31:38'),(60,'::1','/teams/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 14:35:30'),(61,'::1','/teams/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 14:46:59'),(62,'::1','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 14:47:05'),(63,'::1','/admin/plantilla','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 14:49:10'),(64,'::1','/admin/plantilla','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 14:52:37'),(65,'::1','/teams/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 14:52:41'),(66,'::1','/manage-seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 14:52:44'),(67,'::1','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-10 14:56:02'),(68,'::1','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/femenina',0,'2026-07-10 14:56:05'),(69,'::1','/manage-seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 14:57:13'),(70,'::1','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/femenina',0,'2026-07-10 14:58:39'),(71,'::1','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 14:59:37'),(72,'::1','/noticia/9','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 14:59:41'),(73,'::1','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 14:59:48'),(74,'::1','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/news',0,'2026-07-10 14:59:50'),(75,'::1','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/femenina',0,'2026-07-10 14:59:52'),(76,'::1','/manage-seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 15:03:42'),(77,'::1','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/femenina',0,'2026-07-10 15:05:16'),(78,'::1','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/femenina',0,'2026-07-10 15:06:31'),(79,'::1','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/teams/femenina',0,'2026-07-10 15:10:08'),(80,'::1','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:10:14'),(81,'::1','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:10:42'),(82,'::1','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:10:44'),(83,'::1','/matches','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:10:50'),(84,'::1','/manage-comments','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:10:55'),(85,'::1','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:11:14'),(86,'::1','/partido/76/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:12:43'),(87,'::1','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:12:50'),(88,'::1','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:25:07'),(89,'::1','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:25:29'),(90,'::1','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:25:35'),(91,'::1','/mynews','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:25:36'),(92,'::1','/matches','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:25:37'),(93,'::1','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:25:42'),(94,'::1','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:25:47'),(95,'::1','/matches','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:42:10'),(96,'::1','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:42:26'),(97,'::1','/matches','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:45:39'),(98,'::1','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:45:46'),(99,'::1','/partido/1000/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:45:48'),(100,'::1','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:46:09'),(101,'::1','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:46:11'),(102,'::1','/users','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:46:16'),(103,'::1','/settings','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:48:21'),(104,'::1','/partido/1000/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/seleccion',0,'2026-07-10 15:51:23'),(105,'::1','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 15:51:28'),(106,'::1','/partido/1000/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 15:52:17'),(107,'::1','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 15:52:42'),(108,'::1','/matches','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 15:57:31'),(109,'::1','/','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/',0,'2026-07-10 16:09:51'),(110,'::1','/partido/1000/femenina','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/',0,'2026-07-10 16:13:15'),(111,'::1','/femenina','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:13:23'),(112,'::1','/perfil','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:15:50'),(113,'::1','/dashboard','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:15:55'),(114,'::1','/matches','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:16:05'),(115,'::1','/mynews','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:16:06'),(116,'::1','/manage-news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:16:56'),(117,'::1','/users','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:17:23'),(118,'::1','/','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/',0,'2026-07-10 16:20:50'),(119,'::1','/','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/',0,'2026-07-10 16:55:52'),(120,'::1','/ascenso','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/',0,'2026-07-10 16:55:57'),(121,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:56:22'),(122,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 16:59:25'),(123,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 17:02:40'),(124,'::1','/ascenso','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/',0,'2026-07-10 17:02:45'),(125,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 17:19:23'),(126,'::1','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 17:23:51'),(127,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 17:38:30'),(128,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/users','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 17:51:50'),(129,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 17:51:51'),(130,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/analytics','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/partido/1000/femenina',0,'2026-07-10 17:53:40'),(131,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/ascenso','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://localhost:5173/',0,'2026-07-10 17:53:51'),(132,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-10 18:03:20'),(133,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-10 19:45:21'),(134,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-10 20:24:52'),(135,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/',0,'2026-07-10 20:34:58'),(136,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-10 21:49:15'),(137,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-11 00:52:53'),(138,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-11 02:28:39'),(139,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/ascenso',0,'2026-07-11 02:29:05'),(140,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-11 16:13:53'),(141,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-11 19:37:02'),(142,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-11 19:37:34'),(143,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-11 19:37:41'),(144,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-12 00:00:24'),(145,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-12 01:24:23'),(146,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-12 02:07:40'),(147,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/teams/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-12 02:17:05'),(148,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/copa-presidente',0,'2026-07-12 04:23:16'),(149,'94e93931967140690c187b2e308214f5130dc0ec55afbdf5a3eae38184861015','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://localhost:5173/admin/copa',0,'2026-07-12 04:23:17');
/*!40000 ALTER TABLE `visitas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'numeros-y-futbol'
--

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

-- Dump completed on 2026-07-14 20:14:21
