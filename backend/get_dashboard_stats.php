<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
} catch (Exception $e) {
    echo json_encode(['error' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}

if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión']);
    exit;
}

 $division = $_GET['division'] ?? 'primera';

// Nombres de tablas y columnas según la división
if ($division === 'primera') {
    $tablaPartidos = 'partidos';
    $colEstado = 'estado';
    $tablaPosiciones = 'tabla_posiciones';
} else {
    $sufijo = $division === 'segunda' ? '_segunda' : '_tercera';
    $tablaPartidos = 'partidos' . $sufijo;
    $colEstado = 'status';
    $tablaPosiciones = 'tabla_posiciones' . $sufijo;
}

 $pendientes = 0;
 $jugados    = 0;
 $goles      = 0;
 $noticias   = 0;
 $equipos    = 0;
 $usuarios   = 0;

try {
    $pendientes = (int)$conn->query("SELECT COUNT(*) FROM $tablaPartidos WHERE $colEstado IS NULL OR $colEstado != 'Finalizado'")->fetch_row()[0];
} catch (Exception $e) {}

try {
    $jugados = (int)$conn->query("SELECT COUNT(*) FROM $tablaPartidos WHERE $colEstado = 'Finalizado'")->fetch_row()[0];
} catch (Exception $e) {}

try {
    $r = $conn->query("SELECT COALESCE(SUM(goles_local), 0) + COALESCE(SUM(goles_visitante), 0) AS total FROM $tablaPartidos WHERE $colEstado = 'Finalizado'");
    $goles = (int)($r->fetch_row()[0] ?? 0);
} catch (Exception $e) {}

try {
    $noticias = (int)$conn->query("SELECT COUNT(*) FROM noticias WHERE estado = 'Publicado'")->fetch_row()[0];
} catch (Exception $e) {}

try {
    $equipos = (int)$conn->query("SELECT COUNT(*) FROM $tablaPosiciones")->fetch_row()[0];
} catch (Exception $e) {}

try {
    $usuarios = (int)$conn->query("SELECT COUNT(*) FROM usuarios")->fetch_row()[0];
} catch (Exception $e) {}

echo json_encode([
    'pendientes' => $pendientes,
    'jugados'    => $jugados,
    'goles'      => $goles,
    'noticias'   => $noticias,
    'equipos'    => $equipos,
    'usuarios'   => $usuarios,
]);

 $conn->close();