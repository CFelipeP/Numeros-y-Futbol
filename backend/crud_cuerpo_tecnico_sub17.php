<?php
while (ob_get_level()) { ob_end_clean(); }
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

function getInput() {
    $data = json_decode(file_get_contents("php://input"), true);
    if (is_array($data)) {
        array_walk_recursive($data, function (&$value) {
            if ($value === '') $value = null;
        });
    }
    return $data;
}

try {
    if ($method === 'GET') {
        $stmt = $conn->prepare("SELECT * FROM cuerpo_tecnico_seleccion_sub17 ORDER BY id ASC");
        $stmt->execute();
        echo json_enc(["success" => true, "staff" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($method === 'POST') {
        $data = getInput();
        if (!$data) { echo json_enc(["success" => false, "error" => "JSON inválido"]); exit; }
        $action = $data['action'] ?? '';

        if ($action === 'create') {
            if (empty($data['nombre'] ?? '')) { echo json_enc(["success" => false, "error" => "El nombre es requerido"]); exit; }
            $stmt = $conn->prepare("
                INSERT INTO cuerpo_tecnico_seleccion_sub17 (nombre, rol, foto, nacionalidad)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['nombre'],
                $data['rol'] ?? null,
                $data['foto'] ?? null,
                $data['nacionalidad'] ?? null,
            ]);
            echo json_enc(["success" => true, "id" => $conn->lastInsertId()]);
            exit;
        }

        if ($action === 'update') {
            $id = isset($data['id']) ? (int)$data['id'] : 0;
            if (!$id) {
                echo json_enc(["success" => false, "error" => "ID requerido"]);
                exit;
            }
            if (empty($data['nombre'] ?? '')) { echo json_enc(["success" => false, "error" => "El nombre es requerido"]); exit; }
            $stmt = $conn->prepare("
                UPDATE cuerpo_tecnico_seleccion_sub17 SET
                    nombre = ?, rol = ?, foto = ?, nacionalidad = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['nombre'],
                $data['rol'] ?? null,
                $data['foto'] ?? null,
                $data['nacionalidad'] ?? null,
                $id
            ]);
            echo json_enc(["success" => true]);
            exit;
        }

        if ($action === 'delete') {
            $id = isset($data['id']) ? (int)$data['id'] : 0;
            if (!$id) {
                echo json_enc(["success" => false, "error" => "ID requerido"]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM cuerpo_tecnico_seleccion_sub17 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_enc(["success" => true]);
            exit;
        }

        echo json_enc(["success" => false, "error" => "Acción no válida"]);
        exit;
    }

} catch (Throwable $e) {
    $msg = $e->getMessage() ?: "Error inesperado del servidor";
    echo json_enc(["success" => false, "error" => $msg]);
}
