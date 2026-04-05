<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

 $conn = new mysqli('localhost', 'root', 'Info2026/*-', 'numeros-y-futbol');
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión']);
    exit;
}

 $id = $_POST['id'] ?? null;
if (!$id) {
    echo json_encode(['error' => 'ID requerido']);
    exit;
}

 $stmt = $conn->prepare("
    UPDATE matches 
    SET goles_local = NULL, goles_visitante = NULL, status = 'Pendiente' 
    WHERE id = ?
");
 $stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Error al resetear']);
}

 $stmt->close();
 $conn->close();