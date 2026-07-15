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
        $colX  = 'posicion_x';
        $colY  = 'posicion_y';
        break;
    case 'femenina':
        $tabla = 'jugadores_femenina';
        $colX  = 'posicion_x';
        $colY  = 'posicion_y';
        break;
    default:
        $tabla = 'jugadores';
        $colX  = 'pos_x';
        $colY  = 'pos_y';
        break;
}

try {
    $pdo->beginTransaction();

    // Obtener posición del jugador que sale
    $stmt = $pdo->prepare("SELECT $colX AS px, $colY AS py FROM $tabla WHERE id = ?");
    $stmt->execute([$sale_id]);
    $sale = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sale) {
        $pdo->rollBack();
        echo json_enc(["success" => false, "error" => "Jugador no encontrado"]);
        exit;
    }

    $px = $sale['px'];
    $py = $sale['py'];

    // Limpiar posición del que sale
    $pdo->prepare("UPDATE $tabla SET $colX = NULL, $colY = NULL, es_titular = 0 WHERE id = ?")
        ->execute([$sale_id]);

    // Asignar la posición al que entra
    if ($px !== null && $py !== null) {
        $pdo->prepare("UPDATE $tabla SET $colX = ?, $colY = ?, es_titular = 1 WHERE id = ?")
            ->execute([$px, $py, $entra_id]);
    }

    $pdo->commit();
    echo json_enc(["success" => true]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_enc(["success" => false, "error" => "Error interno"]);
}
