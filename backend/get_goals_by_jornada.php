<?php
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

 $division = $_GET['division'] ?? 'primera';

if ($division === 'primera') {
    $tablaPartidos = 'partidos';
    $colEstado = 'estado';
} else {
    $sufijo = $division === 'segunda' ? '_segunda' : '_tercera';
    $tablaPartidos = 'partidos' . $sufijo;
    $colEstado = 'status';
}

 $res = $conn->query("
    SELECT goles_local, goles_visitante, fecha
    FROM $tablaPartidos
    WHERE $colEstado = 'Finalizado'
    ORDER BY fecha ASC, id ASC
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
 $jornada = 1;
 $total = count($rows);

for ($i = 0; $i < $total; $i += 6) {
    $bloque = array_slice($rows, $i, 6);
    $goles = 0;
    $fechaInicio = "";
    $fechaFin = "";

    foreach ($bloque as $partido) {
        $goles += (int)$partido['goles_local'] + (int)$partido['goles_visitante'];
        $fi = substr($partido['fecha'], 0, 10);
        if ($fechaInicio === "") $fechaInicio = $fi;
        $fechaFin = $fi;
    }

    $data[] = [
        'name'     => "Jornada " . $jornada,
        'goles'    => $goles,
        'fecha'    => $fechaInicio . " → " . $fechaFin,
        'partidos' => count($bloque),
    ];
    $jornada++;
}

echo json_encode($data);
 $conn->close();