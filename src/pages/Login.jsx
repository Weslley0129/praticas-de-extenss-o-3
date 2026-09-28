import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Botao from "../components/Botao";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { login as loginApi } from "../services/clinicaApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("paciente@cliquesaude.com");
  const [senha, setSenha] = useState("123456");
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState(null);

  const { entrar } = useAuth();
  const navegar = useNavigate();
  const localizacao = useLocation();
  const destino = localizacao.state?.de || "/dashboard";

  const enviar = async (evento) => {
    evento.preventDefault();
    setEntrando(true);
    setErro(null);
    try {
      const usuario = await loginApi(email, senha);
      entrar(usuario);
      navegar(usuario.tipo === "admin" ? "/admin" : destino);
    } catch (erroLogin) {
      setErro(erroLogin.message);
    } finally {
      setEntrando(false);
    }
  };

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Entrar</h1>
        <p>Use suas credenciais para acessar seu painel.</p>
      </div>

      <form className="formulario cartao" onSubmit={enviar}>
        {erro && <EstadoCarregamento tipo="erro" mensagem={erro} />}

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>

        <Botao tipo="submit" disabled={entrando}>
          {entrando ? "Entrando..." : "Entrar"}
        </Botao>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>.
          <br />
          Login de teste — paciente: <code>paciente@cliquesaude.com / 123456</code>. Admin:{" "}
          <code>admin@cliquesaude.com / admin123</code>.
        </p>
      </form>
    </div>
  );
}

export default Login;
