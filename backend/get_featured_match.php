<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

try {
    $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
    
    if ($conn->connect_error) {
        echo "{}";
        exit;
    }

    $sql = "SELECT p.*, e1.nombre as home_name, e1.logo as home_logo, e2.nombre as away_name, e2.logo as away_logo FROM partidos p JOIN equipos e1 ON p.equipo_local_id = e1.id JOIN equipos e2 ON p.equipo_visitante_id = e2.id ORDER BY p.fecha DESC LIMIT 1";
    
    $result = $conn->query($sql);
    
    if (!$result || $result->num_rows === 0) {
        echo "{}";
        exit;
    }
    
    $row = $result->fetch_assoc();
    echo json_encode($row ?: (object)[]);
} catch (Throwable $e) {
    echo "{}";
}