<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8mb4", "root", "Info2026/*-");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $body = json_decode(file_get_contents("php://input"), true);

    $team1   = (int)($body['team1_id'] ?? 0);
    $team2   = (int)($body['team2_id'] ?? 0);

    $check = $pdo->prepare("
    SELECT COUNT(*)
    FROM equipos_copa
    WHERE id IN (?, ?)
    ");

    $check->execute([$team1, $team2]);

    if ($check->fetchColumn() != 2) {

        throw new Exception(
            "Uno o ambos equipos no existen en equipos_copa"
        );
    }

    if (!$team1 || !$team2) {
    throw new Exception("Equipos inválidos");
        }

        $check = $pdo->prepare("
            SELECT COUNT(*) 
            FROM equipos_copa 
            WHERE id IN (?, ?)
        ");

        $check->execute([$team1, $team2]);

        if ($check->fetchColumn() != 2) {
            throw new Exception("Uno o ambos equipos no existen en equipos_copa");
        }

    $fecha = !empty($body['fecha']) ? $body['fecha'] : null;
    $hora  = !empty($body['hora'])  ? $body['hora']  : null;
    $estado  = $body['estado']  ?? 'Pendiente';
    $fase = $body['fase'] ?? 'grupos';
    $grupo   = ($fase === 'grupos') ? ($body['grupo'] ?? null) : null;
    $llave = isset($body['llave']) && $body['llave'] !== ''
    ? (int)$body['llave']
    : null;
    $gLocal  = isset($body['goles_local'])     && $body['goles_local']     !== '' ? (int)$body['goles_local']     : null;
    $gVisit  = isset($body['goles_visitante']) && $body['goles_visitante'] !== '' ? (int)$body['goles_visitante'] : null;

    if (!$team1 || !$team2) {
        echo json_encode(["success" => false, "message" => "Equipos requeridos"]);
        exit;
    }
    if ($team1 === $team2) {
        echo json_encode(["success" => false, "message" => "Un equipo no puede jugar contra sí mismo"]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO partidos_copa
(
 equipo_local_id,
 equipo_visitante_id,
 goles_local,
 goles_visitante,
 fecha,
 hora,
 estado,
 fase,
 llave,
 grupo_copa
) VALUES (?,?,?,?,?,?,?,?,?,?)
    ");
    $stmt->execute([
    $team1,
    $team2,
    $gLocal,
    $gVisit,
    $fecha,
    $hora,
    $estado,
    $fase,
    $llave,
    $grupo
]);

    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}