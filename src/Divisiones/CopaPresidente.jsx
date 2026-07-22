import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles2.css";
import { API_BASE } from "../config";

const BASE = API_BASE;
const API = {
  groups:  `${BASE}copa_get_groups.php`,
  matches: `${BASE}copa_get_matches.php`,
  stats:   `${BASE}copa_get_stats.php`,
};

const DIV = {
  Primera: { color:"var(--color-accent)", label:"1ª", bg:"rgba(255,31,31,0.15)", border:"rgba(255,31,31,0.35)" },
  Ascenso: { color:"#60a5fa", label:"Asc.", bg:"rgba(96,165,250,0.15)", border:"rgba(96,165,250,0.35)" },
};

const C = {
  border:"rgba(255,255,255,0.08)", border2:"rgba(255,255,255,0.15)",
  red:"var(--color-accent)", redDim:"rgba(255,0,77,0.1)", redGlow:"rgba(255,0,77,0.4)",
  gold:"#f59e0b", goldDim:"rgba(245,158,11,0.15)", goldGlow:"rgba(245,158,11,0.35)",
  white:"var(--color-text-main)", muted:"var(--color-text-muted)", faint:"#64748b",
  green:"var(--color-success)", greenDim:"rgba(16,185,129,0.1)",
};
const FF = "var(--font-heading)";

const n  = (v,fb=0) => (v===null||v===undefined||v===""||isNaN(+v))?fb:+v;
const s  = (v,fb="") => v!=null?String(v):fb;
const lg = (p) => (!p||typeof p!=="string")?null:p.startsWith("http")?p:`${BASE}${p}`;
const fDate = (d) => { if(!d)return null; try{return new Date(d+"T00:00:00").toLocaleDateString("es-SV",{day:"2-digit",month:"short"});}catch{return null;} };
const fTime = (t) => { if(!t)return null; const p=String(t).split(":"); return p.length<2?null:`${p[0]}:${p[1]}`; };

