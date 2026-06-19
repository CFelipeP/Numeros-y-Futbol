<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

const POSICIONES_VALIDAS = [
    'portero','lateral_izquierdo','lateral_derecho','central',
    'medio_defensivo','medio_central','medio_ofensivo',
    'extremo_izquierdo','extremo_derecho',
    'centrodelantero','segundo_delantero'
];
const POSICION_MAPEO = [
    'portero'        => 'portero',
    'defensa'        => 'central',
    'medio'          => 'medio_central',
    'mediocampista'  => 'medio_central',
    'centrocampista' => 'medio_central',
    'lateral'        => 'lateral_derecho',
    'extremo'        => 'extremo_derecho',
    'delantero'      => 'centrodelantero',
    'sd'             => 'segundo_delantero',
];

function normPos($pos) {
    if (!$pos) return 'centrodelantero';
    $p = strtolower(trim($pos));
    if (in_array($p, POSICIONES_VALIDAS)) return $p;
    return POSICION_MAPEO[$p] ?? 'centrodelantero';
}

function nullInt($v)    { return ($v===null||$v===''||strtolower((string)$v)==='null') ? null : intval($v); }
function defaultInt($v) { return ($v===null||$v===''||strtolower((string)$v)==='null') ? 0 : intval($v); }
function nullStr($v)    { return ($v===null||$v===''||strtolower((string)$v)==='null') ? null : trim($v); }

$csv_text = $_POST['csv_text'] ?? '';

if (!$csv_text) {
    echo json_encode(['success'=>false,'error'=>'Falta csv_text']);
    exit();
}

$lines = array_filter(explode("\n", trim($csv_text)), fn($l) => trim($l) !== '');
if (count($lines) < 2) {
    echo json_encode(['success'=>false,'error'=>'CSV vacío o sin datos']);
    exit();
}

$headers = array_map('trim', array_map('strtolower', str_getcsv(array_shift($lines))));

$importados = 0;
$errores    = [];
$conn->beginTransaction();

try {
    foreach ($lines as $idx => $line) {
        $line = trim($line);
        if (empty($line)) continue;

        $values = array_map('trim', str_getcsv($line));
        $row    = [];
        foreach ($headers as $hi => $hname) {
            $row[$hname] = $values[$hi] ?? '';
        }

        $nombre   = nullStr($row['nombre'] ?? '');
        if (empty($nombre)) continue;

        $posicion          = normPos($row['posicion'] ?? '');
        $numero_camiseta   = nullInt($row['numero_camiseta'] ?? null);
        $edad              = nullInt($row['edad'] ?? null);
        $club              = nullStr($row['club'] ?? null);
        $partidos_jugados  = defaultInt($row['partidos_jugados'] ?? 0);
        $goles             = defaultInt($row['goles'] ?? 0);
        $asistencias       = defaultInt($row['asistencias'] ?? 0);
        $atajadas          = defaultInt($row['atajadas'] ?? 0);

        try {
            $conn->prepare("INSERT INTO jugadores_seleccion
                (nombre, posicion, numero_camiseta, edad, club_origen, partidos_jugados, goles, asistencias, atajadas)
                VALUES (?,?,?,?,?,?,?,?,?)")
                ->execute([
                    $nombre, $posicion, $numero_camiseta, $edad,
                    $club, $partidos_jugados, $goles, $asistencias, $atajadas
                ]);
            $importados++;
        } catch (PDOException $e) {
            $errores[] = "Fila ".($idx+2)." ($nombre): Error al insertar";
        }
    }

    $conn->commit();
    echo json_encode(['success'=>true,'importados'=>$importados,'errores'=>$errores]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(['success'=>false,'error'=>"Error interno del servidor"]);
}
