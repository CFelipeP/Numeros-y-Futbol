<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

require "db.php";

try {

    // 📥 RECIBIR DATOS
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode([
            "success" => false,
            "error" => "No llegaron datos"
        ]);
        exit;
    }

    $nombre = $data["nombre"];
    $email = $data["email"];
    $password = password_hash($data["password"], PASSWORD_BCRYPT);

    // 🔴 VALIDAR CAMPOS
    if (!$nombre || !$email || !$password) {
        echo json_encode([
            "success" => false,
            "error" => "Campos vacíos"
        ]);
        exit;
    }

    // 🔴 VALIDAR EMAIL EXISTENTE
    $check = $conn->prepare("SELECT id FROM usuarios WHERE email=?");
    $check->execute([$email]);

    if ($check->fetch()) {
        echo json_encode([
            "success" => false,
            "error" => "El correo ya existe"
        ]);
        exit;
    }

    // 💾 INSERTAR USUARIO
    $sql = $conn->prepare("INSERT INTO usuarios (nombre,email,password,rol) VALUES (?,?,?,?)");
    $sql->execute([$nombre, $email, $password, "admin"]);

    echo json_encode([
        "success" => true
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}