<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

header('Content-Type: text/plain; charset=UTF-8');

echo "=== REPARACIÓN DE DATOS CORRUPTOS ===\n\n";

// ── Diccionario de reemplazos conocidos ──
$replacements = [
    // Letras con tilde (contexto español)
    '?n' => ['án', 'ón', 'ín', 'én', 'ún'],
    '?a' => ['á'],
    '?e' => ['é'],
    '?i' => ['í'],
    '?o' => ['ó'],
    '?u' => ['ú'],
    '?N' => ['ÁN', 'ÓN', 'ÍN', 'ÉN', 'ÚN'],
    '?A' => ['Á'],
    '?E' => ['É'],
    '?I' => ['Í'],
    '?O' => ['Ó'],
    '?U' => ['Ú'],
    '?s' => ['ás', 'ós', 'ís', 'és', 'ús'],
    '?r' => ['ár', 'ór', 'ír', 'ér', 'úr'],
    '?l' => ['ál', 'ól', 'íl', 'él', 'úl'],
    '?t' => ['át', 'ót', 'ít', 'ét', 'út'],
    '?d' => ['ád', 'ód', 'íd', 'éd', 'úd'],
    '?c' => ['ác', 'óc', 'íc', 'éc', 'úc'],
    '?m' => ['ám', 'óm', 'ím', 'ém', 'úm'],
    '?p' => ['áp', 'óp', 'íp', 'ép', 'úp'],
    '?z' => ['áz', 'óz', 'íz', 'éz', 'úz'],
    '?b' => ['áb', 'ób', 'íb', 'éb', 'úb'],
    '?g' => ['ág', 'óg', 'íg', 'ég', 'úg'],
    '?y' => ['áy', 'óy', 'íy', 'éy', 'úy'],
    '?v' => ['áv', 'óv', 'ív', 'év', 'úv'],
];

// ── Patrones de nombres conocidos ──
$knownFixes = [
    // Ciudades
    'Usulut?n' => 'Usulután',
    'Metap?n' => 'Metapán',
    'Moraz?n' => 'Morazán',
    'Ahuachap?n' => 'Ahuachapán',
    'La Uni?n' => 'La Unión',
    'Cant?n El Brazo' => 'Cantón El Brazo',
    'Cant?n Entre R?os' => 'Cantón Entre Ríos',
    'Cant?n' => 'Cantón',
    'San Juli?n' => 'San Julián',
    'Caba?as' => 'Cabañas',
    
    // Estadios
    'Estadio Cuscatl?n' => 'Estadio Cuscatlán',
    ' Estadio Cuscatl?n' => ' Estadio Cuscatlán',
    'Canchas del Estadio Cuscatl?n' => 'Canchas del Estadio Cuscatlán',
    'Te?filo' => 'Teófilo',
    'L?pez' => 'López',
    'Sime?n' => 'Simeón',
    'S?per' => 'Súper',
    
    // Nombres de persona
    'Ram?n' => 'Ramón',
    'Joaqu?n' => 'Joaquín',
    'Sebasti?n' => 'Sebastián',
    'Germ?n' => 'Germán',
    'Mart?n' => 'Martín',
    'Rodr?guez' => 'Rodríguez',
    'Mart?n' => 'Martín',
    'Sim?n' => 'Simón',
    '?scar' => 'Óscar',
    'Lime?o' => 'Limeño',
    'Drag?n' => 'Dragón',
    
    // Apellidos
    'Berr?os' => 'Berríos',
    'Su?rez' => 'Suárez',
    'Guti?rrez' => 'Gutiérrez',
    'Mart?nez' => 'Martínez',
    'Maga?a' => 'Magaña',
    'Quite?o' => 'Quiteño',
    'Mu?oz' => 'Muñoz',
    
    // Palabras comunes
    'f?tbol' => 'fútbol',
    'F?tbol' => 'Fútbol',
    'salvadore?o' => 'salvadoreño',
    'Salvadore?a' => 'Salvadoreña',
    'Salvadore?o' => 'Salvadoreño',
    'Salvadore?o' => 'Salvadoreño',
    'Selecci?n' => 'Selección',
    'jerarqu?a' => 'jerarquía',
    'actuaci?n' => 'actuación',
    'm?nima' => 'mínima',
    'el?ctrico' => 'eléctrico',
    'el?ctrico' => 'eléctrico',
    'electrizante' => 'electrizante',
    'aut?ntico' => 'auténtico',
    'm?nimo' => 'mínimo',
    'm?ximo' => 'máximo',
    'pr?ximo' => 'próximo',
    's?lo' => 'sólo',
    'r?pido' => 'rápido',
    'p?blico' => 'público',
    'qued?' => 'quedó',
    'firm?' => 'firmó',
    'logr?' => 'logró',
    '?guila' => 'Águila',
    '?frica' => 'África',
    't?ctica' => 'táctica',
    't?ctico' => 'táctico',
    'cl?sico' => 'clásico',
    'hist?rico' => 'histórico',
    'el?ctrico' => 'eléctrico',
    'pol?mica' => 'polémica',
    'd?a' => 'día',
    'pa?s' => 'país',
    't?tulo' => 'título',
    'm?s' => 'más',
    'tambi?n' => 'también',
    'despu?s' => 'después',
    're?ne' => 'reúne',
    're?nen' => 'reúnen',
    're?n' => 'reún',
    'por qu?' => 'por qué',
    'Por qu?' => 'Por qué',
    
    // Palabras con ñ
    'ma?ana' => 'mañana',
    'a?o' => 'año',
    'a?os' => 'años',
    'compa??a' => 'compañía',
    'campe?n' => 'campeón',
    'selecci?n' => 'selección',
    'posici?n' => 'posición',
    'formaci?n' => 'formación',
    'informaci?n' => 'información',
    'situaci?n' => 'situación',
    'generaci?n' => 'generación',
    'competici?n' => 'competición',
    'Recuperaci?n' => 'Recuperación',
    'Contrase?a' => 'Contraseña',
    'contrase?a' => 'contraseña',
    'correo electr?nico' => 'correo electrónico',
    'Correo electr?nico' => 'Correo electrónico',
    
    // Otras
    'N?meros' => 'Números',
    'n?meros' => 'números',
    'n?mero' => 'número',
    'Últimas' => 'Últimas',
    '?ltimas' => 'últimas',
    'últimas' => 'últimas',
    'M?xico' => 'México',
    'Am?rica' => 'América',
    'Águila' => 'Águila',
    'C.D. ?guila' => 'C.D. Águila',
    'H?rcules' => 'Hércules',
    'Dr?' => 'Dr.',
    'Jos?' => 'José',
    'Brasile?o' => 'Brasileño',
    'brasile?o' => 'brasileño',
    'Hondure?o' => 'Hondureño',
    'hondure?o' => 'hondureño',
    'Portugu?s' => 'Portugués',
    'nicarag?ense' => 'nicaragüense',
    'Nicarag?ense' => 'Nicaragüense',
    'Lucas R?' => 'Lucas R.',
    'mostr?' => 'mostró',
    'espect?culo' => 'espectáculo',
    '?nico' => 'único',
    'lleg?' => 'llegó',
    'bal?n' => 'balón',
    'circulaci?n' => 'circulación',
    'acci?n' => 'acción',
    'tradici?n' => 'tradición',
    '?rea' => 'área',
    'definici?n' => 'definición',
    '?ltimo' => 'último',
    'intent?' => 'intentó',
    'din?mico' => 'dinámico',
    'presi?n' => 'presión',
    'evidenci?' => 'evidenció',
    'r?pidas' => 'rápidas',
    's?lida' => 'sólida',
    'condici?n' => 'condición',
    'encontr?' => 'encontró',
    'pasi?n' => 'pasión',
    'deber?' => 'deberá',
    'pr?ximas' => 'próximas',
    'neutraliz?' => 'neutralizó',
];

