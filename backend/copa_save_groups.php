<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8mb4", "root", "Info2026/*-");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $body       = json_decode(file_get_contents("php://input"), true);
    $assignments = $body['assignments'] ?? [];

    // Limpiar todos los grupos primero
    $pdo->query("UPDATE equipos_copa SET grupo = NULL");

    $stmt = $pdo->prepare("UPDATE equipos_copa SET grupo = ? WHERE id = ?");
    $count = 0;
    foreach ($assignments as $grupo => $ids) {
        foreach ($ids as $id) {
            $stmt->execute([$grupo, (int)$id]);
            $count++;
        }
    }

    echo json_encode(["success" => true, "updated" => $count]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}