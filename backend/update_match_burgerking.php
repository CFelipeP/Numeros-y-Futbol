<?php
error_reporting(0); ini_set('display_errors', 0);
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_check.php';
requireAdmin();
$conn = $mysqli;
$id = (int)($_POST['match_id'] ?? 0); $g1 = $_POST['goles_local'] ?? null; $g2 = $_POST['goles_visitante'] ?? null; $fecha = $_POST['fecha'] ?? null; $hora = $_POST['hora'] ?? null; $jornada = $_POST['jornada'] ?? null;
if (!$id) { echo json_enc(["error" => "ID requerido"]); exit; }
// --- Reset ---
if ((string)$g1 === '-1') {
    $stmt = $conn->prepare("SELECT equipo_local, equipo_visitante, goles_local, goles_visitante, estado FROM partidos_burgerking WHERE id=?"); $stmt->bind_param("i", $id); $stmt->execute(); $res = $stmt->get_result(); $m = $res->fetch_assoc(); $stmt->close();
    if ($m && $m['estado'] === 'Finalizado' && $m['goles_local'] !== null) {
        $l=(int)$m['equipo_local'];$v=(int)$m['equipo_visitante'];$gl=(int)$m['goles_local'];$gv=(int)$m['goles_visitante'];
        $conn->prepare("UPDATE tabla_posiciones_burgerking SET partidos_jugados=GREATEST(partidos_jugados-1,0) WHERE equipo_id IN (?,?)")->execute([$l,$v]);
        $conn->prepare("UPDATE tabla_posiciones_burgerking SET goles_favor=GREATEST(goles_favor-?,0),goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?")->execute([$gl,$gv,$l]);
        $conn->prepare("UPDATE tabla_posiciones_burgerking SET goles_favor=GREATEST(goles_favor-?,0),goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?")->execute([$gv,$gl,$v]);
        if($gl>$gv){$conn->prepare("UPDATE tabla_posiciones_burgerking SET ganados=GREATEST(ganados-1,0),puntos=GREATEST(puntos-3,0) WHERE equipo_id=?")->execute([$l]);$conn->prepare("UPDATE tabla_posiciones_burgerking SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?")->execute([$v]);}
        elseif($gl<$gv){$conn->prepare("UPDATE tabla_posiciones_burgerking SET ganados=GREATEST(ganados-1,0),puntos=GREATEST(puntos-3,0) WHERE equipo_id=?")->execute([$v]);$conn->prepare("UPDATE tabla_posiciones_burgerking SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?")->execute([$l]);}
        else{$conn->prepare("UPDATE tabla_posiciones_burgerking SET empatados=GREATEST(empatados-1,0),puntos=GREATEST(puntos-1,0) WHERE equipo_id IN (?,?)")->execute([$l,$v]);}
    }
    $conn->prepare("UPDATE partidos_burgerking SET goles_local=NULL,goles_visitante=NULL,estado='Pendiente' WHERE id=?")->execute([$id]);
    echo json_enc(["success"=>true,"reset"=>true]); $conn->close(); exit;
}
// --- Normal ---
if ($g1 === "" || $g2 === "" || $g1 === null || $g2 === null) { echo json_enc(["error" => "Goles inválidos"]); exit; }
$g1=(int)$g1;$g2=(int)$g2;
$stmt=$conn->prepare("SELECT equipo_local,equipo_visitante,goles_local,goles_visitante,estado FROM partidos_burgerking WHERE id=?");$stmt->bind_param("i",$id);$stmt->execute();$res=$stmt->get_result();$m=$res->fetch_assoc();$stmt->close();
if(!$m){echo json_enc(["error"=>"Partido no encontrado"]);exit;}
$l=(int)$m['equipo_local'];$v=(int)$m['equipo_visitante'];$old_gl=$m['goles_local']!==null?(int)$m['goles_local']:null;$old_gv=$m['goles_visitante']!==null?(int)$m['goles_visitante']:null;$wasFinal=$m['estado']==='Finalizado';
if($wasFinal&&$old_gl!==null){
    $conn->prepare("UPDATE tabla_posiciones_burgerking SET partidos_jugados=GREATEST(partidos_jugados-1,0) WHERE equipo_id IN (?,?)")->execute([$l,$v]);
    $conn->prepare("UPDATE tabla_posiciones_burgerking SET goles_favor=GREATEST(goles_favor-?,0),goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?")->execute([$old_gl,$old_gv,$l]);
    $conn->prepare("UPDATE tabla_posiciones_burgerking SET goles_favor=GREATEST(goles_favor-?,0),goles_contra=GREATEST(goles_contra-?,0) WHERE equipo_id=?")->execute([$old_gv,$old_gl,$v]);
    if($old_gl>$old_gv){$conn->prepare("UPDATE tabla_posiciones_burgerking SET ganados=GREATEST(ganados-1,0),puntos=GREATEST(puntos-3,0) WHERE equipo_id=?")->execute([$l]);$conn->prepare("UPDATE tabla_posiciones_burgerking SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?")->execute([$v]);}
    elseif($old_gl<$old_gv){$conn->prepare("UPDATE tabla_posiciones_burgerking SET ganados=GREATEST(ganados-1,0),puntos=GREATEST(puntos-3,0) WHERE equipo_id=?")->execute([$v]);$conn->prepare("UPDATE tabla_posiciones_burgerking SET perdidos=GREATEST(perdidos-1,0) WHERE equipo_id=?")->execute([$l]);}
    else{$conn->prepare("UPDATE tabla_posiciones_burgerking SET empatados=GREATEST(empatados-1,0),puntos=GREATEST(puntos-1,0) WHERE equipo_id IN (?,?)")->execute([$l,$v]);}
}
$conn->prepare("UPDATE partidos_burgerking SET goles_local=?,goles_visitante=?,estado='Finalizado' WHERE id=?")->execute([$g1,$g2,$id]);
if($fecha&&$hora){$conn->prepare("UPDATE partidos_burgerking SET fecha=? WHERE id=?")->execute([$fecha.' '.$hora.':00',$id]);}
if($jornada!==null&&$jornada!==''){$conn->prepare("UPDATE partidos_burgerking SET jornada=? WHERE id=?")->execute([(int)$jornada,$id]);}
$conn->prepare("UPDATE tabla_posiciones_burgerking SET partidos_jugados=partidos_jugados+1 WHERE equipo_id IN (?,?)")->execute([$l,$v]);
$conn->prepare("UPDATE tabla_posiciones_burgerking SET goles_favor=goles_favor+?,goles_contra=goles_contra+? WHERE equipo_id=?")->execute([$g1,$g2,$l]);
$conn->prepare("UPDATE tabla_posiciones_burgerking SET goles_favor=goles_favor+?,goles_contra=goles_contra+? WHERE equipo_id=?")->execute([$g2,$g1,$v]);
if($g1>$g2){$conn->prepare("UPDATE tabla_posiciones_burgerking SET ganados=ganados+1,puntos=puntos+3 WHERE equipo_id=?")->execute([$l]);$conn->prepare("UPDATE tabla_posiciones_burgerking SET perdidos=perdidos+1 WHERE equipo_id=?")->execute([$v]);}
elseif($g1<$g2){$conn->prepare("UPDATE tabla_posiciones_burgerking SET ganados=ganados+1,puntos=puntos+3 WHERE equipo_id=?")->execute([$v]);$conn->prepare("UPDATE tabla_posiciones_burgerking SET perdidos=perdidos+1 WHERE equipo_id=?")->execute([$l]);}
else{$conn->prepare("UPDATE tabla_posiciones_burgerking SET empatados=empatados+1,puntos=puntos+1 WHERE equipo_id IN (?,?)")->execute([$l,$v]);}
echo json_enc(["success"=>true]); $conn->close();
