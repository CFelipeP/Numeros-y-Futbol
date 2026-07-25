<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;
$id = intval($_POST['id'] ?? 0); $nombre = trim($_POST['nombre'] ?? ''); $ciudad = trim($_POST['ciudad'] ?? ''); $estadio = trim($_POST['estadio'] ?? '');
if ($id === 0) { echo json_enc(["error" => "ID no válido"]); exit(); }
if (empty($nombre)) { echo json_enc(["error" => "El nombre es obligatorio"]); exit(); }

$logoPath = null;
if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
    $archivo = $_FILES['logo']; $tamano = $archivo['size'];
    $tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!in_array($archivo['type'], $tiposPermitidos)) { echo json_enc(["error" => "Formato no válido"]); exit(); }
    if ($tamano > 2 * 1024 * 1024) { echo json_enc(["error" => "Imagen > 2MB"]); exit(); }
    $directorio = __DIR__ . '/uploads/escudos/';
    if (!is_dir($directorio)) mkdir($directorio, 0755, true);
    $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
    $nuevoNombre = 'burgerking_' . $id . '_' . time() . '.' . $extension;
    if (move_uploaded_file($archivo['tmp_name'], $directorio . $nuevoNombre)) { $logoPath = 'uploads/escudos/' . $nuevoNombre; }
    else { echo json_enc(["error" => "Error al guardar la imagen"]); exit(); }
}
if ($logoPath) { $stmt = $conn->prepare("UPDATE equipos_burgerking SET nombre=?, ciudad=?, estadio=?, logo=? WHERE id=?"); $stmt->bind_param("ssssi", $nombre, $ciudad, $estadio, $logoPath, $id); }
else { $stmt = $conn->prepare("UPDATE equipos_burgerking SET nombre=?, ciudad=?, estadio=? WHERE id=?"); $stmt->bind_param("sssi", $nombre, $ciudad, $estadio, $id); }
if ($stmt->execute()) { echo json_enc(["success" => true]); } else { echo json_enc(["error" => "Error interno"]); }
$stmt->close(); $conn->close();
