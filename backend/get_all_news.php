<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$sql = "SELECT * FROM noticias ORDER BY fecha DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();

$news = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_enc($news);
?>