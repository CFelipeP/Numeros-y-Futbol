<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$year = (int)date('Y');
$month = (int)date('n');
$startYear = ($month >= 7) ? $year : $year - 1;
$temporada = $startYear . '-' . ($startYear + 1);

const POSICIONES_VALIDAS = [
    'portero','lateral_izquierdo','lateral_derecho','central',
    'medio_defensivo','medio_central','medio_ofensivo',
    'extremo_izquierdo','extremo_derecho',
    'centrodelantero','segundo_delantero'
];
const POSICION_MAPEO = [
    'portero'=>'portero','defensa'=>'central','medio'=>'medio_central',
    'mediocampista'=>'medio_central','centrocampista'=>'medio_central',
    'lateral'=>'lateral_derecho','extremo'=>'extremo_derecho','delantero'=>'centrodelantero',
];

function normPos($p) {
    if (!$p) return 'centrodelantero';
    $p = strtolower(trim($p));
    if (in_array($p, POSICIONES_VALIDAS)) return $p;
    return POSICION_MAPEO[$p] ?? 'centrodelantero';
}

function countTitulares(PDO $db, int $equipo_id, ?int $excludeId=null): int {
    $sql = "SELECT COUNT(*) FROM jugadores_femenina WHERE equipo_id=? AND es_titular=1";
    $params = [$equipo_id];
    if ($excludeId) { $sql .= " AND id!=?"; $params[] = $excludeId; }
    $st = $db->prepare($sql);
    $st->execute($params);
    return (int)$st->fetchColumn();
}

// ─── GET ────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $equipo_id = intval($_GET['equipo_id'] ?? 0);
    if (!$equipo_id) { echo json_enc(['success'=>false,'error'=>'Falta equipo_id']); exit(); }

    $eq = $conn->prepare("SELECT * FROM equipos_primera_femenina WHERE id=?");
    $eq->execute([$equipo_id]);
    $equipo = $eq->fetch(PDO::FETCH_ASSOC);
    if (!$equipo) { echo json_enc(['success'=>false,'error'=>'Equipo no encontrado']); exit(); }

    $st = $conn->prepare("
        SELECT j.*,
               COALESCE(e.partidos_jugados,0) AS pj,
               COALESCE(e.goles,0)            AS goles,
               COALESCE(e.asistencias,0)      AS asistencias,
               COALESCE(e.goles_penal,0)      AS goles_penal,
               COALESCE(e.goles_cabeza,0)     AS goles_cabeza,
               COALESCE(e.goles_tiro_libre,0) AS goles_tiro_libre,
               COALESCE(e.tarjetas_amarillas,0) AS tarjetas_amarillas,
               COALESCE(e.tarjetas_rojas,0)   AS tarjetas_rojas,
               COALESCE(e.minutos_jugados,0)  AS minutos_jugados,
               COALESCE(e.goles_recibidos,0)  AS goles_recibidos,
               COALESCE(e.vaya_invicta,0)     AS vaya_invicta,
               e.temporada
        FROM jugadores_femenina j
        LEFT JOIN estadisticas_jugadores_femenina e ON e.jugador_id=j.id AND e.temporada=:temporada
        WHERE j.equipo_id=:equipo_id
        ORDER BY j.es_titular DESC, j.numero_camiseta ASC
    ");
    $st->execute([':equipo_id' => $equipo_id, ':temporada' => $temporada]);
    $jugadores = $st->fetchAll(PDO::FETCH_ASSOC);

    echo json_enc(['success'=>true,'equipo'=>$equipo,'jugadores'=>$jugadores]);
    exit();
}

// ─── DELETE ─────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) { echo json_enc(['success'=>false,'error'=>'Falta id']); exit(); }
    $conn->prepare("DELETE FROM jugadores_femenina WHERE id=?")->execute([$id]);
    echo json_enc(['success'=>true]);
    exit();
}

