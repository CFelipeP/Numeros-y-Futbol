import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

/* ═══════════════════════════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════════════════════════ */
const BASE = "http://numeros-y-futbol.test/backend/";
const API = {
  groups:  `${BASE}copa_get_groups.php`,
  matches: `${BASE}copa_get_matches.php`,
  stats:   `${BASE}copa_get_stats.php`,
};

const PHASES = [
  { key:"grupos",  label:"Fase de Grupos",  short:"Grupos"  },
  { key:"octavos", label:"Octavos de Final", short:"Octavos" },
  { key:"cuartos", label:"Cuartos de Final", short:"Cuartos" },
  { key:"semis",   label:"Semifinales",      short:"Semis"   },
  { key:"final",   label:"Gran Final",       short:"Final"   },
];

const DIV = {
  Primera: { color:"#ff3a3a", glow:"rgba(255,58,58,0.4)",  label:"1ª", gradient:"linear-gradient(135deg,#ff3a3a,#b91c1c)" },
  Segunda: { color:"#3b82f6", glow:"rgba(59,130,246,0.4)", label:"2ª", gradient:"linear-gradient(135deg,#3b82f6,#1d4ed8)" },
  Tercera: { color:"#10b981", glow:"rgba(16,185,129,0.4)", label:"3ª", gradient:"linear-gradient(135deg,#10b981,#065f46)" },
};

const STATUS = {
  Finalizado: { color:"#10b981", bg:"rgba(16,185,129,0.08)", border:"rgba(16,185,129,0.3)",  dot:"#10b981", label:"FT"       },
  "En Curso":  { color:"#ff3a3a", bg:"rgba(255,58,58,0.08)",  border:"rgba(255,58,58,0.3)",   dot:"#ff3a3a", label:"LIVE"     },
  Pendiente:   { color:"#94a3b8", bg:"rgba(148,163,184,0.06)", border:"rgba(148,163,184,0.2)", dot:"#475569", label:"Prox." },
};

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
const n  = (v,fb=0)     => (v===null||v===undefined||v===""||isNaN(+v))?fb:+v;
const s  = (v,fb="")   => v!=null?String(v):fb;
const lg = (p)         => (!p||typeof p!=="string")?null:p.startsWith("http")?p:`${BASE}${p}`;

const fDate = (d) => {
  if (!d) return null;
  try { return new Date(d+"T00:00:00").toLocaleDateString("es-SV",{day:"2-digit",month:"short"}); }
  catch { return null; }
};
const fTime = (t) => { if(!t)return null; const p=String(t).split(":"); return p.length<2?null:`${p[0]}:${p[1]}`; };

