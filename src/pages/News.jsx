import React from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
// Importamos los componentes compartidos
import Header from "../components/Header";
import Footer from "../components/Footer";

// --- DATOS DE PRUEBA (Mantenemos los que te di antes) ---
const featuredNews = {
    id: 1,
    title: "El clásico nacional define al nuevo campeón del torneo aperture 2023",
    excerpt: "Una final llena de emociones, penales y controversy definió al nuevo rey del fútbol nacional en un estadio repleto.",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    category: "Final Nacional",
    date: "25 Oct 2023",
    author: "Carlos Martínez"
};

const sideNews = [
    { id: 2, title: "Nuevas incorporaciones para el próximo torneo clausura", image: "https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Mercado" },
    { id: 3, title: "La selección Sub-20 viaja al mundial con grandes expectativas", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Selección" }
];

const latestNews = [
    { id: 4, title: "Análisis táctico: Cómo romper la línea defensiva 4-4-2", excerpt: "Los mejores entrenadores nos cuentan sus secretos para desbloquear defensas cerradas usando juego aéreo.", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Táctica", date: "24 Oct 2023", author: "Ana Gómez" },
    { id: 5, title: "Estadios modernos: El futuro de la infraestructura deportiva", excerpt: "Proyectos de renovación prometen cambiar la experiencia de los hinchas en los próximos 5 años.", image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Infraestructura", date: "22 Oct 2023", author: "Roberto Díaz" },
    { id: 6, title: "El VAR y sus polémicas: Un repaso por las decisiones más discutidas", excerpt: "Expertos en arbitraje analizan si la tecnología está ayudando o perjudicando el espectáculo.", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Opinión", date: "20 Oct 2023", author: "Mario Herrera" },
    { id: 7, title: "Jugador del mes: Estadísticas récord que sorprenden a todos", excerpt: "Un repaso por los números que han dejado a los analistas sin palabras en el último mes.", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", category: "Estadísticas", date: "18 Oct 2023", author: "Sofía López" }
];
// -------------------------------------------------------

export default function News() {
    return (
        <>
            {/* AGREGAMOS EL HEADER AQUÍ */}
            <Header />

            <div className="news-page-container">

                {/* Encabezado de Página */}
                <header className="news-page-header">
                    <h1>Centro de Noticias</h1>
                    <p>Mantente al día con lo último del mundo futbolístico, análisis tácticos y resultados en vivo.</p>
                </header>

                {/* Sección Spotlight (Hero) */}
                <section className="spotlight-section">
                    <article className="main-news-card">
                        <img src={featuredNews.image} alt={featuredNews.title} />
                        <div className="main-news-overlay">
                            <span className="category-badge">{featuredNews.category}</span>
                            <h2>{featuredNews.title}</h2>
                            <p>{featuredNews.excerpt}</p>
                            <div className="article-meta" style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                                <span><Calendar size={14} /> {featuredNews.date}</span>
                                <span><User size={14} /> {featuredNews.author}</span>
                            </div>
                        </div>
                    </article>

                    <div className="side-news-stack">
                        {sideNews.map((news) => (
                            <article key={news.id} className="side-news-card">
                                <img src={news.image} alt={news.title} />
                                <div className="side-news-content">
                                    <span className="category-badge">{news.category}</span>
                                    <h3>{news.title}</h3>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Grilla de Noticias Recientes */}
                <section className="news-grid-section">
                    <h2 className="section-title">Últimas Noticias</h2>
                    <div className="news-grid-new">
                        {latestNews.map((news) => (
                            <article key={news.id} className="article-card">
                                <div className="article-image">
                                    <img src={news.image} alt={news.title} />
                                    <span className="category-badge">{news.category}</span>
                                </div>
                                <div className="article-body">
                                    <div className="article-meta">
                                        <span><Calendar size={14} /> {news.date}</span>
                                    </div>
                                    <h3>{news.title}</h3>
                                    <p>{news.excerpt}</p>
                                    <div className="article-footer">
                                        <span className="author-name"><User size={14} style={{ marginRight: '5px', opacity: 0.7 }} />{news.author}</span>
                                        <a href="#" className="read-more">
                                            Leer más <ArrowRight size={16} />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            {/* AGREGAMOS EL FOOTER AQUÍ */}
            <Footer />
        </>
    );
}