import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protege rotas que exigem login (e opcionalmente um tipo de usuário específico),
// redirecionando para /login e guardando de onde o usuário veio.
function RotaProtegida({ tipoExigido, children }) {
  const { usuario } = useAuth();
  const localizacao = useLocation();

  if (!usuario) {
    return <Navigate to="/login" state={{ de: localizacao.pathname }} replace />;
  }

  if (tipoExigido && usuario.tipo !== tipoExigido) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RotaProtegida;
