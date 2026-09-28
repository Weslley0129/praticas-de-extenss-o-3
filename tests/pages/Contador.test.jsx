import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contador from "../../src/pages/Contador";

describe("Página Contador (useState)", () => {
  it("começa em zero e aumenta a cada clique em '+ Aumentar'", async () => {
    render(<Contador />);

    expect(screen.getByText("0")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "+ Aumentar" }));
    await userEvent.click(screen.getByRole("button", { name: "+ Aumentar" }));
    await userEvent.click(screen.getByRole("button", { name: "+ Aumentar" }));

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("não deixa o contador ficar negativo ao clicar em 'Diminuir' já em zero", async () => {
    render(<Contador />);

    await userEvent.click(screen.getByRole("button", { name: "− Diminuir" }));

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("volta pra zero ao clicar em 'Zerar'", async () => {
    render(<Contador />);

    const aumentar = screen.getByRole("button", { name: "+ Aumentar" });
    await userEvent.click(aumentar);
    await userEvent.click(aumentar);
    expect(screen.getByText("2")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Zerar" }));
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
