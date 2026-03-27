import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Iconos SVG ---
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
);
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
);

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="container header-inner">
                <a href="/" className="header-brand" id="driver-header">
                    {/* FIX: Añadido style para evitar animaciones no deseadas en el logo */}
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
                    <a href="#tercera">Tercera División</a>
                    <a href="/news">Noticias</a>
                    <a href="/login">Iniciar Sesión</a>
                    <a href="/register">Registrarse</a>
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
    );
};

export default Header;