<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$TABLA       = "jugadores_tercera";
$TABLA_EQ    = "equipos_tercera";
$TABLA_STATS = "estadisticas_jugadores_tercera";

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;
$action = $data['action'] ?? $_GET['action'] ?? "";

if ($_SERVER["REQUEST_METHOD"] === "GET" && !$action) {
    $equipo_id = (int)($_GET["equipo_id"] ?? 0);
    if (!$equipo_id) {
        echo json_enc(["success" => false, "error" => "ID de equipo requerido"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM $TABLA_EQ WHERE id = ?");
    $stmt->execute([$equipo_id]);
    $eq = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$eq) {
        echo json_enc(["success" => false, "error" => "Equipo no encontrado"]);
        exit;
    }

    $stmt2 = $conn->prepare("
        SELECT j.*,
            COALESCE(s.partidos_jugados, 0) AS pj,
            COALESCE(s.goles, 0) AS goles,
            COALESCE(s.asistencias, 0) AS asistencias,
            COALESCE(s.goles_penal, 0) AS goles_penal,
            COALESCE(s.goles_cabeza, 0) AS goles_cabeza,
            COALESCE(s.goles_tiro_libre, 0) AS goles_tiro_libre,
            COALESCE(s.tarjetas_amarillas, 0) AS tarjetas_amarillas,
            COALESCE(s.tarjetas_rojas, 0) AS tarjetas_rojas,
            COALESCE(s.minutos_jugados, 0) AS minutos_jugados,
            COALESCE(s.goles_recibidos, 0) AS goles_recibidos,
            COALESCE(s.vaya_invicta, 0) AS vaya_invicta,
            s.temporada
        FROM $TABLA j
        LEFT JOIN $TABLA_STATS s ON s.jugador_id = j.id AND s.temporada = '2025-2026'
        WHERE j.equipo_id = ?
        ORDER BY j.es_titular DESC, j.numero_camiseta ASC
    ");
    $stmt2->execute([$equipo_id]);
    $jugadores = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_enc(["success" => true, "equipo" => $eq, "jugadores" => $jugadores]);
    exit;
}

if ($action === "create") {
$equipo_id = (int)($data["equipo_id"] ?? 0);
    $nombre          = trim($data["nombre"] ?? "");
    $posicion        = trim($data["posicion"] ?? "centrodelantero");
    $numero_camiseta = $data["numero_camiseta"] !== "" ? (int)$data["numero_camiseta"] : null;
    $edad            = $data["edad"] !== "" ? (int)$data["edad"] : null;
    $nacionalidad    = trim($data["nacionalidad"] ?? "");
    $foto            = trim($data["foto"] ?? "");
    $es_titular      = (int)($data["es_titular"] ?? 0);

    if (!$equipo_id || !$nombre) {
        echo json_enc(["success" => false, "error" => "Equipo y nombre son obligatorios"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO $TABLA (equipo_id, nombre, posicion, numero_camiseta, foto, edad, nacionalidad, es_titular)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$equipo_id, $nombre, $posicion, $numero_camiseta, $foto, $edad, $nacionalidad, $es_titular]);

    $jugador_id = $conn->lastInsertId();
    $stmt2 = $conn->prepare("INSERT IGNORE INTO $TABLA_STATS (jugador_id, temporada) VALUES (?, '2025-2026')");
    $stmt2->execute([$jugador_id]);

    echo json_enc(["success" => true, "message" => "Jugador creado", "id" => $jugador_id]);
    exit;
}

if ($action === "update") {
    $id              = (int)($data["id"] ?? 0);
    $nombre          = trim($data["nombre"] ?? "");
    $posicion        = trim($data["posicion"] ?? "centrodelantero");
    $numero_camiseta = $data["numero_camiseta"] !== "" ? (int)$data["numero_camiseta"] : null;
    $edad            = $data["edad"] !== "" ? (int)$data["edad"] : null;
    $nacionalidad    = trim($data["nacionalidad"] ?? "");
    $foto            = trim($data["foto"] ?? "");
    $es_titular      = (int)($data["es_titular"] ?? 0);

    if (!$id || !$nombre) {
        echo json_enc(["success" => false, "error" => "ID y nombre son obligatorios"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE $TABLA SET nombre=?, posicion=?, numero_camiseta=?, foto=?, edad=?, nacionalidad=?, es_titular=? WHERE id=?");
    $stmt->execute([$nombre, $posicion, $numero_camiseta, $foto, $edad, $nacionalidad, $es_titular, $id]);

    echo json_enc(["success" => true, "message" => "Jugador actualizado"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE" || $action === "delete") {
    $id = (int)($_GET["id"] ?? $data["id"] ?? 0);
    if (!$id) {
        echo json_enc(["success" => false, "error" => "ID requerido"]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM $TABLA WHERE id = ?");
    $stmt->execute([$id]);

    echo json_enc(["success" => true, "message" => "Jugador eliminado"]);
    exit;
}

if ($action === "toggle_titular") {
    $id = (int)($data["id"] ?? 0);
    if (!$id) {
        echo json_enc(["success" => false, "error" => "ID requerido"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE $TABLA SET es_titular = IF(es_titular = 1, 0, 1) WHERE id = ?");
    $stmt->execute([$id]);

    echo json_enc(["success" => true, "message" => "Estado cambiado"]);
    exit;
}

if ($action === "update_stats") {
    $jugador_id        = (int)($data["jugador_id"] ?? 0);
    $temporada         = trim($data["temporada"] ?? "2025-2026");
    $pj                = (int)($data["pj"] ?? 0);
    $goles             = (int)($data["goles"] ?? 0);
    $asistencias       = (int)($data["asistencias"] ?? 0);
    $goles_penal       = (int)($data["goles_penal"] ?? 0);
    $goles_cabeza      = (int)($data["goles_cabeza"] ?? 0);
    $goles_tiro_libre  = (int)($data["goles_tiro_libre"] ?? 0);
    $tarjetas_amarillas = (int)($data["tarjetas_amarillas"] ?? 0);
    $tarjetas_rojas    = (int)($data["tarjetas_rojas"] ?? 0);
    $minutos_jugados   = (int)($data["minutos_jugados"] ?? 0);
    $goles_recibidos   = (int)($data["goles_recibidos"] ?? 0);
    $vaya_invicta      = (int)($data["vaya_invicta"] ?? 0);

    if (!$jugador_id) {
        echo json_enc(["success" => false, "error" => "ID de jugador requerido"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO $TABLA_STATS (jugador_id, temporada, partidos_jugados, goles, asistencias, goles_penal, goles_cabeza, goles_tiro_libre, tarjetas_amarillas, tarjetas_rojas, minutos_jugados, goles_recibidos, vaya_invicta)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            partidos_jugados=VALUES(partidos_jugados), goles=VALUES(goles), asistencias=VALUES(asistencias), goles_penal=VALUES(goles_penal), goles_cabeza=VALUES(goles_cabeza),
                            goles_tiro_libre=VALUES(goles_tiro_libre), tarjetas_amarillas=VALUES(tarjetas_amarillas), tarjetas_rojas=VALUES(tarjetas_rojas),
                            minutos_jugados=VALUES(minutos_jugados), goles_recibidos=VALUES(goles_recibidos), vaya_invicta=VALUES(vaya_invicta)");
    $stmt->execute([$jugador_id, $temporada, $pj, $goles, $asistencias, $goles_penal, $goles_cabeza, $goles_tiro_libre,
                    $tarjetas_amarillas, $tarjetas_rojas, $minutos_jugados, $goles_recibidos, $vaya_invicta]);

    echo json_enc(["success" => true, "message" => "Estadísticas actualizadas"]);
    exit;
}

if ($action === "save_formation") {
    $equipo_id = (int)($data["equipo_id"] ?? 0);
    $formacion = trim($data["formacion"] ?? "4-4-2");
    $titulares = json_decode($data["titulares"] ?? "[]", true);

    if (!$equipo_id) {
        echo json_enc(["success" => false, "error" => "ID de equipo requerido"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE $TABLA_EQ SET formacion = ? WHERE id = ?");
    $stmt->execute([$formacion, $equipo_id]);

    $stmt2 = $conn->prepare("UPDATE $TABLA SET es_titular = 0 WHERE equipo_id = ?");
    $stmt2->execute([$equipo_id]);

    $stmt3 = $conn->prepare("UPDATE $TABLA SET es_titular = 1, posicion_x = ?, posicion_y = ? WHERE id = ? AND equipo_id = ?");
    foreach ($titulares as $t) {
        $tid = (int)$t["id"];
        $px  = (float)$t["x"];
        $py  = (float)$t["y"];
        $stmt3->execute([$px, $py, $tid, $equipo_id]);
    }

    echo json_enc(["success" => true, "message" => "Formación guardada"]);
    exit;
}

echo json_enc(["success" => false, "error" => "Acción no válida"]);
