import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";                    // ← Importante
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);   // ← Agregado para mejor UX

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        const promise = axios.post(
            "http://localhost/numeros-y-futbol/backend/login.php",
            { email, password }
        );

        toast.promise(promise, {
            loading: "Iniciando sesión...",
            success: "¡Inicio de sesión exitoso! Bienvenido de vuelta.",
            error: "Credenciales incorrectas. Inténtalo de nuevo.",
        });

        try {
            const res = await promise;

            localStorage.setItem("user", JSON.stringify(res.data));

            if (res.data.rol === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            // El error ya lo maneja toast.promise
        } finally {
            setLoading(false);
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
                    ⚽ <span>Números y Fútbol</span>
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
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
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