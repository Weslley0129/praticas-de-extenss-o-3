import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Botao from "../../src/components/Botao";

describe("Botao", () => {
  it("renderiza o texto passado como children", () => {
    render(<Botao>Confirmar agendamento</Botao>);
    expect(screen.getByRole("button", { name: "Confirmar agendamento" })).toBeInTheDocument();
  });

  it("chama onClick quando o usuário clica", async () => {
    const aoClicar = vi.fn();
    render(<Botao onClick={aoClicar}>Agendar</Botao>);

    await userEvent.click(screen.getByRole("button", { name: "Agendar" }));

    expect(aoClicar).toHaveBeenCalledTimes(1);
  });

  it("não chama onClick quando está desabilitado", async () => {
    const aoClicar = vi.fn();
    render(
      <Botao onClick={aoClicar} disabled>
        Indisponível
      </Botao>
    );

    const botao = screen.getByRole("button", { name: "Indisponível" });
    expect(botao).toBeDisabled();

    await userEvent.click(botao);
    expect(aoClicar).not.toHaveBeenCalled();
  });

  it("aplica a classe da variante recebida via prop", () => {
    render(<Botao variante="perigo">Remover</Botao>);
    expect(screen.getByRole("button", { name: "Remover" })).toHaveClass("botao--perigo");
  });
});
