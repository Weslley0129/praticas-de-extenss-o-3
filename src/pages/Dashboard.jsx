import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import Botao from "../components/Botao";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { useAuth } from "../context/AuthContext";
import { buscarConsultasDoPaciente, cancelarConsulta } from "../services/clinicaApi";

const CLASSE_SELO = {
  Agendado: "selo--agendado",
  Realizado: "selo--realizado",
  Cancelado: "selo--cancelado",
};

function Dashboard() {
  const { usuario } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);

  const carregar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await buscarConsultasDoPaciente(usuario.id);
      setConsultas(dados);
    } catch {
      setErro("Não foi possível carregar suas consultas.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelar = async (id) => {
    setCancelandoId(id);
    try {
      await cancelarConsulta(id);
      setConsultas((atuais) => atuais.map((c) => (c.id === id ? { ...c, status: "Cancelado" } : c)));
    } catch {
      setErro("Não foi possível cancelar essa consulta.");
    } finally {
      setCancelandoId(null);
    }
  };

  const total = consultas.length;
  const agendadas = consultas.filter((c) => c.status === "Agendado").length;
  const realizadas = consultas.filter((c) => c.status === "Realizado").length;
  const canceladas = consultas.filter((c) => c.status === "Cancelado").length;

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Olá, {usuario.nome.split(" ")[0]}</h1>
        <p>Este é o seu painel pessoal.</p>
      </div>

      <div className="grid-2">
        <StatCard rotulo="Total" valor={total} />
        <StatCard rotulo="Agendadas" valor={agendadas} />
        <StatCard rotulo="Realizadas" valor={realizadas} />
        <StatCard rotulo="Canceladas" valor={canceladas} />
      </div>

      <section className="cartao">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Minhas consultas</h2>
          <Link className="botao botao--primario" to="/agendar">
            + Nova consulta
          </Link>
        </div>

        {erro && <EstadoCarregamento tipo="erro" mensagem={erro} />}

        {carregando ? (
          <EstadoCarregamento mensagem="Carregando consultas..." />
        ) : consultas.length === 0 ? (
          <p>Você ainda não tem consultas agendadas.</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((consulta) => (
                <tr key={consulta.id}>
                  <td>{consulta.data}</td>
                  <td>{consulta.hora}</td>
                  <td>
                    <span className={`selo ${CLASSE_SELO[consulta.status] ?? ""}`}>{consulta.status}</span>
                  </td>
                  <td>
                    {consulta.status === "Agendado" && (
                      <Botao
                        variante="perigo"
                        disabled={cancelandoId === consulta.id}
                        onClick={() => cancelar(consulta.id)}
                      >
                        {cancelandoId === consulta.id ? "Cancelando..." : "Cancelar"}
                      </Botao>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
