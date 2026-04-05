<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $id = $_POST['id'];
 $nombre = $_POST['nombre'];
 $ciudad = $_POST['ciudad'];
 $estadio = $_POST['estadio'];

if (!empty($_FILES['logo']['name'])) {
    $archivo = $_FILES['logo'];
    $nombreArchivo = time() . "_" . $archivo['name'];
    $ruta = "uploads/" . $nombreArchivo;
    move_uploaded_file($archivo['tmp_name'], $ruta);

    $old = $conn->query("SELECT logo FROM equipos_tercera WHERE id = $id")->fetch_assoc();
    if ($old && $old['logo'] && file_exists($old['logo'])) {
        unlink($old['logo']);
    }

    $conn->query("UPDATE equipos_tercera SET nombre='$nombre', ciudad='$ciudad', estadio='$estadio', logo='$ruta' WHERE id=$id");
} else {
    $conn->query("UPDATE equipos_tercera SET nombre='$nombre', ciudad='$ciudad', estadio='$estadio' WHERE id=$id");
}

echo json_encode(["success" => true]);