import React, { useEffect, useState, useMemo, memo } from "react";
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
const IconStar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconTarget = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const logoUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const safeFetch = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  if (text.trim().startsWith("<")) throw new Error("El servidor devolvió HTML en vez de JSON");
  return JSON.parse(text);
};

const getDG = (gf, gc) => { const d = gf - gc; return d > 0 ? `+${d}` : `${d}`; };
const getPosBadge = (i) => {
  if (i === 0) return { bg: "rgba(16,185,129,0.15)", color: "#10b981" };
  if (i === 1) return { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" };
  if (i === 2) return { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" };
  if (i === 3) return { bg: "rgba(245,158,11,0.10)", color: "#d97706" };
  return null;
};

const getMatchStatus = (estado) => {
  if (!estado) return { text: "Por definir", variant: "default" };
  const l = estado.toLowerCase();
  if (l.includes("vivo") || l.includes("live") || l.includes("jugando")) return { text: "EN VIVO", variant: "live" };
  if (l.includes("finalizado") || l.includes("ft") || l.includes("terminado")) return { text: "Finalizado", variant: "finished" };
  if (l.includes("programado") || l.includes("pendiente") || l.includes("por jugar")) return { text: "Programado", variant: "scheduled" };
  return { text: estado, variant: "default" };
};

const normalizeMatch = (m, teamMap) => {
  if (!m) return null;
  const score = m.score || "";
  let gl = m.goles_local, gv = m.goles_visitante;
  if ((gl == null || gl === "") && score && score !== "-") { const p = String(score).split(" - "); gl = p[0] !== "" ? parseInt(p[0]) : null; gv = p[1] !== "" ? parseInt(p[1]) : null; }
  const hn = m.home_name || m.local_nombre || "", an = m.away_name || m.visitante_nombre || "";
  let hl = m.home_logo || m.local_logo || "", al = m.away_logo || m.visitante_logo || "";
  if (!hl && m.home_id && teamMap[String(m.home_id)]?.logo) hl = teamMap[String(m.home_id)].logo;
  if (!hl && m.local_id && teamMap[String(m.local_id)]?.logo) hl = teamMap[String(m.local_id)].logo;
  if (!al && m.away_id && teamMap[String(m.away_id)]?.logo) al = teamMap[String(m.away_id)].logo;
  if (!al && m.visitante_id && teamMap[String(m.visitante_id)]?.logo) al = teamMap[String(m.visitante_id)].logo;
  if (!hl && hn) { const f = Object.values(teamMap).find(t => t.nombre === hn); if (f?.logo) hl = f.logo; }
  if (!al && an) { const f = Object.values(teamMap).find(t => t.nombre === an); if (f?.logo) al = f.logo; }
  return { home_name: hn, away_name: an, home_logo: hl, away_logo: al, goles_local: gl != null ? gl : null, goles_visitante: gv != null ? gv : null, fecha: m.fecha || m.date || "", estado: m.estado || m.status || "" };
};

/* ══════════════════════════════════════════════════════════
   DATOS DE FORMACIÓN PARA LA VISTA DE PLANTILLA
   ══════════════════════════════════════════════════════════ */
const posiciones = [
  { value: "portero", label: "Portero", color: "#f59e0b" },
  { value: "defensa", label: "Defensa", color: "#3b82f6" },
  { value: "medio", label: "Mediocampista", color: "#10b981" },
  { value: "delantero", label: "Delantero", color: "#ef4444" },
];

const posConfig = {
  portero: { color: "#f59e0b", border: "rgba(245,158,11,0.2)", label: "PORTEROS", grad: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))" },
  defensa: { color: "#3b82f6", border: "rgba(59,130,246,0.2)", label: "DEFENSAS", grad: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))" },
  medio: { color: "#10b981", border: "rgba(16,185,129,0.2)", label: "MEDIOS", grad: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))" },
  delantero: { color: "#ef4444", border: "rgba(239,68,68,0.2)", label: "DELANTEROS", grad: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))" },
};

const formationData = {
  "4-4-2": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 12, y: 70, role: "LI" },
    { pos: "defensa", x: 36, y: 74, role: "DFC" }, { pos: "defensa", x: 64, y: 74, role: "DFC" },
    { pos: "defensa", x: 88, y: 70, role: "LD" }, { pos: "medio", x: 18, y: 48, role: "MI" },
    { pos: "medio", x: 40, y: 46, role: "MC" }, { pos: "medio", x: 60, y: 46, role: "MC" },
    { pos: "medio", x: 82, y: 48, role: "MD" }, { pos: "delantero", x: 36, y: 22, role: "DC" },
    { pos: "delantero", x: 64, y: 22, role: "DC" },
  ],
  "4-3-3": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 12, y: 70, role: "LI" },
    { pos: "defensa", x: 36, y: 74, role: "DFC" }, { pos: "defensa", x: 64, y: 74, role: "DFC" },
    { pos: "defensa", x: 88, y: 70, role: "LD" }, { pos: "medio", x: 28, y: 48, role: "MC" },
    { pos: "medio", x: 50, y: 44, role: "MC" }, { pos: "medio", x: 72, y: 48, role: "MC" },
    { pos: "delantero", x: 18, y: 22, role: "EI" }, { pos: "delantero", x: 50, y: 18, role: "DC" },
    { pos: "delantero", x: 82, y: 22, role: "ED" },
  ],
  "3-5-2": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 25, y: 74, role: "DFC" },
    { pos: "defensa", x: 50, y: 76, role: "DFC" }, { pos: "defensa", x: 75, y: 74, role: "DFC" },
    { pos: "medio", x: 10, y: 50, role: "CAI" }, { pos: "medio", x: 30, y: 48, role: "MC" },
    { pos: "medio", x: 50, y: 44, role: "MC" }, { pos: "medio", x: 70, y: 48, role: "MC" },
    { pos: "medio", x: 90, y: 50, role: "CAD" }, { pos: "delantero", x: 36, y: 22, role: "DC" },
    { pos: "delantero", x: 64, y: 22, role: "DC" },
  ],
  "4-2-3-1": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 12, y: 70, role: "LI" },
    { pos: "defensa", x: 36, y: 74, role: "DFC" }, { pos: "defensa", x: 64, y: 74, role: "DFC" },
    { pos: "defensa", x: 88, y: 70, role: "LD" }, { pos: "medio", x: 38, y: 56, role: "MCD" },
    { pos: "medio", x: 62, y: 56, role: "MCD" }, { pos: "medio", x: 20, y: 38, role: "MCO" },
    { pos: "medio", x: 50, y: 34, role: "MCO" }, { pos: "medio", x: 80, y: 38, role: "MCO" },
    { pos: "delantero", x: 50, y: 18, role: "DC" },
  ],
  "5-3-2": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 8, y: 66, role: "CAI" },
    { pos: "defensa", x: 28, y: 74, role: "DFC" }, { pos: "defensa", x: 50, y: 76, role: "DFC" },
    { pos: "defensa", x: 72, y: 74, role: "DFC" }, { pos: "defensa", x: 92, y: 66, role: "CAD" },
    { pos: "medio", x: 28, y: 48, role: "MC" }, { pos: "medio", x: 50, y: 44, role: "MC" },
    { pos: "medio", x: 72, y: 48, role: "MC" }, { pos: "delantero", x: 36, y: 22, role: "DC" },
    { pos: "delantero", x: 64, y: 22, role: "DC" },
  ],
  "3-4-3": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 25, y: 74, role: "DFC" },
    { pos: "defensa", x: 50, y: 76, role: "DFC" }, { pos: "defensa", x: 75, y: 74, role: "DFC" },
    { pos: "medio", x: 12, y: 50, role: "MI" }, { pos: "medio", x: 38, y: 48, role: "MC" },
    { pos: "medio", x: 62, y: 48, role: "MC" }, { pos: "medio", x: 88, y: 50, role: "MD" },
    { pos: "delantero", x: 18, y: 22, role: "EI" }, { pos: "delantero", x: 50, y: 18, role: "DC" },
    { pos: "delantero", x: 82, y: 22, role: "ED" },
  ],
};

