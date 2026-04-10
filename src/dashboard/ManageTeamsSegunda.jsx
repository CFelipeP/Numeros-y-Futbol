import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  CircleDot, Target, Trophy, ChevronDown, Plus, Pencil, Trash2, Save, X,
  Goal, Search, User, Swords, Eye as EyeIcon, Star, ArrowRightLeft
} from "lucide-react";

const API = "http://localhost/Numeros-y-Futbol/backend/";
const DIVISION_LABEL = "Segunda División";

const ManageTeamsSegunda = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teamsOpen, setTeamsOpen] = useState(true);
    const location = useLocation();

    const [teams, setTeams] = useState([]);
    const [search, setSearch] = useState("");
    const [filterGrupo, setFilterGrupo] = useState("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
    }, [location.pathname]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${API}get_teams_segunda.php`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setTeams(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando equipos segunda:", err);
                setError(err.message);
                setTeams([]);
                setLoading(false);
            });
    }, []);

    const filteredTeams = teams.filter(t => {
        const matchSearch =
            t.nombre?.toLowerCase().includes(search.toLowerCase()) ||
            t.ciudad?.toLowerCase().includes(search.toLowerCase()) ||
            t.estadio?.toLowerCase().includes(search.toLowerCase());
        const matchGrupo =
            filterGrupo === "todos" ||
            (t.grupo || "").toLowerCase() === filterGrupo.toLowerCase();
        return matchSearch && matchGrupo;
    });

    const [showAdd, setShowAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [editSubmitting, setEditSubmitting] = useState(false);

    const [formNombre, setFormNombre] = useState("");
    const [formCiudad, setFormCiudad] = useState("");
    const [formEstadio, setFormEstadio] = useState("");
    const [formGrupo, setFormGrupo] = useState("East");
    const [formLogo, setFormLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const [editNombre, setEditNombre] = useState("");
    const [editCiudad, setEditCiudad] = useState("");
    const [editEstadio, setEditEstadio] = useState("");
    const [editGrupo, setEditGrupo] = useState("East");
    const [editLogo, setEditLogo] = useState(null);
    const [editLogoPreview, setEditLogoPreview] = useState(null);

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true,
            confirmButtonText: "Sí, salir", confirmButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        });
    };

    const openAdd = () => {
        setFormNombre(""); setFormCiudad(""); setFormEstadio("");
        setFormGrupo("East"); setFormLogo(null); setLogoPreview(null);
        setShowAdd(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
        if (!allowed.includes(file.type)) {
            Swal.fire({ icon: "error", title: "Formato no válido", text: "Solo JPG, PNG, WEBP o SVG", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
            return;
        }
        setFormLogo(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const addTeam = () => {
        if (!formNombre.trim()) {
            Swal.fire({ icon: "info", title: "El nombre es obligatorio", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
            return;
        }
        setSubmitting(true);
        const form = new FormData();
        form.append("nombre", formNombre);
        form.append("ciudad", formCiudad);
        form.append("estadio", formEstadio);
        form.append("grupo", formGrupo);
        if (formLogo) form.append("logo", formLogo);

        fetch(`${API}add_team_segunda.php`, { method: "POST", body: form })
            .then(() => {
                setSubmitting(false);
                setShowAdd(false);
                Swal.fire({ icon: "success", title: "Equipo creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false })
                    .then(() => window.location.reload());
            })
            .catch(err => {
                console.error("Error creando equipo:", err);
                setSubmitting(false);
                Swal.fire("Error", "No se pudo conectar al servidor", "error");
            });
    };

    const openEdit = (team) => {
        setEditingTeam(team);
        setEditNombre(team.nombre || "");
        setEditCiudad(team.ciudad || "");
        setEditEstadio(team.estadio || "");
        setEditGrupo(team.grupo || "East");
        setEditLogo(null);
        setEditLogoPreview(team.logo ? `${API}${team.logo}` : null);
        setShowEdit(true);
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
        if (!allowed.includes(file.type)) {
            Swal.fire({ icon: "error", title: "Formato no válido", text: "Solo JPG, PNG, WEBP o SVG", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
            return;
        }
        setEditLogo(file);
        setEditLogoPreview(URL.createObjectURL(file));
    };

    const saveEdit = () => {
        if (!editNombre.trim()) {
            Swal.fire({ icon: "info", title: "El nombre es obligatorio", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
            return;
        }
        setEditSubmitting(true);
        const form = new FormData();
        form.append("id", editingTeam.id);
        form.append("nombre", editNombre);
        form.append("ciudad", editCiudad);
        form.append("estadio", editEstadio);
        form.append("grupo", editGrupo);
        if (editLogo) form.append("logo", editLogo);

        fetch(`${API}update_team_segunda.php`, { method: "POST", body: form })
            .then(res => res.json())
            .then(data => {
                setEditSubmitting(false);
                if (data.error) {
                    Swal.fire("Error", data.error, "error");
                } else {
                    setShowEdit(false);
                    Swal.fire({ icon: "success", title: "Equipo actualizado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false })
                        .then(() => window.location.reload());
                }
            })
            .catch(err => {
                console.error("Error actualizando:", err);
                setEditSubmitting(false);
                Swal.fire("Error", "No se pudo conectar al servidor", "error");
            });
    };

    const deleteTeam = (id, nombre) => {
        Swal.fire({
            title: `¿Eliminar ${nombre}?`,
            html: `<p style="color:#94a3b8;font-size:14px;margin:0">Se eliminará de <b style="color:#22c55e">${DIVISION_LABEL}</b> y su escudo será borrado.</p>`,
            icon: "warning", showCancelButton: true,
            confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33", background: "#0f172a", color: "#e2e8f0", iconColor: "#ef4444"
        }).then((result) => {
            if (result.isConfirmed) {
                const form = new FormData();
                form.append("id", id);
                fetch(`${API}delete_team_segunda.php`, { method: "POST", body: form })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            Swal.fire("Error", data.error, "error");
                        } else {
                            setTeams(prev => prev.filter(t => t.id !== id));
                            Swal.fire({ icon: "success", title: `${nombre} eliminado`, toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
                        }
                    })
                    .catch(() => Swal.fire("Error", "No se pudo conectar al servidor", "error"));
            }
        });
    };

    const getGrupoBadge = (grupo) => {
        const g = (grupo || "").toLowerCase();
        if (g === "east") {
            return (
                <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 700,
                    background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
                    color: "#60a5fa", letterSpacing: "0.3px",
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
                    Este
                </span>
            );
        }
        if (g === "west") {
            return (
                <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 700,
                    background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",
                    color: "#fb923c", letterSpacing: "0.3px",
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", display: "inline-block" }} />
                    Oeste
                </span>
            );
        }
        return <span style={{ color: "#475569", fontSize: "12px" }}>—</span>;
    };

    const navItems = [
        { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
        { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
        {
            type: "dropdown", icon: <Shield size={20} />, label: "Equipos",
            children: [
                { path: "/teams/primera", label: "Primera División" },
                { path: "/teams/segunda", label: "Segunda División" },
                { path: "/teams/tercera", label: "Tercera División" },
            ]
        },
        { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
        { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
        { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
        { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
        { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
    ];

    const inputStyle = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
        color: '#e2e8f0', fontSize: '14px', outline: 'none', transition: 'all 0.2s',
        boxSizing: 'border-box',
    };

    const totalEast = teams.filter(t => (t.grupo || "").toLowerCase() === "east").length;
    const totalWest = teams.filter(t => (t.grupo || "").toLowerCase() === "west").length;

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
                                                <li key={child.path}>
                                                    <Link to={child.path} className={`nav-item${location.pathname === child.path ? " active" : ""}`} style={{ paddingLeft: "48px", fontSize: "13.5px" }}>{child.label}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                );
                            }
                            return (
                                <li key={item.path}>
                                    <Link to={item.path} className={`nav-item${location.pathname === item.path ? " active" : ""}`}>{item.icon} {item.label}</Link>
                                </li>
                            );
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
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar equipo..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </header>

                <div className="content-wrapper">
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.2rem", flexWrap: "wrap" }}>
                        <h1 className="admin-title" style={{ margin: 0 }}>Gestionar Equipos</h1>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: "13px", fontWeight: 700 }}>
                            <Shield size={13} /> {DIVISION_LABEL}
                        </span>
                    </div>

                    {/* Stats */}
                    {!loading && !error && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "1.2rem" }}>
                            <div style={{ padding: "16px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Shield size={18} style={{ color: "#22c55e" }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>{teams.length}</div>
                                    <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>Total</div>
                                </div>
                            </div>
                            <div style={{ padding: "16px 18px", borderRadius: "12px", background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)", display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#3b82f6" }}>E</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#60a5fa", lineHeight: 1 }}>{totalEast}</div>
                                    <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>Grupo Este</div>
                                </div>
                            </div>
                            <div style={{ padding: "16px 18px", borderRadius: "12px", background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.12)", display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: 40, height: 40, borderRadius: "10px", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#f97316" }}>O</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#fb923c", lineHeight: 1 }}>{totalWest}</div>
                                    <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>Grupo Oeste</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{ padding: "16px 20px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", marginBottom: "1rem", color: "#f87171", fontSize: "14px" }}>
                            <strong>Error:</strong> No se encontró <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>get_teams_segunda.php</code> en backend/. Detalle: {error}
                        </div>
                    )}

                    <div className="table-container">
                        <div className="table-header" style={{ flexWrap: "wrap", gap: "10px" }}>
                            <h2 style={{ flex: "1 1 auto" }}>
                                Lista de Equipos
                                {search && <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', marginLeft: '10px' }}>{filteredTeams.length} resultado{filteredTeams.length !== 1 ? 's' : ''}</span>}
                            </h2>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    {[
                                        { key: "todos", label: "Todos", color: "#94a3b8" },
                                        { key: "east", label: "Este", color: "#60a5fa" },
                                        { key: "west", label: "Oeste", color: "#fb923c" },
                                    ].map(f => (
                                        <button
                                            key={f.key}
                                            onClick={() => setFilterGrupo(f.key)}
                                            style={{
                                                padding: "7px 16px", fontSize: "12px", fontWeight: 700,
                                                border: "none", cursor: "pointer", transition: "all 0.2s",
                                                background: filterGrupo === f.key
                                                    ? f.key === "todos" ? "rgba(255,255,255,0.08)" : f.key === "east" ? "rgba(59,130,246,0.15)" : "rgba(249,115,22,0.15)"
                                                    : "transparent",
                                                color: filterGrupo === f.key ? f.color : "#475569",
                                            }}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                                <button className="btn-add" onClick={openAdd}><Plus size={18} /> Nuevo Equipo</button>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#22c55e", animation: "tmSpin 0.8s linear infinite", margin: "0 auto 1rem" }} />
                                <span style={{ fontSize: "0.85rem" }}>Cargando equipos...</span>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px' }}>Escudo</th>
                                        <th>Nombre</th>
                                        <th>Grupo</th>
                                        <th>Ciudad</th>
                                        <th>Estadio</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTeams.map((team) => (
                                        <tr key={team.id}>
                                            <td>
                                                <img src={`${API}${team.logo}`} alt={team.nombre} onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '8px', background: '#fff', padding: '2px' }} />
                                            </td>
                                            <td style={{ fontWeight: '700' }}>{team.nombre}</td>
                                            <td>{getGrupoBadge(team.grupo)}</td>
                                            <td style={{ color: '#94a3b8' }}>{team.ciudad || '—'}</td>
                                            <td style={{ color: '#94a3b8' }}>{team.estadio || '—'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button className="team-btn-edit-green" onClick={() => openEdit(team)} title="Editar"><Save size={14} /><span>Editar</span></button>
                                                    <button className="btn-delete" onClick={() => deleteTeam(team.id, team.nombre)} title="Eliminar"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {!loading && filteredTeams.length === 0 && !error && (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#475569' }}>
                                <Shield size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.2 }} />
                                <p style={{ fontWeight: 600, color: '#64748b' }}>
                                    {search || filterGrupo !== "todos"
                                        ? `Sin resultados${filterGrupo !== "todos" ? ` en Grupo ${filterGrupo === "east" ? "Este" : "Oeste"}` : ''}${search ? ` para "${search}"` : ''}`
                                        : 'No hay equipos en ' + DIVISION_LABEL}
                                </p>
                                <p style={{ fontSize: '13px', marginTop: '4px' }}>
                                    {search || filterGrupo !== "todos" ? 'Intenta con otros filtros' : 'Agrega tu primer equipo'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal Agregar */}
            {showAdd && (
                <div className="tm-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}>
                    <div className="tm-card animate__animated animate__fadeInUp">
                        <div className="tm-header tm-header-green">
                            <div>
                                <h2><Plus size={18} style={{ color: '#22c55e' }} /> Nuevo Equipo</h2>
                                <p className="tm-division-hint">Se agregará a <b>{DIVISION_LABEL}</b></p>
                            </div>
                            <button className="tm-close" onClick={() => setShowAdd(false)}><X size={18} /></button>
                        </div>
                        <div className="tm-body">
                            <div className="tm-grid">
                                <div className="tm-fields">
                                    <div className="tm-field">
                                        <label>Nombre del Equipo <span className="tm-required-green">*</span></label>
                                        <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} placeholder="Ej: C.D. Águila" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                                    </div>
                                    <div className="tm-field">
                                        <label>Grupo <span className="tm-required-green">*</span></label>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            {[
                                                { val: "East", label: "Este", isEast: true },
                                                { val: "West", label: "Oeste", isEast: false },
                                            ].map(g => {
                                                const isActive = formGrupo === g.val;
                                                return (
                                                    <button
                                                        key={g.val}
                                                        type="button"
                                                        onClick={() => setFormGrupo(g.val)}
                                                        style={{
                                                            flex: 1, padding: "12px 14px", borderRadius: "10px",
                                                            border: `1.5px solid ${isActive ? (g.isEast ? "rgba(59,130,246,0.5)" : "rgba(249,115,22,0.5)") : "rgba(255,255,255,0.08)"}`,
                                                            background: isActive ? (g.isEast ? "rgba(59,130,246,0.12)" : "rgba(249,115,22,0.12)") : "rgba(255,255,255,0.03)",
                                                            color: isActive ? (g.isEast ? "#60a5fa" : "#fb923c") : "#475569",
                                                            fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s",
                                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                                        }}
                                                    >
                                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? (g.isEast ? "#3b82f6" : "#f97316") : "transparent", border: `1.5px solid ${g.isEast ? "#3b82f6" : "#f97316"}`, transition: "all 0.2s" }} />
                                                        {g.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="tm-field">
                                        <label>Ciudad</label>
                                        <input type="text" value={formCiudad} onChange={(e) => setFormCiudad(e.target.value)} placeholder="Ej: San Miguel" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                                    </div>
                                    <div className="tm-field">
                                        <label>Estadio</label>
                                        <input type="text" value={formEstadio} onChange={(e) => setFormEstadio(e.target.value)} placeholder="Ej: Estadio Juan Francisco Barraza" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                                    </div>
                                </div>
                                <div className="tm-logo-section">
                                    <div className="tm-logo-preview-wrap tm-logo-preview-green">
                                        {logoPreview ? <img src={logoPreview} alt="Preview" className="tm-logo-preview-img" /> : (
                                            <div className="tm-logo-preview-empty"><Image size={32} style={{ color: '#1e293b' }} /><span style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>Sin escudo</span></div>
                                        )}
                                    </div>
                                    <div className="tm-upload-area">
                                        <input type="file" id="tm-logo-input-seg" accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml" onChange={handleFileChange} />
                                        <label htmlFor="tm-logo-input-seg" className="tm-upload-label tm-upload-green"><Upload size={18} /><span>{formLogo ? formLogo.name : "Seleccionar escudo"}</span></label>
                                        <span className="tm-upload-hint">JPG, PNG, WEBP o SVG</span>
                                    </div>
                                    {formLogo && <button className="tm-remove-logo tm-remove-green" onClick={() => { setFormLogo(null); setLogoPreview(null); document.getElementById('tm-logo-input-seg').value = ''; }}>Quitar escudo</button>}
                                </div>
                            </div>
                        </div>
                        <div className="tm-footer">
                            <button className="tm-btn-cancel" onClick={() => setShowAdd(false)}>Cancelar</button>
                            <button className="tm-btn-save tm-btn-green" onClick={addTeam} disabled={submitting || !formNombre.trim()} style={{ opacity: (!formNombre.trim() || submitting) ? 0.35 : 1, cursor: (!formNombre.trim() || submitting) ? 'not-allowed' : 'pointer' }}>
                                {submitting ? <span className="tm-spin" /> : <><CheckCircle2 size={16} /> Crear Equipo</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {showEdit && editingTeam && (
                <div className="tm-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowEdit(false); }}>
                    <div className="tm-card animate__animated animate__fadeInUp">
                        <div className="tm-header tm-header-green-light">
                            <div>
                                <h2><Save size={18} style={{ color: '#22c55e' }} /> Editar Equipo</h2>
                                <p className="tm-division-hint">Editando en <b>{DIVISION_LABEL}</b></p>
                            </div>
                            <button className="tm-close" onClick={() => setShowEdit(false)}><X size={18} /></button>
                        </div>
                        <div className="tm-body">
                            <div className="tm-grid">
                                <div className="tm-fields">
                                    <div className="tm-field">
                                        <label>Nombre del Equipo <span className="tm-required-green">*</span></label>
                                        <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                                    </div>
                                    <div className="tm-field">
                                        <label>Grupo <span className="tm-required-green">*</span></label>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            {[
                                                { val: "East", label: "Este", isEast: true },
                                                { val: "West", label: "Oeste", isEast: false },
                                            ].map(g => {
                                                const isActive = editGrupo === g.val;
                                                return (
                                                    <button
                                                        key={g.val}
                                                        type="button"
                                                        onClick={() => setEditGrupo(g.val)}
                                                        style={{
                                                            flex: 1, padding: "12px 14px", borderRadius: "10px",
                                                            border: `1.5px solid ${isActive ? (g.isEast ? "rgba(59,130,246,0.5)" : "rgba(249,115,22,0.5)") : "rgba(255,255,255,0.08)"}`,
                                                            background: isActive ? (g.isEast ? "rgba(59,130,246,0.12)" : "rgba(249,115,22,0.12)") : "rgba(255,255,255,0.03)",
                                                            color: isActive ? (g.isEast ? "#60a5fa" : "#fb923c") : "#475569",
                                                            fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.2s",
                                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                                        }}
                                                    >
                                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? (g.isEast ? "#3b82f6" : "#f97316") : "transparent", border: `1.5px solid ${g.isEast ? "#3b82f6" : "#f97316"}`, transition: "all 0.2s" }} />
                                                        {g.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="tm-field">
                                        <label>Ciudad</label>
                                        <input type="text" value={editCiudad} onChange={(e) => setEditCiudad(e.target.value)} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                                    </div>
                                    <div className="tm-field">
                                        <label>Estadio</label>
                                        <input type="text" value={editEstadio} onChange={(e) => setEditEstadio(e.target.value)} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = '#22c55e'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
                                    </div>
                                </div>
                                <div className="tm-logo-section">
                                    <div className="tm-logo-preview-wrap tm-logo-preview-green">
                                        {editLogoPreview ? <img src={editLogoPreview} alt="Preview" className="tm-logo-preview-img" onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=EQ&background=1e293b&color=475569&size=80&bold=true"; }} /> : (
                                            <div className="tm-logo-preview-empty"><Image size={32} style={{ color: '#1e293b' }} /><span style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>Sin escudo</span></div>
                                        )}
                                    </div>
                                    <div className="tm-upload-area">
                                        <input type="file" id="tm-edit-logo-input-seg" accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml" onChange={handleEditFileChange} />
                                        <label htmlFor="tm-edit-logo-input-seg" className="tm-upload-label tm-upload-green"><Upload size={18} /><span>{editLogo ? editLogo.name : "Cambiar escudo"}</span></label>
                                        <span className="tm-upload-hint">JPG, PNG, WEBP o SVG</span>
                                    </div>
                                    {editLogo && <button className="tm-remove-logo tm-remove-green" onClick={() => { setEditLogo(null); setEditLogoPreview(editingTeam.logo ? `${API}${editingTeam.logo}` : null); document.getElementById('tm-edit-logo-input-seg').value = ''; }}>Restaurar original</button>}
                                </div>
                            </div>
                        </div>
                        <div className="tm-footer">
                            <button className="tm-btn-cancel" onClick={() => setShowEdit(false)}>Cancelar</button>
                            <button className="tm-btn-save tm-btn-green" onClick={saveEdit} disabled={editSubmitting || !editNombre.trim()} style={{ opacity: (!editNombre.trim() || editSubmitting) ? 0.35 : 1, cursor: (!editNombre.trim() || editSubmitting) ? 'not-allowed' : 'pointer' }}>
                                {editSubmitting ? <span className="tm-spin" /> : <><Save size={16} /> Guardar Cambios</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .tm-division-hint { margin: 4px 0 0 0; font-size: 12px; color: #475569; font-weight: 500; }
                .tm-division-hint b { color: #64748b; }
                .team-btn-edit-green { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(34,197,94,0.25); background: rgba(34,197,94,0.1); color: #4ade80; white-space: nowrap; }
                .team-btn-edit-green:hover { background: rgba(34,197,94,0.2); border-color: rgba(34,197,94,0.4); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(34,197,94,0.2); }
                .tm-overlay { position: fixed; inset: 0; background: rgba(2,6,15,0.82); backdrop-filter: blur(10px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
                .tm-card { background: #0b1120; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; width: 580px; max-width: 95vw; max-height: 92vh; display: flex; flex-direction: column; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.7); overflow: hidden; }
                .tm-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.015); }
                .tm-header h2 { margin: 0; font-size: 1.05rem; color: #f1f5f9; display: flex; align-items: center; gap: 8px; }
                .tm-header-green { border-bottom-color: rgba(34,197,94,0.12); background: rgba(34,197,94,0.03); }
                .tm-header-green-light { border-bottom-color: rgba(34,197,94,0.08); background: rgba(34,197,94,0.02); }
                .tm-close { background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; color: #64748b; transition: all 0.25s; }
                .tm-close:hover { background: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.3); transform: rotate(90deg); }
                .tm-body { padding: 24px; overflow-y: auto; flex: 1; }
                .tm-body::-webkit-scrollbar { width: 5px; }
                .tm-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
                .tm-grid { display: grid; grid-template-columns: 1fr 160px; gap: 24px; }
                .tm-fields { display: grid; gap: 16px; }
                .tm-field label { display: block; margin-bottom: 7px; font-weight: 600; color: #94a3b8; font-size: 13px; }
                .tm-required-green { color: #22c55e; }
                .tm-field input::placeholder { color: #334155; }
                .tm-logo-section { display: flex; flex-direction: column; align-items: center; gap: 14px; }
                .tm-logo-preview-wrap { width: 120px; height: 120px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; overflow: hidden; transition: all 0.3s; }
                .tm-logo-preview-wrap:has(img) { border-style: solid; background: rgba(34,197,94,0.04); }
                .tm-logo-preview-wrap.tm-logo-preview-green:has(img) { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.04); }
                .tm-logo-preview-img { width: 100%; height: 100%; object-fit: contain; padding: 12px; }
                .tm-logo-preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .tm-upload-area { width: 100%; }
                .tm-upload-area input[type="file"] { position: absolute; opacity: 0; width: 0; height: 0; }
                .tm-upload-label { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .tm-upload-label span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #94a3b8; font-weight: 500; }
                .tm-upload-green { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.04); color: #4ade80; }
                .tm-upload-green:hover { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.08); box-shadow: 0 0 16px rgba(34,197,94,0.1); }
                .tm-upload-hint { display: block; text-align: center; font-size: 11px; color: #334155; margin-top: 4px; }
                .tm-remove-logo { padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #475569; background: transparent; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s; }
                .tm-remove-green:hover { color: #4ade80; border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.06); }
                .tm-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.015); }
                .tm-btn-cancel { padding: 10px 22px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; background: transparent; color: #64748b; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
                .tm-btn-cancel:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
                .tm-btn-save { display: inline-flex; align-items: center; gap: 7px; padding: 10px 24px; border-radius: 8px; border: none; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; }
                .tm-btn-green { background: linear-gradient(135deg, #16a34a, #15803d); box-shadow: 0 4px 16px rgba(22,163,74,0.3); }
                .tm-btn-green:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(22,163,74,0.4); }
                .tm-spin { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: tmSpin 0.6s linear infinite; }
                @keyframes tmSpin { to { transform: rotate(360deg); } }
                button.nav-item { background: none; border: none; color: var(--text-muted); font-family: inherit; }
                @media (max-width: 640px) {
                    .tm-card { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
                    .tm-grid { grid-template-columns: 1fr; }
                    .tm-logo-section { flex-direction: row; flex-wrap: wrap; justify-content: center; }
                    .tm-logo-preview-wrap { width: 100px; height: 100px; }
                    .tm-upload-area { flex: 1; min-width: 140px; }
                    .tm-footer { flex-direction: column-reverse; }
                    .tm-btn-cancel, .tm-btn-save { width: 100%; text-align: center; justify-content: center; }
                    .team-btn-edit-green span { display: none; }
                }
            `}</style>
        </div>
    );
};

export default ManageTeamsSegunda;