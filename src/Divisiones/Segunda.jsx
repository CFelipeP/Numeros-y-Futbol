import React, { useEffect, useState, useMemo, useCallback } from "react";
import Header from "../components/Header";
import "./styles2.css";

const API_BASE = "http://numeros-y-futbol.test/backend/";

const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconStadium = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22h20" /><path d="M6 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" />
  </svg>
);
const IconTrophy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
const IconMapPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconAlert = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);
const IconCompass = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);
const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IconChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconTarget = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const logoUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const encoded = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  return `${API_BASE}${encoded}`;
};

const safeFetch = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  if (text.trim().startsWith("<")) throw new Error("El servidor devolvió HTML en vez de JSON");
  return JSON.parse(text);
};

const getDG = (gf, gc) => { const d = gf - gc; return d > 0 ? `+${d}` : `${d}`; };
const PLAYOFF_BADGE = { bg: "rgba(16,185,129,0.15)", color: "#10b981", label: "PlayOff" };
const getMatchStatus = (e) => {
  if (!e) return { text: "Por definir", variant: "default" };
  const l = e.toLowerCase();
  if (l.includes("vivo") || l.includes("live") || l.includes("jugando")) return { text: "EN VIVO", variant: "live" };
  if (l.includes("finalizado") || l.includes("ft") || l.includes("terminado")) return { text: "Finalizado", variant: "finished" };
  if (l.includes("programado") || l.includes("pendiente") || l.includes("por jugar")) return { text: "Programado", variant: "scheduled" };
  return { text: e, variant: "default" };
};

const normalizeMatch = (m, tm) => {
  if (!m) return null;
  const sc = m.score || "";
  let gl = m.goles_local, gv = m.goles_visitante;
  if (gl === "-1" || gl === -1) gl = null;
  if (gv === "-1" || gv === -1) gv = null;
  if ((gl == null || gl === "") && sc && sc !== "-") { const p = String(sc).split(" - "); gl = p[0] != null && p[0] !== "" ? parseInt(p[0]) : null; gv = p[1] != null && p[1] !== "" ? parseInt(p[1]) : null; }
  const hn = m.home_name || m.local_nombre || "", an = m.away_name || m.visitante_nombre || "";
  let hl = m.home_logo || m.local_logo || "", al = m.away_logo || m.visitante_logo || "";
  if (!hl && m.home_id && tm[String(m.home_id)]?.logo) hl = tm[String(m.home_id)].logo;
  if (!hl && m.local_id && tm[String(m.local_id)]?.logo) hl = tm[String(m.local_id)].logo;
  if (!al && m.away_id && tm[String(m.away_id)]?.logo) al = tm[String(m.away_id)].logo;
  if (!al && m.visitante_id && tm[String(m.visitante_id)]?.logo) al = tm[String(m.visitante_id)].logo;
  if (!hl && hn) { const f = Object.values(tm).find(t => t.nombre === hn); if (f?.logo) hl = f.logo; }
  if (!al && an) { const f = Object.values(tm).find(t => t.nombre === an); if (f?.logo) al = f.logo; }
  return { home_name: hn, away_name: an, home_logo: hl, away_logo: al, goles_local: gl != null ? gl : null, goles_visitante: gv != null ? gv : null, fecha: m.fecha || m.date || "", estado: m.estado || m.status || "" };
};

const ResultRow = ({ m }) => {
  const hw = parseInt(m.goles_local) > parseInt(m.goles_visitante), aw = parseInt(m.goles_visitante) > parseInt(m.goles_local);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 0.8rem", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "all 0.2s ease", cursor: "default" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: 3, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.home_logo && <img src={logoUrl(m.home_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}</div>
      <span style={{ fontSize: "0.75rem", fontWeight: hw ? 800 : 600, color: hw ? "var(--color-white)" : "var(--color-text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.home_name}</span>
      <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-white)", fontFamily: "var(--font-heading)", letterSpacing: "1px", flexShrink: 0, textShadow: "0 0 10px rgba(34,197,94,0.3)" }}>{m.goles_local ?? "-"} - {m.goles_visitante ?? "-"}</span>
      <span style={{ fontSize: "0.75rem", fontWeight: aw ? 800 : 600, color: aw ? "var(--color-white)" : "var(--color-text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{m.away_name}</span>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: 3, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.away_logo && <img src={logoUrl(m.away_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}</div>
    </div>
  );
};

const ZonaHeader = ({ zona, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 1rem", borderRadius: "10px", marginBottom: "0.8rem", background: `linear-gradient(90deg, ${color}12, transparent)`, border: `1px solid ${color}25` }}>
    <IconCompass /><span style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color }}>{zona === "Este" ? "Zona Este" : "Zona Oeste"}</span>
    <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>{zona === "Este" ? "EAST" : "WEST"}</span>
  </div>
);

const TablaClasificacion = ({ datos, playoffTeamIds, showGrupo }) => (
  <div className="table-container">
    <table className="standings-table"><thead><tr><th style={{ width: 40, textAlign: "center" }}>#</th><th style={{ textAlign: "left", paddingLeft: 16 }}>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th style={{ minWidth: 50 }}>PTS</th></tr></thead><tbody>
      {datos.length === 0 && <tr><td colSpan={10} style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--color-text-muted)" }}>Sin equipos en esta zona</td></tr>}
      {datos.map((team, index) => { const isPO = playoffTeamIds?.has(team.equipo_id); const dg = getDG(team.gf, team.gc); return (
        <tr key={team.id} style={{ borderLeft: isPO ? "3px solid #10b981" : "3px solid transparent", transition: "all 0.2s ease", background: isPO ? "rgba(16,185,129,0.04)" : "transparent" }}>
          <td style={{ textAlign: "center" }}><span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{index + 1}</span></td>
          <td className="team-cell" style={{ paddingLeft: 16 }}>{team.logo && <img src={logoUrl(team.logo)} alt="" style={{ width: 28, height: 28, objectFit: "contain", background: "rgba(255,255,255,0.06)", borderRadius: "50%", padding: 3 }} />}<span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--color-text-main)", whiteSpace: "nowrap" }}>{team.nombre}</span>{showGrupo && team.grupo && <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: team.grupo === "East" ? "#3b82f6" : "#f59e0b", background: team.grupo === "East" ? "rgba(59,130,246,0.1)" : "rgba(245,158,11,0.1)", padding: "0.1rem 0.4rem", borderRadius: "3px", marginLeft: "6px" }}>{team.grupo === "East" ? "A" : "B"}</span>}</td>
          <td>{team.pj}</td><td style={{ color: "#10b981", fontWeight: 600 }}>{team.pg}</td><td style={{ color: "#f59e0b", fontWeight: 600 }}>{team.pe}</td><td style={{ color: "#ef4444", fontWeight: 600 }}>{team.pp}</td><td>{team.gf}</td><td>{team.gc}</td><td style={{ fontWeight: 700, color: team.gf - team.gc > 0 ? "#10b981" : team.gf - team.gc < 0 ? "#ef4444" : "var(--color-text-muted)", fontSize: "0.85rem" }}>{dg}</td><td style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-white)", fontFamily: "var(--font-heading)", textShadow: "0 0 8px rgba(34,197,94,0.3)" }}>{team.pts}</td>
        </tr>);
      })}
    </tbody></table>
  </div>
);

