import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Primera from "./Divisiones/Primera";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/primera" element={<Primera />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;