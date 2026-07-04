<?php
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;

$sql = "UPDATE tabla_posiciones_segunda SET pj=0, pg=0, pe=0, pp=0, gf=0, gc=0, dg=0, pts=0";
echo json_enc(["success" => $conn->query($sql)]);
$conn->close();
