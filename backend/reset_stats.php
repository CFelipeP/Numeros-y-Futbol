<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_enc(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

require_once __DIR__ . '/db.php';
require_once 'auth_check.php';
requireAdmin();

$input = json_decode(file_get_contents("php://input"), true);
$division = $input['division'] ?? 'primera';

$validDivisions = [
    'primera' => ['partidos', 'tabla_posiciones', "partidos_jugados = 0, ganados = 0, empatados = 0, perdidos = 0, goles_favor = 0, goles_contra = 0, puntos = 0"],
    'segunda' => ['partidos_segunda', 'tabla_posiciones_segunda', 'pj = 0, pg = 0, pe = 0, pp = 0, gf = 0, gc = 0, dg = 0, pts = 0'],
    'ascenso' => ['partidos_segunda', 'tabla_posiciones_segunda', 'pj = 0, pg = 0, pe = 0, pp = 0, gf = 0, gc = 0, dg = 0, pts = 0'],
    'tercera' => ['partidos_tercera', 'tabla_posiciones_tercera', 'pj = 0, pg = 0, pe = 0, pp = 0, gf = 0, gc = 0, dg = 0, pts = 0'],
    'femenina' => ['partidos_femenina', 'tabla_posiciones_femenina', 'partidos_jugados = 0, ganados = 0, empatados = 0, perdidos = 0, goles_favor = 0, goles_contra = 0, puntos = 0'],
];

if (!isset($validDivisions[$division])) {
    echo json_enc(['success' => false, 'error' => 'División inválida']);
    exit;
}

$tablaPartidos   = $validDivisions[$division][0];
$tablaPosiciones = $validDivisions[$division][1];
$setCols         = $validDivisions[$division][2];

$ok1 = $conn->exec("UPDATE $tablaPosiciones SET $setCols");
if ($ok1 === false) {
    echo json_enc(['success' => false, 'error' => 'Error al reiniciar posiciones en ' . $tablaPosiciones]);
    exit;
}

$ok2 = $conn->exec("DELETE FROM $tablaPartidos");
if ($ok2 === false) {
    echo json_enc(['success' => false, 'error' => 'Error al eliminar partidos de ' . $tablaPartidos]);
    exit;
}

echo json_enc(['success' => true, 'message' => 'Temporada reiniciada correctamente']);
