
// ========== ManageNews.jsx ==========
// Este componente es para crear nuevas noticias, no para gestionar las existentes. Para eso se usará ManagePNews.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
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
  Plus,
  Image as ImageIcon,
  Send,
  Trophy
} from "lucide-react";

const ManageNews = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    image: ""
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg", "video/mp4"];

    if (!allowed.includes(selected.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato no válido',
        text: 'Solo JPG, PNG o MP4',
        toast: true,
        position: 'top-end'
      });
      return;
    }

    setFile(selected);
  };

  const uploadImage = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const res = await fetch("http://numeros-y-futbol.test/backend/upload_image.php", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("JSON roto:", text);
        setUploading(false);
        return null;
      }

      if (data.success) {
        setUploading(false);
        return data.url;
      } else {
        setUploading(false);
        return null;
      }
    } catch (error) {
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Subiendo archivo...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    let imageUrl = form.image;

    try {
      if (file) {
        const uploadedUrl = await uploadImage();

        if (!uploadedUrl) {
          Swal.fire({
            icon: 'error',
            title: 'Error al subir',
            text: file?.type.startsWith("video") ? 'El video no se pudo subir' : 'La imagen no se pudo subir'
          });
          return;
        }

        imageUrl = uploadedUrl;
      }

      const res = await fetch("http://numeros-y-futbol.test/backend/create_news.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imageUrl })
      });

      const text = await res.text();
      console.log("CREATE NEWS RESP:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("ERROR REAL:", text);
        return;
      }

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Noticia creada!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500
        });

        setForm({ title: "", author: "", category: "", content: "", image: "" });
        setFile(null);

        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
      } else {
        Swal.fire("Error", data.error || "No se pudo guardar", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error de conexión", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir",
      confirmButtonColor: "#d33"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    });
  };

  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/matches", icon: <CalendarDays size={20} />, label: "Gestionar Partidos" },
    { path: "/mynews", icon: <CalendarDays size={20} />, label: "Crear Noticias" },
    { path: "/teams", icon: <Shield size={20} />, label: "Equipos" },
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
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                >
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
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
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <div className="search-bar">
            <input type="text" placeholder="Buscar noticia..." readOnly />
          </div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">Crear Nueva Noticia</h1>

          <div className="table-container">
            <div className="table-header">
              <h2>Detalle de la Publicación</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '14px' }}>
                <ImageIcon size={16} /> Formatos: JPG, PNG, MP4
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
              <div className="form-grid" style={{ display: 'grid', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Título de la Noticia</label>
                  <input
                    name="title"
                    placeholder="Ej: El Águila golea 3-0..."
                    value={form.title}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', background: '#f8fafc' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Autor</label>
                    <input
                      name="author"
                      placeholder="Nombre del autor"
                      value={form.author}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', background: '#f8fafc' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Categoría</label>
                    <input
                      name="category"
                      placeholder="Ej: Liga Mayor, Selección"
                      value={form.category}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', background: '#f8fafc' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Contenido</label>
                  <textarea
                    name="content"
                    placeholder="Redacta la noticia aquí..."
                    value={form.content}
                    onChange={handleChange}
                    rows="6"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', background: '#f8fafc', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Sube la imagen/video de la noticia</label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, video/mp4"
                      onChange={handleFileChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                    />
                    {file && (
                      <p style={{ marginTop: '8px', fontSize: '13px', color: '#10b981', fontWeight: '500' }}>
                        Archivo listo: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-add" disabled={uploading} style={{ minWidth: '200px', justifyContent: 'center' }}>
                  {uploading ? "Subiendo..." : (
                    <><Send size={18} /> Publicar Noticia</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageNews;