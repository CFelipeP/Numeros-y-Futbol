import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Primera from "./Divisiones/Primera";
import Dashboard from "./dashboard/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/primera" element={<Primera />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;