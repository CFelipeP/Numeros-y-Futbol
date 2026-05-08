<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8mb4", "root", "Info2026/*-");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}