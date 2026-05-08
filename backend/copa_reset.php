<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8mb4", "root", "Info2026/*-");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
        echo json_encode(["success" => false, "message" => "Modo inválido"]);
        exit;
    }

    echo json_encode(["success" => true, "message" => $msg]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}