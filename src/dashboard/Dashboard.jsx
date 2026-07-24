import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import "animate.css";
import { apiPost } from "../apiHelper";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  CircleDot, Target, FileText, Trophy, Zap, TrendingUp, RotateCcw, ChevronDown, MessageCircle, Eye, BarChart3
} from "lucide-react";

import GoalsChart from "../components/GoalsChart";
import { API_BASE } from "../config";

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

const deriveChartFromMatches = (matches) => {
  const finalizados = matches.filter((m) => {
    const s = (m.status || "").toLowerCase();
    return s.includes("finalizado") || s.includes("ft");
  });
  if (finalizados.length === 0) return [];
  const data = [];
  for (let i = 0; i < finalizados.length; i += 6) {
    const bloque = finalizados.slice(i, i + 6);
    let goles = 0, fechaInicio = "", fechaFin = "";
    bloque.forEach((m) => {
      goles += (parseInt(m.goles_local) || 0) + (parseInt(m.goles_visitante) || 0);
      const fi = (m.fecha || "").substring(0, 10);
      if (!fechaInicio) fechaInicio = fi;
      fechaFin = fi;
    });
    data.push({
      name: `Jornada ${Math.floor(i / 6) + 1}`, goles,
      fecha: fechaInicio === fechaFin ? fechaInicio : `${fechaInicio} → ${fechaFin}`,
      partidos: bloque.length,
    });
  }
  return data;
};

