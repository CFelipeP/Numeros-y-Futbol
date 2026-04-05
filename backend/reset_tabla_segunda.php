<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
if ($conn->connect_error) { echo json_encode(["success" => false]); exit; }

 $sql = "UPDATE tabla_posiciones_segunda SET pj=0, pg=0, pe=0, pp=0, gf=0, gc=0, dg=0, pts=0";
echo json_encode(["success" => $conn->query($sql)]);
 $conn->close();