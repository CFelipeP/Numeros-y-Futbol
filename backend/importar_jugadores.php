<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once __DIR__ . '/db.php';

// ─── Posiciones válidas ──────────────────────────────────────────────────────
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

$equipo_id = intval($_POST['equipo_id'] ?? 0);
$division  = $_POST['division']  ?? 'primera';
$csv_text  = $_POST['csv_text']  ?? '';

if (!$equipo_id || !$csv_text) {
    echo json_encode(['success'=>false,'error'=>'Faltan equipo_id o csv_text']);
    exit();
}

$lines = array_filter(explode("\n", trim($csv_text)), fn($l) => trim($l) !== '');
if (count($lines) < 2) {
    echo json_encode(['success'=>false,'error'=>'CSV vacío o sin datos']);
    exit();
}

$headers = array_map('trim', array_map('strtolower', str_getcsv(array_shift($lines))));

// Determinar tabla
$table = match($division) {
    'segunda' => 'jugadores_segunda',
    'tercera' => 'jugadores_tercera',
    default   => 'jugadores',
};
$statsTable = match($division) {
    'segunda' => null, // segunda tiene stats inline
    'tercera' => null,
    default   => 'estadisticas_jugadores',
};

// Contar titulares actuales para respetar límite 11
$stmtCount = $conn->prepare("SELECT COUNT(*) FROM {$table} WHERE equipo_id=? AND es_titular=1");
$stmtCount->execute([$equipo_id]);
$titularesActuales = (int)$stmtCount->fetchColumn();

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
        $nacionalidad      = nullStr($row['nacionalidad'] ?? null);
        $es_titular_csv    = (($row['es_titular'] ?? '0') === '1') ? 1 : 0;

        // Respetar límite de 11 titulares
        if ($es_titular_csv && $titularesActuales >= 11) {
            $es_titular_csv = 0; // degradar a suplente si ya hay 11
        }

        $pj                = defaultInt($row['pj'] ?? 0);
        $goles             = defaultInt($row['goles'] ?? 0);
        $asistencias       = defaultInt($row['asistencias'] ?? 0);
        $goles_penal       = defaultInt($row['goles_penal'] ?? 0);
        $goles_cabeza      = defaultInt($row['goles_cabeza'] ?? 0);
        $goles_tiro_libre  = defaultInt($row['goles_tiro_libre'] ?? 0);
        $tarjetas_amarillas= defaultInt($row['tarjetas_amarillas'] ?? 0);
        $tarjetas_rojas    = defaultInt($row['tarjetas_rojas'] ?? 0);
        $minutos_jugados   = defaultInt($row['minutos_jugados'] ?? 0);
        $goles_recibidos   = defaultInt($row['goles_recibidos'] ?? 0);
        $vaya_invicta      = defaultInt($row['vaya_invicta'] ?? 0);

        // Si hay dorsal, verificar duplicado dentro del equipo
        if ($numero_camiseta !== null) {
            $chk = $conn->prepare("SELECT COUNT(*) FROM {$table} WHERE equipo_id=? AND numero_camiseta=?");
            $chk->execute([$equipo_id, $numero_camiseta]);
            if ($chk->fetchColumn() > 0) {
                $errores[] = "Fila ".($idx+2)." ($nombre): dorsal #{$numero_camiseta} ya existe → se omite dorsal";
                $numero_camiseta = null; // importar sin dorsal antes que fallar
            }
        }

        try {
            if ($division === 'segunda') {
                $sql = "INSERT INTO jugadores_segunda
                    (equipo_id,nombre,posicion,numero_camiseta,edad,nacionalidad,es_titular,
                     pj,goles,asistencias,goles_penal,goles_cabeza,goles_tiro_libre,
                     tarjetas_amarillas,tarjetas_rojas,minutos_jugados,goles_recibidos,vaya_invicta)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                $conn->prepare($sql)->execute([
                    $equipo_id,$nombre,$posicion,$numero_camiseta,$edad,$nacionalidad,$es_titular_csv,
                    $pj,$goles,$asistencias,$goles_penal,$goles_cabeza,$goles_tiro_libre,
                    $tarjetas_amarillas,$tarjetas_rojas,$minutos_jugados,$goles_recibidos,$vaya_invicta
                ]);

            } elseif ($division === 'tercera') {
                $sql = "INSERT INTO jugadores_tercera
                    (equipo_id,nombre,posicion,numero_camiseta,edad,nacionalidad,es_titular)
                    VALUES (?,?,?,?,?,?,?)";
                $conn->prepare($sql)->execute([
                    $equipo_id,$nombre,$posicion,$numero_camiseta,$edad,$nacionalidad,$es_titular_csv
                ]);

            } else {
                // Primera: jugadores + estadisticas_jugadores separadas
                $sql = "INSERT INTO jugadores
                    (equipo_id,nombre,posicion,numero_camiseta,edad,nacionalidad,es_titular)
                    VALUES (?,?,?,?,?,?,?)";
                $stmt = $conn->prepare($sql);
                $stmt->execute([$equipo_id,$nombre,$posicion,$numero_camiseta,$edad,$nacionalidad,$es_titular_csv]);
                $jugador_id = $conn->lastInsertId();

                $sql2 = "INSERT INTO estadisticas_jugadores
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
                        vaya_invicta=VALUES(vaya_invicta)";
                $conn->prepare($sql2)->execute([
                    $jugador_id,'2025-2026',$pj,$goles,$asistencias,$goles_cabeza,
                    $goles_tiro_libre,$goles_penal,$tarjetas_amarillas,$tarjetas_rojas,
                    $minutos_jugados,$goles_recibidos,$vaya_invicta
                ]);
            }

            if ($es_titular_csv) $titularesActuales++;
            $importados++;

        } catch (PDOException $e) {
            $errores[] = "Fila ".($idx+2)." ($nombre): ".$e->getMessage();
        }
    }

    $conn->commit();
    echo json_encode(['success'=>true,'importados'=>$importados,'errores'=>$errores]);

} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
}