<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

 $conexion = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
if ($conexion->connect_error) {
    echo json_encode(["success" => false, "error" => "Error de conexión: " . $conexion->connect_error]);
    exit;
}
 $conexion->set_charset("utf8mb4");

 $TABLA       = "jugadores_tercera";
 $TABLA_EQ    = "equipos_tercera";
 $TABLA_STATS = "estadisticas_jugadores_tercera";

 $action = $_POST["action"] ?? $_GET["action"] ?? "";

if ($_SERVER["REQUEST_METHOD"] === "GET" && !$action) {
    $equipo_id = intval($_GET["equipo_id"] ?? 0);
    if (!$equipo_id) {
        echo json_encode(["success" => false, "error" => "ID de equipo requerido"]);
        exit;
    }

    $eq = $conexion->query("SELECT * FROM $TABLA_EQ WHERE id = $equipo_id")->fetch_assoc();
    if (!$eq) {
        echo json_encode(["success" => false, "error" => "Equipo no encontrado"]);
        exit;
    }

    $res = $conexion->query("
        SELECT j.*,
            COALESCE(s.pj, 0) AS pj,
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
        WHERE j.equipo_id = $equipo_id
        ORDER BY j.es_titular DESC, j.numero_camiseta ASC
    ");

    $jugadores = [];
    while ($row = $res->fetch_assoc()) {
        $jugadores[] = $row;
    }

    echo json_encode(["success" => true, "equipo" => $eq, "jugadores" => $jugadores]);
    $conexion->close();
    exit;
}

if ($action === "create") {
    $equipo_id      = intval($_POST["equipo_id"] ?? 0);
    $nombre         = trim($_POST["nombre"] ?? "");
    $posicion       = trim($_POST["posicion"] ?? "centrodelantero");
    $numero_camiseta = $_POST["numero_camiseta"] !== "" ? intval($_POST["numero_camiseta"]) : "NULL";
    $edad           = $_POST["edad"] !== "" ? intval($_POST["edad"]) : "NULL";
    $nacionalidad   = trim($_POST["nacionalidad"] ?? "");
    $foto           = trim($_POST["foto"] ?? "");
    $es_titular     = intval($_POST["es_titular"] ?? 0);

    if (!$equipo_id || !$nombre) {
        echo json_encode(["success" => false, "error" => "Equipo y nombre son obligatorios"]);
        exit;
    }

    $sql = "INSERT INTO $TABLA (equipo_id, nombre, posicion, numero_camiseta, foto, edad, nacionalidad, es_titular)
            VALUES ($equipo_id, ?, ?, $numero_camiseta, ?, $edad, ?, $es_titular)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("sssss", $nombre, $posicion, $foto, $nacionalidad, $nacionalidad);

    if ($stmt->execute()) {
        $jugador_id = $conexion->insert_id;
        $conexion->query("INSERT IGNORE INTO $TABLA_STATS (jugador_id, temporada) VALUES ($jugador_id, '2025-2026')");
        echo json_encode(["success" => true, "message" => "Jugador creado", "id" => $jugador_id]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al crear: " . $stmt->error]);
    }
    $stmt->close();
    $conexion->close();
    exit;
}

if ($action === "update") {
    $id             = intval($_POST["id"] ?? 0);
    $nombre         = trim($_POST["nombre"] ?? "");
    $posicion       = trim($_POST["posicion"] ?? "centrodelantero");
    $numero_camiseta = $_POST["numero_camiseta"] !== "" ? intval($_POST["numero_camiseta"]) : "NULL";
    $edad           = $_POST["edad"] !== "" ? intval($_POST["edad"]) : "NULL";
    $nacionalidad   = trim($_POST["nacionalidad"] ?? "");
    $foto           = trim($_POST["foto"] ?? "");
    $es_titular     = intval($_POST["es_titular"] ?? 0);

    if (!$id || !$nombre) {
        echo json_encode(["success" => false, "error" => "ID y nombre son obligatorios"]);
        exit;
    }

    $sql = "UPDATE $TABLA SET nombre=?, posicion=?, numero_camiseta=$numero_camiseta, foto=?, edad=$edad, nacionalidad=?, es_titular=$es_titular WHERE id=$id";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("sssss", $nombre, $posicion, $foto, $nacionalidad, $nacionalidad);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Jugador actualizado"]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al actualizar: " . $stmt->error]);
    }
    $stmt->close();
    $conexion->close();
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE" || $action === "delete") {
    $id = intval($_GET["id"] ?? $_POST["id"] ?? 0);
    if (!$id) {
        echo json_encode(["success" => false, "error" => "ID requerido"]);
        exit;
    }
    if ($conexion->query("DELETE FROM $TABLA WHERE id = $id")) {
        echo json_encode(["success" => true, "message" => "Jugador eliminado"]);
    } else {
        echo json_encode(["success" => false, "error" => "Error al eliminar"]);
    }
    $conexion->close();
    exit;
}

