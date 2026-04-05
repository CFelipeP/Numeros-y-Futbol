<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $conn = new mysqli("localhost", "root", "Info2026/*-", "numeros-y-futbol");

 $match_id = $_POST['match_id'];
 $goles_local = $_POST['goles_local'];
 $goles_visitante = $_POST['goles_visitante'];

if ($goles_local == "-1" || $goles_visitante == "-1") {
    $partido = $conn->query("SELECT local_id, visitante_id FROM partidos_tercera WHERE id = $match_id")->fetch_assoc();
    if ($partido) {
        $conn->query("UPDATE tabla_posiciones_tercera SET pj = pj - 1 WHERE equipo_id = {$partido['local_id']} AND pj > 0");
        $conn->query("UPDATE tabla_posiciones_tercera SET pj = pj - 1 WHERE equipo_id = {$partido['visitante_id']} AND pj > 0");
    }
    $conn->query("UPDATE partidos_tercera SET goles_local = NULL, goles_visitante = NULL, status = 'Pendiente' WHERE id = $match_id");
} else {
    $gl = intval($goles_local);
    $gv = intval($goles_visitante);
    $partido = $conn->query("SELECT local_id, visitante_id FROM partidos_tercera WHERE id = $match_id")->fetch_assoc();

    if ($partido) {
        $lid = $partido['local_id'];
        $vid = $partido['visitante_id'];

        if ($gl > $gv) {
            $conn->query("UPDATE tabla_posiciones_tercera SET pj=pj+1, pg=pg+1, pts=pts+3, gf=gf+$gl, gc=gc+$gv WHERE equipo_id=$lid");
            $conn->query("UPDATE tabla_posiciones_tercera SET pj=pj+1, pp=pp+1, gf=gf+$gv, gc=gc+$gl WHERE equipo_id=$vid");
        } elseif ($gv > $gl) {
            $conn->query("UPDATE tabla_posiciones_tercera SET pj=pj+1, pp=pp+1, gf=gf+$gl, gc=gc+$gv WHERE equipo_id=$lid");
            $conn->query("UPDATE tabla_posiciones_tercera SET pj=pj+1, pg=pg+1, pts=pts+3, gf=gf+$gv, gc=gc+$gl WHERE equipo_id=$vid");
        } else {
            $conn->query("UPDATE tabla_posiciones_tercera SET pj=pj+1, pe=pe+1, pts=pts+1, gf=gf+$gl, gc=gc+$gv WHERE equipo_id=$lid");
            $conn->query("UPDATE tabla_posiciones_tercera SET pj=pj+1, pe=pe+1, pts=pts+1, gf=gf+$gv, gc=gc+$gl WHERE equipo_id=$vid");
        }
    }

    $conn->query("UPDATE partidos_tercera SET goles_local=$gl, goles_visitante=$gv, status='Finalizado' WHERE id=$match_id");
}

echo json_encode(["success" => true]);