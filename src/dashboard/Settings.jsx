// ========== SettingsPage.jsx ==========
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  CircleDot, Target, Trophy, ChevronDown, Plus, Pencil, Trash2, Save, X,
  Goal, Search, User, Swords, Eye as EyeIcon, Star, ArrowRightLeft,
  Globe, Palette, Bell, Lock
} from "lucide-react";
const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const location = useLocation();

  const [siteName, setSiteName] = useState("Números y Fútbol");
  const [siteDescription, setSiteDescription] = useState("La mejor plataforma de estadísticas de fútbol.");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

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

  const handleSaveSettings = () => {
    Swal.fire({
      title: "Guardando...",
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

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

    Swal.fire({
      icon: "success",
      title: "Contraseña Actualizada",
      text: "Tu contraseña ha sido cambiada exitosamente.",
      timer: 2000,
      showConfirmButton: false
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white', marginBottom: '10px'
  };

  const labelStyle = {
    display: 'block', fontSize: '14px', fontWeight: '500', color: '#9ca3af', marginBottom: '6px'
  };

  const cardStyle = {
    background: '#1f2937', borderRadius: '12px', padding: '24px', marginBottom: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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

  return (
    <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <img
              src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a"
              alt="Logo Números y Fútbol"
            />
          </div>
          <h2 className="sidebar-title">
            Números y Fútbol <span className="accent-text">Admin</span>
          </h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, idx) => {
              if (item.type === "dropdown") {
                return (
                  <li key={idx}>
                    <button
                      className="nav-item"
                      onClick={() => setTeamsOpen(!teamsOpen)}
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {item.icon} {item.label}
                      </span>
                      <ChevronDown size={16} style={{ transition: "transform 0.25s ease", transform: teamsOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.4 }} />
                    </button>
                    <ul style={{
                      maxHeight: teamsOpen ? "200px" : "0",
                      opacity: teamsOpen ? "1" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, opacity 0.2s ease",
                      listStyle: "none", padding: teamsOpen ? "2px 0 4px 0" : "0", margin: 0,
                    }}>
                      {item.children.map(child => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={`nav-item${location.pathname === child.path ? " active" : ""}`}
                            style={{ paddingLeft: "48px", fontSize: "13.5px" }}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-item${location.pathname === item.path ? " active" : ""}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              );
            })}
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
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <div className="search-bar">
            <input type="text" placeholder="Buscar en configuración..." readOnly />
          </div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">Configuración General</h1>

          <div className="table-container" style={cardStyle}>
            <div className="table-header" style={{ borderBottom: '1px solid #374151', marginBottom: '20px', paddingBottom: '10px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={22} /> Información del Sitio
              </h2>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Nombre del Sitio</label>
                <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Descripción Corta</label>
                <textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>URL del Logo</label>
                <input type="text" placeholder="https://ejemplo.com/logo.png" style={inputStyle} />
              </div>
            </div>
          </div>

          <div className="table-container" style={cardStyle}>
            <div className="table-header" style={{ borderBottom: '1px solid #374151', marginBottom: '20px', paddingBottom: '10px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Palette size={22} /> Preferencias
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>Modo Mantenimiento</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Desactiva el sitio para los usuarios normales.</p>
                </div>
                <div
                  style={{
                    cursor: 'pointer', position: 'relative', width: '44px', height: '24px',
                    background: maintenanceMode ? '#2563eb' : '#4b5563', borderRadius: '12px', transition: 'background 0.3s'
                  }}
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                >
                  <div style={{
                    position: 'absolute', top: '2px',
                    left: maintenanceMode ? '22px' : '2px',
                    width: '20px', height: '20px', background: 'white',
                    borderRadius: '50%', transition: 'left 0.3s'
                  }}></div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} /> Notificaciones por Correo
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Recibir alertas de nuevos registros.</p>
                </div>
                <div
                  style={{
                    cursor: 'pointer', position: 'relative', width: '44px', height: '24px',
                    background: emailNotifications ? '#2563eb' : '#4b5563', borderRadius: '12px', transition: 'background 0.3s'
                  }}
                  onClick={() => setEmailNotifications(!emailNotifications)}
                >
                  <div style={{
                    position: 'absolute', top: '2px',
                    left: emailNotifications ? '22px' : '2px',
                    width: '20px', height: '20px', background: 'white',
                    borderRadius: '50%', transition: 'left 0.3s'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

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
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Nueva Contraseña</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirmar Contraseña</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
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

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button className="btn-add" onClick={handleSaveSettings} style={{ padding: '12px 24px', fontSize: '16px' }}>
              <Save size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Guardar Todos los Cambios
            </button>
          </div>
        </div>
      </main>

      <style>{`
        button.nav-item {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;