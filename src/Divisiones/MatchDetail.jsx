import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

const API = "http://numeros-y-futbol.test/backend/";

const logoUrl = (p) => {
  if (!p) return null;
  if (p.startsWith("http")) return p;
  return `${API}${p}`;
};

const TIPO_CONFIG = {
  gol:              { icon: "⚽", color: "#10b981", label: "Gol" },
  tarjeta_amarilla: { icon: "🟨", color: "#f59e0b", label: "Tarjeta Amarilla" },
  tarjeta_roja:     { icon: "🟥", color: "#ef4444", label: "Tarjeta Roja" },
  cambio:           { icon: "🔄", color: "#3b82f6", label: "Cambio" },
  penal:            { icon: "🎯", color: "#a855f7", label: "Penal" },
  inicio:           { icon: "▶️", color: "#22c55e", label: "Inicio" },
  fin:              { icon: "🏁", color: "#64748b", label: "Fin" },
  comentario:       { icon: "💬", color: "#94a3b8", label: "Comentario" },
};

// ── Íconos SVG ──
const IconBack = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>);
const IconCalendar = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IconStadium = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M6 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/></svg>);
const IconUsers = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconFormation = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const IconMessages = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const IconRefresh = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>);

// ── Posiciones y Lógica ──
const posiciones = [
  { value: "portero", label: "Portero", cat: "portero", color: "#f59e0b", abbr: "POR" },
  { value: "lateral_izquierdo", label: "Lateral Izq", cat: "defensa", color: "#60a5fa", abbr: "LI" },
  { value: "lateral_derecho", label: "Lateral Der", cat: "defensa", color: "#60a5fa", abbr: "LD" },
  { value: "central", label: "Central", cat: "defensa", color: "#3b82f6", abbr: "DFC" },
  { value: "medio_defensivo", label: "MCD", cat: "medio", color: "#34d399", abbr: "MCD" },
  { value: "medio_central", label: "MC", cat: "medio", color: "#10b981", abbr: "MC" },
  { value: "medio_ofensivo", label: "MCO", cat: "medio", color: "#059669", abbr: "MCO" },
  { value: "extremo_izquierdo", label: "EI", cat: "medio", color: "#6ee7b7", abbr: "EI" },
  { value: "extremo_derecho", label: "ED", cat: "medio", color: "#6ee7b7", abbr: "ED" },
  { value: "centrodelantero", label: "DC", cat: "delantero", color: "#ef4444", abbr: "DC" },
  { value: "segundo_delantero", label: "SD", cat: "delantero", color: "#f87171", abbr: "SD" },
];
function getPosInfo(v) {
  if (v === "centrocampista" || v === "medio") v = "medio_central";
  if (v === "defensa") v = "central";
  if (v === "delantero") v = "centrodelantero";
  return posiciones.find(p => p.value === v) || { label: v || "?", cat: "medio", color: "#64748b", abbr: "??" };
}

