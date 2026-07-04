import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import { apiFetch, apiPost } from "../apiHelper";
import { API_BASE } from "../config";

const API = API_BASE;

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("perfil"); // perfil | seguridad
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre: "", apodo: "", email: "" });
  const [pwd, setPwd] = useState({ current: "", nuevo: "", confirmar: "" });
  const [showPwd, setShowPwd] = useState({ current: false, nuevo: false });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    try {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({ nombre: u.nombre || "", apodo: u.apodo || "", email: u.email || "" });
      apiFetch(`${API}get_user_profile.php?id=${u.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            setForm({ nombre: data.user.nombre || "", apodo: data.user.apodo || "", email: data.user.email || "" });
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            localStorage.removeItem("user"); localStorage.removeItem("token");
            navigate("/login");
          }
        })
        .catch(() => { });
      setLoading(false);
    } catch (_) {
      localStorage.removeItem("user"); localStorage.removeItem("token");
      navigate("/login");
    }
  }, []);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiPost(`${API}update_user_profile.php`, { id: user.id, action: "update_info", ...form });
      const data = await res.json();
      if (data.success) {
        const updated = { ...user, ...form };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        Swal.fire({ icon: "success", title: "Perfil actualizado", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
      } else {
        Swal.fire("Error", data.error || "No se pudo actualizar", "error");
      }
    } catch (_) { Swal.fire("Error", "Error de conexión", "error"); }
    setSaving(false);
  };

  const handleChangePwd = async (e) => {
    e.preventDefault();
    if (pwd.nuevo !== pwd.confirmar) { Swal.fire("Error", "Las contraseñas no coinciden", "error"); return; }
    if (pwd.nuevo.length < 6) { Swal.fire("Error", "Mínimo 6 caracteres", "error"); return; }
    setSaving(true);
    try {
      const res = await apiPost(`${API}update_user_profile.php`, { id: user.id, action: "change_password", current_password: pwd.current, new_password: pwd.nuevo });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon: "success", title: "Contraseña cambiada ✅", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
        setPwd({ current: "", nuevo: "", confirmar: "" });
      } else { Swal.fire("Error", data.error || "No se pudo cambiar", "error"); }
    } catch (_) { Swal.fire("Error", "Error de conexión", "error"); }
    setSaving(false);
  };

  const handleLogout = () => {
    Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", confirmButtonColor: "#d33", cancelButtonText: "Cancelar" })
      .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); Swal.fire({ icon: "success", title: "Deslogueo exitoso", timer: 2000, showConfirmButton: false }).then(() => navigate("/")); } });
  };

  const initials = (u) => {
    if (!u) return "?";
    const n = u.nombre || u.apodo || u.email || "U";
    return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const inp = {
    width: "100%", padding: "14px", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
    color: "#f1f5f9", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };
  const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#64748b", fontSize: 16 }}>⏳ Cargando...</div>
    </div>
  );

  return (
    <>
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
        .up-body { min-height:calc(100vh - 64px); background:linear-gradient(135deg,#0f172a 0%,#0d1117 60%,#0f172a 100%); padding:40px 20px 80px; }
        .up-wrap { max-width:860px; margin:0 auto; }
        .up-card { background:rgba(30,41,59,0.6); border:1px solid rgba(255,255,255,0.07); border-radius:20px; overflow:hidden; backdrop-filter:blur(12px); }
        .up-hero { background:linear-gradient(135deg,rgba(239,68,68,0.15) 0%,rgba(15,23,42,0.9) 100%); padding:32px 28px; display:flex; align-items:center; gap:24px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .up-avatar { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#ef4444,#dc2626); display:flex; align-items:center; justify-content:center; font-family:'Montserrat',sans-serif; font-size:26px; font-weight:900; color:#fff; flex-shrink:0; box-shadow:0 0 32px rgba(239,68,68,0.4); }
        .up-tabs { display:flex; gap:4px; padding:16px 20px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .up-tab { padding:10px 20px; border:none; background:none; font-family:inherit; font-weight:700; font-size:13px; cursor:pointer; border-radius:10px 10px 0 0; color:#64748b; transition:all .2s; }
        .up-tab.active { color:#ef4444; background:rgba(239,68,68,0.1); border-bottom:2px solid #ef4444; }
        .up-tab:hover:not(.active) { color:#94a3b8; background:rgba(255,255,255,0.04); }
        .up-body-inner { padding:28px; }
        .up-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .up-field-full { grid-column:1/-1; }
        .up-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; }
        .up-stat { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px 20px; text-align:center; }
        input:focus { border-color:rgba(239,68,68,0.4)!important; box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
        @media(max-width:600px){ .up-grid{grid-template-columns:1fr!important;} .up-hero{flex-direction:column;text-align:center;gap:16px;} .up-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;} }
        @media(max-width:480px){ .up-body{padding:20px 12px 60px!important;} .up-hero{padding:24px 16px!important;} .up-avatar{width:56px;height:56px;font-size:20px;} .up-hero h1{font-size:1.2rem!important;} .up-body-inner{padding:20px!important;} .up-tab{padding:8px 14px;font-size:12px;} }
      `}</style>

      <div className="up-body">
        <div className="up-wrap">

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#475569" }}>
            <Link to="/" style={{ color: "#475569", textDecoration: "none" }}>Inicio</Link>
            <span>/</span>
            <span style={{ color: "#94a3b8" }}>Mi Cuenta</span>
          </div>

          <div className="up-card">
            {/* Hero */}
            <div className="up-hero">
              <div className="up-avatar">{initials(user)}</div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: "Montserrat,sans-serif", fontSize: "1.5rem", fontWeight: 900, color: "#f1f5f9", margin: "0 0 4px" }}>
                  {user.nombre || user.apodo || "Usuario"}
                </h1>
                {user.apodo && <p style={{ margin: "0 0 8px", color: "#64748b", fontSize: 14 }}>@{user.apodo}</p>}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="up-badge" style={{
                    background: user.rol === "admin" ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
                    color: user.rol === "admin" ? "#ef4444" : "#3b82f6",
                    border: `1px solid ${user.rol === "admin" ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`,
                  }}>
                    {user.rol === "admin" ? "⚡ Admin" : "👤 Usuario"}
                  </span>
                  <span className="up-badge" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>
                    ✓ Activo
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.08)", color: "#ef4444", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", flexShrink: 0, whiteSpace: "nowrap" }}>
                Cerrar sesión
              </button>
            </div>

            {/* Acceso rápido admin */}
            {user.rol === "admin" && (
              <div style={{ background: "rgba(239,68,68,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Tienes acceso al panel de administración</span>
                <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 9, background: "linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.08))", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                  ⚡ Ir al Dashboard
                </Link>
              </div>
            )}

            {/* Tabs */}
            <div className="up-tabs">
              {[{ key: "perfil", label: "Información Personal" }, { key: "seguridad", label: "Seguridad" }].map(t => (
                <button key={t.key} className={`up-tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>{t.label}</button>
              ))}
            </div>

            <div className="up-body-inner">
              {/* ── Tab: Perfil ── */}
              {tab === "perfil" && (
                <form onSubmit={handleUpdateInfo}>
                  <div className="up-grid">
                    <div>
                      <label style={lbl}>Nombre completo</label>
                      <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Tu nombre" style={inp} />
                    </div>
                    <div>
                      <label style={lbl}>Apodo / Usuario</label>
                      <input value={form.apodo} onChange={e => setForm(p => ({ ...p, apodo: e.target.value }))} placeholder="@tu_apodo" style={inp} />
                    </div>
                    <div className="up-field-full">
                      <label style={lbl}>Correo electrónico</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="correo@ejemplo.com" style={inp} />
                    </div>
                  </div>



                  <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}>
                      {saving ? "Guardando..." : "💾 Guardar cambios"}
                    </button>
                  </div>
                </form>
              )}

              {/* ── Tab: Seguridad ── */}
              {tab === "seguridad" && (
                <form onSubmit={handleChangePwd}>
                  <div style={{ maxWidth: 440 }}>
                    <div style={{ marginBottom: 18 }}>
                      <label style={lbl}>Contraseña actual</label>
                      <div style={{ position: "relative" }}>
                        <input type={showPwd.current ? "text" : "password"} value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} style={{ ...inp, paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowPwd(p => ({ ...p, current: !p.current }))} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>
                          {showPwd.current ? "🙈" : "👁"}
                        </button>
                      </div>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={lbl}>Nueva contraseña</label>
                      <div style={{ position: "relative" }}>
                        <input type={showPwd.nuevo ? "text" : "password"} value={pwd.nuevo} onChange={e => setPwd(p => ({ ...p, nuevo: e.target.value }))} style={{ ...inp, paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowPwd(p => ({ ...p, nuevo: !p.nuevo }))} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>
                          {showPwd.nuevo ? "🙈" : "👁"}
                        </button>
                      </div>
                      {/* Barra fuerza */}
                      {pwd.nuevo.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 6, alignItems: "center" }}>
                          {[2, 4, 7, 10].map((th, i) => (
                            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: pwd.nuevo.length >= th ? ["#ef4444", "#f97316", "#f59e0b", "#22c55e"][i] : "rgba(255,255,255,0.08)" }} />
                          ))}
                          <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6, whiteSpace: "nowrap" }}>
                            {pwd.nuevo.length < 4 ? "Débil" : pwd.nuevo.length < 7 ? "Regular" : pwd.nuevo.length < 10 ? "Buena" : "Fuerte"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <label style={lbl}>Confirmar contraseña</label>
                      <input type="password" value={pwd.confirmar} onChange={e => setPwd(p => ({ ...p, confirmar: e.target.value }))} style={inp} />
                      {pwd.nuevo && pwd.confirmar && pwd.nuevo !== pwd.confirmar && (
                        <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>❌ Las contraseñas no coinciden</p>
                      )}
                      {pwd.nuevo && pwd.confirmar && pwd.nuevo === pwd.confirmar && (
                        <p style={{ color: "#22c55e", fontSize: 12, marginTop: 4 }}>✓ Las contraseñas coinciden</p>
                      )}
                    </div>
                    <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(239,68,68,0.3)" }}>
                      {saving ? "Actualizando..." : "🔒 Cambiar contraseña"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
