<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

 $host = 'localhost';
 $db   = 'numeros-y-futbol';
 $user = 'root';
 $pass = 'Info2026/*-';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Error de conexión: " . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
    exit();
}

 $division = isset($_POST['division']) ? $_POST['division'] : 'primera';

 $tablas = [
    'primera' => ['jugadores' => 'jugadores', 'stats' => 'estadisticas_jugadores'],
    'segunda' => ['jugadores' => 'jugadores_segunda', 'stats' => 'estadisticas_jugadores_segunda'],
    'tercera' => ['jugadores' => 'jugadores_tercera', 'stats' => 'estadistica_jugadores_tercera'],
];

if (!isset($tablas[$division])) {
    echo json_encode(["success" => false, "error" => "División inválida"]);
    exit();
}

 $tablaJ = $tablas[$division]['jugadores'];
 $tablaS = $tablas[$division]['stats'];

 $equipo_id = isset($_POST['equipo_id']) ? (int)$_POST['equipo_id'] : 0;
if ($equipo_id <= 0) {
    echo json_encode(["success" => false, "error" => "equipo_id requerido"]);
    exit();
}

 $csvText = '';
if (!empty($_FILES['csv'])) {
    if ($_FILES['csv']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["success" => false, "error" => "Error al subir: " . $_FILES['csv']['error']]);
        exit();
    }
    $csvText = file_get_contents($_FILES['csv']['tmp_name']);
} elseif (!empty($_POST['csv_text'])) {
    $csvText = $_POST['csv_text'];
} else {
    echo json_encode(["success" => false, "error" => "No se recibió datos"]);
    exit();
}

