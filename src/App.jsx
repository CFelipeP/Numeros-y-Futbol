import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./dashboard/Dashboard";
import ManageMatches from "./dashboard/ManageMatches";
import ManageTeams from "./dashboard/ManageTeams";
import ManageTeamsSegunda from "./dashboard/ManageTeamsSegunda";
import ManageTeamsTercera from "./dashboard/ManageTeamsTercera";
import ManageUsers from "./dashboard/ManageUsers";
import ManageNews from "./dashboard/ManageNews";
import Settings from "./dashboard/Settings"; // <--- NUEVO IMPORT
import Primera from "./Divisiones/Primera";
import Segunda from "./Divisiones/Segunda";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import ScrollToTop from "./components/ScrollToTop";
import ManagePublicNews from "./dashboard/ManagePublicNews";
import AdminPosiciones from "./dashboard/AdminPosiciones";

// Dentro de tus Routes:

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/primera" element={<Primera />} />
        <Route path="/news" element={<News />} />
        <Route path="/noticia/:id" element={<NewsDetail />} />
        <Route path="/mynews" element={<ManagePublicNews />} />
        <Route path="/posiciones" element={<AdminPosiciones />} />
        <Route path="/teams/primera" element={<ManageTeams />} />
        <Route path="/teams/segunda" element={<ManageTeamsSegunda />} />
        <Route path="/teams/tercera" element={<ManageTeamsTercera />} />
        <Route path="/segunda" element={<Segunda />} />


        {/* RUTAS PROTEGIDAS (ADMIN) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <ManageMatches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <ManageTeams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-news"
          element={
            <ProtectedRoute>
              <ManageNews />
            </ProtectedRoute>
          }
        />

        {/* NUEVA RUTA: CONFIGURACIÓN (ADMIN) */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;