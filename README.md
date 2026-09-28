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
