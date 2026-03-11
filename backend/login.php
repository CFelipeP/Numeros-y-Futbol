<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "db.php";

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

$sql = $conn->prepare("SELECT * FROM usuarios WHERE email=?");
$sql->execute([$email]);

$user = $sql->fetch(PDO::FETCH_ASSOC);

if($user && password_verify($password,$user['password'])){

echo json_encode([
"id"=>$user['id'],
"nombre"=>$user['nombre'],
"rol"=>$user['rol']
]);

}else{

http_response_code(401);

echo json_encode([
"error"=>"Credenciales incorrectas"
]);

}