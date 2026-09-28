import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MedicoCard from "../components/MedicoCard";
import EstadoCarregamento from "../components/EstadoCarregamento";
import Botao from "../components/Botao";
import { buscarMedico, buscarHorariosDoMedico } from "../services/clinicaApi";

function MedicoDetalhe() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [medico, setMedico] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const [dadosMedico, dadosHorarios] = await Promise.all([
          buscarMedico(id),
          buscarHorariosDoMedico(id),
        ]);
        if (ativo) {
          setMedico(dadosMedico);
          setHorarios(dadosHorarios);
        }
      } catch {
        if (ativo) setErro("Médico não encontrado ou API indisponível.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [id]);

  if (carregando) return <EstadoCarregamento mensagem="Carregando médico..." />;
  if (erro) return <EstadoCarregamento tipo="erro" mensagem={erro} />;

  return (
    <div className="pagina">
      <MedicoCard medico={medico}>
        <Botao onClick={() => navegar(`/agendar?medico=${medico.id}`)}>Agendar com esse médico</Botao>
      </MedicoCard>

      <section className="cartao">
        <h2>Horários fixos na agenda</h2>
        {horarios.length === 0 ? (
          <p>Nenhum horário cadastrado para este médico.</p>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Dia da semana</th>
                <th>Horário</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario) => (
                <tr key={horario.id}>
                  <td>{horario.dia_semana}</td>
                  <td>{horario.horario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default MedicoDetalhe;
