// ========== ManageMatchComments.jsx ==========
// Admin panel para gestionar comentarios/narración de un partido
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  Target, Trophy, ChevronDown, Plus, Trash2, Save, MessageSquare, RefreshCw,
  Clock, AlertTriangle, Goal, ArrowLeftRight, Flag, Zap, RotateCcw, MessageCircle
} from "lucide-react";

const API = "http://numeros-y-futbol.test/backend/";

const TIPO_OPTS = [
  { value:"comentario",       label:"Comentario",        icon:"💬", color:"#94a3b8" },
  { value:"gol",              label:"GOL ⚽",            icon:"⚽", color:"#10b981" },
  { value:"tarjeta_amarilla", label:"Tarjeta Amarilla",  icon:"🟨", color:"#f59e0b" },
  { value:"tarjeta_roja",     label:"Tarjeta Roja",      icon:"🟥", color:"#ef4444" },
  { value:"cambio",           label:"Cambio de jugador", icon:"🔄", color:"#3b82f6" },
  { value:"penal",            label:"Penal",             icon:"🎯", color:"#a855f7" },
  { value:"inicio",           label:"Inicio del partido",icon:"▶️", color:"#22c55e" },
  { value:"fin",              label:"Fin del partido",   icon:"🏁", color:"#64748b" },
];

const logoUrl = (p) => {
  if (!p) return null;
  if (p.startsWith("http")) return p;
  return `${API}${p}`;
};

