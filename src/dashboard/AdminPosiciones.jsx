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
    Trophy,
    RotateCcw,
    TrendingUp,
    TrendingDown,
    Minus,
    ArrowUpDown,
    BarChart3,
    Activity,
} from "lucide-react";

const API_BASE = "http://numeros-y-futbol.test/backend/";

const logoUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
};

const safeFetch = async (url) => {
    const res = await fetch(url);
    const text = await res.text();
    if (text.trim().startsWith("<")) throw new Error("Error del servidor");
    return JSON.parse(text);
};

const AdminPosiciones = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [tabla, setTabla] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(false);
    const location = useLocation();

    const fetchTabla = () => {
        setLoading(true);
        safeFetch(`${API_BASE}get_tabla.php`)
            .then((data) => setTabla(Array.isArray(data) ? data : []))
            .catch(() => {
                Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al cargar", showConfirmButton: false, timer: 2500 });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTabla(); }, []);

    const handleReset = () => {
        Swal.fire({
            title: "¿Reiniciar tabla?",
            html: `<div style="text-align:center;padding:0.5rem 0">
        <div style="width:56px;height:56px;border-radius:50%;background:rgba(239,68,68,0.1);border:2px solid rgba(239,68,68,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </div>
        <p style="color:#cbd5e1;font-size:0.95rem;margin:0 0 0.5rem">Se pondrán todos los valores en <b style="color:#f87171">0</b></p>
        <p style="color:#64748b;font-size:0.82rem;margin:0">Esta acción no se puede deshacer</p>
      </div>`,
            showCancelButton: true,
            confirmButtonText: "Sí, reiniciar todo",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#334155",
            background: "#1e293b",
            color: "#fff",
            showClass: { popup: "animate__animated animate__fadeInDown animate__faster" },
            hideClass: { popup: "animate__animated animate__fadeOutUp animate__faster" },
        }).then((result) => {
            if (result.isConfirmed) {
                setResetting(true);
                fetch(`${API_BASE}reset_tabla.php`)
                    .then((r) => r.json())
                    .then((data) => {
                        if (data.success) {
                            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Tabla reiniciada correctamente", showConfirmButton: false, timer: 2500 });
                            fetchTabla();
                        } else throw new Error();
                    })
                    .catch(() => {
                        Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al reiniciar", showConfirmButton: false, timer: 2500 });
                    })
                    .finally(() => setResetting(false));
            }
        });
    };

    const handleLogout = () => {
        Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", cancelButtonText: "Cancelar", background: "#1e293b", color: "#fff" })
            .then((r) => { if (r.isConfirmed) { localStorage.removeItem("user"); window.location.href = "/login"; } });
    };

    const getDG = (gf, gc) => { const d = gf - gc; return d > 0 ? `+${d}` : `${d}`; };
    const getPosColor = (i) => { return ["#10b981", "#3b82f6", "#f59e0b", "#d97706"][i] || null; };
    const getPosLabel = (i) => { return ["Concacaf", "Clasificación", "Playoff", "Repechaje"][i] || null; };

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

    const totalPJ = tabla.reduce((a, t) => a + parseInt(t.partidos_jugados || 0), 0);
    const totalGF = tabla.reduce((a, t) => a + parseInt(t.goles_favor || 0), 0);
    const totalGC = tabla.reduce((a, t) => a + parseInt(t.goles_contra || 0), 0);
    const maxPts = Math.max(...tabla.map(t => t.puntos || 0), 1);

    return (
        <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo" />
                    </div>
                    <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>{navItems.map((item) => (
                        <li key={item.path}><Link to={item.path} className={`nav-item ${location.pathname === item.path ? "active" : ""}`}>{item.icon} {item.label}</Link></li>
                    ))}</ul>
                </nav>
                <div className="sidebar-footer">
                    <button className="nav-item btn-logout-sidebar" onClick={handleLogout}><LogOut size={20} className="nav-icon" /> Cerrar sesión</button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.9rem" }}>
                        <Trophy size={18} /> Primera División — Temporada 2026
                    </div>
                </header>

                <div className="content-wrapper">
                    {/* Header con degradado */}
                    <div style={{
                        background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(16,185,129,0.05) 100%)",
                        border: "1px solid rgba(59,130,246,0.1)", borderRadius: "16px",
                        padding: "1.8rem 2rem", marginBottom: "1.5rem",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexWrap: "wrap", gap: "1rem",
                    }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
                                <div style={{ width: 42, height: 42, borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}>
                                    <Trophy size={22} color="#fff" />
                                </div>
                                <div>
                                    <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Clasificación General</h1>
                                </div>
                            </div>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", paddingLeft: "3.4rem" }}>
                                Primera División de El Salvador · {tabla.length} equipos participantes
                            </p>
                        </div>
                        <button onClick={handleReset} disabled={resetting} style={{
                            display: "flex", alignItems: "center", gap: "0.6rem",
                            padding: "0.75rem 1.4rem", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.25)",
                            background: resetting ? "#334155" : "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))",
                            color: resetting ? "#64748b" : "#f87171", fontSize: "0.85rem", fontWeight: 600,
                            cursor: resetting ? "not-allowed" : "pointer", transition: "all 0.3s ease",
                        }} onMouseEnter={(e) => { if (!resetting) e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = resetting ? "#334155" : "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))"; }}>
                            <RotateCcw size={16} style={resetting ? { animation: "spin 1s linear infinite" } : {}} />
                            {resetting ? "Reiniciando..." : "Reiniciar Tabla"}
                        </button>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>

                    {/* Stats mejoradas */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                        {[
                            { label: "Equipos", value: tabla.length, color: "#3b82f6", gradient: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.03))", border: "rgba(59,130,246,0.15)", icon: <Shield size={20} /> },
                            { label: "Partidos Jugados", value: totalPJ, color: "#8b5cf6", gradient: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.03))", border: "rgba(139,92,246,0.15)", icon: <BarChart3 size={20} /> },
                            { label: "Goles a Favor", value: totalGF, color: "#10b981", gradient: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))", border: "rgba(16,185,129,0.15)", icon: <Activity size={20} /> },
                            { label: "Goles en Contra", value: totalGC, color: "#ef4444", gradient: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.03))", border: "rgba(239,68,68,0.15)", icon: <TrendingDown size={20} /> },
                        ].map((s) => (
                            <div key={s.label} style={{ background: s.gradient, border: `1px solid ${s.border}`, borderRadius: "14px", padding: "1.2rem 1.3rem", transition: "all 0.3s ease" }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 25px ${s.border}`; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
                                    <div style={{ width: 38, height: 38, borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                                        {s.icon}
                                    </div>
                                </div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f1f5f9", fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.3rem", fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tabla principal */}
                    <div className="table-container" style={{ padding: 0, overflow: "hidden" }}>
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
                                Cargando posiciones...
                            </div>
                        ) : tabla.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
                                <Trophy size={48} style={{ margin: "0 auto 1rem", opacity: 0.15, display: "block" }} />
                                <p style={{ fontSize: "1.05rem", margin: "0 0 0.3rem", color: "#94a3b8" }}>Sin datos de posiciones</p>
                                <p style={{ fontSize: "0.85rem", margin: 0, opacity: 0.5 }}>Agrega equipos desde la sección de Equipos</p>
                            </div>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse", userSelect: "none" }}>
                                <thead>
                                    <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                                        <th style={{ padding: "1rem 0.8rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569", width: 50 }}>Pos</th>
                                        <th style={{ padding: "1rem 0.8rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569" }}>Equipo</th>
                                        <th style={{ padding: "1rem 0.5rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569" }}>PJ</th>
                                        <th style={{ padding: "1rem 0.5rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569" }}>G</th>
                                        <th style={{ padding: "1rem 0.5rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569" }}>E</th>
                                        <th style={{ padding: "1rem 0.5rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569" }}>P</th>
                                        <th style={{ padding: "1rem 0.5rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569" }}>GF</th>
                                        <th style={{ padding: "1rem 0.5rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569" }}>GC</th>
                                        <th style={{ padding: "1rem 0.5rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569" }}>DG</th>
                                        <th style={{ padding: "1rem 0.8rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569", minWidth: 130 }}>Rendimiento</th>
                                        <th style={{ padding: "1rem 1rem", textAlign: "center", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#475569", width: 80 }}>PTS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabla.map((team, index) => {
                                        const dgNum = parseInt(team.goles_favor || 0) - parseInt(team.goles_contra || 0);
                                        const dg = getDG(team.goles_favor || 0, team.goles_contra || 0);
                                        const posColor = getPosColor(index);
                                        const posLabel = getPosLabel(index);
                                        const isBottom = index >= tabla.length - 2 && tabla.length > 4;
                                        const pts = parseInt(team.puntos || 0);
                                        const pj = parseInt(team.partidos_jugados || 0);
                                        const winRate = pj > 0 ? (parseInt(team.ganados || 0) / pj) * 100 : 0;
                                        const drawRate = pj > 0 ? (parseInt(team.empatados || 0) / pj) * 100 : 0;
                                        const lossRate = pj > 0 ? (parseInt(team.perdidos || 0) / pj) * 100 : 0;






                                        return (
                                            <tr key={team.id} style={{
                                                borderBottom: "1px solid rgba(255,255,255,0.03)",
                                                borderLeft: posColor ? `3px solid ${posColor}` : isBottom ? "3px solid rgba(239,68,68,0.4)" : "3px solid transparent",
                                                transition: "all 0.25s ease",
                                                background: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderLeftColor = posColor || isBottom ? "#ef4444" : "rgba(59,130,246,0.4)"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)"; e.currentTarget.style.borderLeftColor = posColor || (isBottom ? "rgba(239,68,68,0.4)" : "transparent"); }}  
                                          >
                                                {/* Posición */}
                                                <td style={{ padding: "0.85rem 0.8rem", textAlign: "center" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15rem" }}>
                                                        {posColor ? (
                                                            <span style={{ width: 28, height: 28, borderRadius: "8px", background: `${posColor}18`, color: posColor, fontSize: "0.78rem", fontWeight: 800, fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${posColor}25` }}>
                                                                {index + 1}
                                                            </span>
                                                        ) : (
                                                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: isBottom ? "#ef4444" : "#475569", fontFamily: "monospace" }}>{index + 1}</span>
                                                        )}
                                                        {posLabel && <span style={{ fontSize: "0.55rem", color: posColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>{posLabel}</span>}
                                                    </div>
                                                </td>

                                                {/* Equipo */}
                                                <td style={{ padding: "0.85rem 0.8rem" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(255,255,255,0.05)", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.05)" }}>
                                                            <img src={logoUrl(team.logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                                        </div>
                                                        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap" }}>{team.nombre}</span>
                                                    </div>
                                                </td>

                                                {/* PJ */}
                                                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center", fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>{pj}</td>

                                                {/* G */}
                                                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 24, borderRadius: "6px", background: team.ganados > 0 ? "rgba(16,185,129,0.1)" : "transparent", fontSize: "0.85rem", fontWeight: 700, color: team.ganados > 0 ? "#10b981" : "#475569" }}>{team.ganados}</span>
                                                </td>

                                                {/* E */}
                                                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 24, borderRadius: "6px", background: team.empatados > 0 ? "rgba(245,158,11,0.1)" : "transparent", fontSize: "0.85rem", fontWeight: 700, color: team.empatados > 0 ? "#f59e0b" : "#475569" }}>{team.empatados}</span>
                                                </td>

                                                {/* P */}
                                                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 24, borderRadius: "6px", background: team.perdidos > 0 ? "rgba(239,68,68,0.1)" : "transparent", fontSize: "0.85rem", fontWeight: 700, color: team.perdidos > 0 ? "#ef4444" : "#475569" }}>{team.perdidos}</span>
                                                </td>

                                                {/* GF */}
                                                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center", fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>{team.goles_favor}</td>

                                                {/* GC */}
                                                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center", fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>{team.goles_contra}</td>

                                                {/* DG */}
                                                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem", fontSize: "0.8rem", fontWeight: 700, color: dgNum > 0 ? "#10b981" : dgNum < 0 ? "#ef4444" : "#475569" }}>
                                                        {dgNum > 0 ? <TrendingUp size={12} /> : dgNum < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                                                        {dg}
                                                    </span>
                                                </td>

                                                {/* Barra de rendimiento */}
                                                <td style={{ padding: "0.85rem 0.8rem" }}>
                                                    {pj > 0 ? (
                                                        <div style={{ display: "flex", height: 6, borderRadius: "3px", overflow: "hidden", gap: "1px", background: "rgba(255,255,255,0.03)" }}>
                                                            <div style={{ width: `${winRate}%`, background: "#10b981", borderRadius: "3px", transition: "width 0.5s ease", minWidth: winRate > 0 ? "3px" : 0 }} title={`Ganados: ${winRate.toFixed(0)}%`} />
                                                            <div style={{ width: `${drawRate}%`, background: "#f59e0b", borderRadius: "3px", transition: "width 0.5s ease", minWidth: drawRate > 0 ? "3px" : 0 }} title={`Empatados: ${drawRate.toFixed(0)}%`} />
                                                            <div style={{ width: `${lossRate}%`, background: "#ef4444", borderRadius: "3px", transition: "width 0.5s ease", minWidth: lossRate > 0 ? "3px" : 0 }} title={`Perdidos: ${lossRate.toFixed(0)}%`} />
                                                        </div>
                                                    ) : (
                                                        <div style={{ height: 6, borderRadius: "3px", background: "rgba(255,255,255,0.03)" }} />
                                                    )}
                                                </td>

                                                {/* PTS */}
                                                <td style={{ padding: "0.85rem 1rem", textAlign: "center" }}>
                                                    <span style={{
                                                        fontSize: "1.1rem", fontWeight: 900, fontFamily: "monospace",
                                                        color: pts > 0 ? "#f1f5f9" : "#475569",
                                                        textShadow: pts > 0 ? `0 0 15px ${posColor || "#3b82f6"}40` : "none",
                                                    }}>{pts}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {/* Footer de tabla */}
                        {tabla.length > 0 && (
                            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                                <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
                                    {[
                                        { color: "#10b981", label: "Concacaf" },
                                        { color: "#3b82f6", label: "Clasificación" },
                                        { color: "#f59e0b", label: "Playoff" },
                                        { color: "#d97706", label: "Repechaje" },
                                        { color: "#ef4444", label: "Descenso" },
                                    ].map((item) => (
                                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <span style={{ width: 8, height: 8, borderRadius: "2px", background: item.color, flexShrink: 0 }} />
                                            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.72rem", color: "#475569" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                        <span style={{ width: 10, height: 3, borderRadius: "1px", background: "#10b981" }} /> G
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                        <span style={{ width: 10, height: 3, borderRadius: "1px", background: "#f59e0b" }} /> E
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                        <span style={{ width: 10, height: 3, borderRadius: "1px", background: "#ef4444" }} /> P
                                    </div>
                                    <span style={{ color: "#334155" }}>|</span>
                                    <span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short" })}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPosiciones;