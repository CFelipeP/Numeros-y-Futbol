<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión']);
    exit;
}

 $conn->begin_transaction();

try {
    // Reiniciar tabla de posiciones a cero
    $conn->query("
        UPDATE tabla_posiciones SET 
            partidos_jugados = 0, 
            ganados = 0, 
            empatados = 0, 
            perdidos = 0, 
            goles_favor = 0, 
            goles_contra = 0, 
            puntos = 0
    ");

    // Eliminar todos los partidos
    $conn->query("DELETE FROM partidos");

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Temporada reiniciada correctamente']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

 $conn->close();