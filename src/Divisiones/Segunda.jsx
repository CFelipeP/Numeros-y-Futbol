import React, { useEffect, useState, useMemo } from "react";
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

const logoUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const encoded = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
  return `${API_BASE}${encoded}`;
};

const safeFetch = async (url) => {
  const res = await fetch(url);
  const text = await res.text();
  if (text.trim().startsWith("<")) {
    throw new Error(`El servidor devolvió HTML en vez de JSON`);
  }
  return JSON.parse(text);
};

const getDG = (gf, gc) => {
  const diff = gf - gc;
  return diff > 0 ? `+${diff}` : `${diff}`;
};

/* ====== PlayOff badge genérico ====== */
const PLAYOFF_BADGE = { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981", label: "PlayOff" };

const getMatchStatus = (status) => {
  if (!status) return { text: "Por definir", variant: "default" };
  const lower = status.toLowerCase();
  if (lower.includes("vivo") || lower.includes("live") || lower.includes("jugando"))
    return { text: "EN VIVO", variant: "live" };
  if (lower.includes("finalizado") || lower.includes("ft") || lower.includes("terminado"))
    return { text: "Finalizado", variant: "finished" };
  if (lower.includes("programado") || lower.includes("pendiente") || lower.includes("por jugar"))
    return { text: "Programado", variant: "scheduled" };
  return { text: status, variant: "default" };
};

const normalizeMatch = (m, teamMap) => {
  if (!m) return null;
  const score = m.score || "";
  let gl = m.goles_local;
  let gv = m.goles_visitante;
  if ((gl === null || gl === undefined || gl === "") && score && score !== "-") {
    const parts = String(score).split(" - ");
    gl = parts[0] !== undefined && parts[0] !== "" ? parseInt(parts[0]) : null;
    gv = parts[1] !== undefined && parts[1] !== "" ? parseInt(parts[1]) : null;
  }
  const homeName = m.home_name || m.local_nombre || "";
  const awayName = m.away_name || m.visitante_nombre || "";
  let homeLogo = m.home_logo || m.local_logo || "";
  let awayLogo = m.away_logo || m.visitante_logo || "";
  if (!homeLogo && m.home_id && teamMap[String(m.home_id)]?.logo) homeLogo = teamMap[String(m.home_id)].logo;
  if (!homeLogo && m.local_id && teamMap[String(m.local_id)]?.logo) homeLogo = teamMap[String(m.local_id)].logo;
  if (!awayLogo && m.away_id && teamMap[String(m.away_id)]?.logo) awayLogo = teamMap[String(m.away_id)].logo;
  if (!awayLogo && m.visitante_id && teamMap[String(m.visitante_id)]?.logo) awayLogo = teamMap[String(m.visitante_id)].logo;
  if (!homeLogo && homeName) { const found = Object.values(teamMap).find(t => t.nombre === homeName); if (found?.logo) homeLogo = found.logo; }
  if (!awayLogo && awayName) { const found = Object.values(teamMap).find(t => t.nombre === awayName); if (found?.logo) awayLogo = found.logo; }
  return {
    home_name: homeName, away_name: awayName, home_logo: homeLogo, away_logo: awayLogo,
    goles_local: gl !== null && gl !== undefined ? gl : null,
    goles_visitante: gv !== null && gv !== undefined ? gv : null,
    fecha: m.fecha || m.date || "", estado: m.estado || m.status || "",
  };
};

const ResultRow = ({ m }) => {
  const isHomeWin = parseInt(m.goles_local) > parseInt(m.goles_visitante);
  const isAwayWin = parseInt(m.goles_visitante) > parseInt(m.goles_local);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.6rem",
      padding: "0.7rem 0.8rem", borderRadius: "10px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.04)",
      transition: "all 0.2s ease", cursor: "default"
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; }}
    >
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: "3px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {m.home_logo && <img src={logoUrl(m.home_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
      </div>
      <span style={{ fontSize: "0.75rem", fontWeight: isHomeWin ? 800 : 600, color: isHomeWin ? "var(--color-white)" : "var(--color-text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.home_name}</span>
      <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-white)", fontFamily: "var(--font-heading)", letterSpacing: "1px", flexShrink: 0, textShadow: "0 0 10px rgba(34,197,94,0.3)" }}>
        {m.goles_local ?? "-"} - {m.goles_visitante ?? "-"}
      </span>
      <span style={{ fontSize: "0.75rem", fontWeight: isAwayWin ? 800 : 600, color: isAwayWin ? "var(--color-white)" : "var(--color-text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{m.away_name}</span>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: "3px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {m.away_logo && <img src={logoUrl(m.away_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
      </div>
    </div>
  );
};

const ZonaHeader = ({ zona, color }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "0.6rem",
    padding: "0.7rem 1rem", borderRadius: "10px", marginBottom: "0.8rem",
    background: `linear-gradient(90deg, ${color}12, transparent)`,
    border: `1px solid ${color}25`,
  }}>
    <IconCompass />
    <span style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color }}>
      Zona {zona}
    </span>
    <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>
      {zona === "Este" ? "EAST" : "WEST"}
    </span>
  </div>
);

