import React, { useState } from "react";
import "../admin.css";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { title: "Partidos Pendientes", value: "12", icon: "⚽", color: "blue" },
    { title: "Goles Temporada", value: "148", icon: "🥅", color: "green" },
    { title: "Noticias Activas", value: "24", icon: "📰", color: "purple" },
    { title: "Usuarios Registrados", value: "1,205", icon: "👥", color: "orange" },
  ];

  const recentMatches = [
    { id: 1, date: "24 Oct 2023", home: "Águila", away: "FAS", score: "2 - 1", status: "Finalizado" },
    { id: 2, date: "25 Oct 2023", home: "Alianza", away: "Jocoro", score: "0 - 0", status: "Finalizado" },
    { id: 3, date: "28 Oct 2023", home: "Municipal", away: "Once Deportivo", score: "-", status: "Pendiente" },
    { id: 4, date: "29 Oct 2023", home: "FAS", away: "Águila", score: "-", status: "Pendiente" },
  ];

  return (
    <div className={`admin-layout ${sidebarOpen ? "" : "sidebar-closed"}`}>
      
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">⚽</div>
          <h2 className="sidebar-title">
            LIGA PRO <span className="accent-text">ADMIN</span>
          </h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">📊 Dashboard</li>
            <li className="nav-item">📅 Gestionar Partidos</li>
            <li className="nav-item">🛡️ Equipos</li>
            <li className="nav-item">📝 Noticias</li>
            <li className="nav-item">👥 Usuarios</li>
            <li className="nav-item">⚙️ Configuración</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        
        <header className="top-bar">
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="search-bar">
            <input placeholder="Buscar..." />
          </div>

          <button className="btn-logout">Cerrar sesión</button>
        </header>

        <div className="content-wrapper">
          
          <h1 className="admin-title">Dashboard</h1>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
                <div>
                  <h3>{stat.value}</h3>
                  <p>{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="table-container">
            <h2>Últimos partidos</h2>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Local</th>
                  <th>Visitante</th>
                  <th>Resultado</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {recentMatches.map((match) => (
                  <tr key={match.id}>
                    <td>{match.date}</td>
                    <td>{match.home}</td>
                    <td>{match.away}</td>
                    <td>{match.score}</td>
                    <td>{match.status}</td>
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

export default AdminDashboard;