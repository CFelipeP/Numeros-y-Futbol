import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import axios from "axios";
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  ChevronDown, Plus, Pencil, Trash2, Save, X,
  Search, User, Target, Trophy, Star, Eye as EyeIcon,
  Upload, Download, ArrowLeftRight,
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

// ─── Posiciones ───────────────────────────────────────────────────────────────
const posiciones = [
  { value: "portero", label: "Portero", cat: "portero", color: "#f59e0b", abbr: "POR" },
  { value: "lateral_izquierdo", label: "Lat. Izquierdo", cat: "defensa", color: "#3b82f6", abbr: "LI" },
  { value: "lateral_derecho", label: "Lat. Derecho", cat: "defensa", color: "#3b82f6", abbr: "LD" },
  { value: "central", label: "Central", cat: "defensa", color: "#3b82f6", abbr: "DFC" },
  { value: "medio_defensivo", label: "Medio Defensivo", cat: "medio", color: "#10b981", abbr: "MCD" },
  { value: "medio_central", label: "Medio Central", cat: "medio", color: "#10b981", abbr: "MC" },
  { value: "medio_ofensivo", label: "Medio Ofensivo", cat: "medio", color: "#059669", abbr: "MCO" },
  { value: "extremo_izquierdo", label: "Ext. Izquierdo", cat: "delantero", color: "#f97316", abbr: "EI" },
  { value: "extremo_derecho", label: "Ext. Derecho", cat: "delantero", color: "#f97316", abbr: "ED" },
  { value: "centrodelantero", label: "Centrodelantero", cat: "delantero", color: "#ef4444", abbr: "DC" },
  { value: "segundo_delantero", label: "2do Delantero", cat: "delantero", color: "#f87171", abbr: "SD" },
];

const POSICION_MAPEO = {
  portero: "portero",
  defensa: "central",
  medio: "medio_central",
  mediocampista: "medio_central",
  lateral: "lateral_derecho",
  extremo: "extremo_derecho",
  delantero: "centrodelantero",
};

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
  portero: ["portero"],
  defensa: ["central", "lateral_izquierdo", "lateral_derecho", "defensa"],
  medio: ["medio_central", "medio_defensivo", "medio_ofensivo", "extremo_izquierdo", "extremo_derecho", "medio"],
  delantero: ["centrodelantero", "segundo_delantero", "delantero"],
  lateral_izquierdo: ["lateral_izquierdo", "lateral_derecho", "defensa"],
  lateral_derecho: ["lateral_derecho", "lateral_izquierdo", "defensa"],
  central: ["central", "medio_defensivo", "defensa"],
  medio_defensivo: ["medio_defensivo", "medio_central", "central", "medio"],
  medio_central: ["medio_central", "medio_defensivo", "medio_ofensivo", "medio"],
  medio_ofensivo: ["medio_ofensivo", "medio_central", "segundo_delantero", "medio"],
  extremo_izquierdo: ["extremo_izquierdo", "extremo_derecho", "delantero", "centrodelantero"],
  extremo_derecho: ["extremo_derecho", "extremo_izquierdo", "delantero", "centrodelantero"],
  centrodelantero: ["centrodelantero", "segundo_delantero", "delantero"],
  segundo_delantero: ["segundo_delantero", "centrodelantero", "medio_ofensivo", "delantero"],
};

function normalizarPosicion(v) {
  if (!v) return "centrodelantero";
  const low = v.toLowerCase().trim();
  const map = {
    portero: "portero", arquero: "portero", gk: "portero",
    defensa: "central", central: "central", dfc: "central",
    lateral: "lateral_derecho", li: "lateral_izquierdo", ld: "lateral_derecho",
    centrocampista: "medio_central", medio: "medio_central", mediocampista: "medio_central",
    mediocampo: "medio_central", "medio campo": "medio_central", mc: "medio_central",
    mcd: "medio_defensivo", mco: "medio_ofensivo", midfielder: "medio_central",
    extremo: "extremo_derecho", ei: "extremo_izquierdo", ed: "extremo_derecho", winger: "extremo_derecho",
    delantero: "centrodelantero", dc: "centrodelantero", striker: "centrodelantero",
  };
  if (posiciones.some(p => p.value === low)) return low;
  return map[low] || "centrodelantero";
}

function getPosInfo(v) {
  const norm = normalizarPosicion(v);
  return posiciones.find(p => p.value === norm) || posiciones[9];
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
    { sp: "portero", sc: "portero", x: 50, y: 90 },
    { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 }, { sp: "central", sc: "defensa", x: 36, y: 74 },
    { sp: "central", sc: "defensa", x: 64, y: 74 }, { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 },
    { sp: "extremo_izquierdo", sc: "delantero", x: 18, y: 48 }, { sp: "medio_central", sc: "medio", x: 40, y: 46 },
    { sp: "medio_central", sc: "medio", x: 60, y: 46 }, { sp: "extremo_derecho", sc: "delantero", x: 82, y: 48 },
    { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 },
  ],
  "4-3-3": [
    { sp: "portero", sc: "portero", x: 50, y: 90 },
    { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 }, { sp: "central", sc: "defensa", x: 36, y: 74 },
    { sp: "central", sc: "defensa", x: 64, y: 74 }, { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 },
    { sp: "medio_defensivo", sc: "medio", x: 28, y: 48 }, { sp: "medio_central", sc: "medio", x: 50, y: 44 },
    { sp: "medio_defensivo", sc: "medio", x: 72, y: 48 },
    { sp: "extremo_izquierdo", sc: "delantero", x: 18, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 },
    { sp: "extremo_derecho", sc: "delantero", x: 82, y: 22 },
  ],
  "3-5-2": [
    { sp: "portero", sc: "portero", x: 50, y: 90 },
    { sp: "central", sc: "defensa", x: 25, y: 74 }, { sp: "central", sc: "defensa", x: 50, y: 76 }, { sp: "central", sc: "defensa", x: 75, y: 74 },
    { sp: "lateral_izquierdo", sc: "defensa", x: 10, y: 50 }, { sp: "medio_central", sc: "medio", x: 30, y: 48 },
    { sp: "medio_central", sc: "medio", x: 50, y: 44 }, { sp: "medio_central", sc: "medio", x: 70, y: 48 },
    { sp: "lateral_derecho", sc: "defensa", x: 90, y: 50 },
    { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 },
  ],
  "4-2-3-1": [
    { sp: "portero", sc: "portero", x: 50, y: 90 },
    { sp: "lateral_izquierdo", sc: "defensa", x: 12, y: 70 }, { sp: "central", sc: "defensa", x: 36, y: 74 },
    { sp: "central", sc: "defensa", x: 64, y: 74 }, { sp: "lateral_derecho", sc: "defensa", x: 88, y: 70 },
    { sp: "medio_defensivo", sc: "medio", x: 38, y: 56 }, { sp: "medio_defensivo", sc: "medio", x: 62, y: 56 },
    { sp: "extremo_izquierdo", sc: "delantero", x: 20, y: 38 }, { sp: "medio_ofensivo", sc: "medio", x: 50, y: 34 },
    { sp: "extremo_derecho", sc: "delantero", x: 80, y: 38 },
    { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 },
  ],
  "5-3-2": [
    { sp: "portero", sc: "portero", x: 50, y: 90 },
    { sp: "lateral_izquierdo", sc: "defensa", x: 8, y: 66 }, { sp: "central", sc: "defensa", x: 28, y: 74 },
    { sp: "central", sc: "defensa", x: 50, y: 76 }, { sp: "central", sc: "defensa", x: 72, y: 74 },
    { sp: "lateral_derecho", sc: "defensa", x: 92, y: 66 },
    { sp: "medio_central", sc: "medio", x: 28, y: 48 }, { sp: "medio_central", sc: "medio", x: 50, y: 44 },
    { sp: "medio_central", sc: "medio", x: 72, y: 48 },
    { sp: "centrodelantero", sc: "delantero", x: 36, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 64, y: 22 },
  ],
  "3-4-3": [
    { sp: "portero", sc: "portero", x: 50, y: 90 },
    { sp: "central", sc: "defensa", x: 25, y: 74 }, { sp: "central", sc: "defensa", x: 50, y: 76 }, { sp: "central", sc: "defensa", x: 75, y: 74 },
    { sp: "extremo_izquierdo", sc: "delantero", x: 12, y: 50 }, { sp: "medio_central", sc: "medio", x: 38, y: 48 },
    { sp: "medio_central", sc: "medio", x: 62, y: 48 }, { sp: "extremo_derecho", sc: "delantero", x: 88, y: 50 },
    { sp: "extremo_izquierdo", sc: "delantero", x: 18, y: 22 }, { sp: "centrodelantero", sc: "delantero", x: 50, y: 18 },
    { sp: "extremo_derecho", sc: "delantero", x: 82, y: 22 },
  ],
};

