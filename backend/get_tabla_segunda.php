<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
if ($conn->connect_error) { echo json_encode(["error" => "DB error"]); exit; }

 $sql = "SELECT tp.id, tp.equipo_id, e.nombre, e.logo, e.grupo,
        tp.pj, tp.pg, tp.pe, tp.pp, tp.gf, tp.gc, tp.dg, tp.pts
        FROM tabla_posiciones_segunda tp
        JOIN equipos_segunda e ON tp.equipo_id = e.id
        ORDER BY e.grupo ASC, tp.pts DESC, tp.dg DESC, tp.gf DESC";

 $result = $conn->query($sql);
 $data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode($data);
 $conn->close();