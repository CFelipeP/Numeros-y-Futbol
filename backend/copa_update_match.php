<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

try {

    $body = json_decode(file_get_contents("php://input"), true);
    if (!is_array($body)) throw new Exception("JSON invalido");

    $id = (int)($body['id'] ?? 0);
    if (!$id) throw new Exception("ID requerido");

    $currentStmt = $pdo->prepare("SELECT * FROM partidos_copa WHERE id = ?");
    $currentStmt->execute([$id]);
    $current = $currentStmt->fetch(PDO::FETCH_ASSOC);
    if (!$current) throw new Exception("Partido no encontrado");

    $team1 = array_key_exists('team1_id', $body) ? (int)$body['team1_id'] : (int)$current['equipo_local_id'];
    $team2 = array_key_exists('team2_id', $body) ? (int)$body['team2_id'] : (int)$current['equipo_visitante_id'];
    $fase = array_key_exists('fase', $body) ? trim($body['fase']) : $current['fase'];
    $estado = array_key_exists('estado', $body) ? trim($body['estado']) : $current['estado'];
    $grupo = $fase === 'grupos'
        ? strtoupper(trim(array_key_exists('grupo', $body) ? ($body['grupo'] ?? '') : ($current['grupo_copa'] ?? '')))
        : null;
    $jornada = in_array($fase, ['octavos', 'cuartos', 'semis'], true)
        ? trim(array_key_exists('jornada', $body) ? ($body['jornada'] ?? '') : ($current['jornada'] ?? ''))
        : null;
    $fecha = array_key_exists('fecha', $body) ? ($body['fecha'] ?: null) : $current['fecha'];
    $hora = array_key_exists('hora', $body) ? ($body['hora'] ?: null) : $current['hora'];
    // Si se finaliza un partido sin fecha/hora, asignar la actual
    if ($estado !== 'Pendiente' && (!$fecha || !$hora)) {
        $fecha = $fecha ?: date('Y-m-d');
        $hora  = $hora  ?: date('H:i:s');
    }
    $llave = array_key_exists('llave', $body) ? (($body['llave'] !== '' && $body['llave'] !== null) ? (int)$body['llave'] : null) : $current['llave'];
    $gLocal = array_key_exists('goles_local', $body) ? (($body['goles_local'] !== '' && $body['goles_local'] !== null) ? (int)$body['goles_local'] : null) : $current['goles_local'];
    $gVisit = array_key_exists('goles_visitante', $body) ? (($body['goles_visitante'] !== '' && $body['goles_visitante'] !== null) ? (int)$body['goles_visitante'] : null) : $current['goles_visitante'];
    $pLocal = array_key_exists('penales_local', $body) ? (($body['penales_local'] !== '' && $body['penales_local'] !== null) ? (int)$body['penales_local'] : null) : $current['penales_local'];
    $pVisit = array_key_exists('penales_visitante', $body) ? (($body['penales_visitante'] !== '' && $body['penales_visitante'] !== null) ? (int)$body['penales_visitante'] : null) : $current['penales_visitante'];

    $validFases = ['grupos', 'octavos', 'cuartos', 'semis', 'final'];
    $validEstados = ['Pendiente', 'En Curso', 'Finalizado'];
    if (!in_array($fase, $validFases, true)) throw new Exception("Fase invalida");
    if (!in_array($estado, $validEstados, true)) throw new Exception("Estado invalido");
    if (!$team1 || !$team2) throw new Exception("Equipos requeridos");
    if ($team1 === $team2) throw new Exception("Un equipo no puede jugar contra si mismo");
    if (($fecha && !$hora) || (!$fecha && $hora)) throw new Exception("Fecha y hora deben completarse juntas");
    if ($estado !== 'Pendiente' && (!$fecha || !$hora)) throw new Exception("Fecha y hora requeridas para partidos en curso o finalizados");
    if ($fase === 'grupos' && !preg_match('/^[A-Z]$/', $grupo)) throw new Exception("Grupo requerido");
    if (in_array($fase, ['octavos', 'cuartos', 'semis'], true) && !in_array($jornada, ['ida', 'vuelta'], true)) {
        throw new Exception("Jornada ida/vuelta requerida");
    }
    if ($estado === 'Finalizado' && ($gLocal === null || $gVisit === null)) {
        throw new Exception("Marcador requerido para finalizar");
    }
    if (($gLocal !== null && $gLocal < 0) || ($gVisit !== null && $gVisit < 0) || ($pLocal !== null && $pLocal < 0) || ($pVisit !== null && $pVisit < 0)) {
        throw new Exception("Los marcadores no pueden ser negativos");
    }

    $teamsStmt = $pdo->prepare("SELECT id, nombre, grupo, activo FROM equipos_copa WHERE id IN (?, ?)");
    $teamsStmt->execute([$team1, $team2]);
    $teams = $teamsStmt->fetchAll(PDO::FETCH_ASSOC);
    if (count($teams) !== 2) throw new Exception("Uno o ambos equipos no existen en equipos_copa");
    foreach ($teams as $team) {
        if ((int)$team['activo'] !== 1) throw new Exception("Uno o ambos equipos no estan activos");
        if ($fase === 'grupos' && strtoupper((string)$team['grupo']) !== $grupo) {
            throw new Exception("En fase de grupos ambos equipos deben pertenecer al grupo seleccionado");
        }
    }

    if ($fase === 'grupos') {
        $dup = $pdo->prepare("
            SELECT COUNT(*) FROM partidos_copa
            WHERE id <> ? AND fase = 'grupos' AND grupo_copa = ?
              AND ((equipo_local_id = ? AND equipo_visitante_id = ?) OR (equipo_local_id = ? AND equipo_visitante_id = ?))
        ");
        $dup->execute([$id, $grupo, $team1, $team2, $team2, $team1]);
        if ((int)$dup->fetchColumn() > 0) throw new Exception("Este enfrentamiento ya existe en el grupo");
    } else {
        $dup = $pdo->prepare("
            SELECT COUNT(*) FROM partidos_copa
            WHERE id <> ? AND fase = ? AND COALESCE(jornada, '') = COALESCE(?, '')
              AND ((equipo_local_id = ? AND equipo_visitante_id = ?) OR (equipo_local_id = ? AND equipo_visitante_id = ?))
        ");
        $dup->execute([$id, $fase, $jornada, $team1, $team2, $team2, $team1]);
        if ((int)$dup->fetchColumn() > 0) throw new Exception("Este partido ya existe en esta fase/jornada");
    }

    if ($fecha && $hora) {
        $overlap = $pdo->prepare("
            SELECT COUNT(*) FROM partidos_copa
            WHERE id <> ? AND fecha = ? AND hora = ?
              AND (equipo_local_id IN (?, ?) OR equipo_visitante_id IN (?, ?))
        ");
        $overlap->execute([$id, $fecha, $hora, $team1, $team2, $team1, $team2]);
        if ((int)$overlap->fetchColumn() > 0) throw new Exception("Uno de los equipos ya tiene partido en esa fecha y hora");
    }

    $stmt = $pdo->prepare("
        UPDATE partidos_copa
        SET equipo_local_id = ?, equipo_visitante_id = ?, goles_local = ?, goles_visitante = ?,
            fecha = ?, hora = ?, estado = ?, fase = ?, llave = ?, grupo_copa = ?,
            jornada = ?, penales_local = ?, penales_visitante = ?
        WHERE id = ?
    ");
    $stmt->execute([$team1, $team2, $gLocal, $gVisit, $fecha, $hora, $estado, $fase, $llave, $grupo, $jornada, $pLocal, $pVisit, $id]);

    echo json_enc(["success" => true]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_enc(["success" => false, "message" => $e->getMessage()]);
}
