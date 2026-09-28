function Sobre() {
  return (
    <div className="pagina">
      <div className="pagina__cabecalho">
        <h1>Sobre este projeto</h1>
        <p>Atividade Unidade 1 — Projetos e Práticas de Extensão III.</p>
      </div>

      <section className="cartao">
        <h2>O que mudou em relação ao sistema anterior</h2>
        <p>
          O Clique Saúde original (Unidade 5 da disciplina de Desenvolvimento Web) usa Flask com
          templates Jinja2 renderizados no servidor, e JavaScript solto (<code>static/js/main.js</code>)
          para chamar a API. Esta versão reconstrói o front-end como uma SPA em React: cada tela é um
          componente, a navegação usa React Router (sem recarregar a página) e o estado do usuário
          logado fica centralizado num contexto único, consumindo a mesma API REST documentada no
          sistema anterior.
        </p>
      </section>

      <section className="cartao">
        <h2>Resumo da análise de usabilidade</h2>
        <p>
          Uma análise heurística completa do sistema anterior (pontos fortes, problemas encontrados e
          recomendações) está no relatório em PDF entregue junto com esta atividade, seção
          "Boas práticas de UX/UI". Em resumo: o fluxo de agendamento em 4 etapas já é claro e bem
          desenhado, mas o sistema anterior recarrega a página inteira a cada navegação, não dá
          feedback visual de carregamento, e mistura formulário de login/cadastro na mesma tela sem
          separação clara — pontos já corrigidos nesta versão em React.
        </p>
      </section>

      <section className="cartao">
        <h2>Rotas desta aplicação</h2>
        <table className="tabela">
          <thead>
            <tr>
              <th>Rota</th>
              <th>Descrição</th>
              <th>Acesso</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>/</td><td>Página inicial</td><td>Público</td></tr>
            <tr><td>/medicos</td><td>Lista de médicos com filtro por especialidade</td><td>Público</td></tr>
            <tr><td>/medicos/:id</td><td>Detalhe do médico e seus horários fixos</td><td>Público</td></tr>
            <tr><td>/login, /cadastro</td><td>Autenticação</td><td>Público</td></tr>
            <tr><td>/agendar</td><td>Wizard de agendamento em 4 etapas</td><td>Paciente logado</td></tr>
            <tr><td>/dashboard</td><td>Painel do paciente (consultas, cancelamento)</td><td>Paciente logado</td></tr>
            <tr><td>/admin</td><td>Painel administrativo (todas as consultas)</td><td>Admin logado</td></tr>
            <tr><td>/contador</td><td>Demonstração de useState</td><td>Público</td></tr>
            <tr><td>/api-publica</td><td>Demonstração de fetch com JSONPlaceholder</td><td>Público</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Sobre;
