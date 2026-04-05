<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $con = new mysqli('localhost', 'root', 'Info2026/*-', 'numeros-y-futbol');
    $con->set_charset('utf8');

    $r = $con->query("SELECT p.*,
        el.nombre AS home_name, el.logo AS home_logo,
        ev.nombre AS away_name, ev.logo AS away_logo
        FROM partidos p
        JOIN equipos el ON p.local_id = el.id
        JOIN equipos ev ON p.visitante_id = ev.id
        WHERE p.featured = 1
        LIMIT 1");

    if ($r && $f = $r->fetch_assoc()) {
        echo json_encode($f);
    } else {
        echo json_encode([]);
    }
    $con->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}