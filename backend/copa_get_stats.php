<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {

    $total      = $pdo->query("SELECT COUNT(*) FROM partidos_copa")->fetchColumn();
    $finalizados= $pdo->query("SELECT COUNT(*) FROM partidos_copa WHERE estado='Finalizado'")->fetchColumn();
    $pendientes = $pdo->query("SELECT COUNT(*) FROM partidos_copa WHERE estado='Pendiente'")->fetchColumn();
    $en_curso   = $pdo->query("SELECT COUNT(*) FROM partidos_copa WHERE estado='En Curso'")->fetchColumn();
    $goles      = $pdo->query("SELECT COALESCE(SUM(goles_local),0)+COALESCE(SUM(goles_visitante),0) FROM partidos_copa WHERE estado='Finalizado'")->fetchColumn();
    $equipos    = $pdo->query("SELECT COUNT(*) FROM equipos_copa WHERE activo=1")->fetchColumn();

    echo json_enc(["success" => true, "data" => [
        "total"       => (int)$total,
        "finalizados" => (int)$finalizados,
        "pendientes"  => (int)$pendientes,
        "en_curso"    => (int)$en_curso,
        "goles"       => (int)$goles,
        "equipos"     => (int)$equipos,
    ]]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_enc(["success" => false, "message" => "Error interno del servidor"]);
}