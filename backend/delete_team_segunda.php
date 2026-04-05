<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $id = $_POST['id'];

 $old = $conn->query("SELECT logo FROM equipos_segunda WHERE id = $id")->fetch_assoc();
if ($old && $old['logo'] && file_exists($old['logo'])) {
    unlink($old['logo']);
}

 $conn->query("DELETE FROM tabla_posiciones_segunda WHERE equipo_id = $id");
 $conn->query("DELETE FROM equipos_segunda WHERE id = $id");

echo json_encode(["success" => true]);
