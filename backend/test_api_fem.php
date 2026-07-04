<?php
$_SERVER['HTTP_ORIGIN'] = 'http://localhost:5173';
$_SERVER['REQUEST_METHOD'] = 'GET';

echo "=== API Pública - get_seleccion_detalle_femenina.php ===\n";

// Insert test data first
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pdo->exec("INSERT IGNORE INTO jugadores_seleccion_femenina (nombre, posicion, numero_camiseta, edad, club_origen) VALUES ('TEST_Publica', 'portero', 1, 25, 'Club Test')");
$pdo->exec("INSERT IGNORE INTO partidos_seleccion_femenina (rival_nombre, estado, fecha) VALUES ('TEST_Publico', 'Pendiente', NOW())");
$pdo->exec("INSERT IGNORE INTO cuerpo_tecnico_seleccion_femenina (nombre, rol) VALUES ('TEST_Staff', 'DT')");

ob_start();
require __DIR__ . '/get_seleccion_detalle_femenina.php';
$output = ob_get_clean();

$data = json_decode($output, true);
echo "Success: " . ($data['success'] ? 'SÍ' : 'NO') . "\n";
echo "Partidos: " . count($data['partidos'] ?? []) . "\n";
echo "Jugadoras: " . count($data['jugadores'] ?? []) . "\n";
echo "Staff: " . count($data['staff'] ?? []) . "\n";

echo "\nPrimer partido: " . json_encode(($data['partidos'][0] ?? null), JSON_UNESCAPED_UNICODE) . "\n";
echo "Primera jugadora: " . json_encode(($data['jugadores'][0] ?? null), JSON_UNESCAPED_UNICODE) . "\n";

// Cleanup
$pdo->exec("DELETE FROM jugadores_seleccion_femenina WHERE nombre = 'TEST_Publica'");
$pdo->exec("DELETE FROM partidos_seleccion_femenina WHERE rival_nombre = 'TEST_Publico'");
$pdo->exec("DELETE FROM cuerpo_tecnico_seleccion_femenina WHERE nombre = 'TEST_Staff'");