const formations = {
  "4-4-2":   [{ sp:"portero",sc:"portero",x:50,y:90 },{ sp:"lateral_izquierdo",sc:"defensa",x:12,y:70 },{ sp:"central",sc:"defensa",x:36,y:74 },{ sp:"central",sc:"defensa",x:64,y:74 },{ sp:"lateral_derecho",sc:"defensa",x:88,y:70 },{ sp:"extremo_izquierdo",sc:"medio",x:18,y:48 },{ sp:"medio_central",sc:"medio",x:40,y:46 },{ sp:"medio_central",sc:"medio",x:60,y:46 },{ sp:"extremo_derecho",sc:"medio",x:82,y:48 },{ sp:"centrodelantero",sc:"delantero",x:36,y:22 },{ sp:"centrodelantero",sc:"delantero",x:64,y:22 }],
  "4-3-3":   [{ sp:"portero",sc:"portero",x:50,y:90 },{ sp:"lateral_izquierdo",sc:"defensa",x:12,y:70 },{ sp:"central",sc:"defensa",x:36,y:74 },{ sp:"central",sc:"defensa",x:64,y:74 },{ sp:"lateral_derecho",sc:"defensa",x:88,y:70 },{ sp:"medio_defensivo",sc:"medio",x:28,y:48 },{ sp:"medio_central",sc:"medio",x:50,y:44 },{ sp:"medio_defensivo",sc:"medio",x:72,y:48 },{ sp:"extremo_izquierdo",sc:"medio",x:18,y:22 },{ sp:"centrodelantero",sc:"delantero",x:50,y:18 },{ sp:"extremo_derecho",sc:"medio",x:82,y:22 }],
  "4-2-3-1": [{ sp:"portero",sc:"portero",x:50,y:90 },{ sp:"lateral_izquierdo",sc:"defensa",x:12,y:70 },{ sp:"central",sc:"defensa",x:36,y:74 },{ sp:"central",sc:"defensa",x:64,y:74 },{ sp:"lateral_derecho",sc:"defensa",x:88,y:70 },{ sp:"medio_defensivo",sc:"medio",x:38,y:56 },{ sp:"medio_defensivo",sc:"medio",x:62,y:56 },{ sp:"extremo_izquierdo",sc:"medio",x:20,y:38 },{ sp:"medio_ofensivo",sc:"medio",x:50,y:34 },{ sp:"extremo_derecho",sc:"medio",x:80,y:38 },{ sp:"centrodelantero",sc:"delantero",x:50,y:18 }],
};
const posCompat = {
  lateral_izquierdo: ["lateral_izquierdo", "lateral_derecho", "extremo_izquierdo"], lateral_derecho: ["lateral_derecho", "lateral_izquierdo", "extremo_derecho"],
  medio_defensivo: ["medio_defensivo", "medio_central"], medio_central: ["medio_central", "medio_defensivo", "medio_ofensivo"],
  medio_ofensivo: ["medio_ofensivo", "medio_central", "centrodelantero"], extremo_izquierdo: ["extremo_izquierdo", "lateral_izquierdo", "extremo_derecho"],
  extremo_derecho: ["extremo_derecho", "lateral_derecho", "extremo_izquierdo"], centrodelantero: ["centrodelantero", "segundo_delantero", "medio_ofensivo"],
  segundo_delantero: ["segundo_delantero", "centrodelantero", "extremo_izquierdo"],
};

function autoAssign(jugadores, fKey) {
  const tpl = formations[fKey] || formations["4-4-2"];
  const sorted = [...jugadores].sort((a, b) => (b.es_titular == 1 ? 1 : 0) - (a.es_titular == 1 ? 1 : 0));
  const used = new Set(), starters = [], filled = new Set();
  const pick = (fn) => sorted.find(j => fn(j) && !used.has(j.id));
  
  for (let i = 0; i < tpl.length; i++) { const s = tpl[i]; const compat = posCompat[s.sp] || [s.sp]; const p = pick(j => compat.includes(j.posicion)); if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); } }
  for (let i = 0; i < tpl.length; i++) { if (filled.has(i)) continue; const s = tpl[i]; const p = pick(j => getPosInfo(j.posicion).cat === s.sc); if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); } }
  for (let i = 0; i < tpl.length; i++) { if (filled.has(i)) continue; const slot = tpl[i]; const p = pick(() => true); if (p) { starters.push({ ...p, px: slot.x, py: slot.y }); used.add(p.id); filled.add(i); } }
  return { starters, subs: jugadores.filter(j => !used.has(j.id)) };
}

