import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AtSign } from "lucide-react";
import { motion } from "framer-motion";
import { API_BASE } from "../config";

export default function Login() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        const datos = { password };

        if (isEmail(usuario)) {
            datos.email = usuario;
        } else {
            datos.apodo = usuario;
        }

        try {
            const res = await axios.post(
                `${API_BASE}login.php`,
                datos
            );

            const userData = res.data;
            localStorage.setItem("user", JSON.stringify(userData));
            if (userData.token) localStorage.setItem("token", userData.token);

            Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
                text: `Hola, ${res.data.apodo || res.data.nombre}`,
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate(res.data.rol === "admin" ? "/dashboard" : "/perfil");
            });

        } catch (error) {
            setLoading(false);
            const mensaje = error.response?.data?.error || "Credenciales incorrectas.";
            Swal.fire({
                icon: "error",
                title: "Error",
                text: mensaje,
                confirmButtonText: "Entendido"
            });
        }
    };

    // --- CONFIGURACIÓN DE ANIMACIONES ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="login-page">
            
            <motion.button
                onClick={() => navigate("/")}
                className="back-home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <ArrowLeft size={20} />
                Volver al inicio
            </motion.button>

            <motion.div 
                className="login-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="login-logo" variants={itemVariants}>
                    <img 
                        src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" 
                        alt="Logo Números y Fútbol" 
                        className="login-logo-img"
                    />
                    <span>Números y Fútbol</span>
                </motion.div>

                <motion.h1 className="login-title" variants={itemVariants}>¡Bienvenido de vuelta!</motion.h1>
                <motion.p className="login-subtitle" variants={itemVariants}>Inicia sesión con tu correo o apodo</motion.p>

                <form onSubmit={login}>
                    <motion.div className="input-group" variants={itemVariants}>
                        {isEmail(usuario) ? <Mail className="input-icon" /> : <AtSign className="input-icon" />}
                        <input
                            type="text"
                            placeholder="Correo electrónico o apodo"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value.trim())}
                            required
                        />
                    </motion.div>

                    <motion.div className="input-group" variants={itemVariants}>
                        <Lock className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </motion.div>

                    <motion.div 
                        style={{ textAlign: 'right', marginBottom: '16px' }} 
                        variants={itemVariants}
                    >
                        <a
                            href="/forgot-password"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/forgot-password");
                            }}
                            style={{ color: '#4ade80', fontSize: '0.85rem', textDecoration: 'none' }}
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? "Verificando..." : "Iniciar Sesión"}
                    </motion.button>
                </form>

                <motion.p className="register-link" variants={itemVariants}>
                    ¿No tienes cuenta?{" "}
                    <a
                        href="/register"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/register");
                        }}
                    >
                        Regístrate aquí
                    </a>
                </motion.p>
            </motion.div>
        </div>
    );
}