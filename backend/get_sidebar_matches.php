<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$division = $_GET['division'] ?? 'primera';

if ($division === 'primera') {
    $tablaPartidos = 'partidos';
    $tablaEquipos  = 'equipos';
    $colEstado     = 'estado';
    $colLocal      = 'equipo_local';
    $colVisitante  = 'equipo_visitante';
} elseif ($division === 'femenina') {
    $tablaPartidos = 'partidos_femenina';
    $tablaEquipos  = 'equipos_primera_femenina';
    $colEstado     = 'estado';
    $colLocal      = 'equipo_local';
    $colVisitante  = 'equipo_visitante';
} else {
    $sufijo = $division === 'segunda' ? '_segunda' : '_tercera';
    $tablaPartidos = 'partidos' . $sufijo;
    $tablaEquipos  = 'equipos' . $sufijo;
    $colEstado     = 'status';
    $colLocal      = 'local_id';
    $colVisitante  = 'visitante_id';
}

$recent = [];
try {
    $res = $conn->query("
        SELECT p.id, p.fecha, p.goles_local, p.goles_visitante, p.$colEstado AS status,
               e1.nombre AS home_name, e1.logo AS home_logo,
               e2.nombre AS away_name, e2.logo AS away_logo
        FROM $tablaPartidos p
        LEFT JOIN $tablaEquipos e1 ON p.$colLocal = e1.id
        LEFT JOIN $tablaEquipos e2 ON p.$colVisitante = e2.id
        WHERE p.$colEstado = 'Finalizado'
        ORDER BY p.fecha DESC, p.id DESC
        LIMIT 5
    ");
    while ($row = $res->fetch_assoc()) {
        $recent[] = $row;
    }
} catch (Exception $e) {
    $recent = [];
}

$next = null;
try {
    $res2 = $conn->query("
        SELECT p.id, p.fecha,
               e1.nombre AS home_name, e1.logo AS home_logo,
               e2.nombre AS away_name, e2.logo AS away_logo
        FROM $tablaPartidos p
        LEFT JOIN $tablaEquipos e1 ON p.$colLocal = e1.id
        LEFT JOIN $tablaEquipos e2 ON p.$colVisitante = e2.id
        WHERE p.$colEstado IS NULL OR p.$colEstado != 'Finalizado'
        ORDER BY p.fecha ASC, p.id ASC
        LIMIT 1
    ");
    $row2 = $res2->fetch_assoc();
    if ($row2) {
        $next = $row2;
    }
} catch (Exception $e) {
    $next = null;
}

echo json_enc(['recent' => $recent, 'next' => $next]);

$conn->close();
