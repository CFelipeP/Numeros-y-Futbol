<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

 $host = '127.0.0.1';
 $dbname = 'numeros-y-futbol';
 $user = 'root';
 $pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(null);
    exit();
}

try {
    $sql = "
        SELECT 
            p.id,
            p.equipo_local AS local_id,
            p.equipo_visitante AS visitante_id,
            p.goles_local,
            p.goles_visitante,
            p.estado,
            p.fecha,
            el.nombre AS home_name,
            el.logo AS home_logo,
            ev.nombre AS away_name,
            ev.logo AS away_logo
        FROM partidos p
        INNER JOIN equipos el ON el.id = p.equipo_local
        INNER JOIN equipos ev ON ev.id = p.equipo_visitante
        WHERE p.featured = 1
        ORDER BY p.fecha DESC
        LIMIT 1
    ";

    $stmt = $pdo->query($sql);
    $match = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$match) {
        echo json_encode(null);
    } else {
        echo json_encode($match);
    }
} catch (Exception $e) {
    // Si falla la consulta, devolver null sin exponer el error
    echo json_encode(null);
}