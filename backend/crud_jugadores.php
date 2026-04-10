<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

 $method = $_SERVER['REQUEST_METHOD'];

// ✅ NUEVO: Leer datos POST ya sea JSON o form-urlencoded
if ($method === 'POST') {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($contentType, 'application/json') !== false) {
        $data = json_decode(file_get_contents("php://input"), true);
    } else {
        $data = $_POST;
    }
} else {
    $data = null;
}

// ============================================================
// GET — Obtener plantilla de un equipo
// ============================================================
if ($method === 'GET') {
    $equipo_id = isset($_GET['equipo_id']) ? (int)$_GET['equipo_id'] : 0;

    if ($equipo_id <= 0) {
        echo json_encode(["success" => false, "error" => "equipo_id requerido"]);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM equipos WHERE id = ?");
    $stmt->execute([$equipo_id]);
    $equipo = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$equipo) {
        echo json_encode(["success" => false, "error" => "Equipo no encontrado"]);
        exit();
    }

    $sql = "
        SELECT 
            j.*,
            est.id AS stats_id,
            est.partidos_jugados AS pj,
            est.goles,
            est.asistencias,
            est.goles_cabeza,
            est.goles_tiro_libre,
            est.goles_penal,
            est.tarjetas_amarillas,
            est.tarjetas_rojas,
            est.minutos_jugados,
            est.goles_recibidos,
            est.vaya_invicta,
            est.temporada
        FROM jugadores j
        LEFT JOIN estadisticas_jugadores est 
            ON est.jugador_id = j.id AND est.temporada = '2025-2026'
        WHERE j.equipo_id = ?
        ORDER BY 
            CASE j.posicion
                WHEN 'portero' THEN 1
                WHEN 'defensa' THEN 2
                WHEN 'medio' THEN 3
                WHEN 'delantero' THEN 4
            END,
            j.numero_camiseta ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$equipo_id]);
    $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "equipo" => $equipo,
        "jugadores" => $jugadores
    ]);
    exit();
}

