import React, { useEffect, useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import { motion } from 'framer-motion';
import { driver } from 'driver.js';
import { useState } from "react";
import { Link } from "react-router-dom";
import 'driver.js/dist/driver.css';

// Importamos componentes compartidos
import Header from '../components/Header';
import Footer from '../components/Footer';


// --- Configuración de Animaciones ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// --- Iconos SVG (Solo los necesarios para las secciones internas) ---
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
);
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
);
const UserIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

// --- Datos Mockeados ---
const MATCHES_DATA = [
  { team1: "FAS", logo1: "https://img.sofascore.com/api/v1/team/24386/image", score: "2 - 1", team2: "L.A. Firpo", logo2: "https://img.sofascore.com/api/v1/team/24388/image", meta: "Finalizado - Jornada 1" },
  { team1: "Águila", logo1: "https://img.sofascore.com/api/v1/team/24385/image", score: "3 - 0", team2: "Inter FA", logo2: "https://img.sofascore.com/api/v1/team/343177/image", meta: "Finalizado - Jornada 1" },
  { team1: "Alianza", logo1: "https://img.sofascore.com/api/v1/team/24383/image", score: "1 - 1", team2: "Isidro Metapán", logo2: "https://img.sofascore.com/api/v1/team/24382/image", meta: "Finalizado - Jornada 1" },
  { team1: "Municipal Limeño", logo1: "https://img.sofascore.com/api/v1/team/228633/image", score: "0 - 0", team2: "CD Cacahuatique", logo2: "https://img.sofascore.com/api/v1/team/335240/image", meta: "Finalizado - Jornada 1" },
  { team1: "C.D. Platense", logo1: "https://img.sofascore.com/api/v1/team/306368/image", score: "2 - 2", team2: "Fuerte", logo2: "https://img.sofascore.com/api/v1/team/310030/image", meta: "Finalizado - Jornada 1" },
  { team1: "CD Hercules", logo1: "https://img.sofascore.com/api/v1/team/1099336/image", score: "1 - 0", team2: "Zacatecoluca FC", logo2: "https://img.sofascore.com/api/v1/team/852872/image", meta: "Finalizado - Jornada 1" }
];

const NEWS_DATA = [
  { img: "https://picsum.photos/seed/futbol2/400/300", category: "Primera División", title: "Isidro Metapán avanza en copa con goleada", excerpt: "Los caleros derrotaron 4-0 a su rival y avanzan de ronda en la copa nacional.", date: "4 Feb, 2026", author: "Redacción" },
  { img: "https://picsum.photos/seed/futbol3/400/300", category: "Tercera División", title: "Jóvenes talentos brillan en tercera", excerpt: "Promesas del fútbol salvadoreño muestran su calidad en los partidos de la tercera división.", date: "3 Feb, 2026", author: "Análisis" },
  { img: "https://picsum.photos/seed/futbol4/400/300", category: "Segunda División", title: "Emoción en la pelea por el ascenso", excerpt: "Los equipos de segunda división siguen en la lucha cerrada por conseguir el boleto.", date: "2 Feb, 2026", author: "Corresponsal" },
  {
    videoUrl: "https://assets.adidas.com/videos/ar_1,w_720,c_fill,q_auto,f_auto/a2ef09f2af414cb2a11aea2103fd32a6_d98c/Japan_26_Home_Authentic_Jersey_Blue_JN1867_video.mp4",
    category: "Video", title: "Resumen: Los mejores goles de la jornada", excerpt: "No te pierdas los mejores jugadas y golazos de la fecha 14 en la Primera División.", date: "1 Feb, 2026", author: " Multimedia", isVideo: true
  },
];

// --- Componente Partículas Configurado ---
const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => { await loadFull(engine); }, []);
  const options = {
    background: { color: { value: "transparent" } }, fpsLimit: 60,
    interactivity: { events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "grab" }, resize: true }, modes: { push: { quantity: 4 }, grab: { distance: 140, links: { opacity: 1 } } } },
    particles: { color: { value: "#ff004d" }, links: { color: "#ff004d", distance: 150, enable: true, opacity: 0.5, width: 1 }, move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false }, number: { density: { enable: true }, value: 60 }, opacity: { value: 0.5 }, shape: { type: "circle" }, size: { value: { min: 1, max: 3 } } },
    detectRetina: true,
  };
  return <Particles id="tsparticles" init={particlesInit} options={options} className="hero-particles" />;
};

// --- Componentes de Sección (Locales de Home) ---

