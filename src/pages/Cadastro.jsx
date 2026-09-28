import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoClinica from "../components/LogoClinica";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { cadastrarPaciente } from "../services/clinicaApi";
import "./Login.css";

const ESTADO_INICIAL = { nome: "", email: "", senha: "" };

function Cadastro() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const navegar = useNavigate();

  const atualizarCampo = (evento) => {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await cadastrarPaciente(form);
      navegar("/login");
    } catch (erroCadastro) {
      setErro(erroCadastro.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="tela-login">
      <div className="tela-login__marca">
        <LogoClinica tamanho={64} />
        <div className="tela-login__titulo">Clique Saúde</div>
      </div>
      <p className="tela-login__subtitulo">Criar minha conta</p>

      <span className="tela-login__pill">CADASTRE-SE</span>

      <form className="tela-login__form" onSubmit={enviar}>
        {erro && <EstadoCarregamento tipo="erro" mensagem={erro} />}

        <div className="tela-login__campo">
          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" placeholder="Nome completo" value={form.nome} onChange={atualizarCampo} required />
        </div>
        <div className="tela-login__campo">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e-mail"
            value={form.email}
            onChange={atualizarCampo}
            required
          />
        </div>
        <div className="tela-login__campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="mín. 6 caracteres"
            minLength={6}
            value={form.senha}
            onChange={atualizarCampo}
            required
          />
        </div>

        <button type="submit" className="tela-login__entrar" disabled={enviando}>
          {enviando ? "Criando..." : "CRIAR CONTA"}
        </button>

        <p className="tela-login__cadastro">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
