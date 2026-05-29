import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import { API_BASE } from '../config';
import { getAuthHeaders, apiPost, apiPostForm } from "../apiHelper";

const sanitizeHtml = (html) => {
  if (!html) return '';
  const div = document.createElement('div');
  div.textContent = html;
  let result = div.innerHTML;
  result = result.replace(/&lt;span&gt;/g, '<span>').replace(/&lt;\/span&gt;/g, '</span>');
  return result;
};
import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings,
  LogOut, Menu, Target, Trophy, ChevronDown, Save, Globe, Palette,
  Bell, Lock, Upload, Image as ImageIcon, AlertTriangle, MessageCircle,
  Eye, EyeOff, Facebook, Twitter, Instagram, Mail, Phone, Info, RefreshCw
} from "lucide-react";

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
  { path:"/manage-comments",  icon:<MessageCircle size={20}/>,  label:"Narración Partidos" },
  { path:"/users",            icon:<Users size={20}/>,          label:"Usuarios" },
  { path:"/settings",         icon:<Settings size={20}/>,       label:"Configuración" },
];

const Toggle = ({ value, onChange, color = "#22c55e" }) => (
  <div onClick={onChange} style={{ cursor:"pointer", position:"relative", width:48, height:26, background: value ? color : "#374151", borderRadius:13, transition:"background 0.3s", flexShrink:0 }}>
    <div style={{ position:"absolute", top:3, left: value ? 25 : 3, width:20, height:20, background:"white", borderRadius:"50%", transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }} />
  </div>
);

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamsOpen, setTeamsOpen]     = useState(false);
  const [activeTab, setActiveTab]     = useState("site");
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [bannerFile, setBannerFile]   = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew]         = useState(false);
  const bannerRef = useRef();
  const location  = useLocation();

  const [s, setS] = useState({
    site_name: "Números y Fútbol",
    site_description: "La mejor plataforma de estadísticas de fútbol.",
    hero_title: "Noticias y numeros que <span>genera el fútbol</span>",
    hero_description: "Cobertura completa de todas las divisiones.",
    hero_banner_url: "",
    hero_btn1_label: "Últimas Noticias",
    hero_btn1_link: "#noticias",
    hero_btn2_label: "Ver Resultados",
    hero_btn2_link: "#divisiones",
    maintenance_mode: "0",
    maintenance_msg: "Estamos trabajando para mejorar tu experiencia. Vuelve pronto.",
    site_logo_url: "",
    contact_email: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
  });

  const [pwd, setPwd] = useState({ current:"", new:"", confirm:"" });

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}get_site_settings.php`);
      const data = await res.json();
      if (data.success && data.settings) {
        setS(prev => ({ ...prev, ...data.settings }));
      }
    } catch (_) {}
    setLoading(false);
  };

  const upd = (k, v) => setS(prev => ({ ...prev, [k]: v }));

  const handleBannerFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBannerFile(f);
    const reader = new FileReader();
    reader.onload = ev => setBannerPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const uploadBanner = async () => {
    if (!bannerFile) return s.hero_banner_url;
    const fd = new FormData();
    fd.append("file", bannerFile);
    try {
      const res  = await apiPostForm(`${API_BASE}upload_image.php`, fd);
      const data = await res.json();
      if (data.success) return data.url;
    } catch (_) {}
    return s.hero_banner_url;
  };

  const handleSave = async () => {
    setSaving(true);
    Swal.fire({ title:"Guardando...", allowOutsideClick:false, didOpen:()=>Swal.showLoading() });
    try {
      let bannerUrl = s.hero_banner_url;
      if (bannerFile) { bannerUrl = await uploadBanner(); upd("hero_banner_url", bannerUrl); }

      const toSave = { ...s, hero_banner_url: bannerUrl };
      const res  = await fetch(`${API_BASE}save_site_settings.php`, {
        method:"POST",
        headers: getAuthHeaders("application/json"),
        body: JSON.stringify({ settings: toSave })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon:"success", title:"✅ Configuración guardada", text:"Los cambios se aplicarán de inmediato.", timer:2000, showConfirmButton:false });
        setBannerFile(null); setBannerPreview(null);
      } else { Swal.fire("Error", data.error || "No se pudo guardar", "error"); }
    } catch (e) { Swal.fire("Error", "Error de conexión", "error"); }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwd.new !== pwd.confirm) { Swal.fire("Error","Las contraseñas no coinciden","error"); return; }
    if (pwd.new.length < 6)      { Swal.fire("Error","Mínimo 6 caracteres","error"); return; }
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const res  = await apiPost(`${API_BASE}update_user_profile.php`, { id:user.id, action:"change_password", current_password:pwd.current, new_password:pwd.new });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ icon:"success", title:"Contraseña actualizada", timer:2000, showConfirmButton:false });
        setPwd({ current:"", new:"", confirm:"" });
      } else { Swal.fire("Error", data.error || "No se pudo cambiar", "error"); }
    } catch (_) { Swal.fire("Error","Error de conexión","error"); }
  };

  const handleLogout = () => {
    Swal.fire({ title:"¿Cerrar sesión?", icon:"warning", showCancelButton:true, confirmButtonText:"Sí, salir", confirmButtonColor:"#d33" })
      .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); window.location.href="/login"; }});
  };

  const inp = { width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", color:"#f1f5f9", fontSize:14, fontFamily:"inherit", outline:"none" };
  const lbl = { display:"block", fontSize:12, fontWeight:700, color:"#94a3b8", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" };
  const card = { background:"rgba(30,41,59,0.7)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:24, marginBottom:20, backdropFilter:"blur(8px)" };

  const TABS = [
    { key:"site",         label:"Sitio Web",       icon:<Globe size={16}/> },
    { key:"hero",         label:"Portada (Hero)",   icon:<ImageIcon size={16}/> },
    { key:"maintenance",  label:"Mantenimiento",    icon:<AlertTriangle size={16}/> },
    { key:"redes",        label:"Redes Sociales",   icon:<Instagram size={16}/> },
    { key:"security",     label:"Seguridad",        icon:<Lock size={16}/> },
  ];

  return (
    <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon"><img src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a" alt="Logo"/></div>
          <h2 className="sidebar-title">Números y Fútbol <span className="accent-text">Admin</span></h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {SIDEBAR_ITEMS.map((item, idx) => {
              if (item.type === "dropdown") return (
                <li key={idx}>
                  <button className="nav-item" onClick={()=>setTeamsOpen(!teamsOpen)} style={{width:"100%",justifyContent:"space-between"}}>
                    <span style={{display:"flex",alignItems:"center",gap:14}}>{item.icon} {item.label}</span>
                    <ChevronDown size={16} style={{transition:"transform 0.25s",transform:teamsOpen?"rotate(180deg)":"rotate(0deg)",opacity:0.4}}/>
                  </button>
                  <ul style={{maxHeight:teamsOpen?"200px":"0",opacity:teamsOpen?"1":"0",overflow:"hidden",transition:"max-height 0.3s ease,opacity 0.2s ease",listStyle:"none",padding:teamsOpen?"2px 0 4px 0":"0",margin:0}}>
                    {item.children.map(c=>(
                      <li key={c.path}><Link to={c.path} className={`nav-item${location.pathname===c.path?" active":""}`} style={{paddingLeft:48,fontSize:"13.5px"}}>{c.label}</Link></li>
                    ))}
                  </ul>
                </li>
              );
              return (<li key={item.path}><Link to={item.path} className={`nav-item${location.pathname===item.path?" active":""}`}>{item.icon} {item.label}</Link></li>);
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}><LogOut size={20}/> Cerrar sesión</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu size={24}/></button>
          <div className="search-bar"><input type="text" placeholder="Configuración del sitio..." readOnly/></div>
        </header>

        <div className="content-wrapper">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <h1 className="admin-title" style={{margin:0}}>⚙️ Configuración General</h1>
            <div style={{display:"flex",gap:10}}>
              <button onClick={fetchSettings} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#94a3b8",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>
                <RefreshCw size={14}/> Recargar
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-add" style={{padding:"9px 20px"}}>
                <Save size={16}/> {saving ? "Guardando..." : "Guardar Todo"}
              </button>
            </div>
          </div>

          {/* TABS */}
          <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:4,marginBottom:24,flexWrap:"wrap"}}>
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setActiveTab(t.key)}
                style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13,transition:"all 0.25s",
                  background:activeTab===t.key?"linear-gradient(135deg,rgba(255,31,31,0.18),rgba(255,31,31,0.06))":"transparent",
                  color:activeTab===t.key?"#ff1f1f":"#64748b"}}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {loading ? <div style={{textAlign:"center",padding:"3rem",color:"#64748b"}}>⏳ Cargando configuración...</div> : <>

          {/* ── TAB: SITIO WEB ── */}
          {activeTab === "site" && (
            <div style={card}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <Globe size={20} style={{color:"#3b82f6"}}/><h2 style={{margin:0,fontSize:18,fontWeight:800}}>Información del Sitio</h2>
              </div>
              <div style={{display:"grid",gap:18}}>
                <div><label style={lbl}>Nombre del Sitio</label><input value={s.site_name} onChange={e=>upd("site_name",e.target.value)} style={inp}/></div>
                <div><label style={lbl}>Descripción Corta</label><textarea value={s.site_description} onChange={e=>upd("site_description",e.target.value)} rows={3} style={{...inp,resize:"vertical"}}/></div>
                <div>
                  <label style={lbl}>URL del Logo (opcional)</label>
                  <input value={s.site_logo_url} onChange={e=>upd("site_logo_url",e.target.value)} placeholder="https://..." style={inp}/>
                  {s.site_logo_url && <img src={s.site_logo_url} alt="logo" style={{marginTop:8,height:48,objectFit:"contain",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)"}} onError={e=>e.target.style.display="none"}/>}
                </div>
                <div><label style={lbl}>Email de Contacto</label><input value={s.contact_email} onChange={e=>upd("contact_email",e.target.value)} placeholder="contacto@ejemplo.com" style={inp}/></div>
              </div>
            </div>
          )}

          {/* ── TAB: HERO / PORTADA ── */}
          {activeTab === "hero" && (
            <div>
              <div style={card}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <ImageIcon size={20} style={{color:"#f59e0b"}}/><h2 style={{margin:0,fontSize:18,fontWeight:800}}>Banner de Portada</h2>
                </div>
                <div style={{display:"grid",gap:18}}>
                  {/* Banner actual */}
                  <div>
                    <label style={lbl}>Imagen del Banner</label>
                    <div style={{position:"relative",width:"100%",height:180,borderRadius:12,overflow:"hidden",border:"2px dashed rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.02)",cursor:"pointer"}} onClick={()=>bannerRef.current?.click()}>
                      {(bannerPreview || s.hero_banner_url) && (
                        <img src={bannerPreview || s.hero_banner_url} alt="banner" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                      )}
                      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",opacity: bannerPreview||s.hero_banner_url ? 0 : 1,transition:"opacity 0.2s"}}
                        onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=bannerPreview||s.hero_banner_url?0:1}>
                        <Upload size={28} style={{color:"#94a3b8",marginBottom:8}}/>
                        <span style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>Click para cambiar banner</span>
                        <span style={{fontSize:11,color:"#475569",marginTop:4}}>JPG, PNG — recomendado 1920×600px</span>
                      </div>
                    </div>
                    <input ref={bannerRef} type="file" accept="image/*" onChange={handleBannerFile} style={{display:"none"}}/>
                    {bannerFile && <p style={{marginTop:8,fontSize:12,color:"#10b981",fontWeight:500}}>✓ {bannerFile.name} seleccionado (se subirá al guardar)</p>}
                  </div>
                  <div><label style={lbl}>O pega URL del banner</label><input value={s.hero_banner_url} onChange={e=>upd("hero_banner_url",e.target.value)} placeholder="https://..." style={inp}/></div>
                </div>
              </div>

              <div style={card}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <Info size={20} style={{color:"#10b981"}}/><h2 style={{margin:0,fontSize:18,fontWeight:800}}>Textos del Hero</h2>
                </div>
                <div style={{display:"grid",gap:18}}>
                  <div><label style={lbl}>Título Principal <span style={{color:"#475569",fontWeight:400,textTransform:"none"}}>(HTML permitido: {"<span>"}…{"</span>"})</span></label><input value={s.hero_title} onChange={e=>upd("hero_title",e.target.value)} style={inp}/></div>
                  <div><label style={lbl}>Descripción</label><textarea value={s.hero_description} onChange={e=>upd("hero_description",e.target.value)} rows={2} style={{...inp,resize:"vertical"}}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                    <div>
                      <label style={lbl}>Botón 1 — Texto</label><input value={s.hero_btn1_label} onChange={e=>upd("hero_btn1_label",e.target.value)} style={inp}/>
                      <label style={{...lbl,marginTop:10}}>Botón 1 — Enlace</label><input value={s.hero_btn1_link} onChange={e=>upd("hero_btn1_link",e.target.value)} style={inp}/>
                    </div>
                    <div>
                      <label style={lbl}>Botón 2 — Texto</label><input value={s.hero_btn2_label} onChange={e=>upd("hero_btn2_label",e.target.value)} style={inp}/>
                      <label style={{...lbl,marginTop:10}}>Botón 2 — Enlace</label><input value={s.hero_btn2_link} onChange={e=>upd("hero_btn2_link",e.target.value)} style={inp}/>
                    </div>
                  </div>
                </div>

                {/* Vista previa del hero */}
                <div style={{marginTop:20,borderRadius:12,overflow:"hidden",position:"relative",height:160,background:"#0f172a"}}>
                  {(bannerPreview||s.hero_banner_url) && <img src={bannerPreview||s.hero_banner_url} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.4}} onError={e=>e.target.style.display="none"}/>}
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(0,0,0,0.8),rgba(0,0,0,0.3))",display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 24px"}}>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:6,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>VISTA PREVIA</div>
                    <div style={{fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.2,marginBottom:8}} dangerouslySetInnerHTML={{__html: sanitizeHtml(s.hero_title)?.replace(/<span>/g, "<span style='color:#ff1f1f'>")}}/>
                    <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",margin:"0 0 10px"}}>{s.hero_description}</p>
                    <div style={{display:"flex",gap:8}}>
                      <span style={{background:"white",color:"#0f172a",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:6}}>{s.hero_btn1_label}</span>
                      <span style={{border:"1px solid white",color:"white",fontSize:11,fontWeight:700,padding:"5px 12px",borderRadius:6}}>{s.hero_btn2_label}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: MANTENIMIENTO ── */}
          {activeTab === "maintenance" && (
            <div style={card}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <AlertTriangle size={20} style={{color:"#f59e0b"}}/><h2 style={{margin:0,fontSize:18,fontWeight:800}}>Modo Mantenimiento</h2>
              </div>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",background:s.maintenance_mode==="1"?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${s.maintenance_mode==="1"?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.06)"}`,borderRadius:12,marginBottom:20}}>
                <div>
                  <h3 style={{margin:"0 0 4px",fontSize:16,fontWeight:800,color:s.maintenance_mode==="1"?"#ef4444":"#f1f5f9"}}>
                    {s.maintenance_mode==="1" ? "🔴 MANTENIMIENTO ACTIVO" : "🟢 Sitio en línea"}
                  </h3>
                  <p style={{margin:0,fontSize:13,color:"#64748b"}}>{s.maintenance_mode==="1"?"Los visitantes verán la pantalla de mantenimiento":"El sitio es accesible para todos los usuarios"}</p>
                </div>
                <Toggle value={s.maintenance_mode==="1"} onChange={()=>upd("maintenance_mode",s.maintenance_mode==="1"?"0":"1")} color="#ef4444"/>
              </div>

              {s.maintenance_mode==="1" && (
                <div style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,padding:16,marginBottom:16}}>
                  <p style={{margin:"0 0 8px",fontSize:12,fontWeight:700,color:"#ef4444",textTransform:"uppercase",letterSpacing:1}}>⚠️ Advertencia</p>
                  <p style={{margin:0,fontSize:13,color:"#94a3b8"}}>El modo mantenimiento está <strong style={{color:"#ef4444"}}>ACTIVO</strong>. Los usuarios que intenten acceder al sitio verán la página de mantenimiento. Los admins pueden seguir accediendo normalmente.</p>
                </div>
              )}

              <div style={{marginBottom:18}}>
                <label style={lbl}>Mensaje de Mantenimiento</label>
                <textarea value={s.maintenance_msg} onChange={e=>upd("maintenance_msg",e.target.value)} rows={3} style={{...inp,resize:"vertical"}} placeholder="Mensaje que verán los visitantes..."/>
              </div>

              {/* Preview de página de mantenimiento */}
              <div style={{borderRadius:12,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)"}}>
                <div style={{background:"rgba(255,255,255,0.04)",padding:"10px 16px",fontSize:11,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:1}}>Vista previa de la página de mantenimiento</div>
                <div style={{background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)",padding:"40px 20px",textAlign:"center"}}>
                  <div style={{fontSize:48,marginBottom:16}}>⚙️</div>
                  <h2 style={{fontFamily:"Montserrat,sans-serif",fontSize:22,fontWeight:900,color:"#f1f5f9",marginBottom:10}}>{s.site_name}</h2>
                  <div style={{width:40,height:3,background:"#ff1f1f",margin:"0 auto 16px",borderRadius:2}}/>
                  <h3 style={{fontFamily:"Montserrat,sans-serif",color:"#f59e0b",fontWeight:800,marginBottom:8}}>Página en Mantenimiento</h3>
                  <p style={{color:"#94a3b8",fontSize:14,maxWidth:400,margin:"0 auto 20px"}}>{s.maintenance_msg}</p>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"8px 16px",color:"#64748b",fontSize:12}}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",animation:"pulse 2s infinite",display:"inline-block"}}/>Volvemos pronto
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: REDES SOCIALES ── */}
          {activeTab === "redes" && (
            <div style={card}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <Globe size={20} style={{color:"#a855f7"}}/><h2 style={{margin:0,fontSize:18,fontWeight:800}}>Redes Sociales & Contacto</h2>
              </div>
              <div style={{display:"grid",gap:18}}>
                {[
                  { icon:<Facebook size={16} style={{color:"#1877f2"}}/>, label:"Facebook URL", key:"facebook_url", ph:"https://facebook.com/..." },
                  { icon:<Twitter size={16} style={{color:"#1da1f2"}}/>, label:"Twitter/X URL", key:"twitter_url",  ph:"https://twitter.com/..." },
                  { icon:<Instagram size={16} style={{color:"#e1306c"}}/>, label:"Instagram URL",key:"instagram_url",ph:"https://instagram.com/..." },
                  { icon:<Mail size={16} style={{color:"#10b981"}}/>, label:"Email de Contacto", key:"contact_email", ph:"contacto@numyf.com" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{...lbl,display:"flex",alignItems:"center",gap:6}}>{f.icon} {f.label}</label>
                    <input value={s[f.key]} onChange={e=>upd(f.key,e.target.value)} placeholder={f.ph} style={inp}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: SEGURIDAD ── */}
          {activeTab === "security" && (
            <div style={card}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <Lock size={20} style={{color:"#ef4444"}}/><h2 style={{margin:0,fontSize:18,fontWeight:800}}>Cambiar Contraseña</h2>
              </div>
              <form onSubmit={handleChangePassword}>
                <div style={{display:"grid",gap:16,maxWidth:500}}>
                  <div>
                    <label style={lbl}>Contraseña Actual</label>
                    <div style={{position:"relative"}}>
                      <input type={showPassCurrent?"text":"password"} value={pwd.current} onChange={e=>setPwd(p=>({...p,current:e.target.value}))} style={{...inp,paddingRight:44}}/>
                      <button type="button" onClick={()=>setShowPassCurrent(!showPassCurrent)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer"}}>{showPassCurrent?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Nueva Contraseña</label>
                    <div style={{position:"relative"}}>
                      <input type={showPassNew?"text":"password"} value={pwd.new} onChange={e=>setPwd(p=>({...p,new:e.target.value}))} style={{...inp,paddingRight:44}}/>
                      <button type="button" onClick={()=>setShowPassNew(!showPassNew)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer"}}>{showPassNew?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Confirmar Nueva Contraseña</label>
                    <input type="password" value={pwd.confirm} onChange={e=>setPwd(p=>({...p,confirm:e.target.value}))} style={inp}/>
                    {pwd.new && pwd.confirm && pwd.new!==pwd.confirm && <p style={{color:"#ef4444",fontSize:12,marginTop:4}}>Las contraseñas no coinciden</p>}
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <button type="submit" className="btn-add" style={{padding:"10px 24px"}}>
                      <Save size={15}/> Actualizar Contraseña
                    </button>
                    {pwd.new.length > 0 && (
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {[1,2,3,4].map(lvl=>(
                          <div key={lvl} style={{width:24,height:4,borderRadius:2,background: pwd.new.length>=(lvl*2)?lvl<=1?"#ef4444":lvl<=2?"#f97316":lvl<=3?"#f59e0b":"#10b981":"rgba(255,255,255,0.1)"}}/>
                        ))}
                        <span style={{fontSize:11,color:"#64748b"}}>{pwd.new.length<4?"Débil":pwd.new.length<6?"Regular":pwd.new.length<10?"Buena":"Fuerte"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          </>}

          {/* GUARDAR FLOTANTE */}
          <div style={{position:"sticky",bottom:20,display:"flex",justifyContent:"flex-end",marginTop:8}}>
            <button onClick={handleSave} disabled={saving} className="btn-add" style={{boxShadow:"0 8px 32px rgba(255,31,31,0.3)",padding:"12px 28px",fontSize:15}}>
              <Save size={18}/> {saving?"Guardando...":"Guardar Configuración"}
            </button>
          </div>
        </div>
      </main>

      <style>{`
        button.nav-item { background:none; border:none; color:var(--text-muted); font-family:inherit; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.2)} }
        input:focus, textarea:focus { border-color: rgba(255,31,31,0.4) !important; box-shadow: 0 0 0 3px rgba(255,31,31,0.1); }
      `}</style>
    </div>
  );
}
