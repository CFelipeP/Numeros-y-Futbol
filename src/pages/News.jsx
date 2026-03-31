import React, { useEffect, useState } from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

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

    const renderMedia = (url, title, id) => {
        const fallback = "https://via.placeholder.com/400";

        if (!url) {
            return <img src={fallback} alt={title} />;
        }

        if (url.includes(".mp4")) {
            return (
                <Link to={`/noticia/${id}`}>
                    <video
                        muted
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        autoPlay
                        loop
                    >
                        <source src={url} type="video/mp4" />
                    </video>
                </Link>
            );
        }

        return (
            <Link to={`/noticia/${id}`}>
            <img
                src={url}
                alt={title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            </Link>
        );
    };

    return (
        <>
            <Header />

            <div className="news-page-container">

                <header className="news-page-header">
                    <div className="news-header-glow" />
                    <span className="news-header-tag">Actualidad</span>
                    <h1>Centro de Noticias</h1>
                    <p>
                        Mantente al día con lo último del mundo futbolístico,
                        análisis tácticos y resultados en vivo.
                    </p>
                </header>

                <section className="spotlight-section">

                    {featuredNews && (
                        <article className="main-news-card">
                            <div className="main-news-media">
                                {renderMedia(featuredNews.imagen, featuredNews.titulo, featuredNews.id)}
                            </div>
                            <div className="main-news-shine" />

                            <div className="main-news-overlay">
                                <span className="category-badge">
                                    {featuredNews.categoria || "General"}
                                </span>
                                <h2>{featuredNews.titulo}</h2>
                                <p className="main-news-excerpt">
                                    {featuredNews.contenido || "Sin descripción disponible"}
                                </p>
                                <div className="article-meta">
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

                    <div className="side-news-stack">
                        {sideNews.map((n) => (
                            <article key={n.id} className="side-news-card">
                                <div className="side-news-media">
                                    {renderMedia(n.imagen, n.titulo, n.id)}
                                </div>
                                <div className="side-news-content">
                                    <span className="category-badge category-sm">
                                        {n.categoria || "General"}
                                    </span>
                                    <h3>{n.titulo}</h3>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="news-grid-section">
                    <div className="news-grid-header">
                        <div className="news-grid-header-left">
                            <div className="news-grid-bar" />
                            <h2 className="section-title">Últimas Noticias</h2>
                        </div>
                        <span className="news-grid-pill">
                            {latestNews.length} artículos
                        </span>
                    </div>

                    <div className="news-grid-new">
                        {latestNews.map((n) => (
                            <article key={n.id} className="article-card">
                                <div className="article-image">
                                    <div className="article-media-wrap">
                                        {renderMedia(n.imagen, n.titulo, n.id)}
                                    </div>
                                    <div className="article-image-fade" />
                                    <span className="category-badge">
                                        {n.categoria || "General"}
                                    </span>
                                </div>

                                <div className="article-body">
                                    <div className="article-meta">
                                        <span>
                                            <Calendar size={13} />{" "}
                                            {new Date(n.fecha).toLocaleDateString()}
                                        </span>
                                        <span className="meta-dot" />
                                        <span>
                                            <User size={13} /> {n.autor}
                                        </span>
                                    </div>

                                    <h3>{n.titulo}</h3>

                                    <p className="article-excerpt">
                                        {n.contenido || "Sin descripción disponible"}
                                    </p>

                                    <div className="article-footer">
                                        <a href="#" className="read-more">
                                            Leer más <ArrowRight size={15} />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />

            <style>{`
                /* ============================================
                   VARIABLES Y RESET
                   ============================================ */
                .news-page-container {
                    --accent: #e2b340;
                    --accent-soft: rgba(226, 179, 64, 0.12);
                    --accent-border: rgba(226, 179, 64, 0.25);
                    --bg-card: rgba(255, 255, 255, 0.02);
                    --border-card: rgba(255, 255, 255, 0.06);
                    --text-main: #f1f5f9;
                    --text-dim: #94a3b8;
                    --text-muted: #64748b;
                    --radius: 18px;
                    --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 0 2rem 6rem;
                }

                /* Animación de entrada suave */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                
                .news-page-container > * {
                    animation: fadeUp 0.8s var(--ease) both;
                }
                .news-page-container > *:nth-child(1) { animation-delay: 0.1s; }
                .news-page-container > *:nth-child(2) { animation-delay: 0.25s; }
                .news-page-container > *:nth-child(3) { animation-delay: 0.4s; }

                /* ============================================
                   CABECERA
                   ============================================ */
                .news-page-header {
                    text-align: center;
                    padding: 5rem 0 4rem;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .news-header-glow {
                    position: absolute;
                    top: -50px;
                    width: 500px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(226,179,64,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }

                .news-header-tag {
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: var(--accent);
                    background: var(--accent-soft);
                    border: 1px solid var(--accent-border);
                    padding: 0.4rem 1rem;
                    border-radius: 50px;
                    margin-bottom: 1.5rem;
                }

                .news-page-header h1 {
                    font-size: 3.2rem;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                    margin-bottom: 1.25rem;
                    position: relative;
                }

                .news-page-header p {
                    font-size: 1.1rem;
                    color: var(--text-dim);
                    max-width: 560px;
                    margin: 0 auto;
                    line-height: 1.75;
                }

                /* ============================================
                   SPOTLIGHT
                   ============================================ */
                .spotlight-section {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 5rem;
                }

                /* Principal */
                .main-news-card {
                    position: relative;
                    height: 560px;
                    overflow: hidden;
                    border-radius: var(--radius);
                    cursor: pointer;
                    background: #080808;
                    border: 1px solid var(--border-card);
                    transition: transform 0.6s var(--ease), box-shadow 0.6s var(--ease), border-color 0.4s ease;
                }

                .main-news-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6), 0 0 40px -10px rgba(226,179,64,0.15);
                    border-color: var(--accent-border);
                }

                .main-news-media {
                    position: absolute;
                    inset: 0;
                    transition: transform 0.8s var(--ease);
                }

                .main-news-card:hover .main-news-media {
                    transform: scale(1.06);
                }

                .main-news-shine {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, transparent 50%);
                    opacity: 0;
                    transition: opacity 0.6s ease, transform 0.6s ease;
                    z-index: 1;
                    pointer-events: none;
                }

                .main-news-card:hover .main-news-shine {
                    opacity: 1;
                    transform: translateX(20px);
                }

                .main-news-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 6rem 2.5rem 2.5rem;
                    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%);
                    z-index: 2;
                }

                .main-news-overlay .category-badge {
                    margin-bottom: 1rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                }

                .main-news-overlay h2 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.25;
                    margin-bottom: 0.85rem;
                    letter-spacing: -0.02em;
                    transition: color 0.3s ease;
                }

                .main-news-card:hover .main-news-overlay h2 {
                    color: #fff;
                    text-shadow: 0 0 30px rgba(226,179,64,0.2);
                }

                .main-news-excerpt {
                    font-size: 0.92rem;
                    color: rgba(255,255,255,0.5);
                    line-height: 1.7;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                }

                .main-news-overlay .article-meta {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    color: rgba(255,255,255,0.45);
                }

                .main-news-overlay .article-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.78rem;
                    font-weight: 500;
                }

                /* Laterales */
                .side-news-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    height: 560px;
                }

                .side-news-card {
                    position: relative;
                    flex: 1;
                    overflow: hidden;
                    border-radius: var(--radius);
                    cursor: pointer;
                    background: #080808;
                    border: 1px solid var(--border-card);
                    transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease), border-color 0.4s ease;
                }

                .side-news-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                    border-color: rgba(226,179,64,0.15);
                }

                .side-news-media {
                    position: absolute;
                    inset: 0;
                    transition: transform 0.8s var(--ease);
                }

                .side-news-card:hover .side-news-media {
                    transform: scale(1.08);
                }

                .side-news-content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 3rem 1.5rem 1.5rem;
                    background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 70%, transparent 100%);
                    z-index: 1;
                }

                .side-news-content h3 {
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    line-height: 1.35;
                    margin-top: 0.65rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    transition: color 0.3s ease;
                }

                .side-news-card:hover .side-news-content h3 {
                    color: var(--accent);
                }

                /* Badge global */
                .category-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.35rem 0.85rem;
                    border-radius: 8px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;

                    /* 🔥 NUEVO ESTILO */
                    background: linear-gradient(135deg, #0a1f44, #1e3a8a);
                    color: #facc15; /* dorado */
                    border: 1px solid rgba(250, 204, 21, 0.5);

                    /* glow elegante */
                    box-shadow: 
                        0 0 10px rgba(250, 204, 21, 0.25),
                        0 4px 12px rgba(0,0,0,0.4);

                    backdrop-filter: blur(10px);
                }

                .category-sm {
                    padding: 0.25rem 0.65rem;
                    font-size: 0.6rem;
                }

                /* ============================================
                   GRID
                   ============================================ */
                .news-grid-section {
                    margin-bottom: 2rem;
                }

                .news-grid-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2.5rem;
                }

                .news-grid-header-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .news-grid-bar {
                    width: 5px;
                    height: 32px;
                    background: linear-gradient(to bottom, var(--accent), rgba(226,179,64,0.1));
                    border-radius: 10px;
                    box-shadow: 0 0 15px rgba(226,179,64,0.3);
                }

                .section-title {
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: var(--text-main);
                    letter-spacing: -0.02em;
                }

                .news-grid-pill {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    padding: 0.4rem 1rem;
                    background: var(--bg-card);
                    border: 1px solid var(--border-card);
                    border-radius: 50px;
                    font-weight: 500;
                }

                .news-grid-new {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.75rem;
                }

                /* Tarjeta Grid */
                .article-card {
                    background: linear-gradient(165deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
                    border: 1px solid var(--border-card);
                    border-radius: var(--radius);
                    overflow: hidden;
                    position: relative;
                    transition: all 0.5s var(--ease);
                    cursor: pointer;
                }

                /* Efecto de brillo superior en hover */
                .article-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(226,179,64,0), transparent);
                    z-index: 10;
                    transition: background 0.5s ease;
                }

                .article-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 
                        0 30px 60px -15px rgba(0,0,0,0.4),
                        0 0 0 1px rgba(226,179,64,0.1),
                        inset 0 1px 0 rgba(255,255,255,0.05);
                    border-color: rgba(226,179,64,0.12);
                    background: linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%);
                }

                .article-card:hover::before {
                    background: linear-gradient(90deg, transparent, rgba(226,179,64,0.5), transparent);
                }

                .article-card:hover .article-media-wrap {
                    transform: scale(1.07);
                }

                .article-card:hover .article-body h3 {
                    color: var(--accent);
                }

                .article-card:hover .read-more {
                    background: var(--accent-soft);
                    border-color: var(--accent-border);
                    color: var(--accent);
                    padding-left: 1.2rem;
                    padding-right: 1.2rem;
                }

                .article-card:hover .read-more svg {
                    transform: translateX(4px);
                }

                /* Imagen */
                .article-image {
                    position: relative;
                    aspect-ratio: 16 / 9;
                    overflow: hidden;
                }

                .article-media-wrap {
                    width: 100%;
                    height: 100%;
                    transition: transform 0.8s var(--ease);
                }

                .article-image-fade {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 40%;
                    background: linear-gradient(to top, rgba(8,8,8,1) 0%, transparent 100%);
                    pointer-events: none;
                    z-index: 1;
                }

                .article-image .category-badge {
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    z-index: 2;
                }

                /* Cuerpo */
                .article-body {
                    padding: 1.5rem 1.5rem 1.4rem;
                }

                .article-body .article-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    margin-bottom: 0.85rem;
                    color: var(--text-muted);
                }

                .article-body .article-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .meta-dot {
                    width: 3px;
                    height: 3px;
                    background: var(--text-muted);
                    border-radius: 50%;
                    opacity: 0.5;
                }

                .article-body h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-main);
                    line-height: 1.4;
                    margin-bottom: 0.65rem;
                    transition: color 0.3s ease;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .article-excerpt {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    line-height: 1.7;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                }

                .article-footer {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }

                .read-more {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-dim);
                    text-decoration: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: 1px solid transparent;
                    background: transparent;
                    transition: all 0.4s var(--ease);
                }

                .read-more svg {
                    transition: transform 0.3s var(--ease);
                    flex-shrink: 0;
                }

                /* ============================================
                   RESPONSIVE
                   ============================================ */
                @media (max-width: 1100px) {
                    .news-grid-new {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .news-page-container {
                        padding: 0 1.25rem 4rem;
                    }

                    .news-page-header {
                        padding: 3.5rem 0 2.5rem;
                    }

                    .news-page-header h1 {
                        font-size: 2.2rem;
                    }

                    .spotlight-section {
                        grid-template-columns: 1fr;
                    }

                    .main-news-card {
                        height: 400px;
                    }

                    .main-news-overlay {
                        padding: 3rem 1.5rem 1.5rem;
                    }

                    .main-news-overlay h2 {
                        font-size: 1.4rem;
                    }

                    .side-news-stack {
                        height: auto;
                    }

                    .side-news-card {
                        height: 220px;
                        flex: none;
                    }

                    .news-grid-new {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .news-page-header h1 {
                        font-size: 1.8rem;
                    }
                    
                    .main-news-card {
                        height: 320px;
                    }

                    .main-news-excerpt {
                        display: none;
                    }

                    .side-news-card {
                        height: 180px;
                    }

                    .section-title {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </>
    );
}