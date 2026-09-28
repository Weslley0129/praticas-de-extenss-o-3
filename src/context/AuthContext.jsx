import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const CHAVE = "clique-saude-usuario";

function lerUsuarioSalvo() {
  try {
    const dados = localStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuarioSalvo);

  const entrar = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dadosUsuario));
    } catch {
      // localStorage indisponível — segue só com o estado em memória
    }
  };

  const sair = () => {
    setUsuario(null);
    try {
      localStorage.removeItem(CHAVE);
    } catch {
      // ignora
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
