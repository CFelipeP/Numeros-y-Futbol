<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$match_id = intval($_GET['id'] ?? $_POST['id'] ?? 0);
$status   = $_GET['status'] ?? $_POST['status'] ?? '';
$division = strtolower(trim($_GET['division'] ?? $_POST['division'] ?? 'primera'));

$validos = ['Pendiente', 'En Curso', 'Finalizado'];

if ($match_id <= 0) {
    echo json_encode(['error' => 'ID inválido']);
    exit;
}

if (!in_array($status, $validos)) {
    echo json_encode(['error' => 'Estado no válido']);
    exit;
}

switch ($division) {
    case 'segunda':
        $table  = 'partidos_segunda';
        $colEst = 'status';
        break;
    case 'tercera':
        $table  = 'partidos_tercera';
        $colEst = 'status';
        break;
    default:
        $table  = 'partidos';
        $colEst = 'estado';
        break;
}

$stmt = $pdo->prepare("UPDATE `$table` SET `$colEst` = ? WHERE id = ?");
$stmt->execute([$status, $match_id]);

if ($stmt->rowCount() > 0) {
    echo json_encode(['success' => true, 'status' => $status]);
} else {
    echo json_encode(['error' => 'No se encontró el partido con ID ' . $match_id]);
}
