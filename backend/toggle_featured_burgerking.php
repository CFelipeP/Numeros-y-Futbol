<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();
$id = (int)($_POST['match_id'] ?? 0); $val = (int)($_POST['featured'] ?? -1);
if ($id === 0 || $val === -1) { echo json_enc(['error' => 'Faltan parametros']); exit; }
$conn->prepare("UPDATE partidos_burgerking SET featured = ? WHERE id = ?")->execute([$val, $id]);
echo json_enc(['success' => true]);
