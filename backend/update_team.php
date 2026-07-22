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

$id = intval($_POST['id'] ?? 0);
$nombre = trim($_POST['nombre'] ?? '');
$ciudad = trim($_POST['ciudad'] ?? '');
$estadio = trim($_POST['estadio'] ?? '');

if ($id === 0) {
    echo json_enc(["error" => "ID no válido"]);
    exit();
}

if (empty($nombre)) {
    echo json_enc(["error" => "El nombre es obligatorio"]);
    exit();
}

$logoPath = null;

if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
    $archivo = $_FILES['logo'] ?? [];
    $nombreArchivo = $archivo['name'];
    $tmpName = $archivo['tmp_name'];
    $tamano = $archivo['size'];

    $tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!in_array($archivo['type'], $tiposPermitidos)) {
        echo json_enc(["error" => "Formato de imagen no válido. Solo JPG, PNG, WEBP o SVG"]);
        exit();
    }

    if ($tamano > 2 * 1024 * 1024) {
        echo json_enc(["error" => "La imagen no puede superar los 2MB"]);
        exit();
    }

    $directorio = __DIR__ . '/uploads/escudos/';
    if (!is_dir($directorio)) {
        mkdir($directorio, 0755, true);
    }

    $extension = pathinfo($nombreArchivo, PATHINFO_EXTENSION);
    $nuevoNombre = 'equipo_' . $id . '_' . time() . '.' . $extension;
    $rutaDestino = $directorio . $nuevoNombre;

    if (move_uploaded_file($tmpName, $rutaDestino)) {
        $logoPath = 'uploads/escudos/' . $nuevoNombre;
    } else {
        echo json_enc(["error" => "Error al guardar la imagen"]);
        exit();
    }
}

if ($logoPath) {
    $stmt = $conn->prepare("UPDATE equipos SET nombre = ?, ciudad = ?, estadio = ?, logo = ? WHERE id = ?");
    if (!$stmt) {
        echo json_enc(["error" => "Error interno del servidor"]);
        exit();
    }
    $stmt->bind_param("ssssi", $nombre, $ciudad, $estadio, $logoPath, $id);
} else {
    $stmt = $conn->prepare("UPDATE equipos SET nombre = ?, ciudad = ?, estadio = ? WHERE id = ?");
    if (!$stmt) {
        echo json_enc(["error" => "Error interno del servidor"]);
        exit();
    }
    $stmt->bind_param("sssi", $nombre, $ciudad, $estadio, $id);
}

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_enc(["success" => true]);
    } else {
        echo json_enc(["success" => true, "info" => "No se modificó ningún campo"]);
    }
} else {
    echo json_enc(["error" => "Error interno del servidor"]);
}

$stmt->close();
$conn->close();
