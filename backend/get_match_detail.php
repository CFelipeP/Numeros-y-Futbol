<?php

error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

$id       = intval($_GET['id'] ?? 0);
$division = trim($_GET['division'] ?? 'primera');

if ($id <= 0) {
    echo json_encode([
        "error" => "ID requerido"
    ]);
    exit;
}

try {

    // ─────────────────────────────────────────────────────────────
    // Tablas según división
    // ─────────────────────────────────────────────────────────────
    switch ($division) {

        case 'segunda':

            $tPartidos = 'partidos_segunda';
            $tEquipos  = 'equipos_segunda';
            $tJugadores = 'jugadores_segunda';

            $colLocal  = 'local_id';
            $colVisit  = 'visitante_id';
            $colEstado = 'status';

        break;

        case 'tercera':

            $tPartidos = 'partidos_tercera';
            $tEquipos  = 'equipos_tercera';
            $tJugadores = 'jugadores_tercera';

            $colLocal  = 'local_id';
            $colVisit  = 'visitante_id';
            $colEstado = 'status';

        break;

        default:

            $tPartidos = 'partidos';
            $tEquipos  = 'equipos';
            $tJugadores = 'jugadores';

            $colLocal  = 'equipo_local';
            $colVisit  = 'equipo_visitante';
            $colEstado = 'estado';

        break;
    }

    // ─────────────────────────────────────────────────────────────
    // Partido
    // ─────────────────────────────────────────────────────────────
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
            el.formacion AS local_formacion,

            ev.id AS visitante_id,
            ev.nombre AS visitante_nombre,
            ev.logo AS visitante_logo,
            ev.formacion AS visitante_formacion

        FROM $tPartidos p

        INNER JOIN $tEquipos el
            ON p.$colLocal = el.id

        INNER JOIN $tEquipos ev
            ON p.$colVisit = ev.id

        WHERE p.id = ?
        LIMIT 1
    ");

    $stmt->execute([$id]);

    $partido = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$partido) {

        echo json_encode([
            "error" => "Partido no encontrado"
        ]);

        exit;
    }

    // ─────────────────────────────────────────────────────────────
    // Función para ordenar tácticamente
    // ─────────────────────────────────────────────────────────────
    function obtenerJugadores($pdo, $tabla, $equipo_id)
    {

        $sql = "
            SELECT
                id,
                nombre,
                numero_camiseta,
                posicion,
                foto,
                pos_x,
                pos_y,
                es_titular

            FROM $tabla

            WHERE equipo_id = ?

            ORDER BY numero_camiseta ASC
        ";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([$equipo_id]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ─────────────────────────────────────────────────────────────
    // Jugadores
    // ─────────────────────────────────────────────────────────────
    $jugadoresLocal = obtenerJugadores(
        $pdo,
        $tJugadores,
        $partido['local_id']
    );

    $jugadoresVisitante = obtenerJugadores(
        $pdo,
        $tJugadores,
        $partido['visitante_id']
    );

    // ─────────────────────────────────────────────────────────────
    // Crear tabla comentarios si no existe
    // ─────────────────────────────────────────────────────────────
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS match_comments (

            id INT NOT NULL AUTO_INCREMENT,

            partido_id INT NOT NULL,

            division VARCHAR(20)
            NOT NULL DEFAULT 'primera',

            minuto INT NOT NULL DEFAULT 0,

            tipo ENUM(
                'gol',
                'tarjeta_amarilla',
                'tarjeta_roja',
                'cambio',
                'comentario',
                'inicio',
                'fin',
                'penal'
            ) NOT NULL DEFAULT 'comentario',

            descripcion TEXT NOT NULL,

            equipo VARCHAR(150) DEFAULT NULL,

            created_at TIMESTAMP
            DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY (id),

            KEY idx_partido (
                partido_id,
                division
            )

        ) ENGINE=InnoDB
        DEFAULT CHARSET=utf8mb4
    ");

    // ─────────────────────────────────────────────────────────────
    // Comentarios
    // ─────────────────────────────────────────────────────────────
    $stmtC = $pdo->prepare("
        SELECT
            id,
            minuto,
            tipo,
            descripcion,
            equipo,
            created_at

        FROM match_comments

        WHERE partido_id = ?
        AND division = ?

        ORDER BY minuto ASC, id ASC
    ");

    $stmtC->execute([
        $id,
        $division
    ]);

    $comentarios = $stmtC->fetchAll(PDO::FETCH_ASSOC);

    // ─────────────────────────────────────────────────────────────
    // Respuesta
    // ─────────────────────────────────────────────────────────────
    echo json_encode([

        "partido" => $partido,

        "jugadores_local" => $jugadoresLocal,

        "jugadores_visitante" => $jugadoresVisitante,

        "comentarios" => $comentarios

    ]);

} catch (Exception $e) {

    echo json_encode([
        "error" => $e->getMessage()
    ]);
}