// ============================================================
// POST — Crear / Editar jugador y estadísticas
// ============================================================
if ($method === 'POST') {

    if (!$data || !isset($data['action'])) {
        echo json_encode(["success" => false, "error" => "Acción no especificada"]);
        exit();
    }

    // ---------- CREAR JUGADOR ----------
    if ($data['action'] === 'create') {
        $required = ['equipo_id', 'nombre', 'posicion'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                echo json_encode(["success" => false, "error" => "Falta el campo: $field"]);
                exit();
            }
        }

        if (!in_array($data['posicion'], ['portero', 'defensa', 'medio', 'delantero'])) {
            echo json_encode(["success" => false, "error" => "Posición inválida"]);
            exit();
        }

        $stmt = $pdo->prepare("
            INSERT INTO jugadores (equipo_id, nombre, posicion, numero_camiseta, foto, edad, nacionalidad)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['equipo_id'],
            $data['nombre'],
            $data['posicion'],
            !empty($data['numero_camiseta']) ? (int)$data['numero_camiseta'] : null,
            !empty($data['foto']) ? $data['foto'] : null,
            !empty($data['edad']) ? (int)$data['edad'] : null,
            !empty($data['nacionalidad']) ? $data['nacionalidad'] : null,
        ]);

        $jugador_id = $pdo->lastInsertId();

        $stmt = $pdo->prepare("
            INSERT INTO estadisticas_jugadores (jugador_id, temporada) VALUES (?, '2025-2026')
        ");
        $stmt->execute([$jugador_id]);

        echo json_encode(["success" => true, "id" => $jugador_id, "message" => "Jugador creado"]);
        exit();
    }

    // ---------- EDITAR DATOS DEL JUGADOR ----------
    if ($data['action'] === 'update') {
        if (empty($data['id'])) {
            echo json_encode(["success" => false, "error" => "ID requerido"]);
            exit();
        }

        if (!in_array($data['posicion'], ['portero', 'defensa', 'medio', 'delantero'])) {
            echo json_encode(["success" => false, "error" => "Posición inválida"]);
            exit();
        }

        $stmt = $pdo->prepare("
            UPDATE jugadores 
            SET nombre = ?, posicion = ?, numero_camiseta = ?, foto = ?, edad = ?, nacionalidad = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $data['nombre'],
            $data['posicion'],
            !empty($data['numero_camiseta']) ? (int)$data['numero_camiseta'] : null,
            !empty($data['foto']) ? $data['foto'] : null,
            !empty($data['edad']) ? (int)$data['edad'] : null,
            !empty($data['nacionalidad']) ? $data['nacionalidad'] : null,
            (int)$data['id'],
        ]);

        echo json_encode(["success" => true, "message" => "Jugador actualizado"]);
        exit();
    }

    // ---------- EDITAR ESTADÍSTICAS ----------
    if ($data['action'] === 'update_stats') {
        if (empty($data['jugador_id'])) {
            echo json_encode(["success" => false, "error" => "jugador_id requerido"]);
            exit();
        }

        $jid = (int)$data['jugador_id'];
        $temporada = !empty($data['temporada']) ? $data['temporada'] : '2025-2026';

        $stmt = $pdo->prepare("
            SELECT id FROM estadisticas_jugadores 
            WHERE jugador_id = ? AND temporada = ?
        ");
        $stmt->execute([$jid, $temporada]);
        $exists = $stmt->fetch(PDO::FETCH_ASSOC);

        $campos = [
            'partidos_jugados' => 'pj',
            'goles' => 'goles',
            'asistencias' => 'asistencias',
            'goles_cabeza' => 'goles_cabeza',
            'goles_tiro_libre' => 'goles_tiro_libre',
            'goles_penal' => 'goles_penal',
            'tarjetas_amarillas' => 'tarjetas_amarillas',
            'tarjetas_rojas' => 'tarjetas_rojas',
            'minutos_jugados' => 'minutos_jugados',
            'goles_recibidos' => 'goles_recibidos',
            'vaya_invicta' => 'vaya_invicta',
        ];

        $valores = [];
        $placeholders = [];
        foreach ($campos as $db_col => $post_key) {
            $valores[] = isset($data[$post_key]) ? (int)$data[$post_key] : 0;
            $placeholders[] = "$db_col = ?";
        }

        if ($exists) {
            $sql = "UPDATE estadisticas_jugadores SET " . implode(", ", $placeholders) . " WHERE jugador_id = ? AND temporada = ?";
            $valores[] = $jid;
            $valores[] = $temporada;
        } else {
            $sql = "INSERT INTO estadisticas_jugadores (jugador_id, temporada, " . implode(", ", array_keys($campos)) . ") VALUES (?, ?, " . implode(", ", array_fill(0, count($campos), "?")) . ")";
            array_unshift($valores, $jid);
            array_unshift($valores, $temporada);
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($valores);

        echo json_encode(["success" => true, "message" => "Estadísticas actualizadas"]);
        exit();
    }

    // ✅ NUEVO: TOGGLE TITULAR / SUPLENTE
    if ($data['action'] === 'toggle_titular') {
        $id = (int)$data['id'];
        if ($id <= 0) {
            echo json_encode(["success" => false, "error" => "ID requerido"]);
            exit();
        }
        $stmt = $pdo->prepare("UPDATE jugadores SET es_titular = IF(es_titular = 1, 0, 1) WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
        exit();
    }

    // ✅ NUEVO: GUARDAR FORMACIÓN COMPLETA
    if ($data['action'] === 'save_formation') {
        $equipo_id = (int)$data['equipo_id'];
        $formacion = preg_replace('/[^0-9\-]/', '', $data['formacion']);
        $titulares = json_decode($data['titulares'], true);

        if (!$equipo_id || !$formacion) {
            echo json_encode(["success" => false, "error" => "Datos incompletos"]);
            exit();
        }

        // Guardar formación en el equipo
        $stmt = $pdo->prepare("UPDATE equipos SET formacion = ? WHERE id = ?");
        $stmt->execute([$formacion, $equipo_id]);

        // Resetear todos a suplente y sin posición
        $stmt = $pdo->prepare("UPDATE jugadores SET es_titular = 0, posicion_x = NULL, posicion_y = NULL WHERE equipo_id = ?");
        $stmt->execute([$equipo_id]);

        // Asignar titulares con sus posiciones
        if (is_array($titulares) && count($titulares) > 0) {
            $stmt = $pdo->prepare("UPDATE jugadores SET es_titular = 1, posicion_x = ?, posicion_y = ? WHERE id = ? AND equipo_id = ?");
            foreach ($titulares as $t) {
                $jid = (int)$t['id'];
                $jx  = floatval($t['x']);
                $jy  = floatval($t['y']);
                $stmt->execute([$jx, $jy, $jid, $equipo_id]);
            }
        }

        echo json_encode(["success" => true, "message" => "Formación guardada"]);
        exit();
    }

    echo json_encode(["success" => false, "error" => "Acción no reconocida"]);
    exit();
}

// ============================================================
// DELETE — Eliminar jugador
// ============================================================
if ($method === 'DELETE') {
    $jugador_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($jugador_id <= 0) {
        echo json_encode(["success" => false, "error" => "ID requerido"]);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM jugadores WHERE id = ?");
    $stmt->execute([$jugador_id]);

    echo json_encode(["success" => true, "message" => "Jugador eliminado"]);
    exit();
}

echo json_encode(["success" => false, "error" => "Método no permitido"]);