import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EstadoCarregamento from "../../src/components/EstadoCarregamento";

describe("EstadoCarregamento", () => {
  it("renderiza o spinner quando tipo é 'carregando' (padrão)", () => {
    const { container: raiz } = render(<EstadoCarregamento mensagem="Carregando produtos..." />);
    expect(screen.getByText("Carregando produtos...")).toBeInTheDocument();
    expect(raiz.querySelector(".estado-carregamento__spinner")).not.toBeNull();
  });

  it("não renderiza o spinner para o tipo 'erro', só a mensagem", () => {
    const { container: raiz } = render(<EstadoCarregamento tipo="erro" mensagem="Algo deu errado." />);
    expect(screen.getByText("Algo deu errado.")).toBeInTheDocument();
    expect(raiz.querySelector(".estado-carregamento__spinner")).toBeNull();
    expect(raiz.firstChild).toHaveClass("estado-carregamento--erro");
  });
});
