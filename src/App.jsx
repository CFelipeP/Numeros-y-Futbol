import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos el Toaster de Sonner
import { Toaster } from "sonner";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./dashboard/Dashboard";
import ManageMatches from "./dashboard/ManageMatches";
import ManageTeams from "./dashboard/ManageTeams";
import ManageTeamsAscenso from "./dashboard/ManageTeamsAscenso";
import ManageUsers from "./dashboard/ManageUsers";
import ManageNews from "./dashboard/ManageNews";
import Settings from "./dashboard/Settings"; // <--- NUEVO IMPORT
import Analytics from "./dashboard/Analytics";
import Primera from "./Divisiones/Primera";
import Ascenso from "./Divisiones/Ascenso";
import Femenina from "./Divisiones/Femenina";
import CopaPresidente from "./Divisiones/CopaPresidente";
import Seleccion from "./Divisiones/Seleccion";
import SeleccionFemenina from "./Divisiones/SeleccionFemenina";
import SeleccionSub20 from "./Divisiones/SeleccionSub20";
import SeleccionSub17 from "./Divisiones/SeleccionSub17";
import Fedecredito from "./Divisiones/Fedecredito";
import BurgerKing from "./Divisiones/BurgerKing";
import ManageSeleccion from "./dashboard/ManageSeleccion";
import ManageTeamsFemenina from "./dashboard/ManageTeamsFemenina";
import ManageTeamsReservas from "./dashboard/ManageTeamsReservas";
import ManageTeamsBurgerKing from "./dashboard/ManageTeamsBurgerKing";
import ManageSeleccionFemenina from "./dashboard/ManageSeleccionFemenina";
import ManageSeleccionSub20 from "./dashboard/ManageSeleccionSub20";
import ManageSeleccionSub17 from "./dashboard/ManageSeleccionSub17";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import ScrollToTop from "./components/ScrollToTop";
import VisitTracker from "./components/VisitTracker";
import ManagePublicNews from "./dashboard/ManagePublicNews";
import AdminPosiciones from "./dashboard/AdminPosiciones";
import PlantillaEquipos from "./dashboard/PlantillaEquipos";
import Admincopa from "./dashboard/Admincoppresidente";
import ForgotPassword from "./pages/ForgotPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import MatchDetail from "./Divisiones/MatchDetail";
import Managecomments from "./dashboard/Managematchcomments";
import UserProfile from "./pages/UserProfile";

// Dentro de <Routes>:

// Dentro de tus Routes:

import ProtectedRoute from "./components/ProtectedRoute";
import MaintenanceGuard from "./components/MaintenanceGuard";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <VisitTracker />
      <ErrorBoundary>
      <MaintenanceGuard>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/primera" element={<Primera />} />
        <Route path="/news" element={<News />} />
        <Route path="/noticia/:id" element={<NewsDetail />} />
        <Route path="/mynews" element={
          <ProtectedRoute>
            <ManagePublicNews />
          </ProtectedRoute>
        } />
        <Route path="/posiciones" element={
          <ProtectedRoute>
            <AdminPosiciones />
          </ProtectedRoute>
        } />
        <Route path="/copa-presidente" element={<CopaPresidente />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/teams/primera" element={
          <ProtectedRoute>
            <ManageTeams />
          </ProtectedRoute>
        } />
        <Route path="/admin/copa" element={
          <ProtectedRoute>
            <Admincopa />
          </ProtectedRoute>
        } />
        <Route path="/ascenso" element={<Ascenso />} />
        <Route path="/seleccion" element={<Seleccion />} />
        <Route path="/seleccion-femenina" element={<SeleccionFemenina />} />
        <Route path="/seleccion-sub20" element={<SeleccionSub20 />} />
        <Route path="/seleccion-sub17" element={<SeleccionSub17 />} />
        <Route path="/femenina" element={<Femenina />} />
        <Route path="/reservas" element={<Fedecredito />} />
        <Route path="/burgerking" element={<BurgerKing />} />
        <Route path="/admin/plantilla" element={
          <ProtectedRoute>
            <PlantillaEquipos />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/partido/:id/:division" element={<MatchDetail />} />
        <Route path="/manage-comments" element={
          <ProtectedRoute>
            <Managecomments />
          </ProtectedRoute>
        } />


        {/* RUTAS PROTEGIDAS (ADMIN) */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
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
          path="/teams/ascenso"
          element={
            <ProtectedRoute>
              <ManageTeamsAscenso />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/femenina"
          element={
            <ProtectedRoute>
              <ManageTeamsFemenina />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/reservas"
          element={
            <ProtectedRoute>
              <ManageTeamsReservas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/burgerking"
          element={
            <ProtectedRoute>
              <ManageTeamsBurgerKing />
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

        {/* 404 */}
        <Route path="*" element={
          <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0f172a",color:"#f1f5f9",padding:20,textAlign:"center"}}>
            <h1 style={{fontSize:80,fontWeight:900,margin:0,color:"#ef4444",textShadow:"0 0 40px rgba(239,68,68,0.3)"}}>404</h1>
            <p style={{fontSize:18,color:"#94a3b8",margin:"8px 0 24px"}}>Página no encontrada</p>
            <a href="/" style={{padding:"12px 28px",background:"linear-gradient(135deg,#ef4444,#dc2626)",border:"none",borderRadius:10,color:"#fff",fontWeight:700,textDecoration:"none",fontSize:14}}>Volver al inicio</a>
          </div>
        } />

      </Routes>
      </MaintenanceGuard>
      </ErrorBoundary>

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