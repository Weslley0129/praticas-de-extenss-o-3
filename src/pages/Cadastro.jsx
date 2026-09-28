import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Botao from "../components/Botao";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { cadastrarPaciente } from "../services/clinicaApi";

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
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Criar conta</h1>
        <p>Leva menos de 2 minutos.</p>
      </div>

      <form className="formulario cartao" onSubmit={enviar}>
        {erro && <EstadoCarregamento tipo="erro" mensagem={erro} />}

        <div className="campo">
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" name="nome" value={form.nome} onChange={atualizarCampo} required />
        </div>
        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" value={form.email} onChange={atualizarCampo} required />
        </div>
        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            minLength={6}
            value={form.senha}
            onChange={atualizarCampo}
            required
          />
        </div>

        <Botao tipo="submit" disabled={enviando}>
          {enviando ? "Criando..." : "Criar conta"}
        </Botao>
      </form>
    </div>
  );
}

export default Cadastro;
