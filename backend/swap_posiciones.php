<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$data = json_decode(file_get_contents("php://input"), true);
$entra_id = intval($data['entra_id'] ?? 0);
$sale_id  = intval($data['sale_id'] ?? 0);
$division = $data['division'] ?? 'primera';

if (!$entra_id || !$sale_id) {
    echo json_enc(["success" => false, "error" => "Se requieren entra_id y sale_id"]);
    exit;
}

switch ($division) {
    case 'ascenso':
        $tabla = 'jugadores_ascenso';
        break;
    case 'femenina':
        $tabla = 'jugadores_femenina';
        break;
    default:
        $tabla = 'jugadores';
        break;
}

try {
    $pdo->beginTransaction();

    // Obtener equipo_id y posición del jugador que sale
    $stmt = $pdo->prepare("SELECT equipo_id, COALESCE(pos_x, posicion_x) AS px, COALESCE(pos_y, posicion_y) AS py FROM $tabla WHERE id = ?");
    $stmt->execute([$sale_id]);
    $sale = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sale) {
        $pdo->rollBack();
        echo json_enc(["success" => false, "error" => "Jugador que sale no encontrado"]);
        exit;
    }

    // Verificar que el jugador que entra pertenece al mismo equipo
    $stmt = $pdo->prepare("SELECT equipo_id FROM $tabla WHERE id = ?");
    $stmt->execute([$entra_id]);
    $entra = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$entra) {
        $pdo->rollBack();
        echo json_enc(["success" => false, "error" => "Jugador que entra no encontrado"]);
        exit;
    }

    if ((int)$sale['equipo_id'] !== (int)$entra['equipo_id']) {
        $pdo->rollBack();
        echo json_enc(["success" => false, "error" => "Los jugadores no pertenecen al mismo equipo"]);
        exit;
    }

    $px = $sale['px'];
    $py = $sale['py'];

    if ($px === null || $py === null) {
        $pdo->rollBack();
        echo json_enc(["success" => false, "error" => "El jugador que sale no tiene posición asignada en el campo"]);
        exit;
    }

    // Limpiar posición del que sale
    $pdo->prepare("UPDATE $tabla SET pos_x = NULL, pos_y = NULL, posicion_x = NULL, posicion_y = NULL, es_titular = 0 WHERE id = ?")
        ->execute([$sale_id]);

    // Asignar la posición al que entra
    $pdo->prepare("UPDATE $tabla SET pos_x = ?, pos_y = ?, es_titular = 1 WHERE id = ?")
        ->execute([$px, $py, $entra_id]);

    $pdo->commit();
    echo json_enc(["success" => true]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_enc(["success" => false, "error" => "Error interno"]);
}
