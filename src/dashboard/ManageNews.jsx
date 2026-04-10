// ========== ManagePublicNews.jsx ==========
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  CircleDot, Target, Trophy, ChevronDown, Plus, Pencil, Trash2, Save, X,
    Goal, Search, User, Swords, Eye as EyeIcon, Star, ArrowRightLeft, Upload, Image, FileText 
} from "lucide-react";

export default function ManagePublicNews() {
  const [news, setNews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();

  const [editFile, setEditFile] = useState(null);
  const [editUploading, setEditUploading] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("http://numeros-y-futbol.test/backend/get_all_news.php");
      const data = await res.json();
      setNews(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las noticias", "error");
    }
  };

  const deleteNews = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta noticia?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch("http://numeros-y-futbol.test/backend/delete_news.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = {}; }

      if (data.success || res.ok) {
        setNews(news.filter(n => n.id !== id));
        Swal.fire({
          toast: true, position: "top-end", icon: "success",
          title: "Noticia eliminada", showConfirmButton: false, timer: 2000,
        });
      } else {
        Swal.fire("Error", data.error || "No se pudo eliminar", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión", "error");
    }
  };

  const uploadEditFile = async () => {
    if (!editFile) return null;

    const formData = new FormData();
    formData.append("file", editFile);
    setEditUploading(true);

    try {
      const res = await fetch("http://numeros-y-futbol.test/backend/upload_image.php", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) {
        console.error("JSON roto:", text);
        setEditUploading(false);
        return null;
      }

      setEditUploading(false);

      if (data.success) {
        return data.url;
      } else {
        return null;
      }
    } catch (error) {
      setEditUploading(false);
      return null;
    }
  };

  const handleEditFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg", "video/mp4"];

    if (!allowed.includes(selected.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato no válido',
        text: 'Solo JPG, PNG o MP4',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    setEditFile(selected);
  };

  const saveEdit = async () => {
    if (!editing.titulo.trim() || !editing.contenido.trim()) {
      Swal.fire({
        icon: "info", title: "Campos requeridos", text: "El título y el contenido son obligatorios",
        toast: true, position: "top-end", showConfirmButton: false, timer: 2500,
      });
      return;
    }

    try {
      Swal.fire({
        title: "Guardando cambios...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let finalImage = editing.imagen || "";

      if (editFile) {
        const uploadedUrl = await uploadEditFile();
        if (!uploadedUrl) {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error al subir',
            text: editFile.type.startsWith("video") ? 'El video no se pudo subir' : 'La imagen no se pudo subir'
          });
          return;
        }
        finalImage = uploadedUrl;
      }

      const res = await fetch("http://numeros-y-futbol.test/backend/update_news.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editing, imagen: finalImage }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = {}; }

      if (data.success || res.ok) {
        Swal.close();
        setEditing(null);
        setEditFile(null);
        fetchNews();
        Swal.fire({
          toast: true, position: "top-end", icon: "success",
          title: "Noticia actualizada correctamente", showConfirmButton: false, timer: 2000,
        });
      } else {
        Swal.fire("Error", data.error || "No se pudo actualizar", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión", "error");
    } finally {
      setEditUploading(false);
    }
  };

  const closeEdit = () => {
    setEditing(null);
    setEditFile(null);
  };

  const renderMedia = (url, title) => {
    const fallback = "https://via.placeholder.com/400x200/0f172a/64748b?text=Sin+Imagen";

    if (!url) return <img src={fallback} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;

    if (url.includes(".mp4")) {
      return (
        <video muted autoPlay loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
          <source src={url} type="video/mp4" />
        </video>
      );
    }

    return (
      <img
        src={url} alt={title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { e.target.src = fallback; }}
      />
    );
  };

  const renderEditPreview = () => {
    if (editFile) {
      const url = URL.createObjectURL(editFile);
      if (editFile.type.startsWith("video/")) {
        return (
          <video muted autoPlay loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
            <source src={url} type="video/mp4" />
          </video>
        );
      }
      return <img src={url} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
    }
    return renderMedia(editing?.imagen, editing?.titulo);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    });
  };

  const filteredNews = news.filter(
    (n) =>
      n.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      n.categoria?.toLowerCase().includes(search.toLowerCase()) ||
      n.contenido?.toLowerCase().includes(search.toLowerCase())
  );

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
    { path: "/manage-news", icon: <Newspaper size={20} />, label: "Noticias Públicas" },
    { path: "/users", icon: <Users size={20} />, label: "Usuarios" },
    { path: "/settings", icon: <Settings size={20} />, label: "Configuración" },
  ];

  return (
    <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <img
              src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a"
              alt="Logo Números y Fútbol"
            />
          </div>
          <h2 className="sidebar-title">
            Números y Fútbol <span className="accent-text">Admin</span>
          </h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, idx) => {
              if (item.type === "dropdown") {
                return (
                  <li key={idx}>
                    <button
                      className="nav-item"
                      onClick={() => setTeamsOpen(!teamsOpen)}
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {item.icon} {item.label}
                      </span>
                      <ChevronDown size={16} style={{ transition: "transform 0.25s ease", transform: teamsOpen ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.4 }} />
                    </button>
                    <ul style={{
                      maxHeight: teamsOpen ? "200px" : "0",
                      opacity: teamsOpen ? "1" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, opacity 0.2s ease",
                      listStyle: "none", padding: teamsOpen ? "2px 0 4px 0" : "0", margin: 0,
                    }}>
                      {item.children.map(child => (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={`nav-item${location.pathname === child.path ? " active" : ""}`}
                            style={{ paddingLeft: "48px", fontSize: "13.5px" }}
                          >
                            {child.label}
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
                    className={`nav-item${location.pathname === item.path ? " active" : ""}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}>
            <LogOut size={20} className="nav-icon" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Sidebar">
            <Menu size={24} />
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar noticia por título, categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">Noticias Públicas</h1>

          <div className="table-container" style={{ padding: 0, overflow: 'hidden', marginBottom: '0' }}>
            <div className="table-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} /> Todas las Noticias
              </h2>
              <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                {filteredNews.length} resultado{filteredNews.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="news-grid-new" style={{ padding: '0 0 20px 0' }}>
            {filteredNews.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
                <Newspaper size={56} style={{ margin: '0 auto 1rem', opacity: 0.2, display: 'block' }} />
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                  {search ? 'Sin resultados' : 'No hay noticias publicadas'}
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  {search ? 'Intenta con otro término de búsqueda' : 'Las noticias que crees aparecerán aquí'}
                </p>
              </div>
            ) : (
              filteredNews.map((n) => (
                <article key={n.id} className="article-card">
                  <div className="article-image">
                    <div className="article-media-wrap">
                      {renderMedia(n.imagen, n.titulo)}
                    </div>
                    <div className="article-image-fade" />
                    <span className="category-badge">{n.categoria || "General"}</span>
                    <div className="admin-actions">
                      <button onClick={() => setEditing({ ...n })}>Editar</button>
                      <button onClick={() => deleteNews(n.id)}>Eliminar</button>
                    </div>
                  </div>
                  <div className="article-body">
                    <h3>{n.titulo}</h3>
                    <p className="article-excerpt">{n.contenido}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>

      {editing && (
        <div className="modal-overlay-edit" onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}>
          <div className="modal-edit-card animate__animated animate__fadeInUp">

            <div className="modal-edit-header">
              <h2 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9' }}>
                <Newspaper size={20} style={{ color: '#e2b340' }} /> Editar Noticia
              </h2>
              <button className="modal-close-btn" onClick={closeEdit} title="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="modal-edit-preview">
              {renderEditPreview()}
              {editFile && (
                <div style={{
                  position: 'absolute', bottom: '10px', left: '10px', zIndex: 5,
                  background: 'rgba(16, 185, 129, 0.9)', color: '#fff',
                  fontSize: '0.72rem', fontWeight: 700, padding: '5px 10px',
                  borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <Image size={12} /> Nuevo archivo seleccionado
                </div>
              )}
            </div>

            <div className="modal-edit-body">
              <div className="modal-edit-grid">

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Título de la Noticia</label>
                  <input
                    value={editing.titulo}
                    onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                    placeholder="Ej: El Águila golea 3-0..."
                  />
                </div>

                <div className="form-group">
                  <label>Autor</label>
                  <input
                    value={editing.autor || ''}
                    onChange={(e) => setEditing({ ...editing, autor: e.target.value })}
                    placeholder="Nombre del autor"
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <input
                    value={editing.categoria || ''}
                    onChange={(e) => setEditing({ ...editing, categoria: e.target.value })}
                    placeholder="Ej: Liga Mayor, Selección"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Contenido</label>
                  <textarea
                    value={editing.contenido}
                    onChange={(e) => setEditing({ ...editing, contenido: e.target.value })}
                    placeholder="Redacta la noticia aquí..."
                    rows="5"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={14} /> Cambiar Imagen / Video
                  </label>
                  <div className="edit-file-upload-area">
                    <input
                      type="file"
                      id="edit-file-input"
                      accept="image/png, image/jpeg, image/jpg, video/mp4"
                      onChange={handleEditFileChange}
                    />
                    <label htmlFor="edit-file-input" className="edit-file-label">
                      <Upload size={20} />
                      <span>
                        {editFile
                          ? editFile.name
                          : "Haz clic para seleccionar un archivo"
                        }
                      </span>
                    </label>
                    <span className="edit-file-hint">JPG, PNG o MP4</span>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>URL de Imagen o Video <span style={{ fontWeight: 400, opacity: 0.5 }}>(opcional, se ignora si subes archivo)</span></label>
                  <input
                    value={editing.imagen || ''}
                    onChange={(e) => setEditing({ ...editing, imagen: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg o video.mp4"
                  />
                </div>

              </div>
            </div>

            <div className="modal-edit-footer">
              <button className="modal-cancel-btn" onClick={closeEdit}>
                Cancelar
              </button>
              <button
                className="btn-add modal-save-btn"
                onClick={saveEdit}
                disabled={editUploading}
                style={{ opacity: editUploading ? 0.6 : 1, cursor: editUploading ? 'not-allowed' : 'pointer' }}
              >
                {editUploading ? (
                  <>
                    <span className="edit-spinner" /> Subiendo...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-actions {
          position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; z-index: 10;
        }
        .admin-actions button {
          background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.15); color: white;
          font-size: 0.72rem; font-weight: 600; padding: 6px 12px;
          border-radius: 6px; cursor: pointer; transition: all 0.2s ease;
        }
        .admin-actions button:hover {
          background: #e2b340; color: #000; border-color: #e2b340;
          transform: translateY(-1px); box-shadow: 0 4px 12px rgba(226,179,64,0.4);
        }
        .admin-actions button:last-child:hover {
          background: #ef4444; border-color: #ef4444; box-shadow: 0 4px 12px rgba(239,68,68,0.4);
        }

        .modal-overlay-edit {
          position: fixed; inset: 0; background: rgba(2, 6, 15, 0.75);
          backdrop-filter: blur(8px); display: flex; justify-content: center;
          align-items: center; z-index: 1000;
        }

        .modal-edit-card {
          background: #0b1120;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; width: 580px;
          max-width: 95vw; max-height: 92vh; display: flex; flex-direction: column;
          box-shadow: 0 25px 60px -12px rgba(0,0,0,0.7), 0 0 80px rgba(226,179,64,0.04);
          overflow: hidden;
        }

        .modal-edit-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02); flex-shrink: 0;
        }

        .modal-close-btn {
          background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; color: #64748b; transition: all 0.2s;
        }
        .modal-close-btn:hover {
          background: rgba(239,68,68,0.15); color: #ef4444;
          border-color: rgba(239,68,68,0.3); transform: rotate(90deg);
        }

        .modal-edit-preview {
          width: 100%; height: 180px; overflow: hidden; background: #060a13;
          flex-shrink: 0; position: relative;
        }
        .modal-edit-preview::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 40px; background: linear-gradient(transparent, rgba(11,17,32,0.8));
          pointer-events: none;
        }

        .modal-edit-body {
          padding: 20px 24px; overflow-y: auto; flex: 1;
        }
        .modal-edit-body::-webkit-scrollbar { width: 6px; }
        .modal-edit-body::-webkit-scrollbar-track { background: transparent; }
        .modal-edit-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        .modal-edit-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }

        .modal-edit-grid .form-group label {
          display: block; margin-bottom: 7px; font-weight: 600;
          color: #94a3b8; font-size: 13px;
        }

        .modal-edit-grid .form-group input,
        .modal-edit-grid .form-group textarea {
          width: 100%; padding: 11px 14px; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 14px; background: rgba(255,255,255,0.04);
          outline: none; transition: all 0.2s;
          box-sizing: border-box; font-family: inherit; color: #e2e8f0;
        }
        .modal-edit-grid .form-group input::placeholder,
        .modal-edit-grid .form-group textarea::placeholder { color: #475569; }
        .modal-edit-grid .form-group input:focus,
        .modal-edit-grid .form-group textarea:focus {
          border-color: #e2b340; box-shadow: 0 0 0 3px rgba(226, 179, 64, 0.1);
          background: rgba(255,255,255,0.06);
        }
        .modal-edit-grid .form-group textarea {
          min-height: 110px; resize: vertical; line-height: 1.6;
        }

        .edit-file-upload-area {
          position: relative;
        }
        .edit-file-upload-area input[type="file"] {
          position: absolute; opacity: 0; width: 0; height: 0;
        }
        .edit-file-label {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px; border-radius: 10px;
          border: 2px dashed rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.02);
          color: #64748b; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.25s ease;
        }
        .edit-file-label:hover {
          border-color: #e2b340; color: #e2b340;
          background: rgba(226,179,64,0.04);
        }
        .edit-file-label span {
          flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .edit-file-hint {
          display: block; margin-top: 6px; font-size: 12px;
          color: #475569; font-weight: 400;
        }

        .modal-edit-footer {
          display: flex; justify-content: flex-end; gap: 10px;
          padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02); flex-shrink: 0;
        }
        .modal-cancel-btn {
          padding: 10px 22px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          background: transparent; color: #64748b; font-weight: 600; font-size: 14px;
          cursor: pointer; transition: all 0.2s;
        }
        .modal-cancel-btn:hover {
          background: rgba(255,255,255,0.05); color: #94a3b8;
          border-color: rgba(255,255,255,0.15);
        }
        .modal-save-btn { min-width: 180px !important; justify-content: center !important; }

        .edit-spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff;
          border-radius: 50%; animation: editSpin 0.6s linear infinite;
          vertical-align: middle;
        }
        @keyframes editSpin {
          to { transform: rotate(360deg); }
        }

        button.nav-item {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: inherit;
        }

        @media (max-width: 640px) {
          .modal-edit-card { width: 100%; max-width: 100vw; max-height: 100vh; border-radius: 0; }
          .modal-edit-grid { grid-template-columns: 1fr; }
          .modal-edit-preview { height: 140px; }
          .modal-edit-footer { flex-direction: column-reverse; }
          .modal-cancel-btn, .modal-save-btn { width: 100%; text-align: center; justify-content: center !important; }
        }
      `}</style>
    </div>
  );
}