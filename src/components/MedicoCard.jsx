import { Link } from "react-router-dom";
import "./MedicoCard.css";

const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

// Recebe o médico via props e usa children como slot para uma ação extra
// (ex: botão "Agendar" na tela de agendamento, ou nada na listagem simples)
function MedicoCard({ medico, children }) {
  return (
    <article className="medico-card">
      <div className="medico-card__avatar" aria-hidden="true">
        {medico.nome.split(" ").slice(-1)[0][0]}
      </div>
      <div className="medico-card__info">
        <h3>{medico.nome}</h3>
        <span className="medico-card__especialidade">{medico.especialidade}</span>
        <span className="medico-card__crm">{medico.crm}</span>
      </div>
      <div className="medico-card__acoes">
        <span className="medico-card__preco">{formatarMoeda(medico.valor_consulta)}</span>
        {children ?? (
          <Link className="medico-card__link" to={`/medicos/${medico.id}`}>
            Ver horários →
          </Link>
        )}
      </div>
    </article>
  );
}

export default MedicoCard;
