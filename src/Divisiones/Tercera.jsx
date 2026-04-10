import React, { useEffect, useState } from "react";
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
  if (gl === "-1" || gl === -1) gl = null;
  if (gv === "-1" || gv === -1) gv = null;
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
  const hasResult = m.goles_local !== null && m.goles_visitante !== null;
  const isHomeWin = hasResult && m.goles_local > m.goles_visitante;
  const isAwayWin = hasResult && m.goles_visitante > m.goles_local;
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
      <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-white)", fontFamily: "var(--font-heading)", letterSpacing: "1px", flexShrink: 0, textShadow: hasResult ? "0 0 10px rgba(168,85,247,0.3)" : "none" }}>
        {m.goles_local ?? "-"} - {m.goles_visitante ?? "-"}
      </span>
      <span style={{ fontSize: "0.75rem", fontWeight: isAwayWin ? 800 : 600, color: isAwayWin ? "var(--color-white)" : "var(--color-text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{m.away_name}</span>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: "3px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {m.away_logo && <img src={logoUrl(m.away_logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
      </div>
    </div>
  );
};

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function TerceraDivision() {
  const [tabla, setTabla] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("clasificacion");
  const [sidebar, setSidebar] = useState({ next: null, recent: [] });

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.allSettled([
      safeFetch(`${API_BASE}get_tabla_tercera.php`),
      safeFetch(`${API_BASE}get_teams_tercera.php`),
      safeFetch(`${API_BASE}get_sidebar_matches_tercera.php`),
    ]).then((results) => {
      const tablaData = results[0].status === "fulfilled" ? results[0].value : [];
      const equiposData = results[1].status === "fulfilled" ? results[1].value : [];
      const sidebarData = results[2].status === "fulfilled" ? results[2].value : null;

      const tablaArr = Array.isArray(tablaData) ? tablaData : [];
      const equiposArr = Array.isArray(equiposData) ? equiposData : [];
      setTabla(tablaArr);
      setEquipos(equiposArr);
      setSidebar(sidebarData && typeof sidebarData === "object" ? sidebarData : { next: null, recent: [] });
    }).catch((err) => {
      console.error("Error cargando datos:", err);
      setError(err.message);
    }).finally(() => setLoading(false));
  }, []);

  const getTeamStats = (equipoId) => tabla.find(t => t.equipo_id === equipoId);

  if (loading) {
    return (
      <>
        <Header />
        <section className="table-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(168,85,247,0.2)", borderTopColor: "#a855f7", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
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
            <button onClick={() => window.location.reload()} style={{ background: "linear-gradient(90deg, #a855f7, #7c3aed)", color: "white", border: "none", padding: "0.8rem 2rem", borderRadius: "10px", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>Reintentar</button>
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
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, textTransform: "uppercase", margin: 0, background: "linear-gradient(90deg, #fff, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Tercera División</h2>
          </div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", margin: 0, paddingLeft: "1.8rem" }}>Clasificación general, equipos y resultados</p>
        </div>

        <div className="container" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { key: "clasificacion", label: "Clasificación", icon: "📊" },
              { key: "equipos", label: "Equipos", icon: "🛡️" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.5px", textTransform: "uppercase", background: activeTab === tab.key ? "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.08))" : "transparent", color: activeTab === tab.key ? "#a855f7" : "var(--color-text-muted)", boxShadow: activeTab === tab.key ? "0 0 15px rgba(168,85,247,0.15)" : "none", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "clasificacion" && (
          <div className="dashboard-grid">

            {/* ====== COLUMNA IZQUIERDA ====== */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* SIN PARTIDO DESTACADO */}
              <div className="glass-card" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <span style={{ fontSize: "1.5rem", opacity: 0.3 }}>⚽</span>
                </div>
                <p style={{ fontSize: "0.9rem", margin: "0 0 0.3rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Sin partido destacado</p>
                <p style={{ fontSize: "0.75rem", margin: 0, color: "rgba(255,255,255,0.25)" }}>Se mostrará cuando se configure desde el panel</p>
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
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-text-muted)", width: 18, textAlign: "center", flexShrink: 0 }}>DG</span>
                    <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Diferencia de goles</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== TABLA CLASIFICACIÓN ====== */}
            <div className="glass-card" style={{ padding: "1.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--color-white)" }}>Clasificación General</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.3rem 0.8rem", borderRadius: "20px", fontWeight: 600 }}>{tabla.length} equipos</span>
              </div>

              <div className="table-container">
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
                    {tabla.length === 0 && (
                      <tr><td colSpan={10} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>No hay datos disponibles</td></tr>
                    )}
                    {tabla.map((team, index) => {
                      const dg = getDG(team.gf, team.gc);
                      return (
                        <tr key={team.id} style={{ borderLeft: "3px solid transparent", transition: "all 0.2s ease" }}>
                          <td style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{index + 1}</span>
                          </td>
                          <td className="team-cell" style={{ paddingLeft: "16px" }}>
                            {team.logo && <img src={logoUrl(team.logo)} alt={team.nombre} style={{ width: 28, height: 28, objectFit: "contain", background: "rgba(255,255,255,0.06)", borderRadius: "50%", padding: "3px" }} />}
                            <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--color-text-main)", whiteSpace: "nowrap" }}>{team.nombre}</span>
                          </td>
                          <td>{team.pj}</td>
                          <td style={{ color: "#10b981", fontWeight: 600 }}>{team.pg}</td>
                          <td style={{ color: "#f59e0b", fontWeight: 600 }}>{team.pe}</td>
                          <td style={{ color: "#ef4444", fontWeight: 600 }}>{team.pp}</td>
                          <td>{team.gf}</td>
                          <td>{team.gc}</td>
                          <td style={{ fontWeight: 700, color: team.gf - team.gc > 0 ? "#10b981" : team.gf - team.gc < 0 ? "#ef4444" : "var(--color-text-muted)", fontSize: "0.85rem" }}>{dg}</td>
                          <td style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-white)", fontFamily: "var(--font-heading)", textShadow: "0 0 8px rgba(168,85,247,0.3)" }}>{team.pts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {tabla.length > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                  <span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><IconStadium /> Tercera División · El Salvador</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====== TAB EQUIPOS ====== */}
        {activeTab === "equipos" && (
          <div className="container" style={{ paddingBottom: "var(--spacing-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, margin: "0 0 0.3rem 0", color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <IconShield /> Clubes de la Temporada
                </h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: 0 }}>Información completa de cada equipo participante</p>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.4rem 1rem", borderRadius: "20px", fontWeight: 600 }}>{equipos.length} clubes</span>
            </div>

            {equipos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--color-text-muted)" }}>
                <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No hay equipos registrados</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                {equipos.map((equipo) => {
                  const stats = getTeamStats(equipo.id);
                  return (
                    <div key={equipo.id} className="glass-card" style={{ padding: 0, overflow: "hidden", transition: "all 0.3s ease", cursor: "default", borderLeft: "3px solid transparent" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.1)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
                    >
                      <div style={{ height: "6px", background: "linear-gradient(90deg, rgba(168,85,247,0.6), transparent)" }} />
                      <div style={{ padding: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
                          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid rgba(255,255,255,0.08)" }}>
                            {equipo.logo && <img src={logoUrl(equipo.logo)} alt={equipo.nombre} style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.2rem 0", color: "var(--color-white)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{equipo.nombre}</h4>
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
                                <div style={{ height: "100%", borderRadius: "2px", background: "linear-gradient(90deg, #a855f7, #7c3aed)", width: `${Math.min((stats.pts / (tabla[0]?.pts || 1)) * 100, 100)}%`, transition: "width 0.5s ease" }} />
                              </div>
                              <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--color-white)", fontFamily: "var(--font-heading)", textShadow: "0 0 10px rgba(168,85,247,0.4)" }}>{stats.pts}</span>
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
            <div className="footer-section"><h4>Divisiones</h4><ul><li><a href="/primera">Primera División</a></li><li><a href="/segunda">Segunda División</a></li><li><a href="/tercera">Tercera División</a></li></ul></div>
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