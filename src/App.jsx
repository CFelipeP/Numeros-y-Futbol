import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos el Toaster de Sonner
import { Toaster } from "sonner";

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
import Tercera from "./Divisiones/Tercera";
import Segunda from "./Divisiones/Segunda";
import Femenina from "./Divisiones/Femenina";
import CopaPresidente from "./Divisiones/CopaPresidente";
import Seleccion from "./Divisiones/Seleccion";
import SeleccionFemenina from "./Divisiones/SeleccionFemenina";
import SeleccionSub20 from "./Divisiones/SeleccionSub20";
import SeleccionSub17 from "./Divisiones/SeleccionSub17";
import ManageSeleccion from "./dashboard/ManageSeleccion";
import ManageTeamsFemenina from "./dashboard/ManageTeamsFemenina";
import ManageSeleccionFemenina from "./dashboard/ManageSeleccionFemenina";
import ManageSeleccionSub20 from "./dashboard/ManageSeleccionSub20";
import ManageSeleccionSub17 from "./dashboard/ManageSeleccionSub17";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import ScrollToTop from "./components/ScrollToTop";
import ManagePublicNews from "./dashboard/ManagePublicNews";
import AdminPosiciones from "./dashboard/AdminPosiciones";
import PlantillaEquipos from "./dashboard/PlantillaEquipos";
import Admincopa from "./dashboard/Admincoppresidente";
import ForgotPassword from "./pages/ForgotPassword";
import MatchDetail from "./Divisiones/MatchDetail";
import Managecomments from "./dashboard/Managematchcomments";
import UserProfile from "./pages/UserProfile";

// Dentro de <Routes>:

// Dentro de tus Routes:

import ProtectedRoute from "./components/ProtectedRoute";
import MaintenanceGuard from "./components/MaintenanceGuard";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MaintenanceGuard>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/primera" element={<Primera />} />
        <Route path="/tercera" element={<Tercera />} />
        <Route path="/news" element={<News />} />
        <Route path="/noticia/:id" element={<NewsDetail />} />
        <Route path="/mynews" element={<ManagePublicNews />} />
        <Route path="/posiciones" element={<AdminPosiciones />} />
        <Route path="/copa-presidente" element={<CopaPresidente />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/teams/primera" element={<ManageTeams />} />
        <Route path="/admin/copa" element={<Admincopa />} />
        <Route path="/teams/segunda" element={<ManageTeamsSegunda />} />
        <Route path="/teams/tercera" element={<ManageTeamsTercera />} />
        <Route path="/teams/femenina" element={<ManageTeamsFemenina />} />
        <Route path="/segunda" element={<Segunda />} />
        <Route path="/seleccion" element={<Seleccion />} />
        <Route path="/seleccion-femenina" element={<SeleccionFemenina />} />
        <Route path="/seleccion-sub20" element={<SeleccionSub20 />} />
        <Route path="/seleccion-sub17" element={<SeleccionSub17 />} />
        <Route path="/femenina" element={<Femenina />} />
        <Route path="/admin/plantilla" element={<PlantillaEquipos />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/partido/:id/:division" element={<MatchDetail />} />
        <Route path="/manage-comments" element={
          <ProtectedRoute>
            <Managecomments />
          </ProtectedRoute>
        } />


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
          path="/manage-seleccion"
          element={
            <ProtectedRoute>
              <ManageSeleccion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-seleccion-femenina"
          element={
            <ProtectedRoute>
              <ManageSeleccionFemenina />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-seleccion-sub20"
          element={
            <ProtectedRoute>
              <ManageSeleccionSub20 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-seleccion-sub17"
          element={
            <ProtectedRoute>
              <ManageSeleccionSub17 />
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
      </MaintenanceGuard>

      {/* ==================== SONNER TOASTER ==================== */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(255, 0, 77, 0.3)",
            color: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(255, 0, 77, 0.25)",
            padding: "16px 20px",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;