const Hero = () => (
  <section className="hero">
    <div className="hero-bg-image"></div>
    <ParticleBackground />
    <div className="hero-overlay"></div>
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

const Carousel = () => {
  const displayMatches = [...MATCHES_DATA, ...MATCHES_DATA];
  return (
    <div className="results-carousel-section" id="driver-carousel">
      <div className="carousel-wrapper">
        <div className="carousel-track">
          {displayMatches.map((match, idx) => (
            <div className="match-card-slide" key={`match-${idx}`}>
              <div className="match-card-teams">
                <div className="match-team-info"><img src={match.logo1} alt={match.team1} className="team-logo-small" /><span className="team-name">{match.team1}</span></div>
                <div className="match-score-display">{match.score}</div>
                <div className="match-team-info"><img src={match.logo2} alt={match.team2} className="team-logo-small" /><span className="team-name">{match.team2}</span></div>
              </div>
              <div className="match-meta">{match.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Divisions = () => (
  <section className="divisions" id="driver-divisions">
    <div className="container">
      <div className="section-header"><h2>Divisiones</h2><p>Sigue el movimiento de todas las categorías del fútbol profesional</p></div>
      <motion.div className="divisions-grid" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <motion.div className="division-card" variants={itemVariants} id="primera">
          <div className="division-card-banner bg-primary"><span className="division-number">1</span></div>
          <div className="division-card-body"><h3>Primera División</h3><p>La élite del fútbol salvadoreño.</p><div className="division-card-footer"><span className="team-count">12 equipos</span><a href="#" className="btn-ghost">Ver más <ArrowRight /></a></div></div>
        </motion.div>
        <motion.div className="division-card" variants={itemVariants} id="segunda">
          <div className="division-card-banner bg-secondary"><span className="division-number">2</span></div>
          <div className="division-card-body"><h3>Segunda División</h3><p>Camino hacia la élite.</p><div className="division-card-footer"><span className="team-count">24 equipos</span><a href="#" className="btn-ghost">Ver más <ArrowRight /></a></div></div>
        </motion.div>
        <motion.div className="division-card" variants={itemVariants} id="tercera">
          <div className="division-card-banner bg-dark"><span className="division-number">3</span></div>
          <div className="division-card-body"><h3>Tercera División</h3><p>Semillero de talentos.</p><div className="division-card-footer"><span className="team-count">40+ equipos</span><a href="#" className="btn-ghost">Ver más <ArrowRight /></a></div></div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const NewsSection = () => {

  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://numeros-y-futbol.test/backend/get_news.php")
      .then(res => res.json())
      .then(data => {
        setNews(data.slice(0, 3)); // 🔥 SOLO 3 NOTICIAS
      })
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

            const isVideo = n.imagen?.includes(".mp4");
            const isYoutube =
              n.imagen?.includes("youtube.com") || n.imagen?.includes("youtu.be");

            const getYoutubeEmbed = (url) => {
              if (!url) return "";

              if (url.includes("watch?v=")) {
                return url.replace("watch?v=", "embed/");
              }

              if (url.includes("youtu.be/")) {
                return url.replace("youtu.be/", "youtube.com/embed/");
              }

              return url;
            };

            return (
              <Link to={`/noticia/${n.id}`} className="news-card" key={n.id}>

                {/* MEDIA */}
                {isYoutube ? (
                  <div className="news-card-image youtube-thumb">

                    <img
                      src={`https://img.youtube.com/vi/${getYoutubeEmbed(n.imagen).split("embed/")[1]}/hqdefault.jpg`}
                      alt="video"
                      className="youtube-img"
                    />

                    <div className="play-overlay">
                      ▶
                    </div>

                  </div>
                ) : isVideo ? (
                  <video
                    src={n.imagen}
                    className="news-card-video"
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <div
                    className="news-card-image"
                    style={{
                      backgroundImage: `url(${n.imagen || "https://via.placeholder.com/400x250"})`
                    }}
                  />
                )}

                {/* BODY */}
                <div className="news-card-body">
                  <span className="badge badge-outline-gray">
                    {n.categoria}
                  </span>

                  <h3>{n.titulo}</h3>

                  <p>
                    {n.contenido?.substring(0, 80)}...
                  </p>

                  <div className="news-card-footer">
                    <div className="meta-item">
                      <CalendarIcon /> {new Date(n.fecha).toLocaleDateString()}
                    </div>

                    <div className="news-card-actions">
                      <span className="author">{n.autor}</span>
                    </div>
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
        showProgress: true, allowClose: true, nextBtnText: "Siguiente", prevBtnText: "Atrás", doneBtnText: "Listo",
        steps: [
          { element: '#driver-header', popover: { title: 'Menú principal', description: 'Navega entre divisiones, noticias o accede a tu cuenta.', side: 'bottom', align: 'start' } },
          { element: '#driver-hero', popover: { title: 'Portada', description: 'Sección principal con lo más importante del fútbol nacional.', side: 'bottom', align: 'center' } },
          { element: '#driver-carousel', popover: { title: 'Resultados', description: 'Últimos marcadores de los partidos recientes.', side: 'top', align: 'center' } },
          { element: '#driver-divisions', popover: { title: 'Divisiones', description: 'Explora Primera, Segunda y Tercera división.', side: 'top', align: 'center' } },
          { element: '#driver-news', popover: { title: 'Noticias', description: 'Las últimas novedades del fútbol salvadoreño.', side: 'top', align: 'center' } },
          { element: '#driver-footer', popover: { title: 'Información', description: 'Enlaces útiles y redes sociales.', side: 'top', align: 'center' } }
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