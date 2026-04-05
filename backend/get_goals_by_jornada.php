<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

// Traer TODOS los partidos finalizados ordenados cronológicamente
 $res = $conn->query("
    SELECT goles_local, goles_visitante, fecha
    FROM partidos
    WHERE estado = 'Finalizado'
    ORDER BY fecha ASC, id ASC
");

if (!$res) {
    echo json_encode([]);
    exit;
}

// Pasar todos a un array
 $rows = [];
while ($row = $res->fetch_assoc()) {
    $rows[] = $row;
}

// Agrupar de 6 en 6
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