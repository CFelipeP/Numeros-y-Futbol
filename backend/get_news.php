<?php
header('Content-Type: application/json'); // Aseguramos que la respuesta sea JSON
error_reporting(0); ini_set('display_errors', 0); // Deshabilitamos la muestra de errores para producción
require_once __DIR__ . '/cors.php';

try {
    require_once __DIR__ . '/db.php'; // Incluimos la conexión a la base de datos

    // 🔥 SI VIENE ID → UNA NOTICIA
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $sql = $conn->prepare("SELECT * FROM noticias WHERE id = :id");
        $sql->bindParam(":id", $id, PDO::PARAM_INT);
        $sql->execute();
        $news = $sql->fetch(PDO::FETCH_ASSOC);
        echo json_enc($news);
    } else {
        // 🔥 TODAS LAS NOTICIAS
        $sql = $conn->prepare("SELECT * FROM noticias ORDER BY fecha DESC");
        $sql->execute();
        $news = $sql->fetchAll(PDO::FETCH_ASSOC);
        echo json_enc($news);
    }
} catch (PDOException $e) {
    // Captura errores de la base de datos
    echo json_enc(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    // Captura otros errores generales
    echo json_enc(['success' => false, 'message' => 'Error interno del servidor: ' . $e->getMessage()]);
}
