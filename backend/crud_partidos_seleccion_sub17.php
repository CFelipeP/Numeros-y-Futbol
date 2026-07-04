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
        $stmt = $conn->prepare("SELECT * FROM partidos_seleccion_sub17 ORDER BY fecha DESC, id DESC");
        $stmt->execute();
        echo json_enc(["success" => true, "partidos" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($method === 'POST') {
        $data = getInput();
        if (!$data) { echo json_enc(["success" => false, "error" => "JSON inválido"]); exit; }
        $action = $data['action'] ?? '';

        if ($action === 'create') {
            if (empty($data['rival_nombre'] ?? '')) { echo json_enc(["success" => false, "error" => "El nombre del rival es requerido"]); exit; }
            $stmt = $conn->prepare("
                INSERT INTO partidos_seleccion_sub17 (rival_nombre, rival_logo, goles_favor, goles_contra, fecha, hora, estado, competicion, lugar)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['rival_nombre'],
                $data['rival_logo'] ?? null,
                $data['goles_favor'] ?? null,
                $data['goles_contra'] ?? null,
                $data['fecha'] ?? null,
                $data['hora'] ?? null,
                $data['estado'] ?? 'Pendiente',
                $data['competicion'] ?? null,
                $data['lugar'] ?? 'Neutral'
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
            if (empty($data['rival_nombre'] ?? '')) { echo json_enc(["success" => false, "error" => "El nombre del rival es requerido"]); exit; }
            $stmt = $conn->prepare("
                UPDATE partidos_seleccion_sub17 SET
                    rival_nombre = ?, rival_logo = ?, goles_favor = ?, goles_contra = ?,
                    fecha = ?, hora = ?, estado = ?, competicion = ?, lugar = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['rival_nombre'],
                $data['rival_logo'] ?? null,
                $data['goles_favor'] ?? null,
                $data['goles_contra'] ?? null,
                $data['fecha'] ?? null,
                $data['hora'] ?? null,
                $data['estado'] ?? 'Pendiente',
                $data['competicion'] ?? null,
                $data['lugar'] ?? 'Neutral',
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
            $stmt = $conn->prepare("DELETE FROM partidos_seleccion_sub17 WHERE id = ?");
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