// ─── POST ────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw    = file_get_contents('php://input');
    $data   = json_decode($raw, true) ?: $_POST;
    $action = $data['action'] ?? '';

    // ── CREATE ───────────────────────────────────────────────────────────────
    if ($action === 'create') {
        $equipo_id  = intval($data['equipo_id'] ?? 0);
        $nombre     = trim($data['nombre'] ?? '');
        $posicion   = normPos($data['posicion'] ?? '');
        $num        = ($data['numero_camiseta']!==''&&$data['numero_camiseta']!==null) ? intval($data['numero_camiseta']) : null;
        $edad       = ($data['edad']!==''&&$data['edad']!==null) ? intval($data['edad']) : null;
        $nac        = trim($data['nacionalidad'] ?? '') ?: null;
        $foto       = trim($data['foto'] ?? '') ?: null;
        $es_titular = intval($data['es_titular'] ?? 0);

        if (!$equipo_id||!$nombre) { echo json_enc(['success'=>false,'error'=>'Datos incompletos']); exit(); }

        // Verificar dorsal duplicado
        if ($num !== null) {
            $chk = $conn->prepare("SELECT COUNT(*) FROM jugadores_femenina WHERE equipo_id=? AND numero_camiseta=?");
            $chk->execute([$equipo_id, $num]);
            if ($chk->fetchColumn() > 0) {
                echo json_enc(['success'=>false,'error'=>"El dorsal #{$num} ya existe en este equipo"]);
                exit();
            }
        }

        // Verificar límite 11 titulares
        if ($es_titular) {
            $cnt = $conn->prepare("SELECT COUNT(*) FROM jugadores_femenina WHERE equipo_id=? AND es_titular=1");
            $cnt->execute([$equipo_id]);
            if ($cnt->fetchColumn() >= 11) {
                echo json_enc(['success'=>false,'error'=>'Ya hay 11 titulares. Baja uno primero.']);
                exit();
            }
        }

        $conn->prepare("INSERT INTO jugadores_femenina (equipo_id,nombre,posicion,numero_camiseta,edad,nacionalidad,foto,es_titular) VALUES (?,?,?,?,?,?,?,?)")
            ->execute([$equipo_id,$nombre,$posicion,$num,$edad,$nac,$foto,$es_titular]);
        $jugador_id = $conn->lastInsertId();

        $conn->prepare("INSERT IGNORE INTO estadisticas_jugadores_femenina (jugador_id,temporada) VALUES (?,?)")
            ->execute([$jugador_id, $temporada]);

        echo json_enc(['success'=>true,'id'=>$jugador_id]);
        exit();
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────
    if ($action === 'update') {
        $id         = intval($data['id'] ?? 0);
        $equipo_id  = intval($data['equipo_id'] ?? 0);
        $nombre     = trim($data['nombre'] ?? '');
        $posicion   = normPos($data['posicion'] ?? '');
        $num        = ($data['numero_camiseta']!==''&&$data['numero_camiseta']!==null) ? intval($data['numero_camiseta']) : null;
        $edad       = ($data['edad']!==''&&$data['edad']!==null) ? intval($data['edad']) : null;
        $nac        = trim($data['nacionalidad'] ?? '') ?: null;
        $foto       = trim($data['foto'] ?? '') ?: null;
        $es_titular = intval($data['es_titular'] ?? 0);

        if (!$id||!$nombre) { echo json_enc(['success'=>false,'error'=>'Datos incompletos']); exit(); }

        // Verificar dorsal duplicado (excluyendo al jugador actual)
        if ($num !== null) {
            $chk = $conn->prepare("SELECT COUNT(*) FROM jugadores_femenina WHERE equipo_id=? AND numero_camiseta=? AND id!=?");
            $chk->execute([$equipo_id, $num, $id]);
            if ($chk->fetchColumn() > 0) {
                echo json_enc(['success'=>false,'error'=>"El dorsal #{$num} ya existe en este equipo"]);
                exit();
            }
        }

        // Verificar límite 11 (excluyendo al jugador actual)
        if ($es_titular) {
            $cnt = $conn->prepare("SELECT COUNT(*) FROM jugadores_femenina WHERE equipo_id=? AND es_titular=1 AND id!=?");
            $cnt->execute([$equipo_id, $id]);
            if ($cnt->fetchColumn() >= 11) {
                echo json_enc(['success'=>false,'error'=>'Ya hay 11 titulares. Baja uno primero.']);
                exit();
            }
        }

        $conn->prepare("UPDATE jugadores_femenina SET nombre=?,posicion=?,numero_camiseta=?,edad=?,nacionalidad=?,foto=?,es_titular=? WHERE id=?")
            ->execute([$nombre,$posicion,$num,$edad,$nac,$foto,$es_titular,$id]);

        echo json_enc(['success'=>true]);
        exit();
    }

    // ── TOGGLE_BULK (swap suplente↔titular) ──────────────────────────────────
    if ($action === 'toggle_bulk') {
        $equipo_id = intval($data['equipo_id'] ?? 0);
        $changes   = $data['changes'] ?? [];

        if (!$equipo_id || empty($changes)) {
            echo json_enc(['success'=>false,'error'=>'Datos incompletos']);
            exit();
        }

        $cur = $conn->prepare("SELECT id, es_titular FROM jugadores_femenina WHERE equipo_id=?");
        $cur->execute([$equipo_id]);
        $estado = [];
        foreach ($cur->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $estado[(int)$row['id']] = (bool)$row['es_titular'];
        }
        foreach ($changes as $ch) {
            $estado[(int)$ch['id']] = (bool)$ch['es_titular'];
        }

        $totalTit = count(array_filter($estado));
        if ($totalTit > 11) {
            echo json_enc(['success'=>false,'error'=>'No se puede superar 11 titulares.']);
            exit();
        }

        $conn->beginTransaction();
        $stmt = $conn->prepare("UPDATE jugadores_femenina SET es_titular=? WHERE id=? AND equipo_id=?");
        foreach ($changes as $ch) {
            $stmt->execute([(int)(bool)$ch['es_titular'], (int)$ch['id'], $equipo_id]);
        }
        $conn->commit();
        echo json_enc(['success'=>true]);
        exit();
    }

    // ── UPDATE_STATS ─────────────────────────────────────────────────────────
    if ($action === 'update_stats') {
        $jugador_id = intval($data['jugador_id'] ?? 0);
        if (!$jugador_id) { echo json_enc(['success'=>false,'error'=>'Falta jugador_id']); exit(); }

        $conn->prepare("
            INSERT INTO estadisticas_jugadores_femenina
                (jugador_id,temporada,partidos_jugados,goles,asistencias,goles_cabeza,
                 goles_tiro_libre,goles_penal,tarjetas_amarillas,tarjetas_rojas,
                 minutos_jugados,goles_recibidos,vaya_invicta)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE
                partidos_jugados=VALUES(partidos_jugados),goles=VALUES(goles),
                asistencias=VALUES(asistencias),goles_cabeza=VALUES(goles_cabeza),
                goles_tiro_libre=VALUES(goles_tiro_libre),goles_penal=VALUES(goles_penal),
                tarjetas_amarillas=VALUES(tarjetas_amarillas),tarjetas_rojas=VALUES(tarjetas_rojas),
                minutos_jugados=VALUES(minutos_jugados),goles_recibidos=VALUES(goles_recibidos),
                vaya_invicta=VALUES(vaya_invicta)
        ")->execute([
            $jugador_id, $data['temporada']??$temporada,
            intval($data['pj']??0), intval($data['goles']??0), intval($data['asistencias']??0),
            intval($data['goles_cabeza']??0), intval($data['goles_tiro_libre']??0),
            intval($data['goles_penal']??0), intval($data['tarjetas_amarillas']??0),
            intval($data['tarjetas_rojas']??0), intval($data['minutos_jugados']??0),
            intval($data['goles_recibidos']??0), intval($data['vaya_invicta']??0),
        ]);

        echo json_enc(['success'=>true]);
        exit();
    }

    // ── DELETE ──────────────────────────────────────────────────────────────────
    if ($action === 'delete') {
        $id = intval($data['id'] ?? 0);
        if (!$id) { echo json_enc(['success'=>false,'error'=>'Falta id']); exit(); }
        $conn->prepare("DELETE FROM jugadores_femenina WHERE id=?")->execute([$id]);
        echo json_enc(['success'=>true]);
        exit();
    }

    if ($action === 'save_formation') {
        $equipo_id = intval($data['equipo_id'] ?? 0);
        $formacion = $data['formacion'] ?? '4-4-2';
        $titulares = json_decode($data['titulares'] ?? '[]', true);

        $conn->prepare("UPDATE equipos_primera_femenina SET formacion=? WHERE id=?")->execute([$formacion, $equipo_id]);
        $conn->prepare("UPDATE jugadores_femenina SET es_titular=0, posicion_x=NULL, posicion_y=NULL WHERE equipo_id=?")->execute([$equipo_id]);

        if (!empty($titulares)) {
            $st = $conn->prepare("UPDATE jugadores_femenina SET es_titular=1, posicion_x=?, posicion_y=? WHERE id=? AND equipo_id=?");
            foreach (array_slice($titulares, 0, 11) as $t) {
                $st->execute([$t['x']??null, $t['y']??null, intval($t['id']), $equipo_id]);
            }
        }
        echo json_enc(['success'=>true]);
        exit();
    }

    echo json_enc(['success'=>false,'error'=>'Accion desconocida: '.$action]);
    exit();
}

echo json_enc(['success'=>false,'error'=>'Método no permitido']);
