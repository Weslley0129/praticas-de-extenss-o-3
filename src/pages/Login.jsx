import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoClinica from "../components/LogoClinica";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { login as loginApi } from "../services/clinicaApi";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("paciente@cliquesaude.com");
  const [senha, setSenha] = useState("123456");
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState(null);
  const [avisoRecuperacao, setAvisoRecuperacao] = useState(false);

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
    <div className="tela-login">
      <div className="tela-login__marca">
        <LogoClinica tamanho={64} />
        <div className="tela-login__titulo">Clique Saúde</div>
      </div>
      <p className="tela-login__subtitulo">Clínica Integrada</p>

      <span className="tela-login__pill">CONECTE-SE</span>

      <form className="tela-login__form" onSubmit={enviar}>
        {erro && <EstadoCarregamento tipo="erro" mensagem={erro} />}

        <div className="tela-login__campo">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="tela-login__campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button
          type="button"
          className="tela-login__esqueci"
          onClick={() => setAvisoRecuperacao(true)}
        >
          Esqueci minha senha
        </button>
        {avisoRecuperacao && (
          <p className="tela-login__aviso">
            Funcionalidade ainda não implementada no back-end (ver limitação apontada no
            relatório desta atividade). Use o login de teste abaixo.
          </p>
        )}

        <button type="submit" className="tela-login__entrar" disabled={entrando}>
          {entrando ? "Entrando..." : "ENTRAR"}
        </button>

        <p className="tela-login__cadastro">
          Não possui cadastro? <Link to="/cadastro">Clique aqui</Link> e faça agora.
        </p>

        <p className="tela-login__teste">
          Login de teste — paciente: <code>paciente@cliquesaude.com / 123456</code> · admin:{" "}
          <code>admin@cliquesaude.com / admin123</code>
        </p>
      </form>
    </div>
  );
}

export default Login;
