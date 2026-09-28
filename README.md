# Clique Saúde — React (PPE III, Atividade Unidade 1)

Evolução do front-end do **Clique Saúde** (sistema de agendamento de consultas
médicas, originalmente Flask + SQLite + HTML/JS puro) para uma SPA em React,
aplicando os conceitos da disciplina: componentização com props e children,
gerenciamento de estado, integração com API REST, boas práticas de UX/UI e
React Router.

O relatório completo (revisão do sistema anterior, roadmap e diagrama
arquitetural) está em `Relatorio_Atividade1_PPEIII.pdf`.

## Como rodar

```bash
npm install
npm run dev
```

Isso sobe dois processos ao mesmo tempo:

- **API** (json-server, simulando o backend Flask a partir de `db.json`) em `http://localhost:3001`
- **Front-end** (Vite) em `http://localhost:5173`

### Login de teste

- Paciente: `paciente@cliquesaude.com` / `123456`
- Admin: `admin@cliquesaude.com` / `admin123`

## Por que um json-server, e não o Flask real?

Esta atividade é focada em **front-end**. Em vez de simplesmente mockar dados
localmente, o `db.json` replica exatamente o schema documentado do backend
real (tabelas `usuarios`, `medicos`, `horarios_disponiveis`, `consultas`), e
`src/services/clinicaApi.js` chama os mesmos endpoints REST documentados
(`/api/medicos`, `/api/agendar`, `/api/cancelar_consulta/:id`...). Isso
significa que trocar o `BASE_URL` do serviço pela URL do Flask em produção é
o único passo necessário para a fase final do roadmap (ver relatório, Fase 6).

## Estrutura

```
src/
├── components/     → Navbar, Layout, MedicoCard, Botao, StatCard,
│                     EstadoCarregamento, RotaProtegida...
├── context/        → AuthContext (usuário logado, via useState + localStorage)
├── pages/          → Home, Medicos, MedicoDetalhe, Login, Cadastro,
│                     Agendar (wizard 4 etapas), Dashboard, Admin,
│                     Contador, ApiPublica, Sobre
├── services/       → clinicaApi.js (API do sistema) e jsonPlaceholderApi.js
│                     (API pública)
└── utils/          → formatarMoeda, hash (SHA-256 via Web Crypto)
```

## Requisitos da atividade — onde cada um foi atendido

| Requisito | Onde |
|---|---|
| Revisão do sistema anterior | PDF, seção 1 |
| Roadmap detalhado | PDF, seção 2 |
| Diagrama arquitetural | PDF, seção 3 |
| Componentes com props e children | `MedicoCard`, `Botao`, `StatCard` etc. (ver PDF, seção 4) |
| Contador com Hooks | página `/contador` |
| Integração com API pública | página `/api-publica` (JSONPlaceholder) |
| Análise de usabilidade | PDF, seção 7 |
| React Router | todas as rotas da aplicação (ver PDF, seção 8) |

## Testes de componentes (Atividade 3)

```bash
npm test              # roda toda a suíte uma vez
npm run test:watch    # modo interativo (re-roda ao salvar)
npm run test:coverage # roda a suíte e gera o relatório de cobertura
```

Stack de testes: **Vitest** (test runner, integrado ao Vite — mesma API do
Jest) + **React Testing Library** + `@testing-library/user-event`, conforme
pedido no requisito ("React Testing Library").

### O que é testado

```
tests/
├── components/
│   ├── Botao.test.jsx            → renderização, clique, estado disabled, variante
│   ├── StatCard.test.jsx         → renderização de props
│   ├── EstadoCarregamento.test.jsx → renderização condicional (spinner vs. erro)
│   ├── MedicoCard.test.jsx        → props + children (composição) + link gerado
│   ├── Navbar.test.jsx            → estado logado/deslogado, menu mobile
│   └── RotaProtegida.test.jsx     → lógica de redirecionamento (login/tipo de usuário)
├── pages/
│   ├── Contador.test.jsx          → interações de clique (useState)
│   ├── Login.test.jsx             → digitação, submit, API mockada, navegação
│   └── Medicos.test.jsx           → composição, API mockada, filtro por clique
├── testUtils.jsx                  → helper que envolve com Router + AuthProvider
└── setupTests.js
```

