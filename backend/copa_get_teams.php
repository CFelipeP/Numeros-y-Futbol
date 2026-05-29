<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {

    // Traer equipos de equipos_copa (ya registrados para la copa)
    $stmt = $pdo->query("
        SELECT ec.id, ec.nombre, ec.logo, ec.division, ec.grupo, ec.activo,
               ec.equipo_id
        FROM equipos_copa ec
        WHERE ec.activo = 1
        ORDER BY FIELD(ec.division,'Primera','Segunda','Tercera'), ec.nombre
    ");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error interno del servidor"]);
}