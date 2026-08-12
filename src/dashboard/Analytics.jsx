import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Link, useLocation } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../admin.css";
import Swal from "sweetalert2";
import {
    LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings,
    LogOut, Menu, Trophy, Target, ChevronDown, MessageCircle, Eye,
    BarChart3, TrendingUp, Globe, ShieldAlert, Monitor,
} from "lucide-react";
import { API_BASE } from "../config";
import { apiFetch } from "../apiHelper";

const API = API_BASE;

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
        apiFetch(`${API}get_estadisticas_visitas.php?modo=${modo}`)
            .then(r => r.json())
            .then(d => {
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
    const bStats = data?.browser_stats || {};
    const modos = [
        { value: "hoy", label: "Hoy" },
        { value: "ayer", label: "Ayer" },
        { value: "semana", label: "Esta Semana" },
        { value: "mes", label: "Este Mes" },
        { value: "total", label: "Total" },
    ];
    const statCards = [
        { label: "Visitas (páginas)", value: stats.total || 0, color: "#3b82f6", icon: <TrendingUp size={20} />, border: "rgba(59,130,246,0.15)", short: "Visitas" },
        { label: "Navegadores únicos", value: bStats.total || 0, color: "#10b981", icon: <Monitor size={20} />, border: "rgba(16,185,129,0.15)", short: "Navegadores" },
        { label: "Visitas hoy", value: bStats.hoy || 0, color: "#8b5cf6", icon: <Globe size={20} />, border: "rgba(139,92,246,0.15)", short: "Hoy" },
        { label: "Recurrentes", value: bStats.recurrentes || 0, color: "#f59e0b", icon: <ShieldAlert size={20} />, border: "rgba(245,158,11,0.15)", short: "Recurrentes" },
    ];

    const navItems = [
        { path: "/analytics", icon: <BarChart3 size={20} />, label: "Analíticas" },
        { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Panel" },
        { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
        { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
        { type: "dropdown", icon: <Shield size={20} />, label: "Equipos", children: [
            { path: "/teams/primera", label: "Primera División" },
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
        { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
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
            {loading && data && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, #3b82f6, transparent)", zIndex: 9999, animation: "spin 1s linear infinite" }} />
            )}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />

            {/* MAIN */}
            <main className="main-content">
                <header className="top-bar">
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <div className="search-bar"><input type="text" placeholder="Buscar..." /></div>
                </header>

                <div className="content-wrapper">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                        <h1 className="admin-title" style={{ margin: 0 }}>Analíticas de Visitas</h1>
                        <div className="analytics-mode-tabs" style={{ display: "flex", flexWrap: "wrap", gap: "4px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "4px" }}>
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
                    <div className="analytics-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                        {statCards.map((s, i) => (
                            <div key={i} className="analytics-stat-card" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", border: `1px solid ${s.border}`, borderRadius: "14px", padding: "1.2rem 1.3rem", transition: "all 0.3s ease" }}>
                                <div className="asc-icon" style={{ width: 38, height: 38, borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "0.8rem" }}>{s.icon}</div>
                                <div className="asc-value" style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f1f5f9", fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
                                <div className="asc-label asc-label-long" style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.3rem", fontWeight: 500 }}>{s.label}</div>
                                <div className="asc-label asc-label-short" style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.3rem", fontWeight: 500 }}>{s.short}</div>
                            </div>
                        ))}
                    </div>

                    {/* CHARTS */}
                    <div className="analytics-chart-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                        {/* Visitas por hora */}
                        <div className="table-container">
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
                        <div className="table-container">
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

                    {/* BROWSER VISITS CHART */}
                    <div className="analytics-chart-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div className="table-container">
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Navegadores Únicos por Día</h3>
                            {data?.browser_por_dia?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={data.browser_por_dia}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="fecha" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={v => new Date(v).toLocaleDateString("es-SV", { day: "2-digit", month: "short" })} />
                                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                                        <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }} />
                                        <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : <p style={{ color: "#475569", textAlign: "center", padding: "2rem" }}>Sin datos aún</p>}
                        </div>

                        <div className="table-container">
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Resumen de Navegadores</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Total navegadores únicos</span>
                                    <span style={{ color: "#10b981", fontWeight: 900, fontSize: "1.1rem", fontFamily: "monospace" }}>{bStats.total || 0}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Visitas hoy</span>
                                    <span style={{ color: "#8b5cf6", fontWeight: 900, fontSize: "1.1rem", fontFamily: "monospace" }}>{bStats.hoy || 0}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Visitantes recurrentes</span>
                                    <span style={{ color: "#f59e0b", fontWeight: 900, fontSize: "1.1rem", fontFamily: "monospace" }}>{bStats.recurrentes || 0}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
                                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Período seleccionado</span>
                                    <span style={{ color: "#3b82f6", fontWeight: 900, fontSize: "1.1rem", fontFamily: "monospace" }}>{bStats.periodo || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BROWSER VISITS TABLE */}
                    <div className="table-container" style={{ marginBottom: "1.5rem" }}>
                        <div className="table-header">
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Últimas Visitas de Navegador</h3>
                        </div>
                        <div className="desktop-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Token</th>
                                        <th>Navegador</th>
                                        <th style={{ textAlign: "center" }}>Visitas</th>
                                        <th>Última visita</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.browser_recientes?.map((v, i) => (
                                        <tr key={v.id}>
                                            <td className="font-mono">{v.browser_token ? v.browser_token.substring(0, 8) + '...' : '—'}</td>
                                            <td className="truncate" title={v.user_agent || ''}>{(v.user_agent || '').substring(0, 60)}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <span className={`badge-count ${v.visit_count > 1 ? 'multi' : 'single'}`}>{v.visit_count}</span>
                                            </td>
                                            <td>{v.last_visit ? new Date(v.last_visit).toLocaleString("es-SV") : "—"}</td>
                                        </tr>
                                    ))}
                                    {(!data?.browser_recientes || data.browser_recientes.length === 0) && (
                                        <tr><td colSpan={4} className="empty-row">Sin visitas de navegador registradas</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mobile-cards">
                            {data?.browser_recientes?.map(v => (
                                <div key={v.id} className="mobile-card">
                                    <div className="mc-row"><span className="mc-label">Navegador</span><span className="mc-value truncate">{(v.user_agent || '').substring(0, 50)}</span></div>
                                    <div className="mc-row"><span className="mc-label">Token</span><span className="mc-value font-mono">{v.browser_token ? v.browser_token.substring(0, 8) + '...' : '—'}</span></div>
                                    <div className="mc-row"><span className="mc-label">Visitas</span><span className={`badge-count ${v.visit_count > 1 ? 'multi' : 'single'}`}>{v.visit_count}</span></div>
                                    <div className="mc-row"><span className="mc-label">Última visita</span><span className="mc-value">{v.last_visit ? new Date(v.last_visit).toLocaleString("es-SV") : "—"}</span></div>
                                </div>
                            ))}
                            {(!data?.browser_recientes || data.browser_recientes.length === 0) && (
                                <p className="empty-cards">Sin visitas de navegador registradas</p>
                            )}
                        </div>
                    </div>

                    {/* RECENT VISITS TABLE */}
                    <div className="table-container" style={{ marginBottom: "1.5rem" }}>
                        <div className="table-header">
                            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>ltimas 50 Visitas</h3>
                        </div>
                        <div className="desktop-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Visitante</th>
                                        <th>Pgina</th>
                                        <th style={{ textAlign: "center" }}>Bot</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.recientes?.map((v, i) => (
                                        <tr key={v.id}>
                                            <td className="font-mono">{v.ip_hash ? v.ip_hash.substring(0, 12) + '...' : '—'}</td>
                                            <td>{v.pagina}</td>
                                            <td style={{ textAlign: "center" }}>
                                                {v.es_bot == 1 ? <span className="badge-bot">BOT</span> : <span className="dash">—</span>}
                                            </td>
                                            <td>{v.created_at ? new Date(v.created_at).toLocaleString("es-SV") : "—"}</td>
                                        </tr>
                                    ))}
                                    {(!data?.recientes || data.recientes.length === 0) && (
                                        <tr><td colSpan={4} className="empty-row">Sin visitas registradas</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mobile-cards">
                            {data?.recientes?.map(v => (
                                <div key={v.id} className="mobile-card">
                                    <div className="mc-row"><span className="mc-label">Visitante</span><span className="mc-value font-mono">{v.ip_hash ? v.ip_hash.substring(0, 12) + '...' : '—'}</span></div>
                                    <div className="mc-row"><span className="mc-label">Pgina</span><span className="mc-value">{v.pagina}</span></div>
                                    <div className="mc-row"><span className="mc-label">Bot</span>{v.es_bot == 1 ? <span className="badge-bot">BOT</span> : <span className="dash">—</span>}</div>
                                    <div className="mc-row"><span className="mc-label">Fecha</span><span className="mc-value">{v.created_at ? new Date(v.created_at).toLocaleString("es-SV") : "—"}</span></div>
                                </div>
                            ))}
                            {(!data?.recientes || data.recientes.length === 0) && (
                                <p className="empty-cards">Sin visitas registradas</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                button.nav-item { background: none; border: none; color: var(--text-muted); font-family: inherit; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .dash { color: #10b981; font-size: 0.7rem; }
                .font-mono { font-family: monospace; color: #94a3b8; font-size: 0.75rem; }
                .truncate { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #64748b; font-size: 0.75rem; }
                .badge-count { font-size: 0.8rem; font-weight: 700; font-family: monospace; }
                .badge-count.multi { color: #f59e0b; }
                .badge-count.single { color: #10b981; }
                .badge-bot { color: #f59e0b; font-size: 0.7rem; font-weight: 700; background: rgba(245,158,11,0.15); padding: 2px 8px; border-radius: 4px; }
                .empty-row { text-align: center; padding: 2rem !important; color: #475569; }
                .desktop-table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
                .mobile-cards { display: none; }
                .asc-label-short { display: none; }
                @media (max-width: 768px) {
                    .analytics-stat-grid { grid-template-columns: 1fr !important; }
                    .analytics-chart-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 1000px) {
                    .analytics-chart-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 640px) {
                    .desktop-table-wrapper { display: none; }
                    .mobile-cards { display: flex; flex-direction: column; gap: 10px; }
                    .mobile-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 12px 14px; }
                    .mc-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; gap: 8px; }
                    .mc-label { color: #64748b; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; flex-shrink: 0; }
                    .mc-value { color: #e2e8f0; font-size: 0.8rem; font-weight: 500; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                    .empty-cards { text-align: center; color: #475569; padding: 1rem; }
                    .asc-label-long { display: none !important; }
                    .asc-label-short { display: block !important; }
                }
                @media (max-width: 480px) {
                    .analytics-mode-tabs { gap: 2px; padding: 2px; }
                    .analytics-mode-tabs button { padding: 5px 10px !important; font-size: 11px !important; }
                    .analytics-stat-card { padding: 0.9rem 1rem !important; }
                    .analytics-stat-card .asc-icon { width: 30px !important; height: 30px !important; margin-bottom: 0.5rem !important; }
                    .asc-value { font-size: 1.3rem !important; }
                    .analytics-stat-grid { gap: 0.6rem !important; }
                    .analytics-chart-grid { gap: 0.6rem !important; }
                }
                @media (max-width: 375px) {
                    .analytics-mode-tabs button { padding: 4px 7px !important; font-size: 10px !important; }
                    .analytics-stat-card { padding: 0.7rem 0.8rem !important; }
                    .analytics-stat-card .asc-icon { width: 26px !important; height: 26px !important; margin-bottom: 0.4rem !important; }
                    .asc-value { font-size: 1.1rem !important; }
                    .mobile-card { padding: 10px 10px !important; }
                    .mc-label { font-size: 0.65rem !important; }
                    .mc-value { font-size: 0.75rem !important; }
                    .analytics-stat-grid { gap: 0.5rem !important; margin-bottom: 1rem !important; }
                    .analytics-chart-grid { gap: 0.5rem !important; margin-bottom: 1rem !important; }
                    .table-container { margin-bottom: 1rem !important; }
                    .analytics-stat-grid + .table-container { margin-top: 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default Analytics;