export default function ManageMatchComments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamsOpen, setTeamsOpen]     = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Parámetros de la URL: ?partido=ID&division=primera
  const partidoId = searchParams.get("partido");
  const division  = searchParams.get("division") || "primera";

  const [partido, setPartido]         = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [matches, setMatches]         = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loading, setLoading]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [selectedDiv, setSelectedDiv] = useState(division);
  const [selectedPartido, setSelectedPartido] = useState(partidoId || "");

  // Formulario nuevo comentario
  const [form, setForm] = useState({
    minuto: "",
    tipo: "comentario",
    descripcion: "",
    equipo: "",
  });

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

  // Cargar partidos disponibles de la división seleccionada
  useEffect(() => {
    fetchMatches();
  }, [selectedDiv]);

  // Cargar detalle del partido seleccionado
  useEffect(() => {
    if (selectedPartido) fetchPartidoDetail();
  }, [selectedPartido]);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      let url;
      if (selectedDiv === "primera")       url = `${API}get_matches.php`;
      else if (selectedDiv === "segunda")  url = `${API}get_matches_segunda.php`;
      else                                 url = `${API}get_matches_tercera.php`;

      const res  = await fetch(url);
      const text = await res.text();
      const data = JSON.parse(text);
      setMatches(Array.isArray(data) ? data : (data.data || data.matches || []));
    } catch (_) { setMatches([]); }
    setLoadingMatches(false);
  };

  const fetchPartidoDetail = async () => {
    if (!selectedPartido) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API}get_match_detail.php?id=${selectedPartido}&division=${selectedDiv}`);
      const data = await res.json();
      if (data.partido) {
        setPartido(data.partido);
        setComentarios(data.comentarios || []);
        // Pre-llenar equipo con local por defecto
        setForm(f => ({ ...f, equipo: data.partido.local_nombre || "" }));
      }
    } catch (_) {}
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartido) { Swal.fire({ icon:"warning", title:"Selecciona un partido", toast:true, position:"top-end", showConfirmButton:false, timer:2000 }); return; }
    if (!form.descripcion.trim()) { Swal.fire({ icon:"warning", title:"Falta la descripción", toast:true, position:"top-end", showConfirmButton:false, timer:2000 }); return; }

    setSubmitting(true);
    try {
      const res  = await fetch(`${API}create_match_comment.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partido_id:  parseInt(selectedPartido),
          division:    selectedDiv,
          minuto:      parseInt(form.minuto) || 0,
          tipo:        form.tipo,
          descripcion: form.descripcion.trim(),
          equipo:      form.equipo.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon:"success", title:"Evento añadido", toast:true, position:"top-end", showConfirmButton:false, timer:1500 });
        setForm(f => ({ ...f, minuto:"", descripcion:"", tipo:"comentario" }));
        fetchPartidoDetail(); // Refrescar
      } else {
        Swal.fire("Error", data.error || "No se pudo guardar", "error");
      }
    } catch (_) { Swal.fire("Error", "Error de conexión", "error"); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    const r = await Swal.fire({ title:"¿Eliminar evento?", icon:"warning", showCancelButton:true, confirmButtonText:"Eliminar", confirmButtonColor:"#d33", cancelButtonText:"Cancelar" });
    if (!r.isConfirmed) return;
    try {
      const res  = await fetch(`${API}delete_match_comment.php`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id }) });
      const data = await res.json();
      if (data.success) {
        setComentarios(prev => prev.filter(c => c.id != id));
        Swal.fire({ icon:"success", title:"Eliminado", toast:true, position:"top-end", showConfirmButton:false, timer:1500 });
      }
    } catch (_) {}
  };

  const handleLogout = () => {
    Swal.fire({ title:"¿Cerrar sesión?", icon:"warning", showCancelButton:true, confirmButtonText:"Sí, salir", confirmButtonColor:"#d33" })
      .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); window.location.href = "/login"; } });
  };

 const navItems = [
      { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
      { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
      { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
      {
        type: "dropdown", icon: <Shield size={20} />, label: "Equipos",
        children: [
          { path: "/teams/primera", label: "Primera División" },
          { path: "/teams/segunda", label: "Segunda División" },
          { path: "/teams/tercera", label: "Tercera División" },
        ]
      },
      { path: "/admin/plantilla", icon: <Target size={20} />, label: "Plantillas" },
      { path: "/posiciones", icon: <Trophy size={20} />, label: "Posiciones" },
      { path: "/admin/copa", icon: <Trophy size={20} />, label: "Copa Presidente" },
      { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
      { path: "/manage-comments", icon: <MessageCircle size={20} />, label: "Gestionar Comentarios" },
      { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
      { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
    ];

  // Helpers para mostrar partidos
  const getMatchName = (m) => {
    const local    = m.home_name || m.local_nombre   || m.equipo_local_nombre   || `Equipo ${m.equipo_local   || m.local_id}`;
    const visitante= m.away_name || m.visitante_nombre|| m.equipo_visitante_nombre|| `Equipo ${m.equipo_visitante|| m.visitante_id}`;
    return `${local} vs ${visitante}`;
  };
  const getMatchStatus = (m) => m.estado || m.status || "Pendiente";

  const tipoOpt = TIPO_OPTS.find(t => t.value === form.tipo) || TIPO_OPTS[0];

  return (
    <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>
      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo" />
          </div>
          <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, idx) => {
              if (item.type === "dropdown") return (
                <li key={idx}>
                  <button className="nav-item" onClick={() => setTeamsOpen(!teamsOpen)} style={{ width:"100%", justifyContent:"space-between" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:14 }}>{item.icon} {item.label}</span>
                    <ChevronDown size={16} style={{ transition:"transform 0.25s", transform: teamsOpen ? "rotate(180deg)":"rotate(0deg)", opacity:0.4 }} />
                  </button>
                  <ul style={{ maxHeight: teamsOpen?"200px":"0", opacity: teamsOpen?"1":"0", overflow:"hidden", transition:"max-height 0.3s ease,opacity 0.2s ease", listStyle:"none", padding: teamsOpen?"2px 0 4px 0":"0", margin:0 }}>
                    {item.children.map(child => (
                      <li key={child.path}><Link to={child.path} className={`nav-item${location.pathname===child.path?" active":""}`} style={{ paddingLeft:"48px", fontSize:"13.5px" }}>{child.label}</Link></li>
                    ))}
                  </ul>
                </li>
              );
              return (
                <li key={item.path}>
                  <Link to={item.path} className={`nav-item${location.pathname===item.path?" active":""}`}>{item.icon} {item.label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}><LogOut size={20} /> Cerrar sesión</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
          <div className="search-bar"><input type="text" placeholder="Narración en vivo de partidos..." readOnly /></div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">Narración de Partidos</h1>
          <p style={{ color:"var(--text-muted)", marginBottom:24, fontSize:14 }}>
            Gestiona los comentarios y eventos de cada partido. Los visitantes verán esta narración en tiempo real.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:20, alignItems:"start" }}>

            {/* ── Panel izquierdo: selector + formulario ── */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Selector división */}
              <div className="table-container" style={{ padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:"var(--text-main)" }}>1. Selecciona división</h3>
                <div style={{ display:"flex", gap:6 }}>
                  {["primera","segunda","tercera"].map(d => (
                    <button key={d} onClick={() => { setSelectedDiv(d); setSelectedPartido(""); setPartido(null); setComentarios([]); }}
                      style={{ flex:1, padding:"8px 4px", border:`1px solid ${selectedDiv===d?"var(--accent-red)":"var(--border)"}`, borderRadius:8, background: selectedDiv===d?"rgba(239,68,68,0.15)":"transparent", color: selectedDiv===d?"var(--accent-red)":"var(--text-muted)", fontWeight:700, fontSize:12, cursor:"pointer", textTransform:"capitalize", transition:"all 0.2s", fontFamily:"inherit" }}>
                      {d.charAt(0).toUpperCase()+d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector partido */}
              <div className="table-container" style={{ padding:20 }}>
                <h3 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:"var(--text-main)" }}>2. Selecciona partido</h3>
                {loadingMatches ? (
                  <p style={{ color:"var(--text-muted)", fontSize:13 }}>Cargando partidos...</p>
                ) : matches.length === 0 ? (
                  <p style={{ color:"var(--text-muted)", fontSize:13 }}>Sin partidos en esta división</p>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:280, overflowY:"auto" }}>
                    {matches.map(m => {
                      const mid    = m.id;
                      const name   = getMatchName(m);
                      const status = getMatchStatus(m);
                      const isSelected = String(selectedPartido) === String(mid);
                      const isLive = status.toLowerCase().includes("vivo") || status.toLowerCase().includes("curso");
                      const isPending = status.toLowerCase().includes("pendiente") || status.toLowerCase().includes("programado");
                      return (
                        <button key={mid} onClick={() => setSelectedPartido(String(mid))}
                          style={{ display:"flex", flexDirection:"column", gap:4, padding:"10px 12px", border:`1px solid ${isSelected?"var(--accent-red)":"var(--border)"}`, borderRadius:10, background: isSelected?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"left", transition:"all 0.2s", fontFamily:"inherit" }}
                          onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                          onMouseLeave={e => { if(!isSelected) e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}>
                          <span style={{ fontSize:12, fontWeight:600, color: isSelected?"var(--accent-red)":"var(--text-main)", lineHeight:1.3 }}>{name}</span>
                          <span style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color: isLive?"#22c55e":isPending?"#f97316":"#64748b" }}>
                            {isLive?"🔴 EN VIVO":isPending?"🟡 PENDIENTE":"⚫ FINALIZADO"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Formulario nuevo evento */}
              {partido && (
                <div className="table-container" style={{ padding:20 }}>
                  <h3 style={{ margin:"0 0 16px", fontSize:14, fontWeight:700, color:"var(--text-main)" }}>3. Añadir evento</h3>

                  <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    {/* Tipo */}
                    <div>
                      <label style={{ display:"block", marginBottom:6, fontSize:12, fontWeight:600, color:"#64748b" }}>Tipo de evento</label>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                        {TIPO_OPTS.map(t => (
                          <button key={t.value} type="button" onClick={() => setForm(f => ({ ...f, tipo:t.value }))}
                            style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 10px", border:`1px solid ${form.tipo===t.value?t.color:"var(--border)"}`, borderRadius:8, background: form.tipo===t.value?`${t.color}22`:"transparent", color: form.tipo===t.value?t.color:"var(--text-muted)", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all 0.15s", fontFamily:"inherit" }}>
                            <span>{t.icon}</span> {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Minuto */}
                    <div>
                      <label style={{ display:"block", marginBottom:6, fontSize:12, fontWeight:600, color:"#64748b" }}>Minuto</label>
                      <input type="number" min="0" max="120" placeholder="Ej: 45" value={form.minuto} onChange={e => setForm(f => ({...f, minuto:e.target.value}))}
                        style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid var(--border)", background:"rgba(255,255,255,0.03)", color:"var(--text-main)", fontSize:14, fontFamily:"inherit" }} />
                    </div>

                    {/* Equipo */}
                    <div>
                      <label style={{ display:"block", marginBottom:6, fontSize:12, fontWeight:600, color:"#64748b" }}>Equipo (opcional)</label>
                      <div style={{ display:"flex", gap:6 }}>
                        {[partido.local_nombre, partido.visitante_nombre].map(eq => (
                          <button key={eq} type="button" onClick={() => setForm(f => ({...f, equipo:eq}))}
                            style={{ flex:1, padding:"7px 6px", border:`1px solid ${form.equipo===eq?"var(--accent-blue)":"var(--border)"}`, borderRadius:8, background: form.equipo===eq?"rgba(59,130,246,0.15)":"transparent", color: form.equipo===eq?"#3b82f6":"var(--text-muted)", fontSize:11, fontWeight:600, cursor:"pointer", transition:"all 0.15s", fontFamily:"inherit", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {eq}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Descripción */}
                    <div>
                      <label style={{ display:"block", marginBottom:6, fontSize:12, fontWeight:600, color:"#64748b" }}>Descripción *</label>
                      <textarea value={form.descripcion} onChange={e => setForm(f => ({...f, descripcion:e.target.value}))} rows={3}
                        placeholder={
                          form.tipo==="gol" ? "Ej: ¡GOOOL! Nombre del jugador anota de cabeza..."
                          : form.tipo==="tarjeta_amarilla" ? "Ej: Nombre del jugador ve la tarjeta amarilla por falta..."
                          : "Describe el evento del partido..."
                        }
                        style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid var(--border)", background:"rgba(255,255,255,0.03)", color:"var(--text-main)", fontSize:13, resize:"vertical", fontFamily:"inherit" }} />
                    </div>

                    <button type="submit" className="btn-add" disabled={submitting} style={{ justifyContent:"center" }}>
                      {submitting ? "Guardando..." : <><Plus size={17} /> Añadir Evento</>}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* ── Panel derecho: partido + timeline ── */}
            <div>
              {!selectedPartido ? (
                <div style={{ background:"rgba(30,41,59,0.5)", border:"1px solid var(--border)", borderRadius:16, padding:"48px 24px", textAlign:"center" }}>
                  <div style={{ fontSize:36, marginBottom:12, opacity:0.3 }}>📋</div>
                  <h3 style={{ color:"var(--text-muted)", fontWeight:600, marginBottom:8 }}>Selecciona un partido</h3>
                  <p style={{ color:"#334155", fontSize:13 }}>Elige una división y un partido del panel izquierdo para gestionar su narración</p>
                </div>
              ) : loading ? (
                <div style={{ background:"rgba(30,41,59,0.5)", border:"1px solid var(--border)", borderRadius:16, padding:"48px 24px", textAlign:"center" }}>
                  <div style={{ fontSize:28, animation:"spin 1s linear infinite", display:"inline-block", marginBottom:12 }}>⚽</div>
                  <p style={{ color:"var(--text-muted)", fontSize:14 }}>Cargando datos del partido...</p>
                </div>
              ) : partido ? (
                <>
                  {/* Header del partido */}
                  <div style={{ background:"linear-gradient(160deg,rgba(15,26,46,0.95),rgba(10,15,29,0.98))", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"20px 24px", marginBottom:16, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,transparent,rgba(255,31,31,0.6),rgba(255,31,31,1),rgba(255,31,31,0.6),transparent)" }} />

                    {/* Status badge */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                      <span style={{ fontSize:10, fontWeight:800, letterSpacing:2, textTransform:"uppercase", padding:"4px 12px", borderRadius:20, background: (partido.estado||"").toLowerCase().includes("vivo")?"rgba(34,197,94,0.15)": (partido.estado||"").toLowerCase().includes("pendiente")?"rgba(249,115,22,0.15)":"rgba(100,116,139,0.15)", color: (partido.estado||"").toLowerCase().includes("vivo")?"#22c55e": (partido.estado||"").toLowerCase().includes("pendiente")?"#f97316":"#64748b", border:`1px solid ${(partido.estado||"").toLowerCase().includes("vivo")?"rgba(34,197,94,0.3)": (partido.estado||"").toLowerCase().includes("pendiente")?"rgba(249,115,22,0.3)":"rgba(100,116,139,0.3)"}` }}>
                        {partido.estado || "Pendiente"}
                      </span>
                      <button onClick={fetchPartidoDetail} style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"5px 10px", color:"#64748b", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                        <RefreshCw size={12} /> Actualizar
                      </button>
                    </div>

                    {/* Equipos + marcador */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
                      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                        {logoUrl(partido.local_logo) && <img src={logoUrl(partido.local_logo)} alt="" style={{ width:48, height:48, objectFit:"contain", filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }} />}
                        <span style={{ fontSize:13, fontWeight:700, color:"#f1f5f9", textAlign:"center", lineHeight:1.3 }}>{partido.local_nombre}</span>
                      </div>

                      <div style={{ textAlign:"center", flexShrink:0 }}>
                        {partido.estado?.toLowerCase() === "pendiente" || !partido.goles_local && partido.goles_local !== 0 ? (
                          <span style={{ fontSize:20, fontWeight:900, color:"#f97316", letterSpacing:4 }}>VS</span>
                        ) : (
                          <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:12, padding:"8px 16px", border:"1px solid rgba(255,255,255,0.06)" }}>
                            <span style={{ fontSize:28, fontWeight:900, color:"#f1f5f9", fontFamily:"Montserrat,sans-serif", letterSpacing:4 }}>
                              {partido.goles_local ?? 0} – {partido.goles_visitante ?? 0}
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                        {logoUrl(partido.visitante_logo) && <img src={logoUrl(partido.visitante_logo)} alt="" style={{ width:48, height:48, objectFit:"contain", filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }} />}
                        <span style={{ fontSize:13, fontWeight:700, color:"#f1f5f9", textAlign:"center", lineHeight:1.3 }}>{partido.visitante_nombre}</span>
                      </div>
                    </div>

                    {partido.fecha && (
                      <div style={{ display:"flex", justifyContent:"center", marginTop:12, fontSize:12, color:"#475569" }}>
                        📅 {new Date(partido.fecha).toLocaleDateString("es-SV", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
                      </div>
                    )}
                  </div>

                  {/* Timeline de comentarios */}
                  <div className="table-container" style={{ padding:0, overflow:"hidden" }}>
                    <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <MessageSquare size={16} style={{ color:"var(--accent-red)" }} />
                        <span style={{ fontWeight:700, fontSize:15, color:"var(--text-main)" }}>Narración del Partido</span>
                        <span style={{ fontSize:12, background:"rgba(239,68,68,0.15)", color:"var(--accent-red)", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{comentarios.length}</span>
                      </div>
                    </div>

                    <div style={{ padding:20 }}>
                      {comentarios.length === 0 ? (
                        <div style={{ textAlign:"center", padding:"40px 20px" }}>
                          <div style={{ fontSize:32, marginBottom:12, opacity:0.2 }}>📝</div>
                          <p style={{ color:"var(--text-muted)", fontSize:14, fontWeight:600, margin:0 }}>Sin eventos registrados</p>
                          <p style={{ color:"#334155", fontSize:12, margin:"6px 0 0" }}>Añade el primer evento desde el formulario de la izquierda</p>
                        </div>
                      ) : (
                        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                          {comentarios.map(c => {
                            const tipoOpt = TIPO_OPTS.find(t => t.value === c.tipo) || TIPO_OPTS[0];
                            const isGoal  = c.tipo === "gol";
                            return (
                              <div key={c.id} style={{ display:"flex", gap:12, padding:"12px 16px", borderRadius:12, background: isGoal?`${tipoOpt.color}12`:"rgba(255,255,255,0.02)", border:`1px solid ${isGoal?`${tipoOpt.color}30`:"rgba(255,255,255,0.05)"}`, transition:"all 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background=isGoal?`${tipoOpt.color}18`:"rgba(255,255,255,0.04)"}
                                onMouseLeave={e => e.currentTarget.style.background=isGoal?`${tipoOpt.color}12`:"rgba(255,255,255,0.02)"}>

                                {/* Minuto + icono */}
                                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0, minWidth:44 }}>
                                  <div style={{ width:36, height:36, borderRadius:"50%", background:`${tipoOpt.color}20`, border:`2px solid ${isGoal?tipoOpt.color:"rgba(255,255,255,0.08)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow: isGoal?`0 0 16px ${tipoOpt.color}44`:"none" }}>
                                    {tipoOpt.icon}
                                  </div>
                                  <span style={{ fontSize:10, fontWeight:800, color:tipoOpt.color, letterSpacing:0.5 }}>{c.minuto}'</span>
                                </div>

                                {/* Contenido */}
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, flexWrap:"wrap" }}>
                                    <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, color:tipoOpt.color, background:`${tipoOpt.color}18`, padding:"2px 8px", borderRadius:4 }}>{tipoOpt.label}</span>
                                    {c.equipo && <span style={{ fontSize:11, color:"#64748b" }}>· {c.equipo}</span>}
                                  </div>
                                  <p style={{ fontSize:13, color: isGoal?"#f1f5f9":"#94a3b8", margin:0, lineHeight:1.5, fontWeight: isGoal?600:400 }}>{c.descripcion}</p>
                                </div>

                                {/* Eliminar */}
                                <button onClick={() => handleDelete(c.id)} title="Eliminar"
                                  style={{ flexShrink:0, width:30, height:30, borderRadius:8, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.06)", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
                                  onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.2)"; }}
                                  onMouseLeave={e => { e.currentTarget.style.background="rgba(239,68,68,0.06)"; }}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        button.nav-item { background:none; border:none; color:var(--text-muted); font-family:inherit; }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @media (max-width: 1000px) {
          .content-wrapper > div[style*="grid-template-columns:340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}