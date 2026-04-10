<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $id = intval($_POST['id']);

if (!$id) {
    echo json_encode(["error" => "ID requerido"]);
    exit;
}

 $conn->query("DELETE FROM partidos_tercera WHERE id = $id");

echo json_encode(["success" => true]);
 $conn->close();