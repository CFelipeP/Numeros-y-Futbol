<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {
    // ── Partidos ──
    $stmt = $pdo->prepare("SELECT * FROM partidos_seleccion ORDER BY fecha DESC, id DESC");
    $stmt->execute();
    $partidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ── Jugadores ──
    $stmt = $pdo->prepare("SELECT * FROM jugadores_seleccion ORDER BY numero_camiseta ASC");
    $stmt->execute();
    $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ── Cuerpo técnico ──
    $stmt = $pdo->prepare("SELECT * FROM cuerpo_tecnico_seleccion ORDER BY id ASC");
    $stmt->execute();
    $staff = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "partidos" => $partidos,
        "jugadores" => $jugadores,
        "staff" => $staff
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
