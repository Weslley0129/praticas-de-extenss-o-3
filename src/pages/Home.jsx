import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";

function Home() {
  return (
    <div className="pagina">
      <section className="hero">
        <h1>Agende sua consulta em poucos cliques</h1>
        <p>
          O Clique Saúde conecta você a médicos especialistas com agendamento 100% online — evoluído
          agora para uma SPA em React, consumindo a mesma API REST do backend Flask.
        </p>
        <div className="hero__acoes">
          <Link className="botao botao--primario" to="/agendar">
            Agendar consulta
          </Link>
          <Link className="botao botao--secundario" to="/medicos">
            Ver médicos
          </Link>
        </div>
      </section>

      <div className="grid-2">
        <StatCard rotulo="Especialidades" valor="6" />
        <StatCard rotulo="Médicos cadastrados" valor="6" />
        <StatCard rotulo="Horários por semana" valor="10" />
        <StatCard rotulo="Disponibilidade" valor="24/7" />
      </div>

      <section className="cartao">
        <h2>Por que essa evolução?</h2>
        <p>
          A versão anterior do sistema renderizava as páginas no servidor (Flask + Jinja2), com
          JavaScript solto para chamar a API. Esta versão em React organiza a interface em
          componentes reutilizáveis, gerencia o estado do usuário logado de forma centralizada e usa
          o React Router para navegar sem recarregar a página — mantendo a mesma API REST do
          backend como fonte de dados.
        </p>
      </section>
    </div>
  );
}

export default Home;
