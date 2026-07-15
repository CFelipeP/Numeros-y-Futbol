import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const adminRoutes = [
    "/dashboard", "/matches", "/manage-comments", "/manage-news",
    "/users", "/settings", "/admin", "/posiciones", "/analytics",
    "/manage-seleccion", "/teams/primera", "/teams/ascenso", "/teams/femenina",
  ];
  const isAdminRoute = adminRoutes.some((r) => location.pathname.startsWith(r));

  if (isAdminRoute && user.rol?.toLowerCase() !== "admin") {
    return <Navigate to="/perfil" />;
  }

  return children;
}