const IcnHex     = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z"/></svg>;
const IcnSword   = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 3L5 12.5"/><path d="M5 12.5L2 18l5.5-3"/><path d="M9.5 14.5L21 3"/><path d="M21 3l-3 3"/><path d="M14.5 3l3 3"/></svg>;
const IcnDiamond = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 10-8 10-8-10L12 2z"/></svg>;
const IcnStar    = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>;
const IcnTrophy  = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H3V6a1 1 0 011-1h2"/><path d="M18 9h3V6a1 1 0 00-1-1h-2"/><path d="M6 5h12v7a6 6 0 01-12 0V5z"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>;
const IcnFutbol  = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2l2.5 5.5L20 9l-4 3.5 1 5.5-5-2.8-5 2.8 1-5.5L4 9l5.5-1.5z"/></svg>;
const IcnLock    = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IcnTable   = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>;
const IcnChevDown= ({size=12,color="currentColor",style:st}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={st}><path d="M6 9l6 6 6-6"/></svg>;
const IcnCheck   = ({size=12,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>;
const IcnShield  = ({size=14,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

const phaseIcon = (key,size=14,color="currentColor") => {
  if(key==="grupos")  return <IcnTrophy size={size} color={color}/>;
  if(key==="octavos") return <IcnSword size={size} color={color}/>;
  if(key==="cuartos") return <IcnDiamond size={size} color={color}/>;
  if(key==="semis")   return <IcnStar size={size} color={color}/>;
  if(key==="final")   return <IcnTrophy size={size} color={color}/>;
  return null;
};

const HeroBg = () => (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g1" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#0f172a" stopOpacity="0.9"/><stop offset="100%" stopColor="var(--color-bg)" stopOpacity="1"/></radialGradient>
      <radialGradient id="g2" cx="50%" cy="50%" r="45%"><stop offset="0%" stopColor="#ff1f1f" stopOpacity="0.08"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <linearGradient id="fadeBot" x1="0" y1="0" x2="0" y2="1"><stop offset="60%" stopColor="transparent"/><stop offset="100%" stopColor="var(--color-bg)"/></linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g1)"/>
    <rect width="100%" height="100%" fill="url(#g2)"/>
    <rect width="100%" height="100%" fill="url(#fadeBot)"/>
  </svg>
);

const Logo = ({logo,name,size=36,winner}) => {
  const src=lg(logo);
  return (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg, #334155, var(--color-card-bg))",border:`1.5px solid ${winner?C.red:"rgba(255,255,255,0.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxShadow:winner?`0 0 14px ${C.redGlow}`:"0 2px 6px rgba(0,0,0,0.4)",transition:"all 0.3s"}}>
      {src?<img src={src} alt={s(name)} style={{width:size-6,height:size-6,objectFit:"contain"}} onError={e=>{e.target.style.display="none";}}/>:<IcnShield size={size*0.4} color={C.faint}/>}
    </div>
  );
};

const DivBadge = ({division}) => {
  const d=DIV[division]||{color:C.muted,label:"?",bg:"rgba(136,153,187,0.1)",border:"rgba(136,153,187,0.25)"};
  return <span style={{fontSize:8,padding:"2px 5px",borderRadius:3,fontWeight:900,letterSpacing:"0.5px",fontFamily:FF,background:d.bg,color:d.color,border:`1px solid ${d.border}`,whiteSpace:"nowrap",lineHeight:1.4}}>{d.label}</span>;
};

const StatusPill = ({status}) => {
  const map={"Finalizado":{color:C.green,bg:"rgba(34,197,94,0.1)",border:"rgba(34,197,94,0.25)",dot:C.green,label:"FT",pulse:false},"En Curso":{color:C.red,bg:C.redDim,border:C.redGlow,dot:C.red,label:"LIVE",pulse:true},"Pendiente":{color:C.faint,bg:"rgba(58,77,107,0.2)",border:"rgba(58,77,107,0.35)",dot:C.faint,label:"PROX",pulse:false}};
  const st=map[status]||map["Pendiente"];
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:8,fontWeight:800,letterSpacing:"1.5px",textTransform:"uppercase",padding:"3px 8px",borderRadius:4,background:st.bg,color:st.color,border:`1px solid ${st.border}`,fontFamily:FF}}><span style={{width:5,height:5,borderRadius:"50%",background:st.dot,flexShrink:0,animation:st.pulse?"livePulse 1s infinite":"none",boxShadow:st.pulse?`0 0 6px ${C.red}`:"none"}}/>{st.label}</span>;
};

const Sk = ({w="100%",h=14,r=4}) => <div style={{width:w,height:h,borderRadius:r,background:"linear-gradient(90deg,var(--color-card-bg) 25%,#334155 50%,var(--color-card-bg) 75%)",backgroundSize:"600px 100%",animation:"sk 1.4s linear infinite"}}/>;

const MatchCard = ({match,i}) => {
  const fin=match.estado==="Finalizado",live=match.estado==="En Curso";
  const gl=n(match.goles_local),gv=n(match.goles_visitante);
  const lw=fin&&gl>gv,vw=fin&&gv>gl,draw=fin&&gl===gv;
  return (
    <div className="match-card" style={{animation:"fadeInUp .4s ease-out both",animationDelay:`${i*0.05}s`,position:"relative",borderRadius:10,overflow:"hidden",cursor:"default",transition:"transform 0.25s,box-shadow 0.25s",boxShadow:"0 4px 20px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.08)",background:"var(--color-card-bg)"}}>
      <div style={{height:3,background:live?"linear-gradient(90deg,transparent,var(--color-accent),transparent)":fin?"linear-gradient(90deg,transparent,var(--color-success),transparent)":"linear-gradient(90deg,transparent,#334155,transparent)"}}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.08)",background:"rgba(0,0,0,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span className="cp-match-grp" style={{fontSize:9,fontWeight:800,letterSpacing:"1px",color:"var(--color-accent)",background:"rgba(255,0,77,0.1)",padding:"2px 8px",borderRadius:3,fontFamily:FF,border:"1px solid rgba(255,0,77,0.4)"}}>GRP {s(match.grupo)}</span>
          {(fDate(match.fecha)||fTime(match.hora))&&<span style={{fontSize:9,color:C.faint,fontFamily:FF,letterSpacing:"0.3px"}}>{fDate(match.fecha)}{fTime(match.hora)?` · ${fTime(match.hora)}`:""}</span>}
        </div>
        <StatusPill status={match.estado}/>
      </div>
      <div style={{padding:"16px 14px 14px"}}>
        <div className="cp-match-card-grid" style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo logo={match.logo1} name={match.team1} size={40} winner={lw}/>
            <div style={{minWidth:0}}>
              <div className="cp-match-team-name" style={{fontSize:12,fontWeight:lw?800:500,color:lw?"var(--color-text-main)":C.muted,lineHeight:1.2,fontFamily:FF,letterSpacing:"0.3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:90}}>{s(match.team1)||"Por definir"}</div>
              <div style={{marginTop:3}}><DivBadge division={match.division1}/></div>
            </div>
          </div>
          <div style={{textAlign:"center",minWidth:80,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            {(fin||live)?(<><div className="cp-match-score" style={{display:"flex",alignItems:"center",gap:2,fontSize:30,fontWeight:900,lineHeight:1,fontFamily:FF,letterSpacing:2}}><span style={{color:lw?"var(--color-text-main)":draw?C.muted:C.faint}}>{gl}</span><span style={{color:"#334155",fontSize:20,padding:"0 2px"}}>{"\u2013"}</span><span style={{color:vw?"var(--color-text-main)":draw?C.muted:C.faint}}>{gv}</span></div>{live&&<span style={{fontSize:7,color:"var(--color-accent)",letterSpacing:"2px",fontFamily:FF,fontWeight:900,animation:"livePulse 1s infinite"}}>EN VIVO</span>}</>):(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}><div className="cp-match-vs" style={{fontSize:11,fontWeight:900,color:C.faint,fontFamily:FF,letterSpacing:5}}>VS</div><div style={{width:36,height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)"}}/></div>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexDirection:"row-reverse",textAlign:"right"}}>
            <Logo logo={match.logo2} name={match.team2} size={40} winner={vw}/>
            <div style={{minWidth:0}}>
              <div className="cp-match-team-name" style={{fontSize:12,fontWeight:vw?800:500,color:vw?"var(--color-text-main)":C.muted,lineHeight:1.2,fontFamily:FF,letterSpacing:"0.3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:90}}>{s(match.team2)||"Por definir"}</div>
              <div style={{marginTop:3,display:"flex",justifyContent:"flex-end"}}><DivBadge division={match.division2}/></div>
            </div>
          </div>
        </div>
      </div>
      {fin&&(lw||vw)&&(<div style={{padding:"5px 14px",display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"rgba(16,185,129,0.1)",borderTop:"1px solid rgba(34,197,94,0.15)"}}><IcnCheck size={10} color={C.green}/><span style={{fontSize:9,fontWeight:800,color:C.green,fontFamily:FF,letterSpacing:"0.5px"}}>GANADOR: {lw?s(match.team1):s(match.team2)}</span></div>)}
    </div>
  );
};

const groupTies = (matches, prevTies = null) => {
  const byKey = new Map();
  matches.forEach(m=>{
    const teamKey=[s(m.team1),s(m.team2)].sort().join("|||");
    const key=m.llave_id!=null?String(m.llave_id):(m.llave!=null?String(m.llave):teamKey);
    if(!byKey.has(key))byKey.set(key,[]);
    byKey.get(key).push(m);
  });

  let ties = [...byKey.entries()].map(([key,ms])=>{
    const sorted=[...ms].sort((a,b)=>(a.fecha||"").localeCompare(b.fecha||""));
    const ida=sorted[0],vuelta=sorted[1]||null;
    const eq1=s(ida.team1)||"Por definir",eq2=s(ida.team2)||"Por definir";
    const idaG1=n(ida.goles_local),idaG2=n(ida.goles_visitante);
    let vtaG1=null,vtaG2=null;
    if(vuelta){if(s(vuelta.team1)===eq1){vtaG1=n(vuelta.goles_local);vtaG2=n(vuelta.goles_visitante);}else{vtaG1=n(vuelta.goles_visitante);vtaG2=n(vuelta.goles_local);}}
    const total1=idaG1+(vtaG1??0),total2=idaG2+(vtaG2??0);
    const allFin=ms.slice(0,2).every(m=>m.estado==="Finalizado");
    const anyLive=ms.slice(0,2).some(m=>m.estado==="En Curso");
    const orden = ida.orden != null ? Number(ida.orden) : (parseInt(key, 10) || 999);
    const pen1 = vuelta ? n(vuelta.penales_visitante) : null;
    const pen2 = vuelta ? n(vuelta.penales_local) : null;
    const wonByPens = allFin && total1 === total2 && (pen1 !== null && pen2 !== null) && ((pen1 ?? 0) + (pen2 ?? 0) > 0);

    return {key,orden,eq1,eq2,logo1:ida.logo1,logo2:ida.logo2,div1:ida.division1,div2:ida.division2,idaFecha:ida.fecha,idaHora:ida.hora,vtaFecha:vuelta?.fecha,vtaHora:vuelta?.hora,idaG1,idaG2,vtaG1,vtaG2,total1,total2,pen1,pen2,wonByPens,idaFin:ida.estado==="Finalizado",idaLive:ida.estado==="En Curso",vtaFin:vuelta?.estado==="Finalizado",vtaLive:vuelta?.estado==="En Curso",hasVuelta:!!vuelta,allFin,anyLive};
  });

  if(ties.length > 0 && prevTies && prevTies.length > 0 && isNaN(+ties[0].key)){
    const getWinner = (t) => {
      if (!t || !t.allFin) return null;
      return t.total1 > t.total2 ? t.eq1 : t.total2 > t.total1 ? t.eq2 : null;
    };

    const sorted = Array(ties.length).fill(null);
    const used = new Set();

    for(let i=0; i<prevTies.length; i+=2){
      const w1 = getWinner(prevTies[i]);
      const w2 = getWinner(prevTies[i+1]);
      if(!w1 || !w2) continue;

      const matchIdx = ties.findIndex((t, idx) => !used.has(idx) &&
        ((t.eq1 === w1 || t.eq2 === w1) && (t.eq1 === w2 || t.eq2 === w2))
      );

      if(matchIdx !== -1){
        sorted[Math.floor(i/2)] = {...ties[matchIdx], key: String(Math.floor(i/2) + 1)};
        used.add(matchIdx);
      }
    }

    let nextIdx = 0;
    for(let i=0; i<sorted.length; i++){
      if(!sorted[i]){
        while(used.has(nextIdx)) nextIdx++;
        sorted[i] = {...ties[nextIdx], key: String(i+1)};
        used.add(nextIdx);
      }
    }

    ties = sorted;
  }

  return ties.sort((a,b)=>{
    const ao = a.orden != null ? a.orden : 999;
    const bo = b.orden != null ? b.orden : 999;
    if (ao !== bo) return ao - bo;
    return a.key.localeCompare(b.key);
  });
};

const BracketTie = ({tie,isFinal=false}) => {
  if (!tie) return null;
  const {eq1,eq2,logo1,logo2,div1,div2,idaG1,idaG2,vtaG1,vtaG2,total1,total2,pen1,pen2,wonByPens,idaFin,vtaFin,hasVuelta,allFin,anyLive}=tie;
  const w1=allFin&&(total1>total2||(wonByPens&&pen1>pen2)),w2=allFin&&(total2>total1||(wonByPens&&pen2>pen1)),live=anyLive&&!allFin;
  const gc=(g,opp,done)=>{if(!done)return C.faint;if(g>opp)return C.green;if(g<opp)return "#f87171";return C.muted;};
  const border=live?"rgba(255,0,77,0.4)":allFin?(isFinal?"rgba(245,158,11,0.35)":"rgba(34,197,94,0.28)"):"rgba(255,255,255,0.15)";
  const accent=isFinal?(w1||w2?C.gold:C.faint):(w1||w2?C.red:C.faint);
  return (
    <div style={{width:"100%",borderRadius:7,overflow:"hidden",border:`1px solid ${border}`,background:"linear-gradient(160deg,var(--color-card-bg) 0%,var(--color-bg) 100%)",boxShadow:live?`0 0 20px ${C.redDim}`:isFinal?"0 4px 16px rgba(245,158,11,0.08)":"0 4px 12px rgba(0,0,0,0.3)",borderLeft:`3px solid ${accent}`}}>
      <div style={{display:"grid",gridTemplateColumns:"20px 1fr 26px 26px 32px",gap:3,padding:"3px 8px",background:"rgba(0,0,0,0.25)",borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:7,color:C.faint,fontWeight:900,letterSpacing:"1.2px",textAlign:"center",fontFamily:FF}}>
        <div/><div style={{textAlign:"left",paddingLeft:2}}>EQUIPO</div><div>IDA</div><div>VTA</div><div>AGG</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"20px 1fr 26px 26px 32px",gap:3,padding:"6px 8px 3px",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.04)",background:w1?"rgba(255,0,77,0.05)":"transparent"}}>
        <Logo logo={logo1} name={eq1} size={18} winner={w1}/>
        <div style={{display:"flex",gap:4,alignItems:"center",minWidth:0,paddingLeft:2}}><span style={{fontSize:10,fontWeight:w1?800:500,color:w1?"var(--color-text-main)":C.muted,fontFamily:FF,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{eq1}</span><DivBadge division={div1}/></div>
        <div style={{textAlign:"center",fontSize:11,fontWeight:800,fontFamily:FF,color:gc(idaG1,idaG2,idaFin)}}>{idaFin?idaG1:"–"}</div>
        <div style={{textAlign:"center",fontSize:11,fontWeight:800,fontFamily:FF,color:hasVuelta&&vtaFin?gc(vtaG1,vtaG2,vtaFin):C.faint}}>{hasVuelta&&vtaFin?vtaG1:"–"}</div>
        <div style={{textAlign:"center",fontSize:12,fontWeight:900,fontFamily:FF,color:allFin&&w1?(isFinal?C.gold:C.red):C.muted,background:allFin&&w1?(isFinal?C.goldDim:C.redDim):"transparent",borderRadius:3,padding:"1px 0"}}>{allFin?total1:"–"}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"20px 1fr 26px 26px 32px",gap:3,padding:"3px 8px 6px",alignItems:"center",background:w2?"rgba(255,0,77,0.05)":"transparent"}}>
        <Logo logo={logo2} name={eq2} size={18} winner={w2}/>
        <div style={{display:"flex",gap:4,alignItems:"center",minWidth:0,paddingLeft:2}}><span style={{fontSize:10,fontWeight:w2?800:500,color:w2?"var(--color-text-main)":C.muted,fontFamily:FF,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{eq2}</span><DivBadge division={div2}/></div>
        <div style={{textAlign:"center",fontSize:11,fontWeight:800,fontFamily:FF,color:gc(idaG2,idaG1,idaFin)}}>{idaFin?idaG2:"–"}</div>
        <div style={{textAlign:"center",fontSize:11,fontWeight:800,fontFamily:FF,color:hasVuelta&&vtaFin?gc(vtaG2,vtaG1,vtaFin):C.faint}}>{hasVuelta&&vtaFin?vtaG2:"–"}</div>
        <div style={{textAlign:"center",fontSize:12,fontWeight:900,fontFamily:FF,color:allFin&&w2?(isFinal?C.gold:C.red):C.muted,background:allFin&&w2?(isFinal?C.goldDim:C.redDim):"transparent",borderRadius:3,padding:"1px 0"}}>{allFin?total2:"–"}</div>
      </div>
      {wonByPens&&(<div style={{padding:"3px 8px",background:"rgba(168,85,247,0.08)",borderTop:`1px solid rgba(168,85,247,0.25)`,display:"flex",justifyContent:"center",alignItems:"center",gap:5}}><span style={{fontSize:7,fontWeight:900,color:"#a855f7",fontFamily:FF,letterSpacing:"1.2px"}}>PENALES ({pen1}-{pen2})</span></div>)}
      {live&&(<div style={{padding:"3px 8px",background:C.redDim,borderTop:`1px solid ${C.redGlow}`,display:"flex",justifyContent:"center",alignItems:"center",gap:5}}><span style={{width:5,height:5,borderRadius:"50%",background:"var(--color-accent)",animation:"livePulse 1s infinite",boxShadow:`0 0 8px ${C.redGlow}`,flexShrink:0}}/><span style={{fontSize:7,fontWeight:900,color:"var(--color-accent)",fontFamily:FF,letterSpacing:"1.5px"}}>EN VIVO</span></div>)}
    </div>
  );
};

const TournamentBracket = ({octavos,cuartos,semis,final:finalMatches}) => {
    const allOct=groupTies(Array.isArray(octavos)?octavos:[]);
  const allCua=groupTies(Array.isArray(cuartos)?cuartos:[], allOct);
  const allSem=groupTies(Array.isArray(semis)?semis:[], allCua);
  const allFin=groupTies(Array.isArray(finalMatches)?finalMatches:[], allSem);

  const CW   = 195;
  const CH   = 95;
  const CONN = 40;
  const PAD  = 12;

  const G_INNER = 14;
  const G_OUTER = 44;

  const octY = [
    0,
    CH + G_INNER,
    CH + G_INNER + CH + G_OUTER,
    CH + G_INNER + CH + G_OUTER + CH + G_INNER,
    CH + G_INNER + CH + G_OUTER + CH + G_INNER + CH + G_OUTER,
    CH + G_INNER + CH + G_OUTER + CH + G_INNER + CH + G_OUTER + CH + G_INNER,
    CH + G_INNER + CH + G_OUTER + CH + G_INNER + CH + G_OUTER + CH + G_INNER + CH + G_OUTER,
    CH + G_INNER + CH + G_OUTER + CH + G_INNER + CH + G_OUTER + CH + G_INNER + CH + G_OUTER + CH + G_INNER,
  ];

  const cuaY = [0,1,2,3].map(i => {
    const y1 = octY[i*2]   + CH/2;
    const y2 = octY[i*2+1] + CH/2;
    return (y1+y2)/2 - CH/2;
  });

  const semY = [0,1].map(i => {
    const y1 = cuaY[i*2]   + CH/2;
    const y2 = cuaY[i*2+1] + CH/2;
    return (y1+y2)/2 - CH/2;
  });

  const finY = (() => {
    const y1 = semY[0] + CH/2;
    const y2 = semY[1] + CH/2;
    return (y1+y2)/2 - CH/2;
  })();

  const totalH = octY[7] + CH;

  const xOct = PAD;
  const xCua = xOct + CW + CONN;
  const xSem = xCua + CW + CONN;
  const xFin = xSem + CW + CONN;
  const totalW = xFin + CW + PAD;

  const LH = 36;

  const ph = (id) => ({key:id,eq1:"Por definir",eq2:"Por definir",logo1:null,logo2:null,div1:null,div2:null,idaG1:null,idaG2:null,vtaG1:null,vtaG2:null,total1:0,total2:0,pen1:null,pen2:null,wonByPens:false,idaFin:false,vtaFin:false,hasVuelta:false,allFin:false,anyLive:false});
  const ensure = (arr, count, pfx) => {
    const padded = arr.length > 0 ? [...arr] : [];
    while (padded.length < count) padded.push(ph(`${pfx}${padded.length}`));
    return padded;
  };

  const octs = ensure(allOct, 8, "oct");
  const cuas = ensure(allCua, 4, "cua");
  const sems = ensure(allSem, 2, "sem");
  const fT   = ensure(allFin, 1, "fin")[0];

  const LC  = "rgba(255,0,77,0.30)";
  const LCH = "rgba(255,0,77,0.55)";
  const LG  = "rgba(245,158,11,0.50)";

  const cy = (cardY) => LH + cardY + CH/2;

  const connector = (fromCardY, toCardY, fromX, toX, key, color=LC, colorH=LCH) => {
    const y1   = cy(fromCardY);
    const y2   = cy(toCardY);
    const midX = fromX + CONN/2;
    const yTop = Math.min(y1,y2);
    const yBot = Math.max(y1,y2);
    return (
      <g key={key}>
        <line x1={fromX} y1={y1} x2={midX} y2={y1} stroke={color} strokeWidth="1.4"/>
        <line x1={midX} y1={yTop} x2={midX} y2={yBot} stroke={color} strokeWidth="1.4"/>
        <line x1={midX} y1={y2} x2={toX} y2={y2} stroke={colorH} strokeWidth="1.5"/>
        <circle cx={toX} cy={y2} r={2.5} fill={colorH}/>
      </g>
    );
  };

  const ColLabel = ({x,w,icon,title,isFinal=false}) => (
    <foreignObject x={x} y={0} width={w} height={LH}>
      <div xmlns="http://www.w3.org/1999/xhtml" style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",background:isFinal?C.goldDim:C.redDim,border:`1px solid ${isFinal?C.goldGlow:C.redGlow}`,borderRadius:4}}>
          {icon}
          <span style={{fontFamily:FF,fontSize:9,fontWeight:900,letterSpacing:"1.8px",color:isFinal?C.gold:"var(--color-accent)",textTransform:"uppercase"}}>{title}</span>
        </div>
      </div>
    </foreignObject>
  );

  const Card = ({tie,x,cardY,isFinal=false}) => (
    <foreignObject x={x} y={LH+cardY} width={CW} height={CH} style={{overflow:"visible"}}>
      <div xmlns="http://www.w3.org/1999/xhtml" style={{width:"100%",height:"100%",padding:"2px"}}>
        <BracketTie tie={tie} isFinal={isFinal}/>
      </div>
    </foreignObject>
  );

  const svgH = LH + totalH;
  const fw1=fT.allFin&&fT.total1>fT.total2;
  const fw2=fT.allFin&&fT.total2>fT.total1;
  const winner=fw1?fT.eq1:fw2?fT.eq2:null;
  const extraH = winner?90:28;

  return (
    <div style={{overflowX:"auto",paddingBottom:8,paddingTop:4,WebkitOverflowScrolling:"touch"}}>
      <svg width={totalW} height={svgH+extraH} viewBox={`0 0 ${totalW} ${svgH+extraH}`} style={{display:"block",overflow:"visible",minWidth:totalW}}>

        <ColLabel x={xOct} w={CW} icon={<IcnSword size={11} color="var(--color-accent)"/>} title="OCTAVOS"/>
        <ColLabel x={xCua} w={CW} icon={<IcnDiamond size={11} color="var(--color-accent)"/>} title="CUARTOS"/>
        <ColLabel x={xSem} w={CW} icon={<IcnStar size={11} color="var(--color-accent)"/>} title="SEMIFINALES"/>
        <ColLabel x={xFin} w={CW} icon={<IcnTrophy size={11} color={C.gold}/>} title="GRAN FINAL" isFinal/>

        {[0,1,2,3].map(i=>[
          connector(octY[i*2],   cuaY[i], xOct+CW, xCua, `oc${i*2}`,   LC, LCH),
          connector(octY[i*2+1], cuaY[i], xOct+CW, xCua, `oc${i*2+1}`, LC, LCH),
        ])}

        {[0,1].map(i=>[
          connector(cuaY[i*2],   semY[i], xCua+CW, xSem, `cs${i*2}`,   LC, LCH),
          connector(cuaY[i*2+1], semY[i], xCua+CW, xSem, `cs${i*2+1}`, LC, LCH),
        ])}

        {connector(semY[0], finY, xSem+CW, xFin, "sf0", LG, LG)}
        {connector(semY[1], finY, xSem+CW, xFin, "sf1", LG, LG)}

        {octs.map((t,i) => <Card key={t.key} tie={t} x={xOct} cardY={octY[i]}/>)}
        {cuas.map((t,i) => <Card key={t.key} tie={t} x={xCua} cardY={cuaY[i]}/>)}
        {sems.map((t,i) => <Card key={t.key} tie={t} x={xSem} cardY={semY[i]}/>)}
        <Card tie={fT} x={xFin} cardY={finY} isFinal/>

        {winner&&(
          <foreignObject x={xFin} y={LH+finY+CH+10} width={CW} height={80}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={{textAlign:"center"}}>
              <div style={{fontSize:8,fontWeight:900,color:C.gold,letterSpacing:"2px",textTransform:"uppercase",fontFamily:FF,marginBottom:6}}>{"\uD83C\uDFC6"} Campeón</div>
              <div style={{width:38,height:38,borderRadius:"50%",margin:"0 auto 6px",background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 18px rgba(245,158,11,0.5)"}}><IcnTrophy size={18} color="#fff"/></div>
              <div style={{fontSize:13,fontWeight:900,color:"var(--color-text-main)",fontFamily:FF,letterSpacing:"0.3px"}}>{winner}</div>
            </div>
          </foreignObject>
        )}
        {!winner&&(
          <foreignObject x={xFin} y={LH+finY+CH+10} width={CW} height={22}>
            <div xmlns="http://www.w3.org/1999/xhtml" style={{textAlign:"center",fontSize:9,color:C.faint,fontFamily:FF,letterSpacing:"1.5px",textTransform:"uppercase"}}>Por definir</div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

const GroupStandings = ({group,index,activeGroup}) => {
  const [expanded,setExpanded]=useState(false);
  const eqs=Array.isArray(group?.equipos)?group.equipos:[];
  const isActive=activeGroup==="all"||activeGroup===group.nombre;
  if(!eqs.length||!isActive)return null;
  const complete=eqs.some(e=>n(e.pj)>0)&&eqs.every(e=>n(e.pj)===3);
  return (
    <div className="glass-card" style={{animation:"fadeInUp .5s ease-out both",animationDelay:`${index*0.07}s`,borderRadius:10,overflow:"hidden",border:"1px solid rgba(255,255,255,0.08)",background:"var(--color-card-bg)",padding:0}}>
      <button onClick={()=>setExpanded(!expanded)} className="group-header" style={{width:"100%",padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,0,77,0.03)",borderBottom:"1px solid rgba(255,255,255,0.08)",border:"none",cursor:"pointer",transition:"background 0.2s",fontFamily:"inherit"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:7,background:"linear-gradient(135deg,var(--color-accent),#b91c1c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#fff",fontFamily:FF,boxShadow:`0 4px 12px ${C.redGlow}`}}>{s(group.nombre)}</div>
          <span style={{fontSize:14,fontWeight:800,color:"var(--color-text-main)",fontFamily:FF,letterSpacing:"0.5px"}}>GRUPO {s(group.nombre)}</span>
          {complete&&<span style={{fontSize:7,padding:"2px 7px",borderRadius:3,background:"rgba(34,197,94,0.1)",color:C.green,fontWeight:800,letterSpacing:"1px",fontFamily:FF,border:"1px solid rgba(34,197,94,0.2)"}}>COMPLETO</span>}
        </div>
        <IcnChevDown size={13} color={C.faint} st={{transform:expanded?"rotate(180deg)":"none",transition:"transform 0.25s"}}/>
      </button>
      {expanded&&(
        <div className="cp-group-table" style={{display:"block"}}>
          <table className="standings-table">
            <thead><tr style={{background:"rgba(0,0,0,0.15)"}}>{["#","EQUIPO","DIV","PJ","G","E","P","GF","GC","DG","PTS"].map((h,hi)=>{const cls=h==="DIV"?"cp-th-div":h==="GF"?"cp-th-gf":h==="GC"?"cp-th-gc":"";return(<th key={h} className={cls} style={{padding:"7px 10px",fontSize:7,fontWeight:900,color:C.faint,letterSpacing:"1.5px",textAlign:h==="EQUIPO"?"left":"center",fontFamily:FF,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>{h}</th>);})}</tr></thead>
            <tbody>{eqs.map((eq,i)=>{const dg=n(eq.gf)-n(eq.gc),q=i<2;return(<tr key={eq.id||i} style={{borderBottom:"1px solid rgba(255,255,255,0.08)",background:q?"rgba(255,0,77,0.04)":"transparent",borderLeft:q?`2px solid ${C.red}`:"2px solid transparent"}}><td style={{padding:"8px 10px",textAlign:"center",fontSize:13,fontWeight:900,color:q?"var(--color-accent)":C.faint,fontFamily:FF}}>{i+1}</td><td style={{padding:"8px 10px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Logo logo={eq.logo} name={eq.nombre} size={24}/><span className="cp-team-name" style={{fontSize:11,fontWeight:600,color:"var(--color-text-main)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:120,fontFamily:FF,letterSpacing:"0.3px"}}>{s(eq.nombre)}</span></div></td><td className="cp-td-div" style={{padding:"8px 10px",textAlign:"center"}}><DivBadge division={eq.division}/></td>{[eq.pj,eq.g,eq.e,eq.p,eq.gf,eq.gc].map((v,j)=>{const cls=j===3?"cp-td-gf":j===4?"cp-td-gc":"";return(<td key={j} className={cls} style={{padding:"8px 10px",textAlign:"center",fontSize:12,color:C.muted,fontFamily:FF}}>{n(v)}</td>);})}<td style={{padding:"8px 10px",textAlign:"center",fontSize:12,fontWeight:700,fontFamily:FF,color:dg>0?C.green:dg<0?"var(--color-accent)":C.muted}}>{dg>0?`+${dg}`:dg}</td><td style={{padding:"8px 10px",textAlign:"center",fontSize:16,fontWeight:900,color:q?"var(--color-accent)":"var(--color-text-main)",fontFamily:FF}}>{n(eq.pts)}</td></tr>);})}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatBox = ({label,value,sub,color=C.red,i=0}) => (
  <div style={{animation:"scaleIn .5s cubic-bezier(.34,1.56,.64,1) both",animationDelay:`${i*0.1}s`,textAlign:"center",padding:"20px 14px",background:"rgba(255,255,255,0.03)",borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",height:2,width:40,background:color,borderRadius:1}}/>
    <div style={{fontSize:36,fontWeight:900,lineHeight:1,fontFamily:FF,letterSpacing:"-1px",color:"var(--color-text-main)"}}>{n(value)}</div>
    <div style={{fontSize:9,fontWeight:800,color,letterSpacing:"2px",marginTop:5,textTransform:"uppercase",fontFamily:FF}}>{label}</div>
    <div style={{fontSize:8,color:C.faint,marginTop:3,fontFamily:FF}}>{sub}</div>
  </div>
);

const LiveTicker = ({matches}) => {
  const live=matches.filter(m=>m.estado==="En Curso");
  if(!live.length)return null;
  return (<div style={{animation:"fadeIn .5s ease-out",background:C.redDim,borderTop:`1px solid ${C.redGlow}`,borderBottom:`1px solid ${C.redGlow}`,padding:"8px 0",overflow:"hidden",position:"relative"}}><div style={{display:"flex",alignItems:"center"}}><div className="cp-ticker-label" style={{flexShrink:0,padding:"0 16px",fontSize:8,fontWeight:900,letterSpacing:"2.5px",color:"var(--color-accent)",fontFamily:FF,borderRight:`1px solid ${C.redGlow}`,display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:"var(--color-accent)",display:"inline-block",animation:"livePulse 1s infinite",boxShadow:`0 0 8px ${C.redGlow}`}}/>EN VIVO</div><div style={{flex:1,overflow:"hidden",padding:"0 16px"}}><div className="cp-ticker-match" style={{display:"flex",gap:40,animation:`ticker ${live.length*8}s linear infinite`}}>{[...live,...live].map((m,i)=>(<span key={i} style={{whiteSpace:"nowrap",fontSize:11,color:C.muted,fontFamily:FF,letterSpacing:"0.3px"}}><span style={{color:"var(--color-text-main)",fontWeight:700}}>{s(m.team1)}</span><span style={{color:"var(--color-accent)",fontWeight:900,margin:"0 8px"}}>{n(m.goles_local)} {"\u2013"} {n(m.goles_visitante)}</span><span style={{color:"var(--color-text-main)",fontWeight:700}}>{s(m.team2)}</span></span>))}</div></div></div></div>);
};

const Empty = ({icon,title,sub}) => (<div style={{textAlign:"center",padding:"70px 20px"}}><div style={{marginBottom:16,color:C.faint,opacity:0.4}}>{icon}</div><div style={{fontSize:15,fontWeight:800,color:C.faint,margin:"0 0 7px",fontFamily:FF,letterSpacing:"1px"}}>{title}</div>{sub&&<div style={{fontSize:10,color:C.faint,opacity:0.6}}>{sub}</div>}</div>);

export default function CopaPresidente() {
  const [view,setView]=useState("tabla");
  const [gFilter,setGFilter]=useState("all");
  const [groups,setGroups]=useState([]);
  const [matches,setMatches]=useState([]);
  const [stats,setStats]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  const loadData=useCallback(async()=>{
    setLoading(true);setError(null);
    try{
      const [rG,rM,rS]=await Promise.allSettled([API.groups,API.matches,API.stats].map(url=>window.fetch(url).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();})));
      if(rG.status==="fulfilled"&&rG.value?.success)setGroups(Array.isArray(rG.value.data)?rG.value.data:[]);else setGroups([]);
      if(rM.status==="fulfilled"&&rM.value?.success)setMatches(Array.isArray(rM.value.data)?rM.value.data:[]);else setMatches([]);
      if(rS.status==="fulfilled"&&rS.value?.success)setStats(rS.value.data||{});else setStats(null);
    }catch(e){setError(e.message);}finally{setLoading(false);}
  },[]);

  useEffect(()=>{loadData();},[loadData]);
  useEffect(()=>{const hasLive=matches.some(m=>m.estado==="En Curso");if(!hasLive)return;const id=setInterval(loadData,20000);return()=>clearInterval(id);},[matches,loadData]);

  const gMatches=useMemo(()=>matches.filter(m=>m.fase==="grupos"),[matches]);
  const koPhase=useMemo(()=>{const m={};["octavos","cuartos","semis","final"].forEach(f=>{m[f]=matches.filter(x=>x.fase===f);});return m;},[matches]);
  const gLetters=useMemo(()=>[...new Set(gMatches.map(m=>m.grupo).filter(Boolean))].sort(),[gMatches]);
  const filtered=useMemo(()=>{let m=gMatches;if(gFilter!=="all")m=m.filter(x=>x.grupo===gFilter);return [...m].sort((a,b)=>{if(!a.fecha&&!b.fecha)return 0;if(!a.fecha)return 1;if(!b.fecha)return -1;return a.fecha.localeCompare(b.fecha)||(a.hora||"").localeCompare(b.hora||"");});},[gMatches,gFilter]);
  const hStats=useMemo(()=>[{label:"Equipos",value:n(stats?.equipos)||24,sub:"2 divisiones",color:"var(--color-accent)"},{label:"Grupos",value:gLetters.length||6,sub:"4 equipos c/u",color:C.gold},{label:"Partidos",value:n(stats?.total,matches.length),sub:"total",color:"#60a5fa"},{label:"Goles",value:n(stats?.goles),sub:"anotados",color:"var(--color-success)"}],[stats,matches,gLetters]);

  // Calcular mejores terceros para tabla
  const mejoresTercerosPub = useMemo(() => {
    const terceros = [];
    groups.forEach(g => {
      const eqs = Array.isArray(g?.equipos) ? g.equipos : [];
      if (eqs.length >= 3) terceros.push({ ...eqs[2], grupo: g.nombre });
    });
    terceros.sort((a, b) => (b.pts||0) - (a.pts||0) || ((b.gf||0)-(b.gc||0)) - ((a.gf||0)-(a.gc||0)) || (b.gf||0) - (a.gf||0));
    return terceros;
  }, [groups]);

  const hasLive=matches.some(m=>m.estado==="En Curso");
  const hasKoData=koPhase.octavos.length||koPhase.cuartos.length||koPhase.semis.length||koPhase.final.length;

  return (
    <>
      <Header/>
      <section className="table-section" style={{paddingBottom:0}}>

        <div style={{position:"relative",minHeight:380,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"100px 24px 50px"}}>
          <HeroBg/>
          <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:700,width:"100%"}}>
            <div style={{animation:"fadeInUp .5s ease-out .1s both",display:"inline-flex",alignItems:"center",gap:8,fontSize:8,fontWeight:900,letterSpacing:"4px",color:"var(--color-accent)",textTransform:"uppercase",marginBottom:16,fontFamily:FF,padding:"4px 14px",borderRadius:4,border:"1px solid rgba(255,0,77,0.4)",background:"rgba(255,0,77,0.1)"}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"var(--color-accent)",animation:"livePulse 1.5s infinite"}}/>Torneo Oficial · El Salvador
            </div>
            <h1 style={{animation:"fadeInUp .6s ease-out .2s both",margin:"0 0 8px",fontSize:"clamp(3rem,9vw,5.5rem)",fontWeight:900,lineHeight:0.88,fontFamily:FF,letterSpacing:"-2px",textTransform:"uppercase"}}>
              <span style={{color:"var(--color-text-main)"}}>COPA </span>
              <span style={{background:"linear-gradient(135deg,var(--color-accent),#ff6b35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 20px rgba(255,0,77,0.4))"}}>PRESIDENTE</span>
            </h1>
            <div style={{animation:"fadeIn .7s ease-out .3s both",width:60,height:2,margin:"16px auto",background:"linear-gradient(90deg,transparent,var(--color-accent),transparent)"}}/>
            <p style={{animation:"fadeInUp .6s ease-out .3s both",color:C.muted,fontSize:13,lineHeight:1.6,maxWidth:420,margin:"0 auto"}}>Primera y Liga de Ascenso unidas por la gloria del fútbol salvadoreño</p>
            {hasLive&&(<div style={{animation:"fadeInUp .6s ease-out .4s both",display:"inline-flex",alignItems:"center",gap:8,marginTop:18,padding:"6px 16px",borderRadius:4,background:C.redDim,border:`1px solid ${C.redGlow}`}}><span style={{width:7,height:7,borderRadius:"50%",background:"var(--color-accent)",animation:"livePulse 1s infinite",boxShadow:`0 0 8px ${C.redGlow}`}}/><span style={{fontSize:9,fontWeight:900,color:"var(--color-accent)",letterSpacing:"2.5px",fontFamily:FF}}>PARTIDO EN VIVO</span></div>)}
            <div className="cp-hero-stats" style={{animation:"fadeInUp .7s ease-out .5s both",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:30}}>
              {!loading?hStats.map((st,i)=><StatBox key={st.label} {...st} i={i}/>):[0,1,2,3].map(i=>(<div key={i} style={{textAlign:"center",padding:"20px 12px"}}><Sk w="55%" h={32} r={4}/><div style={{marginTop:6}}><Sk w="75%" h={9} r={3}/></div></div>))}
            </div>
          </div>
        </div>

        <LiveTicker matches={matches}/>

        <div className="container" style={{maxWidth:1100,padding:"28px 16px 64px"}}>
          {error&&(<div style={{textAlign:"center",padding:"70px 0"}}><div style={{fontSize:10,color:"var(--color-accent)",marginBottom:12,fontFamily:FF,letterSpacing:"2px"}}>ERROR AL CARGAR DATOS</div><button onClick={loadData} style={{padding:"9px 24px",borderRadius:5,border:"1px solid rgba(255,0,77,0.4)",background:"rgba(255,0,77,0.1)",color:"var(--color-accent)",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:FF,letterSpacing:"1.5px"}}>REINTENTAR</button></div>)}
          {!error&&(
            <div style={{animation:"fadeInUp .35s ease-out"}}>

              <div className="cp-section-divider" style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
                <div style={{width:38,height:38,borderRadius:9,background:"linear-gradient(135deg,var(--color-accent),#b91c1c)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(255,0,77,0.35)",flexShrink:0}}>{phaseIcon("grupos",16,"#fff")}</div>
                <div>
                  <h2 style={{margin:0,color:"var(--color-text-main)",fontSize:20,fontWeight:900,fontFamily:FF,letterSpacing:"0.5px",textTransform:"uppercase"}}>Fase de Grupos</h2>
                  <span style={{fontSize:9,color:C.faint,fontFamily:FF,letterSpacing:"1px"}}>{gMatches.length} partidos · {groups.length} grupos</span>
                </div>
              </div>

              <div className="cp-filters-row" style={{animation:"fadeIn .3s ease-out",display:"flex",gap:10,marginBottom:22,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,padding:3,gap:2}}>
                  <button className={`view-btn${view==="tabla"?" active":""}`} onClick={()=>setView("tabla")}><IcnTable size={11} color="currentColor"/>TABLA</button>
                  <button className={`view-btn${view==="partidos"?" active":""}`} onClick={()=>setView("partidos")}><IcnFutbol size={11} color="currentColor"/>PARTIDOS</button>
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                  <button className={`gf-btn${gFilter==="all"?" active":""}`} onClick={()=>setGFilter("all")}>TODOS</button>
                  {gLetters.map(g=><button key={g} className={`gf-btn${gFilter===g?" active":""}`} onClick={()=>setGFilter(g)}>GRP {g}</button>)}
                </div>
              </div>
              {view==="tabla"&&(loading?<div style={{color:C.muted}}>Cargando...</div>:groups.length>0?<><div style={{display:"flex",flexDirection:"column",gap:8}}>{groups.map((g,i)=><GroupStandings key={g.nombre} group={g} index={i} activeGroup={gFilter}/>)}</div>
                {/* Tabla de mejores terceros */}
                {gFilter==="all" && mejoresTercerosPub.length > 0 && (<div style={{marginTop:20,animation:"fadeInUp .4s ease-out both",borderRadius:10,overflow:"hidden",border:"1px solid rgba(245,158,11,0.25)",background:"var(--color-card-bg)"}}>
                  <div style={{padding:"11px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(245,158,11,0.06)",borderBottom:"1px solid rgba(245,158,11,0.15)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff",fontFamily:FF,boxShadow:"0 3px 10px rgba(245,158,11,0.3)"}}>3</div>
                      <span style={{fontSize:13,fontWeight:800,color:"#f59e0b",fontFamily:FF,letterSpacing:"0.5px"}}>MEJORES TERCEROS</span>
                    </div>
                    <span style={{fontSize:9,color:"#64748b",fontFamily:FF}}>Top 4 clasifican a octavos</span>
                  </div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",minWidth:520}}>
                      <thead><tr style={{background:"rgba(0,0,0,0.15)"}}>{["#","EQUIPO","GRP","PJ","G","E","P","GF","GC","DG","PTS"].map(h=><th key={h} style={{padding:"7px 8px",fontSize:"7px",fontWeight:900,color:C.faint,letterSpacing:"1px",textAlign:h==="EQUIPO"?"left":"center",fontFamily:FF,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>{h}</th>)}</tr></thead>
                      <tbody>{mejoresTercerosPub.map((eq,i)=>{const dg=n(eq.gf)-n(eq.gc),q=i<4;return(<tr key={eq.id||i} style={{borderBottom:"1px solid rgba(255,255,255,0.08)",background:q?"rgba(245,158,11,0.04)":"transparent",borderLeft:q?"2px solid #f59e0b":"2px solid transparent"}}><td style={{padding:"8px 10px",textAlign:"center",fontSize:13,fontWeight:900,color:q?"#f59e0b":C.faint,fontFamily:FF}}>{q?"◆":""}{i+1}</td><td className="team-cell" style={{padding:"8px 10px"}}><div className="team-logo"><img className="team-logo-img" src={lg(eq.logo)||""} alt="" onError={e=>{e.target.style.display="none";}}/></div><span style={{fontSize:11,fontWeight:600,color:"var(--color-text-main)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:120,fontFamily:FF}}>{s(eq.nombre)}</span></td><td style={{padding:"8px 10px",textAlign:"center",fontSize:12,fontWeight:800,color:"#f59e0b",fontFamily:FF}}>{s(eq.grupo)}</td>{[eq.pj,eq.g,eq.e,eq.p,eq.gf,eq.gc].map((v,j)=><td key={j} style={{padding:"8px 10px",textAlign:"center",fontSize:12,color:C.muted,fontFamily:FF}}>{n(v)}</td>)}<td style={{padding:"8px 10px",textAlign:"center",fontSize:12,fontWeight:700,fontFamily:FF,color:dg>0?C.green:dg<0?"var(--color-accent)":C.muted}}>{dg>0?`+${dg}`:dg}</td><td style={{padding:"8px 10px",textAlign:"center",fontSize:16,fontWeight:900,color:q?"#f59e0b":"var(--color-text-main)",fontFamily:FF}}>{n(eq.pts)}</td></tr>);})}</tbody>
                    </table>
                  </div>
                </div>)}</>:<Empty icon={<IcnHex size={44} color={C.faint}/>} title="GRUPOS POR DEFINIR"/>)}
              {view==="partidos"&&(loading?<div>Cargando...</div>:filtered.length>0?<div className="cp-match-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>{filtered.map((m,i)=><MatchCard key={m.id||i} match={m} i={i}/>)}</div>:<Empty icon={<IcnFutbol size={44} color={C.faint}/>} title="SIN PARTIDOS"/>)}

              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)",margin:"48px 0 36px"}}/>

              <div className="cp-bracket-section" style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{animation:"fadeInUp .35s ease-out",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:40,height:40,borderRadius:9,background:"linear-gradient(135deg,var(--color-accent),#b91c1c)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 20px rgba(255,0,77,0.4)",flexShrink:0}}><IcnTrophy size={18} color="#fff"/></div>
                  <div>
                    <h2 style={{margin:0,color:"var(--color-text-main)",fontSize:22,fontWeight:900,fontFamily:FF,letterSpacing:"1px",textTransform:"uppercase"}}>Llave del Torneo</h2>
                    <span style={{fontSize:9,color:C.faint,fontFamily:FF,letterSpacing:"1px"}}>{hasKoData?"Octavos → Cuartos → Semis → Gran Final · Ida y Vuelta":"Aún sin datos de fase eliminatoria"}</span>
                  </div>
                </div>
                {loading&&<div style={{color:C.muted,fontFamily:FF,letterSpacing:"1px"}}>Cargando bracket...</div>}
                {!loading&&(
                  <div className="cp-bracket-wrap glass-card" style={{background:"rgba(255,255,255,0.01)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"28px 16px 24px",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
                    <TournamentBracket octavos={koPhase.octavos} cuartos={koPhase.cuartos} semis={koPhase.semis} final={koPhase.final}/>
                  </div>
                )}
                {!loading&&!hasKoData&&<Empty icon={<IcnLock size={44} color={C.faint}/>} title="AÚN NO DISPONIBLE" sub="Se habilitará cuando clasifiquen los equipos de la Fase de Grupos"/>}
              </div>

            </div>
          )}
        </div>
      </section>
      <Footer/>

      <style>{`
        ${"@keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(1.8)}}"}
        ${"@keyframes sk{0%{background-position:-600px 0}100%{background-position:600px 0}}"}
        ${"@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}"}
        ${"@keyframes fadeInUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}"}
        ${"@keyframes fadeIn{from{opacity:0}to{opacity:1}}"}
        ${"@keyframes scaleIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}"}
        ${"@keyframes glowPulse{0%,100%{box-shadow:0 0 4px rgba(255,0,77,.2)}50%{box-shadow:0 0 14px rgba(255,0,77,.45)}}"}
        .phase-btn{padding:12px 20px;border:none;cursor:pointer;font-family:var(--font-heading);font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;transition:all .25s cubic-bezier(.4,0,.2,1);white-space:nowrap;background:transparent;color:#64748b;border-bottom:3px solid transparent;display:flex;align-items:center;gap:8px;}
        .phase-btn:hover{color:#94a3b8;}
        .phase-btn.active{color:var(--color-accent);border-bottom-color:var(--color-accent);text-shadow:0 0 20px rgba(255,0,77,.25);}
        .gf-btn{padding:6px 14px;border-radius:6px;cursor:pointer;font-family:var(--font-heading);font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;transition:all .2s cubic-bezier(.4,0,.2,1);border:1px solid rgba(255,255,255,0.08);background:transparent;color:#64748b;}
        .gf-btn:hover{border-color:rgba(255,255,255,0.15);color:#94a3b8;}
        .gf-btn.active{background:rgba(255,0,77,0.1);border-color:rgba(255,0,77,0.4);color:var(--color-accent);}
        .view-btn{padding:8px 14px;border:none;cursor:pointer;font-family:var(--font-heading);font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;transition:all .2s cubic-bezier(.4,0,.2,1);border-radius:6px;background:transparent;color:#64748b;display:flex;align-items:center;gap:6px;}
        .view-btn:hover{color:#94a3b8;}
        .view-btn.active{background:rgba(255,0,77,0.1);color:var(--color-accent);}
        .group-header:hover{background:rgba(255,0,77,0.06)!important;}
        .group-header:hover .cp-grp-letter{animation:glowPulse 1.2s ease-in-out infinite!important;}
        .match-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.5),0 0 0 1px rgba(255,0,77,0.4)!important;}
        .match-card .cp-match-grp{transition:all .2s;}
        .match-card:hover .cp-match-grp{background:rgba(255,0,77,0.2)!important;border-color:var(--color-accent)!important;}
        .gf-btn,.view-btn{position:relative;overflow:hidden;}
        .gf-btn::after,.view-btn::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at center,var(--color-accent),transparent 70%);opacity:0;transition:opacity .35s;}
        .gf-btn:hover::after,.view-btn:hover::after{opacity:.08;}
        .phase-btn{position:relative;}
        .phase-btn::after{content:"";position:absolute;bottom:-3px;left:50%;width:0;height:3px;background:var(--color-accent);border-radius:3px 3px 0 0;transition:all .3s cubic-bezier(.4,0,.2,1);transform:translateX(-50%);}
        .phase-btn.active::after{width:60%;}
        .phase-btn:hover:not(.active){color:#94a3b8;}

        @media(max-width:768px){
          .cp-hero{min-height:380px!important;padding:80px 16px 40px!important}
          .cp-hero-title{font-size:clamp(2.2rem,8vw,3.5rem)!important}
          .cp-hero-stats{grid-template-columns:repeat(2,1fr)!important;gap:8px!important}
          .cp-content{padding:20px 12px 48px!important}
          .cp-filters-row{flex-direction:column!important;gap:10px!important;align-items:stretch!important}
          .cp-match-grid{grid-template-columns:1fr!important;gap:10px!important}
          .cp-group-table{display:block!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch!important}
          .cp-group-table table{min-width:520px!important}
          .cp-group-table th,.cp-group-table td{padding:6px 7px!important;font-size:10px!important}
          .cp-th-div,.cp-td-div{display:none!important}
          .cp-th-gf,.cp-td-gf,.cp-th-gc,.cp-td-gc{display:none!important}
          .cp-team-name{max-width:90px!important;font-size:10px!important}
          .cp-phase-bar{justify-content:flex-start!important;-webkit-overflow-scrolling:touch}
          .phase-btn{padding:10px 12px!important;font-size:10px!important;letter-spacing:1px!important;gap:5px!important}
          .gf-btn{padding:5px 10px!important;font-size:9px!important;letter-spacing:1px!important}
          .view-btn{padding:6px 10px!important;font-size:9px!important;letter-spacing:1px!important}
          .cp-bracket-wrap{padding:16px 8px 16px!important}
          .cp-bracket-section{gap:10px!important;margin-bottom:18px!important}
          .cp-bracket-section h2{font-size:17px!important;letter-spacing:0.5px!important}
          .cp-ticker-label{padding:0 10px!important;font-size:7px!important;letter-spacing:1.5px!important}
          .cp-ticker-match{font-size:10px!important;gap:24px!important}
          .cp-match-card-grid{gap:8px!important}
          .cp-match-logo{width:32px!important;height:32px!important}
          .cp-match-team-name{max-width:70px!important;font-size:11px!important}
          .cp-match-score{font-size:24px!important;min-width:65px!important}
          .cp-match-vs{font-size:10px!important;letter-spacing:3px!important}
        }
        @media(max-width:480px){
          .cp-hero{min-height:340px!important;padding:74px 12px 32px!important}
          .cp-hero-title{font-size:clamp(1.8rem,7vw,2.8rem)!important}
          .phase-btn{padding:8px 8px!important;font-size:9px!important;letter-spacing:0.8px!important;gap:4px!important}
          .cp-group-table table{min-width:380px!important}
          .cp-team-name{max-width:75px!important;font-size:9px!important}
          .gf-btn{padding:4px 8px!important;font-size:8px!important}
          .view-btn{padding:5px 8px!important;font-size:8px!important}
          .cp-match-logo{width:28px!important;height:28px!important}
          .cp-match-team-name{max-width:60px!important;font-size:10px!important}
          .cp-match-score{font-size:20px!important;min-width:55px!important}
          .cp-match-meta{font-size:8px!important}
          .cp-match-grp{font-size:8px!important;padding:1px 6px!important}
        }
      `}</style>
    </>
  );
}
