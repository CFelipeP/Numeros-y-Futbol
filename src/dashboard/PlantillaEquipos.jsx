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

const DIVISIONES = [
  { key: "primera", label: "Primera", icon: "🔴" },
  { key: "segunda", label: "Segunda", icon: "🟢" },
  { key: "tercera", label: "Tercera", icon: "🟡" },
];

const getEndpoints = (div) => {
  const s = div === "segunda" ? "_segunda" : div === "tercera" ? "_tercera" : "";
  return {
    teams: API + "get_teams" + s + ".php",
    crud: API + "crud_jugadores" + s + ".php",
    upload: API + "upload_jugador_foto" + s + ".php",
  };
};

const posiciones = [
  { value: "portero", label: "Portero", cat: "portero", color: "#f59e0b", abbr: "POR" },
  { value: "lateral_izquierdo", label: "Lat. Izquierdo", cat: "defensa", color: "#3b82f6", abbr: "LI" },
  { value: "lateral_derecho", label: "Lat. Derecho", cat: "defensa", color: "#3b82f6", abbr: "LD" },
  { value: "central", label: "Central", cat: "defensa", color: "#3b82f6", abbr: "DFC" },
  { value: "medio_defensivo", label: "Medio Defensivo", cat: "medio", color: "#10b981", abbr: "MCD" },
  { value: "medio_central", label: "Medio Central", cat: "medio", color: "#10b981", abbr: "MC" },
  { value: "medio_ofensivo", label: "Medio Ofensivo", cat: "medio", color: "#059669", abbr: "MCO" },
  { value: "extremo_izquierdo", label: "Ext. Izquierdo", cat: "medio", color: "#6ee7b7", abbr: "EI" },
  { value: "extremo_derecho", label: "Ext. Derecho", cat: "medio", color: "#6ee7b7", abbr: "ED" },
  { value: "centrodelantero", label: "Centrodelantero", cat: "delantero", color: "#ef4444", abbr: "DC" },
  { value: "segundo_delantero", label: "2do Delantero", cat: "delantero", color: "#f87171", abbr: "SD" },
];

const posGroups = [
  { label: "Portero", items: posiciones.filter(p => p.cat === "portero") },
  { label: "Defensas", items: posiciones.filter(p => p.cat === "defensa") },
  { label: "Mediocampistas", items: posiciones.filter(p => p.cat === "medio") },
  { label: "Delanteros", items: posiciones.filter(p => p.cat === "delantero") },
];

const catCfg = {
  portero: { color: "#f59e0b", label: "PORTEROS" },
  defensa: { color: "#3b82f6", label: "DEFENSAS" },
  medio: { color: "#10b981", label: "MEDIOCAMPISTAS" },
  delantero: { color: "#ef4444", label: "DELANTEROS" },
};

const posCompat = {
  lateral_izquierdo: ["lateral_izquierdo", "lateral_derecho"],
  lateral_derecho: ["lateral_derecho", "lateral_izquierdo"],
  medio_defensivo: ["medio_defensivo", "medio_central"],
  medio_central: ["medio_central", "medio_defensivo", "medio_ofensivo"],
  medio_ofensivo: ["medio_ofensivo", "medio_central"],
  extremo_izquierdo: ["extremo_izquierdo", "extremo_derecho"],
  extremo_derecho: ["extremo_derecho", "extremo_izquierdo"],
  centrodelantero: ["centrodelantero", "segundo_delantero"],
  segundo_delantero: ["segundo_delantero", "centrodelantero"],
};

function getPosInfo(v) {
  const p = posiciones.find(x => x.value === v);
  if (p) return p;
  const fb = { portero: "portero", defensa: "defensa", medio: "medio", delantero: "delantero" };
  const cat = fb[v];
  if (cat) return { label: v.charAt(0).toUpperCase() + v.slice(1), cat, color: catCfg[cat].color, abbr: v.substring(0, 2).toUpperCase() };
  return { label: v || "?", cat: "delantero", color: "#64748b", abbr: "??" };
}

const statFields = [
  { key: "pj", label: "PJ" }, { key: "goles", label: "Gol" }, { key: "asistencias", label: "Asis" },
  { key: "goles_penal", label: "Pen" }, { key: "goles_cabeza", label: "Cab" }, { key: "goles_tiro_libre", label: "TL" },
  { key: "tarjetas_amarillas", label: "Ama" }, { key: "tarjetas_rojas", label: "Roj" }, { key: "minutos_jugados", label: "Min" },
];
const gkStatFields = [
  { key: "pj", label: "PJ" }, { key: "goles_recibidos", label: "G.R" }, { key: "vaya_invicta", label: "V.I" },
  { key: "tarjetas_amarillas", label: "Ama" }, { key: "tarjetas_rojas", label: "Roj" }, { key: "minutos_jugados", label: "Min" },
];

const formations = {
  "4-4-2": [
    { sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 },
    { sp: "central", sc: "defensa", x: 36, y: 74 }, { sp: "central", sc: "defensa", x: 64, y: 74 },
    { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 }, { sp: "extremo_izquierdo", sc: "medio", x: 18, y: 48 },
    { sp: "medio_central", sc: "medio", x: 40, y: 46 }, { sp: "medio_central", sc: "medio", x: 60, y: 46 },
    { sp: "extremo_derecho", sc: "medio", x: 82, y: 48 }, { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 },
    { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 },
  ],
  "4-3-3": [
    { sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 },
    { sp: "central", sc: "defensa", x: 36, y: 74 }, { sp: "central", sc: "defensa", x: 64, y: 74 },
    { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 }, { sp: "medio_defensivo", sc: "medio", x: 28, y: 48 },
    { sp: "medio_central", sc: "medio", x: 50, y: 44 }, { sp: "medio_defensivo", sc: "medio", x: 72, y: 48 },
    { sp: "extremo_izquierdo", sc: "medio", x: 18, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 },
    { sp: "extremo_derecho", sc: "medio", x: 82, y: 22 },
  ],
  "3-5-2": [
    { sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "central", sc: "defensa", x: 25, y: 74 },
    { sp: "central", sc: "defensa", x: 50, y: 76 }, { sp: "central", sc: "defensa", x: 75, y: 74 },
    { sp: "lateral_izquierdo", sc: "defensa", x: 10, y: 50 }, { sp: "medio_central", sc: "medio", x: 30, y: 48 },
    { sp: "medio_central", sc: "medio", x: 50, y: 44 }, { sp: "medio_central", sc: "medio", x: 70, y: 48 },
    { sp: "lateral_derecho", sc: "defensa", x: 90, y: 50 }, { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 },
    { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 },
  ],
  "4-2-3-1": [
    { sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 },
    { sp: "central", sc: "defensa", x: 36, y: 74 }, { sp: "central", sc: "defensa", x: 64, y: 74 },
    { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 }, { sp: "medio_defensivo", sc: "medio", x: 38, y: 56 },
    { sp: "medio_defensivo", sc: "medio", x: 62, y: 56 }, { sp: "extremo_izquierdo", sc: "medio", x: 20, y: 38 },
    { sp: "medio_ofensivo", sc: "medio", x: 50, y: 34 }, { sp: "extremo_derecho", sc: "medio", x: 80, y: 38 },
    { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 },
  ],
  "5-3-2": [
    { sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "lateral_izquierdo", sc: "defensa", x: 8, y: 66 },
    { sp: "central", sc: "defensa", x: 28, y: 74 }, { sp: "central", sc: "defensa", x: 50, y: 76 },
    { sp: "central", sc: "defensa", x: 72, y: 74 }, { sp: "lateral_derecho", sc: "defensa", x: 92, y: 66 },
    { sp: "medio_central", sc: "medio", x: 28, y: 48 }, { sp: "medio_central", sc: "medio", x: 50, y: 44 },
    { sp: "medio_central", sc: "medio", x: 72, y: 48 }, { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 },
    { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 },
  ],
  "3-4-3": [
    { sp: "portero", sc: "portero", x: 50, y: 90 }, { sp: "central", sc: "defensa", x: 25, y: 74 },
    { sp: "central", sc: "defensa", x: 50, y: 76 }, { sp: "central", sc: "defensa", x: 75, y: 74 },
    { sp: "extremo_izquierdo", sc: "medio", x: 12, y: 50 }, { sp: "medio_central", sc: "medio", x: 38, y: 48 },
    { sp: "medio_central", sc: "medio", x: 62, y: 48 }, { sp: "extremo_derecho", sc: "medio", x: 88, y: 50 },
    { sp: "extremo_izquierdo", sc: "medio", x: 18, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 },
    { sp: "extremo_derecho", sc: "medio", x: 82, y: 22 },
  ],
};

