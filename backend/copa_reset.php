<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

try {

    $body = json_decode(file_get_contents("php://input"), true);
    $mode = $body['mode'] ?? 'scores'; // 'scores' | 'all' | 'groups'

    if ($mode === 'scores') {
        // Solo reiniciar resultados de partidos
        $pdo->query("UPDATE partidos_copa SET goles_local = NULL, goles_visitante = NULL, estado = 'Pendiente'");
        $msg = "Resultados de partidos reiniciados";
    } elseif ($mode === 'groups') {
        // Solo limpiar grupos
        $pdo->query("UPDATE equipos_copa SET grupo = NULL");
        $msg = "Grupos reiniciados";
    } elseif ($mode === 'all') {
        // Eliminar todos los partidos y limpiar grupos
        $pdo->query("DELETE FROM partidos_copa");
        $pdo->query("UPDATE equipos_copa SET grupo = NULL");
        $msg = "Copa reiniciada completamente";
    } else {
        echo json_enc(["success" => false, "message" => "Modo inválido"]);
        exit;
    }

    echo json_enc(["success" => true, "message" => $msg]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_enc(["success" => false, "message" => "Error interno del servidor"]);
}