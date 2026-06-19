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
        $stmt = $conn->prepare("SELECT * FROM jugadores_seleccion ORDER BY numero_camiseta ASC");
        $stmt->execute();
        echo json_encode(["success" => true, "jugadores" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($method === 'POST') {
        $data = getInput();
        $action = $data['action'] ?? '';

        if ($action === 'create') {
            $stmt = $conn->prepare("
                INSERT INTO jugadores_seleccion (nombre, posicion, numero_camiseta, foto, edad, nacionalidad, club_origen, partidos_jugados, goles, asistencias, atajadas)
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
            echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
            exit;
        }

        if ($action === 'update') {
            $stmt = $conn->prepare("
                UPDATE jugadores_seleccion SET
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
                $data['id']
            ]);
            echo json_encode(["success" => true]);
            exit;
        }

        if ($action === 'delete') {
            $stmt = $conn->prepare("DELETE FROM jugadores_seleccion WHERE id = ?");
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
