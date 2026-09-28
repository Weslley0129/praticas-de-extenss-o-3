import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { buscarTodasConsultas, buscarMedicos } from "../services/clinicaApi";

const CLASSE_SELO = {
  Agendado: "selo--agendado",
  Realizado: "selo--realizado",
  Cancelado: "selo--cancelado",
};

function Admin() {
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const [dadosConsultas, dadosMedicos] = await Promise.all([buscarTodasConsultas(), buscarMedicos()]);
        if (ativo) {
          setConsultas(dadosConsultas);
          setMedicos(dadosMedicos);
        }
      } catch {
        if (ativo) setErro("Não foi possível carregar os dados administrativos.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const mapaMedicos = useMemo(() => Object.fromEntries(medicos.map((m) => [m.id, m])), [medicos]);

  const consultasFiltradas = consultas.filter(
    (c) => filtroStatus === "Todos" || c.status === filtroStatus
  );

  if (carregando) return <EstadoCarregamento mensagem="Carregando painel administrativo..." />;
  if (erro) return <EstadoCarregamento tipo="erro" mensagem={erro} />;

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Painel administrativo</h1>
        <p>Visão global de todas as consultas do sistema.</p>
      </div>

      <div className="grid-2">
        <StatCard rotulo="Médicos" valor={medicos.length} />
        <StatCard rotulo="Consultas totais" valor={consultas.length} />
        <StatCard rotulo="Agendadas" valor={consultas.filter((c) => c.status === "Agendado").length} />
        <StatCard rotulo="Canceladas" valor={consultas.filter((c) => c.status === "Cancelado").length} />
      </div>

      <section className="cartao">
        <div className="chip-opcoes">
          {["Todos", "Agendado", "Realizado", "Cancelado"].map((status) => (
            <button
              key={status}
              className={`chip-opcao${filtroStatus === status ? " chip-opcao--ativo" : ""}`}
              onClick={() => setFiltroStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <table className="tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {consultasFiltradas.map((consulta) => (
              <tr key={consulta.id}>
                <td>#{consulta.paciente_id}</td>
                <td>{mapaMedicos[consulta.medico_id]?.nome ?? "—"}</td>
                <td>{consulta.data}</td>
                <td>{consulta.hora}</td>
                <td>
                  <span className={`selo ${CLASSE_SELO[consulta.status] ?? ""}`}>{consulta.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Admin;
