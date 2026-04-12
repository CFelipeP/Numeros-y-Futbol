<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

 $conn = new mysqli("localhost", "root", 'Info2026/*-', "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexion"]);
    exit;
}

// Forzamos el INSERT normal (sin IGNORE) para ver si hay un error de columnas
 $insert = $conn->query("INSERT INTO tabla_posiciones (equipo_id, partidos_jugados, ganados, empatados, perdidos, goles_favor, goles_contra, puntos) SELECT id, 0, 0, 0, 0, 0, 0, 0 FROM equipos WHERE id NOT IN (SELECT equipo_id FROM tabla_posiciones)");

if (!$insert) {
    // Si esto falla, nos dirá exactamente qué columna está mal
    echo json_encode(["error" => "Error al sincronizar equipos: " . $conn->error]);
    exit;
}

// Consulta final
 $sql = "SELECT tp.id, tp.equipo_id, tp.partidos_jugados, tp.ganados, tp.empatados, tp.perdidos, tp.goles_favor, tp.goles_contra, tp.puntos, e.nombre, e.logo FROM tabla_posiciones tp JOIN equipos e ON tp.equipo_id = e.id ORDER BY tp.puntos DESC, (tp.goles_favor - tp.goles_contra) DESC, tp.goles_favor DESC";

 $result = $conn->query($sql);
 $data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Si sigue vacío, lanzamos un aviso
if (empty($data)) {
    echo json_encode(["error" => "La consulta no devolvió datos. Revisa que la tabla tabla_posiciones tenga registros."]);
    exit;
}

echo json_encode($data);
?>