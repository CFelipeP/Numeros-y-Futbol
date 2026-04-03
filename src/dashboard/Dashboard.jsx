// ========== AdminDashboard.jsx ==========
import React, { useState } from "react";
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
  CircleDot,
  Target,
  FileText,
  Trophy
} from "lucide-react";

import StatsCard from "../components/StatsCard";
import MatchTable from "../components/MatchTable";
import GoalsChart from "../components/GoalsChart";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const location = useLocation();

  const [matches, setMatches] = useState([
    { id: 1, date: "24 Oct 2023", home: "Águila", away: "FAS", score: "2 - 1", status: "Finalizado" },
    { id: 2, date: "25 Oct 2023", home: "Alianza", away: "Jocoro", score: "0 - 0", status: "Finalizado" },
    { id: 3, date: "28 Oct 2023", home: "Municipal", away: "Once Deportivo", score: "-", status: "Pendiente" },
    { id: 4, date: "29 Oct 2023", home: "FAS", away: "Águila", score: "-", status: "Pendiente" },
  ]);

  const stats = [
    { title: "Partidos Pendientes", value: "12", icon: <CircleDot size={24} />, color: "blue" },
    { title: "Goles Temporada", value: "148", icon: <Target size={24} />, color: "green" },
    { title: "Noticias Activas", value: "24", icon: <FileText size={24} />, color: "purple" },
    { title: "Usuarios Registrados", value: "1,205", icon: <Users size={24} />, color: "orange" },
  ];

  const filteredMatches = matches.filter(
    (match) =>
      match.home.toLowerCase().includes(search.toLowerCase()) ||
      match.away.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
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
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const home = document.getElementById("home").value;
        const away = document.getElementById("away").value;
        if (!home || !away) {
          Swal.showValidationMessage("Debes completar los equipos");
        }
        return { home, away };
      }
    }).then((result) => {
      if (result.value) {
        const newMatch = {
          id: matches.length + 1,
          date: "Hoy",
          home: result.value.home,
          away: result.value.away,
          score: "-",
          status: "Pendiente"
        };
        setMatches([...matches, newMatch]);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Partido agregado",
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  };

  const deleteMatch = (id) => {
    Swal.fire({
      title: "¿Eliminar partido?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setMatches(matches.filter((m) => m.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Partido eliminado",
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  };

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
    { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
    { path: "/teams", icon: <Shield size={20} />, label: "Equipos" },
    { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },       // ← NUEVO
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
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                >
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
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Sidebar">
            <Menu size={24} />
          </button>
          <div className="search-bar">
            <input type="text" placeholder="Buscar equipo..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">Dashboard</h1>

          <div className="stats-grid">
            {stats.map((stat, i) => (
              <StatsCard key={i} icon={stat.icon} title={stat.title} value={stat.value} color={stat.color} />
            ))}
          </div>

          <div className="chart-container">
            <div className="table-header">
              <h2>Estadísticas de goles</h2>
            </div>
            <GoalsChart />
          </div>

          <div className="table-container">
            <div className="table-header">
              <h2>Últimos partidos</h2>
              <button className="btn-add" onClick={addMatch}>
                <Plus size={18} /> Nuevo Partido
              </button>
            </div>
            <MatchTable matches={filteredMatches} deleteMatch={deleteMatch} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;