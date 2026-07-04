import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  Target, Trophy, ChevronDown, Send, ImageIcon, ArrowRight, Clock, Tag, User, Eye
} from "lucide-react";
import { apiPost, apiPostForm } from "../apiHelper";
import { API_BASE } from "../config";

const API = API_BASE;

const ManagePublicNews = () => {
  const [form, setForm] = useState({ title: "", author: "", category: "", content: "", image: "" });
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamsOpen, setTeamsOpen]   = useState(false);
  const [seleccionesOpen, setSeleccionesOpen] = useState(false);
  const [lastNews, setLastNews]     = useState(null);  // ← última noticia añadida
  const [previewUrl, setPreviewUrl] = useState(null);  // ← preview imagen local

  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

  // Cargar última noticia al montar
  useEffect(() => { fetchLastNews(); }, []);

  const fetchLastNews = async () => {
    try {
      const res  = await fetch(`${API}get_all_news.php`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLastNews(data[0]);
      }
    } catch (_) {}
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg", "video/mp4"];
    if (!allowed.includes(selected.type)) {
      Swal.fire({ icon: 'error', title: 'Formato no válido', text: 'Solo JPG, PNG o MP4', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
      return;
    }
    setFile(selected);
    // Preview local
    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target.result);
      reader.readAsDataURL(selected);
    } else {
      setPreviewUrl(null);
    }
  };

  const uploadImage = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res  = await apiPostForm(`${API}upload_image.php`, formData);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { setUploading(false); return null; }
      setUploading(false);
      return data.success ? data.url : null;
    } catch (_) { setUploading(false); return null; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { Swal.fire({ icon:'warning', title:'Falta el título', toast:true, position:'top-end', showConfirmButton:false, timer:2000 }); return; }
    if (!form.author.trim()) { Swal.fire({ icon:'warning', title:'Falta el autor', toast:true, position:'top-end', showConfirmButton:false, timer:2000 }); return; }

    Swal.fire({ title: 'Publicando...', text: 'Por favor espera', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    let imageUrl = form.image;
    try {
      if (file) {
        const uploaded = await uploadImage();
        if (!uploaded) { Swal.fire({ icon:'error', title:'Error al subir', text:'No se pudo subir el archivo' }); return; }
        imageUrl = uploaded;
      }

      const res  = await apiPost(`${API}create_news.php`, { ...form, image: imageUrl });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { Swal.fire("Error", "Respuesta inválida del servidor", "error"); return; }

      if (data.success) {
        Swal.fire({ icon:'success', title:'¡Noticia publicada!', toast:true, position:'top-end', showConfirmButton:false, timer:1800 });
        // Guardar noticia creada como última noticia
        setLastNews({
          id: data.id || null,
          titulo: form.title,
          autor: form.author,
          categoria: form.category,
          contenido: form.content,
          imagen: imageUrl,
          fecha: new Date().toISOString(),
        });
        setForm({ title: "", author: "", category: "", content: "", image: "" });
        setFile(null);
        setPreviewUrl(null);
        const fi = document.getElementById('file-input');
        if (fi) fi.value = '';
        // Refrescar para obtener el ID real
        setTimeout(fetchLastNews, 1500);
      } else {
        Swal.fire("Error", data.error || "No se pudo guardar", "error");
      }
    } catch (_) {
      Swal.fire("Error", "Error de conexión", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({ title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir", confirmButtonColor: "#d33" })
      .then(r => { if (r.isConfirmed) { localStorage.removeItem("user"); localStorage.removeItem("token"); Swal.fire({ icon: "success", title: "Deslogueo exitoso", timer: 1500, showConfirmButton: false }).then(() => { window.location.href = "/login"; }); } });
  };

  const navItems = [
    { path: "/dashboard",      icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/matches",        icon: <CalendarDays size={20} />,    label: "Gestionar Partidos" },
    { path: "/mynews",         icon: <CalendarDays size={20} />,    label: "Crear Noticias" },
    { type: "dropdown", icon: <Shield size={20} />, label: "Equipos", children: [
      { path: "/teams/primera", label: "Primera División" },
      { path: "/teams/segunda", label: "Segunda División" },
      { path: "/teams/tercera", label: "Tercera División" },
      { path: "/teams/femenina", label: "Femenina" },
    ]},
      {
        type: "dropdown", icon: <Shield size={20} />, label: "Selecciones",
        children: [
          { path: "/manage-seleccion", label: "Masculina" },
          { path: "/manage-seleccion-femenina", label: "Femenina" },
          { path: "/manage-seleccion-sub20", label: "Sub-20" },
            { path: "/manage-seleccion-sub17", label: "Sub-17" },
        ]
      },
    { path: "/admin/plantilla", icon: <Target size={20} />,    label: "Plantillas" },
    { path: "/posiciones",      icon: <Trophy size={20} />,    label: "Posiciones" },
    { path: "/admin/copa",      icon: <Trophy size={20} />,    label: "Copa Presidente" },
    { path: "/manage-news",     icon: <Newspaper size={20} />, label: "Noticias Públicas" },
    { path: "/users",           icon: <Users size={20} />,     label: "Usuarios" },
    { path: "/settings",        icon: <Settings size={20} />,  label: "Configuración" },
    { path: "/",                icon: <Eye size={20} />,       label: "Ver Sitio" },
  ];

  // ── Formatear fecha ──────────────────────────────────────────────────────
  const fmtDate = (d) => {
    if (!d) return "";
    try { return new Date(d).toLocaleDateString("es-SV", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }); }
    catch (_) { return d; }
  };

  const isVideo = lastNews?.imagen?.includes(".mp4");

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
                  <button className="nav-item" onClick={() => { const s = item.label === "Selecciones"; s ? setSeleccionesOpen(!seleccionesOpen) : setTeamsOpen(!teamsOpen); }} style={{ width:"100%", justifyContent:"space-between" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:14 }}>{item.icon} {item.label}</span>
                    <ChevronDown size={16} style={{ transition:"transform 0.25s", transform: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "rotate(180deg)" : "rotate(0deg)", opacity:0.4 }} />
                  </button>
                  <ul style={{ maxHeight: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "400px" : "0", opacity: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "1" : "0", overflow:"hidden", transition:"max-height 0.3s ease,opacity 0.2s ease", listStyle:"none", padding: (item.label === "Selecciones" ? seleccionesOpen : teamsOpen) ? "2px 0 4px 0" : "0", margin:0 }}>
                    {item.children.map(child => (
                      <li key={child.path}>
                        <Link to={child.path} className={`nav-item${location.pathname === child.path ? " active" : ""}`} style={{ paddingLeft:"48px", fontSize:"13.5px" }}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
              return (
                <li key={item.path}>
                  <Link to={item.path} className={`nav-item${location.pathname === item.path ? " active" : ""}`}>
                    {item.icon} {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}>
            <LogOut size={20} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={24} /></button>
          <div className="search-bar"><input type="text" placeholder="Crear nueva noticia..." readOnly /></div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">Crear Nueva Noticia</h1>

          {/* ── GRID: Formulario + Última noticia ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, alignItems:"start" }}>

            {/* ── Formulario ── */}
            <div className="table-container">
              <div className="table-header">
                <h2>Detalle de la Publicación</h2>
                <div style={{ display:"flex", alignItems:"center", gap:10, color:"#64748b", fontSize:14 }}>
                  <ImageIcon size={16} /> Formatos: JPG, PNG, MP4
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ padding:20 }}>
                <div style={{ display:"grid", gap:20 }}>
                  {/* Título */}
                  <div>
                    <label style={{ display:"block", marginBottom:8, fontWeight:600, color:"#334155", fontSize:14 }}>Título de la Noticia *</label>
                    <input name="title" placeholder="Ej: El Águila golea 3-0..." value={form.title} onChange={handleChange} required
                      style={{ width:"100%", padding:12, borderRadius:8, border:"1px solid #e2e8f0", fontSize:15, background:"#f8fafc" }} />
                  </div>

                  {/* Autor + Categoría */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                    <div>
                      <label style={{ display:"block", marginBottom:8, fontWeight:600, color:"#334155", fontSize:14 }}>Autor *</label>
                      <input name="author" placeholder="Nombre del autor" value={form.author} onChange={handleChange} required
                        style={{ width:"100%", padding:12, borderRadius:8, border:"1px solid #e2e8f0", fontSize:15, background:"#f8fafc" }} />
                    </div>
                    <div>
                      <label style={{ display:"block", marginBottom:8, fontWeight:600, color:"#334155", fontSize:14 }}>Categoría</label>
                      <input name="category" placeholder="Ej: Liga Mayor, Selección" value={form.category} onChange={handleChange}
                        style={{ width:"100%", padding:12, borderRadius:8, border:"1px solid #e2e8f0", fontSize:15, background:"#f8fafc" }} />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div>
                    <label style={{ display:"block", marginBottom:8, fontWeight:600, color:"#334155", fontSize:14 }}>Contenido</label>
                    <textarea name="content" placeholder="Redacta la noticia aquí..." value={form.content} onChange={handleChange} rows="6"
                      style={{ width:"100%", padding:12, borderRadius:8, border:"1px solid #e2e8f0", fontSize:15, background:"#f8fafc", resize:"vertical" }} />
                  </div>

                  {/* Archivo + Preview */}
                  <div style={{ display:"grid", gridTemplateColumns: previewUrl ? "1fr 1fr" : "1fr", gap:20, alignItems:"start" }}>
                    <div>
                      <label style={{ display:"block", marginBottom:8, fontWeight:600, color:"#334155", fontSize:14 }}>Imagen / Video</label>
                      <input id="file-input" type="file" accept="image/png,image/jpeg,video/mp4" onChange={handleFileChange}
                        style={{ width:"100%", padding:10, borderRadius:8, border:"1px dashed #cbd5e1", background:"#f8fafc", cursor:"pointer" }} />
                      {file && <p style={{ marginTop:8, fontSize:13, color:"#10b981", fontWeight:500 }}>✓ {file.name}</p>}
                    </div>
                    {previewUrl && (
                      <div>
                        <label style={{ display:"block", marginBottom:8, fontWeight:600, color:"#334155", fontSize:14 }}>Vista previa</label>
                        <img src={previewUrl} alt="preview" style={{ width:"100%", maxHeight:140, objectFit:"cover", borderRadius:8, border:"1px solid #e2e8f0" }} />
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop:30, borderTop:"1px solid #f1f5f9", paddingTop:20, display:"flex", justifyContent:"flex-end" }}>
                  <button type="submit" className="btn-add" disabled={uploading} style={{ minWidth:200, justifyContent:"center" }}>
                    {uploading ? "Subiendo..." : <><Send size={18} /> Publicar Noticia</>}
                  </button>
                </div>
              </form>
            </div>

            {/* ── Panel lateral: Última noticia ── */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Card última noticia */}
              <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", boxShadow:"var(--shadow-card)" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:"#10b981", boxShadow:"0 0 8px #10b981", display:"inline-block" }} />
                    <span style={{ fontWeight:700, fontSize:14, color:"var(--text-main)" }}>Última Noticia Publicada</span>
                  </div>
                  {lastNews && (
                    <button
                      onClick={() => navigate("/manage-news")}
                      style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:8, padding:"5px 10px", color:"#3b82f6", cursor:"pointer", fontSize:12, fontWeight:700, transition:"all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(59,130,246,0.22)"}
                      onMouseLeave={e => e.currentTarget.style.background="rgba(59,130,246,0.12)"}>
                      <Eye size={13} /> Ver todas
                    </button>
                  )}
                </div>

                {lastNews ? (
                  <div
                    onClick={() => navigate("/manage-news")}
                    style={{ cursor:"pointer", transition:"all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>

                    {/* Imagen */}
                    {lastNews.imagen && !isVideo && (
                      <div style={{ position:"relative", overflow:"hidden" }}>
                        <img src={lastNews.imagen} alt={lastNews.titulo}
                          style={{ width:"100%", height:160, objectFit:"cover", display:"block" }}
                          onError={e => e.target.style.display="none"} />
                        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent)" }} />
                        {lastNews.categoria && (
                          <span style={{ position:"absolute", top:10, left:10, background:"var(--accent-red)", color:"#fff", fontSize:10, fontWeight:800, letterSpacing:1, padding:"3px 10px", borderRadius:20, textTransform:"uppercase" }}>
                            {lastNews.categoria}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ padding:16 }}>
                      {/* Título */}
                      <h3 style={{ fontSize:14, fontWeight:700, color:"var(--text-main)", lineHeight:1.4, margin:"0 0 10px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                        {lastNews.titulo}
                      </h3>

                      {/* Extracto */}
                      {lastNews.contenido && (
                        <p style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.5, margin:"0 0 12px", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                          {lastNews.contenido}
                        </p>
                      )}

                      {/* Meta */}
                      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                        {lastNews.autor && (
                          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#64748b" }}>
                            <User size={11} /> {lastNews.autor}
                          </span>
                        )}
                        {lastNews.fecha && (
                          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#64748b" }}>
                            <Clock size={11} /> {fmtDate(lastNews.fecha)}
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, borderTop:"1px solid var(--border)" }}>
                        <span style={{ fontSize:11, color:"#475569" }}>Click para gestionar noticias</span>
                        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"var(--accent-blue)", fontWeight:700 }}>
                          Gestionar <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding:"32px 20px", textAlign:"center" }}>
                    <div style={{ fontSize:28, marginBottom:10, opacity:0.3 }}>📰</div>
                    <p style={{ color:"var(--text-muted)", fontSize:13, margin:0, fontWeight:500 }}>No hay noticias publicadas aún</p>
                    <p style={{ color:"#334155", fontSize:12, margin:"4px 0 0" }}>La última noticia aparecerá aquí</p>
                  </div>
                )}
              </div>

              {/* Acceso rápido a ManageNews */}
              <button
                onClick={() => navigate("/manage-news")}
                style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"14px 20px", background:"linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.05))", border:"1px solid rgba(239,68,68,0.25)", borderRadius:12, color:"var(--accent-red)", fontWeight:700, fontSize:14, cursor:"pointer", transition:"all 0.2s", fontFamily:"inherit" }}
                onMouseEnter={e => { e.currentTarget.style.background="linear-gradient(135deg,rgba(239,68,68,0.25),rgba(239,68,68,0.1))"; e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.05))"; e.currentTarget.style.transform="translateY(0)"; }}>
                <Newspaper size={18} /> Gestionar todas las noticias <ArrowRight size={16} />
              </button>

              {/* Tips */}
              <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:12, padding:16 }}>
                <p style={{ fontSize:12, fontWeight:700, color:"#3b82f6", margin:"0 0 8px", textTransform:"uppercase", letterSpacing:1 }}>💡 Consejos</p>
                <ul style={{ margin:0, paddingLeft:16, fontSize:12, color:"var(--text-muted)", lineHeight:1.8, listStyle:"disc" }}>
                  <li>Usa un título claro y atractivo</li>
                  <li>Agrega imagen para mayor visibilidad</li>
                  <li>Especifica la categoría correctamente</li>
                  <li>El contenido aparece en la página de noticias</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        button.nav-item { background:none; border:none; color:var(--text-muted); font-family:inherit; }
        @media (max-width: 1100px) {
          .content-wrapper > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .content-wrapper > div[style*="grid-template-columns"] { gap: 16px; }
        }
        @media (max-width: 480px) {
          .content-wrapper { padding: 16px 12px !important; }
        }
      `}</style>
    </div>
  );
};

export default ManagePublicNews;