import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import "../admin.css";
import Swal from "sweetalert2";
import "animate.css";
import { apiPost, apiFetch, getAuthHeaders } from "../apiHelper";
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  Target, Trophy, ChevronDown, Plus, Pencil, Trash2, Save, X,
  Search, MessageCircle, Upload, Download, Eye, BarChart3
} from "lucide-react";
import { API_BASE } from "../config";

const API = API_BASE;

const SIDEBAR_ITEMS = [
  { path: "/analytics", icon: <BarChart3 size={20} />, label: "Analiticas" },
  { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
  { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
  {
    type: "dropdown", icon: <Shield size={20} />, label: "Equipos",
    children: [
      { path: "/teams/primera", label: "Primera División" },
      { path: "/teams/ascenso", label: "Liga de Ascenso" },
      { path: "/teams/femenina", label: "Femenina" },
    ]
  },
      {
        type: "dropdown", icon: <Shield size={20} />, label: "Selecciones",
        children: [
            { path: "/manage-seleccion", label: "Masculina" },
            { path: "/manage-seleccion-femenina", label: "Femenina" },
            { path: "/manage-seleccion-sub20", label: "Sub-20" },
            { path: "/manage-seleccion-sub17", label: "Sub-17" },
        ]
      },
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

export default function ManageSeleccionSub20() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(true);
  const [seleccionesOpen, setSeleccionesOpen] = useState(false);
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
      apiFetch(`${API}crud_partidos_seleccion_sub20.php`).then(r => r.json()),
      apiFetch(`${API}crud_jugadores_seleccion_sub20.php`).then(r => r.json()),
      apiFetch(`${API}crud_cuerpo_tecnico_sub20.php`).then(r => r.json()),
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
      .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); Swal.fire({ icon: "success", title: "Deslogueo exitoso", timer: 1500, showConfirmButton: false }).then(() => { window.location.href = "/login"; }); } });
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-closed" : ""}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={16} /> Selección Sub-20 Salvadoreña
          </div>
        </header>

        <div className="content-wrapper">
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.2rem", flexWrap: "wrap" }}>
            <h1 className="admin-title" style={{ margin: 0 }}>Selección Sub-20 Salvadoreña</h1>
          </div>

          <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "4px", marginBottom: "1.5rem", maxWidth: "500px" }}>
            {[
              { key: "partidos", label: "Partidos", count: partidos.length },
              { key: "jugadores", label: "Jugadores", count: jugadores.length },
              { key: "tecnico", label: "Cuerpo Técnico", count: staff.length },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 14px", borderRadius: "9px", border: "none", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: "12px", transition: "0.2s",
                  background: activeTab === t.key ? "linear-gradient(135deg,rgba(249,115,22,0.18),rgba(249,115,22,0.06))" : "transparent",
                  color: activeTab === t.key ? "#f97316" : "#64748b" }}>
                {t.label} <span style={{ fontSize: "10px", opacity: 0.6 }}>({t.count})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#f97316", animation: "mmSpin 0.8s linear infinite", margin: "0 auto 1rem" }} />
              Cargando datos...
            </div>
          ) : (
            <>
              {activeTab === "partidos" && <PartidosTabFemenina partidos={partidos} onReload={loadAll} />}
              {activeTab === "jugadores" && <JugadoresTabSub20 jugadores={jugadores} onReload={loadAll} />}
              {activeTab === "tecnico" && <TecnicoTabFemenina staff={staff} onReload={loadAll} />}
            </>
          )}
        </div>
      </main>
      <style>{`
        button.nav-item { background: none; border: none; color: var(--text-muted); font-family: inherit; }
        @media (max-width: 768px) {
            [style*="grid-template-columns: 1fr 1fr"],
            [style*="grid-template-columns:1fr 1fr"],
            [style*="grid-template-columns: 1fr 1fr 1fr"],
            [style*="grid-template-columns:1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
            [style*="display: flex"][style*="gap: 6px"] select { width: 56px !important; }
        }
      `}</style>
    </div>
  );
}

