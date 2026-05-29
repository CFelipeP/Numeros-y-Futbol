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
    echo json_encode(['success' => false, 'message' => 'Fase inválida']);
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
            echo json_encode(['success' => false, 'message' => "Ya existen partidos en " . ucfirst($fase) . ". Usa force=true para regenerar."]);
            exit;
        }
    }

    // Obtener equipos clasificados
    $qualified = getQualifiedForPhase($pdo, $fase, $prevPhaseMap[$fase]);

    if (count($qualified) < 2) {
        echo json_encode(['success' => false, 'message' => "No hay suficientes equipos clasificados para " . ucfirst($fase) . " (mínimo 2, hay " . count($qualified) . ")"]);
        exit;
    }
    if (count($qualified) % 2 !== 0) {
        echo json_encode(['success' => false, 'message' => "Número impar de clasificados (" . count($qualified) . ") para " . ucfirst($fase) . ". No se puede emparejar."]);
        exit;
    }

    // Generar parejas según bracket
    if ($fase === 'octavos') {
        $pairs = buildOctavosPairs($pdo);
    } else {
        $pairs = buildSequentialPairs($qualified);
    }

    if (empty($pairs)) {
        echo json_encode(['success' => false, 'message' => 'No se pudieron generar las parejas. Verifica las clasificaciones.']);
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

    echo json_encode([
        'success' => true,
        'message' => "{$created} partido(s) generado(s) en " . ucfirst($fase),
        'pairs'   => count($pairs),
        'created' => $created,
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
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
        // Top 2 de cada grupo
        $stmt = $pdo->query("SELECT DISTINCT grupo FROM equipos_copa WHERE grupo IS NOT NULL AND activo = 1 ORDER BY grupo");
        $grupos = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $qualified = [];
        foreach ($grupos as $g) {
            $ranked = getGroupStandings($pdo, $g);
            for ($i = 0; $i < min(2, count($ranked)); $i++) {
                $qualified[] = $ranked[$i];
            }
        }
        return array_map(function($t) { return $t['id']; }, $qualified);
    } else {
        return getPhaseWinners($pdo, $prevFase);
    }
}

function buildOctavosPairs(PDO $pdo): array {
    $stmt = $pdo->query("SELECT DISTINCT grupo FROM equipos_copa WHERE grupo IS NOT NULL AND activo = 1 ORDER BY grupo");
    $grupos = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $n = count($grupos);

    if ($n % 2 !== 0) {
        // Número impar de grupos -> no se puede cruzar
        return [];
    }

    $pairs = [];
    $llave = 1;

    for ($i = 0; $i < $n; $i += 2) {
        $g1 = $grupos[$i];
        $g2 = $grupos[$i + 1];

        $ranked1 = getGroupStandings($pdo, $g1);
        $ranked2 = getGroupStandings($pdo, $g2);

        if (count($ranked1) < 2 || count($ranked2) < 2) continue;

        // 1ro de g1 vs 2do de g2
        $pairs[] = ['llave' => $llave, 'team1' => $ranked1[0]['id'], 'team2' => $ranked2[1]['id']];
        $llave++;

        // 1ro de g2 vs 2do de g1
        $pairs[] = ['llave' => $llave, 'team1' => $ranked2[0]['id'], 'team2' => $ranked1[1]['id']];
        $llave++;
    }

    return $pairs;
}

function buildSequentialPairs(array $qualified): array {
    $pairs = [];
    $llave = 1;
    for ($i = 0; $i < count($qualified); $i += 2) {
        if ($i + 1 >= count($qualified)) break;
        $pairs[] = [
            'llave' => $llave,
            'team1' => (int)$qualified[$i],
            'team2' => (int)$qualified[$i + 1],
        ];
        $llave++;
    }
    return $pairs;
}