/* ====== Tabla ahora recibe playoffTeamIds en vez de usar índice ====== */
const TablaClasificacion = ({ datos, titulo, playoffTeamIds }) => (
  <div className="table-container">
    {titulo && (
      <div style={{ marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--color-text-muted)" }}>{titulo}</span>
      </div>
    )}
    <table className="standings-table">
      <thead>
        <tr>
          <th style={{ width: 40, textAlign: "center" }}>#</th>
          <th style={{ textAlign: "left", paddingLeft: "16px" }}>Equipo</th>
          <th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th>
          <th style={{ minWidth: 50 }}>PTS</th>
        </tr>
      </thead>
      <tbody>
        {datos.length === 0 && (
          <tr><td colSpan={10} style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--color-text-muted)" }}>Sin equipos en esta zona</td></tr>
        )}
        {datos.map((team, index) => {
          const isPlayoff = playoffTeamIds && playoffTeamIds.has(team.equipo_id);
          const badge = isPlayoff ? PLAYOFF_BADGE : null;
          const dg = getDG(team.gf, team.gc);
          return (
            <tr key={team.id} style={{ borderLeft: badge ? `3px solid ${badge.color}` : "3px solid transparent", transition: "all 0.2s ease" }}>
              <td style={{ textAlign: "center" }}>
                {badge ? (
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "6px", background: badge.bg, color: badge.color, fontSize: "0.7rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{index + 1}</span>
                ) : (
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{index + 1}</span>
                )}
              </td>
              <td className="team-cell" style={{ paddingLeft: "16px" }}>
                {team.logo && <img src={logoUrl(team.logo)} alt={team.nombre} style={{ width: 28, height: 28, objectFit: "contain", background: "rgba(255,255,255,0.06)", borderRadius: "50%", padding: "3px" }} />}
                <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--color-text-main)", whiteSpace: "nowrap" }}>{team.nombre}</span>
                {badge && (
                  <span style={{
                    fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px",
                    color: badge.color, background: badge.bg,
                    padding: "2px 7px", borderRadius: "4px",
                    border: `1px solid ${badge.color}30`,
                    marginLeft: "8px", verticalAlign: "middle",
                    whiteSpace: "nowrap",
                  }}>
                    PlayOff
                  </span>
                )}
              </td>
              <td>{team.pj}</td>
              <td style={{ color: "#10b981", fontWeight: 600 }}>{team.pg}</td>
              <td style={{ color: "#f59e0b", fontWeight: 600 }}>{team.pe}</td>
              <td style={{ color: "#ef4444", fontWeight: 600 }}>{team.pp}</td>
              <td>{team.gf}</td>
              <td>{team.gc}</td>
              <td style={{ fontWeight: 700, color: team.gf - team.gc > 0 ? "#10b981" : team.gf - team.gc < 0 ? "#ef4444" : "var(--color-text-muted)", fontSize: "0.85rem" }}>{dg}</td>
              <td style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-white)", fontFamily: "var(--font-heading)", textShadow: "0 0 8px rgba(34,197,94,0.3)" }}>{team.pts}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

/* ============================================================
   TARJETA PARTIDO DESTACADO
   ============================================================ */
const FeaturedMatchCard = ({ match }) => {
  const status = getMatchStatus(match.estado);
  const isFinished = status.variant === "finished";
  const isLive = status.variant === "live";
  const isScheduled = status.variant === "scheduled";
  const homeWin = match.goles_local !== null && match.goles_visitante !== null && match.goles_local > match.goles_visitante;
  const awayWin = match.goles_local !== null && match.goles_visitante !== null && match.goles_visitante > match.goles_local;

  const statusColor = isLive ? "#ef4444" : isFinished ? "#10b981" : "#f59e0b";
  const statusBg = isLive ? "rgba(239,68,68,0.15)" : isFinished ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)";

  return (
    <div style={{
      position: "relative",
      borderRadius: "20px",
      overflow: "hidden",
      background: "linear-gradient(160deg, #1a1f35 0%, #0d1117 40%, #111827 100%)",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
    }}>
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, transparent 0%, ${statusColor}66 30%, ${statusColor} 50%, ${statusColor}66 70%, transparent 100%)`,
      }} />

      <div style={{
        position: "absolute",
        top: "-60px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "280px",
        height: "180px",
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${statusColor}12 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", padding: "1.6rem 1.4rem 1.4rem" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <IconStar />
            <span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,0.4)" }}>
              Destacado
            </span>
          </div>
          <span style={{
            fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "1.5px", color: statusColor, background: statusBg,
            padding: "4px 12px", borderRadius: "20px",
            border: `1px solid ${statusColor}25`,
            animation: isLive ? "featuredPulse 2s ease-in-out infinite" : "none",
          }}>
            {status.text}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", maxWidth: "130px" }}>
            <div style={{
              width: "62px", height: "62px", borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              border: "2px solid rgba(255,255,255,0.06)",
              padding: "8px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
              <img src={logoUrl(match.home_logo)} alt={match.home_name} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
            </div>
            <span style={{
              fontSize: "0.72rem", fontWeight: homeWin ? 800 : 600,
              color: homeWin ? "#ffffff" : "rgba(255,255,255,0.55)",
              textAlign: "center", lineHeight: 1.25,
              maxWidth: "110px", overflow: "hidden",
              textOverflow: "ellipsis", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {match.home_name}
            </span>
            {homeWin && (
              <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "4px", border: "1px solid rgba(16,185,129,0.15)" }}>
                Ganador
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "0 0.8rem", flexShrink: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "0",
              background: "rgba(0,0,0,0.35)",
              borderRadius: "14px", padding: "6px 4px",
              border: "1px solid rgba(255,255,255,0.04)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}>
              <span style={{
                fontSize: "1.8rem", fontWeight: 900, fontFamily: "var(--font-heading)",
                color: homeWin ? "#ffffff" : "rgba(255,255,255,0.6)",
                width: "48px", textAlign: "center", lineHeight: 1,
                textShadow: homeWin ? "0 0 20px rgba(255,255,255,0.3)" : "none",
              }}>
                {match.goles_local ?? "-"}
              </span>
              <span style={{ fontSize: "1rem", fontWeight: 400, color: "rgba(255,255,255,0.2)", margin: "0 2px", alignSelf: "center" }}>:</span>
              <span style={{
                fontSize: "1.8rem", fontWeight: 900, fontFamily: "var(--font-heading)",
                color: awayWin ? "#ffffff" : "rgba(255,255,255,0.6)",
                width: "48px", textAlign: "center", lineHeight: 1,
                textShadow: awayWin ? "0 0 20px rgba(255,255,255,0.3)" : "none",
              }}>
                {match.goles_visitante ?? "-"}
              </span>
            </div>
            <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(255,255,255,0.25)" }}>
              {isScheduled ? "VS" : "FT"}
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", maxWidth: "130px" }}>
            <div style={{
              width: "62px", height: "62px", borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
              border: "2px solid rgba(255,255,255,0.06)",
              padding: "8px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
              <img src={logoUrl(match.away_logo)} alt={match.away_name} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
            </div>
            <span style={{
              fontSize: "0.72rem", fontWeight: awayWin ? 800 : 600,
              color: awayWin ? "#ffffff" : "rgba(255,255,255,0.55)",
              textAlign: "center", lineHeight: 1.25,
              maxWidth: "110px", overflow: "hidden",
              textOverflow: "ellipsis", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {match.away_name}
            </span>
            {awayWin && (
              <span style={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "4px", border: "1px solid rgba(16,185,129,0.15)" }}>
                Ganador
              </span>
            )}
          </div>
        </div>

        <div style={{
          height: "1px", margin: "1.4rem 0 1rem",
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)",
        }} />

        {match.fecha && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
            <IconCalendar />
            <span>{match.fecha}</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes featuredPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
      `}</style>
    </div>
  );
};

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function SegundaDivision() {

  const [tabla, setTabla] = useState([]);
  const [match, setMatch] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("clasificacion");
  const [vistaZona, setVistaZona] = useState("general");
  const [sidebar, setSidebar] = useState({ next: null, recent: [] });

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.allSettled([
      safeFetch(`${API_BASE}get_tabla_segunda.php`),
      safeFetch(`${API_BASE}get_featured_match_segunda.php?t=${Date.now()}`),
      safeFetch(`${API_BASE}get_teams_segunda.php`),
      safeFetch(`${API_BASE}get_sidebar_matches_segunda.php`),
    ]).then((results) => {
      const tablaData = results[0].status === "fulfilled" ? results[0].value : [];
      const matchData = results[1].status === "fulfilled" ? results[1].value : null;
      const equiposData = results[2].status === "fulfilled" ? results[2].value : [];
      const sidebarData = results[3].status === "fulfilled" ? results[3].value : null;

      const tablaArr = Array.isArray(tablaData) ? tablaData : [];
      const equiposArr = Array.isArray(equiposData) ? equiposData : [];
      setTabla(tablaArr);
      setEquipos(equiposArr);
      setSidebar(sidebarData && typeof sidebarData === "object" ? sidebarData : { next: null, recent: [] });

      const teamMap = {};
      equiposArr.forEach((t) => { teamMap[String(t.id)] = t; if (t.nombre) teamMap[t.nombre] = t; });

      let featured = null;
      if (
        matchData &&
        !Array.isArray(matchData) &&
        typeof matchData === "object" &&
        Object.keys(matchData).length > 0 &&
        (matchData.home_name || matchData.local_nombre)
      ) {
        const normalized = normalizeMatch(matchData, teamMap);
        if (normalized && normalized.home_name && normalized.away_name) {
          featured = normalized;
        }
      }
      setMatch(featured);

    }).catch((err) => {
      console.error("Error cargando datos:", err);
      setError(err.message);
    }).finally(() => setLoading(false));
  }, []);

  const getTeamStats = (equipoId) => tabla.find(t => t.equipo_id === equipoId);

  const tablaEast = tabla.filter(t => t.grupo === "East");
  const tablaWest = tabla.filter(t => t.grupo === "West");
  const equiposEast = equipos.filter(e => e.grupo === "East");
  const equiposWest = equipos.filter(e => e.grupo === "West");

  /* ====== CAMBIO CLAVE: Calcular IDs de PlayOff según la vista ====== */
  const playoffTeamIds = useMemo(() => {
    const ids = new Set();
    const sortDesc = (arr) => [...arr].sort((a, b) => b.pts - a.pts);

    if (vistaZona === "general") {
      /* General: top 4 de East + top 4 de West = 8 equipos */
      sortDesc(tablaEast).slice(0, 4).forEach(t => ids.add(t.equipo_id));
      sortDesc(tablaWest).slice(0, 4).forEach(t => ids.add(t.equipo_id));
    } else if (vistaZona === "East") {
      sortDesc(tablaEast).slice(0, 4).forEach(t => ids.add(t.equipo_id));
    } else if (vistaZona === "West") {
      sortDesc(tablaWest).slice(0, 4).forEach(t => ids.add(t.equipo_id));
    }

    return ids;
  }, [vistaZona, tablaEast, tablaWest]);

  const zonaButtons = [
    { key: "general", label: "General", icon: "📊" },
    { key: "East", label: "ESTE", icon: "🧭" },
    { key: "West", label: "OESTE", icon: "🧭" },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <section className="table-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(34,197,94,0.2)", borderTopColor: "#22c55e", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "1px" }}>CARGANDO DATOS...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <section className="table-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ maxWidth: 600, padding: "2.5rem", textAlign: "center", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div style={{ color: "#ef4444", marginBottom: "1rem" }}><IconAlert /></div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, color: "#ef4444", marginBottom: "0.8rem" }}>Error al cargar los datos</h3>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ background: "linear-gradient(90deg, #22c55e, #15803d)", color: "white", border: "none", padding: "0.8rem 2rem", borderRadius: "10px", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Reintentar</button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="table-section" style={{ paddingBottom: 0 }}>

        <div className="container" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <IconTrophy />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, textTransform: "uppercase", margin: 0, background: "linear-gradient(90deg, #fff, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Segunda División</h2>
          </div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", margin: 0, paddingLeft: "1.8rem" }}>Clasificación por zonas, equipos y partido destacado</p>
        </div>

        <div className="container" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { key: "clasificacion", label: "Clasificación", icon: "📊" },
              { key: "equipos", label: "Equipos", icon: "🛡️" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.5px", textTransform: "uppercase", background: activeTab === tab.key ? "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.08))" : "transparent", color: activeTab === tab.key ? "#22c55e" : "var(--color-text-muted)", boxShadow: activeTab === tab.key ? "0 0 15px rgba(34,197,94,0.15)" : "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "clasificacion" && (
          <div className="dashboard-grid">

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* PARTIDO DESTACADO */}
              <div>
                {match && match.home_name && match.away_name ? (
                  <FeaturedMatchCard match={match} />
                ) : (
                  <div className="glass-card" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                      <span style={{ fontSize: "1.5rem", opacity: 0.3 }}>⚽</span>
                    </div>
                    <p style={{ fontSize: "0.9rem", margin: "0 0 0.3rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Sin partido destacado</p>
                    <p style={{ fontSize: "0.75rem", margin: 0, color: "rgba(255,255,255,0.25)" }}>Se mostrará cuando se configure desde el panel</p>
                  </div>
                )}
              </div>

              {/* PRÓXIMO PARTIDO */}
              <div className="glass-card" style={{ padding: "1.8rem" }}>
                <div className="section-subtitle" style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 8px #f59e0b", display: "inline-block" }} />
                  Próximo Partido
                </div>

                {sidebar.next ? (
                  <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(30,41,59,0.4) 100%)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: "16px", padding: "1.5rem 1.2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#f59e0b", background: "rgba(245,158,11,0.12)", padding: "0.2rem 0.6rem", borderRadius: "6px" }}>
                        {getMatchStatus(sidebar.next.status || sidebar.next.estado).text}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flex: 1, minWidth: 0 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", padding: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {sidebar.next.home_logo && <img src={logoUrl(sidebar.next.home_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
                        </div>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sidebar.next.home_name}</span>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", padding: "0.35rem 0.7rem", borderRadius: "8px", letterSpacing: "1px" }}>VS</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flex: 1, minWidth: 0, justifyContent: "flex-end" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{sidebar.next.away_name}</span>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.06)", padding: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {sidebar.next.away_logo && <img src={logoUrl(sidebar.next.away_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
                        </div>
                      </div>
                    </div>
                    {sidebar.next.fecha && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.8rem", marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                        <IconCalendar /> {sidebar.next.fecha}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "1.5rem 1rem", color: "var(--color-text-muted)" }}>
                    <div style={{ fontSize: "1.3rem", marginBottom: "0.4rem", opacity: 0.3 }}>📅</div>
                    <p style={{ fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>No hay partidos pendientes</p>
                  </div>
                )}
              </div>

              {/* ÚLTIMOS RESULTADOS */}
              <div className="glass-card" style={{ padding: "1.8rem" }}>
                <div className="section-subtitle" style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />
                  Últimos Resultados
                </div>

                {sidebar.recent && sidebar.recent.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {sidebar.recent.map((m) => (
                      <div key={m.id}>
                        <ResultRow m={m} />
                        {m.fecha && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", paddingLeft: "0.8rem", paddingTop: "0.15rem", paddingBottom: "0.3rem", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>
                            <IconClock /> {m.fecha}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "1.5rem 1rem", color: "var(--color-text-muted)" }}>
                    <div style={{ fontSize: "1.3rem", marginBottom: "0.4rem", opacity: 0.3 }}>📋</div>
                    <p style={{ fontSize: "0.85rem", margin: 0 }}>No hay resultados aún</p>
                  </div>
                )}
              </div>

              {/* LEYENDA */}
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <div className="section-subtitle" style={{ marginTop: 0, fontSize: "0.85rem" }}>Leyenda</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "2px", background: "#10b981", flexShrink: 0, boxShadow: "0 0 6px rgba(16,185,129,0.4)" }} />
                    <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>PlayOff — {vistaZona === "general" ? "Top 4 de cada zona (8 equipos)" : "Top 4 de la zona"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-text-muted)", width: 18, textAlign: "center", flexShrink: 0 }}>DG</span>
                    <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Diferencia de goles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLA CLASIFICACIÓN */}
            <div className="glass-card" style={{ padding: "1.8rem" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--color-white)" }}>Clasificación</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.3rem 0.8rem", borderRadius: "20px", fontWeight: 600 }}>
                  {vistaZona === "general" ? tabla.length : vistaZona === "East" ? tablaEast.length : tablaWest.length} equipos
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "3px", border: "1px solid rgba(255,255,255,0.05)" }}>
                {zonaButtons.map(z => {
                  const isActive = vistaZona === z.key;
                  const color = z.key === "East" ? "#3b82f6" : z.key === "West" ? "#f59e0b" : "#22c55e";
                  return (
                    <button key={z.key} onClick={() => setVistaZona(z.key)} style={{
                      flex: 1, padding: "0.55rem 0.6rem", borderRadius: "8px", border: "none", cursor: "pointer",
                      fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      background: isActive ? `linear-gradient(135deg, ${color}25, ${color}10)` : "transparent",
                      color: isActive ? color : "var(--color-text-muted)",
                      boxShadow: isActive ? `0 0 12px ${color}20` : "none",
                      transition: "all 0.3s ease",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                      borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                    }}>
                      <span>{z.icon}</span>{z.label}
                    </button>
                  );
                })}
              </div>

              {vistaZona === "general" && (
                <>
                  {/* ====== Se pasa playoffTeamIds que contiene los 8 equipos ====== */}
                  <TablaClasificacion datos={[...tabla].sort((a, b) => (b.pts - a.pts))} playoffTeamIds={playoffTeamIds} />
                  {tabla.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                      <span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><IconStadium /> Segunda División · El Salvador</span>
                    </div>
                  )}
                </>
              )}

              {vistaZona === "East" && (
                <>
                  <ZonaHeader zona="Este" color="#3b82f6" />
                  <TablaClasificacion datos={tablaEast} titulo="Grupo Este" playoffTeamIds={playoffTeamIds} />
                  {tablaEast.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                      <span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span style={{ color: "#3b82f6", fontWeight: 600 }}>ZONA ESTE · {tablaEast.length} equipos</span>
                    </div>
                  )}
                </>
              )}

              {vistaZona === "West" && (
                <>
                  <ZonaHeader zona="Oeste" color="#f59e0b" />
                  <TablaClasificacion datos={tablaWest} titulo="Grupo Oeste" playoffTeamIds={playoffTeamIds} />
                  {tablaWest.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                      <span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span style={{ color: "#f59e0b", fontWeight: 600 }}>ZONA OESTE · {tablaWest.length} equipos</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "equipos" && (
          <div className="container" style={{ paddingBottom: "var(--spacing-lg)" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, margin: "0 0 0.3rem 0", color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <IconShield /> Clubes de la Temporada
                </h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: 0 }}>Información completa de cada equipo participante</p>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.4rem 1rem", borderRadius: "20px", fontWeight: 600 }}>
                {vistaZona === "general" ? equipos.length : vistaZona === "East" ? equiposEast.length : equiposWest.length} clubes
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem", background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "3px", border: "1px solid rgba(255,255,255,0.05)", maxWidth: "400px" }}>
              {zonaButtons.map(z => {
                const isActive = vistaZona === z.key;
                const color = z.key === "East" ? "#3b82f6" : z.key === "West" ? "#f59e0b" : "#22c55e";
                return (
                  <button key={z.key} onClick={() => setVistaZona(z.key)} style={{
                    flex: 1, padding: "0.55rem 0.6rem", borderRadius: "8px", border: "none", cursor: "pointer",
                    fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    background: isActive ? `linear-gradient(135deg, ${color}25, ${color}10)` : "transparent",
                    color: isActive ? color : "var(--color-text-muted)",
                    boxShadow: isActive ? `0 0 12px ${color}20` : "none",
                    transition: "all 0.3s ease",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                    borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                  }}>
                    <span>{z.icon}</span>{z.label}
                  </button>
                );
              })}
            </div>

            {vistaZona === "East" && <ZonaHeader zona="Este" color="#3b82f6" />}
            {vistaZona === "West" && <ZonaHeader zona="Oeste" color="#f59e0b" />}

            {(vistaZona === "general" ? equipos : vistaZona === "East" ? equiposEast : equiposWest).length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--color-text-muted)" }}>
                <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No hay equipos en esta zona</p>
                <p style={{ fontSize: "0.85rem" }}>Los equipos aparecerán aquí una vez sean asignados.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {(vistaZona === "general" ? equipos : vistaZona === "East" ? equiposEast : equiposWest).map((equipo) => {
                  const stats = getTeamStats(equipo.id);
                  const zonaTabla = vistaZona === "general" ? tabla : vistaZona === "East" ? tablaEast : tablaWest;
                  /* ====== CAMBIO: Usar playoffTeamIds en vez de posición por índice ====== */
                  const isPlayoff = playoffTeamIds.has(equipo.id);
                  const badge = isPlayoff ? PLAYOFF_BADGE : null;

                  return (
                    <div key={equipo.id} className="glass-card" style={{ padding: 0, overflow: "hidden", transition: "all 0.3s ease", cursor: "default", borderLeft: badge ? `3px solid ${badge.color}` : "3px solid transparent" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.4), 0 0 20px rgba(34,197,94,0.1)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; if (badge) e.currentTarget.style.borderLeftColor = badge.color; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderLeftColor = badge ? badge.color : "transparent"; }}
                    >
                      <div style={{ height: "6px", background: badge ? `linear-gradient(90deg, ${badge.color}, transparent)` : "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
                      <div style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
                          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: badge ? `2px solid ${badge.color}40` : "2px solid rgba(255,255,255,0.08)" }}>
                            {equipo.logo && <img src={logoUrl(equipo.logo)} alt={equipo.nombre} style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.2rem 0", color: "var(--color-white)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{equipo.nombre}</h4>
                            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                              {badge && (
                                <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: badge.color, background: badge.bg, padding: "0.15rem 0.5rem", borderRadius: "4px", border: `1px solid ${badge.color}30` }}>PlayOff</span>
                              )}
                              <span style={{
                                fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                                color: equipo.grupo === "East" ? "#3b82f6" : "#f59e0b",
                                background: equipo.grupo === "East" ? "rgba(59,130,246,0.1)" : "rgba(245,158,11,0.1)",
                                padding: "0.15rem 0.5rem", borderRadius: "4px",
                              }}>
                                {equipo.grupo}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.2rem" }}>
                          {equipo.ciudad && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                              <IconMapPin /><span>{equipo.ciudad}</span>
                            </div>
                          )}
                          {equipo.estadio && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                              <IconStadium /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{equipo.estadio}</span>
                            </div>
                          )}
                        </div>
                        {stats && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
                            {[
                              { label: "PJ", value: stats.pj, color: "var(--color-text-main)" },
                              { label: "G", value: stats.pg, color: "#10b981" },
                              { label: "E", value: stats.pe, color: "#f59e0b" },
                              { label: "P", value: stats.pp, color: "#ef4444" },
                            ].map((stat, i) => (
                              <div key={i} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: stat.color, fontFamily: "var(--font-heading)", lineHeight: 1 }}>{stat.value}</div>
                                <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {stats && (
                          <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Puntos</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <div style={{ width: 80, height: 4, borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                <div style={{ height: "100%", borderRadius: "2px", background: "linear-gradient(90deg, #22c55e, #15803d)", width: `${Math.min((stats.pts / (zonaTabla[0]?.pts || 1)) * 100, 100)}%`, transition: "width 0.5s ease" }} />
                              </div>
                              <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--color-white)", fontFamily: "var(--font-heading)", textShadow: "0 0 10px rgba(34,197,94,0.4)" }}>{stats.pts}</span>
                            </div>
                          </div>
                        )}
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
          <div className="footer-bottom">
            <p>&copy; 2026 Números y Fútbol. Todos los derechos reservados.</p>
            <div className="footer-links"><a href="#">Privacidad</a><a href="#">Términos</a><a href="#">Contacto</a></div>
          </div>
        </div>
      </footer>
    </>
  );
}