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

        $equipo_id = $_GET['equipo_id'] ?? null;

        if (!$equipo_id) {
            echo json_encode([
                "success"=>false,
                "error"=>"Falta equipo_id"
            ]);
            exit;
        }

        $stmt = $conn->prepare("
            SELECT *
            FROM jugadores
            WHERE equipo_id = ?
            ORDER BY numero_camiseta ASC
        ");

        $stmt->execute([$equipo_id]);

        echo json_encode([
            "success"=>true,
            "jugadores"=>$stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);
        exit;
    }

    if ($method === 'POST') {

        $data = getInput();
        $action = $data['action'] ?? '';

        if ($action === 'create') {

            $es_titular = intval($data['es_titular'] ?? 0);

            $stmt = $conn->prepare("
                INSERT INTO jugadores 
                (equipo_id, nombre, posicion, numero_camiseta, edad, nacionalidad, es_titular)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $data['equipo_id'],
                $data['nombre'],
                $data['posicion'],
                $data['numero_camiseta'],
                $data['edad'],
                $data['nacionalidad'],
                $es_titular
            ]);

            echo json_encode(["success"=>true]);
            exit;
        }

        if ($action === 'update') {

            $es_titular = intval($data['es_titular'] ?? 0);

            $stmt = $conn->prepare("
                UPDATE jugadores SET
                    nombre = ?,
                    posicion = ?,
                    numero_camiseta = ?,
                    edad = ?,
                    nacionalidad = ?,
                    es_titular = ?
                WHERE id = ?
            ");

            $stmt->execute([
                $data['nombre'],
                $data['posicion'],
                $data['numero_camiseta'],
                $data['edad'],
                $data['nacionalidad'],
                $es_titular,
                $data['id']
            ]);

            echo json_encode(["success"=>true]);
            exit;
        }

        if ($action === 'delete') {

            $stmt = $conn->prepare("DELETE FROM jugadores WHERE id = ?");
            $stmt->execute([$data['id']]);

            echo json_encode(["success"=>true]);
            exit;
        }

        if ($action === 'save_formation') {

            $equipo_id = $data['equipo_id'] ?? 0;
            $formacion = $data['formacion'] ?? '';
            $titulares = json_decode($data['titulares'] ?? '[]', true);

            if (!$equipo_id || !$formacion) {
                echo json_encode([
                    "success"=>false,
                    "error"=>"Datos incompletos"
                ]);
                exit;
            }

            $stmt = $conn->prepare("UPDATE equipos SET formacion = ? WHERE id = ?");
            $stmt->execute([$formacion, $equipo_id]);

            $conn->prepare("UPDATE jugadores SET es_titular = 0, pos_x = NULL, pos_y = NULL WHERE equipo_id = ?")
                 ->execute([$equipo_id]);

            foreach ($titulares as $t) {
                $stmt = $conn->prepare("
                    UPDATE jugadores 
                    SET es_titular = 1, pos_x = ?, pos_y = ?
                    WHERE id = ? AND equipo_id = ?
                ");
                $stmt->execute([
                    $t['x'],
                    $t['y'],
                    $t['id'],
                    $equipo_id
                ]);
            }

            echo json_encode(["success"=>true]);
            exit;
        }

        echo json_encode([
            "success"=>false,
            "error"=>"Acción no válida"
        ]);
        exit;
    }

    echo json_encode([
        "success"=>false,
        "error"=>"Método no permitido"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success"=>false,
        "error"=>"Error interno del servidor"
    ]);
}
