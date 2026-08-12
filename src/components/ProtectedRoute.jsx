import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config";

const safeParseUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
};

const adminRoutes = [
  "/dashboard", "/matches", "/manage-comments", "/manage-news",
  "/users", "/settings", "/admin", "/posiciones", "/analytics",
  "/manage-seleccion", "/teams/primera", "/teams/ascenso", "/teams/femenina", "/teams/reservas", "/teams/burgerking",
];

let cachedVerification = null;

export default function ProtectedRoute({ children }) {
  const user = safeParseUser();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [valid, setValid] = useState(false);
  const mounted = useRef(true);

  const isAdminRoute = adminRoutes.some((r) => location.pathname.startsWith(r));

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) {
        cachedVerification = null;
        setVerifying(true);
        setValid(false);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  useEffect(() => {
    if (!user || !isAdminRoute) {
      setVerifying(false);
      setValid(true);
      return;
    }

    if (cachedVerification && cachedVerification.userId === user.id && cachedVerification.expires > Date.now()) {
      if (cachedVerification.role === "admin") {
        setVerifying(false);
        setValid(true);
        return;
      }
    }

    const checkRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted.current) { setValid(false); setVerifying(false); }
        return;
      }
      try {
        const res = await fetch(`${API_BASE}get_user_profile.php?id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const role = data.user?.rol || data.rol;
        if (!mounted.current) return;

        if (role?.toLowerCase() === "admin") {
          cachedVerification = { userId: user.id, role: "admin", expires: Date.now() + 60000 };
          setValid(true);
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          cachedVerification = null;
          setValid(false);
        }
      } catch {
        if (mounted.current) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          cachedVerification = null;
          setValid(false);
        }
      }
      if (mounted.current) setVerifying(false);
    };
    checkRole();
  }, [user, isAdminRoute, location.pathname]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && verifying) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0f172a",color:"#94a3b8",fontSize:14}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:24,height:24,border:"3px solid #1e293b",borderTopColor:"#ef4444",borderRadius:"50%",margin:"0 auto 12px"}}/>
          Verificando sesi&oacute;n...
        </div>
      </div>
    );
  }

  if (isAdminRoute && !valid) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && user.rol?.toLowerCase() !== "admin") {
    return <Navigate to="/perfil" />;
  }

  return children;
}
