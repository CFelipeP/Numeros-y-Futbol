<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// 🔥 ACTIVAR ERRORES (QUITAR EL SILENCIO)
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

if (!isset($_POST['id'])) {
    echo json_encode(["error" => "ID no enviado"]);
    exit();
}

$id = intval($_POST['id']);

// 🔹 VALIDAR EXISTENCIA
$check = $conn->prepare("SELECT id FROM PARTIDOS WHERE id = ?");
if (!$check) {
    echo json_encode(["error" => "Prepare SELECT: " . $conn->error]);
    exit();
}

$check->bind_param("i", $id);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
    echo json_encode(["error" => "No existe"]);
    exit();
}

// 🔹 DELETE
$stmt = $conn->prepare("DELETE FROM PARTIDOS WHERE id = ?");
if (!$stmt) {
    echo json_encode(["error" => "Prepare DELETE: " . $conn->error]);
    exit();
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();