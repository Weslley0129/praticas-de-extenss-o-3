import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import Login from "../../src/pages/Login";

// Mocka a camada de serviço: o teste de componente não deve depender de uma
// API rodando de verdade nem do fetch.
vi.mock("../../src/services/clinicaApi", () => ({
  login: vi.fn(),
}));
import { login as loginApiMock } from "../../src/services/clinicaApi";

function renderTelaLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<p>PÁGINA DO DASHBOARD</p>} />
          <Route path="/admin" element={<p>PÁGINA DO ADMIN</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  loginApiMock.mockReset();
});

describe("Página Login", () => {
  it("permite digitar nos campos de e-mail e senha", async () => {
    renderTelaLogin();

    const campoEmail = screen.getByLabelText("E-mail");
    await userEvent.clear(campoEmail);
    await userEvent.type(campoEmail, "outra@pessoa.com");

    expect(campoEmail).toHaveValue("outra@pessoa.com");
  });

  it("mostra o aviso ao clicar em 'Esqueci minha senha'", async () => {
    renderTelaLogin();

    expect(screen.queryByText(/ainda não implementada/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Esqueci minha senha" }));
    expect(screen.getByText(/ainda não implementada/i)).toBeInTheDocument();
  });

  it("exibe a mensagem de erro quando o login falha", async () => {
    loginApiMock.mockRejectedValue(new Error("E-mail ou senha inválidos."));
    renderTelaLogin();

    await userEvent.click(screen.getByRole("button", { name: "ENTRAR" }));

    expect(await screen.findByText("E-mail ou senha inválidos.")).toBeInTheDocument();
  });

  it("navega para /dashboard após login bem-sucedido de um paciente", async () => {
    loginApiMock.mockResolvedValue({ id: 2, nome: "Weslley", email: "paciente@cliquesaude.com", tipo: "paciente" });
    renderTelaLogin();

    await userEvent.click(screen.getByRole("button", { name: "ENTRAR" }));

    expect(await screen.findByText("PÁGINA DO DASHBOARD")).toBeInTheDocument();
  });

  it("navega para /admin após login bem-sucedido de um admin", async () => {
    loginApiMock.mockResolvedValue({ id: 1, nome: "Admin", email: "admin@cliquesaude.com", tipo: "admin" });
    renderTelaLogin();

    await userEvent.click(screen.getByRole("button", { name: "ENTRAR" }));

    await waitFor(() => expect(screen.getByText("PÁGINA DO ADMIN")).toBeInTheDocument());
  });
});
