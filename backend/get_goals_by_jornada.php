<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$division = $_GET['division'] ?? 'primera';

if ($division === 'primera') {
    $tablaPartidos = 'partidos';
    $colEstado = 'estado';
} elseif ($division === 'femenina') {
    $tablaPartidos = 'partidos_femenina';
    $colEstado = 'estado';
} elseif ($division === 'reservas') {
    $tablaPartidos = 'partidos_reservas';
    $colEstado = 'estado';
} else {
    $sufijo = ($division === 'segunda' || $division === 'ascenso') ? '_segunda' : '_tercera';
    $tablaPartidos = 'partidos' . $sufijo;
    $colEstado = 'status';
}

if ($division === 'primera') {
    $tablaPartidos = 'partidos';
    $colEstado = 'estado';
} elseif ($division === 'femenina') {
    $tablaPartidos = 'partidos_femenina';
    $colEstado = 'estado';
} elseif ($division === 'reservas') {
    $tablaPartidos = 'partidos_reservas';
    $colEstado = 'estado';
} else {
    $tablaPartidos = 'partidos_ascenso';
    $colEstado = 'status';
}

$res = $conn->query("
    SELECT goles_local, goles_visitante, fecha, jornada
    FROM $tablaPartidos
    WHERE $colEstado = 'Finalizado' AND jornada IS NOT NULL
    ORDER BY jornada ASC, fecha ASC, id ASC
");

if (!$res) {
        echo json_encode([]);
    exit;
}

$rows = [];
while ($row = $res->fetch_assoc()) {
    $rows[] = $row;
}

$data = [];
$jornadas = [];

foreach ($rows as $partido) {
    $j = (int)$partido['jornada'];
    if (!isset($jornadas[$j])) {
        $jornadas[$j] = ['goles' => 0, 'fechaInicio' => '', 'fechaFin' => '', 'partidos' => 0];
    }
    $jornadas[$j]['goles'] += (int)$partido['goles_local'] + (int)$partido['goles_visitante'];
    $fi = substr($partido['fecha'], 0, 10);
    if ($jornadas[$j]['fechaInicio'] === '') $jornadas[$j]['fechaInicio'] = $fi;
    $jornadas[$j]['fechaFin'] = $fi;
    $jornadas[$j]['partidos']++;
}

ksort($jornadas);

foreach ($jornadas as $num => $info) {
    $data[] = [
        'name'     => "Jornada " . $num,
        'goles'    => $info['goles'],
        'fecha'    => $info['fechaInicio'] . " → " . $info['fechaFin'],
        'partidos' => $info['partidos'],
    ];
}

echo json_encode($data);
$conn->close();
