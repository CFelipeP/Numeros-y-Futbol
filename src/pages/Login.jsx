import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost/numeros-y-futbol/backend/login.php",
                { email, password }
            );

            localStorage.setItem("user", JSON.stringify(res.data));

            // Popup de éxito
            Swal.fire({
                icon: "success",
                title: "¡Bienvenido!",
                text: "Inicio de sesión exitoso.",
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
            // Popup de error
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Credenciales incorrectas. Inténtalo de nuevo.",
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
                    {/* LOGO ACTUALIZADO */}
                    <img 
                        src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" 
                        alt="Logo Números y Fútbol" 
                        className="login-logo-img"
                    />
                    <span>Números y Fútbol</span>
                </div>

                <h1 className="login-title">¡Bienvenido de vuelta!</h1>
                <p className="login-subtitle">Inicia sesión para continuar</p>

                <form onSubmit={login}>
                    <div className="input-group">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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