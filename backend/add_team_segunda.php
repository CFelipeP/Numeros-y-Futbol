<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $nombre = $_POST['nombre'];
 $ciudad = $_POST['ciudad'];
 $estadio = $_POST['estadio'];

 $archivo = $_FILES['logo'];
 $nombreArchivo = time() . "_" . $archivo['name'];
 $ruta = "uploads/" . $nombreArchivo;
move_uploaded_file($archivo['tmp_name'], $ruta);

 $conn->query("INSERT INTO equipos_segunda (nombre, ciudad, estadio, logo) VALUES ('$nombre','$ciudad','$estadio','$ruta')");
 $id = $conn->insert_id;
 $conn->query("INSERT INTO tabla_posiciones_segunda (equipo_id) VALUES ($id)");

echo json_encode(["success" => true]);