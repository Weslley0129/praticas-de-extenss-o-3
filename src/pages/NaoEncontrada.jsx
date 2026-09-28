import { Link } from "react-router-dom";

function NaoEncontrada() {
  return (
    <div className="pagina">
      <section className="cartao" style={{ textAlign: "center" }}>
        <h1>404</h1>
        <p>Essa página não existe.</p>
        <Link className="botao botao--primario" to="/">
          Voltar para o início
        </Link>
      </section>
    </div>
  );
}

export default NaoEncontrada;
