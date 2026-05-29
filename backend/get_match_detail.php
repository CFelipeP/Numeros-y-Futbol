<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$id       = intval($_GET['id'] ?? 0);
$division = strtolower(trim($_GET['division'] ?? 'primera'));

if ($id <= 0) {
    echo json_encode(["error" => "ID requerido"]);
    exit;
}

try {
    switch ($division) {
        case 'segunda':
            $tPartidos  = 'partidos_segunda';
            $tEquipos   = 'equipos_segunda';
            $tJugadores = 'jugadores_segunda';
            $colLocal   = 'local_id';
            $colVisit   = 'visitante_id';
            $colEstado  = 'status';
            $selectFormacion = "'4-4-2' AS local_formacion, '4-4-2' AS visitante_formacion";
            $selectPosiciones = 'posicion_x AS pos_x, posicion_y AS pos_y';
            break;
        case 'tercera':
            $tPartidos  = 'partidos_tercera';
            $tEquipos   = 'equipos_tercera';
            $tJugadores = 'jugadores_tercera';
            $colLocal   = 'local_id';
            $colVisit   = 'visitante_id';
            $colEstado  = 'status';
            $selectFormacion = "'4-4-2' AS local_formacion, '4-4-2' AS visitante_formacion";
            $selectPosiciones = 'posicion_x AS pos_x, posicion_y AS pos_y';
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
        INNER JOIN $tEquipos el ON p.$colLocal = el.id
        INNER JOIN $tEquipos ev ON p.$colVisit = ev.id
        WHERE p.id = ?
        LIMIT 1
    ");
    $stmt->execute([$id]);
    $partido = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$partido) {
        echo json_encode(["error" => "Partido no encontrado"]);
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

    $jugadoresLocal     = obtenerJugadores($pdo, $tJugadores, $partido['local_id']);
    $jugadoresVisitante = obtenerJugadores($pdo, $tJugadores, $partido['visitante_id']);

    // ── Asegurar que la tabla match_comments existe ─
    try {
        $pdo->exec("CREATE TABLE IF NOT EXISTS `match_comments` (
            `id`          INT NOT NULL AUTO_INCREMENT,
            `partido_id`  INT NOT NULL,
            `division`    VARCHAR(20) NOT NULL DEFAULT 'primera',
            `minuto`      INT NOT NULL DEFAULT 0,
            `tipo`        ENUM('gol','gol_penal','gol_cabeza','gol_tiro_libre','asistencia','tarjeta_amarilla','tarjeta_roja','cambio','comentario','inicio','descanso','fin','penal') NOT NULL DEFAULT 'comentario',
            `descripcion` TEXT NOT NULL,
            `equipo`      VARCHAR(150) DEFAULT NULL,
            `jugador_id`  INT DEFAULT NULL,
            `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_partido` (`partido_id`, `division`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    } catch (Exception $_) {}

    // ── Asegurar columna jugador_id y tipos nuevos en match_comments ─
    try {
        $pdo->exec("ALTER TABLE `match_comments` ADD COLUMN `jugador_id` INT DEFAULT NULL AFTER `equipo`");
    } catch (Exception $e) {
        if (!str_contains($e->getMessage(), 'Duplicate column')) {
            error_log("get_match_detail.php: " . $e->getMessage());
        }
    }

    // Actualizar ENUM para incluir todos los tipos nuevos
    try {
        $pdo->exec("ALTER TABLE `match_comments` MODIFY COLUMN `tipo` ENUM(
            'gol','gol_penal','gol_cabeza','gol_tiro_libre',
            'asistencia','tarjeta_amarilla','tarjeta_roja',
            'cambio','comentario','inicio','descanso','fin','penal'
        ) NOT NULL DEFAULT 'comentario'");
    } catch (Exception $_) {}

    // ── Comentarios ──────────────────────────────────────────────
    $stmtC = $pdo->prepare("
        SELECT id, minuto, tipo, descripcion, equipo, jugador_id, created_at
        FROM match_comments
        WHERE partido_id = ? AND division = ?
        ORDER BY minuto ASC, id ASC
    ");
    $stmtC->execute([$id, $division]);
    $comentarios = $stmtC->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "partido"            => $partido,
        "jugadores_local"    => $jugadoresLocal,
        "jugadores_visitante"=> $jugadoresVisitante,
        "comentarios"        => $comentarios,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => "Error interno del servidor"]);
}
