<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require "db.php";

// 🔥 PDO CORRECTO
$sql = $conn->prepare("SELECT * FROM noticias ORDER BY fecha DESC");
$sql->execute();

$news = $sql->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($news);