import React, { useState } from "react";
import "./styles2.css";

export default function PrimeraDivision() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="container header-inner">
          <div className="header-brand">
            <div className="header-logo">⚽</div>
            <div>
              <div className="header-title">Numeros y Futbol</div>
              <div className="header-subtitle">Portal Oficial</div>
            </div>
          </div>

          <nav className="header-nav">
            <a href="/primera">Primera División</a>
            <a href="/segunda">Segunda División</a>
            <a href="/tercera">Tercera División</a>
            <a href="#noticias">Noticias</a>
          </nav>

          <button
            onClick={toggleMenu}
            className="menu-toggle"
            aria-label="Abrir menu"
          >
            {!menuOpen ? "☰" : "✕"}
          </button>
        </div>

        <div className="container">
          <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
            <a href="/primera" onClick={toggleMenu}>Primera División</a>
            <a href="/segunda" onClick={toggleMenu}>Segunda División</a>
            <a href="/tercera" onClick={toggleMenu}>Tercera División</a>
            <a href="#noticias" onClick={toggleMenu}>Noticias</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-content">
          <h1>
            PRIMERA <br />
            <span>DIVISIÓN</span>
          </h1>
          <p className="hero-description">
            La élite del fútbol salvadoreño. Consulta la tabla oficial de
            posiciones, estadísticas y clasificación del torneo Clausura 2026.
          </p>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="table-section">
        <div className="section-header">
          <h2>Tabla de Posiciones</h2>
          <p>Primera División de El Salvador – Clausura 2026</p>
        </div>

        <div className="dashboard-grid">
          {/* IZQUIERDA */}
          <div className="glass-card stats-card">

            {/* PARTIDO DESTACADO */}
            <div className="compact-match-card">
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem"}}>
                <span style={{fontSize:"0.8rem", color:"var(--color-text-muted)", fontWeight:600}}>
                  JORNADA 15
                </span>
                <span className="live-badge-small">EN VIVO</span>
              </div>

              <div className="compact-match-teams">
                <div className="compact-team">
                  <img
                    src="https://escudosdefutbolyequipaciones.com/images_esc3/CONC/EL%20SALVADOR/escudos/ESC_C.D.%20%C1GUILA.png"
                    alt="Águila"
                    className="compact-team-logo-img"
                  />
                  <span className="compact-team-name">Águila</span>
                </div>

                <div className="compact-match-score">VS</div>

                <div className="compact-team">
                  <img
                    src="https://static.flashscore.com/res/image/data/l0e7dS3A-IJKf4CSg.png"
                    alt="FAS"
                    className="compact-team-logo-img"
                  />
                  <span className="compact-team-name">FAS</span>
                </div>
              </div>

              <div className="compact-match-info">
                Hoy, 18:00
              </div>
            </div>

            {/* Próximos y Resultados pueden ir igual como JSX normal */}
            {/* Puedes convertirlos luego en arrays y map() si quieres hacerlo dinámico */}

          </div>

          {/* DERECHA - TABLA */}
          <div className="glass-card">
            <h3 style={{marginBottom:"1rem", fontFamily:"var(--font-heading)"}}>
              Clasificación General
            </h3>

            <div className="table-container">
              <iframe
                title="SofaScore Standings"
                src="https://widgets.sofascore.com/es-ES/embed/tournament/4102/season/88383/standings/Primera%20Division%2C%20Clausura%202026?widgetTitle=Primera%20Division%2C%20Clausura%202026&showCompetitionLogo=true"
                frameBorder="0"
                scrolling="no"
              />
            </div>

            <div className="sofa-credit">
              Datos por <a target="_blank" rel="noreferrer" href="https://www.sofascore.com">Sofascore</a>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>FUTBOL SV</h3>
              <p>Portal oficial del fútbol salvadoreño.</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Futbol El Salvador</p>
          </div>
        </div>
      </footer>
    </>
  );
}