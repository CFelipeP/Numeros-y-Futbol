<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=numeros-y-futbol;charset=utf8mb4", "root", "Info2026/*-");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents("php://input"), true);
    $csvContent = $input['csv'] ?? '';

    if (!$csvContent) {
        echo json_encode(["success" => false, "message" => "No se proporcionó contenido CSV"]);
        exit;
    }

    // Eliminar BOM si existe
    if (substr($csvContent, 0, 3) === "\xEF\xBB\xBF") {
        $csvContent = substr($csvContent, 3);
    }

    $lines = explode("\n", trim($csvContent));
    if (count($lines) < 2) {
        echo json_encode(["success" => false, "message" => "CSV vacío o sin datos"]);
        exit;
    }

    $header = str_getcsv(trim(array_shift($lines)));
    $header = array_map('strtolower', array_map('trim', $header));

    $grupoIdx    = array_search('grupo', $header);
    $nombreIdx   = array_search('nombre', $header);
    if ($nombreIdx === false) $nombreIdx = array_search('equipo', $header);
    if ($nombreIdx === false) $nombreIdx = array_search('team', $header);
    $divisionIdx = array_search('division', $header);
    if ($divisionIdx === false) $divisionIdx = array_search('división', $header);
    if ($divisionIdx === false) $divisionIdx = array_search('div', $header);

    if ($grupoIdx === false || $nombreIdx === false) {
        echo json_encode(["success" => false, "message" => "CSV necesita columnas: Grupo, Nombre"]);
        exit;
    }

    $GROUPS = range('A', 'Z');
    $log = [];
    $importados = 0;

    $pdo->beginTransaction();

    foreach ($lines as $lineNum => $line) {
        $line = trim($line);
        if (empty($line)) continue;

        $row      = str_getcsv($line);
        $grupo    = strtoupper(trim($row[$grupoIdx] ?? ''));
        $nombre   = trim($row[$nombreIdx] ?? '');
        $division = trim($row[$divisionIdx] ?? '');

        if (!in_array($grupo, $GROUPS) || !$nombre) {
            $log[] = "❌ Fila " . ($lineNum + 2) . ": grupo inválido ($grupo)";
            continue;
        }

        $equipo_id   = null;
        $logo        = null;
        $foundNombre = $nombre;
        $matchMethod = "";

        /* ── Buscar en la tabla de la división correspondiente ── */
        if ($division) {
            $tabla = null;
            switch ($division) {
                case 'Primera':  $tabla = 'equipos'; break;
                case 'Segunda':  $tabla = 'equipos_segunda'; break;
                case 'Tercera':  $tabla = 'equipos_tercera'; break;
            }

            if ($tabla) {
                // Match exacto
                $stmt = $pdo->prepare("SELECT id, nombre, logo FROM `$tabla` WHERE TRIM(nombre) = :nombre LIMIT 1");
                $stmt->execute([':nombre' => $nombre]);
                $found = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($found) {
                    $equipo_id   = $found['id'];
                    $logo        = $found['logo'];
                    $foundNombre = $found['nombre'];
                    $matchMethod = "exacto+div";
                } else {
                    // Match parcial
                    $stmt2 = $pdo->prepare("SELECT id, nombre, logo FROM `$tabla` WHERE nombre LIKE :like LIMIT 1");
                    $stmt2->execute([':like' => '%' . $nombre . '%']);
                    $foundLike = $stmt2->fetch(PDO::FETCH_ASSOC);
                    if ($foundLike) {
                        $equipo_id   = $foundLike['id'];
                        $logo        = $foundLike['logo'];
                        $foundNombre = $foundLike['nombre'];
                        $matchMethod = "parcial+div";
                    }
                }
            }
        }

        /* ── Sin división: buscar en todas las tablas ── */
        if (!$equipo_id) {
            $searchTables = [
                ['table' => 'equipos',          'division' => 'Primera'],
                ['table' => 'equipos_segunda',   'division' => 'Segunda'],
                ['table' => 'equipos_tercera',   'division' => 'Tercera'],
            ];
            foreach ($searchTables as $st) {
                $stmt = $pdo->prepare("SELECT id, nombre, logo FROM `{$st['table']}` WHERE TRIM(nombre) = :nombre LIMIT 1");
                $stmt->execute([':nombre' => $nombre]);
                $found = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($found) {
                    $equipo_id   = $found['id'];
                    $logo        = $found['logo'];
                    $foundNombre = $found['nombre'];
                    $division    = $st['division'];
                    $matchMethod = "exacto";
                    break;
                }
            }
        }

        if (!$equipo_id) {
            $log[] = "⚠️ \"$nombre\"" . ($division ? " ($division)" : "") . " no encontrado en BD";
            continue;
        }

        /* ── Insertar/actualizar en equipos_copa ── */
        $stmtInsert = $pdo->prepare("
            INSERT INTO equipos_copa (equipo_id, division, nombre, logo, grupo, activo)
            VALUES (:equipo_id, :division, :nombre, :logo, :grupo, 1)
            ON DUPLICATE KEY UPDATE 
                nombre = VALUES(nombre),
                logo   = VALUES(logo),
                grupo  = VALUES(grupo),
                activo = 1
        ");

        $ok = $stmtInsert->execute([
            ':equipo_id' => $equipo_id,
            ':division'  => $division,
            ':nombre'    => $foundNombre,
            ':logo'      => $logo,
            ':grupo'     => $grupo
        ]);

        if ($ok) {
            $importados++;
            $log[] = "✅ \"$nombre\" → Grupo $grupo [$matchMethod]";
        } else {
            $log[] = "❌ \"$nombre\" → Error al guardar en equipos_copa";
        }
    }

    $pdo->commit();

    echo json_encode([
        "success"      => true,
        "importados"   => $importados,
        "total_lineas" => count($lines),
        "log"          => $log
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}