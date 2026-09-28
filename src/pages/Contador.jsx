import { useState } from "react";
import Botao from "../components/Botao";

// Requisito "Gerenciamento de Estado": contador simples com React Hooks.
// Contexto: simula quantas consultas o paciente quer agendar de uma vez,
// só para demonstrar o hook isoladamente.
function Contador() {
  const [contagem, setContagem] = useState(0);
  const passo = 1;

  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Contador (useState)</h1>
        <p>Demonstração isolada do gerenciamento de estado com React Hooks.</p>
      </div>

      <section className="cartao" style={{ alignItems: "center", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Consultas a agendar nesta sessão:</p>
        <p style={{ fontSize: "3rem", fontFamily: "JetBrains Mono, monospace", margin: "8px 0" }}>
          {contagem}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Botao variante="secundario" onClick={() => setContagem((c) => Math.max(0, c - passo))}>
            − Diminuir
          </Botao>
          <Botao variante="secundario" onClick={() => setContagem(0)}>
            Zerar
          </Botao>
          <Botao onClick={() => setContagem((c) => c + passo)}>+ Aumentar</Botao>
        </div>
      </section>
    </div>
  );
}

export default Contador;
