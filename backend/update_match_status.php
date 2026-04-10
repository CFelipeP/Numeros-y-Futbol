<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

 $host = 'localhost';
 $db   = 'numeros_futbol';  // ← tu nombre de BD
 $user = 'root';
 $pass = 'Info2026/*-';

 $conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Conexión fallida']);
    exit;
}

 $match_id = intval($_POST['match_id'] ?? 0);
 $status   = $_POST['status'] ?? '';

 $validos = ['Programado', 'En Vivo', 'Finalizado'];

if ($match_id <= 0) {
    echo json_encode(['error' => 'ID inválido']);
    exit;
}

if (!in_array($status, $validos)) {
    echo json_encode(['error' => 'Estado no válido. Use: Programado, En Vivo o Finalizado']);
    exit;
}

 $stmt = $conn->prepare("UPDATE matches SET status = ? WHERE id = ?");
 $stmt->bind_param("si", $status, $match_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'status' => $status]);
    } else {
        echo json_encode(['error' => 'No se encontró el partido con ID ' . $match_id]);
    }
} else {
    echo json_encode(['error' => 'Error al actualizar: ' . $stmt->error]);
}

 $stmt->close();
 $conn->close();