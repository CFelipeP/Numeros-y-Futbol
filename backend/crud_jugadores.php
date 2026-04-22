<?php
while (ob_get_level()) {
    ob_end_clean();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

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

            $stmt = $conn->prepare("
                INSERT INTO jugadores 
                (equipo_id, nombre, posicion, numero_camiseta, edad, nacionalidad)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $data['equipo_id'],
                $data['nombre'],
                $data['posicion'],
                $data['numero_camiseta'],
                $data['edad'],
                $data['nacionalidad']
            ]);

            echo json_encode(["success"=>true]);
            exit;
        }

        if ($action === 'update') {

            $stmt = $conn->prepare("
                UPDATE jugadores SET
                    nombre = ?,
                    posicion = ?,
                    numero_camiseta = ?,
                    edad = ?,
                    nacionalidad = ?
                WHERE id = ?
            ");

            $stmt->execute([
                $data['nombre'],
                $data['posicion'],
                $data['numero_camiseta'],
                $data['edad'],
                $data['nacionalidad'],
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

            $conn->prepare("UPDATE jugadores SET pos_x = NULL, pos_y = NULL WHERE equipo_id = ?")
                 ->execute([$equipo_id]);

            foreach ($titulares as $t) {
                $stmt = $conn->prepare("
                    UPDATE jugadores 
                    SET pos_x = ?, pos_y = ?
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
        "error"=>$e->getMessage()
    ]);
}
