import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderComProviders } from "../testUtils";
import MedicoCard from "../../src/components/MedicoCard";

const medico = {
  id: 7,
  nome: "Dra. Carla Nunes",
  especialidade: "Cardiologia",
  crm: "CRM-SP 10234",
  valor_consulta: 250,
};

describe("MedicoCard", () => {
  it("exibe nome, especialidade, CRM e preço formatado em R$", () => {
    renderComProviders(<MedicoCard medico={medico} />);

    expect(screen.getByRole("heading", { name: "Dra. Carla Nunes" })).toBeInTheDocument();
    expect(screen.getByText("Cardiologia")).toBeInTheDocument();
    expect(screen.getByText("CRM-SP 10234")).toBeInTheDocument();
    expect(screen.getByText("R$ 250,00")).toBeInTheDocument();
  });

  it("sem children, mostra um link 'Ver horários' apontando para /medicos/:id", () => {
    renderComProviders(<MedicoCard medico={medico} />);

    const link = screen.getByRole("link", { name: /ver horários/i });
    expect(link).toHaveAttribute("href", "/medicos/7");
  });

  it("com children, renderiza o slot customizado em vez do link padrão", () => {
    const aoEscolher = vi.fn();
    renderComProviders(
      <MedicoCard medico={medico}>
        <button onClick={aoEscolher}>Escolher</button>
      </MedicoCard>
    );

    expect(screen.queryByRole("link", { name: /ver horários/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Escolher" })).toBeInTheDocument();
  });
});
