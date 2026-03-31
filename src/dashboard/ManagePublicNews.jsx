import React, { useEffect, useState } from "react";
import "../admin.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import 'animate.css';

import {
  LayoutDashboard,
  CalendarDays,
  Shield,
  Newspaper,
  Users,
  Settings,
  LogOut,
  Menu,
  Save,
  X,
  FileText
} from "lucide-react";

export default function ManagePublicNews() {
  const [news, setNews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

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
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Noticia eliminada",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire("Error", data.error || "No se pudo eliminar", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión", "error");
    }
  };

  const saveEdit = async () => {
    if (!editing.titulo.trim() || !editing.contenido.trim()) {
      Swal.fire({
        icon: "info",
        title: "Campos requeridos",
        text: "El título y el contenido son obligatorios",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }

    try {
      Swal.fire({
        title: "Guardando cambios...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch("http://numeros-y-futbol.test/backend/update_news.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = {}; }

      if (data.success || res.ok) {
        Swal.close();
        setEditing(null);
        fetchNews();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Noticia actualizada correctamente",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire("Error", data.error || "No se pudo actualizar", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión", "error");
    }
  };

  const renderMedia = (url, title) => {
    const fallback = "https://via.placeholder.com/400x200/0f172a/64748b?text=Sin+Imagen";

    if (!url) return <img src={fallback} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;

    if (url.includes(".mp4")) {
      return (
        <video
          muted
          autoPlay
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={url} type="video/mp4" />
        </video>
      );
    }

    return (
      <img
        src={url}
        alt={title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { e.target.src = fallback; }}
      />
    );
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

  return (
    <div className={`admin-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}>

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <img
              src="https://z-cdn-media.chatglm.cn/files/aa6f8301-58a7-4d02-aea3-d5603893b404.png?auth_key=1806010258-4a8f0f1a17844cf0902596eed27d9063-0-c60b297f2fc1e661b8f94e60ba8c9b0a"
              alt="Logo Números y Fútbol"
            />
          </div>
          <h2 className="sidebar-title">
            Números y Fútbol <span className="accent-text">Dashboard</span>
          </h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard" className="nav-item">
                <LayoutDashboard size={20} className="nav-icon" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/matches" className="nav-item">
                <CalendarDays size={20} className="nav-icon" /> Gestionar Partidos
              </Link>
            </li>
            <li>
              <Link to="/mynews" className="nav-item">
                <CalendarDays size={20} className="nav-icon" /> Crear Noticias
              </Link>
            </li>
            <li>
              <Link to="/teams" className="nav-item">
                <Shield size={20} className="nav-icon" /> Equipos
              </Link>
            </li>
            <li>
              <Link to="/manage-news" className="nav-item active">
                <Newspaper size={20} className="nav-icon" /> Noticias Públicas
              </Link>
            </li>
            <li>
              <Link to="/users" className="nav-item">
                <Users size={20} className="nav-icon" /> Usuarios
              </Link>
            </li>
            <li>
              <Link to="/settings" className="nav-item">
                <Settings size={20} className="nav-icon" /> Configuración
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item btn-logout-sidebar" onClick={handleLogout}>
            <LogOut size={20} className="nav-icon" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        <header className="top-bar">
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
          >
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

          {/* Contador de resultados */}
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

          {/* Grid de noticias */}
          <div className="news-grid-new" style={{ padding: '0 0 20px 0' }}>
            {filteredNews.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#64748b',
              }}>
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
                    <span className="category-badge">
                      {n.categoria || "General"}
                    </span>
                    <div className="admin-actions">
                      <button onClick={() => setEditing({ ...n })}>
                        Editar
                      </button>
                      <button onClick={() => deleteNews(n.id)}>
                        Eliminar
                      </button>
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

      {/* ===== MODAL EDITAR (Estilo formulario ManageNews) ===== */}
      {editing && (
        <div className="modal-overlay-edit">
          <div className="modal-edit-card animate__animated animate__fadeInUp">

            {/* Header */}
            <div className="modal-edit-header">
              <h2 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
                <Newspaper size={20} style={{ color: '#e2b340' }} /> Editar Noticia
              </h2>
              <button className="modal-close-btn" onClick={() => setEditing(null)} title="Cerrar">
                <X size={18} />
              </button>
            </div>

            {/* Preview del media actual */}
            <div className="modal-edit-preview">
              {renderMedia(editing.imagen, editing.titulo)}
            </div>

            {/* Formulario */}
            <div className="modal-edit-body">
              <div className="modal-edit-grid">

                {/* Título */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Título de la Noticia</label>
                  <input
                    value={editing.titulo}
                    onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                    placeholder="Ej: El Águila golea 3-0..."
                  />
                </div>

                {/* Autor y Categoría */}
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

                {/* Contenido */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Contenido</label>
                  <textarea
                    value={editing.contenido}
                    onChange={(e) => setEditing({ ...editing, contenido: e.target.value })}
                    placeholder="Redacta la noticia aquí..."
                    rows="5"
                  />
                </div>

                {/* URL Imagen/Video */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>URL de Imagen o Video</label>
                  <input
                    value={editing.imagen || ''}
                    onChange={(e) => setEditing({ ...editing, imagen: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg o video.mp4"
                  />
                </div>
              </div>
            </div>

            {/* Footer con acciones */}
            <div className="modal-edit-footer">
              <button className="modal-cancel-btn" onClick={() => setEditing(null)}>
                Cancelar
              </button>
              <button className="btn-add modal-save-btn" onClick={saveEdit}>
                <Save size={18} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ===== BOTONES DE ACCIÓN SOBRE CARDS ===== */
        .admin-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 6px;
          z-index: 10;
        }

        .admin-actions button {
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.3px;
        }

        .admin-actions button:hover {
          background: #e2b340;
          color: #000;
          border-color: #e2b340;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(226,179,64,0.4);
        }

        .admin-actions button:last-child:hover {
          background: #ef4444;
          border-color: #ef4444;
          box-shadow: 0 4px 12px rgba(239,68,68,0.4);
        }

        /* ===== MODAL EDITAR — FONDO ===== */
        .modal-overlay-edit {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(6px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        /* ===== MODAL EDITAR — TARJETA ===== */
        .modal-edit-card {
          background: #ffffff;
          border-radius: 16px;
          width: 580px;
          max-width: 95vw;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px -12px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        /* ===== MODAL — HEADER ===== */
        .modal-edit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid #f1f5f9;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .modal-close-btn {
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          color: #64748b;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fecaca;
          transform: rotate(90deg);
        }

        /* ===== MODAL — PREVIEW MEDIA ===== */
        .modal-edit-preview {
          width: 100%;
          height: 180px;
          overflow: hidden;
          background: #0f172a;
          flex-shrink: 0;
          position: relative;
        }

        .modal-edit-preview::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(transparent, rgba(0,0,0,0.3));
        }

        /* ===== MODAL — BODY (FORMULARIO) ===== */
        .modal-edit-body {
          padding: 20px 24px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-edit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .modal-edit-grid .form-group label {
          display: block;
          margin-bottom: 7px;
          font-weight: 600;
          color: #334155;
          font-size: 13px;
          letter-spacing: 0.2px;
        }

        .modal-edit-grid .form-group input,
        .modal-edit-grid .form-group textarea {
          width: 100%;
          padding: 11px 14px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          background: #f8fafc;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          font-family: inherit;
          color: #1e293b;
        }

        .modal-edit-grid .form-group input::placeholder,
        .modal-edit-grid .form-group textarea::placeholder {
          color: #94a3b8;
        }

        .modal-edit-grid .form-group input:focus,
        .modal-edit-grid .form-group textarea:focus {
          border-color: #e2b340;
          box-shadow: 0 0 0 3px rgba(226, 179, 64, 0.12);
          background: #fff;
        }

        .modal-edit-grid .form-group textarea {
          min-height: 110px;
          resize: vertical;
          line-height: 1.6;
        }

        /* ===== MODAL — FOOTER ===== */
        .modal-edit-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid #f1f5f9;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .modal-cancel-btn {
          padding: 10px 22px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-cancel-btn:hover {
          background: #f1f5f9;
          color: #334155;
          border-color: #cbd5e1;
        }

        .modal-save-btn {
          min-width: 180px !important;
          justify-content: center !important;
        }

        /* ===== RESPONSIVE MODAL ===== */
        @media (max-width: 640px) {
          .modal-edit-card {
            width: 100%;
            max-width: 100vw;
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-edit-grid {
            grid-template-columns: 1fr;
          }

          .modal-edit-preview {
            height: 140px;
          }

          .modal-edit-footer {
            flex-direction: column-reverse;
          }

          .modal-cancel-btn,
          .modal-save-btn {
            width: 100%;
            text-align: center;
            justify-content: center !important;
          }
        }
      `}</style>

    </div>
  );
}