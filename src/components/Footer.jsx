import React from 'react';

const Footer = () => (
    <footer className="footer" id="driver-footer">
        <div className="container footer-inner">
            <div className="footer-grid">
                <div className="footer-brand"><h3>NÚMEROS Y FÚTBOL</h3><p>Portal oficial hecha por Ariel SOTOMAYOR y Felipe ESCOBAR.</p></div>
                <div className="footer-section"><h4>Divisiones</h4><ul><li><a href="#">Primera División</a></li><li><a href="#">Segunda División</a></li><li><a href="#">Tercera División</a></li></ul></div>
                <div className="footer-section"><h4>Contenido</h4><ul><li><a href="#noticias">Noticias</a></li><li><a href="#">Resultados</a></li><li><a href="#">Clasificaciones</a></li></ul></div>
                <div className="footer-section"><h4>Síguenos</h4><ul><li><a href="#">Facebook</a></li><li><a href="#">Twitter / X</a></li><li><a href="#">Instagram</a></li></ul></div>
            </div>
            <div className="footer-bottom"><p>&copy; 2026 Números y Fútbol. Todos los derechos reservados.</p><div className="footer-links"><a href="#">Privacidad</a><a href="#">Términos</a><a href="#">Contacto</a></div></div>
        </div>
    </footer>
);

export default Footer;