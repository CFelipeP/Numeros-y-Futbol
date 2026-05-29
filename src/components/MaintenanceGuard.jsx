import { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function MaintenanceGuard({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formUser, setFormUser] = useState("");
  const [formPass, setFormPass] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}get_site_settings.php`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.settings) setSettings(d.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const maintenanceActive = settings?.maintenance_mode === "1";

  if (!maintenanceActive) return children;
  if (user?.rol === "admin") return children;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#ef4444", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    const datos = { password: formPass };
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formUser);
    if (isEmail) datos.email = formUser;
    else datos.apodo = formUser;

    try {
      const res = await fetch(`${API_BASE}login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Credenciales incorrectas.");
        setFormLoading(false);
        return;
      }

      if (data.rol !== "admin") {
        setFormError("Solo administradores pueden acceder durante mantenimiento.");
        setFormLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      if (data.token) localStorage.setItem("token", data.token);
      window.location.reload();
    } catch {
      setFormError("Error de conexión con el servidor.");
      setFormLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", fontFamily: "Montserrat,sans-serif" }}>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}`}</style>

      <div style={{ fontSize: 72, marginBottom: 24, animation: "float 3s ease-in-out infinite" }}>⚽</div>
      <div style={{ width: 60, height: 4, background: "linear-gradient(90deg,#ff1f1f,#f97316)", borderRadius: 2, margin: "0 auto 24px" }} />
      <h1 style={{ fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 900, color: "#f1f5f9", margin: "0 0 8px" }}>
        {settings?.site_name || "Números y Fútbol"}
      </h1>
      <h2 style={{ fontSize: "clamp(1rem,2.5vw,1.4rem)", fontWeight: 700, color: "#f59e0b", margin: "0 0 16px" }}>🔧 Página en Mantenimiento</h2>
      <p style={{ fontSize: "1rem", color: "#94a3b8", maxWidth: 480, lineHeight: 1.7, margin: "0 auto 32px" }}>
        {settings?.maintenance_msg || "Estamos trabajando para mejorar tu experiencia. Vuelve pronto."}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 30, padding: "10px 20px", color: "#64748b", fontSize: 13 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
        Volvemos muy pronto — gracias por tu paciencia
      </div>

      {settings?.contact_email && (
        <p style={{ marginTop: 20, fontSize: 12, color: "#475569" }}>Contacto: <a href={`mailto:${settings.contact_email}`} style={{ color: "#3b82f6" }}>{settings.contact_email}</a></p>
      )}

      <div style={{ marginTop: 40, width: "100%", maxWidth: 380 }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Acceso exclusivo para administradores
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="text"
            placeholder="Correo electrónico o apodo"
            value={formUser}
            onChange={e => setFormUser(e.target.value.trim())}
            required
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(2,6,23,0.7)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            onFocus={e => { e.target.style.borderColor = "#ff004d"; e.target.style.boxShadow = "0 0 0 3px rgba(255,0,77,0.2)" }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.boxShadow = "none" }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={formPass}
            onChange={e => setFormPass(e.target.value)}
            required
            style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(2,6,23,0.7)", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            onFocus={e => { e.target.style.borderColor = "#ff004d"; e.target.style.boxShadow = "0 0 0 3px rgba(255,0,77,0.2)" }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.boxShadow = "none" }}
          />

          {formError && (
            <p style={{ margin: 0, fontSize: 13, color: "#ef4444", textAlign: "center" }}>{formError}</p>
          )}

          <button
            type="submit"
            disabled={formLoading}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#ff004d,#dc2626)", color: "white", fontSize: 15, fontWeight: 700, cursor: formLoading ? "not-allowed" : "pointer", opacity: formLoading ? 0.7 : 1, transition: "opacity 0.2s" }}
          >
            {formLoading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
