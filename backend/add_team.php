<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

$nombre = $_POST['nombre'];
$ciudad = $_POST['ciudad'];
$estadio = $_POST['estadio'];

// imagen
$archivo = $_FILES['logo'];
$nombreArchivo = time() . "_" . $archivo['name'];
$ruta = "uploads/" . $nombreArchivo;

move_uploaded_file($archivo['tmp_name'], $ruta);

// guardar equipo
$conn->query("INSERT INTO equipos (nombre, ciudad, estadio, logo)
VALUES ('$nombre','$ciudad','$estadio','$ruta')");

$id = $conn->insert_id;

// crear en tabla posiciones
$conn->query("INSERT INTO tabla_posiciones (equipo_id) VALUES ($id)");

echo json_encode(["success"=>true]);