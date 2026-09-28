import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "../../src/components/StatCard";

describe("StatCard", () => {
  it("exibe o rótulo e o valor recebidos via props", () => {
    render(<StatCard rotulo="Consultas agendadas" valor={12} />);

    expect(screen.getByText("Consultas agendadas")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