function autoAssign(jugadores, fKey) {
  const tpl = formationData[fKey];
  if (!tpl || !jugadores?.length) return { starters: [], subs: [...jugadores] };
  const byPos = { portero: [], defensa: [], medio: [], delantero: [] };
  jugadores.forEach(j => { if (byPos[j.posicion]) byPos[j.posicion].push(j); });
  const used = new Set();
  const starters = [];
  for (const slot of tpl) {
    const avail = byPos[slot.pos]?.filter(j => !used.has(j.id));
    const pick = avail?.[0] || jugadores.find(j => !used.has(j.id));
    if (pick) { starters.push({ ...pick, posicion_x: slot.x, posicion_y: slot.y, slot_role: slot.role }); used.add(pick.id); }
  }
  return { starters, subs: jugadores.filter(j => !used.has(j.id)) };
}

/* ══════════════════════════════════════════════════════════
   COMPONENTES DE LA VISTA PÚBLICA
   ══════════════════════════════════════════════════════════ */

const ResultRow = ({ m }) => {
  const hw = parseInt(m.goles_local) > parseInt(m.goles_visitante);
  const aw = parseInt(m.goles_visitante) > parseInt(m.goles_local);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.7rem 0.8rem", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: 3, flexShrink: 0 }}><img src={logoUrl(m.home_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
      <span style={{ fontSize: "0.75rem", fontWeight: hw ? 800 : 600, color: hw ? "var(--color-white)" : "var(--color-text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.home_name}</span>
      <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-white)", fontFamily: "var(--font-heading)", letterSpacing: "1px", flexShrink: 0, textShadow: "0 0 10px rgba(255,0,77,0.3)" }}>{m.goles_local ?? "-"} - {m.goles_visitante ?? "-"}</span>
      <span style={{ fontSize: "0.75rem", fontWeight: aw ? 800 : 600, color: aw ? "var(--color-white)" : "var(--color-text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{m.away_name}</span>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: 3, flexShrink: 0 }}><img src={logoUrl(m.away_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
    </div>
  );
};

const FeaturedMatchCard = ({ match }) => {
  const status = getMatchStatus(match.estado);
  const isF = status.variant === "finished", isL = status.variant === "live", isS = status.variant === "scheduled";
  const hw = match.goles_local != null && match.goles_visitante != null && match.goles_local > match.goles_visitante;
  const aw = match.goles_local != null && match.goles_visitante != null && match.goles_visitante > match.goles_local;
  const sc = isL ? "#ef4444" : isF ? "#10b981" : "#f59e0b";
  const sb = isL ? "rgba(239,68,68,0.15)" : isF ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)";
  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "linear-gradient(160deg, #1a1f35 0%, #0d1117 40%, #111827 100%)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent 0%, ${sc}66 30%, ${sc} 50%, ${sc}66 70%, transparent 100%)` }} />
      <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 280, height: 180, borderRadius: "50%", background: `radial-gradient(ellipse, ${sc}12 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", padding: "1.6rem 1.4rem 1.4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><IconStar /><span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.4)" }}>Destacado</span></div>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: sc, background: sb, padding: "4px 12px", borderRadius: 20, border: `1px solid ${sc}25`, animation: isL ? "fp 2s ease-in-out infinite" : "none" }}>{status.text}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
          {[["home", hw], ["away", aw]].map(([side, win]) => (
            <div key={side} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, maxWidth: 130 }}>
              <div style={{ width: 62, height: 62, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.06)", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                <img src={logoUrl(match[`${side}_logo`])} alt={match[`${side}_name`]} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: win ? 800 : 600, color: win ? "#fff" : "rgba(255,255,255,0.55)", textAlign: "center", lineHeight: 1.25, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{match[`${side}_name`]}</span>
              {win && <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(16,185,129,0.15)" }}>Ganador</span>}
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "0 0.8rem", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0, background: "rgba(0,0,0,0.35)", borderRadius: 14, padding: "6px 4px", border: "1px solid rgba(255,255,255,0.04)", boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
              <span style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "var(--font-heading)", color: hw ? "#fff" : "rgba(255,255,255,0.6)", width: 48, textAlign: "center", lineHeight: 1 }}>{match.goles_local ?? "-"}</span>
              <span style={{ fontSize: "1rem", fontWeight: 400, color: "rgba(255,255,255,0.2)", margin: "0 2px" }}>:</span>
              <span style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "var(--font-heading)", color: aw ? "#fff" : "rgba(255,255,255,0.6)", width: 48, textAlign: "center", lineHeight: 1 }}>{match.goles_visitante ?? "-"}</span>
            </div>
            <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.25)" }}>{isS ? "VS" : "FT"}</span>
          </div>
        </div>
        <div style={{ height: 1, margin: "1.4rem 0 1rem", background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)" }} />
        {match.fecha && <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}><IconCalendar /> {match.fecha}</div>}
      </div>
      <style>{`@keyframes fp{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.3)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}`}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   VISTA DE DETALLE DEL EQUIPO (Solo lectura, inline)
   ══════════════════════════════════════════════════════════ */

const PitchSVG = () => (
  <svg className="td-pitch-svg" viewBox="0 0 680 1050" preserveAspectRatio="none">
    <rect x="1" y="1" width="678" height="1048" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" rx="2" />
    <line x1="0" y1="525" x2="680" y2="525" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <circle cx="340" cy="525" r="91" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <circle cx="340" cy="525" r="4" fill="rgba(255,255,255,0.15)" />
    <rect x="136" y="1" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <rect x="224" y="1" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <circle cx="340" cy="110" r="3" fill="rgba(255,255,255,0.15)" />
    <path d="M248 165 A91 91 0 0 0 432 165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <rect x="136" y="884" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <rect x="224" y="994" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <circle cx="340" cy="940" r="3" fill="rgba(255,255,255,0.15)" />
    <path d="M248 885 A91 91 0 0 1 432 885" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <path d="M1 20 A20 20 0 0 0 21 1" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <path d="M659 1 A20 20 0 0 0 679 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <path d="M1 1030 A20 20 0 0 1 21 1049" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <path d="M659 1049 A20 20 0 0 1 679 1030" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
  </svg>
);

const PitchPlayer = memo(function PitchPlayer({ s }) {
  const cfg = posConfig[s.posicion] || posConfig.delantero;
  return (
    <div className="td-pp" style={{ left: `${s.posicion_x}%`, top: `${s.posicion_y}%` }}>
      <div className="td-pp-dot" style={{ background: cfg.color, boxShadow: `0 0 12px ${cfg.color}50, inset 0 -2px 6px rgba(0,0,0,0.3)` }}>
        {s.foto ? <img src={logoUrl(s.foto)} alt="" /> : <span>{s.numero_camiseta || "–"}</span>}
      </div>
      <span className="td-pp-name">{s.nombre.split(" ").pop()}</span>
      <span className="td-pp-role">{s.slot_role}</span>
    </div>
  );
});

const ReadOnlyRow = memo(function ReadOnlyRow({ j }) {
  const cfg = posConfig[j.posicion] || posConfig.delantero;
  const isGK = j.posicion === "portero";
  return (
    <div className="td-row">
      <div className="td-row-num" style={{ background: `${cfg.color}15`, color: cfg.color }}>{j.numero_camiseta || "–"}</div>
      <div className="td-row-photo">
        {j.foto ? <img src={logoUrl(j.foto)} alt="" /> : <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `${cfg.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: cfg.color, fontWeight: 800 }}>{(j.nombre || "?")[0]}</div>}
      </div>
      <div className="td-row-info">
        <span className="td-row-name">{j.nombre}</span>
        <span className="td-row-meta">{[j.edad && `${j.edad} años`, j.nacionalidad].filter(Boolean).join(" · ")}</span>
      </div>
      <span className="td-row-pos" style={{ color: cfg.color, borderColor: `${cfg.color}25` }}>{posiciones.find(p => p.value === j.posicion)?.label || j.posicion}</span>
      <div className="td-row-stats">
        {isGK ? (
          <><b style={{ color: "#f59e0b" }}>{j.goles_recibidos || 0}</b><small>GR</small><b style={{ color: "#10b981" }}>{j.vaya_invicta || 0}</b><small>VI</small></>
        ) : (
          <><b style={{ color: "#ef4444" }}>{j.goles || 0}</b><small>G</small><b style={{ color: "#3b82f6" }}>{j.asistencias || 0}</b><small>A</small></>
        )}
      </div>
      <span className="td-row-pj">{j.pj || 0} <small>PJ</small></span>
    </div>
  );
});

