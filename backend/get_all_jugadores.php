<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->query("
        SELECT 
            j.id,
            j.nombre,
            j.posicion,
            j.numero_camiseta,
            j.foto,
            e.nombre AS equipo
        FROM jugadores j
        INNER JOIN equipos e ON e.id = j.equipo_id
        ORDER BY j.numero_camiseta ASC
    ");
    echo json_enc([
        "success" => true,
        "jugadores" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (Exception $e) {
    echo json_enc([
        "success" => false,
        "error" => "Error interno del servidor"
    ]);
}
