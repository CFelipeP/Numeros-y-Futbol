import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AtSign } from "lucide-react";

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
                "http://localhost/Numeros-y-Futbol/backend/login.php",
                datos
            );

            localStorage.setItem("user", JSON.stringify(res.data));

            Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
                text: `Hola, ${res.data.apodo || res.data.nombre}`,
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                if (res.data.rol === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/");
                }
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

    return (
        <div className="login-page">
            <button
                onClick={() => navigate("/")}
                className="back-home"
            >
                <ArrowLeft size={20} />
                Volver al inicio
            </button>

            <div className="login-card">
                <div className="login-logo">
                    <img 
                        src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" 
                        alt="Logo Números y Fútbol" 
                        className="login-logo-img"
                    />
                    <span>Números y Fútbol</span>
                </div>

                <h1 className="login-title">¡Bienvenido de vuelta!</h1>
                <p className="login-subtitle">Inicia sesión con tu correo o apodo</p>

                <form onSubmit={login}>
                    <div className="input-group">
                        {isEmail(usuario) ? <Mail className="input-icon" /> : <AtSign className="input-icon" />}
                        <input
                            type="text"
                            placeholder="Correo electrónico o apodo"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value.trim())}
                            required
                        />
                    </div>

                    <div className="input-group">
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
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '16px' }}>
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
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? "Verificando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <p className="register-link">
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
                </p>
            </div>
        </div>
    );
}