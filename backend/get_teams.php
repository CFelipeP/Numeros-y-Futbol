<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Content-Type: application/json; charset=utf-8");

// ... resto del código ...
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

$res = $conn->query("SELECT * FROM equipos");

$data = [];

while($row = $res->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);