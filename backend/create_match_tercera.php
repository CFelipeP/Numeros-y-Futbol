<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $local = $_POST['local'];
 $visitante = $_POST['visitante'];

 $conn->query("INSERT INTO partidos_tercera (local_id, visitante_id) VALUES ('$local','$visitante')");
 $id = $conn->insert_id;

echo json_encode(["success" => true, "id" => $id]);