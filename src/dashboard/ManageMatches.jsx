import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import "animate.css";
import {
    LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
    Plus, Trash2, Trophy, X, Minus, ChevronUp, Swords, CheckCircle2, RotateCcw,
    Search, ChevronDown, Filter, Star, StarOff,
} from "lucide-react";

const API = "http://localhost/Numeros-y-Futbol/backend/";

const DIVISIONES = [
    { value: "primera", label: "Primera" },
    { value: "segunda", label: "Segunda" },
    { value: "tercera", label: "Tercera" },
];

const ManageMatches = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teamsOpen, setTeamsOpen] = useState(false);
    const location = useLocation();
    const [division, setDivision] = useState(() => localStorage.getItem("admin_division") || "primera");
    useEffect(() => { localStorage.setItem("admin_division", division); }, [division]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamMap, setTeamMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchMatch, setSearchMatch] = useState("");
    const [showNewMatch, setShowNewMatch] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [newLocal, setNewLocal] = useState("");
    const [newVisitante, setNewVisitante] = useState("");
    const [searchLocal, setSearchLocal] = useState("");
    const [searchVisitante, setSearchVisitante] = useState("");
    const [openSelectLocal, setOpenSelectLocal] = useState(false);
    const [openSelectVisitante, setOpenSelectVisitante] = useState(false);
    const localRef = useRef(null);
    const visitanteRef = useRef(null);
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);

    useEffect(() => { if (location.pathname.startsWith("/teams/")) setTeamsOpen(true); }, [location.pathname]);
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
            if (localRef.current && !localRef.current.contains(e.target)) setOpenSelectLocal(false);
            if (visitanteRef.current && !visitanteRef.current.contains(e.target)) setOpenSelectVisitante(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const getEndpoints = () => {
        const suffix = division === "segunda" ? "_segunda" : division === "tercera" ? "_tercera" : "";
        return {
            matches: `${API}get_matches${suffix}.php`,
            teams: `${API}get_teams${suffix}.php`,
            create: `${API}create_match${suffix}.php`,
            update: `${API}update_match${suffix}.php`,
            delete: `${API}delete_match${suffix}.php`,
            toggleFeatured: `${API}toggle_featured${suffix}.php`,
        };
    };

    const loadMatches = () => {
        const ep = getEndpoints();
        setLoading(true); setMatches([]); setTeams([]); setTeamMap({});
        fetch(ep.matches).then(r => r.json()).then(d => setMatches(Array.isArray(d) ? d : [])).catch(() => setMatches([]));
        fetch(ep.teams).then(r => r.json()).then(d => {
            const arr = Array.isArray(d) ? d : []; setTeams(arr);
            const map = {}; arr.forEach(t => { map[t.id] = t; map[t.nombre] = t; }); setTeamMap(map);
        }).catch(() => setTeams([])).finally(() => setLoading(false));
    };

    useEffect(() => { loadMatches(); }, [division]);

    const getEscudo = (idOrName) => { const t = teamMap[idOrName]; return t?.logo ? `${API}${t.logo}` : null; };
    const fallbackImg = "https://ui-avatars.com/api/?name=EQ&background=0f172a&color=334155&size=40&bold=true";
    const fallbackSelect = "https://ui-avatars.com/api/?name=EQ&background=1e293b&color=475569&size=36&bold=true";
    const safeJson = async (res) => { const text = await res.text(); if (text.trim().startsWith("<")) throw new Error("Error del servidor (PHP)."); return JSON.parse(text); };

    const handleLogout = () => {
        Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", confirmButtonColor: "#d33" })
            .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); window.location.href = "/login"; } });
    };

    const getActiveGrupo = () => {
        if (division !== "segunda") return null;
        if (newLocal) { const t = teamMap[newLocal]; if (t?.grupo) return t.grupo; }
        if (newVisitante) { const t = teamMap[newVisitante]; if (t?.grupo) return t.grupo; }
        return null;
    };
    const activeGrupo = getActiveGrupo();

    const openNewMatch = () => { setNewLocal(""); setNewVisitante(""); setSearchLocal(""); setSearchVisitante(""); setOpenSelectLocal(false); setOpenSelectVisitante(false); setShowNewMatch(true); };

    const handleSelectLocal = (id) => {
        setNewLocal(id);
        if (division === "segunda" && newVisitante) {
            const lt = teamMap[id]; const vt = teamMap[newVisitante];
            if (lt?.grupo && vt?.grupo && lt.grupo.toLowerCase() !== vt.grupo.toLowerCase()) setNewVisitante("");
        }
    };
    const handleSelectVisitante = (id) => {
        setNewVisitante(id);
        if (division === "segunda" && newLocal) {
            const lt = teamMap[newLocal]; const vt = teamMap[id];
            if (lt?.grupo && vt?.grupo && lt.grupo.toLowerCase() !== vt.grupo.toLowerCase()) setNewLocal("");
        }
    };

    const createMatch = () => {
        if (!newLocal || !newVisitante) { Swal.fire({ icon: "info", title: "Completa ambos equipos", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
        if (newLocal === newVisitante) { Swal.fire({ icon: "info", title: "No pueden ser el mismo equipo", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
        setSubmitting(true);
        const form = new FormData(); form.append("local", newLocal); form.append("visitante", newVisitante);
        fetch(getEndpoints().create, { method: "POST", body: form }).then(safeJson).then(data => {
            setSubmitting(false);
            if (data.error) { Swal.fire("Error", data.error, "error"); return; }
            setShowNewMatch(false);
            Swal.fire({ icon: "success", title: "Partido creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(() => loadMatches());
        }).catch(() => { setSubmitting(false); Swal.fire("Error", "No se pudo crear el partido.", "error"); });
    };

    const openResult = (match) => {
        setSelectedMatch(match);
        if (match.score && match.score !== "-") { const p = String(match.score).split(" - "); setGolesLocal(parseInt(p[0]) || 0); setGolesVisitante(parseInt(p[1]) || 0); }
        else { setGolesLocal(0); setGolesVisitante(0); }
        setShowResult(true);
    };

    const saveResult = () => {
        setSubmitting(true);
        const form = new FormData(); form.append("match_id", selectedMatch.id); form.append("goles_local", golesLocal); form.append("goles_visitante", golesVisitante);
        fetch(getEndpoints().update, { method: "POST", body: form }).then(safeJson).then(data => {
            setSubmitting(false);
            if (data.error) { Swal.fire("Error", data.error, "error"); return; }
            setShowResult(false);
            Swal.fire({ icon: "success", title: "Resultado guardado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(() => loadMatches());
        }).catch(() => { setSubmitting(false); Swal.fire("Error", "No se pudo guardar.", "error"); });
    };

    const deleteMatch = (id) => {
        Swal.fire({ title: "¿Eliminar partido?", text: "Esto no se puede deshacer", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33" })
            .then(result => {
                if (result.isConfirmed) {
                    const form = new FormData(); form.append("id", id);
                    fetch(getEndpoints().delete, { method: "POST", body: form }).then(safeJson).then(data => {
                        if (data.error) { Swal.fire("Error", data.error, "error"); return; }
                        Swal.fire({ icon: "success", title: "Eliminado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(() => loadMatches());
                    }).catch(() => Swal.fire("Error", "No se pudo eliminar.", "error"));
                }
            });
    };

    const toggleFeatured = (match) => {
        const isFeatured = match.featured == 1 || match.destacado == 1;
        const matchId = String(match.id);
        const currentDiv = DIVISIONES.find(d => d.value === division);
        Swal.fire({
            title: isFeatured ? "¿Quitar destacado?" : "Marcar como destacado",
            html: `<p style="color:#94a3b8;font-size:14px;margin:0">${match.local_nombre} vs ${match.visitante_nombre}</p><p style="color:#64748b;font-size:12px;margin:4px 0 0">${isFeatured ? "Dejará de aparecer como destacado" : "Será el partido destacado en " + (currentDiv?.label || "") + " División"}</p>`,
            icon: isFeatured ? "question" : "warning", showCancelButton: true,
            confirmButtonText: isFeatured ? "Sí, quitar" : "Sí, destacar", cancelButtonText: "Cancelar",
            confirmButtonColor: isFeatured ? "#ef4444" : "#e2b340", background: "#0b1120", color: "#f1f5f9"
        }).then(result => {
            if (!result.isConfirmed) return;
            setSubmitting(true);
            setMatches(prev => prev.map(m => {
                if (!isFeatured) return String(m.id) === matchId ? { ...m, featured: 1, destacado: 1 } : { ...m, featured: 0, destacado: 0 };
                else return String(m.id) === matchId ? { ...m, featured: 0, destacado: 0 } : m;
            }));
            setSubmitting(false);
            const form = new FormData(); form.append("match_id", match.id); form.append("featured", isFeatured ? "0" : "1");
            fetch(getEndpoints().toggleFeatured, { method: "POST", body: form })
                .then(async res => { const text = await res.text(); if (text.trim().startsWith("<")) throw new Error("PHP_MISSING"); return JSON.parse(text); })
                .then(data => {
                    if (data.error) { setMatches(prev => prev.map(m => String(m.id) === matchId ? { ...m, featured: isFeatured ? 1 : 0, destacado: isFeatured ? 1 : 0 } : m)); Swal.fire("Error", data.error, "error"); }
                    else { Swal.fire({ icon: "success", title: isFeatured ? "Destacado quitado" : "Partido destacado", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); }
                })
                .catch(err => {
                    if (err.message === "PHP_MISSING") Swal.fire({ icon: "warning", title: "Archivo PHP no encontrado", html: `<p style="color:#94a3b8;font-size:13px;margin:0 0 6px">No se encontró <strong style="color:#fbbf24">${getEndpoints().toggleFeatured.split("/").pop()}</strong></p><p style="color:#64748b;font-size:12px;margin:0">El cambio es visual. Crea el archivo PHP para persistirlo en la BD.</p>`, timer: 5000, showConfirmButton: false });
                });
        });
    };

    const resetSingleMatch = (match) => {
        Swal.fire({ title: "¿Resetear resultado?", html: `<p style="color:#94a3b8;font-size:14px;margin:0">${match.local_nombre} vs ${match.visitante_nombre}</p>`, icon: "question", showCancelButton: true, confirmButtonText: "Sí, resetear", confirmButtonColor: "#f59e0b", background: "#0b1120", color: "#f1f5f9" })
            .then(result => {
                if (result.isConfirmed) {
                    const form = new FormData(); form.append("match_id", match.id); form.append("goles_local", "-1"); form.append("goles_visitante", "-1");
                    fetch(getEndpoints().update, { method: "POST", body: form }).then(safeJson).then(data => {
                        if (data.error) { Swal.fire("Error", data.error, "error"); return; }
                        Swal.fire({ icon: "success", title: "Reseteado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(() => loadMatches());
                    }).catch(err => Swal.fire("Error", err.message || "No se pudo resetear.", "error"));
                }
            });
    };

    const resetAllMatches = () => {
        const jugados = matches.filter(m => m.status === "Finalizado");
        if (!jugados.length) { Swal.fire({ icon: "info", title: "No hay partidos jugados", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
        Swal.fire({ title: "¿Resetear TODOS los resultados?", html: `<p style="color:#f87171;font-size:14px;margin:0;font-weight:600">${jugados.length} partido${jugados.length > 1 ? "s" : ""} finalizado${jugados.length > 1 ? "s" : ""}</p>`, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, resetear todo", confirmButtonColor: "#ef4444", background: "#0b1120", color: "#f1f5f9" })
            .then(result => {
                if (result.isConfirmed) {
                    let done = 0; const ep = getEndpoints();
                    jugados.forEach(m => {
                        const form = new FormData(); form.append("match_id", m.id); form.append("goles_local", "-1"); form.append("goles_visitante", "-1");
                        fetch(ep.update, { method: "POST", body: form }).then(safeJson).then(() => { done++; if (done === jugados.length) Swal.fire({ icon: "success", title: "Todo reseteado", timer: 2000, showConfirmButton: false }).then(() => loadMatches()); }).catch(() => { done++; if (done === jugados.length) loadMatches(); });
                    });
                }
            });
    };

    const localTeam = teamMap[newLocal];
    const visitanteTeam = teamMap[newVisitante];

    const filteredLocal = teams.filter(t => {
        if (String(t.id) === String(newVisitante)) return false;
        if (!t.nombre.toLowerCase().includes(searchLocal.toLowerCase())) return false;
        if (division === "segunda" && newVisitante) { const vGrupo = (teamMap[newVisitante]?.grupo || "").toLowerCase(); const tGrupo = (t.grupo || "").toLowerCase(); if (vGrupo && tGrupo && vGrupo !== tGrupo) return false; }
        return true;
    });
    const filteredVisitante = teams.filter(t => {
        if (String(t.id) === String(newLocal)) return false;
        if (!t.nombre.toLowerCase().includes(searchVisitante.toLowerCase())) return false;
        if (division === "segunda" && newLocal) { const lGrupo = (teamMap[newLocal]?.grupo || "").toLowerCase(); const tGrupo = (t.grupo || "").toLowerCase(); if (lGrupo && tGrupo && lGrupo !== tGrupo) return false; }
        return true;
    });

    const filteredMatches = matches.filter(m => {
        if (activeTab === "pending" && m.status === "Finalizado") return false;
        if (activeTab === "played" && m.status !== "Finalizado") return false;
        if (searchMatch.trim()) { const q = searchMatch.toLowerCase(); return (m.local_nombre || "").toLowerCase().includes(q) || (m.visitante_nombre || "").toLowerCase().includes(q); }
        return true;
    });
    const counts = { all: matches.length, pending: matches.filter(m => m.status !== "Finalizado").length, played: matches.filter(m => m.status === "Finalizado").length };
    const currentDiv = DIVISIONES.find(d => d.value === division);

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

    const GrupoBadge = ({ grupo, size = "sm" }) => {
        if (!grupo) return null;
        const g = grupo.toLowerCase(); const isEast = g === "east";
        const s = size === "lg" ? { padding: "3px 10px", fontSize: "10px", gap: "4px", borderRadius: "5px" } : { padding: "2px 7px", fontSize: "9px", gap: "3px", borderRadius: "4px" };
        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: s.gap, padding: s.padding, borderRadius: s.borderRadius, fontSize: s.fontSize, fontWeight: 800, letterSpacing: "0.3px", background: isEast ? "rgba(59,130,246,0.12)" : "rgba(249,115,22,0.12)", color: isEast ? "#60a5fa" : "#fb923c", border: `1px solid ${isEast ? "rgba(59,130,246,0.2)" : "rgba(249,115,22,0.2)"}`, flexShrink: 0 }}>
                <span style={{ width: size === "lg" ? 5 : 4, height: size === "lg" ? 5 : 4, borderRadius: "50%", background: isEast ? "#3b82f6" : "#f97316" }} />
                {isEast ? "Este" : "Oeste"}
            </span>
        );
    };

    const renderCustomSelect = (label, selectedId, searchVal, setSearchVal, isOpen, setOpen, filtered, onSelect, inputRef) => {
        const sel = teamMap[selectedId]; const isSegunda = division === "segunda";
        const renderOpt = (t) => (
            <div key={t.id} className={`cs-option cs-option-lg ${String(t.id) === String(selectedId) ? "cs-option-active" : ""}`} onClick={() => { onSelect(String(t.id)); setOpen(false); setSearchVal(""); }}>
                <img src={`${API}${t.logo}`} alt="" onError={e => { e.target.src = fallbackSelect; }} className="cs-opt-logo cs-opt-logo-lg" />
                <span className="cs-opt-name cs-opt-name-lg">{t.nombre}</span>
                {isSegunda && <GrupoBadge grupo={t.grupo} />}
                {!isSegunda && t.ciudad && <span className="cs-opt-city">{t.ciudad}</span>}
                {String(t.id) === String(selectedId) && <CheckCircle2 size={16} className="cs-opt-check cs-opt-check-lg" />}
            </div>
        );
        const renderGrouped = () => {
            const east = filtered.filter(t => (t.grupo || "").toLowerCase() === "east");
            const west = filtered.filter(t => (t.grupo || "").toLowerCase() === "west");
            const other = filtered.filter(t => !["east", "west"].includes((t.grupo || "").toLowerCase()));
            return (<>
                {east.length > 0 && (<><div className="cs-group-sep cs-group-sep-east"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />Grupo Este</div>{east.map(renderOpt)}</>)}
                {west.length > 0 && (<><div className="cs-group-sep cs-group-sep-west"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316" }} />Grupo Oeste</div>{west.map(renderOpt)}</>)}
                {other.length > 0 && other.map(renderOpt)}
            </>);
        };
        const showGrouped = isSegunda && !selectedId && !searchVal;
        return (
            <div className="cs-wrap" ref={inputRef}>
                <label className="cs-label">{label}</label>
                <div className={`cs-trigger cs-trigger-lg ${isOpen ? "cs-open" : ""} ${sel ? "cs-has-value" : ""}`} onClick={() => { setOpen(!isOpen); setSearchVal(""); }}>
                    {sel ? (
                        <div className="cs-selected">
                            <img src={`${API}${sel.logo}`} alt="" onError={e => { e.target.src = fallbackSelect; }} className="cs-sel-logo cs-sel-logo-lg" />
                            <span className="cs-sel-name cs-sel-name-lg">{sel.nombre}</span>
                            {isSegunda && <GrupoBadge grupo={sel.grupo} size="lg" />}
                        </div>
                    ) : <span className="cs-placeholder cs-placeholder-lg">Selecciona un equipo</span>}
                    <ChevronDown size={18} className={`cs-chevron ${isOpen ? "cs-chevron-up" : ""}`} />
                </div>
                {isOpen && (
                    <div className="cs-dropdown cs-dropdown-lg animate__animated animate__fadeInDown">
                        <div className="cs-search-wrap cs-search-wrap-lg">
                            <Search size={16} className="cs-search-icon cs-search-icon-lg" />
                            <input type="text" className="cs-search-input cs-search-input-lg" placeholder="Buscar equipo..." value={searchVal} onChange={e => setSearchVal(e.target.value)} autoFocus />
                        </div>
                        <div className="cs-options cs-options-lg">
                            {filtered.length === 0 ? (
                                <div className="cs-empty cs-empty-lg">{isSegunda && activeGrupo ? `Sin equipos en Grupo ${activeGrupo === "East" ? "Este" : "Oeste"}` : "Sin resultados"}</div>
                            ) : showGrouped ? renderGrouped() : filtered.map(renderOpt)}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>
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
                                        <button className="nav-item" onClick={() => setTeamsOpen(!teamsOpen)} style={{ width: "100%", justifyContent: "space-between" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>{item.icon} {item.label}</span>
                                            <ChevronDown size={16} style={{ transition: "transform 0.25s ease", transform: teamsOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.4 }} />
                                        </button>
                                        <ul style={{ maxHeight: teamsOpen ? "200px" : "0", opacity: teamsOpen ? "1" : "0", overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease", listStyle: "none", padding: teamsOpen ? "2px 0 4px 0" : "0", margin: 0 }}>
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
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
                    <div className="search-bar"><input type="text" placeholder="Buscar equipo..." value={searchMatch} onChange={e => setSearchMatch(e.target.value)} /></div>
                </header>

                <div className="content-wrapper">
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.2rem", flexWrap: "wrap" }}>
                        <h1 className="admin-title" style={{ margin: 0 }}>Gestionar Partidos</h1>
                        <div ref={dropdownRef} style={{ position: "relative" }}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px" }}>
                                <Trophy size={14} />{currentDiv?.label} División<ChevronDown size={15} style={{ transition: "transform 0.25s ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.7 }} />
                            </button>
                            {dropdownOpen && (
                                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100, background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden", minWidth: "190px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", animation: "ddFadeIn 0.15s ease-out" }}>
                                    {DIVISIONES.map(d => (<button key={d.value} onClick={() => { setDivision(d.value); setDropdownOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 18px", border: "none", background: division === d.value ? "rgba(59,130,246,0.15)" : "transparent", color: division === d.value ? "#60a5fa" : "#94a3b8", fontSize: "13px", fontWeight: division === d.value ? 700 : 500, cursor: "pointer", textAlign: "left" }}><Trophy size={13} style={{ opacity: division === d.value ? 1 : 0.4 }} />{d.label} División{division === d.value && <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }} />}</button>))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="table-container">
                        <div className="table-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                            <h2 style={{ margin: 0 }}>Lista de Partidos</h2>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                                <div className="mm-tabs">
                                    <button className={`mm-tab ${activeTab === "all" ? "mm-tab-active" : ""}`} onClick={() => setActiveTab("all")}>Todos <span className="mm-tab-count">{counts.all}</span></button>
                                    <button className={`mm-tab ${activeTab === "pending" ? "mm-tab-active mm-tab-pending" : ""}`} onClick={() => setActiveTab("pending")}>Pendientes <span className="mm-tab-count">{counts.pending}</span></button>
                                    <button className={`mm-tab ${activeTab === "played" ? "mm-tab-active mm-tab-played" : ""}`} onClick={() => setActiveTab("played")}>Jugados <span className="mm-tab-count">{counts.played}</span></button>
                                </div>
                                {counts.played > 0 && <button className="mm-reset-all-btn" onClick={resetAllMatches}><RotateCcw size={14} /> <span>Resetear todo</span></button>}
                                <button className="btn-add" onClick={openNewMatch}><Plus size={18} /> Nuevo Partido</button>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#3b82f6", animation: "mmSpin 0.8s linear infinite", margin: "0 auto 1rem" }} />
                                <span style={{ fontSize: "0.85rem" }}>Cargando partidos de {currentDiv?.label}...</span>
                            </div>
                        ) : (
                            
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th className="hide-on-mobile">Fecha</th>
                                        <th>Local</th>
                                        <th style={{ textAlign: "center" }}>Marcador</th>
                                        <th>Visitante</th>
                                        <th className="hide-on-mobile">Estado</th>
                                        <th className="th-actions">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMatches.map(match => {
                                        const escLocal = getEscudo(match.local_id) || getEscudo(match.local_nombre);
                                        const escVisit = getEscudo(match.visitante_id) || getEscudo(match.visitante_nombre);
                                        const isFin = match.status === "Finalizado";
                                        const isFeat = match.featured == 1 || match.destacado == 1;
                                        return (
                                            <tr key={match.id}>
                                                <td className="hide-on-mobile" style={{ whiteSpace: "nowrap", color: "#94a3b8", fontSize: "13px" }}>{match.date || "—"}</td>
                                                <td><div className="td-team"><img src={escLocal || fallbackImg} alt="" onError={e => { e.target.src = fallbackImg; }} className="td-team-img" /><span className="td-team-name">{match.local_nombre || "—"}</span></div></td>
                                                <td style={{ textAlign: "center" }}><span style={{ fontWeight: "800", fontSize: "15px", color: isFin ? "#e2b340" : "#64748b", letterSpacing: "2px" }}>{match.score || "-"}</span></td>
                                                <td><div className="td-team td-team-right"><span className="td-team-name">{match.visitante_nombre || "—"}</span><img src={escVisit || fallbackImg} alt="" onError={e => { e.target.src = fallbackImg; }} className="td-team-img" /></div></td>
                                                <td className="hide-on-mobile"><span className={`status ${isFin ? "done" : "pending"}`}>{match.status || "Pendiente"}</span></td>
                                                <td>
                                                    <div className="td-actions">
                                                        <button className={`mm-star-btn ${isFeat ? "mm-star-active" : ""}`} onClick={() => toggleFeatured(match)} disabled={submitting} title={isFeat ? "Quitar de destacado" : "Marcar como destacado"} style={{ opacity: submitting ? 0.5 : 1, cursor: submitting ? "wait" : "pointer" }}>
                                                            {isFeat ? <Star size={14} fill="#e2b340" /> : <StarOff size={14} />}
                                                            <span>{isFeat ? "Destacado" : "Destacar"}</span>
                                                        </button>
                                                        <button className={`result-action-btn ${isFin ? "result-edit" : "result-new"}`} onClick={() => openResult(match)} title={isFin ? "Editar resultado" : "Ingresar resultado"}>
                                                            <Trophy size={14} /><span>{isFin ? "Editar" : "Resultado"}</span>
                                                        </button>
                                                        {isFin && <button className="mm-reset-single-btn" onClick={() => resetSingleMatch(match)} title="Resetear resultado"><RotateCcw size={13} /><span>Reset</span></button>}
                                                        <button className="btn-delete" onClick={() => deleteMatch(match.id)} title="Eliminar"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {!loading && filteredMatches.length === 0 && (
                            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#475569" }}>
                                <Filter size={40} style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.2 }} />
                                <p style={{ fontWeight: 600, color: "#64748b" }}>{searchMatch ? "Sin resultados para la búsqueda" : activeTab === "played" ? "No hay partidos jugados" : activeTab === "pending" ? "No hay partidos pendientes" : "No hay partidos registrados"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* MODAL NUEVO PARTIDO */}
            {showNewMatch && (
                <div className="nm-overlay" onClick={e => { if (e.target === e.currentTarget) setShowNewMatch(false); }}>
                    <div className="nm-card nm-card-wide animate__animated animate__fadeInUp">
                        <div className="nm-header nm-header-wide">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div className="nm-header-icon"><Swords size={20} /></div>
                                <div><h2>Nuevo Partido</h2><p className="nm-header-sub">Equipos de <strong style={{ color: "#60a5fa" }}>{currentDiv?.label} División</strong></p></div>
                            </div>
                            <button className="nm-close nm-close-lg" onClick={() => setShowNewMatch(false)}><X size={20} /></button>
                        </div>
                        <div className="nm-body nm-body-wide">
                            {division === "segunda" && (
                                <div style={{ padding: "12px 18px", borderRadius: "12px", marginBottom: "22px", background: activeGrupo ? (activeGrupo.toLowerCase() === "east" ? "rgba(59,130,246,0.08)" : "rgba(249,115,22,0.08)") : "rgba(255,255,255,0.025)", border: `1px solid ${activeGrupo ? (activeGrupo.toLowerCase() === "east" ? "rgba(59,130,246,0.18)" : "rgba(249,115,22,0.18)") : "rgba(255,255,255,0.06)"}`, display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 600, color: activeGrupo ? (activeGrupo.toLowerCase() === "east" ? "#60a5fa" : "#fb923c") : "#64748b" }}>
                                    <Shield size={16} style={{ flexShrink: 0 }} />
                                    <span>{activeGrupo ? <>Filtrado: solo equipos del <strong>Grupo {activeGrupo === "East" ? "Este" : "Oeste"}</strong></> : "Los partidos son entre equipos del mismo grupo"}</span>
                                </div>
                            )}
                            <div className="nm-selects-row nm-selects-row-lg">
                                {renderCustomSelect("Equipo Local", newLocal, searchLocal, setSearchLocal, openSelectLocal, setOpenSelectLocal, filteredLocal, handleSelectLocal, localRef)}
                                <div className="nm-vs-badge nm-vs-badge-lg"><span>VS</span></div>
                                {renderCustomSelect("Equipo Visitante", newVisitante, searchVisitante, setSearchVisitante, openSelectVisitante, setOpenSelectVisitante, filteredVisitante, handleSelectVisitante, visitanteRef)}
                            </div>
                            <div className="nm-preview nm-preview-lg">
                                <div className="nm-preview-side">
                                    {localTeam ? (<><div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg"><img src={`${API}${localTeam.logo}`} alt="" onError={e => { e.target.src = fallbackImg; }} className="nm-preview-logo" /></div><span className="nm-preview-name nm-preview-name-lg">{localTeam.nombre}</span>{division === "segunda" && <GrupoBadge grupo={localTeam.grupo} size="lg" />}{division !== "segunda" && localTeam.ciudad && <span className="nm-preview-city nm-preview-city-lg">{localTeam.ciudad}</span>}</>) : (<div className="nm-preview-empty"><div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg nm-preview-logo-empty"><span>?</span></div><span className="nm-preview-name nm-preview-name-lg" style={{ color: "#475569" }}>Sin seleccionar</span></div>)}
                                </div>
                                <div className="nm-preview-center nm-preview-center-lg"><div className="nm-preview-line nm-preview-line-lg" /><div className="nm-preview-vs-icon nm-preview-vs-icon-lg"><Swords size={26} /></div><div className="nm-preview-line nm-preview-line-lg" /></div>
                                <div className="nm-preview-side">
                                    {visitanteTeam ? (<><div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg"><img src={`${API}${visitanteTeam.logo}`} alt="" onError={e => { e.target.src = fallbackImg; }} className="nm-preview-logo" /></div><span className="nm-preview-name nm-preview-name-lg">{visitanteTeam.nombre}</span>{division === "segunda" && <GrupoBadge grupo={visitanteTeam.grupo} size="lg" />}{division !== "segunda" && visitanteTeam.ciudad && <span className="nm-preview-city nm-preview-city-lg">{visitanteTeam.ciudad}</span>}</>) : (<div className="nm-preview-empty"><div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg nm-preview-logo-empty"><span>?</span></div><span className="nm-preview-name nm-preview-name-lg" style={{ color: "#475569" }}>Sin seleccionar</span></div>)}
                                </div>
                            </div>
                            {newLocal && newVisitante && newLocal === newVisitante && <div className="nm-warning nm-warning-lg">No puedes seleccionar el mismo equipo</div>}
                            {division === "segunda" && newLocal && newVisitante && (() => { const lg = (teamMap[newLocal]?.grupo || "").toLowerCase(); const vg = (teamMap[newVisitante]?.grupo || "").toLowerCase(); if (lg && vg && lg !== vg) return <div className="nm-warning nm-warning-lg">Los equipos deben ser del mismo grupo</div>; return null; })()}
                        </div>
                        <div className="nm-footer nm-footer-wide">
                            <button className="nm-btn-cancel nm-btn-cancel-lg" onClick={() => setShowNewMatch(false)}>Cancelar</button>
                            <button className="btn-add nm-btn-ok nm-btn-ok-lg" onClick={createMatch} disabled={submitting || !newLocal || !newVisitante || newLocal === newVisitante} style={{ opacity: (!newLocal || !newVisitante || newLocal === newVisitante || submitting) ? 0.35 : 1, cursor: (!newLocal || !newVisitante || newLocal === newVisitante || submitting) ? "not-allowed" : "pointer", minWidth: "200px", justifyContent: "center" }}>
                                {submitting ? <span className="nm-spin nm-spin-lg" /> : <><Plus size={18} /> Crear Partido</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL RESULTADO */}
            {showResult && selectedMatch && (
                <div className="nm-overlay" onClick={e => { if (e.target === e.currentTarget) setShowResult(false); }}>
                    <div className="nm-card animate__animated animate__fadeInUp nm-score-card">
                        <div className="nm-header">
                            <h2><Trophy size={20} style={{ color: "#e2b340" }} /> Resultado del Partido</h2>
                            <button className="nm-close" onClick={() => setShowResult(false)}><X size={18} /></button>
                        </div>
                        <div className="nm-body nm-score-body">
                            <div className="mm-match-info"><span>{selectedMatch.date}</span><span className={`status ${selectedMatch.status === "Finalizado" ? "done" : "pending"}`} style={{ fontSize: "11px", padding: "3px 10px" }}>{selectedMatch.status || "Pendiente"}</span></div>
                            <div className="mm-scoreboard">
                                <div className="mm-score-team"><img src={getEscudo(selectedMatch.local_id) || getEscudo(selectedMatch.local_nombre) || fallbackImg} alt="" onError={e => { e.target.src = fallbackImg; }} className="mm-score-logo" /><span className="mm-score-team-name">{selectedMatch.local_nombre}</span></div>
                                <div className="mm-score-controls"><button className="mm-score-btn mm-score-down" onClick={() => setGolesLocal(p => Math.max(0, p - 1))} disabled={golesLocal === 0}><Minus size={20} /></button><div className={`mm-score-num ${golesLocal > golesVisitante ? "winning" : ""}`}>{golesLocal}</div><button className="mm-score-btn mm-score-up" onClick={() => setGolesLocal(p => p + 1)}><ChevronUp size={20} /></button></div>
                                <div className="mm-score-dash-wrap"><div className="mm-score-dash" /></div>
                                <div className="mm-score-controls"><button className="mm-score-btn mm-score-down" onClick={() => setGolesVisitante(p => Math.max(0, p - 1))} disabled={golesVisitante === 0}><Minus size={20} /></button><div className={`mm-score-num ${golesVisitante > golesLocal ? "winning" : ""}`}>{golesVisitante}</div><button className="mm-score-btn mm-score-up" onClick={() => setGolesVisitante(p => p + 1)}><ChevronUp size={20} /></button></div>
                                <div className="mm-score-team"><img src={getEscudo(selectedMatch.visitante_id) || getEscudo(selectedMatch.visitante_nombre) || fallbackImg} alt="" onError={e => { e.target.src = fallbackImg; }} className="mm-score-logo" /><span className="mm-score-team-name">{selectedMatch.visitante_nombre}</span></div>
                            </div>
                            {golesLocal !== golesVisitante && <div className="mm-winner-badge"><CheckCircle2 size={14} /> {golesLocal > golesVisitante ? selectedMatch.local_nombre : selectedMatch.visitante_nombre} gana</div>}
                            {golesLocal === golesVisitante && golesLocal > 0 && <div className="mm-draw-badge">Empate</div>}
                            <div className="mm-score-actions"><button className="mm-reset-btn" onClick={() => { setGolesLocal(0); setGolesVisitante(0); }}><RotateCcw size={14} /> Reiniciar marcador</button></div>
                        </div>
                        <div className="nm-footer">
                            <button className="nm-btn-cancel" onClick={() => setShowResult(false)}>Cancelar</button>
                            <button className="btn-add nm-btn-ok" onClick={saveResult} disabled={submitting} style={{ opacity: submitting ? 0.35 : 1, cursor: submitting ? "not-allowed" : "pointer", minWidth: "190px", justifyContent: "center" }}>
                                {submitting ? <span className="nm-spin" /> : <><CheckCircle2 size={16} /> Guardar Resultado</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
    @keyframes ddFadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes mmSpin { to { transform: rotate(360deg); } }
    @keyframes nmSpin { to { transform: rotate(360deg); } }

    .hide-on-mobile { display: table-cell; }
    .admin-layout .top-bar {
            position: sticky !important; 
            top: 0 !important;
            z-index: 60 !important; 
            background-color: inherit; 
        }

    /* === Sidebar overlay bajo 900px === */
    @media (max-width: 900px) {
        .admin-layout .sidebar { position: fixed !important; z-index: 50 !important; top: 0 !important; left: 0 !important; width: 280px !important; height: 100vh !important; transform: translateX(-100%); transition: transform 0.3s ease !important; }
        .admin-layout:not(.sidebar-closed) .sidebar { transform: translateX(0) !important; }
        .admin-layout .main-content { margin-left: 0 !important; width: 100% !important; }
    }

    /* === Ocultar columnas solo en celular === */
    @media (max-width: 640px) {
        .hide-on-mobile { display: none !important; }
    }

    /* === Desktop: tabla con ancho mínimo === */
    @media (min-width: 641px) {
        .data-table { min-width: 600px; }
    }

    /* === Celdas de equipo (reutilizables) === */
    .td-team { display: flex; align-items: center; gap: 10px; }
    .td-team-right { display: flex; align-items: center; gap: 10px; justify-content: flex-end; }
    .td-team-img { width: 32px; height: 32px; object-fit: contain; border-radius: 6px; background: #fff; padding: 2px; flex-shrink: 0; }
    .td-team-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
    .td-actions { display: flex; gap: 6px; flex-wrap: wrap; }
    .th-actions { white-space: nowrap; }

    /* === Tabs y botones === */
    .mm-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 3px; flex-wrap: wrap; }
    .mm-tab { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: none; background: transparent; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-tab:hover { color: #94a3b8; background: rgba(255,255,255,0.03); }
    .mm-tab-active { color: #f1f5f9 !important; background: rgba(255,255,255,0.08) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
    .mm-tab-pending.mm-tab-active { background: rgba(59,130,246,0.15) !important; color: #60a5fa !important; border: 1px solid rgba(59,130,246,0.2); }
    .mm-tab-played.mm-tab-active { background: rgba(16,185,129,0.15) !important; color: #34d399 !important; border: 1px solid rgba(16,185,129,0.2); }
    .mm-tab-count { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 18px; padding: 0 5px; border-radius: 5px; font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.06); color: #475569; font-family: monospace; }
    .mm-tab-active .mm-tab-count { background: rgba(255,255,255,0.1); color: #94a3b8; }
    .mm-tab-pending.mm-tab-active .mm-tab-count { background: rgba(59,130,246,0.2); color: #93c5fd; }
    .mm-tab-played.mm-tab-active .mm-tab-count { background: rgba(16,185,129,0.2); color: #6ee7b7; }
    .mm-reset-all-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.08); color: #f87171; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-reset-all-btn:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.35); }
    .mm-reset-single-btn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(245,158,11,0.2); background: rgba(245,158,11,0.08); color: #fbbf24; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-reset-single-btn:hover { background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.35); }
    .mm-star-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.03); color: #475569; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-star-btn:hover { background: rgba(226,179,64,0.08); border-color: rgba(226,179,64,0.2); color: #e2b340; }
    .mm-star-active { background: rgba(226,179,64,0.12) !important; border-color: rgba(226,179,64,0.3) !important; color: #e2b340 !important; box-shadow: 0 0 12px rgba(226,179,64,0.15); }
    .result-action-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; white-space: nowrap; }
    .result-new { background: rgba(226,179,64,0.12); color: #e2b340; border: 1px solid rgba(226,179,64,0.2); }
    .result-new:hover { background: rgba(226,179,64,0.22); }
    .result-edit { background: rgba(59,130,246,0.12); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
    .result-edit:hover { background: rgba(59,130,246,0.22); }

    /* === Modales === */
    .nm-overlay { position: fixed; inset: 0; background: rgba(2,6,15,0.82); backdrop-filter: blur(10px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .nm-card { background: #0b1120; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; width: 620px; max-width: 95vw; max-height: 92vh; display: flex; flex-direction: column; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.7); overflow: hidden; }
    .nm-score-card { width: 600px; }
    .nm-card-wide { width: 820px; }
    .nm-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.015); }
    .nm-header h2 { margin: 0; font-size: 1.05rem; color: #f1f5f9; display: flex; align-items: center; gap: 8px; }
    .nm-header-wide { padding: 22px 32px; background: linear-gradient(135deg, rgba(226,179,64,0.04) 0%, rgba(255,255,255,0.015) 100%); border-bottom: 1px solid rgba(226,179,64,0.08); }
    .nm-header-icon { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, rgba(226,179,64,0.15), rgba(226,179,64,0.05)); border: 1px solid rgba(226,179,64,0.2); display: flex; align-items: center; justify-content: center; color: #e2b340; }
    .nm-header-sub { margin: 2px 0 0 0; font-size: 0.8rem; color: #475569; font-weight: 500; }
    .nm-close { background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; color: #64748b; transition: all 0.25s; }
    .nm-close:hover { background: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.3); transform: rotate(90deg); }
    .nm-close-lg { width: 38px; height: 38px; border-radius: 10px; }
    .nm-body { padding: 24px; overflow-y: auto; flex: 1; }
    .nm-body::-webkit-scrollbar { width: 5px; }
    .nm-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
    .nm-body-wide { padding: 28px 32px; }
    .nm-score-body { padding: 20px 28px 28px; }
    .nm-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.015); }
    .nm-footer-wide { padding: 20px 32px; }
    .nm-btn-cancel { padding: 10px 22px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; background: transparent; color: #64748b; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
    .nm-btn-cancel:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
    .nm-btn-cancel-lg { padding: 12px 28px; font-size: 15px; border-radius: 10px; }
    .nm-btn-ok-lg { padding: 12px 28px; font-size: 15px; border-radius: 10px; }
    .nm-spin { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.15); border-top-color: #fff; border-radius: 50%; animation: nmSpin 0.6s linear infinite; }
    .nm-spin-lg { width: 22px; height: 22px; border-width: 3px; }
    .nm-warning { margin-top: 14px; text-align: center; padding: 10px; border-radius: 8px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); color: #f87171; font-size: 13px; font-weight: 600; }
    .nm-warning-lg { margin-top: 18px; padding: 12px; font-size: 14px; border-radius: 10px; }

    /* === Selectores === */
    .nm-selects-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: start; }
    .nm-vs-badge { display: flex; align-items: center; justify-content: center; padding-top: 26px; }
    .nm-vs-badge span { font-weight: 900; font-size: 13px; letter-spacing: 3px; color: #e2b340; background: rgba(226,179,64,0.08); border: 1px solid rgba(226,179,64,0.15); padding: 8px 14px; border-radius: 8px; }
    .nm-selects-row-lg { gap: 20px; }
    .nm-vs-badge-lg { padding-top: 34px; }
    .nm-vs-badge-lg span { font-size: 16px; letter-spacing: 4px; padding: 12px 20px; border-radius: 10px; }
    .cs-wrap { position: relative; }
    .cs-label { display: block; margin-bottom: 8px; font-weight: 600; color: #94a3b8; font-size: 13px; }
    .cs-trigger { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.2s; min-height: 44px; }
    .cs-trigger:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
    .cs-open { border-color: #e2b340 !important; box-shadow: 0 0 0 3px rgba(226,179,64,0.08); }
    .cs-has-value { background: rgba(255,255,255,0.04); }
    .cs-placeholder { color: #334155; font-size: 14px; }
    .cs-selected { display: flex; align-items: center; gap: 10px; }
    .cs-sel-logo { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; background: #fff; padding: 2px; flex-shrink: 0; }
    .cs-sel-name { font-weight: 700; font-size: 14px; color: #e2e8f0; }
    .cs-chevron { color: #475569; transition: transform 0.2s; flex-shrink: 0; }
    .cs-chevron-up { transform: rotate(180deg); color: #e2b340; }
    .cs-trigger-lg { padding: 14px 16px; border-radius: 14px; min-height: 56px; border-width: 1.5px; }
    .cs-sel-logo-lg { width: 38px; height: 38px; border-radius: 10px; padding: 3px; }
    .cs-sel-name-lg { font-size: 16px; font-weight: 800; }
    .cs-placeholder-lg { font-size: 15px; }
    .cs-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; box-shadow: 0 16px 40px -8px rgba(0,0,0,0.6); z-index: 50; overflow: hidden; }
    .cs-search-wrap { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .cs-search-icon { color: #334155; flex-shrink: 0; }
    .cs-search-input { flex: 1; background: none; border: none; outline: none; color: #e2e8f0; font-size: 13px; }
    .cs-search-input::placeholder { color: #334155; }
    .cs-options { max-height: 200px; overflow-y: auto; padding: 6px; }
    .cs-options::-webkit-scrollbar { width: 4px; }
    .cs-options::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
    .cs-group-sep { display: flex; align-items: center; gap: 7px; padding: 10px 12px 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
    .cs-group-sep-east { color: #60a5fa; }
    .cs-group-sep-west { color: #fb923c; }
    .cs-option { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
    .cs-option:hover { background: rgba(255,255,255,0.05); }
    .cs-option-active { background: rgba(226,179,64,0.08); }
    .cs-opt-logo { width: 26px; height: 26px; object-fit: contain; border-radius: 5px; background: #fff; padding: 1px; flex-shrink: 0; }
    .cs-opt-name { flex: 1; font-size: 13px; font-weight: 600; color: #cbd5e1; }
    .cs-option-active .cs-opt-name { color: #e2b340; }
    .cs-opt-check { color: #e2b340; flex-shrink: 0; }
    .cs-opt-city { font-size: 11px; color: #475569; font-weight: 500; }
    .cs-empty { text-align: center; padding: 16px; color: #334155; font-size: 13px; }
    .cs-dropdown-lg { border-radius: 14px; }
    .cs-search-wrap-lg { padding: 14px 16px; gap: 10px; }
    .cs-search-icon-lg { color: #475569; }
    .cs-search-input-lg { font-size: 15px; }
    .cs-options-lg { max-height: 280px; padding: 8px; }
    .cs-option-lg { padding: 11px 12px; border-radius: 10px; gap: 12px; }
    .cs-opt-logo-lg { width: 34px; height: 34px; border-radius: 8px; padding: 2px; }
    .cs-opt-name-lg { font-size: 14px; font-weight: 700; }
    .cs-opt-check-lg { width: 18px; height: 18px; }
    .cs-empty-lg { padding: 24px; font-size: 14px; }

    /* === Preview modal === */
    .nm-preview { margin-top: 20px; padding: 24px 16px; background: linear-gradient(135deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005)); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .nm-preview-side { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .nm-preview-logo-wrap { width: 68px; height: 68px; border-radius: 14px; background: #fff; padding: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .nm-preview-logo { width: 100%; height: 100%; objectFit: contain; }
    .nm-preview-logo-empty { background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.06); }
    .nm-preview-logo-empty span { font-size: 28px; color: #1e293b; font-weight: 800; }
    .nm-preview-name { font-weight: 800; font-size: 15px; color: #e2e8f0; text-align: center; }
    .nm-preview-city { font-size: 11px; color: #475569; font-weight: 500; }
    .nm-preview-center { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 20px; flex-shrink: 0; }
    .nm-preview-line { width: 1px; height: 30px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent); }
    .nm-preview-vs-icon { color: #e2b340; opacity: 0.5; }
    .nm-preview-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .nm-preview-lg { margin-top: 28px; padding: 36px 24px; border-radius: 18px; border: 1px solid rgba(226,179,64,0.06); background: linear-gradient(135deg, rgba(226,179,64,0.02) 0%, rgba(255,255,255,0.01) 50%, rgba(226,179,64,0.02) 100%); }
    .nm-preview-logo-wrap-lg { width: 90px; height: 90px; border-radius: 18px; padding: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
    .nm-preview-name-lg { font-size: 18px; font-weight: 900; }
    .nm-preview-city-lg { font-size: 12px; }
    .nm-preview-center-lg { padding: 0 28px; gap: 10px; }
    .nm-preview-line-lg { height: 44px; }
    .nm-preview-vs-icon-lg { opacity: 0.4; }

    /* === Scoreboard === */
    .mm-match-info { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 24px; color: #475569; font-size: 13px; }
    .mm-scoreboard { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 28px 12px; background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005)); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; }
    .mm-score-team { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 110px; flex-shrink: 0; }
    .mm-score-logo { width: 52px; height: 52px; object-fit: contain; border-radius: 10px; background: #fff; padding: 3px; }
    .mm-score-team-name { font-size: 12px; font-weight: 700; color: #cbd5e1; text-align: center; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .mm-score-controls { display: flex; align-items: center; gap: 5px; }
    .mm-score-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.025); color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; }
    .mm-score-btn:disabled { opacity: 0.15; cursor: not-allowed; }
    .mm-score-down:hover:not(:disabled) { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); transform: scale(1.08); }
    .mm-score-up:hover:not(:disabled) { background: rgba(16,185,129,0.15); color: #34d399; border-color: rgba(16,185,129,0.3); transform: scale(1.08); }
    .mm-score-num { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 900; color: #64748b; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; transition: all 0.2s; }
    .mm-score-num.winning { color: #e2b340; background: rgba(226,179,64,0.08); border-color: rgba(226,179,64,0.2); box-shadow: 0 0 20px rgba(226,179,64,0.1); }
    .mm-score-dash-wrap { display: flex; align-items: center; padding: 0 2px; }
    .mm-score-dash { width: 2px; height: 44px; background: rgba(255,255,255,0.08); border-radius: 1px; }
    .mm-winner-badge { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 18px; padding: 8px 16px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.15); border-radius: 8px; color: #34d399; font-size: 13px; font-weight: 700; }
    .mm-draw-badge { text-align: center; margin-top: 18px; padding: 8px 16px; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.15); border-radius: 8px; color: #fbbf24; font-size: 13px; font-weight: 700; }
    .mm-score-actions { display: flex; justify-content: center; margin-top: 14px; }
    .mm-reset-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #475569; background: transparent; border: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.2s; }
    .mm-reset-btn:hover { color: #f87171; border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.06); }
    button.nav-item { background: none; border: none; color: var(--text-muted); font-family: inherit; }

    /* ==============================================
       RESPONSIVE — 3 breakpoints claros
       ============================================== */

    /* Tablet: modales fullscreen */
    @media (max-width: 860px) {
        .nm-card-wide { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
        .nm-selects-row-lg { grid-template-columns: 1fr; gap: 12px; }
        .nm-vs-badge-lg { padding-top: 0; }
        .nm-preview-lg { padding: 24px 16px; flex-direction: column; gap: 16px; min-height: 180px; justify-content: center; }
        .nm-preview-logo-wrap-lg { width: 70px; height: 70px; }
        .nm-preview-name-lg { font-size: 16px; }
        .nm-preview-center-lg { flex-direction: row; padding: 0; }
        .nm-preview-line-lg { width: 40px; height: 1px; }
        .nm-footer-wide { flex-direction: column-reverse; }
        .nm-btn-cancel-lg, .nm-btn-ok-lg { width: 100%; text-align: center; justify-content: center !important; }
    }

    /* ✅ Celular: tabla fluida sin scroll horizontal */
    @media (max-width: 640px) {
        .data-table { min-width: 0 !important; width: 100%; table-layout: fixed; }
        .data-table th, .data-table td { padding: 10px 4px; font-size: 11px; }
        .td-team-img { width: 24px; height: 24px; }
        .td-team { gap: 5px; }
        .td-team-right { gap: 5px; }
        .td-team-name { max-width: 70px; font-size: 11px; }
        .td-actions { gap: 3px; justify-content: center; flex-wrap: nowrap; }
        /* Botones: solo iconos en celular */
        .result-action-btn span,
        .mm-reset-single-btn span,
        .mm-reset-all-btn span,
        .mm-star-btn span { display: none; }
        .mm-star-btn, .result-action-btn, .mm-reset-single-btn { padding: 6px 7px; }
        .btn-delete { padding: 6px; }

        .nm-card, .nm-score-card { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
        .nm-selects-row { grid-template-columns: 1fr; gap: 8px; }
        .nm-vs-badge { padding-top: 0; }
        .nm-preview-logo-wrap { width: 50px; height: 50px; }
        .nm-preview-name { font-size: 13px; }
        .nm-preview-center { padding: 0 12px; }
        .nm-footer { flex-direction: column-reverse; }
        .nm-btn-cancel, .nm-btn-ok { width: 100%; text-align: center; justify-content: center !important; }
        .mm-scoreboard { gap: 6px; flex-wrap: wrap; padding: 18px 8px; }
        .mm-score-team { width: 70px; }
        .mm-score-logo { width: 36px; height: 36px; }
        .mm-score-team-name { font-size: 10px; }
        .mm-score-num { width: 44px; height: 44px; font-size: 24px; }
        .mm-score-btn { width: 34px; height: 34px; }
    }
`}</style>
        </div>
    );
};

export default ManageMatches;