<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $id = $_POST['id'];

 $old = $conn->query("SELECT logo FROM equipos_tercera WHERE id = $id")->fetch_assoc();
if ($old && $old['logo'] && file_exists($old['logo'])) {
    unlink($old['logo']);
}

 $conn->query("DELETE FROM tabla_posiciones_tercera WHERE equipo_id = $id");
 $conn->query("DELETE FROM equipos_tercera WHERE id = $id");

echo json_encode(["success" => true]);