// ========== ManageMatches.jsx ==========
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

import {
    LayoutDashboard,
    CalendarDays,
    Shield,
    Newspaper,
    Users,
    Settings,
    LogOut,
    Menu,
    Plus,
    Trash2,
    Trophy,
    X,
    Minus,
    ChevronUp,
    Swords,
    CheckCircle2,
    RotateCcw,
    Search,
    ChevronDown,
} from "lucide-react";

const ManageMatches = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamMap, setTeamMap] = useState({});

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (localRef.current && !localRef.current.contains(e.target)) setOpenSelectLocal(false);
            if (visitanteRef.current && !visitanteRef.current.contains(e.target)) setOpenSelectVisitante(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetch("http://localhost/Numeros-y-Futbol/backend/get_teams.php")
            .then(res => res.json())
            .then(data => {
                setTeams(data);
                const map = {};
                data.forEach(t => { map[t.id] = t; map[t.nombre] = t; });
                setTeamMap(map);
            });

        fetch("http://localhost/Numeros-y-Futbol/backend/get_matches.php")
            .then(res => res.json())
            .then(data => { console.log("PARTIDOS:", data); setMatches(data); });
    }, []);

    const getEscudo = (idOrName) => {
        const team = teamMap[idOrName];
        if (team && team.logo) return `http://localhost/Numeros-y-Futbol/backend/${team.logo}`;
        return null;
    };

    const fallbackImg = "https://ui-avatars.com/api/?name=EQ&background=0f172a&color=334155&size=40&bold=true";
    const fallbackSelect = "https://ui-avatars.com/api/?name=EQ&background=1e293b&color=475569&size=36&bold=true";

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", confirmButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) { localStorage.removeItem("user"); window.location.href = "/login"; }
        });
    };

    const openNewMatch = () => {
        setNewLocal(""); setNewVisitante("");
        setSearchLocal(""); setSearchVisitante("");
        setOpenSelectLocal(false); setOpenSelectVisitante(false);
        setShowNewMatch(true);
    };

    const createMatch = () => {
        if (!newLocal || !newVisitante) {
            Swal.fire({ icon: "info", title: "Completa ambos equipos", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
            return;
        }
        if (newLocal === newVisitante) {
            Swal.fire({ icon: "info", title: "No pueden ser el mismo equipo", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
            return;
        }
        setSubmitting(true);
        const form = new FormData();
        form.append("local", newLocal);
        form.append("visitante", newVisitante);
        fetch("http://localhost/Numeros-y-Futbol/backend/create_match.php", { method: "POST", body: form })
            .then(res => res.json())
            .then(data => {
                setSubmitting(false);
                if (data.error) { Swal.fire("Error", data.error, "error"); }
                else {
                    setShowNewMatch(false);
                    Swal.fire({ icon: "success", title: "Partido creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false })
                        .then(() => window.location.reload());
                }
            })
            .catch(() => { setSubmitting(false); Swal.fire("Error", "Error de conexión", "error"); });
    };

    const openResult = (match) => {
        setSelectedMatch(match);
        if (match.score && match.score !== "-") {
            const parts = match.score.split(" - ");
            setGolesLocal(parseInt(parts[0]) || 0);
            setGolesVisitante(parseInt(parts[1]) || 0);
        } else { setGolesLocal(0); setGolesVisitante(0); }
        setShowResult(true);
    };

    const saveResult = () => {
        setSubmitting(true);
        const form = new FormData();
        form.append("match_id", selectedMatch.id);
        form.append("goles_local", golesLocal);
        form.append("goles_visitante", golesVisitante);
        fetch("http://localhost/Numeros-y-Futbol/backend/update_match.php", { method: "POST", body: form })
            .then(res => res.json())
            .then(data => {
                setSubmitting(false);
                if (data.error) { Swal.fire("Error", data.error, "error"); }
                else {
                    setShowResult(false);
                    Swal.fire({ icon: "success", title: "Resultado guardado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false })
                        .then(() => window.location.reload());
                }
            })
            .catch(() => { setSubmitting(false); Swal.fire("Error", "Error de conexión", "error"); });
    };

    const resetGoles = () => { setGolesLocal(0); setGolesVisitante(0); };

    const deleteMatch = (id) => {
        Swal.fire({
            title: "¿Eliminar partido?", text: "Esto no se puede deshacer", icon: "warning",
            showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33"
        }).then(result => {
            if (result.isConfirmed) {
                const form = new FormData();
                form.append("id", id);
                fetch("http://localhost/Numeros-y-Futbol/backend/delete_match.php", { method: "POST", body: form })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) { Swal.fire("Error", data.error, "error"); }
                        else {
                            Swal.fire({ icon: "success", title: "Eliminado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false })
                                .then(() => window.location.reload());
                        }
                    });
            }
        });
    };

    const localTeam = teamMap[newLocal];
    const visitanteTeam = teamMap[newVisitante];

    const filteredLocal = teams.filter(t =>
        t.nombre.toLowerCase().includes(searchLocal.toLowerCase()) && t.id != newVisitante
    );
    const filteredVisitante = teams.filter(t =>
        t.nombre.toLowerCase().includes(searchVisitante.toLowerCase()) && t.id != newLocal
    );

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

    // Select custom — versión GRANDE para nuevo partido
    const renderCustomSelect = (label, selectedId, searchVal, setSearchVal, isOpen, setOpen, filtered, onSelect, inputRef) => {
        const selectedTeam = teamMap[selectedId];

        return (
            <div className="cs-wrap" ref={inputRef}>
                <label className="cs-label">{label}</label>
                <div
                    className={`cs-trigger cs-trigger-lg ${isOpen ? 'cs-open' : ''} ${selectedTeam ? 'cs-has-value' : ''}`}
                    onClick={() => { setOpen(!isOpen); setSearchVal(""); }}
                >
                    {selectedTeam ? (
                        <div className="cs-selected">
                            <img src={`http://localhost/Numeros-y-Futbol/backend/${selectedTeam.logo}`} alt=""
                                onError={(e) => { e.target.src = fallbackSelect; }}
                                className="cs-sel-logo cs-sel-logo-lg" />
                            <span className="cs-sel-name cs-sel-name-lg">{selectedTeam.nombre}</span>
                        </div>
                    ) : (
                        <span className="cs-placeholder cs-placeholder-lg">Selecciona un equipo</span>
                    )}
                    <ChevronDown size={18} className={`cs-chevron ${isOpen ? 'cs-chevron-up' : ''}`} />
                </div>

                {isOpen && (
                    <div className="cs-dropdown cs-dropdown-lg animate__animated animate__fadeInDown">
                        <div className="cs-search-wrap cs-search-wrap-lg">
                            <Search size={16} className="cs-search-icon cs-search-icon-lg" />
                            <input
                                type="text"
                                className="cs-search-input cs-search-input-lg"
                                placeholder="Buscar equipo..."
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="cs-options cs-options-lg">
                            {filtered.length === 0 ? (
                                <div className="cs-empty cs-empty-lg">Sin resultados</div>
                            ) : (
                                filtered.map(t => (
                                    <div
                                        key={t.id}
                                        className={`cs-option cs-option-lg ${t.id == selectedId ? 'cs-option-active' : ''}`}
                                        onClick={() => { onSelect(t.id.toString()); setOpen(false); setSearchVal(""); }}
                                    >
                                        <img src={`http://localhost/Numeros-y-Futbol/backend/${t.logo}`} alt=""
                                            onError={(e) => { e.target.src = fallbackSelect; }}
                                            className="cs-opt-logo cs-opt-logo-lg" />
                                        <span className="cs-opt-name cs-opt-name-lg">{t.nombre}</span>
                                        {t.ciudad && <span className="cs-opt-city">{t.ciudad}</span>}
                                        {t.id == selectedId && <CheckCircle2 size={16} className="cs-opt-check cs-opt-check-lg" />}
                                    </div>
                                ))
                            )}
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
                    <div className="logo-icon">
                        <img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo" />
                    </div>
                    <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link to={item.path} className={`nav-item ${location.pathname === item.path ? "active" : ""}`}>
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
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
                    <div className="search-bar"><input type="text" placeholder="Buscar partido..." readOnly /></div>
                </header>

                <div className="content-wrapper">
                    <h1 className="admin-title">Gestionar Partidos</h1>
                    <div className="table-container">
                        <div className="table-header">
                            <h2>Lista de Partidos</h2>
                            <button className="btn-add" onClick={openNewMatch}><Plus size={18} /> Nuevo Partido</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Local</th>
                                    <th style={{ textAlign: 'center' }}>Marcador</th>
                                    <th>Visitante</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map((match) => {
                                    const escudoLocal = getEscudo(match.local_id) || getEscudo(match.local_nombre);
                                    const escudoVisitante = getEscudo(match.visitante_id) || getEscudo(match.visitante_nombre);
                                    const isFinalizado = match.status === "Finalizado";
                                    return (
                                        <tr key={match.id}>
                                            <td style={{ whiteSpace: 'nowrap', color: '#94a3b8', fontSize: '13px' }}>{match.date}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <img src={escudoLocal || fallbackImg} alt="" onError={(e) => { e.target.src = fallbackImg; }}
                                                        style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '6px', background: '#fff', padding: '2px', flexShrink: 0 }} />
                                                    <span style={{ fontWeight: '600' }}>{match.local_nombre}</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span style={{ fontWeight: '800', fontSize: '15px', color: isFinalizado ? '#e2b340' : '#64748b', letterSpacing: '2px' }}>
                                                    {match.score || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <img src={escudoVisitante || fallbackImg} alt="" onError={(e) => { e.target.src = fallbackImg; }}
                                                        style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '6px', background: '#fff', padding: '2px', flexShrink: 0 }} />
                                                    <span style={{ fontWeight: '600' }}>{match.visitante_nombre}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status ${isFinalizado ? 'done' : 'pending'}`}>{match.status}</span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button className={`result-action-btn ${isFinalizado ? 'result-edit' : 'result-new'}`}
                                                        onClick={() => openResult(match)} title={isFinalizado ? "Editar resultado" : "Ingresar resultado"}>
                                                        <Trophy size={14} /><span>{isFinalizado ? "Editar" : "Resultado"}</span>
                                                    </button>
                                                    <button className="btn-delete" onClick={() => deleteMatch(match.id)} title="Eliminar"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {matches.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#475569' }}>
                                <Trophy size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.2 }} />
                                <p style={{ fontWeight: 600, color: '#64748b' }}>No hay partidos registrados</p>
                                <p style={{ fontSize: '13px', marginTop: '4px' }}>Crea tu primer partido con el botón de arriba</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ===== MODAL: NUEVO PARTIDO (GRANDE) ===== */}
            {showNewMatch && (
                <div className="nm-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowNewMatch(false); }}>
                    <div className="nm-card nm-card-wide animate__animated animate__fadeInUp">

                        <div className="nm-header nm-header-wide">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="nm-header-icon">
                                    <Swords size={20} />
                                </div>
                                <div>
                                    <h2>Nuevo Partido</h2>
                                    <p className="nm-header-sub">Selecciona los equipos que se enfrentarán</p>
                                </div>
                            </div>
                            <button className="nm-close nm-close-lg" onClick={() => setShowNewMatch(false)}><X size={20} /></button>
                        </div>

                        <div className="nm-body nm-body-wide">
                            <div className="nm-selects-row nm-selects-row-lg">
                                {renderCustomSelect(
                                    "Equipo Local",
                                    newLocal,
                                    searchLocal,
                                    setSearchLocal,
                                    openSelectLocal,
                                    setOpenSelectLocal,
                                    filteredLocal,
                                    setNewLocal,
                                    localRef
                                )}

                                <div className="nm-vs-badge nm-vs-badge-lg">
                                    <span>VS</span>
                                </div>

                                {renderCustomSelect(
                                    "Equipo Visitante",
                                    newVisitante,
                                    searchVisitante,
                                    setSearchVisitante,
                                    openSelectVisitante,
                                    setOpenSelectVisitante,
                                    filteredVisitante,
                                    setNewVisitante,
                                    visitanteRef
                                )}
                            </div>

                            {/* Preview del enfrentamiento — GRANDE */}
                            {(localTeam || visitanteTeam) && (
                                <div className="nm-preview nm-preview-lg">
                                    <div className="nm-preview-side">
                                        {localTeam ? (
                                            <>
                                                <div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg">
                                                    <img src={`http://localhost/Numeros-y-Futbol/backend/${localTeam.logo}`} alt=""
                                                        onError={(e) => { e.target.src = fallbackImg; }} className="nm-preview-logo" />
                                                </div>
                                                <span className="nm-preview-name nm-preview-name-lg">{localTeam.nombre}</span>
                                                {localTeam.ciudad && <span className="nm-preview-city nm-preview-city-lg">{localTeam.ciudad}</span>}
                                                {localTeam.estadio && <span className="nm-preview-stadium">{localTeam.estadio}</span>}
                                            </>
                                        ) : (
                                            <div className="nm-preview-empty">
                                                <div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg nm-preview-logo-empty">
                                                    <span>?</span>
                                                </div>
                                                <span className="nm-preview-name nm-preview-name-lg" style={{ color: '#1e293b' }}>Sin seleccionar</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="nm-preview-center nm-preview-center-lg">
                                        <div className="nm-preview-line nm-preview-line-lg" />
                                        <div className="nm-preview-vs-icon nm-preview-vs-icon-lg">
                                            <Swords size={26} />
                                        </div>
                                        <div className="nm-preview-line nm-preview-line-lg" />
                                    </div>

                                    <div className="nm-preview-side">
                                        {visitanteTeam ? (
                                            <>
                                                <div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg">
                                                    <img src={`http://localhost/Numeros-y-Futbol/backend/${visitanteTeam.logo}`} alt=""
                                                        onError={(e) => { e.target.src = fallbackImg; }} className="nm-preview-logo" />
                                                </div>
                                                <span className="nm-preview-name nm-preview-name-lg">{visitanteTeam.nombre}</span>
                                                {visitanteTeam.ciudad && <span className="nm-preview-city nm-preview-city-lg">{visitanteTeam.ciudad}</span>}
                                                {visitanteTeam.estadio && <span className="nm-preview-stadium">{visitanteTeam.estadio}</span>}
                                            </>
                                        ) : (
                                            <div className="nm-preview-empty">
                                                <div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg nm-preview-logo-empty">
                                                    <span>?</span>
                                                </div>
                                                <span className="nm-preview-name nm-preview-name-lg" style={{ color: '#1e293b' }}>Sin seleccionar</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {newLocal && newVisitante && newLocal === newVisitante && (
                                <div className="nm-warning nm-warning-lg">No puedes seleccionar el mismo equipo</div>
                            )}
                        </div>

                        <div className="nm-footer nm-footer-wide">
                            <button className="nm-btn-cancel nm-btn-cancel-lg" onClick={() => setShowNewMatch(false)}>Cancelar</button>
                            <button className="btn-add nm-btn-ok nm-btn-ok-lg" onClick={createMatch}
                                disabled={submitting || !newLocal || !newVisitante || newLocal === newVisitante}
                                style={{
                                    opacity: (!newLocal || !newVisitante || newLocal === newVisitante || submitting) ? 0.35 : 1,
                                    cursor: (!newLocal || !newVisitante || newLocal === newVisitante || submitting) ? 'not-allowed' : 'pointer',
                                    minWidth: '200px', justifyContent: 'center'
                                }}>
                                {submitting ? <span className="nm-spin nm-spin-lg" /> : <><Plus size={18} /> Crear Partido</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MODAL: RESULTADO (sin cambios) ===== */}
            {showResult && selectedMatch && (
                <div className="nm-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowResult(false); }}>
                    <div className="nm-card animate__animated animate__fadeInUp nm-score-card">
                        <div className="nm-header">
                            <h2><Trophy size={20} style={{ color: '#e2b340' }} /> Resultado del Partido</h2>
                            <button className="nm-close" onClick={() => setShowResult(false)}><X size={18} /></button>
                        </div>
                        <div className="nm-body nm-score-body">
                            <div className="mm-match-info">
                                <span>{selectedMatch.date}</span>
                                <span className={`status ${selectedMatch.status === 'Finalizado' ? 'done' : 'pending'}`} style={{ fontSize: '11px', padding: '3px 10px' }}>
                                    {selectedMatch.status}
                                </span>
                            </div>
                            <div className="mm-scoreboard">
                                <div className="mm-score-team">
                                    <img src={getEscudo(selectedMatch.local_id) || getEscudo(selectedMatch.local_nombre) || fallbackImg} alt=""
                                        onError={(e) => { e.target.src = fallbackImg; }} className="mm-score-logo" />
                                    <span className="mm-score-team-name">{selectedMatch.local_nombre}</span>
                                </div>
                                <div className="mm-score-controls">
                                    <button className="mm-score-btn mm-score-down" onClick={() => setGolesLocal(p => Math.max(0, p - 1))} disabled={golesLocal === 0}>
                                        <Minus size={20} />
                                    </button>
                                    <div className={`mm-score-num ${golesLocal > golesVisitante ? 'winning' : ''}`}>{golesLocal}</div>
                                    <button className="mm-score-btn mm-score-up" onClick={() => setGolesLocal(p => p + 1)}><ChevronUp size={20} /></button>
                                </div>
                                <div className="mm-score-dash-wrap"><div className="mm-score-dash" /></div>
                                <div className="mm-score-controls">
                                    <button className="mm-score-btn mm-score-down" onClick={() => setGolesVisitante(p => Math.max(0, p - 1))} disabled={golesVisitante === 0}>
                                        <Minus size={20} />
                                    </button>
                                    <div className={`mm-score-num ${golesVisitante > golesLocal ? 'winning' : ''}`}>{golesVisitante}</div>
                                    <button className="mm-score-btn mm-score-up" onClick={() => setGolesVisitante(p => p + 1)}><ChevronUp size={20} /></button>
                                </div>
                                <div className="mm-score-team">
                                    <img src={getEscudo(selectedMatch.visitante_id) || getEscudo(selectedMatch.visitante_nombre) || fallbackImg} alt=""
                                        onError={(e) => { e.target.src = fallbackImg; }} className="mm-score-logo" />
                                    <span className="mm-score-team-name">{selectedMatch.visitante_nombre}</span>
                                </div>
                            </div>
                            {(golesLocal !== golesVisitante) && (
                                <div className="mm-winner-badge">
                                    <CheckCircle2 size={14} />
                                    {golesLocal > golesVisitante ? selectedMatch.local_nombre : selectedMatch.visitante_nombre} gana
                                </div>
                            )}
                            {golesLocal === golesVisitante && (golesLocal > 0) && (
                                <div className="mm-draw-badge">Empate</div>
                            )}
                            <div className="mm-score-actions">
                                <button className="mm-reset-btn" onClick={resetGoles}><RotateCcw size={14} /> Reiniciar marcador</button>
                            </div>
                        </div>
                        <div className="nm-footer">
                            <button className="nm-btn-cancel" onClick={() => setShowResult(false)}>Cancelar</button>
                            <button className="btn-add nm-btn-ok" onClick={saveResult} disabled={submitting}
                                style={{ opacity: submitting ? 0.35 : 1, cursor: submitting ? 'not-allowed' : 'pointer', minWidth: '190px', justifyContent: 'center' }}>
                                {submitting ? <span className="nm-spin" /> : <><CheckCircle2 size={16} /> Guardar Resultado</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .result-action-btn {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 6px 12px; border-radius: 6px; font-size: 12px;
                    font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; white-space: nowrap;
                }
                .result-new { background: rgba(226,179,64,0.12); color: #e2b340; border: 1px solid rgba(226,179,64,0.2); }
                .result-new:hover { background: rgba(226,179,64,0.22); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(226,179,64,0.2); }
                .result-edit { background: rgba(59,130,246,0.12); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
                .result-edit:hover { background: rgba(59,130,246,0.22); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,130,246,0.2); }

                /* ===== OVERLAY ===== */
                .nm-overlay {
                    position: fixed; inset: 0; background: rgba(2,6,15,0.82);
                    backdrop-filter: blur(10px); display: flex;
                    justify-content: center; align-items: center; z-index: 1000;
                }

                /* ===== CARD BASE ===== */
                .nm-card {
                    background: #0b1120; border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 18px; width: 620px; max-width: 95vw;
                    max-height: 92vh; display: flex; flex-direction: column;
                    box-shadow: 0 25px 60px -12px rgba(0,0,0,0.7), 0 0 100px rgba(226,179,64,0.03);
                    overflow: hidden;
                }
                .nm-score-card { width: 600px; }

                /* ===== CARD WIDE (solo nuevo partido) ===== */
                .nm-card-wide {
                    width: 820px;
                    box-shadow: 0 25px 60px -12px rgba(0,0,0,0.7), 0 0 120px rgba(226,179,64,0.05);
                }

                /* ===== HEADER BASE ===== */
                .nm-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.015);
                }
                .nm-header h2 {
                    margin: 0; font-size: 1.05rem; color: #f1f5f9;
                    display: flex; align-items: center; gap: 8px;
                }

                /* ===== HEADER WIDE ===== */
                .nm-header-wide {
                    padding: 22px 32px;
                    background: linear-gradient(135deg, rgba(226,179,64,0.04) 0%, rgba(255,255,255,0.015) 100%);
                    border-bottom: 1px solid rgba(226,179,64,0.08);
                }
                .nm-header-icon {
                    width: 42px; height: 42px; border-radius: 12px;
                    background: linear-gradient(135deg, rgba(226,179,64,0.15), rgba(226,179,64,0.05));
                    border: 1px solid rgba(226,179,64,0.2);
                    display: flex; align-items: center; justify-content: center;
                    color: #e2b340;
                }
                .nm-header-sub {
                    margin: 2px 0 0 0; font-size: 0.8rem; color: #475569;
                    font-weight: 500;
                }

                /* ===== CLOSE ===== */
                .nm-close {
                    background: none; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px; cursor: pointer; display: flex;
                    align-items: center; justify-content: center;
                    width: 32px; height: 32px; color: #64748b; transition: all 0.25s;
                }
                .nm-close:hover {
                    background: rgba(239,68,68,0.15); color: #ef4444;
                    border-color: rgba(239,68,68,0.3); transform: rotate(90deg);
                }
                .nm-close-lg { width: 38px; height: 38px; border-radius: 10px; }

                /* ===== BODY ===== */
                .nm-body { padding: 24px; overflow-y: auto; flex: 1; }
                .nm-body::-webkit-scrollbar { width: 5px; }
                .nm-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
                .nm-body-wide { padding: 28px 32px; }
                .nm-score-body { padding: 20px 28px 28px; }

                /* ===== FOOTER ===== */
                .nm-footer {
                    display: flex; justify-content: flex-end; gap: 10px;
                    padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.015);
                }
                .nm-footer-wide { padding: 20px 32px; }
                .nm-btn-cancel {
                    padding: 10px 22px; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px; background: transparent; color: #64748b;
                    font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s;
                }
                .nm-btn-cancel:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
                .nm-btn-cancel-lg { padding: 12px 28px; font-size: 15px; border-radius: 10px; }
                .nm-btn-ok-lg { padding: 12px 28px; font-size: 15px; border-radius: 10px; }

                /* ===== SPIN ===== */
                .nm-spin {
                    display: inline-block; width: 18px; height: 18px;
                    border: 2px solid rgba(255,255,255,0.15); border-top-color: #fff;
                    border-radius: 50%; animation: nmSpin 0.6s linear infinite;
                }
                .nm-spin-lg { width: 22px; height: 22px; border-width: 3px; }
                @keyframes nmSpin { to { transform: rotate(360deg); } }

                /* ===== SELECTS ROW BASE ===== */
                .nm-selects-row {
                    display: grid; grid-template-columns: 1fr auto 1fr;
                    gap: 12px; align-items: start;
                }
                .nm-vs-badge {
                    display: flex; align-items: center; justify-content: center;
                    padding-top: 26px;
                }
                .nm-vs-badge span {
                    font-weight: 900; font-size: 13px; letter-spacing: 3px;
                    color: #e2b340; background: rgba(226,179,64,0.08);
                    border: 1px solid rgba(226,179,64,0.15);
                    padding: 8px 14px; border-radius: 8px;
                }

                /* ===== SELECTS ROW WIDE ===== */
                .nm-selects-row-lg { gap: 20px; }
                .nm-vs-badge-lg { padding-top: 34px; }
                .nm-vs-badge-lg span {
                    font-size: 16px; letter-spacing: 4px;
                    padding: 12px 20px; border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(226,179,64,0.1);
                }

                /* ===== CUSTOM SELECT BASE ===== */
                .cs-wrap { position: relative; }
                .cs-label {
                    display: block; margin-bottom: 8px; font-weight: 600;
                    color: #94a3b8; font-size: 13px;
                }
                .cs-trigger {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 10px 12px; border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.03);
                    cursor: pointer; transition: all 0.2s; min-height: 44px;
                }
                .cs-trigger:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
                .cs-open { border-color: #e2b340 !important; box-shadow: 0 0 0 3px rgba(226,179,64,0.08); }
                .cs-has-value { background: rgba(255,255,255,0.04); }
                .cs-placeholder { color: #334155; font-size: 14px; }
                .cs-selected { display: flex; align-items: center; gap: 10px; }
                .cs-sel-logo {
                    width: 28px; height: 28px; object-fit: contain;
                    border-radius: 6px; background: #fff; padding: 2px; flex-shrink: 0;
                }
                .cs-sel-name { font-weight: 700; font-size: 14px; color: #e2e8f0; }
                .cs-chevron { color: #475569; transition: transform 0.2s; flex-shrink: 0; }
                .cs-chevron-up { transform: rotate(180deg); color: #e2b340; }

                /* ===== CUSTOM SELECT LARGE ===== */
                .cs-trigger-lg {
                    padding: 14px 16px; border-radius: 14px;
                    min-height: 56px; border-width: 1.5px;
                }
                .cs-sel-logo-lg { width: 38px; height: 38px; border-radius: 10px; padding: 3px; }
                .cs-sel-name-lg { font-size: 16px; font-weight: 800; }
                .cs-placeholder-lg { font-size: 15px; }

                /* ===== DROPDOWN BASE ===== */
                .cs-dropdown {
                    position: absolute; top: calc(100% + 6px); left: 0; right: 0;
                    background: #0f172a; border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px; box-shadow: 0 16px 40px -8px rgba(0,0,0,0.6);
                    z-index: 50; overflow: hidden;
                }
                .cs-search-wrap { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .cs-search-icon { color: #334155; flex-shrink: 0; }
                .cs-search-input { flex: 1; background: none; border: none; outline: none; color: #e2e8f0; font-size: 13px; }
                .cs-search-input::placeholder { color: #334155; }
                .cs-options { max-height: 200px; overflow-y: auto; padding: 6px; }
                .cs-options::-webkit-scrollbar { width: 4px; }
                .cs-options::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
                .cs-option { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
                .cs-option:hover { background: rgba(255,255,255,0.05); }
                .cs-option-active { background: rgba(226,179,64,0.08); }
                .cs-option-active:hover { background: rgba(226,179,64,0.12); }
                .cs-opt-logo { width: 26px; height: 26px; object-fit: contain; border-radius: 5px; background: #fff; padding: 1px; flex-shrink: 0; }
                .cs-opt-name { flex: 1; font-size: 13px; font-weight: 600; color: #cbd5e1; }
                .cs-option-active .cs-opt-name { color: #e2b340; }
                .cs-opt-check { color: #e2b340; flex-shrink: 0; }
                .cs-empty { text-align: center; padding: 16px; color: #334155; font-size: 13px; }

                /* ===== DROPDOWN LARGE ===== */
                .cs-dropdown-lg { border-radius: 14px; box-shadow: 0 20px 50px -10px rgba(0,0,0,0.7); }
                .cs-search-wrap-lg { padding: 14px 16px; gap: 10px; }
                .cs-search-icon-lg { color: #475569; }
                .cs-search-input-lg { font-size: 15px; }
                .cs-options-lg { max-height: 260px; padding: 8px; }
                .cs-option-lg { padding: 11px 12px; border-radius: 10px; gap: 12px; }
                .cs-opt-logo-lg { width: 34px; height: 34px; border-radius: 8px; padding: 2px; }
                .cs-opt-name-lg { font-size: 14px; font-weight: 700; }
                .cs-opt-check-lg { width: 18px; height: 18px; }
                .cs-opt-city {
                    font-size: 11px; color: #475569; font-weight: 500;
                    display: flex; align-items: center; gap: 4px;
                }
                .cs-opt-city::before { content: "·"; }
                .cs-empty-lg { padding: 24px; font-size: 14px; }

                /* ===== PREVIEW BASE ===== */
                .nm-preview {
                    margin-top: 20px; padding: 24px 16px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005));
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 14px;
                    display: flex; align-items: center; justify-content: center; gap: 0;
                }
                .nm-preview-side { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .nm-preview-logo-wrap {
                    width: 68px; height: 68px; border-radius: 14px;
                    background: #fff; padding: 6px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .nm-preview-logo { width: 100%; height: 100%; object-fit: contain; }
                .nm-preview-logo-empty { background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.06); }
                .nm-preview-logo-empty span { font-size: 28px; color: #1e293b; font-weight: 800; }
                .nm-preview-name { font-weight: 800; font-size: 15px; color: #e2e8f0; text-align: center; line-height: 1.2; }
                .nm-preview-city { font-size: 11px; color: #475569; font-weight: 500; }
                .nm-preview-center { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 20px; flex-shrink: 0; }
                .nm-preview-line { width: 1px; height: 30px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent); }
                .nm-preview-vs-icon { color: #e2b340; opacity: 0.5; }
                .nm-preview-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .nm-warning { margin-top: 14px; text-align: center; padding: 10px; border-radius: 8px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); color: #f87171; font-size: 13px; font-weight: 600; }

                /* ===== PREVIEW LARGE ===== */
                .nm-preview-lg {
                    margin-top: 28px; padding: 36px 24px;
                    border-radius: 18px;
                    border: 1px solid rgba(226,179,64,0.06);
                    background: linear-gradient(135deg, rgba(226,179,64,0.02) 0%, rgba(255,255,255,0.01) 50%, rgba(226,179,64,0.02) 100%);
                }
                .nm-preview-logo-wrap-lg { width: 90px; height: 90px; border-radius: 18px; padding: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
                .nm-preview-logo-empty-lg span { font-size: 36px; }
                .nm-preview-name-lg { font-size: 18px; font-weight: 900; }
                .nm-preview-city-lg { font-size: 12px; }
                .nm-preview-stadium {
                    font-size: 11px; color: #334155; font-weight: 500;
                    display: flex; align-items: center; gap: 4px;
                    margin-top: 2px;
                }
                .nm-preview-stadium::before { content: "🏟"; font-size: 10px; }
                .nm-preview-center-lg { padding: 0 28px; gap: 10px; }
                .nm-preview-line-lg { height: 44px; }
                .nm-preview-vs-icon-lg { opacity: 0.4; }
                .nm-warning-lg { margin-top: 18px; padding: 12px; font-size: 14px; border-radius: 10px; }

                /* ===== SCOREBOARD (modal resultado — sin cambios) ===== */
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

                @media (max-width: 860px) {
                    .nm-card-wide { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
                    .nm-selects-row-lg { grid-template-columns: 1fr; gap: 12px; }
                    .nm-vs-badge-lg { padding-top: 0; }
                    .nm-vs-badge-lg span { padding: 10px 16px; font-size: 14px; }
                    .nm-preview-lg { padding: 24px 16px; flex-direction: column; gap: 16px; }
                    .nm-preview-logo-wrap-lg { width: 70px; height: 70px; border-radius: 14px; }
                    .nm-preview-name-lg { font-size: 16px; }
                    .nm-preview-center-lg { flex-direction: row; padding: 0; }
                    .nm-preview-line-lg { width: 40px; height: 1px; }
                    .nm-footer-wide { flex-direction: column-reverse; }
                    .nm-btn-cancel-lg, .nm-btn-ok-lg { width: 100%; text-align: center; justify-content: center !important; }
                }
                @media (max-width: 640px) {
                    .nm-card, .nm-score-card { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
                    .nm-selects-row { grid-template-columns: 1fr; gap: 8px; }
                    .nm-vs-badge { padding-top: 0; }
                    .nm-vs-badge span { padding: 6px 12px; font-size: 11px; }
                    .nm-preview-logo-wrap { width: 50px; height: 50px; border-radius: 10px; }
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
                    .result-action-btn span { display: none; }
                }
            `}</style>
        </div>
    );
};

export default ManageMatches;