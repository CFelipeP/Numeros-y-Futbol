<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$id = (int)($_POST['id'] ?? 0);
if (!$id) {
    echo json_enc(["success" => false, "error" => "ID requerido"]);
    exit;
}

$conn->beginTransaction();
try {
    $stmt = $conn->prepare("SELECT logo FROM equipos_primera_femenina WHERE id = ?");
    $stmt->execute([$id]);
    $old = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($old && $old['logo'] && file_exists($old['logo'])) {
        unlink($old['logo']);
    }

    $conn->prepare("DELETE FROM estadisticas_jugadores_femenina WHERE jugador_id IN (SELECT id FROM jugadores_femenina WHERE equipo_id = ?)")->execute([$id]);
    $conn->prepare("DELETE FROM jugadores_femenina WHERE equipo_id = ?")->execute([$id]);
    $conn->prepare("DELETE FROM tabla_posiciones_femenina WHERE equipo_id = ?")->execute([$id]);
    $conn->prepare("DELETE FROM equipos_primera_femenina WHERE id = ?")->execute([$id]);

    $conn->commit();
    echo json_enc(["success" => true]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_enc(["success" => false, "error" => "Error interno"]);
}
