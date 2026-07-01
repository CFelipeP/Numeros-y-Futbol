<?php
while (ob_get_level()) { ob_end_clean(); }
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

function getInput() {
    return json_decode(file_get_contents("php://input"), true);
}

try {
    if ($method === 'GET') {
        $stmt = $conn->prepare("SELECT * FROM cuerpo_tecnico_seleccion_femenina ORDER BY id ASC");
        $stmt->execute();
        echo json_encode(["success" => true, "staff" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($method === 'POST') {
        $data = getInput();
        $action = $data['action'] ?? '';

        if ($action === 'create') {
            $stmt = $conn->prepare("
                INSERT INTO cuerpo_tecnico_seleccion_femenina (nombre, rol, foto, nacionalidad)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['nombre'],
                $data['rol'] ?? null,
                $data['foto'] ?? null,
                $data['nacionalidad'] ?? null,
            ]);
            echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
            exit;
        }

        if ($action === 'update') {
            $stmt = $conn->prepare("
                UPDATE cuerpo_tecnico_seleccion_femenina SET
                    nombre = ?, rol = ?, foto = ?, nacionalidad = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['nombre'],
                $data['rol'] ?? null,
                $data['foto'] ?? null,
                $data['nacionalidad'] ?? null,
                $data['id']
            ]);
            echo json_encode(["success" => true]);
            exit;
        }

        if ($action === 'delete') {
            $stmt = $conn->prepare("DELETE FROM cuerpo_tecnico_seleccion_femenina WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(["success" => true]);
            exit;
        }

        echo json_encode(["success" => false, "error" => "Acción no válida"]);
        exit;
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
