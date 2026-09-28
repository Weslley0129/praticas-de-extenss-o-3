import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import RotaProtegida from "./components/RotaProtegida";
import Home from "./pages/Home";
import Medicos from "./pages/Medicos";
import MedicoDetalhe from "./pages/MedicoDetalhe";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Agendar from "./pages/Agendar";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Contador from "./pages/Contador";
import ApiPublica from "./pages/ApiPublica";
import Sobre from "./pages/Sobre";
import NaoEncontrada from "./pages/NaoEncontrada";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/medicos/:id" element={<MedicoDetalhe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/agendar"
            element={
              <RotaProtegida>
                <Agendar />
              </RotaProtegida>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RotaProtegida tipoExigido="paciente">
                <Dashboard />
              </RotaProtegida>
            }
          />
          <Route
            path="/admin"
            element={
              <RotaProtegida tipoExigido="admin">
                <Admin />
              </RotaProtegida>
            }
          />
          <Route path="/contador" element={<Contador />} />
          <Route path="/api-publica" element={<ApiPublica />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
