import React, { useEffect, useCallback, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';
import { driver } from 'driver.js';
import { Link } from "react-router-dom";
import 'driver.js/dist/driver.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

const BASE_URL = "http://localhost/Numeros-y-Futbol/backend/";

// --- Animaciones ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- Iconos SVG ---
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
);

// --- Partículas ---
const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => { await loadFull(engine); }, []);
  const options = {
    background: { color: { value: "transparent" } }, fpsLimit: 60,
    interactivity: {
      events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "grab" }, resize: true },
      modes: { push: { quantity: 4 }, grab: { distance: 140, links: { opacity: 1 } } }
    },
    particles: {
      color: { value: "#ff004d" },
      links: { color: "#ff004d", distance: 150, enable: true, opacity: 0.5, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true }, value: 60 },
      opacity: { value: 0.5 }, shape: { type: "circle" }, size: { value: { min: 1, max: 3 } }
    },
    detectRetina: true,
  };
  return <Particles id="tsparticles" init={particlesInit} options={options} className="hero-particles" />;
};

// --- Hero ---
const Hero = () => (
  <section className="hero">
    <div className="hero-bg-image" />
    <ParticleBackground />
    <div className="hero-overlay" />
    <div className="container hero-content">
      <motion.h1 id="driver-hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        EL FÚTBOL <span>DE EL SALVADOR</span>
      </motion.h1>
      <motion.p className="hero-description" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
        Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño en vivo.
      </motion.p>
      <motion.div className="hero-buttons" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
        <a href="#noticias" className="btn btn-white">Últimas Noticias</a>
        <a href="#divisiones" className="btn btn-outline-white">Ver Resultados</a>
      </motion.div>
    </div>
  </section>
);

