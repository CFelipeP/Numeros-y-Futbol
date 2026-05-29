<?php
header('Content-Type: application/json'); // Aseguramos que la respuesta sea JSON
error_reporting(0); ini_set('display_errors', 0); // Deshabilitamos la muestra de errores para producción
require_once __DIR__ . '/cors.php';

try {
    require_once __DIR__ . '/db.php'; // Incluimos la conexión a la base de datos

    // Solo Primera División, los más recientes primero
    $sql = $conn->query("
        SELECT
            p.id,
            p.goles_local,
            p.goles_visitante,
            p.estado,
            p.fecha,
            el.nombre AS team1,
            el.logo   AS logo1,
            ev.nombre AS team2,
            ev.logo   AS logo2
        FROM partidos p
        JOIN equipos el ON p.equipo_local     = el.id
        JOIN equipos ev ON p.equipo_visitante = ev.id
        WHERE p.estado IN ('Finalizado', 'En Curso', 'Pendiente')
        ORDER BY
            FIELD(p.estado, 'En Curso', 'Pendiente', 'Finalizado'),
            p.fecha DESC
        LIMIT 6
    ");

    $partidos = $sql->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $partidos]);
} catch (PDOException $e) {
    // Captura errores de la base de datos
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
} catch (Exception $e) {
    // Captura otros errores generales
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor: ' . $e->getMessage()]);
}
