import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import "animate.css";

import {
    LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings,
    LogOut, Menu, Trophy, RotateCcw, TrendingUp, TrendingDown, Minus,
    BarChart3, Activity, ChevronDown,
} from "lucide-react";

const API_BASE = "http://numeros-y-futbol.test/backend/";

const DIVISIONES = [
    { value: "primera", label: "Primera" },
    { value: "segunda", label: "Segunda" },
    { value: "tercera", label: "Tercera" },
];

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

const normalizeRow = (row, div) => {
    if (div === "primera") {
        const gf = parseInt(row.goles_favor || 0);
        const gc = parseInt(row.goles_contra || 0);
        return {
            id: row.id, nombre: row.nombre, logo: row.logo, grupo: null,
            pj: parseInt(row.partidos_jugados || 0), pg: parseInt(row.ganados || 0),
            pe: parseInt(row.empatados || 0), pp: parseInt(row.perdidos || 0),
            gf, gc, dg: gf - gc, pts: parseInt(row.puntos || 0),
        };
    }
    return {
        id: row.id, nombre: row.nombre, logo: row.logo, grupo: row.grupo || null,
        pj: parseInt(row.pj || 0), pg: parseInt(row.pg || 0), pe: parseInt(row.pe || 0),
        pp: parseInt(row.pp || 0), gf: parseInt(row.gf || 0), gc: parseInt(row.gc || 0),
        dg: parseInt(row.dg || 0), pts: parseInt(row.pts || 0),
    };
};

