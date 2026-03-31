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
    Save,
    Globe,
    Lock,
    Bell,
    Palette
} from "lucide-react";

const SettingsPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Estados para las configuraciones
    const [siteName, setSiteName] = useState("Números y Fútbol");
    const [siteDescription, setSiteDescription] = useState("La mejor plataforma de estadísticas de fútbol.");
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);

    // Estados para cambio de contraseña
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    // Función para guardar cambios generales
    const handleSaveSettings = () => {
        Swal.fire({
            title: "Guardando...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Simulación de guardado en backend
        setTimeout(() => {
            Swal.fire({
                icon: "success",
                title: "Cambios Guardados",
                text: "La configuración del sitio se actualizó correctamente.",
                timer: 2000,
                showConfirmButton: false
            });
        }, 1000);
    };

    // Función para cambiar contraseña
    const handleChangePassword = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire("Error", "Las contraseñas nuevas no coinciden", "error");
            return;
        }

        if (newPassword.length < 6) {
            Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "error");
            return;
        }

        // Simulación de cambio de contraseña
        Swal.fire({
            icon: "success",
            title: "Contraseña Actualizada",
            text: "Tu contraseña ha sido cambiada exitosamente.",
            timer: 2000,
            showConfirmButton: false
        });

        // Limpiar campos
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    // Estilos en línea para los inputs personalizados (ya que admin.css es externo)
    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #374151',
        backgroundColor: '#1f2937',
        color: 'white',
        marginBottom: '10px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#9ca3af',
        marginBottom: '6px'
    };

    const cardStyle = {
        background: '#1f2937',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    const toggleStyle = {
        cursor: 'pointer',
        position: 'relative',
        width: '44px',
        height: '24px',
        background: maintenanceMode || emailNotifications ? '#2563eb' : '#4b5563',
        borderRadius: '12px',
        transition: 'background 0.3s'
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
                        Números y Fútbol <span className="accent-text">Configuración</span>
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

                        <li className="nav-item">
                            <a href="/users" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <UsersIcon size={20} className="nav-icon" /> Usuarios
                            </a>
                        </li>

                        {/* ENLACE ACTIVO EN CONFIGURACIÓN */}
                        <li className="nav-item active">
                            <Settings size={20} className="nav-icon" /> Configuración
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
                        <input type="text" placeholder="Buscar en configuración..." readOnly />
                    </div>
                </header>

                <div className="content-wrapper">
                    <h1 className="admin-title">Configuración General</h1>

                    {/* SECCIÓN: INFORMACIÓN DEL SITIO */}
                    <div className="table-container" style={cardStyle}>
                        <div className="table-header" style={{ borderBottom: '1px solid #374151', marginBottom: '20px', paddingBottom: '10px' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Globe size={22} /> Información del Sitio
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Nombre del Sitio</label>
                                <input
                                    type="text"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Descripción Corta</label>
                                <textarea
                                    value={siteDescription}
                                    onChange={(e) => setSiteDescription(e.target.value)}
                                    style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>URL del Logo</label>
                                <input
                                    type="text"
                                    placeholder="https://ejemplo.com/logo.png"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: PREFERENCIAS */}
                    <div className="table-container" style={cardStyle}>
                        <div className="table-header" style={{ borderBottom: '1px solid #374151', marginBottom: '20px', paddingBottom: '10px' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Palette size={22} /> Preferencias
                            </h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* Toggle Mantenimiento */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0' }}>Modo Mantenimiento</h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Desactiva el sitio para los usuarios normales.</p>
                                </div>
                                <div
                                    style={toggleStyle}
                                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: maintenanceMode ? '22px' : '2px',
                                        width: '20px',
                                        height: '20px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        transition: 'left 0.3s'
                                    }}></div>
                                </div>
                            </div>

                            {/* Toggle Notificaciones */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Bell size={16} /> Notificaciones por Correo
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Recibir alertas de nuevos registros.</p>
                                </div>
                                <div
                                    style={toggleStyle}
                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: emailNotifications ? '22px' : '2px',
                                        width: '20px',
                                        height: '20px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        transition: 'left 0.3s'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: SEGURIDAD */}
                    <div className="table-container" style={cardStyle}>
                        <div className="table-header" style={{ borderBottom: '1px solid #374151', marginBottom: '20px', paddingBottom: '10px' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Lock size={22} /> Cambiar Contraseña
                            </h2>
                        </div>

                        <form onSubmit={handleChangePassword}>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Contraseña Actual</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={labelStyle}>Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <button type="submit" className="btn-add" style={{ background: '#2563eb' }}>
                                        Actualizar Contraseña
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* BOTÓN GUARDAR GENERAL */}
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button className="btn-add" onClick={handleSaveSettings} style={{ padding: '12px 24px', fontSize: '16px' }}>
                            <Save size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Guardar Todos los Cambios
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SettingsPage;