<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

// Próximo partido sin resultado
 $next = $conn->query("
    SELECT p.*,
           t1.nombre as home_name, t1.logo as home_logo,
           t2.nombre as away_name, t2.logo as away_logo,
           p.fecha as fecha
    FROM partidos_tercera p
    LEFT JOIN equipos_tercera t1 ON p.local_id = t1.id
    LEFT JOIN equipos_tercera t2 ON p.visitante_id = t2.id
    WHERE p.goles_local IS NULL
    ORDER BY p.fecha ASC, p.id ASC
    LIMIT 1
")->fetch_assoc();

// Últimos resultados
 $recent = [];
 $res = $conn->query("
    SELECT p.*,
           t1.nombre as home_name, t1.logo as home_logo,
           t2.nombre as away_name, t2.logo as away_logo,
           p.fecha as fecha
    FROM partidos_tercera p
    LEFT JOIN equipos_tercera t1 ON p.local_id = t1.id
    LEFT JOIN equipos_tercera t2 ON p.visitante_id = t2.id
    WHERE p.goles_local IS NOT NULL
    ORDER BY p.fecha DESC, p.id DESC
    LIMIT 5
");
while ($row = $res->fetch_assoc()) {
    $recent[] = $row;
}

echo json_encode(["next" => $next, "recent" => $recent]);
 $conn->close();