<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    die("Error de conexión");
}

// Auto-sync: INSERT IGNORE no inserta si equipo_id ya existe (gracias al UNIQUE INDEX)
 $conn->query("
    INSERT IGNORE INTO tabla_posiciones (equipo_id, partidos_jugados, ganados, empatados, perdidos, goles_favor, goles_contra, puntos)
    SELECT id, 0, 0, 0, 0, 0, 0, 0 FROM equipos
");

// Eliminar filas de equipos borrados
 $conn->query("DELETE FROM tabla_posiciones WHERE equipo_id NOT IN (SELECT id FROM equipos)");

// Consulta final
 $sql = "
SELECT 
    tp.id,
    tp.equipo_id,
    tp.partidos_jugados,
    tp.ganados,
    tp.empatados,
    tp.perdidos,
    tp.goles_favor,
    tp.goles_contra,
    tp.puntos,
    e.nombre,
    e.logo
FROM tabla_posiciones tp
JOIN equipos e ON tp.equipo_id = e.id
ORDER BY tp.puntos DESC, (tp.goles_favor - tp.goles_contra) DESC, tp.goles_favor DESC
";

 $result = $conn->query($sql);
 $data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);