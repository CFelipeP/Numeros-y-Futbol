import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import axios from "axios";
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  ChevronDown, Plus, Pencil, Trash2, Save, X,
  Search, User, Target, Trophy, Star, ArrowRightLeft, Eye as EyeIcon
} from "lucide-react";

const API = "http://numeros-y-futbol.test/backend/";

const posiciones = [
  { value: "portero", label: "Portero", color: "#f59e0b" },
  { value: "defensa", label: "Defensa", color: "#3b82f6" },
  { value: "medio", label: "Mediocampista", color: "#10b981" },
  { value: "delantero", label: "Delantero", color: "#ef4444" },
];

const posConfig = {
  portero: { color: "#f59e0b", border: "rgba(245,158,11,0.2)", label: "PORTEROS", grad: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))" },
  defensa: { color: "#3b82f6", border: "rgba(59,130,246,0.2)", label: "DEFENSAS", grad: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))" },
  medio: { color: "#10b981", border: "rgba(16,185,129,0.2)", label: "MEDIOS", grad: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))" },
  delantero: { color: "#ef4444", border: "rgba(239,68,68,0.2)", label: "DELANTEROS", grad: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))" },
};

const statFields = [
  { key: "pj", label: "PJ" }, { key: "goles", label: "Goles" },
  { key: "asistencias", label: "Asist." }, { key: "goles_penal", label: "Pen." },
  { key: "goles_cabeza", label: "Cabeza" }, { key: "goles_tiro_libre", label: "T. Libre" },
  { key: "tarjetas_amarillas", label: "Amar." }, { key: "tarjetas_rojas", label: "Rojas" },
  { key: "minutos_jugados", label: "Min." },
];
const porteroStatFields = [
  { key: "pj", label: "PJ" }, { key: "goles_recibidos", label: "Gol. Rec." },
  { key: "vaya_invicta", label: "V. Inv." }, { key: "tarjetas_amarillas", label: "Amar." },
  { key: "tarjetas_rojas", label: "Rojas" }, { key: "minutos_jugados", label: "Min." },
];

const navItems = [
  { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
  { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
  { type: "dropdown", icon: <Shield size={20} />, label: "Equipos", children: [
    { path: "/teams/primera", label: "Primera División" },
    { path: "/teams/segunda", label: "Segunda División" },
    { path: "/teams/tercera", label: "Tercera División" },
  ]},
  { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
  { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
  { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
  { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
  { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
];

const formationData = {
  "4-4-2": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 12, y: 70, role: "LI" },
    { pos: "defensa", x: 36, y: 74, role: "DFC" }, { pos: "defensa", x: 64, y: 74, role: "DFC" },
    { pos: "defensa", x: 88, y: 70, role: "LD" }, { pos: "medio", x: 18, y: 48, role: "MI" },
    { pos: "medio", x: 40, y: 46, role: "MC" }, { pos: "medio", x: 60, y: 46, role: "MC" },
    { pos: "medio", x: 82, y: 48, role: "MD" }, { pos: "delantero", x: 36, y: 22, role: "DC" },
    { pos: "delantero", x: 64, y: 22, role: "DC" },
  ],
  "4-3-3": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 12, y: 70, role: "LI" },
    { pos: "defensa", x: 36, y: 74, role: "DFC" }, { pos: "defensa", x: 64, y: 74, role: "DFC" },
    { pos: "defensa", x: 88, y: 70, role: "LD" }, { pos: "medio", x: 28, y: 48, role: "MC" },
    { pos: "medio", x: 50, y: 44, role: "MC" }, { pos: "medio", x: 72, y: 48, role: "MC" },
    { pos: "delantero", x: 18, y: 22, role: "EI" }, { pos: "delantero", x: 50, y: 18, role: "DC" },
    { pos: "delantero", x: 82, y: 22, role: "ED" },
  ],
  "3-5-2": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 25, y: 74, role: "DFC" },
    { pos: "defensa", x: 50, y: 76, role: "DFC" }, { pos: "defensa", x: 75, y: 74, role: "DFC" },
    { pos: "medio", x: 10, y: 50, role: "CAI" }, { pos: "medio", x: 30, y: 48, role: "MC" },
    { pos: "medio", x: 50, y: 44, role: "MC" }, { pos: "medio", x: 70, y: 48, role: "MC" },
    { pos: "medio", x: 90, y: 50, role: "CAD" }, { pos: "delantero", x: 36, y: 22, role: "DC" },
    { pos: "delantero", x: 64, y: 22, role: "DC" },
  ],
  "4-2-3-1": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 12, y: 70, role: "LI" },
    { pos: "defensa", x: 36, y: 74, role: "DFC" }, { pos: "defensa", x: 64, y: 74, role: "DFC" },
    { pos: "defensa", x: 88, y: 70, role: "LD" }, { pos: "medio", x: 38, y: 56, role: "MCD" },
    { pos: "medio", x: 62, y: 56, role: "MCD" }, { pos: "medio", x: 20, y: 38, role: "MCO" },
    { pos: "medio", x: 50, y: 34, role: "MCO" }, { pos: "medio", x: 80, y: 38, role: "MCO" },
    { pos: "delantero", x: 50, y: 18, role: "DC" },
  ],
  "5-3-2": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 8, y: 66, role: "CAI" },
    { pos: "defensa", x: 28, y: 74, role: "DFC" }, { pos: "defensa", x: 50, y: 76, role: "DFC" },
    { pos: "defensa", x: 72, y: 74, role: "DFC" }, { pos: "defensa", x: 92, y: 66, role: "CAD" },
    { pos: "medio", x: 28, y: 48, role: "MC" }, { pos: "medio", x: 50, y: 44, role: "MC" },
    { pos: "medio", x: 72, y: 48, role: "MC" }, { pos: "delantero", x: 36, y: 22, role: "DC" },
    { pos: "delantero", x: 64, y: 22, role: "DC" },
  ],
  "3-4-3": [
    { pos: "portero", x: 50, y: 90, role: "POR" }, { pos: "defensa", x: 25, y: 74, role: "DFC" },
    { pos: "defensa", x: 50, y: 76, role: "DFC" }, { pos: "defensa", x: 75, y: 74, role: "DFC" },
    { pos: "medio", x: 12, y: 50, role: "MI" }, { pos: "medio", x: 38, y: 48, role: "MC" },
    { pos: "medio", x: 62, y: 48, role: "MC" }, { pos: "medio", x: 88, y: 50, role: "MD" },
    { pos: "delantero", x: 18, y: 22, role: "EI" }, { pos: "delantero", x: 50, y: 18, role: "DC" },
    { pos: "delantero", x: 82, y: 22, role: "ED" },
  ],
};

