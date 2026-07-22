import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings,
  LogOut, Menu, Trophy, Target, Plus, Edit2, Trash2, Save, X,
  RefreshCw, ChevronDown, RotateCcw, Users2, Upload, AlertTriangle,
  CheckCircle2, Clock, Swords, ArrowRight, Lock, ArrowLeftRight, Zap, MessageCircle, Eye, BarChart3, ChevronUp
} from "lucide-react";
import { apiPost } from "../apiHelper";
import { API_BASE } from "../config";

const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  const text = await res.text();
  if (!text.trim() || text.trim().startsWith("<")) throw new Error("Error del servidor");
  return JSON.parse(text);
};

const logoUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

const normalizeName = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[.\-_,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

const PHASES = [
  { key: "grupos", label: "Grupos", icon: "🗂️", idaVuelta: false },
  { key: "octavos", label: "Octavos", icon: "⚔️", idaVuelta: true },
  { key: "cuartos", label: "Cuartos", icon: "🔥", idaVuelta: true },
  { key: "semis", label: "Semis", icon: "🌟", idaVuelta: true },
  { key: "final", label: "Final", icon: "🏆", idaVuelta: false },
];
const GROUPS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);
const STATUSES = ["Pendiente", "En Curso", "Finalizado"];
const isIdaVueltaPhase = (fase) => ["octavos", "cuartos", "semis"].includes(fase);

const statusStyle = (s) => ({
  Finalizado: { bg: "rgba(16,185,129,0.12)", color: "#10b981" },
  "En Curso": { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
  Pendiente: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa" },
}[s] || { bg: "rgba(255,255,255,0.05)", color: "#64748b" });

const DIVISION_COLORS = {
  Primera: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "1a" },
  Ascenso: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", label: "AS" },
};

/* ─── Utilidades compartidas ──────────────────────────────────────────────── */
const calcGroupStats = (groupMatches, allTeams) => {
  const stats = {};
  const ids = [...new Set(groupMatches.flatMap(m => [String(m.team1_id), String(m.team2_id)]))];
  ids.forEach(id => { const t = allTeams.find(x => String(x.id) === id); if (t) stats[id] = { id, nombre: t.nombre, logo: t.logo, division: t.division, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 }; });
  groupMatches.filter(m => m.estado === "Finalizado").forEach(m => {
    const gl = parseInt(m.goles_local) || 0, gv = parseInt(m.goles_visitante) || 0;
    const l = String(m.team1_id), v = String(m.team2_id);
    if (stats[l]) { stats[l].pj++; stats[l].gf += gl; stats[l].gc += gv; if (gl > gv) { stats[l].g++; stats[l].pts += 3 } else if (gl === gv) { stats[l].e++; stats[l].pts++ } else stats[l].p++; }
    if (stats[v]) { stats[v].pj++; stats[v].gf += gv; stats[v].gc += gl; if (gv > gl) { stats[v].g++; stats[v].pts += 3 } else if (gl === gv) { stats[v].e++; stats[v].pts++ } else stats[v].p++; }
  });
  return Object.values(stats).map(s => ({ ...s, dg: s.gf - s.gc })).sort((a, b) => b.pts - a.pts || (b.dg - a.dg) || (b.gf - a.gf));
};

const getGroupQualifiers = (allMatches, allTeams) => {
  const q = [];
  const thirds = [];
  GROUPS.forEach(g => {
    const gm = allMatches.filter(m => m.fase === "grupos" && m.grupo === g);
    const st = calcGroupStats(gm, allTeams);
    q.push(...st.slice(0, 2).map(t => ({ id: String(t.id), pos: st.indexOf(t) + 1 })));
    if (st.length >= 3) thirds.push({ ...st[2], grupo: g });
  });
  // Sort 3rd place teams by pts, dg, gf
  thirds.sort((a, b) => b.pts - a.pts || (b.dg - a.dg) || (b.gf - a.gf));
  q.push(...thirds.slice(0, 4).map(t => ({ id: String(t.id), pos: 3 })));
  return q;
};

const getAggregate = (ida, vuelta) => {
  const iGL = parseInt(ida.goles_local) || 0, iGV = parseInt(ida.goles_visitante) || 0;
  const vGL = parseInt(vuelta.goles_local) || 0, vGV = parseInt(vuelta.goles_visitante) || 0;
  const t1 = iGL + vGV, t2 = iGV + vGL, away1 = vGV, away2 = iGV;
  let winner = null, method = "";
  if (t1 > t2) { winner = 1; method = "Global"; } else if (t2 > t1) { winner = 2; method = "Global"; }
  else if (away1 > away2) { winner = 1; method = "Gol visitante"; } else if (away2 > away1) { winner = 2; method = "Gol visitante"; }
  else { const pL = parseInt(vuelta.penales_local) || 0, pV = parseInt(vuelta.penales_visitante) || 0; if (pV > pL) { winner = 1; method = "Penales"; } else if (pL > pV) { winner = 2; method = "Penales"; } else method = "Sin definir"; }
  return { t1, t2, away1, away2, winner, method, pL: parseInt(vuelta.penales_local) || 0, pV: parseInt(vuelta.penales_visitante) || 0 };
};

const pairKnockoutMatches = (matchList) => {
  const pairs = [], used = new Set();
  for (let i = 0; i < matchList.length; i++) {
    if (used.has(i)) continue; let pairIdx = -1;
    for (let j = i + 1; j < matchList.length; j++) {
      if (used.has(j)) continue; const a = matchList[i], b = matchList[j];
      if (String(a.team1_id) === String(b.team2_id) && String(a.team2_id) === String(b.team1_id)) { pairIdx = j; break; }
    }
    if (pairIdx !== -1) {
      used.add(i); used.add(pairIdx); const m1 = matchList[i], m2 = matchList[pairIdx];
      const ida = (m1.jornada === "ida") || (!m1.jornada && !m2.jornada && (m1.fecha || "") <= (m2.fecha || "")) ? m1 : m2;
      pairs.push({ ida, vuelta: ida === m1 ? m2 : m1, type: "pair" });
    } else { used.add(i); pairs.push({ match: matchList[i], type: "single" }); }
  }
  return pairs;
};

const getPhaseWinners = (allMatches, phase) => {
  const pm = allMatches.filter(m => m.fase === phase);
  const pairs = pairKnockoutMatches(pm); const winners = [];
  pairs.forEach(p => { if (p.type === "pair") { const { ida, vuelta } = p; if (ida.estado === "Finalizado" && vuelta.estado === "Finalizado") { const agg = getAggregate(ida, vuelta); if (agg.winner) winners.push(String(agg.winner === 1 ? ida.team1_id : ida.team2_id)); } } });
  return winners;
};

const getAvailableForPhase = (phase, allMatches, allTeams, formId, formLlave) => {

  let qualified = [];

  if (phase === "octavos") {

    qualified = getGroupQualifiers(allMatches, allTeams).map(q => q.id);

  } else if (phase === "cuartos") {

    qualified = getPhaseWinners(allMatches, "octavos");

  } else if (phase === "semis") {

    qualified = getPhaseWinners(allMatches, "cuartos");

  } else if (phase === "final") {

    qualified = getPhaseWinners(allMatches, "semis");
  }

  // Equipos ya usados en OTROS partidos de la misma fase y DISTINTA llave
  const usedInOthers = new Set(
    allMatches
      .filter(m => {
        if (m.fase !== phase) return false;
        if (String(m.id) === String(formId)) return false;
        if (formLlave != null && m.llave == formLlave) return false; // misma llave → ida/vuelta
        if (formLlave == null && m.llave == null) return false; // ambas sin llave → no filtramos
        return true;
      })
      .flatMap(m => [String(m.team1_id), String(m.team2_id)])
  );

  // Solo disponibles los clasificados que NO están ya asignados a otra llave
  return qualified.filter(id => !usedInOthers.has(String(id)));
};

/* Genera todas las combinaciones round-robin de un grupo */
const generateGroupPairings = (teamIds) => {
  const pairs = [];
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      pairs.push([teamIds[i], teamIds[j]]);
    }
  }
  return pairs;
};

/* Cuenta cuántos partidos nuevos se generarían (sin duplicar existentes) */
const countNewGroupMatches = (assignments, existingMatches) => {
  let count = 0;
  GROUPS.forEach(g => {
    const ids = assignments[g] || [];
    const pairs = generateGroupPairings(ids);
    pairs.forEach(([t1, t2]) => {
      const exists = existingMatches.some(m => {
        if (m.fase !== "grupos" || m.grupo !== g) return false;
        const p1 = [String(m.team1_id), String(m.team2_id)].sort().join("-");
        const p2 = [String(t1), String(t2)].sort().join("-");
        return p1 === p2;
      });
      if (!exists) count++;
    });
  });
  return count;
};

const getPhaseReview = (phase, matches, teams) => {
  const phaseMatches = matches.filter(m => m.fase === phase);
  const pending = phaseMatches.filter(m => m.estado === "Pendiente").length;
  const live = phaseMatches.filter(m => m.estado === "En Curso").length;
  const finished = phaseMatches.filter(m => m.estado === "Finalizado").length;
  const unscheduled = phaseMatches.filter(m => !m.fecha || !m.hora).length;
  const missingScore = phaseMatches.filter(m => m.estado === "Finalizado" && (m.goles_local === null || m.goles_visitante === null)).length;
  const duplicateTeamsAtSameTime = phaseMatches.filter((m, idx) => {
    if (!m.fecha || !m.hora) return false;
    return phaseMatches.some((x, xidx) => xidx !== idx && x.fecha === m.fecha && x.hora === m.hora && [String(x.team1_id), String(x.team2_id)].some(id => [String(m.team1_id), String(m.team2_id)].includes(id)));
  }).length;
  const groups = GROUPS.filter(g => teams.some(t => t.grupo === g));
  const incompleteGroups = phase === "grupos"
    ? groups.filter(g => {
        const count = teams.filter(t => t.grupo === g).length;
        return count < 3 || count > 4;
      }).length
    : 0;
  const warnings = [
    unscheduled ? `${unscheduled} sin fecha/hora` : null,
    missingScore ? `${missingScore} finalizado sin marcador` : null,
    duplicateTeamsAtSameTime ? `${duplicateTeamsAtSameTime} choque de horario` : null,
    incompleteGroups ? `${incompleteGroups} grupos fuera de 3-4 equipos` : null,
  ].filter(Boolean);
  const completion = phaseMatches.length ? Math.round((finished / phaseMatches.length) * 100) : 0;
  return { total: phaseMatches.length, pending, live, finished, unscheduled, missingScore, duplicateTeamsAtSameTime, incompleteGroups, warnings, completion };
};

