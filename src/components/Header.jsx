import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom"
    ;

// --- Iconos SVG ---
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
);
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
);

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <>
            {/* ESTILOS EN LINEA DENTRO DEL COMPONENTE PARA QUE ESTÉ "TODO JUNTO" */}
            <style>
                {`
                .header-nav {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .header-nav a {
                    text-decoration: none;
                    color: white;
                    font-weight: 500;
                }

                /* DROPDOWN */
                .account-dropdown {
                    position: relative;
                }

                .account-btn {
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    transition: 0.3s;
                }

                .account-btn:hover {
                    color: #00bfff;
                }

                .dropdown-menu {
                    position: absolute;
                    top: 40px;
                    right: 0;
                    display: flex; 
                    flex-direction: column;
                    min-width: 180px;
                    background: rgba(15, 15, 15, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.35);
                    z-index: 999;
                }

                .dropdown-menu a {
                    padding: 14px 18px;
                    color: white;
                    text-decoration: none;
                    transition: 0.25s;
                }

                .dropdown-menu a:hover {
                    background: rgba(255,255,255,0.08);
                    color: #00bfff;
                }
                `}
            </style>

            <header className="header">
                <div className="container header-inner">
                    <a href="/" className="header-brand" id="driver-header">
                        <img
                            src="https://z-cdn-media.chatglm.cn/files/e7a0d70d-d782-469b-b96e-f5784f834623.png?auth_key=1870909668-3553d69b915747fd9924cb2f33dc7b2f-0-b54f8e47892d52b83bab715f69eacd2b"
                            alt="Números y Fútbol"
                            className="header-logo"
                            style={{ animation: 'none', transition: 'none' }}
                        />
                        <div>
                            <div className="header-title">Números y Fútbol</div>
                            <div className="header-subtitle">Portal Oficial</div>
                        </div>
                    </a>

                    <nav className="header-nav">
                        <a href="/primera">Primera División</a>
                        <a href="/segunda">Segunda División</a>
                        <a href="/tercera">Tercera División</a>
                        <a href="/news">Noticias</a>
                        <a href="/copa-presidente">Copa Presidente</a>

                        {/* DROPDOWN CORREGIDO */}
                        <div className="account-dropdown">
                            {/* Cambiado a <a> para que se vea igual que el resto del menú, sin estilos de botón */}
                            <a
                                href="#"
                                className="header-nav-link"
                                onClick={(e) => {
                                    e.preventDefault(); // Evita que la página salte hacia arriba
                                    setIsDropdownOpen(!isDropdownOpen); // Abre o cierra al hacer click
                                }}
                            >
                                Cuenta
                            </a>

                            <motion.div
                                className="dropdown-menu"
                                initial={false}
                                animate={isDropdownOpen ? {
                                    opacity: 1,
                                    y: 0,
                                    pointerEvents: "auto"
                                } : {
                                    opacity: 0,
                                    y: -10,
                                    pointerEvents: "none"
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Se añade onClick para que el menú se cierre al seleccionar una opción */}
                                <Link to="/login" onClick={() => setIsDropdownOpen(false)}>Iniciar Sesión</Link>
                                <Link to="/register" onClick={() => setIsDropdownOpen(false)}>Registrarse</Link>
                            </motion.div>
                        </div>
                        {/* FIN DROPDOWN */}
                    </nav>

                    <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu">
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>

                {/* Menú Móvil */}
                <div className="container">
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.nav
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="mobile-nav"
                                style={{ overflow: "hidden" }}
                            >
                                <a href="/primera" onClick={() => setIsMenuOpen(false)}>Primera División</a>
                                <a href="/segunda" onClick={() => setIsMenuOpen(false)}>Segunda División</a>
                                <a href="#tercera" onClick={() => setIsMenuOpen(false)}>Tercera División</a>
                                <a href="/news" onClick={() => setIsMenuOpen(false)}>Noticias</a>
                                <a href="/login" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</a>
                                <a href="/register" onClick={() => setIsMenuOpen(false)}>Registrarse</a>
                            </motion.nav>
                        )}
                    </AnimatePresence>
                </div>
            </header>
        </>
    );
};

export default Header;