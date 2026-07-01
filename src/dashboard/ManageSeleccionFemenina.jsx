import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import "animate.css";
import { apiPost, apiFetch } from "../apiHelper";
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  Target, Trophy, ChevronDown, Plus, Pencil, Trash2, Save, X,
  Search, MessageCircle, Upload, Eye
} from "lucide-react";
import { API_BASE } from "../config";

const API = API_BASE;

const SIDEBAR_ITEMS = [
  { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
  { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
  {
    type: "dropdown", icon: <Shield size={20} />, label: "Equipos",
    children: [
      { path: "/teams/primera", label: "Primera División" },
      { path: "/teams/segunda", label: "Segunda División" },
      { path: "/teams/tercera", label: "Tercera División" },
      { path: "/teams/femenina", label: "Femenina" },
    ]
  },
  { path: "/manage-seleccion", icon: <Shield size={20} />, label: "Selección Nacional" },
  { path: "/manage-seleccion-femenina", icon: <Shield size={20} />, label: "Selección Femenina" },
  { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
  { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
  { path: "/admin/copa", icon: <Trophy size={20} />, label: "Copa Presidente" },
  { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
  { path: "/manage-comments", icon: <MessageCircle size={20} />, label: "Gestionar Comentarios" },
  { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
  { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
  { path: "/", icon: <Eye size={20} />, label: "Ver Sitio" },
];

const COMPETICIONES = ["Amistoso", "Copa Oro W", "Nations League", "Eliminatoria Mundialista", "Copa Centroamericana", "Otro"];
const LUGARES = ["Local", "Visitante", "Neutral"];
const ROLES_STAFF = ["Director Técnico", "Asistente Técnico", "Preparador Físico", "Médico", "Utilera", "Psicóloga", "Videoanalista", "Otro"];
const POSICIONES = [
  { value: "portero", label: "Portero", abbr: "POR" },
  { value: "defensa", label: "Defensa", abbr: "DEF" },
  { value: "lateral_izquierdo", label: "Lateral Izquierdo", abbr: "LI" },
  { value: "lateral_derecho", label: "Lateral Derecho", abbr: "LD" },
  { value: "central", label: "Central", abbr: "DFC" },
  { value: "medio_defensivo", label: "Medio Defensivo", abbr: "MCD" },
  { value: "medio_central", label: "Medio Central", abbr: "MC" },
  { value: "medio_ofensivo", label: "Medio Ofensivo", abbr: "MCO" },
  { value: "extremo_izquierdo", label: "Extremo Izquierdo", abbr: "EI" },
  { value: "extremo_derecho", label: "Extremo Derecho", abbr: "ED" },
  { value: "centrodelantero", label: "Centrodelantero", abbr: "DC" },
  { value: "segundo_delantero", label: "Segundo Delantero", abbr: "SD" },
];

export default function ManageSeleccionFemenina() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamsOpen, setTeamsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("partidos");

  const [partidos, setPartidos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      apiFetch(`${API}crud_partidos_seleccion_femenina.php`).then(r => r.json()),
      apiFetch(`${API}crud_jugadores_seleccion_femenina.php`).then(r => r.json()),
      apiFetch(`${API}crud_cuerpo_tecnico_femenina.php`).then(r => r.json()),
    ]).then(([pd, jd, sd]) => {
      setPartidos(pd.success ? pd.partidos : []);
      setJugadores(jd.success ? jd.jugadores : []);
      setStaff(sd.success ? sd.staff : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const handleLogout = () => {
    Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", confirmButtonColor: "#d33" })
      .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); window.location.href = "/login"; } });
  };

  return (
    <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon"><img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo" /></div>
          <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {SIDEBAR_ITEMS.map((item, idx) => {
              if (item.type === "dropdown") {
                return (
                  <li key={idx}>
                    <button className="nav-item" onClick={() => setTeamsOpen(!teamsOpen)} style={{ width: "100%", justifyContent: "space-between" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>{item.icon} {item.label}</span>
                      <ChevronDown size={16} style={{ transition: "transform 0.25s ease", transform: teamsOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.4 }} />
                    </button>
                    <ul style={{ maxHeight: teamsOpen ? "400px" : "0", opacity: teamsOpen ? "1" : "0", overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease", listStyle: "none", padding: teamsOpen ? "2px 0 4px 0" : "0", margin: 0 }}>
                      {item.children.map(child => (<li key={child.path}><Link to={child.path} className={`nav-item${location.pathname === child.path ? " active" : ""}`} style={{ paddingLeft: "48px", fontSize: "13.5px" }}>{child.label}</Link></li>))}
                    </ul>
                  </li>
                );
              }
              return <li key={item.path}><Link to={item.path} className={`nav-item${location.pathname === item.path ? " active" : ""}`}>{item.icon} {item.label}</Link></li>;
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}><LogOut size={20} className="nav-icon" /> Cerrar sesión</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={16} /> Selección Femenina Salvadoreña
          </div>
        </header>

        <div className="content-wrapper">
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.2rem", flexWrap: "wrap" }}>
            <h1 className="admin-title" style={{ margin: 0 }}>Selección Femenina Salvadoreña</h1>
          </div>

          <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "4px", marginBottom: "1.5rem", maxWidth: "500px" }}>
            {[
              { key: "partidos", label: "Partidos", count: partidos.length },
              { key: "jugadores", label: "Jugadoras", count: jugadores.length },
              { key: "tecnico", label: "Cuerpo Técnico", count: staff.length },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 14px", borderRadius: "9px", border: "none", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: "12px", transition: "0.2s",
                  background: activeTab === t.key ? "linear-gradient(135deg,rgba(236,72,153,0.18),rgba(236,72,153,0.06))" : "transparent",
                  color: activeTab === t.key ? "#ec4899" : "#64748b" }}>
                {t.label} <span style={{ fontSize: "10px", opacity: 0.6 }}>({t.count})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#ec4899", animation: "mmSpin 0.8s linear infinite", margin: "0 auto 1rem" }} />
              Cargando datos...
            </div>
          ) : (
            <>
              {activeTab === "partidos" && <PartidosTabFemenina partidos={partidos} onReload={loadAll} />}
              {activeTab === "jugadores" && <JugadoresTabFemenina jugadores={jugadores} onReload={loadAll} />}
              {activeTab === "tecnico" && <TecnicoTabFemenina staff={staff} onReload={loadAll} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function PartidosTabFemenina({ partidos, onReload }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ rival_nombre: "", rival_logo: "", goles_favor: "", goles_contra: "", fecha: "", hora: "", estado: "Pendiente", competicion: "", lugar: "Neutral" });

  const openCreate = () => {
    setEditId(null);
    setForm({ rival_nombre: "", rival_logo: "", goles_favor: "", goles_contra: "", fecha: "", hora: "", estado: "Pendiente", competicion: "", lugar: "Neutral" });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ rival_nombre: p.rival_nombre, rival_logo: p.rival_logo || "", goles_favor: p.goles_favor ?? "", goles_contra: p.goles_contra ?? "", fecha: p.fecha || "", hora: p.hora || "", estado: p.estado || "Pendiente", competicion: p.competicion || "", lugar: p.lugar || "Neutral" });
    setShowForm(true);
  };

  const save = () => {
    if (!form.rival_nombre.trim()) { Swal.fire({ icon: "info", title: "Nombre del rival requerido", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
    const payload = { ...form, action: editId ? "update" : "create", id: editId };
    if (editId) payload.id = editId;
    apiPost(`${API}crud_partidos_seleccion_femenina.php`, payload).then(d => {
      if (d.success) { Swal.fire({ icon: "success", title: editId ? "Actualizado" : "Creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); setShowForm(false); }
      else Swal.fire("Error", d.error || "Error", "error");
    }).catch(() => Swal.fire("Error", "Error de conexión", "error"));
  };

  const deletePartido = (id, rival) => {
    Swal.fire({ title: "¿Eliminar partido?", text: `vs ${rival}`, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33" })
      .then(r => { if (r.isConfirmed) { apiPost(`${API}crud_partidos_seleccion_femenina.php`, { action: "delete", id }).then(d => { if (d.success) { Swal.fire({ icon: "success", title: "Eliminado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); } }).catch(() => Swal.fire("Error", "Error", "error")); } });
  };

  return (
    <div className="table-container">
      <div className="table-header" style={{ flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Partidos ({partidos.length})</h2>
        <button className="btn-add" onClick={openCreate}><Plus size={18} /> Nuevo Partido</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 12px", color: "#f1f5f9", fontSize: "14px" }}>{editId ? "Editar Partido" : "Nuevo Partido"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input className="mod-input" placeholder="Rival *" value={form.rival_nombre} onChange={e => setForm({ ...form, rival_nombre: e.target.value })} />
            <input className="mod-input" placeholder="Logo rival (URL)" value={form.rival_logo} onChange={e => setForm({ ...form, rival_logo: e.target.value })} />
            <input className="mod-input" type="number" placeholder="Goles a favor" value={form.goles_favor} onChange={e => setForm({ ...form, goles_favor: e.target.value === "" ? "" : Number(e.target.value) })} />
            <input className="mod-input" type="number" placeholder="Goles en contra" value={form.goles_contra} onChange={e => setForm({ ...form, goles_contra: e.target.value === "" ? "" : Number(e.target.value) })} />
            <input className="mod-input" type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
            <input className="mod-input" type="time" value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
            <select className="mod-input" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
              <option value="Pendiente">Pendiente</option><option value="En Curso">En Curso</option><option value="Finalizado">Finalizado</option>
            </select>
            <select className="mod-input" value={form.competicion} onChange={e => setForm({ ...form, competicion: e.target.value })}>
              <option value="">Sin competición</option>
              {COMPETICIONES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="mod-input" value={form.lugar} onChange={e => setForm({ ...form, lugar: e.target.value })}>
              {LUGARES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button className="btn-save" onClick={save}><Save size={16} /> Guardar</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}><X size={16} /> Cancelar</button>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Fecha</th><th>Rival</th><th style={{textAlign:"center"}}>Marcador</th><th>Competición</th><th>Estado</th><th className="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {partidos.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Sin partidos registrados</td></tr>
          ) : partidos.map(p => (
            <tr key={p.id}>
              <td style={{ whiteSpace: "nowrap", color: "#94a3b8", fontSize: "13px" }}>{p.fecha || "—"}</td>
              <td style={{ fontWeight: 600 }}>{p.rival_nombre}</td>
              <td style={{ textAlign: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "15px", color: "#e2b340", letterSpacing: "2px" }}>
                  {p.goles_favor != null ? `${p.goles_favor} - ${p.goles_contra}` : "—"}
                </span>
              </td>
              <td style={{ color: "#94a3b8", fontSize: "13px" }}>{p.competicion || "—"}</td>
              <td><span className={`status-badge ${(p.estado||"").toLowerCase() === "finalizado" ? "status-played" : (p.estado||"").toLowerCase() === "en curso" ? "status-live" : ""}`}>{p.estado || "Pendiente"}</span></td>
              <td>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="btn-icon" onClick={() => openEdit(p)} title="Editar"><Pencil size={15} /></button>
                  <button className="btn-icon btn-icon-danger" onClick={() => deletePartido(p.id, p.rival_nombre)} title="Eliminar"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JugadoresTabFemenina({ jugadores, onReload }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", posicion: "", numero_camiseta: "", foto: "", edad: "", club_origen: "", partidos_jugados: 0, goles: 0, asistencias: 0, atajadas: 0 });
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setEditId(null);
    setForm({ nombre: "", posicion: "", numero_camiseta: "", foto: "", edad: "", club_origen: "", partidos_jugados: 0, goles: 0, asistencias: 0, atajadas: 0 });
    setShowForm(true);
  };

  const openEdit = (j) => {
    setEditId(j.id);
    setForm({ nombre: j.nombre, posicion: j.posicion || "", numero_camiseta: j.numero_camiseta ?? "", foto: j.foto || "", edad: j.edad ?? "", club_origen: j.club_origen || "", partidos_jugados: j.partidos_jugados ?? 0, goles: j.goles ?? 0, asistencias: j.asistencias ?? 0, atajadas: j.atajadas ?? 0 });
    setShowForm(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("foto", file);
    setUploading(true);
    try {
      const res = await fetch(`${API}upload_seleccion_foto_femenina.php`, { method: "POST", body: fd });
      const d = await res.json();
      if (d.success) { setForm({ ...form, foto: d.url }); }
      else Swal.fire("Error", d.error, "error");
    } catch { Swal.fire("Error", "Error al subir imagen", "error"); }
    setUploading(false);
  };

  const save = () => {
    if (!form.nombre.trim()) { Swal.fire({ icon: "info", title: "Nombre requerido", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
    const payload = { ...form, action: editId ? "update" : "create", id: editId };
    if (editId) payload.id = editId;
    apiPost(`${API}crud_jugadores_seleccion_femenina.php`, payload).then(d => {
      if (d.success) { Swal.fire({ icon: "success", title: editId ? "Actualizada" : "Creada", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); setShowForm(false); }
      else Swal.fire("Error", d.error || "Error", "error");
    }).catch(() => Swal.fire("Error", "Error de conexión", "error"));
  };

  const deleteJugador = (id, nombre) => {
    Swal.fire({ title: "¿Eliminar jugadora?", text: nombre, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33" })
      .then(r => { if (r.isConfirmed) { apiPost(`${API}crud_jugadores_seleccion_femenina.php`, { action: "delete", id }).then(d => { if (d.success) { Swal.fire({ icon: "success", title: "Eliminada", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); } }).catch(() => Swal.fire("Error", "Error", "error")); } });
  };

  const posAbbr = (v) => POSICIONES.find(p => p.value === v)?.abbr || v || "—";
  const getPosColor = (v) => POSICIONES.find(p => p.value === v)?.abbr === "POR" ? "#f59e0b" : POSICIONES.find(p => p.value === v)?.abbr === "DEF" || POSICIONES.find(p => p.value === v)?.abbr === "LI" || POSICIONES.find(p => p.value === v)?.abbr === "LD" || POSICIONES.find(p => p.value === v)?.abbr === "DFC" ? "#3b82f6" : POSICIONES.find(p => p.value === v)?.abbr === "MCD" || POSICIONES.find(p => p.value === v)?.abbr === "MC" || POSICIONES.find(p => p.value === v)?.abbr === "MCO" || POSICIONES.find(p => p.value === v)?.abbr === "EI" || POSICIONES.find(p => p.value === v)?.abbr === "ED" ? "#10b981" : "#ef4444";

  return (
    <div className="table-container">
      <div className="table-header" style={{ flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Jugadoras ({jugadores.length})</h2>
        <button className="btn-add" onClick={openCreate}><Plus size={18} /> Nueva Jugadora</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 12px", color: "#f1f5f9", fontSize: "14px" }}>{editId ? "Editar Jugadora" : "Nueva Jugadora"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <input className="mod-input" placeholder="Nombre *" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <select className="mod-input" value={form.posicion} onChange={e => setForm({ ...form, posicion: e.target.value })}>
              <option value="">Selecciona posición</option>
              {POSICIONES.map(p => <option key={p.value} value={p.value}>{p.label} ({p.abbr})</option>)}
            </select>
            <input className="mod-input" type="number" placeholder="N° Camiseta" value={form.numero_camiseta} onChange={e => setForm({ ...form, numero_camiseta: e.target.value === "" ? "" : Number(e.target.value) })} />
            <input className="mod-input" type="number" placeholder="Edad" value={form.edad} onChange={e => setForm({ ...form, edad: e.target.value === "" ? "" : Number(e.target.value) })} />
            <input className="mod-input" placeholder="Club" value={form.club_origen} onChange={e => setForm({ ...form, club_origen: e.target.value })} />
            <input className="mod-input" type="number" placeholder="Partidos jugados" value={form.partidos_jugados} onChange={e => setForm({ ...form, partidos_jugados: Number(e.target.value) })} />
            <input className="mod-input" type="number" placeholder="Goles" value={form.goles} onChange={e => setForm({ ...form, goles: Number(e.target.value) })} />
            <input className="mod-input" type="number" placeholder="Asistencias" value={form.asistencias} onChange={e => setForm({ ...form, asistencias: Number(e.target.value) })} />
            <input className="mod-input" type="number" placeholder="Atajadas" value={form.atajadas} onChange={e => setForm({ ...form, atajadas: Number(e.target.value) })} />
          </div>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
            <label className="file-upload-btn">
              <Upload size={14} /> {uploading ? "Subiendo..." : "Subir foto"}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
            </label>
            {form.foto && <span style={{ fontSize: "11px", color: "#10b981" }}>✓ Foto subida</span>}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button className="btn-save" onClick={save}><Save size={16} /> Guardar</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}><X size={16} /> Cancelar</button>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>#</th><th>Nombre</th><th>Posición</th><th>Edad</th><th>Club</th><th>PJ</th><th>G</th><th>A</th><th>Atj</th><th className="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.length === 0 ? (
            <tr><td colSpan={10} style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Sin jugadoras registradas</td></tr>
          ) : jugadores.map(j => (
            <tr key={j.id}>
              <td style={{ fontWeight: 800, color: "#94a3b8" }}>{j.numero_camiseta || "—"}</td>
              <td style={{ fontWeight: 600 }}>{j.nombre}</td>
              <td style={{ color: "#94a3b8", fontSize: "13px" }}>{posAbbr(j.posicion)}</td>
              <td style={{ color: "#94a3b8" }}>{j.edad || "—"}</td>
              <td style={{ color: "#94a3b8", fontSize: "13px" }}>{j.club_origen || "—"}</td>
              <td style={{ fontWeight: 600 }}>{j.partidos_jugados || 0}</td>
              <td style={{ fontWeight: 600, color: "#ef4444" }}>{j.goles || 0}</td>
              <td style={{ fontWeight: 600, color: "#3b82f6" }}>{j.asistencias || 0}</td>
              <td style={{ fontWeight: 600, color: "#f59e0b" }}>{j.atajadas || 0}</td>
              <td>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="btn-icon" onClick={() => openEdit(j)} title="Editar"><Pencil size={15} /></button>
                  <button className="btn-icon btn-icon-danger" onClick={() => deleteJugador(j.id, j.nombre)} title="Eliminar"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TecnicoTabFemenina({ staff, onReload }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", rol: "", foto: "", nacionalidad: "" });
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setEditId(null);
    setForm({ nombre: "", rol: "", foto: "", nacionalidad: "" });
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditId(s.id);
    setForm({ nombre: s.nombre, rol: s.rol || "", foto: s.foto || "", nacionalidad: s.nacionalidad || "" });
    setShowForm(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("foto", file);
    setUploading(true);
    try {
      const res = await fetch(`${API}upload_seleccion_foto_femenina.php`, { method: "POST", body: fd });
      const d = await res.json();
      if (d.success) { setForm({ ...form, foto: d.url }); }
      else Swal.fire("Error", d.error, "error");
    } catch { Swal.fire("Error", "Error al subir imagen", "error"); }
    setUploading(false);
  };

  const save = () => {
    if (!form.nombre.trim()) { Swal.fire({ icon: "info", title: "Nombre requerido", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
    const payload = { ...form, action: editId ? "update" : "create", id: editId };
    if (editId) payload.id = editId;
    apiPost(`${API}crud_cuerpo_tecnico_femenina.php`, payload).then(d => {
      if (d.success) { Swal.fire({ icon: "success", title: editId ? "Actualizado" : "Creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); setShowForm(false); }
      else Swal.fire("Error", d.error || "Error", "error");
    }).catch(() => Swal.fire("Error", "Error de conexión", "error"));
  };

  const deleteStaff = (id, nombre) => {
    Swal.fire({ title: "¿Eliminar miembro?", text: nombre, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33" })
      .then(r => { if (r.isConfirmed) { apiPost(`${API}crud_cuerpo_tecnico_femenina.php`, { action: "delete", id }).then(d => { if (d.success) { Swal.fire({ icon: "success", title: "Eliminado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); } }).catch(() => Swal.fire("Error", "Error", "error")); } });
  };

  return (
    <div className="table-container">
      <div className="table-header" style={{ flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Cuerpo Técnico ({staff.length})</h2>
        <button className="btn-add" onClick={openCreate}><Plus size={18} /> Nuevo Miembro</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 12px", color: "#f1f5f9", fontSize: "14px" }}>{editId ? "Editar Miembro" : "Nuevo Miembro"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input className="mod-input" placeholder="Nombre *" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <select className="mod-input" value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
              <option value="">Selecciona rol</option>
              {ROLES_STAFF.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input className="mod-input" placeholder="Nacionalidad" value={form.nacionalidad} onChange={e => setForm({ ...form, nacionalidad: e.target.value })} />
          </div>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
            <label className="file-upload-btn" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "#94a3b8" }}>
              <Upload size={14} /> {uploading ? "Subiendo..." : "Subir foto"}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
            </label>
            {form.foto && <span style={{ fontSize: "11px", color: "#10b981" }}>✓ Foto subida</span>}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button className="btn-save" onClick={save}><Save size={16} /> Guardar</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}><X size={16} /> Cancelar</button>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th><th>Rol</th><th>Nacionalidad</th><th className="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Sin cuerpo técnico registrado</td></tr>
          ) : staff.map(s => (
            <tr key={s.id}>
              <td style={{ fontWeight: 600 }}>{s.nombre}</td>
              <td style={{ color: "#ec4899", fontWeight: 600 }}>{s.rol || "—"}</td>
              <td style={{ color: "#94a3b8" }}>{s.nacionalidad || "—"}</td>
              <td>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="btn-icon" onClick={() => openEdit(s)} title="Editar"><Pencil size={15} /></button>
                  <button className="btn-icon btn-icon-danger" onClick={() => deleteStaff(s.id, s.nombre)} title="Eliminar"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