// --- Carousel con Cards ---
const Carousel = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}get_carousel.php`)
      .then(res => res.json())
      .then(data => {
        setMatches(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getLogoUrl = (logo) => {
    if (!logo) return null;
    if (logo.startsWith("http")) return logo;
    return `${BASE_URL}${logo}`;
  };

  if (loading) {
    return (
      <div className="results-carousel-section" id="driver-carousel">
        <style>{`
          @keyframes skeleton-pulse {
            0%, 100% { opacity: 0.06; }
            50% { opacity: 0.12; }
          }
        `}</style>
        <div className="carousel-wrapper">
          <div style={{ display: "flex", gap: 16, padding: "20px 0" }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                minWidth: 260, height: 110, borderRadius: 16, flexShrink: 0,
                background: "#0d1117",
                border: "1px solid #1e293b",
                animation: "skeleton-pulse 1.8s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="results-carousel-section" id="driver-carousel">
        <div className="carousel-wrapper" style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 12, padding: "24px 0"
        }}>
          <span style={{ fontSize: 18, opacity: 0.2 }}>⚽</span>
          <span style={{
            color: "#1e293b", fontSize: 11, fontWeight: 700,
            letterSpacing: "4px", textTransform: "uppercase"
          }}>Sin partidos recientes</span>
          <span style={{ fontSize: 18, opacity: 0.2 }}>⚽</span>
        </div>
      </div>
    );
  }

  const copies = Math.max(Math.ceil(16 / matches.length), 2) + 1;
  const display = Array.from({ length: copies }, () => matches).flat();
  const duration = matches.length * 7;

  return (
    <>
      <style>{`
        @keyframes carousel-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / ${copies})); }
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          50% { opacity: 0.5; box-shadow: 0 0 0 4px rgba(34,197,94,0); }
        }
        @keyframes pending-glow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .carousel-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .carousel-card:hover {
          transform: translateY(-6px) scale(1.03) !important;
          border-color: rgba(239,68,68,0.3) !important;
          box-shadow:
            0 20px 50px rgba(0,0,0,0.6),
            0 0 0 1px rgba(239,68,68,0.15),
            0 0 40px rgba(239,68,68,0.05) !important;
        }
        .carousel-card:hover .card-score {
          color: #ff4d4d !important;
          text-shadow: 0 0 25px rgba(255,77,77,0.6) !important;
        }
        .carousel-card:hover .team-logo-wrap {
          border-color: rgba(255,255,255,0.12) !important;
          background: rgba(255,255,255,0.06) !important;
        }
      `}</style>

      <div className="results-carousel-section" id="driver-carousel" style={{ overflow: "hidden", position: "relative" }}>

        {/* Fade izquierdo */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 100, zIndex: 3,
          background: "linear-gradient(90deg, var(--bg-dark, #0a0c14) 20%, transparent)",
          pointerEvents: "none"
        }} />
        {/* Fade derecho */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 100, zIndex: 3,
          background: "linear-gradient(270deg, var(--bg-dark, #0a0c14) 20%, transparent)",
          pointerEvents: "none"
        }} />

        <div className="carousel-wrapper" style={{ overflow: "visible" }}>
          <div style={{
            animation: `carousel-scroll ${duration}s linear infinite`,
            willChange: "transform",
            display: "flex",
            gap: 16,
          }}>
            {display.map((match, idx) => {
              const isPending = match.estado === "Pendiente";
              const isLive = match.estado === "En Curso";
              const isFinished = match.estado === "Finalizado";

              return (
                <div className="carousel-card" key={`m-${idx}`} style={{
                  background: "linear-gradient(160deg, #0d1117 0%, #111827 50%, #0f1319 100%)",
                  border: "1px solid #1a2233",
                  borderRadius: 18,
                  padding: "16px 18px 14px 18px",
                  minWidth: 260,
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                }}>

                  {/* Línea superior de estado */}
                  <div style={{
                    position: "absolute", top: 0, left: 12, right: 12, height: 2,
                    background: isLive
                      ? "linear-gradient(90deg, transparent, #22c55e, #4ade80, #22c55e, transparent)"
                      : isPending
                      ? "linear-gradient(90deg, transparent, #f97316, #fbbf24, #f97316, transparent)"
                      : "linear-gradient(90deg, transparent, #dc2626, #ef4444, #dc2626, transparent)",
                    borderRadius: "0 0 2px 2px",
                    opacity: isLive ? 1 : 0.5
                  }} />

                  {/* Badge de estado */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 5, marginBottom: 14
                  }}>
                    {isLive && (
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#22c55e",
                        animation: "live-pulse 1.5s ease-in-out infinite",
                        flexShrink: 0
                      }} />
                    )}
                    {isPending && (
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#f97316",
                        animation: "pending-glow 2s ease-in-out infinite",
                        flexShrink: 0
                      }} />
                    )}
                    {isFinished && (
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#475569", flexShrink: 0
                      }} />
                    )}
                    <span style={{
                      fontSize: 9, fontWeight: 800,
                      letterSpacing: "2px", textTransform: "uppercase",
                      color: isLive ? "#4ade80" : isPending ? "#fb923c" : "#3b4a5e"
                    }}>
                      {isLive ? "En Vivo" : isPending ? "Próximo" : "Finalizado"}
                    </span>
                  </div>

                  {/* Equipos y marcador */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10
                  }}>

                    {/* Equipo Local */}
                    <div style={{
                      flex: 1, display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 6
                    }}>
                      <div className="team-logo-wrap" style={{
                        width: 46, height: 46,
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "50%",
                        border: "1px solid #1a2233",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s"
                      }}>
                        {getLogoUrl(match.logo1) ? (
                          <img
                            src={getLogoUrl(match.logo1)}
                            alt={match.team1}
                            style={{ width: 30, height: 30, objectFit: "contain" }}
                            onError={e => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <span style={{ fontSize: 16, opacity: 0.2 }}>⚽</span>
                        )}
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: "#94a3b8",
                        textAlign: "center", lineHeight: 1.2,
                        maxWidth: 72, overflow: "hidden",
                        whiteSpace: "nowrap", textOverflow: "ellipsis"
                      }}>{match.team1}</span>
                    </div>

                    {/* Marcador central */}
                    <div style={{
                      minWidth: 62, flexShrink: 0, textAlign: "center",
                      padding: "6px 0"
                    }}>
                      {isPending ? (
                        <div>
                          <div style={{
                            fontSize: 15, fontWeight: 900,
                            color: "#f97316",
                            letterSpacing: "4px",
                            textShadow: "0 0 20px rgba(249,115,22,0.3)"
                          }}>VS</div>
                          <div style={{
                            fontSize: 8, color: "#2d3f5a",
                            marginTop: 4, fontWeight: 600,
                            letterSpacing: "0.5px"
                          }}>
                            {match.fecha
                              ? new Date(match.fecha).toLocaleDateString("es-SV", { day: "2-digit", month: "short" })
                              : ""}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="card-score"
                          style={{
                            fontSize: 26, fontWeight: 900,
                            color: isLive ? "#4ade80" : "#e2e8f0",
                            fontFamily: "'Courier New', monospace",
                            letterSpacing: "3px", lineHeight: 1,
                            textShadow: isLive
                              ? "0 0 20px rgba(74,222,128,0.4)"
                              : "0 2px 4px rgba(0,0,0,0.6)",
                            transition: "all 0.3s"
                          }}
                        >
                          {match.goles_local ?? 0}<span style={{
                            color: isLive ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.15)",
                            margin: "0 1px"
                          }}>–</span>{match.goles_visitante ?? 0}
                        </div>
                      )}
                    </div>

                    {/* Equipo Visitante */}
                    <div style={{
                      flex: 1, display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 6
                    }}>
                      <div className="team-logo-wrap" style={{
                        width: 46, height: 46,
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: "50%",
                        border: "1px solid #1a2233",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.3s"
                      }}>
                        {getLogoUrl(match.logo2) ? (
                          <img
                            src={getLogoUrl(match.logo2)}
                            alt={match.team2}
                            style={{ width: 30, height: 30, objectFit: "contain" }}
                            onError={e => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <span style={{ fontSize: 16, opacity: 0.2 }}>⚽</span>
                        )}
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: "#94a3b8",
                        textAlign: "center", lineHeight: 1.2,
                        maxWidth: 72, overflow: "hidden",
                        whiteSpace: "nowrap", textOverflow: "ellipsis"
                      }}>{match.team2}</span>
                    </div>

                  </div>

                  {/* Línea divisoria inferior sutil */}
                  {!isPending && (
                    <div style={{
                      marginTop: 12, height: 1,
                      background: "linear-gradient(90deg, transparent, #1a2233, transparent)"
                    }} />
                  )}

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// --- Divisiones ---
const Divisions = () => (
  <section className="divisions" id="driver-divisions">
    <div className="container">
      <div className="section-header">
        <h2>Divisiones</h2>
        <p>Sigue el movimiento de todas las categorías del fútbol profesional</p>
      </div>
      <motion.div className="divisions-grid" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <motion.div className="division-card" variants={itemVariants} id="primera">
          <div className="division-card-banner bg-primary"><span className="division-number">1</span></div>
          <div className="division-card-body"><h3>Primera División</h3><p>La élite del fútbol salvadoreño.</p><div className="division-card-footer"><span className="team-count">12 equipos</span><a href="/primera" className="btn-ghost">Ver más <ArrowRight /></a></div></div>
        </motion.div>
        <motion.div className="division-card" variants={itemVariants} id="segunda">
          <div className="division-card-banner bg-secondary"><span className="division-number">2</span></div>
          <div className="division-card-body"><h3>Segunda División</h3><p>Camino hacia la élite.</p><div className="division-card-footer"><span className="team-count">24 equipos</span><a href="/segunda" className="btn-ghost">Ver más <ArrowRight /></a></div></div>
        </motion.div>
        <motion.div className="division-card" variants={itemVariants} id="tercera">
          <div className="division-card-banner bg-dark"><span className="division-number">3</span></div>
          <div className="division-card-body"><h3>Tercera División</h3><p>Semillero de talentos.</p><div className="division-card-footer"><span className="team-count">40+ equipos</span><a href="/tercera" className="btn-ghost">Ver más <ArrowRight /></a></div></div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// --- Noticias ---
const NewsSection = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}get_news.php`)
      .then(res => res.json())
      .then(data => setNews(data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="news" id="driver-news">
      <div className="container">
        <div className="section-header">
          <h2>Últimas Noticias</h2>
          <p>Mantente al día con lo más relevante del fútbol salvadoreño</p>
        </div>
        <div className="news-grid">
          {news.map((n) => {
            const isVideo   = n.imagen?.includes(".mp4");
            const isYoutube = n.imagen?.includes("youtube.com") || n.imagen?.includes("youtu.be");

            const getYoutubeEmbed = (url) => {
              if (!url) return "";
              if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
              if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
              return url;
            };

            return (
              <Link to={`/noticia/${n.id}`} className="news-card" key={n.id}>
                {isYoutube ? (
                  <div className="news-card-image youtube-thumb">
                    <img src={`https://img.youtube.com/vi/${getYoutubeEmbed(n.imagen).split("embed/")[1]}/hqdefault.jpg`} alt="video" className="youtube-img" />
                    <div className="play-overlay">▶</div>
                  </div>
                ) : isVideo ? (
                  <video src={n.imagen} className="news-card-video" muted autoPlay loop />
                ) : (
                  <div className="news-card-image" style={{ backgroundImage: `url(${n.imagen || "https://via.placeholder.com/400x250"})` }} />
                )}
                <div className="news-card-body">
                  <span className="badge badge-outline-gray">{n.categoria}</span>
                  <h3>{n.titulo}</h3>
                  <p>{n.contenido?.substring(0, 80)}...</p>
                  <div className="news-card-footer">
                    <div className="meta-item"><CalendarIcon /> {new Date(n.fecha).toLocaleDateString()}</div>
                    <div className="news-card-actions"><span className="author">{n.autor}</span></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- HOME PRINCIPAL ---
function Home() {
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("tourShown");
    if (!alreadyShown) {
      const driverObj = driver({
        showProgress: true, allowClose: true,
        nextBtnText: "Siguiente", prevBtnText: "Atrás", doneBtnText: "Listo",
        steps: [
          { element: '#driver-header',    popover: { title: 'Menú principal', description: 'Navega entre divisiones, noticias o accede a tu cuenta.',      side: 'bottom', align: 'start'  } },
          { element: '#driver-hero',      popover: { title: 'Portada',        description: 'Sección principal con lo más importante del fútbol nacional.', side: 'bottom', align: 'center' } },
          { element: '#driver-carousel',  popover: { title: 'Resultados',     description: 'Últimos marcadores de los partidos de Primera División.',      side: 'top',    align: 'center' } },
          { element: '#driver-divisions', popover: { title: 'Divisiones',     description: 'Explora Primera, Segunda y Tercera división.',                  side: 'top',    align: 'center' } },
          { element: '#driver-news',      popover: { title: 'Noticias',       description: 'Las últimas novedades del fútbol salvadoreño.',                 side: 'top',    align: 'center' } },
          { element: '#driver-footer',    popover: { title: 'Información',    description: 'Enlaces útiles y redes sociales.',                              side: 'top',    align: 'center' } },
        ],
      });
      const timer = setTimeout(() => {
        driverObj.drive();
        sessionStorage.setItem("tourShown", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Carousel />
        <Divisions />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}

export default Home;