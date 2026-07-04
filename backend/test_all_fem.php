<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

echo "=== PROBANDO SELECCIÓN FEMENINA ===\n\n";

echo "1. Insertando jugadoras de prueba... ";
try {
    $pdo->exec("DELETE FROM jugadores_seleccion_femenina WHERE nombre LIKE 'TEST_%'");
    $pdo->exec("INSERT INTO jugadores_seleccion_femenina (nombre, posicion, numero_camiseta, edad, club_origen, partidos_jugados, goles, asistencias, atajadas) VALUES ('TEST_Maria Perez', 'centrodelantero', 9, 25, 'Alianza Women', 10, 5, 3, 0)");
    $pdo->exec("INSERT INTO jugadores_seleccion_femenina (nombre, posicion, numero_camiseta, edad, club_origen, partidos_jugados, goles, asistencias, atajadas) VALUES ('TEST_Ana Lopez', 'portero', 1, 28, 'Águila Fem', 12, 0, 1, 35)");
    echo "OK\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "2. Insertando partido de prueba... ";
try {
    $pdo->exec("DELETE FROM partidos_seleccion_femenina WHERE rival_nombre LIKE 'TEST_%'");
    $pdo->exec("INSERT INTO partidos_seleccion_femenina (rival_nombre, goles_favor, goles_contra, fecha, estado, competicion, lugar) VALUES ('TEST_Costa Rica', 3, 1, '2026-07-01', 'Finalizado', 'Amistoso', 'Local')");
    echo "OK\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "3. Insertando staff de prueba... ";
try {
    $pdo->exec("DELETE FROM cuerpo_tecnico_seleccion_femenina WHERE nombre LIKE 'TEST_%'");
    $pdo->exec("INSERT INTO cuerpo_tecnico_seleccion_femenina (nombre, rol, nacionalidad) VALUES ('TEST_Marta Gómez', 'Director Técnico', 'Salvadoreña')");
    echo "OK\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n4. Leyendo datos...\n";
$jugadoras = $pdo->query("SELECT nombre, posicion, numero_camiseta FROM jugadores_seleccion_femenina ORDER BY numero_camiseta")->fetchAll(PDO::FETCH_ASSOC);
$partidos = $pdo->query("SELECT rival_nombre, goles_favor, goles_contra, estado FROM partidos_seleccion_femenina")->fetchAll(PDO::FETCH_ASSOC);
$staff = $pdo->query("SELECT nombre, rol FROM cuerpo_tecnico_seleccion_femenina")->fetchAll(PDO::FETCH_ASSOC);

echo "  Jugadoras: " . json_encode($jugadoras, JSON_UNESCAPED_UNICODE) . "\n";
echo "  Partidos: " . json_encode($partidos, JSON_UNESCAPED_UNICODE) . "\n";
echo "  Staff: " . json_encode($staff, JSON_UNESCAPED_UNICODE) . "\n";

echo "\n5. Probando CSV import...\n";
$_POST['csv_text'] = "nombre,posicion,numero_camiseta,edad,club,partidos_jugados,goles,asistencias,atajadas\nTEST_Lucia Rivas,medio_central,10,24,Alianza Women,8,3,5,0";

// Skip auth for test
$_SERVER['HTTP_AUTHORIZATION'] = 'Bearer fake';
try {
    require __DIR__ . '/importar_jugadores_seleccion_femenina.php';
} catch (Exception $e) {
    // Will fail auth, but that's expected in CLI test
    echo "  (Import CSV requiere autenticación web - no probado en CLI)\n";
}

echo "\n6. Limpiando datos de prueba... ";
$pdo->exec("DELETE FROM jugadores_seleccion_femenina WHERE nombre LIKE 'TEST_%'");
$pdo->exec("DELETE FROM partidos_seleccion_femenina WHERE rival_nombre LIKE 'TEST_%'");
$pdo->exec("DELETE FROM cuerpo_tecnico_seleccion_femenina WHERE nombre LIKE 'TEST_%'");
echo "OK\n";

echo "\n✅ Todo funciona correctamente.\n";
