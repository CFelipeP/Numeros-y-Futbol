<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();
$conn = $mysqli;
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { echo json_enc(["error" => "Método no permitido"]); exit(); }
$id = intval($_POST['id'] ?? 0);
$conn->prepare("DELETE FROM partidos_burgerking WHERE id = ?")->execute([$id]);
echo json_enc(["success" => true]); $conn->close();
