<?php
error_reporting(0);
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

try {
    $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
    if ($conn->connect_error) { echo "{}"; exit; }

    $sql = "SELECT p.goles_local, p.goles_visitante, p.status AS estado, 
            DATE_FORMAT(p.fecha, '%d/%m/%Y %H:%i') AS fecha,
            e1.nombre AS home_name, e1.logo AS home_logo,
            e2.nombre AS away_name, e2.logo AS away_logo 
            FROM partidos_segunda p 
            JOIN equipos_segunda e1 ON p.local_id = e1.id 
            JOIN equipos_segunda e2 ON p.visitante_id = e2.id 
            WHERE p.featured = 1 
            LIMIT 1";
    
    $result = $conn->query($sql);
    
    if (!$result || $result->num_rows === 0) {
        echo "{}";
        exit;
    }
    
    echo json_encode($result->fetch_assoc());
} catch (Throwable $e) {
    echo "{}";
}