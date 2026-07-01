<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$division = $_GET['division'] ?? 'primera';

$validDivisions = ['primera' => ['partidos', 'estado', 'tabla_posiciones', '_'],
                   'segunda' => ['partidos_segunda', 'status', 'tabla_posiciones_segunda', '_segunda'],
                   'tercera' => ['partidos_tercera', 'status', 'tabla_posiciones_tercera', '_tercera'],
                   'femenina' => ['partidos_femenina', 'estado', 'tabla_posiciones_femenina', '_femenina']];

if (!isset($validDivisions[$division])) {
    echo json_encode(['error' => 'División inválida']);
    exit;
}

$tablaPartidos   = $validDivisions[$division][0];
$colEstado       = $validDivisions[$division][1];
$tablaPosiciones = $validDivisions[$division][2];

$pendientes = 0;
$jugados    = 0;
$goles      = 0;
$noticias   = 0;
$equipos    = 0;
$usuarios   = 0;

try {
    $pendientes = (int)$conn->query("SELECT COUNT(*) FROM $tablaPartidos WHERE $colEstado IS NULL OR $colEstado != 'Finalizado'")->fetchColumn();
} catch (Exception $e) {}

try {
    $jugados = (int)$conn->query("SELECT COUNT(*) FROM $tablaPartidos WHERE $colEstado = 'Finalizado'")->fetchColumn();
} catch (Exception $e) {}

try {
    $r = $conn->query("SELECT COALESCE(SUM(goles_local), 0) + COALESCE(SUM(goles_visitante), 0) AS total FROM $tablaPartidos WHERE $colEstado = 'Finalizado'");
    $goles = (int)($r->fetchColumn() ?? 0);
} catch (Exception $e) {}

try {
    $noticias = (int)$conn->query("SELECT COUNT(*) FROM noticias WHERE estado = 'Publicado'")->fetchColumn();
} catch (Exception $e) {}

try {
    $equipos = (int)$conn->query("SELECT COUNT(*) FROM $tablaPosiciones")->fetchColumn();
} catch (Exception $e) {}

try {
    $usuarios = (int)$conn->query("SELECT COUNT(*) FROM usuarios")->fetchColumn();
} catch (Exception $e) {}

echo json_encode([
    'pendientes' => $pendientes,
    'jugados'    => $jugados,
    'goles'      => $goles,
    'noticias'   => $noticias,
    'equipos'    => $equipos,
    'usuarios'   => $usuarios,
]);
