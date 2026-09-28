import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setupTests.js"],
    globals: true,
    css: false,
    // Vite 8 usa o Rolldown (bundler em Rust) por baixo do capô, que ainda
    // apresenta crashes nativos ("out of memory"/panic) quando vários
    // workers sobem em paralelo para transformar os arquivos de teste.
    // Rodar num único processo (sequencial) evita essa pressão de memória —
    // mais lento, porém estável (mesma estratégia usada no backend com
    // "jest --runInBand").
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov", "html"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/main.jsx"],
      // Sem threshold global travando o build: o enunciado exige 80% no
      // back-end (ver clique-saude-api), não no front-end. Aqui priorizamos
      // profundidade nos componentes mais interativos/críticos em vez de
      // cobertura numérica artificial em todas as páginas — ver README.
    },
  },
});
