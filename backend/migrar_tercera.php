<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

try {
    $pdo->beginTransaction();

    // 1. Agregar columna grupo si no existe
    try { $pdo->exec("ALTER TABLE equipos_tercera ADD COLUMN `grupo` VARCHAR(50) DEFAULT NULL AFTER `estadio`"); }
    catch (Exception $e) { if (!str_contains($e->getMessage(), 'Duplicate column')) throw $e; }

    // 2. Limpiar dependencias en orden
    $pdo->exec("DELETE FROM estadisticas_jugadores_tercera");
    $pdo->exec("DELETE FROM jugadores_tercera");
    $pdo->exec("DELETE FROM tabla_posiciones_tercera");
    $pdo->exec("DELETE FROM equipos_tercera");
    $pdo->exec("ALTER TABLE equipos_tercera AUTO_INCREMENT = 1");

    // 3. Insertar los 32 equipos
    $equipos = [
        // ── Occidente A ──
        ['Municipal', 'Sonsonote', 'Occidente A'],
        ['Buenos Aires FC', 'Morazán', 'Occidente A'],
        ['UD Santos', 'La Libertad', 'Occidente A'],
        ['La Hachadura', 'Sonsonate', 'Occidente A'],
        ['AD Izalco', 'Sonsonate', 'Occidente A'],
        ['11 Municipal', 'Ahuachapán', 'Occidente A'],
        ['Juventud Candelareño', 'Santa Ana', 'Occidente A'],

        // ── Occidente B ──
        ['Marte Soyapango', 'San Salvador', 'Occidente B'],
        ['Academia BP', 'La Libertad', 'Occidente B'],
        ['Tenancingo', 'Cuscatlán', 'Occidente B'],
        ['Nacional Las Margaritas', 'La Libertad', 'Occidente B'],
        ['Vendaval', 'San Salvador', 'Occidente B'],
        ['Atlético Belén', 'San Salvador', 'Occidente B'],
        ['Brasilia FC', 'Cuscatlán', 'Occidente B'],
        ['Santo Tomás', 'Chalatenango', 'Occidente B'],

        // ── Oriente A ──
        ['CD Audaz', 'San Vicente', 'Oriente A'],
        ['Nonualco FC', 'La Paz', 'Oriente A'],
        ['Atlético Verapaz', 'San Vicente', 'Oriente A'],
        ['San Marcos', 'Usulután', 'Oriente A'],
        ['FORFUT', 'Cabañas', 'Oriente A'],
        ['CD El Roble', 'Cabañas', 'Oriente A'],
        ['CD El Vencedor', 'Usulután', 'Oriente A'],
        ['SESSA', 'San Vicente', 'Oriente A'],
        ['San Rafael Obrajuelo', 'San Salvador', 'Oriente A'],

        // ── Oriente B ──
        ['Sal Y Mar', 'La Unión', 'Oriente B'],
        ['Brasil FC', 'San Miguel', 'Oriente B'],
        ['Racing de Gualuca', 'San Miguel', 'Oriente B'],
        ['Real Sociedad', 'Morazán', 'Oriente B'],
        ['Estrellas del Sur', 'San Miguel', 'Oriente B'],
        ['CD Buenos Aires', 'Morazán', 'Oriente B'],
        ['Atlético San Simón', 'Morazán', 'Oriente B'],
        ['Vista Hermosa', 'Morazán', 'Oriente B'],
    ];

    $stmtEquipo = $pdo->prepare("INSERT INTO equipos_tercera (nombre, ciudad, grupo) VALUES (?, ?, ?)");
    $stmtPosiciones = $pdo->prepare("INSERT INTO tabla_posiciones_tercera (equipo_id) VALUES (?)");

    foreach ($equipos as $e) {
        $stmtEquipo->execute([$e[0], $e[1], $e[2]]);
        $equipoId = $pdo->lastInsertId();
        $stmtPosiciones->execute([$equipoId]);
    }

    $pdo->commit();

    echo json_enc([
        "success" => true,
        "message" => "Migración completada. " . count($equipos) . " equipos insertados."
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_enc([
        "success" => false,
        "error" => "Error en migración: " . $e->getMessage()
    ]);
}
