import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Mail, KeyRound, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const enviarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await axios.post(
            "http://localhost/Numeros-y-Futbol/backend/forgot_password.php",
            { action: "send_code", email }
        );

        console.log("RESPUESTA:", res.data); // 👈 Agrega esto

        if (!res.data.success) {
            Swal.fire({ icon: "error", title: "Error", text: res.data.error });
            return;
        }

        setStep(2);
        Swal.fire({ icon: "success", title: "¡Código Enviado!", text: "Revisa tu bandeja de entrada (y spam)." });
    } catch (error) {
        console.error("ERROR:", error);
    } finally {
        setLoading(false);
    }
};

    const verificarCodigo = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
                "http://localhost/Numeros-y-Futbol/backend/forgot_password.php",
                { action: "verify_code", email, codigo }
            );
            setStep(3);
            Swal.fire({
                icon: "success",
                title: "¡Código Válido!",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            const msg = error.response?.data?.error || "Código inválido o expirado.";
            Swal.fire({ icon: "error", title: "Error", text: msg, confirmButtonText: "Entendido" });
        } finally {
            setLoading(false);
        }
    };

    const cambiarPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({ icon: "error", title: "Error", text: "Las contraseñas no coinciden.", confirmButtonText: "Entendido" });
            return;
        }
        if (newPassword.length < 6) {
            Swal.fire({ icon: "error", title: "Error", text: "Mínimo 6 caracteres.", confirmButtonText: "Entendido" });
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "http://localhost/Numeros-y-Futbol/backend/forgot_password.php",
                { action: "reset_password", email, codigo, new_password: newPassword }
            );
            Swal.fire({
                icon: "success",
                title: "¡Contraseña Actualizada!",
                text: "Ya puedes iniciar sesión.",
                confirmButtonText: "Ir a Login"
            }).then(() => navigate("/login"));
        } catch (error) {
            const msg = error.response?.data?.error || "No se pudo actualizar.";
            Swal.fire({ icon: "error", title: "Error", text: msg, confirmButtonText: "Entendido" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <button onClick={() => navigate("/login")} className="back-home">
                <ArrowLeft size={20} />
                Volver al Login
            </button>

            <div className="login-card">
                <div className="login-logo">
                    <img 
                        src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" 
                        alt="Logo" className="login-logo-img"
                    />
                    <span>Números y Fútbol</span>
                </div>

                {/* Indicador de pasos */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                    {[1, 2, 3].map((s, i) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: step >= s ? '#de4a4a' : '#333',
                                color: step >= s ? '#000' : '#888',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '14px'
                            }}>{s}</div>
                            {i < 2 && <div style={{
                                width: '40px', height: '2px',
                                background: step > s ? '#de4a4a' : '#333'
                            }} />}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <>
                        <h1 className="login-title">¿Olvidaste tu contraseña?</h1>
                        <p className="login-subtitle">Ingresa tu correo y te enviaremos un código</p>
                        <form onSubmit={enviarCodigo}>
                            <div className="input-group">
                                <Mail className="input-icon" />
                                <input type="email" placeholder="Tu correo electrónico"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? "Enviando..." : "Enviar Código"}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h1 className="login-title">Verifica tu identidad</h1>
                        <p className="login-subtitle">Código enviado a <strong>{email}</strong></p>
                        <form onSubmit={verificarCodigo}>
                            <div className="input-group">
                                <KeyRound className="input-icon" />
                                <input type="text" placeholder="Código de 6 dígitos"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required maxLength={6} pattern="\d{6}"
                                    style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.3rem' }} />
                            </div>
                            <button type="submit" className="login-btn" disabled={loading || codigo.length !== 6}>
                                {loading ? "Verificando..." : "Verificar Código"}
                            </button>
                            <button type="button" className="login-btn" onClick={enviarCodigo}
                                disabled={loading}
                                style={{ background: 'transparent', border: '1px solid #444', marginTop: '10px', fontSize: '0.85rem' }}>
                                ¿No recibiste el código? Reenviar
                            </button>
                        </form>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h1 className="login-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                            <CheckCircle size={28} color="#de4a4a" />
                            ¡Código Verificado!
                        </h1>
                        <p className="login-subtitle">Crea tu nueva contraseña</p>
                        <form onSubmit={cambiarPassword}>
                            <div className="input-group">
                                <KeyRound className="input-icon" />
                                <input type="password" placeholder="Nueva contraseña (mín. 6 caracteres)"
                                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    required minLength={6} />
                            </div>
                            <div className="input-group">
                                <KeyRound className="input-icon" />
                                <input type="password" placeholder="Confirmar nueva contraseña"
                                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    required minLength={6} />
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? "Actualizando..." : "Actualizar Contraseña"}
                            </button>
                        </form>
                    </>
                )}

                <p className="register-link">
                    ¿Recuerdas tu contraseña?{" "}
                    <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                        Inicia sesión
                    </a>
                </p>
            </div>
        </div>
    );
}