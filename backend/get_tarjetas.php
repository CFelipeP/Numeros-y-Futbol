<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

 $host = 'localhost';
 $db   = 'numeros-y-futbol';
 $user = 'root';
 $pass = 'Info2026/*-';

 $tipo = isset($_GET['tipo']) ? $_GET['tipo'] : 'amarillas';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($tipo === 'rojas') {
        $orderBy = "s.tarjetas_rojas DESC";
        $whereExtra = "AND s.tarjetas_rojas > 0";
        $valorCol = "s.tarjetas_rojas AS valor";
    } else {
        $orderBy = "s.tarjetas_amarillas DESC";
        $whereExtra = "AND s.tarjetas_amarillas > 0";
        $valorCol = "s.tarjetas_amarillas AS valor";
    }

    $stmt = $pdo->query("
        SELECT 
            j.id,
            j.nombre,
            j.posicion,
            j.numero_camiseta,
            j.foto,
            e.nombre AS equipo,
            e.logo AS equipo_logo,
            s.partidos_jugados AS pj,
            s.tarjetas_amarillas,
            s.tarjetas_rojas,
            $valorCol
        FROM estadisticas_jugadores s
        INNER JOIN jugadores j ON j.id = s.jugador_id
        INNER JOIN equipos e ON e.id = j.equipo_id
        WHERE s.temporada = '2025-2026' $whereExtra
        ORDER BY $orderBy
        LIMIT 10
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'line' => $e->getLine()
    ]);
}