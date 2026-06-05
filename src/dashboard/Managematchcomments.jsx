import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import { apiPost } from "../apiHelper";
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  Target, Trophy, ChevronDown, Plus, Trash2, MessageSquare, RefreshCw,
  Play, Square, Clock, MessageCircle, ArrowDown
} from "lucide-react";
import { API_BASE } from "../config";

const API = API_BASE;

const TIPOS = [
  { value:"comentario",        label:"Comentario",           icon:"💬", color:"#94a3b8", stat:null },
  { value:"gol",               label:"Gol",                  icon:"⚽", color:"#10b981", stat:"gol" },
  { value:"gol_penal",         label:"Gol de Penal",         icon:"🎯", color:"#10b981", stat:"gol", subtipo:"penal" },
  { value:"gol_cabeza",        label:"Gol de Cabeza",        icon:"🤕", color:"#10b981", stat:"gol", subtipo:"cabeza" },
  { value:"gol_tiro_libre",    label:"Gol de Tiro Libre",    icon:"🌀", color:"#10b981", stat:"gol", subtipo:"libre" },
  { value:"asistencia",        label:"Asistencia",           icon:"👟", color:"#3b82f6", stat:"asistencia" },
  { value:"tarjeta_amarilla",  label:"Tarjeta Amarilla",     icon:"🟨", color:"#f59e0b", stat:"tarjeta_amarilla" },
  { value:"tarjeta_roja",      label:"Tarjeta Roja",         icon:"🟥", color:"#ef4444", stat:"tarjeta_roja" },
  { value:"cambio",            label:"Cambio",               icon:"🔄", color:"#6366f1", stat:null },
  { value:"inicio",            label:"Inicio",               icon:"▶️", color:"#22c55e", stat:null },
  { value:"descanso",          label:"Descanso",             icon:"☕", color:"#f97316", stat:null },
  { value:"fin",               label:"Fin del partido",      icon:"🏁", color:"#64748b", stat:null },
];

const logoUrl = p => { if(!p) return null; if(p.startsWith("http")) return p; return API+p; };
const T = (v) => TIPOS.find(t=>t.value===v) || TIPOS[0];

const SIDEBAR_ITEMS = [
  { path:"/dashboard",       icon:<LayoutDashboard size={20}/>, label:"Dashboard" },
  { path:"/matches",         icon:<CalendarDays size={20}/>,    label:"Gestionar Partidos" },
  { path:"/mynews",          icon:<CalendarDays size={20}/>,    label:"Crear Noticias" },
  { type:"dropdown", icon:<Shield size={20}/>, label:"Equipos", children:[
    { path:"/teams/primera", label:"Primera División" },
    { path:"/teams/segunda", label:"Segunda División" },
    { path:"/teams/tercera", label:"Tercera División" },
  ]},
  { path:"/admin/plantilla",  icon:<Target size={20}/>,         label:"Plantillas" },
  { path:"/posiciones",       icon:<Trophy size={20}/>,         label:"Posiciones" },
  { path:"/admin/copa",       icon:<Trophy size={20}/>,         label:"Copa Presidente" },
  { path:"/manage-news",      icon:<Newspaper size={20}/>,      label:"Noticias Públicas" },
  { path:"/manage-comments",  icon:<MessageCircle size={20}/>,  label:"Gestionar Comentarios" },
  { path:"/users",            icon:<Users size={20}/>,          label:"Usuarios" },
  { path:"/settings",         icon:<Settings size={20}/>,       label:"Configuración" },
];

const darkInputStyle = {
  width:"100%", 
  padding:"10px 14px", 
  borderRadius:8, 
  border:"1px solid rgba(255,255,255,0.1)", 
  background:"#0f172a", 
  color:"#f1f5f9", 
  fontSize:13, 
  fontFamily:"inherit",
  outline:"none",
  transition:"border-color 0.2s, box-shadow 0.2s",
};

const darkOptionStyle = {
  background:"#1e293b", 
  color:"#f1f5f9", 
  padding:"10px"
};