function autoAssign(jugadores, fKey) {
  const tpl = formationData[fKey];
  if (!tpl || !jugadores?.length) return { starters: [], subs: [...jugadores] };
  const byPos = { portero: [], defensa: [], medio: [], delantero: [] };
  jugadores.forEach(j => { if (byPos[j.posicion]) byPos[j.posicion].push(j); });
  const used = new Set();
  const starters = [];
  for (const slot of tpl) {
    const avail = byPos[slot.pos]?.filter(j => !used.has(j.id));
    const pick = avail?.[0] || jugadores.find(j => !used.has(j.id));
    if (pick) { starters.push({ ...pick, posicion_x: slot.x, posicion_y: slot.y, slot_role: slot.role }); used.add(pick.id); }
  }
  return { starters, subs: jugadores.filter(j => !used.has(j.id)) };
}

const TeamDropdown = memo(function TeamDropdown({ equipos, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const sel = equipos.find(eq => String(eq.id) === String(value));
  return (
    <div className="pa-td" ref={ref}>
      <button className="pa-td-btn" onClick={() => setOpen(!open)}>
        {sel?.logo ? <img src={`${API}${sel.logo}`} className="pa-td-logo" /> : <div className="pa-td-logo-ph"><Shield size={14} /></div>}
        <span className="pa-td-name">{sel?.nombre || "Selecciona un equipo"}</span>
        <ChevronDown size={16} className="pa-td-arrow" style={{ transform: open ? "rotate(180deg)" : "" }} />
      </button>
      {open && (
        <div className="pa-td-list">
          {equipos.map(eq => (
            <button key={eq.id} className={`pa-td-item${String(eq.id) === String(value) ? " active" : ""}`}
              onClick={() => { onChange(eq.id); setOpen(false); }}>
              {eq.logo ? <img src={`${API}${eq.logo}`} className="pa-td-logo" /> : <div className="pa-td-logo-ph"><Shield size={12} /></div>}
              <span>{eq.nombre}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

const SearchBox = memo(function SearchBox({ value, onChange, onClear }) {
  return (
    <div className="pa-sw">
      <Search size={15} className="pa-sw-icon" />
      <input className="pa-input pa-sw-input" value={value} onChange={onChange} placeholder="Buscar jugador..." />
      {value && <button className="pa-sw-x" onClick={onClear} type="button"><X size={12} /></button>}
    </div>
  );
});

const PlayerRow = memo(function PlayerRow({ j, onStats, onEdit, onDelete, onToggle, showTitular }) {
  const cfg = posConfig[j.posicion] || posConfig.delantero;
  const isGK = j.posicion === "portero";
  return (
    <div className={`pa-row${j.es_titular ? " pa-row-tit" : ""}`}>
      {showTitular && (
        <button className={`pa-toggle${j.es_titular ? " active" : ""}`} onClick={() => onToggle(j)} title={j.es_titular ? "Quitar titular" : "Hacer titular"}>
          <Star size={13} />
        </button>
      )}
      <div className="pa-row-num" style={{ background: `${cfg.color}15`, color: cfg.color }}>{j.numero_camiseta || "–"}</div>
      <div className="pa-row-photo">
        {j.foto ? <img src={`${API}${j.foto}`} alt="" /> : <User size={15} style={{ color: "rgba(255,255,255,0.15)" }} />}
      </div>
      <div className="pa-row-info">
        <span className="pa-row-name">{j.nombre}</span>
        <span className="pa-row-meta">{[j.edad && `${j.edad} años`, j.nacionalidad].filter(Boolean).join(" · ")}</span>
      </div>
      <span className="pa-row-pos" style={{ color: cfg.color, borderColor: `${cfg.color}25` }}>
        {posiciones.find(p => p.value === j.posicion)?.label || j.posicion}
      </span>
      <div className="pa-row-stats">
        {isGK ? (
          <><b style={{ color: "#f59e0b" }}>{j.goles_recibidos || 0}</b><small>GR</small><b style={{ color: "#10b981" }}>{j.vaya_invicta || 0}</b><small>VI</small></>
        ) : (
          <><b style={{ color: "#ef4444" }}>{j.goles || 0}</b><small>G</small><b style={{ color: "#3b82f6" }}>{j.asistencias || 0}</b><small>A</small></>
        )}
      </div>
      <span className="pa-row-pj">{j.pj || 0} <small>PJ</small></span>
      <div className="pa-row-actions">
        <button className="pa-bic pa-bic-b" onClick={() => onStats(j)} title="Stats"><Pencil size={12} /></button>
        <button className="pa-bic pa-bic-a" onClick={() => onEdit(j)} title="Editar"><EyeIcon size={12} /></button>
        <button className="pa-bic pa-bic-r" onClick={() => onDelete(j)} title="Eliminar"><Trash2 size={12} /></button>
      </div>
    </div>
  );
});

const PosGroup = memo(function PosGroup({ pos, jugadores, ...handlers }) {
  const cfg = posConfig[pos];
  if (!jugadores?.length) return null;
  return (
    <div className="pa-g">
      <div className="pa-g-head" style={{ borderColor: cfg.border, background: cfg.grad }}>
        <i className="pa-g-dot" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}40` }} />
        <span className="pa-g-lbl" style={{ color: cfg.color }}>{cfg.label}</span>
        <span className="pa-g-cnt" style={{ color: cfg.color, background: `${cfg.color}12` }}>{jugadores.length}</span>
      </div>
      <div className="pa-g-list">
        {jugadores.map(j => <PlayerRow key={j.id} j={j} showTitular {...handlers} />)}
      </div>
    </div>
  );
});

export default function PlantillaAdmin() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
  const [tab, setTab] = useState("plantilla");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [equipoId, setEquipoId] = useState("");
  const [plantilla, setPlantilla] = useState(null);
  const [formacion, setFormacion] = useState("4-4-2");
  const [showModal, setShowModal] = useState(null);
  const [editPlayer, setEditPlayer] = useState(null);
  const [editStats, setEditStats] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre: "", posicion: "delantero", numero_camiseta: "", edad: "", nacionalidad: "", foto: "" });
  const [statsForm, setStatsForm] = useState({});
  const dRef = useRef(null);

  useEffect(() => { if (window.innerWidth > 768) setSidebarOpen(true); }, []);
  useEffect(() => { axios.get(`${API}get_teams.php`).then(r => setEquipos(Array.isArray(r.data) ? r.data : [])).catch(() => {}); }, []);

  const handleSearchChange = useCallback((e) => {
    const v = e.target.value; setSearchInput(v);
    if (dRef.current) clearTimeout(dRef.current);
    dRef.current = setTimeout(() => setSearch(v), 300);
  }, []);
  const clearSearch = useCallback(() => { setSearchInput(""); setSearch(""); }, []);

  const loadPlantilla = useCallback(async (id) => {
    if (!id) { setPlantilla(null); return; }
    setLoading(true);
    try {
      const r = await axios.get(`${API}crud_jugadores.php?equipo_id=${id}`);
      if (r.data.success) { setPlantilla(r.data); if (r.data.equipo?.formacion) setFormacion(r.data.equipo.formacion); }
    } catch { Swal.fire("Error", "No se pudo cargar", "error"); }
    finally { setLoading(false); }
  }, []);

  const handleEquipoChange = useCallback((id) => { setEquipoId(id); setSearchInput(""); setSearch(""); setTab("plantilla"); loadPlantilla(id); }, [loadPlantilla]);

  const toggleTitular = useCallback(async (j) => {
    try { await axios.post(`${API}crud_jugadores.php`, new URLSearchParams({ action: "toggle_titular", id: j.id })); loadPlantilla(equipoId); }
    catch { Swal.fire("Error", "No se pudo cambiar", "error"); }
  }, [equipoId, loadPlantilla]);

  const openCreate = useCallback(() => { setForm({ nombre: "", posicion: "delantero", numero_camiseta: "", edad: "", nacionalidad: "", foto: "" }); setEditPlayer(null); setShowModal("player"); }, []);
  const openEditPlayer = useCallback((j) => { setForm({ nombre: j.nombre, posicion: j.posicion, numero_camiseta: j.numero_camiseta || "", edad: j.edad || "", nacionalidad: j.nacionalidad || "", foto: j.foto || "" }); setEditPlayer(j); setShowModal("player"); }, []);
  const openEditStats = useCallback((j) => {
    const fields = j.posicion === "portero" ? porteroStatFields : statFields;
    const init = { temporada: j.temporada || "2025-2026" };
    fields.forEach(f => { init[f.key] = j[f.key] || 0; });
    setStatsForm(init); setEditStats(j); setShowModal("stats");
  }, []);

  const deletePlayer = useCallback(async (j) => {
    const ok = await Swal.fire({ title: `¿Eliminar a ${j.nombre}?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Eliminar", cancelButtonText: "Cancelar", background: "#1e293b", color: "#fff" });
    if (!ok.isConfirmed) return;
    try {
      const r = await axios.delete(`${API}crud_jugadores.php?id=${j.id}`);
      if (r.data.success) { Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Eliminado", showConfirmButton: false, timer: 1500, background: "#1e293b", color: "#fff" }); loadPlantilla(equipoId); }
    } catch { Swal.fire("Error", "No se pudo eliminar", "error"); }
  }, [equipoId, loadPlantilla]);

  const savePlayer = async () => {
    if (!form.nombre.trim()) { Swal.fire("Error", "Nombre obligatorio", "error"); return; }
    setSaving(true);
    try {
      const p = { action: editPlayer ? "update" : "create", equipo_id: editPlayer ? editPlayer.equipo_id : parseInt(equipoId), ...form, numero_camiseta: form.numero_camiseta ? parseInt(form.numero_camiseta) : null, edad: form.edad ? parseInt(form.edad) : null };
      if (editPlayer) p.id = editPlayer.id;
      const r = await axios.post(`${API}crud_jugadores.php`, p);
      if (r.data.success) { setShowModal(null); Swal.fire({ toast: true, position: "top-end", icon: "success", title: r.data.message, showConfirmButton: false, timer: 1500, background: "#1e293b", color: "#fff" }); loadPlantilla(equipoId); }
    } catch (e) { Swal.fire("Error", e.response?.data?.error || "Error", "error"); }
    finally { setSaving(false); }
  };

  const saveStats = async () => {
    setSaving(true);
    try {
      const r = await axios.post(`${API}crud_jugadores.php`, { action: "update_stats", jugador_id: editStats.id, ...statsForm });
      if (r.data.success) { setShowModal(null); Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Stats actualizadas", showConfirmButton: false, timer: 1500, background: "#1e293b", color: "#fff" }); loadPlantilla(equipoId); }
    } catch (e) { Swal.fire("Error", e.response?.data?.error || "Error", "error"); }
    finally { setSaving(false); }
  };

  const handleFotoUpload = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const fd = new FormData(); fd.append("foto", f);
    try { const r = await axios.post(`${API}upload_jugador_foto.php`, fd); if (r.data.success) setForm(p => ({ ...p, foto: r.data.path })); } catch { Swal.fire("Error", "No se subió", "error"); }
  };

  const saveFormation = useCallback(async () => {
    const { starters } = autoAssign(plantilla.jugadores, formacion);
    setSaving(true);
    try {
      const r = await axios.post(`${API}crud_jugadores.php`, { action: "save_formation", equipo_id: equipoId, formacion, titulares: JSON.stringify(starters.map(s => ({ id: s.id, x: s.posicion_x, y: s.posicion_y }))) });
      if (r.data.success) { Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Formación guardada", showConfirmButton: false, timer: 1500, background: "#1e293b", color: "#fff" }); loadPlantilla(equipoId); }
    } catch { Swal.fire("Error", "No se guardó", "error"); }
    finally { setSaving(false); }
  }, [plantilla, formacion, equipoId, loadPlantilla]);

  const groups = useMemo(() => {
    if (!plantilla?.jugadores) return { portero: [], defensa: [], medio: [], delantero: [] };
    const all = { portero: [], defensa: [], medio: [], delantero: [] };
    plantilla.jugadores.forEach(j => { if (all[j.posicion]) all[j.posicion].push(j); });
    if (!search.trim()) return all;
    const s = search.toLowerCase();
    const out = { portero: [], defensa: [], medio: [], delantero: [] };
    for (const p of Object.keys(all)) out[p] = all[p].filter(j => j.nombre.toLowerCase().includes(s));
    return out;
  }, [plantilla, search]);

  const total = plantilla?.jugadores?.length || 0;
  const filteredCount = useMemo(() => Object.values(groups).reduce((a, b) => a + b.length, 0), [groups]);
  const { starters, subs } = useMemo(() => autoAssign(plantilla?.jugadores || [], formacion), [plantilla, formacion]);

  const handleLogout = () => {
    Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí", cancelButtonText: "No", background: "#1e293b", color: "#fff" })
      .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); window.location.href = "/login"; } });
  };
  const navClick = useCallback(() => { if (window.innerWidth <= 768) setSidebarOpen(false); setDdOpen(false); }, []);
  const handlers = useMemo(() => ({ onStats: openEditStats, onEdit: openEditPlayer, onDelete: deletePlayer, onToggle: toggleTitular }), [openEditStats, openEditPlayer, deletePlayer, toggleTitular]);

  return (
    <div className={`admin-layout${sidebarOpen ? " sidebar-open" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon"><img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="" /></div>
          <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
        </div>
        <nav className="sidebar-nav"><ul>
          {navItems.map((item, i) => {
            if (item.type === "dropdown") {
              const a = item.children.some(c => location.pathname === c.path);
              return (<li key={i}>
                <button className={`nav-item${a ? " active" : ""}`} onClick={() => setDdOpen(!ddOpen)} style={{ width: "100%", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>{item.icon} {item.label}</span>
                  <ChevronDown size={16} style={{ transform: ddOpen ? "rotate(180deg)" : "", transition: "transform 0.2s" }} />
                </button>
                <ul className={`teams-dropdown${ddOpen ? " dropdown-visible" : ""}`}>
                  {item.children.map(c => <li key={c.path}><Link to={c.path} className={`nav-item nav-subitem${location.pathname === c.path ? " active" : ""}`} onClick={navClick}>{c.label}</Link></li>)}
                </ul>
              </li>);
            }
            return <li key={item.path}><Link to={item.path} className={`nav-item${location.pathname === item.path ? " active" : ""}`} onClick={navClick}>{item.icon} {item.label}</Link></li>;
          })}
        </ul></nav>
        <div className="sidebar-footer"><button className="nav-item btn-logout-sidebar" onClick={handleLogout}><LogOut size={20} className="nav-icon" /> Cerrar sesión</button></div>
      </aside>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
          <span className="top-bar-title">Gestión de Plantillas</span>
        </header>

        <div className="pa-page">
          {/* Header centrado */}
          <div className="pa-hero">
            <h1 className="admin-title">Plantillas</h1>
            <p>Gestiona jugadores, estadísticas y formaciones por equipo</p>
          </div>

          {/* Controles */}
          <div className="pa-toolbar">
            <TeamDropdown equipos={equipos} value={equipoId} onChange={handleEquipoChange} />
            {plantilla && <SearchBox value={searchInput} onChange={handleSearchChange} onClear={clearSearch} />}
            {plantilla && <button className="pa-btn-add" onClick={openCreate}><Plus size={15} /> Agregar</button>}
          </div>

          {/* Info equipo — card centrada */}
          {plantilla && (
            <div className="pa-team-card">
              <div className="pa-team-logo-wrap">
                <div className="pa-team-logo-ring">
                  <img src={`${API}${plantilla.equipo.logo}`} alt="" />
                </div>
              </div>
              <div className="pa-team-data">
                <h3>{plantilla.equipo.nombre}</h3>
                <p>{[plantilla.equipo.ciudad, plantilla.equipo.estadio].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="pa-team-metrics">
                <div className="pa-metric">
                  <strong>{total}</strong>
                  <span>Jugadores</span>
                </div>
                <div className="pa-metric-divider" />
                <div className="pa-metric">
                  <strong style={{ color: "#10b981" }}>{plantilla.jugadores.filter(j => j.es_titular).length}</strong>
                  <span>Titulares</span>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {plantilla && total > 0 && (
            <div className="pa-tabs">
              <button className={`pa-tab${tab === "plantilla" ? " active" : ""}`} onClick={() => setTab("plantilla")}>
                <Users size={14} /> Plantilla
              </button>
              <button className={`pa-tab${tab === "formacion" ? " active" : ""}`} onClick={() => setTab("formacion")}>
                <Target size={14} /> Formación
              </button>
            </div>
          )}

          {loading && <div className="pa-center"><div className="pa-spinner" /><p style={{ color: "#64748b", marginTop: "0.75rem" }}>Cargando...</p></div>}

          {!loading && !plantilla && (
            <div className="pa-center">
              <div className="pa-empty-icon"><Users size={28} /></div>
              <p style={{ fontWeight: 700, color: "#e2e8f0" }}>Selecciona un equipo</p>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Elige del menú para ver su plantilla</p>
            </div>
          )}

          {/* TAB PLANTILLA */}
          {!loading && plantilla && tab === "plantilla" && (
            total === 0 ? (
              <div className="pa-empty-box">
                <p style={{ color: "#64748b" }}>Sin jugadores registrados</p>
                <button className="pa-btn-add" onClick={openCreate}><Plus size={15} /> Agregar primero</button>
              </div>
            ) : (
              <div className="pa-list-wrap">
                {searchInput.trim() && (
                  <div className="pa-filter-info">
                    {filteredCount > 0 ? `${filteredCount} resultado${filteredCount !== 1 ? "s" : ""} para "${searchInput}"` : `Sin resultados para "${searchInput}"`}
                  </div>
                )}
                {Object.keys(posConfig).map(pos => <PosGroup key={pos} pos={pos} jugadores={groups[pos]} {...handlers} />)}
                <div className="pa-legend">
                  {[{ c: "#f59e0b", i: <Star size={11} />, t: "Titular" }, { c: "#3b82f6", i: <Pencil size={11} />, t: "Stats" }, { c: "#f59e0b", i: <EyeIcon size={11} />, t: "Editar" }, { c: "#ef4444", i: <Trash2 size={11} />, t: "Eliminar" }].map((l, i) => (
                    <span key={i}><i style={{ color: l.c }}>{l.i}</i> {l.t}</span>
                  ))}
                </div>
              </div>
            )
          )}

          {/* TAB FORMACIÓN */}
          {!loading && plantilla && tab === "formacion" && (
            <div className="pa-fm-section">
              <div className="pa-fm-bar">
                <span className="pa-fm-label">FORMACIÓN</span>
                <div className="pa-fm-btns">
                  {Object.keys(formationData).map(f => (
                    <button key={f} className={`pa-fm-btn${formacion === f ? " active" : ""}`} onClick={() => setFormacion(f)}>{f}</button>
                  ))}
                </div>
                <button className="pa-btn-save" onClick={saveFormation} disabled={saving}>
                  <Save size={13} /> {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>

              <div className="pa-pitch-wrap">
                <div className="pa-pitch">
                  <svg className="pa-pitch-svg" viewBox="0 0 680 1050" preserveAspectRatio="none">
                    <rect x="1" y="1" width="678" height="1048" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" rx="2" />
                    <line x1="0" y1="525" x2="680" y2="525" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <circle cx="340" cy="525" r="91" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <circle cx="340" cy="525" r="4" fill="rgba(255,255,255,0.15)" />
                    <rect x="136" y="1" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <rect x="224" y="1" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <circle cx="340" cy="110" r="3" fill="rgba(255,255,255,0.15)" />
                    <path d="M 248 165 A 91 91 0 0 0 432 165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <rect x="136" y="884" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <rect x="224" y="994" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <circle cx="340" cy="940" r="3" fill="rgba(255,255,255,0.15)" />
                    <path d="M 248 885 A 91 91 0 0 1 432 885" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <path d="M 1 20 A 20 20 0 0 0 21 1" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <path d="M 659 1 A 20 20 0 0 0 679 20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <path d="M 1 1030 A 20 20 0 0 1 21 1049" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                    <path d="M 659 1049 A 20 20 0 0 1 679 1030" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  </svg>
                  {starters.map((s, idx) => {
                    const cfg = posConfig[s.posicion] || posConfig.delantero;
                    return (
                      <div key={s.id || idx} className="pa-pp" style={{ left: `${s.posicion_x}%`, top: `${s.posicion_y}%` }}>
                        <div className="pa-pp-dot" style={{ background: cfg.color, boxShadow: `0 0 12px ${cfg.color}50, inset 0 -2px 6px rgba(0,0,0,0.3)` }}>
                          {s.foto ? <img src={`${API}${s.foto}`} alt="" /> : <span>{s.numero_camiseta || "–"}</span>}
                        </div>
                        <span className="pa-pp-name">{s.nombre.split(" ").pop()}</span>
                        <span className="pa-pp-role">{s.slot_role}</span>
                      </div>
                    );
                  })}
                  {starters.length < 11 && (
                    <div className="pa-pitch-empty">
                      <p>Faltan jugadores</p>
                      <span>{starters.length}/11 titulares</span>
                    </div>
                  )}
                </div>
              </div>

              {subs.length > 0 && (
                <div className="pa-subs-card">
                  <h4 className="pa-subs-title"><ArrowRightLeft size={13} /> Suplentes <span>{subs.length}</span></h4>
                  <div className="pa-subs-grid">
                    {subs.map(s => {
                      const cfg = posConfig[s.posicion] || posConfig.delantero;
                      return (
                        <div key={s.id} className="pa-sub-item" style={{ borderLeftColor: cfg.color }}>
                          <div className="pa-sub-photo">
                            {s.foto ? <img src={`${API}${s.foto}`} alt="" /> : <User size={13} style={{ color: "rgba(255,255,255,0.15)" }} />}
                          </div>
                          <div className="pa-sub-info">
                            <span className="pa-sub-name">{s.nombre}</span>
                            <span className="pa-sub-meta">#{s.numero_camiseta || "–"} {posiciones.find(p => p.value === s.posicion)?.label || ""}</span>
                          </div>
                          <button className="pa-sub-prom" onClick={() => toggleTitular(s)} title="Hacer titular"><Star size={12} /></button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {showModal === "player" && (
        <div className="pa-modal-bg" onClick={() => setShowModal(null)}>
          <div className="pa-modal" onClick={e => e.stopPropagation()}>
            <div className="pa-modal-head"><h3>{editPlayer ? "Editar Jugador" : "Nuevo Jugador"}</h3><button onClick={() => setShowModal(null)} className="pa-modal-x"><X size={18} /></button></div>
            <div className="pa-modal-body">
              <div className="pa-foto-section">
                <div className="pa-foto-circle">{form.foto ? <img src={`${API}${form.foto}`} alt="" /> : <User size={22} style={{ color: "rgba(255,255,255,0.1)" }} />}</div>
                <label className="pa-upload-label"><Plus size={12} /> Subir foto<input type="file" accept="image/*" onChange={handleFotoUpload} hidden /></label>
              </div>
              <label className="pa-flbl">Nombre completo *</label>
              <input className="pa-input" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Juan Pérez" />
              <div className="pa-duo">
                <div><label className="pa-flbl">Posición</label><div className="pa-sel-w"><select className="pa-input pa-sel" value={form.posicion} onChange={e => setForm({ ...form, posicion: e.target.value })}>{posiciones.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select><ChevronDown size={13} className="pa-sel-a" /></div></div>
                <div><label className="pa-flbl">Dorsal</label><input className="pa-input" type="number" value={form.numero_camiseta} onChange={e => setForm({ ...form, numero_camiseta: e.target.value })} placeholder="10" min="1" max="99" /></div>
              </div>
              <div className="pa-duo">
                <div><label className="pa-flbl">Edad</label><input className="pa-input" type="number" value={form.edad} onChange={e => setForm({ ...form, edad: e.target.value })} placeholder="25" min="15" max="50" /></div>
                <div><label className="pa-flbl">Nacionalidad</label><input className="pa-input" value={form.nacionalidad} onChange={e => setForm({ ...form, nacionalidad: e.target.value })} placeholder="Salvadoreño" /></div>
              </div>
            </div>
            <div className="pa-modal-foot">
              <button className="pa-btn-cancel" onClick={() => setShowModal(null)}>Cancelar</button>
              <button className="pa-btn-save" onClick={savePlayer} disabled={saving}><Save size={13} /> {saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}

      {showModal === "stats" && editStats && (
        <div className="pa-modal-bg" onClick={() => setShowModal(null)}>
          <div className="pa-modal" onClick={e => e.stopPropagation()}>
            <div className="pa-modal-head">
              <div><h3>Estadísticas</h3><p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#64748b" }}>{editStats.nombre} — Temp. 2025-2026</p></div>
              <button onClick={() => setShowModal(null)} className="pa-modal-x"><X size={18} /></button>
            </div>
            <div className="pa-stats-grid">
              {(editStats.posicion === "portero" ? porteroStatFields : statFields).map(f => (
                <div key={f.key}><label className="pa-flbl">{f.label}</label><input className="pa-stat-in" type="number" min="0" value={statsForm[f.key] || 0} onChange={e => setStatsForm({ ...statsForm, [f.key]: parseInt(e.target.value) || 0 })} /></div>
              ))}
            </div>
            <div className="pa-modal-foot">
              <button className="pa-btn-cancel" onClick={() => setShowModal(null)}>Cancelar</button>
              <button className="pa-btn-save pa-btn-save-g" onClick={saveStats} disabled={saving}><Save size={13} /> {saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
@keyframes pa-spin{to{transform:rotate(360deg)}}
@keyframes pa-in{from{opacity:0;transform:translateY(6px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}
.sidebar-backdrop{display:none}
@media(max-width:768px){.sidebar-backdrop{display:block;position:fixed;inset:0;z-index:49;background:rgba(0,0,0,.55)}}
.teams-dropdown{list-style:none;padding:0;margin:0;max-height:0;overflow:hidden;transition:max-height .25s}
.teams-dropdown.dropdown-visible{max-height:200px}
.nav-subitem{padding-left:52px!important;font-size:13px!important;opacity:.65}
.nav-subitem.active{opacity:1}
.top-bar-title{font-size:.95rem;font-weight:700;color:#e2e8f0}
button.nav-item{background:none;border:none;color:var(--text-muted,#94a3b8);font-family:inherit;width:100%;text-align:left}

/* ── Page ── */
.pa-page{padding:2rem 1.5rem;max-width:960px;margin:0 auto}

/* ── Hero header ── */
.pa-hero{text-align:center;margin-bottom:2rem}
.pa-hero p{margin:6px 0 0;font-size:.82rem;color:#64748b;letter-spacing:.3px}

/* ── Inputs ── */
.pa-input{width:100%;padding:.55rem .85rem;border-radius:10px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#f1f5f9;font-size:.84rem;outline:none;box-sizing:border-box;transition:all .2s}
.pa-input:focus{border-color:rgba(124,58,237,.4);background:rgba(255,255,255,.05)}
.pa-input option{background:#1e293b;color:#f1f5f9}
.pa-sel{appearance:none;cursor:pointer;padding-right:2.2rem}
.pa-sel-w{position:relative}
.pa-sel-a{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#64748b;pointer-events:none}

/* ── Team dropdown ── */
.pa-td{position:relative;flex:1;min-width:240px;z-index:20}
.pa-td-btn{width:100%;display:flex;align-items:center;gap:.6rem;padding:.55rem .9rem;border-radius:10px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#f1f5f9;font-size:.84rem;cursor:pointer;transition:all .15s;text-align:left}
.pa-td-btn:hover{border-color:rgba(255,255,255,.12);background:rgba(255,255,255,.05)}
.pa-td-logo{width:26px;height:26px;border-radius:50%;object-fit:contain;flex-shrink:0}
.pa-td-logo-ph{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;color:#64748b;flex-shrink:0}
.pa-td-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pa-td-arrow{color:#64748b;transition:transform .2s;flex-shrink:0}
.pa-td-list{position:absolute;top:calc(100% + 6px);left:0;right:0;background:#1e293b;border:1px solid rgba(255,255,255,.08);border-radius:12px;max-height:280px;overflow-y:auto;box-shadow:0 16px 40px rgba(0,0,0,.45);z-index:30;animation:pa-in .15s ease-out}
.pa-td-item{width:100%;display:flex;align-items:center;gap:.55rem;padding:.5rem .8rem;border:none;background:none;color:#cbd5e1;font-size:.82rem;cursor:pointer;transition:all .1s;text-align:left}
.pa-td-item:hover{background:rgba(255,255,255,.05)}
.pa-td-item.active{background:rgba(124,58,237,.1);color:#c4b5fd}
.pa-td-item .pa-td-logo{width:22px;height:22px}

/* ── Search ── */
.pa-sw{position:relative;flex:.5;min-width:180px}
.pa-sw-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#64748b;pointer-events:none}
.pa-sw-input{padding-left:2.2rem!important;padding-right:1.6rem!important}
.pa-sw-x{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.06);border:none;color:#64748b;width:18px;height:18px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.pa-sw-x:hover{background:rgba(255,255,255,.12);color:#f1f5f9}

/* ── Toolbar ── */
.pa-toolbar{display:flex;gap:.6rem;margin-bottom:1.5rem;flex-wrap:wrap;align-items:center;justify-content:center}
.pa-btn-add{padding:.55rem 1.2rem;border-radius:10px;border:none;background:linear-gradient(135deg,#1e40af,#7c3aed);color:#fff;font-weight:700;font-size:.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:.35rem;transition:all .2s;white-space:nowrap;flex-shrink:0}
.pa-btn-add:hover{box-shadow:0 4px 16px rgba(124,58,237,.35);transform:translateY(-1px)}

/* ── Team card ── */
.pa-team-card{display:flex;align-items:center;gap:1.2rem;padding:1.2rem 1.5rem;border-radius:16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);margin-bottom:1.5rem;max-width:560px;margin-left:auto;margin-right:auto}
.pa-team-logo-wrap{flex-shrink:0}
.pa-team-logo-ring{width:52px;height:52px;border-radius:50%;padding:5px;background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.08)}
.pa-team-logo-ring img{width:100%;height:100%;object-fit:contain}
.pa-team-data{flex:1;min-width:0;text-align:left}
.pa-team-data h3{margin:0;font-size:1.05rem;font-weight:800;color:#f1f5f9}
.pa-team-data p{margin:3px 0 0;font-size:.75rem;color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pa-team-metrics{display:flex;align-items:center;gap:1rem;flex-shrink:0}
.pa-metric{text-align:center}
.pa-metric strong{display:block;font-size:1.5rem;font-weight:900;font-family:monospace;line-height:1}
.pa-metric span{font-size:.58rem;color:#64748b;text-transform:uppercase;letter-spacing:1px}
.pa-metric-divider{width:1px;height:32px;background:rgba(255,255,255,.06);border-radius:1px}

/* ── Tabs ── */
.pa-tabs{display:flex;gap:0;margin-bottom:1.5rem;border-bottom:1px solid rgba(255,255,255,.05);max-width:320px;margin-left:auto;margin-right:auto}
.pa-tab{flex:1;padding:.6rem 0;border:none;background:none;color:#64748b;font-weight:600;font-size:.82rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.4rem;border-bottom:2px solid transparent;transition:all .15s;margin-bottom:-1px}
.pa-tab:hover{color:#94a3b8}
.pa-tab.active{color:#c4b5fd;border-bottom-color:#7c3aed}

/* ── List wrap ── */
.pa-list-wrap{max-width:720px;margin:0 auto}

/* ── Row ── */
.pa-row{display:grid;grid-template-columns:30px 36px 1fr 78px auto auto auto;gap:.5rem;align-items:center;padding:.5rem .7rem;border-radius:10px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.03);transition:all .15s}
.pa-row.pa-row-tit{background:rgba(245,158,11,.03);border-color:rgba(245,158,11,.08)}
.pa-row:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.06)}
.pa-toggle{width:26px;height:26px;border-radius:6px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:#3f3f46;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s}
.pa-toggle:hover{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.15)}
.pa-toggle.active{background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.25);color:#f59e0b}
.pa-row-num{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;font-family:monospace}
.pa-row-photo{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.04);overflow:hidden;display:flex;align-items:center;justify-content:center}
.pa-row-photo img{width:100%;height:100%;object-fit:cover}
.pa-row-info{min-width:0;display:flex;flex-direction:column}
.pa-row-name{font-size:.82rem;font-weight:700;color:#f1f5f9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pa-row-meta{font-size:.64rem;color:#64748b;margin-top:1px}
.pa-row-pos{font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:5px;text-align:center;border:1px solid;letter-spacing:.3px}
.pa-row-stats{display:flex;gap:.4rem;font-size:.72rem;align-items:center}
.pa-row-stats small{color:#3f3f46;font-size:.58rem}
.pa-row-pj{font-size:.72rem;color:#64748b;font-weight:600;text-align:center}
.pa-row-pj small{font-weight:400}
.pa-row-actions{display:flex;gap:.2rem}
.pa-bic{width:26px;height:26px;border-radius:6px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .12s}
.pa-bic-b{background:rgba(59,130,246,.08);color:#3b82f6}.pa-bic-b:hover{background:rgba(59,130,246,.18)}
.pa-bic-a{background:rgba(245,158,11,.08);color:#f59e0b}.pa-bic-a:hover{background:rgba(245,158,11,.18)}
.pa-bic-r{background:rgba(239,68,68,.08);color:#ef4444}.pa-bic-r:hover{background:rgba(239,68,68,.18)}

/* ── Groups ── */
.pa-g{margin-bottom:1.4rem}
.pa-g-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;padding:.45rem .7rem;border-bottom:2px solid transparent;border-radius:8px 8px 0 0}
.pa-g-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.pa-g-lbl{font-size:.62rem;font-weight:800;letter-spacing:2.5px;text-transform:uppercase}
.pa-g-cnt{font-size:.58rem;font-weight:700;padding:1px 7px;border-radius:4px;margin-left:auto}
.pa-g-list{display:flex;flex-direction:column;gap:.25rem}

/* ── Legend ── */
.pa-legend{display:flex;gap:1.2rem;justify-content:center;margin-top:.8rem;padding:.45rem;border-radius:8px;background:rgba(255,255,255,.015);font-size:.68rem;color:#64748b}

/* ── Empty ── */
.pa-center{text-align:center;padding:3.5rem 1rem}
.pa-empty-icon{width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.02);border:2px dashed rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem;color:rgba(255,255,255,.1)}
.pa-empty-box{text-align:center;padding:2.5rem 1rem;background:rgba(255,255,255,.015);border-radius:14px;border:1px dashed rgba(255,255,255,.06);max-width:400px;margin:0 auto}
.pa-empty-box p{color:#64748b;margin:0 0 1rem}
.pa-spinner{width:32px;height:32px;border-radius:50%;border:3px solid rgba(124,58,237,.15);border-top-color:#7c3aed;animation:pa-spin .7s linear infinite;margin:0 auto}
.pa-filter-info{font-size:.72rem;color:#64748b;margin-bottom:.5rem;padding:.35rem .6rem;background:rgba(255,255,255,.02);border-radius:7px;border-left:3px solid #7c3aed;max-width:400px;margin-left:auto;margin-right:auto}

/* ═══ FORMACIÓN ═══ */
.pa-fm-section{display:flex;flex-direction:column;gap:1.2rem;max-width:640px;margin:0 auto}
.pa-fm-bar{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;justify-content:center}
.pa-fm-label{font-size:.72rem;color:#64748b;font-weight:700;letter-spacing:1.5px}
.pa-fm-btns{display:flex;gap:.3rem;flex-wrap:wrap}
.pa-fm-btn{padding:.35rem .7rem;border-radius:8px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:#64748b;font-weight:700;font-size:.73rem;cursor:pointer;transition:all .15s;font-family:monospace;letter-spacing:.5px}
.pa-fm-btn:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.1)}
.pa-fm-btn.active{background:rgba(124,58,237,.12);border-color:rgba(124,58,237,.3);color:#c4b5fd}

/* ── Cancha ── */
.pa-pitch-wrap{width:100%;max-width:420px;margin:0 auto}
.pa-pitch{position:relative;width:100%;aspect-ratio:68/105;border-radius:12px;overflow:hidden;background:repeating-linear-gradient(0deg,#091f12 0px,#091f12 52px,#0c2815 52px,#0c2815 105px);box-shadow:0 12px 40px rgba(0,0,0,.35),inset 0 0 80px rgba(0,0,0,.2)}
.pa-pitch-svg{position:absolute;inset:0;width:100%;height:100%}
.pa-pitch-empty{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;opacity:.25}
.pa-pitch-empty p{color:#fff;font-weight:700;font-size:.85rem;margin:0}
.pa-pitch-empty span{color:#94a3b8;font-size:.72rem}

/* ── Player en cancha ── */
.pa-pp{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:2px;z-index:2;transition:left .45s cubic-bezier(.4,0,.2,1),top .45s cubic-bezier(.4,0,.2,1)}
.pa-pp-dot{width:34px;height:34px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,.2);transition:transform .2s;font-size:.62rem;font-weight:800;color:#fff}
.pa-pp:hover .pa-pp-dot{transform:scale(1.18)}
.pa-pp-dot img{width:100%;height:100%;object-fit:cover}
.pa-pp-name{font-size:.55rem;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.9);white-space:nowrap;max-width:65px;overflow:hidden;text-overflow:ellipsis;text-align:center}
.pa-pp-role{font-size:.45rem;color:rgba(255,255,255,.4);font-weight:600;text-transform:uppercase;letter-spacing:.5px}

/* ── Suplentes ── */
.pa-subs-card{background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.04);border-radius:14px;padding:1rem 1.1rem}
.pa-subs-title{margin:0 0 .65rem;font-size:.78rem;font-weight:700;color:#94a3b8;display:flex;align-items:center;gap:.4rem}
.pa-subs-title span{font-size:.68rem;font-weight:800;color:#64748b;background:rgba(255,255,255,.04);padding:1px 8px;border-radius:4px;margin-left:.3rem}
.pa-subs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:.35rem}
.pa-sub-item{display:flex;align-items:center;gap:.5rem;padding:.4rem .55rem;border-radius:8px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.03);border-left:3px solid;transition:all .15s}
.pa-sub-item:hover{background:rgba(255,255,255,.035)}
.pa-sub-photo{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.04);overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pa-sub-photo img{width:100%;height:100%;object-fit:cover}
.pa-sub-info{flex:1;min-width:0;display:flex;flex-direction:column}
.pa-sub-name{font-size:.76rem;font-weight:600;color:#e2e8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pa-sub-meta{font-size:.6rem;color:#64748b}
.pa-sub-prom{width:24px;height:24px;border-radius:6px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:#3f3f46;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0}
.pa-sub-prom:hover{background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.2);color:#f59e0b}

/* ── Modal ── */
.pa-modal-bg{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.65);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:1rem}
.pa-modal{background:#1e293b;border-radius:16px;border:1px solid rgba(255,255,255,.06);width:100%;max-width:430px;max-height:90vh;overflow-y:auto;animation:pa-in .18s ease-out;box-shadow:0 25px 60px rgba(0,0,0,.4)}
.pa-modal-head{display:flex;justify-content:space-between;align-items:center;padding:.9rem 1.2rem;border-bottom:1px solid rgba(255,255,255,.04)}
.pa-modal-head h3{margin:0;font-size:.95rem;font-weight:800;color:#f1f5f9}
.pa-modal-x{background:none;border:none;color:#64748b;cursor:pointer;padding:4px;border-radius:6px;transition:all .15s}
.pa-modal-x:hover{background:rgba(255,255,255,.04);color:#f1f5f9}
.pa-modal-body{padding:1.1rem 1.2rem;display:flex;flex-direction:column;gap:.75rem}
.pa-modal-foot{padding:.8rem 1.2rem;border-top:1px solid rgba(255,255,255,.04);display:flex;justify-content:flex-end;gap:.5rem}
.pa-foto-section{display:flex;align-items:center;gap:.85rem}
.pa-foto-circle{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.03);border:2px dashed rgba(255,255,255,.08);overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pa-foto-circle img{width:100%;height:100%;object-fit:cover}
.pa-upload-label{display:inline-flex;align-items:center;gap:.3rem;padding:.4rem .7rem;border-radius:8px;cursor:pointer;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:#94a3b8;font-size:.74rem;font-weight:600;transition:all .15s}
.pa-upload-label:hover{background:rgba(255,255,255,.06)}
.pa-flbl{display:block;font-size:.68rem;font-weight:700;color:#64748b;margin-bottom:.2rem;text-transform:uppercase;letter-spacing:.5px}
.pa-duo{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.pa-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;padding:1.1rem 1.2rem}
.pa-stat-in{width:100%;padding:.5rem .6rem;border-radius:8px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.03);color:#f1f5f9;font-size:.84rem;outline:none;font-weight:700;text-align:center;font-family:monospace;box-sizing:border-box;transition:all .2s}
.pa-stat-in:focus{border-color:rgba(16,185,129,.35);background:rgba(255,255,255,.05)}
.pa-btn-cancel{padding:.5rem 1rem;border-radius:8px;border:1px solid rgba(255,255,255,.06);background:transparent;color:#64748b;cursor:pointer;font-weight:600;font-size:.8rem;transition:all .15s}
.pa-btn-cancel:hover{background:rgba(255,255,255,.03);color:#94a3b8}
.pa-btn-save{padding:.5rem 1.1rem;border-radius:8px;border:none;background:linear-gradient(135deg,#1e40af,#7c3aed);color:#fff;cursor:pointer;font-weight:700;font-size:.8rem;display:inline-flex;align-items:center;gap:.3rem;transition:all .2s}
.pa-btn-save:hover{box-shadow:0 3px 12px rgba(124,58,237,.3)}
.pa-btn-save-g{background:linear-gradient(135deg,#10b981,#059669)}
.pa-btn-save-g:hover{box-shadow:0 3px 12px rgba(16,185,129,.3)}
.pa-btn-save:disabled{opacity:.4;cursor:not-allowed}

@media(min-width:769px){.admin-layout.sidebar-open .sidebar{transform:translateX(0)!important}}
@media(max-width:768px){
  .admin-layout .sidebar{position:fixed!important;z-index:50!important;top:0!important;left:0!important;height:100%!important;width:260px!important;transform:translateX(-100%);transition:transform .3s!important}
  .admin-layout.sidebar-open .sidebar{transform:translateX(0)!important;box-shadow:4px 0 20px rgba(0,0,0,.4)}
  .admin-layout .main-content{margin-left:0!important;width:100%!important}
  .pa-page{padding:1rem}
  .pa-row{grid-template-columns:26px 30px 1fr auto;gap:.3rem;padding:.4rem .5rem}
  .pa-toggle,.pa-row-pos,.pa-row-stats,.pa-row-pj{display:none!important}
  .pa-bic{width:24px;height:24px}.pa-bic svg{width:11px;height:11px}
  .pa-toolbar{flex-direction:column;align-items:stretch}
  .pa-sw{min-width:0;flex:1}
  .pa-team-card{flex-direction:column;text-align:center;padding:1rem;gap:.6rem}
  .pa-team-data{text-align:center}
  .pa-team-metrics{justify-content:center}
  .pa-metric-divider{display:none}
  .pa-duo{grid-template-columns:1fr}
  .pa-subs-grid{grid-template-columns:1fr}
  .pa-pitch-wrap{max-width:300px}
  .pa-pp-dot{width:28px;height:28px;font-size:.55rem}
  .pa-pp-name{font-size:.48rem}
  .pa-fm-bar{flex-direction:column;align-items:stretch}
  .pa-fm-btns{justify-content:center}
}
      `}</style>
    </div>
  );
}