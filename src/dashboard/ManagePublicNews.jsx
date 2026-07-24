import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  Target, Trophy, ChevronDown, Send, ImageIcon, ArrowRight, Clock, Tag, User, Eye, BarChart3
} from "lucide-react";
import { apiPost, apiPostForm } from "../apiHelper";
import { API_BASE } from "../config";

const API = API_BASE;

const ManagePublicNews = () => {
  const [form, setForm] = useState({ title: "", author: "", category: "", content: "", image: "" });
  const [file, setFile]             = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      document.body.classList.toggle("sidebar-open-lock", sidebarOpen);
    }
    return () => document.body.classList.remove("sidebar-open-lock");
  }, [sidebarOpen]);
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
    { path: "/analytics",      icon: <BarChart3 size={20} />, label: "Analiticas" },
    { path: "/dashboard",      icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/matches",        icon: <CalendarDays size={20} />,    label: "Gestionar Partidos" },
    { path: "/mynews",         icon: <CalendarDays size={20} />,    label: "Crear Noticias" },
    { type: "dropdown", icon: <Shield size={20} />, label: "Equipos", children: [
      { path: "/teams/primera", label: "Primera División" },
      { path: "/teams/ascenso", label: "Liga de Ascenso" },
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
    <div className={`admin-layout ${sidebarOpen ? "sidebar-closed" : ""}`}>
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

          <div className="news-grid">

            {/* FORMULARIO */}
            <div className="table-container news-form-card">
              <div className="table-header">
                <h2>Detalle de la Publicacion</h2>
                <div className="news-formats-badge">
                  <ImageIcon size={14} /> Formatos: JPG, PNG, MP4
                </div>
              </div>

              <form onSubmit={handleSubmit} className="news-form">
                <div className="news-form-fields">
                  <div className="news-field-group">
                    <label className="news-field-label">
                      <Tag size={14} /> Titulo de la Noticia <span className="news-required">*</span>
                    </label>
                    <input name="title" className="mod-input news-input" placeholder="Ej: El Aguila golea 3-0..." value={form.title} onChange={handleChange} required />
                  </div>

                  <div className="news-field-row">
                    <div className="news-field-group">
                      <label className="news-field-label">
                        <User size={14} /> Autor <span className="news-required">*</span>
                      </label>
                      <input name="author" className="mod-input news-input" placeholder="Nombre del autor" value={form.author} onChange={handleChange} required />
                    </div>
                    <div className="news-field-group">
                      <label className="news-field-label">
                        <Tag size={14} /> Categoria
                      </label>
                      <input name="category" className="mod-input news-input" placeholder="Ej: Liga Mayor, Seleccion" value={form.category} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="news-field-group">
                    <label className="news-field-label">
                      <Newspaper size={14} /> Contenido
                    </label>
                    <textarea name="content" className="mod-input news-textarea" placeholder="Redacta la noticia aqui..." value={form.content} onChange={handleChange} rows="6" />
                  </div>

                  <div className="news-field-group">
                    <label className="news-field-label">
                      <ImageIcon size={14} /> Imagen / Video
                    </label>
                    <div className="news-upload-area">
                      <input id="file-input" type="file" accept="image/png,image/jpeg,video/mp4" onChange={handleFileChange} className="news-file-input" />
                      <div className="news-upload-placeholder">
                        <ImageIcon size={20} />
                        <span>Haz clic o arrastra un archivo aqui</span>
                        <span className="news-upload-hint">JPG, PNG o MP4 (max 10MB)</span>
                      </div>
                    </div>
                    {file && (
                      <div className="news-file-selected">
                        <span className="news-file-check">&#10003;</span> {file.name}
                        <button type="button" className="news-file-remove" onClick={() => { setFile(null); setPreviewUrl(null); const fi = document.getElementById('file-input'); if (fi) fi.value = ''; }}>
                          &#10005;
                        </button>
                      </div>
                    )}
                  </div>

                  {previewUrl && (
                    <div className="news-field-group">
                      <label className="news-field-label">
                        <Eye size={14} /> Vista previa
                      </label>
                      <div className="news-preview-wrap">
                        <img src={previewUrl} alt="preview" className="news-preview-img" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="news-form-footer">
                  <button type="submit" className="news-submit-btn" disabled={uploading}>
                    {uploading ? (
                      <span className="news-submit-spinner" />
                    ) : (
                      <><Send size={18} /> Publicar Noticia</>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* PANEL LATERAL */}
            <div className="news-sidebar-panel">
              <div className="news-last-card">
                <div className="news-last-header">
                  <div className="news-last-header-left">
                    <span className="news-last-dot" />
                    <span className="news-last-title">Ultima Noticia Publicada</span>
                  </div>
                  {lastNews && (
                    <button className="news-last-viewall" onClick={() => navigate("/manage-news")}>
                      <Eye size={13} /> Ver todas
                    </button>
                  )}
                </div>

                {lastNews ? (
                  <div className="news-last-body" onClick={() => navigate("/manage-news")}>
                    {lastNews.imagen && !isVideo && (
                      <div className="news-last-img-wrap">
                        <img src={lastNews.imagen} alt={lastNews.titulo} className="news-last-img" onError={e => e.target.style.display="none"} />
                        <div className="news-last-img-overlay" />
                        {lastNews.categoria && (
                          <span className="news-last-category">{lastNews.categoria}</span>
                        )}
                      </div>
                    )}

                    <div className="news-last-content">
                      <h3 className="news-last-titulo">{lastNews.titulo}</h3>

                      {lastNews.contenido && (
                        <p className="news-last-extracto">{lastNews.contenido}</p>
                      )}

                      <div className="news-last-meta">
                        {lastNews.autor && (
                          <span className="news-last-meta-item"><User size={11} /> {lastNews.autor}</span>
                        )}
                        {lastNews.fecha && (
                          <span className="news-last-meta-item"><Clock size={11} /> {fmtDate(lastNews.fecha)}</span>
                        )}
                      </div>

                      <div className="news-last-cta">
                        <span>Click para gestionar noticias</span>
                        <span className="news-last-cta-link">Gestionar <ArrowRight size={13} /></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="news-last-empty">
                    <Newspaper size={32} className="news-last-empty-icon" />
                    <p className="news-last-empty-text">No hay noticias publicadas aun</p>
                    <p className="news-last-empty-sub">La ultima noticia aparecera aqui</p>
                  </div>
                )}
              </div>

              <button className="news-manage-btn" onClick={() => navigate("/manage-news")}>
                <Newspaper size={18} /> Gestionar todas las noticias <ArrowRight size={16} />
              </button>

              <div className="news-tips-card">
                <p className="news-tips-title">Consejos</p>
                <ul className="news-tips-list">
                  <li>Usa un titulo claro y atractivo</li>
                  <li>Agrega imagen para mayor visibilidad</li>
                  <li>Especifica la categoria correctamente</li>
                  <li>El contenido aparece en la pagina de noticias</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        button.nav-item { background:none; border:none; color:var(--text-muted); font-family:inherit; }

        .news-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
          align-items: start;
        }

        .news-form-card { overflow: hidden; }

        .news-formats-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          background: rgba(255,255,255,0.04);
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .news-form { padding: 24px; }
        .news-form-fields { display: flex; flex-direction: column; gap: 20px; }

        .news-field-group { display: flex; flex-direction: column; gap: 8px; }
        .news-field-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
        }
        .news-field-label svg { opacity: 0.6; }
        .news-required { color: #ef4444; font-weight: 800; }
        .news-input { font-size: 14px; }
        .news-textarea { resize: vertical; min-height: 120px; font-family: inherit; line-height: 1.6; }

        .news-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .news-upload-area {
          position: relative;
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          transition: all 0.25s ease;
          cursor: pointer;
          overflow: hidden;
        }
        .news-upload-area:hover {
          border-color: rgba(59,130,246,0.3);
          background: rgba(59,130,246,0.04);
        }
        .news-file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }
        .news-upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 28px 16px;
          color: #475569;
          font-size: 13px;
          font-weight: 500;
          pointer-events: none;
        }
        .news-upload-placeholder svg { color: #334155; }
        .news-upload-hint { font-size: 11px; color: #334155; }

        .news-file-selected {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding: 8px 14px;
          border-radius: 8px;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          color: #34d399;
          font-size: 13px;
          font-weight: 600;
        }
        .news-file-check { font-weight: 800; }
        .news-file-remove {
          margin-left: auto;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          transition: all 0.2s;
        }
        .news-file-remove:hover { background: rgba(239,68,68,0.3); }

        .news-preview-wrap {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .news-preview-img {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          display: block;
        }

        .news-form-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: flex-end;
        }
        .news-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 200px;
          justify-content: center;
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .news-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.35);
        }
        .news-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .news-submit-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: newsSpin 0.6s linear infinite;
        }

        /* PANEL LATERAL */
        .news-sidebar-panel { display: flex; flex-direction: column; gap: 16px; }

        .news-last-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        .news-last-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .news-last-header-left { display: flex; align-items: center; gap: 8px; }
        .news-last-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          display: inline-block;
        }
        .news-last-title { font-weight: 700; font-size: 14px; color: var(--text-main); }
        .news-last-viewall {
          display: flex; align-items: center; gap: 5px;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.25);
          border-radius: 8px;
          padding: 5px 10px;
          color: #3b82f6;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.2s;
          font-family: inherit;
        }
        .news-last-viewall:hover { background: rgba(59,130,246,0.22); }

        .news-last-body {
          cursor: pointer;
          transition: all 0.2s;
        }
        .news-last-body:hover { background: rgba(255,255,255,0.03); }

        .news-last-img-wrap { position: relative; overflow: hidden; }
        .news-last-img { width: 100%; height: 160px; object-fit: cover; display: block; }
        .news-last-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); }
        .news-last-category {
          position: absolute; top: 10px; left: 10px;
          background: var(--accent-red);
          color: #fff;
          font-size: 10px; font-weight: 800;
          letter-spacing: 1px;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .news-last-content { padding: 16px; }
        .news-last-titulo {
          font-size: 14px; font-weight: 700;
          color: var(--text-main);
          line-height: 1.4;
          margin: 0 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .news-last-extracto {
          font-size: 12px; color: var(--text-muted);
          line-height: 1.5;
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .news-last-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .news-last-meta-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #64748b; }
        .news-last-cta {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border);
        }
        .news-last-cta > span:first-child { font-size: 11px; color: #475569; }
        .news-last-cta-link { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--accent-blue); font-weight: 700; }

        .news-last-empty { padding: 32px 20px; text-align: center; }
        .news-last-empty-icon { color: #334155; margin-bottom: 10px; opacity: 0.4; }
        .news-last-empty-text { color: var(--text-muted); font-size: 13px; margin: 0; font-weight: 500; }
        .news-last-empty-sub { color: #334155; font-size: 12px; margin: 4px 0 0; }

        .news-manage-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 14px 20px;
          background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05));
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 12px;
          color: var(--accent-red);
          font-weight: 700; font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .news-manage-btn:hover {
          background: linear-gradient(135deg, rgba(239,68,68,0.25), rgba(239,68,68,0.1));
          transform: translateY(-2px);
        }

        .news-tips-card {
          background: rgba(59,130,246,0.06);
          border: 1px solid rgba(59,130,246,0.15);
          border-radius: 12px;
          padding: 16px;
        }
        .news-tips-title {
          font-size: 12px; font-weight: 700;
          color: #3b82f6;
          margin: 0 0 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .news-tips-list {
          margin: 0; padding-left: 16px;
          font-size: 12px; color: var(--text-muted);
          line-height: 1.8; list-style: disc;
        }

        @keyframes newsSpin { to { transform: rotate(360deg); } }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .news-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .news-grid { gap: 16px; }
          .news-field-row { grid-template-columns: 1fr; gap: 0; }
          .news-form { padding: 16px; }
          .news-form-fields { gap: 16px; }
          .news-submit-btn { width: 100%; }
          .news-form-footer { justify-content: stretch; }
        }
        @media (max-width: 480px) {
          .content-wrapper { padding: 12px 8px !important; }
          .news-form { padding: 14px 12px; }
          .news-upload-placeholder { padding: 20px 12px; }
          .news-last-header { padding: 12px 14px; flex-direction: column; gap: 8px; align-items: flex-start; }
          .news-last-content { padding: 12px 14px; }
          .news-manage-btn { padding: 12px 16px; font-size: 13px; }
        }
      `}</style>
    </div>
  );
};

export default ManagePublicNews;