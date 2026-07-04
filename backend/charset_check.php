<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=UTF-8');

$dbName = env('DB_NAME', 'numeros-y-futbol');
$fix = isset($_GET['fix']) && $_GET['fix'] === '1';
$force = isset($_GET['force']) && $_GET['force'] === '1';

echo "=== REPARACIÓN DE CHARSET - Números y Fútbol ===\n\n";
echo "Base de datos: $dbName\n\n";

// ── 1. Verificar charset de la BD ──
$info = $pdo->query("SELECT @@character_set_database, @@collation_database")->fetch(PDO::FETCH_ASSOC);
echo "Charset DB: {$info['@@character_set_database']}\n";
echo "Collation DB: {$info['@@collation_database']}\n\n";

// ── 2. Verificar charset de tablas ──
echo "--- Charset de Tablas ---\n";
$tables = $pdo->query(
    "SELECT TABLE_NAME, TABLE_COLLATION FROM information_schema.TABLES 
     WHERE TABLE_SCHEMA = '$dbName' AND TABLE_TYPE = 'BASE TABLE' 
     ORDER BY TABLE_NAME"
)->fetchAll(PDO::FETCH_ASSOC);

$tablesToFix = [];
foreach ($tables as $t) {
    $ok = stripos($t['TABLE_COLLATION'], 'utf8') !== false;
    echo sprintf("  %-40s %-30s %s\n", $t['TABLE_NAME'], $t['TABLE_COLLATION'], $ok ? 'OK' : '➜ REPARAR');
    if (!$ok) $tablesToFix[] = $t['TABLE_NAME'];
}

// ── 3. Convertir tablas a utf8mb4 ──
if ($fix && count($tablesToFix) > 0) {
    echo "\n=== Convirtiendo tablas a utf8mb4 ===\n";
    foreach ($tablesToFix as $table) {
        echo "  $table ... ";
        try {
            $pdo->exec("ALTER TABLE `$table` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            echo "OK\n";
        } catch (Exception $e) {
            echo "ERROR: " . $e->getMessage() . "\n";
        }
    }
}

// ── 4. Detectar y reparar datos con doble encoding ──
echo "\n=== Datos con posible doble encoding ===\n";

$textCols = $pdo->query(
    "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
     FROM information_schema.COLUMNS 
     WHERE TABLE_SCHEMA = '$dbName' 
     AND DATA_TYPE IN ('varchar','char','text','mediumtext','longtext','tinytext')
     AND COLUMN_NAME NOT IN ('token','password','logo','foto','rival_logo')
     ORDER BY TABLE_NAME, COLUMN_NAME"
)->fetchAll(PDO::FETCH_ASSOC);

$repaired = 0;
$hasDoubleEncoding = [];

foreach ($textCols as $col) {
    $table = $col['TABLE_NAME'];
    $column = $col['COLUMN_NAME'];
    
    // Buscar patrones de doble encoding: Ã¡ Ã© Ã­ Ã³ Ãº Ã± Ã Ã etc.
    $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `$table` WHERE `$column` REGEXP 'Ã[¡-º]|Ã|Ã|Ã|Ã|Ã|Ã±|Â'");
    $count = $stmt->fetch(PDO::FETCH_ASSOC)['cnt'];
    
    if ($count > 0) {
        echo "  $table.$column: $count filas con doble encoding\n";
        $hasDoubleEncoding[] = ['table' => $table, 'column' => $column, 'count' => $count];
    }
}

if (count($hasDoubleEncoding) > 0 && $fix) {
    echo "\n=== Reparando doble encoding ===\n";
    foreach ($hasDoubleEncoding as $item) {
        $table = $item['table'];
        $column = $item['column'];
        echo "  $table.$column ... ";
        try {
            $sql = "UPDATE `$table` SET `$column` = CONVERT(CAST(CONVERT(`$column` USING latin1) AS BINARY) USING utf8mb4) 
                    WHERE `$column` REGEXP 'Ã[¡-º]|Ã|Ã|Ã|Ã|Ã|Ã±|Â'";
            $stmt = $pdo->exec($sql);
            echo "OK ($stmt filas)\n";
            $repaired += $stmt;
        } catch (Exception $e) {
            echo "ERROR: " . $e->getMessage() . "\n";
        }
    }
}

// ── 5. Detectar caracteres '?' (0x3F) en texto español ──
echo "\n=== Filas con caracteres '?' (posible corrupción irreversible) ===\n";

$pattern = '\\?';
$found = false;
foreach ($textCols as $col) {
    $table = $col['TABLE_NAME'];
    $column = $col['COLUMN_NAME'];
    
    try {
        $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `$table` WHERE `$column` LIKE '%n?%' OR `$column` LIKE '%t?%' OR `$column` LIKE '%l?%' OR `$column` LIKE '%r?%' OR `$column` LIKE '%s?%'");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['cnt'];
        if ($count > 0) {
            echo "  $table.$column: $count filas sospechosas\n";
            $found = true;
        }
    } catch (Exception $e) {}
}

if ($found) {
    echo "\n  ⚠ Estas filas tienen '?' literal (no recuperable). Deben corregirse manualmente.\n";
}

// ── Mostrar ejemplos ──
echo "\n=== Muestras de datos (primeras 3 tablas con texto) ===\n";
$shown = 0;
foreach ($textCols as $col) {
    if ($shown >= 5) break;
    $table = $col['TABLE_NAME'];
    $column = $col['COLUMN_NAME'];
    try {
        $stmt = $pdo->query("SELECT `$column` FROM `$table` WHERE `$column` IS NOT NULL AND `$column` != '' LIMIT 3");
        $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
        if (count($rows) > 0) {
            echo "  $table.$column:\n";
            foreach ($rows as $r) {
                echo "    → " . mb_substr($r, 0, 80) . "\n";
            }
            $shown++;
        }
    } catch (Exception $e) {}
}

// ── Resumen ──
echo "\n=== RESUMEN ===\n";
echo "Modo: " . ($fix ? "REPARACIÓN" : "DIAGNÓSTICO (usa ?fix=1 para reparar)") . "\n";
echo "Tablas con charset incorrecto: " . count($tablesToFix) . "\n";
echo "Columnas con doble encoding: " . count($hasDoubleEncoding) . "\n";
echo "Filas reparadas: $repaired\n";
echo "\n";

if (!$fix) {
    echo "Ejecuta con ?fix=1 para reparar charset de tablas y doble encoding.\n";
    echo "Ejecuta con ?fix=1&force=1 para forzar reparación incluso sin detectar problemas.\n";
}
