import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

// IMPORTAR ICONOS DE LUCIDE REACT
import {
    LayoutDashboard,
    CalendarDays,
    Shield,
    Newspaper,
    Users, // Importamos como 'Users'
    Settings,
    LogOut,
    Menu,
    Plus,
    Trash2
} from "lucide-react";

const ManageMatches = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [matches, setMatches] = useState([
        { id: 1, date: "24 Oct 2023", home: "Águila", away: "FAS", score: "2 - 1", status: "Finalizado" },
        { id: 2, date: "25 Oct 2023", home: "Alianza", away: "Jocoro", score: "0 - 0", status: "Finalizado" },
        { id: 3, date: "28 Oct 2023", home: "Municipal", away: "Once Deportivo", score: "-", status: "Pendiente" },
        { id: 4, date: "29 Oct 2023", home: "FAS", away: "Águila", score: "-", status: "Pendiente" },
    ]);

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            confirmButtonColor: "#d33"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        });
    };

    const addMatch = () => {
        Swal.fire({
            title: "Agregar partido",
            html:
                '<input id="home" class="swal2-input" placeholder="Equipo local">' +
                '<input id="away" class="swal2-input" placeholder="Equipo visitante">',
            showCancelButton: true,
            confirmButtonText: "Agregar",
            preConfirm: () => {
                const home = document.getElementById("home").value;
                const away = document.getElementById("away").value;
                if (!home || !away) Swal.showValidationMessage("Debes completar los equipos");
                return { home, away };
            }
        }).then((result) => {
            if (result.value) {
                const newMatch = {
                    id: Date.now(),
                    date: "Nuevo",
                    home: result.value.home,
                    away: result.value.away,
                    score: "-",
                    status: "Pendiente"
                };
                setMatches([...matches, newMatch]);
                Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Partido agregado", timer: 1500 });
            }
        });
    };

    const deleteMatch = (id) => {
        Swal.fire({
            title: "¿Eliminar?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            confirmButtonColor: "#d33"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    setMatches(matches.filter((m) => m.id !== id));
                    Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Eliminado", timer: 1500 });
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
                        Números y Fútbol <span className="accent-text">Gestionar Partidos</span>
                    </h2>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="nav-item">
                            <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <LayoutDashboard size={20} className="nav-icon" /> Dashboard
                            </a>
                        </li>

                        <li className="nav-item active">
                            <CalendarDays size={20} className="nav-icon" /> Gestionar Partidos
                        </li>

                        <li>
                            <Link to="/mynews" className="nav-item">
                                <CalendarDays size={20} className="nav-icon" /> Gestionar Noticias
                            </Link>
                        </li>

                        <li className="nav-item">
                            <a href="/teams" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <Shield size={20} className="nav-icon" /> Equipos
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/manage-news" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <Newspaper size={20} className="nav-icon" /> Noticias
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/users" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                {/* CORREGIDO: Usar <Users /> en lugar de <UsersIcon /> */}
                                <Users size={20} className="nav-icon" /> Usuarios
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
                        <input type="text" placeholder="Buscar partido..." readOnly />
                    </div>
                </header>

                <div className="content-wrapper">
                    <h1 className="admin-title">Gestionar Partidos</h1>

                    <div className="table-container">
                        <div className="table-header">
                            <h2>Lista de Partidos</h2>
                            <button className="btn-add" onClick={addMatch}>
                                <Plus size={18} /> Nuevo Partido
                            </button>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Local</th>
                                    <th>Visitante</th>
                                    <th>Marcador</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map((match) => (
                                    <tr key={match.id}>
                                        <td>{match.date}</td>
                                        <td>{match.home}</td>
                                        <td>{match.away}</td>
                                        <td><strong>{match.score}</strong></td>
                                        <td>
                                            <span className={`status ${match.status === 'Finalizado' ? 'done' : 'pending'}`}>
                                                {match.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-delete" onClick={() => deleteMatch(match.id)}>
                                                <Trash2 size={16} /> Eliminar
                                            </button>
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

export default ManageMatches;