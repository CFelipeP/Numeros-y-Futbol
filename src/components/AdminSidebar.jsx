import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut,
  Menu, Trophy, Target, ChevronDown, MessageCircle, Eye, BarChart3
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/analytics", icon: <BarChart3 size={20} />, label: "Analiticas" },
  { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
  { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
  {
    type: "dropdown", icon: <Shield size={20} />, label: "Equipos",
    children: [
      { path: "/teams/primera", label: "Primera División" },
      { path: "/teams/ascenso", label: "Liga de Ascenso" },
      { path: "/teams/reservas", label: "Liga Fedecredito" },
      { path: "/teams/femenina", label: "Femenina" },
    ]
  },
  {
    type: "dropdown", icon: <Shield size={20} />, label: "Selecciones",
    children: [
      { path: "/manage-seleccion", label: "Masculina" },
      { path: "/manage-seleccion-femenina", label: "Femenina" },
      { path: "/manage-seleccion-sub20", label: "Sub-20" },
      { path: "/manage-seleccion-sub17", label: "Sub-17" },
    ]
  },
  { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
  { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
  { path: "/admin/copa", icon: <Trophy size={20} />, label: "Copa Presidente" },
  { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
  { path: "/manage-comments", icon: <MessageCircle size={20} />, label: "Gestionar Comentarios" },
  { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
  { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
  { path: "/", icon: <Eye size={20} />, label: "Ver Sitio" },
];

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, onLogout }) {
  const location = useLocation();
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [seleccionesOpen, setSeleccionesOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
    if (location.pathname.startsWith("/manage-seleccion")) setSeleccionesOpen(true);
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <img src="/numeros-y-futbol.svg" alt="Logo" />
        </div>
        <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {NAV_ITEMS.map((item, idx) => {
            if (item.type === "dropdown") {
              const isSelecciones = item.label === "Selecciones";
              const isOpen = isSelecciones ? seleccionesOpen : teamsOpen;
              const setOpen = isSelecciones ? setSeleccionesOpen : setTeamsOpen;
              return (
                <li key={idx}>
                  <button className="nav-item" onClick={() => setOpen(!isOpen)} style={{ width: "100%", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>{item.icon} {item.label}</span>
                    <ChevronDown size={16} style={{ transition: "transform 0.25s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.4 }} />
                  </button>
                  <ul style={{ maxHeight: isOpen ? "400px" : "0", opacity: isOpen ? "1" : "0", overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease", listStyle: "none", padding: isOpen ? "2px 0 4px 0" : "0", margin: 0 }}>
                    {item.children.map(child => (
                      <li key={child.path}>
                        <Link to={child.path} className={`nav-item${location.pathname === child.path ? " active" : ""}`} style={{ paddingLeft: "48px", fontSize: "13.5px" }}>
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
                <Link to={item.path} className={`nav-item${location.pathname === item.path ? " active" : ""}`}>
                  {item.icon} {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item btn-logout-sidebar" onClick={onLogout}>
          <LogOut size={20} className="nav-icon" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
