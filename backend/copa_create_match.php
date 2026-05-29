<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

try {

    $body = json_decode(file_get_contents("php://input"), true);
    if (!is_array($body)) {
        throw new Exception("JSON invalido");
    }

    $team1 = (int)($body['team1_id'] ?? 0);
    $team2 = (int)($body['team2_id'] ?? 0);
    $fase = trim($body['fase'] ?? 'grupos');
    $estado = trim($body['estado'] ?? 'Pendiente');
    $grupo = $fase === 'grupos' ? strtoupper(trim($body['grupo'] ?? '')) : null;
    $jornada = in_array($fase, ['octavos', 'cuartos', 'semis'], true) ? trim($body['jornada'] ?? '') : null;
    $fecha = !empty($body['fecha']) ? $body['fecha'] : null;
    $hora = !empty($body['hora']) ? $body['hora'] : null;
    $llave = isset($body['llave']) && $body['llave'] !== '' ? (int)$body['llave'] : null;
    $gLocal = isset($body['goles_local']) && $body['goles_local'] !== '' ? (int)$body['goles_local'] : null;
    $gVisit = isset($body['goles_visitante']) && $body['goles_visitante'] !== '' ? (int)$body['goles_visitante'] : null;
    $pLocal = isset($body['penales_local']) && $body['penales_local'] !== '' ? (int)$body['penales_local'] : null;
    $pVisit = isset($body['penales_visitante']) && $body['penales_visitante'] !== '' ? (int)$body['penales_visitante'] : null;

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
            WHERE fase = 'grupos' AND grupo_copa = ?
              AND ((equipo_local_id = ? AND equipo_visitante_id = ?) OR (equipo_local_id = ? AND equipo_visitante_id = ?))
        ");
        $dup->execute([$grupo, $team1, $team2, $team2, $team1]);
        if ((int)$dup->fetchColumn() > 0) throw new Exception("Este enfrentamiento ya existe en el grupo");
    } else {
        $dup = $pdo->prepare("
            SELECT COUNT(*) FROM partidos_copa
            WHERE fase = ? AND COALESCE(jornada, '') = COALESCE(?, '')
              AND ((equipo_local_id = ? AND equipo_visitante_id = ?) OR (equipo_local_id = ? AND equipo_visitante_id = ?))
        ");
        $dup->execute([$fase, $jornada, $team1, $team2, $team2, $team1]);
        if ((int)$dup->fetchColumn() > 0) throw new Exception("Este partido ya existe en esta fase/jornada");
    }

    if ($fecha && $hora) {
        $overlap = $pdo->prepare("
            SELECT COUNT(*) FROM partidos_copa
            WHERE fecha = ? AND hora = ?
              AND (equipo_local_id IN (?, ?) OR equipo_visitante_id IN (?, ?))
        ");
        $overlap->execute([$fecha, $hora, $team1, $team2, $team1, $team2]);
        if ((int)$overlap->fetchColumn() > 0) throw new Exception("Uno de los equipos ya tiene partido en esa fecha y hora");
    }

    $stmt = $pdo->prepare("
        INSERT INTO partidos_copa
            (equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, hora, estado, fase, llave, grupo_copa, jornada, penales_local, penales_visitante)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$team1, $team2, $gLocal, $gVisit, $fecha, $hora, $estado, $fase, $llave, $grupo, $jornada, $pLocal, $pVisit]);

    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Error interno del servidor"]);
}
