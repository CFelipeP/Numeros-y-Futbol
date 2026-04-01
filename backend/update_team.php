<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

// Recibir datos
 $id = intval($_POST['id'] ?? 0);
 $nombre = trim($_POST['nombre'] ?? '');
 $ciudad = trim($_POST['ciudad'] ?? '');
 $estadio = trim($_POST['estadio'] ?? '');

// Validar
if ($id === 0) {
    echo json_encode(["error" => "ID no válido"]);
    exit();
}

if (empty($nombre)) {
    echo json_encode(["error" => "El nombre es obligatorio"]);
    exit();
}

// Si viene un logo nuevo, subirlo primero
 $logoPath = null;

if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {

    $archivo = $_FILES['logo'];
    $nombreArchivo = $archivo['name'];
    $tmpName = $archivo['tmp_name'];
    $tamano = $archivo['size'];

    // Validar tipo
    $tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!in_array($archivo['type'], $tiposPermitidos)) {
        echo json_encode(["error" => "Formato de imagen no válido. Solo JPG, PNG, WEBP o SVG"]);
        exit();
    }

    // Validar tamaño (máximo 2MB)
    if ($tamano > 2 * 1024 * 1024) {
        echo json_encode(["error" => "La imagen no puede superar los 2MB"]);
        exit();
    }

    // Crear carpeta si no existe
    $directorio = __DIR__ . '/uploads/escudos/';
    if (!is_dir($directorio)) {
        mkdir($directorio, 0755, true);
    }

    // Generar nombre único para evitar sobreescribir
    $extension = pathinfo($nombreArchivo, PATHINFO_EXTENSION);
    $nuevoNombre = 'equipo_' . $id . '_' . time() . '.' . $extension;
    $rutaDestino = $directorio . $nuevoNombre;

    if (move_uploaded_file($tmpName, $rutaDestino)) {
        $logoPath = 'uploads/escudos/' . $nuevoNombre;
    } else {
        echo json_encode(["error" => "Error al guardar la imagen"]);
        exit();
    }
}

// Construir la consulta SQL
if ($logoPath) {
    // Con logo nuevo
    $sql = "UPDATE equipos SET nombre = ?, ciudad = ?, estadio = ?, logo = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }
    $stmt->bind_param("ssssi", $nombre, $ciudad, $estadio, $logoPath, $id);
} else {
    // Sin logo, solo datos
    $sql = "UPDATE equipos SET nombre = ?, ciudad = ?, estadio = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }
    $stmt->bind_param("sssi", $nombre, $ciudad, $estadio, $id);
}

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => true, "info" => "No se modificó ningún campo"]);
    }
} else {
    echo json_encode(["error" => "Error al ejecutar: " . $stmt->error]);
}

 $stmt->close();
 $conn->close();

?>