const DIVISIONES = [
  { value: "primera", label: "Primera" },
  { value: "ascenso", label: "Ascenso" },
  { value: "femenina", label: "Femenina" },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [division, setDivision] = useState(() => localStorage.getItem("admin_division") || "primera");
  useEffect(() => { localStorage.setItem("admin_division", division); }, [division]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(true);
  const [seleccionesOpen, setSeleccionesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const [stats, setStats] = useState({ pendientes: 0, goles: 0, noticias: 0, usuarios: 0, equipos: 0, jugados: 0 });
  const [matches, setMatches] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.allSettled([
      safeFetch(`${API_BASE}get_dashboard_stats.php?division=${division}`),
      safeFetch(`${API_BASE}get_sidebar_matches.php?division=${division}`),
      safeFetch(`${API_BASE}get_goals_by_jornada.php?division=${division}`),
    ])
      .then(([rStats, rMatches, rChart]) => {
        if (rStats.status === "fulfilled") { const d = rStats.value; setStats(d && typeof d === "object" ? d : {}); }
        let recent = [];
        if (rMatches.status === "fulfilled") {
          const d = rMatches.value; recent = d?.recent || [];
          const next = d?.next ? [{ ...d.next, status: "Programado", score: "-", date: d.next.fecha }] : [];
          setMatches([...recent, ...next]);
        }
        if (rChart.status === "fulfilled" && Array.isArray(rChart.value) && rChart.value.length > 0) {
          setChartData(rChart.value);
        } else { setChartData(deriveChartFromMatches(recent)); }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [division]);
  useEffect(() => { if (location.pathname.startsWith("/teams/")) setTeamsOpen(true); }, [location.pathname]);

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      document.body.classList.toggle("sidebar-open-lock", sidebarOpen);
    }
    return () => document.body.classList.remove("sidebar-open-lock");
  }, [sidebarOpen]);

  useEffect(() => {
    if (sessionStorage.getItem("adminTourDashboard")) return;
    const timer = setTimeout(() => {
      const d = driver({
        showProgress: true, allowClose: true,
        nextBtnText: "Siguiente", prevBtnText: "Atrás", doneBtnText: "Entendido",
        steps: [
          { element: "#driver-admin-sidebar", popover: { title: "Panel de Navegación", description: "Desde aquí accedes a todas las secciones: partidos, equipos, noticias, usuarios y más.", side: "right", align: "start" } },
          { element: "#driver-admin-division", popover: { title: "Selector de División", description: "Cambia entre Primera, Ascenso y Femenina para ver estadísticas de cada una.", side: "bottom", align: "start" } },
          { element: "#driver-admin-stats", popover: { title: "Estadísticas Rápidas", description: "Resumen de partidos pendientes, jugados, goles, noticias y equipos registrados.", side: "bottom", align: "center" } },
          { element: "#driver-admin-chart", popover: { title: "Gráfica de Goles", description: "Visualiza los goles por jornada para analizar tendencias de cada división.", side: "top", align: "center" } },
          { element: "#driver-admin-matches", popover: { title: "Últimos Partidos", description: "Revisa los resultados recientes y accede a la gestión completa de partidos.", side: "top", align: "center" } },
          { element: "#driver-admin-reset", popover: { title: "Reiniciar Temporada", description: "Borra todos los partidos y reinicia la tabla de posiciones. Úsalo con cuidado.", side: "left", align: "center" } },
          { element: "#driver-admin-toggle", popover: { title: "Menú Hamburguesa", description: "En dispositivos móviles, usá este botón para mostrar u ocultar la navegación lateral.", side: "bottom", align: "center" } },
        ],
      });
      d.drive();
      sessionStorage.setItem("adminTourDashboard", "true");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    Swal.fire({
      title: "¿Reiniciar temporada?",
      html: `<p style="color:#94a3b8;font-size:14px;margin-bottom:12px;">Esta acción eliminará <strong style="color:#f87171;">todos los partidos</strong> de <strong style="color:#60a5fa;">${(DIVISIONES.find(d => d.value === division) || DIVISIONES[0]).label}</strong> y reiniciará su tabla de posiciones a cero.</p><p style="color:#64748b;font-size:12px;margin:0;">Las noticias, equipos y usuarios no se verán afectados.</p>`,
      icon: "warning", showCancelButton: true, confirmButtonText: "Sí, reiniciar", cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444", cancelButtonColor: "#374151", background: "#1e293b", color: "#fff", reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setResetting(true);
        apiPost(`${API_BASE}reset_stats.php`, { division })
          .then(r => r.json())
          .then((res) => { if (res.success) { Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Temporada reiniciada", showConfirmButton: false, timer: 2000 }); fetchData(); } else throw new Error(); })
          .catch(() => { Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al reiniciar", showConfirmButton: false, timer: 2500 }); })
          .finally(() => setResetting(false));
      }
    });
  };

  const filteredMatches = matches.filter((m) =>
    (m.home_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.away_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    Swal.fire({ title: "¿Cerrar sesión?", text: "¿Estás seguro de que deseas salir?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", cancelButtonText: "Cancelar", background: "#1e293b", color: "#fff" })
      .then((result) => { if (result.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); Swal.fire({ icon: "success", title: "Deslogueo exitoso", timer: 1500, showConfirmButton: false }).then(() => { window.location.href = "/login"; }); } });
  };

  const currentDiv = DIVISIONES.find((d) => d.value === division);

  const statCards = [
    { key: "pendientes", title: "Partidos Pendientes", value: stats.pendientes ?? 0, icon: <CircleDot size={22} />, color: "#3b82f6", gradient: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))", border: "rgba(59,130,246,0.18)" },
    { key: "jugados", title: "Partidos Jugados", value: stats.jugados ?? 0, icon: <TrendingUp size={22} />, color: "#8b5cf6", gradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.04))", border: "rgba(139,92,246,0.18)" },
    { key: "goles", title: "Goles Temporada", value: stats.goles ?? 0, icon: <Target size={22} />, color: "#10b981", gradient: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))", border: "rgba(16,185,129,0.18)" },
    { key: "noticias", title: "Noticias Activas", value: stats.noticias ?? 0, icon: <FileText size={22} />, color: "#f59e0b", gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))", border: "rgba(245,158,11,0.18)" },
    { key: "equipos", title: "Equipos", value: stats.equipos ?? 0, icon: <Shield size={22} />, color: "#06b6d4", gradient: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(6,182,212,0.04))", border: "rgba(6,182,212,0.18)" },
    { key: "usuarios", title: "Usuarios", value: stats.usuarios ?? 0, icon: <Users size={22} />, color: "#f97316", gradient: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))", border: "rgba(249,115,22,0.18)" },
  ];

  const navItems = [
      { path: "/analytics", icon: <BarChart3 size={20} />, label: "Analiticas" },
      { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
      { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
      { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
      {
        type: "dropdown", icon: <Shield size={20} />, label: "Equipos",
        children: [
          { path: "/teams/primera", label: "Primera División" },
          { path: "/teams/ascenso", label: "Liga de Ascenso" },
          { path: "/teams/femenina", label: "Femenina" },
        ]
      },
      {
        type: "dropdown", icon: <Shield size={20} />, label: "Selecciones",
        children: [
          { path: "/manage-seleccion", label: "Masculina" },
          { path: "/manage-seleccion-femenina", label: "Femenina" },
          { path: "/manage-seleccion-sub20", label: "Sub-20" },
            { path: "/manage-seleccion-sub17", label: "Sub-17" },
        ]
      },
      { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
      { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
      { path: "/admin/copa", icon: <Trophy size={20} />, label: "Copa Presidente" },
      { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
      { path: "/manage-comments", icon: <MessageCircle size={20} />, label: "Gestionar Comentarios" },
      { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
      { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
      { path: "/", icon: <Eye size={20} />, label: "Ver Sitio" },
    ];

  const getStatusStyle = (status) => {
    if (!status) return { bg: "rgba(100,116,139,0.12)", color: "#64748b", label: "—" };
    const l = status.toLowerCase();
    if (l.includes("finalizado") || l.includes("ft") || l.includes("terminado")) return { bg: "rgba(16,185,129,0.12)", color: "#10b981", label: "Finalizado" };
    if (l.includes("programado") || l.includes("pendiente") || l.includes("por jugar")) return { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", label: "Pendiente" };
    if (l.includes("vivo") || l.includes("live") || l.includes("jugando")) return { bg: "rgba(239,68,68,0.12)", color: "#f87171", label: "En Vivo" };
    return { bg: "rgba(100,116,139,0.12)", color: "#94a3b8", label: status };
  };

  return (
   <div className={`admin-layout ${sidebarOpen ? "sidebar-closed" : ""}`}>
            <aside className="sidebar" id="driver-admin-sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon"><img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo" /></div>
                    <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
                </div>
                <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, idx) => {
              if (item.type === "dropdown") {
                return (
                  <li key={idx}>
                    <button className="nav-item" onClick={() => { const s = item.label === "Selecciones"; s ? setSeleccionesOpen(!seleccionesOpen) : setTeamsOpen(!teamsOpen); }} style={{ width: "100%", justifyContent: "space-between" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>{item.icon} {item.label}</span>
                      <ChevronDown size={16} style={{ transition: "transform 0.25s ease", transform: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.4 }} />
                    </button>
                    <ul style={{ maxHeight: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "400px" : "0", opacity: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "1" : "0", overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease", listStyle: "none", padding: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "2px 0 4px 0" : "0", margin: 0 }}>
                      {item.children.map(child => (<li key={child.path}><Link to={child.path} className={`nav-item${location.pathname === child.path ? " active" : ""}`} style={{ paddingLeft: "48px", fontSize: "13.5px" }}>{child.label}</Link></li>))}
                    </ul>
                  </li>
                );
              }
              return <li key={item.path}><Link to={item.path} className={`nav-item${location.pathname === item.path ? " active" : ""}`}>{item.icon} {item.label}</Link></li>;
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}><LogOut size={20} className="nav-icon" /> Cerrar sesión</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" id="driver-admin-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Sidebar"><Menu size={24} /></button>
          <div className="search-bar">
            <input type="text" placeholder="Buscar equipo..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </header>

        <div className="content-wrapper" style={{ padding: '1rem' }}>
          <div className="dash-header-row">
            <div className="dash-header-left">
              <h1 className="admin-title" style={{ margin: 0 }}>Dashboard</h1>
              <div ref={dropdownRef} style={{ position: "relative" }} id="driver-admin-division">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px" }}>
                  <Trophy size={14} />{currentDiv?.label} División
                  <ChevronDown size={15} style={{ transition: "transform 0.25s ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.7 }} />
                </button>
                {dropdownOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100, background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden", minWidth: "190px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", animation: "ddFadeIn 0.15s ease-out" }}>
                    {DIVISIONES.map((d) => (
                      <button key={d.value} onClick={() => { setDivision(d.value); setDropdownOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 18px", border: "none", background: division === d.value ? "rgba(59,130,246,0.15)" : "transparent", color: division === d.value ? "#60a5fa" : "#94a3b8", fontSize: "13px", fontWeight: division === d.value ? 700 : 500, cursor: "pointer", transition: "background 0.12s", textAlign: "left" }}>
                        <Trophy size={13} style={{ opacity: division === d.value ? 1 : 0.4 }} />{d.label} División
                        {division === d.value && <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button className="dash-reset-btn" onClick={handleReset} disabled={resetting || loading} id="driver-admin-reset" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 18px", borderRadius: "10px", background: resetting ? "rgba(239,68,68,0.15)" : "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.08))", border: "1px solid rgba(239,68,68,0.25)", color: resetting ? "#f87171" : "#fca5a5", fontSize: "13px", fontWeight: 600, cursor: resetting || loading ? "not-allowed" : "pointer", transition: "all 0.25s ease", opacity: resetting || loading ? 0.6 : 1 }}>
              <RotateCcw size={15} style={resetting ? { animation: "spin 0.8s linear infinite" } : {}} />
              {resetting ? "Reiniciando..." : "Reiniciar Temporada"}
            </button>
          </div>

          {loading ? (
            <div className="dash-stats-grid">
              {[...Array(6)].map((_, i) => (<div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: "14px", padding: "1.5rem", border: "1px solid rgba(255,255,255,0.04)" }}><div style={{ width: 28, height: 28, borderRadius: "8px", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} /></div>))}
            </div>
          ) : (
            <div className="dash-stats-grid" id="driver-admin-stats">
              {statCards.map((s) => (
                <div key={s.key} style={{ background: s.gradient, border: `1px solid ${s.border}`, borderRadius: "14px", padding: "1.3rem 1.2rem", transition: "all 0.3s ease", cursor: "default" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 25px ${s.border}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: "10px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "0.8rem" }}>{s.icon}</div>
                  <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "#f1f5f9", fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", fontWeight: 500 }}>{s.title}</div>
                </div>
              ))}
            </div>
          )}

          <div className="chart-container" style={{ width: "100%", minWidth: 0 }} id="driver-admin-chart">
            <div className="table-header" style={{ flexWrap: "wrap", gap: "10px" }}>
              <h2>Estadísticas de goles</h2>
              <span style={{ fontSize: "11px", color: "#64748b", background: "rgba(255,255,255,0.04)", padding: "4px 10px", borderRadius: "6px" }}>
                {chartData.length > 0 ? `${chartData.length} jornada${chartData.length > 1 ? "s" : ""} registrada${chartData.length > 1 ? "s" : ""}` : "Sin jornadas"}
              </span>
            </div>
            <GoalsChart data={chartData} />
          </div>

          <div className="table-container" style={{ overflowX: 'auto' }} id="driver-admin-matches">
            <div className="table-header" style={{ flexWrap: "wrap", gap: "10px" }}>
              <h2>Últimos Partidos</h2>
              <Link to="/matches" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(59,130,246,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              ><Zap size={15} /> Ver todos</Link>
            </div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}><div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} /><span style={{ fontSize: "0.85rem" }}>Cargando partidos...</span></div>
            ) : filteredMatches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#475569" }}><Trophy size={36} style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.15 }} /><p style={{ fontWeight: 600, color: "#64748b", margin: "0 0 0.3rem" }}>{search ? "Sin resultados para la búsqueda" : "No hay partidos registrados"}</p><p style={{ fontSize: "13px", margin: 0, opacity: 0.5 }}>{search ? "Intenta con otro nombre" : "Crea partidos desde Gestionar Partidos"}</p></div>
            ) : (
              <table className="data-table dash-matches-table" style={{ width: "100%", borderCollapse: "collapse", minWidth: '500px' }}>
                <thead><tr>
                  <th className="hide-on-mobile">Fecha</th>
                  <th>Local</th>
                  <th style={{ textAlign: "center" }}>Marcador</th>
                  <th>Visitante</th>
                  <th className="hide-on-mobile">Estado</th>
                </tr></thead>
                <tbody>
                  {filteredMatches.map((m, i) => {
                    const st = getStatusStyle(m.status);
                    const escudoL = m.home_logo ? logoUrl(m.home_logo) : null;
                    const escudoV = m.away_logo ? logoUrl(m.away_logo) : null;
                    const fallback = "https://ui-avatars.com/api/?name=EQ&background=0f172a&color=334155&size=32&bold=true";
                    const isFinal = st.label === "Finalizado";
                    const score = m.goles_local != null && m.goles_visitante != null ? `${m.goles_local} - ${m.goles_visitante}` : "-";
                    return (
                      <tr key={m.id || `m-${i}`} style={{ transition: "background 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                        <td className="hide-on-mobile" style={{ whiteSpace: "nowrap", color: "#94a3b8", fontSize: "13px", padding: "12px 14px" }}>{m.fecha || "—"}</td>
                        <td style={{ padding: "12px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}><img src={escudoL || fallback} alt="" onError={(e) => { e.target.src = fallback; }} style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "6px", background: "#fff", padding: "2px", flexShrink: 0 }} /><span style={{ fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.home_name || "—"}</span></div></td>
                        <td style={{ textAlign: "center", padding: "12px 14px" }}><span style={{ fontWeight: 800, fontSize: "15px", color: isFinal ? "#e2b340" : "#475569", letterSpacing: "2px", fontFamily: "monospace" }}>{score}</span></td>
                        <td style={{ padding: "12px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}><span style={{ fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.away_name || "—"}</span><img src={escudoV || fallback} alt="" onError={(e) => { e.target.src = fallback; }} style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "6px", background: "#fff", padding: "2px", flexShrink: 0 }} /></div></td>
                        <td className="hide-on-mobile" style={{ padding: "12px 14px" }}><span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "6px", background: st.bg, color: st.color, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{st.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

        <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ddFadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        button.nav-item { background: none; border: none; color: var(--text-muted); font-family: inherit; }

        /* =========================================
           2. GRID RESPONSIVO TARJETAS
           ========================================= */
        .dash-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        @media (min-width: 768px) {
            .dash-stats-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1280px) {
            .dash-stats-grid { grid-template-columns: repeat(6, 1fr); }
        }

        /* =========================================
            3. OCULTAR COLUMNAS EN MOVIL
            ========================================= */
        .hide-on-mobile { display: table-cell; }
        @media (max-width: 768px) {
            .hide-on-mobile { display: none !important; }
        }

        /* =========================================
           4. DASHBOARD HEADER RESPONSIVE
           ========================================= */
        .dash-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.2rem;
            flex-wrap: wrap;
            gap: 0.75rem;
        }
        .dash-header-left {
            display: flex;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
        }

        @media (max-width: 768px) {
            .dash-header-row {
                flex-direction: column;
                align-items: stretch;
                gap: 0.6rem;
                margin-bottom: 1rem;
            }
            .dash-header-left {
                flex-direction: column;
                align-items: stretch;
                gap: 0.5rem;
            }
            .dash-header-left .admin-title {
                font-size: 20px;
            }
            .dash-header-left > div {
                width: 100%;
            }
            .dash-header-left > div > button {
                width: 100%;
                justify-content: center;
            }
            .dash-header-left > div > div {
                width: 100% !important;
            }
            .dash-header-left > div > div > button {
                width: 100% !important;
            }
            .dash-reset-btn {
                width: 100% !important;
                justify-content: center !important;
            }
        }

        @media (max-width: 480px) {
            .dash-stats-grid { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
            .dash-stats-grid > div {
                padding: 1rem 0.9rem !important;
            }
            .dash-stats-grid > div > div:first-child {
                width: 34px !important;
                height: 34px !important;
                margin-bottom: 0.5rem !important;
            }
            .dash-stats-grid > div > div:first-child svg {
                width: 18px !important;
                height: 18px !important;
            }
            .dash-stats-grid > div > div:nth-child(2) {
                font-size: 1.3rem !important;
            }
            .dash-stats-grid > div > div:last-child {
                font-size: 0.65rem !important;
            }

            .chart-container {
                border-radius: 10px !important;
            }
            .chart-container .table-header {
                padding: 10px 12px;
            }
            .chart-container .table-header h2 {
                font-size: 14px;
            }
        }

        @media (max-width: 375px) {
            .dash-stats-grid { gap: 0.35rem; }
            .dash-stats-grid > div {
                padding: 0.8rem 0.7rem !important;
                border-radius: 10px !important;
            }
            .dash-stats-grid > div > div:first-child {
                width: 30px !important;
                height: 30px !important;
                border-radius: 8px !important;
                margin-bottom: 0.4rem !important;
            }
            .dash-stats-grid > div > div:nth-child(2) {
                font-size: 1.1rem !important;
            }
        }

        /* =========================================
           5. TABLA DE PARTIDOS MEJORADA EN MOVIL
           ========================================= */
        @media (max-width: 768px) {
            .dash-matches-table {
                min-width: 400px !important;
            }
            .dash-matches-table td img {
                width: 24px !important;
                height: 24px !important;
            }
            .dash-matches-table td span {
                font-size: 12px !important;
            }
        }

        @media (max-width: 480px) {
            .dash-matches-table {
                min-width: 340px !important;
            }
            .dash-matches-table td {
                padding: 8px 6px !important;
            }
            .dash-matches-table td img {
                width: 22px !important;
                height: 22px !important;
            }
            .dash-matches-table td span {
                font-size: 11px !important;
            }
            .dash-matches-table td > div {
                gap: 6px !important;
            }
        }

        .driver-popover {
          background: #0f172a !important; border: 1px solid #ef4444 !important;
          border-radius: 12px !important; box-shadow: 0 0 20px rgba(239,68,68,0.2), 0 8px 32px rgba(0,0,0,0.5) !important;
          color: #f1f5f9 !important;
        }
        .driver-popover .driver-popover-title {
          color: #ef4444 !important; font-weight: 800 !important;
        }
        .driver-popover .driver-popover-description { color: #94a3b8 !important; }
        .driver-popover .driver-popover-footer button {
          background: #ef4444 !important; border: none !important;
          color: #fff !important; border-radius: 6px !important;
        }
        .driver-popover .driver-popover-footer .driver-popover-prev-btn {
          background: transparent !important; border: 1px solid #ef4444 !important;
          color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;