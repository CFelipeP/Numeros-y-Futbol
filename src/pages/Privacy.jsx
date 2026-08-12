import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE } from "../config";

const Privacy = () => {
    const navigate = useNavigate();
    const [siteName, setSiteName] = useState("Números y Fútbol");
    const sections = [
        {
            title: "1. Información que Recopilamos",
            body: "Al registrarte, recopilamos tu nombre completo, apodo, dirección de correo electrónico y una contraseña que se almacena de forma segura. También recopilamos datos básicos de navegación de forma anónima para entender cómo se usa el sitio, como las páginas que visitas."
        },
        {
            title: "2. Uso de la Información",
            body: "Utilizamos tus datos para: (a) crear y gestionar tu cuenta de usuario, (b) reconocerte al iniciar sesión, y (c) entender mejor cómo los visitantes usan el sitio para poder mejorarlo."
        },
        {
            title: "3. Cookies y Almacenamiento Local",
            body: "El sitio utiliza almacenamiento local del navegador para mantener tu sesión activa y recordar preferencias básicas. No utilizamos cookies de terceros ni redes publicitarias."
        },
        {
            title: "4. Protección de Datos",
            body: "Tomamos medidas de seguridad razonables para proteger tu información personal. Tu contraseña se almacena de forma protegida. Sin embargo, ningún sistema es completamente seguro."
        },
        {
            title: "5. Compartición de Datos",
            body: "No vendemos, alquilamos ni compartimos tus datos personales con terceros. Toda la información que recopilamos se utiliza exclusivamente para el funcionamiento del sitio."
        },
        {
            title: "6. Retención de Datos",
            body: "Conservamos tus datos personales mientras tu cuenta permanezca activa. Si decides dejar de usar el sitio, puedes solicitar la eliminación de tu cuenta contactándonos."
        },
        {
            title: "7. Derechos del Usuario",
            body: "Tienes derecho a: (a) saber qué datos tenemos sobre ti, (b) pedir que corrijamos datos incorrectos, (c) solicitar la eliminación de tu cuenta, y (d) retirar tu consentimiento. Para ejercer estos derechos, contáctanos por los canales disponibles."
        },
        {
            title: "8. Menores de Edad",
            body: "Nuestro sitio está dirigido al público general. Si un menor ha proporcionado datos personales sin el consentimiento adecuado, contáctanos para que podamos eliminarlos."
        },
        {
            title: "9. Cambios a esta Política",
            body: "Podemos actualizar esta Política de Privacidad. La fecha de la última actualización estará siempre visible. Te recomendamos revisar esta página ocasionalmente."
        }
    ];

    useEffect(() => {
        fetch(`${API_BASE}get_site_settings.php`)
            .then(r => r.json())
            .then(d => { if (d.success && d.settings && d.settings.site_name) setSiteName(d.settings.site_name); })
            .catch(() => {});
    }, []);

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
                        <h2>Política de Privacidad</h2>
                        <p>Última actualización: Julio 2026</p>
                    </div>
                    <div style={{ maxWidth: 800, margin: "0 auto" }}>
                        <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                            En {siteName} respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política describe cómo manejamos tu información.
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
                                <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Privacy;
