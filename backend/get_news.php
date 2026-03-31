<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require "db.php";

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