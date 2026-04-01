// ========== ManageTeams.jsx ==========
import React, { useState, useEffect } from "react";
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
    Edit,
    X,
    Upload,
    Image,
    CheckCircle2,
    Save
} from "lucide-react";

const ManageTeams = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const [teams, setTeams] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("http://localhost/Numeros-y-Futbol/backend/get_teams.php")
            .then(res => res.json())
            .then(data => setTeams(data));
    }, []);

    const filteredTeams = teams.filter(t =>
        t.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        t.ciudad?.toLowerCase().includes(search.toLowerCase()) ||
        t.estadio?.toLowerCase().includes(search.toLowerCase())
    );

    const [showAdd, setShowAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [editSubmitting, setEditSubmitting] = useState(false);

    const [formNombre, setFormNombre] = useState("");
    const [formCiudad, setFormCiudad] = useState("");
    const [formEstadio, setFormEstadio] = useState("");
    const [formLogo, setFormLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const [editNombre, setEditNombre] = useState("");
    const [editCiudad, setEditCiudad] = useState("");
    const [editEstadio, setEditEstadio] = useState("");
    const [editLogo, setEditLogo] = useState(null);
    const [editLogoPreview, setEditLogoPreview] = useState(null);

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir",
            confirmButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        });
    };

    const openAdd = () => {
        setFormNombre(""); setFormCiudad(""); setFormEstadio("");
        setFormLogo(null); setLogoPreview(null);
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
        if (formLogo) form.append("logo", formLogo);

        fetch("http://localhost/Numeros-y-Futbol/backend/add_team.php", { method: "POST", body: form })
            .then(() => {
                setSubmitting(false);
                setShowAdd(false);
                Swal.fire({ icon: "success", title: "Equipo creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false })
                    .then(() => window.location.reload());
            })
            .catch(() => { setSubmitting(false); Swal.fire("Error", "Error de conexión", "error"); });
    };

    const openEdit = (team) => {
        setEditingTeam(team);
        setEditNombre(team.nombre || "");
        setEditCiudad(team.ciudad || "");
        setEditEstadio(team.estadio || "");
        setEditLogo(null);
        setEditLogoPreview(team.logo ? `http://localhost/Numeros-y-Futbol/backend/${team.logo}` : null);
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
        if (editLogo) form.append("logo", editLogo);

        fetch("http://localhost/Numeros-y-Futbol/backend/update_team.php", { method: "POST", body: form })
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
            .catch(() => { setEditSubmitting(false); Swal.fire("Error", "Error de conexión", "error"); });
    };

    const deleteTeam = (id, nombre) => {
        Swal.fire({
            title: `¿Eliminar ${nombre}?`,
            html: `<p style="color:#94a3b8;font-size:14px;margin:0">Se eliminará de la base de datos y su escudo será borrado del servidor. Esta acción no se puede deshacer.</p>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            background: "#0f172a",
            color: "#e2e8f0",
            iconColor: "#ef4444"
        }).then((result) => {
            if (result.isConfirmed) {
                const form = new FormData();
                form.append("id", id);

                fetch("http://localhost/Numeros-y-Futbol/backend/delete_team.php", {
                    method: "POST",
                    body: form
                })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        Swal.fire("Error", data.error, "error");
                    } else {
                        // Quitar de la lista sin recargar
                        setTeams(prev => prev.filter(t => t.id !== id));
                        Swal.fire({
                            icon: "success",
                            title: `${nombre} eliminado`,
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                })
                .catch(() => {
                    Swal.fire("Error", "Error de conexión", "error");
                });
            }
        });
    };

    const navItems = [
        { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
        { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
        { path: "/teams", icon: <Shield size={20} />, label: "Equipos" },
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

    const blueInputStyle = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
        color: '#e2e8f0', fontSize: '14px', outline: 'none', transition: 'all 0.2s',
        boxSizing: 'border-box',
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
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar equipo..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </header>

                <div className="content-wrapper">
                    <h1 className="admin-title">Gestionar Equipos</h1>

                    <div className="table-container">
                        <div className="table-header">
                            <h2>
                                Lista de Equipos
                                {search && (
                                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', marginLeft: '10px' }}>
                                        {filteredTeams.length} resultado{filteredTeams.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </h2>
                            <button className="btn-add" onClick={openAdd}>
                                <Plus size={18} /> Nuevo Equipo
                            </button>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '60px' }}>Escudo</th>
                                    <th>Nombre</th>
                                    <th>Ciudad</th>
                                    <th>Estadio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeams.map((team) => (
                                    <tr key={team.id}>
                                        <td>
                                            <img
                                                src={`http://localhost/Numeros-y-Futbol/backend/${team.logo}`}
                                                alt={team.nombre}
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '8px', background: '#fff', padding: '2px' }}
                                            />
                                        </td>
                                        <td style={{ fontWeight: '700' }}>{team.nombre}</td>
                                        <td style={{ color: '#94a3b8' }}>{team.ciudad || '—'}</td>
                                        <td style={{ color: '#94a3b8' }}>{team.estadio || '—'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="team-btn-edit" onClick={() => openEdit(team)} title="Editar equipo">
                                                    <Save size={14} />
                                                    <span>Editar</span>
                                                </button>
                                                <button className="btn-delete" onClick={() => deleteTeam(team.id, team.nombre)} title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredTeams.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#475569' }}>
                                <Shield size={40} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.2 }} />
                                <p style={{ fontWeight: 600, color: '#64748b' }}>
                                    {search ? 'Sin resultados para "' + search + '"' : 'No hay equipos registrados'}
                                </p>
                                <p style={{ fontSize: '13px', marginTop: '4px' }}>
                                    {search ? 'Intenta con otro término de búsqueda' : 'Agrega tu primer equipo'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {showAdd && (
                <div className="tm-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}>
                    <div className="tm-card animate__animated animate__fadeInUp">
                        <div className="tm-header tm-header-red">
                            <h2><Plus size={18} style={{ color: '#ef4444' }} /> Nuevo Equipo</h2>
                            <button className="tm-close" onClick={() => setShowAdd(false)}><X size={18} /></button>
                        </div>
                        <div className="tm-body">
                            <div className="tm-grid">
                                <div className="tm-fields">
                                    <div className="tm-field">
                                        <label>Nombre del Equipo <span className="tm-required">*</span></label>
                                        <input type="text" value={formNombre} onChange={(e) => setFormNombre(e.target.value)}
                                            placeholder="Ej: C.D. Águila" style={inputStyle}
                                            onFocus={(e) => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                    <div className="tm-field">
                                        <label>Ciudad</label>
                                        <input type="text" value={formCiudad} onChange={(e) => setFormCiudad(e.target.value)}
                                            placeholder="Ej: San Miguel" style={inputStyle}
                                            onFocus={(e) => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                    <div className="tm-field">
                                        <label>Estadio</label>
                                        <input type="text" value={formEstadio} onChange={(e) => setFormEstadio(e.target.value)}
                                            placeholder="Ej: Estadio Juan Francisco Barraza" style={inputStyle}
                                            onFocus={(e) => { e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                </div>
                                <div className="tm-logo-section">
                                    <div className="tm-logo-preview-wrap">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="tm-logo-preview-img" />
                                        ) : (
                                            <div className="tm-logo-preview-empty">
                                                <Image size={32} style={{ color: '#1e293b' }} />
                                                <span style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>Sin escudo</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="tm-upload-area">
                                        <input type="file" id="tm-logo-input" accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml" onChange={handleFileChange} />
                                        <label htmlFor="tm-logo-input" className="tm-upload-label tm-upload-red">
                                            <Upload size={18} />
                                            <span>{formLogo ? formLogo.name : "Seleccionar escudo"}</span>
                                        </label>
                                        <span className="tm-upload-hint">JPG, PNG, WEBP o SVG</span>
                                    </div>
                                    {formLogo && (
                                        <button className="tm-remove-logo" onClick={() => { setFormLogo(null); setLogoPreview(null); document.getElementById('tm-logo-input').value = ''; }}>
                                            Quitar escudo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="tm-footer">
                            <button className="tm-btn-cancel" onClick={() => setShowAdd(false)}>Cancelar</button>
                            <button className="tm-btn-save tm-btn-red" onClick={addTeam}
                                disabled={submitting || !formNombre.trim()}
                                style={{ opacity: (!formNombre.trim() || submitting) ? 0.35 : 1, cursor: (!formNombre.trim() || submitting) ? 'not-allowed' : 'pointer' }}>
                                {submitting ? <span className="tm-spin" /> : <><CheckCircle2 size={16} /> Crear Equipo</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEdit && editingTeam && (
                <div className="tm-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowEdit(false); }}>
                    <div className="tm-card animate__animated animate__fadeInUp">
                        <div className="tm-header tm-header-blue">
                            <h2><Save size={18} style={{ color: '#3b82f6' }} /> Editar Equipo</h2>
                            <button className="tm-close" onClick={() => setShowEdit(false)}><X size={18} /></button>
                        </div>
                        <div className="tm-body">
                            <div className="tm-grid">
                                <div className="tm-fields">
                                    <div className="tm-field">
                                        <label>Nombre del Equipo <span className="tm-required-blue">*</span></label>
                                        <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)}
                                            style={blueInputStyle}
                                            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                    <div className="tm-field">
                                        <label>Ciudad</label>
                                        <input type="text" value={editCiudad} onChange={(e) => setEditCiudad(e.target.value)}
                                            style={blueInputStyle}
                                            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                    <div className="tm-field">
                                        <label>Estadio</label>
                                        <input type="text" value={editEstadio} onChange={(e) => setEditEstadio(e.target.value)}
                                            style={blueInputStyle}
                                            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                </div>
                                <div className="tm-logo-section">
                                    <div className="tm-logo-preview-wrap tm-logo-preview-blue">
                                        {editLogoPreview ? (
                                            <img src={editLogoPreview} alt="Preview" className="tm-logo-preview-img"
                                                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=EQ&background=1e293b&color=475569&size=80&bold=true"; }}
                                            />
                                        ) : (
                                            <div className="tm-logo-preview-empty">
                                                <Image size={32} style={{ color: '#1e293b' }} />
                                                <span style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>Sin escudo</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="tm-upload-area">
                                        <input type="file" id="tm-edit-logo-input" accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml" onChange={handleEditFileChange} />
                                        <label htmlFor="tm-edit-logo-input" className="tm-upload-label tm-upload-blue">
                                            <Upload size={18} />
                                            <span>{editLogo ? editLogo.name : "Cambiar escudo"}</span>
                                        </label>
                                        <span className="tm-upload-hint">JPG, PNG, WEBP o SVG</span>
                                    </div>
                                    {editLogo && (
                                        <button className="tm-remove-logo tm-remove-blue" onClick={() => {
                                            setEditLogo(null);
                                            setEditLogoPreview(editingTeam.logo ? `http://localhost/Numeros-y-Futbol/backend/${editingTeam.logo}` : null);
                                            document.getElementById('tm-edit-logo-input').value = '';
                                        }}>
                                            Restaurar original
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="tm-footer">
                            <button className="tm-btn-cancel" onClick={() => setShowEdit(false)}>Cancelar</button>
                            <button className="tm-btn-save tm-btn-blue" onClick={saveEdit}
                                disabled={editSubmitting || !editNombre.trim()}
                                style={{ opacity: (!editNombre.trim() || editSubmitting) ? 0.35 : 1, cursor: (!editNombre.trim() || editSubmitting) ? 'not-allowed' : 'pointer' }}>
                                {editSubmitting ? <span className="tm-spin" /> : <><Save size={16} /> Guardar Cambios</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .team-btn-edit {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 6px 14px; border-radius: 6px; font-size: 12px;
                    font-weight: 700; cursor: pointer; transition: all 0.2s;
                    border: 1px solid rgba(59,130,246,0.25);
                    background: rgba(59,130,246,0.1);
                    color: #60a5fa; white-space: nowrap;
                }
                .team-btn-edit:hover {
                    background: rgba(59,130,246,0.2);
                    border-color: rgba(59,130,246,0.4);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 14px rgba(59,130,246,0.2);
                }
                .tm-overlay {
                    position: fixed; inset: 0; background: rgba(2,6,15,0.82);
                    backdrop-filter: blur(10px); display: flex;
                    justify-content: center; align-items: center; z-index: 1000;
                }
                .tm-card {
                    background: #0b1120; border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 18px; width: 560px; max-width: 95vw;
                    max-height: 92vh; display: flex; flex-direction: column;
                    box-shadow: 0 25px 60px -12px rgba(0,0,0,0.7);
                    overflow: hidden;
                }
                .tm-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.015);
                }
                .tm-header h2 {
                    margin: 0; font-size: 1.05rem; color: #f1f5f9;
                    display: flex; align-items: center; gap: 8px;
                }
                .tm-header-red { border-bottom-color: rgba(239,68,68,0.08); background: rgba(239,68,68,0.02); }
                .tm-header-blue { border-bottom-color: rgba(59,130,246,0.08); background: rgba(59,130,246,0.02); }
                .tm-close {
                    background: none; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px; cursor: pointer; display: flex;
                    align-items: center; justify-content: center;
                    width: 32px; height: 32px; color: #64748b; transition: all 0.25s;
                }
                .tm-close:hover {
                    background: rgba(239,68,68,0.15); color: #ef4444;
                    border-color: rgba(239,68,68,0.3); transform: rotate(90deg);
                }
                .tm-body { padding: 24px; overflow-y: auto; flex: 1; }
                .tm-body::-webkit-scrollbar { width: 5px; }
                .tm-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
                .tm-grid { display: grid; grid-template-columns: 1fr 160px; gap: 24px; }
                .tm-fields { display: grid; gap: 16px; }
                .tm-field label { display: block; margin-bottom: 7px; font-weight: 600; color: #94a3b8; font-size: 13px; }
                .tm-required { color: #ef4444; }
                .tm-required-blue { color: #3b82f6; }
                .tm-field input::placeholder { color: #334155; }
                .tm-logo-section { display: flex; flex-direction: column; align-items: center; gap: 14px; }
                .tm-logo-preview-wrap {
                    width: 120px; height: 120px; border-radius: 14px;
                    background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.06);
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden; transition: all 0.3s;
                }
                .tm-logo-preview-wrap:has(img) { border-style: solid; background: rgba(239,68,68,0.04); }
                .tm-logo-preview-wrap.tm-logo-preview-blue:has(img) { border-color: rgba(59,130,246,0.2); background: rgba(59,130,246,0.04); }
                .tm-logo-preview-img { width: 100%; height: 100%; object-fit: contain; padding: 12px; }
                .tm-logo-preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .tm-upload-area { width: 100%; }
                .tm-upload-area input[type="file"] { position: absolute; opacity: 0; width: 0; height: 0; }
                .tm-upload-label {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 12px; border-radius: 8px;
                    border: 1px dashed rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.03);
                    font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
                }
                .tm-upload-label span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #94a3b8; font-weight: 500; }
                .tm-upload-red { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.04); color: #f87171; }
                .tm-upload-red:hover { border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.08); box-shadow: 0 0 16px rgba(239,68,68,0.1); }
                .tm-upload-blue { border-color: rgba(59,130,246,0.2); background: rgba(59,130,246,0.04); color: #60a5fa; }
                .tm-upload-blue:hover { border-color: rgba(59,130,246,0.4); background: rgba(59,130,246,0.08); box-shadow: 0 0 16px rgba(59,130,246,0.1); }
                .tm-upload-hint { display: block; text-align: center; font-size: 11px; color: #334155; margin-top: 4px; }
                .tm-remove-logo {
                    padding: 5px 12px; border-radius: 6px; font-size: 11px;
                    font-weight: 600; color: #475569; background: transparent;
                    border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s;
                }
                .tm-remove-logo:hover { color: #f87171; border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.06); }
                .tm-remove-blue:hover { color: #60a5fa; border-color: rgba(59,130,246,0.2); background: rgba(59,130,246,0.06); }
                .tm-footer {
                    display: flex; justify-content: flex-end; gap: 10px;
                    padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.015);
                }
                .tm-btn-cancel {
                    padding: 10px 22px; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px; background: transparent; color: #64748b;
                    font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s;
                }
                .tm-btn-cancel:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
                .tm-btn-save {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 10px 24px; border-radius: 8px; border: none;
                    color: #fff; font-weight: 700; font-size: 14px;
                    cursor: pointer; transition: all 0.2s;
                }
                .tm-btn-red {
                    background: linear-gradient(135deg, #dc2626, #b91c1c);
                    box-shadow: 0 4px 16px rgba(220,38,38,0.3);
                }
                .tm-btn-red:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(220,38,38,0.4); }
                .tm-btn-blue {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    box-shadow: 0 4px 16px rgba(37,99,235,0.3);
                }
                .tm-btn-blue:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(37,99,235,0.4); }
                .tm-spin {
                    display: inline-block; width: 18px; height: 18px;
                    border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff;
                    border-radius: 50%; animation: tmSpin 0.6s linear infinite;
                }
                @keyframes tmSpin { to { transform: rotate(360deg); } }

                @media (max-width: 640px) {
                    .tm-card { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
                    .tm-grid { grid-template-columns: 1fr; }
                    .tm-logo-section { flex-direction: row; flex-wrap: wrap; justify-content: center; }
                    .tm-logo-preview-wrap { width: 100px; height: 100px; }
                    .tm-upload-area { flex: 1; min-width: 140px; }
                    .tm-footer { flex-direction: column-reverse; }
                    .tm-btn-cancel, .tm-btn-save { width: 100%; text-align: center; justify-content: center; }
                    .team-btn-edit span { display: none; }
                }
            `}</style>
        </div>
    );
};

export default ManageTeams;