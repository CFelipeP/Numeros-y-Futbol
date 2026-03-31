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
    MoreVertical,
    Mail,
    UserCircle
} from "lucide-react";

const ManageUsers = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Estado inicial de usuarios (Mock Data)
    const [users, setUsers] = useState([
        { id: 1, name: "Carlos Martínez", email: "carlos@admin.com", role: "Administrador", status: "Activo", avatar: "https://ui-avatars.com/api/?name=Carlos+Martinez&background=ff004d&color=fff" },
        { id: 2, name: "Ana Gómez", email: "ana@editor.com", role: "Editor", status: "Activo", avatar: "https://ui-avatars.com/api/?name=Ana+Gomez&background=3b82f6&color=fff" },
        { id: 3, name: "Roberto Díaz", email: "roberto@user.com", role: "Usuario", status: "Inactivo", avatar: "https://ui-avatars.com/api/?name=Roberto+Diaz&background=6b7280&color=fff" },
        { id: 4, name: "Sofía López", email: "sofia@editor.com", role: "Editor", status: "Activo", avatar: "https://ui-avatars.com/api/?name=Sofia+Lopez&background=10b981&color=fff" },
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

    // Función para agregar usuario
    const addUser = () => {
        Swal.fire({
            title: "Agregar Nuevo Usuario",
            html:
                '<input id="name" class="swal2-input" placeholder="Nombre completo">' +
                '<input id="email" type="email" class="swal2-input" placeholder="Correo electrónico">' +
                '<select id="role" class="swal2-select" style="width: 100%; margin-top: 1rem; padding: 0.8rem; background: #0b1120; color: white; border-radius: 8px; border: 1px solid #374151;">' +
                '<option value="Usuario">Usuario</option>' +
                '<option value="Editor">Editor</option>' +
                '<option value="Administrador">Administrador</option>' +
                '</select>',
            showCancelButton: true,
            confirmButtonText: "Agregar",
            preConfirm: () => {
                const name = document.getElementById("name").value;
                const email = document.getElementById("email").value;
                const role = document.getElementById("role").value;

                if (!name || !email) {
                    Swal.showValidationMessage("Nombre y email son obligatorios");
                    return false;
                }
                return { name, email, role };
            }
        }).then((result) => {
            if (result.value) {
                // Generamos un avatar automático con la inicial
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.value.name)}&background=random&color=fff`;

                const newUser = {
                    id: Date.now(),
                    ...result.value,
                    avatar: avatarUrl,
                    status: "Activo"
                };
                setUsers([...users, newUser]);
                Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Usuario creado", timer: 1500 });
            }
        });
    };

    // Función para eliminar
    const deleteUser = (id, name) => {
        Swal.fire({
            title: `¿Eliminar a ${name}?`,
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            confirmButtonColor: "#d33"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    setUsers(users.filter((u) => u.id !== id));
                    Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Usuario eliminado", timer: 1500 });
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
                        Números y Fútbol <span className="accent-text">Usuarios</span>
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

                        <li className="nav-item">
                            <a href="/manage-news" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <Newspaper size={20} className="nav-icon" /> Noticias
                            </a>
                        </li>

                        {/* ENLACE ACTIVO */}
                        <li className="nav-item active">
                            <UsersIcon size={20} className="nav-icon" /> Usuarios
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
                        <input type="text" placeholder="Buscar usuario..." readOnly />
                    </div>
                </header>

                <div className="content-wrapper">
                    <h1 className="admin-title">Gestionar Usuarios</h1>

                    <div className="table-container">
                        <div className="table-header">
                            <h2>Lista de Usuarios</h2>
                            <button className="btn-add" onClick={addUser}>
                                <Plus size={18} /> Nuevo Usuario
                            </button>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>Avatar</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', border: 'none' }}>
                                            {user.name}
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                                                <Mail size={14} /> {user.email}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: user.role === 'Administrador' ? 'rgba(255, 0, 77, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                                color: user.role === 'Administrador' ? '#ff004d' : '#3b82f6'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status ${user.status === 'Activo' ? 'done' : 'pending'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-edit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn-delete" onClick={() => deleteUser(user.id, user.name)}>
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

export default ManageUsers;