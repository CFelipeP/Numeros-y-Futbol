import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import "animate.css";
import { apiPostForm } from "../apiHelper";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
    LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
    CircleDot, Target, Trophy, ChevronDown, Plus, Pencil, Trash2, Save, X,
    Goal, Search, User, Swords, Eye as EyeIcon, Star, ArrowRightLeft,
    Minus, ChevronUp, CheckCircle2, RotateCcw, StarOff, Filter, Zap, MessageCircle, BarChart3
} from "lucide-react";
import { API_BASE } from "../config";
const API = API_BASE;

const DIVISIONES = [
    { value: "primera", label: "Primera" },
    { value: "ascenso", label: "Ascenso" },
    { value: "femenina", label: "Femenina" },
];

const ManageMatches = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [teamsOpen, setTeamsOpen] = useState(false);
  const [seleccionesOpen, setSeleccionesOpen] = useState(false);
    const location = useLocation();
    const [division, setDivision] = useState(() => localStorage.getItem("admin_division") || "primera");
    useEffect(() => { localStorage.setItem("admin_division", division); }, [division]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamMap, setTeamMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [searchMatch, setSearchMatch] = useState("");
    const [showNewMatch, setShowNewMatch] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [newLocal, setNewLocal] = useState("");
    const [newVisitante, setNewVisitante] = useState("");
    const [newFecha, setNewFecha] = useState("");
    const [newHora, setNewHora] = useState("");
    const [newJornada, setNewJornada] = useState("");
    const [searchLocal, setSearchLocal] = useState("");
    const [searchVisitante, setSearchVisitante] = useState("");
    const [openSelectLocal, setOpenSelectLocal] = useState(false);
    const [openSelectVisitante, setOpenSelectVisitante] = useState(false);
    const localRef = useRef(null);
    const visitanteRef = useRef(null);
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);
    const [editFecha, setEditFecha] = useState("");
    const [editHora, setEditHora] = useState("");
    const [editJornada, setEditJornada] = useState("");
    const [filterJornada, setFilterJornada] = useState("all");

    useEffect(() => { if (location.pathname.startsWith("/teams/")) setTeamsOpen(true); }, [location.pathname]);
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
            if (localRef.current && !localRef.current.contains(e.target)) setOpenSelectLocal(false);
            if (visitanteRef.current && !visitanteRef.current.contains(e.target)) setOpenSelectVisitante(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const getEndpoints = () => {
        const suffix = division === "ascenso" ? "_ascenso" : division === "femenina" ? "_femenina" : "";
        return {
            matches: `${API}get_matches${suffix}.php`,
            teams: `${API}get_teams${suffix}.php`,
            create: `${API}create_match${suffix}.php`,
            update: `${API}update_match${suffix}.php`,
            delete: `${API}delete_match${suffix}.php`,
            toggleFeatured: `${API}toggle_featured${suffix}.php`,
        };
    };

    const loadMatches = () => {
        const ep = getEndpoints();
        setLoading(true); setMatches([]); setTeams([]); setTeamMap({});
        fetch(ep.matches).then(r => r.json()).then(d => setMatches(Array.isArray(d) ? d : [])).catch(() => setMatches([]));
        fetch(ep.teams).then(r => r.json()).then(d => {
            const arr = Array.isArray(d) ? d : []; setTeams(arr);
            const map = {}; arr.forEach(t => { map[t.id] = t; map[t.nombre] = t; }); setTeamMap(map);
        }).catch(() => setTeams([])).finally(() => setLoading(false));
    };

    useEffect(() => { loadMatches(); }, [division]);

    useEffect(() => {
      if (sessionStorage.getItem("adminTourMatches")) return;
      const timer = setTimeout(() => {
        const d = driver({
          showProgress: true, allowClose: true,
          nextBtnText: "Siguiente", prevBtnText: "Atrás", doneBtnText: "Entendido",
          steps: [
            { element: "#driver-mm-create", popover: { title: "Crear Partido", description: "Selecciona equipo local y visitante, luego click en Crear Partido para agregarlo.", side: "bottom", align: "start" } },
            { element: "#driver-mm-division", popover: { title: "Selector de División", description: "Cambia entre Primera, Ascenso y Femenina para gestionar partidos de cada una.", side: "bottom", align: "start" } },
            { element: "#driver-mm-table", popover: { title: "Lista de Partidos", description: "Acá ves todos los partidos. Podes editar resultados, ver detalles o eliminar.", side: "top", align: "center" } },
            { element: "#driver-mm-actions", popover: { title: "Acciones", description: "Edita el marcador, marca como destacado o elimina el partido con estos botones.", side: "left", align: "center" } },
          ],
        });
        d.drive();
        sessionStorage.setItem("adminTourMatches", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }, []);

    const to12h = (h24) => {
        if (!h24) return { h: "12", m: "00", ampm: "AM" };
        const [hh, mm] = h24.split(":");
        let h = parseInt(hh) || 0;
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return { h: String(h).padStart(2, '0'), m: mm || "00", ampm };
    };
    const from12h = (h12, m12, ampm) => {
        if (!h12 || h12 === "") return "";
        let hh = parseInt(h12);
        if (ampm === "PM" && hh !== 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;
        return String(hh).padStart(2, '0') + ":" + (m12 || "00");
    };

    const getEscudo = (idOrName) => { const t = teamMap[idOrName]; return t?.logo ? `${API}${t.logo}` : null; };
    const fallbackImg = "https://ui-avatars.com/api/?name=EQ&background=0f172a&color=334155&size=40&bold=true";
    const fallbackSelect = "https://ui-avatars.com/api/?name=EQ&background=1e293b&color=475569&size=36&bold=true";
    const hasScore = (match) => match.goles_local !== null && match.goles_local !== undefined && match.goles_visitante !== null && match.goles_visitante !== undefined;
    const getScore = (match) => {
        if (match.score && match.score !== "-") return match.score;
        if (hasScore(match)) return `${match.goles_local} - ${match.goles_visitante}`;
        return "-";
    };
    const getStatus = (match) => match.status || match.estado || "Pendiente";
    const safeJson = async (res) => {
        const text = await res.text();
        if (text.trim().startsWith("<")) throw new Error("Error del servidor (PHP): " + text.substring(0, 200));
        return JSON.parse(text);
    };

    const handleLogout = () => {
        Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", confirmButtonColor: "#d33" })
            .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); Swal.fire({ icon: "success", title: "Deslogueo exitoso", timer: 1500, showConfirmButton: false }).then(() => { window.location.href = "/login"; }); } });
    };

    const getActiveGrupo = () => {
        if (division !== "ascenso") return null;
        if (newLocal) { const t = teamMap[newLocal]; if (t?.grupo) return t.grupo; }
        if (newVisitante) { const t = teamMap[newVisitante]; if (t?.grupo) return t.grupo; }
        return null;
    };
    const activeGrupo = getActiveGrupo();

    const openNewMatch = () => { setNewLocal(""); setNewVisitante(""); setNewFecha(""); setNewHora(""); setNewJornada(""); setSearchLocal(""); setSearchVisitante(""); setOpenSelectLocal(false); setOpenSelectVisitante(false); setShowNewMatch(true); };

    const handleSelectLocal = (id) => {
        setNewLocal(id);
        if (division === "ascenso" && newVisitante) {
            const lt = teamMap[id]; const vt = teamMap[newVisitante];
            if (lt?.grupo && vt?.grupo && lt.grupo.toLowerCase() !== vt.grupo.toLowerCase()) setNewVisitante("");
        }
    };
    const handleSelectVisitante = (id) => {
        setNewVisitante(id);
        if (division === "ascenso" && newLocal) {
            const lt = teamMap[newLocal]; const vt = teamMap[id];
            if (lt?.grupo && vt?.grupo && lt.grupo.toLowerCase() !== vt.grupo.toLowerCase()) setNewLocal("");
        }
    };

    const createMatch = () => {
        if (!newLocal || !newVisitante) { Swal.fire({ icon: "info", title: "Completa ambos equipos", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
        if (newLocal === newVisitante) { Swal.fire({ icon: "info", title: "No pueden ser el mismo equipo", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
        setSubmitting(true);
        const form = new FormData(); form.append("local", newLocal); form.append("visitante", newVisitante);
        if (newFecha) form.append("fecha", newFecha); if (newHora) form.append("hora", newHora);
        if (newJornada) form.append("jornada", newJornada);
        apiPostForm(getEndpoints().create, form).then(safeJson).then(data => {
            setSubmitting(false);
            if (data.error || !data.success) { Swal.fire("Error", data.error || "Error al crear partido", "error"); return; }
            setShowNewMatch(false);
            Swal.fire({ icon: "success", title: "Partido creado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(() => loadMatches());
        }).catch(() => { setSubmitting(false); Swal.fire("Error", "No se pudo crear el partido.", "error"); });
    };

    const openResult = (match) => {
        setSelectedMatch(match);
        const score = getScore(match);
        if (score !== "-") { const p = String(score).split(" - "); setGolesLocal(parseInt(p[0]) || 0); setGolesVisitante(parseInt(p[1]) || 0); }
        else { setGolesLocal(0); setGolesVisitante(0); }
        if (match.fecha) { setEditFecha(match.fecha.substring(0, 10)); setEditHora(match.fecha.substring(11, 16)); }
        else { setEditFecha(""); setEditHora(""); }
        setEditJornada(match.jornada != null ? String(match.jornada) : "");
        setShowResult(true);
    };

    const saveResult = () => {
        setSubmitting(true);
        const form = new FormData(); form.append("match_id", selectedMatch.id); form.append("goles_local", golesLocal); form.append("goles_visitante", golesVisitante);
        if (editFecha) form.append("fecha", editFecha); if (editHora) form.append("hora", editHora);
        if (editJornada) form.append("jornada", editJornada);
        apiPostForm(getEndpoints().update, form).then(safeJson).then(data => {
            setSubmitting(false);
            if (data.error || !data.success) { Swal.fire("Error", data.error || "Error al guardar resultado", "error"); return; }
            setShowResult(false);
            Swal.fire({ icon: "success", title: "Resultado guardado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(() => loadMatches());
        }).catch(() => { setSubmitting(false); Swal.fire("Error", "No se pudo guardar.", "error"); });
    };

    const deleteMatch = (id) => {
        Swal.fire({ title: "¿Eliminar partido?", text: "Esto no se puede deshacer", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", confirmButtonColor: "#d33" })
            .then(result => {
                if (result.isConfirmed) {
                    const form = new FormData(); form.append("id", id);
                    apiPostForm(getEndpoints().delete, form).then(safeJson).then(data => {
                        if (data.error) { Swal.fire("Error", data.error, "error"); return; }
                        Swal.fire({ icon: "success", title: "Eliminado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(() => loadMatches());
                    }).catch(() => Swal.fire("Error", "No se pudo eliminar.", "error"));
                }
            });
    };

    const toggleFeatured = (match) => {
        const isFeatured = match.featured == 1 || match.destacado == 1;
        const matchId = String(match.id);
        const currentDiv = DIVISIONES.find(d => d.value === division);
        Swal.fire({
            title: isFeatured ? "¿Quitar destacado?" : "Marcar como destacado",
            html: `<p style="color:#94a3b8;font-size:14px;margin:0">${match.local_nombre} vs ${match.visitante_nombre}</p><p style="color:#64748b;font-size:12px;margin:4px 0 0">${isFeatured ? "Dejará de aparecer como destacado" : "Será el partido destacado en " + (currentDiv?.label || "") + " División"}</p>`,
            icon: isFeatured ? "question" : "warning", showCancelButton: true,
            confirmButtonText: isFeatured ? "Sí, quitar" : "Sí, destacar", cancelButtonText: "Cancelar",
            confirmButtonColor: isFeatured ? "#ef4444" : "#e2b340", background: "#0b1120", color: "#f1f5f9"
        }).then(result => {
            if (!result.isConfirmed) return;
            setSubmitting(true);
            setMatches(prev => prev.map(m => {
                if (!isFeatured) return String(m.id) === matchId ? { ...m, featured: 1, destacado: 1 } : { ...m, featured: 0, destacado: 0 };
                else return String(m.id) === matchId ? { ...m, featured: 0, destacado: 0 } : m;
            }));
            setSubmitting(false);
            const form = new FormData(); form.append("match_id", match.id); form.append("featured", isFeatured ? "0" : "1");
            apiPostForm(getEndpoints().toggleFeatured, form)
                .then(async res => { const text = await res.text(); if (text.trim().startsWith("<")) throw new Error("PHP_MISSING"); return JSON.parse(text); })
                .then(data => {
                    if (data.error) { setMatches(prev => prev.map(m => String(m.id) === matchId ? { ...m, featured: isFeatured ? 1 : 0, destacado: isFeatured ? 1 : 0 } : m)); Swal.fire("Error", data.error, "error"); }
                    else { Swal.fire({ icon: "success", title: isFeatured ? "Destacado quitado" : "Partido destacado", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); }
                })
                .catch(err => {
                    if (err.message === "PHP_MISSING") Swal.fire({ icon: "warning", title: "Archivo PHP no encontrado", html: `<p style="color:#94a3b8;font-size:13px;margin:0 0 6px">No se encontró <strong style="color:#fbbf24">${getEndpoints().toggleFeatured.split("/").pop()}</strong></p><p style="color:#64748b;font-size:12px;margin:0">El cambio es visual. Crea el archivo PHP para persistirlo en la BD.</p>`, timer: 5000, showConfirmButton: false });
                });
        });
    };

    const resetSingleMatch = (match) => {
        Swal.fire({ title: "¿Resetear resultado?", html: `<p style="color:#94a3b8;font-size:14px;margin:0">${match.local_nombre} vs ${match.visitante_nombre}</p>`, icon: "question", showCancelButton: true, confirmButtonText: "Sí, resetear", confirmButtonColor: "#f59e0b", background: "#0b1120", color: "#f1f5f9" })
            .then(result => {
                if (result.isConfirmed) {
                    const form = new FormData(); form.append("match_id", match.id); form.append("goles_local", "-1"); form.append("goles_visitante", "-1");
                    apiPostForm(getEndpoints().update, form).then(safeJson).then(data => {
                        if (data.error) { Swal.fire("Error", data.error, "error"); return; }
                        Swal.fire({ icon: "success", title: "Reseteado", toast: true, position: "top-end", timer: 1500, showConfirmButton: false }).then(() => loadMatches());
                    }).catch(err => Swal.fire("Error", err.message || "No se pudo resetear.", "error"));
                }
            });
    };

    const resetAllMatches = () => {
        const jugados = matches.filter(m => m.status === "Finalizado");
        if (!jugados.length) { Swal.fire({ icon: "info", title: "No hay partidos jugados", toast: true, position: "top-end", timer: 2000, showConfirmButton: false }); return; }
        Swal.fire({ title: "¿Resetear TODOS los resultados?", html: `<p style="color:#f87171;font-size:14px;margin:0;font-weight:600">${jugados.length} partido${jugados.length > 1 ? "s" : ""} finalizado${jugados.length > 1 ? "s" : ""}</p>`, icon: "warning", showCancelButton: true, confirmButtonText: "Sí, resetear todo", confirmButtonColor: "#ef4444", background: "#0b1120", color: "#f1f5f9" })
            .then(result => {
                if (result.isConfirmed) {
                    let done = 0; const ep = getEndpoints();
                    jugados.forEach(m => {
                        const form = new FormData(); form.append("match_id", m.id); form.append("goles_local", "-1"); form.append("goles_visitante", "-1");
                        apiPostForm(ep.update, form).then(safeJson).then(() => { done++; if (done === jugados.length) Swal.fire({ icon: "success", title: "Todo reseteado", timer: 2000, showConfirmButton: false }).then(() => loadMatches()); }).catch(() => { done++; if (done === jugados.length) loadMatches(); });
                    });
                }
            });
    };

    const localTeam = teamMap[newLocal];
    const visitanteTeam = teamMap[newVisitante];

    const usedTeamsInJornada = (() => {
        if (!newJornada) return new Set();
        const used = new Set();
        matches.forEach(m => {
            if (String(m.jornada) === String(newJornada)) {
                if (m.local_id) used.add(String(m.local_id));
                if (m.visitante_id) used.add(String(m.visitante_id));
            }
        });
        return used;
    })();

    const filteredLocal = teams.filter(t => {
        if (String(t.id) === String(newVisitante)) return false;
        if (newJornada && usedTeamsInJornada.has(String(t.id)) && String(t.id) !== String(newLocal)) return false;
        if (!t.nombre.toLowerCase().includes(searchLocal.toLowerCase())) return false;
        if (division === "ascenso" && newVisitante) { const vGrupo = (teamMap[newVisitante]?.grupo || "").toLowerCase(); const tGrupo = (t.grupo || "").toLowerCase(); if (vGrupo && tGrupo && vGrupo !== tGrupo) return false; }
        return true;
    });
    const filteredVisitante = teams.filter(t => {
        if (String(t.id) === String(newLocal)) return false;
        if (newJornada && usedTeamsInJornada.has(String(t.id)) && String(t.id) !== String(newVisitante)) return false;
        if (!t.nombre.toLowerCase().includes(searchVisitante.toLowerCase())) return false;
        if (division === "ascenso" && newLocal) { const lGrupo = (teamMap[newLocal]?.grupo || "").toLowerCase(); const tGrupo = (t.grupo || "").toLowerCase(); if (lGrupo && tGrupo && lGrupo !== tGrupo) return false; }
        return true;
    });

    const filteredMatches = matches.filter(m => {
        if (activeTab === "pending" && m.status === "Finalizado") return false;
        if (activeTab === "played" && m.status !== "Finalizado") return false;
        if (filterJornada !== "all" && String(m.jornada) !== filterJornada) return false;
        if (searchMatch.trim()) { const q = searchMatch.toLowerCase(); return (m.local_nombre || "").toLowerCase().includes(q) || (m.visitante_nombre || "").toLowerCase().includes(q); }
        return true;
    });
    const counts = { all: matches.length, pending: matches.filter(m => m.status !== "Finalizado").length, played: matches.filter(m => m.status === "Finalizado").length };
    const jornadaStats = (() => {
        const map = {};
        matches.forEach(m => {
            if (m.jornada == null) return;
            const j = m.jornada;
            if (!map[j]) map[j] = { total: 0, finalizados: 0, pending: 0 };
            map[j].total++;
            if (m.status === "Finalizado") map[j].finalizados++;
            else map[j].pending++;
        });
        return map;
    })();
    const jornadaCompletadaActual = Object.entries(jornadaStats).find(([,s]) => s.total === 6 && s.finalizados === 6);
    const nextJornada = jornadaCompletadaActual ? parseInt(jornadaCompletadaActual[0]) + 1 : null;
    const currentDiv = DIVISIONES.find(d => d.value === division);

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
      { path: "/", icon: <EyeIcon size={20} />, label: "Ver Sitio" },
    ];

    const GrupoBadge = ({ grupo, size = "sm" }) => {
        if (!grupo) return null;
        const g = grupo.toLowerCase(); const isEast = g === "east";
        const s = size === "lg" ? { padding: "3px 10px", fontSize: "10px", gap: "4px", borderRadius: "5px" } : { padding: "2px 7px", fontSize: "9px", gap: "3px", borderRadius: "4px" };
        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: s.gap, padding: s.padding, borderRadius: s.borderRadius, fontSize: s.fontSize, fontWeight: 800, letterSpacing: "0.3px", background: isEast ? "rgba(59,130,246,0.12)" : "rgba(249,115,22,0.12)", color: isEast ? "#60a5fa" : "#fb923c", border: `1px solid ${isEast ? "rgba(59,130,246,0.2)" : "rgba(249,115,22,0.2)"}`, flexShrink: 0 }}>
                <span style={{ width: size === "lg" ? 5 : 4, height: size === "lg" ? 5 : 4, borderRadius: "50%", background: isEast ? "#3b82f6" : "#f97316" }} />
                {isEast ? "Grupo A" : "Grupo B"}
            </span>
        );
    };

    const renderCustomSelect = (label, selectedId, searchVal, setSearchVal, isOpen, setOpen, filtered, onSelect, inputRef) => {
        const sel = teamMap[selectedId]; const isAscenso = division === "ascenso";
        const renderOpt = (t) => (
            <div key={t.id} className={`cs-option cs-option-lg ${String(t.id) === String(selectedId) ? "cs-option-active" : ""}`} onClick={() => { onSelect(String(t.id)); setOpen(false); setSearchVal(""); }}>
                <img src={`${API}${t.logo}`} alt="" onError={e => { e.target.src = fallbackSelect; }} className="cs-opt-logo cs-opt-logo-lg" />
                <span className="cs-opt-name cs-opt-name-lg">{t.nombre}</span>
                {isAscenso && <GrupoBadge grupo={t.grupo} />}
                {!isAscenso && t.ciudad && <span className="cs-opt-city">{t.ciudad}</span>}
                {String(t.id) === String(selectedId) && <CheckCircle2 size={16} className="cs-opt-check cs-opt-check-lg" />}
            </div>
        );
        const renderGrouped = () => {
            const east = filtered.filter(t => (t.grupo || "").toLowerCase() === "east");
            const west = filtered.filter(t => (t.grupo || "").toLowerCase() === "west");
            const other = filtered.filter(t => !["east", "west"].includes((t.grupo || "").toLowerCase()));
            return (<>
                {east.length > 0 && (<><div className="cs-group-sep cs-group-sep-east"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />Grupo Este</div>{east.map(renderOpt)}</>)}
                {west.length > 0 && (<><div className="cs-group-sep cs-group-sep-west"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316" }} />Grupo Oeste</div>{west.map(renderOpt)}</>)}
                {other.length > 0 && other.map(renderOpt)}
            </>);
        };
        const showGrouped = isAscenso && !selectedId && !searchVal;
        return (
            <div className="cs-wrap" ref={inputRef}>
                <label className="cs-label">{label}</label>
                <div className={`cs-trigger cs-trigger-lg ${isOpen ? "cs-open" : ""} ${sel ? "cs-has-value" : ""}`} onClick={() => { setOpen(!isOpen); setSearchVal(""); }}>
                    {sel ? (
                        <div className="cs-selected">
                            <img src={`${API}${sel.logo}`} alt="" onError={e => { e.target.src = fallbackSelect; }} className="cs-sel-logo cs-sel-logo-lg" />
                            <span className="cs-sel-name cs-sel-name-lg">{sel.nombre}</span>
                            {isAscenso && <GrupoBadge grupo={sel.grupo} size="lg" />}
                        </div>
                    ) : <span className="cs-placeholder cs-placeholder-lg">Selecciona un equipo</span>}
                    <ChevronDown size={18} className={`cs-chevron ${isOpen ? "cs-chevron-up" : ""}`} />
                </div>
                {isOpen && (
                    <div className="cs-dropdown cs-dropdown-lg animate__animated animate__fadeInDown">
                        <div className="cs-search-wrap cs-search-wrap-lg">
                            <Search size={16} className="cs-search-icon cs-search-icon-lg" />
                            <input type="text" className="cs-search-input cs-search-input-lg" placeholder="Buscar equipo..." value={searchVal} onChange={e => setSearchVal(e.target.value)} autoFocus />
                        </div>
                        <div className="cs-options cs-options-lg">
                            {filtered.length === 0 ? (
                                <div className="cs-empty cs-empty-lg">{isAscenso && activeGrupo ? `Sin equipos en Grupo ${activeGrupo === "East" ? "Este" : "Oeste"}` : "Sin resultados"}</div>
                            ) : showGrouped ? renderGrouped() : filtered.map(renderOpt)}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`admin-layout ${sidebarOpen ? "sidebar-closed" : ""}`}>
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon"><img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo" /></div>
                    <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item, idx) => {
                            if (item.type === "dropdown") {
                                return (
                                    <li key={idx}>
                                        <button className="nav-item" onClick={() => { const s = item.label === "Selecciones"; s ? setSeleccionesOpen(!seleccionesOpen) : setTeamsOpen(!teamsOpen); }} style={{ width: "100%", justifyContent: "space-between" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>{item.icon} {item.label}</span>
                                            <ChevronDown size={16} style={{ transition: "transform 0.25s ease", transform: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.4 }} />
                                        </button>
                                        <ul style={{ maxHeight: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "400px" : "0", opacity: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "1" : "0", overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease", listStyle: "none", padding: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "2px 0 4px 0" : "0", margin: 0 }}>
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
                    <div className="search-bar"><input type="text" placeholder="Buscar equipo..." value={searchMatch} onChange={e => setSearchMatch(e.target.value)} /></div>
                </header>

                <div className="content-wrapper">
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.2rem", flexWrap: "wrap" }}>
                        <h1 className="admin-title" style={{ margin: 0 }}>Gestionar Partidos</h1>
                        <div ref={dropdownRef} style={{ position: "relative" }} id="driver-mm-division">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px" }}>
                                <Trophy size={14} />{currentDiv?.label} División<ChevronDown size={15} style={{ transition: "transform 0.25s ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.7 }} />
                            </button>
                            {dropdownOpen && (
                                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100, background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden", minWidth: "190px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", animation: "ddFadeIn 0.15s ease-out" }}>
                                    {DIVISIONES.map(d => (<button key={d.value} onClick={() => { setDivision(d.value); setDropdownOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "12px 18px", border: "none", background: division === d.value ? "rgba(59,130,246,0.15)" : "transparent", color: division === d.value ? "#60a5fa" : "#94a3b8", fontSize: "13px", fontWeight: division === d.value ? 700 : 500, cursor: "pointer", textAlign: "left" }}><Trophy size={13} style={{ opacity: division === d.value ? 1 : 0.4 }} />{d.label} División{division === d.value && <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }} />}</button>))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="table-container" id="driver-mm-table">
                        <div className="table-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                            <h2 style={{ margin: 0 }}>Lista de Partidos</h2>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                                <div className="mm-tabs">
                                    <button className={`mm-tab ${activeTab === "all" ? "mm-tab-active" : ""}`} onClick={() => setActiveTab("all")}>Todos <span className="mm-tab-count">{counts.all}</span></button>
                                    <button className={`mm-tab ${activeTab === "pending" ? "mm-tab-active mm-tab-pending" : ""}`} onClick={() => setActiveTab("pending")}>Pendientes <span className="mm-tab-count">{counts.pending}</span></button>
                                    <button className={`mm-tab ${activeTab === "played" ? "mm-tab-active mm-tab-played" : ""}`} onClick={() => setActiveTab("played")}>Jugados <span className="mm-tab-count">{counts.played}</span></button>
                                </div>
                                <span className="mm-jornada-wrap">
                                    <select className="mm-jornada-filter" value={filterJornada} onChange={e => setFilterJornada(e.target.value)}>
                                        <option value="all">Todas las jornadas</option>
                                        {(() => {
                                            const jset = new Set(); matches.forEach(m => { if (m.jornada != null) jset.add(m.jornada); });
                                            return [...jset].sort((a,b)=>a-b).map(j => <option key={j} value={j}>Jornada {j}</option>);
                                        })()}
                                    </select>
                                    <ChevronDown size={14} className="mm-jornada-chevron" />
                                </span>
                                {counts.played > 0 && <button className="mm-reset-all-btn" onClick={resetAllMatches}><RotateCcw size={14} /> <span>Resetear todo</span></button>}
                                <button className="btn-add" id="driver-mm-create" onClick={openNewMatch}><Plus size={18} /> Nuevo Partido</button>
                            </div>
                        </div>

                        {jornadaCompletadaActual && (
                            <div className="mm-jornada-complete" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderRadius: "10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: "16px", fontSize: "13px", fontWeight: 600, color: "#34d399" }}>
                                <CheckCircle2 size={18} />
                                <span>Jornada {jornadaCompletadaActual[0]} completada ({jornadaCompletadaActual[1].finalizados}/6 partidos finalizados)</span>
                                {nextJornada && <button className="btn-add" style={{ marginLeft: "auto", padding: "5px 14px", fontSize: "12px", borderRadius: "6px" }} onClick={() => { setFilterJornada(String(nextJornada)); setNewJornada(String(nextJornada)); }}>Ir a Jornada {nextJornada} →</button>}
                            </div>
                        )}

                        {!loading && (() => {
                            const jEntries = Object.entries(jornadaStats).sort((a,b) => a[0]-b[0]);
                            const todasJConPendientes = jEntries.filter(([,s]) => s.pending > 0);
                            if (todasJConPendientes.length > 0) {
                                const jConMasPendientes = todasJConPendientes.sort((a,b) => b[1].pending - a[1].pending)[0];
                                return filterJornada === "all" ? (
                                    <div className="mm-jornada-hint" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "8px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)", marginBottom: "16px", fontSize: "12px", fontWeight: 500, color: "#60a5fa" }}>
                                        <Zap size={14} />
                                        <span>Jornada {jConMasPendientes[0]} en curso: {jConMasPendientes[1].finalizados}/{jConMasPendientes[1].total} finalizados</span>
                                    </div>
                                ) : null;
                            }
                            return null;
                        })()}

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: "#3b82f6", animation: "mmSpin 0.8s linear infinite", margin: "0 auto 1rem" }} />
                                <span style={{ fontSize: "0.85rem" }}>Cargando partidos de {currentDiv?.label}...</span>
                            </div>
                        ) : (

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th className="hide-on-mobile">Fecha</th>
                                        <th className="hide-on-mobile">Jor.</th>
                                        <th>Local</th>
                                        <th style={{ textAlign: "center" }}>Marcador</th>
                                        <th>Visitante</th>
                                        <th className="hide-on-mobile">Estado</th>
                                        <th className="th-actions">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMatches.map(match => {
                                        const escLocal = getEscudo(match.local_id) || getEscudo(match.local_nombre);
                                        const escVisit = getEscudo(match.visitante_id) || getEscudo(match.visitante_nombre);
                                        const status = getStatus(match);
                                        const score = getScore(match);
                                        const isFin = status === "Finalizado";
                                        const isLive = status === "En Curso";
                                        const isFeat = match.featured == 1 || match.destacado == 1;
                                        return (
                                            <tr key={match.id}>
                                                <td className="hide-on-mobile" style={{ whiteSpace: "nowrap", color: "#94a3b8", fontSize: "13px" }}>{match.date || "—"}</td>
                                                <td className="hide-on-mobile" style={{ whiteSpace: "nowrap", color: match.jornada ? "#60a5fa" : "#475569", fontSize: "13px", fontWeight: 700, textAlign: "center" }}>{match.jornada != null ? `J${match.jornada}` : "—"}</td>
                                                <td><div className="td-team"><img src={escLocal || fallbackImg} alt="" onError={e => { e.target.src = fallbackImg; }} className="td-team-img" /><span className="td-team-name">{match.local_nombre || "—"}</span></div></td>
                                                <td style={{ textAlign: "center" }}>
                                                    <span style={{ fontWeight: "800", fontSize: "15px", color: isFin ? "#e2b340" : isLive ? "#22c55e" : "#64748b", letterSpacing: "2px" }}>{score}</span>
                                                    {isLive && <div style={{fontSize:9,fontWeight:800,color:"#22c55e",letterSpacing:1,marginTop:2}}>🔴 EN VIVO</div>}
                                                </td>
                                                <td><div className="td-team td-team-right"><span className="td-team-name">{match.visitante_nombre || "—"}</span><img src={escVisit || fallbackImg} alt="" onError={e => { e.target.src = fallbackImg; }} className="td-team-img" /></div></td>
                                                <td className="hide-on-mobile"><span className={`status ${isFin ? "done" : isLive ? "live" : "pending"}`}>{status}</span></td>
                                                <td>
                                                    <div className="td-actions">
                                                        <button className={`mm-star-btn ${isFeat ? "mm-star-active" : ""}`} onClick={() => toggleFeatured(match)} disabled={submitting} title={isFeat ? "Quitar de destacado" : "Marcar como destacado"} style={{ opacity: submitting ? 0.5 : 1, cursor: submitting ? "wait" : "pointer" }}>
                                                            {isFeat ? <Star size={14} fill="#e2b340" /> : <StarOff size={14} />}
                                                            <span>{isFeat ? "Destacado" : "Destacar"}</span>
                                                        </button>
                                                        <button className={`result-action-btn ${isFin ? "result-edit" : "result-new"}`} id="driver-mm-actions" onClick={() => openResult(match)} title={isFin ? "Editar resultado" : "Ingresar resultado"}>
                                                            <Trophy size={14} /><span>{isFin ? "Editar" : "Resultado"}</span>
                                                        </button>
                                                        <button className="mm-narrar-btn" onClick={() => navigate(`/manage-comments?partido=${match.id}&division=${division}`)} title="Narrar partido">
                                                            <MessageCircle size={13} /><span>Narrar</span>
                                                        </button>
                                                        {isFin && <button className="mm-reset-single-btn" onClick={() => resetSingleMatch(match)} title="Resetear resultado"><RotateCcw size={13} /><span>Reset</span></button>}
                                                        <button className="btn-delete" onClick={() => deleteMatch(match.id)} title="Eliminar"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        {!loading && filteredMatches.length === 0 && (
                            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#475569" }}>
                                <Filter size={40} style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.2 }} />
                                <p style={{ fontWeight: 600, color: "#64748b" }}>{searchMatch ? "Sin resultados para la búsqueda" : activeTab === "played" ? "No hay partidos jugados" : activeTab === "pending" ? "No hay partidos pendientes" : "No hay partidos registrados"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* MODAL NUEVO PARTIDO */}
            {showNewMatch && (
                <div className="nm-overlay" onClick={e => { if (e.target === e.currentTarget) setShowNewMatch(false); }}>
                    <div className="nm-card nm-card-wide animate__animated animate__fadeInUp">
                        <div className="nm-header nm-header-wide">
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div className="nm-header-icon"><Swords size={20} /></div>
                                <div><h2>Nuevo Partido</h2><p className="nm-header-sub">Equipos de <strong style={{ color: "#60a5fa" }}>{currentDiv?.label} División</strong></p></div>
                            </div>
                            <button className="nm-close nm-close-lg" onClick={() => setShowNewMatch(false)}><X size={20} /></button>
                        </div>
                        <div className="nm-body nm-body-wide">
                            {division === "ascenso" && (
                                <div style={{ padding: "12px 18px", borderRadius: "12px", marginBottom: "22px", background: activeGrupo ? (activeGrupo.toLowerCase() === "east" ? "rgba(59,130,246,0.08)" : "rgba(249,115,22,0.08)") : "rgba(255,255,255,0.025)", border: `1px solid ${activeGrupo ? (activeGrupo.toLowerCase() === "east" ? "rgba(59,130,246,0.18)" : "rgba(249,115,22,0.18)") : "rgba(255,255,255,0.06)"}`, display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 600, color: activeGrupo ? (activeGrupo.toLowerCase() === "east" ? "#60a5fa" : "#fb923c") : "#64748b" }}>
                                    <Shield size={16} style={{ flexShrink: 0 }} />
                                    <span>{activeGrupo ? <>Filtrado: solo equipos del <strong>Grupo {activeGrupo === "East" ? "Grupo A" : "Grupo B"}</strong></> : "Los partidos son entre equipos del mismo grupo"}</span>
                                </div>
                            )}
                            <div className="nm-selects-row nm-selects-row-lg">
                                {renderCustomSelect("Equipo Local", newLocal, searchLocal, setSearchLocal, openSelectLocal, (v) => { setOpenSelectLocal(v); if (v) setOpenSelectVisitante(false); }, filteredLocal, handleSelectLocal, localRef)}
                                <div className="nm-vs-badge nm-vs-badge-lg"><span>VS</span></div>
                                {renderCustomSelect("Equipo Visitante", newVisitante, searchVisitante, setSearchVisitante, openSelectVisitante, (v) => { setOpenSelectVisitante(v); if (v) setOpenSelectLocal(false); }, filteredVisitante, handleSelectVisitante, visitanteRef)}
                            </div>
                            <div className="nm-date-row">
                                <div className="nm-date-field">
                                    <label className="nm-date-label">FECHA</label>
                                    <input type="date" value={newFecha} onChange={e => setNewFecha(e.target.value)} className="nm-date-input" />
                                </div>
                                <div className="nm-date-field">
                                    <label className="nm-date-label">HORA</label>
                                    <div className="mm-hora-row">
                                        <span className="mm-jornada-wrap mm-hora-wrap">
                                            <select value={to12h(newHora).h} onChange={e => setNewHora(from12h(e.target.value, to12h(newHora).m, to12h(newHora).ampm))} className="mm-hora-seg">
                                                {["01","02","03","04","05","06","07","08","09","10","11","12"].map(h => <option key={h} value={h}>{h}</option>)}
                                            </select>
                                            <ChevronDown size={13} className="mm-jornada-chevron" />
                                        </span>
                                        <span className="mm-hora-colon">:</span>
                                        <span className="mm-jornada-wrap mm-hora-wrap">
                                            <select value={to12h(newHora).m} onChange={e => setNewHora(from12h(to12h(newHora).h, e.target.value, to12h(newHora).ampm))} className="mm-hora-seg">
                                                {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <ChevronDown size={13} className="mm-jornada-chevron" />
                                        </span>
                                        <button type="button" onClick={() => setNewHora(from12h(to12h(newHora).h, to12h(newHora).m, "AM"))} className={`mm-ampm-btn ${to12h(newHora).ampm === "AM" ? "mm-ampm-active" : ""}`}>AM</button>
                                        <button type="button" onClick={() => setNewHora(from12h(to12h(newHora).h, to12h(newHora).m, "PM"))} className={`mm-ampm-btn ${to12h(newHora).ampm === "PM" ? "mm-ampm-active" : ""}`}>PM</button>
                                    </div>
                                </div>
                            </div>
                            <div className="nm-date-row" style={{ marginTop: 8 }}>
                                <div className="nm-date-field">
                                    <label className="nm-date-label">JORNADA</label>
                                    <span className="mm-jornada-wrap mm-jornada-wrap-modal">
                                        <select value={newJornada} onChange={e => setNewJornada(e.target.value)} className="nm-date-input mm-jornada-filter mm-jornada-filter-modal">
                                            <option value="">Sin asignar</option>
                                            {[...Array(22)].map((_, i) => <option key={i+1} value={i+1}>Jornada {i+1}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="mm-jornada-chevron" />
                                    </span>
                                </div>
                            </div>
                            <div className="nm-preview nm-preview-lg">
                                <div className="nm-preview-side">
                                    {localTeam ? (<><div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg"><img src={`${API}${localTeam.logo}`} alt="" onError={e => { e.target.src = fallbackImg; }} className="nm-preview-logo" /></div><span className="nm-preview-name nm-preview-name-lg">{localTeam.nombre}</span>{division === "ascenso" && <GrupoBadge grupo={localTeam.grupo} size="lg" />}{division !== "ascenso" && localTeam.ciudad && <span className="nm-preview-city nm-preview-city-lg">{localTeam.ciudad}</span>}</>) : (<div className="nm-preview-empty"><div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg nm-preview-logo-empty"><span>?</span></div><span className="nm-preview-name nm-preview-name-lg" style={{ color: "#475569" }}>Sin seleccionar</span></div>)}
                                </div>
                                <div className="nm-preview-center nm-preview-center-lg"><div className="nm-preview-line nm-preview-line-lg" /><div className="nm-preview-vs-icon nm-preview-vs-icon-lg"><Swords size={26} /></div><div className="nm-preview-line nm-preview-line-lg" /></div>
                                <div className="nm-preview-side">
                                    {visitanteTeam ? (<><div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg"><img src={`${API}${visitanteTeam.logo}`} alt="" onError={e => { e.target.src = fallbackImg; }} className="nm-preview-logo" /></div><span className="nm-preview-name nm-preview-name-lg">{visitanteTeam.nombre}</span>{division === "ascenso" && <GrupoBadge grupo={visitanteTeam.grupo} size="lg" />}{division !== "ascenso" && visitanteTeam.ciudad && <span className="nm-preview-city nm-preview-city-lg">{visitanteTeam.ciudad}</span>}</>) : (<div className="nm-preview-empty"><div className="nm-preview-logo-wrap nm-preview-logo-wrap-lg nm-preview-logo-empty"><span>?</span></div><span className="nm-preview-name nm-preview-name-lg" style={{ color: "#475569" }}>Sin seleccionar</span></div>)}
                                </div>
                            </div>
                            {newLocal && newVisitante && newLocal === newVisitante && <div className="nm-warning nm-warning-lg">No puedes seleccionar el mismo equipo</div>}
                            {division === "ascenso" && newLocal && newVisitante && (() => { const lg = (teamMap[newLocal]?.grupo || "").toLowerCase(); const vg = (teamMap[newVisitante]?.grupo || "").toLowerCase(); if (lg && vg && lg !== vg) return <div className="nm-warning nm-warning-lg">Los equipos deben ser del mismo grupo</div>; return null; })()}
                        </div>
                        <div className="nm-footer nm-footer-wide">
                            <button className="nm-btn-cancel nm-btn-cancel-lg" onClick={() => setShowNewMatch(false)}>Cancelar</button>
                            <button className="btn-add nm-btn-ok nm-btn-ok-lg" onClick={createMatch} disabled={submitting || !newLocal || !newVisitante || newLocal === newVisitante} style={{ opacity: (!newLocal || !newVisitante || newLocal === newVisitante || submitting) ? 0.35 : 1, cursor: (!newLocal || !newVisitante || newLocal === newVisitante || submitting) ? "not-allowed" : "pointer", minWidth: "200px", justifyContent: "center" }}>
                                {submitting ? <span className="nm-spin nm-spin-lg" /> : <><Plus size={18} /> Crear Partido</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL RESULTADO */}
            {showResult && selectedMatch && (
                <div className="nm-overlay" onClick={e => { if (e.target === e.currentTarget) setShowResult(false); }}>
                    <div className="nm-card animate__animated animate__fadeInUp nm-score-card">
                        <div className="nm-header">
                            <h2><Trophy size={20} style={{ color: "#e2b340" }} /> Resultado del Partido</h2>
                            <button className="nm-close" onClick={() => setShowResult(false)}><X size={18} /></button>
                        </div>
                        <div className="nm-body nm-score-body">
                            <div className="mm-match-info"><span>{selectedMatch.date}</span><span className={`status ${selectedMatch.status === "Finalizado" ? "done" : "pending"}`} style={{ fontSize: "11px", padding: "3px 10px" }}>{selectedMatch.status || "Pendiente"}</span></div>
                            <div className="nm-date-row" style={{ marginTop: 0, marginBottom: 20 }}>
                                <div className="nm-date-field">
                                    <label className="nm-date-label">FECHA</label>
                                    <input type="date" value={editFecha} onChange={e => setEditFecha(e.target.value)} className="nm-date-input" />
                                </div>
                                <div className="nm-date-field">
                                    <label className="nm-date-label">HORA</label>
                                    <div className="mm-hora-row">
                                        <span className="mm-jornada-wrap mm-hora-wrap">
                                            <select value={to12h(editHora).h} onChange={e => setEditHora(from12h(e.target.value, to12h(editHora).m, to12h(editHora).ampm))} className="mm-hora-seg">
                                                {["01","02","03","04","05","06","07","08","09","10","11","12"].map(h => <option key={h} value={h}>{h}</option>)}
                                            </select>
                                            <ChevronDown size={13} className="mm-jornada-chevron" />
                                        </span>
                                        <span className="mm-hora-colon">:</span>
                                        <span className="mm-jornada-wrap mm-hora-wrap">
                                            <select value={to12h(editHora).m} onChange={e => setEditHora(from12h(to12h(editHora).h, e.target.value, to12h(editHora).ampm))} className="mm-hora-seg">
                                                {["00","05","10","15","20","25","30","35","40","45","50","55"].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <ChevronDown size={13} className="mm-jornada-chevron" />
                                        </span>
                                        <button type="button" onClick={() => setEditHora(from12h(to12h(editHora).h, to12h(editHora).m, "AM"))} className={`mm-ampm-btn ${to12h(editHora).ampm === "AM" ? "mm-ampm-active" : ""}`}>AM</button>
                                        <button type="button" onClick={() => setEditHora(from12h(to12h(editHora).h, to12h(editHora).m, "PM"))} className={`mm-ampm-btn ${to12h(editHora).ampm === "PM" ? "mm-ampm-active" : ""}`}>PM</button>
                                    </div>
                                </div>
                            </div>
                            <div className="nm-date-row" style={{ marginTop: 0, marginBottom: 20 }}>
                                <div className="nm-date-field">
                                    <label className="nm-date-label">JORNADA</label>
                                    <span className="mm-jornada-wrap mm-jornada-wrap-modal">
                                        <select value={editJornada} onChange={e => setEditJornada(e.target.value)} className="nm-date-input mm-jornada-filter mm-jornada-filter-modal">
                                            <option value="">Sin asignar</option>
                                            {[...Array(22)].map((_, i) => <option key={i+1} value={i+1}>Jornada {i+1}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="mm-jornada-chevron" />
                                    </span>
                                </div>
                            </div>
                            <div className="mm-scoreboard">
                                <div className="mm-score-team"><img src={getEscudo(selectedMatch.local_id) || getEscudo(selectedMatch.local_nombre) || fallbackImg} alt="" onError={e => { e.target.src = fallbackImg; }} className="mm-score-logo" /><span className="mm-score-team-name">{selectedMatch.local_nombre}</span></div>
                                <div className="mm-score-controls"><button className="mm-score-btn mm-score-down" onClick={() => setGolesLocal(p => Math.max(0, p - 1))} disabled={golesLocal === 0}><Minus size={20} /></button><div className={`mm-score-num ${golesLocal > golesVisitante ? "winning" : ""}`}>{golesLocal}</div><button className="mm-score-btn mm-score-up" onClick={() => setGolesLocal(p => p + 1)}><ChevronUp size={20} /></button></div>
                                <div className="mm-score-dash-wrap"><div className="mm-score-dash" /></div>
                                <div className="mm-score-controls"><button className="mm-score-btn mm-score-down" onClick={() => setGolesVisitante(p => Math.max(0, p - 1))} disabled={golesVisitante === 0}><Minus size={20} /></button><div className={`mm-score-num ${golesVisitante > golesLocal ? "winning" : ""}`}>{golesVisitante}</div><button className="mm-score-btn mm-score-up" onClick={() => setGolesVisitante(p => p + 1)}><ChevronUp size={20} /></button></div>
                                <div className="mm-score-team"><img src={getEscudo(selectedMatch.visitante_id) || getEscudo(selectedMatch.visitante_nombre) || fallbackImg} alt="" onError={e => { e.target.src = fallbackImg; }} className="mm-score-logo" /><span className="mm-score-team-name">{selectedMatch.visitante_nombre}</span></div>
                            </div>
                            {golesLocal !== golesVisitante && <div className="mm-winner-badge"><CheckCircle2 size={14} /> {golesLocal > golesVisitante ? selectedMatch.local_nombre : selectedMatch.visitante_nombre} gana</div>}
                            {golesLocal === golesVisitante && golesLocal > 0 && <div className="mm-draw-badge">Empate</div>}
                            <div className="mm-score-actions"><button className="mm-reset-btn" onClick={() => { setGolesLocal(0); setGolesVisitante(0); }}><RotateCcw size={14} /> Reiniciar marcador</button></div>
                        </div>
                        <div className="nm-footer">
                            <button className="nm-btn-cancel" onClick={() => setShowResult(false)}>Cancelar</button>
                            <button className="btn-add nm-btn-ok" onClick={saveResult} disabled={submitting} style={{ opacity: submitting ? 0.35 : 1, cursor: submitting ? "not-allowed" : "pointer", minWidth: "190px", justifyContent: "center" }}>
                                {submitting ? <span className="nm-spin" /> : <><CheckCircle2 size={16} /> Guardar Resultado</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
    @keyframes ddFadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes mmSpin { to { transform: rotate(360deg); } }
    @keyframes nmSpin { to { transform: rotate(360deg); } }

    .hide-on-mobile { display: table-cell; }

    /* === Ocultar columnas solo en celular === */
    @media (max-width: 640px) {
        .hide-on-mobile { display: none !important; }
    }

    /* === Desktop: tabla con ancho mínimo === */
    @media (min-width: 641px) {
        .data-table { min-width: 600px; }
    }

    /* === Celdas de equipo (reutilizables) === */
    .td-team { display: flex; align-items: center; gap: 10px; }
    .td-team-right { display: flex; align-items: center; gap: 10px; justify-content: flex-end; }
    .td-team-img { width: 32px; height: 32px; object-fit: contain; border-radius: 6px; background: #fff; padding: 2px; flex-shrink: 0; }
    .td-team-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
    .td-actions { display: flex; gap: 6px; flex-wrap: wrap; }
    .th-actions { white-space: nowrap; }

    /* === Filtro de Jornada (select nativo estilado) === */
    .mm-jornada-wrap { position: relative; display: inline-flex; align-items: center; }
    .mm-jornada-filter {
        appearance: none; -webkit-appearance: none; -moz-appearance: none;
        padding: 7px 30px 7px 12px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.06);
        background: rgba(255,255,255,0.03);
        color: #94a3b8; font-size: 12px; font-weight: 600;
        font-family: inherit; cursor: pointer; outline: none;
        transition: all 0.2s;
    }
    .mm-jornada-filter:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: #cbd5e1; }
    .mm-jornada-filter:focus { border-color: #e2b340; box-shadow: 0 0 0 3px rgba(226,179,64,0.08); background: rgba(255,255,255,0.05); color: #e2e8f0; }
    .mm-jornada-filter option { background: #0f172a; color: #e2e8f0; font-weight: 500; }
    .mm-jornada-chevron { position: absolute; right: 9px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #64748b; transition: all 0.2s; }
    .mm-jornada-wrap:hover .mm-jornada-chevron { color: #e2b340; }
    .mm-jornada-filter:focus + .mm-jornada-chevron { transform: translateY(-50%) rotate(180deg); color: #e2b340; }

    /* Variante para modales (JORNADA sin asignar) — respeta .nm-date-input */
    .mm-jornada-wrap-modal { width: 100%; box-sizing: border-box; }
    .mm-jornada-filter-modal { width: 100%; box-sizing: border-box; padding-right: 38px; font-size: 14px; }

    /* === Selector de HORA (HH : MM AM/PM) — consistente con JORNADA === */
    .mm-hora-row { display: flex; gap: 5px; align-items: center; }
    .mm-hora-wrap { width: auto; }
    .mm-hora-seg {
        appearance: none; -webkit-appearance: none; -moz-appearance: none;
        width: 64px; padding: 12px 22px 12px 8px;
        text-align: center;
        border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.03);
        color: #e2e8f0; font-size: 14px; font-weight: 700;
        font-family: inherit; cursor: pointer; outline: none;
        transition: all 0.2s; box-sizing: border-box;
    }
    .mm-hora-seg:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
    .mm-hora-seg:focus { border-color: #e2b340; box-shadow: 0 0 0 3px rgba(226,179,64,0.08); background: rgba(255,255,255,0.05); }
    .mm-hora-seg option { background: #0f172a; color: #e2e8f0; font-weight: 600; }
    .mm-hora-colon { color: #475569; font-weight: 800; font-size: 14px; user-select: none; }
    .mm-ampm-btn {
        padding: 12px 10px; border-radius: 12px;
        border: 1.5px solid rgba(255,255,255,0.08);
        background: rgba(255,255,255,0.03);
        color: #94a3b8; font-size: 13px; font-weight: 800;
        font-family: inherit; cursor: pointer; outline: none;
        transition: all 0.2s; box-sizing: border-box;
    }
    .mm-ampm-btn:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: #cbd5e1; }
    .mm-ampm-btn:focus { border-color: #e2b340; box-shadow: 0 0 0 3px rgba(226,179,64,0.08); }
    .mm-ampm-active { background: rgba(226,179,64,0.12) !important; border-color: #e2b340 !important; color: #e2b340 !important; box-shadow: 0 0 12px rgba(226,179,64,0.12); }

    /* === Tabs y botones === */
    .mm-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 3px; flex-wrap: wrap; }
    .mm-tab { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: none; background: transparent; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-tab:hover { color: #94a3b8; background: rgba(255,255,255,0.03); }
    .mm-tab-active { color: #f1f5f9 !important; background: rgba(255,255,255,0.08) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
    .mm-tab-pending.mm-tab-active { background: rgba(59,130,246,0.15) !important; color: #60a5fa !important; border: 1px solid rgba(59,130,246,0.2); }
    .mm-tab-played.mm-tab-active { background: rgba(16,185,129,0.15) !important; color: #34d399 !important; border: 1px solid rgba(16,185,129,0.2); }
    .mm-tab-count { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 18px; padding: 0 5px; border-radius: 5px; font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.06); color: #475569; font-family: monospace; }
    .mm-tab-active .mm-tab-count { background: rgba(255,255,255,0.1); color: #94a3b8; }
    .mm-tab-pending.mm-tab-active .mm-tab-count { background: rgba(59,130,246,0.2); color: #93c5fd; }
    .mm-tab-played.mm-tab-active .mm-tab-count { background: rgba(16,185,129,0.2); color: #6ee7b7; }
    .mm-reset-all-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.08); color: #f87171; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-reset-all-btn:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.35); }
    .mm-reset-single-btn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(245,158,11,0.2); background: rgba(245,158,11,0.08); color: #fbbf24; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-reset-single-btn:hover { background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.35); }
    .mm-narrar-btn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(99,102,241,0.25); background: rgba(99,102,241,0.08); color: #818cf8; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-narrar-btn:hover { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.4); }
    .status.live { background: rgba(34,197,94,0.12); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); }
    .mm-star-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.03); color: #475569; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .mm-star-btn:hover { background: rgba(226,179,64,0.08); border-color: rgba(226,179,64,0.2); color: #e2b340; }
    .mm-star-active { background: rgba(226,179,64,0.12) !important; border-color: rgba(226,179,64,0.3) !important; color: #e2b340 !important; box-shadow: 0 0 12px rgba(226,179,64,0.15); }
    .result-action-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; white-space: nowrap; }
    .result-new { background: rgba(226,179,64,0.12); color: #e2b340; border: 1px solid rgba(226,179,64,0.2); }
    .result-new:hover { background: rgba(226,179,64,0.22); }
    .result-edit { background: rgba(59,130,246,0.12); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
    .result-edit:hover { background: rgba(59,130,246,0.22); }

    /* === Modales === */
    .nm-overlay { position: fixed; inset: 0; background: rgba(2,6,15,0.82); backdrop-filter: blur(10px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .nm-card { background: #0b1120; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; width: 620px; max-width: 95vw; max-height: 92vh; display: flex; flex-direction: column; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.7); overflow: hidden; }
    .nm-score-card { width: 600px; }
    .nm-card-wide { width: 820px; }
    .nm-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.015); }
    .nm-header h2 { margin: 0; font-size: 1.05rem; color: #f1f5f9; display: flex; align-items: center; gap: 8px; }
    .nm-header-wide { padding: 22px 32px; background: linear-gradient(135deg, rgba(226,179,64,0.04) 0%, rgba(255,255,255,0.015) 100%); border-bottom: 1px solid rgba(226,179,64,0.08); }
    .nm-header-icon { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, rgba(226,179,64,0.15), rgba(226,179,64,0.05)); border: 1px solid rgba(226,179,64,0.2); display: flex; align-items: center; justify-content: center; color: #e2b340; }
    .nm-header-sub { margin: 2px 0 0 0; font-size: 0.8rem; color: #475569; font-weight: 500; }
    .nm-close { background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; color: #64748b; transition: all 0.25s; }
    .nm-close:hover { background: rgba(239,68,68,0.15); color: #ef4444; border-color: rgba(239,68,68,0.3); transform: rotate(90deg); }
    .nm-close-lg { width: 38px; height: 38px; border-radius: 10px; }
    .nm-body { padding: 24px; overflow-y: auto; flex: 1; }
    .nm-body::-webkit-scrollbar { width: 5px; }
    .nm-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
    .nm-body-wide { padding: 28px 32px; }
    .nm-score-body { padding: 20px 28px 28px; }
    .nm-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.015); }
    .nm-footer-wide { padding: 20px 32px; }
    .nm-btn-cancel { padding: 10px 22px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; background: transparent; color: #64748b; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
    .nm-btn-cancel:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
    .nm-btn-cancel-lg { padding: 12px 28px; font-size: 15px; border-radius: 10px; }
    .nm-btn-ok-lg { padding: 12px 28px; font-size: 15px; border-radius: 10px; }
    .nm-spin { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.15); border-top-color: #fff; border-radius: 50%; animation: nmSpin 0.6s linear infinite; }
    .nm-spin-lg { width: 22px; height: 22px; border-width: 3px; }
    .nm-warning { margin-top: 14px; text-align: center; padding: 10px; border-radius: 8px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); color: #f87171; font-size: 13px; font-weight: 600; }
    .nm-warning-lg { margin-top: 18px; padding: 12px; font-size: 14px; border-radius: 10px; }

    /* === Selectores === */
    .nm-selects-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: start; }
    .nm-vs-badge { display: flex; align-items: center; justify-content: center; padding-top: 26px; }
    .nm-vs-badge span { font-weight: 900; font-size: 13px; letter-spacing: 3px; color: #e2b340; background: rgba(226,179,64,0.08); border: 1px solid rgba(226,179,64,0.15); padding: 8px 14px; border-radius: 8px; }
    .nm-selects-row-lg { gap: 20px; }
    .nm-vs-badge-lg { padding-top: 34px; }
    .nm-vs-badge-lg span { font-size: 16px; letter-spacing: 4px; padding: 12px 20px; border-radius: 10px; }
    .cs-wrap { position: relative; }
    .cs-label { display: block; margin-bottom: 8px; font-weight: 600; color: #94a3b8; font-size: 13px; }
    .cs-trigger { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.2s; min-height: 44px; }
    .cs-trigger:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
    .cs-open { border-color: #e2b340 !important; box-shadow: 0 0 0 3px rgba(226,179,64,0.08); }
    .cs-has-value { background: rgba(255,255,255,0.04); }
    .cs-placeholder { color: #334155; font-size: 14px; }
    .cs-selected { display: flex; align-items: center; gap: 10px; }
    .cs-sel-logo { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; background: #fff; padding: 2px; flex-shrink: 0; }
    .cs-sel-name { font-weight: 700; font-size: 14px; color: #e2e8f0; }
    .cs-chevron { color: #475569; transition: transform 0.2s; flex-shrink: 0; }
    .cs-chevron-up { transform: rotate(180deg); color: #e2b340; }
    .cs-trigger-lg { padding: 14px 16px; border-radius: 14px; min-height: 56px; border-width: 1.5px; }
    .cs-sel-logo-lg { width: 38px; height: 38px; border-radius: 10px; padding: 3px; }
    .cs-sel-name-lg { font-size: 16px; font-weight: 800; }
    .cs-placeholder-lg { font-size: 15px; }
    .cs-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #0f172a; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; box-shadow: 0 16px 40px -8px rgba(0,0,0,0.6); z-index: 500; overflow: hidden; }
    .cs-search-wrap { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .cs-search-icon { color: #334155; flex-shrink: 0; }
    .cs-search-input { flex: 1; background: none; border: none; outline: none; color: #e2e8f0; font-size: 13px; }
    .cs-search-input::placeholder { color: #334155; }
    .cs-options { max-height: 200px; overflow-y: auto; padding: 6px; }
    .cs-options::-webkit-scrollbar { width: 4px; }
    .cs-options::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
    .cs-group-sep { display: flex; align-items: center; gap: 7px; padding: 10px 12px 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; }
    .cs-group-sep-east { color: #60a5fa; }
    .cs-group-sep-west { color: #fb923c; }
    .cs-option { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
    .cs-option:hover { background: rgba(255,255,255,0.05); }
    .cs-option-active { background: rgba(226,179,64,0.08); }
    .cs-opt-logo { width: 26px; height: 26px; object-fit: contain; border-radius: 5px; background: #fff; padding: 1px; flex-shrink: 0; }
    .cs-opt-name { flex: 1; font-size: 13px; font-weight: 600; color: #cbd5e1; }
    .cs-option-active .cs-opt-name { color: #e2b340; }
    .cs-opt-check { color: #e2b340; flex-shrink: 0; }
    .cs-opt-city { font-size: 11px; color: #475569; font-weight: 500; }
    .cs-empty { text-align: center; padding: 16px; color: #334155; font-size: 13px; }
    .cs-dropdown-lg { border-radius: 14px; }
    .cs-search-wrap-lg { padding: 14px 16px; gap: 10px; }
    .cs-search-icon-lg { color: #475569; }
    .cs-search-input-lg { font-size: 15px; }
    .cs-options-lg { max-height: 280px; padding: 8px; }
    .cs-option-lg { padding: 11px 12px; border-radius: 10px; gap: 12px; }
    .cs-opt-logo-lg { width: 34px; height: 34px; border-radius: 8px; padding: 2px; }
    .cs-opt-name-lg { font-size: 14px; font-weight: 700; }
    .cs-opt-check-lg { width: 18px; height: 18px; }
    .cs-empty-lg { padding: 24px; font-size: 14px; }

    /* === Date/time inputs === */
    .nm-date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
    .nm-date-field { display: flex; flex-direction: column; gap: 6px; }
    .nm-date-label { font-weight: 600; color: #94a3b8; font-size: 13px; }
    .nm-date-input { padding: 12px 16px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #e2e8f0; font-size: 14px; font-weight: 600; font-family: inherit; transition: all 0.2s; outline: none; width: 100%; box-sizing: border-box; }
    .nm-date-input:focus { border-color: #e2b340; box-shadow: 0 0 0 3px rgba(226,179,64,0.08); background: rgba(255,255,255,0.05); }
    .nm-date-input::-webkit-calendar-picker-indicator { filter: invert(0.7); cursor: pointer; }

    /* === Preview modal === */
    .nm-preview { margin-top: 20px; padding: 24px 16px; background: linear-gradient(135deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005)); border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .nm-preview-side { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .nm-preview-logo-wrap { width: 68px; height: 68px; border-radius: 14px; background: #fff; padding: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .nm-preview-logo { width: 100%; height: 100%; objectFit: contain; }
    .nm-preview-logo-empty { background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.06); }
    .nm-preview-logo-empty span { font-size: 28px; color: #1e293b; font-weight: 800; }
    .nm-preview-name { font-weight: 800; font-size: 15px; color: #e2e8f0; text-align: center; }
    .nm-preview-city { font-size: 11px; color: #475569; font-weight: 500; }
    .nm-preview-center { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 20px; flex-shrink: 0; }
    .nm-preview-line { width: 1px; height: 30px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent); }
    .nm-preview-vs-icon { color: #e2b340; opacity: 0.5; }
    .nm-preview-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .nm-preview-lg { margin-top: 28px; padding: 36px 24px; border-radius: 18px; border: 1px solid rgba(226,179,64,0.06); background: linear-gradient(135deg, rgba(226,179,64,0.02) 0%, rgba(255,255,255,0.01) 50%, rgba(226,179,64,0.02) 100%); }
    .nm-preview-logo-wrap-lg { width: 90px; height: 90px; border-radius: 18px; padding: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
    .nm-preview-name-lg { font-size: 18px; font-weight: 900; }
    .nm-preview-city-lg { font-size: 12px; }
    .nm-preview-center-lg { padding: 0 28px; gap: 10px; }
    .nm-preview-line-lg { height: 44px; }
    .nm-preview-vs-icon-lg { opacity: 0.4; }

    /* === Scoreboard === */
    .mm-match-info { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 24px; color: #475569; font-size: 13px; }
    .mm-scoreboard { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 28px 12px; background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005)); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; }
    .mm-score-team { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 110px; flex-shrink: 0; }
    .mm-score-logo { width: 52px; height: 52px; object-fit: contain; border-radius: 10px; background: #fff; padding: 3px; }
    .mm-score-team-name { font-size: 12px; font-weight: 700; color: #cbd5e1; text-align: center; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .mm-score-controls { display: flex; align-items: center; gap: 5px; }
    .mm-score-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.025); color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; }
    .mm-score-btn:disabled { opacity: 0.15; cursor: not-allowed; }
    .mm-score-down:hover:not(:disabled) { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); transform: scale(1.08); }
    .mm-score-up:hover:not(:disabled) { background: rgba(16,185,129,0.15); color: #34d399; border-color: rgba(16,185,129,0.3); transform: scale(1.08); }
    .mm-score-num { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 900; color: #64748b; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; transition: all 0.2s; }
    .mm-score-num.winning { color: #e2b340; background: rgba(226,179,64,0.08); border-color: rgba(226,179,64,0.2); box-shadow: 0 0 20px rgba(226,179,64,0.1); }
    .mm-score-dash-wrap { display: flex; align-items: center; padding: 0 2px; }
    .mm-score-dash { width: 2px; height: 44px; background: rgba(255,255,255,0.08); border-radius: 1px; }
    .mm-winner-badge { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 18px; padding: 8px 16px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.15); border-radius: 8px; color: #34d399; font-size: 13px; font-weight: 700; }
    .mm-draw-badge { text-align: center; margin-top: 18px; padding: 8px 16px; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.15); border-radius: 8px; color: #fbbf24; font-size: 13px; font-weight: 700; }
    .mm-score-actions { display: flex; justify-content: center; margin-top: 14px; }
    .mm-reset-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; color: #475569; background: transparent; border: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: all 0.2s; }
    .mm-reset-btn:hover { color: #f87171; border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.06); }
    button.nav-item { background: none; border: none; color: var(--text-muted); font-family: inherit; }

    /* ==============================================
       RESPONSIVE — 3 breakpoints claros
       ============================================== */

    /* Tablet: modales fullscreen + header de tabla ordenado */
    @media (max-width: 860px) {
        .nm-card-wide { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
        .nm-selects-row-lg { grid-template-columns: 1fr; gap: 12px; }
        .nm-vs-badge-lg { padding-top: 0; }
        .nm-preview-lg { padding: 24px 16px; flex-direction: column; gap: 16px; min-height: 180px; justify-content: center; }
        .nm-preview-logo-wrap-lg { width: 70px; height: 70px; }
        .nm-preview-name-lg { font-size: 16px; }
        .nm-preview-center-lg { flex-direction: row; padding: 0; }
        .nm-preview-line-lg { width: 40px; height: 1px; }
        .nm-footer-wide { flex-direction: column-reverse; }
        .nm-btn-cancel-lg, .nm-btn-ok-lg { width: 100%; text-align: center; justify-content: center !important; }

        /* Header de tabla: apilar título y controles verticalmente */
        .table-header { flex-direction: column; align-items: stretch !important; gap: 14px !important; }
        .table-header h2 { font-size: 16px; }
        /* Grupo de tabs + filtros + botón: ocupar todo el ancho, wrap natural */
        .table-header > div { width: 100%; justify-content: flex-start; }
        .mm-tabs { width: 100%; }
        .mm-tab { flex: 1; justify-content: center; }
        .mm-jornada-filter { flex: 1; min-width: 0; }
        .mm-reset-all-btn { flex: 1; justify-content: center; }
        .btn-add { width: 100%; justify-content: center; }
    }

    /* ✅ Celular: tabla fluida sin scroll horizontal */
    @media (max-width: 640px) {
        .data-table { min-width: 0 !important; width: 100%; table-layout: fixed; }
        .data-table th, .data-table td { padding: 10px 4px; font-size: 11px; }
        .td-team-img { width: 24px; height: 24px; }
        .td-team { gap: 5px; }
        .td-team-right { gap: 5px; }
        .td-team-name { max-width: 70px; font-size: 11px; }
        .td-actions { gap: 3px; justify-content: center; flex-wrap: nowrap; }
        /* Botones: solo iconos en celular */
        .result-action-btn span,
        .mm-reset-single-btn span,
        .mm-reset-all-btn span,
        .mm-star-btn span { display: none; }
        .mm-star-btn, .result-action-btn, .mm-reset-single-btn { padding: 6px 7px; }
        .btn-delete { padding: 6px; }

        .nm-card, .nm-score-card { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
        .nm-selects-row { grid-template-columns: 1fr; gap: 8px; }
        .nm-vs-badge { padding-top: 0; }
        .nm-preview-logo-wrap { width: 50px; height: 50px; }
        .nm-preview-name { font-size: 13px; }
        .nm-preview-center { padding: 0 12px; }
        .nm-footer { flex-direction: column-reverse; }
        .nm-btn-cancel, .nm-btn-ok { width: 100%; text-align: center; justify-content: center !important; }
        .mm-scoreboard { gap: 6px; flex-wrap: wrap; padding: 18px 8px; }
        .mm-score-team { width: 70px; }
        .mm-score-logo { width: 36px; height: 36px; }
        .mm-score-team-name { font-size: 10px; }
        .mm-score-num { width: 44px; height: 44px; font-size: 24px; }
        .mm-score-btn { width: 34px; height: 34px; }

        /* Selector de HORA: wraps ocupan ancho completo en móvil */
        .nm-date-row { grid-template-columns: 1fr !important; gap: 14px !important; }
        .mm-hora-row { justify-content: flex-start; }
        .mm-hora-seg { width: 56px !important; padding: 10px 18px 10px 6px !important; font-size: 13px !important; }
        .mm-ampm-btn { padding: 10px 8px !important; font-size: 12px !important; }
        .mm-jornada-filter-modal { font-size: 13px !important; padding-right: 34px !important; }

        /* Tabs: texto más chico en móvil */
        .mm-tab { font-size: 11px !important; padding: 6px 8px !important; }
        .mm-tab-count { min-width: 16px; height: 14px; font-size: 9px; }
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

export default ManageMatches;
