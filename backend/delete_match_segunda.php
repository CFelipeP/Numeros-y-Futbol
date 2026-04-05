<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $id = $_POST['id'];

 $conn->query("DELETE FROM partidos_segunda WHERE id = $id");

echo json_encode(["success" => true]);