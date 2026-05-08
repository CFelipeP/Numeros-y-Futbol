<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8mb4", "root", "Info2026/*-");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $total      = $pdo->query("SELECT COUNT(*) FROM partidos_copa")->fetchColumn();
    $finalizados= $pdo->query("SELECT COUNT(*) FROM partidos_copa WHERE estado='Finalizado'")->fetchColumn();
    $pendientes = $pdo->query("SELECT COUNT(*) FROM partidos_copa WHERE estado='Pendiente'")->fetchColumn();
    $en_curso   = $pdo->query("SELECT COUNT(*) FROM partidos_copa WHERE estado='En Curso'")->fetchColumn();
    $goles      = $pdo->query("SELECT COALESCE(SUM(goles_local),0)+COALESCE(SUM(goles_visitante),0) FROM partidos_copa WHERE estado='Finalizado'")->fetchColumn();
    $equipos    = $pdo->query("SELECT COUNT(*) FROM equipos_copa WHERE activo=1")->fetchColumn();

    echo json_encode(["success" => true, "data" => [
        "total"       => (int)$total,
        "finalizados" => (int)$finalizados,
        "pendientes"  => (int)$pendientes,
        "en_curso"    => (int)$en_curso,
        "goles"       => (int)$goles,
        "equipos"     => (int)$equipos,
    ]]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}