// ── Componente de campo ──
const FootballField = ({ jugadores, formacion, flipped }) => {
  const titularesConPos = jugadores.filter(j => j.pos_x !== null && j.pos_y !== null);
  const { starters, subs } = useMemo(() => {
    if (titularesConPos.length) {
      const startersDB = titularesConPos.map(j => ({ ...j, px: Number(j.pos_x), py: Number(j.pos_y) }));
      const usados = new Set(startersDB.map(j => j.id));
      return { starters: startersDB, subs: jugadores.filter(j => !usados.has(j.id)) };
    }
    return autoAssign(jugadores, formacion);
  }, [jugadores, formacion]);

  const catColor = { portero:"#f59e0b",defensa:"#3b82f6",medio:"#10b981",delantero:"#ef4444" };

  return (
    <div>
      <div style={{ position:"relative", width:"100%", paddingBottom:"130%", background:"linear-gradient(180deg,#166534 0%,#15803d 25%,#16a34a 50%,#15803d 75%,#166534 100%)", borderRadius:12, overflow:"hidden", border:"2px solid rgba(255,255,255,0.1)" }}>
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:1 }} viewBox="0 0 100 130" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="126" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
          <line x1="2" y1="65" x2="98" y2="65" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
          <circle cx="50" cy="65" r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8"/>
          <rect x="20" y="2" width="60" height="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6"/>
          <rect x="20" y="110" width="60" height="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6"/>
        </svg>

        <div style={{ position:"absolute",inset:0,zIndex:2 }}>
          {starters.map((j, idx) => {
            const pos = getPosInfo(j.posicion);
            const yPos = flipped ? (100 - j.py) : j.py;
            const color = catColor[pos.cat] || "#94a3b8";
            return (
              <div key={j.id || idx} style={{ position:"absolute", left:`${j.px}%`, top:`${yPos}%`, transform:"translate(-50%,-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${color}dd,${color}88)`, border:`2px solid rgba(255,255,255,0.8)`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 8px ${color}66`, overflow:"hidden" }}>
                  {j.foto ? <img src={logoUrl(j.foto)} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none" } /> : <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>{j.numero_camiseta || "?"}</span>}
                </div>
                <span style={{ fontSize:7, fontWeight:700, color:"#fff", textShadow:"0 1px 3px rgba(0,0,0,0.9)", whiteSpace:"nowrap", maxWidth:50, overflow:"hidden", textOverflow:"ellipsis", textAlign:"center", background:"rgba(0,0,0,0.6)", padding:"1px 4px", borderRadius:3 }}>
                  {j.nombre?.split(" ").pop()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {subs && subs.length > 0 && (
        <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:4, justifyContent:"center" }}>
          {subs.map(s => {
             const pos = getPosInfo(s.posicion);
             return <span key={s.id} style={{ fontSize:10, background:"rgba(255,255,255,0.05)", padding:"2px 6px", borderRadius:4, color:"#94a3b8", border:"1px solid rgba(255,255,255,0.08)" }}>#{s.numero_camiseta || '?'} {s.nombre?.split(" ").pop()}</span>
          })}
        </div>
      )}
    </div>
  );
};

// ── Lista de jugadores ──
const PlayerList = ({ jugadores, color = "#ef4444" }) => {
  const cats = [
    { key:"portero",    label:"Porteros",      items: jugadores.filter(j => getPosInfo(j.posicion).cat === "portero") },
    { key:"defensa",    label:"Defensas",       items: jugadores.filter(j => getPosInfo(j.posicion).cat === "defensa") },
    { key:"medio",      label:"Mediocampistas", items: jugadores.filter(j => getPosInfo(j.posicion).cat === "medio") },
    { key:"delantero",  label:"Delanteros",     items: jugadores.filter(j => getPosInfo(j.posicion).cat === "delantero") },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {cats.map(cat => cat.items.length > 0 && (
        <div key={cat.key}>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:"2px", textTransform:"uppercase", color, marginBottom:6, borderLeft:`2px solid ${color}`, paddingLeft:8 }}>{cat.label}</div>
          {cat.items.map(j => (
            <div key={j.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:8, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)", marginBottom:4, transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}>
              <div style={{ width:32, height:32, borderRadius:"50%", overflow:"hidden", flexShrink:0, background:`linear-gradient(135deg,${color}33,rgba(255,255,255,0.05))`, border:`1px solid ${color}44`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {j.foto ? <img src={logoUrl(j.foto)} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => e.target.style.display="none" } /> : <span style={{ fontSize:11, fontWeight:800, color }}>{j.numero_camiseta || "?"}</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#f1f5f9", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{j.nombre}</div>
                <div style={{ fontSize:11, color:"#64748b" }}>{getPosInfo(j.posicion).label}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ── Timeline ──
const Timeline = ({ comentarios, onRefresh, isRefreshing }) => (
  <div>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
      <span style={{ fontSize:13, color:"#64748b" }}>{comentarios.length} evento{comentarios.length !== 1 ? "s" : ""}</span>
      <button onClick={onRefresh} disabled={isRefreshing} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"6px 12px", color:"#94a3b8", cursor:"pointer", fontSize:12, fontWeight:600 }}>
        <IconRefresh /> {isRefreshing ? "Actualizando..." : "Actualizar"}
      </button>
    </div>
    {comentarios.length === 0 ? (
      <div style={{ textAlign:"center", padding:"3rem 1rem" }}>
        <div style={{ fontSize:32, marginBottom:12, opacity:0.2 }}>💬</div>
        <p style={{ color:"#475569", fontSize:14, fontWeight:600, margin:0 }}>Sin eventos registrados</p>
      </div>
    ) : (
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:28, top:0, bottom:0, width:2, background:"linear-gradient(180deg,rgba(255,0,77,0.3),rgba(255,0,77,0.05))", borderRadius:2 }} />
        {comentarios.map((c, i) => {
          const cfg = TIPO_CONFIG[c.tipo] || TIPO_CONFIG.comentario;
          const isGoal = c.tipo === "gol";
          return (
            <div key={c.id} style={{ display:"flex", gap:16, marginBottom:16, position:"relative" }}>
              <div style={{ flexShrink:0, width:58, display:"flex", flexDirection:"column", alignItems:"center", gap:3, zIndex:1 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background: isGoal ? `linear-gradient(135deg,${cfg.color}33,${cfg.color}11)` : "rgba(255,255,255,0.04)", border: `2px solid ${isGoal ? cfg.color : "rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: isGoal ? `0 0 20px ${cfg.color}44` : "none", fontSize:16 }}>{cfg.icon}</div>
                <span style={{ fontSize:10, fontWeight:800, color: cfg.color, letterSpacing:"0.5px" }}>{c.minuto}'</span>
              </div>
              <div style={{ flex:1, background: isGoal ? `linear-gradient(135deg,${cfg.color}10,rgba(255,255,255,0.02))` : "rgba(255,255,255,0.02)", border: `1px solid ${isGoal ? cfg.color+"33" : "rgba(255,255,255,0.06)"}`, borderRadius:12, padding:"12px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color: cfg.color, background:`${cfg.color}18`, padding:"2px 8px", borderRadius:4 }}>{cfg.label}</span>
                  {c.equipo && <span style={{ fontSize:11, color:"#64748b", fontWeight:500 }}>· {c.equipo}</span>}
                </div>
                <p style={{ fontSize:14, color: isGoal ? "#f1f5f9" : "#94a3b8", margin:0, lineHeight:1.5, fontWeight: isGoal ? 600 : 400 }}>{c.descripcion}</p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// ═════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═════════════════════════════════════════════════════════════
export default function MatchDetail() {
  const { id, division = "primera" } = useParams();
  const navigate = useNavigate();

  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeTab, setActiveTab]     = useState("comentarios");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res  = await fetch(`${API}get_match_detail.php?id=${id}&division=${division}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [id, division]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!data?.partido) return;
    const estado = (data.partido.estado || "").toLowerCase();
    if (!estado.includes("vivo") && !estado.includes("curso")) return;
    const t = setInterval(fetchData, 30000);
    return () => clearInterval(t);
  }, [data, fetchData]);

  const handleRefresh = () => { setIsRefreshing(true); fetchData(); };

  if (loading) return (<><Header /><div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a", color:"#fff" }}>Cargando partido...</div></>);
  if (error || !data) return (<><Header /><div style={{ minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f172a", color:"#fff", flexDirection:"column", gap:16 }}><h3>Error</h3><button onClick={() => navigate(-1)}>Volver</button></div></>);

  const { partido, jugadores_local, jugadores_visitante, comentarios } = data;
  const estado = (partido.estado || "Pendiente");
  const isPending  = ["pendiente","programado","por jugar"].includes(estado.toLowerCase());
  const isLive     = ["en curso","en vivo","live"].includes(estado.toLowerCase());
  const isFinished = estado.toLowerCase() === "finalizado";

  const statusColor = isLive ? "#22c55e" : isPending ? "#f97316" : "#64748b";
  const statusText  = isLive ? "EN VIVO" : isPending ? "PRÓXIMO" : "FINALIZADO";

  return (
    <>
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Roboto:wght@400;500;600&display=swap');
        .md-body { background: #0f172a; min-height: 100vh; font-family: 'Roboto', sans-serif; color: #f1f5f9; }
        .md-hero { position: relative; background: linear-gradient(160deg, #0f1a2e 0%, #0a0f1d 40%, #111827 100%); border-bottom: 1px solid rgba(255,255,255,0.06); overflow: hidden; }
        .md-hero::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 80% 60% at 50% 0%, ${statusColor}12 0%, transparent 70%); pointer-events:none; }
        .md-hero-bar { height:3px; background: linear-gradient(90deg,transparent,${statusColor}88,${statusColor},${statusColor}88,transparent); }
        .md-hero-inner { max-width:800px; margin:0 auto; padding:24px 20px 32px; position:relative; z-index:1; }
        .md-breadcrumb { display:flex; align-items:center; gap:8px; font-size:12px; color:#475569; margin-bottom:24px; font-weight:600; }
        .md-breadcrumb button { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:#94a3b8; padding:6px 12px; border-radius:8px; cursor:pointer; font-weight:700; display:flex; align-items:center; gap:5px; }
        .md-meta { display:flex; align-items:center; justify-content:center; gap:20px; margin-bottom:28px; flex-wrap:wrap; }
        .md-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase; padding:6px 18px; border-radius:6px; box-shadow: 0 0 20px ${statusColor}22; }
        .md-scoreboard { display:flex; align-items:center; justify-content:center; gap:24px; }
        .md-team-hero { display:flex; flex-direction:column; align-items:center; gap:12px; flex:1; max-width:180px; }
        .md-team-logo { width:88px; height:88px; border-radius:50%; background:rgba(255,255,255,0.04); border:3px solid rgba(255,255,255,0.1); padding:10px; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 30px rgba(0,0,0,0.6); }
        .md-team-logo img { width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4)); }
        .md-team-name { font-family:'Montserrat',sans-serif; font-size:1.05rem; font-weight:800; text-align:center; line-height:1.2; color:#f1f5f9; margin-top:4px; }
        .md-score-box { display:flex; flex-direction:column; align-items:center; gap:6px; padding:0 16px; flex-shrink:0; }
        .md-score { display:flex; align-items:center; background:rgba(0,0,0,0.4); border-radius:16px; padding:10px 8px; border:1px solid rgba(255,255,255,0.08); box-shadow:0 8px 24px rgba(0,0,0,0.5); }
        .md-score-num { font-family:'Montserrat',sans-serif; font-size:3.5rem; font-weight:900; width:70px; text-align:center; line-height:1; }
        .md-score-sep { font-size:1.8rem; color:rgba(255,255,255,0.15); margin:0 6px; }
        .md-score-vs { font-family:'Montserrat',sans-serif; font-size:1.6rem; font-weight:900; color:#f97316; letter-spacing:6px; text-shadow:0 0 20px rgba(249,115,22,0.4); }
        .md-info-row { display:flex; align-items:center; justify-content:center; gap:24px; margin-top:24px; flex-wrap:wrap; }
        .md-info-item { display:flex; align-items:center; gap:6px; font-size:13px; color:#64748b; font-weight:500; }
        .md-content { max-width:1100px; margin:0 auto; padding:24px 20px 60px; }
        .md-tabs { display:flex; gap:4px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:4px; margin-bottom:24px; }
        .md-tab { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:12px 16px; border-radius:9px; border:none; cursor:pointer; font-family:'Montserrat',sans-serif; font-weight:700; font-size:13px; color:#64748b; background:transparent; transition:0.2s; }
        .md-tab.active { background:linear-gradient(135deg,rgba(255,31,31,0.18),rgba(255,31,31,0.06)); color:#ff1f1f; box-shadow:0 0 15px rgba(255,31,31,0.12); }
        .md-panel { display:none; } .md-panel.active { display:block; }
        .md-card { background:rgba(30,41,59,0.5); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:24px; }
        .md-card-title { font-family:'Montserrat',sans-serif; font-size:13px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#94a3b8; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .md-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media (max-width:768px) {
          .md-team-logo { width:64px; height:64px; padding:8px; border-width:2px; }
          .md-team-name { font-size:0.9rem; }
          .md-score-num { font-size:2.5rem; width:50px; }
          .md-grid-2 { grid-template-columns:1fr; }
          .md-tab span { display:none; }
        }
      `}</style>

      <div className="md-body">
        <div className="md-hero">
          <div className="md-hero-bar" />
          <div className="md-hero-inner">
            <div className="md-breadcrumb">
              <button onClick={() => navigate(-1)}><IconBack /> Volver</button>
              <span>·</span>
              <span style={{ color:"#94a3b8" }}>Detalle del Partido</span>
            </div>

            <div className="md-meta">
              <span className="md-badge" style={{ color: statusColor, background:`${statusColor}15`, border:`1px solid ${statusColor}33` }}>
                {isLive && <span style={{ width:7, height:7, borderRadius:"50%", background:statusColor, display:"inline-block" }} />}
                {statusText}
              </span>
              {partido.fecha && (
                <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#94a3b8" }}>
                  <IconCalendar /> {new Date(partido.fecha).toLocaleDateString("es-SV", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
                </span>
              )}
            </div>

            <div className="md-scoreboard">
              <div className="md-team-hero">
                <div className="md-team-logo">
                  {logoUrl(partido.local_logo) ? <img src={logoUrl(partido.local_logo)} alt={partido.local_nombre} /> : <span style={{ fontSize:32 }}>🛡️</span>}
                </div>
                <span className="md-team-name">{partido.local_nombre}</span>
              </div>

              <div className="md-score-box">
                {isPending ? (
                  <div className="md-score-vs">VS</div>
                ) : (
                  <div className="md-score">
                    <span className="md-score-num" style={{ color: parseInt(partido.goles_local) > parseInt(partido.goles_visitante) ? "#f1f5f9" : "rgba(255,255,255,0.4)" }}>{partido.goles_local ?? 0}</span>
                    <span className="md-score-sep">:</span>
                    <span className="md-score-num" style={{ color: parseInt(partido.goles_visitante) > parseInt(partido.goles_local) ? "#f1f5f9" : "rgba(255,255,255,0.4)" }}>{partido.goles_visitante ?? 0}</span>
                  </div>
                )}
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#334155" }}>
                  {isFinished ? "FINAL" : isPending ? "PENDIENTE" : "EN JUEGO"}
                </span>
              </div>

              <div className="md-team-hero">
                <div className="md-team-logo">
                  {logoUrl(partido.visitante_logo) ? <img src={logoUrl(partido.visitante_logo)} alt={partido.visitante_nombre} /> : <span style={{ fontSize:32 }}>🛡️</span>}
                </div>
                <span className="md-team-name">{partido.visitante_nombre}</span>
              </div>
            </div>

            <div className="md-info-row">
              {partido.estadio && <span className="md-info-item"><IconStadium /> {partido.estadio}</span>}
              {partido.ciudad  && <span className="md-info-item">📍 {partido.ciudad}</span>}
            </div>
          </div>
        </div>

        <div className="md-content">
          <div className="md-tabs">
            {[ { key:"comentarios", label:"Narración", icon:<IconMessages /> }, { key:"formacion", label:"Alineaciones", icon:<IconFormation /> }, { key:"plantilla", label:"Plantillas", icon:<IconUsers /> }].map(t => (
              <button key={t.key} className={`md-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>
                {t.icon} <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className={`md-panel${activeTab === "comentarios" ? " active" : ""}`}>
            <div className="md-card">
              <div className="md-card-title"><IconMessages /> Narración</div>
              <Timeline comentarios={comentarios} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
            </div>
          </div>

          <div className={`md-panel${activeTab === "formacion" ? " active" : ""}`}>
            <div className="md-card">
              <div className="md-card-title"><IconFormation /> Alineaciones</div>
              <div className="md-grid-2">
                <div>
                  <div style={{ fontSize:12, fontWeight:700, textAlign:"center", marginBottom:8, color:"#ef4444", letterSpacing:1, textTransform:"uppercase" }}>{partido.local_nombre} ({partido.local_formacion || "4-4-2"})</div>
                  <FootballField jugadores={jugadores_local} formacion={partido.local_formacion} flipped={false} />
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, textAlign:"center", marginBottom:8, color:"#3b82f6", letterSpacing:1, textTransform:"uppercase" }}>{partido.visitante_nombre} ({partido.visitante_formacion || "4-4-2"})</div>
                  <FootballField jugadores={jugadores_visitante} formacion={partido.visitante_formacion} flipped={true} />
                </div>
              </div>
            </div>
          </div>

          <div className={`md-panel${activeTab === "plantilla" ? " active" : ""}`}>
            <div className="md-grid-2">
              <div className="md-card">
                <div className="md-card-title" style={{ color:"#ef4444" }}>
                  {logoUrl(partido.local_logo) && <img src={logoUrl(partido.local_logo)} alt="" style={{ width:20, height:20, objectFit:"contain" }} />} {partido.local_nombre}
                </div>
                <PlayerList jugadores={jugadores_local} color="#ef4444" />
              </div>
              <div className="md-card">
                <div className="md-card-title" style={{ color:"#3b82f6" }}>
                  {logoUrl(partido.visitante_logo) && <img src={logoUrl(partido.visitante_logo)} alt="" style={{ width:20, height:20, objectFit:"contain" }} />} {partido.visitante_nombre}
                </div>
                <PlayerList jugadores={jugadores_visitante} color="#3b82f6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

