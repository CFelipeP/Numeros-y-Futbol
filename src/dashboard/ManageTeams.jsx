import React, { useState } from "react";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

// IMPORTAR ICONOS DE LUCIDE REACT
import {
    LayoutDashboard,
    CalendarDays,
    Shield,
    Newspaper,
    Users as UsersIcon,
    Settings,
    LogOut,
    Menu,
    Plus,
    Trash2,
    Edit,
    Image
} from "lucide-react";

const ManageTeams = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Estado inicial de equipos (con logos de ejemplo de Sofascore)
    const [teams, setTeams] = useState([
        { id: 1, name: "C.D. Águila", logo: "https://img.sofascore.com/api/v1/team/24385/image", city: "San Miguel" },
        { id: 2, name: "C.D. FAS", logo: "https://img.sofascore.com/api/v1/team/24386/image", city: "Santa Ana" },
        { id: 3, name: "Alianza F.C.", logo: "https://img.sofascore.com/api/v1/team/24383/image", city: "San Salvador" },
        { id: 4, name: "Inter FA", logo: "https://img.sofascore.com/api/v1/team/343177/image", city: "Santa Tecla" },
    ]);

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

    const addTeam = () => {
        Swal.fire({
            title: "Agregar Nuevo Equipo",
            html:
                '<input id="name" class="swal2-input" placeholder="Nombre del equipo">' +
                '<input id="logo" class="swal2-input" placeholder="URL del Logo (opcional)">' +
                '<input id="city" class="swal2-input" placeholder="Ciudad">',
            showCancelButton: true,
            confirmButtonText: "Agregar",
            preConfirm: () => {
                const name = document.getElementById("name").value;
                const logo = document.getElementById("logo").value || "https://via.placeholder.com/150"; // Default si está vacío
                const city = document.getElementById("city").value;

                if (!name) {
                    Swal.showValidationMessage("El nombre es obligatorio");
                    return false;
                }
                return { name, logo, city };
            }
        }).then((result) => {
            if (result.value) {
                const newTeam = {
                    id: Date.now(),
                    ...result.value
                };
                setTeams([...teams, newTeam]);
                Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Equipo agregado", timer: 1500 });
            }
        });
    };

    const deleteTeam = (id) => {
        Swal.fire({
            title: "¿Eliminar equipo?",
            text: "Se borrará permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            confirmButtonColor: "#d33"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    setTeams(teams.filter((t) => t.id !== id));
                    Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Equipo eliminado", timer: 1500 });
                }
            });
    };

    return (
        <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>

            {/* ===== SIDEBAR ===== */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <img
                            src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a"
                            alt="Logo"
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        />
                    </div>
                    <h2 className="sidebar-title">
                        Números y Fútbol <span className="accent-text">Equipos</span>
                    </h2>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="nav-item">
                            <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <LayoutDashboard size={20} className="nav-icon" /> Dashboard
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/matches" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <CalendarDays size={20} className="nav-icon" /> Gestionar Partidos
                            </a>
                        </li>

                        {/* ENLACE ACTIVO */}
                        <li className="nav-item active">
                            <Shield size={20} className="nav-icon" /> Equipos
                        </li>

                        <li className="nav-item">
                            <a href="/manage-news" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <Newspaper size={20} className="nav-icon" /> Noticias
                            </a>
                        </li>

                        <li className="nav-item">
                            <a href="/users" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <UsersIcon size={20} className="nav-icon" /> Usuarios
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/settings" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <Settings size={20} className="nav-icon" /> Configuración
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item btn-logout-sidebar" onClick={handleLogout}>
                        <LogOut size={20} className="nav-icon" /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="main-content">
                <header className="top-bar">
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <div className="search-bar">
                        <input type="text" placeholder="Buscar equipo..." readOnly />
                    </div>
                </header>

                <div className="content-wrapper">
                    <h1 className="admin-title">Gestionar Equipos</h1>

                    <div className="table-container">
                        <div className="table-header">
                            <h2>Lista de Equipos</h2>
                            <button className="btn-add" onClick={addTeam}>
                                <Plus size={18} /> Nuevo Equipo
                            </button>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '80px' }}>Logo</th>
                                    <th>Nombre</th>
                                    <th>Ciudad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map((team) => (
                                    <tr key={team.id}>
                                        <td>
                                            <img
                                                src={team.logo}
                                                alt={team.name}
                                                style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '8px', background: '#fff', padding: '2px' }}
                                            />
                                        </td>
                                        <td style={{ fontWeight: '600' }}>{team.name}</td>
                                        <td>{team.city}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-edit" onClick={() => alert('Función editar próximamente')} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn-delete" onClick={() => deleteTeam(team.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManageTeams;