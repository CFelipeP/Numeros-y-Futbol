<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

 $host = '127.0.0.1';
 $dbname = 'numeros-y-futbol';
 $user = 'root';
 $pass = 'Info2026/*-';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $id = intval($_POST['match_id'] ?? 0);
    if ($id <= 0) { echo json_encode(["error" => "ID inválido"]); exit; }

    /* LEER el parámetro: 1 = destacar, 0 = quitar */
    $featured = intval($_POST['featured'] ?? 0);

    if ($featured == 1) {
        /* DESTACAR: quitar a todos, poner solo a este */
        $pdo->exec("UPDATE partidos_segunda SET featured = 0");
        $pdo->exec("UPDATE partidos_segunda SET featured = 1 WHERE id = $id");
    } else {
        /* QUITAR: solo quitar a este partido */
        $pdo->exec("UPDATE partidos_segunda SET featured = 0 WHERE id = $id");
    }

    echo json_encode(["success" => true]);
} catch (Throwable $e) {
    echo json_encode(["error" => $e->getMessage()]);
}