Os testes seguem a orientação do requisito de **testar o comportamento do
usuário, não a implementação**: interagem via `userEvent` (clique, digitação)
e verificam o que aparece na tela (`screen.getByRole`, `getByText`), nunca o
estado interno dos componentes. `services/clinicaApi.js` é sempre mockado
com `vi.mock(...)` — nenhum teste de componente depende da API rodando de
verdade.

### Cobertura de código

```
Statements : 24,23% (95/392) — mas nos arquivos com teste, entre 65% e 96%
Branches   : 25,68%
Functions  : 26,27%
Lines      : 25,07%
```

O enunciado exige cobertura mínima de 80% **no back-end**
(`clique-saude-api`, que atinge 96%); para o front-end não há um número
mínimo definido. Priorizei profundidade nos componentes mais reutilizados e
mais ricos em interação/lógica condicional (`Botao`, `MedicoCard`,
`RotaProtegida`, `Contador`, `Login`, `Medicos`) em vez de cobertura
superficial de todas as 11 páginas — em especial o wizard `Agendar.jsx`
(4 etapas, ~270 linhas) e os painéis `Admin`/`Dashboard` ficaram de fora
desta rodada por limite de tempo; são o próximo passo natural de expansão
da suíte.

## CI/CD (GitHub Actions)

Arquivo: [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Roda a cada
push/PR para `main`, em 3 jobs encadeados:

1. **test** — `npm install`, roda `npm run test:coverage` e publica a pasta
   `coverage/` como artefato do workflow.
2. **build** — `npm run build` (Vite) e publica `dist/` como artefato.
3. **deploy** (opcional, **desativado por padrão** — `if: false`) — dispara
   um deploy hook (ex: Vercel/Netlify) usando um secret do repositório. Para
   ativar: configure `VERCEL_DEPLOY_HOOK_URL` nos secrets do GitHub e troque
   a condição do job para `if: github.ref == 'refs/heads/main'`.

### Um bug real de infraestrutura, encontrado e corrigido

O pipeline não funcionou de primeira — e o processo de depurar isso é, em si,
parte do que esta atividade pede ("qualidade de software"). Registro aqui
porque é um problema real que qualquer projeto com Vite 8 pode encontrar:

1. **Sintoma**: os testes passavam sempre localmente, mas o job `test` no
   GitHub Actions (runner `ubuntu-latest`) falhava em ~2 segundos — rápido
   demais para ter rodado as 28 suítes de verdade, sinal de crash na
   inicialização, não de um teste que falhou de fato.
2. **Hipóteses testadas e descartadas**: `npm ci` vs `npm install`
   (bug clássico de `optionalDependencies` entre plataformas — não era isso,
   `npm install` sozinho não resolveu); cache do npm "contaminado" (removido,
   não resolveu).
3. **Causa raiz**: o Vite 8 usa por baixo dos panos o **Rolldown** (bundler
   em Rust, ainda em amadurecimento). O pacote nativo
   `@rolldown/binding-linux-x64-gnu` declara `"engines": {"node": "^20.19.0
   || >=22.12.0"}` — e o Node 20 disponível no runner `ubuntu-latest` estava
   abaixo desse mínimo. O binário nativo falhava ao carregar, derrubando o
   Vitest antes de qualquer teste rodar.
4. **Correção**: trocar `node-version: "20"` por `"22"` no workflow. Depois
   da troca, o job passou a rodar de verdade (7s, todos os 28 testes).
5. **Bônus de robustez**: mesmo localmente (Windows), rodar a suíte completa
   com cobertura falhava de forma intermitente (~40% das vezes) com panics
   nativos do Rolldown ("out of memory") sob paralelismo. Configurei o
   Vitest para rodar em processo único (`pool: "forks"`,
   `singleFork: true`, em `vitest.config.js`) — mais lento, mas eliminou a
   instabilidade, tanto localmente quanto no CI.
