import React, { useState } from 'react';
import '../admin.css'; // Asegúrate de importar el CSS

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Datos de ejemplo para el contexto de fútbol
  const stats = [
    { title: 'Partidos Pendientes', value: '12', icon: '⚽', color: 'blue' },
    { title: 'Goles Temporada', value: '148', icon: '🥅', color: 'green' },
    { title: 'Noticias Activas', value: '24', icon: '📰', color: 'purple' },
    { title: 'Usuarios Registrados', value: '1,205', icon: '👥', color: 'orange' },
  ];

  const recentMatches = [
    { id: 1, date: '24 Oct 2023', home: 'Águila', away: 'FAS', score: '2 - 1', status: 'Finalizado' },
    { id: 2, date: '25 Oct 2023', home: 'Alianza', away: 'Jocoro', score: '0 - 0', status: 'Finalizado' },
    { id: 3, date: '28 Oct 2023', home: 'Municipal', away: 'Once Deportivo', score: '-', status: 'Pendiente' },
    { id: 4, date: '29 Oct 2023', home: 'FAS', away: 'Águila', score: '-', status: 'Pendiente' },
  ];

  return (
    <div className={`admin-layout ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">⚽</div>
          <h2 className="sidebar-title">LIGA PRO <span className="accent-text">ADMIN</span></h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">📅</span>
              <span className="nav-text">Gestionar Partidos</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">🛡️</span>
              <span className="nav-text">Equipos</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">📝</span>
              <span className="nav-text">Noticias</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">👥</span>
              <span className="nav-text">Usuarios</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Configuración</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">AD</div>
            <div className="user-info">
              <p className="user-name">Admin Principal</p>
              <p className="user-role">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          
          <div className="search-bar">
            <input type="text" placeholder="Buscar partidos, equipos o jugadores..." />
          </div>

          <div className="header-actions">
            <button className="icon-btn">🔔</button>
            <button className="btn-logout">Cerrar Sesión</button>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Resumen General</h1>
            <p>Bienvenido al panel de control de la Liga Nacional.</p>
          </div>

          {/* STATS GRID */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="stat-info">
                  <h3>{stat.value}</h3>
                  <p>{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* TABLE SECTION */}
          <div className="table-container">
            <div className="table-header">
              <h2>Últimos Partidos</h2>
              <button className="btn-primary">+ Agregar Partido</button>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Local</th>
                  <th>Visitante</th>
                  <th>Resultado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentMatches.map((match) => (
                  <tr key={match.id}>
                    <td>{match.date}</td>
                    <td className="team-name">{match.home}</td>
                    <td className="team-name">{match.away}</td>
                    <td className="score">{match.score}</td>
                    <td>
                      <span className={`status-badge ${match.status === 'Finalizado' ? 'completed' : 'pending'}`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn edit">✏️</button>
                      <button className="action-btn delete">🗑️</button>
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

export default AdminDashboard;