<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_enc(["error" => "Método no permitido"]);
    exit();
}

if (!isset($_POST['id'])) {
    echo json_enc(["error" => "ID no enviado"]);
    exit();
}

$id = intval($_POST['id']);

$check = $conn->prepare("SELECT id FROM partidos WHERE id = ?");
if (!$check) {
    echo json_enc(["error" => "Error interno del servidor"]);
    exit();
}

$check->bind_param("i", $id);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
    echo json_enc(["error" => "No existe"]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM partidos WHERE id = ?");
if (!$stmt) {
    echo json_enc(["error" => "Error interno del servidor"]);
    exit();
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_enc(["success" => true]);
} else {
    echo json_enc(["error" => "Error interno del servidor"]);
}

$stmt->close();
$conn->close();
