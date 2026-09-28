import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderComProviders } from "../testUtils";
import Navbar from "../../src/components/Navbar";

const CHAVE = "clique-saude-usuario";

beforeEach(() => {
  localStorage.clear();
});

describe("Navbar", () => {
  it("mostra o link 'Entrar' quando ninguém está logado", () => {
    renderComProviders(<Navbar />);
    expect(screen.getByRole("link", { name: "Entrar" })).toBeInTheDocument();
  });

  it("mostra 'Meu Painel' e o botão de sair quando há um paciente logado", () => {
    localStorage.setItem(CHAVE, JSON.stringify({ id: 2, nome: "Weslley Santos", tipo: "paciente" }));
    renderComProviders(<Navbar />);

    expect(screen.getByRole("link", { name: "Meu Painel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();
  });

  it("abre o menu mobile ao clicar no botão hambúrguer", async () => {
    renderComProviders(<Navbar />);

    const nav = screen.getByRole("navigation");
    expect(nav).not.toHaveClass("navbar__links--aberto");

    await userEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(nav).toHaveClass("navbar__links--aberto");
  });
});
