import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
    const [seleccionOpen, setSeleccionOpen] = useState(false);
    const [divisionesOpen, setDivisionesOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const accountRef = useRef(null);
    const seleccionRef = useRef(null);
    const divisionesRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setCurrentUser(null);
        Swal.fire({
            icon: "success",
            title: "Deslogueo exitoso",
            timer: 2000,
            showConfirmButton: false,
        }).then(() => {
            navigate("/");
        });
    };

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) setCurrentUser(JSON.parse(stored));
            else setCurrentUser(null);
        } catch { setCurrentUser(null); }
    }, [location]);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (accountRef.current && !accountRef.current.contains(e.target)) {
                setAccountOpen(false);
            }
            if (seleccionRef.current && !seleccionRef.current.contains(e.target)) {
                setSeleccionOpen(false);
            }
            if (divisionesRef.current && !divisionesRef.current.contains(e.target)) {
                setDivisionesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cerrar menú móvil al cambiar de ruta
    useEffect(() => {
        setMobileOpen(false);
        setMobileAccountOpen(false);
        setAccountOpen(false);
        setSeleccionOpen(false);
        setDivisionesOpen(false);
    }, [location]);

    // Cerrar menú móvil al redimensionar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMobileOpen(false);
                setMobileAccountOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Bloquear scroll del body cuando el menú móvil está abierto
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const navLinks = [
        { href: "/femenina", label: "Femenina" },
        { href: "/news", label: "Noticias" },
        { href: "/copa-presidente", label: "Copa Presidente"},
    ];

    const divisionesLinks = [
        { href: "/primera", label: "Primera División" },
        { href: "/segunda", label: "Segunda División" },
        { href: "/tercera", label: "Tercera División" },
    ];

    const isDivisionesActive = () => divisionesLinks.some(link => isActive(link.href));

    const seleccionLinks = [
        { href: "/seleccion", label: "Masculina" },
        { href: "/seleccion-femenina", label: "Femenina" },
        { href: "/seleccion-sub20", label: "Sub-20" },
        { href: "/seleccion-sub17", label: "Sub-17" },
    ];

    const isSeleccionActive = () => seleccionLinks.some(link => isActive(link.href));

    const isActive = (href) => {
        if (href === "/") return location.pathname === "/";
        return location.pathname.startsWith(href);
    };

    return (
        <>
            <style>{`
                /* ============================================
                   HEADER — BASE COMPARTIDO
                   ============================================ */
                .hdr {
                    position: sticky;
                    top: 0;
                    z-index: 9000;
                    background: rgba(8, 10, 18, 0.88);
                    backdrop-filter: blur(20px) saturate(1.4);
                    -webkit-backdrop-filter: blur(20px) saturate(1.4);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    transition: background 0.3s;
                }
                .hdr::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(239,68,68,0.15), transparent);
                    pointer-events: none;
                }
                .hdr-inner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 64px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px;
                }

                /* ============================================
                   BRAND / LOGO
                   ============================================ */
                .hdr-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    flex-shrink: 0;
                    position: relative;
                    z-index: 10;
                }
                .hdr-brand-img {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    object-fit: contain;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    padding: 3px;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .hdr-brand:hover .hdr-brand-img {
                    transform: scale(1.05);
                    box-shadow: 0 0 16px rgba(239,68,68,0.2);
                }
                .hdr-brand-text {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .hdr-brand-title {
                    font-size: 15px;
                    font-weight: 800;
                    color: #f8fafc;
                    line-height: 1.2;
                    letter-spacing: 0.2px;
                    white-space: nowrap;
                }
                .hdr-brand-sub {
                    font-size: 8px;
                    font-weight: 700;
                    color: #ef4444;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    line-height: 1.4;
                }

                /* ============================================
                   NAV ESCRITORIO
                   ============================================ */
                .hdr-nav {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }
                .hdr-nav-link {
                    text-decoration: none;
                    color: #94a3b8;
                    font-size: 13px;
                    font-weight: 500;
                    padding: 8px 14px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    position: relative;
                    border: none;
                    background: none;
                    font-family: inherit;
                }
                .hdr-nav-link:hover {
                    color: #f8fafc;
                    background: rgba(255,255,255,0.06);
                }
                .hdr-nav-link.active {
                    color: #f8fafc;
                    background: rgba(239,68,68,0.1);
                }
                .hdr-nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 16px;
                    height: 2px;
                    background: #ef4444;
                    border-radius: 1px;
                }
                .hdr-nav-link.highlight {
                    color: #ef4444;
                    font-weight: 700;
                }
                .hdr-nav-link.highlight:hover {
                    color: #f87171;
                    background: rgba(239,68,68,0.08);
                }

                /* ============================================
                   DROPDOWN CUENTA (ESCRITORIO)
                   ============================================ */
                .hdr-dropdown {
                    position: relative;
                }
                .hdr-dropdown-trigger {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }
                .hdr-dropdown-trigger svg {
                    transition: transform 0.25s;
                }
                .hdr-dropdown-trigger.open svg {
                    transform: rotate(180deg);
                }
                .hdr-dropdown-panel {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    min-width: 200px;
                    background: rgba(12, 14, 24, 0.97);
                    backdrop-filter: blur(20px);
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow:
                        0 20px 60px rgba(0,0,0,0.5),
                        0 0 0 1px rgba(255,255,255,0.07),
                        0 0 40px rgba(0,0,0,0.3);
                    z-index: 9999;
                    padding: 6px;
                }
                .hdr-dropdown-panel a {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 16px;
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 500;
                    border-radius: 10px;
                    transition: all 0.15s;
                }
                .hdr-dropdown-panel a:hover {
                    background: rgba(239,68,68,0.08);
                    color: #f8fafc;
                }
                .hdr-dropdown-panel a svg {
                    flex-shrink: 0;
                    opacity: 0.5;
                }
                .hdr-dropdown-panel a:hover svg {
                    opacity: 1;
                }
                .hdr-dropdown-panel-seleccion,
                .hdr-dropdown-panel-left {
                    left: 0;
                }
                .hdr-dropdown-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.06);
                    margin: 4px 8px;
                }
                .hdr-dropdown-header {
                    padding: 10px 16px 6px;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    color: #475569;
                    text-transform: uppercase;
                }

                /* ============================================
                   BOTÓN HAMBURGUESA (solo móvil)
                   ============================================ */
                .hdr-burger {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    background: rgba(255,255,255,0.03);
                    color: #f8fafc;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    position: relative;
                    z-index: 10;
                }
                .hdr-burger:hover {
                    background: rgba(255,255,255,0.08);
                    border-color: rgba(255,255,255,0.15);
                }
                .hdr-burger:active {
                    transform: scale(0.92);
                }
                .hdr-burger.open {
                    background: rgba(239,68,68,0.1);
                    border-color: rgba(239,68,68,0.25);
                    color: #ef4444;
                }

                /* ============================================
                   MENÚ MÓVIL OVERLAY
                   ============================================ */
                .hdr-mobile-overlay {
                    position: fixed;
                    inset: 0;
                    top: 64px;
                    background: rgba(2, 6, 23, 0.6);
                    backdrop-filter: blur(4px);
                    z-index: 8000;
                }
                .hdr-mobile-panel {
                    position: fixed;
                    top: 64px;
                    right: 0;
                    bottom: 0;
                    width: min(320px, 85vw);
                    background: rgba(8, 10, 18, 0.97);
                    backdrop-filter: blur(24px);
                    border-left: 1px solid rgba(255,255,255,0.06);
                    z-index: 8001;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    padding: 16px 0 32px;
                    display: flex;
                    flex-direction: column;
                }
                .hdr-mobile-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding: 0 12px;
                }
                .hdr-mobile-link {
                    text-decoration: none;
                    color: #94a3b8;
                    font-size: 15px;
                    font-weight: 500;
                    padding: 13px 16px;
                    border-radius: 12px;
                    transition: all 0.15s;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    font-family: inherit;
                }
                .hdr-mobile-link:active {
                    transform: scale(0.98);
                }
                .hdr-mobile-link:hover,
                .hdr-mobile-link:active {
                    color: #f8fafc;
                    background: rgba(255,255,255,0.05);
                }
                .hdr-mobile-link.active {
                    color: #f8fafc;
                    background: rgba(239,68,68,0.1);
                }
                .hdr-mobile-link.highlight {
                    color: #ef4444;
                    font-weight: 700;
                }
                .hdr-mobile-link.highlight:hover {
                    background: rgba(239,68,68,0.08);
                }
                .hdr-mobile-link-icon {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.5;
                    flex-shrink: 0;
                }
                .hdr-mobile-link.active .hdr-mobile-link-icon {
                    opacity: 1;
                }

                .hdr-mobile-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.06);
                    margin: 10px 24px;
                }
                .hdr-mobile-section-label {
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: 2.5px;
                    color: #475569;
                    text-transform: uppercase;
                    padding: 8px 28px 6px;
                }

                /* Sub-menú cuenta móvil */
                .hdr-mobile-account-btn {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 13px 16px;
                    border: none;
                    border-radius: 12px;
                    background: transparent;
                    color: #94a3b8;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s;
                    text-align: left;
                    font-family: inherit;
                }
                .hdr-mobile-account-btn:hover,
                .hdr-mobile-account-btn:active {
                    color: #f8fafc;
                    background: rgba(255,255,255,0.05);
                }
                .hdr-mobile-account-btn svg {
                    transition: transform 0.25s;
                    flex-shrink: 0;
                }
                .hdr-mobile-account-btn.open svg {
                    transform: rotate(180deg);
                }
                .hdr-mobile-account-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .hdr-mobile-sub {
                    padding: 0 12px 4px;
                    overflow: hidden;
                }
                .hdr-mobile-sub-inner {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    padding-left: 32px;
                }
                .hdr-mobile-sub-inner a {
                    text-decoration: none;
                    color: #64748b;
                    font-size: 14px;
                    font-weight: 500;
                    padding: 11px 16px;
                    border-radius: 10px;
                    transition: all 0.15s;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .hdr-mobile-sub-inner a:hover,
                .hdr-mobile-sub-inner a:active {
                    color: #f8fafc;
                    background: rgba(255,255,255,0.05);
                }

                /* ============================================
                   RESPONSIVE
                   ============================================ */
                @media (max-width: 768px) {
                    .hdr-inner {
                        height: 56px;
                        padding: 0 max(16px, env(safe-area-inset-left));
                    }
                    .hdr-nav {
                        display: none !important;
                    }
                    .hdr-burger {
                        display: flex !important;
                    }
                    .hdr-brand-img {
                        width: 34px;
                        height: 34px;
                        border-radius: 8px;
                    }
                    .hdr-brand-title {
                        font-size: 14px;
                    }
                    .hdr-brand-sub {
                        font-size: 7px;
                        letter-spacing: 2px;
                    }
                }

                @media (max-width: 380px) {
                    .hdr-brand-title {
                        font-size: 13px;
                    }
                    .hdr-brand-sub {
                        display: none;
                    }
                    .hdr-brand-img {
                        width: 32px;
                        height: 32px;
                    }
                }

                /* Desktop: ocultar elementos mobile-only */
                @media (min-width: 769px) {
                    .hdr-mobile-overlay,
                    .hdr-mobile-panel {
                        display: none !important;
                    }
                }
            `}</style>

            <header className="hdr">
                <div className="hdr-inner">
                    {/* === BRAND === */}
                    <a href="/" className="hdr-brand" id="driver-header">
                        <img
                            src="https://z-cdn-media.chatglm.cn/files/e7a0d70d-d782-469b-b96e-f5784f834623.png?auth_key=1870909668-3553d69b915747fd9924cb2f33dc7b2f-0-b54f8e47892d52b83bab715f69eacd2b"
                            alt="Números y Fútbol"
                            className="hdr-brand-img"
                            style={{ animation: 'none', transition: 'none' }}
                        />
                        <div className="hdr-brand-text">
                            <span className="hdr-brand-title">Números y Fútbol</span>
                            <span className="hdr-brand-sub">Portal Oficial</span>
                        </div>
                    </a>

                    {/* === NAV ESCRITORIO === */}
                    <nav className="hdr-nav">
                        {/* Dropdown Divisiones */}
                        <div className="hdr-dropdown" ref={divisionesRef}>
                            <button
                                className={`hdr-nav-link hdr-dropdown-trigger${divisionesOpen ? ' open' : ''}${isDivisionesActive() ? ' active' : ''}`}
                                onClick={() => setDivisionesOpen(!divisionesOpen)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                                Divisiones Masculinas
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                            </button>
                            <AnimatePresence>
                                {divisionesOpen && (
                                    <motion.div
                                        className="hdr-dropdown-panel hdr-dropdown-panel-left"
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                    >
                                        <div className="hdr-dropdown-header">Divisiones Masculinas</div>
                                        {divisionesLinks.map(dl => (
                                            <a
                                                key={dl.href}
                                                href={dl.href}
                                                className={isActive(dl.href) ? 'active' : ''}
                                                onClick={() => setDivisionesOpen(false)}
                                            >
                                                {dl.label}
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`hdr-nav-link${isActive(link.href) ? ' active' : ''}${link.highlight ? ' highlight' : ''}`}
                            >
                                {link.highlight && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H3V6a1 1 0 011-1h2"/><path d="M18 9h3V6a1 1 0 00-1-1h-2"/><path d="M6 5h12v7a6 6 0 01-12 0V5z"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
                                )}
                                {link.label}
                            </a>
                        ))}

                        {/* Dropdown Selección Nacional */}
                        <div className="hdr-dropdown" ref={seleccionRef}>
                            <button
                                className={`hdr-nav-link hdr-dropdown-trigger${seleccionOpen ? ' open' : ''}${isSeleccionActive() ? ' active' : ''}`}
                                onClick={() => setSeleccionOpen(!seleccionOpen)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H3V6a1 1 0 011-1h2"/><path d="M18 9h3V6a1 1 0 00-1-1h-2"/><path d="M6 5h12v7a6 6 0 01-12 0V5z"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
                                Selección
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                            </button>
                            <AnimatePresence>
                                {seleccionOpen && (
                                    <motion.div
                                        className="hdr-dropdown-panel hdr-dropdown-panel-seleccion"
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                    >
                                        <div className="hdr-dropdown-header">Selección Nacional</div>
                                        {seleccionLinks.map(sl => (
                                            <a
                                                key={sl.href}
                                                href={sl.href}
                                                className={isActive(sl.href) ? 'active' : ''}
                                                onClick={() => setSeleccionOpen(false)}
                                            >
                                                {sl.label}
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Dropdown Cuenta */}
                        <div className="hdr-dropdown" ref={accountRef}>
                            <button
                                className={`hdr-nav-link hdr-dropdown-trigger${accountOpen ? ' open' : ''}`}
                                onClick={() => setAccountOpen(!accountOpen)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Cuenta
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                            </button>

                            <AnimatePresence>
                                {accountOpen && (
                                    <motion.div
                                        className="hdr-dropdown-panel"
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: "easeOut" }}
                                    >
                                        <div className="hdr-dropdown-header">{currentUser ? currentUser.nombre || currentUser.apodo || "Mi Cuenta" : "Tu cuenta"}</div>
                                        {currentUser ? (
                                            <>
                                                <Link to="/perfil" onClick={() => setAccountOpen(false)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                    Mi Perfil
                                                </Link>
                                                <a href="/" onClick={(e) => { e.preventDefault(); setAccountOpen(false); handleLogout(); }} className="account-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 500, transition: 'background 0.2s' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                                    Cerrar Sesión
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/login" onClick={() => setAccountOpen(false)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                                    Iniciar Sesión
                                                </Link>
                                                <Link to="/register" onClick={() => setAccountOpen(false)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                                                    Registrarse
                                                </Link>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* === BOTÓN HAMBURGUESA === */}
                    <button
                        className={`hdr-burger${mobileOpen ? ' open' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        <AnimatePresence mode="wait">
                            {mobileOpen ? (
                                <motion.svg
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="16" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </header>

            {/* === MENÚ MÓVIL COMPLETO === */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Overlay oscuro */}
                        <motion.div
                            className="hdr-mobile-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Panel lateral */}
                        <motion.div
                            className="hdr-mobile-panel"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        >
                            {/* Navegación principal */}
                            <div className="hdr-mobile-section-label">Navegación</div>
                            <nav className="hdr-mobile-nav">
                                {/* Divisiones accordion en móvil */}
                                <div style={{ width: '100%' }}>
                                    <button
                                        className={`hdr-mobile-account-btn${divisionesOpen ? ' open' : ''}`}
                                        onClick={() => setDivisionesOpen(!divisionesOpen)}
                                        style={{ width: '100%' }}
                                    >
                                        <span className="hdr-mobile-account-left">
                                            <span className="hdr-mobile-link-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                                            </span>
                                            Divisiones Masculinas
                                        </span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                    </button>
                                    <AnimatePresence>
                                        {divisionesOpen && (
                                            <motion.div
                                                className="hdr-mobile-sub"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                            >
                                                <div className="hdr-mobile-sub-inner">
                                                    {divisionesLinks.map(dl => (
                                                        <a
                                                            key={dl.href}
                                                            href={dl.href}
                                                            onClick={() => { setMobileOpen(false); setDivisionesOpen(false); }}
                                                        >
                                                            {dl.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        className={`hdr-mobile-link${isActive(link.href) ? ' active' : ''}${link.highlight ? ' highlight' : ''}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <span className="hdr-mobile-link-icon">
                                            {link.highlight ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H3V6a1 1 0 011-1h2"/><path d="M18 9h3V6a1 1 0 00-1-1h-2"/><path d="M6 5h12v7a6 6 0 01-12 0V5z"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/></svg>
                                            )}
                                        </span>
                                        {link.label}
                                    </motion.a>
                                ))}

                                {/* Selección Nacional accordion en móvil */}
                                <div style={{ width: '100%' }}>
                                    <button
                                        className={`hdr-mobile-account-btn${seleccionOpen ? ' open' : ''}`}
                                        onClick={() => setSeleccionOpen(!seleccionOpen)}
                                        style={{ width: '100%' }}
                                    >
                                        <span className="hdr-mobile-account-left">
                                            <span className="hdr-mobile-link-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H3V6a1 1 0 011-1h2"/><path d="M18 9h3V6a1 1 0 00-1-1h-2"/><path d="M6 5h12v7a6 6 0 01-12 0V5z"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>
                                            </span>
                                            Selección Nacional
                                        </span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                    </button>
                                    <AnimatePresence>
                                        {seleccionOpen && (
                                            <motion.div
                                                className="hdr-mobile-sub"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                            >
                                                <div className="hdr-mobile-sub-inner">
                                                    {seleccionLinks.map(sl => (
                                                        <a
                                                            key={sl.href}
                                                            href={sl.href}
                                                            onClick={() => { setMobileOpen(false); setSeleccionOpen(false); }}
                                                        >
                                                            {sl.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </nav>

                            <div className="hdr-mobile-divider" />

                            {/* Cuenta */}
                            <div className="hdr-mobile-section-label">Cuenta</div>
                            <div style={{ padding: "0 12px" }}>
                                <button
                                    className={`hdr-mobile-account-btn${mobileAccountOpen ? ' open' : ''}`}
                                    onClick={() => setMobileAccountOpen(!mobileAccountOpen)}
                                >
                                    <span className="hdr-mobile-account-left">
                                        <span className="hdr-mobile-link-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </span>
                                        Mi Cuenta
                                    </span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                </button>
                            </div>

                            <AnimatePresence>
                                {mobileAccountOpen && (
                                    <motion.div
                                        className="hdr-mobile-sub"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                    >
                                        <div className="hdr-mobile-sub-inner">
                                            {currentUser ? (
                                                <>
                                                    <Link to="/perfil" onClick={() => setMobileOpen(false)}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                        Mi Perfil
                                                    </Link>
                                                    <a href="/" onClick={(e) => { e.preventDefault(); setMobileOpen(false); handleLogout(); }} className="account-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 500, transition: 'background 0.2s' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                                        Cerrar Sesión
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                                                        Iniciar Sesión
                                                    </Link>
                                                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                                                        Registrarse
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;