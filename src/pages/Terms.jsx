import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE } from "../config";

const Terms = () => {
    const navigate = useNavigate();
    const [siteName, setSiteName] = useState("Números y Fútbol");
    const sections = [
        {
            title: "1. Aceptación de los Términos",
            body: "Al registrarte y utilizar el sitio web Números y Fútbol, aceptas cumplir con estos Términos y Condiciones. Si no estás de acuerdo, no debes crear una cuenta ni utilizar nuestros servicios."
        },
        {
            title: "2. Registro de Usuario",
            body: "Para crear una cuenta debes proporcionar nombre completo, apodo, correo electrónico y contraseña. Eres responsable de mantener la confidencialidad de tus credenciales."
        },
        {
            title: "3. Uso del Sitio",
            body: "Números y Fútbol es un portal informativo de fútbol salvadoreño. Puedes consultar estadísticas, resultados, posiciones y noticias de las distintas divisiones y selecciones nacionales."
        },
        {
            title: "4. Conducta del Usuario",
            body: "Te comprometes a hacer un uso respetuoso del sitio. No está permitido: publicar contenido ofensivo en ninguna sección, acosar a otros usuarios, o realizar actividades que puedan dañar el funcionamiento del sitio."
        },
        {
            title: "5. Propiedad Intelectual",
            body: "Todo el contenido del sitio —incluyendo diseño, logo, gráficos y estadísticas— es propiedad de Números y Fútbol. Queda prohibida la reproducción total o parcial sin autorización previa."
        },
        {
            title: "6. Limitación de Responsabilidad",
            body: "Números y Fútbol proporciona información estadística y noticiosa con fines informativos. No garantizamos la exactitud absoluta de los datos ni nos hacemos responsables por daños derivados del uso del sitio."
        },
        {
            title: "7. Enlaces Externos",
            body: "El sitio puede contener enlaces a páginas de terceros. No somos responsables del contenido ni de las políticas de dichos sitios externos."
        },
        {
            title: "8. Modificaciones a los Términos",
            body: "Podemos actualizar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor al ser publicados. Te recomendamos revisar esta página periódicamente."
        },
        {
            title: "9. Ley Aplicable",
            body: "Estos términos se rigen por las leyes de la República de El Salvador."
        }
    ];

    useEffect(() => {
        fetch(`${API_BASE}get_site_settings.php`)
            .then(r => r.json())
            .then(d => { if (d.success && d.settings && d.settings.site_name) setSiteName(d.settings.site_name); })
            .catch(() => {});
    }, []);

    const formatBody = (text) => text.replace(/Números y Fútbol/g, siteName);

    return (
        <>
            <Header />
            <main style={{ minHeight: "70vh", paddingTop: "5rem", paddingBottom: "3rem", position: "relative" }}>
                <motion.button
                    onClick={() => navigate("/register")}
                    className="back-home"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <ArrowLeft size={20} />
                    Volver al registro
                </motion.button>
                <div className="container">
                    <div className="section-header">
                        <h2>Términos y Condiciones</h2>
                        <p>Última actualización: Julio 2026</p>
                    </div>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                            Bienvenido a {siteName}. Al acceder y utilizar nuestro sitio web, aceptas estar sujeto a los siguientes términos y condiciones. Por favor, léelos detenidamente.
                        </p>
                        {sections.map((s, i) => (
                            <div key={i} style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 12,
                                padding: "1.5rem 1.75rem",
                                marginBottom: "1rem",
                                backdropFilter: "blur(8px)"
                            }}>
                                <h3 style={{ color: "#f8fafc", fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>{s.title}</h3>
                                <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>{formatBody(s.body)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Terms;
