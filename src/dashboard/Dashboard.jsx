import React, { useState } from "react";
import "../admin.css";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

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
      text: "Tu sesión se cerrará",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
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
      focusConfirm: false,
      showCancelButton: true,
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
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar"
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
            <input
              placeholder="Buscar equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>

        </header>

        <div className="content-wrapper">

          <h1 className="admin-title">Dashboard</h1>

          <div className="stats-grid">

            {stats.map((stat, index) => (

              <motion.div
                key={index}
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >

                <div className={`stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>

                <div>
                  <h3>{stat.value}</h3>
                  <p>{stat.title}</p>
                </div>

              </motion.div>

            ))}

          </div>

          <div className="table-container">

            <div className="table-header">
              <h2>Últimos partidos</h2>

              <button className="btn-add" onClick={addMatch}>
                ➕ Nuevo Partido
              </button>
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

                {filteredMatches.map((match) => (

                  <tr key={match.id}>

                    <td>{match.date}</td>
                    <td>{match.home}</td>
                    <td>{match.away}</td>
                    <td>{match.score}</td>

                    <td>

                      <span
                        className={`status ${
                          match.status === "Finalizado"
                            ? "done"
                            : "pending"
                        }`}
                      >
                        {match.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="btn-delete"
                        onClick={() => deleteMatch(match.id)}
                      >
                        ❌
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

export default AdminDashboard;