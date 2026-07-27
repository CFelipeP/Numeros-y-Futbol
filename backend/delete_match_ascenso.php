<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();

$conn = $mysqli;
$id = intval($_POST['id'] ?? 0);
if (!$id) { echo json_enc(["error" => "ID requerido"]); exit; }

$stmt = $conn->prepare("SELECT local_id, visitante_id, goles_local, goles_visitante, status FROM partidos_ascenso WHERE id = ?");
$stmt->bind_param("i", $id); $stmt->execute(); $res = $stmt->get_result(); $m = $res->fetch_assoc(); $stmt->close();
if (!$m) { echo json_enc(["error" => "No existe"]); exit; }

if ($m['status'] === 'Finalizado' && $m['goles_local'] !== null) {
    $l=(int)$m['local_id'];$v=(int)$m['visitante_id'];$gl=(int)$m['goles_local'];$gv=(int)$m['goles_visitante'];
    $s=$conn->prepare("UPDATE tabla_posiciones_ascenso SET pj=GREATEST(pj-1,0) WHERE equipo_id IN (?,?)");$s->bind_param("ii",$l,$v);$s->execute();$s->close();
    $s=$conn->prepare("UPDATE tabla_posiciones_ascenso SET gf=GREATEST(gf-?,0),gc=GREATEST(gc-?,0) WHERE equipo_id=?");$s->bind_param("iii",$gl,$gv,$l);$s->execute();$s->close();
    $s=$conn->prepare("UPDATE tabla_posiciones_ascenso SET gf=GREATEST(gf-?,0),gc=GREATEST(gc-?,0) WHERE equipo_id=?");$s->bind_param("iii",$gv,$gl,$v);$s->execute();$s->close();
    if($gl>$gv){
        $s=$conn->prepare("UPDATE tabla_posiciones_ascenso SET pg=GREATEST(pg-1,0),pts=GREATEST(pts-3,0) WHERE equipo_id=?");$s->bind_param("i",$l);$s->execute();$s->close();
        $s=$conn->prepare("UPDATE tabla_posiciones_ascenso SET pp=GREATEST(pp-1,0) WHERE equipo_id=?");$s->bind_param("i",$v);$s->execute();$s->close();
    }elseif($gl<$gv){
        $s=$conn->prepare("UPDATE tabla_posiciones_ascenso SET pg=GREATEST(pg-1,0),pts=GREATEST(pts-3,0) WHERE equipo_id=?");$s->bind_param("i",$v);$s->execute();$s->close();
        $s=$conn->prepare("UPDATE tabla_posiciones_ascenso SET pp=GREATEST(pp-1,0) WHERE equipo_id=?");$s->bind_param("i",$l);$s->execute();$s->close();
    }else{
        $s=$conn->prepare("UPDATE tabla_posiciones_ascenso SET pe=GREATEST(pe-1,0),pts=GREATEST(pts-1,0) WHERE equipo_id IN (?,?)");$s->bind_param("ii",$l,$v);$s->execute();$s->close();
    }
}

$s=$conn->prepare("DELETE FROM partidos_ascenso WHERE id = ?");$s->bind_param("i",$id);$s->execute();$s->close();
echo json_enc(["success" => true]); $conn->close();
