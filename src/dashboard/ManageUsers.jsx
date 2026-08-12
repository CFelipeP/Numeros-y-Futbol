// ========== ManageUsers.jsx ==========
import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Link, useLocation } from "react-router-dom";
import "../admin.css";
import Swal from "sweetalert2";
import 'animate.css';

import {
  LayoutDashboard, CalendarDays, Shield, Newspaper, Users, Settings, LogOut, Menu,
  CircleDot, Target, Trophy, ChevronDown, Plus, Pencil, Trash2, Save, X,
  Goal, Search, User, Swords, Eye as EyeIcon, Star, ArrowRightLeft, Upload, Mail, CheckCircle2, RotateCcw, StarOff, Filter, Zap, MessageCircle, BarChart3, Ban, UserCheck
} from "lucide-react";
import { apiFetch } from "../apiHelper";
import { API_BASE } from "../config";

const API = API_BASE;

const ManageUsers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [seleccionesOpen, setSeleccionesOpen] = useState(false);
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } })();

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) { setFilteredUsers(users); return; }
    setFilteredUsers(users.filter(u =>
      (u.nombre || "").toLowerCase().includes(term) ||
      (u.apodo || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.rol || "").toLowerCase().includes(term)
    ));
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch(`${API}crud_usuarios.php`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (_) { setUsers([]); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, salir",
      confirmButtonColor: "#d33"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user"); localStorage.removeItem("token");
        Swal.fire({ icon: "success", title: "Sesión cerrada", timer: 1500, showConfirmButton: false }).then(() => { window.location.href = "/login"; });
      }
    });
  };

  const addUser = () => {
    Swal.fire({
      title: "Agregar Nuevo Usuario",
      html:
        '<input id="swal-name" class="swal2-input" placeholder="Nombre completo" required>' +
        '<input id="swal-apodo" class="swal2-input" placeholder="Nombre de usuario" required>' +
        '<input id="swal-email" type="email" class="swal2-input" placeholder="Correo electrónico" required>' +
        '<input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña (mín. 6 caracteres)" required>',
      showCancelButton: true,
      confirmButtonText: "Agregar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-name").value.trim();
        const apodo = document.getElementById("swal-apodo").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const password = document.getElementById("swal-password").value.trim();

        if (!nombre || !apodo || !email || !password) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }
        if (password.length < 6) {
          Swal.showValidationMessage("La contraseña debe tener al menos 6 caracteres");
          return false;
        }
        return { nombre, apodo, email, password };
      }
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await apiFetch(`${API}crud_usuarios.php`, {
            method: 'POST',
            body: JSON.stringify({ action: 'create', ...result.value })
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Usuario creado", showConfirmButton: false, timer: 1500 });
            fetchUsers();
          } else {
            Swal.fire("Error", data.error || "No se pudo crear", "error");
          }
        } catch (_) { Swal.fire("Error", "Error de conexión", "error"); }
      }
    });
  };

  const editUser = (u) => {
    if (u.rol === 'admin' && currentUser?.id !== u.id) {
      Swal.fire("No puedes editar a otro administrador");
      return;
    }
    const initials = (u.nombre || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const rolColors = {
      admin: { bg: 'rgba(255, 0, 77, 0.15)', color: '#ff004d', border: 'rgba(255, 0, 77, 0.3)' },
      editor: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
      usuario: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
    };
    const rc = rolColors[u.rol] || rolColors.usuario;

    Swal.fire({
      title: '',
      html: `
        <div class="edit-user-modal">
          <div class="edit-user-header">
            <div class="edit-user-avatar" style="background: ${rc.bg}; border: 2px solid ${rc.border}; color: ${rc.color};">
              ${initials}
            </div>
            <div class="edit-user-header-info">
              <h3 class="edit-user-name">${u.nombre || 'Usuario'}</h3>
              <span class="edit-user-role-badge" style="background: ${rc.bg}; color: ${rc.color}; border: 1px solid ${rc.border};">
                ${u.rol === 'admin' ? 'Administrador' : u.rol === 'editor' ? 'Editor' : 'Usuario'}
              </span>
            </div>
          </div>
          <div class="edit-user-divider"></div>
          <div class="edit-user-fields">
            <div class="edit-field-group">
              <label class="edit-field-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Nombre completo
              </label>
              <input id="swal-name" class="edit-field-input" placeholder="Nombre completo" value="${u.nombre || ''}">
            </div>
            <div class="edit-field-group">
              <label class="edit-field-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>
                Nombre de usuario
              </label>
              <input id="swal-apodo" class="edit-field-input" placeholder="Nombre de usuario" value="${u.apodo || ''}">
            </div>
            <div class="edit-field-group">
              <label class="edit-field-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Correo electrónico
              </label>
              <input id="swal-email" type="email" class="edit-field-input" placeholder="Correo electrónico" value="${u.email || ''}">
            </div>
            ${currentUser?.id !== u.id ? `
            <div class="edit-field-group">
              <label class="edit-field-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                Rol
              </label>
              <select id="swal-rol" class="edit-field-input" style="appearance:auto;cursor:pointer;">
                <option value="usuario" ${u.rol === 'usuario' ? 'selected' : ''}>Usuario</option>
                <option value="editor" ${u.rol === 'editor' ? 'selected' : ''}>Editor</option>
                <option value="admin" ${u.rol === 'admin' ? 'selected' : ''}>Administrador</option>
              </select>
            </div>` : ''}
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'edit-user-popup',
        confirmButton: 'edit-user-btn-save',
        cancelButton: 'edit-user-btn-cancel',
        actions: 'edit-user-actions'
      },
      preConfirm: () => {
        const nombre = document.getElementById("swal-name").value.trim();
        const apodo = document.getElementById("swal-apodo").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const rol = currentUser?.id !== u.id ? (document.getElementById("swal-rol")?.value || u.rol) : u.rol;

        if (!nombre || !apodo || !email) {
          Swal.showValidationMessage("Nombre, apodo y email son obligatorios");
          return false;
        }
        return { nombre, apodo, email, rol };
      }
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await apiFetch(`${API}crud_usuarios.php`, {
            method: 'POST',
            body: JSON.stringify({ action: 'update', id: u.id, ...result.value })
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Usuario actualizado", showConfirmButton: false, timer: 1500 });
            fetchUsers();
          } else {
            Swal.fire("Error", data.error || "No se pudo actualizar", "error");
          }
        } catch (_) { Swal.fire("Error", "Error de conexión", "error"); }
      }
    });
  };

  const deleteUser = (user) => {
    if (currentUser?.id === user.id) {
      Swal.fire("No puedes desactivarte a ti mismo");
      return;
    }
    if (user.rol === 'admin') {
      Swal.fire("No puedes desactivar a un administrador");
      return;
    }
    Swal.fire({
      title: `Desactivar a ${user.nombre}`,
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'swal-deactivate-popup',
        confirmButton: 'swal-btn-danger',
        cancelButton: 'swal-btn-cancel'
      },
      html: `
        <div class="deactivate-modal">
          <div class="deactivate-warn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p>El usuario <strong style="color:#f8fafc">${user.nombre}</strong> no podrá iniciar sesión hasta que sea restaurado.</p>
          </div>
          <div class="deactivate-justify">
            <label class="deactivate-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Justificación del motivo
            </label>
            <textarea id="swal-justificacion" placeholder="Escribe el motivo de la desactivación..." required></textarea>
          </div>
        </div>
        <style>
          .deactivate-modal{text-align:left;padding:0}.deactivate-warn{display:flex;align-items:flex-start;gap:12px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:14px 16px;margin-bottom:16px}.deactivate-warn p{margin:0;color:#94a3b8;font-size:0.9rem;line-height:1.5}.deactivate-justify{margin-top:4px}.deactivate-label{display:flex;align-items:center;gap:6px;font-size:0.85rem;font-weight:600;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px}#swal-justificacion{width:100%;min-height:90px;background:rgba(15,23,42,0.8);color:#f8fafc;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 14px;font-size:0.9rem;resize:vertical;outline:none;transition:border-color 0.2s;font-family:inherit;box-sizing:border-box}#swal-justificacion:focus{border-color:rgba(239,68,68,0.4);box-shadow:0 0 0 3px rgba(239,68,68,0.1)}#swal-justificacion::placeholder{color:#475569}
        </style>
      `,
      preConfirm: () => {
        const just = document.getElementById("swal-justificacion").value.trim();
        if (!just) {
          Swal.showValidationMessage("Debe escribir una justificación");
          return false;
        }
        return just;
      }
    }).then(async (result) => {
      if (result.value) {
        try {
          const res = await apiFetch(`${API}crud_usuarios.php`, {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', id: user.id, justificacion: result.value })
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Usuario desactivado", showConfirmButton: false, timer: 1500 });
            fetchUsers();
          } else {
            Swal.fire("Error", data.error || "No se pudo desactivar", "error");
          }
        } catch (_) { Swal.fire("Error", "Error de conexión", "error"); }
      }
    });
  };

  const restoreUser = (user) => {
    Swal.fire({
      title: `¿Restaurar a ${user.nombre}?`,
      text: "El usuario podrá iniciar sesión nuevamente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restaurar",
      confirmButtonColor: "#22c55e"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await apiFetch(`${API}crud_usuarios.php`, {
            method: 'POST',
            body: JSON.stringify({ action: 'restore', id: user.id })
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Usuario restaurado", showConfirmButton: false, timer: 1500 });
            fetchUsers();
          } else {
            Swal.fire("Error", data.error || "No se pudo restaurar", "error");
          }
        } catch (_) { Swal.fire("Error", "Error de conexión", "error"); }
      }
    });
  };

  const navItems = [
      { path: "/analytics", icon: <BarChart3 size={20} />, label: "Analíticas" },
      { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Panel" },
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

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-closed" : ""}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <div className="search-bar">
            <input type="text" placeholder="Buscar usuario..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="content-wrapper">
          <h1 className="admin-title">Gestionar Usuarios</h1>

          <div className="table-container">
            <div className="table-header">
              <h2>Lista de Usuarios</h2>
              <button className="btn-add" onClick={addUser}>
                <Plus size={18} /> Nuevo Usuario
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Cargando usuarios...</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>{searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}</div>
            ) : (<>
              <table className="data-table hide-table-mobile">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th className="hide-on-mobile">Correo</th>
                    <th className="hide-on-mobile">Rol</th>
                    <th className="hide-on-mobile">Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} style={{ opacity: (u.activo == 0 || u.activo === false) ? 0.5 : 1 }}>
                      <td style={{ fontWeight: '600' }}>{u.nombre}</td>
                      <td style={{ color: 'var(--text-muted)' }}>@{u.apodo}</td>
                      <td className="hide-on-mobile">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                          <Mail size={14} /> {u.email}
                        </span>
                      </td>
                      <td className="hide-on-mobile">
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                          background: u.rol === 'admin' ? 'rgba(255, 0, 77, 0.15)' : u.rol === 'editor' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: u.rol === 'admin' ? '#ff004d' : u.rol === 'editor' ? '#f59e0b' : '#3b82f6'
                        }}>
                          {u.rol === 'admin' ? 'Administrador' : u.rol === 'editor' ? 'Editor' : 'Usuario'}
                        </span>
                      </td>
                      <td className="hide-on-mobile">
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                          background: (u.activo == 0 || u.activo === false) ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: (u.activo == 0 || u.activo === false) ? '#ef4444' : '#22c55e'
                        }}>
                          {(u.activo == 0 || u.activo === false) ? 'Inactivo' : 'Activo'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(u.activo == 0 || u.activo === false) ? (
                            <button onClick={() => restoreUser(u)}
                              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '12px' }}>
                              <UserCheck size={16} /> Activar
                            </button>
                          ) : (
                            <>
                              <button onClick={() => editUser(u)}
                                disabled={u.rol === 'admin' && currentUser?.id !== u.id}
                                style={{ background: (u.rol === 'admin' && currentUser?.id !== u.id) ? '#374151' : '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: (u.rol === 'admin' && currentUser?.id !== u.id) ? 'not-allowed' : 'pointer', opacity: (u.rol === 'admin' && currentUser?.id !== u.id) ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => deleteUser(u)}
                                disabled={currentUser?.id === u.id || u.rol === 'admin'}
                                style={{ background: (currentUser?.id === u.id || u.rol === 'admin') ? '#374151' : '#d97706', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: (currentUser?.id === u.id || u.rol === 'admin') ? 'not-allowed' : 'pointer', opacity: (currentUser?.id === u.id || u.rol === 'admin') ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '12px' }}>
                                <Ban size={16} /> Desactivar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mobile-user-cards">
                {filteredUsers.map((u) => {
                  const initials = (u.nombre || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                  const rc = u.rol === 'admin' ? { bg: 'rgba(255, 0, 77, 0.15)', color: '#ff004d', border: 'rgba(255, 0, 77, 0.3)' } : u.rol === 'editor' ? { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' } : { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' };
                  const inactive = (u.activo == 0 || u.activo === false);
                  return (
                    <div key={u.id} className={`mu-card${inactive ? ' mu-inactive' : ''}`}>
                      <div className="mu-card-top">
                        <div className="mu-card-avatar" style={{ background: rc.bg, border: `2px solid ${rc.border}`, color: rc.color }}>{initials}</div>
                        <div className="mu-card-info">
                          <div className="mu-card-name">{u.nombre}</div>
                          <div className="mu-card-username">@{u.apodo}</div>
                        </div>
                        <div className="mu-card-actions">
                          {inactive ? (
                            <button className="mu-btn mu-btn-restore" onClick={() => restoreUser(u)} title="Activar"><UserCheck size={16} /></button>
                          ) : (
                            <>
                              <button className="mu-btn mu-btn-edit" onClick={() => editUser(u)} disabled={u.rol === 'admin' && currentUser?.id !== u.id} title="Editar"><Pencil size={16} /></button>
                              <button className="mu-btn mu-btn-deactivate" onClick={() => deleteUser(u)} disabled={currentUser?.id === u.id || u.rol === 'admin'} title="Desactivar"><Ban size={16} /></button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mu-card-details">
                        <span className="mu-card-detail"><Mail size={12} /> {u.email}</span>
                        <div className="mu-card-badges">
                          <span className="mu-badge" style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{u.rol === 'admin' ? 'Administrador' : u.rol === 'editor' ? 'Editor' : 'Usuario'}</span>
                          <span className={`mu-badge mu-badge-status${inactive ? ' mu-badge-inactive' : ''}`}>{inactive ? 'Inactivo' : 'Activo'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>)}
          </div>
        </div>
      </main>

      <style>{`
        button.nav-item {
          background: none;
          border: none;
          color: var(--text-muted);
          font-family: inherit;
        }
        .hide-on-mobile { display: table-cell; }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .hide-table-mobile { display: none; }
          .mobile-user-cards { display: flex; }
        }
        @media (min-width: 769px) {
          .mobile-user-cards { display: none; }
        }
        .mobile-user-cards {
          flex-direction: column;
          gap: 10px;
          padding: 0;
        }
        .mu-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 14px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }
        .mu-card.mu-inactive { opacity: 0.5; }
        .mu-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mu-card-avatar {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 1px;
          flex-shrink: 0;
        }
        .mu-card-info {
          flex: 1;
          min-width: 0;
        }
        .mu-card-name {
          font-size: 14px;
          font-weight: 700;
          color: #f1f5f9;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .mu-card-username {
          font-size: 12px;
          color: #64748b;
          margin-top: 1px;
        }
        .mu-card-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .mu-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mu-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .mu-btn-edit { background: rgba(37, 99, 235, 0.15); color: #60a5fa; }
        .mu-btn-edit:hover:not(:disabled) { background: rgba(37, 99, 235, 0.25); }
        .mu-btn-delete { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .mu-btn-delete:hover:not(:disabled) { background: rgba(239, 68, 68, 0.25); }
        .mu-btn-deactivate { background: rgba(217, 119, 6, 0.15); color: #fbbf24; }
        .mu-btn-deactivate:hover:not(:disabled) { background: rgba(217, 119, 6, 0.28); }
        .mu-btn-restore { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .mu-btn-restore:hover { background: rgba(34, 197, 94, 0.25); }
        .mu-card-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(51, 65, 85, 0.4);
        }
        .mu-card-detail {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .mu-card-badges {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
        }
        .mu-badge {
          display: inline-flex;
          padding: 3px 8px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .mu-badge-status {
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .mu-badge-inactive {
          background: rgba(239, 68, 68, 0.12) !important;
          color: #f87171 !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;