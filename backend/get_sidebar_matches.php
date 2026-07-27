<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

$conn = $mysqli;

$division = $_GET['division'] ?? 'primera';
$jornadaFilter = isset($_GET['jornada']) && $_GET['jornada'] !== '' ? (int)$_GET['jornada'] : null;

if ($division === 'primera') {
    $tablaPartidos = 'partidos';
    $tablaEquipos  = 'equipos';
    $colEstado     = 'estado';
    $colLocal      = 'equipo_local';
    $colVisitante  = 'equipo_visitante';
} elseif ($division === 'femenina') {
    $tablaPartidos = 'partidos_femenina';
    $tablaEquipos  = 'equipos_primera_femenina';
    $colEstado     = 'estado';
    $colLocal      = 'equipo_local';
    $colVisitante  = 'equipo_visitante';
} else {
    $tablaPartidos = 'partidos_ascenso';
    $tablaEquipos  = 'equipos_ascenso';
    $colEstado     = 'status';
    $colLocal      = 'local_id';
    $colVisitante  = 'visitante_id';
}

$recent = [];
try {
    $sql = "
        SELECT p.id, p.fecha, p.jornada, p.goles_local, p.goles_visitante, p.$colEstado AS status,
               e1.nombre AS home_name, e1.logo AS home_logo,
               e2.nombre AS away_name, e2.logo AS away_logo
        FROM $tablaPartidos p
        LEFT JOIN $tablaEquipos e1 ON p.$colLocal = e1.id
        LEFT JOIN $tablaEquipos e2 ON p.$colVisitante = e2.id
        WHERE p.$colEstado = 'Finalizado'
    ";
    if ($jornadaFilter !== null && $division === 'primera') {
        $sql .= " AND p.jornada = $jornadaFilter";
    }
    $sql .= " ORDER BY p.fecha DESC, p.id DESC";
    if (!$jornadaFilter) {
        $sql .= " LIMIT 5";
    }
    $res = $conn->query($sql);
    while ($row = $res->fetch_assoc()) {
        $recent[] = $row;
    }
} catch (Exception $e) {
    $recent = [];
}

$next = null;
$nextMatches = [];
$nextJornada = null;
try {
    $jnRes = $conn->query("SELECT jornada FROM $tablaPartidos WHERE ($colEstado IS NULL OR $colEstado != 'Finalizado') AND jornada IS NOT NULL ORDER BY jornada ASC LIMIT 1");
    if ($jnRow = $jnRes->fetch_assoc()) {
        $nextJornada = (int)$jnRow['jornada'];
    }
    if ($nextJornada !== null) {
        $res2 = $conn->query("
            SELECT p.id, p.fecha, p.jornada,
                   e1.nombre AS home_name, e1.logo AS home_logo,
                   e2.nombre AS away_name, e2.logo AS away_logo
            FROM $tablaPartidos p
            LEFT JOIN $tablaEquipos e1 ON p.$colLocal = e1.id
            LEFT JOIN $tablaEquipos e2 ON p.$colVisitante = e2.id
            WHERE (p.$colEstado IS NULL OR p.$colEstado != 'Finalizado') AND p.jornada = $nextJornada
            ORDER BY p.fecha ASC, p.id ASC
            LIMIT 6
        ");
        while ($row2 = $res2->fetch_assoc()) { $nextMatches[] = $row2; }
        if (count($nextMatches) > 0) { $next = $nextMatches[0]; }
    } else {
        $res2 = $conn->query("
            SELECT p.id, p.fecha,
                   e1.nombre AS home_name, e1.logo AS home_logo,
                   e2.nombre AS away_name, e2.logo AS away_logo
            FROM $tablaPartidos p
            LEFT JOIN $tablaEquipos e1 ON p.$colLocal = e1.id
            LEFT JOIN $tablaEquipos e2 ON p.$colVisitante = e2.id
            WHERE p.$colEstado IS NULL OR p.$colEstado != 'Finalizado'
            ORDER BY p.fecha ASC, p.id ASC LIMIT 1
        ");
        $row2 = $res2->fetch_assoc();
        if ($row2) { $next = $row2; $nextMatches = [$row2]; }
    }
} catch (Exception $e) {
    $next = null; $nextMatches = [];
}

echo json_enc(['recent' => $recent, 'next' => $next, 'nextMatches' => $nextMatches, 'nextJornada' => $nextJornada]);

$conn->close();
