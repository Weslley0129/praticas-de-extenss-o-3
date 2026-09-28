import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";

// Componentes reais dependem de rotas (react-router) e do usuário logado
// (AuthContext). Esse helper envolve o componente testado com os dois,
// como aconteceria dentro do app de verdade.
export function renderComProviders(ui, { rota = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
