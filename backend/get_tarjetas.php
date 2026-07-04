<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : 'amarillas';

try {
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
    echo json_enc($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo json_enc([
        'error' => "Error interno del servidor"
    ]);
}
