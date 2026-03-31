import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, User, ArrowLeft, Tag, FileText, Clock } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://numeros-y-futbol.test/backend/get_news.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                setNewsItem(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="nd-loading">
                    <div className="nd-loading-grid">
                        <div className="nd-sk nd-sk-media" />
                        <div className="nd-sk-info">
                            <div className="nd-sk nd-sk-badge" />
                            <div className="nd-sk nd-sk-h1" />
                            <div className="nd-sk nd-sk-date" />
                            <div className="nd-sk nd-sk-card" />
                            <div className="nd-sk nd-sk-body1" />
                            <div className="nd-sk nd-sk-body2" />
                            <div className="nd-sk nd-sk-body3" />
                        </div>
                    </div>
                </div>
                <Footer />
                <style>{css}</style>
            </>
        );
    }

    if (!newsItem) {
        return (
            <>
                <Header />
                <div className="nd-error">
                    <div className="nd-error-icon">
                        <FileText size={40} strokeWidth={1.2} />
                    </div>
                    <h2>Noticia no encontrada</h2>
                    <p>Puede que haya sido eliminada o el enlace sea incorrecto.</p>
                    <button onClick={() => navigate("/news")} className="nd-back">
                        <ArrowLeft size={17} /> Volver a noticias
                    </button>
                </div>
                <Footer />
                <style>{css}</style>
            </>
        );
    }

    const isVideo = newsItem.imagen?.includes(".mp4");

    const isYoutube =
        newsItem.imagen?.includes("youtube.com") ||
        newsItem.imagen?.includes("youtu.be");

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

    const fechaFormateada = new Date(newsItem.fecha).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <>
            <Header />

            <div className="nd-wrapper">
                <div className="nd-grain" />

                <div className="nd-container">

                    <button className="nd-back" onClick={() => navigate("/news")}>
                        <ArrowLeft size={17} /> Volver a noticias
                    </button>

                    <div className="nd-grid">

                        {/* MEDIA */}


                        <div className="nd-media-col">
                            <div className="nd-media">
                                {isYoutube ? (
                                    <iframe
                                        src={getYoutubeEmbed(newsItem.imagen)}
                                        style={{ width: "100%", height: "100%" }}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                        title="YouTube video"
                                    />
                                ) : isVideo ? (
                                    <video muted controls autoPlay loop playsInline>
                                        <source src={newsItem.imagen} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img
                                        src={newsItem.imagen || "https://via.placeholder.com/800x500"}
                                        alt={newsItem.titulo}
                                    />
                                )}
                                <div className="nd-media-border" />
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="nd-info-col">

                            <div className="nd-top-row">
                                <span className="nd-badge">
                                    <Tag size={11} />
                                    {newsItem.category || newsItem.categoria || "General"}
                                </span>
                                <span className="nd-date-chip">
                                    <Clock size={12} />
                                    {new Date(newsItem.fecha).toLocaleDateString("es-ES", {
                                        day: "numeric", month: "short", year: "numeric"
                                    })}
                                </span>
                            </div>

                            <h1 className="nd-title">
                                {newsItem.title || newsItem.titulo}
                            </h1>

                            <div className="nd-author-row">
                                <div className="nd-avatar">
                                    <User size={16} />
                                </div>
                                <div>
                                    <div className="nd-author-name">
                                        {newsItem.author || newsItem.autor || "Anónimo"}
                                    </div>
                                    <div className="nd-author-date">{fechaFormateada}</div>
                                </div>
                            </div>

                            <div className="nd-divider" />

                            <div className="nd-meta-grid">
                                <div className="nd-meta-card">
                                    <div className="nd-meta-icon">
                                        <User size={15} />
                                    </div>
                                    <div className="nd-meta-text">
                                        <span className="nd-meta-label">Autor</span>
                                        <span className="nd-meta-value">{newsItem.author || newsItem.autor || "Anónimo"}</span>
                                    </div>
                                </div>
                                <div className="nd-meta-card">
                                    <div className="nd-meta-icon">
                                        <Tag size={15} />
                                    </div>
                                    <div className="nd-meta-text">
                                        <span className="nd-meta-label">Categoría</span>
                                        <span className="nd-meta-value">{newsItem.category || newsItem.categoria || "General"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="nd-content-card">
                                <div className="nd-content-head">
                                    <div className="nd-content-dot" />
                                    Contenido de la noticia
                                </div>
                                <p className="nd-content-text">
                                    {newsItem.content || newsItem.contenido || "Sin contenido disponible."}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <style>{css}</style>
        </>
    );
}

