<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain; charset=utf-8");

echo "=== DIAGNÓSTICO ===\n\n";

// 1. PHP funciona
echo "✓ PHP ejecutándose: " . phpversion() . "\n";

// 2. Prueba de conexión
 $host = '127.0.0.1';
 $dbname = 'numeros-y-futbol';
 $user = 'root';
 $pass = 'Info2026/*-';

echo "→ Intentando conectar a: mysql:host=$host;dbname=$dbname\n";
echo "→ Usuario: $user\n";
echo "→ Password: " . ($pass === '' ? '(vacía)' : '***') . "\n\n";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo "✓ Conexión EXITOSA\n\n";
} catch (PDOException $e) {
    echo "✗ ERROR DE CONEXIÓN: " . $e->getMessage() . "\n\n";
    
    // Probar sin especificar base de datos
    echo "→ Probando conexión SIN base de datos...\n";
    try {
        $pdo2 = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
        echo "✓ Conexión sin DB exitosa\n";
        echo "→ Bases de datos disponibles:\n";
        $dbs = $pdo2->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
        foreach ($dbs as $db) {
            echo "  - $db\n";
        }
    } catch (PDOException $e2) {
        echo "✗ También falló sin DB: " . $e2->getMessage() . "\n";
    }
    exit();
}

// 3. Verificar tablas
echo "→ Tablas en la base de datos:\n";
 $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
foreach ($tables as $table) {
    echo "  - $table\n";
}
echo "\n";

// 4. Verificar tabla_posiciones_segunda
if (in_array('tabla_posiciones_segunda', $tables)) {
    echo "✓ tabla_posiciones_segunda existe\n";
    $count = $pdo->query("SELECT COUNT(*) FROM tabla_posiciones_segunda")->fetchColumn();
    echo "  → $count registros\n";
    
    // Mostrar columnas
    $cols = $pdo->query("DESCRIBE tabla_posiciones_segunda")->fetchAll(PDO::FETCH_ASSOC);
    echo "  → Columnas: " . implode(", ", array_column($cols, 'Field')) . "\n";
} else {
    echo "✗ tabla_posiciones_segunda NO EXISTE\n";
}
echo "\n";

// 5. Verificar equipos_segunda
if (in_array('equipos_segunda', $tables)) {
    echo "✓ equipos_segunda existe\n";
    $count = $pdo->query("SELECT COUNT(*) FROM equipos_segunda")->fetchColumn();
    echo "  → $count registros\n";
} else {
    echo "✗ equipos_segunda NO EXISTE\n";
}
echo "\n";

// 6. Verificar partidos_segunda
if (in_array('partidos_segunda', $tables)) {
    echo "✓ partidos_segunda existe\n";
    $count = $pdo->query("SELECT COUNT(*) FROM partidos_segunda")->fetchColumn();
    echo "  → $count registros\n";
} else {
    echo "✗ partidos_segunda NO EXISTE (los endpoints de partidos devolverán vacío)\n";
}
echo "\n";

// 7. Probar consulta completa
echo "→ Probando consulta JOIN completa:\n";
try {
    $sql = "SELECT t.id, t.equipo_id, t.pj, t.pg, t.pe, t.pp, t.gf, t.gc, t.dg, t.pts, e.nombre, e.logo 
            FROM tabla_posiciones_segunda t 
            INNER JOIN equipos_segunda e ON t.equipo_id = e.id 
            ORDER BY t.pts DESC";
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();
    echo "✓ Consulta EXITOSA, " . count($rows) . " filas\n";
    if (count($rows) > 0) {
        echo "  → Primera fila: " . json_encode($rows[0], JSON_UNESCAPED_UNICODE) . "\n";
    }
} catch (PDOException $e) {
    echo "✗ ERROR en consulta: " . $e->getMessage() . "\n";
}

echo "\n=== FIN DIAGNÓSTICO ===";