// ── 1. Primero, aplicar reemplazos exactos conocidos ──
$textCols = $pdo->query(
    "SELECT TABLE_NAME, COLUMN_NAME 
     FROM information_schema.COLUMNS 
     WHERE TABLE_SCHEMA = 'numeros-y-futbol' 
     AND DATA_TYPE IN ('varchar','char','text','mediumtext','longtext','tinytext')
     ORDER BY TABLE_NAME, COLUMN_NAME"
)->fetchAll(PDO::FETCH_ASSOC);

$totalFixed = 0;
echo "Aplicando correcciones conocidas...\n";

foreach ($textCols as $col) {
    $table = $col['TABLE_NAME'];
    $column = $col['COLUMN_NAME'];
    
    foreach ($knownFixes as $wrong => $correct) {
        try {
            // Verificar si hay filas con este patrón
            $check = $pdo->prepare("SELECT COUNT(*) FROM `$table` WHERE `$column` LIKE ? AND `$column` != ?");
            $check->execute(["%$wrong%", $correct]);
            $count = $check->fetchColumn();
            
            if ($count > 0) {
                $sql = "UPDATE `$table` SET `$column` = REPLACE(`$column`, ?, ?) WHERE `$column` LIKE ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$wrong, $correct, "%$wrong%"]);
                $affected = $stmt->rowCount();
                if ($affected > 0) {
                    echo "  $table.$column: '$wrong' → '$correct' ($affected filas)\n";
                    $totalFixed += $affected;
                }
            }
        } catch (Exception $e) {
            // skip errors silently
        }
    }
}

// ── 2. Buscar ? restantes que no se pudieron arreglar ──
echo "\n=== Filas con '?' restantes (no corregidos automáticamente) ===\n";
$remaining = [];
foreach ($textCols as $col) {
    $table = $col['TABLE_NAME'];
    $column = $col['COLUMN_NAME'];
    
    try {
        $s = $pdo->query("SELECT `$column` FROM `$table` WHERE `$column` LIKE '%?%' LIMIT 5");
        $vals = $s->fetchAll(PDO::FETCH_COLUMN);
        foreach ($vals as $v) {
            $remaining[] = "$table.$column: " . mb_substr($v, 0, 120);
        }
    } catch (Exception $e) {}
}

if (count($remaining) > 0) {
    foreach (array_unique($remaining) as $r) {
        echo "  $r\n";
    }
} else {
    echo "  ¡Todas las filas fueron corregidas!\n";
}

echo "\n=== RESUMEN ===\n";
echo "Total de reemplazos aplicados: $totalFixed\n";
echo "Filas restantes con '?': " . count($remaining) . "\n";