if ($action === "toggle_titular") {
    $id = intval($_POST["id"] ?? 0);
    if (!$id) {
        echo json_encode(["success" => false, "error" => "ID requerido"]);
        exit;
    }
    $conexion->query("UPDATE $TABLA SET es_titular = IF(es_titular = 1, 0, 1) WHERE id = $id");
    echo json_encode(["success" => true, "message" => "Estado cambiado"]);
    $conexion->close();
    exit;
}

if ($action === "update_stats") {
    $jugador_id       = intval($_POST["jugador_id"] ?? 0);
    $temporada        = trim($_POST["temporada"] ?? "2025-2026");
    $pj               = intval($_POST["pj"] ?? 0);
    $goles            = intval($_POST["goles"] ?? 0);
    $asistencias      = intval($_POST["asistencias"] ?? 0);
    $goles_penal      = intval($_POST["goles_penal"] ?? 0);
    $goles_cabeza     = intval($_POST["goles_cabeza"] ?? 0);
    $goles_tiro_libre = intval($_POST["goles_tiro_libre"] ?? 0);
    $tarjetas_amarillas = intval($_POST["tarjetas_amarillas"] ?? 0);
    $tarjetas_rojas   = intval($_POST["tarjetas_rojas"] ?? 0);
    $minutos_jugados  = intval($_POST["minutos_jugados"] ?? 0);
    $goles_recibidos  = intval($_POST["goles_recibidos"] ?? 0);
    $vaya_invicta     = intval($_POST["vaya_invicta"] ?? 0);

    if (!$jugador_id) {
        echo json_encode(["success" => false, "error" => "ID de jugador requerido"]);
        exit;
    }

    $sql = "INSERT INTO $TABLA_STATS (jugador_id, temporada, pj, goles, asistencias, goles_penal, goles_cabeza, goles_tiro_libre, tarjetas_amarillas, tarjetas_rojas, minutos_jugados, goles_recibidos, vaya_invicta)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            pj=?, goles=?, asistencias=?, goles_penal=?, goles_cabeza=?, goles_tiro_libre=?, tarjetas_amarillas=?, tarjetas_rojas=?, minutos_jugados=?, goles_recibidos=?, vaya_invicta=?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("isiiiiiiiiiiiiiiiiiii",
        $jugador_id, $temporada, $pj, $goles, $asistencias, $goles_penal, $goles_cabeza, $goles_tiro_libre, $tarjetas_amarillas, $tarjetas_rojas, $minutos_jugados, $goles_recibidos, $vaya_invicta,
        $pj, $goles, $asistencias, $goles_penal, $goles_cabeza, $goles_tiro_libre, $tarjetas_amarillas, $tarjetas_rojas, $minutos_jugados, $goles_recibidos, $vaya_invicta
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Estadísticas actualizadas"]);
    } else {
        echo json_encode(["success" => false, "error" => "Error: " . $stmt->error]);
    }
    $stmt->close();
    $conexion->close();
    exit;
}

if ($action === "save_formation") {
    $equipo_id = intval($_POST["equipo_id"] ?? 0);
    $formacion = trim($_POST["formacion"] ?? "4-4-2");
    $titulares = json_decode($_POST["titulares"] ?? "[]", true);

    if (!$equipo_id) {
        echo json_encode(["success" => false, "error" => "ID de equipo requerido"]);
        exit;
    }

    $conexion->query("UPDATE $TABLA_EQ SET formacion = '$formacion' WHERE id = $equipo_id");
    $conexion->query("UPDATE $TABLA SET es_titular = 0 WHERE equipo_id = $equipo_id");

    foreach ($titulares as $t) {
        $tid = intval($t["id"]);
        $px  = floatval($t["x"]);
        $py  = floatval($t["y"]);
        $conexion->query("UPDATE $TABLA SET es_titular = 1, posicion_x = $px, posicion_y = $py WHERE id = $tid AND equipo_id = $equipo_id");
    }

    echo json_encode(["success" => true, "message" => "Formación guardada"]);
    $conexion->close();
    exit;
}

echo json_encode(["success" => false, "error" => "Acción no válida"]);
 $conexion->close();