<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

 $host = '127.0.0.1';
 $dbname = 'numeros-y-futbol';
 $user = 'root';
 $pass = 'Info2026/*-';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Conexión fallida: ' . $e->getMessage()]);
    exit();
}

 $response = ['next' => null, 'recent' => []];

// Próximo partido: busco Pendiente con goles NULL (tu lógica original pero con tabla correcta)
try {
    $stmt = $pdo->query("
        SELECT 
            p.id, p.featured,
            el.nombre AS home_name, el.logo AS home_logo,
            ev.nombre AS away_name, ev.logo AS away_logo,
            p.goles_local, p.goles_visitante,
            DATE_FORMAT(p.fecha, '%d/%m/%Y %H:%i') AS fecha,
            p.status
        FROM partidos_segunda p
        INNER JOIN equipos_segunda el ON p.local_id = el.id
        INNER JOIN equipos_segunda ev ON p.visitante_id = ev.id
        WHERE p.status = 'Pendiente'
        ORDER BY p.fecha ASC
        LIMIT 1
    ");
    $row = $stmt->fetch();
    if ($row) $response['next'] = $row;
} catch (PDOException $e) {}

// Últimos resultados
try {
    $stmt = $pdo->query("
        SELECT 
            p.id, p.featured,
            el.nombre AS home_name, el.logo AS home_logo,
            ev.nombre AS away_name, ev.logo AS away_logo,
            p.goles_local, p.goles_visitante,
            DATE_FORMAT(p.fecha, '%d/%m/%Y %H:%i') AS fecha,
            p.status
        FROM partidos_segunda p
        INNER JOIN equipos_segunda el ON p.local_id = el.id
        INNER JOIN equipos_segunda ev ON p.visitante_id = ev.id
        WHERE p.status = 'Finalizado'
        ORDER BY p.fecha DESC
        LIMIT 5
    ");
    $rows = $stmt->fetchAll();
    if ($rows) $response['recent'] = $rows;
} catch (PDOException $e) {}

echo json_encode($response);