import "./EstadoCarregamento.css";

function EstadoCarregamento({ tipo = "carregando", mensagem }) {
  return (
    <div className={`estado-carregamento estado-carregamento--${tipo}`}>
      {tipo === "carregando" && <span className="estado-carregamento__spinner" aria-hidden="true" />}
      <span>{mensagem}</span>
    </div>
  );
}

export default EstadoCarregamento;
