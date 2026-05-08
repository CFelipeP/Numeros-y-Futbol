<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8mb4", "root", "Info2026/*-");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("
        SELECT 
            p.id,
            p.equipo_local_id  AS team1_id,
            p.equipo_visitante_id AS team2_id,
            el.nombre  AS team1,
            ev.nombre  AS team2,
            el.logo    AS logo1,
            ev.logo    AS logo2,
            el.division AS division1,
            ev.division AS division2,
            p.goles_local,
            p.goles_visitante,
            p.fecha,
            p.hora,
            p.estado,
            p.fase,
            p.grupo_copa AS grupo
        FROM partidos_copa p
        JOIN equipos_copa el ON el.id = p.equipo_local_id
        JOIN equipos_copa ev ON ev.id = p.equipo_visitante_id
        ORDER BY p.fase, p.grupo_copa, p.fecha, p.id
    ");

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}