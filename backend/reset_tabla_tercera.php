<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");
if ($conn->connect_error) { echo json_encode(["success" => false]); exit; }

 $sql = "UPDATE tabla_posiciones_tercera SET pj=0, pg=0, pe=0, pp=0, gf=0, gc=0, dg=0, pts=0";
if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
 $conn->close();