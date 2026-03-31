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
    Users,
    Settings,
    LogOut,
    Menu,
    Plus,
    Trash2,
    Edit
} from "lucide-react";

const ManageNews = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Estado inicial de noticias (Mock Data)
    const [news, setNews] = useState([
        { id: 1, title: "El clásico nacional define al nuevo campeón", category: "Primera División", author: "Carlos Martínez", date: "25 Oct 2023", status: "Publicado" },
        { id: 2, title: "Nuevas incorporaciones para el torneo clausura", category: "Mercado", author: "Ana Gómez", date: "24 Oct 2023", status: "Publicado" },
        { id: 3, title: "La selección Sub-20 viaja al mundial", category: "Selección", author: "Roberto Díaz", date: "20 Oct 2023", status: "Borrador" },
        { id: 4, title: "Análisis táctico: Cómo romper la línea defensiva", category: "Táctica", author: "Sofía López", date: "18 Oct 2023", status: "Publicado" },
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

    // Función para agregar noticia
    const addNews = () => {
        Swal.fire({
            title: "Agregar Nueva Noticia",
            html:
                '<input id="title" class="swal2-input" placeholder="Título de la noticia">' +
                '<select id="category" class="swal2-select" style="width: 100%; margin-top: 1rem; padding: 0.8rem; background: #0b1120; color: white; border-radius: 8px; border: 1px solid #374151;">' +
                '<option value="Primera División">Primera División</option>' +
                '<option value="Selección">Selección</option>' +
                '<option value="Mercado">Mercado</option>' +
                '<option value="Táctica">Táctica</option>' +
                '</select>' +
                '<input id="author" class="swal2-input" placeholder="Autor">',
            showCancelButton: true,
            confirmButtonText: "Publicar",
            preConfirm: () => {
                const title = document.getElementById("title").value;
                const category = document.getElementById("category").value;
                const author = document.getElementById("author").value;

                if (!title || !author) {
                    Swal.showValidationMessage("Título y autor son obligatorios");
                    return false;
                }
                return { title, category, author };
            }
        }).then((result) => {
            if (result.value) {
                const newArticle = {
                    id: Date.now(),
                    ...result.value,
                    date: "Hoy",
                    status: "Publicado"
                };
                setNews([newArticle, ...news]); // Agregamos al principio
                Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Noticia creada", timer: 1500 });
            }
        });
    };

    // Función para eliminar
    const deleteNews = (id, title) => {
        Swal.fire({
            title: `¿Eliminar noticia?`,
            text: `Se eliminará: "${title}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            confirmButtonColor: "#d33"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    setNews(news.filter((n) => n.id !== id));
                    Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Noticia eliminada", timer: 1500 });
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
                        Números y Fútbol <span className="accent-text">Noticias</span>
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

                        <li className="nav-item">
                            <a href="/teams" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <Shield size={20} className="nav-icon" /> Equipos
                            </a>
                        </li>

                        {/* ENLACE ACTIVO */}
                        <li className="nav-item active">
                            <Newspaper size={20} className="nav-icon" /> Noticias
                        </li>

                        <li className="nav-item">
                            <a href="/users" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
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
                        <input type="text" placeholder="Buscar noticia..." readOnly />
                    </div>
                </header>

                <div className="content-wrapper">
                    <h1 className="admin-title">Gestionar Noticias</h1>

                    <div className="table-container">
                        <div className="table-header">
                            <h2>Artículos Publicados</h2>
                            <button className="btn-add" onClick={addNews}>
                                <Plus size={18} /> Nueva Noticia
                            </button>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Título</th>
                                    <th>Categoría</th>
                                    <th>Autor</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {news.map((article) => (
                                    <tr key={article.id}>
                                        <td style={{ fontWeight: '600' }}>{article.title}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: 'rgba(59, 130, 246, 0.15)',
                                                color: '#60a5fa'
                                            }}>
                                                {article.category}
                                            </span>
                                        </td>
                                        <td>{article.author}</td>
                                        <td>
                                            <span className={`status ${article.status === 'Publicado' ? 'done' : 'pending'}`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-edit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn-delete" onClick={() => deleteNews(article.id, article.title)}>
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

export default ManageNews;