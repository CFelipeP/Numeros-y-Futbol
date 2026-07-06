<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$data = [];

try {
    $res = $conn->query("SELECT * FROM equipos_tercera ORDER BY FIELD(grupo, 'Occidente A','Occidente B','Oriente A','Oriente B'), nombre ASC");
} catch (Exception $e) {
    $res = false;
}

if (!$res) {
    try {
        $res = $conn->query("SELECT * FROM equipos_tercera ORDER BY nombre ASC");
    } catch (Exception $e) {
        $res = false;
    }
}

if ($res) {
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_enc($data);
