<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$data = [];

try {
    $sql = "SELECT tp.id, tp.equipo_id, e.nombre, e.logo, e.grupo,
            tp.pj, tp.pg, tp.pe, tp.pp, tp.gf, tp.gc, tp.dg, tp.pts
            FROM tabla_posiciones_tercera tp
            JOIN equipos_tercera e ON tp.equipo_id = e.id
            ORDER BY e.grupo ASC,
                     CASE
                       WHEN e.grupo = 'Oriente A' THEN FIELD(e.id, 38, 41, 37, 39, 36, 33, 40, 35, 34)
                       ELSE 0
                     END ASC,
                     tp.pts DESC, tp.dg DESC, tp.gf DESC";
    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
} catch (Exception $e) {}

echo json_enc($data);
