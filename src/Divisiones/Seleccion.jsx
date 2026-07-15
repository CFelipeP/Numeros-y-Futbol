import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles2.css";
import { API_BASE } from "../config";

const API = API_BASE;

const logoUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/backend/")) return path;
  return `${API_BASE}${path}`;
};

const getMatchStatus = (e) => {
  if (!e) return { text: "Por definir", variant: "default" };
  const l = e.toLowerCase();
  if (l.includes("finalizado") || l.includes("ft")) return { text: "Finalizado", variant: "finished" };
  if (l.includes("vivo") || l.includes("live") || l.includes("curso")) return { text: "EN VIVO", variant: "live" };
  if (l.includes("pendiente") || l.includes("programado")) return { text: "Programado", variant: "scheduled" };
  return { text: e, variant: "default" };
};

const posiciones = [
  { value: "portero", label: "Portero", cat: "portero", color: "#f59e0b", abbr: "POR" },
  { value: "lateral_izquierdo", label: "Lateral Izquierdo", cat: "defensa", color: "#60a5fa", abbr: "LI" },
  { value: "lateral_derecho", label: "Lateral Derecho", cat: "defensa", color: "#60a5fa", abbr: "LD" },
  { value: "central", label: "Central", cat: "defensa", color: "#3b82f6", abbr: "DFC" },
  { value: "medio_defensivo", label: "Medio Defensivo", cat: "medio", color: "#34d399", abbr: "MCD" },
  { value: "medio_central", label: "Medio Central", cat: "medio", color: "#10b981", abbr: "MC" },
  { value: "medio_ofensivo", label: "Medio Ofensivo", cat: "medio", color: "#059669", abbr: "MCO" },
  { value: "extremo_izquierdo", label: "Extremo Izquierdo", cat: "medio", color: "#6ee7b7", abbr: "EI" },
  { value: "extremo_derecho", label: "Extremo Derecho", cat: "medio", color: "#6ee7b7", abbr: "ED" },
  { value: "centrodelantero", label: "Centrodelantero", cat: "delantero", color: "#ef4444", abbr: "DC" },
  { value: "segundo_delantero", label: "2do Delantero", cat: "delantero", color: "#f87171", abbr: "SD" },
];
function getPosInfo(v) {
  if (v === "centrocampista") v = "medio_central";
  if (v === "defensa") v = "central";
  if (v === "delantero") v = "centrodelantero";
  return posiciones.find(p => p.value === v) || { label: v || "?", cat: "medio", color: "#64748b", abbr: "??" };
}

const catCfg = {
  portero: { color: "#f59e0b", border: "rgba(245,158,11,0.2)", label: "PORTEROS", grad: "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.02))", icon: "🧤" },
  defensa: { color: "#3b82f6", border: "rgba(59,130,246,0.2)", label: "DEFENSAS", grad: "linear-gradient(135deg,rgba(59,130,246,0.08),rgba(59,130,246,0.02))", icon: "🛡️" },
  medio: { color: "#10b981", border: "rgba(16,185,129,0.2)", label: "MEDIOS", grad: "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.02))", icon: "⚽" },
  delantero: { color: "#ef4444", border: "rgba(239,68,68,0.2)", label: "DELANTEROS", grad: "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))", icon: "🎯" },
};

