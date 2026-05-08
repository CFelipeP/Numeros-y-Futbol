<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php'; // tu conexión PDO existente

try {
    $grupos = ['A','B','C','D','E','F'];
    $data   = [];

    foreach ($grupos as $g) {
        // Equipos del grupo con stats calculados desde partidos_copa
        $sql = "
            SELECT
                ec.id,
                ec.nombre,
                ec.logo,
                ec.division,
                COUNT(DISTINCT CASE WHEN p.estado = 'Finalizado' THEN p.id END) AS pj,

                SUM(CASE
                    WHEN p.estado = 'Finalizado'
                     AND p.equipo_local_id     = ec.id AND p.goles_local > p.goles_visitante THEN 1
                    WHEN p.estado = 'Finalizado'
                     AND p.equipo_visitante_id = ec.id AND p.goles_visitante > p.goles_local  THEN 1
                    ELSE 0 END) AS g,

                SUM(CASE
                    WHEN p.estado = 'Finalizado'
                     AND (p.equipo_local_id = ec.id OR p.equipo_visitante_id = ec.id)
                     AND p.goles_local = p.goles_visitante THEN 1
                    ELSE 0 END) AS e,

                SUM(CASE
                    WHEN p.estado = 'Finalizado'
                     AND p.equipo_local_id     = ec.id AND p.goles_local < p.goles_visitante THEN 1
                    WHEN p.estado = 'Finalizado'
                     AND p.equipo_visitante_id = ec.id AND p.goles_visitante < p.goles_local  THEN 1
                    ELSE 0 END) AS p,

                SUM(CASE
                    WHEN p.estado = 'Finalizado' AND p.equipo_local_id     = ec.id THEN p.goles_local
                    WHEN p.estado = 'Finalizado' AND p.equipo_visitante_id = ec.id THEN p.goles_visitante
                    ELSE 0 END) AS gf,

                SUM(CASE
                    WHEN p.estado = 'Finalizado' AND p.equipo_local_id     = ec.id THEN p.goles_visitante
                    WHEN p.estado = 'Finalizado' AND p.equipo_visitante_id = ec.id THEN p.goles_local
                    ELSE 0 END) AS gc

            FROM equipos_copa ec
            LEFT JOIN partidos_copa p
                ON (p.equipo_local_id = ec.id OR p.equipo_visitante_id = ec.id)
                AND p.fase = 'grupos'
            WHERE ec.grupo = ? AND ec.activo = 1
            GROUP BY ec.id
            ORDER BY (g*3 + e) DESC,
                     (SUM(CASE WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id THEN p.goles_local
                               WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id THEN p.goles_visitante
                               ELSE 0 END)
                    - SUM(CASE WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id THEN p.goles_visitante
                               WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id THEN p.goles_local
                               ELSE 0 END)) DESC,
                     gf DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$g]);
        $equipos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calcular pts y dg
        foreach ($equipos as &$eq) {
            $eq['pts'] = ($eq['g'] * 3) + $eq['e'];
            $eq['dg']  = $eq['gf'] - $eq['gc'];
            // Normalizar nulls
            foreach (['pj','g','e','p','gf','gc'] as $k) {
                $eq[$k] = (int)($eq[$k] ?? 0);
            }
        }

        $data[] = ['nombre' => $g, 'equipos' => $equipos];
    }

    echo json_encode(['success' => true, 'data' => $data]);

} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $ex->getMessage()]);
}