import React, { useState } from "react";
import "../admin.css"; // Asegúrate de que apunte a tu archivo CSS actualizado
import Swal from "sweetalert2";

import StatsCard from "../components/StatsCard";
import MatchTable from "../components/MatchTable";
import GoalsChart from "../components/GoalsChart";

const AdminDashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const [matches, setMatches] = useState([
    { id: 1, date: "24 Oct 2023", home: "Águila", away: "FAS", score: "2 - 1", status: "Finalizado" },
    { id: 2, date: "25 Oct 2023", home: "Alianza", away: "Jocoro", score: "0 - 0", status: "Finalizado" },
    { id: 3, date: "28 Oct 2023", home: "Municipal", away: "Once Deportivo", score: "-", status: "Pendiente" },
    { id: 4, date: "29 Oct 2023", home: "FAS", away: "Águila", score: "-", status: "Pendiente" },
  ]);

  const stats = [
    { title: "Partidos Pendientes", value: "12", icon: "⚽", color: "blue" },
    { title: "Goles Temporada", value: "148", icon: "🥅", color: "green" },
    { title: "Noticias Activas", value: "24", icon: "📰", color: "purple" },
    { title: "Usuarios Registrados", value: "1,205", icon: "👥", color: "orange" },
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
      // Quitamos colores inline para usar CSS
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Sesión cerrada",
          showConfirmButton: false,
          timer: 2000
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
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
      // Usamos una clase custom para el botón rojo si queremos, 
      // pero el CSS general ya lo adapta al tema oscuro.
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

  return (
    <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <img 
              src="https://z-cdn-media.chatglm.cn/files/6a05039f-e693-466c-989d-75703ba3e40b.png?auth_key=1874469668-504345165d65484d91ce9bccaebd0d21-0-4dff614536f8ead12d34cb7c436f3c20" 
              alt="Logo Números y Fútbol" 
            />
          </div>
          <h2 className="sidebar-title">
            Números y Fútbol <span className="accent-text">Dashboard</span>
          </h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <span className="nav-icon">📊</span> Dashboard
            </li>
            <li className="nav-item">
              <span className="nav-icon">📅</span> Gestionar Partidos
            </li>
            <li className="nav-item">
              <span className="nav-icon">🛡️</span> Equipos
            </li>
            <li className="nav-item">
              <span className="nav-icon">📝</span> Noticias
            </li>
            <li className="nav-item">
              <span className="nav-icon">👥</span> Usuarios
            </li>
            <li className="nav-item">
              <span className="nav-icon">⚙️</span> Configuración
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}>
            <span className="nav-icon">🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">

        <header className="top-bar">
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
          >
            ☰
          </button>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">Dashboard</h1>

          <div className="stats-grid">
            {stats.map((stat, i) => (
              <StatsCard
                key={i}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                color={stat.color}
              />
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
                <span>➕</span> Nuevo Partido
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