function autoAssign(jugadores, fKey) {
  const tpl = formations[fKey];
  if (!tpl || !jugadores?.length) return { starters: [], subs: [...jugadores] };
  const isTit = j => j.es_titular == 1 || j.es_titular === true;
  const sorted = [...jugadores].sort((a, b) => (isTit(b) ? 1 : 0) - (isTit(a) ? 1 : 0));
  const used = new Set(), starters = [], filled = new Set();
  const pick = (fn) => sorted.find(j => fn(j) && !used.has(j.id));
  for (let i = 0; i < tpl.length; i++) { const s = tpl[i]; const compat = posCompat[s.sp] || [s.sp]; const p = pick(j => compat.includes(j.posicion)); if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); } }
  for (let i = 0; i < tpl.length; i++) { if (filled.has(i)) continue; const s = tpl[i]; const p = pick(j => getPosInfo(j.posicion).cat === s.sc); if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); } }
  for (let i = 0; i < tpl.length; i++) { if (filled.has(i)) continue; const slot = tpl[i]; const p = pick(() => true); if (p) { starters.push({ ...p, px: slot.x, py: slot.y }); used.add(p.id); filled.add(i); } }
  return { starters, subs: jugadores.filter(j => !used.has(j.id)) };
}

const navItems = [
  { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
  { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
  { type: "dropdown", icon: <Shield size={20} />, label: "Equipos", children: [
    { path: "/teams/primera", label: "Primera Division" },
    { path: "/teams/segunda", label: "Segunda Division" },
    { path: "/teams/tercera", label: "Tercera Division" },
  ]},
  { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
  { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
  { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Publicas" },
  { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
  { path: "/settings", icon: <Settings size={20} />, label: "Configuracion" },
];

const TeamSelect = memo(function TeamSelect({ equipos, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const sel = equipos.find(e => String(e.id) === String(value));
  return (
    <div ref={ref} className="pl-team-sel">
      <button className="pl-team-sel-btn" onClick={() => setOpen(!open)}>
        {sel?.logo ? <img src={API + sel.logo} className="pl-team-sel-logo" alt="" /> : <Shield size={18} className="pl-team-sel-icon" />}
        <span className="pl-team-sel-name">{sel?.nombre || "Selecciona un equipo"}</span>
        <ChevronDown size={16} className={"pl-team-sel-arrow" + (open ? " open" : "")} />
      </button>
      {open && (
        <div className="pl-team-sel-drop">
          {equipos.length === 0 && <div className="pl-team-sel-empty">Sin equipos</div>}
          {equipos.map(eq => (
            <button key={eq.id} className={"pl-team-sel-opt" + (String(eq.id) === String(value) ? " active" : "")} onClick={() => { onChange(eq.id); setOpen(false); }}>
              {eq.logo ? <img src={API + eq.logo} className="pl-team-sel-opt-logo" alt="" /> : <Shield size={14} className="pl-team-sel-icon" />}
              <span>{eq.nombre}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

const PlayerCard = memo(function PlayerCard({ j, onStats, onEdit, onDelete, onToggle }) {
  const pi = getPosInfo(j.posicion);
  const isGK = pi.cat === "portero";
  const fotoUrl = j.foto ? API + j.foto : null;

  return (
    <div className={"pl-card" + (j.es_titular ? " pl-card-tit" : "")}>
      <div className="pl-card-num" data-color={pi.color}>{j.numero_camiseta || "-"}</div>
      <div className="pl-card-photo">
        {fotoUrl ? <img src={fotoUrl} alt="" /> : <User size={18} />}
      </div>
      <div className="pl-card-info">
        <span className="pl-card-name">{j.nombre}</span>
        <span className="pl-card-meta">
          {[j.edad && j.edad + " a\u00f1os", j.nacionalidad].filter(Boolean).join(" \u00b7 ")}
        </span>
      </div>
      <span className="pl-card-pos" data-color={pi.color}>{pi.abbr}</span>
      <div className="pl-card-stats">
        {isGK ? (
          <>
            <div className="pl-stat"><b className="gk-gr">{j.goles_recibidos || 0}</b><small>GR</small></div>
            <div className="pl-stat"><b className="gk-vi">{j.vaya_invicta || 0}</b><small>VI</small></div>
          </>
        ) : (
          <>
            <div className="pl-stat"><b className="fwd-g">{j.goles || 0}</b><small>GOL</small></div>
            <div className="pl-stat"><b className="mid-a">{j.asistencias || 0}</b><small>ASIS</small></div>
          </>
        )}
      </div>
      <div className="pl-card-pj"><b>{j.pj || 0}</b><small>PJ</small></div>
      <button className={"pl-card-tit" + (j.es_titular ? " active" : "")} onClick={() => onToggle(j)}>
        {j.es_titular ? "TIT" : "SUP"}
      </button>
      <div className="pl-card-actions">
        <button className="ab ab-blue" onClick={() => onStats(j)} title="Estadisticas"><Pencil size={13} /></button>
        <button className="ab ab-yellow" onClick={() => onEdit(j)} title="Editar"><EyeIcon size={13} /></button>
        <button className="ab ab-red" onClick={() => onDelete(j)} title="Eliminar"><Trash2 size={13} /></button>
      </div>
    </div>
  );
});

const PosSection = memo(function PosSection({ cat, jugadores, ...h }) {
  const cfg = catCfg[cat];
  if (!jugadores?.length) return null;
  return (
    <div className="pl-section">
      <div className="pl-section-head">
        <div className="pl-section-bar" data-color={cfg.color}></div>
        <span className="pl-section-label" data-color={cfg.color}>{cfg.label}</span>
        <span className="pl-section-count" data-color={cfg.color}>{jugadores.length}</span>
      </div>
      <div className="pl-section-list">
        {jugadores.map(j => <PlayerCard key={j.id} j={j} {...h} />)}
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
  const [modal, setModal] = useState(null);
  const [editPlayer, setEditPlayer] = useState(null);
  const [editStats, setEditStats] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre: "", posicion: "centrodelantero", numero_camiseta: "", edad: "", nacionalidad: "", foto: "", es_titular: false });
  const [statsForm, setStatsForm] = useState({});
  const debounceRef = useRef(null);
  const [division, setDivision] = useState(() => localStorage.getItem("admin_division") || "primera");
  const [divDD, setDivDD] = useState(false);
  const divRef = useRef(null);

  useEffect(() => { localStorage.setItem("admin_division", division); }, [division]);
  useEffect(() => { if (window.innerWidth > 768) setSidebarOpen(true); }, []);
  useEffect(() => { const h = e => { if (divRef.current && !divRef.current.contains(e.target)) setDivDD(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);

  useEffect(() => {
    const ep = getEndpoints(division);
    setLoading(true);
    setEquipos([]);
    setEquipoId("");
    setPlantilla(null);
    axios.get(ep.teams).then(r => {
      const d = Array.isArray(r.data) ? r.data : (r.data?.equipos || []);
      setEquipos(d);
    }).catch(() => setEquipos([])).finally(() => setLoading(false));
  }, [division]);

  const onSearchChange = useCallback(e => {
    const v = e.target.value;
    setSearchInput(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(v), 300);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setSearch("");
  }, []);

  const loadPlantilla = useCallback(async (id) => {
    if (!id) { setPlantilla(null); return; }
    setLoading(true);
    const ep = getEndpoints(division);
    try {
      const r = await axios.get(ep.crud + "?equipo_id=" + id);
      if (r.data.success) {
        const jugadores = (r.data.jugadores || []).map(j => ({
          ...j,
          es_titular: j.es_titular == 1 || j.es_titular === true,
        }));
        setPlantilla({ ...r.data, jugadores: jugadores });
        if (r.data.equipo && r.data.equipo.formacion) setFormacion(r.data.equipo.formacion);
      } else {
        console.log("Respuesta del servidor:", r.data);
        Swal.fire({
          background: "#1e293b",
          color: "#fff",
          icon: "warning",
          title: r.data.error || "No se pudo cargar",
          text: "URL: " + ep.crud + "?equipo_id=" + id,
          footer: '<pre style="text-align:left;font-size:11px;color:#94a3b8;max-height:120px;overflow:auto">' + JSON.stringify(r.data, null, 2) + '</pre>',
        });
      }
    } catch (err) {
      const msg =
        err.response && err.response && err.response.status === 404
          ? "Archivo no encontrado: " + ep.crud.split("/").pop()
          : "Error de conexion";
      Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: msg });
    } finally {
      setLoading(false);
    }
  }, [division]);

  const handleEquipoChange = useCallback((id) => {
    setEquipoId(id);
    setSearchInput("");
    setSearch("");
    setTab("plantilla");
    loadPlantilla(id);
  }, [loadPlantilla]);

  const toggleTitular = useCallback(async (j) => {
    const ep = getEndpoints(division);
    try {
      await axios.post(ep.crud, { action: "toggle_titular", id: j.id });
      loadPlantilla(equipoId);
    } catch {
      Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "Error al cambiar estado" });
    }
  }, [equipoId, loadPlantilla, division]);

  const openCreate = useCallback(() => {
    setForm({
      nombre: "",
      posicion: "centrodelantero",
      numero_camiseta: "",
      edad: "",
      nacionalidad: "",
      foto: "",
      es_titular: false,
    });
    setEditPlayer(null);
    setModal("player");
  }, []);

  const openEdit = useCallback((j) => {
    setForm({
      nombre: j.nombre,
      posicion: j.posicion,
      numero_camiseta: j.numero_camiseta || "",
      edad: j.edad || "",
      nacionalidad: j.nacionalidad || "",
      foto: j.foto || "",
      es_titular: !!j.es_titular,
    });
    setEditPlayer(j);
    setModal("player");
  }, []);

  const openStats = useCallback((j) => {
    const fields =
      getPosInfo(j.posicion).cat === "portero" ? gkStatFields : statFields;
    const init = { temporada: j.temporada || "2025-2026" };
    fields.forEach((f) => { init[f.key] = j[f.key] || 0; });
    setStatsForm(init);
    setEditStats(j);
    setModal("stats");
  }, []);

  const deletePlayer = useCallback(async (j) => {
    const ok = await Swal.fire({
      background: "#1e293b",
      color: "#fff",
      title: "Eliminar a " + j.nombre + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!ok.isConfirmed) return;

    const ep = getEndpoints(division);
    try {
      const r = await axios.delete(ep.crud + "?id=" + j.id);
      if (r.data.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Eliminado",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e293b",
          color: "#fff",
        });
        loadPlantilla(equipoId);
      }
    } catch {
      Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "error",
        title: "No se pudo eliminar",
      });
    }
  }, [equipoId, loadPlantilla, division]);

  const validateForm = useCallback(() => {
    if (!form.nombre.trim()) {
      Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "El nombre es obligatorio" });
      return false;
    }
    if (form.edad !== "") {
      const e = parseInt(form.edad);
      if (isNaN(e) || e < 16 || e > 50) {
        Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "Edad: 16-50" });
        return false;
      }
    }
    if (form.numero_camiseta !== "") {
      const d = parseInt(form.numero_camiseta);
      if (isNaN(d) || d < 1 || d > 99) {
        Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "Dorsal: 1-99" });
        return false;
      }
    }
    return true;
  }, [form]);

  const savePlayer = async () => {
    if (!validateForm()) return;
    setSaving(true);
    const ep = getEndpoints(division);
    try {
      const p = {
        action: editPlayer ? "update" : "create",
        equipo_id: editPlayer ? editPlayer.equipo_id : parseInt(equipoId),
        nombre: form.nombre.trim(),
        posicion: form.posicion,
        numero_camiseta: form.numero_camiseta ? parseInt(form.numero_camiseta) : null,
        edad: form.edad ? parseInt(form.edad) : null,
        nacionalidad: form.nacionalidad.trim(),
        foto: form.foto,
        es_titular: form.es_titular ? 1 : 0,
      };
      if (editPlayer) p.id = editPlayer.id;
      const r = await axios.post(ep.crud, p);
      if (r.data.success) {
        setModal(null);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Guardado",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e293b",
          color: "#fff",
        });
        loadPlantilla(equipoId);
      } else {
        Swal.fire({
          background: "#1e293b",
          color: "#fff",
          icon: "error",
          title: r.data.error || "Error",
        });
      }
    } catch (e) {
      Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "error",
        title: e.response?.data?.error || "Error de conexion",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveStats = async () => {
    setSaving(true);
    const ep = getEndpoints(division);
    try {
      const r = await axios.post(ep.crud, {
        action: "update_stats",
        jugador_id: editStats.id,
        ...statsForm,
      });
      if (r.data.success) {
        setModal(null);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Estadisticas guardadas",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e293b",
          color: "#fff",
        });
        loadPlantilla(equipoId);
      }
    } catch (e) {
      Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "error",
        title: e.response?.data?.error || "Error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFoto = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("foto", f);
    const ep = getEndpoints(division);
    try {
      const r = await axios.post(ep.upload, fd);
      if (r.data.success) setForm((p) => ({ ...p, foto: r.data.path }));
    } catch {
      Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "error",
        title: "No se pudo subir la foto",
      });
    }
  };

  const saveFormation = useCallback(async () => {
    const { starters } = autoAssign(plantilla.jugadores, formacion);
    setSaving(true);
    const ep = getEndpoints(division);
    try {
      const r = await axios.post(ep.crud, {
        action: "save_formation",
        equipo_id: equipoId,
        formacion: formacion,
        titulares: JSON.stringify(starters.map((s) => ({ id: s.id, x: s.px, y: s.py }))),
      });
      if (r.data.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Formacion guardada",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e293b",
          color: "#fff",
        });
        loadPlantilla(equipoId);
      }
    } catch {
      Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "error",
        title: "No se pudo guardar",
      });
    } finally {
      setSaving(false);
    }
  }, [plantilla, formacion, equipoId, loadPlantilla, division]);

  const groups = useMemo(() => {
    if (!plantilla?.jugadores) return { portero: [], defensa: [], medio: [], delantero: [] };
    const all = { portero: [], defensa: [], medio: [], delantero: [] };
    plantilla.jugadores.forEach((j) => {
      const c = getPosInfo(j.posicion).cat;
      if (all[c]) all[c].push(j);
    });
    if (!search.trim()) return all;
    const s = search.toLowerCase();
    const out = { portero: [], defensa: [], medio: [], delantero: [] };
    for (const c of Object.keys(all)) {
      out[c] = all[c].filter((j) => j.nombre.toLowerCase().includes(s));
    }
    return out;
  }, [plantilla, search]);

  const total = plantilla?.jugadores?.length || 0;
  const filteredCount = useMemo(() => Object.values(groups).reduce((a, b) => a + b.length, 0), [groups]);
  const { starters, subs } = useMemo(
    () => autoAssign(plantilla?.jugadores || [], formacion),
    [plantilla, formacion],
  );

  const curDiv = DIVISIONES.find((d) => d.key === division);

  const handleLogout = () => {
    Swal.fire({
      background: "#1e293b",
      color: "#fff",
      title: "Cerrar sesion?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    });
  };

  const navClick = useCallback(() => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
    setDdOpen(false);
  }, []);

  const handlers = useMemo(
    () => ({
      onStats: openStats,
      onEdit: openEdit,
      onDelete: deletePlayer,
      onToggle: toggleTitular,
    }),
    [openStats, openEdit, deletePlayer, toggleTitular],
  );

  return (
    <div className={"admin-layout" + (sidebarOpen ? " sidebar-open" : "")}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <img
              src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a"
              alt=""
            />
          </div>
          <h2 className="sidebar-title">
            Números y Fútbol{" "}
            <span className="accent-text">Admin</span>
          </h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, i) => {
              if (item.type === "dropdown") {
                const a = item.children.some((c) => location.pathname === c.path);
                return (
                  <li key={i}>
                    <button
                      className={"nav-item" + (a ? " active" : "")}
                      onClick={() => setDdOpen(!ddOpen)}
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        {item.icon} {item.label}
                      </span>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: ddOpen ? "rotate(180deg)" : "",
                          transition: "transform 0.2s",
                        }}
                      />
                    </button>
                    <ul className={"teams-dropdown" + (ddOpen ? " dropdown-visible" : "")}>
                      {item.children.map((c) => (
                        <li key={c.path}>
                          <Link
                            to={c.path}
                            className={"nav-item nav-subitem" + (location.pathname === c.path ? " active" : "")}
                            onClick={navClick}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={"nav-item" + (location.pathname === item.path ? " active" : "")}
                    onClick={navClick}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button
            className="nav-item btn-logout-sidebar"
            onClick={handleLogout}
          >
            <LogOut size={20} className="nav-icon" /> Cerrar sesion
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <span className="top-bar-title">Gestion de Plantillas</span>
        </header>

        <div className="pl-page">
          <div className="pl-header">
            <h1>Plantillas</h1>
            <div ref={divRef} className="pl-div-dd">
              <button className="pl-div-btn" onClick={() => setDivDD(!divDD)}>
                <Trophy size={14} />
                {curDiv.icon}
                {" "}{curDiv.label} Division
                <ChevronDown size={15} className={"pl-div-arrow" + (divDD ? " open" : "")} />
              </button>
              <div className={"pl-div-drop" + (divDD ? " show" : "")}>
                {DIVISIONES.map((d) => (
                  <button
                    key={d.key}
                    className={"pl-div-opt" + (division === d.key ? " active" : "")}
                    onClick={() => {
                      setDivision(d.key);
                      setDivDD(false);
                    }}
                  >
                    <span>{d.icon}</span>
                    {d.label} Division
                    {division === d.key && <span className="pl-div-dot" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pl-toolbar">
            <TeamSelect equipos={equipos} value={equipoId} onChange={handleEquipoChange} />
            {plantilla && (
              <div className="pl-search">
                <Search size={15} className="pl-search-ic" />
                <input
                  value={searchInput}
                  onChange={onSearchChange}
                  placeholder="Buscar jugador..."
                />
                {searchInput && (
                  <button className="pl-search-x" onClick={clearSearch}>
                    <X size={11} />
                  </button>
                )}
              </div>
            )}
            {plantilla && (
              <button className="pl-add-btn" onClick={openCreate}>
                <Plus size={15} /> Agregar
              </button>
            )}
          </div>

          {!loading && equipos.length === 0 && (
            <div className="pl-empty">
              <Shield size={40} />
              <p>No hay equipos en {curDiv?.label} Division</p>
              <p>Crea equipos desde la seccion de Equipos primero</p>
            </div>
          )}

          {plantilla && (
            <div className="pl-team-card">
              <div className="pl-tc-logo">
                <img src={API + plantilla.equipo.logo} alt="" />
              </div>
              <div className="pl-tc-info">
                <h3>{plantilla.equipo.nombre}</h3>
                <p>
                  {[plantilla.equipo.ciudad, plantilla.equipo.estadio].filter(Boolean).join(" - ")}
                </p>
              </div>
              <div className="pl-tc-stats">
                <div className="pl-tc-stat">
                  <b>{total}</b>
                  <span>Jugadores</span>
                </div>
                <div className="pl-tc-div" />
                <div className="pl-tc-stat">
                  <b className="text-amber">{plantilla.jugadores.filter((j) => j.es_titular).length}</b>
                  <span>Titulares</span>
                </div>
                <div className="pl-tc-div" />
                <div className="pl-tc-stat">
                  <b className="text-slate">{plantilla.jugadores.filter((j) => !j.es_titular).length}</b>
                  <span>Suplentes</span>
                </div>
              </div>
            </div>
          )}

          {plantilla && total > 0 && (
            <div className="pl-tabs">
              <button
                className={"pl-tab" + (tab === "plantilla" ? " active" : "")}
                onClick={() => setTab("plantilla")}
              >
                <Users size={14} /> Plantilla
              </button>
              <button
                className={"pl-tab" + (tab === "formacion" ? " active" : "")}
                onClick={() => setTab("formacion")}
              >
                <Target size={14} /> Formacion
              </button>
            </div>
          )}

          {loading && (
            <div className="pl-empty">
              <div className="pl-spinner" />
              <p>Cargando {curDiv?.label}...</p>
            </div>
          )}

          {!loading && !plantilla && equipos.length > 0 && (
            <div className="pl-empty">
              <Users size={40} />
              <p>Selecciona un equipo</p>
              <p>Elige del menu desplegable para ver su plantilla</p>
            </div>
          )}

          {!loading && plantilla && tab === "plantilla" && (
            total === 0 ? (
              <div className="pl-empty">
                <p>Sin jugadores registrados</p>
                <button className="pl-add-btn" onClick={openCreate}>
                  <Plus size={15} /> Agregar primero
                </button>
              </div>
            ) : (
              <div>
                {searchInput.trim() && (
                  <div className="pl-filter-msg">
                    {filteredCount > 0
                      ? filteredCount + " resultado" + (filteredCount !== 1 ? "s" : "") + " para " + searchInput
                      : "Sin resultados para " + searchInput}
                  </div>
                )}
                {Object.keys(catCfg).map((cat) => (
                  <PosSection key={cat} cat={cat} jugadores={groups[cat]} {...handlers} />
                ))}
              </div>
            )
          )}

          {!loading && plantilla && tab === "formacion" && (
            <div>
              <div className="pl-fm-bar">
                <div className="pl-fm-btns">
                  {Object.keys(formations).map((f) => (
                    <button
                      key={f}
                      className={"pl-fm-btn" + (formacion === f ? " active" : "")}
                      onClick={() => setFormacion(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  className="pl-save-btn"
                  onClick={saveFormation}
                  disabled={saving}
                >
                  <Save size={14} />
                  {saving ? "..." : "Guardar"}
                </button>
              </div>

              <div className="pl-pitch">
                <svg
                  className="pl-pitch-svg"
                  viewBox="0 0 680 1050"
                  preserveAspectRatio="none"
                >
                  <line x1="0" y1="525" x2="680" y2="525" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <circle cx="340" cy="525" r="91" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="136" y="1" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="224" y="1" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <path d="M 248 165 A 91 91 0 0 0 432 165" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="136" y="884" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="224" y="994" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <path d="M 248 885 A 91 91 0 0 1 432 885" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                </svg>

                {starters.map((s, idx) => {
                  const pi = getPosInfo(s.posicion);
                  return (
                    <div
                      key={s.id || idx}
                      className="pl-pitch-player"
                      style={{
                        left: s.px + "%",
                        top: s.py + "%",
                      }}
                    >
                      <div className="pl-pitch-dot" data-color={pi.color}>
                        {s.foto
                          ? <img src={API + s.foto} alt="" />
                          : <span>{s.numero_camiseta || ""}</span>}
                      </div>
                      <div className="pl-pitch-name">
                        {s.nombre.split(" ").pop()}
                      </div>
                    </div>
                  );
                })}

                {starters.length < 11 && (
                  <div className="pl-pitch-msg">
                    {starters.length}/11 titulares
                  </div>
                )}
              </div>

              {subs.length > 0 && (
                <div className="pl-subs-card">
                  <h4 className="pl-subs-title">
                    Suplentes ({subs.length})
                  </h4>
                  <div className="pl-subs-grid">
                    {subs.map((s) => {
                      const pi = getPosInfo(s.posicion);
                      return (
                        <div key={s.id} className="pl-sub-item" data-color={pi.color}>
                          <div className="pl-sub-photo">
                            {s.foto
                              ? <img src={API + s.foto} alt="" />
                              : <User size={14} />}
                          </div>
                          <div className="pl-sub-info">
                            <span className="pl-sub-name">{s.nombre}</span>
                            <span className="pl-sub-meta">
                              #{s.numero_camiseta || "-"} - {pi.label}
                            </span>
                          </div>
                          <button
                            className="pl-sub-prom"
                            onClick={() => toggleTitular(s)}
                            title="Hacer titular"
                          >
                            <Star size={12} />
                          </button>
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

      {modal === "player" && (
        <div className="pl-modal-bg" onClick={() => setModal(null)}>
          <div className="pl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pl-modal-top">
              <h3>{editPlayer ? "Editar Jugador" : "Nuevo Jugador"}</h3>
              <button className="pl-modal-x" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="pl-modal-body">
              <div className="pl-foto-area">
                <div className="pl-foto-circle">
                  {form.foto
                    ? <img src={API + form.foto} alt="" />
                    : <User size={28} />}
                </div>
                <label className="pl-upload-btn">
                  <Plus size={12} /> Subir foto
                  <input type="file" accept="image/*" onChange={handleFoto} hidden />
                </label>
              </div>

              <div className="pl-field">
                <label>
                  Nombre completo <span className="req">*</span>
                </label>
                <input
                  className="pl-input"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Juan Perez"
                />
              </div>

              <div className="pl-field">
                <label>Posicion</label>
                <div className="pl-select-w">
                  <select
                    className="pl-input pl-select"
                    value={form.posicion}
                    onChange={(e) => setForm((f) => ({ ...f, posicion: e.target.value }))}
                  >
                    {posGroups.map((g) => (
                      <optgroup key={g.label} label={g.label}>
                        {g.items.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label} ({p.abbr})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pl-row2">
                <div className="pl-field">
                  <label>Dorsal <span className="text-slate">(1-99)</span></label>
                  <input
                    className="pl-input"
                    type="number"
                    value={form.numero_camiseta}
                    onChange={(e) => setForm((f) => ({ ...f, numero_camiseta: e.target.value }))}
                    placeholder="10"
                    min="1"
                    max="99"
                  />
                </div>
                <div className="pl-field">
                  <label>Edad <span className="text-slate">(16-50)</span></label>
                  <input
                    className="pl-input"
                    type="number"
                    value={form.edad}
                    onChange={(e) => setForm((f) => ({ ...f, edad: e.target.value }))}
                    placeholder="20"
                    min="16"
                    max="50"
                  />
                </div>
              </div>

              <div className="pl-field">
                <label>Nacionalidad</label>
                <input
                  className="pl-input"
                  value={form.nacionalidad}
                  onChange={(e) => setForm((f) => ({ ...f, nacionalidad: e.target.value }))}
                  placeholder="Salvadoreno"
                />
              </div>

              <div className="pl-tit-row">
                <label style={{ marginBottom: 0 }}>Estado</label>
                <div className="pl-tit-btns">
                  <button
                    type="button"
                    className={"pl-tit-opt" + (!form.es_titular ? " active" : "")}
                    onClick={() => setForm((f) => ({ ...f, es_titular: false }))}
                  >
                    <User size={14} /> Suplente
                  </button>
                  <button
                    type="button"
                    className={"pl-tit-opt tit" + (form.es_titular ? " active" : "")}
                    onClick={() => setForm((f) => ({ ...f, es_titular: true }))}
                  >
                    <Star size={14} /> Titular
                  </button>
                </div>
              </div>
            </div>

            <div className="pl-modal-bottom">
              <button
                className="pl-cancel-btn"
                onClick={() => setModal(null)}
              >
                Cancelar
              </button>
              <button
                className="pl-save-btn"
                onClick={savePlayer}
                disabled={saving}
              >
                <Save size={14} />
                {saving ? "..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "stats" && editStats && (
        <div className="pl-modal-bg" onClick={() => setModal(null)}>
          <div
            className="pl-modal pl-modal-stats"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pl-modal-top">
              <div>
                <h3>Estadisticas</h3>
                <p className="pl-modal-sub">
                  {editStats.nombre} - {getPosInfo(editStats.posicion).label}
                </p>
              </div>
              <button className="pl-modal-x" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="pl-stats-grid">
              {(getPosInfo(editStats.posicion).cat === "portero" ? gkStatFields : statFields).map((f) => (
                <div key={f.key} className="pl-stat-field">
                  <label>{f.label}</label>
                  <input
                    className="pl-stat-input"
                    type="number"
                    min="0"
                    value={statsForm[f.key] || 0}
                    onChange={(e) => setStatsForm((s) => ({ ...s, [f.key]: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              ))}
            </div>

            <div className="pl-modal-bottom">
              <button
                className="pl-cancel-btn"
                onClick={() => setModal(null)}
              >
                Cancelar
              </button>
              <button
                className="pl-save-btn green"
                onClick={saveStats}
                disabled={saving}
              >
                <Save size={14} />
                {saving ? "..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
@keyframes plspin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulseGlow{0%,100%{opacity:.4}50%{opacity:1}}

/* --- SIDEBAR MOBILE --- */
.sidebar-backdrop{display:none}
@media(max-width:768px){
  .sidebar-backdrop{display:block;position:fixed;inset:0;z-index:49;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}
  .admin-layout .sidebar{position:fixed!important;z-index:50!important;top:0!important;left:0!important;width:260px!important;height:100vh!important;transform:translateX(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1)!important}
  .admin-layout.sidebar-open .sidebar{transform:translateX(0)!important;box-shadow:4px 0 30px rgba(0,0,0,.5)}
  .admin-layout .main-content{margin-left:0!important;width:100%!important}
}
@media(min-width:769px){
  .admin-layout.sidebar-open .sidebar{transform:translateX(0)!important}
}
.teams-dropdown{list-style:none;padding:0;margin:0;max-height:0;overflow:hidden;transition:max-height .3s cubic-bezier(.4,0,.2,1)}
.teams-dropdown.dropdown-visible{max-height:200px}
.nav-subitem{padding-left:52px!important;font-size:13px!important;opacity:.6;transition:opacity .15s}
.nav-subitem.active{opacity:1}
.top-bar-title{font-size:.95rem;font-weight:700;color:#e2e8f0;letter-spacing:-.01em}
button.nav-item{background:none;border:none;color:#94a3b8;font-family:inherit;width:100%;text-align:left}

/* --- PAGE LAYOUT --- */
.pl-page{padding:28px 24px;max-width:1060px;margin:0 auto;animation:slideUp .4s ease-out}

/* --- HEADER --- */
.pl-header{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.04)}
.pl-header h1{margin:0;font-size:26px;font-weight:900;color:#f8fafc;letter-spacing:-.04em;background:linear-gradient(135deg,#f8fafc 0%,#64748b 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* --- DIVISION DROPDOWN --- */
.pl-div-dd{position:relative}
.pl-div-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);color:#94a3b8;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s;letter-spacing:-.01em;backdrop-filter:blur(8px)}
.pl-div-btn:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:#cbd5e1}
.pl-div-arrow{transition:transform .25s cubic-bezier(.4,0,.2,1)}.pl-div-arrow.open{transform:rotate(180deg)}
.pl-div-drop{position:absolute;top:calc(100% + 10px);right:0;background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.06);border-radius:16px;overflow:hidden;min-width:220px;box-shadow:0 25px 60px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.02) inset;opacity:0;pointer-events:none;transform:translateY(-8px) scale(.98);transition:all .25s cubic-bezier(.4,0,.2,1);backdrop-filter:blur(20px)}
.pl-div-drop.show{opacity:1;pointer-events:auto;transform:translateY(0) scale(1)}
.pl-div-opt{display:flex;align-items:center;gap:10px;width:100%;padding:13px 20px;border:none;background:transparent;color:#94a3b8;font-size:13px;font-weight:500;cursor:pointer;text-align:left;transition:all .15s}
.pl-div-opt:hover{background:rgba(255,255,255,.04);color:#e2e8f0}
.pl-div-opt.active{background:rgba(255,255,255,.06);color:#f1f5f9;font-weight:700}
.pl-div-dot{margin-left:auto;width:6px;height:6px;border-radius:50%;background:#22d3ee;box-shadow:0 0 10px rgba(34,211,238,.5)}

/* --- TOOLBAR --- */
.pl-toolbar{display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap;align-items:center}

/* --- TEAM SELECT --- */
.pl-team-sel{position:relative;flex:1;min-width:260px;z-index:20}
.pl-team-sel-btn{width:100%;display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:14px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:#f1f5f9;font-size:14px;cursor:pointer;text-align:left;transition:all .25s;backdrop-filter:blur(4px)}
.pl-team-sel-btn:hover{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.04)}
.pl-team-sel-logo{width:30px;height:30px;border-radius:10px;object-fit:contain;flex-shrink:0;background:rgba(255,255,255,.04);padding:3px}
.pl-team-sel-icon{color:#475569;flex-shrink:0}
.pl-team-sel-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.pl-team-sel-arrow{color:#475569;transition:transform .25s cubic-bezier(.4,0,.2,1);flex-shrink:0}.pl-team-sel-arrow.open{transform:rotate(180deg)}
.pl-team-sel-drop{position:absolute;top:calc(100% + 8px);left:0;right:0;background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.06);border-radius:16px;max-height:300px;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,.5);z-index:30;animation:fadeIn .2s ease-out;backdrop-filter:blur(20px)}
.pl-team-sel-drop::-webkit-scrollbar{width:3px}.pl-team-sel-drop::-webkit-scrollbar-track{background:transparent}.pl-team-sel-drop::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:4px}
.pl-team-sel-opt{width:100%;display:flex;align-items:center;gap:10px;padding:12px 14px;border:none;background:transparent;color:#cbd5e1;font-size:13px;cursor:pointer;transition:all .12s;text-align:left;border-bottom:1px solid rgba(255,255,255,.02)}
.pl-team-sel-opt:last-child{border-bottom:none}
.pl-team-sel-opt:hover{background:rgba(255,255,255,.04)}
.pl-team-sel-opt.active{background:rgba(255,255,255,.06);color:#f1f5f9}
.pl-team-sel-opt .pl-team-sel-opt-logo{width:26px;height:26px;border-radius:8px}
.pl-team-sel-empty{padding:20px;text-align:center;color:#475569;font-size:13px}

/* --- SEARCH --- */
.pl-search{position:relative;min-width:200px;flex:.4}
.pl-search input{width:100%;padding:12px 38px 12px 40px;border-radius:14px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:#e2e8f0;font-size:13px;outline:none;box-sizing:border-box;transition:all .25s}
.pl-search input:focus{border-color:rgba(34,211,238,.25);background:rgba(255,255,255,.03);box-shadow:0 0 0 4px rgba(34,211,238,.06)}
.pl-search input::placeholder{color:#334155}
.pl-search-ic{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#334155;pointer-events:none}
.pl-search-x{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.05);border:none;color:#475569;width:22px;height:22px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.pl-search-x:hover{background:rgba(239,68,68,.12);color:#f87171}

/* --- ADD BUTTON --- */
.pl-add-btn{display:flex;align-items:center;gap:7px;padding:12px 24px;border-radius:14px;border:none;background:#0f766e;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s;letter-spacing:-.01em;box-shadow:0 2px 12px rgba(15,118,110,.2)}
.pl-add-btn:hover{background:#0d9488;box-shadow:0 4px 20px rgba(15,118,110,.3);transform:translateY(-1px)}
.pl-add-btn:active{transform:translateY(0)}

/* --- EMPTY STATE --- */
.pl-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;color:#475569;gap:8px}
.pl-empty svg{opacity:.2;margin-bottom:8px}
.pl-empty p{margin:0;text-align:center}
.pl-empty p:first-of-type{font-weight:700;color:#64748b;font-size:15px}
.pl-empty p:last-of-type{color:#334155;font-size:13px}
.pl-spinner{width:36px;height:36px;border-radius:50%;border:3px solid rgba(255,255,255,.04);border-top-color:#22d3ee;animation:plspin .7s linear infinite;margin:0 auto 16px}

/* --- TEAM CARD --- */
.pl-team-card{display:flex;align-items:center;gap:20px;padding:22px 24px;border-radius:20px;background:linear-gradient(135deg,rgba(255,255,255,.025),rgba(255,255,255,.008));border:1px solid rgba(255,255,255,.04);margin-bottom:24px;transition:all .3s;position:relative;overflow:hidden}
.pl-team-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(34,211,238,.2),transparent)}
.pl-team-card:hover{border-color:rgba(255,255,255,.06)}
.pl-tc-logo{width:56px;height:56px;border-radius:16px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,.03);display:flex;align-items:center;justify-content:center;padding:8px;border:1px solid rgba(255,255,255,.05)}
.pl-tc-logo img{width:100%;height:100%;object-fit:contain}
.pl-tc-info{flex:1;min-width:0}
.pl-tc-info h3{margin:0;font-size:20px;font-weight:900;color:#f1f5f9;letter-spacing:-.03em}
.pl-tc-info p{margin:4px 0 0;font-size:12px;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pl-tc-stats{display:flex;align-items:center;gap:20px;flex-shrink:0}
.pl-tc-stat{text-align:center}
.pl-tc-stat b{display:block;font-size:24px;font-weight:900;font-family:'Inter',system-ui,sans-serif;line-height:1;letter-spacing:-.04em}
.pl-tc-stat span{font-size:9px;color:#334155;text-transform:uppercase;letter-spacing:.1em;margin-top:3px;display:block}
.pl-tc-div{width:1px;height:36px;background:rgba(255,255,255,.04);border-radius:1px}

/* --- TABS --- */
.pl-tabs{display:flex;gap:2px;margin-bottom:24px;padding:3px;background:rgba(255,255,255,.02);border-radius:16px;border:1px solid rgba(255,255,255,.04);width:fit-content}
.pl-tab{display:flex;align-items:center;gap:8px;padding:11px 24px;border-radius:14px;border:none;background:transparent;color:#475569;font-size:13px;font-weight:600;cursor:pointer;transition:all .25s}
.pl-tab:hover{color:#94a3b8;background:rgba(255,255,255,.02)}
.pl-tab.active{background:rgba(34,211,238,.08);color:#22d3ee;box-shadow:0 0 20px rgba(34,211,238,.06)}

/* --- FILTER MSG --- */
.pl-filter-msg{margin-bottom:16px;font-size:12px;color:#475569;padding:10px 16px;background:rgba(255,255,255,.015);border-radius:10px;border-left:2px solid rgba(34,211,238,.3)}

/* --- SECTIONS --- */
.pl-section{margin-bottom:22px}
.pl-section-head{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding:0 4px}
.pl-section-bar{width:3px;height:16px;border-radius:2px}
.pl-section-bar[data-color="#f59e0b"]{background:#f59e0b}
.pl-section-bar[data-color="#3b82f6"]{background:#3b82f6}
.pl-section-bar[data-color="#10b981"]{background:#10b981}
.pl-section-bar[data-color="#ef4444"]{background:#ef4444}
.pl-section-label{font-size:10px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.15em}
.pl-section-label[data-color="#f59e0b"]{color:#fbbf24}
.pl-section-label[data-color="#3b82f6"]{color:#60a5fa}
.pl-section-label[data-color="#10b981"]{color:#34d399}
.pl-section-label[data-color="#ef4444"]{color:#f87171}
.pl-section-count{font-size:9px;font-weight:800;color:#334155;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(255,255,255,.03)}
.pl-section-count[data-color="#f59e0b"]{background:rgba(245,158,11,.08);color:#fbbf24}
.pl-section-count[data-color="#3b82f6"]{background:rgba(59,130,246,.08);color:#60a5fa}
.pl-section-count[data-color="#10b981"]{background:rgba(16,185,129,.08);color:#34d399}
.pl-section-count[data-color="#ef4444"]{background:rgba(239,68,68,.08);color:#f87171}
.pl-section-list{display:flex;flex-direction:column;gap:3px}

/* --- PLAYER CARD --- */
.pl-card{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.025);background:rgba(255,255,255,.012);transition:all .2s;cursor:default;position:relative;overflow:hidden}
.pl-card::after{content:'';position:absolute;inset:0;border-radius:14px;opacity:0;transition:opacity .2s;pointer-events:none;background:linear-gradient(135deg,rgba(34,211,238,.03),transparent 60%)}
.pl-card:hover{border-color:rgba(255,255,255,.05);background:rgba(255,255,255,.03)}
.pl-card:hover::after{opacity:1}
.pl-card-tit{border-color:rgba(245,158,11,.08)!important;background:rgba(245,158,11,.03)!important}
.pl-card-tit::after{background:linear-gradient(135deg,rgba(245,158,11,.04),transparent 60%)!important;opacity:1!important}

.pl-card-num{font-size:15px;font-weight:900;font-family:'Inter',system-ui,sans-serif;width:28px;text-align:center;flex-shrink:0;letter-spacing:-.04em}
.pl-card-num[data-color="#f59e0b"]{color:#fbbf24}
.pl-card-num[data-color="#3b82f6"]{color:#60a5fa}
.pl-card-num[data-color="#10b981"]{color:#34d399}
.pl-card-num[data-color="#ef4444"]{color:#f87171}
.pl-card-num[data-color="#059669"]{color:#34d399}
.pl-card-num[data-color="#6ee7b7"]{color:#6ee7b7}
.pl-card-num[data-color="#f87171"]{color:#f87171}
.pl-card-num[data-color="#64748b"]{color:#94a3b8}

.pl-card-photo{width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,.03);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#1e293b;border:1px solid rgba(255,255,255,.03)}
.pl-card-photo img{width:100%;height:100%;object-fit:cover}
.pl-card-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.pl-card-name{font-size:13px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}
.pl-card-meta{font-size:10px;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.pl-card-pos{font-size:9px;font-weight:800;letter-spacing:.08em;padding:4px 8px;border-radius:8px;flex-shrink:0;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.04)}
.pl-card-pos[data-color="#f59e0b"]{color:#fbbf24;border-color:rgba(245,158,11,.15)}
.pl-card-pos[data-color="#3b82f6"]{color:#60a5fa;border-color:rgba(59,130,246,.15)}
.pl-card-pos[data-color="#10b981"]{color:#34d399;border-color:rgba(16,185,129,.15)}
.pl-card-pos[data-color="#ef4444"]{color:#f87171;border-color:rgba(239,68,68,.15)}
.pl-card-pos[data-color="#059669"]{color:#34d399;border-color:rgba(5,150,105,.15)}
.pl-card-pos[data-color="#6ee7b7"]{color:#6ee7b7;border-color:rgba(110,231,183,.15)}
.pl-card-pos[data-color="#f87171"]{color:#f87171;border-color:rgba(248,113,113,.15)}
.pl-card-pos[data-color="#64748b"]{color:#94a3b8;border-color:rgba(100,116,139,.15)}

.pl-card-stats{display:flex;gap:12px;flex-shrink:0}
.pl-stat{text-align:center}
.pl-stat b{display:block;font-size:13px;font-weight:800;font-family:'Inter',system-ui,sans-serif;line-height:1.1;letter-spacing:-.03em}
.pl-stat small{font-size:8px;color:#334155;text-transform:uppercase;letter-spacing:.06em;display:block}
.fwd-g{color:#f87171}.mid-a{color:#60a5fa}.gk-gr{color:#fbbf24}.gk-vi{color:#34d399}

.pl-card-pj{text-align:center;flex-shrink:0;min-width:32px}
.pl-card-pj b{display:block;font-size:13px;font-weight:800;color:#64748b;font-family:'Inter',system-ui,sans-serif;line-height:1.1}
.pl-card-pj small{font-size:8px;color:#334155;text-transform:uppercase;letter-spacing:.06em}

.pl-card-tit{padding:5px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.04);background:rgba(255,255,255,.015);color:#475569;font-size:9px;font-weight:800;cursor:pointer;letter-spacing:.1em;transition:all .2s;flex-shrink:0;text-transform:uppercase}
.pl-card-tit.active{background:rgba(245,158,11,.1)!important;color:#fbbf24!important;border-color:rgba(245,158,11,.2)!important;box-shadow:0 0 12px rgba(245,158,11,.06)}
.pl-card-tit:hover{background:rgba(255,255,255,.03)}

.pl-card-actions{display:flex;gap:3px;flex-shrink:0;opacity:0;transition:opacity .2s}
.pl-card:hover .pl-card-actions{opacity:1}
.ab{width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.04);background:rgba(255,255,255,.015);color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.ab:hover{transform:scale(1.1)}
.ab-blue:hover{color:#60a5fa;border-color:rgba(59,130,246,.2);background:rgba(59,130,246,.06)}
.ab-yellow:hover{color:#fbbf24;border-color:rgba(245,158,11,.2);background:rgba(245,158,11,.06)}
.ab-red:hover{color:#f87171;border-color:rgba(239,68,68,.2);background:rgba(239,68,68,.06)}

/* --- FORMATION BAR --- */
.pl-fm-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap}
.pl-fm-btns{display:flex;gap:3px;padding:3px;background:rgba(255,255,255,.015);border-radius:14px;border:1px solid rgba(255,255,255,.04)}
.pl-fm-btn{padding:9px 18px;border-radius:12px;border:none;background:transparent;color:#475569;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s;font-family:'Inter',system-ui,sans-serif;letter-spacing:.03em}
.pl-fm-btn:hover{color:#94a3b8;background:rgba(255,255,255,.02)}
.pl-fm-btn.active{background:rgba(34,211,238,.08);color:#22d3ee;box-shadow:0 0 16px rgba(34,211,238,.06)}

/* --- SAVE BUTTON --- */
.pl-save-btn{padding:11px 24px;border-radius:12px;border:none;background:#0f766e;color:#fff;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .25s;letter-spacing:-.01em;box-shadow:0 2px 12px rgba(15,118,110,.2)}
.pl-save-btn:hover{background:#0d9488;box-shadow:0 4px 20px rgba(15,118,110,.3);transform:translateY(-1px)}
.pl-save-btn:disabled{opacity:.3;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.pl-save-btn.green{background:#0f766e;box-shadow:0 2px 12px rgba(15,118,110,.2)}
.pl-save-btn.green:hover{background:#0d9488;box-shadow:0 4px 20px rgba(15,118,110,.3)}
.pl-save-btn.green:disabled{opacity:.3;cursor:not-allowed;transform:none!important;box-shadow:none!important}

/* --- PITCH (SIN CAMBIOS) --- */
.pl-pitch{position:relative;width:100%;max-width:480px;margin:0 auto 24px;aspect-ratio:.65;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,#15803d 0%,#166534 40%,#14532d 100%);border:2px solid rgba(255,255,255,.12);box-shadow:0 20px 60px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.05)}
.pl-pitch-svg{position:absolute;inset:0;width:100%;height:100%}
.pl-pitch-player{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px;z-index:2;transition:all .3s cubic-bezier(.4,0,.2,1)}
.pl-pitch-player:hover{transform:translate(-50%,-50%) scale(1.12);z-index:5}
.pl-pitch-dot{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;font-family:'SF Mono',SFMono-Regular,monospace;color:#fff;border:2.5px solid rgba(255,255,255,.9);box-shadow:0 3px 12px rgba(0,0,0,.4);overflow:hidden;transition:all .2s}
.pl-pitch-dot img{width:100%;height:100%;object-fit:cover}
.pl-pitch-dot[data-color="#f59e0b"]{background:linear-gradient(135deg,#d97706,#f59e0b)}
.pl-pitch-dot[data-color="#3b82f6"]{background:linear-gradient(135deg,#2563eb,#3b82f6)}
.pl-pitch-dot[data-color="#10b981"]{background:linear-gradient(135deg,#059669,#10b981)}
.pl-pitch-dot[data-color="#ef4444"]{background:linear-gradient(135deg,#dc2626,#ef4444)}
.pl-pitch-dot[data-color="#059669"]{background:linear-gradient(135deg,#047857,#059669)}
.pl-pitch-dot[data-color="#6ee7b7"]{background:linear-gradient(135deg,#34d399,#6ee7b7)}
.pl-pitch-dot[data-color="#f87171"]{background:linear-gradient(135deg,#ef4444,#f87171)}
.pl-pitch-dot[data-color="#64748b"]{background:linear-gradient(135deg,#475569,#64748b)}
.pl-pitch-name{font-size:10px;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.7),0 0 8px rgba(0,0,0,.4);white-space:nowrap;letter-spacing:.02em}
.pl-pitch-msg{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:8px;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);color:#94a3b8;font-size:11px;font-weight:600;z-index:10;border:1px solid rgba(255,255,255,.06)}

/* --- SUBS CARD --- */
.pl-subs-card{background:rgba(255,255,255,.012);border:1px solid rgba(255,255,255,.035);border-radius:20px;padding:20px;animation:slideUp .3s ease-out}
.pl-subs-title{margin:0 0 14px;font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.12em}
.pl-subs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:5px}
.pl-sub-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.025);background:rgba(255,255,255,.01);transition:all .2s}
.pl-sub-item:hover{background:rgba(255,255,255,.025);border-color:rgba(255,255,255,.05)}
.pl-sub-item[data-color="#f59e0b"]{border-left:2px solid rgba(245,158,11,.3)}
.pl-sub-item[data-color="#3b82f6"]{border-left:2px solid rgba(59,130,246,.3)}
.pl-sub-item[data-color="#10b981"]{border-left:2px solid rgba(16,185,129,.3)}
.pl-sub-item[data-color="#ef4444"]{border-left:2px solid rgba(239,68,68,.3)}
.pl-sub-item[data-color="#059669"]{border-left:2px solid rgba(5,150,105,.3)}
.pl-sub-item[data-color="#6ee7b7"]{border-left:2px solid rgba(110,231,183,.3)}
.pl-sub-item[data-color="#f87171"]{border-left:2px solid rgba(248,113,113,.3)}
.pl-sub-photo{width:30px;height:30px;border-radius:10px;background:rgba(255,255,255,.03);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#1e293b;border:1px solid rgba(255,255,255,.03)}
.pl-sub-photo img{width:100%;height:100%;object-fit:cover}
.pl-sub-info{flex:1;min-width:0}
.pl-sub-name{display:block;font-size:12px;font-weight:600;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-sub-meta{display:block;font-size:10px;color:#334155}
.pl-sub-prom{width:26px;height:26px;border-radius:8px;border:1px solid rgba(245,158,11,.1);background:rgba(245,158,11,.04);color:#f59e0b;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.pl-sub-prom:hover{background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.25);box-shadow:0 0 10px rgba(245,158,11,.08);transform:scale(1.1)}

/* --- MODAL --- */
.pl-modal-bg{position:fixed;inset:0;background:rgba(2,6,23,.9);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fadeInBg .2s ease-out}
@keyframes fadeInBg{from{opacity:0}to{opacity:1}}
.pl-modal{background:linear-gradient(180deg,#0f172a,#0a0f1a);border:1px solid rgba(255,255,255,.05);border-radius:24px;width:520px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.015) inset;animation:fadeIn .3s cubic-bezier(.4,0,.2,1)}
.pl-modal-stats{width:580px}
.pl-modal-top{display:flex;justify-content:space-between;align-items:center;padding:22px 26px;border-bottom:1px solid rgba(255,255,255,.04)}
.pl-modal-top h3{margin:0;font-size:18px;color:#f1f5f9;font-weight:800;letter-spacing:-.02em}
.pl-modal-sub{margin:3px 0 0;font-size:12px;color:#334155}
.pl-modal-x{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:12px;cursor:pointer;width:36px;height:36px;color:#475569;display:flex;align-items:center;justify-content:center;transition:all .25s}
.pl-modal-x:hover{background:rgba(239,68,68,.08);color:#f87171;border-color:rgba(239,68,68,.15);transform:rotate(90deg)}
.pl-modal-body{padding:26px;overflow-y:auto;flex:1}
.pl-modal-body::-webkit-scrollbar{width:3px}.pl-modal-body::-webkit-scrollbar-track{background:transparent}.pl-modal-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.04);border-radius:4px}
.pl-modal-bottom{display:flex;justify-content:flex-end;gap:10px;padding:18px 26px;border-top:1px solid rgba(255,255,255,.04);background:rgba(255,255,255,.008)}

/* --- FORM ELEMENTS --- */
.pl-foto-area{text-align:center;margin-bottom:26px}
.pl-foto-circle{width:92px;height:92px;border-radius:20px;background:rgba(255,255,255,.02);border:2px dashed rgba(255,255,255,.06);overflow:hidden;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;transition:all .25s;color:#1e293b}
.pl-foto-circle img{width:100%;height:100%;object-fit:cover;border-style:solid;border-color:rgba(34,211,238,.2)}
.pl-upload-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:10px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015);color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}
.pl-upload-btn:hover{border-color:rgba(34,211,238,.2);color:#22d3ee;background:rgba(34,211,238,.05)}
.pl-field{margin-bottom:18px}
.pl-field label{display:block;margin-bottom:7px;font-size:11px;font-weight:700;color:#475569;letter-spacing:.03em;text-transform:uppercase}
.req{color:#f87171}
.pl-input{width:100%;padding:12px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015);color:#e2e8f0;font-size:13px;outline:none;box-sizing:border-box;transition:all .25s}
.pl-input:focus{border-color:rgba(34,211,238,.25);background:rgba(255,255,255,.025);box-shadow:0 0 0 4px rgba(34,211,238,.06)}
.pl-input::placeholder{color:#1e293b}
.pl-input option{background:#0f172a;color:#f1f5f9}
.pl-input optgroup{background:#0f172a;color:#94a3b8;font-weight:700}
.pl-select{appearance:none;cursor:pointer;padding-right:2.5rem}
.pl-select-w{position:relative}
.pl-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
.pl-tit-row{display:flex;gap:10px;align-items:center;margin-bottom:18px}
.pl-tit-btns{display:flex;gap:8px;flex:1}
.pl-tit-opt{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:11px;border-radius:12px;border:1px solid rgba(255,255,255,.04);background:rgba(255,255,255,.01);color:#475569;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s}
.pl-tit-opt:hover{background:rgba(255,255,255,.025);border-color:rgba(255,255,255,.06)}
.pl-tit-opt.active{background:rgba(100,116,139,.06)!important;color:#94a3b8!important;border-color:rgba(100,116,139,.12)!important}
.pl-tit-opt.tit.active{background:rgba(245,158,11,.08)!important;color:#fbbf24!important;border-color:rgba(245,158,11,.15)!important;box-shadow:0 0 14px rgba(245,158,11,.04)}

/* --- STATS GRID --- */
.pl-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.pl-stat-field label{display:block;margin-bottom:7px;font-size:10px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:.12em}
.pl-stat-input{width:100%;padding:14px 16px;border-radius:14px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015);color:#e2e8f0;font-size:20px;font-weight:800;text-align:center;outline:none;font-family:'Inter',system-ui,sans-serif;box-sizing:border-box;transition:all .25s;letter-spacing:-.04em}
.pl-stat-input:focus{border-color:rgba(15,118,110,.25);background:rgba(255,255,255,.025);box-shadow:0 0 0 4px rgba(15,118,110,.06)}

/* --- CANCEL BUTTON --- */
.pl-cancel-btn{padding:11px 26px;border-radius:12px;border:1px solid rgba(255,255,255,.05);background:transparent;color:#475569;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s}
.pl-cancel-btn:hover{background:rgba(255,255,255,.025);color:#94a3b8;border-color:rgba(255,255,255,.08)}

/* --- RESPONSIVE --- */
@media(max-width:640px){
  .pl-page{padding:16px 14px}
  .pl-header{flex-direction:column;align-items:stretch;gap:12px}
  .pl-header h1{font-size:20px}
  .pl-div-dd{align-self:flex-start}
  .pl-toolbar{flex-direction:column;align-items:stretch}
  .pl-search{min-width:0;flex:1}
  .pl-add-btn{justify-content:center}
  .pl-team-card{flex-direction:column;text-align:center;padding:18px;gap:12px}
  .pl-tc-stats{justify-content:center;gap:20px}
  .pl-tabs{width:100%}
  .pl-tab{flex:1;justify-content:center;padding:11px 12px;font-size:12px}
  .pl-card{flex-wrap:wrap;gap:8px;padding:10px 12px}
  .pl-card-pos,.pl-card-stats,.pl-card-pj{display:none!important}
  .pl-card-actions{width:100%;justify-content:flex-end;opacity:1}
  .ab{width:30px;height:30px}
  .pl-pitch{max-width:100%;aspect-ratio:.7}
  .pl-pitch-dot{width:34px;height:34px;font-size:10px}
  .pl-pitch-name{font-size:8px}
  .pl-subs-grid{grid-template-columns:1fr}
  .pl-fm-bar{flex-direction:column;align-items:stretch;gap:10px}
  .pl-fm-btns{justify-content:center;flex-wrap:wrap}
  .pl-fm-btn{padding:8px 14px;font-size:12px}
  .pl-tit-row{flex-direction:column;align-items:stretch}
  .pl-stats-grid{grid-template-columns:repeat(2,1fr)}
  .pl-modal{border-radius:20px}
  .pl-modal-top,.pl-modal-bottom{padding:18px 20px}
  .pl-modal-body{padding:20px}
  .pl-row2{grid-template-columns:1fr;gap:0}
}
      `}</style>
    </div>
  );
}