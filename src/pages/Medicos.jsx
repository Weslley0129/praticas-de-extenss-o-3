import { useEffect, useState } from "react";
import MedicoCard from "../components/MedicoCard";
import EstadoCarregamento from "../components/EstadoCarregamento";
import { buscarMedicos, buscarEspecialidades } from "../services/clinicaApi";

function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    buscarEspecialidades().then(setEspecialidades).catch(() => {});
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const dados = await buscarMedicos(filtro);
        if (ativo) setMedicos(dados);
      } catch {
        if (ativo) setErro("Não foi possível carregar os médicos. Confirme se a API está rodando.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [filtro]);

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Nossos médicos</h1>
        <p>Escolha a especialidade e veja os profissionais disponíveis.</p>
      </div>

      <div className="chip-opcoes">
        <button
          className={`chip-opcao${filtro === "Todas" ? " chip-opcao--ativo" : ""}`}
          onClick={() => setFiltro("Todas")}
        >
          Todas
        </button>
        {especialidades.map((especialidade) => (
          <button
            key={especialidade}
            className={`chip-opcao${filtro === especialidade ? " chip-opcao--ativo" : ""}`}
            onClick={() => setFiltro(especialidade)}
          >
            {especialidade}
          </button>
        ))}
      </div>

      {erro && <EstadoCarregamento tipo="erro" mensagem={erro} />}

      {carregando ? (
        <EstadoCarregamento mensagem="Carregando médicos..." />
      ) : (
        <div className="lista">
          {medicos.map((medico) => (
            <MedicoCard key={medico.id} medico={medico} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Medicos;
