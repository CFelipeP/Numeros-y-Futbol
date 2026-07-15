<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$modo = $_GET['modo'] ?? 'hoy';

try {
    switch ($modo) {
        case 'hoy':
            $filtro = "DATE(created_at) = CURDATE()";
            break;
        case 'ayer':
            $filtro = "DATE(created_at) = CURDATE() - INTERVAL 1 DAY";
            break;
        case 'semana':
            $filtro = "YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)";
            break;
        case 'mes':
            $filtro = "YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())";
            break;
        default:
            $filtro = "1=1";
            break;
    }

    $filtroBrowser = str_replace('created_at', 'last_visit', $filtro);
    $total  = (int)$pdo->query("SELECT COUNT(*) FROM visitas WHERE $filtro")->fetchColumn();
    $unicas = (int)$pdo->query("SELECT COUNT(DISTINCT ip_hash) FROM visitas WHERE $filtro")->fetchColumn();
    $bots   = (int)$pdo->query("SELECT COUNT(*) FROM visitas WHERE $filtro AND es_bot = 1")->fetchColumn();

    $topPaginas = $pdo->query("SELECT pagina, COUNT(*) AS total FROM visitas WHERE $filtro AND es_bot = 0 GROUP BY pagina ORDER BY total DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);

    $porHora = $pdo->query("SELECT HOUR(created_at) AS hora, COUNT(*) AS total FROM visitas WHERE DATE(created_at) = CURDATE() AND es_bot = 0 GROUP BY HOUR(created_at) ORDER BY hora")->fetchAll(PDO::FETCH_ASSOC);

    $porDia = $pdo->query("SELECT DATE(created_at) AS fecha, COUNT(*) AS total FROM visitas WHERE created_at >= CURDATE() - INTERVAL 7 DAY AND es_bot = 0 GROUP BY DATE(created_at) ORDER BY fecha")->fetchAll(PDO::FETCH_ASSOC);

    $recientes = $pdo->query("SELECT id, ip_hash, pagina, es_bot, created_at FROM visitas ORDER BY created_at DESC LIMIT 50")->fetchAll(PDO::FETCH_ASSOC);

    // Browser visit stats
    $browserTotal     = (int)$pdo->query("SELECT COUNT(*) FROM browser_visits")->fetchColumn();
    $browserPeriodo   = (int)$pdo->query("SELECT COUNT(*) FROM browser_visits WHERE $filtroBrowser")->fetchColumn();
    $browserUnicas    = (int)$pdo->query("SELECT COUNT(*) FROM browser_visits")->fetchColumn();
    $browserHoy       = (int)$pdo->query("SELECT COUNT(*) FROM browser_visits WHERE DATE(last_visit) = CURDATE()")->fetchColumn();
    $browserRecurrent = (int)$pdo->query("SELECT COUNT(*) FROM browser_visits WHERE visit_count > 1")->fetchColumn();

    $browserPorDia = $pdo->query("SELECT DATE(last_visit) AS fecha, COUNT(*) AS total FROM browser_visits WHERE last_visit >= CURDATE() - INTERVAL 7 DAY GROUP BY DATE(last_visit) ORDER BY fecha")->fetchAll(PDO::FETCH_ASSOC);

    $browserRecientes = $pdo->query("SELECT id, browser_token, user_agent, ip_hash, first_visit, last_visit, visit_count FROM browser_visits ORDER BY last_visit DESC LIMIT 50")->fetchAll(PDO::FETCH_ASSOC);

    echo json_enc([
        "success" => true,
        "stats" => [
            "total"  => $total,
            "unicas" => $unicas,
            "bots"   => $bots,
        ],
        "browser_stats" => [
            "total"         => $browserTotal,
            "hoy"           => $browserHoy,
            "periodo"       => $browserPeriodo,
            "recurrentes"   => $browserRecurrent,
        ],
        "top_paginas" => $topPaginas,
        "por_hora"    => $porHora,
        "por_dia"     => $porDia,
        "browser_por_dia" => $browserPorDia,
        "recientes"   => $recientes,
        "browser_recientes" => $browserRecientes,
    ]);
} catch (Exception $e) {
    echo json_enc(["success" => false, "error" => "Error interno del servidor"]);
}
