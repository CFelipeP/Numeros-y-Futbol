<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { echo json_enc(["error" => "Método no permitido"]); exit(); }
$id = intval($_POST['id'] ?? 0);
if ($id === 0) { echo json_enc(["error" => "ID no válido"]); exit(); }

$stmt = $conn->prepare("SELECT logo FROM equipos_burgerking WHERE id = ?");
$stmt->bind_param("i", $id); $stmt->execute(); $result = $stmt->get_result(); $equipo = $result->fetch_assoc(); $stmt->close();
if (!$equipo) { echo json_enc(["error" => "Equipo no encontrado"]); exit(); }

$conn->prepare("DELETE FROM tabla_posiciones_burgerking WHERE equipo_id = ?")->execute([$id]);
$stmt = $conn->prepare("DELETE FROM equipos_burgerking WHERE id = ?");
$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    if (!empty($equipo['logo'])) { $rutaArchivo = __DIR__ . '/' . $equipo['logo']; if (file_exists($rutaArchivo)) unlink($rutaArchivo); }
    echo json_enc(["success" => true]);
} else { echo json_enc(["error" => "Error interno"]); }
$stmt->close(); $conn->close();