const FeaturedMatchCard = ({ match }) => {
  const st = getMatchStatus(match.estado); const isF = st.variant === "finished", isL = st.variant === "live", isS = st.variant === "scheduled";
  const hw = match.goles_local != null && match.goles_visitante != null && match.goles_local > match.goles_visitante;
  const aw = match.goles_local != null && match.goles_visitante != null && match.goles_visitante > match.goles_local;
  const sc = isL ? "#ef4444" : isF ? "#10b981" : "#f59e0b", sb = isL ? "rgba(239,68,68,0.15)" : isF ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)";
  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "linear-gradient(160deg,#1a1f35 0%,#0d1117 40%,#111827 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,transparent 0%,${sc}66 30%,${sc} 50%,${sc}66 70%,transparent 100%)` }} />
      <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 280, height: 180, borderRadius: "50%", background: `radial-gradient(ellipse,${sc}12 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", padding: "1.6rem 1.4rem 1.4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><IconStar /><span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.4)" }}>Destacado</span></div><span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: sc, background: sb, padding: "4px 12px", borderRadius: 20, border: `1px solid ${sc}25`, animation: isL ? "fp2 2s ease-in-out infinite" : "none" }}>{st.text}</span></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, maxWidth: 130 }}><div style={{ width: 62, height: 62, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.06)", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}><img src={logoUrl(match.home_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} /></div><span style={{ fontSize: "0.72rem", fontWeight: hw ? 800 : 600, color: hw ? "#fff" : "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.25, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{match.home_name}</span>{hw && <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(16,185,129,0.15)" }}>Ganador</span>}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "0 0.8rem", flexShrink: 0 }}><div style={{ display: "flex", alignItems: "center", background: "rgba(0,0,0,0.35)", borderRadius: 14, padding: "6px 4px", border: "1px solid rgba(255,255,255,0.04)", boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)" }}><span style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "var(--font-heading)", color: hw ? "#fff" : "rgba(255,255,255,0.6)", width: 48, textAlign: "center", lineHeight: 1 }}>{match.goles_local ?? "-"}</span><span style={{ fontSize: "1rem", color: "rgba(255,255,255,0.2)", margin: "0 2px" }}>:</span><span style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "var(--font-heading)", color: aw ? "#fff" : "rgba(255,255,255,0.6)", width: 48, textAlign: "center", lineHeight: 1 }}>{match.goles_visitante ?? "-"}</span></div><span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.25)" }}>{isS ? "VS" : "FT"}</span></div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, maxWidth: 130 }}><div style={{ width: 62, height: 62, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.06)", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}><img src={logoUrl(match.away_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} /></div><span style={{ fontSize: "0.72rem", fontWeight: aw ? 800 : 600, color: aw ? "#fff" : "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.25, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{match.away_name}</span>{aw && <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(16,185,129,0.15)" }}>Ganador</span>}</div>
        </div>
        <div style={{ height: 1, margin: "1.4rem 0 1rem", background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 30%,rgba(255,255,255,0.06) 70%,transparent 100%)" }} />
        {match.fecha && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}><IconCalendar /><span>{match.fecha}</span></div>}
      </div>
      <style>{`@keyframes fp2{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.3)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}`}</style>
    </div>
  );
};

// ================= CONSTANTES DE POSICIONES Y FORMACIONES =================
const posiciones = [
  { value: "portero", label: "Portero", cat: "portero", color: "#f59e0b", abbr: "POR" }, { value: "lateral_izquierdo", label: "Lateral Izquierdo", cat: "defensa", color: "#60a5fa", abbr: "LI" },
  { value: "lateral_derecho", label: "Lateral Derecho", cat: "defensa", color: "#60a5fa", abbr: "LD" }, { value: "central", label: "Central", cat: "defensa", color: "#3b82f6", abbr: "DFC" },
  { value: "medio_defensivo", label: "Medio Defensivo", cat: "medio", color: "#34d399", abbr: "MCD" }, { value: "medio_central", label: "Medio Central", cat: "medio", color: "#10b981", abbr: "MC" },
  { value: "medio_ofensivo", label: "Medio Ofensivo", cat: "medio", color: "#059669", abbr: "MCO" }, { value: "extremo_izquierdo", label: "Extremo Izquierdo", cat: "medio", color: "#6ee7b7", abbr: "EI" },
  { value: "extremo_derecho", label: "Extremo Derecho", cat: "medio", color: "#6ee7b7", abbr: "ED" }, { value: "centrodelantero", label: "Centrodelantero", cat: "delantero", color: "#ef4444", abbr: "DC" },
  { value: "segundo_delantero", label: "2do Delantero", cat: "delantero", color: "#f87171", abbr: "SD" },
];
const catCfg = {
  portero: { color: "#f59e0b", border: "rgba(245,158,11,0.2)", label: "PORTEROS", grad: "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.02))", icon: "🧤" },
  defensa: { color: "#3b82f6", border: "rgba(59,130,246,0.2)", label: "DEFENSAS", grad: "linear-gradient(135deg,rgba(59,130,246,0.08),rgba(59,130,246,0.02))", icon: "🛡️" },
  medio: { color: "#10b981", border: "rgba(16,185,129,0.2)", label: "MEDIOS", grad: "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.02))", icon: "⚽" },
  delantero: { color: "#ef4444", border: "rgba(239,68,68,0.2)", label: "DELANTEROS", grad: "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))", icon: "🎯" },
};
const posCompat = {
  lateral_izquierdo: ["lateral_izquierdo", "lateral_derecho"], lateral_derecho: ["lateral_derecho", "lateral_izquierdo"], medio_defensivo: ["medio_defensivo", "medio_central"],
  medio_central: ["medio_central", "medio_defensivo", "medio_ofensivo"], medio_ofensivo: ["medio_ofensivo", "medio_central"], extremo_izquierdo: ["extremo_izquierdo", "extremo_derecho"],
  extremo_derecho: ["extremo_derecho", "extremo_izquierdo"], centrodelantero: ["centrodelantero", "segundo_delantero"], segundo_delantero: ["segundo_delantero", "centrodelantero"],
};
function getPosInfo(v) {
  const p = posiciones.find(x => x.value === v);
  if (p) return p;
  const fb = { portero: "portero", defensa: "defensa", medio: "medio", delantero: "delantero" }; const c = fb[v];
  if (c) return { label: v.charAt(0).toUpperCase() + v.slice(1), cat: c, color: catCfg[c].color, abbr: v.substring(0, 2).toUpperCase() };
  return { label: v || "?", cat: "delantero", color: "#64748b", abbr: "??" };
}
const formations = {
  "4-4-2": [{ sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 }, { sp: "central", sc: "defensa", x: 36, y: 74 }, { sp: "central", sc: "defensa", x: 64, y: 74 }, { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 }, { sp: "extremo_izquierdo", sc: "medio", x: 18, y: 48 }, { sp: "medio_central", sc: "medio", x: 40, y: 46 }, { sp: "medio_central", sc: "medio", x: 60, y: 46 }, { sp: "extremo_derecho", sc: "medio", x: 82, y: 48 }, { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 }],
  "4-3-3": [{ sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 }, { sp: "central", sc: "defensa", x: 36, y: 74 }, { sp: "central", sc: "defensa", x: 64, y: 74 }, { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 }, { sp: "medio_defensivo", sc: "medio", x: 28, y: 48 }, { sp: "medio_central", sc: "medio", x: 50, y: 44 }, { sp: "medio_defensivo", sc: "medio", x: 72, y: 48 }, { sp: "extremo_izquierdo", sc: "medio", x: 18, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 }, { sp: "extremo_derecho", sc: "medio", x: 82, y: 22 }],
  "3-5-2": [{ sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "central", sc: "defensa", x: 25, y: 74 }, { sp: "central", sc: "defensa", x: 50, y: 76 }, { sp: "central", sc: "defensa", x: 75, y: 74 }, { sp: "lateral_izquierdo", sc: "defensa", x: 10, y: 50 }, { sp: "medio_central", sc: "medio", x: 30, y: 48 }, { sp: "medio_central", sc: "medio", x: 50, y: 44 }, { sp: "medio_central", sc: "medio", x: 70, y: 48 }, { sp: "lateral_derecho", sc: "defensa", x: 90, y: 50 }, { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 }],
  "4-2-3-1": [{ sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 }, { sp: "central", sc: "defensa", x: 36, y: 74 }, { sp: "central", sc: "defensa", x: 64, y: 74 }, { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 }, { sp: "medio_defensivo", sc: "medio", x: 38, y: 56 }, { sp: "medio_defensivo", sc: "medio", x: 62, y: 56 }, { sp: "extremo_izquierdo", sc: "medio", x: 20, y: 38 }, { sp: "medio_ofensivo", sc: "medio", x: 50, y: 34 }, { sp: "extremo_derecho", sc: "medio", x: 80, y: 38 }, { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 }],
  "5-3-2": [{ sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "lateral_izquierdo", sc: "defensa", x: 8, y: 66 }, { sp: "central", sc: "defensa", x: 28, y: 74 }, { sp: "central", sc: "defensa", x: 50, y: 76 }, { sp: "central", sc: "defensa", x: 72, y: 74 }, { sp: "lateral_derecho", sc: "defensa", x: 92, y: 66 }, { sp: "medio_central", sc: "medio", x: 28, y: 48 }, { sp: "medio_central", sc: "medio", x: 50, y: 44 }, { sp: "medio_central", sc: "medio", x: 72, y: 48 }, { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 }],
  "3-4-3": [{ sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "central", sc: "defensa", x: 25, y: 74 }, { sp: "central", sc: "defensa", x: 50, y: 76 }, { sp: "central", sc: "defensa", x: 75, y: 74 }, { sp: "extremo_izquierdo", sc: "medio", x: 12, y: 50 }, { sp: "medio_central", sc: "medio", x: 38, y: 48 }, { sp: "medio_central", sc: "medio", x: 62, y: 48 }, { sp: "extremo_derecho", sc: "medio", x: 88, y: 50 }, { sp: "extremo_izquierdo", sc: "medio", x: 18, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 }, { sp: "extremo_derecho", sc: "medio", x: 82, y: 22 }],
};

function autoAssign(jugadores, fKey) {
  const tpl = formations[fKey];
  if (!tpl || !jugadores?.length) return { starters: [], subs: [...jugadores] };
  const isTit = j => j.es_titular == 1 || j.es_titular === true;
  const sorted = [...jugadores].sort((a, b) => (isTit(b) ? 1 : 0) - (isTit(a) ? 1 : 0));
  const used = new Set(), starters = [], filled = new Set();
  const pick = (fn) => sorted.find(j => fn(j) && !used.has(j.id));
  for (let i = 0; i < tpl.length; i++) { const s = tpl[i], compat = posCompat[s.sp] || [s.sp]; const p = pick(j => compat.includes(j.posicion)); if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); } }
  for (let i = 0; i < tpl.length; i++) { if (filled.has(i)) continue; const s = tpl[i], p = pick(j => getPosInfo(j.posicion).cat === s.sc); if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); } }
  for (let i = 0; i < tpl.length; i++) { if (filled.has(i)) continue; const slot = tpl[i], p = pick(() => true); if (p) { starters.push({ ...p, px: slot.x, py: slot.y }); used.add(p.id); filled.add(i); } }
  return { starters, subs: jugadores.filter(j => !used.has(j.id)) };
}

// ================= COMPONENTES DE VISTA DE EQUIPO =================
const PublicPlayerRow = ({ j }) => {
  const pi = getPosInfo(j.posicion); const isGK = pi.cat === "portero";
  return (
    <div className="pv-player-row">
      <div className="pv-row-num" style={{ background: `${pi.color}15`, color: pi.color }}>{j.numero_camiseta || "–"}</div>
      <div className="pv-row-photo">{j.foto ? <img src={j.foto.startsWith("http") ? j.foto : `${API_BASE}${j.foto}`} alt="" /> : <div className="pv-photo-placeholder"><IconShield /></div>}</div>
      <div className="pv-row-info"><span className="pv-row-name">{j.nombre}</span><span className="pv-row-meta">{[j.edad && `${j.edad} años`, j.nacionalidad].filter(Boolean).join(" · ")}</span></div>
      <span className="pv-row-pos" style={{ color: pi.color, borderColor: `${pi.color}30`, background: `${pi.color}0a` }} title={pi.label}>{pi.abbr}</span>
      <div className="pv-row-stats">{isGK ? (<><b style={{ color: "#f59e0b" }}>{j.goles_recibidos || 0}</b><small>GR</small><b style={{ color: "#10b981" }}>{j.vaya_invicta || 0}</b><small>VI</small></>) : (<><b style={{ color: "#ef4444" }}>{j.goles || 0}</b><small>G</small><b style={{ color: "#3b82f6" }}>{j.asistencias || 0}</b><small>A</small></>)}</div>
      <span className="pv-row-pj">{j.pj || 0} <small>PJ</small></span>
    </div>
  );
};
const PublicPosGroup = ({ cat, jugadores }) => {
  const cfg = catCfg[cat]; if (!jugadores?.length) return null;
  return (
    <div className="pv-pos-group">
      <div className="pv-group-head" style={{ borderColor: cfg.border, background: cfg.grad }}><span className="pv-group-icon">{cfg.icon}</span><span className="pv-group-label" style={{ color: cfg.color }}>{cfg.label}</span><span className="pv-group-count" style={{ color: cfg.color, background: `${cfg.color}12` }}>{jugadores.length}</span></div>
      <div className="pv-group-list">{jugadores.map(j => <PublicPlayerRow key={j.id} j={j} />)}</div>
    </div>
  );
};
const PublicTeamView = ({ teamData, viewTab, setViewTab }) => {
  const formacion = teamData?.equipo?.formacion || "4-4-2";
  const jugadores = teamData?.jugadores || [];
  const { starters, subs } = useMemo(() => autoAssign(jugadores, formacion), [jugadores, formacion]);
  const groups = useMemo(() => { const all = { portero: [], defensa: [], medio: [], delantero: [] }; jugadores.forEach(j => { const c = getPosInfo(j.posicion).cat; if (all[c]) all[c].push(j); }); return all; }, [jugadores]);
  const totalGoles = useMemo(() => jugadores.reduce((s, j) => s + (j.goles || 0), 0), [jugadores]);
  const totalAsistencias = useMemo(() => jugadores.reduce((s, j) => s + (j.asistencias || 0), 0), [jugadores]);
  const avgAge = useMemo(() => { const a = jugadores.filter(j => j.edad).map(j => j.edad); return a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : "–"; }, [jugadores]);

  return (
    <div className="pv-team-page">
      <button className="pv-back-btn" onClick={() => window.location.hash = "equipos"}><IconChevronLeft /> Volver a Equipos</button>
      <div className="pv-hero-card"><div className="pv-hero-bg-pattern" /><div className="pv-hero-content">
        <div className="pv-hero-left"><div className="pv-hero-logo-ring"><img src={logoUrl(teamData?.equipo?.logo)} alt="" /></div><div className="pv-hero-text"><h2>{teamData?.equipo?.nombre}</h2><div className="pv-hero-meta">{[teamData?.equipo?.ciudad && <span key="c"><IconMapPin /> {teamData.equipo.ciudad}</span>, teamData?.equipo?.estadio && <span key="e"><IconStadium /> {teamData.equipo.estadio}</span>].filter(Boolean).map((el, i) => (<React.Fragment key={i}>{i > 0 && <span className="pv-meta-sep">·</span>}{el}</React.Fragment>))}</div></div></div>
        <div className="pv-hero-stats-row">{[{ v: jugadores.length, l: "Jugadores", c: "#f1f5f9" }, { v: jugadores.filter(j => j.es_titular == 1).length, l: "Titulares", c: "#f59e0b" }, { v: totalGoles, l: "Goles", c: "#ef4444" }, { v: totalAsistencias, l: "Asistencias", c: "#3b82f6" }, { v: avgAge, l: "Edad prom.", c: "#8b5cf6" }].map((s, i) => (<React.Fragment key={i}>{i > 0 && <div className="pv-hero-stat-divider" />}<div className="pv-hero-stat"><strong style={{ color: s.c }}>{s.v}</strong><span>{s.l}</span></div></React.Fragment>))}</div>
      </div></div>
      <div className="pv-tabs-bar"><button className={`pv-tab-btn${viewTab === "plantilla" ? " active" : ""}`} onClick={() => setViewTab("plantilla")}><IconUsers /> Plantilla</button><button className={`pv-tab-btn${viewTab === "formacion" ? " active" : ""}`} onClick={() => setViewTab("formacion")}><IconTarget /> Formación</button></div>
      {viewTab === "plantilla" && (<div className="pv-roster-wrap">{Object.keys(catCfg).map(cat => <PublicPosGroup key={cat} cat={cat} jugadores={groups[cat]} />)}</div>)}
      {viewTab === "formacion" && (
        <div className="pv-fm-section">
          <div className="pv-fm-locked"><span className="pv-fm-badge">{formacion}</span><span className="pv-fm-locked-label">Formación configurada desde el panel de administración</span></div>
          <div className="pv-pitch-wrap"><div className="pv-pitch">
            <svg className="pv-pitch-svg" viewBox="0 0 680 1050" preserveAspectRatio="none"><rect x="1" y="1" width="678" height="1048" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" rx="2" /><line x1="0" y1="525" x2="680" y2="525" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><circle cx="340" cy="525" r="91" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><circle cx="340" cy="525" r="4" fill="rgba(255,255,255,0.15)" /><rect x="136" y="1" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><rect x="224" y="1" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><circle cx="340" cy="110" r="3" fill="rgba(255,255,255,0.15)" /><path d="M 248 165 A 91 91 0 0 0 432 165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><rect x="136" y="884" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><rect x="224" y="994" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><circle cx="340" cy="940" r="3" fill="rgba(255,255,255,0.15)" /><path d="M 248 885 A 91 91 0 0 1 432 885" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><path d="M 1 20 A 20 20 0 0 0 21 1" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><path d="M 659 1 A 20 20 0 0 0 679 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><path d="M 1 1030 A 20 20 0 0 1 21 1049" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /><path d="M 659 1049 A 20 20 0 0 1 679 1030" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" /></svg>
            {starters.map((s, idx) => { const pi = getPosInfo(s.posicion); const isTit = s.es_titular == 1 || s.es_titular === true; return (
              <div key={s.id || idx} className="pv-pp" style={{ left: `${s.px}%`, top: `${s.py}%`, animationDelay: `${idx * 0.06}s` }}>
                <div className="pv-pp-dot" style={{ background: pi.color, boxShadow: `0 0 12px ${pi.color}50, inset 0 -2px 6px rgba(0,0,0,0.3)`, borderColor: isTit ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)" }}>{s.foto ? <img src={s.foto.startsWith("http") ? s.foto : `${API_BASE}${s.foto}`} alt="" /> : <span>{s.numero_camiseta || "–"}</span>}</div>
                <span className="pv-pp-name">{s.nombre.split(" ").pop()}</span><span className="pv-pp-role">{pi.abbr}</span>
              </div>);
            })}
            {starters.length < 11 && <div className="pv-pitch-empty"><p>Faltan jugadores</p><span>{starters.length}/11 titulares</span></div>}
          </div></div>
          {subs.length > 0 && (
            <div className="pv-subs-card"><h4 className="pv-subs-title"><span className="pv-subs-bench-icon">🪑</span> Suplentes <span>{subs.length}</span></h4><div className="pv-subs-grid">
              {subs.map(s => { const pi = getPosInfo(s.posicion); return (
                <div key={s.id} className="pv-sub-card" style={{ borderLeftColor: pi.color }}>
                  <div className="pv-sub-avatar">{s.foto ? <img src={s.foto.startsWith("http") ? s.foto : `${API_BASE}${s.foto}`} alt="" /> : <div className="pv-sub-avatar-empty"><IconShield /></div>}</div>
                  <div className="pv-sub-details"><span className="pv-sub-name">{s.nombre}</span><span className="pv-sub-meta-row"><span className="pv-sub-number" style={{ color: pi.color }}>#{s.numero_camiseta || "–"}</span><span className="pv-sub-pos-label" style={{ color: pi.color, background: `${pi.color}10`, borderColor: `${pi.color}20` }}>{pi.abbr}</span>{s.edad && <span className="pv-sub-age">{s.edad}a</span>}</span></div>
                  <div className="pv-sub-mini-stats">{pi.cat === "portero" ? (<><span style={{ color: "#f59e0b" }}>{s.goles_recibidos || 0}<small>GR</small></span><span style={{ color: "#10b981" }}>{s.vaya_invicta || 0}<small>VI</small></span></>) : (<><span style={{ color: "#ef4444" }}>{s.goles || 0}<small>G</small></span><span style={{ color: "#3b82f6" }}>{s.asistencias || 0}<small>A</small></span></>)}</div>
                </div>);
              })}
            </div></div>
          )}
        </div>
      )}
    </div>
  );
};

// ================= COMPONENTE PRINCIPAL =================
export default function SegundaDivision() {
  const [hash, setHash] = useState(window.location.hash);
  const [tabla, setTabla] = useState([]);
  const [match, setMatch] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("clasificacion");
  const [vistaZona, setVistaZona] = useState("general");
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [expandedViewTab, setExpandedViewTab] = useState("plantilla");
  const [sidebar, setSidebar] = useState({ next: null, recent: [] });

  useEffect(() => { const h = () => setHash(window.location.hash); window.addEventListener("hashchange", h); return () => window.removeEventListener("hashchange", h); }, []);
  useEffect(() => {
    if (hash === "#equipos") { setActiveTab("equipos"); setExpandedTeam(null); }
    else if (hash.startsWith("#equipo-")) { setActiveTab("equipos"); const parts = hash.replace("#equipo-", "").split("-"); const id = parts[0], view = parts[1] || "plantilla"; setExpandedViewTab(view); if (!expandedTeam || String(expandedTeam.equipo?.id) !== String(id)) loadTeamDetail(id); }
    else { setActiveTab("clasificacion"); setExpandedTeam(null); }
  }, [hash]);

  const loadTeamDetail = async (id) => { setExpandedTeam({ equipo: { id }, jugadores: [] }); try { const data = await safeFetch(`${API_BASE}get_equipo_detalle_segunda.php?id=${id}`); setExpandedTeam(data); } catch (err) { console.error(err); setExpandedTeam(null); window.location.hash = "equipos"; } };
  const openTeam = (id) => { window.location.hash = `equipo-${id}-${expandedViewTab}`; };

  useEffect(() => {
    setLoading(true); setError(null);
    Promise.allSettled([safeFetch(`${API_BASE}get_tabla_segunda.php`), safeFetch(`${API_BASE}get_featured_match_segunda.php?t=${Date.now()}`), safeFetch(`${API_BASE}get_teams_segunda.php`), safeFetch(`${API_BASE}get_sidebar_matches_segunda.php`)]).then(r => {
      const tD = r[0].status === "fulfilled" ? r[0].value : []; const mD = r[1].status === "fulfilled" ? r[1].value : null; const eD = r[2].status === "fulfilled" ? r[2].value : []; const sD = r[3].status === "fulfilled" ? r[3].value : null;
      const tA = Array.isArray(tD) ? tD : [], eA = Array.isArray(eD) ? eD : [];
      setTabla(tA); setEquipos(eA); setSidebar(sD && typeof sD === "object" ? sD : { next: null, recent: [] });
      const tm = {}; eA.forEach(t => { tm[String(t.id)] = t; if (t.nombre) tm[t.nombre] = t; });
      let feat = null;
      if (mD && !Array.isArray(mD) && Object.keys(mD).length > 0 && (mD.home_name || mD.local_nombre)) { const n = normalizeMatch(mD, tm); if (n && n.home_name && n.away_name) feat = n; }
      setMatch(feat);
    }).catch(err => { console.error(err); setError(err.message); }).finally(() => setLoading(false));
  }, []);

  const getTeamStats = (id) => tabla.find(t => t.equipo_id === id);
  const tablaEast = tabla.filter(t => t.grupo === "East"); const tablaWest = tabla.filter(t => t.grupo === "West");
  const equiposEast = equipos.filter(e => e.grupo === "East"); const equiposWest = equipos.filter(e => e.grupo === "West");
  const playoffTeamIds = useMemo(() => {
    const ids = new Set(); const sd = a => [...a].sort((x, y) => y.pts - x.pts || (y.gf - y.gc) - (x.gf - x.gc));
    if (vistaZona === "general") { sd(tablaEast).slice(0, 4).forEach(t => ids.add(t.equipo_id)); sd(tablaWest).slice(0, 4).forEach(t => ids.add(t.equipo_id)); }
    else if (vistaZona === "East") sd(tablaEast).slice(0, 4).forEach(t => ids.add(t.equipo_id));
    else if (vistaZona === "West") sd(tablaWest).slice(0, 4).forEach(t => ids.add(t.equipo_id));
    return ids;
  }, [vistaZona, tablaEast, tablaWest]);
  const zonaButtons = [{ key: "general", label: "General", icon: "📊" }, { key: "East", label: "Grupo A", icon: "🧭" }, { key: "West", label: "Grupo B", icon: "🧭" }];
  const zonaColor = z => z.key === "East" ? "#3b82f6" : z.key === "West" ? "#f59e0b" : "#22c55e";
  const filteredEquipos = vistaZona === "general" ? equipos : vistaZona === "East" ? equiposEast : equiposWest;

  if (loading) return (<><Header /><section className="table-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.2)", borderTopColor: "#22c55e", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} /><p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "1px" }}>CARGANDO DATOS...</p><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div></section></>);
  if (error) return (<><Header /><section className="table-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="glass-card" style={{ maxWidth: 600, padding: "2.5rem", textAlign: "center", border: "1px solid rgba(239,68,68,0.3)" }}><div style={{ color: "#ef4444", marginBottom: "1rem" }}><IconAlert /></div><h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, color: "#ef4444", marginBottom: "0.8rem" }}>Error al cargar los datos</h3><p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{error}</p><button onClick={() => window.location.reload()} style={{ background: "linear-gradient(90deg, #22c55e, #15803d)", color: "white", border: "none", padding: "0.8rem 2rem", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Reintentar</button></div></section></>);

  return (
    <>
      <Header />
      <section className="table-section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ marginBottom: "1.5rem" }}><div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}><IconTrophy /><h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, textTransform: "uppercase", margin: 0, background: "linear-gradient(90deg, #fff, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Segunda División</h2></div><p style={{ color: "var(--color-text-muted)", fontSize: "1rem", margin: 0, paddingLeft: "1.8rem" }}>Clasificación por zonas, equipos y partido destacado</p></div>
        <div className="container" style={{ marginBottom: "2rem" }}><div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.05)" }}>{[{ key: "clasificacion", label: "Clasificación", icon: "📊" }, { key: "equipos", label: "Equipos", icon: "🛡️" }].map(tab => (<button key={tab.key} onClick={() => { setActiveTab(tab.key); setExpandedTeam(null); window.location.hash = tab.key; }} style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.5px", textTransform: "uppercase", background: activeTab === tab.key ? "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.08))" : "transparent", color: activeTab === tab.key ? "#22c55e" : "var(--color-text-muted)", boxShadow: activeTab === tab.key ? "0 0 15px rgba(34,197,94,0.15)" : "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}><span>{tab.icon}</span>{tab.label}</button>))}</div></div>

        {activeTab === "clasificacion" && !expandedTeam && (
          <div className="dashboard-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>{match && match.home_name ? <FeaturedMatchCard match={match} /> : <div className="glass-card" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}><div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}><span style={{ fontSize: "1.5rem", opacity: 0.3 }}>⚽</span></div><p style={{ fontSize: "0.9rem", margin: "0 0 0.3rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Sin partido destacado</p><p style={{ fontSize: "0.75rem", margin: 0, color: "rgba(255,255,255,0.25)" }}>Se mostrará cuando se configure desde el panel</p></div>}</div>
              <div className="glass-card" style={{ padding: "1.8rem" }}><div className="section-subtitle" style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 8px #f59e0b", display: "inline-block" }} />Próximo Partido</div>{sidebar.next ? (<div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(30,41,59,0.4) 100%)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 16, padding: "1.5rem 1.2rem" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}><span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#f59e0b", background: "rgba(245,158,11,0.12)", padding: "0.2rem 0.6rem", borderRadius: 6 }}>{getMatchStatus(sidebar.next.status || sidebar.next.estado).text}</span></div><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}><div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flex: 1, minWidth: 0 }}><div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", padding: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>{sidebar.next.home_logo && <img src={logoUrl(sidebar.next.home_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}</div><span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sidebar.next.home_name}</span></div><div style={{ flexShrink: 0 }}><span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", padding: "0.35rem 0.7rem", borderRadius: 8, letterSpacing: "1px" }}>VS</span></div><div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flex: 1, minWidth: 0, justifyContent: "flex-end" }}><span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{sidebar.next.away_name}</span><div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", padding: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>{sidebar.next.away_logo && <img src={logoUrl(sidebar.next.away_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}</div></div></div>{sidebar.next.fecha && <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.8rem", marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "var(--color-text-muted)" }}><IconCalendar /> {sidebar.next.fecha}</div>}</div>) : (<div style={{ textAlign: "center", padding: "1.5rem 1rem", color: "var(--color-text-muted)" }}><div style={{ fontSize: "1.3rem", marginBottom: "0.4rem", opacity: 0.3 }}>📅</div><p style={{ fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>No hay partidos pendientes</p></div>)}</div>
              <div className="glass-card" style={{ padding: "1.8rem" }}><div className="section-subtitle" style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />Últimos Resultados</div>{sidebar.recent?.length > 0 ? (<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>{sidebar.recent.map(m => (<div key={m.id}><ResultRow m={m} />{m.fecha && <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", paddingLeft: "0.8rem", paddingTop: "0.15rem", paddingBottom: "0.3rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}><IconClock /> {m.fecha}</div>}</div>))}</div>) : (<div style={{ textAlign: "center", padding: "1.5rem 1rem", color: "var(--color-text-muted)" }}><div style={{ fontSize: "1.3rem", marginBottom: "0.4rem", opacity: 0.3 }}>📋</div><p style={{ fontSize: "0.85rem", margin: 0 }}>No hay resultados aún</p></div>)}</div>
              <div className="glass-card" style={{ padding: "1.5rem" }}><div className="section-subtitle" style={{ marginTop: 0, fontSize: "0.85rem" }}>Leyenda</div><div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>{[{ color: "#10b981", label: "PlayOff — Top 4 de cada zona (8 equipos)" }, { color: "#3b82f6", label: "Grupo A (Este)" }, { color: "#f59e0b", label: "Grupo B (Oeste)" }].map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}40` }} /><span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>{item.label}</span></div>))}<div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}><span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-text-muted)", width: 18, textAlign: "center", flexShrink: 0 }}>DG</span><span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Diferencia de goles</span></div></div></div>
            </div>
            <div className="glass-card" style={{ padding: "1.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}><h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--color-white)" }}>Clasificación</h3><span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.3rem 0.8rem", borderRadius: 20, fontWeight: 600 }}>{vistaZona === "general" ? tabla.length : vistaZona === "East" ? tablaEast.length : tablaWest.length} equipos</span></div>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3, border: "1px solid rgba(255,255,255,0.05)" }}>{zonaButtons.map(z => { const a = vistaZona === z.key; const c = zonaColor(z); return (<button key={z.key} onClick={() => setVistaZona(z.key)} style={{ flex: 1, padding: "0.55rem 0.6rem", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.5px", textTransform: "uppercase", background: a ? `linear-gradient(135deg, ${c}25, ${c}10)` : "transparent", color: a ? c : "var(--color-text-muted)", boxShadow: a ? `0 0 12px ${c}20` : "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", borderBottom: a ? `2px solid ${c}` : "2px solid transparent" }}><span>{z.icon}</span>{z.label}</button>); })}</div>
              {vistaZona === "general" && <><TablaClasificacion datos={[...tabla].sort((a, b) => (b.pts - a.pts) || ((b.gf - b.gc) - (a.gf - a.gc)))} playoffTeamIds={playoffTeamIds} showGrupo={true} />{tabla.length > 0 && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem", color: "var(--color-text-muted)" }}><span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" })}</span><span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><IconStadium /> Segunda División · El Salvador</span></div>}</>}
              {vistaZona === "East" && <><ZonaHeader zona="Este" color="#3b82f6" /><TablaClasificacion datos={[...tablaEast].sort((a, b) => (b.pts - a.pts) || ((b.gf - b.gc) - (a.gf - a.gc)))} playoffTeamIds={playoffTeamIds} showGrupo={false} />{tablaEast.length > 0 && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem", color: "var(--color-text-muted)" }}><span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" })}</span><span style={{ color: "#3b82f6", fontWeight: 600 }}>ZONA ESTE · {tablaEast.length} equipos</span></div>}</>}
              {vistaZona === "West" && <><ZonaHeader zona="Oeste" color="#f59e0b" /><TablaClasificacion datos={[...tablaWest].sort((a, b) => (b.pts - a.pts) || ((b.gf - b.gc) - (a.gf - a.gc)))} playoffTeamIds={playoffTeamIds} showGrupo={false} />{tablaWest.length > 0 && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem", color: "var(--color-text-muted)" }}><span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" })}</span><span style={{ color: "#f59e0b", fontWeight: 600 }}>ZONA OESTE · {tablaWest.length} equipos</span></div>}</>}
            </div>
          </div>
        )}

        {activeTab === "equipos" && !expandedTeam && (
          <div className="container" style={{ paddingBottom: "var(--spacing-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}><div><h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, margin: "0 0 0.3rem 0", color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.6rem" }}><IconShield /> Clubes de la Temporada</h3><p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: 0 }}>Selecciona un equipo para ver su plantilla y formación</p></div><span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.4rem 1rem", borderRadius: 20, fontWeight: 600 }}>{filteredEquipos.length} clubes</span></div>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3, border: "1px solid rgba(255,255,255,0.05)", maxWidth: 400 }}>{zonaButtons.map(z => { const a = vistaZona === z.key; const c = zonaColor(z); return (<button key={z.key} onClick={() => setVistaZona(z.key)} style={{ flex: 1, padding: "0.55rem 0.6rem", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.5px", textTransform: "uppercase", background: a ? `linear-gradient(135deg, ${c}25, ${c}10)` : "transparent", color: a ? c : "var(--color-text-muted)", boxShadow: a ? `0 0 12px ${c}20` : "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", borderBottom: a ? `2px solid ${c}` : "2px solid transparent" }}><span>{z.icon}</span>{z.label}</button>); })}</div>
            {vistaZona === "East" && <ZonaHeader zona="Este" color="#3b82f6" />}{vistaZona === "West" && <ZonaHeader zona="Oeste" color="#f59e0b" />}
            {filteredEquipos.length === 0 ? (<div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--color-text-muted)" }}><p style={{ fontSize: "1.1rem" }}>No hay equipos en esta zona</p></div>) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {filteredEquipos.map(eq => { const stats = getTeamStats(eq.id); const isPO = playoffTeamIds.has(eq.id); const badge = isPO ? PLAYOFF_BADGE : null; const zonaTabla = vistaZona === "general" ? tabla : vistaZona === "East" ? tablaEast : tablaWest; return (
                  <div key={eq.id} className="glass-card" style={{ padding: 0, overflow: "hidden", transition: "all 0.3s ease", borderLeft: badge ? `3px solid ${badge.color}` : "3px solid transparent" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.4), 0 0 20px rgba(34,197,94,0.1)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; if (badge) e.currentTarget.style.borderLeftColor = badge.color; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderLeftColor = badge ? badge.color : "transparent"; }}>
                    <div style={{ height: 6, background: badge ? `linear-gradient(90deg, ${badge.color}, transparent)` : "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
                    <div style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}><div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: badge ? `2px solid ${badge.color}40` : "2px solid rgba(255,255,255,0.08)" }}>{eq.logo && <img src={logoUrl(eq.logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}</div><div style={{ flex: 1, minWidth: 0 }}><h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.2rem 0", color: "var(--color-white)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eq.nombre}</h4><div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>{badge && <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: badge.color, background: badge.bg, padding: "0.15rem 0.5rem", borderRadius: 4, border: `1px solid ${badge.color}30` }}>PlayOff</span>}{eq.grupo && <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: eq.grupo === "East" ? "#3b82f6" : "#f59e0b", background: eq.grupo === "East" ? "rgba(59,130,246,0.1)" : "rgba(245,158,11,0.1)", padding: "0.15rem 0.5rem", borderRadius: 4 }}>{eq.grupo}</span>}</div></div></div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.2rem" }}>{eq.ciudad && <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}><IconMapPin /><span>{eq.ciudad}</span></div>}{eq.estadio && <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}><IconStadium /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eq.estadio}</span></div>}</div>
                      {stats && (<><div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>{[{ l: "PJ", v: stats.pj, c: "var(--color-text-main)" }, { l: "G", v: stats.pg, c: "#10b981" }, { l: "E", v: stats.pe, c: "#f59e0b" }, { l: "P", v: stats.pp, c: "#ef4444" }].map((s, i) => (<div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: "1.1rem", fontWeight: 800, color: s.c, fontFamily: "var(--font-heading)", lineHeight: 1 }}>{s.v}</div><div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.l}</div></div>))}</div><div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Puntos</span><div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #22c55e, #15803d)", width: `${Math.min((stats.pts / (zonaTabla[0]?.pts || 1)) * 100, 100)}%`, transition: "width 0.5s ease" }} /></div><span style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--color-white)", fontFamily: "var(--font-heading)", textShadow: "0 0 10px rgba(34,197,94,0.4)" }}>{stats.pts}</span></div></div></>)}
                      <button onClick={() => openTeam(eq.id)} style={{ width: "100%", marginTop: "1.2rem", padding: "0.7rem", background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, color: "#22c55e", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }} onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(34,197,94,0.1))"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))"; e.currentTarget.style.transform = "translateY(0)"; }}>Ver Plantilla Completa</button>
                    </div>
                  </div>
                ); })}
              </div>
            )}
          </div>
        )}

        {activeTab === "equipos" && expandedTeam && expandedTeam.equipo && (
          <div className="container"><PublicTeamView teamData={expandedTeam} viewTab={expandedViewTab} setViewTab={tab => { setExpandedViewTab(tab); window.location.hash = `equipo-${expandedTeam.equipo.id}-${tab}`; }} /></div>
        )}
      </section>

      <footer className="footer" id="driver-footer"><div className="container footer-inner"><div className="footer-grid"><div className="footer-brand"><h3>NÚMEROS Y FÚTBOL</h3><p>Portal oficial de cobertura del fútbol salvadoreño.</p></div><div className="footer-section"><h4>Divisiones</h4><ul><li><a href="/primera">Primera División</a></li><li><a href="/segunda">Segunda División</a></li><li><a href="#tercera">Tercera División</a></li></ul></div><div className="footer-section"><h4>Contenido</h4><ul><li><a href="/news">Noticias</a></li><li><a href="#">Resultados</a></li><li><a href="/primera">Clasificaciones</a></li></ul></div><div className="footer-section"><h4>Síguenos</h4><ul><li><a href="#">Facebook</a></li><li><a href="#">Twitter / X</a></li><li><a href="#">Instagram</a></li></ul></div></div><div className="footer-bottom"><p>&copy; 2026 Números y Fútbol. Todos los derechos reservados.</p><div className="footer-links"><a href="#">Privacidad</a><a href="#">Términos</a><a href="#">Contacto</a></div></div></div></footer>

      <style>{`
@keyframes pv-playerEntry{from{opacity:0;transform:translate(-50%,-50%) scale(.5)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
.pv-team-page{max-width:880px;margin:0 auto;padding-bottom:3rem}
.pv-back-btn{display:inline-flex;align-items:center;gap:.45rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.6);padding:.55rem 1.1rem;border-radius:10px;cursor:pointer;font-weight:600;font-size:.82rem;margin-bottom:1.5rem;transition:all .2s;font-family:inherit}
.pv-back-btn:hover{background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.12)}
.pv-hero-card{position:relative;border-radius:20px;overflow:hidden;background:linear-gradient(160deg,rgba(15,23,42,.95) 0%,rgba(15,23,42,.8) 50%,rgba(30,41,59,.9) 100%);border:1px solid rgba(255,255,255,.06);margin-bottom:1.5rem;box-shadow:0 12px 40px rgba(0,0,0,.4)}
.pv-hero-bg-pattern{position:absolute;inset:0;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
.pv-hero-content{position:relative;padding:1.8rem 2rem;z-index:1}
.pv-hero-left{display:flex;align-items:center;gap:1.2rem;margin-bottom:1.5rem}
.pv-hero-logo-ring{width:68px;height:68px;border-radius:50%;padding:6px;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border:2px solid rgba(255,255,255,.1);box-shadow:0 8px 24px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.05);flex-shrink:0}
.pv-hero-logo-ring img{width:100%;height:100%;object-fit:contain}
.pv-hero-text h2{margin:0;font-size:1.35rem;font-weight:900;color:#f1f5f9;letter-spacing:.5px;line-height:1.2}
.pv-hero-meta{display:flex;align-items:center;gap:.4rem;margin-top:.35rem;font-size:.78rem;color:#64748b;flex-wrap:wrap}
.pv-hero-meta svg{width:11px;height:11px;opacity:.6}
.pv-meta-sep{margin:0 .25rem;opacity:.3}
.pv-hero-stats-row{display:flex;align-items:center;gap:0;padding:1.2rem 0 0;border-top:1px solid rgba(255,255,255,.05);flex-wrap:wrap}
.pv-hero-stat{text-align:center;flex:1;min-width:70px}
.pv-hero-stat strong{display:block;font-size:1.35rem;font-weight:900;font-family:var(--font-heading);color:#f1f5f9;line-height:1}
.pv-hero-stat span{font-size:.6rem;color:#475569;text-transform:uppercase;letter-spacing:1.2px;margin-top:.25rem;display:block}
.pv-hero-stat-divider{width:1px;height:32px;background:rgba(255,255,255,.05);flex-shrink:0}
.pv-tabs-bar{display:flex;gap:0;margin-bottom:1.8rem;background:rgba(255,255,255,.025);border-radius:14px;padding:4px;border:1px solid rgba(255,255,255,.04);max-width:340px;margin-left:auto;margin-right:auto}
.pv-tab-btn{flex:1;padding:.65rem .8rem;border:none;background:none;color:#475569;font-weight:700;font-size:.82rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.45rem;border-radius:11px;transition:all .2s}
.pv-tab-btn:hover{color:#94a3b8;background:rgba(255,255,255,.03)}
.pv-tab-btn.active{color:#86efac;background:rgba(34,197,94,.12);box-shadow:0 2px 12px rgba(34,197,94,.15)}
.pv-tab-btn svg{opacity:.7}.pv-tab-btn.active svg{opacity:1}
.pv-player-row{display:grid;grid-template-columns:34px 34px 1fr 48px 90px 54px;gap:.5rem;align-items:center;padding:.55rem .7rem;border-radius:12px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.025);transition:all .15s}
.pv-player-row:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.06);transform:translateX(2px)}
.pv-row-num{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;font-family:monospace}
.pv-row-photo{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.04);overflow:hidden;border:1px solid rgba(255,255,255,.06)}
.pv-row-photo img{width:100%;height:100%;object-fit:cover}
.pv-photo-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.1)}
.pv-row-info{min-width:0;display:flex;flex-direction:column;gap:1px}
.pv-row-name{font-size:.84rem;font-weight:700;color:#e2e8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pv-row-meta{font-size:.62rem;color:#475569}
.pv-row-pos{font-size:.6rem;font-weight:800;padding:3px 8px;border-radius:6px;text-align:center;border:1px solid;letter-spacing:.5px;font-family:monospace}
.pv-row-stats{display:flex;gap:.4rem;font-size:.74rem;align-items:center}
.pv-row-stats b{font-weight:800;font-family:monospace}
.pv-row-stats small{color:#334155;font-size:.55rem;font-weight:600;margin-left:1px}
.pv-row-pj{font-size:.74rem;color:#475569;font-weight:600;text-align:center;font-family:monospace}
.pv-row-pj small{font-weight:400;font-size:.55rem}
.pv-pos-group{margin-bottom:1.5rem}
.pv-group-head{display:flex;align-items:center;gap:.55rem;margin-bottom:.6rem;padding:.5rem .8rem;border-bottom:2px solid transparent;border-radius:10px 10px 0 0}
.pv-group-icon{font-size:.85rem}
.pv-group-label{font-size:.62rem;font-weight:800;letter-spacing:2.5px;text-transform:uppercase}
.pv-group-count{font-size:.58rem;font-weight:700;padding:2px 9px;border-radius:5px;margin-left:auto}
.pv-group-list{display:flex;flex-direction:column;gap:.3rem}
.pv-roster-wrap{max-width:760px;margin:0 auto}
.pv-fm-section{display:flex;flex-direction:column;gap:1.2rem}
.pv-fm-locked{display:flex;align-items:center;justify-content:center;gap:.7rem;padding:.65rem 1rem;border-radius:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04)}
.pv-fm-badge{font-size:.85rem;font-weight:900;color:#86efac;background:rgba(34,197,94,.12);padding:.3rem .9rem;border-radius:8px;border:1px solid rgba(34,197,94,.2);font-family:monospace;letter-spacing:1px}
.pv-fm-locked-label{font-size:.72rem;color:#475569;font-weight:600}
.pv-pitch-wrap{width:100%;max-width:420px;margin:0 auto}
.pv-pitch{position:relative;width:100%;aspect-ratio:68/105;border-radius:12px;overflow:hidden;background:repeating-linear-gradient(0deg,#091f12 0px,#091f12 52px,#0c2815 52px,#0c2815 105px);box-shadow:0 12px 40px rgba(0,0,0,.35),inset 0 0 80px rgba(0,0,0,.2)}
.pv-pitch-svg{position:absolute;inset:0;width:100%;height:100%}
.pv-pitch-empty{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;opacity:.25}
.pv-pitch-empty p{color:#fff;font-weight:700;font-size:.85rem;margin:0}
.pv-pitch-empty span{color:#94a3b8;font-size:.72rem}
.pv-pp{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:2px;z-index:2;transition:left .45s cubic-bezier(.4,0,.2,1),top .45s cubic-bezier(.4,0,.2,1);animation:pv-playerEntry .5s cubic-bezier(.34,1.56,.64,1) both;cursor:default}
.pv-pp-dot{width:34px;height:34px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,.2);transition:all .2s;font-size:.6rem;font-weight:800;color:#fff}
.pv-pp:hover .pv-pp-dot{transform:scale(1.18)}
.pv-pp-dot img{width:100%;height:100%;object-fit:cover}
.pv-pp-name{font-size:.52rem;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.9);white-space:nowrap;max-width:65px;overflow:hidden;text-overflow:ellipsis;text-align:center}
.pv-pp-role{font-size:.44rem;color:rgba(255,255,255,.4);font-weight:600;text-transform:uppercase;letter-spacing:.5px;font-family:monospace}
.pv-subs-card{background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.04);border-radius:14px;padding:1rem 1.1rem}
.pv-subs-title{margin:0 0 .65rem;font-size:.78rem;font-weight:700;color:#94a3b8;display:flex;align-items:center;gap:.4rem}
.pv-subs-bench-icon{font-size:.85rem}
.pv-subs-title span{font-size:.66rem;font-weight:800;color:#64748b;background:rgba(255,255,255,.04);padding:1px 8px;border-radius:4px;margin-left:.3rem}
.pv-subs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:.4rem}
.pv-sub-card{display:flex;align-items:center;gap:.6rem;padding:.5rem .65rem;border-radius:10px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.03);border-left:3px solid;transition:all .15s}
.pv-sub-card:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.06)}
.pv-sub-avatar{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.04);overflow:hidden;border:1px solid rgba(255,255,255,.06);flex-shrink:0}
.pv-sub-avatar img{width:100%;height:100%;object-fit:cover}
.pv-sub-avatar-empty{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.1)}
.pv-sub-details{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.pv-sub-name{font-size:.78rem;font-weight:600;color:#cbd5e1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pv-sub-meta-row{display:flex;align-items:center;gap:.3rem}
.pv-sub-number{font-size:.65rem;font-weight:800;font-family:monospace}
.pv-sub-pos-label{font-size:.52rem;font-weight:700;padding:0 5px;border-radius:4px;border:1px solid;font-family:monospace;letter-spacing:.5px}
.pv-sub-age{font-size:.58rem;color:#475569}
.pv-sub-mini-stats{display:flex;gap:.35rem;flex-shrink:0;font-size:.7rem;font-family:monospace;align-items:center}
.pv-sub-mini-stats span{display:flex;align-items:baseline;gap:1px}
.pv-sub-mini-stats small{font-size:.48rem;font-weight:600;color:#334155}
@media(max-width:768px){
  .pv-team-page{padding-left:.5rem;padding-right:.5rem}
  .pv-hero-content{padding:1.3rem 1.2rem}.pv-hero-left{flex-direction:column;text-align:center;gap:.8rem}.pv-hero-logo-ring{width:56px;height:56px}.pv-hero-text h2{font-size:1.1rem}.pv-hero-meta{justify-content:center}.pv-hero-stat-divider{display:none}.pv-hero-stat{min-width:55px}.pv-hero-stat strong{font-size:1.1rem}
  .pv-player-row{grid-template-columns:30px 30px 1fr auto;gap:.3rem;padding:.45rem .55rem}.pv-row-pos,.pv-row-stats,.pv-row-pj{display:none!important}
  .pv-pitch-wrap{max-width:300px}.pv-pp-dot{width:28px;height:28px;font-size:.52rem}.pv-pp-name{font-size:.44rem}.pv-subs-grid{grid-template-columns:1fr}.pv-sub-mini-stats{display:none!important}
}
@media(max-width:480px){.pv-tabs-bar{max-width:100%}}
      `}</style>
    </>
  );
}