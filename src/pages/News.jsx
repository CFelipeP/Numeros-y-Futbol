import React, { useEffect, useState } from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function News() {

    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch("http://numeros-y-futbol.test/backend/get_news.php")
            .then(res => res.json())
            .then(data => setNews(data))
            .catch(err => console.error(err));
    }, []);

    const featuredNews = news[0];
    const sideNews = news.slice(1, 3);
    const latestNews = news.slice(3);

    return (
        <>
            <Header />

            <div className="news-page-container">

                {/* HEADER */}
                <header className="news-page-header">
                    <h1>Centro de Noticias</h1>
                    <p>
                        Mantente al día con lo último del mundo futbolístico,
                        análisis tácticos y resultados en vivo.
                    </p>
                </header>

                {/* 🔴 SPOTLIGHT */}
                <section className="spotlight-section">

                    {/* FEATURED */}
                    {featuredNews && (
                        <article className="main-news-card" style={{
                            position: 'relative',
                            height: '500px', // Altura fija para orden
                            overflow: 'hidden'
                        }}>
                            <img
                                src={featuredNews.imagen || "https://via.placeholder.com/1200x600"}
                                alt={featuredNews.titulo}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', // Mantiene proporción, recorta excedentes
                                    transition: 'transform 0.5s ease'
                                }}
                            />

                            <div className="main-news-overlay">
                                <span className="category-badge">
                                    {featuredNews.categoria || "General"}
                                </span>

                                <h2>{featuredNews.titulo}</h2>

                                <p style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3, // Limita a 3 líneas
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {featuredNews.contenido || "Sin descripción disponible"}
                                </p>

                                <div
                                    className="article-meta"
                                    style={{
                                        marginTop: "1rem",
                                        color: "rgba(255,255,255,0.7)"
                                    }}
                                >
                                    <span>
                                        <Calendar size={14} />{" "}
                                        {new Date(featuredNews.fecha).toLocaleDateString()}
                                    </span>

                                    <span>
                                        <User size={14} /> {featuredNews.autor}
                                    </span>
                                </div>
                            </div>
                        </article>
                    )}

                    {/* SIDE NEWS */}
                    {/* Forzamos a la columna lateral a tener la misma altura que la principal */}
                    <div className="side-news-stack" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        height: '500px' // Misma altura que el artículo principal
                    }}>
                        {sideNews.map((n) => (
                            <article key={n.id} className="side-news-card" style={{
                                position: 'relative',
                                flex: 1, // Cada tarjeta ocupa la mitad exacta
                                overflow: 'hidden',
                                borderRadius: '12px'
                            }}>
                                <img
                                    src={n.imagen || "https://via.placeholder.com/400"}
                                    alt={n.titulo}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease'
                                    }}
                                />

                                <div className="side-news-content" style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                    padding: '1.5rem'
                                }}>
                                    <span className="category-badge">
                                        {n.categoria || "General"}
                                    </span>

                                    <h3 style={{ color: 'white' }}>{n.titulo}</h3>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* 🟢 GRID */}
                <section className="news-grid-section">
                    <h2 className="section-title">Últimas Noticias</h2>

                    <div className="news-grid-new">
                        {latestNews.map((n) => (
                            <article key={n.id} className="article-card">

                                {/* Contenedor de imagen con proporción fija 16:9 */}
                                <div className="article-image" style={{
                                    position: 'relative',
                                    aspectRatio: '16 / 9', // CLAVE DEL DISEÑO PROPORCIONAL
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={n.imagen || "https://via.placeholder.com/400"}
                                        alt={n.titulo}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover' // Ajuste profesional
                                        }}
                                    />

                                    <span className="category-badge">
                                        {n.categoria || "General"}
                                    </span>
                                </div>

                                <div className="article-body">
                                    <div className="article-meta">
                                        <span>
                                            <Calendar size={14} />{" "}
                                            {new Date(n.fecha).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3>{n.titulo}</h3>

                                    <p style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3, // Limita a 3 líneas de texto
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        color: '#64748b' // Color suave para el texto
                                    }}>
                                        {n.contenido || "Sin descripción disponible"}
                                    </p>

                                    <div className="article-footer">
                                        <span className="author-name">
                                            <User
                                                size={14}
                                                style={{ marginRight: "5px", opacity: 0.7 }}
                                            />
                                            {n.autor}
                                        </span>

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

            <Footer />
        </>
    );
}