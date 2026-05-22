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
                        playsInline
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
                    loading="lazy"
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
                                    <span className="nw-m-hide">
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
                                        <span className="meta-dot nw-m-hide" />
                                        <span className="nw-m-hide">
                                            <User size={13} /> {n.autor}
                                        </span>
                                    </div>

                                    <h3>{n.titulo}</h3>

                                    <p className="article-excerpt">
                                        {n.contenido || "Sin descripción disponible"}
                                    </p>

                                    <div className="article-footer">
                                        <Link to={`/noticia/${n.id}`} className="read-more">
                                            Leer más <ArrowRight size={15} />
                                        </Link>
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
                    --accent: #f59e0b;
                    --accent-soft: rgba(245, 158, 11, 0.08);
                    --accent-border: rgba(245, 158, 11, 0.2);
                    --bg-card: rgba(255, 255, 255, 0.02);
                    --border-card: rgba(255, 255, 255, 0.06);
                    --text-main: #f8fafc;
                    --text-dim: #94a3b8;
                    --text-muted: #64748b;
                    --radius: 20px;
                    --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);

                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 0 2rem 6rem;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); filter: blur(2px); }
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
                    top: -80px;
                    width: 600px;
                    height: 350px;
                    background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
                    pointer-events: none;
                    filter: blur(20px);
                }

                .news-header-tag {
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: var(--accent);
                    background: var(--accent-soft);
                    border: 1px solid var(--accent-border);
                    padding: 0.45rem 1.2rem;
                    border-radius: 50px;
                    margin-bottom: 1.5rem;
                    backdrop-filter: blur(10px);
                }

                .news-page-header h1 {
                    font-size: 3.5rem;
                    font-weight: 800;
                    background: linear-gradient(180deg, #ffffff 20%, #94a3b8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
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
                    line-height: 1.8;
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
                    transform: translateY(-8px) scale(1.005);
                    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.1);
                    border-color: var(--accent-border);
                }

                .main-news-media {
                    position: absolute;
                    inset: 0;
                    transition: transform 0.8s var(--ease);
                }

                .main-news-card:hover .main-news-media {
                    transform: scale(1.05);
                }

                .main-news-shine {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, transparent 50%);
                    opacity: 0;
                    transition: opacity 0.6s ease, transform 0.6s ease;
                    z-index: 1;
                    pointer-events: none;
                }

                .main-news-card:hover .main-news-shine {
                    opacity: 1;
                    transform: translateX(30px);
                }

                .main-news-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 8rem 2.5rem 2.5rem;
                    background: linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.7) 40%, transparent 100%);
                    z-index: 2;
                }

                .main-news-overlay .category-badge {
                    margin-bottom: 1rem;
                }

                .main-news-overlay h2 {
                    font-size: 1.85rem;
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.25;
                    margin-bottom: 0.85rem;
                    letter-spacing: -0.02em;
                    transition: text-shadow 0.4s ease;
                }

                .main-news-card:hover .main-news-overlay h2 {
                    text-shadow: 0 0 40px rgba(245,158,11,0.15);
                }

                .main-news-excerpt {
                    font-size: 0.92rem;
                    color: rgba(255,255,255,0.45);
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
                    color: rgba(255,255,255,0.35);
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
                    transform: translateY(-5px);
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                    border-color: rgba(245,158,11,0.15);
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
                    padding: 4rem 1.5rem 1.5rem;
                    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%);
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

                /* ============================================
                   BADGES
                   ============================================ */
                .category-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.4rem 0.9rem;
                    border-radius: 8px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }

                .category-sm {
                    padding: 0.3rem 0.7rem;
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
                    width: 4px;
                    height: 32px;
                    background: var(--accent);
                    border-radius: 10px;
                    box-shadow: 0 0 15px rgba(245,158,11,0.4);
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
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .news-grid-new {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.75rem;
                }

                /* Tarjeta Grid */
                .article-card {
                    background: rgba(255,255,255,0.015);
                    border: 1px solid var(--border-card);
                    border-radius: var(--radius);
                    overflow: hidden;
                    position: relative;
                    transition: all 0.5s var(--ease);
                    cursor: pointer;
                }

                .article-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(245,158,11,0), transparent);
                    z-index: 10;
                    transition: background 0.5s ease;
                }

                .article-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 
                        0 30px 60px -15px rgba(0,0,0,0.5),
                        0 0 0 1px rgba(245,158,11,0.08);
                    border-color: rgba(245,158,11,0.1);
                    background: rgba(255,255,255,0.025);
                }

                .article-card:hover::before {
                    background: linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent);
                }

                .article-card:hover .article-media-wrap {
                    transform: scale(1.07);
                }

                .article-card:hover .article-body h3 {
                    color: #fff;
                }

                .article-card:hover .read-more {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.1);
                    color: #fff;
                }

                .article-card:hover .read-more svg {
                    transform: translateX(4px);
                    color: var(--accent);
                }

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
                    height: 50%;
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

                .article-body {
                    padding: 1.5rem 1.5rem 1.4rem;
                }

                .article-body .article-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    margin-bottom: 0.85rem;
                    color: var(--text-muted);
                    flex-wrap: wrap;
                }

                .article-body .article-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.72rem;
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
                    padding: 0.55rem 1.1rem;
                    border-radius: 10px;
                    border: 1px solid transparent;
                    background: transparent;
                    transition: all 0.4s var(--ease);
                }

                .read-more svg {
                    transition: all 0.3s var(--ease);
                    flex-shrink: 0;
                }

                /* ============================================
                   RESPONSIVE — MÓVIL
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
                        font-size: 2.4rem;
                    }

                    .news-page-header p {
                        font-size: 0.95rem;
                        line-height: 1.7;
                    }

                    .news-header-glow {
                        width: 400px;
                        height: 250px;
                        top: -40px;
                    }

                    /* Spotlight: stack vertical */
                    .spotlight-section {
                        grid-template-columns: 1fr;
                        margin-bottom: 3.5rem;
                    }

                    .main-news-card {
                        height: 420px;
                    }

                    .main-news-overlay {
                        padding: 5rem 1.5rem 1.5rem;
                    }

                    .main-news-overlay h2 {
                        font-size: 1.4rem;
                    }

                    .main-news-excerpt {
                        -webkit-line-clamp: 2;
                        font-size: 0.85rem;
                        margin-bottom: 1rem;
                    }

                    /* Side news: horizontal scroll */
                    .side-news-stack {
                        height: auto;
                        flex-direction: row;
                        gap: 1rem;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        padding-bottom: 4px;
                        scroll-snap-type: x mandatory;
                    }

                    .side-news-card {
                        height: 240px;
                        flex: 0 0 75%;
                        max-width: 340px;
                        scroll-snap-align: start;
                    }

                    .side-news-content h3 {
                        font-size: 1rem;
                    }

                    /* Grid header */
                    .news-grid-header {
                        margin-bottom: 1.75rem;
                    }

                    .section-title {
                        font-size: 1.35rem;
                    }

                    /* Article cards */
                    .news-grid-new {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .article-body {
                        padding: 1.25rem;
                    }

                    .article-body h3 {
                        font-size: 1.05rem;
                    }

                    .article-excerpt {
                        -webkit-line-clamp: 2;
                        margin-bottom: 1.2rem;
                    }

                    /* Hide author on mobile to save space */
                    .nw-m-hide {
                        display: none !important;
                    }

                    /* Smaller radius */
                    .main-news-card,
                    .side-news-card,
                    .article-card {
                        border-radius: 14px;
                    }

                    /* Reduce hover transforms on touch devices */
                    .main-news-card:hover {
                        transform: translateY(-4px);
                    }

                    .article-card:hover {
                        transform: translateY(-5px);
                    }
                }

                @media (max-width: 480px) {
                    .news-page-container {
                        padding: 0 1rem 3rem;
                    }

                    .news-page-header {
                        padding: 2.5rem 0 2rem;
                    }

                    .news-page-header h1 {
                        font-size: 1.9rem;
                    }

                    .news-page-header p {
                        font-size: 0.88rem;
                        line-height: 1.6;
                    }

                    .news-header-tag {
                        font-size: 0.6rem;
                        padding: 0.35rem 0.9rem;
                        margin-bottom: 1.2rem;
                    }

                    .news-header-glow {
                        width: 300px;
                        height: 200px;
                    }

                    /* Main card compact */
                    .main-news-card {
                        height: 320px;
                        border-radius: 12px;
                    }

                    .main-news-overlay {
                        padding: 3.5rem 1.2rem 1.2rem;
                    }

                    .main-news-overlay h2 {
                        font-size: 1.15rem;
                        line-height: 1.3;
                    }

                    .main-news-excerpt {
                        display: none;
                    }

                    .main-news-overlay .article-meta {
                        gap: 1rem;
                    }

                    .main-news-overlay .article-meta span {
                        font-size: 0.7rem;
                    }

                    .category-badge {
                        padding: 0.3rem 0.7rem;
                        font-size: 0.55rem;
                    }

                    .category-sm {
                        padding: 0.25rem 0.55rem;
                        font-size: 0.5rem;
                    }

                    /* Side cards compact */
                    .side-news-card {
                        height: 200px;
                        flex: 0 0 80%;
                        border-radius: 12px;
                    }

                    .side-news-content {
                        padding: 3rem 1.1rem 1.1rem;
                    }

                    .side-news-content h3 {
                        font-size: 0.92rem;
                        margin-top: 0.5rem;
                        -webkit-line-clamp: 2;
                    }

                    /* Grid header compact */
                    .news-grid-bar {
                        height: 24px;
                        width: 3px;
                    }

                    .section-title {
                        font-size: 1.15rem;
                    }

                    .news-grid-pill {
                        font-size: 0.65rem;
                        padding: 0.3rem 0.75rem;
                    }

                    /* Article cards compact */
                    .article-card {
                        border-radius: 12px;
                    }

                    .article-body {
                        padding: 1rem;
                    }

                    .article-body h3 {
                        font-size: 0.95rem;
                        -webkit-line-clamp: 2;
                    }

                    .article-excerpt {
                        display: none;
                    }

                    .article-body .article-meta span {
                        font-size: 0.65rem;
                    }

                    .read-more {
                        font-size: 0.72rem;
                        padding: 0.45rem 0.9rem;
                    }
                }

                @media (max-width: 768px) and (orientation: landscape) {
                    .main-news-card {
                        height: 320px;
                    }

                    .side-news-card {
                        height: 200px;
                    }

                    .news-page-header {
                        padding: 2rem 0 1.5rem;
                    }
                }
            `}</style>
        </>
    );
}