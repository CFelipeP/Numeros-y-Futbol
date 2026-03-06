import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost/backend/login.php",
                { email, password }
            );

            localStorage.setItem("user", JSON.stringify(res.data));

            Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: "Inicio de sesión exitoso"
            });

            if (res.data.rol === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }

        } catch {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Credenciales incorrectas"
            });

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                {/* Flecha volver */}
                <button
                    className="back-home"
                    onClick={() => navigate("/")}
                >
                    ← Volver
                </button>

                <h2 className="login-title">
                    Iniciar Sesión
                </h2>

                <form onSubmit={login}>

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="btn login-btn">
                        Entrar
                    </button>

                </form>

                <p className="login-register">

                    ¿No tienes cuenta?

                    <Link to="/register">
                        Crear cuenta
                    </Link>

                </p>

            </div>

        </div>

    );

}