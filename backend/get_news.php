<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

// 🔥 SI VIENE ID → UNA NOTICIA
if (isset($_GET['id'])) {

    $id = intval($_GET['id']);

    $sql = $conn->prepare("SELECT * FROM noticias WHERE id = :id");
    $sql->bindParam(":id", $id, PDO::PARAM_INT);
    $sql->execute();

    $news = $sql->fetch(PDO::FETCH_ASSOC);

    echo json_encode($news);

} else {

    // 🔥 TODAS LAS NOTICIAS
    $sql = $conn->prepare("SELECT * FROM noticias ORDER BY fecha DESC");
    $sql->execute();

    $news = $sql->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($news);
}