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

 $pendientes = 0;
 $jugados    = 0;
 $goles      = 0;
 $noticias   = 0;
 $equipos    = 0;
 $usuarios   = 0;

try {
    $pendientes = (int)$conn->query("SELECT COUNT(*) FROM partidos WHERE estado IS NULL OR estado != 'Finalizado'")->fetch_row()[0];
} catch (Exception $e) {}

try {
    $jugados = (int)$conn->query("SELECT COUNT(*) FROM partidos WHERE estado = 'Finalizado'")->fetch_row()[0];
} catch (Exception $e) {}

try {
    // CORREGIDO: paréntesis mal cerrados y SUM mal escrito
    $r = $conn->query("SELECT COALESCE(SUM(goles_local), 0) + COALESCE(SUM(goles_visitante), 0) AS total FROM partidos WHERE estado = 'Finalizado'");
    $goles = (int)($r->fetch_row()[0] ?? 0);
} catch (Exception $e) {}

try {
    // CORREGIDO: tu tabla no tiene columna "activa", usa "estado = 'Publicado'"
    $noticias = (int)$conn->query("SELECT COUNT(*) FROM noticias WHERE estado = 'Publicado'")->fetch_row()[0];
} catch (Exception $e) {}

try {
    $equipos = (int)$conn->query("SELECT COUNT(*) FROM tabla_posiciones")->fetch_row()[0];
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