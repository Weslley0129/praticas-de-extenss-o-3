import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderComProviders } from "../testUtils";
import Medicos from "../../src/pages/Medicos";

vi.mock("../../src/services/clinicaApi", () => ({
  buscarMedicos: vi.fn(),
  buscarEspecialidades: vi.fn(),
}));
import { buscarMedicos, buscarEspecialidades } from "../../src/services/clinicaApi";

const listaCompleta = [
  { id: 1, nome: "Dra. Carla Nunes", especialidade: "Cardiologia", crm: "CRM-1", valor_consulta: 250 },
  { id: 2, nome: "Dr. Bruno Alves", especialidade: "Neurologia", crm: "CRM-2", valor_consulta: 280 },
];

beforeEach(() => {
  buscarEspecialidades.mockResolvedValue(["Cardiologia", "Neurologia"]);
  buscarMedicos.mockReset();
});

describe("Página Medicos", () => {
  it("mostra 'Carregando...' e depois a lista de médicos", async () => {
    buscarMedicos.mockResolvedValue(listaCompleta);
    renderComProviders(<Medicos />, { rota: "/medicos" });

    expect(screen.getByText("Carregando médicos...")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText("Carregando médicos..."));

    expect(screen.getByRole("heading", { name: "Dra. Carla Nunes" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dr. Bruno Alves" })).toBeInTheDocument();
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    buscarMedicos.mockRejectedValue(new Error("boom"));
    renderComProviders(<Medicos />, { rota: "/medicos" });

    expect(await screen.findByText(/não foi possível carregar os médicos/i)).toBeInTheDocument();
  });

  it("refaz a busca com o filtro de especialidade ao clicar num chip", async () => {
    buscarMedicos.mockResolvedValue(listaCompleta);
    renderComProviders(<Medicos />, { rota: "/medicos" });

    await waitForElementToBeRemoved(() => screen.queryByText("Carregando médicos..."));
    expect(buscarMedicos).toHaveBeenCalledWith("Todas");

    buscarMedicos.mockResolvedValue([listaCompleta[0]]);
    await userEvent.click(await screen.findByRole("button", { name: "Cardiologia" }));

    await waitFor(() => expect(buscarMedicos).toHaveBeenLastCalledWith("Cardiologia"));
  });
});
