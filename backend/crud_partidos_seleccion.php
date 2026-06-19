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
        $stmt = $conn->prepare("SELECT * FROM partidos_seleccion ORDER BY fecha DESC, id DESC");
        $stmt->execute();
        echo json_encode(["success" => true, "partidos" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($method === 'POST') {
        $data = getInput();
        $action = $data['action'] ?? '';

        if ($action === 'create') {
            $stmt = $conn->prepare("
                INSERT INTO partidos_seleccion (rival_nombre, rival_logo, goles_favor, goles_contra, fecha, hora, estado, competicion, lugar)
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
            echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
            exit;
        }

        if ($action === 'update') {
            $stmt = $conn->prepare("
                UPDATE partidos_seleccion SET
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
                $data['id']
            ]);
            echo json_encode(["success" => true]);
            exit;
        }

        if ($action === 'delete') {
            $stmt = $conn->prepare("DELETE FROM partidos_seleccion WHERE id = ?");
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
