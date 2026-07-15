import React from 'react';

const Footer = () => (
    <footer className="footer" id="driver-footer">
        <div className="container footer-inner">
            <div className="footer-grid">
                <div className="footer-brand"><h3>NÚMEROS Y FÚTBOL</h3><p>Portal oficial hecho por Ariel SOTOMAYOR y Felipe ESCOBAR.</p></div>
                <div className="footer-section"><h4>Divisiones</h4><ul><li><a href="/primera">Primera División</a></li><li><a href="/ascenso">Liga de Ascenso</a></li></ul></div>
                <div className="footer-section"><h4>Contenido</h4><ul><li><a href="/news">Noticias</a></li><li><a href="/primera#tabla">Resultados</a></li><li><a href="/primera#tabla">Clasificaciones</a></li></ul></div>
                <div className="footer-section"><h4>Síguenos</h4><ul><li>Facebook</li><li>Twitter / X</li><li>Instagram</li></ul></div>
            </div>
            <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} Números y Fútbol. Todos los derechos reservados.</p><div className="footer-links"><span>Privacidad</span><span>Términos</span><span>Contacto</span></div></div>
        </div>
    </footer>
);

export default Footer;