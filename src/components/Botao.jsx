import "./Botao.css";

function Botao({ variante = "primario", tipo = "button", onClick, disabled, children }) {
  return (
    <button type={tipo} className={`botao botao--${variante}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Botao;