// ─── autoAssign: asigna jugadores a slots SIN depender de es_titular ─────────
function autoAssign(jugadores, fKey) {
  const tpl = formations[fKey];
  if (!tpl || !jugadores?.length) return { starters: [], subs: [...jugadores] };

  const sorted = [...jugadores].sort((a, b) => {
    // Ordenar por posición compatible primero, luego por nombre
    const posA = normalizarPosicion(a.posicion);
    const posB = normalizarPosicion(b.posicion);
    return posA.localeCompare(posB);
  });

  const used = new Set();
  const starters = [];
  const filled = new Set();
  const pick = fn => sorted.find(j => fn(j) && !used.has(j.id));

  // Paso 1: posición exacta o compatible
  for (let i = 0; i < tpl.length; i++) {
    const s = tpl[i];
    const compat = posCompat[s.sp] || [s.sp];
    const p = pick(j => {
      const n = normalizarPosicion(j.posicion);
      return compat.some(c => c === n || c === j.posicion);
    });
    if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); }
  }

  // Paso 2: misma categoría
  for (let i = 0; i < tpl.length; i++) {
    if (filled.has(i)) continue;
    const s = tpl[i];
    const p = pick(j => getPosInfo(j.posicion).cat === s.sc);
    if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); }
  }

  // Paso 3: cualquiera (excepto portero en campo)
  for (let i = 0; i < tpl.length; i++) {
    if (filled.has(i)) continue;
    const s = tpl[i];
    const p = pick(j => !(s.sc !== "portero" && getPosInfo(j.posicion).cat === "portero"));
    if (p) { starters.push({ ...p, px: s.x, py: s.y }); used.add(p.id); filled.add(i); }
  }

  return { starters, subs: jugadores.filter(j => !used.has(j.id)) };
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const navItems = [
  { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
  { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
  {
    type: "dropdown", icon: <Shield size={20} />, label: "Equipos", children: [
      { path: "/teams/primera", label: "Primera Division" },
      { path: "/teams/segunda", label: "Segunda Division" },
      { path: "/teams/tercera", label: "Tercera Division" },
    ]
  },
  { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
  { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
  { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Publicas" },
  { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
  { path: "/settings", icon: <Settings size={20} />, label: "Configuracion" },
];

// ─── TeamSelect ───────────────────────────────────────────────────────────────
const TeamSelect = memo(function TeamSelect({ equipos, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
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
            <button key={eq.id} className={"pl-team-sel-opt" + (String(eq.id) === String(value) ? " active" : "")}
              onClick={() => { onChange(parseInt(eq.id)); setOpen(false); }}>
              {eq.logo ? <img src={API + eq.logo} className="pl-team-sel-opt-logo" alt="" /> : <Shield size={14} className="pl-team-sel-icon" />}
              <span>{eq.nombre}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// ─── PlayerCard (sin badge TIT/SUP) ──────────────────────────────────────────
const PlayerCard = memo(function PlayerCard({ j, isInSlot, onStats, onEdit, onDelete, onSwap }) {
  const pi = getPosInfo(j.posicion);
  const isGK = pi.cat === "portero";
  const fotoUrl = j.foto ? API + j.foto : null;

  return (
    <div className={"pl-card" + (isInSlot ? " pl-card-in-slot" : "")}>
      <div className="pl-card-num" data-color={pi.color}>{j.numero_camiseta || "-"}</div>
      <div className="pl-card-photo">
        {fotoUrl ? <img src={fotoUrl} alt="" /> : <User size={18} />}
      </div>
      <div className="pl-card-info">
        <span className="pl-card-name">{j.nombre}</span>
        <span className="pl-card-meta">
          {[j.edad && j.edad + " años", j.nacionalidad].filter(Boolean).join(" · ")}
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

      {/* Botón cambio */}
      <button className="pl-card-swap" onClick={() => onSwap(j)} title="Gestionar cambio">
        <ArrowLeftRight size={13} />
      </button>

      <div className="pl-card-actions">
        <button className="ab ab-blue" onClick={() => onStats(j)} title="Estadisticas"><Pencil size={13} /></button>
        <button className="ab ab-yellow" onClick={() => onEdit(j)} title="Editar"><EyeIcon size={13} /></button>
        <button className="ab ab-red" onClick={() => onDelete(j)} title="Eliminar"><Trash2 size={13} /></button>
      </div>
    </div>
  );
});

const PosSection = memo(function PosSection({ cat, jugadores, slotIds, ...h }) {
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
        {jugadores.map(j => (
          <PlayerCard key={j.id} j={j} isInSlot={slotIds.has(j.id)} {...h} />
        ))}
      </div>
    </div>
  );
});

// ─── Componente principal ─────────────────────────────────────────────────────
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
  const [slots, setSlots] = useState([]);
  // Form SIN es_titular
  const [form, setForm] = useState({
    nombre: "", posicion: "centrodelantero", numero_camiseta: "",
    edad: "", nacionalidad: "", foto: ""
  });
  const [statsForm, setStatsForm] = useState({});
  const debounceRef = useRef(null);
  const [division, setDivision] = useState(() => localStorage.getItem("admin_division") || "primera");
  const [divDD, setDivDD] = useState(false);
  const divRef = useRef(null);

  // Import CSV
  const [importModal, setImportModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvText, setCsvText] = useState("");
  const [csvPreview, setCsvPreview] = useState([]);
  const [importing, setImporting] = useState(false);

  // Modal de cambio
  const [swapModal, setSwapModal] = useState(false);
  const [swapPlayer, setSwapPlayer] = useState(null);
  const [swapMode, setSwapMode] = useState(null); // "salir" | "entrar"

  useEffect(() => { localStorage.setItem("admin_division", division); }, [division]);
  useEffect(() => { if (window.innerWidth > 768) setSidebarOpen(true); }, []);
  useEffect(() => {
    const h = e => { if (divRef.current && !divRef.current.contains(e.target)) setDivDD(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ─── Construir slots cuando cambia plantilla o formación ──────────────────
  useEffect(() => {
  if (!plantilla?.jugadores) return;

  // 🔍 verificar si hay posiciones guardadas
  const hayGuardados = plantilla.jugadores.some(
    j => j.pos_x != null && j.pos_y != null
  );

  if (hayGuardados) {
    // ✅ usar posiciones del backend
    const titulares = plantilla.jugadores
      .filter(j => j.pos_x != null && j.pos_y != null)
      .map((j, i) => ({
        id: i,
        x: parseFloat(j.pos_x),
        y: parseFloat(j.pos_y),
        jugador: j
      }));

    setSlots(titulares);

  } else {
    // ⚡ fallback: auto asignación
    const { starters } = autoAssign(plantilla.jugadores, formacion);

    const newSlots = starters.map((j, i) => ({
      id: i,
      x: j.px,
      y: j.py,
      jugador: j
    }));

    setSlots(newSlots);
  }

}, [plantilla, formacion]);

  // ─── Cargar equipos ──────────────────────────────────────────────────────
  useEffect(() => {
    const ep = getEndpoints(division);
    const savedId = parseInt(localStorage.getItem("admin_plantilla_team_" + division));
    setLoading(true);
    setEquipos([]);
    setPlantilla(null);
    axios.get(ep.teams).then(r => {
      const d = Array.isArray(r.data) ? r.data : (r.data?.equipos || []);
      setEquipos(d);
      if (savedId && d.some(e => String(e.id) === String(savedId))) {
        setEquipoId(savedId);
        loadPlantilla(savedId);
      } else {
        setEquipoId("");
      }
    }).catch(() => setEquipos([])).finally(() => setLoading(false));
  }, [division]);

  const onSearchChange = useCallback(e => {
    const v = e.target.value;
    setSearchInput(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(v), 300);
  }, []);

  const clearSearch = useCallback(() => { setSearchInput(""); setSearch(""); }, []);

  const loadPlantilla = useCallback(async (id) => {
  if (!id) {
    setPlantilla(null);
    setSlots([]);
    return;
  }

  setLoading(true);
  const ep = getEndpoints(division);

  try {
    const r = await axios.get(ep.crud + "?equipo_id=" + id);

    if (r.data.success) {
      const jugadores = r.data.jugadores || [];

      // ✅ construir slots desde DB
      const titulares = jugadores
        .filter(j => j.pos_x != null && j.pos_y != null)
        .map(j => ({
          jugador: j,
          x: parseFloat(j.pos_x),
          y: parseFloat(j.pos_y)
        }));

      setSlots(titulares);

      setPlantilla({
        ...r.data,
        jugadores
      });

      if (r.data.equipo?.formacion) {
        setFormacion(r.data.equipo.formacion);
      }

    } else {
      Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "warning",
        title: r.data.error || "No se pudo cargar"
      });
    }

  } catch (err) {
    Swal.fire({
      background: "#1e293b",
      color: "#fff",
      icon: "error",
      title: err.response?.status === 404
        ? "Archivo no encontrado"
        : "Error de conexion"
    });
  } finally {
    setLoading(false);
  }
}, [division]);

  const handleEquipoChange = useCallback((id) => {
    setEquipoId(parseInt(id));
    localStorage.setItem("admin_plantilla_team_" + division, id);
    setSearchInput(""); setSearch(""); setTab("plantilla");
    loadPlantilla(id);
  }, [loadPlantilla, division]);

  // ─── Set de IDs que están en slots (para saber quién es "titular" visualmente) ─
  const slotIds = useMemo(
    () => new Set(slots.map(s => s.jugador?.id).filter(Boolean)),
    [slots]
  );

  const enCanchaCount = slots.length;

  // ─── Suplentes = jugadores que NO están en ningún slot ────────────────────
  const suplentes = useMemo(
    () => (plantilla?.jugadores || []).filter(j => !slotIds.has(j.id)),
    [plantilla, slotIds]
  );

  // ─── Abrir modal de cambio ───────────────────────────────────────────────
  const openSwap = useCallback((jugador) => {
    setSwapPlayer(jugador);
    // Si está en slot → sale del campo, elegimos quién entra
    // Si NO está en slot → entra al campo, elegimos quién sale
    setSwapMode(slotIds.has(jugador.id) ? "salir" : "entrar");
    setSwapModal(true);
  }, [slotIds]);

  // ─── Ejecutar el cambio (solo UI, sin backend) ───────────────────────────
  const executeSwap = useCallback(async (otro) => {
    setSwapModal(false);
    if (!swapPlayer || !otro || swapPlayer.id === otro.id) return;

    const posA = normalizarPosicion(swapPlayer.posicion);
    const posB = normalizarPosicion(otro.posicion);

    if (posA !== posB) {
      const confirm = await Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "question",
        title: "Cambio de posición",
        text: "Los jugadores no son de la misma posición. ¿Continuar?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
      });
      if (!confirm.isConfirmed) return;
    }

    setSlots(prev => {
      return prev.map(slot => {
        // CASO 1: swapPlayer está en cancha → sale
        if (slot.jugador.id === swapPlayer.id) {
          return { ...slot, jugador: otro };
        }

        // CASO 2: otro está en cancha → sale
        if (slot.jugador.id === otro.id) {
          return { ...slot, jugador: swapPlayer };
        }

        return slot;
      });
    });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Cambio realizado",
      showConfirmButton: false,
      timer: 1200,
      background: "#1e293b",
      color: "#fff"
    });

    setSwapPlayer(null);
  }, [swapPlayer]);


  const closeSwap = useCallback(() => {
    setSwapModal(false);
    setSwapPlayer(null);
    setSwapMode(null);
  }, []);

  // ── CRUD jugador ──────────────────────────────────────────────────────────
  const openCreate = useCallback(() => {
    setForm({ nombre: "", posicion: "centrodelantero", numero_camiseta: "", edad: "", nacionalidad: "", foto: "" });
    setEditPlayer(null);
    setModal("player");
  }, []);

  const openEdit = useCallback((j) => {
    setForm({
      nombre: j.nombre,
      posicion: normalizarPosicion(j.posicion),
      numero_camiseta: j.numero_camiseta || "",
      edad: j.edad || "",
      nacionalidad: j.nacionalidad || "",
      foto: j.foto || "",
    });
    setEditPlayer(j);
    setModal("player");
  }, []);

  const openStats = useCallback((j) => {
    const fields = getPosInfo(j.posicion).cat === "portero" ? gkStatFields : statFields;
    const init = { temporada: j.temporada || "2025-2026" };
    fields.forEach(f => { init[f.key] = j[f.key] || 0; });
    setStatsForm(init);
    setEditStats(j);
    setModal("stats");
  }, []);

  const deletePlayer = useCallback(async (j) => {
    const ok = await Swal.fire({
      background: "#1e293b", color: "#fff", title: "Eliminar a " + j.nombre + "?",
      icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444",
      confirmButtonText: "Eliminar", cancelButtonText: "Cancelar"
    });
    if (!ok.isConfirmed) return;
    const ep = getEndpoints(division);
    try {
      const r = await axios.delete(ep.crud + "?id=" + j.id);
      if (r.data.success) {
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Eliminado", showConfirmButton: false, timer: 1500, background: "#1e293b", color: "#fff" });
        loadPlantilla(equipoId);
      }
    } catch {
      Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "No se pudo eliminar" });
    }
  }, [equipoId, loadPlantilla, division]);

  const validateForm = useCallback(() => {
    if (!form.nombre.trim()) { Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "El nombre es obligatorio" }); return false; }
    if (form.edad !== "") { const e = parseInt(form.edad); if (isNaN(e) || e < 16 || e > 50) { Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "Edad: 16-50" }); return false; } }
    if (form.numero_camiseta !== "") { const d = parseInt(form.numero_camiseta); if (isNaN(d) || d < 1 || d > 99) { Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "Dorsal: 1-99" }); return false; } }
    return true;
  }, [form]);

  const savePlayer = async () => {
    if (!validateForm()) return;

    if (form.numero_camiseta) {
      const num = parseInt(form.numero_camiseta);
      const dup = (plantilla?.jugadores || []).find(j => j.numero_camiseta == num && (!editPlayer || j.id !== editPlayer.id));
      if (dup) {
        Swal.fire({ background: "#1e293b", color: "#fff", icon: "warning", title: "Número duplicado", text: `El dorsal ${num} ya lo usa ${dup.nombre}`, confirmButtonColor: "#0f766e" });
        return;
      }
    }

    setSaving(true);
    const ep = getEndpoints(division);
    try {
      const p = {
        action: editPlayer ? "update" : "create",
        equipo_id: editPlayer ? editPlayer.equipo_id : parseInt(equipoId),
        nombre: form.nombre.trim(),
        posicion: normalizarPosicion(form.posicion),
        numero_camiseta: form.numero_camiseta ? parseInt(form.numero_camiseta) : null,
        edad: form.edad ? parseInt(form.edad) : null,
        nacionalidad: form.nacionalidad.trim(),
        foto: form.foto,
        // SIN es_titular — el backend no necesita saberlo
      };
      if (editPlayer) p.id = editPlayer.id;
      const r = await axios.post(ep.crud, p);
      if (r.data.success) {
        setModal(null);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Guardado", showConfirmButton: false, timer: 1500, background: "#1e293b", color: "#fff" });
        loadPlantilla(equipoId);
      } else {
        Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: r.data.error || "Error" });
      }
    } catch (e) {
      Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: e.response?.data?.error || "Error de conexion" });
    } finally { setSaving(false); }
  };

  const saveStats = async () => {
    setSaving(true);
    const ep = getEndpoints(division);
    try {
      const r = await axios.post(ep.crud, { action: "update_stats", jugador_id: editStats.id, ...statsForm });
      if (r.data.success) {
        setModal(null);
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Estadisticas guardadas", showConfirmButton: false, timer: 1500, background: "#1e293b", color: "#fff" });
        loadPlantilla(equipoId);
      }
    } catch (e) {
      Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: e.response?.data?.error || "Error" });
    } finally { setSaving(false); }
  };

  const handleFoto = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("foto", f);
    const ep = getEndpoints(division);
    try {
      const r = await axios.post(ep.upload, fd);
      if (r.data.success) setForm(p => ({ ...p, foto: r.data.path }));
    } catch {
      Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "No se pudo subir la foto" });
    }
  };

  const saveFormation = useCallback(async () => {
    if (!slots.length) {
      Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "warning",
        title: "No hay jugadores en cancha"
      });
      return;
    }

    setSaving(true);
    const ep = getEndpoints(division);

    try {
      const titulares = slots.map(s => ({
        id: s.jugador.id,
        x: s.x,
        y: s.y
      }));

      const r = await axios.post(ep.crud, {
        action: "save_formation",
        equipo_id: equipoId,
        formacion,
        titulares: JSON.stringify(titulares)
      });

      if (r.data.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Formación guardada",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e293b",
          color: "#fff"
        });
      } else {
        throw new Error(r.data.error || "Error desconocido");
      }

    } catch (e) {
      Swal.fire({
        background: "#1e293b",
        color: "#fff",
        icon: "error",
        title: "Error al guardar",
        text: e.message
      });
    } finally {
      setSaving(false);
    }
  }, [slots, equipoId, formacion, division]);

  // ─── Agrupación para tab plantilla ───────────────────────────────────────
  const groups = useMemo(() => {
    if (!plantilla?.jugadores) return { portero: [], defensa: [], medio: [], delantero: [] };
    const all = { portero: [], defensa: [], medio: [], delantero: [] };
    plantilla.jugadores.forEach(j => {
      const c = getPosInfo(j.posicion).cat;
      if (all[c]) all[c].push(j);
    });
    if (!search.trim()) return all;
    const s = search.toLowerCase();
    const out = { portero: [], defensa: [], medio: [], delantero: [] };
    for (const c of Object.keys(all)) out[c] = all[c].filter(j => j.nombre.toLowerCase().includes(s));
    return out;
  }, [plantilla, search]);

  const total = plantilla?.jugadores?.length || 0;
  const filteredCount = useMemo(() => Object.values(groups).reduce((a, b) => a + b.length, 0), [groups]);
  const curDiv = DIVISIONES.find(d => d.key === division);

  // ─── Import CSV ──────────────────────────────────────────────────────────
  const openImport = useCallback(() => { setCsvFile(null); setCsvText(""); setCsvPreview([]); setImportModal(true); }, []);
  const closeImport = useCallback(() => { setImportModal(false); setCsvFile(null); setCsvText(""); setCsvPreview([]); }, []);

  const parseCSVPreview = useCallback((text) => {
    const lines = text.trim().split("\n").filter(l => l.trim());
    if (!lines.length) { setCsvPreview([]); return; }
    const h = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const v = lines[i].split(",").map(x => x.trim().toLowerCase());
      if (v.length < 2 || !v[0]) continue;
      const row = {};
      h.forEach((key, idx) => { row[key] = v[idx] ?? ""; });
      if (row.posicion) {
        row.posicion_original = row.posicion;
        row.posicion = normalizarPosicion(row.posicion);
      }
      if (row.nombre) rows.push(row);
    }
    setCsvPreview(rows);
  }, []);

  const downloadTemplate = useCallback(() => {
    const t = `nombre,posicion,numero_camiseta,edad,nacionalidad,pj,goles,asistencias,goles_penal,goles_cabeza,goles_tiro_libre,tarjetas_amarillas,tarjetas_rojas,minutos_jugados,goles_recibidos,vaya_invicta\nJuan Perez,centrodelantero,9,24,Salvadoreno,1,13,9,2,0,0,3,0,0,980,0,0\nCarlos Lopez,medio_central,10,22,Salvadoreno,0,15,5,8,0,0,2,4,1,1300,0,0`;
    const blob = new Blob([t], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `plantilla_${division}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [division]);

  const importPlayers = useCallback(async () => {
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("equipo_id", equipoId);
      fd.append("division", division);
      const headers = Object.keys(csvPreview[0] || {}).filter(k => k !== "posicion_original");
      const lines = [headers.join(",")];
      csvPreview.forEach(row => {
        lines.push(headers.map(h => row[h] ?? "").join(","));
      });
      fd.append("csv_text", lines.join("\n"));
      const r = await axios.post(API + "importar_jugadores.php", fd);
      if (r.data.success) {
        closeImport();
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: r.data.importados + " jugadores importados", showConfirmButton: false, timer: 2000, background: "#1e293b", color: "#fff" });
        loadPlantilla(equipoId);
      } else {
        const errorMsg = r.data.error || (r.data.errores || []).join("\n") || JSON.stringify(r.data);
        Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "Error en importacion", text: errorMsg });
      }
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      Swal.fire({ background: "#1e293b", color: "#fff", icon: "error", title: "Error de conexion", text: msg });
    } finally { setImporting(false); }
  }, [equipoId, loadPlantilla, division, csvPreview, closeImport]);

  const handleLogout = () => {
    Swal.fire({ background: "#1e293b", color: "#fff", title: "Cerrar sesion?", icon: "warning", showCancelButton: true, confirmButtonText: "Si", cancelButtonText: "No" })
      .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); window.location.href = "/login"; } });
  };

  const navClick = useCallback(() => { if (window.innerWidth <= 768) setSidebarOpen(false); setDdOpen(false); }, []);
  const handlers = useMemo(() => ({ onStats: openStats, onEdit: openEdit, onDelete: deletePlayer, onSwap: openSwap }), [openStats, openEdit, deletePlayer, openSwap]);

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className={"admin-layout" + (sidebarOpen ? " sidebar-open" : "")}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="" />
          </div>
          <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, i) => {
              if (item.type === "dropdown") {
                const a = item.children.some(c => location.pathname === c.path);
                return (
                  <li key={i}>
                    <button className={"nav-item" + (a ? " active" : "")} onClick={() => setDdOpen(!ddOpen)} style={{ width: "100%", justifyContent: "space-between" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 14 }}>{item.icon} {item.label}</span>
                      <ChevronDown size={16} style={{ transform: ddOpen ? "rotate(180deg)" : "", transition: "transform .2s" }} />
                    </button>
                    <ul className={"teams-dropdown" + (ddOpen ? " dropdown-visible" : "")}>
                      {item.children.map(c => (
                        <li key={c.path}>
                          <Link to={c.path} className={"nav-item nav-subitem" + (location.pathname === c.path ? " active" : "")} onClick={navClick}>{c.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={item.path}>
                  <Link to={item.path} className={"nav-item" + (location.pathname === item.path ? " active" : "")} onClick={navClick}>{item.icon} {item.label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}><LogOut size={20} className="nav-icon" /> Cerrar sesion</button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* MAIN */}
      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
          <span className="top-bar-title">Gestion de Plantillas</span>
        </header>

        <div className="pl-page">
          {/* Header */}
          <div className="pl-header">
            <h1>Plantillas</h1>
            <div ref={divRef} className="pl-div-dd">
              <button className="pl-div-btn" onClick={() => setDivDD(!divDD)}>
                <Trophy size={14} />{curDiv.icon} {curDiv.label} Division
                <ChevronDown size={15} className={"pl-div-arrow" + (divDD ? " open" : "")} />
              </button>
              <div className={"pl-div-drop" + (divDD ? " show" : "")}>
                {DIVISIONES.map(d => (
                  <button key={d.key} className={"pl-div-opt" + (division === d.key ? " active" : "")}
                    onClick={() => { setDivision(d.key); setDivDD(false); }}>
                    <span>{d.icon}</span> {d.label} Division
                    {division === d.key && <span className="pl-div-dot" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="pl-toolbar">
            <TeamSelect equipos={equipos} value={equipoId} onChange={handleEquipoChange} />
            {plantilla && (
              <div className="pl-search">
                <Search size={15} className="pl-search-ic" />
                <input value={searchInput} onChange={onSearchChange} placeholder="Buscar jugador..." />
                {searchInput && <button className="pl-search-x" onClick={clearSearch}><X size={11} /></button>}
              </div>
            )}
            {plantilla && <button className="pl-add-btn" onClick={openCreate}><Plus size={15} /> Agregar</button>}
            {plantilla && <button className="pl-import-btn" onClick={openImport}><Upload size={15} /> Importar CSV</button>}
          </div>

          {/* Contador: jugadores en cancha (basado en slots, NO en es_titular) */}
          {plantilla && (
            <div className="pl-tit-counter">
              <div className="pl-tit-dots">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className={"pl-tit-dot" + (i < enCanchaCount ? " filled" : "")} />
                ))}
              </div>
              <span className="pl-tit-label">{enCanchaCount}/11 en cancha</span>
              <span className="pl-tit-hint">Usa el botón <ArrowLeftRight size={11} style={{ display: "inline", verticalAlign: "middle" }} /> para gestionar cambios</span>
            </div>
          )}

          {!loading && equipos.length === 0 && (
            <div className="pl-empty"><Shield size={40} /><p>No hay equipos en {curDiv?.label} Division</p><p>Crea equipos desde la seccion de Equipos primero</p></div>
          )}

          {plantilla?.equipo && (
            <div className="pl-team-card">
              <div className="pl-tc-logo">
                {plantilla?.equipo.logo ? (
                  <img src={API + plantilla?.equipo.logo} alt="" />
                ) : (
                  <div style={{ width: "100%", height: "100%" }} />
                )}
              </div>
              <div className="pl-tc-info">
                <h3>{plantilla?.equipo.nombre || "Sin nombre"}</h3>
                <p>{[plantilla?.equipo.ciudad, plantilla?.equipo.estadio].filter(Boolean).join(" - ")}</p>
              </div>
              <div className="pl-tc-stats">
                <div className="pl-tc-stat"><b>{total}</b><span>Jugadores</span></div>
                <div className="pl-tc-div" />
                <div className="pl-tc-stat"><b className="text-amber">{enCanchaCount}</b><span>En cancha</span></div>
                <div className="pl-tc-div" />
                <div className="pl-tc-stat"><b className="text-slate">{total - enCanchaCount}</b><span>Banca</span></div>
              </div>
            </div>
          )}

          {plantilla && total > 0 && (
            <div className="pl-tabs">
              <button className={"pl-tab" + (tab === "plantilla" ? " active" : "")} onClick={() => setTab("plantilla")}><Users size={14} /> Plantilla</button>
              <button className={"pl-tab" + (tab === "formacion" ? " active" : "")} onClick={() => setTab("formacion")}><Target size={14} /> Formacion</button>
            </div>
          )}

          {loading && <div className="pl-empty"><div className="pl-spinner" /><p>Cargando {curDiv?.label}...</p></div>}

          {!loading && !plantilla && equipos.length > 0 && (
            <div className="pl-empty"><Users size={40} /><p>Selecciona un equipo</p><p>Elige del menu desplegable para ver su plantilla</p></div>
          )}

          {/* TAB: PLANTILLA */}
          {!loading && plantilla && tab === "plantilla" && (
            total === 0 ? (
              <div className="pl-empty"><p>Sin jugadores registrados</p><button className="pl-add-btn" onClick={openCreate}><Plus size={15} /> Agregar primero</button></div>
            ) : (
              <div>
                {searchInput.trim() && (
                  <div className="pl-filter-msg">{filteredCount > 0 ? filteredCount + " resultado" + (filteredCount !== 1 ? "s" : "") + " para " + searchInput : "Sin resultados para " + searchInput}</div>
                )}
                {Object.keys(catCfg).map(cat => (
                  <PosSection key={cat} cat={cat} jugadores={groups[cat]} slotIds={slotIds} {...handlers} />
                ))}
              </div>
            )
          )}

          {/* TAB: FORMACIÓN */}
          {!loading && plantilla && tab === "formacion" && (
            <div>
              <div className="pl-fm-bar">
                <div className="pl-fm-btns">
                  {Object.keys(formations).map(f => (
                    <button key={f} className={"pl-fm-btn" + (formacion === f ? " active" : "")} onClick={() => setFormacion(f)}>{f}</button>
                  ))}
                </div>
                <button className="pl-save-btn" onClick={saveFormation} disabled={saving}><Save size={14} />{saving ? "..." : "Guardar"}</button>
              </div>
              <div className="pl-pitch">
                <svg className="pl-pitch-svg" viewBox="0 0 680 1050" preserveAspectRatio="none">
                  <line x1="0" y1="525" x2="680" y2="525" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <circle cx="340" cy="525" r="91" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="136" y="1" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="224" y="1" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <path d="M 248 165 A 91 91 0 0 0 432 165" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="136" y="884" width="408" height="165" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="224" y="994" width="232" height="55" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <path d="M 248 885 A 91 91 0 0 1 432 885" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                </svg>
                {slots.map((slot) => {
                  const s = slot.jugador;
                  const pi = getPosInfo(s.posicion);
                  return (
                    <div
                      key={slot.id}
                      className="pl-pitch-player"
                      style={{ left: slot.x + "%", top: slot.y + "%" }}
                      onClick={() => openSwap(s)}
                    >
                      <div className="pl-pitch-dot" data-color={pi.color}>
                        {s.foto ? <img src={API + s.foto} /> : <span>{s.numero_camiseta}</span>}
                      </div>
                      <div className="pl-pitch-name">{s.nombre}</div>
                    </div>
                  );
                })}
                {enCanchaCount < 11 && (
                  <div className="pl-pitch-msg">{enCanchaCount}/11 — agrega más jugadores</div>
                )}
              </div>

              {/* Suplentes clickeables */}
              {suplentes.length > 0 && (
                <div className="pl-subs-card">
                  <h4 className="pl-subs-title">Banca ({suplentes.length}) — clic para gestionar cambio</h4>
                  <div className="pl-subs-grid">
                    {suplentes.map(s => {
                      const pi = getPosInfo(s.posicion);
                      return (
                        <button key={s.id} className="pl-sub-item" data-color={pi.color} onClick={() => openSwap(s)}>
                          <div className="pl-sub-photo">{s.foto ? <img src={API + s.foto} alt="" /> : <User size={14} />}</div>
                          <div className="pl-sub-info">
                            <span className="pl-sub-name">{s.nombre}</span>
                            <span className="pl-sub-meta">#{s.numero_camiseta || "-"} · {pi.label}</span>
                          </div>
                          <ArrowLeftRight size={14} className="pl-sub-swap-ic" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────────────
          MODAL DE CAMBIO (sin es_titular, usa slotIds)
      ──────────────────────────────────────────────────────────────────────── */}
      {swapModal && swapPlayer && plantilla && (
        <div className="pl-modal-bg" onClick={closeSwap}>
          <div className="pl-modal pl-swap-modal" onClick={e => e.stopPropagation()}>
            <div className="pl-modal-top">
              <div>
                <h3>Gestionar Cambio</h3>
                <p className="pl-modal-sub">
                  {swapMode === "salir"
                    ? <><span style={{ color: "#f87171" }}>Sale:</span> <b>{swapPlayer.nombre}</b> — ¿quién entra?</>
                    : <><span style={{ color: "#22d3ee" }}>Entra:</span> <b>{swapPlayer.nombre}</b> — ¿quién sale?</>
                  }
                </p>
              </div>
              <button className="pl-modal-x" onClick={closeSwap}><X size={18} /></button>
            </div>

            <div className="pl-modal-body">
              {/* Jugador en foco */}
              <div className={"pl-swap-focus " + (swapMode === "salir" ? "sale" : "entra")}>
                <div className="pl-swap-focus-label">{swapMode === "salir" ? "SALE DEL CAMPO" : "ENTRA AL CAMPO"}</div>
                <div className="pl-swap-focus-row">
                  <div className="pl-swap-photo lg">
                    {swapPlayer.foto ? <img src={API + swapPlayer.foto} alt="" /> : <User size={22} />}
                  </div>
                  <div>
                    <div className="pl-swap-name">{swapPlayer.nombre}</div>
                    <div className="pl-swap-pos">{getPosInfo(swapPlayer.posicion).label} · #{swapPlayer.numero_camiseta || "-"}</div>
                  </div>
                  <ArrowLeftRight size={20} className="pl-swap-arrow-ic" />
                </div>
              </div>

              <div className="pl-swap-list-label">
                {swapMode === "salir" ? "Elige quién entra ↓" : "Elige quién sale ↓"}
              </div>

              {/* Lista: usa slotIds en vez de es_titular */}
              <div className="pl-swap-list">
                {(swapMode === "salir"
                  ? plantilla.jugadores.filter(j => !slotIds.has(j.id) && j.id !== swapPlayer.id)
                  : plantilla.jugadores.filter(j => slotIds.has(j.id) && j.id !== swapPlayer.id)
                ).map(j => {
                  const pi = getPosInfo(j.posicion);
                  return (
                    <button key={j.id} className="pl-swap-row" onClick={() => executeSwap(j)}>
                      <div className="pl-swap-photo sm">
                        {j.foto ? <img src={API + j.foto} alt="" /> : <User size={14} />}
                      </div>
                      <div className="pl-swap-row-info">
                        <span className="pl-swap-name">{j.nombre}</span>
                        <span className="pl-swap-pos">{pi.label}</span>
                      </div>
                      <span className="pl-swap-dorsal" style={{ color: pi.color }}>#{j.numero_camiseta || "-"}</span>
                      <span className="pl-swap-abbr" style={{ color: pi.color, borderColor: pi.color + "30", background: pi.color + "10" }}>{pi.abbr}</span>
                    </button>
                  );
                })}
                {(swapMode === "salir"
                  ? plantilla.jugadores.filter(j => !slotIds.has(j.id) && j.id !== swapPlayer.id)
                  : plantilla.jugadores.filter(j => slotIds.has(j.id) && j.id !== swapPlayer.id)
                ).length === 0 && (
                    <div className="pl-swap-empty">
                      {swapMode === "salir" ? "No hay jugadores en banca" : "No hay otros jugadores en cancha"}
                    </div>
                  )}
              </div>
            </div>

            <div className="pl-modal-bottom" style={{ justifyContent: "flex-start" }}>
              <button className="pl-cancel-btn" onClick={closeSwap}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL IMPORT CSV ─────────────────────────────────────────────── */}
      {importModal && (
        <div className="pl-modal-bg" onClick={closeImport}>
          <div className="pl-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 740 }}>
            <div className="pl-modal-top">
              <div><h3>Importar Jugadores</h3><p className="pl-modal-sub">Sube un archivo CSV o pega el texto</p></div>
              <button className="pl-modal-x" onClick={closeImport}><X size={18} /></button>
            </div>
            <div className="pl-modal-body">
              <div style={{ marginBottom: 16 }}>
                <button className="pl-dl-btn" onClick={downloadTemplate}><Download size={13} /> Descargar plantilla CSV</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label className="pl-upload-btn" style={{ justifyContent: "center", padding: "18px 24px", borderRadius: 14, borderStyle: "dashed" }}>
                  <Upload size={16} /> Seleccionar archivo CSV
                  <input type="file" accept=".csv,text/csv" onChange={e => {
                    const f = e.target.files[0]; if (!f) return; setCsvFile(f);
                    const reader = new FileReader();
                    reader.onload = ev => { setCsvText(ev.target.result); parseCSVPreview(ev.target.result); };
                    reader.readAsText(f);
                  }} hidden />
                </label>
                <div style={{ textAlign: "center", fontSize: 11, color: "#334155" }}>o</div>
                <textarea
                  value={csvText}
                  onChange={e => { setCsvText(e.target.value); if (e.target.value.trim()) parseCSVPreview(e.target.value); else setCsvPreview([]); }}
                  placeholder="Pega aqui el contenido del CSV..."
                  style={{ width: "100%", minHeight: 100, padding: 14, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)", color: "#e2e8f0", fontSize: 11, fontFamily: "monospace", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              {csvFile && (
                <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#34d399", fontWeight: 600 }}>
                  <Upload size={15} /> {csvFile.name}
                  <button onClick={() => { setCsvFile(null); setCsvText(""); setCsvPreview([]); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 12 }}>Quitar</button>
                </div>
              )}
              {csvPreview.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 4px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 11, color: "#475569", fontWeight: 700 }}>{csvPreview.length} fila{csvPreview.length !== 1 ? "s" : ""} por importar</span>
                    <button onClick={() => { setCsvPreview([]); setCsvText(""); setCsvFile(null); }} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}>Limpiar</button>
                  </div>
                  <div style={{ maxHeight: 220, overflow: "auto", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "monospace" }}>
                      <thead><tr style={{ background: "rgba(255,255,255,0.04)", position: "sticky", top: 0 }}>
                        {["#", "Nombre", "Pos", "Original", "#", "Edad", "Nac", "PJ", "Gol", "Asis"].map((h, i) => (
                          <th key={i} style={{ padding: "6px 8px", textAlign: "left", color: "#475569", fontWeight: 700 }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {csvPreview.map((r, i) => {
                          const pi = getPosInfo(r.posicion);
                          const wasChanged = r.posicion_original && r.posicion_original !== r.posicion;
                          return (
                            <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                              <td style={{ padding: "4px 8px", color: "#334155" }}>{i + 1}</td>
                              <td style={{ padding: "4px 8px", color: "#e2e8f0", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.nombre}</td>
                              <td style={{ padding: "4px 8px" }}>
                                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 700, color: pi.color, background: pi.color + "15", border: "1px solid " + pi.color + "25" }}>{pi.abbr}</span>
                              </td>
                              <td style={{ padding: "4px 6px", color: wasChanged ? "#fbbf24" : "#334155", fontSize: 10 }}>
                                {wasChanged ? <span title={"Normalizado de: " + r.posicion_original}>✎ {r.posicion_original}</span> : "—"}
                              </td>
                              <td style={{ padding: "4px 6px", textAlign: "center", color: "#64748b" }}>{r.numero_camiseta || "—"}</td>
                              <td style={{ padding: "4px 6px", textAlign: "center", color: "#64748b" }}>{r.edad || "—"}</td>
                              <td style={{ padding: "4px 6px", textAlign: "center", color: "#64748b", fontSize: 10 }}>{r.nacionalidad || "—"}</td>
                              <td style={{ padding: "4px 6px", textAlign: "center", color: "#64748b" }}>{r.pj || "—"}</td>
                              <td style={{ padding: "4px 6px", textAlign: "center", color: "#f87171", fontWeight: 700 }}>{r.goles || "—"}</td>
                              <td style={{ padding: "4px 6px", textAlign: "center", color: "#60a5fa", fontWeight: 700 }}>{r.asistencias || "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 11, color: "#334155" }}>Plantilla actual: {plantilla?.jugadores?.length || 0} jugadores</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="pl-cancel-btn" onClick={closeImport}>Cancelar</button>
                  <button className="pl-save-btn" onClick={importPlayers} disabled={importing || csvPreview.length === 0}>
                    <Upload size={14} />{importing ? "Importando..." : "Importar " + csvPreview.length}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL JUGADOR (SIN toggle titular/suplente) ──────────────────── */}
      {modal === "player" && (
        <div className="pl-modal-bg" onClick={() => setModal(null)}>
          <div className="pl-modal" onClick={e => e.stopPropagation()}>
            <div className="pl-modal-top">
              <h3>{editPlayer ? "Editar Jugador" : "Nuevo Jugador"}</h3>
              <button className="pl-modal-x" onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <div className="pl-modal-body">
              <div className="pl-foto-area">
                <div className="pl-foto-circle">{form.foto ? <img src={API + form.foto} alt="" /> : <User size={28} />}</div>
                <label className="pl-upload-btn"><Plus size={12} /> Subir foto<input type="file" accept="image/*" onChange={handleFoto} hidden /></label>
              </div>
              <div className="pl-field">
                <label>Nombre completo <span className="req">*</span></label>
                <input className="pl-input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Juan Perez" />
              </div>
              <div className="pl-field">
                <label>Posicion</label>
                <div className="pl-select-w">
                  <select className="pl-input pl-select" value={form.posicion} onChange={e => setForm(f => ({ ...f, posicion: e.target.value }))}>
                    {posGroups.map(g => (
                      <optgroup key={g.label} label={g.label}>
                        {g.items.map(p => <option key={p.value} value={p.value}>{p.label} ({p.abbr})</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pl-row2">
                <div className="pl-field">
                  <label>Dorsal <span className="text-slate">(1-99)</span></label>
                  <input className="pl-input" type="number" value={form.numero_camiseta} onChange={e => setForm(f => ({ ...f, numero_camiseta: e.target.value }))} placeholder="10" min="1" max="99" />
                </div>
                <div className="pl-field">
                  <label>Edad <span className="text-slate">(16-50)</span></label>
                  <input className="pl-input" type="number" value={form.edad} onChange={e => setForm(f => ({ ...f, edad: e.target.value }))} placeholder="20" min="16" max="50" />
                </div>
              </div>
              <div className="pl-field">
                <label>Nacionalidad</label>
                <input className="pl-input" value={form.nacionalidad} onChange={e => setForm(f => ({ ...f, nacionalidad: e.target.value }))} placeholder="Salvadoreno" />
              </div>
              {/* SIN sección de titular/suplente */}
            </div>
            <div className="pl-modal-bottom">
              <button className="pl-cancel-btn" onClick={() => setModal(null)}>Cancelar</button>
              <button className="pl-save-btn" onClick={savePlayer} disabled={saving}><Save size={14} />{saving ? "..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL STATS ─────────────────────────────────────────────────── */}
      {modal === "stats" && editStats && (
        <div className="pl-modal-bg" onClick={() => setModal(null)}>
          <div className="pl-modal pl-modal-stats" onClick={e => e.stopPropagation()}>
            <div className="pl-modal-top">
              <div><h3>Estadisticas</h3><p className="pl-modal-sub">{editStats.nombre} - {getPosInfo(editStats.posicion).label}</p></div>
              <button className="pl-modal-x" onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <div className="pl-modal-body">
              <div className="pl-stats-grid">
                {(getPosInfo(editStats.posicion).cat === "portero" ? gkStatFields : statFields).map(f => (
                  <div key={f.key} className="pl-stat-field">
                    <label>{f.label}</label>
                    <input className="pl-stat-input" type="number" min="0" value={statsForm[f.key] || 0}
                      onChange={e => setStatsForm(s => ({ ...s, [f.key]: parseInt(e.target.value) || 0 }))} />
                  </div>
                ))}
              </div>
            </div>
            <div className="pl-modal-bottom">
              <button className="pl-cancel-btn" onClick={() => setModal(null)}>Cancelar</button>
              <button className="pl-save-btn green" onClick={saveStats} disabled={saving}><Save size={14} />{saving ? "..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
.swal2-container{z-index:99999!important}
.swal2-popup{z-index:99999!important}
@keyframes plspin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.sidebar-backdrop{display:none}
@media(max-width:768px){
  .sidebar-backdrop{display:block;position:fixed;inset:0;z-index:49;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)}
  .admin-layout .sidebar{position:fixed!important;z-index:50!important;top:0!important;left:0!important;width:260px!important;height:100vh!important;transform:translateX(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1)!important}
  .admin-layout.sidebar-open .sidebar{transform:translateX(0)!important;box-shadow:4px 0 30px rgba(0,0,0,.5)}
  .admin-layout .main-content{margin-left:0!important;width:100%!important}
}
@media(min-width:769px){.admin-layout.sidebar-open .sidebar{transform:translateX(0)!important}}
.teams-dropdown{list-style:none;padding:0;margin:0;max-height:0;overflow:hidden;transition:max-height .3s cubic-bezier(.4,0,.2,1)}
.teams-dropdown.dropdown-visible{max-height:200px}
.nav-subitem{padding-left:52px!important;font-size:13px!important;opacity:.6;transition:opacity .15s}
.nav-subitem.active{opacity:1}
.top-bar-title{font-size:.95rem;font-weight:700;color:#e2e8f0;letter-spacing:-.01em}
button.nav-item{background:none;border:none;color:#94a3b8;font-family:inherit;width:100%;text-align:left}

/* ── Contador en cancha ── */
.pl-tit-counter{display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:12px;background:rgba(255,255,255,.012);border:1px solid rgba(255,255,255,.04);margin-bottom:20px;flex-wrap:wrap}
.pl-tit-dots{display:flex;gap:5px}
.pl-tit-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);transition:all .25s}
.pl-tit-dot.filled{background:#22c55e;border-color:#22c55e;box-shadow:0 0 6px rgba(34,197,94,.35)}
.pl-tit-label{font-size:12px;font-weight:700;color:#475569}
.pl-tit-hint{font-size:11px;color:#334155;margin-left:auto}

/* ── Card con estilo sutil para jugadores en slot ── */
.pl-card.pl-card-in-slot{border-color:rgba(34,197,94,.08)!important;background:rgba(34,197,94,.025)!important}

/* ── Botón swap en PlayerCard ── */
.pl-card-swap{width:30px;height:30px;border-radius:8px;border:1px solid rgba(34,211,238,.15);background:rgba(34,211,238,.05);color:#22d3ee;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.pl-card-swap:hover{background:rgba(34,211,238,.12);border-color:rgba(34,211,238,.3);transform:scale(1.08)}

/* ── Modal cambio ── */
.pl-swap-modal{width:480px}
.pl-swap-focus{padding:14px 16px;border-radius:14px;margin-bottom:14px}
.pl-swap-focus.sale{background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12)}
.pl-swap-focus.entra{background:rgba(34,211,238,.04);border:1px solid rgba(34,211,238,.12)}
.pl-swap-focus-label{font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px}
.pl-swap-focus.sale .pl-swap-focus-label{color:#f87171}
.pl-swap-focus.entra .pl-swap-focus-label{color:#22d3ee}
.pl-swap-focus-row{display:flex;align-items:center;gap:12px}
.pl-swap-arrow-ic{margin-left:auto;color:#475569;flex-shrink:0}
.pl-swap-list-label{font-size:10px;font-weight:700;color:#334155;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px;text-align:center}
.pl-swap-list{display:flex;flex-direction:column;gap:4px;max-height:340px;overflow-y:auto}
.pl-swap-list::-webkit-scrollbar{width:3px}.pl-swap-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:4px}
.pl-swap-empty{text-align:center;padding:24px;color:#334155;font-size:13px}
.pl-swap-row{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.04);background:rgba(255,255,255,.015);cursor:pointer;transition:all .18s;text-align:left;width:100%}
.pl-swap-row:hover{background:rgba(34,211,238,.05);border-color:rgba(34,211,238,.15);transform:translateX(2px)}
.pl-swap-row-info{flex:1;min-width:0}
.pl-swap-photo{border-radius:10px;background:rgba(255,255,255,.03);overflow:hidden;display:flex;align-items:center;justify-content:center;color:#1e293b;border:1px solid rgba(255,255,255,.06);flex-shrink:0}
.pl-swap-photo.lg{width:42px;height:42px}
.pl-swap-photo.sm{width:32px;height:32px}
.pl-swap-photo img{width:100%;height:100%;object-fit:cover}
.pl-swap-name{display:block;font-size:13px;font-weight:700;color:#f1f5f9}
.pl-swap-pos{display:block;font-size:11px;color:#475569}
.pl-swap-dorsal{font-size:15px;font-weight:800;font-family:'Inter',system-ui,sans-serif;flex-shrink:0}
.pl-swap-abbr{font-size:9px;font-weight:800;padding:3px 7px;border-radius:6px;border:1px solid;letter-spacing:.06em;flex-shrink:0}

/* ── Suplentes en tab formación ── */
.pl-sub-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.025);background:rgba(255,255,255,.01);transition:all .2s;cursor:pointer;width:100%;text-align:left}
.pl-sub-item:hover{background:rgba(34,211,238,.04);border-color:rgba(34,211,238,.1);transform:translateY(-1px)}
.pl-sub-item[data-color="#f59e0b"]{border-left:2px solid rgba(245,158,11,.3)}
.pl-sub-item[data-color="#3b82f6"]{border-left:2px solid rgba(59,130,246,.3)}
.pl-sub-item[data-color="#10b981"]{border-left:2px solid rgba(16,185,129,.3)}
.pl-sub-item[data-color="#ef4444"]{border-left:2px solid rgba(239,68,68,.3)}
.pl-sub-item[data-color="#059669"]{border-left:2px solid rgba(5,150,105,.3)}
.pl-sub-item[data-color="#f97316"]{border-left:2px solid rgba(249,115,22,.3)}
.pl-sub-photo{width:30px;height:30px;border-radius:10px;background:rgba(255,255,255,.03);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#1e293b;border:1px solid rgba(255,255,255,.03)}
.pl-sub-photo img{width:100%;height:100%;object-fit:cover}
.pl-sub-info{flex:1;min-width:0}
.pl-sub-name{display:block;font-size:12px;font-weight:600;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-sub-meta{display:block;font-size:10px;color:#334155}
.pl-sub-swap-ic{color:#22d3ee;flex-shrink:0;opacity:.5;transition:opacity .2s}
.pl-sub-item:hover .pl-sub-swap-ic{opacity:1}

/* ── Jugadores en el campo clickeables ── */
.pl-pitch-player{cursor:pointer}
.pl-pitch-player:hover .pl-pitch-dot{box-shadow:0 0 0 3px rgba(34,211,238,.4),0 3px 12px rgba(0,0,0,.4)!important}

/* ─── resto de estilos ─── */
.pl-page{padding:28px 24px;max-width:1060px;margin:0 auto;animation:slideUp .4s ease-out}
.pl-header{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.04)}
.pl-header h1{margin:0;font-size:26px;font-weight:900;color:#f8fafc;letter-spacing:-.04em;background:linear-gradient(135deg,#f8fafc 0%,#64748b 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.pl-div-dd{position:relative}
.pl-div-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);color:#94a3b8;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s;letter-spacing:-.01em;backdrop-filter:blur(8px)}
.pl-div-btn:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:#cbd5e1}
.pl-div-arrow{transition:transform .25s cubic-bezier(.4,0,.2,1)}.pl-div-arrow.open{transform:rotate(180deg)}
.pl-div-drop{position:absolute;top:calc(100% + 10px);right:0;background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.06);border-radius:16px;overflow:hidden;min-width:220px;z-index:200;box-shadow:0 25px 60px rgba(0,0,0,.5);opacity:0;pointer-events:none;transform:translateY(-8px) scale(.98);transition:all .25s cubic-bezier(.4,0,.2,1);backdrop-filter:blur(20px)}
.pl-div-drop.show{opacity:1;pointer-events:auto;transform:translateY(0) scale(1)}
.pl-div-opt{display:flex;align-items:center;gap:10px;width:100%;padding:13px 20px;border:none;background:transparent;color:#94a3b8;font-size:13px;font-weight:500;cursor:pointer;text-align:left;transition:all .15s}
.pl-div-opt:hover{background:rgba(255,255,255,.04);color:#e2e8f0}
.pl-div-opt.active{background:rgba(255,255,255,.06);color:#f1f5f9;font-weight:700}
.pl-div-dot{margin-left:auto;width:6px;height:6px;border-radius:50%;background:#22d3ee;box-shadow:0 0 10px rgba(34,211,238,.5)}
.pl-toolbar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;position:relative}
.pl-team-sel{position:relative;flex:1;min-width:260px;z-index:200}
.pl-team-sel-btn{width:100%;display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:14px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:#f1f5f9;font-size:14px;cursor:pointer;text-align:left;transition:all .25s;backdrop-filter:blur(4px)}
.pl-team-sel-btn:hover{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.04)}
.pl-team-sel-logo{width:30px;height:30px;border-radius:10px;object-fit:contain;flex-shrink:0;background:rgba(255,255,255,.04);padding:3px}
.pl-team-sel-icon{color:#475569;flex-shrink:0}
.pl-team-sel-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.pl-team-sel-arrow{color:#475569;transition:transform .25s cubic-bezier(.4,0,.2,1);flex-shrink:0}.pl-team-sel-arrow.open{transform:rotate(180deg)}
.pl-team-sel-drop{position:absolute;top:calc(100% + 8px);left:0;right:0;background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.06);border-radius:16px;max-height:300px;overflow-y:auto;z-index:201;box-shadow:0 25px 60px rgba(0,0,0,.5);animation:fadeIn .2s ease-out;backdrop-filter:blur(20px)}
.pl-team-sel-drop::-webkit-scrollbar{width:3px}.pl-team-sel-drop::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:4px}
.pl-team-sel-opt{width:100%;display:flex;align-items:center;gap:10px;padding:12px 14px;border:none;background:transparent;color:#cbd5e1;font-size:13px;cursor:pointer;transition:all .12s;text-align:left;border-bottom:1px solid rgba(255,255,255,.02)}
.pl-team-sel-opt:last-child{border-bottom:none}
.pl-team-sel-opt:hover{background:rgba(255,255,255,.04)}
.pl-team-sel-opt.active{background:rgba(255,255,255,.06);color:#f1f5f9}
.pl-team-sel-opt .pl-team-sel-opt-logo{width:26px;height:26px;border-radius:8px}
.pl-team-sel-empty{padding:20px;text-align:center;color:#475569;font-size:13px}
.pl-search{position:relative;min-width:200px;flex:.4}
.pl-search input{width:100%;padding:12px 38px 12px 40px;border-radius:14px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:#e2e8f0;font-size:13px;outline:none;box-sizing:border-box;transition:all .25s}
.pl-search input:focus{border-color:rgba(34,211,238,.25);background:rgba(255,255,255,.03);box-shadow:0 0 0 4px rgba(34,211,238,.06)}
.pl-search input::placeholder{color:#334155}
.pl-search-ic{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#334155;pointer-events:none}
.pl-search-x{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.05);border:none;color:#475569;width:22px;height:22px;border-radius:6px;cursor:pointer;display:flex;align-items:center;transition:all .15s}
.pl-search-x:hover{background:rgba(239,68,68,.12);color:#f87171}
.pl-add-btn{display:flex;align-items:center;gap:7px;padding:12px 24px;border-radius:14px;border:none;background:#0f766e;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s;letter-spacing:-.01em;box-shadow:0 2px 12px rgba(15,118,110,.2)}
.pl-add-btn:hover{background:#0d9488;box-shadow:0 4px 20px rgba(15,118,110,.3);transform:translateY(-1px)}
.pl-import-btn{display:flex;align-items:center;gap:7px;padding:12px 24px;border-radius:14px;border:1px solid rgba(20,184,166,.15);background:rgba(15,118,110,.08);color:#14b8a6;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s}
.pl-import-btn:hover{background:rgba(15,118,110,.15);border-color:rgba(20,184,166,.3);transform:translateY(-1px)}
.pl-dl-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015);color:#475569;font-weight:600;cursor:pointer;transition:all .2s;font-size:12px}
.pl-dl-btn:hover{background:rgba(255,255,255,.03);color:#94a3b8}
.pl-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;color:#475569;gap:8px}
.pl-empty svg{opacity:.2;margin-bottom:8px}
.pl-empty p{margin:0;text-align:center}
.pl-empty p:first-of-type{font-weight:700;color:#64748b;font-size:15px}
.pl-empty p:last-of-type{color:#334155;font-size:13px}
.pl-spinner{width:36px;height:36px;border-radius:50%;border:3px solid rgba(255,255,255,.04);border-top-color:#22d3ee;animation:plspin .7s linear infinite;margin:0 auto 16px}
.pl-team-card{display:flex;align-items:center;gap:20px;padding:22px 24px;border-radius:20px;background:linear-gradient(135deg,rgba(255,255,255,.025),rgba(255,255,255,.008));border:1px solid rgba(255,255,255,.04);margin-bottom:24px}
.pl-tc-logo{width:56px;height:56px;border-radius:16px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,.03);display:flex;align-items:center;justify-content:center;padding:8px;border:1px solid rgba(255,255,255,.05)}
.pl-tc-logo img{width:100%;height:100%;object-fit:contain}
.pl-tc-info{flex:1;min-width:0}
.pl-tc-info h3{margin:0;font-size:20px;font-weight:900;color:#f1f5f9;letter-spacing:-.03em}
.pl-tc-info p{margin:4px 0 0;font-size:12px;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pl-tc-stats{display:flex;align-items:center;gap:20px;flex-shrink:0}
.pl-tc-stat b{display:block;font-size:24px;font-weight:900;font-family:'Inter',system-ui,sans-serif;line-height:1;letter-spacing:-.04em}
.pl-tc-stat span{font-size:9px;color:#334155;text-transform:uppercase;letter-spacing:.1em;margin-top:3px;display:block}
.pl-tc-div{width:1px;height:36px;background:rgba(255,255,255,.04);border-radius:1px}
.pl-tabs{display:flex;gap:2px;margin-bottom:24px;padding:3px;background:rgba(255,255,255,.02);border-radius:16px;border:1px solid rgba(255,255,255,.04);width:fit-content}
.pl-tab{display:flex;align-items:center;gap:8px;padding:11px 24px;border-radius:14px;border:none;background:transparent;color:#475569;font-size:13px;font-weight:600;cursor:pointer;transition:all .25s}
.pl-tab:hover{color:#94a3b8;background:rgba(255,255,255,.02)}
.pl-tab.active{background:rgba(34,211,238,.08);color:#22d3ee;box-shadow:0 0 20px rgba(34,211,238,.06)}
.pl-filter-msg{margin-bottom:16px;font-size:12px;color:#475569;padding:10px 16px;background:rgba(255,255,255,.015);border-radius:10px;border-left:2px solid rgba(34,211,238,.3)}
.pl-section{margin-bottom:22px}
.pl-section-head{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding:0 4px}
.pl-section-bar{width:3px;height:16px;border-radius:2px}
.pl-section-bar[data-color="#f59e0b"]{background:#f59e0b}.pl-section-bar[data-color="#3b82f6"]{background:#3b82f6}.pl-section-bar[data-color="#10b981"]{background:#10b981}.pl-section-bar[data-color="#ef4444"]{background:#ef4444}
.pl-section-label{font-size:10px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:.15em}
.pl-section-label[data-color="#f59e0b"]{color:#fbbf24}.pl-section-label[data-color="#3b82f6"]{color:#60a5fa}.pl-section-label[data-color="#10b981"]{color:#34d399}.pl-section-label[data-color="#ef4444"]{color:#f87171}
.pl-section-count{font-size:9px;font-weight:800;color:#334155;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(255,255,255,.03)}
.pl-section-count[data-color="#f59e0b"]{background:rgba(245,158,11,.08);color:#fbbf24}.pl-section-count[data-color="#3b82f6"]{background:rgba(59,130,246,.08);color:#60a5fa}.pl-section-count[data-color="#10b981"]{background:rgba(16,185,129,.08);color:#34d399}.pl-section-count[data-color="#ef4444"]{background:rgba(239,68,68,.08);color:#f87171}
.pl-section-list{display:flex;flex-direction:column;gap:3px}
.pl-card{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.025);background:rgba(255,255,255,.012);transition:all .2s;position:relative;overflow:hidden}
.pl-card:hover{border-color:rgba(255,255,255,.05);background:rgba(255,255,255,.03)}
.pl-card-num{font-size:15px;font-weight:900;font-family:'Inter',system-ui,sans-serif;line-height:1;letter-spacing:-.04em;min-width:20px;text-align:center}
.pl-card-num[data-color="#f59e0b"]{color:#fbbf24}.pl-card-num[data-color="#3b82f6"]{color:#60a5fa}.pl-card-num[data-color="#10b981"]{color:#34d399}.pl-card-num[data-color="#ef4444"]{color:#f87171}.pl-card-num[data-color="#059669"]{color:#34d399}.pl-card-num[data-color="#f97316"]{color:#fb923c}.pl-card-num[data-color="#64748b"]{color:#94a3b8}
.pl-card-photo{width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,.03);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#1e293b;border:1px solid rgba(255,255,255,.03)}
.pl-card-photo img{width:100%;height:100%;object-fit:cover}
.pl-card-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.pl-card-name{font-size:13px;font-weight:700;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}
.pl-card-meta{font-size:10px;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-card-pos{font-size:9px;font-weight:800;letter-spacing:.08em;padding:4px 8px;border-radius:8px;flex-shrink:0;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.04)}
.pl-card-pos[data-color="#f59e0b"]{color:#fbbf24;border-color:rgba(245,158,11,.15)}.pl-card-pos[data-color="#3b82f6"]{color:#60a5fa;border-color:rgba(59,130,246,.15)}.pl-card-pos[data-color="#10b981"]{color:#34d399;border-color:rgba(16,185,129,.15)}.pl-card-pos[data-color="#ef4444"]{color:#f87171;border-color:rgba(239,68,68,.15)}.pl-card-pos[data-color="#059669"]{color:#34d399;border-color:rgba(5,150,105,.15)}.pl-card-pos[data-color="#f97316"]{color:#fb923c;border-color:rgba(249,115,22,.15)}.pl-card-pos[data-color="#64748b"]{color:#94a3b8;border-color:rgba(100,116,139,.15)}
.pl-card-stats{display:flex;gap:12px;flex-shrink:0}
.pl-stat{text-align:center}
.pl-stat b{display:block;font-size:13px;font-weight:800;font-family:'Inter',system-ui,sans-serif;line-height:1.1;letter-spacing:-.03em}
.pl-stat small{font-size:8px;color:#334155;text-transform:uppercase;letter-spacing:.06em;display:block}
.fwd-g{color:#f87171}.mid-a{color:#60a5fa}.gk-gr{color:#fbbf24}.gk-vi{color:#34d399}
.pl-card-pj{text-align:center;flex-shrink:0;min-width:32px}
.pl-card-pj b{display:block;font-size:13px;font-weight:800;color:#64748b;font-family:'Inter',system-ui,sans-serif;line-height:1.1}
.pl-card-pj small{font-size:8px;color:#334155;text-transform:uppercase;letter-spacing:.06em}
.pl-card-actions{display:flex;gap:3px;flex-shrink:0;opacity:0;transition:opacity .2s}
.pl-card:hover .pl-card-actions{opacity:1}
.ab{width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.04);background:rgba(255,255,255,.015);color:#475569;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.ab:hover{transform:scale(1.1)}
.ab-blue:hover{color:#60a5fa;border-color:rgba(59,130,246,.2);background:rgba(59,130,246,.06)}
.ab-yellow:hover{color:#fbbf24;border-color:rgba(245,158,11,.2);background:rgba(245,158,11,.06)}
.ab-red:hover{color:#f87171;border-color:rgba(239,68,68,.2);background:rgba(239,68,68,.06)}
.pl-fm-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px;flex-wrap:wrap}
.pl-fm-btns{display:flex;gap:3px;padding:3px;background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.04);border-radius:14px}
.pl-fm-btn{padding:9px 18px;border-radius:12px;border:none;background:transparent;color:#475569;font-size:13px;font-weight:700;cursor:pointer;transition:all .25s;font-family:'Inter',system-ui,sans-serif;letter-spacing:.03em}
.pl-fm-btn:hover{color:#94a3b8;background:rgba(255,255,255,.02)}
.pl-fm-btn.active{background:rgba(34,211,238,.08);color:#22d3ee;box-shadow:0 0 16px rgba(34,211,238,.06)}
.pl-save-btn{padding:11px 24px;border-radius:12px;border:none;background:#0f766e;color:#fff;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .25s;letter-spacing:-.01em;box-shadow:0 2px 12px rgba(15,118,110,.2)}
.pl-save-btn:hover{background:#0d9488;box-shadow:0 4px 20px rgba(15,118,110,.3);transform:translateY(-1px)}
.pl-save-btn:disabled{opacity:.3;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.pl-save-btn.green{background:#0f766e}
.pl-pitch{position:relative;width:100%;max-width:480px;margin:0 auto 24px;aspect-ratio:.65;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,#15803d 0%,#166534 40%,#14532d 100%);border:2px solid rgba(255,255,255,.12);box-shadow:0 20px 60px rgba(0,0,0,.4)}
.pl-pitch-svg{position:absolute;inset:0;width:100%;height:100%}
.pl-pitch-player{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:3px;z-index:2;transition:all .3s}
.pl-pitch-player:hover{transform:translate(-50%,-50%) scale(1.12);z-index:5}
.pl-pitch-dot{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;border:2.5px solid rgba(255,255,255,.9);box-shadow:0 3px 12px rgba(0,0,0,.4);overflow:hidden;transition:box-shadow .2s}
.pl-pitch-dot img{width:100%;height:100%;object-fit:cover}
.pl-pitch-dot[data-color="#f59e0b"]{background:linear-gradient(135deg,#d97706,#f59e0b)}.pl-pitch-dot[data-color="#3b82f6"]{background:linear-gradient(135deg,#2563eb,#3b82f6)}.pl-pitch-dot[data-color="#10b981"]{background:linear-gradient(135deg,#059669,#10b981)}.pl-pitch-dot[data-color="#ef4444"]{background:linear-gradient(135deg,#dc2626,#ef4444)}.pl-pitch-dot[data-color="#059669"]{background:linear-gradient(135deg,#047857,#059669)}.pl-pitch-dot[data-color="#f97316"]{background:linear-gradient(135deg,#ea580c,#f97316)}.pl-pitch-dot[data-color="#64748b"]{background:linear-gradient(135deg,#475569,#64748b)}
.pl-pitch-name{font-size:10px;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.5);white-space:nowrap}
.pl-pitch-msg{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);padding:6px 14px;border-radius:8px;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);color:#94a3b8;font-size:11px;font-weight:600;z-index:10;border:1px solid rgba(255,255,255,.06)}
.pl-subs-card{background:rgba(255,255,255,.012);border:1px solid rgba(255,255,255,.035);border-radius:20px;padding:20px;animation:slideUp .3s ease-out}
.pl-subs-title{margin:0 0 14px;font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.12em}
.pl-subs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:5px}
.pl-modal-bg{position:fixed;inset:0;background:rgba(2,6,23,.9);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fadeInBg .2s ease-out}
@keyframes fadeInBg{from{opacity:0}to{opacity:1}}
.pl-modal{background:linear-gradient(180deg,#0f172a,#0a0f1a);border:1px solid rgba(255,255,255,.05);border-radius:24px;width:520px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.6);animation:fadeIn .3s cubic-bezier(.4,0,.2,1)}
.pl-modal-stats{width:580px}
.pl-modal-top{display:flex;justify-content:space-between;align-items:center;padding:22px 26px;border-bottom:1px solid rgba(255,255,255,.04)}
.pl-modal-top h3{margin:0;font-size:18px;color:#f1f5f9;font-weight:800;letter-spacing:-.02em}
.pl-modal-sub{margin:3px 0 0;font-size:12px;color:#334155}
.pl-modal-x{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:12px;cursor:pointer;width:36px;height:36px;color:#475569;display:flex;align-items:center;justify-content:center;transition:all .25s}
.pl-modal-x:hover{background:rgba(239,68,68,.08);color:#f87171;border-color:rgba(239,68,68,.15);transform:rotate(90deg)}
.pl-modal-body{padding:26px;overflow-y:auto;flex:1}
.pl-modal-body::-webkit-scrollbar{width:3px}.pl-modal-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.04);border-radius:4px}
.pl-modal-bottom{display:flex;justify-content:flex-end;gap:10px;padding:18px 26px;border-top:1px solid rgba(255,255,255,.04);background:rgba(255,255,255,.008)}
.pl-foto-area{text-align:center;margin-bottom:26px}
.pl-foto-circle{width:92px;height:92px;border-radius:20px;background:rgba(255,255,255,.02);border:2px dashed rgba(255,255,255,.06);overflow:hidden;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;color:#1e293b}
.pl-foto-circle img{width:100%;height:100%;object-fit:cover}
.pl-upload-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:10px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015);color:#94a3b8;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s}
.pl-upload-btn:hover{border-color:rgba(34,211,238,.2);color:#22d3ee;background:rgba(34,211,238,.05)}
.pl-field{margin-bottom:18px}
.pl-field label{display:block;margin-bottom:7px;font-size:11px;font-weight:700;color:#475569;letter-spacing:.03em;text-transform:uppercase}
.req{color:#f87171}
.pl-input{width:100%;padding:12px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015);color:#e2e8f0;font-size:13px;outline:none;box-sizing:border-box;transition:all .25s}
.pl-input:focus{border-color:rgba(34,211,238,.25);background:rgba(255,255,255,.025);box-shadow:0 0 4px rgba(34,211,238,.06)}
.pl-input::placeholder{color:#1e293b}
.pl-input option{background:#0f172a;color:#f1f5f9}
.pl-input optgroup{background:#0f172a;color:#94a3b8;font-weight:700}
.pl-select{appearance:none;cursor:pointer;padding-right:2.5rem}
.pl-select-w{position:relative}
.pl-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
.pl-cancel-btn{padding:11px 26px;border-radius:12px;border:1px solid rgba(255,255,255,.05);background:transparent;color:#475569;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s}
.pl-cancel-btn:hover{background:rgba(255,255,255,.02);color:#94a3b8}
.pl-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.pl-stat-field label{display:block;margin-bottom:6px;font-size:11px;font-weight:700;color:#475569;letter-spacing:.03em;text-transform:uppercase}
.pl-stat-input{width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.015);color:#e2e8f0;font-size:14px;font-weight:700;outline:none;box-sizing:border-box;text-align:center;transition:all .25s}
.pl-stat-input:focus{border-color:rgba(34,211,238,.25);background:rgba(255,255,255,.025)}
@media(max-width:640px){
  .pl-page{padding:16px 14px}
  .pl-header{flex-direction:column;align-items:stretch;gap:12px}
  .pl-header h1{font-size:20px}
  .pl-toolbar{flex-direction:column;align-items:stretch}
  .pl-search{min-width:0;flex:1}
  .pl-add-btn,.pl-import-btn{justify-content:center}
  .pl-team-card{flex-direction:column;text-align:center;padding:18px;gap:12px}
  .pl-tc-stats{justify-content:center;gap:20px}
  .pl-tabs{width:100%}
  .pl-tab{flex:1;justify-content:center;padding:11px 12px;font-size:12px}
  .pl-card{flex-wrap:wrap;gap:8px;padding:10px 12px}
  .pl-card-pos,.pl-card-stats,.pl-card-pj{display:none!important}
  .pl-card-actions{width:100%;justify-content:flex-end;opacity:1}
  .pl-tit-counter{flex-direction:column;align-items:flex-start;gap:8px}
  .pl-pitch{max-width:100%;aspect-ratio:.7}
  .pl-pitch-dot{width:34px;height:34px;font-size:10px}
  .pl-pitch-name{font-size:8px}
  .pl-subs-grid{grid-template-columns:1fr}
  .pl-fm-bar{flex-direction:column;align-items:stretch;gap:10px}
  .pl-fm-btns{justify-content:center;flex-wrap:wrap}
  .pl-fm-btn{padding:8px 14px;font-size:12px}
  .pl-stats-grid{grid-template-columns:repeat(2,1fr)}
  .pl-modal{border-radius:20px}
  .pl-modal-top,.pl-modal-bottom{padding:18px 20px}
  .pl-modal-body{padding:20px}
  .pl-row2{grid-template-columns:1fr;gap:0}
  .pl-swap-modal{width:95vw}
  .pl-tit-hint{display:none}
}
      `}</style>
    </div>
  );
}