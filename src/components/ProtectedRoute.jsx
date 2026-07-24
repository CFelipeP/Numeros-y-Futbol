import { Navigate, useLocation } from "react-router-dom";

const safeParseUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
};

export default function ProtectedRoute({ children }) {
  const user = safeParseUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const adminRoutes = [
    "/dashboard", "/matches", "/manage-comments", "/manage-news",
    "/users", "/settings", "/admin", "/posiciones", "/analytics",
    "/manage-seleccion", "/teams/primera", "/teams/ascenso", "/teams/femenina", "/teams/reservas",
  ];
  const isAdminRoute = adminRoutes.some((r) => location.pathname.startsWith(r));

  if (isAdminRoute && user.rol?.toLowerCase() !== "admin") {
    return <Navigate to="/perfil" />;
  }

  return children;
}
