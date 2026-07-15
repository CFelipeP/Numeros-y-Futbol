import React, { useEffect, useCallback, useState } from 'react';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';
import { driver } from 'driver.js';
import { Link, useNavigate } from "react-router-dom";
import 'driver.js/dist/driver.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE, fixUrl } from '../config';

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

const sanitizeHtml = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  let result = div.innerHTML;
  result = result.replace(/&lt;span&gt;/g, '<span>').replace(/&lt;\/span&gt;/g, '</span>');
  return result;
};

// --- Hero ---
const Hero = ({ settings }) => {
  const title  = settings?.hero_title  || "Noticias y numeros que <span>genera el fútbol</span>";
  const desc   = settings?.hero_description || "Cobertura completa de todas las divisiones. Noticias, resultados y análisis del mejor fútbol salvadoreño en vivo.";
  const btn1   = settings?.hero_btn1_label || "Últimas Noticias";
  const link1  = settings?.hero_btn1_link  || "#noticias";
  const btn2   = settings?.hero_btn2_label || "Ver Resultados";
  const link2  = settings?.hero_btn2_link  || "#divisiones";
  const banner = settings?.hero_banner_url || "";
  return (
  <section className="hero">
    <div className="hero-bg-image" style={banner ? { backgroundImage:`url(${banner})` } : {}} />
    <ParticleBackground />
    <div className="hero-overlay" />
    <div className="container hero-content">
      <motion.h1 id="driver-hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }} />
      <motion.p className="hero-description" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
        {desc}
      </motion.p>
      <motion.div className="hero-buttons" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
        <a href={link1} className="btn btn-white">{btn1}</a>
        <a href={link2} className="btn btn-outline-white">{btn2}</a>
      </motion.div>
    </div>
  </section>
  );
};

