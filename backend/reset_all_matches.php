<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

 $conn = new mysqli('localhost', 'root', 'Info2026/*-', 'numeros-y-futbol');
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión']);
    exit;
}

// Solo resetea los finalizados
 $conn->query("
    UPDATE matches 
    SET goles_local = NULL, goles_visitante = NULL, status = 'Pendiente' 
    WHERE status = 'Finalizado'
");

 $afectados = $conn->affected_rows;

echo json_encode([
    'success' => true,
    'reset_count' => $afectados
]);

 $conn->close();