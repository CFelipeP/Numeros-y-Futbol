<?php

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

}