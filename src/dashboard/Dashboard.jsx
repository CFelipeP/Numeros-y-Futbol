import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import "animate.css";

import {
  LayoutDashboard,
  CalendarDays,
  Shield,
  Newspaper,
  Users,
  Settings,
  LogOut,
  Menu,
  CircleDot,
  Target,
  FileText,
  Trophy,
  Zap,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

import GoalsChart from "../components/GoalsChart";

const API_BASE = "http://numeros-y-futbol.test/backend/";

const logoUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  const text = await res.text();
  if (text.trim().startsWith("<")) throw new Error("Error del servidor");
  return JSON.parse(text);
};

// Deriva datos del gráfico desde los partidos finales
// Agrupa partidos de 6 en 6 como jornadas
const deriveChartFromMatches = (matches) => {
  const finalizados = matches.filter((m) => {
    const s = (m.status || "").toLowerCase();
    return s.includes("finalizado") || s.includes("ft");
  });

  if (finalizados.length === 0) return [];

  const data = [];
  for (let i = 0; i < finalizados.length; i += 6) {
    const bloque = finalizados.slice(i, i + 6);
    let goles = 0;
    let fechaInicio = "";
    let fechaFin = "";

    bloque.forEach((m) => {
      goles += (parseInt(m.goles_local) || 0) + (parseInt(m.goles_visitante) || 0);
      const fi = (m.fecha || "").substring(0, 10);
      if (!fechaInicio) fechaInicio = fi;
      fechaFin = fi;
    });

    data.push({
      name: `Jornada ${Math.floor(i / 6) + 1}`,
      goles,
      fecha: fechaInicio === fechaFin ? fechaInicio : `${fechaInicio} → ${fechaFin}`,
      partidos: bloque.length,
    });
  }

  return data;
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const location = useLocation();

  const [stats, setStats] = useState({
    pendientes: 0, goles: 0, noticias: 0,
    usuarios: 0, equipos: 0, jugados: 0,
  });
  const [matches, setMatches] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchData = () => {
    setLoading(true);

    Promise.allSettled([
      safeFetch(`${API_BASE}get_dashboard_stats.php`),
      safeFetch(`${API_BASE}get_sidebar_matches.php`),
      safeFetch(`${API_BASE}get_goals_by_jornada.php`),
    ])
      .then(([rStats, rMatches, rChart]) => {
        // Stats
        if (rStats.status === "fulfilled") {
          const d = rStats.value;
          setStats(d && typeof d === "object" ? d : {});
        }

        // Matches
        let recent = [];
        if (rMatches.status === "fulfilled") {
          const d = rMatches.value;
          recent = d?.recent || [];
          const next = d?.next
            ? [{ ...d.next, status: "Programado", score: "-", date: d.next.fecha }]
            : [];
          setMatches([...recent, ...next]);
        }

        // Chart — primero intenta con el endpoint dedicado
        if (rChart.status === "fulfilled" && Array.isArray(rChart.value) && rChart.value.length > 0) {
          setChartData(rChart.value);
        } else {
          // FALLBACK: deriva datos desde los partidos que ya tenemos
          const derived = deriveChartFromMatches(recent);
          setChartData(derived);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReset = () => {
    Swal.fire({
      title: "¿Reiniciar temporada?",
      html: `
        <p style="color:#94a3b8;font-size:14px;margin-bottom:12px;">
          Esta acción eliminará <strong style="color:#f87171;">todos los partidos</strong> 
          y reiniciará la tabla de posiciones a cero.
        </p>
        <p style="color:#64748b;font-size:12px;margin:0;">
          Las noticias, equipos y usuarios no se verán afectados.
        </p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, reiniciar todo",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      background: "#1e293b",
      color: "#fff",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setResetting(true);
        safeFetch(`${API_BASE}reset_stats.php`, { method: "POST" })
          .then((res) => {
            if (res.success) {
              Swal.fire({
                toast: true, position: "top-end", icon: "success",
                title: "Temporada reiniciada", showConfirmButton: false, timer: 2000,
              });
              fetchData();
            } else {
              throw new Error(res.error || "Error desconocido");
            }
          })
          .catch(() => {
            Swal.fire({
              toast: true, position: "top-end", icon: "error",
              title: "Error al reiniciar", showConfirmButton: false, timer: 2500,
            });
          })
          .finally(() => setResetting(false));
      }
    });
  };

  const filteredMatches = matches.filter(
    (m) =>
      (m.home_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.away_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      background: "#1e293b",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    });
  };

  const statCards = [
    { key: "pendientes", title: "Partidos Pendientes", value: stats.pendientes ?? 0, icon: <CircleDot size={22} />, color: "#3b82f6", gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))", border: "rgba(59,130,246,0.18)" },
    { key: "jugados", title: "Partidos Jugados", value: stats.jugados ?? 0, icon: <TrendingUp size={22} />, color: "#8b5cf6", gradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.04))", border: "rgba(139,92,246,0.18)" },
    { key: "goles", title: "Goles Temporada", value: stats.goles ?? 0, icon: <Target size={22} />, color: "#10b981", gradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))", border: "rgba(16,185,129,0.18)" },
    { key: "noticias", title: "Noticias Activas", value: stats.noticias ?? 0, icon: <FileText size={22} />, color: "#f59e0b", gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))", border: "rgba(245,158,11,0.18)" },
    { key: "equipos", title: "Equipos", value: stats.equipos ?? 0, icon: <Shield size={22} />, color: "#06b6d4", gradient: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(6,182,212,0.04))", border: "rgba(6,182,212,0.18)" },
    { key: "usuarios", title: "Usuarios", value: stats.usuarios ?? 0, icon: <Users size={22} />, color: "#f97316", gradient: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))", border: "rgba(249,115,22,0.18)" },
  ];

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
    { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
    { path: "/teams", icon: <Shield size={20} />, label: "Equipos" },
    { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
    { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
    { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
    { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
  ];

  const getStatusStyle = (status) => {
    if (!status) return { bg: "rgba(100,116,139,0.12)", color: "#64748b", label: "—" };
    const l = status.toLowerCase();
    if (l.includes("finalizado") || l.includes("ft") || l.includes("terminado"))
      return { bg: "rgba(16,185,129,0.12)", color: "#10b981", label: "Finalizado" };
    if (l.includes("programado") || l.includes("pendiente") || l.includes("por jugar"))
      return { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", label: "Pendiente" };
    if (l.includes("vivo") || l.includes("live") || l.includes("jugando"))
      return { bg: "rgba(239,68,68,0.12)", color: "#f87171", label: "En Vivo" };
    return { bg: "rgba(100,116,139,0.12)", color: "#94a3b8", label: status };
  };

  return (
    <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <img
              src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a"
              alt="Logo Números y Fútbol"
            />
          </div>
          <h2 className="sidebar-title">
            Números y Fútbol <span className="accent-text">Admin</span>
          </h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                >
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}>
            <LogOut size={20} className="nav-icon" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Sidebar">
            <Menu size={24} />
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="content-wrapper">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
            <h1 className="admin-title" style={{ margin: 0 }}>Dashboard</h1>
            <button
              onClick={handleReset}
              disabled={resetting || loading}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "9px 18px", borderRadius: "10px",
                background: resetting
                  ? "rgba(239,68,68,0.15)"
                  : "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))",
                border: "1px solid rgba(239,68,68,0.25)",
                color: resetting ? "#f87171" : "#fca5a5",
                fontSize: "13px", fontWeight: 600,
                cursor: resetting || loading ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                opacity: resetting || loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!resetting && !loading) {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.35), rgba(239,68,68,0.15))";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(239,68,68,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = resetting
                  ? "rgba(239,68,68,0.15)"
                  : "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <RotateCcw
                size={15}
                style={resetting ? { animation: "spin 0.8s linear infinite" } : {}}
              />
              {resetting ? "Reiniciando..." : "Reiniciar Temporada"}
            </button>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.02)", borderRadius: "14px", padding: "1.5rem",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: "8px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {statCards.map((s) => (
                <div key={s.key} style={{
                  background: s.gradient, border: `1px solid ${s.border}`,
                  borderRadius: "14px", padding: "1.3rem 1.2rem",
                  transition: "all 0.3s ease", cursor: "default",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 25px ${s.border}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: "10px",
                    background: `${s.color}18`, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: s.color, marginBottom: "0.8rem",
                  }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#f1f5f9", fontFamily: "monospace", lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", fontWeight: 500 }}>
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          )}
          <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }`}</style>

          <div className="chart-container">
            <div className="table-header">
              <h2>Estadísticas de goles</h2>
              <span style={{
                fontSize: "11px", color: "#64748b",
                background: "rgba(255,255,255,0.04)",
                padding: "4px 10px", borderRadius: "6px",
              }}>
                {chartData.length > 0
                  ? `${chartData.length} jornada${chartData.length > 1 ? "s" : ""} registrada${chartData.length > 1 ? "s" : ""}`
                  : "Sin jornadas"
                }
              </span>
            </div>
            <GoalsChart data={chartData} />
          </div>

          <div className="table-container">
            <div className="table-header">
              <h2>Últimos Partidos</h2>
              <Link to="/matches" style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "8px",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "#fff", fontSize: "13px", fontWeight: 600,
                textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(59,130,246,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <Zap size={15} /> Ver todos
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
                <span style={{ fontSize: "0.85rem" }}>Cargando partidos...</span>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#475569" }}>
                <Trophy size={36} style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.15 }} />
                <p style={{ fontWeight: 600, color: "#64748b", margin: "0 0 0.3rem" }}>
                  {search ? "Sin resultados para la búsqueda" : "No hay partidos registrados"}
                </p>
                <p style={{ fontSize: "13px", margin: 0, opacity: 0.5 }}>
                  {search ? "Intenta con otro nombre" : "Crea partidos desde Gestionar Partidos"}
                </p>
              </div>
            ) : (
              <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Local</th>
                    <th style={{ textAlign: "center" }}>Marcador</th>
                    <th>Visitante</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.map((m, i) => {
                    const st = getStatusStyle(m.status);
                    const escudoL = m.home_logo ? logoUrl(m.home_logo) : null;
                    const escudoV = m.away_logo ? logoUrl(m.away_logo) : null;
                    const fallback = "https://ui-avatars.com/api/?name=EQ&background=0f172a&color=334155&size=32&bold=true";
                    const isFinal = st.label === "Finalizado";
                    const score = m.goles_local != null && m.goles_visitante != null
                      ? `${m.goles_local} - ${m.goles_visitante}`
                      : "-";

                    return (
                      <tr key={m.id || `m-${i}`} style={{ transition: "background 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ whiteSpace: "nowrap", color: "#94a3b8", fontSize: "13px", padding: "12px 14px" }}>
                          {m.fecha || "—"}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                              src={escudoL || fallback}
                              alt=""
                              onError={(e) => { e.target.src = fallback; }}
                              style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "6px", background: "#fff", padding: "2px", flexShrink: 0 }}
                            />
                            <span style={{ fontWeight: 600, fontSize: "14px" }}>{m.home_name || "—"}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "center", padding: "12px 14px" }}>
                          <span style={{
                            fontWeight: 800, fontSize: "15px",
                            color: isFinal ? "#e2b340" : "#475569",
                            letterSpacing: "2px", fontFamily: "monospace",
                          }}>
                            {score}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                            <span style={{ fontWeight: 600, fontSize: "14px" }}>{m.away_name || "—"}</span>
                            <img
                              src={escudoV || fallback}
                              alt=""
                              onError={(e) => { e.target.src = fallback; }}
                              style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "6px", background: "#fff", padding: "2px", flexShrink: 0 }}
                            />
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            display: "inline-block", padding: "4px 10px", borderRadius: "6px",
                            background: st.bg, color: st.color,
                            fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminDashboard;