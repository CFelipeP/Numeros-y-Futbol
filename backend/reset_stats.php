<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar el preflight OPTIONS que envía el navegador
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión']);
    exit;
}

 $input = json_decode(file_get_contents("php://input"), true);
 $division = $input['division'] ?? 'primera';

if ($division === 'primera') {
    $tablaPartidos   = 'partidos';
    $tablaPosiciones = 'tabla_posiciones';
    $setCols = "partidos_jugados = 0, ganados = 0, empatados = 0, perdidos = 0, goles_favor = 0, goles_contra = 0, puntos = 0";
} else {
    $sufijo = $division === 'segunda' ? '_segunda' : '_tercera';
    $tablaPartidos   = 'partidos' . $sufijo;
    $tablaPosiciones = 'tabla_posiciones' . $sufijo;
    $setCols = "pj = 0, pg = 0, pe = 0, pp = 0, gf = 0, gc = 0, dg = 0, pts = 0";
}

 $ok1 = $conn->query("UPDATE $tablaPosiciones SET $setCols");
if (!$ok1) {
    echo json_encode(['success' => false, 'error' => 'Error al reiniciar posiciones en ' . $tablaPosiciones]);
    $conn->close();
    exit;
}

 $ok2 = $conn->query("DELETE FROM $tablaPartidos");
if (!$ok2) {
    echo json_encode(['success' => false, 'error' => 'Error al eliminar partidos de ' . $tablaPartidos]);
    $conn->close();
    exit;
}

echo json_encode(['success' => true, 'message' => 'Temporada reiniciada correctamente']);

 $conn->close();