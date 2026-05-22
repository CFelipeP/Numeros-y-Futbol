<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

try {

    $pdo->beginTransaction();

    /*
    =====================================================
    LIMPIAR TABLA
    =====================================================
    */

    $pdo->exec("DELETE FROM equipos_copa");

    /*
    =====================================================
    INSERTAR PRIMERA
    =====================================================
    */

    $stmt = $pdo->query("
        SELECT id, nombre, logo
        FROM equipos
    ");

    $insert = $pdo->prepare("
        INSERT INTO equipos_copa
        (equipo_id, division, nombre, logo, activo)
        VALUES (?, 'Primera', ?, ?, 1)
    ");

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $insert->execute([
            $row['id'],
            $row['nombre'],
            $row['logo']
        ]);
    }

    /*
    =====================================================
    INSERTAR SEGUNDA
    =====================================================
    */

    $stmt = $pdo->query("
        SELECT id, nombre, logo
        FROM equipos_segunda
    ");

    $insert = $pdo->prepare("
        INSERT INTO equipos_copa
        (equipo_id, division, nombre, logo, activo)
        VALUES (?, 'Segunda', ?, ?, 1)
    ");

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $insert->execute([
            $row['id'],
            $row['nombre'],
            $row['logo']
        ]);
    }

    /*
    =====================================================
    INSERTAR TERCERA
    =====================================================
    */

    $stmt = $pdo->query("
        SELECT id, nombre, logo
        FROM equipos_tercera
    ");

    $insert = $pdo->prepare("
        INSERT INTO equipos_copa
        (equipo_id, division, nombre, logo, activo)
        VALUES (?, 'Tercera', ?, ?, 1)
    ");

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $insert->execute([
            $row['id'],
            $row['nombre'],
            $row['logo']
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Equipos sincronizados correctamente'
    ]);

} catch (Exception $e) {

    $pdo->rollBack();

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}