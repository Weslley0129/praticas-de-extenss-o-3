import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Botao from "../components/Botao";
import MedicoCard from "../components/MedicoCard";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { useAuth } from "../context/AuthContext";
import { resumirAgendaSemanal } from "../utils/agenda";
import {
  buscarEspecialidades,
  buscarMedicos,
  buscarHorariosDoMedico,
  buscarTodasConsultas,
  agendarConsulta,
} from "../services/clinicaApi";

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const PASSOS = ["Especialidade", "Médico", "Data e horário", "Confirmação"];

function diaSemanaDaData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  return DIAS_SEMANA[new Date(ano, mes - 1, dia).getDay()];
}

function ehFimDeSemana(dataISO) {
  const dia = diaSemanaDaData(dataISO);
  return dia === "Sábado" || dia === "Domingo";
}

function Agendar() {
  const [searchParams] = useSearchParams();
  const { usuario } = useAuth();
  const navegar = useNavigate();

  const [passo, setPasso] = useState(1);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidade, setEspecialidade] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [medico, setMedico] = useState(null);
  const [horariosFixos, setHorariosFixos] = useState([]);
  const [consultasExistentes, setConsultasExistentes] = useState([]);
  const [data, setData] = useState("");
  const [hora, setHora] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  useEffect(() => {
    buscarEspecialidades().then(setEspecialidades).catch(() => {});
  }, []);

  // Se veio de "Ver horários" de um médico específico, pula direto pra etapa 3
  useEffect(() => {
    const medicoId = searchParams.get("medico");
    if (!medicoId) return;
    (async () => {
      const todos = await buscarMedicos();
      const alvo = todos.find((m) => String(m.id) === medicoId);
      if (alvo) {
        setEspecialidade(alvo.especialidade);
        setMedico(alvo);
        setPasso(3);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!especialidade) return;
    buscarMedicos(especialidade).then(setMedicos).catch(() => {});
  }, [especialidade]);

  useEffect(() => {
    if (!medico) return;
    Promise.all([buscarHorariosDoMedico(medico.id), buscarTodasConsultas()]).then(
      ([horarios, consultas]) => {
        setHorariosFixos(horarios);
        setConsultasExistentes(consultas);
      }
    );
  }, [medico]);

  const horariosDoDia = useMemo(() => {
    if (!data || !medico) return [];
    if (ehFimDeSemana(data)) return [];

    const diaSemana = diaSemanaDaData(data);
    const possiveis = horariosFixos.filter((h) => h.dia_semana === diaSemana);

    return possiveis
      .map((h) => h.horario)
      .filter((horarioCandidato) => {
        const ocupado = consultasExistentes.some(
          (c) =>
            c.medico_id === medico.id &&
            c.data === data &&
            c.hora === horarioCandidato &&
            c.status === "Agendado"
        );
        return !ocupado;
      });
  }, [data, medico, horariosFixos, consultasExistentes]);

  const irParaEtapa = (novoPasso) => setPasso(novoPasso);

  const confirmar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      await agendarConsulta({ pacienteId: usuario.id, medicoId: medico.id, data, hora, observacoes });
      setSucesso("Consulta agendada com sucesso!");
      setTimeout(() => navegar("/dashboard"), 1200);
    } catch (erroAgendar) {
      setErro(erroAgendar.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Agendar consulta</h1>
        <p>4 etapas simples, como no sistema original.</p>
      </div>

      <div className="wizard-passos">
        {PASSOS.map((nome, indice) => {
          const numero = indice + 1;
          const classe =
            numero === passo ? "ativo" : numero < passo ? "concluido" : "";
          return (
            <span key={nome} className={`wizard-passo${classe ? ` wizard-passo--${classe}` : ""}`}>
              {numero}. {nome}
            </span>
          );
        })}
      </div>

      {erro && <EstadoCarregamento tipo="erro" mensagem={erro} />}
      {sucesso && <EstadoCarregamento tipo="sucesso" mensagem={sucesso} />}

      {passo === 1 && (
        <section className="cartao">
          <h2>1. Escolha a especialidade</h2>
          <div className="chip-opcoes">
            {especialidades.map((item) => (
              <button
                key={item}
                className={`chip-opcao${especialidade === item ? " chip-opcao--ativo" : ""}`}
                onClick={() => {
                  setEspecialidade(item);
                  setMedico(null);
                  irParaEtapa(2);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      {passo === 2 && (
        <section className="cartao">
          <h2>2. Escolha o médico ({especialidade})</h2>
          <div className="lista">
            {medicos.map((m) => (
              <MedicoCard key={m.id} medico={m}>
                <Botao
                  onClick={() => {
                    setMedico(m);
                    irParaEtapa(3);
                  }}
                >
                  Escolher
                </Botao>
              </MedicoCard>
            ))}
          </div>
          <Botao variante="secundario" onClick={() => irParaEtapa(1)}>
            ← Voltar
          </Botao>
        </section>
      )}

      {passo === 3 && (
        <section className="cartao">
          <h2>3. Data e horário — {medico?.nome}</h2>

          {horariosFixos.length > 0 && (
            <p className="agendar__dica-dias">
              Esse médico atende: {resumirAgendaSemanal(horariosFixos)}
            </p>
          )}

          <div className="campo">
            <label htmlFor="data">Data</label>
            <input
              id="data"
              type="date"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setHora(null);
              }}
            />
          </div>

          {data && ehFimDeSemana(data) && (
            <EstadoCarregamento tipo="erro" mensagem="Não atendemos aos fins de semana. Escolha um dia útil." />
          )}

          {data && !ehFimDeSemana(data) && (
            <div className="chip-opcoes">
              {horariosDoDia.length === 0 ? (
                <p>
                  Nenhum horário livre nesse dia para este médico. Escolha uma das datas
                  listadas acima em "Esse médico atende".
                </p>
              ) : (
                horariosDoDia.map((h) => (
                  <button
                    key={h}
                    className={`chip-opcao${hora === h ? " chip-opcao--ativo" : ""}`}
                    onClick={() => setHora(h)}
                  >
                    {h}
                  </button>
                ))
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <Botao variante="secundario" onClick={() => irParaEtapa(2)}>
              ← Voltar
            </Botao>
            <Botao disabled={!hora} onClick={() => irParaEtapa(4)}>
              Continuar →
            </Botao>
          </div>
        </section>
      )}

      {passo === 4 && (
        <section className="cartao">
          <h2>4. Confirmação</h2>
          <table className="tabela">
            <tbody>
              <tr>
                <th>Médico</th>
                <td>{medico?.nome} ({medico?.especialidade})</td>
              </tr>
              <tr>
                <th>Data</th>
                <td>{data}</td>
              </tr>
              <tr>
                <th>Horário</th>
                <td>{hora}</td>
              </tr>
              <tr>
                <th>Valor</th>
                <td>{medico && new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(medico.valor_consulta)}</td>
              </tr>
            </tbody>
          </table>

          <div className="campo">
            <label htmlFor="observacoes">Observações (opcional)</label>
            <textarea
              id="observacoes"
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Botao variante="secundario" onClick={() => irParaEtapa(3)} disabled={carregando}>
              ← Voltar
            </Botao>
            <Botao onClick={confirmar} disabled={carregando}>
              {carregando ? "Confirmando..." : "Confirmar agendamento"}
            </Botao>
          </div>
        </section>
      )}
    </div>
  );
}

export default Agendar;
