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
        $stmt = $conn->prepare("SELECT * FROM jugadores_seleccion_sub20 ORDER BY numero_camiseta ASC");
        $stmt->execute();
        echo json_enc(["success" => true, "jugadores" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($method === 'POST') {
        $data = getInput();
        if (!$data) { echo json_enc(["success" => false, "error" => "JSON inválido"]); exit; }
        $action = $data['action'] ?? '';

        if ($action === 'create') {
            if (empty($data['nombre'] ?? '')) { echo json_enc(["success" => false, "error" => "El nombre es requerido"]); exit; }
            $stmt = $conn->prepare("
                INSERT INTO jugadores_seleccion_sub20 (nombre, posicion, numero_camiseta, foto, edad, nacionalidad, club_origen, partidos_jugados, goles, asistencias, atajadas)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['nombre'],
                $data['posicion'] ?? null,
                $data['numero_camiseta'] ?? null,
                $data['foto'] ?? null,
                $data['edad'] ?? null,
                $data['nacionalidad'] ?? 'Salvadoreña',
                $data['club_origen'] ?? null,
                $data['partidos_jugados'] ?? 0,
                $data['goles'] ?? 0,
                $data['asistencias'] ?? 0,
                $data['atajadas'] ?? 0
            ]);
            echo json_enc(["success" => true, "id" => $conn->lastInsertId()]);
            exit;
        }

        if ($action === 'update') {
            $id = isset($data['id']) ? (int)$data['id'] : 0;
            if (!$id) { echo json_enc(["success" => false, "error" => "ID requerido"]); exit; }
            if (empty($data['nombre'] ?? '')) { echo json_enc(["success" => false, "error" => "El nombre es requerido"]); exit; }
            $stmt = $conn->prepare("
                UPDATE jugadores_seleccion_sub20 SET
                    nombre = ?, posicion = ?, numero_camiseta = ?, foto = ?,
                    edad = ?, nacionalidad = ?, club_origen = ?,
                    partidos_jugados = ?, goles = ?, asistencias = ?, atajadas = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['nombre'],
                $data['posicion'] ?? null,
                $data['numero_camiseta'] ?? null,
                $data['foto'] ?? null,
                $data['edad'] ?? null,
                $data['nacionalidad'] ?? 'Salvadoreña',
                $data['club_origen'] ?? null,
                $data['partidos_jugados'] ?? 0,
                $data['goles'] ?? 0,
                $data['asistencias'] ?? 0,
                $data['atajadas'] ?? 0,
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
            $stmt = $conn->prepare("DELETE FROM jugadores_seleccion_sub20 WHERE id = ?");
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