/* ═══════════════════════════════════════════════════════════════════
   SVG ICONS (sin emojis)
═══════════════════════════════════════════════════════════════════ */
const IcnHex = ({size=14,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z"/></svg>
);
const IcnSword = ({size=14,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 3L5 12.5"/><path d="M5 12.5L2 18l5.5-3"/><path d="M9.5 14.5L21 3"/><path d="M21 3l-3 3"/><path d="M14.5 3l3 3"/></svg>
);
const IcnDiamond = ({size=14,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 10-8 10-8-10L12 2z"/></svg>
);
const IcnStar = ({size=14,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
);
const IcnTrophy = ({size=14,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H3V6a1 1 0 011-1h2"/><path d="M18 9h3V6a1 1 0 00-1-1h-2"/><path d="M6 5h12v7a6 6 0 01-12 0V5z"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
);
const IcnFutbol = ({size=14,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2l2.5 5.5L20 9l-4 3.5 1 5.5-5-2.8-5 2.8 1-5.5L4 9l5.5-1.5z"/></svg>
);
const IcnLock = ({size=14,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
);
const IcnTable = ({size=14,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/></svg>
);
const IcnChevDown = ({size=12,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
);
const IcnCheck = ({size=12,color="currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
);

const phaseIcon = (key, size=14, color="currentColor") => {
  switch(key){
    case "grupos":  return <IcnHex size={size} color={color}/>;
    case "octavos": return <IcnSword size={size} color={color}/>;
    case "cuartos": return <IcnDiamond size={size} color={color}/>;
    case "semis":   return <IcnStar size={size} color={color}/>;
    case "final":   return <IcnTrophy size={size} color={color}/>;
    default: return null;
  }
};

/* ═══════════════════════════════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════════════════════════════ */
const HeroBg = () => (
  <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:0.25}} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="rg1" cx="25%" cy="35%"><stop offset="0%" stopColor="#ff3a3a" stopOpacity="0.18"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <radialGradient id="rg2" cx="80%" cy="75%"><stop offset="0%" stopColor="#e2b340" stopOpacity="0.06"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <pattern id="hx" x="0" y="0" width="56" height="49" patternUnits="userSpaceOnUse">
        <polygon points="28,1 55,13 55,36 28,48 1,36 1,13" fill="none" stroke="#fff" strokeWidth="0.25" strokeOpacity="0.05"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#rg1)"/><rect width="100%" height="100%" fill="url(#rg2)"/><rect width="100%" height="100%" fill="url(#hx)"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   TEAM LOGO
═══════════════════════════════════════════════════════════════════ */
const Logo = ({logo,name,size=36,glow}) => {
  const src = lg(logo);
  return (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",boxShadow:glow?`0 0 14px ${glow}`:undefined,transition:"box-shadow 0.3s"}}>
      {src
        ? <img src={src} alt={s(name)} style={{width:size-10,height:size-10,objectFit:"contain"}} onError={e=>{e.target.style.display="none";}}/>
        : <IcnFutbol size={size*0.4} color="rgba(255,255,255,0.08)"/>
      }
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   DIVISION BADGE
═══════════════════════════════════════════════════════════════════ */
const DivBadge = ({division}) => {
  const d = DIV[division] || {color:"#64748b",label:"?",gradient:"linear-gradient(135deg,#64748b,#334155)"};
  return (
    <span style={{fontSize:7,padding:"1px 4px",borderRadius:3,fontWeight:900,letterSpacing:"0.5px",fontFamily:"'Barlow Condensed',sans-serif",background:d.gradient,color:"#fff",whiteSpace:"nowrap",textShadow:"0 1px 2px rgba(0,0,0,0.5)",lineHeight:1.4}}>{d.label}</span>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   STATUS PILL
═══════════════════════════════════════════════════════════════════ */
const StatusPill = ({status}) => {
  const st = STATUS[status] || STATUS.Pendiente;
  const live = status==="En Curso";
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:8,fontWeight:800,letterSpacing:"1.5px",textTransform:"uppercase",padding:"2px 6px",borderRadius:3,background:st.bg,color:st.color,border:`1px solid ${st.border}`,fontFamily:"'Barlow Condensed',sans-serif"}}>
      <span style={{width:4,height:4,borderRadius:"50%",background:st.dot,flexShrink:0,animation:live?"livePulse 1s infinite":"none"}}/>
      {st.label}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════════════════════════════ */
const Sk = ({w="100%",h=14,r=4}) => (
  <div style={{width:w,height:h,borderRadius:r,background:"linear-gradient(90deg,#0c1220 25%,#151f32 50%,#0c1220 75%)",backgroundSize:"600px 100%",animation:"sk 1.4s linear infinite"}}/>
);

/* ═══════════════════════════════════════════════════════════════════
   MATCH CARD (grupos)
═══════════════════════════════════════════════════════════════════ */
const MatchCard = ({match,i}) => {
  const [hov, setHov] = useState(false);
  const fin  = match.estado==="Finalizado";
  const live = match.estado==="En Curso";
  const gl   = n(match.goles_local);
  const gv   = n(match.goles_visitante);
  const lw = fin && gl>gv;
  const vw = fin && gv>gl;

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.35,delay:i*0.04}} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{position:"relative",borderRadius:10,overflow:"hidden",cursor:"default",transition:"transform 0.25s,box-shadow 0.25s",transform:hov?"translateY(-2px)":"none",boxShadow:hov?"0 12px 32px rgba(0,0,0,0.5),0 0 0 1px rgba(255,58,58,0.15)":"0 2px 12px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.04)",background:"#0d1321"}}>
        <div style={{height:2,background:live?"linear-gradient(90deg,transparent,#ff3a3a,transparent)":fin?"linear-gradient(90deg,transparent,#10b981,transparent)":"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px 7px",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:8,fontWeight:800,letterSpacing:"1px",color:"#ff3a3a",background:"rgba(255,58,58,0.08)",padding:"2px 6px",borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif"}}>GRP {s(match.grupo)}</span>
            {(fDate(match.fecha)||fTime(match.hora))&&<span style={{fontSize:9,color:"#1e293b",fontWeight:500}}>{fDate(match.fecha)}{fTime(match.hora)?` · ${fTime(match.hora)}`:""}</span>}
          </div>
          <StatusPill status={match.estado}/>
        </div>
        <div style={{padding:"12px 12px 10px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Logo logo={match.logo1} name={match.team1} size={36} glow={lw?"rgba(16,185,129,0.25)":undefined}/>
              <div><div style={{fontSize:11,fontWeight:lw?700:500,color:lw?"#e2e8f0":"#64748b",lineHeight:1.2,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.3px"}}>{s(match.team1)||"Por definir"}</div><DivBadge division={match.division1}/></div>
            </div>
            <div style={{textAlign:"center",minWidth:64}}>
              {fin?<div><div style={{fontSize:26,fontWeight:900,letterSpacing:3,fontFamily:"'Barlow Condensed',sans-serif",background:"linear-gradient(180deg,#e2e8f0,#64748b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{gl}<span style={{WebkitTextFillColor:"rgba(255,255,255,0.1)"}}> – </span>{gv}</div></div>
              :live?<div><div style={{fontSize:22,fontWeight:900,letterSpacing:2,fontFamily:"'Barlow Condensed',sans-serif",color:"#ff3a3a"}}>{gl} – {gv}</div><div style={{fontSize:7,color:"#ff3a3a",letterSpacing:"1px",animation:"livePulse 1s infinite",marginTop:1}}>EN VIVO</div></div>
              :<div style={{fontSize:14,fontWeight:900,color:"#151f32",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:4}}>VS</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexDirection:"row-reverse",textAlign:"right"}}>
              <Logo logo={match.logo2} name={match.team2} size={36} glow={vw?"rgba(16,185,129,0.25)":undefined}/>
              <div><div style={{fontSize:11,fontWeight:vw?700:500,color:vw?"#e2e8f0":"#64748b",lineHeight:1.2,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.3px"}}>{s(match.team2)||"Por definir"}</div><DivBadge division={match.division2}/></div>
            </div>
          </div>
        </div>
        {fin&&(lw||vw)&&<div style={{padding:"4px 12px",fontSize:8,fontWeight:700,letterSpacing:"1px",color:"#10b981",background:"rgba(16,185,129,0.05)",borderTop:"1px solid rgba(16,185,129,0.08)",fontFamily:"'Barlow Condensed',sans-serif",textAlign:"center"}}>GANADOR: {lw?s(match.team1):s(match.team2)}</div>}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MINI MATCH CARD (para la llave)
═══════════════════════════════════════════════════════════════════ */
const MiniMatchCard = ({match,isFinal,dimmed}) => {
  const fin  = match.estado==="Finalizado";
  const live = match.estado==="En Curso";
  const gl   = n(match.goles_local);
  const gv   = n(match.goles_visitante);
  const lw   = fin && gl>gv;
  const vw   = fin && gv>gl;

  const accent = isFinal?"#e2b340":"#ff3a3a";
  const baseBg = "#0d1321";

  return (
    <div style={{
      width:"100%",borderRadius:6,overflow:"hidden",
      border:`1px solid ${isFinal?"rgba(226,179,64,0.15)":"rgba(255,255,255,0.05)"}`,
      background:baseBg,opacity:dimmed?0.4:1,
      transition:"opacity 0.3s",
      boxShadow:isFinal?"0 0 20px rgba(226,179,64,0.1)":"none"
    }}>
      {isFinal&&<div style={{height:2,background:"linear-gradient(90deg,transparent,#e2b340,transparent)"}}/>}
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",background:lw?"rgba(16,185,129,0.04)":"transparent",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
        <Logo logo={match.logo1} name={match.team1} size={22}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:9,fontWeight:lw?700:400,color:lw?"#e2e8f0":"#475569",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.2px",lineHeight:1.2}}>{s(match.team1)||"Por definir"}</div>
        </div>
        <DivBadge division={match.division1}/>
        <span style={{fontSize:13,fontWeight:900,minWidth:16,textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",color:(fin||live)?(lw?"#10b981":fin?"#334155":"#ff3a3a"):"#151f32"}}>{(fin||live)?gl:"-"}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 8px",background:vw?"rgba(16,185,129,0.04)":"transparent"}}>
        <Logo logo={match.logo2} name={match.team2} size={22}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:9,fontWeight:vw?700:400,color:vw?"#e2e8f0":"#475569",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.2px",lineHeight:1.2}}>{s(match.team2)||"Por definir"}</div>
        </div>
        <DivBadge division={match.division2}/>
        <span style={{fontSize:13,fontWeight:900,minWidth:16,textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",color:(fin||live)?(vw?"#10b981":fin?"#334155":"#ff3a3a"):"#151f32"}}>{(fin||live)?gv:"-"}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"3px 8px",background:"rgba(0,0,0,0.15)",borderTop:"1px solid rgba(255,255,255,0.02)"}}>
        <StatusPill status={match.estado}/>
        <span style={{fontSize:7,color:"#1e293b",fontWeight:500}}>{fDate(match.fecha)}{fTime(match.hora)?` ${fTime(match.hora)}`:""}</span>
      </div>
      {isFinal&&fin&&(lw||vw)&&(
        <div style={{padding:"6px 8px",textAlign:"center",background:"linear-gradient(135deg,rgba(226,179,64,0.08),rgba(226,179,64,0.03))",borderTop:"1px solid rgba(226,179,64,0.12)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            <IcnTrophy size={10} color="#e2b340"/>
            <span style={{fontSize:9,fontWeight:900,color:"#e2b340",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}}>CAMPEON: {lw?s(match.team1):s(match.team2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   LLAVE ELIMINATORIA (BRACKET)
═══════════════════════════════════════════════════════════════════ */
const TournamentBracket = ({octavos,cuartos,semis,final:finalMatches}) => {
  const oct = Array.isArray(octavos)?octavos:[];
  const cua = Array.isArray(cuartos)?cuartos:[];
  const sem = Array.isArray(semis)?semis:[];
  const fin = Array.isArray(finalMatches)?finalMatches:[];

  const COL_W = 210;
  const CONN_W = 48;
  const GAP = 16;
  const CARD_H = 70;

  const hasAny = oct.length||cua.length||sem.length||fin.length;
  if(!hasAny) return null;

  /* Ordenar: cada par de partidos forma un "grupo" para las conexiones */
  const sortedOct = [...oct].sort((a,b)=>(a.orden||0)-(b.orden||0));
  const sortedCua = [...cua].sort((a,b)=>(a.orden||0)-(b.orden||0));
  const sortedSem = [...sem].sort((a,b)=>(a.orden||0)-(b.orden||0));

  /* Dimming: un partido queda atenuado si la ronda anterior no está completa */
  const octAllDone = oct.length>0 && oct.every(m=>m.estado==="Finalizado");
  const cuaAllDone = cua.length>0 && cua.every(m=>m.estado==="Finalizado");
  const semAllDone = sem.length>0 && sem.every(m=>m.estado==="Finalizado");

  const dimCuartos = !octAllDone && oct.length>0;
  const dimSemis   = (!cuaAllDone && cua.length>0) || dimCuartos;
  const dimFinal   = (!semAllDone && sem.length>0) || dimSemis;

  /* SVG Connector entre columnas */
  const ConnectorCol = ({leftMatches,rightMatches,x1,x2,rowH,colTop,leftW,rightW}) => {
    if(!leftMatches.length||!rightMatches.length) return null;
    const paths = [];
    const rightTotalH = rightMatches.length * (CARD_H + GAP) - GAP;
    const rightStartY = colTop + (leftMatches.length * (CARD_H + GAP) - GAP - rightTotalH) / 2;

    for(let i=0;i<rightMatches.length;i++){
      const lIdx = i*2;
      if(lIdx+1 >= leftMatches.length) break;
      const lMidY1 = colTop + lIdx * (CARD_H+GAP) + CARD_H/2;
      const lMidY2 = colTop + (lIdx+1) * (CARD_H+GAP) + CARD_H/2;
      const rMidY  = rightStartY + i * (CARD_H+GAP) + CARD_H/2;
      const midX   = x1 + CONN_W/2;
      paths.push(
        <path key={i} d={`M${x1},${lMidY1} H${midX} V${rMidY} H${x2}`} fill="none" stroke="rgba(255,58,58,0.18)" strokeWidth="1.5"/>,
        <path key={i+100} d={`M${x1},${lMidY2} H${midX} V${rMidY} H${x2}`} fill="none" stroke="rgba(255,58,58,0.18)" strokeWidth="1.5"/>
      );
    }
    return <>{paths}</>;
  };

  /* Calcular posiciones Y para centrar columnas */
  const maxH = Math.max(
    sortedOct.length * (CARD_H+GAP) - GAP,
    sortedCua.length ? sortedCua.length * (CARD_H+GAP) - GAP : 0,
    sortedSem.length ? sortedSem.length * (CARD_H+GAP) - GAP : 0,
    fin.length ? fin.length * (CARD_H+GAP) - GAP : 0,
    CARD_H
  );

  const colY = (len) => len>0 ? (maxH - (len*(CARD_H+GAP)-GAP)) / 2 : (maxH - CARD_H) / 2;

  const colX = [];
  let cx = 0;
  const cols = [sortedOct,sortedCua,sortedSem,fin];
  cols.forEach((c,i)=>{
    colX.push(cx);
    cx += (c.length>0||i===cols.length-1) ? COL_W : 0;
    cx += (i<cols.length-1 && cols.slice(i+1).some(cc=>cc.length>0)) ? CONN_W : 0;
  });
  const totalW = cx - CONN_W + COL_W;

  return (
    <div style={{overflowX:"auto",paddingBottom:16}}>
      <div style={{position:"relative",width:totalW,minHeight:maxH+40,margin:"0 auto"}}>
        {/* Column labels */}
        {[
          {label:"OCTAVOS",m:sortedOct,x:0},{label:"CUARTOS",m:sortedCua,x:1},{label:"SEMIFINALES",m:sortedSem,x:2},{label:"FINAL",m:fin,x:3}
        ].map(({label,m,x})=>m.length>0&&(
          <div key={label} style={{position:"absolute",top:0,left:colX[x],width:COL_W,textAlign:"center"}}>
            <span style={{fontSize:8,fontWeight:800,letterSpacing:"2px",color:"#1e293b",fontFamily:"'Barlow Condensed',sans-serif"}}>{label}</span>
          </div>
        ))}

        {/* SVG connections */}
        <svg style={{position:"absolute",top:0,left:0,width:totalW,height:maxH+40,pointerEvents:"none"}} viewBox={`0 0 ${totalW} ${maxH+40}`}>
          {sortedOct.length&&sortedCua.length&&<ConnectorCol leftMatches={sortedOct} rightMatches={sortedCua} x1={colX[0]+COL_W} x2={colX[1]} rowH={CARD_H+GAP} colTop={30+colY(sortedOct.length)} leftW={COL_W} rightW={COL_W}/>}
          {sortedCua.length&&sortedSem.length&&<ConnectorCol leftMatches={sortedCua} rightMatches={sortedSem} x1={colX[1]+COL_W} x2={colX[2]} rowH={CARD_H+GAP} colTop={30+colY(sortedCua.length)} leftW={COL_W} rightW={COL_W}/>}
          {sortedSem.length&&fin.length&&<ConnectorCol leftMatches={sortedSem} rightMatches={fin} x1={colX[2]+COL_W} x2={colX[3]} rowH={CARD_H+GAP} colTop={30+colY(sortedSem.length)} leftW={COL_W} rightW={COL_W}/>}
        </svg>

        {/* Match cards por columna */}
        {sortedOct.map((m,i)=>(
          <div key={m.id||`o${i}`} style={{position:"absolute",top:30+colY(sortedOct.length)+i*(CARD_H+GAP),left:colX[0],width:COL_W}}>
            <MiniMatchCard match={m}/>
          </div>
        ))}
        {sortedCua.map((m,i)=>(
          <div key={m.id||`c${i}`} style={{position:"absolute",top:30+colY(sortedCua.length)+i*(CARD_H+GAP),left:colX[1],width:COL_W}}>
            <MiniMatchCard match={m} dimmed={dimCuartos}/>
          </div>
        ))}
        {sortedSem.map((m,i)=>(
          <div key={m.id||`s${i}`} style={{position:"absolute",top:30+colY(sortedSem.length)+i*(CARD_H+GAP),left:colX[2],width:COL_W}}>
            <MiniMatchCard match={m} dimmed={dimSemis}/>
          </div>
        ))}
        {fin.map((m,i)=>(
          <div key={m.id||`f${i}`} style={{position:"absolute",top:30+colY(fin.length)+i*(CARD_H+GAP),left:colX[3],width:COL_W}}>
            <MiniMatchCard match={m} isFinal dimmed={dimFinal}/>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   GROUP STANDINGS
═══════════════════════════════════════════════════════════════════ */
const GroupStandings = ({group,index,activeGroup}) => {
  const [expanded,setExpanded] = useState(false);
  const eqs = Array.isArray(group?.equipos)?group.equipos:[];
  const isActive = activeGroup==="all"||activeGroup===group.nombre;
  if(!eqs.length||!isActive) return null;
  const complete = eqs.some(e=>n(e.pj)>0)&&eqs.every(e=>n(e.pj)===3);

  return (
    <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:index*0.06}}>
      <div style={{borderRadius:10,overflow:"hidden",border:"1px solid rgba(255,255,255,0.04)",background:"#0d1321"}}>
        <button onClick={()=>setExpanded(!expanded)} style={{width:"100%",padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,58,58,0.04)",borderBottom:"1px solid rgba(255,255,255,0.03)",border:"none",cursor:"pointer",transition:"background 0.2s",fontFamily:"inherit"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,58,58,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,58,58,0.04)"}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:30,height:30,borderRadius:6,background:"linear-gradient(135deg,#ff3a3a,#b91c1c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",boxShadow:"0 3px 10px rgba(255,58,58,0.25)"}}>{s(group.nombre)}</div>
            <span style={{fontSize:13,fontWeight:700,color:"#cbd5e1",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}}>GRUPO {s(group.nombre)}</span>
            {complete&&<span style={{fontSize:7,padding:"2px 6px",borderRadius:3,background:"rgba(16,185,129,0.1)",color:"#10b981",fontWeight:800,letterSpacing:"1px",fontFamily:"'Barlow Condensed',sans-serif"}}>COMPLETO</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:10,color:"#1e293b"}}>{eqs.length} equipos</span>
            <IcnChevDown size={12} color="#475569" style={{transform:expanded?"rotate(180deg)":"none",transition:"transform 0.2s"}}/>
          </div>
        </button>
        <div style={{padding:"7px 14px",display:"flex",gap:8,flexWrap:"wrap",borderBottom:"1px solid rgba(255,255,255,0.02)"}}>
          {eqs.slice(0,4).map((eq,i)=>(
            <div key={eq.id||i} style={{display:"flex",alignItems:"center",gap:4}}>
              {i<2&&<span style={{width:3,height:3,borderRadius:"50%",background:"#10b981",flexShrink:0}}/>}
              <Logo logo={eq.logo} name={eq.nombre} size={18}/>
              <span style={{fontSize:9,color:i<2?"#94a3b8":"#334155",fontWeight:i<2?600:400,fontFamily:"'Barlow Condensed',sans-serif"}}>{s(eq.nombre).split(" ")[0]}</span>
              <span style={{fontSize:9,fontWeight:900,color:i<2?"#e2e8f0":"#475569",fontFamily:"'Barlow Condensed',sans-serif"}}>{n(eq.pts)}pts</span>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {expanded&&(
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}} style={{overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"rgba(255,255,255,0.015)"}}>
                    {["#","EQUIPO","DIV","PJ","G","E","P","GF","GC","DG","PTS"].map(h=>(
                      <th key={h} style={{padding:"6px 8px",fontSize:7,fontWeight:700,color:"#1e293b",letterSpacing:"1px",textAlign:h==="EQUIPO"?"left":"center",fontFamily:"'Barlow Condensed',sans-serif"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eqs.map((eq,i)=>{
                    const dg=n(eq.gf)-n(eq.gc);
                    const q=i<2;
                    return (
                      <tr key={eq.id||i} style={{borderTop:"1px solid rgba(255,255,255,0.02)",background:q?"rgba(255,58,58,0.02)":"transparent",borderLeft:q?"2px solid rgba(255,58,58,0.35)":"2px solid transparent"}}>
                        <td style={{padding:"7px 8px",textAlign:"center",fontSize:11,fontWeight:900,color:q?"#ff3a3a":"#334155",fontFamily:"'Barlow Condensed',sans-serif"}}>{i+1}</td>
                        <td style={{padding:"7px 8px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><Logo logo={eq.logo} name={eq.nombre} size={22}/><span style={{fontSize:11,fontWeight:600,color:"#cbd5e1",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:110,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.3px"}}>{s(eq.nombre)}</span></div></td>
                        <td style={{padding:"7px 8px",textAlign:"center"}}><DivBadge division={eq.division}/></td>
                        {[eq.pj,eq.g,eq.e,eq.p,eq.gf,eq.gc].map((v,j)=>(
                          <td key={j} style={{padding:"7px 8px",textAlign:"center",fontSize:11,color:"#475569",fontFamily:"'Barlow Condensed',sans-serif"}}>{n(v)}</td>
                        ))}
                        <td style={{padding:"7px 8px",textAlign:"center",fontSize:11,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",color:dg>0?"#10b981":dg<0?"#ef4444":"#475569"}}>{dg>0?`+${dg}`:dg}</td>
                        <td style={{padding:"7px 8px",textAlign:"center",fontSize:14,fontWeight:900,color:q?"#ff3a3a":"#94a3b8",fontFamily:"'Barlow Condensed',sans-serif"}}>{n(eq.pts)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{padding:"6px 12px",fontSize:8,color:"#1e293b",letterSpacing:"0.5px",borderTop:"1px solid rgba(255,255,255,0.02)",textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                <IcnCheck size={9} color="#1e293b"/>Los 2 primeros clasifican a Octavos de Final
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   STAT COUNTER
═══════════════════════════════════════════════════════════════════ */
const StatBox = ({label,value,sub,color="#ff3a3a",i}) => {
  const [count,setCount] = useState(0);
  useEffect(()=>{
    let start=0;const end=+value||0;if(!end)return;
    const step=Math.ceil(end/30);
    const id=setInterval(()=>{start+=step;if(start>=end){setCount(end);clearInterval(id);}else setCount(start);},30);
    return ()=>clearInterval(id);
  },[value]);
  return (
    <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.08}}>
      <div style={{textAlign:"center",padding:"18px 14px",position:"relative",background:"rgba(255,255,255,0.015)",borderRadius:10,border:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",height:2,width:36,borderRadius:1,background:color}}/>
        <div style={{fontSize:34,fontWeight:900,lineHeight:1,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"-1px",background:`linear-gradient(180deg,#e2e8f0 30%,${color})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{count}</div>
        <div style={{fontSize:8,fontWeight:800,color:color,letterSpacing:"2px",marginTop:4,textTransform:"uppercase",fontFamily:"'Barlow Condensed',sans-serif"}}>{label}</div>
        <div style={{fontSize:8,color:"#1e293b",marginTop:2}}>{sub}</div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   LIVE TICKER
═══════════════════════════════════════════════════════════════════ */
const LiveTicker = ({matches}) => {
  const live = matches.filter(m=>m.estado==="En Curso");
  if(!live.length) return null;
  return (
    <div style={{background:"rgba(255,58,58,0.05)",borderTop:"1px solid rgba(255,58,58,0.12)",borderBottom:"1px solid rgba(255,58,58,0.12)",padding:"7px 0",overflow:"hidden",position:"relative"}}>
      <div style={{display:"flex",alignItems:"center"}}>
        <div style={{flexShrink:0,padding:"0 14px",fontSize:8,fontWeight:900,letterSpacing:"2px",color:"#ff3a3a",fontFamily:"'Barlow Condensed',sans-serif",borderRight:"1px solid rgba(255,58,58,0.15)",display:"flex",alignItems:"center",gap:5}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#ff3a3a",display:"inline-block",animation:"livePulse 1s infinite"}}/>EN VIVO
        </div>
        <div style={{flex:1,overflow:"hidden",padding:"0 14px"}}>
          <div style={{display:"flex",gap:32,animation:`ticker ${live.length*8}s linear infinite`}}>
            {[...live,...live].map((m,i)=>(
              <span key={i} style={{whiteSpace:"nowrap",fontSize:10,color:"#94a3b8",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.3px"}}>
                <span style={{color:"#e2e8f0",fontWeight:700}}>{s(m.team1)}</span>
                <span style={{color:"#ff3a3a",fontWeight:900,margin:"0 6px"}}>{n(m.goles_local)} - {n(m.goles_visitante)}</span>
                <span style={{color:"#e2e8f0",fontWeight:700}}>{s(m.team2)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════════════════════ */
const Empty = ({icon,title,sub}) => (
  <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{marginBottom:14,color:"#151f32"}}>{icon}</div>
    <div style={{fontSize:14,fontWeight:700,color:"#334155",margin:"0 0 6px",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}}>{title}</div>
    {sub&&<div style={{fontSize:10,color:"#1e293b"}}>{sub}</div>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   PRINCIPAL
═══════════════════════════════════════════════════════════════════ */
export default function CopaPresidente() {
  const [tab,setTab] = useState("grupos");
  const [view,setView] = useState("tabla");
  const [gFilter,setGFilter] = useState("all");
  const [groups,setGroups] = useState([]);
  const [matches,setMatches] = useState([]);
  const [stats,setStats] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const tabsRef = useRef(null);
  const {scrollY} = useScroll();
  const heroOpacity = useTransform(scrollY,[0,300],[1,0]);
  const heroY = useTransform(scrollY,[0,300],[0,60]);

  const loadData = useCallback(async()=>{
    setLoading(true); setError(null);
    try {
      const [rG,rM,rS] = await Promise.allSettled(
        [API.groups,API.matches,API.stats].map(url=>window.fetch(url).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}))
      );
      if(rG.status==="fulfilled"&&rG.value?.success) setGroups(Array.isArray(rG.value.data)?rG.value.data:[]);else setGroups([]);
      if(rM.status==="fulfilled"&&rM.value?.success) setMatches(Array.isArray(rM.value.data)?rM.value.data:[]);else setMatches([]);
      if(rS.status==="fulfilled"&&rS.value?.success) setStats(rS.value.data||{});else setStats(null);
    } catch(e){setError(e.message);}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{loadData();},[loadData]);
  useEffect(()=>{
    const hasLive=matches.some(m=>m.estado==="En Curso");
    if(!hasLive)return;
    const id=setInterval(loadData,20000);
    return ()=>clearInterval(id);
  },[matches,loadData]);

  const gMatches = useMemo(()=>matches.filter(m=>m.fase==="grupos"),[matches]);
  const koPhase = useMemo(()=>{
    const m={};
    ["octavos","cuartos","semis","final"].forEach(f=>{m[f]=matches.filter(x=>x.fase===f);});
    return m;
  },[matches]);
  const gLetters = useMemo(()=>[...new Set(gMatches.map(m=>m.grupo).filter(Boolean))].sort(),[gMatches]);
  const filtered = useMemo(()=>{
    let m=gMatches;
    if(gFilter!=="all") m=m.filter(x=>x.grupo===gFilter);
    return [...m].sort((a,b)=>{if(!a.fecha&&!b.fecha)return 0;if(!a.fecha)return 1;if(!b.fecha)return -1;return a.fecha.localeCompare(b.fecha)||(a.hora||"").localeCompare(b.hora||"");});
  },[gMatches,gFilter]);

  const hStats = useMemo(()=>[
    {label:"Equipos",value:n(stats?.equipos)||24,sub:"3 divisiones",color:"#ff3a3a"},
    {label:"Grupos",value:gLetters.length||6,sub:"4 por grupo",color:"#e2b340"},
    {label:"Partidos",value:n(stats?.total,matches.length),sub:"total registrados",color:"#3b82f6"},
    {label:"Goles",value:n(stats?.goles),sub:"anotados",color:"#10b981"},
  ],[stats,matches,gLetters]);

  const hasLive = matches.some(m=>m.estado==="En Curso");
  const hasKoData = koPhase.octavos.length||koPhase.cuartos.length||koPhase.semis.length||koPhase.final.length;

  const changeTab=(k)=>{
    setTab(k); setGFilter("all"); setView("tabla");
    if(tabsRef.current) window.scrollTo({top:tabsRef.current.getBoundingClientRect().top+window.scrollY-64,behavior:"smooth"});
  };

  /* Si la pestaña es eliminatoria, renderizar la llave completa */
  const showBracket = ["octavos","cuartos","semis","final"].includes(tab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(1.6)}}
        @keyframes sk{0%{background-position:-600px 0}100%{background-position:600px 0}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .phase-btn{padding:9px 18px;border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letterSpacing:1px;text-transform:uppercase;transition:all .2s;white-space:nowrap;background:transparent;color:#334155;position:relative;border-bottom:2px solid transparent;display:flex;align-items:center;gap:6}
        .phase-btn:hover{color:#94a3b8}
        .phase-btn.active{color:#ff3a3a;border-bottom-color:#ff3a3a}
        .phase-btn.active::after{content:'';position:absolute;bottom:-1px;left:50%;transform:translateX(-50%);width:5px;height:5px;border-radius:50%;background:#ff3a3a}
        .gf-btn{padding:4px 12px;border-radius:3px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letterSpacing:1px;text-transform:uppercase;transition:all .2s;border:1px solid rgba(255,255,255,0.05);background:transparent;color:#334155}
        .gf-btn:hover{border-color:rgba(255,58,58,0.25);color:#94a3b8}
        .gf-btn.active{background:rgba(255,58,58,0.07);border-color:rgba(255,58,58,0.25);color:#ff3a3a}
        .view-btn{padding:6px 14px;border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;transition:all .2s;border-radius:3px;background:transparent;color:#334155;display:flex;alignItems:"center",gap:4}
        .view-btn:hover{color:#94a3b8}
        .view-btn.active{background:rgba(255,58,58,0.08);color:#ff3a3a}
      `}</style>

      <Header/>
      <main style={{minHeight:"100vh",background:"#070b14"}}>

        {/* HERO */}
        <div style={{position:"relative",minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"80px 24px 50px"}}>
          <HeroBg/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:50,background:"linear-gradient(to bottom right,transparent 49%,#070b14 50%)"}}/>
          <motion.div style={{opacity:heroOpacity,y:heroY,position:"relative",zIndex:2,textAlign:"center",maxWidth:680}}>
            <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:8,fontWeight:800,letterSpacing:"4px",color:"#ff3a3a",textTransform:"uppercase",marginBottom:14,fontFamily:"'Barlow Condensed',sans-serif",padding:"4px 12px",borderRadius:2,border:"1px solid rgba(255,58,58,0.2)",background:"rgba(255,58,58,0.04)"}}>
                <span style={{width:4,height:4,borderRadius:"50%",background:"#ff3a3a"}}/>Torneo Oficial El Salvador
              </div>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.1}} style={{margin:"0 0 6px",fontSize:"clamp(2.8rem,8vw,5.2rem)",fontWeight:900,lineHeight:0.9,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"-2px",textTransform:"uppercase"}}>
              <span style={{color:"#e2e8f0"}}>COPA </span>
              <span style={{background:"linear-gradient(135deg,#ff3a3a,#ff8a00)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PRESIDENTE</span>
            </motion.h1>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3,duration:0.5}} style={{width:50,height:2,margin:"14px auto",background:"linear-gradient(90deg,transparent,#ff3a3a,transparent)"}}/>
            <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.5}} style={{color:"#475569",fontSize:12,lineHeight:1.6,maxWidth:400,marginLeft:"auto",marginRight:"auto"}}>
              Primera, Segunda y Tercera División unidas por la gloria del fútbol salvadoreño
            </motion.p>
            {hasLive&&(
              <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.5}} style={{display:"inline-flex",alignItems:"center",gap:7,marginTop:18,padding:"5px 14px",borderRadius:2,background:"rgba(255,58,58,0.08)",border:"1px solid rgba(255,58,58,0.25)"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#ff3a3a",animation:"livePulse 1s infinite"}}/>
                <span style={{fontSize:9,fontWeight:800,color:"#ff3a3a",letterSpacing:"2px",fontFamily:"'Barlow Condensed',sans-serif"}}>PARTIDO EN VIVO</span>
              </motion.div>
            )}
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.5}} style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:28}}>
              {!loading?hStats.map((st,i)=><StatBox key={st.label} {...st} i={i}/>):[0,1,2,3].map(i=>(
                <div key={i} style={{textAlign:"center",padding:"18px 12px"}}><Sk w="60%" h={30} r={4}/><div style={{marginTop:5}}><Sk w="80%" h={9} r={3}/></div></div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <LiveTicker matches={matches}/>

        {/* PHASE TABS */}
        <div ref={tabsRef} style={{position:"sticky",top:0,zIndex:40,background:"rgba(7,11,20,0.96)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"center",overflowX:"auto",padding:"0 16px"}}>
            {PHASES.map(p=>{
              const cnt = p.key==="grupos"?gMatches.length:(koPhase[p.key]||[]).length;
              return (
                <button key={p.key} className={`phase-btn${tab===p.key?" active":""}`} onClick={()=>changeTab(p.key)}>
                  {phaseIcon(p.key,13,tab===p.key?"#ff3a3a":"#334155")}
                  {p.short}
                  {cnt>0&&<span style={{marginLeft:4,fontSize:8,padding:"1px 4px",borderRadius:2,fontWeight:800,background:tab===p.key?"rgba(255,58,58,0.15)":"rgba(255,255,255,0.03)",color:tab===p.key?"#ff3a3a":"#1e293b"}}>{cnt}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px 60px"}}>
          {error&&(
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <div style={{fontSize:10,color:"#ef4444",marginBottom:10,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>ERROR AL CARGAR</div>
              <button onClick={loadData} style={{padding:"7px 20px",borderRadius:4,border:"1px solid rgba(255,58,58,0.25)",background:"rgba(255,58,58,0.06)",color:"#ff3a3a",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>REINTENTAR</button>
            </div>
          )}

          {!error&&(
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} transition={{duration:0.2}}>

                {/* ══ GRUPOS ══ */}
                {tab==="grupos"&&(
                  <div>
                    <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:4,padding:3,gap:2}}>
                        <button className={`view-btn${view==="tabla"?" active":""}`} onClick={()=>setView("tabla")}><IcnTable size={11} color="currentColor"/>TABLA</button>
                        <button className={`view-btn${view==="partidos"?" active":""}`} onClick={()=>setView("partidos")}><IcnFutbol size={11} color="currentColor"/>PARTIDOS</button>
                      </div>
                      {view==="partidos"&&(
                        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                          <button className={`gf-btn${gFilter==="all"?" active":""}`} onClick={()=>setGFilter("all")}>TODOS</button>
                          {gLetters.map(g=><button key={g} className={`gf-btn${gFilter===g?" active":""}`} onClick={()=>setGFilter(g)}>GRP {g}</button>)}
                        </div>
                      )}
                      {view==="tabla"&&groups.length>0&&(
                        <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
                          <span style={{fontSize:8,color:"#1e293b",letterSpacing:"1px",fontFamily:"'Barlow Condensed',sans-serif"}}>FILTRAR:</span>
                          <button className={`gf-btn${gFilter==="all"?" active":""}`} onClick={()=>setGFilter("all")}>TODOS</button>
                          {["A","B","C","D","E","F"].map(g=><button key={g} className={`gf-btn${gFilter===g?" active":""}`} onClick={()=>setGFilter(g)}>{g}</button>)}
                        </div>
                      )}
                    </div>

                    {view==="tabla"&&(
                      loading
                        ?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:12}}>{[0,1,2,3,4,5].map(i=>(
                          <div key={i} style={{borderRadius:10,overflow:"hidden",border:"1px solid rgba(255,255,255,0.04)"}}>
                            <div style={{padding:"12px 14px",background:"rgba(255,255,255,0.015)"}}><Sk w="35%" h={16} r={4}/></div>
                            {[0,1,2,3].map(j=>(<div key={j} style={{padding:"8px 14px",display:"flex",gap:8,alignItems:"center",borderTop:"1px solid rgba(255,255,255,0.02)"}}><Sk w={22} h={22} r="50%"/><Sk w="45%" h={10} r={3}/><div style={{flex:1,display:"flex",justifyContent:"flex-end",gap:6}}>{[20,20,20,20].map((w,k)=><Sk key={k} w={w} h={10} r={3}/>)}</div></div>))}
                          </div>
                        ))}</div>
                        :groups.length>0
                          ?<div style={{display:"flex",flexDirection:"column",gap:8}}>{groups.map((g,i)=><GroupStandings key={g.nombre} group={g} index={i} activeGroup={gFilter}/>)}</div>
                          :<Empty icon={<IcnHex size={40} color="#151f32"/>} title="GRUPOS POR DEFINIR" sub="Los grupos se publicarán cuando el torneo esté configurado"/>
                    )}

                    {view==="partidos"&&(
                      loading
                        ?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:10}}>{[0,1,2,3,4,5].map(i=>(
                          <div key={i} style={{borderRadius:10,overflow:"hidden",padding:14,border:"1px solid rgba(255,255,255,0.04)"}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><Sk w="28%" h={9} r={3}/><Sk w="18%" h={9} r={3}/></div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center"}}>
                              <div style={{display:"flex",gap:7}}><Sk w={34} h={34} r="50%"/><Sk w="55%" h={10} r={3}/></div>
                              <Sk w={44} h={24} r={4}/>
                              <div style={{display:"flex",gap:7,flexDirection:"row-reverse"}}><Sk w={34} h={34} r="50%"/><Sk w="55%" h={10} r={3}/></div>
                            </div>
                          </div>
                        ))}</div>
                        :filtered.length>0
                          ?<>
                            <div style={{marginBottom:14,fontSize:9,color:"#334155",letterSpacing:"2px",fontFamily:"'Barlow Condensed',sans-serif"}}>{filtered.length} PARTIDO{filtered.length!==1?"S":""}{gFilter!=="all"?` · GRUPO ${gFilter}`:" · FASE DE GRUPOS"}</div>
                            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:10}}>{filtered.map((m,i)=><MatchCard key={m.id||i} match={m} i={i}/>)}</div>
                          </>
                          :<Empty icon={<IcnFutbol size={40} color="#151f32"/>} title="SIN PARTIDOS PROGRAMADOS" sub={gFilter!=="all"?`Grupo ${gFilter} sin partidos aún`:"Los partidos se publicarán próximamente"}/>
                    )}
                  </div>
                )}

                {/* ══ LLAVE ELIMINATORIA ══ */}
                {showBracket&&(
                  <div>
                    {/* Encabezado */}
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                      <div style={{width:36,height:36,borderRadius:7,background:"linear-gradient(135deg,#ff3a3a,#b91c1c)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(255,58,58,0.25)",flexShrink:0}}>
                        {phaseIcon(tab,16,"#fff")}
                      </div>
                      <div>
                        <h2 style={{margin:0,color:"#e2e8f0",fontSize:20,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px",textTransform:"uppercase"}}>
                          {PHASES.find(p=>p.key===tab)?.label}
                        </h2>
                        <span style={{fontSize:9,color:"#475569",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>
                          {hasKoData?"Llave completa desde Octavos hasta la Final":"Aún sin datos de fase eliminatoria"}
                        </span>
                      </div>
                    </div>

                    {loading&&(
                      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
                        {[0,1,2,3].map(i=>(
                          <div key={i} style={{borderRadius:8,overflow:"hidden",width:200,border:"1px solid rgba(255,255,255,0.04)"}}>
                            {[0,1].map(j=>(<div key={j} style={{padding:"10px 12px",display:"flex",gap:8,alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><Sk w={20} h={20} r="50%"/><div style={{flex:1}}><Sk w="65%" h={9} r={3}/></div><Sk w={18} h={16} r={3}/></div>))}
                            <div style={{padding:"5px 12px"}}><Sk w="35%" h={8} r={3}/></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!loading&&hasKoData&&(
                      <div style={{background:"rgba(255,255,255,0.01)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:12,padding:"28px 20px 20px"}}>
                        {/* Leyenda */}
                        <div style={{display:"flex",gap:16,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{width:8,height:8,borderRadius:2,background:"#10b981"}}/>
                            <span style={{fontSize:8,color:"#475569",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}}>GANADOR</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{width:8,height:8,borderRadius:2,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}/>
                            <span style={{fontSize:8,color:"#475569",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}}>PENDIENTE</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{width:8,height:8,borderRadius:2,background:"rgba(255,255,255,0.06)",opacity:0.4}}/>
                            <span style={{fontSize:8,color:"#475569",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}}>BLOQUEADO (ronda anterior sin completar)</span>
                          </div>
                        </div>
                        <TournamentBracket octavos={koPhase.octavos} cuartos={koPhase.cuartos} semis={koPhase.semis} final={koPhase.final}/>
                      </div>
                    )}

                    {!loading&&!hasKoData&&(
                      <Empty icon={<IcnLock size={40} color="#151f32"/>} title="AUN NO DISPONIBLE" sub="Se habilitará cuando clasifiquen los equipos de la Fase de Grupos"/>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* INFO FOOTER */}
        {!loading&&!error&&(
          <div style={{background:"rgba(255,255,255,0.01)",borderTop:"1px solid rgba(255,255,255,0.03)",padding:"36px 16px"}}>
            <div style={{maxWidth:960,margin:"0 auto"}}>
              <div style={{textAlign:"center",marginBottom:24}}>
                <div style={{fontSize:9,color:"#ff3a3a",letterSpacing:"4px",fontWeight:800,marginBottom:6,fontFamily:"'Barlow Condensed',sans-serif"}}>REGLAMENTO</div>
                <h3 style={{margin:0,fontSize:18,fontWeight:900,color:"#cbd5e1",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"1px"}}>FORMATO DEL TORNEO</h3>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:10}}>
                {[
                  {icon:<IcnHex size={18} color="#ff3a3a"/>,t:"6 Grupos",d:"4 equipos por grupo: 2 de Primera, 1 de Segunda y 1 de Tercera División"},
                  {icon:<IcnSword size={18} color="#ff3a3a"/>,t:"Restriccion",d:"Máximo 7 titulares de la plantilla mayor de Primera División por partido"},
                  {icon:<IcnTable size={18} color="#ff3a3a"/>,t:"Días de Juego",d:"Todos los partidos se disputarán los días miércoles de la semana"},
                  {icon:<IcnDiamond size={18} color="#ff3a3a"/>,t:"Clasificacion",d:"Los 2 mejores de cada grupo avanzan directamente a Octavos de Final"},
                  {icon:<IcnStar size={18} color="#ff3a3a"/>,t:"Fase Eliminatoria",d:"Octavos, Cuartos de Final, Semifinales y Gran Final"},
                  {icon:<IcnTrophy size={18} color="#ff3a3a"/>,t:"Premio Mayor",d:"El equipo campeón se lleva un premio de $50,000 en efectivo"},
                ].map((item,i)=>(
                  <motion.div key={i} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.35,delay:i*0.05}}>
                    <div style={{padding:"14px",borderRadius:8,background:"rgba(255,255,255,0.008)",border:"1px solid rgba(255,255,255,0.03)",display:"flex",gap:10,alignItems:"flex-start",transition:"border-color 0.2s,background 0.2s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,58,58,0.15)";e.currentTarget.style.background="rgba(255,58,58,0.015)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.03)";e.currentTarget.style.background="rgba(255,255,255,0.008)";}}>
                      <div style={{flexShrink:0,marginTop:1}}>{item.icon}</div>
                      <div>
                        <div style={{fontSize:11,fontWeight:800,color:"#ff3a3a",marginBottom:3,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.5px"}}>{item.t}</div>
                        <div style={{fontSize:10,color:"#475569",lineHeight:1.5}}>{item.d}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer/>
    </>
  );
}