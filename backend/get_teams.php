<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$res = $conn->query("SELECT * FROM equipos");
if (!$res) { echo json_enc([]); exit; }

$data = [];

while($row = $res->fetch_assoc()){
    $data[] = $row;
}

echo json_enc($data);
