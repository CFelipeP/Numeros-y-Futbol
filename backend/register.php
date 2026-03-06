<?php

header("Content-Type: application/json");

require "db.php";

$data = json_decode(file_get_contents("php://input"));

$nombre = $data->nombre;
$email = $data->email;
$password = password_hash($data->password, PASSWORD_BCRYPT);

try {

    $sql = $conn->prepare("INSERT INTO usuarios (nombre,email,password,rol) VALUES (?,?,?,?)");

    $sql->execute([$nombre,$email,$password,"usuario"]);

    echo json_encode([
        "success" => true,
        "mensaje" => "Usuario creado"
    ]);

} catch(PDOException $e){

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);

}