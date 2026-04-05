<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $id = isset($_POST['match_id']) ? intval($_POST['match_id']) : 0;
    $val = isset($_POST['featured']) ? intval($_POST['featured']) : -1;

    if ($id === 0 || $val === -1) {
        echo json_encode(['error' => 'Faltan parametros']);
        exit;
    }

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $con = new mysqli('localhost', 'root', 'Info2026/*-', 'numeros-y-futbol');
    $con->set_charset('utf8');

    $con->query("UPDATE partidos SET featured = $val WHERE id = $id");
    echo json_encode(['success' => true]);
    $con->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}