/* ─── Componentes de UI ──────────────────────────────────────────────────── */
const TeamBadge = ({ logo, name, size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
    {logoUrl(logo) ? <img src={logoUrl(logo)} alt={name} style={{ width: size - 4, height: size - 4, objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} /> : null}
    <span style={{ display: logoUrl(logo) ? "none" : "flex", fontSize: size < 22 ? 8 : 11, opacity: 0.2, alignItems: "center", justifyContent: "center" }}>⚽</span>
  </div>
);

const TeamPreview = ({ team, side }) => {
  if (!team) return (
    <div style={{ flex: 1, padding: "14px 16px", borderRadius: 10, border: "1px dashed #1e293b", background: "rgba(255,255,255,0.01)", display: "flex", alignItems: "center", gap: 10, minHeight: 60 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0f172a", border: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 14, opacity: 0.15 }}>?</span></div>
      <span style={{ fontSize: 12, color: "#334155", fontStyle: "italic" }}>Seleccionar {side}</span>
    </div>
  );
  const dc = DIVISION_COLORS[team.division] || { bg: "rgba(255,255,255,0.05)", color: "#64748b", label: "?" };
  return (
    <div style={{ flex: 1, padding: "14px 16px", borderRadius: 10, border: `1px solid ${dc.color}25`, background: `${dc.color}08`, display: "flex", alignItems: "center", gap: 12, minHeight: 60, transition: "all 0.25s ease" }}>
      <TeamBadge logo={team.logo} name={team.nombre} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.nombre}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 800, background: dc.bg, color: dc.color }}>{dc.label}</span>
          <span style={{ fontSize: 10, color: "#475569" }}>{side === "Local" ? "🏠" : "✈️"} {side}</span>
        </div>
      </div>
      <CheckCircle2 size={16} color={dc.color} opacity={0.5} />
    </div>
  );
};

const DivisionPill = ({ division }) => {
  const c = DIVISION_COLORS[division] || { bg: "rgba(255,255,255,0.05)", color: "#64748b", label: "?" };
  return <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: 800, background: c.bg, color: c.color, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>{c.label}</span>;
};

const PhaseReviewPanel = ({ phase, review }) => {
  const phaseInfo = PHASES.find(p => p.key === phase);
  const ok = review.warnings.length === 0;
  const items = [
    { label: "Total", value: review.total, color: "#94a3b8" },
    { label: "Finalizados", value: review.finished, color: "#10b981" },
    { label: "Pendientes", value: review.pending, color: "#f59e0b" },
    { label: "En curso", value: review.live, color: "#ef4444" },
  ];
  return (
    <div style={{ marginBottom: 16, border: `1px solid ${ok ? "rgba(16,185,129,0.18)" : "rgba(245,158,11,0.22)"}`, background: ok ? "linear-gradient(135deg,rgba(16,185,129,0.07),rgba(255,255,255,0.01))" : "linear-gradient(135deg,rgba(245,158,11,0.08),rgba(255,255,255,0.01))", borderRadius: 14, padding: 14, display: "grid", gridTemplateColumns: "minmax(220px,1.2fr) minmax(260px,2fr)", gap: 14 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: ok ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: ok ? "#10b981" : "#f59e0b" }}>{ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#e2e8f0" }}>{phaseInfo?.label || phase}</div>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700 }}>{ok ? "Sin alertas de coherencia" : "Revisa antes de publicar"}</div>
          </div>
        </div>
        <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ width: `${review.completion}%`, height: "100%", borderRadius: 99, background: ok ? "#10b981" : "#f59e0b" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch", flexWrap: "wrap" }}>
        {items.map(i => <div key={i.label} style={{ minWidth: 88, flex: "1 1 88px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.5)", borderRadius: 10, padding: "9px 10px" }}><div style={{ fontSize: 18, fontWeight: 900, color: i.color, fontFamily: "monospace" }}>{i.value}</div><div style={{ fontSize: 9, color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>{i.label}</div></div>)}
        {review.warnings.length > 0 && <div style={{ flex: "2 1 220px", border: "1px solid rgba(245,158,11,0.18)", background: "rgba(245,158,11,0.06)", borderRadius: 10, padding: "9px 10px", display: "flex", flexDirection: "column", gap: 4 }}>{review.warnings.map(w => <span key={w} style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>{w}</span>)}</div>}
      </div>
    </div>
  );
};

const FieldError = ({ msg }) => msg ? (
  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, color: "#ef4444", fontSize: 10, fontWeight: 600 }}><AlertTriangle size={10} />{msg}</div>
) : null;

const findOverlap = (form, allMatches) => {
  if (!form.fecha || !form.hora || !form.team1_id || !form.team2_id) return null;
  return allMatches.find(m => {
    if (String(m.id) === String(form.id)) return false;
    if (m.fecha !== form.fecha || m.hora !== form.hora) return false;
    return [String(m.team1_id), String(m.team2_id)].some(id => [String(form.team1_id), String(form.team2_id)].includes(id));
  });
};

const miniBtn = (color) => ({ width: 22, height: 22, borderRadius: 5, background: `${color}12`, border: `1px solid ${color}25`, color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" });

/* ─── Modal Partido ──────────────────────────────────────────────────────── */
const MatchModal = ({ match, teams, phase, allMatches, onSave, onClose }) => {
  const isIV = isIdaVueltaPhase(phase);
  const to12h = (h24) => { if (!h24) return { h: "12", m: "00", ampm: "AM" }; const [hh, mm] = h24.split(":"); let h = parseInt(hh) || 0; const ampm = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return { h: String(h).padStart(2, '0'), m: mm || "00", ampm }; };
  const from12h = (h12, m12, ampm) => { if (!h12 || h12 === "") return ""; let hh = parseInt(h12); if (ampm === "PM" && hh !== 12) hh += 12; if (ampm === "AM" && hh === 12) hh = 0; return String(hh).padStart(2, '0') + ":" + (m12 || "00"); };
  const [form, setForm] = useState(() => {
    if (match) return { ...match, team1_id: match.team1_id || "", team2_id: match.team2_id || "", llave: match.llave || "", fase: match.fase || phase, grupo: match.grupo || (phase === "grupos" ? "A" : ""), jornada: match.jornada || (isIdaVueltaPhase(match.fase) ? "ida" : ""), penales_local: match.penales_local != null ? match.penales_local : "", penales_visitante: match.penales_visitante != null ? match.penales_visitante : "" };
    return { team1_id: "", team2_id: "", llave: "", fecha: "", hora: "", goles_local: "", goles_visitante: "", estado: "Pendiente", fase: phase, grupo: phase === "grupos" ? "A" : "", jornada: isIV ? "ida" : "", penales_local: "", penales_visitante: "" };
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const currentIsGrupos = form.fase === "grupos";
  const currentIsIV = isIdaVueltaPhase(form.fase);

  const getAvailIds = () => {
    if (currentIsGrupos) { if (!form.grupo) return []; return teams.filter(t => t.grupo === form.grupo).map(t => String(t.id)); }
    return getAvailableForPhase(form.fase, allMatches, teams, form.id, form.llave);
  };
  const availIds = getAvailIds();
  const availableTeams = teams.filter(t => availIds.includes(String(t.id)) || String(t.id) === String(form.team1_id) || String(t.id) === String(form.team2_id));
  const sel1 = teams.find(t => String(t.id) === String(form.team1_id));
  const sel2 = teams.find(t => String(t.id) === String(form.team2_id));
  const overlap = findOverlap(form, allMatches);

  const validate = () => {
    const e = {};
    if (currentIsGrupos && !form.grupo) e.grupo = "Selecciona un grupo";
    if (!form.team1_id) e.team1 = "Selecciona equipo local";
    if (!form.team2_id) e.team2 = "Selecciona equipo visitante";
    if (form.team1_id && form.team2_id && String(form.team1_id) === String(form.team2_id)) e.team2 = "Un equipo no puede enfrentarse a sí mismo";
    if (currentIsGrupos && form.grupo && form.team1_id && form.team2_id) {
      const dup = allMatches.find(m => { if (String(m.id) === String(form.id)) return false; if (m.fase !== "grupos" || m.grupo !== form.grupo) return false; const p1 = [String(m.team1_id), String(m.team2_id)].sort().join("-"); const p2 = [String(form.team1_id), String(form.team2_id)].sort().join("-"); return p1 === p2; });
      if (dup) e.team2 = "Este enfrentamiento ya existe en el grupo";
    }
    // Validar que equipos no estén repetidos en otra llave de knockout
    if (!currentIsGrupos && form.team1_id && form.team2_id) {
      const reused = allMatches.find(m => {
        if (String(m.id) === String(form.id)) return false;
        if (m.fase !== form.fase) return false;
        // Misma llave → permitido (ida/vuelta)
        if (m.llave != null && m.llave == form.llave) return false;
        // Mismos equipos (invertidos) → ida/vuelta aunque llave sea null
        const samePair = [String(m.team1_id), String(m.team2_id)].sort().join("-") === [String(form.team1_id), String(form.team2_id)].sort().join("-");
        if (samePair) return false;
        return [String(m.team1_id), String(m.team2_id)].some(id => id === String(form.team1_id) || id === String(form.team2_id));
      });
      if (reused) {
        const reusedTeam = [String(reused.team1_id), String(reused.team2_id)].some(id => id === String(form.team1_id)) ? form.team1_id : form.team2_id;
        const tn = teams.find(t => String(t.id) === String(reusedTeam))?.nombre || "Un equipo";
        e.team2 = `${tn} ya está asignado a otra llave`;
      }
    }
    if (overlap) { const c = [form.team1_id, form.team2_id].find(id => [String(overlap.team1_id), String(overlap.team2_id)].includes(String(id))); const tn = teams.find(t => String(t.id) === String(c))?.nombre || "Un equipo"; e.fecha = `${tn} ya tiene partido el ${overlap.fecha} a las ${overlap.hora}`; }
    if (form.estado === "Finalizado") { if (form.goles_local === "" || form.goles_local === null) e.goles_local = "Requerido"; if (form.goles_visitante === "" || form.goles_visitante === null) e.goles_visitante = "Requerido"; }
    if (currentIsIV && !form.jornada) e.jornada = "Selecciona ida o vuelta";
    if (form.estado !== "Pendiente") {
      if (!form.fecha) e.fecha_req = "Fecha requerida";
      if (!form.hora) e.hora_req = "Hora requerida";
    }
    return e;
  };

  const touch = (f) => setTouched(p => ({ ...p, [f]: true }));
  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; }); };
  const handleGrupoChange = (g) => { setForm(p => ({ ...p, grupo: g, team1_id: "", team2_id: "" })); if (errors.team1) setErrors(p => { const n = { ...p }; delete n.team1; delete n.team2; return n; }); };

  const handleSave = async () => {
  const errs = validate();

  setErrors(errs);

  setTouched({
    team1: true,
    team2: true,
    fecha: true,
    hora: true,
    jornada: true,
    goles_local: true,
    goles_visitante: true,
    grupo: true
  });

  if (Object.keys(errs).length > 0) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Corrige los errores",
      showConfirmButton: false,
      timer: 2500
    });

    return;
  }

  setSaving(true);

  try {
    const endpoint = form.id
      ? "copa_update_match.php"
      : "copa_create_match.php";

    const payload = {
      ...form,

      team1_id: parseInt(form.team1_id),

      team2_id: parseInt(form.team2_id),

      grupo: currentIsGrupos
        ? form.grupo
        : null,

      jornada: currentIsIV
        ? form.jornada
        : null,

      llave: form.llave
        ? parseInt(form.llave)
        : null
    };

    // Solo enviar penales en vuelta
    delete payload.penales_local;
    delete payload.penales_visitante;

    if (
      currentIsIV &&
      form.jornada === "vuelta" &&
      form.penales_local !== "" &&
      form.penales_visitante !== ""
    ) {
      payload.penales_local = form.penales_local;
      payload.penales_visitante = form.penales_visitante;
    }

    const res = await apiPost(`${API_BASE}${endpoint}`, payload).then(r => r.json());

    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: form.id
          ? "Partido actualizado"
          : "Partido creado",
        showConfirmButton: false,
        timer: 1800
      });

      onSave();
    } else {
      throw new Error(res.message || "Error");
    }

  } catch (err) {

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: err.message,
      showConfirmButton: false,
      timer: 2500
    });

  } finally {
    setSaving(false);
  }
};

  const inp = (hasError) => ({ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#0f172a", border: hasError ? "1px solid rgba(239,68,68,0.5)" : "1px solid #1e293b", color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" });
  const lbl = { fontSize: 10, color: "#64748b", fontWeight: 700, display: "block", marginBottom: 5, letterSpacing: "0.5px" };
  const showPenales = currentIsIV && form.jornada === "vuelta" && form.estado === "Finalizado";
  const isEditing = !!form.id;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(6px)", animation: "modalFadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 16, width: "100%", maxWidth: 540, maxHeight: "94vh", overflow: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.9)", animation: "modalSlideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", background: isEditing ? "rgba(59,130,246,0.04)" : "rgba(16,185,129,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: isEditing ? "rgba(59,130,246,0.12)" : "rgba(16,185,129,0.12)" }}>
              {isEditing ? <Edit2 size={16} color="#60a5fa" /> : <Plus size={16} color="#10b981" />}
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#e2e8f0", fontWeight: 800, fontSize: 15 }}>{isEditing ? "Editar Partido" : "Nuevo Partido"}</h3>
              <p style={{ margin: "2px 0 0", fontSize: 10, color: "#475569" }}>
                {PHASES.find(p => p.key === form.fase)?.icon} {PHASES.find(p => p.key === form.fase)?.label}
                {currentIsIV && form.jornada && <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 4, background: "rgba(168,85,247,0.12)", color: "#a855f7", fontSize: 9, fontWeight: 700 }}>{form.jornada.toUpperCase()}</span>}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", color: "#475569", cursor: "pointer", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
            onMouseEnter={e => { e.target.style.background = "rgba(239,68,68,0.1)"; e.target.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.color = "#475569"; }}><X size={16} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: currentIsGrupos ? "1fr 1fr" : (currentIsIV ? "1fr 1fr" : "1fr"), gap: 10 }}>
            <div>
              <label style={lbl}>FASE</label>
              <select value={form.fase} onChange={e => set("fase", e.target.value)} disabled={isEditing} style={{ ...inp(false), opacity: isEditing ? 0.5 : 1, cursor: isEditing ? "not-allowed" : "pointer" }}>
                {PHASES.map(p => <option key={p.key} value={p.key}>{p.icon} {p.label}</option>)}
              </select>
              {isEditing && <p style={{ margin: "3px 0 0", fontSize: 9, color: "#334155" }}>La fase no se puede cambiar</p>}
            </div>
            {currentIsGrupos && (
              <div>
                <label style={lbl}>GRUPO</label>
                <select value={form.grupo || ""} onChange={e => handleGrupoChange(e.target.value)} style={inp(touched.grupo && errors.grupo)}>
                  <option value="">Seleccionar...</option>
                  {GROUPS.map(g => <option key={g} value={g}>Grupo {g}</option>)}
                </select>
                {touched.grupo && errors.grupo && <FieldError msg={errors.grupo} />}
                {form.grupo && <p style={{ margin: "3px 0 0", fontSize: 9, color: "#334155" }}>{availableTeams.length} equipo{availableTeams.length !== 1 ? "s" : ""} disponible{availableTeams.length !== 1 ? "s" : ""}</p>}
              </div>
            )}
            {currentIsIV && (
              <div>
                <label style={lbl}>JORNADA</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ v: "ida", l: "🏃 Ida", c: "#3b82f6" }, { v: "vuelta", l: "🔄 Vuelta", c: "#a855f7" }].map(j => {
                    const act = form.jornada === j.v; return (<button key={j.v} onClick={() => set("jornada", j.v)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, border: act ? `1px solid ${j.c}50` : "1px solid #1e293b", background: act ? `${j.c}15` : "rgba(255,255,255,0.02)", color: act ? j.c : "#475569", transition: "all 0.2s" }}>{j.l}</button>);
                  })}
                </div>
                {touched.jornada && errors.jornada && <FieldError msg={errors.jornada} />}
              </div>
            )}
          </div>
          {!currentIsGrupos && (
            <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
              <ArrowLeftRight size={13} color="#a855f7" opacity={0.6} />
              <span style={{ fontSize: 10, color: "#64748b" }}>{availableTeams.length} equipo{availableTeams.length !== 1 ? "s" : ""} disponible{availableTeams.length !== 1 ? "s" : ""}{availableTeams.length === 0 && " — ⚠️ No hay clasificados aún"}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}><TeamPreview team={sel1} side="Local" /><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}><span style={{ fontSize: 16, fontWeight: 900, color: "#1e293b", fontFamily: "monospace" }}>VS</span></div><TeamPreview team={sel2} side="Visitante" /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={lbl}>EQUIPO LOCAL</label><select value={form.team1_id} onChange={e => { set("team1_id", e.target.value); touch("team1"); }} style={inp(touched.team1 && errors.team1)} disabled={availableTeams.length === 0 && !form.team1_id}><option value="">Seleccionar...</option>{availableTeams.map(t => <option key={t.id} value={t.id}>{t.nombre} ({DIVISION_COLORS[t.division]?.label || "?"})</option>)}</select>{touched.team1 && errors.team1 && <FieldError msg={errors.team1} />}</div>
            <div><label style={lbl}>EQUIPO VISITANTE</label><select value={form.team2_id} onChange={e => { set("team2_id", e.target.value); touch("team2"); }} style={inp(touched.team2 && errors.team2)} disabled={availableTeams.length === 0 && !form.team2_id}><option value="">Seleccionar...</option>{availableTeams.map(t => <option key={t.id} value={t.id}>{t.nombre} ({DIVISION_COLORS[t.division]?.label || "?"})</option>)}</select>{touched.team2 && errors.team2 && <FieldError msg={errors.team2} />}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={lbl}>FECHA</label><input type="date" value={form.fecha || ""} onChange={e => { set("fecha", e.target.value); touch("fecha"); }} style={inp(touched.fecha && (errors.fecha || errors.fecha_req))} />{touched.fecha && errors.fecha_req && <FieldError msg={errors.fecha_req} />}{touched.fecha && errors.fecha && <FieldError msg={errors.fecha} />}</div>
            <div><label style={lbl}>HORA</label>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <select value={to12h(form.hora).h} onChange={e => { set("hora", from12h(e.target.value, to12h(form.hora).m, to12h(form.hora).ampm)); touch("hora"); }} style={{ ...inp(touched.hora && errors.hora_req), width: 62, padding: "10px 6px", textAlign: "center" }}>
                {["01","02","03","04","05","06","07","08","09","10","11","12"].map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span style={{ color: "#475569", fontWeight: 800, fontSize: 14 }}>:</span>
              <select value={to12h(form.hora).m} onChange={e => { set("hora", from12h(to12h(form.hora).h, e.target.value, to12h(form.hora).ampm)); touch("hora"); }} style={{ ...inp(touched.hora && errors.hora_req), width: 62, padding: "10px 6px", textAlign: "center" }}>
                {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button type="button" onClick={() => { set("hora", from12h(to12h(form.hora).h, to12h(form.hora).m, "AM")); touch("hora"); }} style={{ ...inp(), padding: "10px 6px", cursor: "pointer", fontWeight: 800, fontSize: 12, background: to12h(form.hora).ampm === "AM" ? "rgba(226,179,64,0.12)" : "", borderColor: to12h(form.hora).ampm === "AM" ? "#e2b340" : "", color: to12h(form.hora).ampm === "AM" ? "#e2b340" : "" }}>AM</button>
              <button type="button" onClick={() => { set("hora", from12h(to12h(form.hora).h, to12h(form.hora).m, "PM")); touch("hora"); }} style={{ ...inp(), padding: "10px 6px", cursor: "pointer", fontWeight: 800, fontSize: 12, background: to12h(form.hora).ampm === "PM" ? "rgba(226,179,64,0.12)" : "", borderColor: to12h(form.hora).ampm === "PM" ? "#e2b340" : "", color: to12h(form.hora).ampm === "PM" ? "#e2b340" : "" }}>PM</button>
            </div>
            {touched.hora && errors.hora_req && <FieldError msg={errors.hora_req} />}</div>
          </div>
          <div>
            <label style={lbl}>MARCADOR {form.estado === "Finalizado" && <span style={{ color: "#ef4444" }}>*</span>}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 8, alignItems: "center" }}>
              <div><input type="number" min="0" value={form.goles_local ?? ""} placeholder="0" onChange={e => { set("goles_local", e.target.value === "" ? "" : parseInt(e.target.value)); touch("goles_local"); }} style={{ ...inp(touched.goles_local && errors.goles_local), textAlign: "center", fontSize: 22, fontFamily: "monospace", fontWeight: 900 }} />{touched.goles_local && errors.goles_local && <FieldError msg={errors.goles_local} />}</div>
              <span style={{ textAlign: "center", color: "#1e293b", fontWeight: 900, fontSize: 18 }}>–</span>
              <div><input type="number" min="0" value={form.goles_visitante ?? ""} placeholder="0" onChange={e => { set("goles_visitante", e.target.value === "" ? "" : parseInt(e.target.value)); touch("goles_visitante"); }} style={{ ...inp(touched.goles_visitante && errors.goles_visitante), textAlign: "center", fontSize: 22, fontFamily: "monospace", fontWeight: 900 }} />{touched.goles_visitante && errors.goles_visitante && <FieldError msg={errors.goles_visitante} />}</div>
            </div>
          </div>
          {showPenales && (<div style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.05)" }}><label style={{ ...lbl, color: "#a855f7" }}>🎯 PENALES (si hay empate global)</label><div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr", gap: 8, alignItems: "center" }}><input type="number" min="0" value={form.penales_local ?? ""} placeholder="0" onChange={e => set("penales_local", e.target.value === "" ? "" : parseInt(e.target.value))} style={{ ...inp(false), textAlign: "center", fontSize: 18, fontFamily: "monospace", fontWeight: 900, borderColor: "rgba(168,85,247,0.25)" }} /><span style={{ textAlign: "center", color: "#a855f7", fontWeight: 900, fontSize: 14 }}>–</span><input type="number" min="0" value={form.penales_visitante ?? ""} placeholder="0" onChange={e => set("penales_visitante", e.target.value === "" ? "" : parseInt(e.target.value))} style={{ ...inp(false), textAlign: "center", fontSize: 18, fontFamily: "monospace", fontWeight: 900, borderColor: "rgba(168,85,247,0.25)" }} /></div><p style={{ margin: "6px 0 0", fontSize: 9, color: "#64748b" }}>Penales del equipo local vs visitante de la VUELTA</p></div>)}
          <div>
            <label style={lbl}>ESTADO</label>
            <div style={{ display: "flex", gap: 8 }}>
              {STATUSES.map(s => { const st = statusStyle(s); const active = form.estado === s; return (<button key={s} onClick={() => set("estado", s)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700, border: active ? `1px solid ${st.color}40` : "1px solid #1e293b", background: active ? st.bg : "rgba(255,255,255,0.02)", color: active ? st.color : "#475569", transition: "all 0.2s", transform: active ? "scale(1.02)" : "scale(1)" }}>{s}</button>); })}
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #1e293b", display: "flex", gap: 10, justifyContent: "flex-end", background: "rgba(0,0,0,0.15)" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "10px 26px", borderRadius: 8, background: "linear-gradient(135deg,#dc2626,#ef4444)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s", transform: saving ? "scale(0.98)" : "scale(1)", boxShadow: "0 4px 15px rgba(220,38,38,0.25)" }}><Save size={14} /> {saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Modal Grupos (con auto-generación) ─────────────────────────────────── */
const GroupModal = ({ teams, existingMatches, onSave, onClose }) => {
  const initial = { A: [], B: [], C: [], D: [], E: [], F: [] };
  teams.forEach(t => { if (t.grupo && initial[t.grupo]) initial[t.grupo].push(String(t.id)); });
  const [assignments, setAssignments] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState({ done: 0, total: 0 });
  const [importLog, setImportLog] = useState([]);
  const fileInputRef = useRef(null);

  const total = Object.values(assignments).flat().length;
  const newMatchCount = countNewGroupMatches(assignments, existingMatches);
  const hasGroups = GROUPS.some(g => (assignments[g] || []).length >= 2);

  const getGroup = (id) => { for (const [g, ids] of Object.entries(assignments)) if (ids.includes(String(id))) return g; return ""; };
  const assign = (teamId, group) => { const id = String(teamId); setAssignments(prev => { const next = {}; GROUPS.forEach(g => { next[g] = (prev[g] || []).filter(x => x !== id); }); if (group) { if ((next[group] || []).length >= 4) { Swal.fire({ toast: true, position: "top-end", icon: "warning", title: `Grupo ${group} lleno`, showConfirmButton: false, timer: 1800 }); return prev; } next[group] = [...(next[group] || []), id]; } return next; }); };

  /* ── Guardar grupos ── */
  const handleSaveGroups = async () => {
    if (total < teams.length) { const r = await Swal.fire({ title: "Equipos sin grupo", text: `${teams.length - total} sin asignar. ¿Continuar?`, icon: "warning", showCancelButton: true, confirmButtonText: "Sí", cancelButtonText: "Cancelar", background: "#1e293b", color: "#fff" }); if (!r.isConfirmed) return; }
    setSaving(true);

    try { const res = await apiPost(`${API_BASE}copa_save_groups.php`, { assignments }).then(r => r.json()); if (res.success) { Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Grupos guardados", showConfirmButton: false, timer: 1800 }); onSave(); } else throw new Error(res.message || "Error"); }
    catch (err) { Swal.fire({ toast: true, position: "top-end", icon: "error", title: err.message, showConfirmButton: false, timer: 2500 }); }
    finally { setSaving(false); }
  };

  /* ── Guardar + Auto-generar partidos ── */
  const handleSaveAndGenerate = async () => {
    if (!hasGroups) {
      Swal.fire({ toast: true, position: "top-end", icon: "warning", title: "Asigna al menos 2 equipos a un grupo", showConfirmButton: false, timer: 2500 });
      return;
    }
    if (total < teams.length) {
      const r = await Swal.fire({
        title: "Equipos sin grupo",
        text: `${teams.length - total} sin asignar. ¿Continuar?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
        background: "#1e293b",
        color: "#fff"
      });
      if (!r.isConfirmed) return;
    }

    /* ── Preview ── */
    const preview = [];
    GROUPS.forEach(g => {
      const ids = assignments[g] || [];
      if (ids.length < 2) return;
      const pairs = generateGroupPairings(ids);
      const existing = existingMatches.filter(m => m.fase === "grupos" && m.grupo === g);
      const newPairs = pairs.filter(([t1, t2]) =>
        !existing.some(m =>
          [String(m.team1_id), String(m.team2_id)].sort().join("-") ===
          [String(t1), String(t2)].sort().join("-")
        )
      );
      if (newPairs.length > 0) {
        const names = newPairs.map(([t1, t2]) =>
          `${teams.find(x => String(x.id) === t1)?.nombre || "?"} vs ${teams.find(x => String(x.id) === t2)?.nombre || "?"}`
        );
        preview.push(
          `<div style="margin-bottom:10px">
            <div style="font-weight:700;color:#ef4444;font-size:12px;margin-bottom:4px">Grupo ${g} — ${newPairs.length} partido${newPairs.length !== 1 ? "s" : ""}</div>
            ${names.map(n => `<div style="font-size:11px;color:#94a3b8;padding:1px 0">• ${n}</div>`).join("")}
          </div>`
        );
      }
    });

    if (preview.length === 0) {
      Swal.fire({ toast: true, position: "top-end", icon: "info", title: "Todos los partidos ya existen", showConfirmButton: false, timer: 2500 });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "⚡ Auto-generar partidos",
      html: `<div style="text-align:left;max-height:300px;overflow-y:auto;padding:0 8px">${preview.join("")}</div>
        <div style="margin-top:10px;padding:8px 12px;border-radius:8;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.15);font-size:11px;color:#a855f7;text-align:center;font-weight:600">${newMatchCount} partidos en Pendiente</div>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "⚡ Generar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#a855f7",
      background: "#1e293b",
      color: "#fff",
      width: 480
    });
    if (!confirmResult.isConfirmed) return;

    setGenerating(true);

    /* ── Paso 1: Guardar grupos ── */
    try {
      const res = await apiPost(`${API_BASE}copa_save_groups.php`, { assignments }).then(r => r.json());
      if (!res.success) throw new Error(res.message || "Error guardando grupos");
    } catch (err) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: err.message, showConfirmButton: false, timer: 2500 });
      setGenerating(false);
      return;
    }

    /* ── Paso 2: Construir lista de partidos nuevos ── */
    const toCreate = [];
    GROUPS.forEach(g => {
      const ids = assignments[g] || [];
      if (ids.length < 2) return;
      generateGroupPairings(ids).forEach(([t1, t2]) => {
        const exists = existingMatches.some(m =>
          m.fase === "grupos" && m.grupo === g &&
          [String(m.team1_id), String(m.team2_id)].sort().join("-") ===
          [String(t1), String(t2)].sort().join("-")
        );
        if (!exists) {
          toCreate.push({
            fase: "grupos",
            grupo: g,
            team1_id: parseInt(t1) || t1,
            team2_id: parseInt(t2) || t2,
            estado: "Pendiente",
          });
        }
      });
    });

    if (toCreate.length === 0) {
      setGenerating(false);
      Swal.fire({ toast: true, position: "top-end", icon: "info", title: "No hay partidos nuevos para generar", showConfirmButton: false, timer: 2500 });
      onSave();
      return;
    }

    /* ── Paso 3: Crear partidos ── */
    setGenProgress({ done: 0, total: toCreate.length });
    let created = 0, failed = 0;
    const errors = [];

    for (const match of toCreate) {
      try {
        const res = await apiPost(`${API_BASE}copa_create_match.php`, match).then(r => r.json());
        if (res.success) {
          created++;
        } else {
          failed++;
          errors.push(res.message || "Error desconocido");
        }
      } catch (err) {
        failed++;
        errors.push(err.message);
      }
      setGenProgress({ done: created + failed, total: toCreate.length });
    }

    setGenerating(false);

    if (failed > 0 && errors.length > 0) {
      await Swal.fire({
        title: "⚠️ Algunos partidos fallaron",
        html: `<div style="text-align:left;font-size:12px;color:#94a3b8">
          <p>✅ ${created} creado${created !== 1 ? "s" : ""}</p>
          <p>❌ ${failed} fallido${failed !== 1 ? "s" : ""}</p>
          <div style="margin-top:8px;padding:8px;background:rgba(239,68,68,0.08);border-radius:6;font-size:11px;color:#ef4444;max-height:120px;overflow-y:auto">
            ${errors.slice(0, 5).map(e => `<div>• ${e}</div>`).join("")}
          </div>
          <div style="margin-top:8px;padding:8px;background:rgba(0,0,0,0.2);border-radius:6;font-size:10px;color:#64748b;max-height:120px;overflow-y:auto;font-family:monospace">
            Payload enviado: ${JSON.stringify(toCreate[0])}
          </div>
        </div>`,
        background: "#1e293b",
        color: "#fff",
        confirmButtonText: "Entendido",
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `${created} partido${created !== 1 ? "s" : ""} generado${created !== 1 ? "s" : ""}`,
        showConfirmButton: false,
        timer: 3000
      });
    }

    onSave();
  };

  const handleCSVImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;

      // Detectar separador automáticamente
      const separator = text.includes(";") ? ";" : ",";

      const lines = text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "CSV vacío",
          showConfirmButton: false,
          timer: 2000
        });
        return;
      }

      const header = lines[0]
        .split(separator)
        .map(c =>
          c
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        );

      const grupoIdx = header.findIndex(c => c === "grupo");

      const nombreIdx = header.findIndex(c =>
        ["nombre", "equipo", "team"].includes(c)
      );

      const divisionIdx = header.findIndex(c =>
        ["division", "div"].includes(c)
      );

      if (grupoIdx === -1 || nombreIdx === -1) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "CSV necesita columnas: Grupo, Nombre",
          showConfirmButton: false,
          timer: 2500
        });
        return;
      }

      const na = {};

      GROUPS.forEach(g => {
        na[g] = [];
      });

      const log = [];
      const notFound = [];

      let asignados = 0;
      const mapExact = {};
      const mapNorm = {};
      const mapExactDiv = {};
      const mapNormDiv = {};

      teams.forEach(t => {

        const exact = t.nombre.toLowerCase();

        const norm = normalizeName(t.nombre);

        const div = (t.division || "").toLowerCase();

        mapExact[exact] = t;

        mapNorm[norm] = t;

        mapExactDiv[`${exact}|${div}`] = t;

        mapNormDiv[`${norm}|${div}`] = t;
      });

      for (let i = 1; i < lines.length; i++) {

        const cols = lines[i]
          .split(separator)
          .map(c => c.trim().replace(/^"|"$/g, ""));

        const g = cols[grupoIdx]?.toUpperCase();

        const n = cols[nombreIdx]?.trim();

        const d =
          divisionIdx !== -1
            ? (cols[divisionIdx]?.trim() || "")
            : "";

        if (!GROUPS.includes(g) || !n) { log.push(`❌ Fila ${i + 1}: datos incompletos`); continue; }

        const nLower = n.toLowerCase();
        const nNorm = normalizeName(n);
        const dLower = d.toLowerCase();

        /* Nivel 1: Exacto + División */
        let tid = null, matchMethod = "";
        const edKey = `${nLower}|${dLower}`;
        if (mapExactDiv[edKey]) { tid = mapExactDiv[edKey].id; matchMethod = "exacto+div"; }

        /* Nivel 2: Normalizado + División */
        if (!tid) {
          const ndKey = `${nNorm}|${dLower}`;
          if (mapNormDiv[ndKey]) { tid = mapNormDiv[ndKey].id; matchMethod = "normalizado+div"; }
        }

        /* Nivel 3: Exacto sin división */
        if (!tid && mapExact[nLower]) { tid = mapExact[nLower].id; matchMethod = "exacto"; }

        /* Nivel 4: Normalizado sin división */
        if (!tid && mapNorm[nNorm]) { tid = mapNorm[nNorm].id; matchMethod = "normalizado"; }

        /* Nivel 5: Parcial (contiene o contenido) */
        if (!tid) {
          const partial = teams.find(t => {
            const tNorm = normalizeName(t.nombre);
            return tNorm.includes(nNorm) || nNorm.includes(tNorm);
          });
          if (partial) { tid = partial.id; matchMethod = "parcial"; }
        }

        if (!tid) {
          notFound.push({ nombre: n, division: d });
          log.push(`⚠️ "${n}"${d ? ` (${d})` : ""} no encontrado en BD`);
          continue;
        }

        const foundTeam = teams.find(t => String(t.id) === String(tid));
        if (na[g].includes(String(tid))) { log.push(`⚠️ "${n}" ya estaba en Grupo ${g}`); continue; }
        if (na[g].length >= 4) { log.push(`⚠️ Grupo ${g} lleno — "${n}" no se agregó`); continue; }

        na[g].push(String(tid));
        asignados++;
        log.push(`✅ "${foundTeam?.nombre || n}" → Grupo ${g} [${matchMethod}]`);
      }

      setAssignments(na);
      setImportLog(log);

      if (notFound.length > 0) {
        const teamListHtml = teams.sort((a, b) => a.nombre.localeCompare(b.nombre)).map(t =>
          `<div style="padding:1px 0;color:#94a3b8;font-size:10px">• ID:${t.id} | "${t.nombre}" | ${t.division}</div>`
        ).join("");

        Swal.fire({
          title: `⚠️ ${notFound.length} equipo(s) no encontrado(s)`,
          html: `<div style="text-align:left;font-size:11px;max-height:450px;overflow-y:auto">
            <div style="margin-bottom:12px">
              <p style="color:#ef4444;font-weight:700;margin-bottom:6px">No match en equipos_copa:</p>
              ${notFound.map(n => `<div style="padding:4px 8px;margin:3px 0;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);border-radius:6;color:#ef4444;font-weight:600">❌ "${n.nombre}"${n.division ? ` (${n.division})` : ""}</div>`).join("")}
            </div>
            <div style="padding:10px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);border-radius:8">
              <p style="color:#60a5fa;font-weight:700;font-size:10px;margin-bottom:6px">📋 EQUIPOS DISPONIBLES EN BD (${teams.length}):</p>
              <div style="max-height:180px;overflow-y:auto">${teamListHtml}</div>
            </div>
            <div style="margin-top:10px;padding:8px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);border-radius:8">
              <p style="color:#f59e0b;font-size:10px;font-weight:600">💡 Si falta un equipo, agregalo primero a la tabla <code>equipos_copa</code> en la BD, luego recargá esta página.</p>
            </div>
          </div>`,
          icon: "warning",
          confirmButtonText: "Entendido",
          background: "#1e293b",
          color: "#fff",
          width: 560,
        });
      } else {
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: `${asignados} equipos asignados`, showConfirmButton: false, timer: 3000 });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const downloadTemplate = () => { const csv = "Grupo,Nombre,Division\nA,Nombre del Equipo,Primera\nB,Otro Equipo,Ascenso\n"; const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "plantilla_grupos_copa.csv"; a.click(); URL.revokeObjectURL(url); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)", animation: "modalFadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 16, width: "100%", maxWidth: 760, maxHeight: "93vh", overflow: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.9)", animation: "modalSlideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><h3 style={{ margin: 0, color: "#e2e8f0", fontWeight: 800, fontSize: 16 }}>Asignar Equipos a Grupos</h3><p style={{ margin: "3px 0 0", fontSize: 11, color: "#475569" }}>{total}/{teams.length} asignados</p></div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer" }}><X size={20} /></button>
        </div>

        {/* Barra CSV */}
        <div style={{ padding: "14px 22px", borderBottom: "1px solid #1e293b", background: "rgba(59,130,246,0.03)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleCSVImport} style={{ display: "none" }} />
          <button onClick={() => fileInputRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#3b82f6)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}><Upload size={14} /> Importar CSV</button>
          <button onClick={downloadTemplate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>📥 Plantilla</button>
        </div>

        {/* Log CSV */}
        {importLog.length > 0 && (<div style={{ padding: "10px 22px", borderBottom: "1px solid #1e293b", background: "rgba(0,0,0,0.2)", maxHeight: 80, overflowY: "auto" }}><div style={{ fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: "1px", marginBottom: 4 }}>LOG</div>{importLog.map((l, i) => <div key={i} style={{ fontSize: 10, padding: "1px 0", color: l.startsWith("✅") ? "#10b981" : l.startsWith("⚠️") ? "#f59e0b" : "#ef4444", fontFamily: "monospace" }}>{l}</div>)}</div>)}

        {/* Vista grupos */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {GROUPS.map(g => {
              const gt = (assignments[g] || []).map(id => teams.find(t => String(t.id) === id)).filter(Boolean).sort((a, b) => a.nombre.localeCompare(b.nombre)); const full = gt.length === 4; const matchCount = gt.length >= 2 ? gt.length * (gt.length - 1) / 2 : 0; return (
                <div key={g} style={{ background: "#0f172a", border: `1px solid ${full ? "rgba(16,185,129,0.3)" : "#1e293b"}`, borderRadius: 10, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#ef4444", letterSpacing: "1px" }}>GRUPO {g}</span>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 6, fontWeight: 700, background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>{matchCount} partidos</span>
                      <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, fontWeight: 700, background: full ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)", color: full ? "#10b981" : "#334155" }}>{gt.length}/4</span>
                    </div>
                  </div>
                  {gt.length === 0 ? <p style={{ fontSize: 10, color: "#1e293b", margin: 0, fontStyle: "italic" }}>Vacío</p> : gt.map(t => (<div key={t.id} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 0" }}><TeamBadge logo={t.logo} name={t.nombre} size={18} /><DivisionPill division={t.division} /><span style={{ fontSize: 10, color: "#64748b", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.nombre}</span></div>))}
                </div>);
            })}
          </div>

          {/* Lista equipos */}
          <div>
            <h4 style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "1px" }}>EQUIPOS ({teams.length})</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto" }}>
                {["Primera", "Ascenso"].map(div => {
                const dt = teams.filter(t => t.division === div).sort((a, b) => a.nombre.localeCompare(b.nombre));
                if (!dt.length) return null;
                return (<div key={div}><div style={{ fontSize: 9, fontWeight: 800, color: "#334155", letterSpacing: "2px", padding: "8px 0 4px" }}>{div} ({dt.length})</div>{dt.map(t => { const assigned = getGroup(t.id); return (<div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 8, marginBottom: 3, background: assigned ? "rgba(255,255,255,0.03)" : "rgba(239,68,68,0.03)", border: assigned ? "1px solid transparent" : "1px solid rgba(239,68,68,0.08)" }}><TeamBadge logo={t.logo} name={t.nombre} size={24} /><DivisionPill division={t.division} /><span style={{ flex: 1, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{t.nombre}</span>{assigned && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: "rgba(239,68,68,0.12)", color: "#ef4444", fontWeight: 800 }}>G{assigned}</span>}<select value={assigned} onChange={e => assign(t.id, e.target.value)} style={{ padding: "5px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#0f172a", border: "1px solid #1e293b", color: "#94a3b8", cursor: "pointer" }}><option value="">Sin grupo</option>{GROUPS.map(g => <option key={g} value={g}>Grupo {g}</option>)}</select></div>); })}</div>);
              })}            </div>
          </div>
        </div>

        {/* Progress bar de generación */}
        {generating && (
          <div style={{ padding: "12px 22px", borderTop: "1px solid #1e293b", background: "rgba(168,85,247,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", display: "flex", alignItems: "center", gap: 6 }}><Zap size={13} /> Generando partidos...</span>
              <span style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>{genProgress.done}/{genProgress.total}</span>
            </div>
            <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#0f172a", overflow: "hidden" }}>
              <div style={{ width: `${genProgress.total > 0 ? (genProgress.done / genProgress.total) * 100 : 0}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#7c3aed,#a855f7)", transition: "width 0.3s ease" }} />
            </div>
          </div>
        )}

        {/* Footer con dos botones */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid #1e293b", display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
          <button onClick={handleSaveGroups} disabled={saving || generating} style={{ padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#3b82f6)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: saving || generating ? "not-allowed" : "pointer", opacity: saving || generating ? 0.5 : 1, display: "flex", alignItems: "center", gap: 7 }}>
            <Save size={14} /> Solo guardar grupos
          </button>
          <button onClick={handleSaveAndGenerate} disabled={saving || generating || !hasGroups} style={{ padding: "10px 22px", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving || generating || !hasGroups ? "not-allowed" : "pointer", opacity: saving || generating || !hasGroups ? 0.4 : 1, display: "flex", alignItems: "center", gap: 7, boxShadow: hasGroups ? "0 4px 15px rgba(168,85,247,0.25)" : "none", transition: "all 0.2s" }}>
            <Zap size={15} /> Guardar + Generar {newMatchCount > 0 && <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 6, background: "rgba(255,255,255,0.2)", fontWeight: 800 }}>{newMatchCount}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Modal Reset ────────────────────────────────────────────────────────── */
const ResetModal = ({ onClose, onDone }) => {
  const [resetting, setResetting] = useState(null);
  const reset = async (mode, label) => { const r = await Swal.fire({ title: `¿${label}?`, text: "No se puede deshacer.", icon: "warning", showCancelButton: true, confirmButtonText: "Sí", cancelButtonText: "Cancelar", confirmButtonColor: "#ef4444", background: "#1e293b", color: "#fff" }); if (!r.isConfirmed) return; setResetting(mode); try { const res = await apiPost(`${API_BASE}copa_reset.php`, { mode }).then(r => r.json()); if (res.success) { Swal.fire({ toast: true, position: "top-end", icon: "success", title: res.message, showConfirmButton: false, timer: 2000 }); onDone(); } else throw new Error(res.message || "Error"); } catch (err) { Swal.fire({ toast: true, position: "top-end", icon: "error", title: err.message, showConfirmButton: false, timer: 2500 }); } finally { setResetting(null); } };
  const opts = [{ mode: "scores", label: "Reiniciar resultados", desc: "Partidos a Pendiente. Grupos y fixture se mantienen.", color: "#f59e0b", icon: "⏱️" }, { mode: "groups", label: "Limpiar grupos", desc: "Quita grupos. Partidos se mantienen.", color: "#3b82f6", icon: "🗂️" }, { mode: "all", label: "Reinicio total", desc: "Elimina todo. Desde cero.", color: "#ef4444", icon: "💥" }];
  return (<div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)", animation: "modalFadeIn 0.2s ease" }} onClick={onClose}><div style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 16, width: "100%", maxWidth: 440, boxShadow: "0 25px 60px rgba(0,0,0,0.9)", animation: "modalSlideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }} onClick={e => e.stopPropagation()}><div style={{ padding: "18px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><h3 style={{ margin: 0, color: "#ef4444", fontWeight: 800, fontSize: 16 }}>Reiniciar Copa</h3></div><button onClick={onClose} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer" }}><X size={20} /></button></div><div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>{opts.map(o => (<button key={o.mode} onClick={() => reset(o.mode, o.label)} disabled={!!resetting} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", borderRadius: 10, cursor: resetting ? "not-allowed" : "pointer", background: `${o.color}08`, border: `1px solid ${o.color}25`, textAlign: "left", opacity: resetting && resetting !== o.mode ? 0.4 : 1, transition: "all 0.2s" }}><span style={{ fontSize: 22, lineHeight: 1 }}>{o.icon}</span><div><div style={{ fontSize: 13, fontWeight: 700, color: o.color, marginBottom: 3 }}>{resetting === o.mode ? "Reiniciando..." : o.label}</div><div style={{ fontSize: 11, color: "#475569", lineHeight: 1.4 }}>{o.desc}</div></div></button>))}</div><div style={{ padding: "12px 20px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "flex-end" }}><button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cerrar</button></div></div></div>);
};

/* ─── Partidos bloqueados (grupos finalizados) ──────────────────────────── */
const LockedMatchRow = ({ m, onEdit }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, background: "rgba(16,185,129,0.02)", border: "1px solid rgba(16,185,129,0.08)", opacity: 0.85 }}>
    <TeamBadge logo={m.logo1} name={m.team1} size={20} />
    <span style={{ flex: 1, fontSize: 11, color: "#64748b", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{m.team1}</span>
    <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 900, color: "#10b981", padding: "0 8px", minWidth: 44, textAlign: "center" }}>{`${m.goles_local ?? 0}–${m.goles_visitante ?? 0}`}</span>
    <span style={{ flex: 1, fontSize: 11, color: "#64748b", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.team2}</span>
    <TeamBadge logo={m.logo2} name={m.team2} size={20} />
    <button onClick={(e) => { e.stopPropagation(); onEdit(m); }} title="Editar resultado" style={{ padding: "4px", borderRadius: 4, border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Edit2 size={11} color="#60a5fa" />
    </button>
  </div>
);

/* ─── Tabla de grupo ─────────────────────────────────────────────────────── */
const GroupTable = ({ groupName, teams, matches, onEdit, onQuickFinish, onDelete, best3rdIds = new Set() }) => {
  const stats = {};
  teams.forEach(t => { stats[t.id] = { id: t.id, nombre: t.nombre, logo: t.logo, division: t.division, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 }; });
  const groupMatches = matches.filter(m => m.grupo === groupName);
  groupMatches.filter(m => m.estado === "Finalizado").forEach(m => { const gl = parseInt(m.goles_local) || 0, gv = parseInt(m.goles_visitante) || 0; const l = String(m.team1_id), v = String(m.team2_id); if (stats[l]) { stats[l].pj++; stats[l].gf += gl; stats[l].gc += gv; if (gl > gv) { stats[l].g++; stats[l].pts += 3 } else if (gl === gv) { stats[l].e++; stats[l].pts++ } else stats[l].p++; } if (stats[v]) { stats[v].pj++; stats[v].gf += gv; stats[v].gc += gl; if (gv > gl) { stats[v].g++; stats[v].pts += 3 } else if (gl === gv) { stats[v].e++; stats[v].pts++ } else stats[v].p++; } });
  const rows = Object.values(stats).map(s => ({ ...s, dg: s.gf - s.gc })).sort((a, b) => b.pts - a.pts || (b.dg - a.dg) || (b.gf - a.gf));
  const thirdQualifies = (i) => i === 2 && best3rdIds.has(String(rows[i]?.id));
  const isQualified = (i) => i < 2 || thirdQualifies(i);
  if (!rows.length) return null;
  return (
    <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "11px 16px", borderBottom: "1px solid #0f172a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 900, fontSize: 14, color: "#ef4444" }}>Grupo {groupName}</span><span style={{ fontSize: 10, color: "#334155" }}>({rows.length})</span></div>
        <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 6, background: "rgba(16,185,129,0.08)", color: "#10b981", fontWeight: 700 }}>✅ {groupMatches.filter(m => m.estado === "Finalizado").length}/{groupMatches.length}</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}>{["#", "Equipo", "PJ", "G", "E", "P", "GF", "GC", "DG", "PTS"].map(h => (<th key={h} style={{ padding: "7px 10px", color: "#334155", fontWeight: 700, textAlign: h === "Equipo" ? "left" : "center", fontSize: 9, letterSpacing: "0.5px" }}>{h}</th>))}</tr></thead>
        <tbody>{rows.map((r, i) => { const q = isQualified(i); return (<tr key={r.id} style={{ borderTop: "1px solid #0f172a", transition: "background 0.12s", background: q ? "rgba(16,185,129,0.03)" : "transparent" }} onMouseEnter={e => { if (!q) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }} onMouseLeave={e => { e.currentTarget.style.background = q ? "rgba(16,185,129,0.03)" : "transparent"; }}>
          <td style={{ padding: "7px 10px", textAlign: "center", color: q ? "#10b981" : "#475569", fontWeight: 800 }}>{q ? <span style={{ marginRight: 3 }}>▲</span> : ""}{i + 1}</td>
          <td style={{ padding: "7px 10px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><TeamBadge logo={r.logo} name={r.nombre} size={24} /><span style={{ color: "#cbd5e1", fontWeight: 600 }}>{r.nombre}</span><DivisionPill division={r.division} /></div></td>
          {[r.pj, r.g, r.e, r.p, r.gf, r.gc, r.dg >= 0 ? `+${r.dg}` : r.dg].map((v, j) => (<td key={j} style={{ padding: "7px 10px", textAlign: "center", color: "#64748b" }}>{v}</td>))}
          <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 900, color: q ? "#10b981" : "#e2e8f0", fontSize: 13 }}>{r.pts}</td>
        </tr>); })}</tbody>
      </table>
      {groupMatches.length > 0 && (<div style={{ borderTop: "1px solid #0f172a", padding: "10px 14px", background: "rgba(0,0,0,0.15)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#334155", letterSpacing: "1px", marginBottom: 8 }}>PARTIDOS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {groupMatches.map((m, idx) => { const fin = m.estado === "Finalizado"; if (fin) return <LockedMatchRow key={m.id || idx} m={m} onEdit={onEdit} />; const st = statusStyle(m.estado); return (<div key={m.id || idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid #0f172a", transition: "all 0.15s", cursor: "pointer" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#1e293b"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#0f172a"; }} onClick={() => onEdit(m)}><TeamBadge logo={m.logo1} name={m.team1} size={20} /><span style={{ flex: 1, fontSize: 11, color: "#94a3b8", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{m.team1}</span><span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 900, color: "#1e293b", padding: "0 8px", minWidth: 44, textAlign: "center" }}>vs</span><span style={{ flex: 1, fontSize: 11, color: "#94a3b8", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.team2}</span><TeamBadge logo={m.logo2} name={m.team2} size={20} /><span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 5, background: st.bg, color: st.color, fontSize: 8, fontWeight: 800 }}>{m.estado}</span><button onClick={e => { e.stopPropagation(); onQuickFinish(m); }} style={miniBtn("#10b981")}>✓</button><button onClick={e => { e.stopPropagation(); onDelete(m.id); }} style={miniBtn("#ef4444")}><Trash2 size={10} /></button></div>); })}
        </div>
      </div>)}
    </div>
  );
};

/* ─── Fila de llave (ida/vuelta) ─────────────────────────────────────────── */
const KnockoutPair = ({ pair, onEdit, onQuickFinish, onDelete, onCreateVuelta, phaseLabel, index, total, onMoveUp, onMoveDown }) => {
  const showReorder = onMoveUp && onMoveDown && typeof index === "number" && total > 1;
  if (pair.type === "single") {
    const m = pair.match; const st = statusStyle(m.estado); const fin = m.estado === "Finalizado";
    return (<div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px" }}>
        {showReorder && (<div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 2 }}>
          {index > 0 && <button onClick={() => onMoveUp(index)} style={miniBtn("#3b82f6")} title="Subir"><ChevronUp size={12} /></button>}
          {index < total - 1 && <button onClick={() => onMoveDown(index)} style={miniBtn("#3b82f6")} title="Bajar"><ChevronDown size={12} /></button>}
        </div>)}
        <TeamBadge logo={m.logo1} name={m.team1} size={32} /><div style={{ flex: 1, textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1" }}>{m.team1 || "TBD"}</div>{m.division1 && <DivisionPill division={m.division1} />}</div>
        <div style={{ textAlign: "center", minWidth: 80 }}><div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 900, color: fin ? "#e2b340" : "#1e293b" }}>{fin ? `${m.goles_local ?? 0} – ${m.goles_visitante ?? 0}` : "– –"}</div><div style={{ fontSize: 9, color: "#334155", marginTop: 2 }}>{m.fecha ? m.fecha.substring(5, 10) : ""} {m.hora ? m.hora.substring(0, 5) : ""}</div></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1" }}>{m.team2 || "TBD"}</div>{m.division2 && <DivisionPill division={m.division2} />}</div><TeamBadge logo={m.logo2} name={m.team2} size={32} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 8 }}><span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 5, background: st.bg, color: st.color, fontSize: 8, fontWeight: 800, textAlign: "center" }}>{m.estado}</span>{!fin && <button onClick={() => onQuickFinish(m)} style={miniBtn("#10b981")}>✓</button>}<button onClick={() => onEdit(m)} style={miniBtn("#3b82f6")}><Edit2 size={10} /></button><button onClick={() => onDelete(m.id)} style={miniBtn("#ef4444")}><Trash2 size={10} /></button></div>
      </div>
      {fin && isIdaVueltaPhase(phaseLabel) && (<div style={{ padding: "10px 16px", borderTop: "1px solid #0f172a", background: "rgba(168,85,247,0.04)" }}><button onClick={() => onCreateVuelta(m)} style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: "linear-gradient(135deg,rgba(168,85,247,0.15),rgba(168,85,247,0.08))", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(168,85,247,0.12))"; }} onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(168,85,247,0.15),rgba(168,85,247,0.08))"; }}><ArrowLeftRight size={15} /> Jugar la vuelta<span style={{ fontSize: 9, opacity: 0.6, marginLeft: 4 }}>{m.team2} (local) vs {m.team1} (visitante)</span></button></div>)}
    </div>);
  }
  const { ida, vuelta } = pair; const idaFin = ida.estado === "Finalizado", vueFin = vuelta.estado === "Finalizado"; const agg = (idaFin && vueFin) ? getAggregate(ida, vuelta) : null;
  return (<div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid #0f172a", background: "rgba(59,130,246,0.02)" }}>
      {showReorder && (<div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 2 }}>
        {index > 0 && <button onClick={() => onMoveUp(index)} style={miniBtn("#3b82f6")} title="Subir"><ChevronUp size={12} /></button>}
        {index < total - 1 && <button onClick={() => onMoveDown(index)} style={miniBtn("#3b82f6")} title="Bajar"><ChevronDown size={12} /></button>}
      </div>)}
      <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 5, background: "rgba(59,130,246,0.12)", color: "#60a5fa", fontWeight: 800, letterSpacing: "0.5px", minWidth: 34, textAlign: "center" }}>IDA</span><TeamBadge logo={ida.logo1} name={ida.team1} size={26} /><div style={{ flex: 1, textAlign: "right" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#cbd5e1" }}>{ida.team1 || "TBD"}</div></div><div style={{ textAlign: "center", minWidth: 70 }}><div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 900, color: idaFin ? "#e2b340" : "#1e293b" }}>{idaFin ? `${ida.goles_local ?? 0} – ${ida.goles_visitante ?? 0}` : "– –"}</div><div style={{ fontSize: 8, color: "#334155" }}>{ida.fecha ? ida.fecha.substring(5, 10) : ""} {ida.hora ? ida.hora.substring(0, 5) : ""}</div></div><div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#cbd5e1" }}>{ida.team2 || "TBD"}</div></div><TeamBadge logo={ida.logo2} name={ida.team2} size={26} /><div style={{ display: "flex", gap: 3, marginLeft: 6 }}>{!idaFin && <button onClick={() => onQuickFinish(ida)} style={miniBtn("#10b981")}>✓</button>}<button onClick={() => onEdit(ida)} style={miniBtn("#3b82f6")}><Edit2 size={9} /></button><button onClick={() => onDelete(ida.id)} style={miniBtn("#ef4444")}><Trash2 size={9} /></button></div></div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(168,85,247,0.02)" }}><span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 5, background: "rgba(168,85,247,0.12)", color: "#a855f7", fontWeight: 800, letterSpacing: "0.5px", minWidth: 34, textAlign: "center" }}>VUELTA</span><TeamBadge logo={vuelta.logo1} name={vuelta.team1} size={26} /><div style={{ flex: 1, textAlign: "right" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#cbd5e1" }}>{vuelta.team1 || "TBD"}</div></div><div style={{ textAlign: "center", minWidth: 70 }}><div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 900, color: vueFin ? "#e2b340" : "#1e293b" }}>{vueFin ? `${vuelta.goles_local ?? 0} – ${vuelta.goles_visitante ?? 0}` : "– –"}</div><div style={{ fontSize: 8, color: "#334155" }}>{vuelta.fecha ? vuelta.fecha.substring(5, 10) : ""} {vuelta.hora ? vuelta.hora.substring(0, 5) : ""}</div></div><div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#cbd5e1" }}>{vuelta.team2 || "TBD"}</div></div><TeamBadge logo={vuelta.logo2} name={vuelta.team2} size={26} /><div style={{ display: "flex", gap: 3, marginLeft: 6 }}>{!vueFin && <button onClick={() => onQuickFinish(vuelta)} style={miniBtn("#10b981")}>✓</button>}<button onClick={() => onEdit(vuelta)} style={miniBtn("#3b82f6")}><Edit2 size={9} /></button><button onClick={() => onDelete(vuelta.id)} style={miniBtn("#ef4444")}><Trash2 size={9} /></button></div></div>
    {agg && (<div style={{ padding: "10px 16px", borderTop: "1px solid #0f172a", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}><span style={{ fontSize: 9, fontWeight: 800, color: "#475569", letterSpacing: "1px" }}>GLOBAL</span><div style={{ display: "flex", alignItems: "center", gap: 8 }}><TeamBadge logo={ida.logo1} name={ida.team1} size={18} /><span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: "#e2e8f0" }}>{agg.t1}</span><span style={{ color: "#334155", fontWeight: 900 }}>–</span><span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: "#e2e8f0" }}>{agg.t2}</span><TeamBadge logo={ida.logo2} name={ida.team2} size={18} /></div>{agg.method !== "Global" && <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 5, fontWeight: 800, background: agg.method === "Penales" ? "rgba(168,85,247,0.12)" : "rgba(245,158,11,0.12)", color: agg.method === "Penales" ? "#a855f7" : "#f59e0b" }}>{agg.method}{agg.method === "Penales" ? ` (${agg.pV}–${agg.pL})` : ""}</span>}{agg.winner && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 6, fontWeight: 800, background: "rgba(16,185,129,0.12)", color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={12} /> {agg.winner === 1 ? ida.team1 : ida.team2}</span>}</div>)}
  </div>);
};

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
const Sidebar = () => {
  const location = useLocation(); const [teamsOpen, setTeamsOpen] = useState(false);
  const [seleccionesOpen, setSeleccionesOpen] = useState(false);
const navItems = [
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
    ];  const handleLogout = () => { Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí", cancelButtonText: "Cancelar", background: "#1e293b", color: "#fff" }).then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); Swal.fire({ icon: "success", title: "Deslogueo exitoso", timer: 1500, showConfirmButton: false }).then(() => { window.location.href = "/login"; }); } }); };
  return (<aside className="sidebar"><div className="sidebar-header"><div className="logo-icon"><img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo" /></div><h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2></div><nav className="sidebar-nav"><ul>{navItems.map((item, idx) => { if (item.type === "dropdown") return (<li key={idx}><button className="nav-item" onClick={() => { const s = item.label === "Selecciones"; s ? setSeleccionesOpen(!seleccionesOpen) : setTeamsOpen(!teamsOpen); }} style={{ width: "100%", justifyContent: "space-between", border: "none", fontFamily: "inherit" }}><span style={{ display: "flex", alignItems: "center", gap: 14 }}>{item.icon} {item.label}</span><ChevronDown size={15} style={{ opacity: 0.4, transition: "transform 0.25s", transform: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "rotate(180deg)" : "none" }} /></button><ul style={{ maxHeight: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "400px" : "0", overflow: "hidden", transition: "max-height 0.3s", listStyle: "none", padding: 0, margin: 0 }}>{item.children.map(c => (<li key={c.path}><Link to={c.path} className={`nav-item${location.pathname === c.path ? " active" : ""}`} style={{ paddingLeft: 46, fontSize: 13 }}>{c.label}</Link></li>))}</ul></li>); return (<li key={item.path}><Link to={item.path} className={`nav-item${location.pathname === item.path ? " active" : ""}`}>{item.icon} {item.label}</Link></li>); })}</ul></nav><div className="sidebar-footer"><button className="nav-item btn-logout-sidebar" onClick={handleLogout} style={{ width: "100%", border: "none", fontFamily: "inherit" }}><LogOut size={18} /> Cerrar sesión</button></div></aside>);
};

/* ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────── */
const AdminCopPresidente = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePhase, setActivePhase] = useState("grupos");
  const [activeGroup, setActiveGroup] = useState("all");
  const [viewMode, setViewMode] = useState("matches");
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [btnAnim, setBtnAnim] = useState(null);
  const [autoGenerating, setAutoGenerating] = useState(false);

  const fetchData = useCallback(() => { setLoading(true); Promise.allSettled([safeFetch(`${API_BASE}copa_get_all_matches.php`), safeFetch(`${API_BASE}copa_get_teams.php`), safeFetch(`${API_BASE}copa_get_stats.php`)]).then(([rM, rT, rS]) => { if (rM.status === "fulfilled") setMatches(rM.value?.data || []); if (rT.status === "fulfilled") setTeams(rT.value?.data || []); if (rS.status === "fulfilled") setStats(rS.value?.data || {}); }).finally(() => setLoading(false)); }, []);
  useEffect(() => { void Promise.resolve().then(fetchData); }, [fetchData]);

  useEffect(() => {
    if (sessionStorage.getItem("adminTourCopa")) return;
    const timer = setTimeout(() => {
      const d = driver({
        showProgress: true, allowClose: true,
        nextBtnText: "Siguiente", prevBtnText: "Atrás", doneBtnText: "Entendido",
        steps: [
          { element: "#driver-copa-phases", popover: { title: "Fases del Torneo", description: "Navega entre Grupos, Octavos, Cuartos, Semis y Final. Cada pestaña muestra sus partidos.", side: "bottom", align: "start" } },
          { element: "#driver-copa-new", popover: { title: "Nuevo Partido", description: "Creá partidos manualmente seleccionando equipos, fecha, hora y fase.", side: "bottom", align: "center" } },
          { element: "#driver-copa-groups", popover: { title: "Asignar Grupos", description: "Organiza los equipos en grupos A-F para la fase de grupos.", side: "bottom", align: "center" } },
          { element: "#driver-copa-autogen", popover: { title: "Auto-Generar", description: "Genera automáticamente las llaves de eliminación basado en los resultados de la fase anterior.", side: "bottom", align: "center" } },
          { element: "#driver-copa-stats", popover: { title: "Estadísticas", description: "Resumen rápido: partidos totales, finalizados, pendientes, goles y equipos.", side: "bottom", align: "center" } },
        ],
      });
      d.drive();
      sessionStorage.setItem("adminTourCopa", "true");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const openNewMatch = () => { setBtnAnim("new"); setTimeout(() => setBtnAnim(null), 300); setEditingMatch(null); setTimeout(() => setShowMatchModal(true), 150); };
  const handleCreateVuelta = (idaMatch) => {

    setEditingMatch({
      fase: activePhase,

      jornada: "vuelta",

      llave: idaMatch.llave,

      team1_id: String(idaMatch.team2_id),

      team2_id: String(idaMatch.team1_id),

      fecha: "",

      hora: "",

      goles_local: "",

      goles_visitante: "",

      estado: "Pendiente"
    });

    setShowMatchModal(true);
  };
  const handleDelete = (id) => { Swal.fire({ title: "¿Eliminar partido?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí", cancelButtonText: "Cancelar", confirmButtonColor: "#ef4444", background: "#1e293b", color: "#fff" }).then(async r => { if (!r.isConfirmed) return; try { const res = await apiPost(`${API_BASE}copa_delete_match.php`, { id }).then(r => r.json()); if (res.success) { Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Eliminado", showConfirmButton: false, timer: 1800 }); fetchData(); } } catch { Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error", showConfirmButton: false, timer: 2000 }); } }); };
  const handleQuickFinish = async (match) => { const { value: score } = await Swal.fire({ title: "Resultado rápido", html: `<div style="display:flex;align-items:center;gap:16px;justify-content:center;margin:16px 0"><div style="text-align:center"><div style="font-size:11px;color:#94a3b8;margin-bottom:8px;font-weight:600">${match.team1}</div><input id="gl" type="number" min="0" value="0" style="width:68px;text-align:center;font-size:28px;font-weight:900;background:#0f172a;border:1px solid #1e293b;color:#e2e8f0;border-radius:10px;padding:10px"/></div><span style="font-size:20px;color:#334155;font-weight:900">–</span><div style="text-align:center"><div style="font-size:11px;color:#94a3b8;margin-bottom:8px;font-weight:600">${match.team2}</div><input id="gv" type="number" min="0" value="0" style="width:68px;text-align:center;font-size:28px;font-weight:900;background:#0f172a;border:1px solid #1e293b;color:#e2e8f0;borderRadius:10px;padding:10px"/></div></div>`, background: "#1e293b", color: "#fff", showCancelButton: true, confirmButtonText: "Guardar", cancelButtonText: "Cancelar", confirmButtonColor: "#10b981", preConfirm: () => ({ gl: parseInt(document.getElementById("gl").value) || 0, gv: parseInt(document.getElementById("gv").value) || 0 }) }); if (!score) return; try { await apiPost(`${API_BASE}copa_update_match.php`, { id: match.id, goles_local: score.gl, goles_visitante: score.gv, estado: "Finalizado" }).then(r => r.json()); Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Resultado guardado", showConfirmButton: false, timer: 1600 }); fetchData(); } catch (err) { Swal.fire({ toast: true, position: "top-end", icon: "error", title: err.message || "No se pudo guardar", showConfirmButton: false, timer: 2200 }); } };

  const handleReorder = async (fromIndex, direction) => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= knockoutPairs.length) return;
    const swapped = [...knockoutPairs];
    [swapped[fromIndex], swapped[toIndex]] = [swapped[toIndex], swapped[fromIndex]];
    const ordenes = [];
    swapped.forEach((pair, idx) => {
      const newOrden = idx + 1;
      if (pair.type === "pair") {
        ordenes.push({ id: pair.ida.id, orden: newOrden });
        ordenes.push({ id: pair.vuelta.id, orden: newOrden });
      } else if (pair.type === "single") {
        ordenes.push({ id: pair.match.id, orden: newOrden });
      }
    });
    try {
      const res = await apiPost(`${API_BASE}copa_reorder_matches.php`, { fase: activePhase, ordenes }).then(r => r.json());
      if (res.success) fetchData();
    } catch (err) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: "Error al reordenar", showConfirmButton: false, timer: 2000 });
    }
  };

  const handleAutoGenerate = async (fase) => {
    const phaseLabel = PHASES.find(p => p.key === fase)?.label || fase;
    const count = matches.filter(m => m.fase === fase).length;
    let useForce = false;
    if (count > 0) {
      const r = await Swal.fire({
        title: `¿Regenerar ${phaseLabel}?`,
        text: `Ya existen ${count} partido(s). Se eliminarán y regenerarán.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, regenerar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ef4444",
        background: "#1e293b",
        color: "#fff"
      });
      if (!r.isConfirmed) return;
      useForce = true;
    } else {
      const confirm = await Swal.fire({
        title: `Auto-generar ${phaseLabel}`,
        html: `<div style="text-align:center;font-size:13px;color:#94a3b8">Se generarán las llaves de <strong>${phaseLabel}</strong> basado en los resultados de la fase anterior.</div>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "⚡ Generar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#a855f7",
        background: "#1e293b",
        color: "#fff",
      });
      if (!confirm.isConfirmed) return;
    }
    setAutoGenerating(true);
    try {
      const res = await apiPost(`${API_BASE}copa_auto_generate_knockout.php`, { fase, force: useForce }).then(r => r.json());
      if (res.success) {
        Swal.fire({ toast: true, position: "top-end", icon: "success", title: res.message || "Partidos generados", showConfirmButton: false, timer: 2500 });
        fetchData();
      } else {
        throw new Error(res.message || "Error");
      }
    } catch (err) {
      Swal.fire({ toast: true, position: "top-end", icon: "error", title: err.message, showConfirmButton: false, timer: 3000 });
    } finally {
      setAutoGenerating(false);
    }
  };

  const phaseMatches = matches.filter(m => m.fase === activePhase);
  const filteredMatches = phaseMatches.filter(m => search === "" || (m.team1 || "").toLowerCase().includes(search.toLowerCase()) || (m.team2 || "").toLowerCase().includes(search.toLowerCase()));
  const groupsWithTeams = GROUPS.filter(g => teams.some(t => t.grupo === g));
  const knockoutPairs = isIdaVueltaPhase(activePhase) ? pairKnockoutMatches(filteredMatches) : [];
  const best3rdIds = useMemo(() => {
    if (activePhase !== "grupos") return new Set();
    const q = getGroupQualifiers(matches, teams);
    return new Set(q.filter(x => x.pos === 3).map(x => x.id));
  }, [matches, teams, activePhase]);

  const mejoresTerceros = useMemo(() => {
    if (activePhase !== "grupos") return [];
    const all3rds = [];
    GROUPS.forEach(g => {
      const gm = matches.filter(m => m.fase === "grupos" && m.grupo === g);
      const st = calcGroupStats(gm, teams);
      if (st.length >= 3) all3rds.push({ ...st[2], grupo: g });
    });
    all3rds.sort((a, b) => b.pts - a.pts || (b.dg - a.dg) || (b.gf - a.gf));
    return all3rds;
  }, [matches, teams, activePhase]);

  const phaseReview = getPhaseReview(activePhase, matches, teams);

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-closed" : ""}`}>
      <Sidebar />
      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={22} /></button>
          <div className="search-bar" style={{ flex: 1, maxWidth: 400 }}><input type="text" placeholder="Buscar equipo..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </header>
        <div className="content-wrapper" style={{ padding: "1.2rem" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.05))", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏆</div>
              <div><h1 style={{ margin: 0, color: "#f1f5f9", fontWeight: 900, fontSize: "1.35rem" }}>Copa Presidente</h1><p style={{ margin: 0, fontSize: 11, color: "#475569" }}>{teams.length} equipos · {matches.length} partidos</p></div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={openNewMatch} id="driver-copa-new" style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, background: "linear-gradient(135deg,#dc2626,#ef4444)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", transform: btnAnim === "new" ? "scale(0.94)" : "scale(1)", boxShadow: btnAnim === "new" ? "0 0 0 4px rgba(239,68,68,0.2)" : "0 4px 15px rgba(220,38,38,0.25)" }}><Plus size={14} /> Nuevo Partido</button>
              <button onClick={() => setShowGroupModal(true)} id="driver-copa-groups" style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderRadius: 10, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}><Users2 size={14} /> Grupos</button>
              <button onClick={() => setShowResetModal(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderRadius: 10, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b", fontSize: 12, fontWeight: 700, cursor: "pointer" }}><RotateCcw size={14} /> Reset</button>
              <button onClick={fetchData} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid #1e293b", color: "#64748b", cursor: "pointer", transition: "all 0.3s", transform: loading ? "rotate(360deg)" : "rotate(0deg)" }}><RefreshCw size={14} /></button>
            </div>
          </div>

          {/* Stats */}
          <div id="driver-copa-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(125px,1fr))", gap: 8, marginBottom: "1.4rem" }}>
            {[{ label: "Partidos", value: stats.total || 0, color: "#3b82f6", icon: "⚽" }, { label: "Finalizados", value: stats.finalizados || 0, color: "#10b981", icon: "✅" }, { label: "Pendientes", value: stats.pendientes || 0, color: "#f59e0b", icon: "⏳" }, { label: "En Curso", value: stats.en_curso || 0, color: "#ef4444", icon: "🔴" }, { label: "Goles", value: stats.goles || 0, color: "#8b5cf6", icon: "🎯" }, { label: "Equipos", value: stats.equipos || 0, color: "#06b6d4", icon: "🛡️" }].map(s => (<div key={s.label} style={{ background: `linear-gradient(135deg,${s.color}10,${s.color}04)`, border: `1px solid ${s.color}20`, borderRadius: 12, padding: "12px 14px", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}><div style={{ fontSize: 17, marginBottom: 3 }}>{s.icon}</div><div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9", fontFamily: "monospace" }}>{loading ? "—" : s.value}</div><div style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>{s.label}</div></div>))}
          </div>

          {/* Phase tabs */}
          <div id="driver-copa-phases" style={{ display: "flex", gap: 6, marginBottom: "1rem", overflowX: "auto", paddingBottom: 4 }}>
            {PHASES.map(p => { const count = matches.filter(m => m.fase === p.key).length; const active = activePhase === p.key; return (<button key={p.key} onClick={() => { setActivePhase(p.key); if (p.key !== "grupos") setViewMode("matches"); }} style={{ padding: "9px 16px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.2s", background: active ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)", border: active ? "1px solid rgba(239,68,68,0.3)" : "1px solid #1e293b", color: active ? "#ef4444" : "#64748b", transform: active ? "scale(1.02)" : "scale(1)" }}>{p.icon} {p.label}{p.idaVuelta && <span style={{ fontSize: 8, marginLeft: 4, opacity: 0.5 }}>IDA/V</span>}<span style={{ marginLeft: 5, fontSize: 9, padding: "1px 6px", borderRadius: 8, background: active ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.05)", color: active ? "#ef4444" : "#334155" }}>{count}</span></button>); })}
          </div>

          <PhaseReviewPanel phase={activePhase} review={phaseReview} />

          {/* View toggle grupos */}
          {activePhase === "grupos" && (<div style={{ display: "flex", gap: 8, marginBottom: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", border: "1px solid #1e293b", borderRadius: 8, padding: 3, gap: 3 }}>
              {[{ k: "matches", l: "⚽ Partidos" }, { k: "standings", l: "📊 Tabla" }].map(v => (<button key={v.k} onClick={() => setViewMode(v.k)} style={{ padding: "6px 16px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none", background: viewMode === v.k ? "rgba(239,68,68,0.15)" : "transparent", color: viewMode === v.k ? "#ef4444" : "#64748b", transition: "all 0.15s" }}>{v.l}</button>))}
            </div>
            {viewMode === "standings" && (<div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}><button onClick={() => setActiveGroup("all")} style={{ padding: "0 12px", height: 28, borderRadius: 7, cursor: "pointer", fontSize: 10, fontWeight: 700, border: "1px solid", borderColor: activeGroup === "all" ? "rgba(239,68,68,0.4)" : "#1e293b", background: activeGroup === "all" ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)", color: activeGroup === "all" ? "#ef4444" : "#475569" }}>Todos</button>{GROUPS.filter(g => teams.some(t => t.grupo === g)).map(g => (<button key={g} onClick={() => setActiveGroup(g)} style={{ width: 28, height: 28, borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 800, border: "1px solid", borderColor: activeGroup === g ? "rgba(239,68,68,0.4)" : "#1e293b", background: activeGroup === g ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)", color: activeGroup === g ? "#ef4444" : "#475569" }}>{g}</button>))}</div>)}
          </div>)}

          {/* Standings */}
          {activePhase === "grupos" && viewMode === "standings" && (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{(activeGroup === "all" ? GROUPS : [activeGroup]).map(g => (<GroupTable key={g} groupName={g} teams={teams.filter(t => t.grupo === g)} matches={phaseMatches} best3rdIds={best3rdIds} onEdit={m => { setEditingMatch(m); setShowMatchModal(true); }} onQuickFinish={handleQuickFinish} onDelete={handleDelete} />))}{groupsWithTeams.length === 0 && (<div style={{ textAlign: "center", padding: "52px 0" }}><div style={{ fontSize: 36, opacity: 0.07, marginBottom: 10 }}>🗂️</div><p style={{ color: "#475569", fontWeight: 600, margin: "0 0 4px" }}>Sin equipos asignados</p></div>)}
            {/* Tabla de mejores terceros */}
            {activeGroup === "all" && mejoresTerceros.length > 0 && (<div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden", marginTop: 4 }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #0f172a", display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 900, fontSize: 13, color: "#f59e0b" }}>Mejores Terceros</span><span style={{ fontSize: 10, color: "#334155" }}>Top 4 clasifican a octavos</span></div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}>{["#","Equipo","Grp","PJ","G","E","P","GF","GC","DG","PTS"].map(h => (<th key={h} style={{ padding: "7px 10px", color: "#334155", fontWeight: 700, textAlign: h === "Equipo" ? "left" : "center", fontSize: 9, letterSpacing: "0.5px" }}>{h}</th>))}</tr></thead>
                <tbody>{mejoresTerceros.map((r, i) => (<tr key={r.id} style={{ borderTop: "1px solid #0f172a", transition: "background 0.12s", background: i < 4 ? "rgba(245,158,11,0.04)" : "transparent", borderLeft: i < 4 ? "2px solid #f59e0b" : "2px solid transparent" }} onMouseEnter={e => { if (i >= 4) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }} onMouseLeave={e => { e.currentTarget.style.background = i < 4 ? "rgba(245,158,11,0.04)" : "transparent"; }}>
                  <td style={{ padding: "7px 10px", textAlign: "center", color: i < 4 ? "#f59e0b" : "#475569", fontWeight: 800 }}>{i < 4 ? "◆" : ""} {i + 1}</td>
                  <td style={{ padding: "7px 10px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><TeamBadge logo={r.logo} name={r.nombre} size={24} /><span style={{ color: "#cbd5e1", fontWeight: 600 }}>{r.nombre}</span><DivisionPill division={r.division} /></div></td>
                  <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 800, color: "#f59e0b" }}>{r.grupo}</td>
                  {[r.pj, r.g, r.e, r.p, r.gf, r.gc, r.dg >= 0 ? `+${r.dg}` : r.dg].map((v, j) => (<td key={j} style={{ padding: "7px 10px", textAlign: "center", color: "#64748b" }}>{v}</td>))}
                  <td style={{ padding: "7px 10px", textAlign: "center", fontWeight: 900, color: i < 4 ? "#f59e0b" : "#e2e8f0", fontSize: 13 }}>{r.pts}</td>
                </tr>))}</tbody>
              </table>
            </div>)}
          </div>)}

          {/* Grupos - Matches */}
          {activePhase === "grupos" && viewMode === "matches" && (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {GROUPS.filter(g => phaseMatches.some(m => m.grupo === g)).map(g => {
              const gMatches = phaseMatches.filter(m => m.grupo === g); if (!gMatches.length) return null; return (
                <div key={g} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid #0f172a", display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 900, fontSize: 13, color: "#ef4444" }}>Grupo {g}</span><span style={{ fontSize: 10, color: "#334155" }}>{gMatches.length} partidos</span></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: 6 }}>
                    {gMatches.map((m, idx) => {
                      const fin = m.estado === "Finalizado";
                      if (fin) return (<div key={m.id || idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: "rgba(16,185,129,0.02)", border: "1px solid rgba(16,185,129,0.08)", opacity: 0.85 }}><div style={{ fontSize: 9, color: "#334155", minWidth: 36 }}>{m.fecha ? m.fecha.substring(5, 10) : "-"}</div><TeamBadge logo={m.logo1} name={m.team1} size={28} /><div style={{ flex: 1, textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{m.team1}</div>{m.division1 && <DivisionPill division={m.division1} />}</div><div style={{ textAlign: "center", minWidth: 60 }}><span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: "#10b981" }}>{`${m.goles_local ?? 0} – ${m.goles_visitante ?? 0}`}</span></div><div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{m.team2}</div>{m.division2 && <DivisionPill division={m.division2} />}</div><TeamBadge logo={m.logo2} name={m.team2} size={28} /><button onClick={(e) => { e.stopPropagation(); setEditingMatch(m); setShowMatchModal(true); }} title="Editar resultado" style={{ padding: "4px", borderRadius: 4, border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Edit2 size={11} color="#60a5fa" /></button></div>);
                      const st = statusStyle(m.estado); return (<div key={m.id || idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, transition: "background 0.12s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"} onClick={() => { setEditingMatch(m); setShowMatchModal(true); }}><div style={{ fontSize: 9, color: "#334155", minWidth: 36 }}>{m.fecha ? m.fecha.substring(5, 10) : "-"} {m.hora ? m.hora.substring(0, 5) : ""}</div><TeamBadge logo={m.logo1} name={m.team1} size={28} /><div style={{ flex: 1, textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1" }}>{m.team1}</div>{m.division1 && <DivisionPill division={m.division1} />}</div><div style={{ textAlign: "center", minWidth: 60 }}><span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: "#1e293b" }}>– –</span></div><div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1" }}>{m.team2}</div>{m.division2 && <DivisionPill division={m.division2} />}</div><TeamBadge logo={m.logo2} name={m.team2} size={28} /><span style={{ display: "inline-block", padding: "3px 9px", borderRadius: 6, background: st.bg, color: st.color, fontSize: 9, fontWeight: 800, minWidth: 68, textAlign: "center" }}>{m.estado}</span><div style={{ display: "flex", gap: 3 }}><button onClick={e => { e.stopPropagation(); handleQuickFinish(m); }} style={miniBtn("#10b981")}>✓</button><button onClick={e => { e.stopPropagation(); handleDelete(m.id); }} style={miniBtn("#ef4444")}><Trash2 size={10} /></button></div></div>);
                    })}
                  </div>
                </div>);
            })}
            {phaseMatches.length === 0 && (<div style={{ textAlign: "center", padding: "52px 0" }}><div style={{ fontSize: 36, opacity: 0.07, marginBottom: 10 }}>⚽</div><p style={{ color: "#475569", fontWeight: 600 }}>Sin partidos en grupos</p></div>)}
          </div>)}

          {/* Final */}
          {!isIdaVueltaPhase(activePhase) && activePhase !== "grupos" && (<div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}><div style={{ padding: "12px 18px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}><h3 style={{ margin: 0, color: "#94a3b8", fontSize: 13, fontWeight: 700 }}>{PHASES.find(p => p.key === activePhase)?.icon} {PHASES.find(p => p.key === activePhase)?.label}<span style={{ marginLeft: 8, fontSize: 10, color: "#334155" }}>({filteredMatches.length})</span></h3>
              <button onClick={() => handleAutoGenerate(activePhase)} disabled={autoGenerating} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: autoGenerating ? "rgba(168,85,247,0.08)" : "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: autoGenerating ? "not-allowed" : "pointer", opacity: autoGenerating ? 0.5 : 1, transition: "all 0.2s" }}><Zap size={13} /> {autoGenerating ? "Generando..." : "Auto-generar"}</button>
            </div>{loading ? <LoadingSpinner /> : filteredMatches.length === 0 ? <EmptyState /> : (<div style={{ padding: 8 }}>{filteredMatches.map((m, i) => { const st = statusStyle(m.estado); const fin = m.estado === "Finalizado"; return (<div key={m.id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px", borderRadius: 10, transition: "background 0.12s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"} onClick={() => { setEditingMatch(m); setShowMatchModal(true); }}><TeamBadge logo={m.logo1} name={m.team1} size={34} /><div style={{ flex: 1, textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1" }}>{m.team1 || "TBD"}</div>{m.division1 && <DivisionPill division={m.division1} />}</div><div style={{ textAlign: "center", minWidth: 90 }}><div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 900, color: fin ? "#e2b340" : "#1e293b" }}>{fin ? `${m.goles_local ?? 0} – ${m.goles_visitante ?? 0}` : "– –"}</div><div style={{ fontSize: 9, color: "#334155", marginTop: 2 }}>{m.fecha ? m.fecha.substring(5, 10) : ""} {m.hora ? m.hora.substring(0, 5) : ""}</div></div><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1" }}>{m.team2 || "TBD"}</div>{m.division2 && <DivisionPill division={m.division2} />}</div><TeamBadge logo={m.logo2} name={m.team2} size={34} /><div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 8 }}><span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 6, background: st.bg, color: st.color, fontSize: 9, fontWeight: 800, textAlign: "center", minWidth: 72 }}>{m.estado}</span>{!fin && <button onClick={e => { e.stopPropagation(); handleQuickFinish(m); }} style={miniBtn("#10b981")}>✓</button>}<button onClick={e => { e.stopPropagation(); handleDelete(m.id); }} style={miniBtn("#ef4444")}><Trash2 size={10} /></button></div></div>); })}</div>)}</div>)}

          {/* Ida/Vuelta */}
          {isIdaVueltaPhase(activePhase) && (<div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 2px" }}>
              <h3 style={{ margin: 0, color: "#94a3b8", fontSize: 13, fontWeight: 700 }}>{PHASES.find(p => p.key === activePhase)?.icon} {PHASES.find(p => p.key === activePhase)?.label}<span style={{ marginLeft: 6, padding: "2px 8px", borderRadius: 5, background: "rgba(168,85,247,0.1)", color: "#a855f7", fontSize: 9, fontWeight: 800 }}>IDA Y VUELTA</span></h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => handleAutoGenerate(activePhase)} disabled={autoGenerating} id="driver-copa-autogen" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: autoGenerating ? "rgba(168,85,247,0.08)" : "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: autoGenerating ? "not-allowed" : "pointer", opacity: autoGenerating ? 0.5 : 1, transition: "all 0.2s" }}><Zap size={13} /> {autoGenerating ? "Generando..." : "Auto-generar"}</button>
                <span style={{ fontSize: 10, color: "#334155" }}>{knockoutPairs.length} llaves</span>
              </div>
            </div>
            {loading ? <LoadingSpinner /> : knockoutPairs.length === 0 ? <EmptyState /> : (<div>{knockoutPairs.map((pair, i) => (<KnockoutPair key={i} pair={pair} phaseLabel={activePhase} index={i} total={knockoutPairs.length} onMoveUp={(idx) => handleReorder(idx, "up")} onMoveDown={(idx) => handleReorder(idx, "down")} onEdit={m => { setEditingMatch(m); setShowMatchModal(true); }} onQuickFinish={handleQuickFinish} onDelete={handleDelete} onCreateVuelta={handleCreateVuelta} />))}</div>)}
          </div>)}

          {/* Info */}
          <div style={{ marginTop: 20, background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 12, padding: "13px 18px" }}>
            <h4 style={{ margin: "0 0 8px", color: "#ef4444", fontSize: 10, fontWeight: 800, letterSpacing: "1px" }}>📋 FORMATO</h4>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {[{ i: "🗂️", t: "6 grupos de 4 equipos" }, { i: "🏟️", t: "2 Primera + 2 Ascenso por grupo" }, { i: "📅", t: "3 jornadas, partido único en grupos" }, { i: "⚽", t: "Top 2 + 4 mejores terceros clasifican" }, { i: "🔄", t: "Octavos a Semis: ida y vuelta" }, { i: "🏆", t: "Final única" }].map((r, i) => <span key={i} style={{ fontSize: 11, color: "#475569", display: "flex", alignItems: "center", gap: 5 }}>{r.i} {r.t}</span>)}
            </div>
          </div>
        </div>
      </main>

      {showMatchModal && <MatchModal match={editingMatch} teams={teams} phase={activePhase} allMatches={matches} onSave={() => { setShowMatchModal(false); fetchData(); }} onClose={() => setShowMatchModal(false)} />}
      {showGroupModal && <GroupModal teams={teams} existingMatches={matches} onSave={() => { setShowGroupModal(false); fetchData(); }} onClose={() => setShowGroupModal(false)} />}
      {showResetModal && <ResetModal onClose={() => setShowResetModal(false)} onDone={() => { setShowResetModal(false); fetchData(); }} />}

      <style>{`
        .swal2-container{z-index:2100 !important}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes modalFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes modalSlideUp{from{opacity:0;transform:translateY(24px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        button.nav-item{background:none;border:none;color:var(--text-muted);font-family:inherit;cursor:pointer}
        @media (max-width: 768px) {
            [style*="grid-template-columns: minmax(220px"],
            [style*="grid-template-columns:minmax(220px"],
            [style*="grid-template-columns: 1fr 1fr"],
            [style*="grid-template-columns:1fr 1fr"],
            [style*="grid-template-columns: 1fr 24px 1fr"],
            [style*="grid-template-columns:1fr 24px 1fr"],
            [style*="grid-template-columns: repeat(3, 1fr)"],
            [style*="grid-template-columns:repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
            [style*="position: fixed"][style*="inset: 0"] > div,
            [style*="position:fixed"][style*="inset:0"] > div { max-width: 100vw !important; width: 100% !important; max-height: 100dvh !important; border-radius: 0 !important; }
        }
        @media (max-width: 480px) {
            [style*="max-width: 440px"], [style*="max-width:440px"],
            [style*="max-width: 540px"], [style*="max-width:540px"],
            [style*="max-width: 760px"], [style*="max-width:760px"] { max-width: 100vw !important; width: 100% !important; border-radius: 0 !important; }
        }
        .driver-popover{background:#0f172a!important;border:1px solid #ef4444!important;border-radius:12px!important;box-shadow:0 0 20px rgba(239,68,68,0.2),0 8px 32px rgba(0,0,0,0.5)!important;color:#f1f5f9!important}
        .driver-popover .driver-popover-title{color:#ef4444!important;font-weight:800!important}
        .driver-popover .driver-popover-description{color:#94a3b8!important}
        .driver-popover .driver-popover-footer button{background:#ef4444!important;border:none!important;color:#fff!important;border-radius:6px!important}
        .driver-popover .driver-popover-footer .driver-popover-prev-btn{background:transparent!important;border:1px solid #ef4444!important;color:#ef4444!important}
      `}</style>
    </div>
  );
};

const LoadingSpinner = () => (<div style={{ textAlign: "center", padding: "48px 0", color: "#475569" }}><div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #1e293b", borderTopColor: "#ef4444", animation: "spin 0.7s linear infinite", margin: "0 auto 10px" }} />Cargando...</div>);
const EmptyState = () => (<div style={{ textAlign: "center", padding: "52px 0" }}><div style={{ fontSize: 36, opacity: 0.07, marginBottom: 10 }}>⚽</div><p style={{ color: "#475569", fontWeight: 600, margin: "0 0 4px" }}>Sin partidos en esta fase</p><p style={{ color: "#334155", fontSize: 11, margin: 0 }}>Crea el primero con "Nuevo Partido"</p></div>);

export default AdminCopPresidente;
