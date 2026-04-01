<?php
// ========== delete_team.php ==========
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

 $id = intval($_POST['id'] ?? 0);

if ($id === 0) {
    echo json_encode(["error" => "ID no válido"]);
    exit();
}

// 1. Obtener el logo antes de eliminar (para borrar el archivo)
 $stmt = $conn->prepare("SELECT logo FROM equipos WHERE id = ?");
 $stmt->bind_param("i", $id);
 $stmt->execute();
 $result = $stmt->get_result();
 $equipo = $result->fetch_assoc();
 $stmt->close();

if (!$equipo) {
    echo json_encode(["error" => "Equipo no encontrado"]);
    exit();
}

// 2. Eliminar de tabla_posiciones (si tiene registros)
 $conn->query("DELETE FROM tabla_posiciones WHERE equipo_id = $id");

// 3. Eliminar el equipo
 $stmt = $conn->prepare("DELETE FROM equipos WHERE id = ?");

if (!$stmt) {
    echo json_encode(["error" => $conn->error]);
    exit();
}

 $stmt->bind_param("i", $id);

if ($stmt->execute()) {

    // 4. Borrar el archivo del logo del servidor
    if (!empty($equipo['logo'])) {
        $rutaArchivo = __DIR__ . '/' . $equipo['logo'];
        if (file_exists($rutaArchivo)) {
            unlink($rutaArchivo);
        }
    }

    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error al eliminar: " . $stmt->error]);
}

 $stmt->close();
 $conn->close();

?>