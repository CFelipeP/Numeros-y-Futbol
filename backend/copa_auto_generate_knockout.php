<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$body = json_decode(file_get_contents("php://input"), true);
$fase  = $body['fase'] ?? '';
$force = !empty($body['force']);

$validFases = ['octavos', 'cuartos', 'semis', 'final'];
if (!in_array($fase, $validFases, true)) {
    http_response_code(400);
    echo json_enc(['success' => false, 'message' => 'Fase inválida']);
    exit;
}

$prevPhaseMap = [
    'octavos' => 'grupos',
    'cuartos' => 'octavos',
    'semis'   => 'cuartos',
    'final'   => 'semis',
];
$isIdaVuelta = in_array($fase, ['octavos', 'cuartos', 'semis'], true);

try {
    $pdo->beginTransaction();

    // Verificar si ya existen partidos en esta fase
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM partidos_copa WHERE fase = ?");
    $checkStmt->execute([$fase]);
    if ((int)$checkStmt->fetchColumn() > 0) {
        if ($force) {
            $pdo->prepare("DELETE FROM partidos_copa WHERE fase = ?")->execute([$fase]);
        } else {
            echo json_enc(['success' => false, 'message' => "Ya existen partidos en " . ucfirst($fase) . ". Usa force=true para regenerar."]);
            exit;
        }
    }

    // Obtener equipos clasificados
    $qualified = getQualifiedForPhase($pdo, $fase, $prevPhaseMap[$fase]);

    if (count($qualified) < 2) {
        echo json_enc(['success' => false, 'message' => "No hay suficientes equipos clasificados para " . ucfirst($fase) . " (mínimo 2, hay " . count($qualified) . ")"]);
        exit;
    }
    if (count($qualified) % 2 !== 0) {
        echo json_enc(['success' => false, 'message' => "Número impar de clasificados (" . count($qualified) . ") para " . ucfirst($fase) . ". No se puede emparejar."]);
        exit;
    }

    // Generar parejas según bracket
    if ($fase === 'octavos') {
        $pairs = buildOctavosPairs($pdo);
    } else {
        $pairs = buildSequentialPairs($qualified);
    }

    if (empty($pairs)) {
        echo json_enc(['success' => false, 'message' => 'No se pudieron generar las parejas. Verifica las clasificaciones.']);
        exit;
    }

    // Crear partidos
    $insertStmt = $pdo->prepare("
        INSERT INTO partidos_copa (equipo_local_id, equipo_visitante_id, fase, estado, llave, jornada)
        VALUES (?, ?, ?, 'Pendiente', ?, ?)
    ");

    $created = 0;
    foreach ($pairs as $pair) {
        $llave = $pair['llave'];
        $t1 = (int)$pair['team1'];
        $t2 = (int)$pair['team2'];

        if ($isIdaVuelta) {
            $insertStmt->execute([$t1, $t2, $fase, $llave, 'ida']);
            $insertStmt->execute([$t2, $t1, $fase, $llave, 'vuelta']);
            $created += 2;
        } else {
            $insertStmt->execute([$t1, $t2, $fase, $llave, null]);
            $created++;
        }
    }

    $pdo->commit();

    echo json_enc([
        'success' => true,
        'message' => "{$created} partido(s) generado(s) en " . ucfirst($fase),
        'pairs'   => count($pairs),
        'created' => $created,
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_enc(['success' => false, 'message' => 'Error interno del servidor']);
}

/* ─── Funciones ──────────────────────────────────────────────────────────── */

function getGroupStandings(PDO $pdo, string $grupo): array {
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
        ORDER BY
            (SUM(CASE
                WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id AND p.goles_local>p.goles_visitante THEN 3
                WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id AND p.goles_visitante>p.goles_local THEN 3
                WHEN p.estado='Finalizado' AND (p.equipo_local_id=ec.id OR p.equipo_visitante_id=ec.id) AND p.goles_local=p.goles_visitante THEN 1
                ELSE 0 END)) DESC,
            (SUM(CASE
                WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id THEN p.goles_local
                WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id THEN p.goles_visitante
                ELSE 0 END) - SUM(CASE
                WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id THEN p.goles_visitante
                WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id THEN p.goles_local
                ELSE 0 END)) DESC,
            SUM(CASE
                WHEN p.estado='Finalizado' AND p.equipo_local_id=ec.id THEN p.goles_local
                WHEN p.estado='Finalizado' AND p.equipo_visitante_id=ec.id THEN p.goles_visitante
                ELSE 0 END) DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$grupo]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];
    foreach ($rows as $r) {
        $pts = ((int)$r['g'] * 3) + (int)$r['e'];
        $result[] = [
            'id'   => (int)$r['id'],
            'nombre' => $r['nombre'],
            'pts'  => $pts,
            'dg'   => (int)$r['gf'] - (int)$r['gc'],
            'gf'   => (int)$r['gf'],
        ];
    }

    return $result;
}

function getPhaseWinners(PDO $pdo, string $fase): array {
    // Obtener partidos de la fase, agrupados por llave
    $stmt = $pdo->prepare("
        SELECT id, equipo_local_id, equipo_visitante_id, goles_local, goles_visitante,
               llave, jornada, penales_local, penales_visitante, estado
        FROM partidos_copa
        WHERE fase = ? AND estado = 'Finalizado'
        ORDER BY llave, jornada
    ");
    $stmt->execute([$fase]);
    $matches = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Agrupar por llave
    $byLlave = [];
    foreach ($matches as $m) {
        $lk = (int)$m['llave'];
        if (!isset($byLlave[$lk])) $byLlave[$lk] = [];
        $byLlave[$lk][] = $m;
    }

    $winners = [];
    foreach ($byLlave as $lk => $ms) {
        if (count($ms) < 2 && $fase !== 'final') continue; // necesita ida+vuelta
        if ($fase === 'final' || count($ms) === 1) {
            // Partido único
            $m = $ms[0];
            $gl = (int)$m['goles_local'];
            $gv = (int)$m['goles_visitante'];
            if ($gl > $gv) {
                $winners[] = (int)$m['equipo_local_id'];
            } elseif ($gv > $gl) {
                $winners[] = (int)$m['equipo_visitante_id'];
            }
            continue;
        }

        // Ida y vuelta
        $ida = $ms[0];
        $vuelta = $ms[1];
        if ($ida['jornada'] === 'vuelta') {
            list($ida, $vuelta) = [$vuelta, $ida];
        }
        if ($ida['jornada'] !== 'ida') continue;

        $g1_ida  = (int)$ida['goles_local'];
        $g2_ida  = (int)$ida['goles_visitante'];
        $g1_vuelta = (int)$vuelta['goles_visitante']; // visitante en vuelta = equipo local ida
        $g2_vuelta = (int)$vuelta['goles_local'];    // local en vuelta = equipo visitante ida

        $total1 = $g1_ida + $g1_vuelta;
        $total2 = $g2_ida + $g2_vuelta;

        if ($total1 > $total2) {
            $winners[] = (int)$ida['equipo_local_id'];
        } elseif ($total2 > $total1) {
            $winners[] = (int)$ida['equipo_visitante_id'];
        } else {
            // Empate global -> gol de visitante
            if ($g1_vuelta > $g2_ida) {
                $winners[] = (int)$ida['equipo_local_id'];
            } elseif ($g2_ida > $g1_vuelta) {
                $winners[] = (int)$ida['equipo_visitante_id'];
            } else {
                // Penales
                $pL = (int)$vuelta['penales_local'];
                $pV = (int)$vuelta['penales_visitante'];
                if ($pL > $pV) {
                    $winners[] = (int)$vuelta['equipo_local_id'];
                } elseif ($pV > $pL) {
                    $winners[] = (int)$vuelta['equipo_visitante_id'];
                }
            }
        }
    }

    return $winners;
}

function getQualifiedForPhase(PDO $pdo, string $fase, string $prevFase): array {
    if ($fase === 'octavos') {
        $stmt = $pdo->query("SELECT DISTINCT grupo FROM equipos_copa WHERE grupo IS NOT NULL AND activo = 1 ORDER BY grupo");
        $grupos = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $qualified = [];
        $thirds = [];
        foreach ($grupos as $g) {
            $ranked = getGroupStandings($pdo, $g);
            for ($i = 0; $i < min(2, count($ranked)); $i++) {
                $qualified[] = ['id' => $ranked[$i]['id'], 'grupo' => $g, 'pos' => $i + 1];
            }
            if (count($ranked) >= 3) {
                $thirds[] = ['id' => $ranked[2]['id'], 'grupo' => $g, 'pos' => 3, 'pts' => $ranked[2]['pts'], 'dg' => $ranked[2]['dg'], 'gf' => $ranked[2]['gf']];
            }
        }

        // Sort 3rd place teams by pts, dg, gf
        usort($thirds, function($a, $b) {
            if ($b['pts'] !== $a['pts']) return $b['pts'] - $a['pts'];
            if ($b['dg'] !== $a['dg']) return $b['dg'] - $a['dg'];
            return $b['gf'] - $a['gf'];
        });

        // Take top 4 best 3rds
        $bestThirds = array_slice($thirds, 0, 4);
        foreach ($bestThirds as $t) {
            $qualified[] = ['id' => $t['id'], 'grupo' => $t['grupo'], 'pos' => 3];
        }

        return $qualified;
    } else {
        $ids = getPhaseWinners($pdo, $prevFase);
        return array_map(function($id) { return ['id' => $id]; }, $ids);
    }
}

function buildOctavosPairs(PDO $pdo): array {
    $qualified = getQualifiedForPhase($pdo, 'octavos', 'grupos');

    // Separate top 2 per group vs best 3rds
    $top2 = [];
    $bestThirds = [];
    foreach ($qualified as $q) {
        if (($q['pos'] ?? 0) === 3) {
            $bestThirds[] = $q;
        } else {
            $top2[] = $q;
        }
    }

    // Get standings by group for top 1 and top 2 lookups
    $byGroup = [];
    foreach ($top2 as $t) {
        if (!isset($byGroup[$t['grupo']])) $byGroup[$t['grupo']] = [];
        $byGroup[$t['grupo']][$t['pos']] = $t['id'];
    }

    $grupos = $pdo->query("SELECT DISTINCT grupo FROM equipos_copa WHERE grupo IS NOT NULL AND activo = 1 ORDER BY grupo")->fetchAll(PDO::FETCH_COLUMN);
    $groupsSorted = array_values(array_intersect($grupos, array_keys($byGroup)));
    $pairs = [];
    $llave = 1;

    // 1A vs 2B, 1B vs 2A
    if (isset($groupsSorted[0], $groupsSorted[1])) {
        $ga = $groupsSorted[0]; $gb = $groupsSorted[1];
        $pairs[] = ['llave' => $llave++, 'team1' => $byGroup[$ga][1], 'team2' => $byGroup[$gb][2]];
        $pairs[] = ['llave' => $llave++, 'team1' => $byGroup[$gb][1], 'team2' => $byGroup[$ga][2]];
    }

    // 1C vs 2D, 1D vs 2C
    if (isset($groupsSorted[2], $groupsSorted[3])) {
        $gc = $groupsSorted[2]; $gd = $groupsSorted[3];
        $pairs[] = ['llave' => $llave++, 'team1' => $byGroup[$gc][1], 'team2' => $byGroup[$gd][2]];
        $pairs[] = ['llave' => $llave++, 'team1' => $byGroup[$gd][1], 'team2' => $byGroup[$gc][2]];
    }

    // 1E vs best-3rd-1, 1F vs best-3rd-2
    $thirdsSorted = $bestThirds;
    if (isset($groupsSorted[4])) {
        $ge = $groupsSorted[4];
        $th1 = array_shift($thirdsSorted);
        if ($th1) $pairs[] = ['llave' => $llave++, 'team1' => $byGroup[$ge][1], 'team2' => $th1['id']];
    }
    if (isset($groupsSorted[5])) {
        $gf = $groupsSorted[5];
        $th2 = array_shift($thirdsSorted);
        if ($th2) $pairs[] = ['llave' => $llave++, 'team1' => $byGroup[$gf][1], 'team2' => $th2['id']];
    }

    // 2E vs best-3rd-3, 2F vs best-3rd-4
    if (isset($groupsSorted[4])) {
        $ge = $groupsSorted[4];
        $th3 = array_shift($thirdsSorted);
        if ($th3) $pairs[] = ['llave' => $llave++, 'team1' => $byGroup[$ge][2], 'team2' => $th3['id']];
    }
    if (isset($groupsSorted[5])) {
        $gf = $groupsSorted[5];
        $th4 = array_shift($thirdsSorted);
        if ($th4) $pairs[] = ['llave' => $llave++, 'team1' => $byGroup[$gf][2], 'team2' => $th4['id']];
    }

    return $pairs;
}

function buildSequentialPairs(array $qualified): array {
    $ids = array_map(function($q) { return (int)$q['id']; }, $qualified);
    $pairs = [];
    $llave = 1;
    for ($i = 0; $i < count($ids); $i += 2) {
        if ($i + 1 >= count($ids)) break;
        $pairs[] = [
            'llave' => $llave,
            'team1' => $ids[$i],
            'team2' => $ids[$i + 1],
        ];
        $llave++;
    }
    return $pairs;
}