const AdminPosiciones = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teamsOpen, setTeamsOpen] = useState(false);
    const [division, setDivision] = useState("primera");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filterGrupo, setFilterGrupo] = useState("todos");
    const dropdownRef = useRef(null);
    const [tabla, setTabla] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(false);
    const location = useLocation();

    useEffect(() => { if (location.pathname.startsWith("/teams/")) setTeamsOpen(true); }, [location.pathname]);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const getEndpoints = () => {
        const s = division === "segunda" ? "_segunda" : division === "tercera" ? "_tercera" : "";
        return { get: `${API_BASE}get_tabla${s}.php`, reset: `${API_BASE}reset_tabla${s}.php` };
    };

    const fetchTabla = () => {
        setLoading(true);
        setFilterGrupo("todos");
        safeFetch(getEndpoints().get)
            .then((data) => {
                const arr = (Array.isArray(data) ? data : []).map(r => normalizeRow(r, division));
                if (division === "segunda") {
                    arr.sort((a, b) => {
                        const ga = (a.grupo || "").toLowerCase();
                        const gb = (b.grupo || "").toLowerCase();
                        if (ga !== gb) return ga === "east" ? -1 : 1;
                        if (b.pts !== a.pts) return b.pts - a.pts;
                        if (b.dg !== a.dg) return b.dg - a.dg;
                        return b.gf - a.gf;
                    });
                } else {
                    arr.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
                }
                setTabla(arr);
            })
            .catch(() => {
                Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al cargar", showConfirmButton: false, timer: 2500 });
                setTabla([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchTabla(); }, [division]);

        const handleReset = () => {
        const div = DIVISIONES.find(d => d.value === division);
        const ep = getEndpoints().reset;
        const fileName = ep.split("/").pop();

        Swal.fire({
            title: `¿Reiniciar ${div.label}?`,
            html: `<div style="text-align:center;padding:0.5rem 0">
                <div style="width:56px;height:56px;border-radius:50%;background:rgba(239,68,68,0.1);border:2px solid rgba(239,68,68,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </div>
                <p style="color:#cbd5e1;font-size:0.95rem;margin:0 0 0.5rem">Se pondrán todos los valores en <b style="color:#f87171">0</b></p>
                <p style="color:#64748b;font-size:0.82rem;margin:0">Esta acción no se puede deshacer</p>
            </div>`,
            showCancelButton: true, confirmButtonText: "Sí, reiniciar", cancelButtonText: "Cancelar",
            confirmButtonColor: "#ef4444", cancelButtonColor: "#334155",
            background: "#1e293b", color: "#fff",
            showClass: { popup: "animate__animated animate__fadeInDown animate__faster" },
            hideClass: { popup: "animate__animated animate__fadeOutUp animate__faster" },
        }).then((result) => {
            if (!result.isConfirmed) return;

            setResetting(true);

            fetch(ep)
                .then(async (res) => {
                    const text = await res.text();
                    if (text.trim().startsWith("<")) {
                        throw new Error("PHP_MISSING");
                    }
                    return JSON.parse(text);
                })
                .then((data) => {
                    if (data.success) {
                        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Tabla reiniciada", showConfirmButton: false, timer: 2500 });
                        fetchTabla();
                    } else {
                        throw new Error(data.error || "Respuesta inválida");
                    }
                })
                .catch((err) => {
                    if (err.message === "PHP_MISSING") {
                        Swal.fire({
                            icon: "warning", title: "Archivo no encontrado",
                            html: `<p style="color:#94a3b8;font-size:13px;margin:0 0 6px">No se encontró <strong style="color:#fbbf24">${fileName}</strong> en el backend.</p><p style="color:#64748b;font-size:12px;margin:0">Crea el archivo para que el reinicio funcione.</p>`,
                            confirmButtonColor: "#334155", background: "#0f172a", color: "#e2e8f0",
                        });
                    } else {
                        Swal.fire({ toast: true, position: "top-end", icon: "error", title: `Error: ${err.message || "no se pudo reiniciar"}`, showConfirmButton: false, timer: 3500 });
                    }
                })
                .finally(() => setResetting(false));
        });
    };

    const handleLogout = () => {
        Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", cancelButtonText: "Cancelar", background: "#1e293b", color: "#fff" })
            .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); window.location.href = "/login"; } });
    };

    const isSegunda = division === "segunda";
    const filteredTabla = isSegunda
        ? tabla.filter(t => filterGrupo === "todos" || (t.grupo || "").toLowerCase() === filterGrupo)
        : tabla;

    const totalPJ = filteredTabla.reduce((a, t) => a + t.pj, 0);
    const totalGF = filteredTabla.reduce((a, t) => a + t.gf, 0);
    const totalGC = filteredTabla.reduce((a, t) => a + t.gc, 0);
    const totalEast = tabla.filter(t => (t.grupo || "").toLowerCase() === "east").length;
    const totalWest = tabla.filter(t => (t.grupo || "").toLowerCase() === "west").length;

    const getDisplayRows = () => {
        if (!isSegunda || filterGrupo !== "todos") {
            return filteredTabla.map((t, i) => ({ ...t, displayPos: i + 1, isGroupHeader: false }));
        }
        const rows = [];
        const east = filteredTabla.filter(t => (t.grupo || "").toLowerCase() === "east");
        const west = filteredTabla.filter(t => (t.grupo || "").toLowerCase() === "west");
        if (east.length > 0) {
            rows.push({ isGroupHeader: true, label: "Grupo Este", color: "#3b82f6", borderColor: "rgba(59,130,246,0.12)", count: east.length });
            east.forEach((t, i) => rows.push({ ...t, displayPos: i + 1, isGroupHeader: false }));
        }
        if (west.length > 0) {
            rows.push({ isGroupHeader: true, label: "Grupo Oeste", color: "#f97316", borderColor: "rgba(249,115,22,0.12)", count: west.length });
            west.forEach((t, i) => rows.push({ ...t, displayPos: i + 1, isGroupHeader: false }));
        }
        return rows;
    };

    const displayRows = getDisplayRows();

    const getPosColor = (i) => isSegunda ? null : ["#10b981", "#3b82f6", "#f59e0b", "#d97706"][i] || null;
    const getPosLabel = (i) => isSegunda ? null : ["Concacaf", "Clasificación", "Playoff", "Repechaje"][i] || null;
    const getDG = (dg) => dg > 0 ? `+${dg}` : `${dg}`;

    const GrupoBadge = ({ grupo }) => {
        if (!grupo) return null;
        const isEast = grupo.toLowerCase() === "east";
        return (
            <span style={{
                display: "inline-flex", alignItems: "center", gap: "3px", padding: "1px 6px",
                borderRadius: "4px", fontSize: "9px", fontWeight: 800,
                background: isEast ? "rgba(59,130,246,0.12)" : "rgba(249,115,22,0.12)",
                color: isEast ? "#60a5fa" : "#fb923c",
                border: `1px solid ${isEast ? "rgba(59,130,246,0.2)" : "rgba(249,115,22,0.2)"}`,
                marginLeft: "6px", flexShrink: 0,
            }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: isEast ? "#3b82f6" : "#f97316" }} />
                {isEast ? "Este" : "Oeste"}
            </span>
        );
    };

    const currentDiv = DIVISIONES.find(d => d.value === division);

    const statCards = [
        { label: "Equipos", value: filteredTabla.length, color: "#3b82f6", gradient: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.03))", border: "rgba(59,130,246,0.15)", icon: <Shield size={20} /> },
        ...(isSegunda ? [
            { label: "Grupo Este", value: totalEast, color: "#3b82f6", gradient: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.03))", border: "rgba(59,130,246,0.15)", icon: <span style={{ fontSize: "14px", fontWeight: 800, color: "#3b82f6" }}>E</span> },
            { label: "Grupo Oeste", value: totalWest, color: "#f97316", gradient: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.03))", border: "rgba(249,115,22,0.15)", icon: <span style={{ fontSize: "14px", fontWeight: 800, color: "#f97316" }}>O</span> },
        ] : []),
        { label: "Partidos Jugados", value: totalPJ, color: "#8b5cf6", gradient: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.03))", border: "rgba(139,92,246,0.15)", icon: <BarChart3 size={20} /> },
        { label: "Goles a Favor", value: totalGF, color: "#10b981", gradient: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))", border: "rgba(16,185,129,0.15)", icon: <Activity size={20} /> },
        { label: "Goles en Contra", value: totalGC, color: "#ef4444", gradient: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.03))", border: "rgba(239,68,68,0.15)", icon: <TrendingDown size={20} /> },
    ];

    const navItems = [
        { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
        { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
        { type: "dropdown", icon: <Shield size={20} />, label: "Equipos", children: [{ path: "/teams/primera", label: "Primera División" }, { path: "/teams/segunda", label: "Segunda División" }, { path: "/teams/tercera", label: "Tercera División" }] },
        { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
        { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
        { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
        { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
    ];

    const renderTeamRow = (team, pos) => {
        const posColor = getPosColor(pos - 1);
        const posLabel = getPosLabel(pos - 1);
        const isBottom = !isSegunda && pos >= tabla.length - 2 && tabla.length > 4;
        const winRate = team.pj > 0 ? (team.pg / team.pj) * 100 : 0;
        const drawRate = team.pj > 0 ? (team.pe / team.pj) * 100 : 0;
        const lossRate = team.pj > 0 ? (team.pp / team.pj) * 100 : 0;

        return (
            <tr key={team.id} style={{
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                borderLeft: posColor ? `3px solid ${posColor}` : isBottom ? "3px solid rgba(239,68,68,0.4)" : "3px solid transparent",
                transition: "all 0.25s ease",
                background: pos % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
            }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = pos % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)"; }}
            >
                <td style={{ padding: "0.85rem 0.8rem", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15rem" }}>
                        {posColor ? (
                            <span style={{ width: 28, height: 28, borderRadius: "8px", background: `${posColor}18`, color: posColor, fontSize: "0.78rem", fontWeight: 800, fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${posColor}25` }}>{pos}</span>
                        ) : (
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: isBottom ? "#ef4444" : "#475569", fontFamily: "monospace" }}>{pos}</span>
                        )}
                        {posLabel && <span style={{ fontSize: "0.55rem", color: posColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>{posLabel}</span>}
                    </div>
                </td>
                <td style={{ padding: "0.85rem 0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(255,255,255,0.05)", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.05)" }}>
                            <img src={logoUrl(team.logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap" }}>{team.nombre}</span>
                            <GrupoBadge grupo={team.grupo} />
                        </div>
                    </div>
                </td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center", fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>{team.pj}</td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 24, borderRadius: "6px", background: team.pg > 0 ? "rgba(16,185,129,0.1)" : "transparent", fontSize: "0.85rem", fontWeight: 700, color: team.pg > 0 ? "#10b981" : "#475569" }}>{team.pg}</span>
                </td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 24, borderRadius: "6px", background: team.pe > 0 ? "rgba(245,158,11,0.1)" : "transparent", fontSize: "0.85rem", fontWeight: 700, color: team.pe > 0 ? "#f59e0b" : "#475569" }}>{team.pe}</span>
                </td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 24, borderRadius: "6px", background: team.pp > 0 ? "rgba(239,68,68,0.1)" : "transparent", fontSize: "0.85rem", fontWeight: 700, color: team.pp > 0 ? "#ef4444" : "#475569" }}>{team.pp}</span>
                </td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center", fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>{team.gf}</td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center", fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>{team.gc}</td>
                <td style={{ padding: "0.85rem 0.5rem", textAlign: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem", fontSize: "0.8rem", fontWeight: 700, color: team.dg > 0 ? "#10b981" : team.dg < 0 ? "#ef4444" : "#475569" }}>
                        {team.dg > 0 ? <TrendingUp size={12} /> : team.dg < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                        {getDG(team.dg)}
                    </span>
                </td>
                <td style={{ padding: "0.85rem 0.8rem" }}>
                    {team.pj > 0 ? (
                        <div style={{ display: "flex", height: 6, borderRadius: "3px", overflow: "hidden", gap: "1px", background: "rgba(255,255,255,0.03)" }}>
                            <div style={{ width: `${winRate}%`, background: "#10b981", borderRadius: "3px", transition: "width 0.5s ease", minWidth: winRate > 0 ? "3px" : 0 }} title={`Ganados: ${winRate.toFixed(0)}%`} />
                            <div style={{ width: `${drawRate}%`, background: "#f59e0b", borderRadius: "3px", transition: "width 0.5s ease", minWidth: drawRate > 0 ? "3px" : 0 }} title={`Empatados: ${drawRate.toFixed(0)}%`} />
                            <div style={{ width: `${lossRate}%`, background: "#ef4444", borderRadius: "3px", transition: "width 0.5s ease", minWidth: lossRate > 0 ? "3px" : 0 }} title={`Perdidos: ${lossRate.toFixed(0)}%`} />
                        </div>
                    ) : (
                        <div style={{ height: 6, borderRadius: "3px", background: "rgba(255,255,255,0.03)" }} />
                    )}
                </td>
                <td style={{ padding: "0.85rem 1rem", textAlign: "center" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, fontFamily: "monospace", color: team.pts > 0 ? "#f1f5f9" : "#475569" }}>{team.pts}</span>
                </td>
            </tr>
        );
    };

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
                    <ul>
                        {navItems.map((item, idx) => {
                            if (item.type === "dropdown") {
                                return (
                                    <li key={idx}>
                                        <button className="nav-item" onClick={() => setTeamsOpen(!teamsOpen)} style={{ width: "100%", justifyContent: "space-between" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>{item.icon} {item.label}</span>
                                            <ChevronDown size={16} style={{ transition: "transform 0.25s ease", transform: teamsOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.4 }} />
                                        </button>
                                        <ul style={{ maxHeight: teamsOpen ? "200px" : "0", opacity: teamsOpen ? "1" : "0", overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease", listStyle: "none", padding: teamsOpen ? "2px 0 4px 0" : "0", margin: 0 }}>
                                            {item.children.map(child => (
                                                <li key={child.path}><Link to={child.path} className={`nav-item${location.pathname === child.path ? " active" : ""}`} style={{ paddingLeft: "48px", fontSize: "13.5px" }}>{child.label}</Link></li>
                                            ))}
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
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.9rem" }}>
                        <Trophy size={18} /> {currentDiv?.label} División — Temporada 2026
                    </div>
                </header>

                <div className="content-wrapper">
                    <div style={{
                        background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(16,185,129,0.05) 100%)",
                        border: "1px solid rgba(59,130,246,0.1)", borderRadius: "16px",
                        padding: "1.8rem 2rem", marginBottom: "1.5rem",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexWrap: "wrap", gap: "1rem",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}>
                                <Trophy size={22} color="#fff" />
                            </div>
                            <div>
                                <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Clasificación General</h1>
                                <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                                    {currentDiv?.label} División de El Salvador · {tabla.length} equipos
                                </p>
                            </div>
                            <div ref={dropdownRef} style={{ position: "relative" }}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px" }}
                                    onMouseEnter={(e) => { if (!dropdownOpen) { e.currentTarget.style.background = "rgba(59,130,246,0.18)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)"; } }}
                                    onMouseLeave={(e) => { if (!dropdownOpen) { e.currentTarget.style.background = "rgba(59,130,246,0.1)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)"; } }}
                                >
                                    <Trophy size={14} />{currentDiv?.label}
                                    <ChevronDown size={15} style={{ transition: "transform 0.25s ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.7 }} />
                                </button>
                                {dropdownOpen && (
                                    <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100, background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden", minWidth: "190px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", animation: "ddFadeIn 0.15s ease-out" }}>
                                        {DIVISIONES.map((d) => (
                                            <button key={d.value} onClick={() => { setDivision(d.value); setDropdownOpen(false); }}
                                                style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 18px", border: "none", background: division === d.value ? "rgba(59,130,246,0.15)" : "transparent", color: division === d.value ? "#60a5fa" : "#94a3b8", fontSize: "13px", fontWeight: division === d.value ? 700 : 500, cursor: "pointer", transition: "background 0.12s", textAlign: "left" }}
                                                onMouseEnter={(e) => { if (division !== d.value) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                                                onMouseLeave={(e) => { if (division !== d.value) e.currentTarget.style.background = "transparent"; }}
                                            >
                                                <Trophy size={13} style={{ opacity: division === d.value ? 1 : 0.4 }} />{d.label} División
                                                {division === d.value && <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button onClick={handleReset} disabled={resetting} style={{
                            display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1.4rem", borderRadius: "12px",
                            border: "1px solid rgba(239,68,68,0.25)", background: resetting ? "#334155" : "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))",
                            color: resetting ? "#64748b" : "#f87171", fontSize: "0.85rem", fontWeight: 600, cursor: resetting ? "not-allowed" : "pointer", transition: "all 0.3s ease",
                        }}
                            onMouseEnter={(e) => { if (!resetting) e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = resetting ? "#334155" : "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))"; }}>
                            <RotateCcw size={16} style={resetting ? { animation: "spin 1s linear infinite" } : {}} />
                            {resetting ? "Reiniciando..." : "Reiniciar Tabla"}
                        </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${statCards.length}, 1fr)`, gap: "1rem", marginBottom: "1.5rem" }}>
                        {statCards.map((s) => (
                            <div key={s.label} style={{ background: s.gradient, border: `1px solid ${s.border}`, borderRadius: "14px", padding: "1.2rem 1.3rem", transition: "all 0.3s ease" }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 25px ${s.border}`; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                                <div style={{ width: 38, height: 38, borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: "0.8rem" }}>{s.icon}</div>
                                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f1f5f9", fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.3rem", fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="table-container" style={{ padding: 0, overflow: "hidden" }}>
                        {isSegunda && (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginRight: "4px" }}>Filtrar:</span>
                                {[
                                    { key: "todos", label: "Todos", color: "#94a3b8" },
                                    { key: "east", label: "Este", color: "#60a5fa" },
                                    { key: "west", label: "Oeste", color: "#fb923c" },
                                ].map(f => (
                                    <button key={f.key} onClick={() => setFilterGrupo(f.key)} style={{
                                        padding: "6px 14px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 700,
                                        cursor: "pointer", transition: "all 0.2s",
                                        background: filterGrupo === f.key
                                            ? f.key === "todos" ? "rgba(255,255,255,0.08)" : f.key === "east" ? "rgba(59,130,246,0.15)" : "rgba(249,115,22,0.15)"
                                            : "transparent",
                                        color: filterGrupo === f.key ? f.color : "#475569",
                                    }}>
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(59,130,246,0.2)", borderTopColor: "#3b82f6", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
                                Cargando posiciones...
                            </div>
                        ) : displayRows.length === 0 ? (
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
                                    {displayRows.map((row) => {
                                        if (row.isGroupHeader) {
                                            return (
                                                <tr key={`gh-${row.label}`}>
                                                    <td colSpan="11" style={{
                                                        padding: "10px 1rem",
                                                        background: row.borderColor,
                                                        borderBottom: `1px solid ${row.borderColor}`,
                                                    }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: row.color, boxShadow: `0 0 6px ${row.color}40` }} />
                                                            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: row.color, textTransform: "uppercase", letterSpacing: "1px" }}>{row.label}</span>
                                                            <span style={{ fontSize: "0.68rem", color: "#475569", fontWeight: 500 }}>{row.count} equipos</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        return renderTeamRow(row, row.displayPos);
                                    })}
                                </tbody>
                            </table>
                        )}

                        {tabla.length > 0 && (
                            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                                <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
                                    {(isSegunda
                                        ? [
                                            { color: "#3b82f6", label: "Grupo Este" },
                                            { color: "#f97316", label: "Grupo Oeste" },
                                          ]
                                        : [
                                            { color: "#10b981", label: "Concacaf" },
                                            { color: "#3b82f6", label: "Clasificación" },
                                            { color: "#f59e0b", label: "Playoff" },
                                            { color: "#d97706", label: "Repechaje" },
                                            { color: "#ef4444", label: "Descenso" },
                                          ]
                                    ).map((item) => (
                                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <span style={{ width: 8, height: 8, borderRadius: "2px", background: item.color, flexShrink: 0 }} />
                                            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.72rem", color: "#475569" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><span style={{ width: 10, height: 3, borderRadius: "1px", background: "#10b981" }} /> G</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><span style={{ width: 10, height: 3, borderRadius: "1px", background: "#f59e0b" }} /> E</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><span style={{ width: 10, height: 3, borderRadius: "1px", background: "#ef4444" }} /> P</div>
                                    <span style={{ color: "#334155" }}>|</span>
                                    <span>Actualizado: {new Date().toLocaleDateString("es-SV", { day: "numeric", month: "short" })}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes ddFadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                button.nav-item { background: none; border: none; color: var(--text-muted); font-family: inherit; }
                @media (max-width: 900px) {
                    div[style*="grid-template-columns"] { grid-template-columns: repeat(3, 1fr) !important; }
                }
                @media (max-width: 640px) {
                    div[style*="grid-template-columns"] { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminPosiciones;