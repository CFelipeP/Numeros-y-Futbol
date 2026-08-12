import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

const Footer = () => {
    const [settings, setSettings] = useState({});
    const siteName = settings.site_name || 'Números y Fútbol';

    useEffect(() => {
        fetch(`${API_BASE}get_site_settings.php`)
            .then(r => r.json())
            .then(d => { if (d.success && d.settings) setSettings(d.settings); })
            .catch(() => {});
    }, []);

    const socialLinks = [];
    if (settings.facebook_url) socialLinks.push({ url: settings.facebook_url, label: 'Facebook' });
    if (settings.twitter_url) socialLinks.push({ url: settings.twitter_url, label: 'Twitter / X' });
    if (settings.instagram_url) socialLinks.push({ url: settings.instagram_url, label: 'Instagram' });

    return (
        <footer className="footer" id="driver-footer">
            <div className="container footer-inner">
                <div className="footer-grid">
                    <div className="footer-brand"><h3>{siteName.toUpperCase()}</h3><p>Portal oficial hecho por Ariel SOTOMAYOR y Felipe ESCOBAR.</p></div>
                    <div className="footer-section"><h4>Divisiones</h4><ul><li><a href="/primera">Primera División</a></li><li><a href="/ascenso">Liga de Ascenso</a></li></ul></div>
                    <div className="footer-section"><h4>Contenido</h4><ul><li><a href="/news">Noticias</a></li><li><a href="/primera#tabla">Resultados</a></li><li><a href="/primera#tabla">Clasificaciones</a></li></ul></div>
                    <div className="footer-section"><h4>Síguenos</h4><ul>
                        {socialLinks.length > 0
                            ? socialLinks.map((s, i) => <li key={i}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)
                            : <li style={{color:'#64748b'}}>Configura tus redes en el panel admin</li>
                        }
                    </ul></div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {siteName}. Todos los derechos reservados.</p>
                    <div className="footer-links">
                        <a href="/privacy">Privacidad</a>
                        <a href="/terms">Términos</a>
                        {settings.contact_email
                            ? <a href={`mailto:${settings.contact_email}`}>Contacto</a>
                            : <span>Contacto</span>
                        }
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;