if (strtolower(substr($csvText, -4)) === '.xlsx') {
    echo json_encode(["success" => false, "error" => "Solo archivos .csv son aceptados. Guarda tu Excel como CSV"]);
    exit();
}

 $lines = array_values(array_filter(array_map('trim', explode("\n", trim($csvText))));
if (empty($lines)) {
    echo json_encode(["success" => false, "error" => "Archivo vacío"]);
    exit();
}

 $headers = array_map('strtolower', array_map('trim', explode(',', $lines[0])));
 $importStats = [];
 $errores = [];
 $importados = 0;

 $posMap = [
    'por' => 'portero', 'portero' => 'portero',
    'li' => 'lateral_izquierdo', 'lat izq' => 'lateral_izquierdo',
    'ld' => 'lateral_derecho', 'lat der' => 'lateral_derecho',
    'dfc' => 'central', 'cen' => 'central',
    'mcd' => 'medio_defensivo', 'med def' => 'medio_defensivo',
    'mc' => 'medio_central', 'med cen' => 'medio_central',
    'mco' => 'medio_ofensivo', 'med of' => 'medio_ofensivo',
    'ei' => 'extremo_izquierdo', 'ext izq' => 'extremo_izquierdo',
    'ed' => 'extremo_derecho', 'ext der' => 'extremo_derecho',
    'dc' => 'centrodelantero', 'cen del' => 'centrodelantero',
    'sd' => 'segundo_delantero', '2do del' => 'segundo_delantero',
];

function parsePos($v) {
    $v = strtolower(trim($v));
    if (empty($v)) return null;
    if (isset($posMap[$v])) return $posMap[$v];
    foreach ($posMap as $key => $val) {
        if (strpos($key, $v) !== false) return $val;
    }
    $validos = ['portero','lateral_izquierdo','lateral_derecho','central','medio_defensivo','medio_central','medio_ofensivo','extremo_izquierdo','extremo_derecho','centrodelantero','segundo_delantero'];
    foreach ($validos as $p) {
        if (strpos($p, $v) !== false) return $p;
    }
    return null;
}

for ($i = 1; $i < count($lines); $i++) {
    $vals = array_map('trim', explode(',', $lines[$i]));
    if (count($vals) < 2 || empty($vals[0])) continue;
    
    $nombre = $vals[$headers[0]] ?? '';
    if (empty($nombre)) continue;
    
    $posicion = parsePos($vals[$headers[1]] ?? '');
    if (!$posicion) {
        $errores[] = "Fila " . ($i + 1) . ": Posición inválida: " . ($vals[$headers[1]] ?? '');
        continue;
    }
    
    $dorsal = null;
    if (!empty($vals[$headers[2] ?? ''])) {
        $d = (int)$vals[$headers[2]];
        if ($d >= 1 && $d <= 99) $dorsal = $d;
    }
    
    $edad = null;
    if (!empty($vals[$headers[3] ?? ''])) {
        $e = (int)$vals[$headers[3]];
        if ($e >= 16 && $e <= 50) $edad = $e;
    }
    
    $nac = !empty($vals[$headers[4] ?? '') ? trim($vals[$headers[4]]) : null;
    
    $titular = 0;
    $t = strtolower(trim($vals[$headers[5] ?? ''));
    if ($t === '1' || $t === 'si' || $t === 'titular' || $t === 'tit') $titular = 1;
    
    $statsData = [];
    $statMap = [
        'pj' => 'partidos_jugados', 'partidos' => 'partidos_jugados',
        'goles' => 'goles', 'gol' => 'goles',
        'asistencias' => 'asistencias', 'asis' => 'asistencias',
        'goles_penal' => 'goles_penal', 'penales' => 'goles_penal',
        'goles_cabeza' => 'goles_cabeza', 'cabeza' => 'goles_cabeza',
        'goles_tiro_libre' => 'goles_tiro_libre', 'tiro_libre' => 'goles_tiro_libre',
        'tarjetas_amarillas' => 'tarjetas_amarillas', 'amarillas' => 'tarjetas_amarillas',
        'tarjetas_rojas' => 'tarjetas_rojas', 'rojas' => 'tarjetas_rojas',
        'minutos_jugados' => 'minutos_jugados', 'minutos' => 'minutos_jugados',
        'goles_recibidos' => 'goles_recibidos', 'recibidos' => 'goles_recibidos',
        'vaya_invicta' => 'vaya_invicta', 'invicta' => 'vaya_invicta',
        'temporada' => 'temporada',
    ];
    
    foreach ($statMap as $csvKey => $dbCol) {
        if (isset($vals[$csvKey]) && intval($vals[$csvKey]) > 0) {
            $statsData[$dbCol] = intval($vals[$csvKey]);
        }
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO $tablaJ (equipo_id, nombre, posicion, numero_camiseta, edad, nacionalidad, es_titular) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$equipo_id, $nombre, $posicion, $dorsal, $edad, $nac, $titular]);
        $jid = $pdo->lastInsertId();
        
        if (count($statsData) > 0) {
            $importStats[] = ['jugador_id' => $jid] + $statsData;
        }
        $importados++;
    } catch (Exception $e) {
        $errores[] = "Fila " . ($i + 1) . ": " . $e->getMessage();
    }
}

if (!empty($importStats)) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO $tablaS (jugador_id, temporada, partidos_jugados, goles, asistencias, goles_penal, goles_cabeza, goles_tiro_libre, tarjetas_amarillas, tarjetas_rojas, minutos_jugados, goles_recibidos, vaya_invicta)
            VALUES (?, '2025-2026', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            partidos_jugados = VALUES(partidos_jugados), goles = VALUES(goles), asistencias = VALUES(asistencias),
            goles_penal = VALUES(goles_penal), goles_cabeza = VALUES(goles_cabeza), goles_tiro_libre = VALUES(goles_tiro_libre),
            tarjetas_amarillas = VALUES(tarjetas_amarillas), tarjetas_rojas = VALUES(tarjetas_rojas),
            minutos_jugados = VALUES(minutos_jugados), goles_recibidos = VALUES(goles_recibidos), vaya_invicta = VALUES(vaya_invicta)
        ");
        foreach ($importStats as $s) {
            $stmt->execute([$s['jugador_id'], $s['pj'], $s['goles'], $s['asistencias'], $s['goles_penal'], $s['goles_cabeza'], $s['goles_tiro_libre'], $s['tarjetas_amarillas'], $s['tarjetas_rojas'], $s['minutos_jugados'], $s['goles_recibidos'], $s['vaya_invicta']]);
        }
    } catch (Exception $e) {
        $errores[] = "Error en estadísticas: " . $e->getMessage();
    }
}

echo json_encode([
    "success" => true,
    "importados" => $importados,
    "errores" => $errores,
]);