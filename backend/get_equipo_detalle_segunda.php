<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

 $host = 'localhost';
 $db   = 'numeros-y-futbol';
 $user = 'root';
 $pass = 'Info2026/*-';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Error de conexión: " . $e->getMessage()]);
    exit();
}

 $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    echo json_encode(["success" => false, "error" => "ID requerido"]);
    exit();
}

 $stmt = $pdo->prepare("SELECT * FROM equipos_segunda WHERE id = ?");
 $stmt->execute([$id]);
 $equipo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$equipo) {
    echo json_encode(["success" => false, "error" => "Equipo no encontrado"]);
    exit();
}

 $stmt = $pdo->prepare("
    SELECT 
        j.*,
        est.id AS stats_id,
        est.partidos_jugados AS pj,
        est.goles,
        est.asistencias,
        est.goles_cabeza,
        est.goles_tiro_libre,
        est.goles_penal,
        est.tarjetas_amarillas,
        est.tarjetas_rojas,
        est.minutos_jugados,
        est.goles_recibidos,
        est.vaya_invicta,
        est.temporada
    FROM jugadores_segunda j
    LEFT JOIN estadisticas_jugadores_segunda est 
        ON est.jugador_id = j.id AND est.temporada = '2025-2026'
    WHERE j.equipo_id = ?
    ORDER BY 
        CASE j.posicion
            WHEN 'portero' THEN 1
            WHEN 'lateral_izquierdo' THEN 2
            WHEN 'lateral_derecho' THEN 3
            WHEN 'central' THEN 4
            WHEN 'medio_defensivo' THEN 5
            WHEN 'medio_central' THEN 6
            WHEN 'medio_ofensivo' THEN 7
            WHEN 'extremo_izquierdo' THEN 8
            WHEN 'extremo_derecho' THEN 9
            WHEN 'centrodelantero' THEN 10
            WHEN 'segundo_delantero' THEN 11
            ELSE 12
        END,
        j.numero_camiseta ASC
");
 $stmt->execute([$id]);
 $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "equipo" => $equipo,
    "jugadores" => $jugadores
]);