const css = `
    /* ============================================
       PALETA Y BASE
       ============================================ */
    @keyframes nd-shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
    }

    @keyframes nd-in {
        from { opacity: 0; transform: translateY(30px); filter: blur(6px); }
        to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
    }

    .nd-wrapper {
        position: relative;
        min-height: 75vh;
        background: 
            radial-gradient(ellipse 80% 50% at 20% 0%, rgba(239,68,68,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(239,68,68,0.03) 0%, transparent 50%);
    }

    /* Textura de grano sutil */
    .nd-grain {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.025;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 180px;
    }

    .nd-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2.5rem 2rem 7rem;
        animation: nd-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    /* ============================================
       LOADING
       ============================================ */
    .nd-loading {
        max-width: 1200px;
        margin: 0 auto;
        padding: 6rem 2rem;
    }

    .nd-loading-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 3rem;
    }

    .nd-sk {
        background: linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%);
        background-size: 200% 100%;
        animation: nd-shimmer 1.6s ease-in-out infinite;
        border-radius: 14px;
    }

    .nd-sk-media { height: 480px; }
    .nd-sk-info  { display: flex; flex-direction: column; gap: 1rem; }
    .nd-sk-badge { width: 130px; height: 34px; border-radius: 50px; }
    .nd-sk-h1    { height: 52px; }
    .nd-sk-date  { width: 55%; height: 18px; border-radius: 8px; }
    .nd-sk-card  { height: 90px; }
    .nd-sk-body1, .nd-sk-body2, .nd-sk-body3 { height: 16px; border-radius: 6px; }
    .nd-sk-body1 { width: 100%; }
    .nd-sk-body2 { width: 92%; }
    .nd-sk-body3 { width: 70%; }

    /* ============================================
       ERROR
       ============================================ */
    .nd-error {
        max-width: 460px;
        margin: 0 auto;
        padding: 8rem 2rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
    }

    .nd-error-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(239,68,68,0.06);
        border: 1px solid rgba(239,68,68,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;
        color: rgba(239,68,68,0.4);
    }

    .nd-error h2 {
        color: #f1f5f9;
        font-size: 1.35rem;
        font-weight: 700;
        margin: 0;
    }

    .nd-error p {
        color: #64748b;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0;
    }

    /* ============================================
       BOTÓN VOLVER
       ============================================ */
    .nd-back {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.55rem 1.15rem;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 50px;
        color: #94a3b8;
        font-size: 0.82rem;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 2.5rem;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(8px);
    }

    .nd-back:hover {
        background: rgba(239,68,68,0.08);
        border-color: rgba(239,68,68,0.2);
        color: #f87171;
        transform: translateX(-4px);
    }

    /* ============================================
       GRID
       ============================================ */
    .nd-grid {
        display: grid;
        grid-template-columns: 1.25fr 1fr;
        gap: 3.5rem;
        align-items: start;
    }

    /* ============================================
       MEDIA
       ============================================ */
    .nd-media-col {
        position: sticky;
        top: 100px;
    }

    .nd-media {
        position: relative;
        aspect-ratio: 16/10;
        border-radius: 22px;
        overflow: hidden;
        background: #080808;
        box-shadow:
            0 0 0 1px rgba(255,255,255,0.05),
            0 30px 60px -15px rgba(0,0,0,0.6),
            0 0 80px -20px rgba(239,68,68,0.08);
    }
            

    .nd-media img,
    .nd-media video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }

    /* Borde interior sutil para dar profundidad */
    .nd-media-border {
        position: absolute;
        inset: 0;
        border-radius: 22px;
        pointer-events: none;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
    }

    /* ============================================
       INFO COL
       ============================================ */
    .nd-info-col {
        display: flex;
        flex-direction: column;
        gap: 1.35rem;
    }

    /* Top row: badge + date */
    .nd-top-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .nd-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 0.9rem;
        background: rgba(239,68,68,0.1);
        color: #f87171;
        border: 1px solid rgba(239,68,68,0.18);
        border-radius: 50px;
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        backdrop-filter: blur(12px);
    }

    .nd-date-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 0.85rem;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 50px;
        font-size: 0.72rem;
        font-weight: 500;
        color: #64748b;
    }

    /* Título */
    .nd-title {
        font-size: 2.4rem;
        font-weight: 800;
        color: #f1f5f9;
        line-height: 1.15;
        letter-spacing: -0.035em;
        margin: 0;
    }

    /* Autor row */
    .nd-author-row {
        display: flex;
        align-items: center;
        gap: 0.85rem;
    }

    .nd-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05));
        border: 1px solid rgba(239,68,68,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f87171;
        flex-shrink: 0;
    }

    .nd-author-name {
        font-size: 0.92rem;
        font-weight: 600;
        color: #e2e8f0;
    }

    .nd-author-date {
        font-size: 0.75rem;
        color: #64748b;
        margin-top: 0.15rem;
    }

    /* Divisor */
    .nd-divider {
        height: 1px;
        background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02), transparent);
        margin: 0.25rem 0;
    }

    /* ============================================
       META GRID (Autor / Categoría)
       ============================================ */
    .nd-meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.85rem;
    }

    .nd-meta-card {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 1rem 1.15rem;
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 14px;
        transition: all 0.3s ease;
    }

    .nd-meta-card:hover {
        background: rgba(255,255,255,0.035);
        border-color: rgba(255,255,255,0.08);
    }

    .nd-meta-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: rgba(239,68,68,0.08);
        border: 1px solid rgba(239,68,68,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f87171;
        flex-shrink: 0;
    }

    .nd-meta-text {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        min-width: 0;
    }

    .nd-meta-label {
        font-size: 0.68rem;
        font-weight: 600;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    .nd-meta-value {
        font-size: 0.88rem;
        font-weight: 600;
        color: #e2e8f0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* ============================================
       CONTENIDO
       ============================================ */
    .nd-content-card {
        margin-top: 0.35rem;
        padding: 1.75rem;
        background: 
            linear-gradient(165deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%);
        border: 1px solid rgba(255,255,255,0.04);
        border-radius: 18px;
        position: relative;
        overflow: hidden;
    }

    /* Línea roja decorativa arriba */
    .nd-content-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 1.75rem;
        right: 1.75rem;
        height: 1px;
        background: linear-gradient(90deg, rgba(239,68,68,0.3), rgba(239,68,68,0.05), transparent);
    }

    .nd-content-head {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.72rem;
        font-weight: 700;
        color: #f87171;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 1.25rem;
    }

    .nd-content-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ef4444;
        box-shadow: 0 0 10px rgba(239,68,68,0.5);
        flex-shrink: 0;
    }

    .nd-content-text {
        font-size: 1rem;
        color: #94a3b8;
        line-height: 1.85;
        margin: 0;
        text-align: justify;
        white-space: pre-wrap;
    }

    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (max-width: 1024px) {
        .nd-grid { gap: 2.5rem; }
        .nd-title { font-size: 2rem; }
    }

    @media (max-width: 768px) {
        .nd-container { padding: 1.5rem 1.25rem 4rem; }

        .nd-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .nd-media-col {
            position: relative;
            top: 0;
        }

        .nd-media { aspect-ratio: 16/9; }
        .nd-title { font-size: 1.7rem; }

        .nd-meta-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.65rem;
        }
    }

    @media (max-width: 480px) {
        .nd-title { font-size: 1.4rem; }

        .nd-meta-grid {
            grid-template-columns: 1fr;
        }

        .nd-content-card { padding: 1.35rem; }

        .nd-content-text {
            font-size: 0.92rem;
            text-align: left;
        }

        .nd-top-row {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;