// --- Carousel con Cards ---
const Carousel = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}get_carousel.php?division=primera`).then(res => res.json()),
      fetch(`${API_BASE}get_carousel.php?division=femenina`).then(res => res.json())
    ]).then(([data1, data2]) => {
        const all = [...(data1.data || []), ...(data2.data || [])];
        all.sort((a, b) => {
          const order = { 'En Curso': 0, 'Pendiente': 1, 'Finalizado': 2 };
          return (order[a.estado] ?? 3) - (order[b.estado] ?? 3);
        });
        setMatches(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getLogoUrl = (logo) => {
    if (!logo) return null;
    if (logo.startsWith("http")) return logo;
    return `${API_BASE}${logo}`;
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
              <div key={i} className="skeleton-card-mobile" style={{
                minWidth: 260, height: 110, borderRadius: 16, flexShrink: 0,
                background: "#0d1117",
                border: "1px solid #1e293b",
                animation: `skeleton-pulse 1.8s ease-in-out infinite`,
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
  const duration = matches.length * 3;

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
        @media (max-width: 768px) {
          .carousel-card {
            min-width: 75vw !important;
            padding: 12px 14px !important;
            border-radius: 14px !important;
          }
          .carousel-card .card-score {
            font-size: 22px !important;
          }
          .carousel-card .team-logo-wrap {
            width: 36px !important;
            height: 36px !important;
          }
          .carousel-card .team-logo-wrap img {
            width: 24px !important;
            height: 24px !important;
          }
          .carousel-card .team-name-carousel {
            font-size: 9px !important;
            max-width: 55px !important;
          }
          .carousel-fade-left, .carousel-fade-right {
            width: 40px !important;
          }
        }
        @media (max-width: 480px) {
          .carousel-card {
            min-width: 85vw !important;
            padding: 10px 12px !important;
            border-radius: 12px !important;
          }
          .carousel-card .card-score {
            font-size: 18px !important;
            min-width: 40px !important;
          }
          .carousel-card .team-logo-wrap {
            width: 32px !important;
            height: 32px !important;
          }
          .carousel-card .team-logo-wrap img {
            width: 20px !important;
            height: 20px !important;
          }
          .carousel-fade-left, .carousel-fade-right {
            width: 24px !important;
          }
        }
      `}</style>

      <div className="results-carousel-section" id="driver-carousel" style={{ overflow: "hidden", position: "relative" }}>

        <div className="carousel-wrapper">
          <div className="carousel-track" style={{
            animation: `carousel-scroll ${duration}s linear infinite`,
            gap: 18,
          }}>
            {display.map((match, idx) => {
              const isPending = match.estado === "Pendiente";
              const isLive = match.estado === "En Curso";
              const isFinished = match.estado === "Finalizado";

              return (
                <div className="carousel-card" key={`m-${idx}`}
                  onClick={() => { if ((isPending || isLive) && match.id) navigate(`/partido/${match.id}/${match.division || 'primera'}`); }}
                  style={{
                  background: "linear-gradient(160deg, #0d1117 0%, #111827 50%, #0f1319 100%)",
                  border: "1px solid #1a2233",
                  borderRadius: 20,
                  padding: "16px 18px 14px 18px",
                  minWidth: 260,
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                  cursor: (isPending || isLive) && match.id ? "pointer" : "default",
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
                        transition: "all 0.9s"
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
                      <span className="team-name-carousel" style={{
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
                        transition: "all 0.9s"
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
                      <span className="team-name-carousel" style={{
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
        <motion.div className="division-card" variants={itemVariants} id="ascenso">
          <div className="division-card-banner bg-secondary"><span className="division-number">2</span></div>
          <div className="division-card-body"><h3>Liga de Ascenso</h3><p>El camino hacia la elite.</p><div className="division-card-footer"><span className="team-count">40+ equipos</span><a href="/ascenso" className="btn-ghost">Ver mas <ArrowRight /></a></div></div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// --- Noticias ---
const NewsSection = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}get_news.php`)
      .then(res => res.json())
      .then(data => setNews(data.slice(0, 3)))
      .catch(() => {});
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
            const isVideo   = fixUrl(n.imagen)?.includes(".mp4");
            const isYoutube = fixUrl(n.imagen)?.includes("youtube.com") || fixUrl(n.imagen)?.includes("youtu.be");

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
                    <img src={`https://img.youtube.com/vi/${getYoutubeEmbed(fixUrl(n.imagen)).split("embed/")[1]}/hqdefault.jpg`} alt="video" className="youtube-img" />
                    <div className="play-overlay">▶</div>
                  </div>
                ) : isVideo ? (
                  <video src={fixUrl(n.imagen)} className="news-card-video" muted autoPlay loop />
                ) : (
                  <div className="news-card-image" style={{ backgroundImage: `url(${fixUrl(n.imagen) || "https://via.placeholder.com/400x250"})` }} />
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
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}get_site_settings.php`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.settings) {
          setSiteSettings(d.settings);
        }
      }).catch(() => {});
  }, []);

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
          { element: '#driver-divisions', popover: { title: 'Divisiones',     description: 'Explora Primera y la Liga de Ascenso.',                  side: 'top',    align: 'center' } },
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
      {/* ESTILOS RESPONSIVOS - Solo afectan a móviles, NO modifican escritorio */}
      <style>{`
        @media (max-width: 768px) {
          /* General */
          .container {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          /* Hero */
          .hero-content h1 {
            font-size: 2rem !important;
            line-height: 1.2 !important;
          }
          .hero-content .hero-description {
            font-size: 0.9rem !important;
            margin-bottom: 1.5rem !important;
          }
          .hero-buttons {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: stretch !important;
          }
          .hero-buttons .btn {
            width: 100% !important;
            text-align: center !important;
          }

          /* Carousel */
          .skeleton-card-mobile {
            min-width: 85vw !important;
          }
          .carousel-card {
            min-width: 85vw !important;
            padding: 12px 14px 10px 14px !important;
          }
          .carousel-fade-left,
          .carousel-fade-right {
            width: 30px !important;
          }
          .team-logo-wrap {
            width: 38px !important;
            height: 38px !important;
          }
          .team-logo-wrap img {
            width: 24px !important;
            height: 24px !important;
          }
          .card-score {
            font-size: 22px !important;
            min-width: 50px !important;
          }
          .team-name-carousel {
            font-size: 9px !important;
          }

          /* Divisions */
          .divisions-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          /* News */
          .news-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .news-card-body h3 {
            font-size: 1.1rem !important;
          }
          .news-card-body p {
            font-size: 0.85rem !important;
          }

          /* Driver.js mobile fixes (El tour) */
          .driver-popover {
            max-width: 90vw !important;
          }
        }
        
        @media (max-width: 380px) {
          .hero-content h1 {
            font-size: 1.75rem !important;
          }
          .carousel-card {
            min-width: 90vw !important;
          }
        }
      `}</style>

      <Header />
      <main>
        <Hero settings={siteSettings} />
        <Carousel />
        <Divisions />
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}

export default Home;