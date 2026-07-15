<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$log = [];
$errors = [];

// ---- MIGRAR EQUIPOS Y TABLA DE POSICIONES ----
// Segunda -> Ascenso
$segundaEquipos = $pdo->query("SELECT * FROM equipos_segunda")->fetchAll(PDO::FETCH_ASSOC);
foreach ($segundaEquipos as $eq) {
    $stmt = $pdo->prepare("INSERT INTO equipos_ascenso (nombre, ciudad, estadio, logo, created_at, formacion) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$eq['nombre'], $eq['ciudad'] ?? null, $eq['estadio'] ?? null, $eq['logo'] ?? null, $eq['created_at'] ?? null, $eq['formacion'] ?? null]);
    $newId = $pdo->lastInsertId();
    $pdo->prepare("INSERT INTO tabla_posiciones_ascenso (equipo_id) VALUES (?)")->execute([$newId]);

    // Migrar jugadores
    $jugadores = $pdo->prepare("SELECT * FROM jugadores_segunda WHERE equipo_id = ?");
    $jugadores->execute([$eq['id']]);
    foreach ($jugadores->fetchAll(PDO::FETCH_ASSOC) as $j) {
        $pdo->prepare("INSERT INTO jugadores_ascenso (equipo_id, nombre, posicion, numero_camiseta, foto, edad, nacionalidad, fecha_creacion, posicion_x, posicion_y, es_titular) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            ->execute([$newId, $j['nombre'], $j['posicion'], $j['numero_camiseta'], $j['foto'], $j['edad'], $j['nacionalidad'], $j['fecha_creacion'] ?? null, $j['posicion_x'] ?? null, $j['posicion_y'] ?? null, $j['es_titular'] ?? 0]);
        $newJugId = $pdo->lastInsertId();
        // Migrar stats
        $stats = $pdo->prepare("SELECT * FROM estadisticas_jugadores_segunda WHERE jugador_id = ?");
        $stats->execute([$j['id']]);
        foreach ($stats->fetchAll(PDO::FETCH_ASSOC) as $st) {
            $pdo->prepare("INSERT INTO estadisticas_jugadores_ascenso (jugador_id, temporada, partidos_jugados, goles, asistencias, goles_cabeza, goles_tiro_libre, goles_penal, tarjetas_amarillas, tarjetas_rojas, minutos_jugados, goles_recibidos, vaya_invicta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
                ->execute([$newJugId, $st['temporada'] ?? '2025-2026', $st['partidos_jugados'] ?? 0, $st['goles'] ?? 0, $st['asistencias'] ?? 0, $st['goles_cabeza'] ?? 0, $st['goles_tiro_libre'] ?? 0, $st['goles_penal'] ?? 0, $st['tarjetas_amarillas'] ?? 0, $st['tarjetas_rojas'] ?? 0, $st['minutos_jugados'] ?? 0, $st['goles_recibidos'] ?? 0, $st['vaya_invicta'] ?? 0]);
        }
    }
    $log[] = "Segunda: {$eq['nombre']} migrado (ID viejo {$eq['id']} -> nuevo $newId)";
}

// Tercera -> Ascenso
$terceraEquipos = $pdo->query("SELECT * FROM equipos_tercera")->fetchAll(PDO::FETCH_ASSOC);
foreach ($terceraEquipos as $eq) {
    $stmt = $pdo->prepare("INSERT INTO equipos_ascenso (nombre, ciudad, estadio, logo, created_at, formacion) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$eq['nombre'], $eq['ciudad'] ?? null, $eq['estadio'] ?? null, $eq['logo'] ?? null, $eq['created_at'] ?? null, $eq['formacion'] ?? null]);
    $newId = $pdo->lastInsertId();
    $pdo->prepare("INSERT INTO tabla_posiciones_ascenso (equipo_id) VALUES (?)")->execute([$newId]);

    // Migrar jugadores
    $jugadores = $pdo->prepare("SELECT * FROM jugadores_tercera WHERE equipo_id = ?");
    $jugadores->execute([$eq['id']]);
    foreach ($jugadores->fetchAll(PDO::FETCH_ASSOC) as $j) {
        $pdo->prepare("INSERT INTO jugadores_ascenso (equipo_id, nombre, posicion, numero_camiseta, foto, edad, nacionalidad, fecha_creacion, posicion_x, posicion_y, es_titular) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            ->execute([$newId, $j['nombre'], $j['posicion'], $j['numero_camiseta'], $j['foto'], $j['edad'], $j['nacionalidad'], $j['fecha_creacion'] ?? null, $j['posicion_x'] ?? null, $j['posicion_y'] ?? null, $j['es_titular'] ?? 0]);
        $newJugId = $pdo->lastInsertId();
        // Migrar stats
        $stats = $pdo->prepare("SELECT * FROM estadisticas_jugadores_tercera WHERE jugador_id = ?");
        $stats->execute([$j['id']]);
        foreach ($stats->fetchAll(PDO::FETCH_ASSOC) as $st) {
            $pdo->prepare("INSERT INTO estadisticas_jugadores_ascenso (jugador_id, temporada, partidos_jugados, goles, asistencias, goles_cabeza, goles_tiro_libre, goles_penal, tarjetas_amarillas, tarjetas_rojas, minutos_jugados, goles_recibidos, vaya_invicta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
                ->execute([$newJugId, $st['temporada'] ?? '2025-2026', $st['partidos_jugados'] ?? 0, $st['goles'] ?? 0, $st['asistencias'] ?? 0, $st['goles_cabeza'] ?? 0, $st['goles_tiro_libre'] ?? 0, $st['goles_penal'] ?? 0, $st['tarjetas_amarillas'] ?? 0, $st['tarjetas_rojas'] ?? 0, $st['minutos_jugados'] ?? 0, $st['goles_recibidos'] ?? 0, $st['vaya_invicta'] ?? 0]);
        }
    }
    $log[] = "Tercera: {$eq['nombre']} migrado (ID viejo {$eq['id']} -> nuevo $newId)";
}

// Migrar partidos de Segunda
$partidosSegunda = $pdo->query("SELECT * FROM partidos_segunda")->fetchAll(PDO::FETCH_ASSOC);
foreach ($partidosSegunda as $p) {
    // Buscar los nuevos IDs de equipos por nombre
    $localOld = $pdo->prepare("SELECT nombre FROM equipos_segunda WHERE id = ?");
    $localOld->execute([$p['local_id']]);
    $localNombre = $localOld->fetchColumn();
    $visitOld = $pdo->prepare("SELECT nombre FROM equipos_segunda WHERE id = ?");
    $visitOld->execute([$p['visitante_id']]);
    $visitNombre = $visitOld->fetchColumn();

    if ($localNombre && $visitNombre) {
        $localNew = $pdo->prepare("SELECT id FROM equipos_ascenso WHERE nombre = ?");
        $localNew->execute([$localNombre]);
        $localNewId = $localNew->fetchColumn();
        $visitNew = $pdo->prepare("SELECT id FROM equipos_ascenso WHERE nombre = ?");
        $visitNew->execute([$visitNombre]);
        $visitNewId = $visitNew->fetchColumn();

        if ($localNewId && $visitNewId) {
            $pdo->prepare("INSERT INTO partidos_ascenso (local_id, visitante_id, goles_local, goles_visitante, fecha, hora, status, featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
                ->execute([$localNewId, $visitNewId, $p['goles_local'], $p['goles_visitante'], $p['fecha'], $p['hora'], $p['status'] ?? 'Pendiente', $p['featured'] ?? 0, $p['created_at'] ?? null]);
        }
    }
}

// Migrar partidos de Tercera
$partidosTercera = $pdo->query("SELECT * FROM partidos_tercera")->fetchAll(PDO::FETCH_ASSOC);
foreach ($partidosTercera as $p) {
    $localOld = $pdo->prepare("SELECT nombre FROM equipos_tercera WHERE id = ?");
    $localOld->execute([$p['local_id']]);
    $localNombre = $localOld->fetchColumn();
    $visitOld = $pdo->prepare("SELECT nombre FROM equipos_tercera WHERE id = ?");
    $visitOld->execute([$p['visitante_id']]);
    $visitNombre = $visitOld->fetchColumn();

    if ($localNombre && $visitNombre) {
        $localNew = $pdo->prepare("SELECT id FROM equipos_ascenso WHERE nombre = ?");
        $localNew->execute([$localNombre]);
        $localNewId = $localNew->fetchColumn();
        $visitNew = $pdo->prepare("SELECT id FROM equipos_ascenso WHERE nombre = ?");
        $visitNew->execute([$visitNombre]);
        $visitNewId = $visitNew->fetchColumn();

        if ($localNewId && $visitNewId) {
            $pdo->prepare("INSERT INTO partidos_ascenso (local_id, visitante_id, goles_local, goles_visitante, fecha, hora, status, featured, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
                ->execute([$localNewId, $visitNewId, $p['goles_local'], $p['goles_visitante'], $p['fecha'], $p['hora'], $p['status'] ?? 'Pendiente', $p['featured'] ?? 0, $p['created_at'] ?? null]);
        }
    }
}

echo json_enc(["success" => true, "log" => $log, "errors" => $errors]);
