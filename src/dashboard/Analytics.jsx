import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../admin.css";
import Swal from "sweetalert2";
import {
    LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings,
    LogOut, Menu, Trophy, Target, ChevronDown, MessageCircle, Eye,
    BarChart3, TrendingUp, Globe, ShieldAlert,
} from "lucide-react";
import { API_BASE } from "../config";

const API = API_BASE;
const f = (url) => fetch(url).then(r => r.text()).then(t => { if (t.trim().startsWith("<")) throw new Error("err"); return JSON.parse(t); });

const Analytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [teamsOpen, setTeamsOpen] = useState(false);
    const [seleccionesOpen, setSeleccionesOpen] = useState(false);
    const [modo, setModo] = useState("hoy");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            f(`${API}get_estadisticas_visitas.php?modo=${modo}`),
        ]).then(([d]) => {
            if (d.success) setData(d);
        }).catch(() => Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al cargar", showConfirmButton: false, timer: 2500 }))
          .finally(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, [modo]);

    const handleLogout = () => {
        Swal.fire({ title: "Cerrar sesin?", icon: "warning", showCancelButton: true, confirmButtonText: "S, salir", cancelButtonText: "Cancelar", background: "#1e293b", color: "#fff" })
            .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); window.location.href = "/login"; } });
    };

    useEffect(() => { if (location.pathname.startsWith("/teams/")) setTeamsOpen(true); }, [location.pathname]);

    const stats = data?.stats || {};
    const modos = [
        { value: "hoy", label: "Hoy" },
        { value: "ayer", label: "Ayer" },
        { value: "semana", label: "Esta Semana" },
        { value: "mes", label: "Este Mes" },
        { value: "total", label: "Total" },
    ];
    const statCards = [
        { label: modos.find(m => m.value === modo)?.label || "Visitas", value: stats.total || 0, color: "#3b82f6", icon: <TrendingUp size={20} />, border: "rgba(59,130,246,0.15)" },
        { label: "Visitantes únicos", value: stats.unicas || 0, color: "#10b981", icon: <Globe size={20} />, border: "rgba(16,185,129,0.15)" },
        { label: "Bots detectados", value: stats.bots || 0, color: "#f59e0b", icon: <ShieldAlert size={20} />, border: "rgba(245,158,11,0.15)" },
    ];

    const navItems = [
        { path: "/analytics", icon: <BarChart3 size={20} />, label: "Analíticas" },
        { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
        { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
        { type: "dropdown", icon: <Shield size={20} />, label: "Equipos", children: [
            { path: "/teams/primera", label: "Primera Divisin" },
            { path: "/teams/ascenso", label: "Liga de Ascenso" },
            { path: "/teams/femenina", label: "Femenina" },
        ]},
        { type: "dropdown", icon: <Shield size={20} />, label: "Selecciones", children: [
            { path: "/manage-seleccion", label: "Masculina" },
            { path: "/manage-seleccion-femenina", label: "Femenina" },
            { path: "/manage-seleccion-sub20", label: "Sub-20" },
            { path: "/manage-seleccion-sub17", label: "Sub-17" },
        ]},
        { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
        { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
        { path: "/admin/copa", icon: <Trophy size={20} />, label: "Copa Presidente" },
        { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
        { path: "/manage-comments", icon: <MessageCircle size={20} />, label: "Gestionar Comentarios" },
        { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
        { path: "/settings", icon: <Settings size={20} />, label: "Configuracin" },
        { path: "/", icon: <Eye size={20} />, label: "Ver Sitio" },
    ];

    if (loading && !data) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", background: "#0f172a" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
                    <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>CARGANDO...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`admin-layout ${sidebarOpen ? "sidebar-closed" : ""}`}>
            <aside className="sidebar">
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

            {/* MAIN */}
            <main className="main-content">
                <header className="top-bar">
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <div className="search-bar"><input type="text" placeholder="Buscar..." /></div>
                </header>

                <div className="content-wrapper" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                        <h1 className="admin-title" style={{ margin: 0 }}>Analíticas de Visitas</h1>
                        <div style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "4px" }}>
                            {modos.map(m => (
                                <button key={m.value} onClick={() => setModo(m.value)} style={{
                                    padding: "6px 14px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 700,
                                    cursor: "pointer", transition: "all 0.2s",
                                    background: modo === m.value ? "rgba(59,130,246,0.15)" : "transparent",
                                    color: modo === m.value ? "#60a5fa" : "#475569",
                                }}>{m.label}</button>
                            ))}
                        </div>
                    </div>

                    {/* STAT CARDS */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                        {statCards.map((s, i) => (
                            <div key={i} style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", border: `1px solid ${s.border}`, borderRadius: "14px", padding: "1.2rem 1.3rem", transition: "all 0.3s ease" }}>
                                <div style={{ width: 38, height: 38, borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "0.8rem" }}>{s.icon}</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f1f5f9", fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.3rem", fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* CHARTS */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                        {/* Visitas por hora */}
                        <div className="table-container" style={{ padding: "1.2rem" }}>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Visitas por Hora (Hoy)</h3>
                            {data?.por_hora?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={data.por_hora}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="hora" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={v => `${v}h`} />
                                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                                        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <p style={{ color: "#475569", textAlign: "center", padding: "2rem" }}>Sin datos an</p>}
                        </div>

                        {/* Visitas por día */}
                        <div className="table-container" style={{ padding: "1.2rem" }}>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Visitas por Da (ltima Semana)</h3>
                            {data?.por_dia?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={data.por_dia}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="fecha" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={v => new Date(v).toLocaleDateString("es-SV", { day: "2-digit", month: "short" })} />
                                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                                        <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : <p style={{ color: "#475569", textAlign: "center", padding: "2rem" }}>Sin datos an</p>}
                        </div>
                    </div>

                    {/* RECENT VISITS TABLE */}
                    <div className="table-container" style={{ marginBottom: "1.5rem" }}>
                        <div className="table-header">
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>ltimas 50 Visitas</h3>
                        </div>
                        <div style={{ overflowX: "auto" }}>
                            <table className="data-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                                        <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Visitante</th>
                                        <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Pgina</th>
                                        <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Bot</th>
                                        <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.recientes?.map((v, i) => (
                                        <tr key={v.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                                            <td style={{ padding: "0.7rem 1rem", fontSize: "0.8rem", color: "#94a3b8", fontFamily: "monospace" }}>{v.ip_hash ? v.ip_hash.substring(0, 12) + '...' : '—'}</td>
                                            <td style={{ padding: "0.7rem 1rem", fontSize: "0.8rem", color: "#e2e8f0" }}>{v.pagina}</td>
                                            <td style={{ padding: "0.7rem 1rem", textAlign: "center" }}>
                                                {v.es_bot == 1 ? <span style={{ color: "#f59e0b", fontSize: "0.7rem", fontWeight: 700, background: "rgba(245,158,11,0.15)", padding: "2px 8px", borderRadius: "4px" }}>BOT</span> : <span style={{ color: "#10b981", fontSize: "0.7rem" }}>—</span>}
                                            </td>
                                            <td style={{ padding: "0.7rem 1rem", fontSize: "0.75rem", color: "#64748b" }}>{v.created_at ? new Date(v.created_at).toLocaleString("es-SV") : "—"}</td>
                                        </tr>
                                    ))}
                                    {(!data?.recientes || data.recientes.length === 0) && (
                                        <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#475569" }}>Sin visitas registradas</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .admin-layout { grid-template-columns: 1fr !important; }
                    .sidebar { display: none; }
                    .sidebar-closed .sidebar { display: none; }
                }
                @media (max-width: 1000px) {
                    .admin-layout { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default Analytics;