function PartidosTabFemenina({ partidos, onReload }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ rival_nombre: "", rival_logo: "", goles_favor: "", goles_contra: "", fecha: "", hora: "", estado: "Pendiente", competicion: "", lugar: "Neutral" });
  const to12h = (h24) => { if (!h24) return { h: "12", m: "00", ampm: "AM" }; const [hh, mm] = h24.split(":"); let h = parseInt(hh) || 0; const ampm = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return { h: String(h).padStart(2, '0'), m: mm || "00", ampm }; };
  const from12h = (h12, m12, ampm) => { if (!h12 || h12 === "") return ""; let hh = parseInt(h12); if (ampm === "PM" && hh !== 12) hh += 12; if (ampm === "AM" && hh === 12) hh = 0; return String(hh).padStart(2, '0') + ":" + (m12 || "00"); };

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
    apiPost(`${API}crud_partidos_seleccion_sub20.php`, payload).then(r => r.json()).then(d => {
      if (d.success) { Swal.fire({ icon: "success", title: editId ? "Actualizado" : "Creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); setShowForm(false); }
      else Swal.fire("Error", d.error || "Error", "error");
    }).catch(() => Swal.fire("Error", "Error de conexión", "error"));
  };

  const deletePartido = (id, rival) => {
    Swal.fire({ title: "¿Eliminar partido?", text: `vs ${rival}`, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33" })
      .then(r => { if (r.isConfirmed) { apiPost(`${API}crud_partidos_seleccion_sub20.php`, { action: "delete", id }).then(r => r.json()).then(d => { if (d.success) { Swal.fire({ icon: "success", title: "Eliminado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); } }).catch(() => Swal.fire("Error", "Error", "error")); } });
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
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <select className="mod-input" style={{ width: 62, padding: "12px 6px", textAlign: "center" }} value={to12h(form.hora).h} onChange={e => setForm({ ...form, hora: from12h(e.target.value, to12h(form.hora).m, to12h(form.hora).ampm) })}>
                {["01","02","03","04","05","06","07","08","09","10","11","12"].map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span style={{ color: "#475569", fontWeight: 800 }}>:</span>
              <select className="mod-input" style={{ width: 58, padding: "12px 4px", textAlign: "center" }} value={to12h(form.hora).m} onChange={e => setForm({ ...form, hora: from12h(to12h(form.hora).h, e.target.value, to12h(form.hora).ampm) })}>
                {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button type="button" onClick={() => setForm({ ...form, hora: from12h(to12h(form.hora).h, to12h(form.hora).m, "AM") })} className="mod-input" style={{ padding: "12px 6px", cursor: "pointer", fontWeight: 800, fontSize: 12, background: to12h(form.hora).ampm === "AM" ? "rgba(226,179,64,0.12)" : "", borderColor: to12h(form.hora).ampm === "AM" ? "#e2b340" : "", color: to12h(form.hora).ampm === "AM" ? "#e2b340" : "" }}>AM</button>
              <button type="button" onClick={() => setForm({ ...form, hora: from12h(to12h(form.hora).h, to12h(form.hora).m, "PM") })} className="mod-input" style={{ padding: "12px 6px", cursor: "pointer", fontWeight: 800, fontSize: 12, background: to12h(form.hora).ampm === "PM" ? "rgba(226,179,64,0.12)" : "", borderColor: to12h(form.hora).ampm === "PM" ? "#e2b340" : "", color: to12h(form.hora).ampm === "PM" ? "#e2b340" : "" }}>PM</button>
            </div>
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

function JugadoresTabSub20({ jugadores, onReload }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: "", posicion: "", numero_camiseta: "", foto: "", edad: "", club_origen: "", partidos_jugados: 0, goles: 0, asistencias: 0, atajadas: 0 });
  const [uploading, setUploading] = useState(false);

  const [importModal, setImportModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvText, setCsvText] = useState("");
  const [csvPreview, setCsvPreview] = useState([]);
  const [importing, setImporting] = useState(false);

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
      const res = await fetch(`${API}upload_seleccion_foto_sub20.php`, { method: "POST", headers: getAuthHeaders(), body: fd });
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
    apiPost(`${API}crud_jugadores_seleccion_sub20.php`, payload).then(r => r.json()).then(d => {
      if (d.success) { Swal.fire({ icon: "success", title: editId ? "Actualizado" : "Creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); setShowForm(false); }
      else Swal.fire("Error", d.error || "Error", "error");
    }).catch(() => Swal.fire("Error", "Error de conexión", "error"));
  };

  const deleteJugador = (id, nombre) => {
    Swal.fire({ title: "¿Eliminar jugador?", text: nombre, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33" })
      .then(r => { if (r.isConfirmed) { apiPost(`${API}crud_jugadores_seleccion_sub20.php`, { action: "delete", id }).then(r => r.json()).then(d => { if (d.success) { Swal.fire({ icon: "success", title: "Eliminado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); } }).catch(() => Swal.fire("Error", "Error", "error")); } });
  };

  const openImport = () => { setCsvFile(null); setCsvText(""); setCsvPreview([]); setImportModal(true); };
  const closeImport = () => { setImportModal(false); setCsvFile(null); setCsvText(""); setCsvPreview([]); };

  const parseCSVPreview = (text) => {
    const lines = text.trim().split("\n").filter(l => l.trim());
    if (!lines.length) { setCsvPreview([]); return; }
    const h = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const v = lines[i].split(",").map(x => x.trim());
      if (v.length < 2 || !v[0]) continue;
      const row = {};
      h.forEach((key, idx) => { row[key] = v[idx] ?? ""; });
      if (row.posicion) {
        const pi = POSICIONES.find(p => p.value === row.posicion || p.abbr.toLowerCase() === row.posicion.toLowerCase());
        row.posicion = pi ? pi.value : row.posicion;
      }
      if (row.nombre) rows.push(row);
    }
    setCsvPreview(rows);
  };

  const downloadTemplate = () => {
    const t = "nombre,posicion,numero_camiseta,edad,club,partidos_jugados,goles,asistencias,atajadas\nMaria Perez,centrodelantero,9,25,Club X,10,5,3,0\nAna Lopez,portero,1,28,Club Y,12,0,1,35";
    const blob = new Blob([t], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plantilla_seleccion_sub20.csv";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const importPlayers = async () => {
    setImporting(true);
    try {
      const fd = new FormData();
      const headers = Object.keys(csvPreview[0] || {}).filter(k => k !== "posicion_original");
      const lines = [headers.join(",")];
      csvPreview.forEach(row => { lines.push(headers.map(h => row[h] ?? "").join(",")); });
      fd.append("csv_text", lines.join("\n"));
      const res = await fetch(`${API}importar_jugadores_seleccion_sub20.php`, { method: "POST", body: fd, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const d = await res.json();
      if (d.success) {
        closeImport();
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: d.importados + " jugadores importados", showConfirmButton: false, timer: 2000 });
        onReload();
      } else {
        Swal.fire({ icon: "error", title: "Error en importación", text: d.error || (d.errores || []).join("\n") });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error de conexión" });
    } finally { setImporting(false); }
  };

  const posAbbr = (v) => POSICIONES.find(p => p.value === v)?.abbr || v || "—";
  const getPosColor = (v) => POSICIONES.find(p => p.value === v)?.abbr === "POR" ? "#f59e0b" : POSICIONES.find(p => p.value === v)?.abbr === "DEF" || POSICIONES.find(p => p.value === v)?.abbr === "LI" || POSICIONES.find(p => p.value === v)?.abbr === "LD" || POSICIONES.find(p => p.value === v)?.abbr === "DFC" ? "#3b82f6" : POSICIONES.find(p => p.value === v)?.abbr === "MCD" || POSICIONES.find(p => p.value === v)?.abbr === "MC" || POSICIONES.find(p => p.value === v)?.abbr === "MCO" || POSICIONES.find(p => p.value === v)?.abbr === "EI" || POSICIONES.find(p => p.value === v)?.abbr === "ED" ? "#10b981" : "#ef4444";

  return (
    <div className="table-container">
      <div className="table-header" style={{ flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Jugadores ({jugadores.length})</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn-add" onClick={openImport}><Upload size={16} /> Importar CSV</button>
          <button className="btn-add" onClick={openCreate}><Plus size={18} /> Nuevo Jugador</button>
        </div>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 12px", color: "#f1f5f9", fontSize: "14px" }}>{editId ? "Editar Jugador" : "Nuevo Jugador"}</h3>
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
            <tr><td colSpan={10} style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>Sin jugadores registrados</td></tr>
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

      {importModal && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={closeImport}>
          <div style={{ background: "#1e293b", borderRadius: 16, maxWidth: 740, width: "100%", maxHeight: "90vh", overflow: "auto", border: "1px solid rgba(255,255,255,0.08)" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 16 }}>Importar Jugadores</h3>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 12 }}>Sube un archivo CSV o pega el texto</p>
              </div>
              <button onClick={closeImport} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}><X size={18} /></button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <button onClick={downloadTemplate} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}><Download size={13} /> Descargar plantilla CSV</button>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "18px 24px", borderRadius: 14, border: "2px dashed rgba(255,255,255,0.1)", cursor: "pointer", color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>
                  <Upload size={16} /> Seleccionar archivo CSV
                  <input type="file" accept=".csv,text/csv" onChange={e => {
                    const f = e.target.files[0]; if (!f) return; setCsvFile(f);
                    const reader = new FileReader();
                    reader.onload = ev => { setCsvText(ev.target.result); parseCSVPreview(ev.target.result); };
                    reader.readAsText(f);
                  }} style={{ display: "none" }} />
                </label>
                <div style={{ textAlign: "center", fontSize: 11, color: "#475569" }}>o</div>
                <textarea value={csvText} onChange={e => { setCsvText(e.target.value); if (e.target.value.trim()) parseCSVPreview(e.target.value); else setCsvPreview([]); }} placeholder="Pega aquí el contenido del CSV..." style={{ width: "100%", minHeight: 100, padding: 14, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", color: "#e2e8f0", fontSize: 11, fontFamily: "monospace", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
              </div>
              {csvFile && (
                <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#34d399", fontWeight: 600 }}>
                  <Upload size={15} /> {csvFile.name}
                  <button onClick={() => { setCsvFile(null); setCsvText(""); setCsvPreview([]); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 12 }}>Quitar</button>
                </div>
              )}
              {csvPreview.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "0 4px 8px" }}>
                    <span style={{ fontSize: 11, color: "#475569", fontWeight: 700 }}>{csvPreview.length} fila{csvPreview.length !== 1 ? "s" : ""} por importar</span>
                    <button onClick={() => { setCsvPreview([]); setCsvText(""); setCsvFile(null); }} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}>Limpiar</button>
                  </div>
                  <div style={{ maxHeight: 220, overflow: "auto", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace" }}>
                      <thead><tr style={{ background: "rgba(255,255,255,0.04)", position: "sticky", top: 0 }}>
                        {["#", "Nombre", "Pos", "#", "Edad", "Club", "PJ", "G", "A", "Atj"].map((h, i) => (
                          <th key={i} style={{ padding: "6px 8px", textAlign: "left", color: "#475569", fontWeight: 700 }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {csvPreview.map((r, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                            <td style={{ padding: "4px 8px", color: "#334155" }}>{i + 1}</td>
                            <td style={{ padding: "4px 8px", color: "#e2e8f0", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.nombre}</td>
                            <td style={{ padding: "4px 8px" }}>
                              <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 700, color: getPosColor(r.posicion), background: getPosColor(r.posicion) + "15", border: "1px solid " + getPosColor(r.posicion) + "25" }}>{posAbbr(r.posicion)}</span>
                            </td>
                            <td style={{ padding: "4px 6px", textAlign: "center", color: "#64748b" }}>{r.numero_camiseta || "—"}</td>
                            <td style={{ padding: "4px 6px", textAlign: "center", color: "#64748b" }}>{r.edad || "—"}</td>
                            <td style={{ padding: "4px 6px", textAlign: "center", color: "#64748b" }}>{r.club || "—"}</td>
                            <td style={{ padding: "4px 6px", textAlign: "center", color: "#64748b" }}>{r.partidos_jugados || "—"}</td>
                            <td style={{ padding: "4px 6px", textAlign: "center", color: "#f87171", fontWeight: 700 }}>{r.goles || "—"}</td>
                            <td style={{ padding: "4px 6px", textAlign: "center", color: "#60a5fa", fontWeight: 700 }}>{r.asistencias || "—"}</td>
                            <td style={{ padding: "4px 6px", textAlign: "center", color: "#f59e0b", fontWeight: 700 }}>{r.atajadas || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#475569" }}>Jugadores actuales: {jugadores.length}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-cancel" onClick={closeImport}>Cancelar</button>
                <button className="btn-save" onClick={importPlayers} disabled={importing || csvPreview.length === 0} style={{ opacity: importing || csvPreview.length === 0 ? 0.5 : 1 }}>
                  <Upload size={14} />{importing ? "Importando..." : "Importar " + csvPreview.length}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
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
      const res = await fetch(`${API}upload_seleccion_foto_sub20.php`, { method: "POST", headers: getAuthHeaders(), body: fd });
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
    apiPost(`${API}crud_cuerpo_tecnico_sub20.php`, payload).then(r => r.json()).then(d => {
      if (d.success) { Swal.fire({ icon: "success", title: editId ? "Actualizado" : "Creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); setShowForm(false); }
      else Swal.fire("Error", d.error || "Error", "error");
    }).catch(() => Swal.fire("Error", "Error de conexión", "error"));
  };

  const deleteStaff = (id, nombre) => {
    Swal.fire({ title: "¿Eliminar miembro?", text: nombre, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33" })
      .then(r => { if (r.isConfirmed) { apiPost(`${API}crud_cuerpo_tecnico_sub20.php`, { action: "delete", id }).then(r => r.json()).then(d => { if (d.success) { Swal.fire({ icon: "success", title: "Eliminado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(onReload); } }).catch(() => Swal.fire("Error", "Error", "error")); } });
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
              <td style={{ color: "#f97316", fontWeight: 600 }}>{s.rol || "—"}</td>
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