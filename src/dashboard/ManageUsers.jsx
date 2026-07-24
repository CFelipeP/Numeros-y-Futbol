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
  Goal, Search, User, Swords, Eye as EyeIcon, Star, ArrowRightLeft, Upload, Mail, CheckCircle2, RotateCcw, StarOff, Filter, Zap, MessageCircle, BarChart3
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
  const [loading, setLoading] = useState(true);
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } })();

  useEffect(() => {
    if (location.pathname.startsWith("/teams/")) setTeamsOpen(true);
  }, [location.pathname]);

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
        Swal.fire({ icon: "success", title: "Deslogueo exitoso", timer: 1500, showConfirmButton: false }).then(() => { window.location.href = "/login"; });
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
        '<input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña (mín. 6 caracteres)" required>' +
        '<select id="swal-role" class="swal2-select" style="width: 100%; margin-top: 1rem; padding: 0.8rem; background: #0b1120; color: white; border-radius: 8px; border: 1px solid #374151;">' +
        '<option value="usuario">Usuario</option>' +
        '<option value="editor">Editor</option>' +
        '<option value="admin">Administrador</option>' +
        '</select>',
      showCancelButton: true,
      confirmButtonText: "Agregar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-name").value.trim();
        const apodo = document.getElementById("swal-apodo").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const password = document.getElementById("swal-password").value.trim();
        const rol = document.getElementById("swal-role").value;

        if (!nombre || !apodo || !email || !password) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }
        if (password.length < 6) {
          Swal.showValidationMessage("La contraseña debe tener al menos 6 caracteres");
          return false;
        }
        return { nombre, apodo, email, password, rol };
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
            <div class="edit-field-group">
              <label class="edit-field-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Nueva contraseña
              </label>
              <input id="swal-password" type="password" class="edit-field-input" placeholder="Dejar vacío para no cambiar">
            </div>
            <div class="edit-field-group">
              <label class="edit-field-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                Rol
              </label>
              <div class="edit-role-selector">
                <label class="edit-role-option ${u.rol === 'usuario' ? 'selected' : ''}">
                  <input type="radio" name="swal-role" value="usuario" ${u.rol === 'usuario' ? 'checked' : ''}>
                  <span class="edit-role-dot" style="--dot-color: #3b82f6;"></span>
                  Usuario
                </label>
                <label class="edit-role-option ${u.rol === 'editor' ? 'selected' : ''}">
                  <input type="radio" name="swal-role" value="editor" ${u.rol === 'editor' ? 'checked' : ''}>
                  <span class="edit-role-dot" style="--dot-color: #f59e0b;"></span>
                  Editor
                </label>
                <label class="edit-role-option ${u.rol === 'admin' ? 'selected' : ''}">
                  <input type="radio" name="swal-role" value="admin" ${u.rol === 'admin' ? 'checked' : ''}>
                  <span class="edit-role-dot" style="--dot-color: #ff004d;"></span>
                  Administrador
                </label>
              </div>
            </div>
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
        const password = document.getElementById("swal-password").value.trim();
        const rolEl = document.querySelector('input[name="swal-role"]:checked');
        const rol = rolEl ? rolEl.value : 'usuario';

        if (!nombre || !apodo || !email) {
          Swal.showValidationMessage("Nombre, apodo y email son obligatorios");
          return false;
        }
        return { nombre, apodo, email, rol, password };
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
      Swal.fire("No puedes eliminarte a ti mismo");
      return;
    }
    Swal.fire({
      title: `¿Eliminar a ${user.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#d33"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await apiFetch(`${API}crud_usuarios.php`, {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', id: user.id })
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire({ toast: true, position: "top-end", icon: "success", title: "Usuario eliminado", showConfirmButton: false, timer: 1500 });
            fetchUsers();
          } else {
            Swal.fire("Error", data.error || "No se pudo eliminar", "error");
          }
        } catch (_) { Swal.fire("Error", "Error de conexión", "error"); }
      }
    });
  };

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

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-closed" : ""}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />

      <main className="main-content">
        <header className="top-bar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <div className="search-bar">
            <input type="text" placeholder="Buscar usuario..." readOnly />
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
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th class="hide-on-mobile">Email</th>
                    <th class="hide-on-mobile">Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: 30 }}>No hay usuarios registrados</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: '600' }}>{u.nombre}</td>
                      <td style={{ color: 'var(--text-muted)' }}>@{u.apodo}</td>
                      <td class="hide-on-mobile">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                          <Mail size={14} /> {u.email}
                        </span>
                      </td>
                      <td class="hide-on-mobile">
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                          background: u.rol === 'admin' ? 'rgba(255, 0, 77, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: u.rol === 'admin' ? '#ff004d' : '#3b82f6'
                        }}>
                          {u.rol === 'admin' ? 'Administrador' : u.rol === 'editor' ? 'Editor' : 'Usuario'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-edit" onClick={() => editUser(u)}
                            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                            <Pencil size={16} />
                          </button>
                          <button className="btn-delete" onClick={() => deleteUser(u)}
                            disabled={currentUser?.id === u.id}
                            style={{ opacity: currentUser?.id === u.id ? 0.4 : 1, cursor: currentUser?.id === u.id ? "not-allowed" : "pointer" }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
      `}</style>
    </div>
  );
};

export default ManageUsers;