export default function ManageMatchComments() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamsOpen, setTeamsOpen]     = useState(false);
  const location = useLocation();

  const [selectedDiv,     setSelectedDiv]     = useState("primera");
  const [selectedPartido, setSelectedPartido] = useState("");
  const [matches,         setMatches]         = useState([]);
  const [loadingMatches,  setLoadingMatches]  = useState(true);

  const [partido,             setPartido]             = useState(null);
  const [jugadoresLocal,      setJugadoresLocal]      = useState([]);
  const [jugadoresVisitante,  setJugadoresVisitante]  = useState([]);
  const [comentarios,         setComentarios]         = useState([]);
  const [loading,             setLoading]             = useState(false);

  const [tipo,        setTipo]        = useState("comentario");
  const [minuto,      setMinuto]      = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [equipoSel,   setEquipoSel]   = useState("local");
  const [jugadorSel,  setJugadorSel]  = useState("");
  const [jugadorSel2, setJugadorSel2] = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  const [cronActivo,  setCronActivo]  = useState(false);
  const [cronSegundos,setCronSegundos]= useState(0);
  const [semitiem,    setSemitiem]    = useState(1); 
  const cronRef = useRef(null);

  // ── Funciones para persistir el cronómetro en localStorage ──
  const getTimerData = () => {
    if (!selectedPartido) return null;
    const data = localStorage.getItem(`matchTimer_${selectedPartido}`);
    return data ? JSON.parse(data) : null;
  };
  const saveTimerData = (data) => {
    if (!selectedPartido) return;
    localStorage.setItem(`matchTimer_${selectedPartido}`, JSON.stringify(data));
  };
  const clearTimerData = () => {
    if (!selectedPartido) return;
    localStorage.removeItem(`matchTimer_${selectedPartido}`);
  };

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

  useEffect(() => { fetchMatches(); }, [selectedDiv]);
  
  useEffect(() => { 
    if (selectedPartido) {
      fetchDetail(); 
      const timerData = getTimerData();
      if (timerData) {
        setSemitiem(timerData.half || 1);
        setCronActivo(timerData.status === 'playing');
      } else {
        setSemitiem(1);
        setCronActivo(false);
        setCronSegundos(0);
      }
    } else { 
      setPartido(null); 
      setComentarios([]); 
    }
  }, [selectedPartido]);

  // Cronómetro ticker: Calcula el tiempo basado en el reloj real
  useEffect(() => {
    const calculateSeconds = () => {
      const timerData = getTimerData();
      if (timerData && timerData.status === 'playing' && timerData.startTime) {
        const elapsed = Math.floor((Date.now() - timerData.startTime) / 1000);
        return timerData.baseSeconds + elapsed;
      }
      return timerData ? timerData.baseSeconds : 0;
    };

    setCronSegundos(calculateSeconds());

    if (cronActivo) {
      cronRef.current = setInterval(() => {
        setCronSegundos(calculateSeconds());
      }, 1000);
    } else {
      clearInterval(cronRef.current);
    }
    return () => clearInterval(cronRef.current);
  }, [cronActivo, selectedPartido]);

  const minutoActual = Math.floor(cronSegundos / 60) + (semitiem === 2 ? 45 : 0);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const suf = selectedDiv==="segunda"?"_segunda":selectedDiv==="tercera"?"_tercera":"";
      const res  = await fetch(`${API}get_matches${suf}.php`);
      const data = await res.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (_) { setMatches([]); }
    setLoadingMatches(false);
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}get_match_detail.php?id=${selectedPartido}&division=${selectedDiv}`);
      const data = await res.json();
      if (data.partido) {
        setPartido(data.partido);
        setJugadoresLocal(data.jugadores_local || []);
        setJugadoresVisitante(data.jugadores_visitante || []);
        setComentarios((data.comentarios || []).slice().reverse());
        setEquipoSel("local");
        setJugadorSel("");
      }
    } catch (_) {}
    setLoading(false);
  };

  const jugadoresActuales = equipoSel === "local" ? jugadoresLocal : jugadoresVisitante;
  const nombreEquipoSel   = equipoSel === "local" ? partido?.local_nombre : partido?.visitante_nombre;

  const genDescripcion = (t, jugNombre, jug2Nombre) => {
    const min = minuto || minutoActual;
    switch(t) {
      case "gol":            return `⚽ ¡GOOOOOL! ${jugNombre||"Jugador"} marca para ${nombreEquipoSel} en el minuto ${min}.`;
      case "gol_penal":      return `🎯 ¡Gol de PENAL! ${jugNombre||"Jugador"} convierte desde el punto de penalti. Minuto ${min}.`;
      case "gol_cabeza":     return `🤕 ¡Gol de CABEZA! ${jugNombre||"Jugador"} conecta de manera impresionante. Minuto ${min}.`;
      case "gol_tiro_libre": return `🌀 ¡Gol de TIRO LIBRE directo! ${jugNombre||"Jugador"} bate al portero. Minuto ${min}.`;
      case "asistencia":     return `👟 Asistencia de ${jugNombre||"Jugador"} para el gol de ${nombreEquipoSel}.`;
      case "tarjeta_amarilla":return `🟨 Tarjeta amarilla para ${jugNombre||"Jugador"} de ${nombreEquipoSel}. Minuto ${min}.`;
      case "tarjeta_roja":   return `🟥 ¡Tarjeta ROJA! ${jugNombre||"Jugador"} queda expulsado. Minuto ${min}.`;
      case "cambio":         return `🔄 Cambio en ${nombreEquipoSel}: Sale ${jug2Nombre||"Jugador"}, entra ${jugNombre||"Jugador"}. Minuto ${min}.`;
      case "inicio":         return semitiem===1 ? "▶️ ¡Arranca el partido! Primera parte en juego." : "▶️ ¡Empieza la segunda parte!";
      case "descanso":       return `☕ Pitido final de la primera mitad. Descanso con el marcador ${partido?.goles_local??0}-${partido?.goles_visitante??0}.`;
      case "fin":            return `🏁 ¡Pitido final! Resultado definitivo: ${partido?.local_nombre} ${partido?.goles_local??0} - ${partido?.goles_visitante??0} ${partido?.visitante_nombre}.`;
      default:               return "";
    }
  };

  useEffect(() => {
    if (tipo === "comentario") return;
    const jug  = jugadoresActuales.find(j=>String(j.id)===String(jugadorSel));
    const jug2 = jugadoresActuales.find(j=>String(j.id)===String(jugadorSel2));
    setDescripcion(genDescripcion(tipo, jug?.nombre, jug2?.nombre));
  }, [tipo, jugadorSel, jugadorSel2, equipoSel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPartido) { Swal.fire({icon:"warning",title:"Selecciona un partido",toast:true,position:"top-end",showConfirmButton:false,timer:2000}); return; }
    if (!descripcion.trim()) { Swal.fire({icon:"warning",title:"Escribe la descripción",toast:true,position:"top-end",showConfirmButton:false,timer:2000}); return; }

    const tipoOpt = T(tipo);
    const minNum  = parseInt(minuto) || minutoActual;
    const equipo  = nombreEquipoSel || "";

    setSubmitting(true);
    try {
      const res  = await apiPost(`${API}create_match_comment.php`, {
        partido_id:  parseInt(selectedPartido),
        division:    selectedDiv,
        minuto:      minNum,
        tipo:        tipo,
        descripcion: descripcion.trim(),
        equipo,
        jugador_id:  parseInt(jugadorSel) || null
      });
      const data = await res.json();

      if (data.success) {
        const esGol = ["gol","gol_penal","gol_cabeza","gol_tiro_libre"].includes(tipo);
        if (esGol) {
          const scoreRes = await apiPost(`${API}update_match_score_live.php`, { partido_id: parseInt(selectedPartido), division: selectedDiv, equipo: equipoSel, delta: 1 });
          const scoreData = await scoreRes.json();
          if (scoreData.success && partido) {
            setPartido(prev => ({ ...prev, goles_local: scoreData.goles_local, goles_visitante: scoreData.goles_visitante }));
          }
        }

        if (tipoOpt.stat && jugadorSel) {
          await apiPost(`${API}update_stat_from_comment.php`, { jugador_id: parseInt(jugadorSel), division: selectedDiv, tipo: tipoOpt.stat, subtipo: tipoOpt.subtipo || "", deshacer: false });
        }

        if (["inicio","descanso","fin"].includes(tipo)) {
          const nuevoEstado = tipo==="fin"?"Finalizado":"En Curso";
          await apiPost(`${API}update_match_status_live.php`, { id:parseInt(selectedPartido), division:selectedDiv, estado:nuevoEstado });
          if (tipo==="fin") { 
            clearTimerData(); 
            setCronActivo(false); 
          }
        }

        Swal.fire({icon:"success",title:"Evento añadido",toast:true,position:"top-end",showConfirmButton:false,timer:1400});
        setDescripcion(""); setMinuto(""); setJugadorSel(""); setJugadorSel2(""); setTipo("comentario");
        fetchDetail();
      } else { Swal.fire("Error", data.error||"No se pudo guardar","error"); }
    } catch (_) { Swal.fire("Error","Error de conexión","error"); }
    setSubmitting(false);
  };

  const handleDelete = async (c) => {
    const r = await Swal.fire({title:"¿Eliminar evento?",text:"Se revertirán las estadísticas si aplica.",icon:"warning",showCancelButton:true,confirmButtonText:"Eliminar",confirmButtonColor:"#d33",cancelButtonText:"Cancelar"});
    if (!r.isConfirmed) return;
    try {
      const res  = await apiPost(`${API}delete_match_comment.php`, {id:c.id});
      const data = await res.json();
      if (data.success) {
        const tipoOpt = T(c.tipo);
        const esGol = ["gol","gol_penal","gol_cabeza","gol_tiro_libre"].includes(c.tipo);
        if (esGol) {
          const eq = c.equipo === partido?.visitante_nombre ? "visitante" : "local";
          const scoreRes = await apiPost(`${API}update_match_score_live.php`, { partido_id:parseInt(selectedPartido), division:selectedDiv, equipo:eq, delta:-1 });
          const scoreData = await scoreRes.json();
          if (scoreData.success && partido) {
            setPartido(prev => ({ ...prev, goles_local:scoreData.goles_local, goles_visitante:scoreData.goles_visitante }));
          }
        }
        if (tipoOpt.stat && c.jugador_id) {
          await apiPost(`${API}update_stat_from_comment.php`, { jugador_id:c.jugador_id, division:selectedDiv, tipo:tipoOpt.stat, subtipo:tipoOpt.subtipo||"", deshacer:true });
        }
        setComentarios(prev=>prev.filter(x=>x.id!==c.id));
        Swal.fire({icon:"success",title:"Eliminado",toast:true,position:"top-end",showConfirmButton:false,timer:1500});
      }
    } catch (_) {}
  };

  // ── Funciones del Cronómetro ──
  const iniciarPartido = async () => {
    if (!selectedPartido) return;
    await apiPost(`${API}update_match_status_live.php`, { id:parseInt(selectedPartido), division:selectedDiv, estado:"En Curso" });
    
    saveTimerData({ status: 'playing', half: 1, baseSeconds: 0, startTime: Date.now() });
    setCronActivo(true); 
    setCronSegundos(0);
    setSemitiem(1);

    await apiPost(`${API}create_match_comment.php`, { partido_id:parseInt(selectedPartido), division:selectedDiv, minuto:0, tipo:"inicio", descripcion:"▶️ ¡Arranca el partido! Primera parte en juego.", equipo:"" });
    fetchDetail();
  };

  const handleDescanso = async () => {
    const minDescanso = minutoActual;
    
    saveTimerData({ status: 'paused', half: 2, baseSeconds: 0, startTime: null });
    setCronActivo(false);
    setSemitiem(2);
    setCronSegundos(0);

    await apiPost(`${API}create_match_comment.php`, { partido_id:parseInt(selectedPartido), division:selectedDiv, minuto:minDescanso, tipo:"descanso", descripcion:`☕ Pitido final de la primera mitad. Descanso con el marcador ${partido?.goles_local??0}-${partido?.goles_visitante??0}.`, equipo:"" });
    fetchDetail();
  };

  const iniciarSegundoTiempo = async () => {
    saveTimerData({ status: 'playing', half: 2, baseSeconds: 0, startTime: Date.now() });
    setCronActivo(true); 
    setCronSegundos(0);

    await apiPost(`${API}create_match_comment.php`, { partido_id:parseInt(selectedPartido), division:selectedDiv, minuto:45, tipo:"inicio", descripcion:"▶️ ¡Empieza la segunda parte!", equipo:"" });
    fetchDetail();
  };

  const detenerCron = () => { 
    const timerData = getTimerData();
    if (timerData) {
      const currentSeconds = timerData.baseSeconds + Math.floor((Date.now() - timerData.startTime) / 1000);
      saveTimerData({ ...timerData, status: 'paused', baseSeconds: currentSeconds, startTime: null });
    }
    setCronActivo(false); 
  };

  const reanudarCron = () => { 
    const timerData = getTimerData();
    if (timerData) {
      saveTimerData({ ...timerData, status: 'playing', startTime: Date.now() });
    }
    setCronActivo(true); 
  };

  const fmtCron = (s) => {
    const m = Math.floor(s/60);
    const ss = s%60;
    return `${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
  };

  const handleLogout = () => {
    Swal.fire({title:"¿Cerrar sesión?",icon:"warning",showCancelButton:true,confirmButtonText:"Sí, salir",confirmButtonColor:"#d33"})
      .then(r=>{if(r.isConfirmed){localStorage.removeItem("user"); localStorage.removeItem("token");window.location.href="/login";}});
  };

  const getMatchName = m => {
    const l = m.home_name||m.local_nombre||`Equipo ${m.equipo_local||m.local_id||"?"}`;
    const v = m.away_name||m.visitante_nombre||`Equipo ${m.equipo_visitante||m.visitante_id||"?"}`;
    return `${l} vs ${v}`;
  };
  const getMatchStatus = m => m.estado||m.status||"Pendiente";

  return (
    <div className={`admin-layout ${!sidebarOpen?"sidebar-closed":""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon"><img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo"/></div>
          <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
        </div>
        <nav className="sidebar-nav"><ul>
          {SIDEBAR_ITEMS.map((item,idx)=>{
            if(item.type==="dropdown") return (
              <li key={idx}>
                <button className="nav-item" onClick={()=>setTeamsOpen(!teamsOpen)} style={{width:"100%",justifyContent:"space-between"}}>
                  <span style={{display:"flex",alignItems:"center",gap:14}}>{item.icon} {item.label}</span>
                  <ChevronDown size={16} style={{transition:"transform .25s",transform:teamsOpen?"rotate(180deg)":"rotate(0deg)",opacity:.4}}/>
                </button>
                <ul style={{maxHeight:teamsOpen?"200px":"0",opacity:teamsOpen?"1":"0",overflow:"hidden",transition:"max-height .3s,opacity .2s",listStyle:"none",padding:teamsOpen?"2px 0 4px":"0",margin:0}}>
                  {item.children.map(c=>(<li key={c.path}><Link to={c.path} className={`nav-item${location.pathname===c.path?" active":""}`} style={{paddingLeft:48,fontSize:"13.5px"}}>{c.label}</Link></li>))}
                </ul>
              </li>
            );
            return (<li key={item.path}><Link to={item.path} className={`nav-item${location.pathname===item.path?" active":""}`}>{item.icon} {item.label}</Link></li>);
          })}
        </ul></nav>
        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}><LogOut size={20}/> Cerrar sesión</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu size={24}/></button>
          <div className="search-bar"><input type="text" placeholder="Narración en vivo de partidos..." readOnly/></div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">📡 Narración de Partidos</h1>
          <p style={{color:"var(--text-muted)",marginBottom:24,fontSize:14}}>Gestiona comentarios, eventos y estadísticas en tiempo real.</p>

          <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:20,alignItems:"start"}}>

            <div style={{display:"flex",flexDirection:"column",gap:14}}>

              <div className="table-container" style={{padding:18}}>
                <p style={{margin:"0 0 10px",fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>División</p>
                <div style={{display:"flex",gap:8}}>
                  {["primera","segunda","tercera"].map(d=>(
                    <button key={d} onClick={()=>{setSelectedDiv(d);setSelectedPartido("");setPartido(null);setComentarios([]);setCronActivo(false);setCronSegundos(0);setSemitiem(1);}}
                      style={{flex:1,padding:"8px 4px",border:`1px solid ${selectedDiv===d?"var(--accent-red)":"var(--border)"}`,borderRadius:8,background:selectedDiv===d?"rgba(239,68,68,0.15)":"transparent",color:selectedDiv===d?"var(--accent-red)":"var(--text-muted)",fontWeight:700,fontSize:12,cursor:"pointer",textTransform:"capitalize",transition:"all .2s",fontFamily:"inherit"}}>
                      {d.charAt(0).toUpperCase()+d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="table-container" style={{padding:18}}>
                <p style={{margin:"0 0 10px",fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>Partido</p>
                {loadingMatches ? <p style={{color:"#475569",fontSize:13}}>Cargando...</p> :
                matches.length===0 ? <p style={{color:"#475569",fontSize:13}}>Sin partidos</p> :
                <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:240,overflowY:"auto"}}>
                  {matches.map(m=>{
                    const mid=m.id; const name=getMatchName(m); const st=getMatchStatus(m);
                    const isSel=String(selectedPartido)===String(mid);
                    const isLive=st.toLowerCase().includes("curso")||st.toLowerCase().includes("vivo");
                    const isDone=st.toLowerCase()==="finalizado";
                    return (
                      <button key={mid} onClick={()=>setSelectedPartido(String(mid))}
                        style={{display:"flex",flexDirection:"column",gap:4,padding:"10px 12px",border:`1px solid ${isSel?"var(--accent-red)":"var(--border)"}`,borderRadius:10,background:isSel?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.02)",cursor:"pointer",textAlign:"left",transition:"all .2s",fontFamily:"inherit"}}
                        onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background="rgba(255,255,255,0.04)";}}
                        onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="rgba(255,255,255,0.02)";}}>
                        <span style={{fontSize:12,fontWeight:600,color:isSel?"var(--accent-red)":"var(--text-main)",lineHeight:1.3}}>{name}</span>
                        <span style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:isLive?"#22c55e":isDone?"#64748b":"#f97316"}}>
                          {isLive?"🔴 EN VIVO":isDone?"⚫ FINALIZADO":"🟡 PENDIENTE"}
                        </span>
                      </button>
                    );
                  })}
                </div>}
              </div>

            
              {partido && (
                <div className="table-container" style={{padding:18}}>
                  <p style={{margin:"0 0 12px",fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>⏱ Cronómetro</p>
                  <div style={{textAlign:"center",marginBottom:12}}>
                    <div style={{fontSize:36,fontWeight:900,fontFamily:"Montserrat,monospace",color:cronActivo?"#22c55e":"#64748b",letterSpacing:2}}>
                      {fmtCron(cronSegundos)}
                    </div>
                    <div style={{fontSize:13,color:"#64748b",fontWeight:600}}>
                      Minuto actual: <strong style={{color:"#f1f5f9"}}>{minutoActual}'</strong> | {semitiem===1?"1er Tiempo":"2do Tiempo"}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                    {!cronActivo && cronSegundos === 0 && semitiem === 1 && (
                      <button onClick={iniciarPartido} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"white",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        <Play size={16}/> Iniciar 1er Tiempo
                      </button>
                    )}
                    {cronActivo && semitiem === 1 && (
                      <button onClick={detenerCron} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:9,border:"1px solid rgba(239,68,68,0.3)",background:"rgba(239,68,68,0.1)",color:"#ef4444",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        <Square size={14}/> Pausar
                      </button>
                    )}
                    {!cronActivo && cronSegundos > 0 && semitiem === 1 && (
                      <button onClick={reanudarCron} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:9,border:"1px solid rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.1)",color:"#22c55e",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        <Play size={14}/> Reanudar
                      </button>
                    )}
                    {semitiem === 1 && cronActivo && minutoActual >= 40 && (
                      <button onClick={handleDescanso} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:9,border:"1px solid rgba(249,115,22,0.3)",background:"rgba(249,115,22,0.1)",color:"#f97316",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        ☕ Descanso
                      </button>
                    )}
                    {!cronActivo && semitiem === 2 && cronSegundos === 0 && (
                      <button onClick={iniciarSegundoTiempo} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"white",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        <Play size={16}/> Iniciar 2do Tiempo
                      </button>
                    )}
                    {cronActivo && semitiem === 2 && (
                      <button onClick={detenerCron} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:9,border:"1px solid rgba(239,68,68,0.3)",background:"rgba(239,68,68,0.1)",color:"#ef4444",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        <Square size={14}/> Pausar
                      </button>
                    )}
                    {!cronActivo && cronSegundos > 0 && semitiem === 2 && (
                       <button onClick={reanudarCron} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:9,border:"1px solid rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.1)",color:"#22c55e",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        <Play size={14}/> Reanudar 2do T.
                      </button>
                    )}
                  </div>
                </div>
              )}

              {partido && (
                <div className="table-container" style={{padding:18}}>
                  <p style={{margin:"0 0 14px",fontSize:12,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>Añadir Evento</p>
                  <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:12}}>

                    <div>
                      <label style={{display:"block",marginBottom:6,fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Tipo</label>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                        {TIPOS.map(t=>(
                          <button key={t.value} type="button" onClick={()=>setTipo(t.value)}
                            style={{display:"flex",alignItems:"center",gap:5,padding:"7px 8px",border:`1px solid ${tipo===t.value?t.color:"var(--border)"}`,borderRadius:7,background:tipo===t.value?`${t.color}22`:"transparent",color:tipo===t.value?t.color:"var(--text-muted)",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .15s",fontFamily:"inherit",textAlign:"left"}}>
                            <span style={{fontSize:13}}>{t.icon}</span>{t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{display:"block",marginBottom:6,fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Equipo</label>
                      <div style={{display:"flex",gap:8}}>
                        {[{key:"local",label:partido.local_nombre},{key:"visitante",label:partido.visitante_nombre}].map(eq=>(
                          <button key={eq.key} type="button" onClick={()=>{setEquipoSel(eq.key);setJugadorSel("");setJugadorSel2("");}}
                            style={{flex:1,padding:"7px 6px",border:`1px solid ${equipoSel===eq.key?"var(--accent-red)":"var(--border)"}`,borderRadius:8,background:equipoSel===eq.key?"rgba(239,68,68,0.12)":"transparent",color:equipoSel===eq.key?"var(--accent-red)":"var(--text-muted)",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .15s",fontFamily:"inherit",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {eq.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {["gol","gol_penal","gol_cabeza","gol_tiro_libre","asistencia","tarjeta_amarilla","tarjeta_roja","cambio"].includes(tipo) && (
                      <div>
                        <label style={{display:"block",marginBottom:6,fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>
                          {tipo==="cambio"?"Entra":"Jugador"}
                        </label>
                        <select value={jugadorSel} onChange={e=>setJugadorSel(e.target.value)} style={darkInputStyle}>
                          <option value="" style={darkOptionStyle}>— Seleccionar jugador —</option>
                          {jugadoresActuales.map(j=>(<option key={j.id} value={j.id} style={darkOptionStyle}>#{j.numero_camiseta || "?"} {j.nombre}</option>))}
                        </select>
                      </div>
                    )}

                    {tipo==="cambio" && (
                      <div>
                        <label style={{display:"block",marginBottom:6,fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Sale</label>
                        <select value={jugadorSel2} onChange={e=>setJugadorSel2(e.target.value)} style={darkInputStyle}>
                          <option value="" style={darkOptionStyle}>— Seleccionar jugador —</option>
                          {jugadoresActuales.map(j=>(<option key={j.id} value={j.id} style={darkOptionStyle}>#{j.numero_camiseta || "?"} {j.nombre}</option>))}
                        </select>
                      </div>
                    )}

                    <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                      <div style={{flex:1}}>
                        <label style={{display:"block",marginBottom:6,fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Minuto (opcional)</label>
                        <input type="number" min="0" max="120" value={minuto} onChange={e=>setMinuto(e.target.value)} placeholder={`${minutoActual}' (auto)`}
                          style={darkInputStyle}/>
                      </div>
                      {cronActivo && <button type="button" onClick={()=>setMinuto(String(minutoActual))} style={{padding:"10px 12px",borderRadius:8,border:"1px solid rgba(34,197,94,0.3)",background:"rgba(34,197,94,0.1)",color:"#22c55e",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap",height:"100%"}}>
                        Usar {minutoActual}'
                      </button>}
                    </div>

                    <div>
                      <label style={{display:"block",marginBottom:6,fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Descripción</label>
                      <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} rows={3}
                        placeholder="Describe el evento..."
                        style={{...darkInputStyle, resize:"vertical", height:"auto"}}/>
                    </div>

                    <button type="submit" className="btn-add" disabled={submitting} style={{justifyContent:"center"}}>
                      {submitting?"Guardando...":<><Plus size={16}/> Añadir Evento</>}
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div>
              {!selectedPartido ? (
                <div style={{background:"rgba(30,41,59,0.5)",border:"1px solid var(--border)",borderRadius:16,padding:"48px 24px",textAlign:"center"}}>
                  <div style={{fontSize:36,marginBottom:12,opacity:.3}}>📡</div>
                  <h3 style={{color:"var(--text-muted)",fontWeight:600,marginBottom:8}}>Selecciona un partido</h3>
                  <p style={{color:"#334155",fontSize:13}}>Elige una división y un partido del panel izquierdo</p>
                </div>
              ) : loading ? (
                <div style={{background:"rgba(30,41,59,0.5)",border:"1px solid var(--border)",borderRadius:16,padding:"48px 24px",textAlign:"center"}}>
                  <div style={{fontSize:28,animation:"spin 1s linear infinite",display:"inline-block",marginBottom:12}}>⚽</div>
                  <p style={{color:"var(--text-muted)",fontSize:14}}>Cargando...</p>
                </div>
              ) : partido ? (
                <>
                  <div style={{background:"linear-gradient(160deg,rgba(15,26,46,.95),rgba(10,15,29,.98))",border:"1px solid rgba(255,255,255,.07)",borderRadius:16,padding:"20px 24px",marginBottom:16,position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,rgba(255,31,31,.6),rgba(255,31,31,1),rgba(255,31,31,.6),transparent)"}}/>

                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                      <span style={{fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",padding:"4px 12px",borderRadius:20,
                        background:(partido.estado||"").toLowerCase().includes("curso")?"rgba(34,197,94,.15)":"rgba(249,115,22,.15)",
                        color:(partido.estado||"").toLowerCase().includes("curso")?"#22c55e":"#f97316",
                        border:`1px solid ${(partido.estado||"").toLowerCase().includes("curso")?"rgba(34,197,94,.3)":"rgba(249,115,22,.3)"}`}}>
                        {(partido.estado||"").toLowerCase().includes("curso") ? "🔴 EN VIVO" : partido.estado||"Pendiente"}
                      </span>
                      <div style={{display:"flex",gap:8}}>
                        {cronActivo && <span style={{display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:800,color:"#22c55e",background:"rgba(34,197,94,.1)",padding:"4px 10px",borderRadius:8}}>
                          <Clock size={12}/> {fmtCron(cronSegundos)} | {minutoActual}'
                        </span>}
                        <button onClick={fetchDetail} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"5px 10px",color:"#64748b",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
                          <RefreshCw size={12}/> Actualizar
                        </button>
                      </div>
                    </div>

                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
                      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                        {logoUrl(partido.local_logo) && <img src={logoUrl(partido.local_logo)} alt="" style={{width:48,height:48,objectFit:"contain"}}/>}
                        <span style={{fontSize:13,fontWeight:700,color:"#f1f5f9",textAlign:"center"}}>{partido.local_nombre}</span>
                      </div>
                      <div style={{textAlign:"center",flexShrink:0}}>
                        <div style={{background:"rgba(0,0,0,.3)",borderRadius:12,padding:"8px 16px",border:"1px solid rgba(255,255,255,.06)"}}>
                          <span style={{ fontSize:28,fontWeight:900,color:"#f1f5f9",fontFamily:"Montserrat,sans-serif",letterSpacing:4}}>
                            {partido.goles_local??0} – {partido.goles_visitante??0}
                          </span>
                        </div>
                      </div>
                      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                        {logoUrl(partido.visitante_logo) && <img src={logoUrl(partido.visitante_logo)} alt="" style={{width:48,height:48,objectFit:"contain"}}/>}
                        <span style={{ fontSize:13,fontWeight:700,color:"#f1f5f9",textAlign:"center"}}>{partido.visitante_nombre}</span>
                      </div>
                    </div>
                  </div>

                  <div className="table-container" style={{padding:0,overflow:"hidden"}}>
                    <div style={{padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <MessageSquare size={16} style={{color:"var(--accent-red)"}}/>
                        <span style={{fontWeight:700,fontSize:15,color:"var(--text-main)"}}>Narración</span>
                        <span style={{fontSize:12,background:"rgba(239,68,68,.15)",color:"var(--accent-red)",padding:"2px 8px",borderRadius:20,fontWeight:700}}>{comentarios.length}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8,fontSize:11,color:"#475569"}}>
                        <ArrowDown size={12}/> Mayor minuto arriba
                      </div>
                    </div>

                    <div style={{padding:16}}>
                      {comentarios.length===0 ? (
                        <div style={{textAlign:"center",padding:"40px 20px"}}>
                          <div style={{fontSize:32,marginBottom:12,opacity:.2}}>📝</div>
                          <p style={{color:"var(--text-muted)",fontSize:14,fontWeight:600,margin:0}}>Sin eventos aún</p>
                        </div>
                      ) : (
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {comentarios.map(c=>{
                            const cfg=T(c.tipo); const isGoal=["gol","gol_penal","gol_cabeza","gol_tiro_libre"].includes(c.tipo);
                            return (
                              <div key={c.id} style={{display:"flex",gap:10,padding:"10px 14px",borderRadius:12,background:isGoal?`${cfg.color}10`:"rgba(255,255,255,.02)",border:`1px solid ${isGoal?`${cfg.color}28`:"rgba(255,255,255,.05)"}`,transition:"all .2s"}}
                                onMouseEnter={e=>e.currentTarget.style.background=isGoal?`${cfg.color}18`:"rgba(255,255,255,.04)"}
                                onMouseLeave={e=>e.currentTarget.style.background=isGoal?`${cfg.color}10`:"rgba(255,255,255,.02)"}>

                                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0,minWidth:42}}>
                                  <div style={{width:34,height:34,borderRadius:"50%",background:`${cfg.color}20`,border:`2px solid ${isGoal?cfg.color:"rgba(255,255,255,.08)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,boxShadow:isGoal?`0 0 14px ${cfg.color}44`:"none"}}>
                                    {cfg.icon}
                                  </div>
                                  <span style={{fontSize:10,fontWeight:800,color:cfg.color,letterSpacing:.5}}>{c.minuto}'</span>
                                </div>

                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                                    <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,color:cfg.color,background:`${cfg.color}18`,padding:"2px 8px",borderRadius:4}}>{cfg.label}</span>
                                    {c.equipo && <span style={{ fontSize:11,color:"#64748b"}}>· {c.equipo}</span>}
                                  </div>
                                  <p style={{ fontSize:13,color:isGoal?"#f1f5f9":"#94a3b8",margin:0,lineHeight:1.5,fontWeight:isGoal?600:400}}>{c.descripcion}</p>
                                </div>

                                <button onClick={()=>handleDelete(c)} title="Eliminar"
                                  style={{flexShrink:0,width:28,height:28,borderRadius:7,border:"1px solid rgba(239,68,68,.2)",background:"rgba(239,68,68,.06)",color:"#ef4444",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
                                  onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.2)"}
                                  onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,.06)"}>
                                  <Trash2 size={12}/>
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
        @media (max-width:1000px) {
          .content-wrapper > div[style*="grid-template-columns:340px"] { grid-template-columns:1fr!important; }
        }
        @media (max-width: 768px) {
          .content-wrapper > div[style*="flex"] { flex-direction: column; gap: 12px; }
        }
        @media (max-width: 480px) {
          .content-wrapper { padding: 16px 12px !important; }
          .content-wrapper h2 { font-size: 1rem; }
          .content-wrapper h3 { font-size: .85rem; }
        }
        select { appearance: none; -webkit-appearance: none; -moz-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px !important; }
        select:focus { border-color: var(--accent-red) !important; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2); }
        input[type="number"]:focus { border-color: var(--accent-red) !important; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2); }
        textarea:focus { border-color: var(--accent-red) !important; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2); }
      `}</style>
    </div>
  );
}