export default function Seleccion() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("partidos");

  useEffect(() => {
    fetch(`${API}get_seleccion_detalle.php`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (<><Header /><div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#fff" }}>Cargando...</div></>);
  }

  const partidos = data?.partidos || [];
  const jugadores = data?.jugadores || [];
  const staff = data?.staff || [];
  const escudoSV = logoUrl("/uploads/escudo_elsalvador.png");

  const grupos = {
    portero: jugadores.filter(j => getPosInfo(j.posicion).cat === "portero"),
    defensa: jugadores.filter(j => getPosInfo(j.posicion).cat === "defensa"),
    medio: jugadores.filter(j => getPosInfo(j.posicion).cat === "medio"),
    delantero: jugadores.filter(j => getPosInfo(j.posicion).cat === "delantero"),
  };

  return (
    <>
      <Header />
      <style>{`
        .sel-body { background:#0f172a; min-height:100vh; font-family:'Roboto',sans-serif; color:#f1f5f9; }
        .sel-hero { position:relative; background:linear-gradient(160deg,#0a1a2e 0%,#0d1b2a 40%,#041c2c 100%); border-bottom:2px solid rgba(0,153,255,0.2); overflow:hidden; }
        .sel-hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,153,255,0.08) 0%, transparent 70%); pointer-events:none; }
        .sel-hero-stripe { height:3px; background:linear-gradient(90deg,transparent,#0099ff88,#0099ff,#0099ff88,transparent); }
        .sel-hero-inner { max-width:900px; margin:0 auto; padding:32px 20px 36px; position:relative; z-index:1; text-align:center; }
        .sel-escudo { width:100px; height:100px; margin:0 auto 16px; border-radius:50%; background:rgba(255,255,255,0.04); border:3px solid rgba(0,153,255,0.3); padding:12px; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 30px rgba(0,0,0,0.6); }
        .sel-escudo img { width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4)); }
        .sel-hero h1 { font-family:'Montserrat',sans-serif; font-size:2rem; font-weight:900; color:#f1f5f9; margin:0 0 4px; text-shadow:0 2px 10px rgba(0,0,0,0.5); }
        .sel-hero p { font-size:0.9rem; color:#94a3b8; margin:0; font-weight:500; }
        .sel-tabs { display:flex; gap:4px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:4px; margin-bottom:24px; max-width:600px; margin-left:auto; margin-right:auto; }
        .sel-tab { flex:1; display:flex; align-items:center; justify-content:center; gap:7px; padding:12px 16px; border-radius:9px; border:none; cursor:pointer; font-family:'Montserrat',sans-serif; font-weight:700; font-size:13px; color:#64748b; background:transparent; transition:0.2s; }
        .sel-tab.active { background:linear-gradient(135deg,rgba(0,153,255,0.18),rgba(0,153,255,0.06)); color:#0099ff; box-shadow:0 0 15px rgba(0,153,255,0.12); }
        .sel-content { max-width:1000px; margin:0 auto; padding:24px 20px 60px; }
        .sel-card { background:rgba(30,41,59,0.5); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:24px; }
        .sel-card-title { font-family:'Montserrat',sans-serif; font-size:13px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#94a3b8; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .sel-match-row { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:10px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); margin-bottom:8px; transition:0.2s; cursor:pointer; }
        .sel-match-row:hover { background:rgba(255,255,255,0.04); }
        .sel-rival-logo { width:36px; height:36px; border-radius:50%; overflow:hidden; flex-shrink:0; background:rgba(255,255,255,0.06); padding:4px; display:flex; align-items:center; justify-content:center; }
        .sel-rival-logo img { width:100%; height:100%; object-fit:contain; }
        .sel-match-info { flex:1; min-width:0; }
        .sel-match-teams { font-size:14px; font-weight:600; color:#f1f5f9; margin-bottom:2px; }
        .sel-match-meta { font-size:11px; color:#64748b; display:flex; align-items:center; gap:8px; }
        .sel-match-score { font-size:18px; font-weight:800; font-family:'Montserrat',sans-serif; color:#f1f5f9; letter-spacing:1px; flex-shrink:0; }
        .sel-badge { font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:1px; padding:3px 10px; border-radius:4px; flex-shrink:0; }
        .sel-player-group { margin-bottom:20px; }
        .sel-group-header { font-size:10px; font-weight:800; letter-spacing:2px; text-transform:uppercase; padding:8px 12px; border-radius:8px; margin-bottom:8px; display:flex; align-items:center; gap:8px; }
        .sel-player-row { display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); margin-bottom:4px; transition:0.15s; }
        .sel-player-num { font-size:13px; font-weight:800; min-width:26px; text-align:right; color:#94a3b8; }
        .sel-player-name { font-size:13px; font-weight:600; color:#e2e8f0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .sel-player-club { font-size:10px; color:#64748b; font-weight:500; }
        .sel-player-stats { display:flex; gap:8px; font-size:10px; font-weight:700; }
        .sel-stat { color:#64748b; }
        .sel-stat b { color:#f1f5f9; }
        .sel-staff-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }
        .sel-staff-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px; text-align:center; transition:0.2s; }
        .sel-staff-card:hover { background:rgba(255,255,255,0.04); }
        .sel-staff-avatar { width:64px; height:64px; border-radius:50%; margin:0 auto 10px; background:rgba(0,153,255,0.1); border:2px solid rgba(0,153,255,0.2); display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .sel-staff-avatar img { width:100%; height:100%; object-fit:cover; }
        .sel-staff-name { font-size:14px; font-weight:700; color:#f1f5f9; }
        .sel-staff-rol { font-size:11px; color:#0099ff; font-weight:600; margin-top:2px; }
        .sel-staff-nacion { font-size:10px; color:#64748b; margin-top:4px; }
        .sel-vs { font-size:11px; font-weight:800; color:#64748b; letter-spacing:2px; margin:0 4px; }
        @media(max-width:768px) {
          .sel-escudo { width:76px; height:76px; padding:8px; }
          .sel-hero h1 { font-size:1.5rem; }
          .sel-staff-grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); }
        }
        @media(max-width:480px) {
          .sel-escudo { width:60px; height:60px; padding:6px; }
          .sel-hero h1 { font-size:1.2rem; }
          .sel-match-row { flex-wrap:wrap; }
          .sel-match-score { font-size:16px; }
          .sel-staff-grid { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      <div className="sel-body">
        <div className="sel-hero">
          <div className="sel-hero-stripe" />
          <div className="sel-hero-inner">
            <div className="sel-escudo">
              {escudoSV ? <img src={escudoSV} alt="El Salvador" /> : <span style={{ fontSize: 36 }}>🇸🇻</span>}
            </div>
            <h1>Selección Salvadoreña</h1>
            <p>{jugadores.length} convocados · {staff.length} cuerpo técnico · {partidos.filter(p => (p.estado || "").toLowerCase() === "finalizado").length} partidos jugados</p>
          </div>
        </div>

        <div className="sel-content">
          <div className="sel-tabs">
            {[
              { key: "partidos", label: "Partidos", icon: "⚽" },
              { key: "jugadores", label: "Jugadores", icon: "👥" },
              { key: "tecnico", label: "Cuerpo Técnico", icon: "📋" },
            ].map(t => (
              <button key={t.key} className={`sel-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>
                <span>{t.icon}</span> <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── PARTIDOS ── */}
          {activeTab === "partidos" && (
            <div className="sel-card">
              <div className="sel-card-title">⚽ Partidos</div>
              {partidos.length === 0 ? (
                <p style={{ color: "#64748b", textAlign: "center", padding: "2rem 0" }}>No hay partidos registrados</p>
              ) : (
                partidos.map(p => {
                  const st = getMatchStatus(p.estado);
                  const isLive = st.variant === "live";
                  const isFinished = st.variant === "finished";
                  const hasScore = p.goles_favor != null;
                  return (
                    <div key={p.id} className="sel-match-row" onClick={() => navigate(`/partido/${p.id}/seleccion`)}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: "#0099ff" }}>🇸🇻</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", flex: 1, minWidth: "auto" }}>El Salvador</span>
                      <span className="sel-match-score">
                        {hasScore ? `${p.goles_favor} - ${p.goles_contra}` : "VS"}
                      </span>
                      <div className="sel-rival-logo">
                        {p.rival_logo ? <img src={logoUrl(p.rival_logo)} alt={p.rival_nombre} /> : <span style={{ fontSize: 14 }}>🏴</span>}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", flex: 1, textAlign: "right" }}>{p.rival_nombre}</span>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                        <span className="sel-badge" style={{
                          color: isLive ? "#22c55e" : isFinished ? "#64748b" : "#f59e0b",
                          background: isLive ? "rgba(34,197,94,0.12)" : isFinished ? "rgba(100,116,139,0.12)" : "rgba(245,158,11,0.12)",
                          border: `1px solid ${isLive ? "#22c55e33" : isFinished ? "#64748b33" : "#f59e0b33"}`
                        }}>{st.text}</span>
                        <span style={{ fontSize: 9, color: "#475569" }}>{p.competicion || ""}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── JUGADORES ── */}
          {activeTab === "jugadores" && (
            <div className="sel-card">
              <div className="sel-card-title">👥 Jugadores convocados ({jugadores.length})</div>
              {["portero", "defensa", "medio", "delantero"].map(cat => {
                const items = grupos[cat];
                if (!items.length) return null;
                const cfg = catCfg[cat];
                return (
                  <div key={cat} className="sel-player-group">
                    <div className="sel-group-header" style={{ color: cfg.color, background: cfg.grad, border: `1px solid ${cfg.border}` }}>
                      <span>{cfg.icon}</span> {cfg.label} <span style={{ fontSize: 10, marginLeft: "auto", opacity: 0.5 }}>{items.length}</span>
                    </div>
                    {items.map(j => (
                      <div key={j.id} className="sel-player-row">
                        <span className="sel-player-num">#{j.numero_camiseta || "?"}</span>
                        <span className="sel-player-name">{j.nombre}</span>
                        <span className="sel-player-club">{j.equipo || ""}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: getPosInfo(j.posicion).color, background: `${getPosInfo(j.posicion).color}1a`, padding: "2px 7px", borderRadius: 4 }}>{getPosInfo(j.posicion).abbr}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── CUERPO TÉCNICO ── */}
          {activeTab === "tecnico" && (
            <div className="sel-card">
              <div className="sel-card-title">📋 Cuerpo Técnico ({staff.length})</div>
              {staff.length === 0 ? (
                <p style={{ color: "#64748b", textAlign: "center", padding: "2rem 0" }}>Sin cuerpo técnico registrado</p>
              ) : (
                <div className="sel-staff-grid">
                  {staff.map(s => (
                    <div key={s.id} className="sel-staff-card">
                      <div className="sel-staff-avatar">
                        {s.foto ? <img src={logoUrl(s.foto)} alt={s.nombre} /> : <span style={{ fontSize: 24 }}>👤</span>}
                      </div>
                      <div className="sel-staff-name">{s.nombre}</div>
                      <div className="sel-staff-rol">{s.rol}</div>
                      {s.nacionalidad && <div className="sel-staff-nacion">{s.nacionalidad}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