const ReadOnlyPosGroup = memo(function ReadOnlyPosGroup({ pos, jugadores }) {
  const cfg = posConfig[pos];
  if (!jugadores?.length) return null;
  return (
    <div className="td-g">
      <div className="td-g-head" style={{ borderColor: cfg.border, background: cfg.grad }}>
        <i className="td-g-dot" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}40` }} />
        <span className="td-g-lbl" style={{ color: cfg.color }}>{cfg.label}</span>
        <span className="td-g-cnt" style={{ color: cfg.color, background: `${cfg.color}12` }}>{jugadores.length}</span>
      </div>
      <div className="td-g-list">{jugadores.map(j => <ReadOnlyRow key={j.id} j={j} />)}</div>
    </div>
  );
});

const TeamDetailView = ({ equipo, jugadores, onBack }) => {
  const [subTab, setSubTab] = useState("plantilla");
  const [formacion, setFormacion] = useState(equipo?.formacion || "4-4-2");

  const groups = useMemo(() => {
    const all = { portero: [], defensa: [], medio: [], delantero: [] };
    (jugadores || []).forEach(j => { if (all[j.posicion]) all[j.posicion].push(j); });
    return all;
  }, [jugadores]);

  const { starters, subs } = useMemo(() => autoAssign(jugadores || [], formacion), [jugadores, formacion]);
  const total = (jugadores || []).length;

  return (
    <div className="td-view">
      {/* Header del equipo */}
      <div className="td-header">
        <button className="td-back-btn" onClick={onBack}><IconArrowLeft /> Volver a equipos</button>
        <div className="td-team-header">
          <div className="td-team-logo-big">
            <img src={logoUrl(equipo?.logo)} alt="" />
          </div>
          <div className="td-team-info">
            <h2>{equipo?.nombre}</h2>
            <p>{[equipo?.ciudad, equipo?.estadio].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="td-team-metrics">
            <div className="td-metric"><strong>{total}</strong><span>Jugadores</span></div>
            <div className="td-metric-divider" />
            <div className="td-metric"><strong style={{ color: "#10b981" }}>{starters.length}</strong><span>Titulares</span></div>
            <div className="td-metric-divider" />
            <div className="td-metric"><strong style={{ color: "#f59e0b" }}>{subs.length}</strong><span>Suplentes</span></div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="td-tabs">
        <button className={`td-tab${subTab === "plantilla" ? " active" : ""}`} onClick={() => setSubTab("plantilla")}><IconUsers /> Plantilla Completa</button>
        <button className={`td-tab${subTab === "formacion" ? " active" : ""}`} onClick={() => setSubTab("formacion")}><IconTarget /> Formación</button>
      </div>

      {/* TAB PLANTILLA */}
      {subTab === "plantilla" && (
        <div className="td-plantilla">
          {total === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.3 }}>📋</div>
              <p style={{ fontWeight: 600 }}>No hay jugadores registrados</p>
            </div>
          ) : (
            Object.keys(posConfig).map(pos => <ReadOnlyPosGroup key={pos} pos={pos} jugadores={groups[pos]} />)
          )}
        </div>
      )}

      {/* TAB FORMACIÓN */}
      {subTab === "formacion" && (
        <div className="td-formation">
          <div className="td-fm-bar">
            <span className="td-fm-label">FORMACIÓN</span>
            <div className="td-fm-btns">
              {Object.keys(formationData).map(f => (
                <button key={f} className={`td-fm-btn${formacion === f ? " active" : ""}`} onClick={() => setFormacion(f)}>{f}</button>
              ))}
            </div>
          </div>

          <div className="td-pitch-wrap">
            <div className="td-pitch">
              <PitchSVG />
              {starters.map((s, i) => <PitchPlayer key={s.id || i} s={s} />)}
              {starters.length < 11 && (
                <div className="td-pitch-empty"><p>Faltan jugadores</p><span>{starters.length}/11 titulares</span></div>
              )}
            </div>
          </div>

          {subs.length > 0 && (
            <div className="td-subs-card">
              <h4 className="td-subs-title">Suplentes <span>{subs.length}</span></h4>
              <div className="td-subs-grid">
                {subs.map(s => {
                  const cfg = posConfig[s.posicion] || posConfig.delantero;
                  return (
                    <div key={s.id} className="td-sub-item" style={{ borderLeftColor: cfg.color }}>
                      <div className="td-sub-photo">{s.foto ? <img src={logoUrl(s.foto)} alt="" /> : <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `${cfg.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: cfg.color, fontWeight: 800 }}>{(s.nombre || "?")[0]}</div>}</div>
                      <div className="td-sub-info">
                        <span className="td-sub-name">{s.nombre}</span>
                        <span className="td-sub-meta">#{s.numero_camiseta || "–"} {posiciones.find(p => p.value === s.posicion)?.label || ""}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estilos inline del detail view */}
      <style>{`
        @keyframes tdIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .td-view{animation:tdIn .3s ease-out;max-width:780px;margin:0 auto;padding-bottom:3rem}
        .td-header{margin-bottom:1.5rem}
        .td-back-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.45rem .9rem;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:var(--color-text-muted);font-size:.78rem;font-weight:600;cursor:pointer;transition:all .15s;margin-bottom:1rem;font-family:inherit}
        .td-back-btn:hover{background:rgba(255,255,255,.06);color:var(--color-white)}
        .td-team-header{display:flex;align-items:center;gap:1.2rem;padding:1.3rem 1.5rem;border-radius:16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05)}
        .td-team-logo-big{width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.04);padding:6px;border:2px solid rgba(255,255,255,.08);flex-shrink:0}
        .td-team-logo-big img{width:100%;height:100%;object-fit:contain}
        .td-team-info{flex:1;min-width:0}
        .td-team-info h2{margin:0;font-size:1.3rem;font-weight:800;color:var(--color-white);font-family:var(--font-heading)}
        .td-team-info p{margin:4px 0 0;font-size:.8rem;color:var(--color-text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .td-team-metrics{display:flex;align-items:center;gap:.8rem;flex-shrink:0}
        .td-metric{text-align:center}
        .td-metric strong{display:block;font-size:1.4rem;font-weight:900;font-family:var(--font-heading);line-height:1}
        .td-metric span{font-size:.55rem;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:1px}
        .td-metric-divider{width:1px;height:28px;background:rgba(255,255,255,.06)}
        .td-tabs{display:flex;gap:0;margin-bottom:1.5rem;border-bottom:1px solid rgba(255,255,255,.05);max-width:360px}
        .td-tab{flex:1;padding:.6rem 0;border:none;background:none;color:var(--color-text-muted);font-weight:600;font-size:.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.4rem;border-bottom:2px solid transparent;transition:all .15s;margin-bottom:-1px;font-family:inherit}
        .td-tab:hover{color:var(--color-text-main)}
        .td-tab.active{color:var(--color-accent);border-bottom-color:var(--color-accent)}

        .td-row{display:grid;grid-template-columns:36px 34px 1fr 80px auto auto;gap:.5rem;align-items:center;padding:.5rem .7rem;border-radius:9px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.03);transition:all .15s}
        .td-row:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.06)}
        .td-row-num{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;font-family:var(--font-heading)}
        .td-row-photo{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.04);overflow:hidden;display:flex;align-items:center;justify-content:center}
        .td-row-photo img{width:100%;height:100%;object-fit:cover}
        .td-row-info{min-width:0;display:flex;flex-direction:column}
        .td-row-name{font-size:.82rem;font-weight:700;color:var(--color-white);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .td-row-meta{font-size:.62rem;color:var(--color-text-muted);margin-top:1px}
        .td-row-pos{font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:5px;text-align:center;border:1px solid;letter-spacing:.3px}
        .td-row-stats{display:flex;gap:.4rem;font-size:.72rem;align-items:center}
        .td-row-stats small{color:rgba(255,255,255,.2);font-size:.58rem}
        .td-row-pj{font-size:.72rem;color:var(--color-text-muted);font-weight:600;text-align:center}
        .td-row-pj small{font-weight:400}

        .td-g{margin-bottom:1.3rem}
        .td-g-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;padding:.4rem .7rem;border-bottom:2px solid transparent;border-radius:8px 8px 0 0}
        .td-g-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .td-g-lbl{font-size:.62rem;font-weight:800;letter-spacing:2.5px;text-transform:uppercase}
        .td-g-cnt{font-size:.58rem;font-weight:700;padding:1px 7px;border-radius:4px;margin-left:auto}
        .td-g-list{display:flex;flex-direction:column;gap:.25rem}

        .td-fm-bar{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem;justify-content:center}
        .td-fm-label{font-size:.7rem;color:var(--color-text-muted);font-weight:700;letter-spacing:1.5px}
        .td-fm-btns{display:flex;gap:.3rem;flex-wrap:wrap}
        .td-fm-btn{padding:.3rem .65rem;border-radius:7px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:var(--color-text-muted);font-weight:700;font-size:.72rem;cursor:pointer;transition:all .15s;font-family:var(--font-heading);letter-spacing:.5px}
        .td-fm-btn:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1)}
        .td-fm-btn.active{background:rgba(255,0,77,.12);border-color:rgba(255,0,77,.3);color:var(--color-accent)}

        .td-pitch-wrap{width:100%;max-width:400px;margin:0 auto}
        .td-pitch{position:relative;width:100%;aspect-ratio:68/105;border-radius:12px;overflow:hidden;background:repeating-linear-gradient(0deg,#091f12 0px,#091f12 52px,#0c2815 52px,#0c2815 105px);box-shadow:0 12px 40px rgba(0,0,0,.35),inset 0 0 80px rgba(0,0,0,.2)}
        .td-pitch-svg{position:absolute;inset:0;width:100%;height:100%}
        .td-pitch-empty{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;opacity:.25}
        .td-pitch-empty p{color:#fff;font-weight:700;font-size:.85rem;margin:0}
        .td-pitch-empty span{color:#94a3b8;font-size:.72rem}
        .td-pp{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:2px;z-index:2;transition:left .45s cubic-bezier(.4,0,.2,1),top .45s cubic-bezier(.4,0,.2,1)}
        .td-pp-dot{width:32px;height:32px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,.2);transition:transform .2s;font-size:.6rem;font-weight:800;color:#fff}
        .td-pp:hover .td-pp-dot{transform:scale(1.15)}
        .td-pp-dot img{width:100%;height:100%;object-fit:cover}
        .td-pp-name{font-size:.52rem;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.9);white-space:nowrap;max-width:60px;overflow:hidden;text-overflow:ellipsis;text-align:center}
        .td-pp-role{font-size:.42rem;color:rgba(255,255,255,.4);font-weight:600;text-transform:uppercase;letter-spacing:.5px}

        .td-subs-card{background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.04);border-radius:14px;padding:1rem 1.1rem;margin-top:1rem}
        .td-subs-title{margin:0 0 .6rem;font-size:.78rem;font-weight:700;color:var(--color-text-muted);display:flex;align-items:center;gap:.3rem}
        .td-subs-title span{font-size:.65rem;font-weight:800;color:var(--color-text-muted);background:rgba(255,255,255,.04);padding:1px 7px;border-radius:4px;margin-left:.3rem}
        .td-subs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.3rem}
        .td-sub-item{display:flex;align-items:center;gap:.5rem;padding:.4rem .5rem;border-radius:8px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.03);border-left:3px solid}
        .td-sub-photo{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.04);overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .td-sub-photo img{width:100%;height:100%;object-fit:cover}
        .td-sub-info{flex:1;min-width:0;display:flex;flex-direction:column}
        .td-sub-name{font-size:.74rem;font-weight:600;color:var(--color-text-main);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .td-sub-meta{font-size:.58rem;color:var(--color-text-muted)}

        @media(max-width:768px){
          .td-team-header{flex-direction:column;text-align:center;gap:.8rem;padding:1rem}
          .td-team-info{text-align:center}
          .td-team-metrics{justify-content:center}
          .td-metric-divider{display:none}
          .td-row{grid-template-columns:30px 30px 1fr auto;gap:.3rem;padding:.4rem .5rem}
          .td-row-pos,.td-row-stats,.td-row-pj{display:none!important}
          .td-pitch-wrap{max-width:280px}
          .td-pp-dot{width:26px;height:26px;font-size:.5rem}
          .td-pp-name{font-size:.45rem}
          .td-subs-grid{grid-template-columns:1fr}
          .td-fm-bar{flex-direction:column;align-items:stretch}
          .td-fm-btns{justify-content:center}
        }
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ══════════════════════════════════════════════════════════ */
export default function PrimeraDivision() {
  const [tabla, setTabla] = useState([]);
  const [match, setMatch] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("clasificacion");
  const [sidebar, setSidebar] = useState({ next: null, recent: [] });

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDetail, setTeamDetail] = useState(null);
  const [teamDetailLoading, setTeamDetailLoading] = useState(false);

  const loadTeamDetail = async (equipoId) => {
    setTeamDetailLoading(true);
    setSelectedTeam({ id: equipoId });
    try {
      const data = await safeFetch(`${API_BASE}get_equipo_detalle.php?id=${equipoId}`);
      setTeamDetail(data);
    } catch (err) {
      console.error("Error cargando detalle:", err);
      setTeamDetail(null);
    } finally { setTeamDetailLoading(false); }
  };

  const handleBackToTeams = () => {
    setSelectedTeam(null);
    setTeamDetail(null);
  };

  useEffect(() => {
    setLoading(true); setError(null);
    Promise.allSettled([
      safeFetch(`${API_BASE}get_tabla.php`),
      safeFetch(`${API_BASE}get_featured_match.php?t=${Date.now()}`),
      safeFetch(`${API_BASE}get_teams.php`),
      safeFetch(`${API_BASE}get_sidebar_matches.php`),
    ]).then((results) => {
      const tablaData = results[0].status === "fulfilled" ? results[0].value : [];
      const matchData = results[1].status === "fulfilled" ? results[1].value : null;
      const equiposData = results[2].status === "fulfilled" ? results[2].value : [];
      const sidebarData = results[3].status === "fulfilled" ? results[3].value : null;
      const tablaArr = Array.isArray(tablaData) ? tablaData : [];
      const equiposArr = Array.isArray(equiposData) ? equiposData : [];
      setTabla(tablaArr); setEquipos(equiposArr);
      setSidebar(sidebarData && typeof sidebarData === "object" ? sidebarData : { next: null, recent: [] });
      const teamMap = {};
      equiposArr.forEach(t => { teamMap[String(t.id)] = t; if (t.nombre) teamMap[t.nombre] = t; });
      let featured = null;
      if (matchData && !Array.isArray(matchData) && Object.keys(matchData).length > 0) featured = normalizeMatch(matchData, teamMap);
      if (!featured?.home_name && sidebarData?.recent?.length) { const f = sidebarData.recent.find(m => m.featured == 1 || m.destacado == 1); if (f) featured = normalizeMatch(f, teamMap); }
      if (!featured?.home_name && sidebarData?.next && (sidebarData.next.featured == 1 || sidebarData.next.destacado == 1)) featured = normalizeMatch(sidebarData.next, teamMap);
      setMatch(featured);
      if (!featured?.home_name) {
        safeFetch(`${API_BASE}get_matches.php`).then(all => {
          const arr = Array.isArray(all) ? all : [];
          const f = arr.find(m => m.featured == 1 || m.destacado == 1);
          if (f) setMatch(normalizeMatch(f, teamMap));
        }).catch(() => {});
      }
    }).catch(err => { console.error(err); setError(err.message); }).finally(() => setLoading(false));
  }, []);

  const getTeamStats = (id) => tabla.find(t => t.equipo_id === id);

  if (loading) return (<><Header /><section className="table-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(255,0,77,0.2)", borderTopColor: "#ff004d", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} /><p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "1px" }}>CARGANDO DATOS...</p><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div></section></>);

  if (error) return (<><Header /><section className="table-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="glass-card" style={{ maxWidth: 600, padding: "2.5rem", textAlign: "center", border: "1px solid rgba(239,68,68,0.3)" }}><div style={{ color: "#ef4444", marginBottom: "1rem" }}><IconAlert /></div><h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, color: "#ef4444", marginBottom: ".8rem" }}>Error al cargar los datos</h3><p style={{ color: "var(--color-text-muted)", fontSize: ".9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{error}</p><button onClick={() => window.location.reload()} style={{ background: "linear-gradient(90deg, var(--color-accent), #ff3366)", color: "white", border: "none", padding: ".8rem 2rem", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Reintentar</button></div></section></>);

  // Si hay un equipo seleccionado, mostrar la vista de detalle
  if (selectedTeam) {
    return (
      <>
        <Header />
        <section className="table-section" style={{ paddingTop: "2rem" }}>
          <div className="container">
            {teamDetailLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "5rem 1rem" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(255,0,77,0.2)", borderTopColor: "#ff004d", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : teamDetail ? (
              <TeamDetailView equipo={teamDetail.equipo} jugadores={teamDetail.jugadores || []} onBack={handleBackToTeams} />
            ) : (
              <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--color-text-muted)" }}>
                <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>No se encontró información del equipo</p>
                <button className="td-back-btn" onClick={handleBackToTeams} style={{ margin: "0 auto" }}><IconArrowLeft /> Volver a equipos</button>
              </div>
            )}
          </div>
        </section>
        <footer className="footer" id="driver-footer"><div className="container footer-inner"><div className="footer-bottom"><p>&copy; 2026 Números y Fútbol. Todos los derechos reservados.</p></div></div></footer>
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="table-section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".5rem" }}><IconTrophy /><h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, textTransform: "uppercase", margin: 0, background: "linear-gradient(90deg, #fff, var(--color-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Primera División</h2></div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", margin: 0, paddingLeft: "1.8rem" }}>Clasificación general, equipos y partido destacado de la Liga Mayor</p>
        </div>

        {/* Solo 2 tabs: Clasificación y Equipos */}
        <div className="container" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: ".5rem", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { key: "clasificacion", label: "Clasificación", icon: "📊" },
              { key: "equipos", label: "Equipos", icon: "🛡️" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, padding: ".75rem 1rem", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".85rem", letterSpacing: ".5px", textTransform: "uppercase", background: activeTab === tab.key ? "linear-gradient(135deg, rgba(255,0,77,0.2), rgba(255,0,77,0.08))" : "transparent", color: activeTab === tab.key ? "var(--color-accent)" : "var(--color-text-muted)", boxShadow: activeTab === tab.key ? "0 0 15px rgba(255,0,77,0.15)" : "none", transition: "all .3s", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ CLASIFICACIÓN ═══ */}
        {activeTab === "clasificacion" && (
          <div className="dashboard-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>{match && match.home_name ? <FeaturedMatchCard match={match} /> : <div className="glass-card" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}><div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}><span style={{ fontSize: "1.5rem", opacity: 0.3 }}>⚽</span></div><p style={{ fontSize: ".9rem", margin: "0 0 .3rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Sin partido destacado</p><p style={{ fontSize: ".75rem", margin: 0, color: "rgba(255,255,255,0.25)" }}>Se mostrará cuando se configure desde el panel</p></div>}</div>
              <div className="glass-card" style={{ padding: "1.8rem" }}><div className="section-subtitle" style={{ marginTop: 0, display: "flex", alignItems: "center", gap: ".5rem" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 8px #f59e0b", display: "inline-block" }} />Próximo Partido</div>{sidebar.next ? (<div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(30,41,59,0.4) 100%)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 16, padding: "1.5rem 1.2rem" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}><span style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#f59e0b", background: "rgba(245,158,11,0.12)", padding: ".2rem .6rem", borderRadius: 6 }}>{getMatchStatus(sidebar.next.estado || sidebar.next.status).text}</span></div><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}><div style={{ display: "flex", alignItems: "center", gap: ".7rem", flex: 1, minWidth: 0 }}><div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", padding: 5, display: "flex", alignItems: "center", justifyContent: "center" }}><img src={logoUrl(sidebar.next.home_logo || sidebar.next.local_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div><span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--color-text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sidebar.next.home_name || sidebar.next.local_nombre}</span></div><div style={{ flexShrink: 0 }}><span style={{ fontSize: ".75rem", fontWeight: 800, color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", padding: ".35rem .7rem", borderRadius: 8, letterSpacing: "1px" }}>VS</span></div><div style={{ display: "flex", alignItems: "center", gap: ".7rem", flex: 1, minWidth: 0, justifyContent: "flex-end" }}><span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--color-text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{sidebar.next.away_name || sidebar.next.visitante_nombre}</span><div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", padding: 5, display: "flex", alignItems: "center", justifyContent: "center" }}><img src={logoUrl(sidebar.next.away_logo || sidebar.next.visitante_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div></div></div>{sidebar.next.fecha && <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: ".8rem", marginTop: "1rem", display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".78rem", color: "var(--color-text-muted)" }}><IconCalendar /> {sidebar.next.fecha}</div>}</div>) : (<div style={{ textAlign: "center", padding: "1.5rem 1rem", color: "var(--color-text-muted)" }}><div style={{ fontSize: "1.3rem", marginBottom: ".4rem", opacity: 0.3 }}>📅</div><p style={{ fontSize: ".85rem", margin: 0, fontWeight: 600 }}>No hay partidos pendientes</p></div>)}</div>
              <div className="glass-card" style={{ padding: "1.8rem" }}><div className="section-subtitle" style={{ marginTop: 0, display: "flex", alignItems: "center", gap: ".5rem" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />Últimos Resultados</div>{sidebar.recent && sidebar.recent.length > 0 ? (<div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>{sidebar.recent.map(m => (<div key={m.id}><ResultRow m={m} />{m.fecha && <div style={{ display: "flex", alignItems: "center", gap: ".3rem", paddingLeft: ".8rem", paddingTop: ".15rem", paddingBottom: ".3rem", fontSize: ".65rem", color: "rgba(255,255,255,0.25)" }}><IconClock /> {m.fecha}</div>}</div>))}</div>) : (<div style={{ textAlign: "center", padding: "1.5rem 1rem", color: "var(--color-text-muted)" }}><div style={{ fontSize: "1.3rem", marginBottom: ".4rem", opacity: 0.3 }}>📋</div><p style={{ fontSize: ".85rem", margin: 0 }}>No hay resultados aún</p></div>)}</div>
              <div className="glass-card" style={{ padding: "1.5rem" }}><div className="section-subtitle" style={{ marginTop: 0, fontSize: ".85rem" }}>Leyenda</div><div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>{[{ color: "#10b981", label: "Clasificación a Liga Concacaf" }, { color: "#f59e0b", label: "Playoffs / Repechaje" }, { color: "#ef4444", label: "Descenso directo" }].map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: ".6rem" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}40` }} /><span style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>{item.label}</span></div>))}<div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}><span style={{ fontSize: ".7rem", fontWeight: 800, color: "var(--color-text-muted)", width: 18, textAlign: "center", flexShrink: 0 }}>DG</span><span style={{ fontSize: ".82rem", color: "var(--color-text-muted)" }}>Diferencia de goles</span></div></div></div>
            </div>
            <div className="glass-card" style={{ padding: "1.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}><h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--color-white)" }}>Clasificación General</h3><span style={{ fontSize: ".75rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.05)", padding: ".3rem .8rem", borderRadius: 20, fontWeight: 600 }}>{tabla.length} equipos</span></div>
              <div className="table-container"><table className="standings-table"><thead><tr><th style={{ width: 40, textAlign: "center" }}>#</th><th style={{ textAlign: "left", paddingLeft: 16 }}>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th style={{ minWidth: 50 }}>PTS</th></tr></thead><tbody>{tabla.length === 0 && <tr><td colSpan={10} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>No hay datos disponibles</td></tr>}{tabla.map((team, index) => { const badge = getPosBadge(index); const dg = getDG(team.goles_favor, team.goles_contra); const isBottom = index >= tabla.length - 1 && tabla.length > 4; return (<tr key={team.id} style={{ borderLeft: badge ? `3px solid ${badge.color}` : isBottom ? "3px solid rgba(239,68,68,0.4)" : "3px solid transparent", transition: "all .2s" }}><td style={{ textAlign: "center" }}>{badge ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 6, background: badge.bg, color: badge.color, fontSize: ".7rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{index + 1}</span> : <span style={{ fontSize: ".85rem", fontWeight: 600, color: isBottom ? "#ef4444" : "var(--color-text-muted)" }}>{index + 1}</span>}</td><td className="team-cell" style={{ paddingLeft: 16 }}><img src={logoUrl(team.logo)} alt={team.nombre} style={{ width: 28, height: 28, objectFit: "contain", background: "rgba(255,255,255,0.06)", borderRadius: "50%", padding: 3 }} /><span style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--color-text-main)", whiteSpace: "nowrap" }}>{team.nombre}</span></td><td>{team.partidos_jugados}</td><td style={{ color: "#10b981", fontWeight: 600 }}>{team.ganados}</td><td style={{ color: "#f59e0b", fontWeight: 600 }}>{team.empatados}</td><td style={{ color: "#ef4444", fontWeight: 600 }}>{team.perdidos}</td><td>{team.goles_favor}</td><td>{team.goles_contra}</td><td style={{ fontWeight: 700, color: team.goles_favor - team.goles_contra > 0 ? "#10b981" : team.goles_favor - team.goles_contra < 0 ? "#ef4444" : "var(--color-text-muted)", fontSize: ".85rem" }}>{dg}</td><td style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-white)", fontFamily: "var(--font-heading)", textShadow: "0 0 8px rgba(255,0,77,0.3)" }}>{team.puntos}</td></tr>); })}</tbody></table></div>
              {tabla.length > 0 && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: ".78rem", color: "var(--color-text-muted)" }}><span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" })}</span><span style={{ display: "flex", alignItems: "center", gap: ".3rem" }}><IconStadium /> Liga Mayor · El Salvador</span></div>}
            </div>
          </div>
        )}

        {/* ═══ EQUIPOS ═══ */}
        {activeTab === "equipos" && (
          <div className="container" style={{ paddingBottom: "var(--spacing-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div><h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, margin: "0 0 .3rem 0", color: "var(--color-white)", display: "flex", alignItems: "center", gap: ".6rem" }}><IconShield /> Clubes de la Temporada</h3><p style={{ color: "var(--color-text-muted)", fontSize: ".9rem", margin: 0 }}>Haz clic en un equipo para ver su plantilla y formación</p></div>
              <span style={{ fontSize: ".8rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.05)", padding: ".4rem 1rem", borderRadius: 20, fontWeight: 600 }}>{equipos.length} clubes</span>
            </div>
            {equipos.length === 0 ? (<div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--color-text-muted)" }}><p style={{ fontSize: "1.1rem", marginBottom: ".5rem" }}>No hay equipos registrados</p></div>) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {equipos.map(equipo => {
                  const stats = getTeamStats(equipo.id);
                  const pos = stats ? tabla.indexOf(stats) : -1;
                  const badge = pos >= 0 ? getPosBadge(pos) : null;
                  return (
                    <div key={equipo.id} className="glass-card" style={{ padding: 0, overflow: "hidden", transition: "all .3s", cursor: "pointer", borderLeft: badge ? `3px solid ${badge.color}` : "3px solid transparent" }}
                      onClick={() => loadTeamDetail(equipo.id)}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255,0,77,0.1)"; e.currentTarget.style.borderColor = "rgba(255,0,77,0.3)"; if (badge) e.currentTarget.style.borderLeftColor = badge.color; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderLeftColor = badge ? badge.color : "transparent"; }}>
                      <div style={{ height: 6, background: badge ? `linear-gradient(90deg, ${badge.color}, transparent)` : "linear-gradient(90deg, var(--color-accent), transparent)" }} />
                      <div style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
                          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: badge ? `2px solid ${badge.color}40` : "2px solid rgba(255,255,255,0.08)" }}><img src={logoUrl(equipo.logo)} alt={equipo.nombre} style={{ width: "100%", height: "100%", objectFit: "contain" }} /></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, margin: "0 0 .2rem 0", color: "var(--color-white)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{equipo.nombre}</h4>
                            {badge && <span style={{ fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: badge.color, background: badge.bg, padding: ".15rem .5rem", borderRadius: 4 }}>Pos. {pos + 1}</span>}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.2rem" }}>
                          {equipo.ciudad && <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".85rem", color: "var(--color-text-muted)" }}><IconMapPin /><span>{equipo.ciudad}</span></div>}
                          {equipo.estadio && <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".85rem", color: "var(--color-text-muted)" }}><IconStadium /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{equipo.estadio}</span></div>}
                        </div>
                        {stats && (<>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: ".5rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>{[{ label: "PJ", value: stats.partidos_jugados, color: "var(--color-text-main)" }, { label: "G", value: stats.ganados, color: "#10b981" }, { label: "E", value: stats.empatados, color: "#f59e0b" }, { label: "P", value: stats.perdidos, color: "#ef4444" }].map((s, i) => (<div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: "1.1rem", fontWeight: 800, color: s.color, fontFamily: "var(--font-heading)", lineHeight: 1 }}>{s.value}</div><div style={{ fontSize: ".65rem", color: "var(--color-text-muted)", marginTop: ".2rem", textTransform: "uppercase", letterSpacing: ".5px" }}>{s.label}</div></div>))}</div>
                          <div style={{ marginTop: "1rem", paddingTop: ".8rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: ".78rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Puntos</span><div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}><div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, var(--color-accent), #ff3366)", width: `${Math.min((stats.puntos / (tabla[0]?.puntos || 1)) * 100, 100)}%`, transition: "width .5s" }} /></div><span style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--color-white)", fontFamily: "var(--font-heading)", textShadow: "0 0 10px rgba(255,0,77,0.4)" }}>{stats.puntos}</span></div></div>
                        </>)}
                        {/* Botón Ver Detalles */}
                        <button style={{ width: "100%", marginTop: "1rem", padding: ".6rem", borderRadius: 10, border: "1px solid rgba(255,0,77,0.2)", background: "rgba(255,0,77,0.06)", color: "var(--color-accent)", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: ".78rem", textTransform: "uppercase", letterSpacing: "1px", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem" }}
                          onClick={(e) => { e.stopPropagation(); loadTeamDetail(equipo.id); }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,0,77,0.12)"; e.currentTarget.style.borderColor = "rgba(255,0,77,0.35)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,0,77,0.06)"; e.currentTarget.style.borderColor = "rgba(255,0,77,0.2)"; }}>
                          <IconTarget /> Ver Detalles
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
      <footer className="footer" id="driver-footer">
        <div className="container footer-inner">
          <div className="footer-grid">
            <div className="footer-brand"><h3>NÚMEROS Y FÚTBOL</h3><p>Portal oficial de cobertura del fútbol salvadoreño.</p></div>
            <div className="footer-section"><h4>Divisiones</h4><ul><li><a href="/primera">Primera División</a></li><li><a href="/segunda">Segunda División</a></li><li><a href="#tercera">Tercera División</a></li></ul></div>
            <div className="footer-section"><h4>Contenido</h4><ul><li><a href="/news">Noticias</a></li><li><a href="#">Resultados</a></li><li><a href="/primera">Clasificaciones</a></li></ul></div>
            <div className="footer-section"><h4>Síguenos</h4><ul><li><a href="#">Facebook</a></li><li><a href="#">Twitter / X</a></li><li><a href="#">Instagram</a></li></ul></div>
          </div>
          <div className="footer-bottom"><p>&copy; 2026 Números y Fútbol. Todos los derechos reservados.</p><div className="footer-links"><a href="#">Privacidad</a><a href="#">Términos</a><a href="#">Contacto</a></div></div>
        </div>
      </footer>
    </>
  );
}