<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8mb4", "root", "Info2026/*-");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $body  = json_decode(file_get_contents("php://input"), true);
    $id    = (int)($body['id'] ?? 0);

    if (!$id) {
        echo json_encode(["success" => false, "message" => "ID requerido"]);
        exit;
    }

    $fields = [];
    $params = [];

    if (isset($body['team1_id']))        { $fields[] = "equipo_local_id = ?";     $params[] = (int)$body['team1_id']; }
    if (isset($body['team2_id']))        { $fields[] = "equipo_visitante_id = ?"; $params[] = (int)$body['team2_id']; }
    if (array_key_exists('fecha', $body))        { $fields[] = "fecha = ?";       $params[] = $body['fecha'] ?: null; }
    if (array_key_exists('hora', $body))         { $fields[] = "hora = ?";        $params[] = $body['hora']  ?: null; }
    if (isset($body['estado']))          { $fields[] = "estado = ?";              $params[] = $body['estado']; }
    if (isset($body['fase']))            { $fields[] = "fase = ?";                $params[] = $body['fase']; }
    if (array_key_exists('grupo', $body))        { $fields[] = "grupo_copa = ?";  $params[] = $body['grupo'] ?: null; }
    if (array_key_exists('goles_local', $body))      {
        $fields[] = "goles_local = ?";
        $params[] = ($body['goles_local'] !== '' && $body['goles_local'] !== null) ? (int)$body['goles_local'] : null;
    }
    if (array_key_exists('goles_visitante', $body))  {
        $fields[] = "goles_visitante = ?";
        $params[] = ($body['goles_visitante'] !== '' && $body['goles_visitante'] !== null) ? (int)$body['goles_visitante'] : null;
    }

    if (empty($fields)) {
        echo json_encode(["success" => false, "message" => "Nada que actualizar"]);
        exit;
    }

    $params[] = $id;
    $pdo->prepare("UPDATE partidos_copa SET " . implode(", ", $fields) . " WHERE id = ?")->execute($params);

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}