<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$id       = intval($_GET['id'] ?? 0);
$division = strtolower(trim($_GET['division'] ?? 'primera'));

if ($id <= 0) {
    echo json_enc(["error" => "ID requerido"]);
    exit;
}

try {
    switch ($division) {
        case 'seleccion-sub17':
            $tPartidos  = 'partidos_seleccion_sub17';
            $tEquipos   = null;
            $tJugadores = 'jugadores_seleccion_sub17';
            $colLocal   = 'id';
            $colVisit   = 'id';
            $colEstado  = 'estado';
            $selectFormacion = "'4-4-2' AS local_formacion, '4-4-2' AS visitante_formacion";
            $selectPosiciones = 'NULL AS pos_x, NULL AS pos_y';
            break;
        case 'seleccion-sub20':
            $tPartidos  = 'partidos_seleccion_sub20';
            $tEquipos   = null;
            $tJugadores = 'jugadores_seleccion_sub20';
            $colLocal   = 'id';
            $colVisit   = 'id';
            $colEstado  = 'estado';
            $selectFormacion = "'4-4-2' AS local_formacion, '4-4-2' AS visitante_formacion";
            $selectPosiciones = 'NULL AS pos_x, NULL AS pos_y';
            break;
        case 'seleccion-femenina':
            $tPartidos  = 'partidos_seleccion_femenina';
            $tEquipos   = null;
            $tJugadores = 'jugadores_seleccion_femenina';
            $colLocal   = 'id';
            $colVisit   = 'id';
            $colEstado  = 'estado';
            $selectFormacion = "'4-4-2' AS local_formacion, '4-4-2' AS visitante_formacion";
            $selectPosiciones = 'NULL AS pos_x, NULL AS pos_y';
            break;
        case 'seleccion':
            $tPartidos  = 'partidos_seleccion';
            $tEquipos   = null;
            $tJugadores = 'jugadores_seleccion';
            $colLocal   = 'id';
            $colVisit   = 'id';
            $colEstado  = 'estado';
            $selectFormacion = "'4-4-2' AS local_formacion, '4-4-2' AS visitante_formacion";
            $selectPosiciones = 'NULL AS pos_x, NULL AS pos_y';
            break;
        case 'ascenso':
            $tPartidos  = 'partidos_ascenso';
            $tEquipos   = 'equipos_ascenso';
            $tJugadores = 'jugadores_ascenso';
            $colLocal   = 'local_id';
            $colVisit   = 'visitante_id';
            $colEstado  = 'status';
            $selectFormacion = 'el.formacion AS local_formacion, ev.formacion AS visitante_formacion';
            $selectPosiciones = 'COALESCE(pos_x, posicion_x) AS pos_x, COALESCE(pos_y, posicion_y) AS pos_y';
            break;
        case 'femenina':
            $tPartidos  = 'partidos_femenina';
            $tEquipos   = 'equipos_primera_femenina';
            $tJugadores = 'jugadores_femenina';
            $colLocal   = 'equipo_local';
            $colVisit   = 'equipo_visitante';
            $colEstado  = 'estado';
            $selectFormacion = 'el.formacion AS local_formacion, ev.formacion AS visitante_formacion';
            $selectPosiciones = 'COALESCE(pos_x, posicion_x) AS pos_x, COALESCE(pos_y, posicion_y) AS pos_y';
            break;
        case 'reservas':
            $tPartidos  = 'partidos_reservas';
            $tEquipos   = 'equipos_reservas';
            $tJugadores = 'jugadores';
            $colLocal   = 'equipo_local';
            $colVisit   = 'equipo_visitante';
            $colEstado  = 'estado';
            $selectFormacion = 'el.formacion AS local_formacion, ev.formacion AS visitante_formacion';
            $selectPosiciones = 'COALESCE(pos_x, posicion_x) AS pos_x, COALESCE(pos_y, posicion_y) AS pos_y';
            break;
        default:
            $tPartidos  = 'partidos';
            $tEquipos   = 'equipos';
            $tJugadores = 'jugadores';
            $colLocal   = 'equipo_local';
            $colVisit   = 'equipo_visitante';
            $colEstado  = 'estado';
            $selectFormacion = 'el.formacion AS local_formacion, ev.formacion AS visitante_formacion';
            $selectPosiciones = 'COALESCE(pos_x, posicion_x) AS pos_x, COALESCE(pos_y, posicion_y) AS pos_y';
            break;
    }

    // ── Partido ──────────────────────────────────────────────────
    if ($division === 'seleccion' || $division === 'seleccion-femenina' || $division === 'seleccion-sub20' || $division === 'seleccion-sub17') {
        $stmt = $pdo->prepare("
            SELECT
                p.id,
                p.goles_favor AS goles_local,
                p.goles_contra AS goles_visitante,
                p.$colEstado AS estado,
                p.fecha,
                p.rival_nombre AS visitante_nombre,
                p.rival_logo AS visitante_logo,
                p.competicion,
                p.lugar,
                NULL AS local_id,
                NULL AS visitante_id,
                NULL AS estadio,
                NULL AS ciudad,
                $selectFormacion
            FROM $tPartidos p
            WHERE p.id = ?
            LIMIT 1
        ");
        $stmt->execute([$id]);
        $partido = $stmt->fetch(PDO::FETCH_ASSOC);

        // Local = El Salvador
        $partido['local_id'] = -1;
        $partido['local_nombre'] = 'El Salvador';
        $partido['local_logo'] = '/backend/uploads/escudo_elsalvador.png';
        $partido['estadio'] = $partido['lugar'] ?? null;
        $partido['ciudad'] = null;
    } else {
        $stmt = $pdo->prepare("
            SELECT
                p.id,
                p.goles_local,
                p.goles_visitante,
                p.$colEstado AS estado,
                p.fecha,

                el.id AS local_id,
                el.nombre AS local_nombre,
                el.logo AS local_logo,
                el.estadio AS estadio,
                el.ciudad AS ciudad,

                ev.id AS visitante_id,
                ev.nombre AS visitante_nombre,
                ev.logo AS visitante_logo,
                $selectFormacion

            FROM $tPartidos p
            LEFT JOIN $tEquipos el ON p.$colLocal = el.id
            LEFT JOIN $tEquipos ev ON p.$colVisit = ev.id
            WHERE p.id = ?
            LIMIT 1
        ");
        $stmt->execute([$id]);
        $partido = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$partido) {
        echo json_enc(["error" => "Partido no encontrado"]);
        exit;
    }

    // ── Jugadores ────────────────────────────────────────────────
    function obtenerJugadores($pdo, $tabla, $equipo_id) {
        global $selectPosiciones;

        $sql = "
            SELECT id, nombre, numero_camiseta, posicion, foto, $selectPosiciones, es_titular
            FROM $tabla
            WHERE equipo_id = ?
            ORDER BY numero_camiseta ASC
        ";
        $s = $pdo->prepare($sql);
        $s->execute([$equipo_id]);
        return $s->fetchAll(PDO::FETCH_ASSOC);
    }

    $jugadoresLocal     = obtenerJugadores($pdo, $tJugadores, $partido['local_id'] ?? 0);
    $jugadoresVisitante = obtenerJugadores($pdo, $tJugadores, $partido['visitante_id'] ?? 0);

    // ── Comentarios ──────────────────────────────────────────────
    $stmtC = $pdo->prepare("
        SELECT id, minuto, tipo, descripcion, equipo, jugador_id, created_at
        FROM match_comments
        WHERE partido_id = ? AND division = ?
        ORDER BY minuto ASC, id ASC
    ");
    $stmtC->execute([$id, $division]);
    $comentarios = $stmtC->fetchAll(PDO::FETCH_ASSOC);

    echo json_enc([
        "partido"            => $partido,
        "jugadores_local"    => $jugadoresLocal,
        "jugadores_visitante"=> $jugadoresVisitante,
        "comentarios"        => $comentarios,
    ]);

} catch (Exception $e) {
    echo json_enc(["error" => "Error interno del servidor"]);
}
