import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthContext";
import RotaProtegida from "../../src/components/RotaProtegida";

const CHAVE = "clique-saude-usuario";

function renderComRota(tipoExigido) {
  return render(
    <MemoryRouter initialEntries={["/area-restrita"]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<p>TELA DE LOGIN</p>} />
          <Route path="/dashboard" element={<p>TELA DASHBOARD</p>} />
          <Route
            path="/area-restrita"
            element={
              <RotaProtegida tipoExigido={tipoExigido}>
                <p>CONTEÚDO PROTEGIDO</p>
              </RotaProtegida>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("RotaProtegida", () => {
  it("redireciona para /login quando não há usuário logado", () => {
    renderComRota();
    expect(screen.getByText("TELA DE LOGIN")).toBeInTheDocument();
  });

  it("mostra o conteúdo quando o usuário está logado e nenhum tipo é exigido", () => {
    localStorage.setItem(CHAVE, JSON.stringify({ id: 2, tipo: "paciente" }));
    renderComRota();
    expect(screen.getByText("CONTEÚDO PROTEGIDO")).toBeInTheDocument();
  });

  it("redireciona para /dashboard quando o tipo do usuário não é o exigido", () => {
    localStorage.setItem(CHAVE, JSON.stringify({ id: 2, tipo: "paciente" }));
    renderComRota("admin");
    expect(screen.getByText("TELA DASHBOARD")).toBeInTheDocument();
  });

  it("mostra o conteúdo quando o tipo do usuário confere com o exigido", () => {
    localStorage.setItem(CHAVE, JSON.stringify({ id: 1, tipo: "admin" }));
    renderComRota("admin");
    expect(screen.getByText("CONTEÚDO PROTEGIDO")).toBeInTheDocument();
  });
});
