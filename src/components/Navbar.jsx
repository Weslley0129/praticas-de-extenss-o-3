import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const LINKS = [
  { to: "/", rotulo: "Início", fim: true },
  { to: "/medicos", rotulo: "Médicos" },
  { to: "/agendar", rotulo: "Agendar" },
  { to: "/contador", rotulo: "Contador" },
  { to: "/api-publica", rotulo: "API Pública" },
  { to: "/sobre", rotulo: "Sobre" },
];

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuario, sair } = useAuth();
  const navegar = useNavigate();

  const sairDaConta = () => {
    sair();
    setMenuAberto(false);
    navegar("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__marca">
        <span aria-hidden="true">✚</span> Clique Saúde
      </div>

      <button
        className="navbar__toggle"
        onClick={() => setMenuAberto((aberto) => !aberto)}
        aria-expanded={menuAberto}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      <nav className={`navbar__links${menuAberto ? " navbar__links--aberto" : ""}`}>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.fim}
            onClick={() => setMenuAberto(false)}
            className={({ isActive }) => "navbar__link" + (isActive ? " navbar__link--ativo" : "")}
          >
            {link.rotulo}
          </NavLink>
        ))}

        {usuario ? (
          <>
            <NavLink
              to={usuario.tipo === "admin" ? "/admin" : "/dashboard"}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) => "navbar__link" + (isActive ? " navbar__link--ativo" : "")}
            >
              {usuario.tipo === "admin" ? "Painel Admin" : "Meu Painel"}
            </NavLink>
            <button className="navbar__sair" onClick={sairDaConta}>
              Sair ({usuario.nome.split(" ")[0]})
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            onClick={() => setMenuAberto(false)}
            className={({ isActive }) => "navbar__link navbar__link--entrar" + (isActive ? " navbar__link--ativo" : "")}
          >
            Entrar
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
