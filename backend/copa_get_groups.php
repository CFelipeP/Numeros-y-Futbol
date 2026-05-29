<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {
    // Detectar grupos existentes dinámicamente
    $gruposStmt = $pdo->query("
        SELECT DISTINCT grupo FROM equipos_copa 
        WHERE grupo IS NOT NULL AND activo = 1 
        ORDER BY grupo
    ");
    $grupos = $gruposStmt->fetchAll(PDO::FETCH_COLUMN);

    $data = [];

    foreach ($grupos as $g) {
        $sql = "
            SELECT
                ec.id, ec.nombre, ec.logo, ec.division,
                COUNT(DISTINCT CASE WHEN p.estado = 'Finalizado' THEN p.id END) AS pj,
                SUM(CASE
                    WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id AND p.goles_local>p.goles_visitante THEN 1
                    WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id AND p.goles_visitante>p.goles_local THEN 1
                    ELSE 0 END) AS g,
                SUM(CASE
                    WHEN p.estado='Finalizado'
                     AND (p.equipo_local_id=ec.id OR p.equipo_visitante_id=ec.id)
                     AND p.goles_local=p.goles_visitante THEN 1
                    ELSE 0 END) AS e,
                SUM(CASE
                    WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id AND p.goles_local<p.goles_visitante THEN 1
                    WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id AND p.goles_visitante<p.goles_local THEN 1
                    ELSE 0 END) AS p,
                SUM(CASE
                    WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id THEN p.goles_local
                    WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id THEN p.goles_visitante
                    ELSE 0 END) AS gf,
                SUM(CASE
                    WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id THEN p.goles_visitante
                    WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id THEN p.goles_local
                    ELSE 0 END) AS gc
            FROM equipos_copa ec
            LEFT JOIN partidos_copa p
                ON (p.equipo_local_id=ec.id OR p.equipo_visitante_id=ec.id)
                AND p.fase='grupos'
            WHERE ec.grupo=? AND ec.activo=1
            GROUP BY ec.id
            ORDER BY (SUM(CASE
                WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id AND p.goles_local>p.goles_visitante THEN 3
                WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id AND p.goles_visitante>p.goles_local THEN 3
                WHEN p.estado='Finalizado' AND (p.equipo_local_id=ec.id OR p.equipo_visitante_id=ec.id) AND p.goles_local=p.goles_visitante THEN 1
                ELSE 0 END)) DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$g]);
        $equipos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($equipos as &$eq) {
            $eq['pts'] = ($eq['g'] * 3) + $eq['e'];
            $eq['dg']  = $eq['gf'] - $eq['gc'];
            foreach (['pj','g','e','p','gf','gc'] as $k) $eq[$k] = (int)($eq[$k] ?? 0);
        }

        $data[] = ['nombre' => $g, 'equipos' => $equipos];
    }

    echo json_encode(['success' => true, 'data' => $data]);

} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Error interno del servidor"]);
}